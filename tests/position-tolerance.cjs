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

test('Inverted raw top 68 becomes 32; bottom 33 is within reporting tolerance', () => {
  const { card } = fixture(68, 33, true);
  assert.equal(card.errorText(), '');
});
test('A larger reported overlap remains an error', () => {
  const { card } = fixture(68, 34, true);
  assert.match(card.errorText(), /overlap/);
});
test('Missing positions remain an error', () => {
  const { card } = fixture();
  delete card._hass.states['cover.top'];
  assert.match(card.errorText(), /does not exist/);
});
test('Unavailable covers remain an error', () => {
  const { card, update } = fixture();
  update('top', 100, 'unavailable');
  assert.match(card.errorText(), /unavailable/);
});
test('One-point target discrepancy counts as arrived', () => {
  const { card, update, advance } = fixture(20, 0);
  card.remember('top', 50); update('top', 49); card.reconcile(); advance(9000);
  assert.equal(card.session.targets['cover.top'], undefined);
  assert.equal(card.errorText(), '');
});
test('One-point overshoot also counts as arrived', () => {
  const { card, update, advance } = fixture(20, 0);
  card.remember('top', 50); update('top', 51); card.reconcile(); advance(120000);
  assert.equal(card.session.targets['cover.top'], undefined);
  assert.equal(card.errorText(), '');
});
test('A moving cover within tolerance is tracked until it stops', () => {
  const { card, update, advance } = fixture(20, 0);
  card.remember('top', 50); update('top', 49, 'opening'); card.reconcile(); advance(9000);
  assert.ok(card.session.targets['cover.top']);
  update('top', 49); card.reconcile();
  assert.equal(card.session.targets['cover.top'], undefined);
  assert.equal(card.errorText(), '');
});
test('Inverted motor uses the same arrival tolerance', () => {
  const { card, update, advance } = fixture(80, 0, true);
  card.remember('top', 50); update('top', 51); card.reconcile(); advance(9000);
  assert.equal(card.session.targets['cover.top'], undefined);
  assert.equal(card.errorText(), '');
});
test('Timeout accepts a report within one point even without an intermediate update', () => {
  const { card, update, advance } = fixture(20, 0);
  card.remember('top', 50); update('top', 49); advance(120000);
  assert.equal(card.errorText(), '');
});
test('A genuine stopped-short report still fails', () => {
  const { card, update, advance } = fixture(20, 0);
  card.remember('top', 50); update('top', 48); card.reconcile(); advance(120000);
  assert.equal(card.session.error.items[0].reason, 'motion_timeout');
});
test('A target with no updates fails after two minutes', () => {
  const { card, advance } = fixture(20, 0);
  card.remember('top', 50); advance(119999);
  assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason, 'motion_timeout');
});
test('Command boundaries still prevent a requested rail crossing', () => {
  const { card } = fixture(60, 40);
  assert.equal(card.limit('top', 39), 40);
  assert.equal(card.limit('bottom', 61), 60);
});
test('Reporting tolerance does not allow sending crossed rail targets', () => {
  const { card } = fixture(60, 40);
  let calls = 0;
  card.runCommands = () => { calls++; };
  card.sendPair(32, 33);
  assert.equal(calls, 0);
  assert.equal(Object.keys(card.session.targets).length, 0);
});


// These tests exercise the pending-position lifecycle with simulated HA reports.
test('Sequential rail requests keep both targets visible past 800ms', async () => {
  const {card,advance}=fixture(50,0);
  card._hass.callService=async()=>{};
  await card.send('top',100);advance(1000);
  assert.equal(card.displayPositions().top,100);
  assert.equal(card.limit('bottom',100),100);
  await card.send('bottom',100);advance(1000);
  assert.equal(card.displayPositions().top,100);
  assert.equal(card.displayPositions().bottom,100);
});
test('Starting a second gesture preserves the first rail target', () => {
  const {card}=fixture(50,0);
  card.remember('top',100);
  card.beginEdgeDrag('bottom',1,100);card.moveEdgeDrag(80);
  assert.equal(card.displayPositions().top,100);
  assertPair(card.drag.positions,100,80);
});
test('A partial report keeps the target visible without extending its deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',70);card.reconcile();advance(25000);
  assert.equal(card.displayPositions().top,100);
  assert.equal(card.session.error,'');advance(70000);
  assert.equal(card.displayPositions().top,70);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('An unrelated attribute update does not extend the deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',50);card._hass.states['cover.top'].attributes.friendly_name='Renamed';card.reconcile();advance(95000);
  assert.equal(card.session.targets['cover.top'],undefined);
});
test('A moving/stopped state transition does not extend the deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',50,'opening');card.reconcile();advance(25000);
  assert.ok(card.session.targets['cover.top']);
  update('top',50);card.reconcile();advance(69999);
  assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('A moving cover at target still needs a stopped report', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);update('top',100,'opening');card.reconcile();advance(120000);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('Continuous changes cannot extend the two-minute maximum', () => {
  const {card,update,advance}=fixture(0,0);
  card.remember('top',100);
  for(let value=10;value<=50;value+=10){advance(20000);update('top',value,'opening');card.reconcile();}
  advance(19999);assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('The two rails have independent command deadlines', () => {
  const {card,advance}=fixture(50,0);
  card.remember('bottom',100);advance(25000);card.remember('top',100);advance(95000);
  assert.ok(card.session.targets['cover.top']);assert.equal(card.session.targets['cover.bottom'],undefined);
  assert.equal(card.session.error.items[0].id,'cover.bottom');
});
test('Replacement target cancels the old deadlines', () => {
  const {card,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);card.remember('top',80);advance(5000);
  assert.equal(card.displayPositions().top,80);assert.equal(card.session.error,'');
  advance(115000);assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('Unavailable reports discard pending visualization and timers', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);update('top',50,'unavailable');card.reconcile();advance(120000);
  assert.equal(card.displayPositions().top,null);assert.equal(card.session.error,'');
  assert.match(card.errorText(),/unavailable/);
});
test('Stop removes both targets and returns to reported positions', async () => {
  const {card,advance}=fixture(50,0);
  card._hass.callService=async()=>{};
  card.remember('top',100);card.remember('bottom',100);await card.stopCovers();advance(120000);
  assert.equal(card.displayPositions().top,50);assert.equal(card.displayPositions().bottom,0);
  assert.equal(card.session.error,'');
});
test('A rejected command removes its pending target and timers', async () => {
  const {card,advance}=fixture(50,0);
  card._hass.callService=async()=>{throw new Error('rejected');};
  await card.send('top',100);advance(120000);
  assert.equal(card.displayPositions().top,50);
  assert.equal(card.session.error.items[0].reason,'set_failed');
});
test('A delayed command failure cannot delete a replacement target', async () => {
  const {card}=fixture(50,0);let reject;
  card._hass.callService=()=>new Promise((_,fail)=>{reject=fail;});
  const pending=card.send('top',100);await Promise.resolve();
  card.remember('top',80);reject(new Error('old request rejected'));await pending;
  assert.equal(card.displayPositions().top,80);
});
test('Dashboard and popup share the same pending drawing', () => {
  const {card}=fixture(50,0);const popup=Object.create(Object.getPrototypeOf(card));
  Object.assign(popup,{config:card.config,session:card.session,_hass:card._hass,setup:false,render:()=>{}});
  card.session.cards.add(popup);card.remember('top',100);
  assert.equal(popup.displayPositions().top,100);
  assert.equal(popup.limit('bottom',100),100);
});
test('An inverted pending target is drawn and sent in the right coordinate system', async () => {
  const {card,update}=fixture(50,0,true);let sent;
  card._hass.callService=async(domain,service,data)=>{sent=data.position;};
  await card.send('top',100);
  assert.equal(sent,0);assert.equal(card.displayPositions().top,100);
  update('top',1);card.reconcile();assert.equal(card.displayPositions().top,99);
  assert.equal(card.session.targets['cover.top'],undefined);
});
test('Paired targets are published atomically to observers', async () => {
  const {card}=fixture(100,80);const observed=[];
  card.render=()=>observed.push(card.displayPositions());card._hass.callService=async()=>{};
  await card.sendPair(30,20);
  assert.ok(observed.every(p=>p.top>=p.bottom));
  assert.equal(card.displayPositions().top,30);assert.equal(card.displayPositions().bottom,20);
});

test('An early bottom-arrival report does not create a stale overlap error', () => {
  const {card,update}=fixture(50,0);
  card.remember('top',100);card.remember('bottom',100);
  update('bottom',100);card.reconcile();
  assert.equal(card.displayPositions().top,100);assert.equal(card.displayPositions().bottom,100);
  assert.equal(card.errorText(),'');
  update('top',100);card.reconcile();assert.equal(card.errorText(),'');
});
test('Expiry clears its original session after the card changes configuration', () => {
  const {card,advance}=fixture(50,0);const original=card.session;
  card.remember('top',100);
  card.session={targets:{},commands:{},cards:new Set(),error:''};
  advance(120000);
  assert.equal(original.targets['cover.top'],undefined);
  assert.equal(original.error.items[0].reason,'motion_timeout');
  assert.equal(card.session.error,'');
});
test('Command failure clears its original session after configuration changes', async () => {
  const {card}=fixture(50,0);const original=card.session;let reject;
  card._hass.callService=()=>new Promise((_,fail)=>{reject=fail;});
  const pending=card.send('top',100);await Promise.resolve();
  card.session={targets:{},commands:{},cards:new Set(),error:''};card.config={...card.config};
  reject(new Error('rejected'));await pending;
  assert.equal(original.targets['cover.top'],undefined);
  assert.equal(original.error.items[0].reason,'set_failed');
  assert.equal(card.session.error,'');
});

test('An out-of-order report cannot change the target or extend its deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(20000);update('top',70);card.reconcile();advance(20000);
  update('top',60);card._hass.states['cover.top'].last_updated='0000000001';card.reconcile();advance(79999);
  assert.equal(card.displayPositions().top,100);advance(1);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('An acknowledgement timeout retains uncertain targets until movement expiry', async () => {
  const {card,advance}=fixture(50,0);
  card._hass.callService=()=>new Promise(()=>{});
  const pending=card.send('top',100);advance(15000);await pending;
  assert.equal(card.session.error.items[0].reason,'ack_timeout');
  assert.equal(card.displayPositions().top,100);
  advance(105000);assert.equal(card.displayPositions().top,50);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('Logged 62/67-second sparse Office movements finish without an error',()=>{
  for(const [start,target,travel] of [[100,0,62000],[0,82,67000]]){
    const {card,update,advance}=fixture(100,start);
    card.remember('bottom',target);advance(5000);
    update('bottom',start,target>start?'opening':'closing');card.reconcile();
    advance(travel-5000);
    assert.ok(card.session.targets['cover.bottom']);assert.equal(card.errorText(),'');
    update('bottom',target);card.reconcile();
    assert.equal(card.session.targets['cover.bottom'],undefined);assert.equal(card.errorText(),'');
  }
});
test('Late arrival clears a movement-timeout error and its projected target stays removed',()=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',50);advance(120000);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
  assert.equal(card.displayPositions().top,20);
  update('top',49);card.reconcile();
  assert.equal(card.errorText(),'');assert.equal(card.session.targets['cover.top'],undefined);
});
test('Late arrival clears only the matching rail timeout and preserves other command errors',()=>{
  const {card,update,advance}=fixture(100,0);
  card.remember('top',80);card.remember('bottom',80);advance(120000);
  card.session.error.items.push({id:'cover.bottom',reason:'set_failed'});
  update('top',80);card.reconcile();
  assert.equal(card.session.error.items.length,2);
  assert.ok(card.session.error.items.every(item=>item.id==='cover.bottom'));
  update('bottom',80);card.reconcile();
  assert.equal(card.session.error.items.length,1);
  assert.equal(card.session.error.items[0].reason,'set_failed');
});
test('A moving, short or unavailable late report cannot clear a timeout',()=>{
  const {card,update,advance}=fixture(20,0);
  card.remember('top',50);advance(120000);
  for(const [position,state] of [[48,'open'],[50,'opening'],[50,'unavailable']]){
    update('top',position,state);card.reconcile();
    assert.equal(card.session.error.items[0].reason,'motion_timeout');
  }
  update('top',50);card.reconcile();assert.equal(card.errorText(),'');
});
test('Late arrival uses raw coordinates for an inverted top rail',()=>{
  const {card,update,advance}=fixture(90,0,true);
  card.remember('top',80);advance(120000);
  assert.equal(card.session.error.items[0].target,20);
  update('top',21);card.reconcile();assert.equal(card.errorText(),'');
});
test('A stale report cannot clear a timeout and a replacement target supersedes recovery',async()=>{
  const {card,update,advance}=fixture(20,0);
  card._hass.callService=async()=>{};
  card.remember('top',50);advance(60000);update('top',30);card.reconcile();advance(60000);
  update('top',50);card._hass.states['cover.top'].last_updated='0000000001';card.reconcile();
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
  await card.send('top',80);
  update('top',50);card.reconcile();
  assert.equal(card.displayPositions().top,80);assert.equal(card.session.error,'');
});
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
test('Bottom pointer drag reverses a push back to the top rail origin before release',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();
  bottomHandle.emit('pointerdown');
  bottomHandle.emit('pointermove',{clientY:25});
  assertPair(card.drag.positions,75,75);assert.equal(calls.length,0);
  bottomHandle.emit('pointermove',{clientY:40});
  assertPair(card.drag.positions,60,60);assert.equal(calls.length,0);
  bottomHandle.emit('pointermove',{clientY:70});
  assertPair(card.drag.positions,50,30);assert.equal(calls.length,0);
  await bottomHandle.emit('pointerup');
  assertPair(card.displayPositions(),50,30);
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.bottom');
  assert.equal(calls[0].position,30);
});
test('Top pointer drag reverses a push back to the bottom rail origin before release',async()=>{
  const {card,calls,topHandle}=gestureFixture(100,50);
  topHandle.emit('pointerdown');topHandle.emit('pointermove',{clientY:175});
  assertPair(card.drag.positions,25,25);
  topHandle.emit('pointermove',{clientY:160});assertPair(card.drag.positions,40,40);
  topHandle.emit('pointermove',{clientY:125});assertPair(card.drag.positions,75,50);
  assert.equal(calls.length,0);await topHandle.emit('pointerup');
  assertPair(card.displayPositions(),75,50);
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.top');assert.equal(calls[0].position,75);
});
test('Returning a pushed drag to its start sends no commands',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});
  assertPair(card.drag.positions,80,80);
  bottomHandle.emit('pointermove',{clientY:100});assertPair(card.drag.positions,50,0);
  await bottomHandle.emit('pointerup');
  assert.equal(calls.length,0);assertPair(card.displayPositions(),50,0);
});
test('Reversing a push preserves a restored pending rail and its original deadline',async()=>{
  const {card,calls,advance,bottomHandle}=gestureFixture();card.remember('top',60);
  const existing=card.session.targets['cover.top'];advance(20000);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});
  assertPair(card.drag.positions,80,80);
  bottomHandle.emit('pointermove',{clientY:70});assertPair(card.drag.positions,60,30);
  await bottomHandle.emit('pointerup');
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.bottom');
  assert.equal(card.session.targets['cover.top'],existing);
  advance(100000);assert.equal(card.session.targets['cover.top'],undefined);
  assert.ok(card.session.targets['cover.bottom']);
});
test('A new gesture restores to previously committed targets rather than older reports',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});
  await bottomHandle.emit('pointerup');assertPair(card.displayPositions(),80,80);
  const committedTop=card.session.targets['cover.top'];
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:80});
  assertPair(card.drag.positions,100,100);
  bottomHandle.emit('pointermove',{clientY:140});assertPair(card.drag.positions,80,40);
  await bottomHandle.emit('pointerup');
  assert.equal(calls.length,3);assert.equal(calls[2].entity_id,'cover.bottom');assert.equal(calls[2].position,40);
  assert.equal(card.session.targets['cover.top'],committedTop);assertPair(card.displayPositions(),80,40);
});
test('Pushing bottom all the way up requests both rails at100 within bounds',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:-500});
  assertPair(card.drag.positions,100,100);await bottomHandle.emit('pointerup');
  assert.ok(calls.every(call=>call.position===100));assertPair(card.displayPositions(),100,100);
});
test('Pushing top all the way down requests both rails at0 within bounds',async()=>{
  const {card,calls,topHandle}=gestureFixture(100,50);
  topHandle.emit('pointerdown');topHandle.emit('pointermove',{clientY:500});
  assertPair(card.drag.positions,0,0);await topHandle.emit('pointerup');
  assert.ok(calls.every(call=>call.position===0));assertPair(card.displayPositions(),0,0);
});
test('Cancelling a pushed preview sends no commands and preserves existing targets',()=>{
  const {card,calls,bottomHandle}=gestureFixture();card.remember('top',60);
  const existing=card.session.targets['cover.top'];
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});
  assertPair(card.drag.positions,80,80);bottomHandle.emit('pointercancel');
  assert.equal(card.drag,null);assert.equal(calls.length,0);
  assertPair(card.displayPositions(),60,0);assert.equal(card.session.targets['cover.top'],existing);
});
test('Expanded touch grip follows the same push and release handlers',async()=>{
  const {card,calls,track,bottomHandle}=gestureFixture();
  track.emit('pointerdown',{pointerType:'touch',clientY:127});
  assert.equal(card.drag.side,'bottom');assert.equal(bottomHandle.captured,1);
  bottomHandle.emit('pointermove',{pointerType:'touch',clientY:27});
  assertPair(card.drag.positions,100,100);assert.equal(calls.length,0);
  await bottomHandle.emit('pointerup',{pointerType:'touch',clientY:27});
  assertPair(card.displayPositions(),100,100);assert.equal(calls.length,2);
});
test('Moving away from the other rail sends only the dragged rail',async()=>{
  const {calls,bottomHandle}=gestureFixture(80,40);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:120});
  await bottomHandle.emit('pointerup');
  assert.equal(calls.length,1);assert.equal(calls[0].entity_id,'cover.bottom');assert.equal(calls[0].position,20);
});
test('An unchanged pending rail keeps its original movement deadline',async()=>{
  const {card,calls,advance,bottomHandle}=gestureFixture();card.remember('top',100);
  const existing=card.session.targets['cover.top'];advance(20000);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:20});
  await bottomHandle.emit('pointerup');
  assert.equal(calls.length,1);assert.equal(card.session.targets['cover.top'],existing);
  advance(100000);assert.equal(card.session.targets['cover.top'],undefined);
  assert.ok(card.session.targets['cover.bottom']);
});
test('Telemetry during a drag does not replace its pending-position snapshot',()=>{
  const {card,update,bottomHandle}=gestureFixture();card.remember('top',80);
  bottomHandle.emit('pointerdown');update('top',100);card.reconcile();
  bottomHandle.emit('pointermove',{clientY:30});assertPair(card.drag.positions,80,70);
});
test('A pushed pair converts inverted motor positions only when sending',async()=>{
  const {card,calls,bottomHandle}=gestureFixture(50,0,true);
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:0});
  await bottomHandle.emit('pointerup');
  assertPair(card.displayPositions(),100,100);
  assert.equal(calls.find(call=>call.entity_id==='cover.top').position,0);
  assert.equal(calls.find(call=>call.entity_id==='cover.bottom').position,100);
});
test('Keyboard End and Home push the blocking rail in either direction',async()=>{
  const up=gestureFixture();await up.bottomHandle.emit('keydown',{key:'End'});
  assertPair(up.card.displayPositions(),100,100);assert.equal(up.calls.length,2);
  const down=gestureFixture(100,50);await down.topHandle.emit('keydown',{key:'Home'});
  assertPair(down.card.displayPositions(),0,0);assert.equal(down.calls.length,2);
});
test('No-op handle release does not send or restart a pending target',async()=>{
  const {card,calls,bottomHandle}=gestureFixture();card.remember('top',80);
  const existing=card.session.targets['cover.top'];
  bottomHandle.emit('pointerdown');await bottomHandle.emit('pointerup');
  assert.equal(calls.length,0);assert.equal(card.session.targets['cover.top'],existing);
});
test('All pushed targets are published together to shared observers',async()=>{
  const {card,bottomHandle}=gestureFixture();const observed=[];
  card.render=()=>{if(!card.drag)observed.push(card.displayPositions());};
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:0});await bottomHandle.emit('pointerup');
  assert.ok(observed.length>0);assert.ok(observed.every(p=>p.top===100 && p.bottom===100));
});
test('A partial pushed-pair failure is attributed to the rejected rail',async()=>{
  const {card,bottomHandle}=gestureFixture();
  card._hass.callService=async(domain,service,data)=>{if(data.entity_id==='cover.top')throw new Error('rejected');};
  bottomHandle.emit('pointerdown');bottomHandle.emit('pointermove',{clientY:0});await bottomHandle.emit('pointerup');
  assert.equal(card.session.targets['cover.top'],undefined);assert.ok(card.session.targets['cover.bottom']);
  assert.equal(card.session.error.items[0].id,'cover.top');assert.equal(card.session.error.items[0].reason,'set_failed');
  assert.equal(card.session.error.acceptedOther,true);
});
test('Central fabric dragging still preserves coverage and sends on release',async()=>{
  const {card,calls,track}=gestureFixture(60,20);
  track.emit('pointerdown',{clientY:70});track.emit('pointermove',{clientY:50});
  assertPair(card.drag.positions,80,40);assert.equal(calls.length,0);
  await track.emit('pointerup',{clientY:50});
  assertPair(card.displayPositions(),80,40);assert.equal(calls.length,2);
});

test('An untouched grip does not correct a tolerated rounded overlap or new telemetry',async()=>{
  const {card,calls,topHandle,update}=gestureFixture(32,33);
  topHandle.emit('pointerdown');update('top',40);card.reconcile();await topHandle.emit('pointerup');
  assert.equal(calls.length,0);assert.equal(card.drag,null);
});
test('Cancelling an expanded touch-grip push discards only the preview',()=>{
  const {card,calls,track,bottomHandle}=gestureFixture();
  track.emit('pointerdown',{pointerType:'touch',clientY:127});
  bottomHandle.emit('pointermove',{pointerType:'touch',clientY:27});bottomHandle.emit('pointercancel');
  assert.equal(calls.length,0);assert.equal(card.drag,null);assertPair(card.displayPositions(),50,0);
});

(async()=>{
  for(const {name,run} of cases){
    try { await run();console.log('PASS '+name); }
    catch(error){failures++;console.log('FAIL '+name+': '+error.stack);}
  }
  if(failures)process.exitCode=1;
})();
