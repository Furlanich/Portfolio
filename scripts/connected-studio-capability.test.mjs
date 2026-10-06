import test from 'node:test';
import assert from 'node:assert/strict';

const { CONNECTED_LIVE_POLICY, chooseConnectedMode } = await import('../lib/connected-studio/capability.ts');

const ELIGIBLE = Object.freeze({
  reducedMotion: false,
  saveData: false,
  webgl2: true,
  softwareRenderer: false,
  sessionContextLost: false,
  loaded: true,
  visible: true,
  tier: 'wide',
  livePolicy: Object.freeze({ wide: true, compact: true }),
});

function gate(overrides = {}) {
  return chooseConnectedMode({ ...ELIGIBLE, ...overrides });
}

test('an eligible visitor on a policy-enabled tier gets the live scene', () => {
  for (const tier of ['wide', 'tablet', 'compact']) assert.equal(gate({ tier }), 'webgl', tier);
});

test('the shipped live policy keeps every tier static until hardware evidence enables it', () => {
  assert.deepEqual({ ...CONNECTED_LIVE_POLICY }, { wide: false, compact: false });
  assert.ok(Object.isFrozen(CONNECTED_LIVE_POLICY), 'the shipped policy is immutable');
  for (const tier of ['wide', 'tablet', 'compact']) {
    assert.equal(gate({ tier, livePolicy: CONNECTED_LIVE_POLICY }), 'static', `${tier} must stay static under the shipped policy`);
  }
});

test('a false live policy keeps its tier static: wide covers wide and tablet, compact covers compact', () => {
  const cases = [
    ['wide', { wide: false, compact: true }, 'static'],
    ['tablet', { wide: false, compact: true }, 'static'],
    ['compact', { wide: true, compact: false }, 'static'],
    ['wide', { wide: true, compact: false }, 'webgl'],
    ['tablet', { wide: true, compact: false }, 'webgl'],
    ['compact', { wide: false, compact: true }, 'webgl'],
  ];
  for (const [tier, livePolicy, expected] of cases) {
    assert.equal(gate({ tier, livePolicy }), expected, `${tier} with ${JSON.stringify(livePolicy)}`);
  }
});

test('every failed gate keeps the complete static background', () => {
  for (const overrides of [
    { reducedMotion: true },
    { saveData: true },
    { webgl2: false },
    { softwareRenderer: true },
    { sessionContextLost: true },
    { loaded: false },
    { visible: false },
  ]) {
    assert.equal(gate(overrides), 'static', JSON.stringify(overrides));
  }
});

test('the gate fails closed on an unknown tier, a missing policy or a value that is not a strict boolean', () => {
  for (const tier of ['phablet', '', undefined, null, 'constructor', '__proto__']) {
    assert.equal(gate({ tier }), 'static', `tier ${String(tier)}`);
  }
  for (const livePolicy of [undefined, null, {}, { wide: 'yes', compact: 'yes' }, { wide: 1, compact: 1 }]) {
    assert.equal(gate({ livePolicy }), 'static', `policy ${JSON.stringify(livePolicy)}`);
  }
  for (const key of ['reducedMotion', 'saveData', 'softwareRenderer', 'sessionContextLost']) {
    for (const value of [undefined, null, 0, '', 'false']) assert.equal(gate({ [key]: value }), 'static', `${key}=${String(value)}`);
  }
  for (const key of ['webgl2', 'loaded', 'visible']) {
    for (const value of [undefined, null, 1, 'true']) assert.equal(gate({ [key]: value }), 'static', `${key}=${String(value)}`);
  }
  assert.equal(chooseConnectedMode(undefined), 'static', 'a missing input is static, never a throw');
  assert.equal(chooseConnectedMode({}), 'static');
});
