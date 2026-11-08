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
  card.remember('top', 50); update('top', 48); card.reconcile(); advance(30000);
  assert.equal(card.session.error.items[0].reason, 'not_reached');
});
test('A target with no updates fails after 30 seconds', () => {
  const { card, advance } = fixture(20, 0);
  card.remember('top', 50); advance(29999);
  assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason, 'not_reached');
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
  const start=card.displayPositions().bottom;
  card.drag={side:'bottom',start,value:80};
  assert.equal(card.displayPositions().top,100);
  assert.equal(card.limit('bottom',card.drag.value),80);
});
test('A partial report keeps the target visible and extends its deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',70);card.reconcile();advance(25000);
  assert.equal(card.displayPositions().top,100);
  assert.equal(card.session.error,'');advance(5000);
  assert.equal(card.displayPositions().top,70);
  assert.equal(card.session.error.items[0].reason,'not_reached');
});
test('An unrelated attribute update does not extend the deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',50);card._hass.states['cover.top'].attributes.friendly_name='Renamed';card.reconcile();advance(5000);
  assert.equal(card.session.targets['cover.top'],undefined);
});
test('A moving/stopped state transition extends the deadline', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);
  update('top',50,'opening');card.reconcile();advance(25000);
  assert.ok(card.session.targets['cover.top']);
  update('top',50);card.reconcile();advance(29999);
  assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason,'not_reached');
});
test('A moving cover at target still needs a stopped report', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);update('top',100,'opening');card.reconcile();advance(30000);
  assert.equal(card.session.error.items[0].reason,'not_reached');
});
test('Continuous changes cannot extend the two-minute maximum', () => {
  const {card,update,advance}=fixture(0,0);
  card.remember('top',100);
  for(let value=10;value<=50;value+=10){advance(20000);update('top',value,'opening');card.reconcile();}
  advance(19999);assert.ok(card.session.targets['cover.top']);advance(1);
  assert.equal(card.session.error.items[0].reason,'motion_timeout');
});
test('The two rails have independent inactivity deadlines', () => {
  const {card,update,advance}=fixture(50,0);
  card.remember('top',100);card.remember('bottom',100);advance(25000);
  update('top',70);card.reconcile();advance(5000);
  assert.ok(card.session.targets['cover.top']);assert.equal(card.session.targets['cover.bottom'],undefined);
  assert.equal(card.session.error.items[0].id,'cover.bottom');
});
test('Replacement target cancels the old deadlines', () => {
  const {card,advance}=fixture(50,0);
  card.remember('top',100);advance(25000);card.remember('top',80);advance(5000);
  assert.equal(card.displayPositions().top,80);assert.equal(card.session.error,'');
  advance(25000);assert.equal(card.session.error.items[0].reason,'not_reached');
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
  advance(30000);
  assert.equal(original.targets['cover.top'],undefined);
  assert.equal(original.error.items[0].reason,'not_reached');
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
  update('top',60);card._hass.states['cover.top'].last_updated='0000000001';card.reconcile();advance(9999);
  assert.equal(card.displayPositions().top,100);advance(1);
  assert.equal(card.session.error.items[0].reason,'not_reached');
});
test('An acknowledgement timeout retains uncertain targets until inactivity expiry', async () => {
  const {card,advance}=fixture(50,0);
  card._hass.callService=()=>new Promise(()=>{});
  const pending=card.send('top',100);advance(15000);await pending;
  assert.equal(card.session.error.items[0].reason,'ack_timeout');
  assert.equal(card.displayPositions().top,100);
  advance(15000);assert.equal(card.displayPositions().top,50);
  assert.equal(card.session.error.items[0].reason,'not_reached');
});
(async()=>{
  for(const {name,run} of cases){
    try { await run();console.log('PASS '+name); }
    catch(error){failures++;console.log('FAIL '+name+': '+error.stack);}
  }
  if(failures)process.exitCode=1;
})();
