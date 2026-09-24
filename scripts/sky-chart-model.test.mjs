import test from 'node:test';
import assert from 'node:assert/strict';

const { SKY_CHART_NODES, GROUP_REVEAL, frameForProgress, recedeFactor, labelOpacityMultiplier } =
  await import('../lib/immersive-home/sky-chart-model.ts');

const PHASE_GROUPS = ['understand', 'define', 'build-review', 'hand-over'];

function assertClose(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: expected ${expected}, got ${actual}`);
}

test('yaw combines the wide/compact offset with the scroll ramp', () => {
  assert.equal(frameForProgress(0, { width: 1440 }).yaw, 16, 'wide at t=0');
  assert.equal(frameForProgress(0, { width: 768 }).yaw, 34, 'compact at t=0');
  assert.equal(frameForProgress(1, { width: 1440 }).yaw, 162, 'wide at t=1');
});

test('group opacity reveals Define across its 0.14-wide ramp', () => {
  assert.equal(frameForProgress(0.27, { width: 1440 }).groupOpacity.define, 0, 'before the ramp starts');
  assertClose(frameForProgress(0.42, { width: 1440 }).groupOpacity.define, 1, 'after the ramp settles');
});

test('link fraction stays at its rails outside the 0.30-0.85 ramp', () => {
  assert.equal(frameForProgress(0.3, { width: 1440 }).linkFraction, 0);
  assert.equal(frameForProgress(0.1, { width: 1440 }).linkFraction, 0);
  assert.equal(frameForProgress(0.85, { width: 1440 }).linkFraction, 1);
  assert.equal(frameForProgress(1, { width: 1440 }).linkFraction, 1);
});

test('recede factor interpolates from settled to fully receded', () => {
  const vh = 900;
  assert.equal(recedeFactor(0.55 * vh, vh), 0);
  assertClose(recedeFactor(0.3 * vh, vh), 0.5, 'midpoint');
  assert.equal(recedeFactor(0.05 * vh, vh), 1);
});

test('label opacity multiplier fades to zero by k=0.5 and stays clamped', () => {
  assert.equal(labelOpacityMultiplier(0), 1);
  assert.equal(labelOpacityMultiplier(0.25), 0.5);
  assert.equal(labelOpacityMultiplier(0.5), 0);
  assert.equal(labelOpacityMultiplier(1), 0);
});

test('visible tiers narrow with viewport width', () => {
  assert.deepEqual(frameForProgress(0.5, { width: 1440 }).visibleTiers, [1, 2, 3]);
  assert.deepEqual(frameForProgress(0.5, { width: 768 }).visibleTiers, [1, 2]);
  assert.deepEqual(frameForProgress(0.5, { width: 320 }).visibleTiers, [1]);
});

test('D-27 hero mask hides compact input labels until the hero clears 60% of the viewport', () => {
  const vh = 800;
  assert.equal(
    frameForProgress(0.5, { width: 390, vh, heroBottom: 0.8 * vh }).heroMask,
    0,
    'hero still fills most of the viewport',
  );
  assert.equal(
    frameForProgress(0.5, { width: 390, vh, heroBottom: 0.4 * vh }).heroMask,
    1,
    'hero has scrolled past the 60% line',
  );
  assert.equal(
    frameForProgress(0.5, { width: 1440, vh, heroBottom: 0.8 * vh }).heroMask,
    1,
    'the mask never applies at or above 768px',
  );
});

test('input opacity is damped by the hero mask on compact widths', () => {
  const vh = 800;
  const masked = frameForProgress(0.5, { width: 390, vh, heroBottom: 0.8 * vh });
  const unmasked = frameForProgress(0.5, { width: 390, vh, heroBottom: 0.4 * vh });
  assert.equal(masked.inputOpacity, 0, 'fully masked while the hero fills the viewport');
  assert.equal(unmasked.inputOpacity, Math.max(0.9 - 0.4 * 0.5, 0.5), 'unmasked once the hero clears');
});

test('GROUP_REVEAL provides the five ordered thresholds frameForProgress reads from', () => {
  assert.deepEqual(GROUP_REVEAL, {
    inputs: 0,
    understand: 0.22,
    define: 0.4,
    'build-review': 0.58,
    'hand-over': 0.74,
  });
});

test('the scene has exactly twenty unique node ids', () => {
  const ids = SKY_CHART_NODES.map((node) => node.id);
  assert.equal(ids.length, 20);
  assert.equal(new Set(ids).size, 20);
});

test('each phase group has exactly three tier-3 activities', () => {
  for (const group of PHASE_GROUPS) {
    const activities = SKY_CHART_NODES.filter((node) => node.group === group && node.tier === 3);
    assert.equal(activities.length, 3, `${group} has three activities`);
  }
});

test('the inputs group has four tier-2 nodes and no tier-1 node', () => {
  const inputs = SKY_CHART_NODES.filter((node) => node.group === 'inputs');
  assert.equal(inputs.length, 4);
  assert.ok(inputs.every((node) => node.tier === 2));
});

test('each phase contributes exactly one tier-1 node', () => {
  for (const group of PHASE_GROUPS) {
    const tierOne = SKY_CHART_NODES.filter((node) => node.group === group && node.tier === 1);
    assert.equal(tierOne.length, 1, `${group} has one tier-1 node`);
    assert.equal(tierOne[0].id, group);
  }
});

test('frameForProgress treats a non-finite progress as 0 instead of propagating NaN', () => {
  const base = frameForProgress(0, { width: 1440, heroBottom: 0 });
  assert.equal(frameForProgress(Number.NaN, { width: 1440, heroBottom: 0 }).yaw, base.yaw);
  assert.equal(frameForProgress(Number.POSITIVE_INFINITY, { width: 1440, heroBottom: 0 }).yaw, base.yaw);
});

test('frameForProgress clamps out-of-range progress to 0..1', () => {
  assert.equal(frameForProgress(2, { width: 1440, heroBottom: 0 }).yaw, frameForProgress(1, { width: 1440, heroBottom: 0 }).yaw);
  assert.equal(frameForProgress(-5, { width: 1440, heroBottom: 0 }).yaw, frameForProgress(0, { width: 1440, heroBottom: 0 }).yaw);
});

test('recedeFactor returns 0 for a non-positive or non-finite viewport height instead of NaN or an inverted ratio', () => {
  assert.equal(recedeFactor(-50, 0), 0, 'a zero viewport height must not flip the ratio positive');
  assert.equal(recedeFactor(100, -10), 0, 'a negative viewport height must not flip the ratio positive');
  assert.equal(recedeFactor(100, Number.NaN), 0, 'a non-finite viewport height must not propagate NaN');
});

test('the hero mask fails safe to 0 below 768px for a non-positive or non-finite viewport height', () => {
  assert.equal(frameForProgress(0.5, { width: 390, vh: 0, heroBottom: 100 }).heroMask, 0, 'hidden is the D-27 safe default, same as a missing heroBottom');
  assert.equal(frameForProgress(0.5, { width: 390, vh: -10, heroBottom: 100 }).heroMask, 0);
  assert.equal(frameForProgress(0.5, { width: 390, vh: Number.NaN, heroBottom: 100 }).heroMask, 0);
  assert.equal(frameForProgress(0.5, { width: 1440, vh: Number.NaN, heroBottom: 100 }).heroMask, 1, 'the mask stays 1 at >=768px regardless of vh');
});

test('the hero mask fails safe to 0 below 768px when heroBottom is omitted', () => {
  assert.equal(frameForProgress(0.5, { width: 390 }).heroMask, 0, 'compact width without a measured hero must hide, not show');
  assert.equal(frameForProgress(0.5, { width: 1440 }).heroMask, 1, 'wide widths never depend on heroBottom');
});

test('node yaw and pitch match Appendix B for a spot check of nodes', () => {
  const byId = Object.fromEntries(SKY_CHART_NODES.map((node) => [node.id, node]));
  assert.deepEqual(
    { yaw: byId.orders.yaw, pitch: byId.orders.pitch },
    { yaw: 28, pitch: 14 },
  );
  assert.deepEqual(
    { yaw: byId['hand-over'].yaw, pitch: byId['hand-over'].pitch },
    { yaw: 180, pitch: 2 },
  );
  assert.deepEqual(
    { yaw: byId['validation-criteria'].yaw, pitch: byId['validation-criteria'].pitch },
    { yaw: 116, pitch: -10 },
  );
});
