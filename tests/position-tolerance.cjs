const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = globalThis.CARD_SOURCE ?? fs.readFileSync(path.join(__dirname, '..', 'dual-cover-card.js'), 'utf8');
let failures = 0;
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
function test(name, run) {
  try { run(); console.log('PASS ' + name); }
  catch (error) { failures++; console.log('FAIL ' + name + ': ' + error.message); }
}

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
  card.remember('top', 50); update('top', 48); card.reconcile(); advance(9000);
  assert.equal(card.session.error.items[0].reason, 'not_reached');
});
test('Target tracking still has a motion timeout', () => {
  const { card, advance } = fixture(20, 0);
  card.remember('top', 50); advance(120000);
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
if (failures) process.exitCode = 1;
