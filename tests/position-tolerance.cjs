const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = globalThis.CARD_SOURCE ?? fs.readFileSync(path.join(__dirname, '..', 'dual-cover-card.js'), 'utf8');
let failures = 0;
const cases=[];
function fixture(top = 100, bottom = 0, invertTop = false) {
  let now = 0, nextId = 0;
  const timers = new Map(), classes = new Map();
  const context = {
    HTMLElement: class {}, window: {}, console,
    customElements: { get: name => classes.get(name), define: (name, value) => classes.set(name, value) },
    Date: class extends Date { static now() { return now; } },
    setTimeout(fn, delay) { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  vm.runInNewContext(source, context);
  const card = Object.create(classes.get('dual-cover-card').prototype);
  card.config = { top_entity: 'cover.top', bottom_entity: 'cover.bottom', invert_top: invertTop, invert_bottom: false };
  card.setup = false;
  card.operation = 0;
  card.session = { targets: {}, commands: {}, cards: new Set([card]), error: '' };
  card.render = () => {};
  card._hass = { states: {}, locale: { language: 'en' } };
  function update(side, value, state = 'open') {
    card._hass.states['cover.' + side] = { state, attributes: { current_position: value }, last_updated: String(now).padStart(10, '0') };
  }
  function advance(ms) {
    const end = now + ms;
    while (true) {
      const entry = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      timers.delete(entry[0]); now = entry[1].at; entry[1].fn();
    }
    now = end;
  }
  update('top', top); update('bottom', bottom);
  return { card, update, advance };
}
function test(name, run) { cases.push({name,run}); }

// Capture the real handlers without creating a browser or contacting HA.
function gestureFixture(top=50,bottom=0,invertTop=false) {
  const result=fixture(top,bottom,invertTop),{card}=result,calls=[];
  function element() {
    const listeners={};
    return {listeners,captured:null,
      addEventListener(type,handler){listeners[type]=handler;},
      setPointerCapture(id){this.captured=id;},
      getBoundingClientRect(){return {top:0,left:0,right:100,bottom:136,width:100,height:136};},
      emit(type,detail={}){return listeners[type]({pointerId:1,button:0,pointerType:'mouse',clientX:50,clientY:100,
        preventDefault(){},composedPath(){return [];},...detail});}
    };
  }
  const elements={'.top':element(),'.bottom':element(),'.window':element()};
  card.shadowRoot={querySelector:selector=>elements[selector]};
  card._hass.callService=async(domain,service,data)=>{calls.push({service,...data});};
  card.bindEdgeHandle('top');card.bindEdgeHandle('bottom');card.bindTrackTap();
  return {...result,calls,topHandle:elements['.top'],bottomHandle:elements['.bottom'],track:elements['.window']};
}
function assertPair(p,top,bottom) {assert.equal(p.top,top);assert.equal(p.bottom,bottom);}

// Current behavior contracts. Table rows are named so failures stay specific.
async function each(rows,run) {
  for(const [label,...args] of rows){
    try {await run(...args);}
    catch(error){throw new Error(label+': '+error.message,{cause:error});}
  }
}

test('Invalid or unavailable reported positions are not usable controls',()=>each([
  ['missing entity',undefined,'open',/does not exist/,true],
  ['unavailable',50,'unavailable',/unavailable/],
  ['unknown',50,'unknown',/valid position/],
  ['missing position',undefined,'open',/valid position/],
  ['NaN',NaN,'open',/valid position/],
  ['below range',-1,'open',/valid position/],
  ['above range',101,'open',/valid position/],
],(position,state,message,missing)=>{
  const {card,update}=fixture();update('top',position,state);
  if(missing)delete card._hass.states['cover.top'];
  assert.equal(card.ready(),false);assert.match(card.errorText(),message);
}));

test('Rounded overlap tolerates one point but reports larger overlap',()=>each([
  ['one-point inverted overlap',68,33,true,false],
  ['two-point inverted overlap',68,34,true,true],
],(top,bottom,inverted,error)=>{
  const {card}=fixture(top,bottom,inverted);
  assert.equal(Boolean(card.errorText()),error);
  if(error)assert.match(card.errorText(),/overlap/);
}));

test('Arrival accepts only a stopped report within one percentage point',()=>each([
  ['one point short',49,'open',true],
  ['exact target',50,'open',true],
  ['one point beyond',51,'open',true],
  ['two points short',48,'open',false],
  ['still moving',49,'opening',false],
],(position,state,arrived)=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',50);update('top',position,state);card.reconcile();
  assert.equal(Boolean(card.session.targets['cover.top']),!arrived);
  if(state==='opening'){
    update('top',position);card.reconcile();
    assert.equal(card.session.targets['cover.top'],undefined);
  }else if(!arrived){
    advance(120000);assert.equal(card.session.error.items[0].reason,'motion_timeout');
  }
}));

test('Expiry uses the latest known report even if reconciliation has not run',()=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',50);update('top',49);advance(120000);
  assert.equal(card.session.targets['cover.top'],undefined);assert.equal(card.errorText(),'');
});

test('Targets remain projected until the fixed two-minute deadline despite mixed reports',()=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',100);advance(25000);
  update('top',40,'opening');card.reconcile();advance(25000);
  update('top',40,'opening');card._hass.states['cover.top'].attributes.friendly_name='Renamed';card.reconcile();
  advance(25000);update('top',70);card.reconcile();advance(44999);
  assert.equal(card.displayPositions().top,100);assert.equal(card.session.error,'');
  advance(1);
  assert.equal(card.session.targets['cover.top'],undefined);assert.equal(card.displayPositions().top,70);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});

test('Each rail times out relative to its own command',()=>{
  const {card,advance}=fixture(50,0);
  card.remember('bottom',100);advance(25000);card.remember('top',100);advance(95000);
  assert.ok(card.session.targets['cover.top']);assert.equal(card.session.targets['cover.bottom'],undefined);
  assert.equal(card.session.error.items[0].id,'cover.bottom');
});

test('Replacing a target supersedes earlier deadlines and late-error recovery',async()=>{
  const {card,update,advance}=fixture(50,0);card._hass.callService=async()=>{};
  card.remember('top',100);advance(25000);card.remember('top',80);advance(95000);
  assert.equal(card.displayPositions().top,80);assert.equal(card.session.error,'');
  advance(25000);assert.equal(card.session.error.items[0].reason,'motion_timeout');
  await card.send('top',90);update('top',80);card.reconcile();
  assert.equal(card.displayPositions().top,90);assert.equal(card.session.error,'');
});

test('Losing a usable report discards the pending target and its timer',()=>each([
  ['unavailable','unavailable',50],['unknown','unknown',50],['missing position','open',undefined],
],(state,position)=>{
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);update('top',position,state);card.reconcile();advance(120000);
  assert.equal(card.session.targets['cover.top'],undefined);assert.equal(card.displayPositions().top,null);
  assert.equal(card.session.error,'');assert.notEqual(card.errorText(),'');
}));

test('Stop remains usable during a request and discards targets and gestures',async()=>{
  const {card,calls,advance}=gestureFixture();
  card.remember('top',100);card.remember('bottom',100);card.beginEdgeDrag('bottom',1,100);
  card.busy=true;await card.stopCovers();advance(120000);
  assert.equal(card.drag,null);assertPair(card.displayPositions(),50,0);assert.equal(card.session.error,'');
  assert.equal(calls.length,2);assert.ok(calls.every(call=>call.service==='stop_cover'));
});

test('Explicit rejection clears only rejected targets and preserves its error',()=>each([
  ['single request',false],['one motor in a pushed pair',true],
],async paired=>{
  const {card,advance,bottomHandle}=gestureFixture();
  card._hass.callService=async(domain,service,data)=>{if(data.entity_id==='cover.top')throw new Error('rejected');};
  if(paired){bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:0});await bottomHandle.emit('pointerup');}
  else await card.send('top',100);
  assert.equal(card.session.targets['cover.top'],undefined);
  assert.equal(Boolean(card.session.targets['cover.bottom']),paired);
  assert.equal(card.session.error.items[0].id,'cover.top');assert.equal(card.session.error.items[0].reason,'set_failed');
  assert.equal(card.session.error.acceptedOther,paired);
  if(!paired){advance(120000);assert.equal(card.session.error.items[0].reason,'set_failed');}
}));

test('A delayed rejection cannot remove a newer target',async()=>{
  const {card}=fixture(50,0);let reject;
  card._hass.callService=()=>new Promise((_,fail)=>{reject=fail;});
  const pending=card.send('top',100);await Promise.resolve();
  card.remember('top',80);reject(new Error('old request rejected'));await pending;
  assert.equal(card.displayPositions().top,80);assert.equal(card.session.error,'');
});

test('Sequential requests and the popup share the same pending positions',async()=>{
  const {card,advance}=fixture(50,0);card._hass.callService=async()=>{};
  const popup=Object.create(Object.getPrototypeOf(card));
  Object.assign(popup,{config:card.config,session:card.session,_hass:card._hass,setup:false,render:()=>{}});
  card.session.cards.add(popup);
  await card.send('top',100);advance(1000);
  assert.equal(popup.displayPositions().top,100);assert.equal(popup.limit('bottom',100),100);
  await card.send('bottom',100);advance(1000);
  assertPair(card.displayPositions(),100,100);assertPair(popup.displayPositions(),100,100);
});

test('Changed targets are published as one complete pair in either direction',()=>each([
  ['upward',50,0,'bottom',0,100],['downward',100,50,'top',200,0],
],async(top,bottom,side,y,target)=>{
  const {card,topHandle,bottomHandle}=gestureFixture(top,bottom),observed=[];
  card.render=()=>{if(!card.drag)observed.push(card.displayPositions());};
  const handle=side==='top'?topHandle:bottomHandle;
  handle.emit('pointerdown');handle.emit('pointermove',{clientY:y});await handle.emit('pointerup');
  assert.ok(observed.length>0);for(const pair of observed)assertPair(pair,target,target);
}));

test('A stale report claiming arrival cannot clear an active target',()=>{
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(20000);update('top',70);card.reconcile();
  update('top',100);card._hass.states['cover.top'].last_updated='0000000001';card.reconcile();
  assert.ok(card.session.targets['cover.top']);assert.equal(card.displayPositions().top,100);
});

test('An acknowledgement timeout retains an uncertain target until movement expiry',async()=>{
  const {card,advance}=fixture(50,0);card._hass.callService=()=>new Promise(()=>{});
  const pending=card.send('top',100);advance(15000);await pending;
  assert.equal(card.session.error.items[0].reason,'ack_timeout');assert.equal(card.displayPositions().top,100);
  advance(105000);assert.equal(card.displayPositions().top,50);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});

test('Sparse 62/67-second Office movements finish without a premature error',()=>each([
  ['closing',100,0,62000],['opening',0,82,67000],
],(start,target,travel)=>{
  const {card,update,advance}=fixture(100,start);
  card.remember('bottom',target);advance(5000);
  update('bottom',start,target>start?'opening':'closing');card.reconcile();advance(travel-5000);
  assert.ok(card.session.targets['cover.bottom']);assert.equal(card.errorText(),'');
  update('bottom',target);card.reconcile();
  assert.equal(card.session.targets['cover.bottom'],undefined);assert.equal(card.errorText(),'');
}));

test('Mixed-age arrival reports do not produce a crossed-rail error',()=>{
  const {card,update}=fixture(50,0);card.remember('top',100);card.remember('bottom',100);
  update('bottom',100);card.reconcile();
  assertPair(card.displayPositions(),100,100);assert.equal(card.errorText(),'');
  update('top',100);card.reconcile();assert.equal(card.errorText(),'');
});

test('Late arrival clears only its timeout without restoring a projected target',()=>{
  const {card,update,advance}=fixture(100,0);
  card.remember('top',80);card.remember('bottom',80);advance(120000);
  assert.equal(card.displayPositions().top,100);
  card.session.error.items.push({id:'cover.bottom',reason:'set_failed'});
  update('top',79);card.reconcile();
  assert.equal(card.session.targets['cover.top'],undefined);assert.equal(card.session.error.items.length,2);
  assert.ok(card.session.error.items.every(item=>item.id==='cover.bottom'));
  update('bottom',80);card.reconcile();
  assert.equal(card.session.error.items.length,1);assert.equal(card.session.error.items[0].reason,'set_failed');
});

test('Late reports must be current, stopped and within tolerance to recover',()=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',50);advance(60000);update('top',30);card.reconcile();advance(60000);
  for(const [position,state,stale] of [[48,'open',false],[50,'opening',false],[50,'unavailable',false],[50,'open',true]]){
    update('top',position,state);if(stale)card._hass.states['cover.top'].last_updated='0000000001';
    card.reconcile();assert.equal(card.session.error.items[0].reason,'motion_timeout');
  }
  update('top',50);card.reconcile();assert.equal(card.errorText(),'');
});

test('Inverted rails convert only at the service/report boundary, including late arrival',async()=>{
  const {card,calls,update,advance,bottomHandle}=gestureFixture(50,0,true);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});await bottomHandle.emit('pointerup');
  assertPair(card.displayPositions(),80,80);
  assert.equal(calls.find(call=>call.entity_id==='cover.top').position,20);
  assert.equal(calls.find(call=>call.entity_id==='cover.bottom').position,80);
  update('top',21);update('bottom',80);card.reconcile();
  assertPair(card.displayPositions(),79,80);assert.equal(card.session.targets['cover.top'],undefined);
  await card.send('top',90);advance(120000);
  assert.equal(card.session.error.items[0].target,10);
  update('top',11);card.reconcile();assert.equal(card.errorText(),'');
});

test('Outstanding callbacks act on their original session after reconfiguration',()=>each([
  ['movement timeout',false],['command rejection',true],
],async rejected=>{
  const {card,advance}=fixture(50,0);const original=card.session;let pending,reject;
  if(rejected){
    card._hass.callService=()=>new Promise((_,fail)=>{reject=fail;});
    pending=card.send('top',100);await Promise.resolve();
  }else card.remember('top',100);
  card.session={targets:{},commands:{},cards:new Set(),error:''};card.config={...card.config};
  if(rejected){reject(new Error('rejected'));await pending;}else advance(120000);
  assert.equal(original.targets['cover.top'],undefined);
  assert.equal(original.error.items[0].reason,rejected?'set_failed':'motion_timeout');assert.equal(card.session.error,'');
}));

test('Reversing an edge push restores the other rail to its origin before release',()=>each([
  ['bottom upward',50,0,'bottom',[25,40,70],[[75,75],[60,60],[50,30]],30],
  ['top downward',100,50,'top',[175,160,125],[[25,25],[40,40],[75,50]],75],
],async(top,bottom,side,moves,previews,final)=>{
  const {card,calls,topHandle,bottomHandle}=gestureFixture(top,bottom),handle=side==='top'?topHandle:bottomHandle;
  handle.emit('pointerdown');
  for(let i=0;i<moves.length;i++){
    handle.emit('pointermove',{clientY:moves[i]});assertPair(card.drag.positions,...previews[i]);assert.equal(calls.length,0);
  }
  await handle.emit('pointerup');
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.'+side);assert.equal(calls[0].position,final);
  assertPair(card.displayPositions(),...previews.at(-1));
}));

test('No-op releases send nothing despite pending targets, rounded overlap or new telemetry',()=>each([
  ['return after pushing',true,true,false],
  ['untouched pending grip',false,true,false],
  ['untouched rounded overlap with new telemetry',false,false,true],
],async(returned,pending,newReport)=>{
  const {card,calls,update,topHandle,bottomHandle}=gestureFixture(32,33);
  if(pending)card.remember('top',80);
  const existing=card.session.targets['cover.top'],handle=returned?bottomHandle:topHandle;
  handle.emit('pointerdown');
  if(returned){handle.emit('pointermove',{clientY:0});handle.emit('pointermove',{clientY:100});}
  if(newReport){update('top',40);card.reconcile();}
  await handle.emit('pointerup');
  assert.equal(calls.length,0);assert.equal(card.drag,null);assert.equal(card.session.targets['cover.top'],existing);
}));

test('Restoring an accidentally pushed pending rail preserves its original deadline',async()=>{
  const {card,calls,advance,bottomHandle}=gestureFixture();card.remember('top',60);
  const existing=card.session.targets['cover.top'];advance(20000);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});assertPair(card.drag.positions,80,80);
  bottomHandle.emit('pointermove',{clientY:70});assertPair(card.drag.positions,60,30);await bottomHandle.emit('pointerup');
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.bottom');assert.equal(card.session.targets['cover.top'],existing);
  advance(100000);assert.equal(card.session.targets['cover.top'],undefined);assert.ok(card.session.targets['cover.bottom']);
});

test('A new gesture uses already committed targets as its baseline',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});await bottomHandle.emit('pointerup');
  assertPair(card.displayPositions(),80,80);const committedTop=card.session.targets['cover.top'];
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:80});assertPair(card.drag.positions,100,100);
  bottomHandle.emit('pointermove',{clientY:140});assertPair(card.drag.positions,80,40);await bottomHandle.emit('pointerup');
  assert.equal(calls.length,3);assert.equal(calls[2].entity_id,'cover.bottom');assert.equal(calls[2].position,40);
  assert.equal(card.session.targets['cover.top'],committedTop);
});

test('Pushing past a window end clamps both targets and dispatches the passive rail first',()=>each([
  ['top end',50,0,'bottom',-500,100,'top'],['bottom end',100,50,'top',500,0,'bottom'],
],async(top,bottom,side,y,target,first)=>{
  const {card,calls,topHandle,bottomHandle}=gestureFixture(top,bottom),handle=side==='top'?topHandle:bottomHandle;
  handle.emit('pointerdown');handle.emit('pointermove',{clientY:y});assertPair(card.drag.positions,target,target);
  await handle.emit('pointerup');assert.equal(calls.length,2);
  assert.ok(calls.every(call=>call.position===target));assert.equal(calls[0].entity_id,'cover.'+first);
}));

test('Cancelling a pushed drag discards only its preview',()=>{
  const {card,calls,bottomHandle}=gestureFixture();card.remember('top',60);
  const existing=card.session.targets['cover.top'];
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});assertPair(card.drag.positions,80,80);
  bottomHandle.emit('pointercancel');
  assert.equal(card.drag,null);assert.equal(calls.length,0);assertPair(card.displayPositions(),60,0);
  assert.equal(card.session.targets['cover.top'],existing);
});

test('Expanded touch grips route into the same release and cancellation handlers',()=>each([
  ['release',false],['cancel',true],
],async cancelled=>{
  const {card,calls,track,bottomHandle}=gestureFixture();
  track.emit('pointerdown',{pointerType:'touch',clientY:127});assert.equal(card.drag.side,'bottom');assert.equal(bottomHandle.captured,1);
  bottomHandle.emit('pointermove',{pointerType:'touch',clientY:27});assertPair(card.drag.positions,100,100);assert.equal(calls.length,0);
  await bottomHandle.emit(cancelled?'pointercancel':'pointerup',{pointerType:'touch',clientY:27});
  assertPair(card.displayPositions(),cancelled?50:100,cancelled?0:100);assert.equal(calls.length,cancelled?0:2);
}));

test('Telemetry does not change the active drag snapshot',()=>{
  const {card,update,bottomHandle}=gestureFixture();card.remember('top',80);
  bottomHandle.emit('pointerdown');update('top',100);card.reconcile();
  bottomHandle.emit('pointermove',{clientY:30});assertPair(card.drag.positions,80,70);
});

test('Keyboard edge controls push the blocking rail in either direction',()=>each([
  ['up',50,0,'bottom','End',100],['down',100,50,'top','Home',0],
],async(top,bottom,side,key,target)=>{
  const {card,calls,topHandle,bottomHandle}=gestureFixture(top,bottom);
  await (side==='top'?topHandle:bottomHandle).emit('keydown',{key});
  assertPair(card.displayPositions(),target,target);assert.equal(calls.length,2);
}));

test('Track-tap limits still clamp against the other rail rather than pushing it',()=>{
  const {card}=fixture(60,40);
  assert.equal(card.limit('top',39),40);assert.equal(card.limit('bottom',61),60);
  card.remember('top',80);card.remember('bottom',50);
  assert.equal(card.limit('top',20),50);assert.equal(card.limit('bottom',100),80);
});

test('Central fabric dragging preserves coverage and sends on release',async()=>{
  const {card,calls,track}=gestureFixture(60,20);
  track.emit('pointerdown',{clientY:70});track.emit('pointermove',{clientY:50});
  assertPair(card.drag.positions,80,40);assert.equal(calls.length,0);await track.emit('pointerup',{clientY:50});
  assertPair(card.displayPositions(),80,40);assert.equal(calls.length,2);
});

test('Invalid outgoing pairs neither publish targets nor send commands',()=>each([
  ['crossed by one point',32,33],['below window',50,-1],['above window',101,0],
  ['NaN top',NaN,0],['infinite bottom',100,Infinity],
],async(top,bottom)=>{
  const {card,calls}=gestureFixture();await card.sendPair(top,bottom);
  assert.equal(calls.length,0);assert.equal(Object.keys(card.session.targets).length,0);
}));

(async()=>{
  for(const {name,run} of cases){
    try { await run();console.log('PASS '+name); }
    catch(error){failures++;console.log('FAIL '+name+': '+error.stack);}
  }
  if(failures)process.exitCode=1;
})();
