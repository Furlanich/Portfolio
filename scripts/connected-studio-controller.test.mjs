import test from 'node:test';
import assert from 'node:assert/strict';

const { createConnectedController } = await import('../lib/connected-studio/controller.ts');

// A hand-built graph keeps the controller contract independent of the seeded production graphs.
const GRAPH = Object.freeze({
  quality: 'wide',
  nodes: Object.freeze([
    Object.freeze({ id: 'a', capabilityIndex: 0, anchor: [-1, 0.5, 0], seed: 0.25, depthScale: 1 }),
    Object.freeze({ id: 'b', capabilityIndex: 1, anchor: [1, -0.5, -0.4], seed: 0.75, depthScale: 0.8 }),
  ]),
  edges: Object.freeze([Object.freeze({ id: 'a-b', from: 'a', to: 'b', revealStart: 0, revealEnd: 1 })]),
});

const LAYOUT = Object.freeze({ footerDocumentTop: 5000, viewportWidth: 1440, viewportHeight: 900 });

function createHarness({ layout = LAYOUT, startPose } = {}) {
  let currentLayout = layout;
  let now = 0;
  let nextId = 1;
  const queue = new Map();
  const renders = [];
  const renderTimes = [];
  const clock = { now: () => now };
  const scheduler = {
    schedule(callback, delayMs) {
      const id = nextId;
      nextId += 1;
      queue.set(id, { callback, at: now + delayMs });
      return id;
    },
    cancel(id) {
      queue.delete(id);
    },
  };

  function advance(ms) {
    const end = now + ms;
    for (;;) {
      let nextEntry = null;
      for (const [id, entry] of queue) {
        if (entry.at <= end && (nextEntry === null || entry.at < nextEntry.entry.at)) nextEntry = { id, entry };
      }
      if (nextEntry === null) break;
      queue.delete(nextEntry.id);
      now = Math.max(now, nextEntry.entry.at);
      nextEntry.entry.callback();
    }
    now = end;
  }

  const controller = createConnectedController({
    clock,
    scheduler,
    startPose,
    render: (pose) => {
      renders.push(pose);
      renderTimes.push(now);
    },
    getLayout: () => currentLayout,
  });

  return {
    controller,
    renders,
    renderTimes,
    advance,
    pending: () => queue.size,
    now: () => now,
    setLayout(next) {
      currentLayout = next;
    },
  };
}

function update(overrides = {}) {
  return {
    graph: GRAPH,
    tier: 'wide',
    scrollY: 0,
    velocityPxPerSecond: 0,
    visible: true,
    footerDominant: false,
    ...overrides,
  };
}

test('visible eligible controller rotates at rest and stops pending work when paused', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(1000);

  assert.ok(harness.renders.length > 1, `expected idle renders while visible, got ${harness.renders.length}`);
  const first = harness.renders[0];
  const last = harness.renders[harness.renders.length - 1];
  assert.notDeepEqual(
    last.nodes.map((node) => node.rotation),
    first.nodes.map((node) => node.rotation),
    'elapsed idle time must change node rotation',
  );
  assert.deepEqual(
    last.nodes.map((node) => node.position),
    first.nodes.map((node) => node.position),
    'idle positions must stay steady',
  );
  assert.equal(last.progress, first.progress, 'idle progress must stay steady');

  const live = harness.controller.snapshot();
  assert.equal(live.state, 'live');
  assert.equal(live.pendingCallbacks, 1);
  assert.equal(live.renderCount, harness.renders.length);

  harness.controller.pause();
  const paused = harness.controller.snapshot();
  assert.equal(paused.state, 'paused');
  assert.equal(paused.pendingCallbacks, 0, 'pause must cancel every pending callback');
  assert.equal(harness.pending(), 0, 'the scheduler must hold no callback after pause');

  const rendersAtPause = harness.renders.length;
  harness.advance(2000);
  assert.equal(harness.renders.length, rendersAtPause, 'no render may happen while paused');
});

test('the first pixel of scroll moves the rendered progress before any chapter', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 1, velocityPxPerSecond: 60 }));
  harness.advance(500);

  const settled = harness.renders[harness.renders.length - 1];
  assert.ok(settled.progress > 0, `expected rendered progress > 0 after 1px, got ${settled.progress}`);
  assert.equal(harness.renders[0].progress > 0, true, 'the very first render must already reflect the scroll');
});

test('reverse scroll reverses progress and connection growth without replaying earlier chapters', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 2500, velocityPxPerSecond: 600 }));
  harness.advance(1000);
  const forward = harness.renders[harness.renders.length - 1];
  assert.ok(forward.progress > 0.4, `forward progress should advance with scroll, got ${forward.progress}`);
  assert.ok(forward.edges[0].growth > 0.4, `connection growth should follow progress, got ${forward.edges[0].growth}`);

  harness.controller.update(update({ scrollY: 500, velocityPxPerSecond: -600 }));
  harness.advance(1000);
  const reverse = harness.renders[harness.renders.length - 1];
  assert.ok(reverse.progress < forward.progress, 'reverse input must reverse progress');
  assert.ok(reverse.edges[0].growth < forward.edges[0].growth, 'reverse input must shrink connection growth');
  assert.ok(Math.abs(reverse.progress - 500 / (5000 - 0.7 * 900)) < 1e-6, 'progress must retarget the current scroll, not a replay');
});

const COMPACT_GRAPH = Object.freeze({
  quality: 'compact',
  nodes: Object.freeze([Object.freeze({ id: 'c0', capabilityIndex: 2, anchor: [0, 0, 0], seed: 0.5, depthScale: 1 })]),
  edges: Object.freeze([]),
});

test('resize recomputes progress from the new layout and rebuilds the pose without replay', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 2000, velocityPxPerSecond: 0 }));
  harness.advance(1000);
  const before = harness.renders[harness.renders.length - 1];
  const idleBefore = before.idleAngleRadians;

  harness.setLayout({ footerDocumentTop: 9000, viewportWidth: 390, viewportHeight: 800 });
  const rendersBefore = harness.renders.length;
  harness.controller.update(update({ graph: COMPACT_GRAPH, tier: 'compact', scrollY: 2000 }));

  assert.ok(harness.renders.length > rendersBefore, 'a resize must render the recomputed geometry immediately');
  const after = harness.renders[harness.renders.length - 1];
  assert.deepEqual(after.nodes.map((node) => node.id), ['c0'], 'the new graph replaces the old one');
  assert.equal(after.edges.length, 0);
  const expected = 2000 / (9000 - 0.7 * 800);
  assert.ok(Math.abs(after.progress - expected) < 1e-9, `progress must land on the new layout (${expected}), got ${after.progress}`);
  assert.ok(after.idleAngleRadians >= idleBefore, 'rotation continues instead of restarting');
});

test('ambient cadence caps at 30fps wide and tablet and 20fps compact, and targetFps reports it', () => {
  for (const [tier, graph, fps] of [
    ['wide', GRAPH, 30],
    ['tablet', GRAPH, 30],
    ['compact', COMPACT_GRAPH, 20],
  ]) {
    const harness = createHarness();
    harness.controller.update(update({ tier, graph }));
    harness.advance(1000);
    assert.ok(
      Math.abs(harness.renders.length - fps) <= 2,
      `${tier} should render about ${fps} frames in one idle second, got ${harness.renders.length}`,
    );
    const gaps = harness.renderTimes.slice(1).map((time, index) => time - harness.renderTimes[index]);
    assert.ok(Math.min(...gaps) >= 1000 / fps - 1e-6, `${tier} must never exceed its ambient cap, shortest gap ${Math.min(...gaps)}ms`);
    assert.equal(harness.controller.snapshot().targetFps, fps, `${tier} targetFps`);
  }
});

test('active scroll renders up to 60fps and the cadence decays back to the ambient cap', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 100, velocityPxPerSecond: 1500 }));
  for (let step = 0; step < 31; step += 1) {
    harness.advance(16);
    harness.controller.update(update({ scrollY: 100 + step * 25, velocityPxPerSecond: 1500 }));
  }
  const scrolling = harness.controller.snapshot();
  assert.ok(scrolling.pose.scrollActivity > 0.5, `scroll activity should build, got ${scrolling.pose.scrollActivity}`);
  assert.ok(scrolling.targetFps > 30 && scrolling.targetFps <= 60, `active targetFps must be in (30, 60], got ${scrolling.targetFps}`);
  assert.ok(harness.renders.length >= 25, `active scroll should render faster than ambient, got ${harness.renders.length} frames in ~500ms`);
  const activeGaps = harness.renderTimes.slice(1).map((time, index) => time - harness.renderTimes[index]);
  assert.ok(Math.min(...activeGaps) >= 1000 / 60 - 1e-6, `active cadence must stay at or below 60fps, shortest gap ${Math.min(...activeGaps)}ms`);

  harness.advance(2000);
  const settled = harness.controller.snapshot();
  assert.ok(settled.pose.scrollActivity < 0.01, `activity must decay after input ends, got ${settled.pose.scrollActivity}`);
  assert.equal(settled.targetFps, 30, 'cadence returns to the ambient cap');
  const rendersAtSettle = harness.renders.length;
  harness.advance(1000);
  assert.ok(Math.abs(harness.renders.length - rendersAtSettle - 30) <= 2, 'idle frames run at the ambient cap again');
});

test('the first scroll reacts within one active frame while an ambient frame is pending', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(5);
  const startedAt = harness.now();
  const rendersBefore = harness.renders.length;
  harness.controller.update(update({ scrollY: 40, velocityPxPerSecond: 800 }));
  harness.advance(17);
  const reacted = harness.renderTimes.slice(rendersBefore).some((time) => time > startedAt && time <= startedAt + 17);
  assert.ok(reacted, 'a frame must render within 17ms of the first scroll, not wait for the 33ms ambient frame');
  assert.ok(harness.renders[harness.renders.length - 1].progress > 0, 'that frame carries the scrolled progress');
});

test('a hidden tab suspends all work and resumes on the current pose without integrating unseen rotation', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(500);
  const angleBefore = harness.renders[harness.renders.length - 1].idleAngleRadians;

  harness.controller.update(update({ visible: false }));
  const hidden = harness.controller.snapshot();
  assert.equal(hidden.state, 'suspended');
  assert.equal(hidden.pendingCallbacks, 0, 'a hidden scene holds no pending callback');
  assert.equal(hidden.targetFps, 0);
  assert.equal(harness.pending(), 0);

  const rendersWhenHidden = harness.renders.length;
  harness.advance(60_000);
  assert.equal(harness.renders.length, rendersWhenHidden, 'a hidden scene draws nothing');

  harness.controller.update(update({ visible: true, scrollY: 3000 }));
  assert.equal(harness.controller.snapshot().state, 'live');
  assert.ok(harness.renders.length > rendersWhenHidden, 'becoming visible renders the current pose immediately');
  const resumed = harness.renders[rendersWhenHidden];
  assert.equal(resumed.progress, 3000 / (5000 - 0.7 * 900), 'the pose lands on the current scroll, not a catch-up animation');
  assert.ok(
    resumed.idleAngleRadians - angleBefore < (1.2 * Math.PI) / 180,
    `a minute of unseen time must not be integrated into rotation, got ${resumed.idleAngleRadians - angleBefore} rad`,
  );
});

test('an initially hidden scene stays suspended and draws nothing', () => {
  const harness = createHarness();
  harness.controller.update(update({ visible: false }));
  harness.advance(5000);
  const snapshot = harness.controller.snapshot();
  assert.equal(snapshot.state, 'suspended');
  assert.equal(snapshot.renderCount, 0);
  assert.equal(snapshot.pendingCallbacks, 0);
  assert.equal(harness.renders.length, 0);
});

test('Footer dominance suspends drawing and resumes when the reader scrolls back up', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 4200, velocityPxPerSecond: 0 }));
  harness.advance(200);
  harness.controller.update(update({ scrollY: 4400, footerDominant: true }));
  const covered = harness.controller.snapshot();
  assert.equal(covered.state, 'suspended');
  assert.equal(covered.pendingCallbacks, 0);
  assert.equal(harness.pending(), 0);

  const rendersWhenCovered = harness.renders.length;
  harness.advance(5000);
  assert.equal(harness.renders.length, rendersWhenCovered, 'a Footer-dominated scene draws nothing');

  harness.controller.update(update({ scrollY: 3000, footerDominant: false }));
  assert.equal(harness.controller.snapshot().state, 'live');
  harness.advance(500);
  assert.ok(harness.renders.length > rendersWhenCovered + 10, 'drawing resumes once the Footer no longer dominates');
});

test('Resume samples the current scroll state and Pause outranks visibility', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(200);
  harness.controller.pause();
  const rendersAtPause = harness.renders.length;

  harness.controller.update(update({ scrollY: 3000 }));
  harness.advance(2000);
  assert.equal(harness.renders.length, rendersAtPause, 'scroll while paused must not advance the canvas');
  assert.equal(harness.controller.snapshot().state, 'paused');

  harness.controller.update(update({ scrollY: 3000, visible: false }));
  harness.controller.update(update({ scrollY: 3000, visible: true }));
  assert.equal(harness.controller.snapshot().state, 'paused', 'becoming visible must not override Pause');
  assert.equal(harness.pending(), 0);

  harness.controller.resume();
  assert.equal(harness.controller.snapshot().state, 'live');
  assert.equal(harness.renders.length, rendersAtPause + 1, 'Resume renders the current pose once, immediately');
  assert.equal(harness.renders[rendersAtPause].progress, 3000 / (5000 - 0.7 * 900), 'Resume samples the current scroll state');

  harness.controller.pause();
  harness.controller.update(update({ visible: false }));
  harness.controller.resume();
  assert.equal(harness.controller.snapshot().state, 'suspended', 'Resume while hidden stays suspended');
  assert.equal(harness.pending(), 0);
});

test('dispose is idempotent, cancels pending work and makes the controller inert', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(200);
  const rendersAtDispose = harness.renders.length;

  harness.controller.dispose();
  harness.controller.dispose();
  const disposed = harness.controller.snapshot();
  assert.equal(disposed.state, 'disposed');
  assert.equal(disposed.pendingCallbacks, 0);
  assert.equal(disposed.targetFps, 0);
  assert.equal(harness.pending(), 0, 'the scheduler must hold no callback after dispose');

  harness.controller.update(update({ scrollY: 3000, velocityPxPerSecond: 900 }));
  harness.controller.resume();
  harness.controller.pause();
  harness.controller.resume();
  harness.advance(5000);
  assert.equal(harness.renders.length, rendersAtDispose, 'a disposed controller never renders again');
  assert.equal(harness.controller.snapshot().state, 'disposed', 'nothing revives a disposed controller');
  assert.equal(harness.pending(), 0);
});

test('a callback that fires after cancel, pause or dispose renders nothing and schedules nothing', () => {
  let nextId = 1;
  const queue = new Map();
  const renders = [];
  const controller = createConnectedController({
    clock: { now: () => 0 },
    scheduler: {
      schedule(callback) {
        const id = nextId;
        nextId += 1;
        queue.set(id, callback);
        return id;
      },
      // A host timer whose cancel arrives too late to stop an already-queued callback.
      cancel() {},
    },
    render: (pose) => renders.push(pose),
    getLayout: () => LAYOUT,
  });
  controller.update(update());
  const lateCallbacks = [...queue.values()];
  const rendersAfterStart = renders.length;
  controller.pause();
  for (const callback of lateCallbacks) callback();
  assert.equal(renders.length, rendersAfterStart, 'a stale callback after pause must not render');

  controller.resume();
  controller.dispose();
  const queuedBeforeLate = queue.size;
  const rendersAfterDispose = renders.length;
  for (const callback of [...queue.values()]) callback();
  assert.equal(renders.length, rendersAfterDispose, 'a stale callback after dispose must not render');
  assert.equal(queue.size, queuedBeforeLate, 'a stale callback after dispose must not schedule more work');
});

test('an unknown tier makes the controller inert instead of scheduling or rendering', () => {
  const harness = createHarness();
  harness.controller.update(update({ tier: 'phablet' }));
  harness.advance(2000);
  const snapshot = harness.controller.snapshot();
  assert.equal(snapshot.state, 'suspended');
  assert.equal(snapshot.pendingCallbacks, 0);
  assert.equal(harness.renders.length, 0);
  assert.equal(harness.pending(), 0);

  harness.controller.update(update());
  assert.equal(harness.controller.snapshot().state, 'live', 'a later valid update recovers');
});

test('fast scrolling into the Footer completes every connection before the scene suspends', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 0 }));
  // Fast scroll: 300px every 16ms. The damped pose trails the scroll target the whole way down.
  for (let step = 1; step <= 16; step += 1) {
    harness.advance(16);
    harness.controller.update(update({ scrollY: step * 300, velocityPxPerSecond: 18_750 }));
  }
  const trailing = harness.renders[harness.renders.length - 1];
  const minGrowthWhileTrailing = Math.min(...trailing.edges.map((edge) => edge.growth));
  assert.ok(minGrowthWhileTrailing < 0.95, `the scenario must trail the target to be meaningful, got ${minGrowthWhileTrailing}`);

  harness.advance(16);
  harness.controller.update(update({ scrollY: 4900, velocityPxPerSecond: 18_750, footerDominant: true }));
  const handoff = harness.controller.snapshot();
  assert.equal(handoff.state, 'suspended');
  assert.equal(handoff.pendingCallbacks, 0);

  const last = harness.renders[harness.renders.length - 1];
  assert.equal(last.progress, 1, 'the last drawn pose is the completed one');
  assert.deepEqual(
    last.edges.map((edge) => edge.growth),
    last.edges.map(() => 1),
    'every connection reaches growth 1 before the scene hides',
  );

  const rendersAtHandoff = harness.renders.length;
  harness.advance(5000);
  assert.equal(harness.renders.length, rendersAtHandoff, 'nothing draws once the Footer dominates');
  assert.equal(harness.pending(), 0);
});

// --- PLAN-SPF-V1 Task 8 follow-up: the start pose (owner direction, 2026-10-12) ----------------------------
// The first live frame is the poster's pose, so the fade from poster to canvas has no jump; the scene then
// eases to the scroll-driven pose with a slower time constant than the normal damping.

const START_POSE = Object.freeze({ progress: 0.6, idleAngleRadians: 0.5 });

test('with a start pose the first live frame is that pose, then the progress eases down to the scroll pose', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update());
  const first = harness.renders[0];
  assert.ok(Math.abs(first.progress - 0.6) < 1e-9, `the first frame carries the start progress, got ${first.progress}`);
  assert.ok(Math.abs(first.idleAngleRadians - 0.5) < 1e-9, `the first frame carries the start angle, got ${first.idleAngleRadians}`);
  assert.equal(first.scrollActivity, 0);
  assert.deepEqual(first.edges.map((edge) => edge.growth), [0.6], 'the connection growth matches the start progress');

  harness.advance(250);
  const midway = harness.renders[harness.renders.length - 1];
  assert.ok(midway.progress > 0.05 && midway.progress < 0.55, `mid-settle progress is between the pose and the target, got ${midway.progress}`);

  harness.advance(3000);
  const settled = harness.renders[harness.renders.length - 1];
  assert.ok(settled.progress < 0.005, `the pose settles on the scroll target (0 at the top), got ${settled.progress}`);

  for (let index = 1; index < harness.renders.length; index += 1) {
    assert.ok(harness.renders[index].progress <= harness.renders[index - 1].progress + 1e-9, `progress never rises while settling (frame ${index})`);
    assert.ok(harness.renders[index].idleAngleRadians >= harness.renders[index - 1].idleAngleRadians, 'the rotation carries on from the start angle');
  }
  const step = Math.max(...harness.renders.slice(1).map((pose, index) => harness.renders[index].progress - pose.progress));
  assert.ok(step < 0.08, `no frame jumps by more than 0.08 of progress, largest step ${step}`);
});

test('the start pose settles onto a scroll position it was not told about, and a scroll mid-settle retargets without a jump', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update({ scrollY: 1000 }));
  harness.advance(400);
  harness.controller.update(update({ scrollY: 2000, velocityPxPerSecond: 800 }));
  harness.advance(80);
  harness.controller.update(update({ scrollY: 2000, velocityPxPerSecond: 0 }));
  harness.advance(4000);
  const target = 2000 / (5000 - 0.7 * 900);
  const last = harness.renders[harness.renders.length - 1];
  assert.ok(Math.abs(last.progress - target) < 0.01, `settles on the new target ${target}, got ${last.progress}`);
  const step = Math.max(...harness.renders.slice(1).map((pose, index) => Math.abs(pose.progress - harness.renders[index].progress)));
  assert.ok(step < 0.12, `no frame jumps (largest step ${step})`);
});

test('Pause and Resume never replay the start pose', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update({ scrollY: 2000 }));
  harness.advance(4000);
  const settled = harness.renders[harness.renders.length - 1].progress;
  harness.controller.pause();
  harness.advance(500);
  harness.controller.resume();
  const resumed = harness.renders[harness.renders.length - 1];
  assert.ok(Math.abs(resumed.progress - settled) < 0.01, `Resume samples the current state, not the start pose (got ${resumed.progress}, was ${settled})`);
});

test('a scene that starts hidden applies the start pose when it first goes live, not before', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update({ visible: false }));
  harness.advance(2000);
  assert.equal(harness.renders.length, 0, 'a hidden scene draws nothing');
  harness.controller.update(update({ visible: true }));
  assert.ok(Math.abs(harness.renders[0].progress - 0.6) < 1e-9, 'the first live frame is the start pose');
});

test('an invalid start pose is ignored and the scene starts on the scroll pose', () => {
  for (const bad of [{ progress: Number.NaN, idleAngleRadians: 0.5 }, { progress: 1.4, idleAngleRadians: 0.5 }, { progress: 0.6, idleAngleRadians: Number.POSITIVE_INFINITY }, { progress: -0.1, idleAngleRadians: 0 }]) {
    const harness = createHarness({ startPose: bad });
    harness.controller.update(update());
    assert.equal(harness.renders[0].progress, 0, `start pose ${JSON.stringify(bad)} is ignored`);
  }
});

test('without a start pose the first live frame is the scroll pose, as before', () => {
  const harness = createHarness();
  harness.controller.update(update({ scrollY: 2000 }));
  assert.ok(Math.abs(harness.renders[0].progress - 2000 / (5000 - 0.7 * 900)) < 1e-9);
});

test('a layout change while the start pose is settling keeps easing: it does not snap to the scroll pose', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update());
  harness.advance(100);
  const before = harness.renders[harness.renders.length - 1].progress;
  assert.ok(before > 0.4, `the settle is still under way (progress ${before})`);
  // Fonts and images move the Footer after activation: the layout is measured again.
  harness.setLayout({ footerDocumentTop: 5200, viewportWidth: 1440, viewportHeight: 900 });
  harness.controller.update(update());
  const right = harness.renders[harness.renders.length - 1].progress;
  assert.ok(right > before - 0.05, `the start pose survives a layout change (was ${before}, now ${right})`);
  harness.advance(4000);
  assert.ok(harness.renders[harness.renders.length - 1].progress < 0.005, 'and it still settles on the scroll pose');
});

test('a layout change after the settle lands on the current geometry, as before', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update({ scrollY: 2000 }));
  harness.advance(4000);
  harness.setLayout({ footerDocumentTop: 6000, viewportWidth: 1440, viewportHeight: 900 });
  harness.controller.update(update({ scrollY: 2000 }));
  const last = harness.renders[harness.renders.length - 1];
  assert.ok(Math.abs(last.progress - 2000 / (6000 - 0.7 * 900)) < 1e-6, 'the pose lands on the new target without replay');
});

test('the projection starts on the poster crop and settles without replaying on Resume', () => {
  const harness = createHarness({ startPose: START_POSE });
  harness.controller.update(update());
  assert.equal(harness.renders[0].posterBlend, 1);
  harness.advance(500);
  const midway = harness.renders.at(-1).posterBlend;
  assert.ok(midway > 0 && midway < 0.5);
  harness.controller.pause(); const frames = harness.renders.length;
  harness.advance(500); assert.equal(harness.renders.length, frames);
  harness.controller.resume(); assert.equal(harness.renders.at(-1).posterBlend, 0);
  harness.advance(4000); assert.equal(harness.renders.at(-1).posterBlend, 0);
});

// --- PLAN-SFC-V1 Task 4: profiles, the resolved frame, inertial interaction and sleep --------------------------------
// The controller owns cadence and sleep. A new-profile (Atlas) scene sleeps at rest with zero callbacks; Services and
// Projects keep their capped ambient cadence; active interaction renders at no more than 60fps; the poster or native
// frame is resolved once before the interaction and travels in the final pose.

const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
const { computeProjectionLayout, projectAnchor } = await import('../lib/connected-studio/projection.ts');
const { createConnectedInteraction, connectedProfileKit } = await import('../lib/connected-studio/interaction.ts');
const { CONNECTED_POSTER_POSE } = await import('../lib/connected-studio/media-manifest.ts');

const VIEWPORTS = { wide: { width: 1440, height: 900 }, compact: { width: 390, height: 844 } };
const FRAME_MS = 1000 / 60;

function near(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? 'value'}: ${actual} vs ${expected} (tolerance ${tolerance})`);
}

function createProfiledHarness({ route = 'studio', tier = 'wide', startPose = CONNECTED_POSTER_POSE, createInteraction = createConnectedInteraction } = {}) {
  const viewport = VIEWPORTS[tier];
  const profile = getConnectedProfile(route, tier, viewport);
  let layout = Object.freeze({ footerDocumentTop: 500000, viewportWidth: viewport.width, viewportHeight: viewport.height });
  let now = 0;
  let nextId = 1;
  const queue = new Map();
  const renders = [];
  const renderTimes = [];
  const scheduler = {
    schedule(callback, delayMs) {
      const id = nextId;
      nextId += 1;
      queue.set(id, { callback, at: now + delayMs });
      return id;
    },
    cancel(id) {
      queue.delete(id);
    },
  };
  function advance(ms) {
    const end = now + ms;
    for (;;) {
      let next = null;
      for (const [id, entry] of queue) if (entry.at <= end && (next === null || entry.at < next.entry.at)) next = { id, entry };
      if (next === null) break;
      queue.delete(next.id);
      now = Math.max(now, next.entry.at);
      next.entry.callback();
    }
    now = end;
  }
  const controller = createConnectedController({
    clock: { now: () => now },
    scheduler,
    startPose,
    profile,
    profileKit: { ...connectedProfileKit, createInteraction },
    getLayout: () => layout,
    render: (pose) => {
      renders.push(pose);
      renderTimes.push(now);
    },
  });
  const nativeFor = (p = profile) => computeProjectionLayout(p, { width: layout.viewportWidth, height: layout.viewportHeight, tier });
  return {
    controller,
    profile,
    viewport,
    tier,
    renders,
    renderTimes,
    advance,
    nativeFor,
    pending: () => queue.size,
    now: () => now,
    setLayout(next) {
      layout = Object.freeze(next);
    },
    update(overrides = {}) {
      controller.update({ graph: profile.graph, tier, scrollY: 0, velocityPxPerSecond: 0, visible: true, footerDominant: false, ...overrides });
    },
    last: () => renders[renders.length - 1],
  };
}

/** Where each rest anchor sits in the frame a pose carries (cover crop included). */
function restCssIn(profile, frame) {
  return profile.restAnchors.map((rest) => ({
    id: rest.id,
    x: rest.u * frame.width - (frame.crop?.x ?? 0),
    y: rest.v * frame.height - (frame.crop?.y ?? 0),
  }));
}

function displacements(profile, pose) {
  const frame = pose.projectionLayout;
  const rests = restCssIn(profile, frame);
  return pose.nodes.map((node, index) => {
    const css = projectAnchor(node.position, frame);
    return Math.hypot(css.xPx - rests[index].x, css.yPx - rests[index].y);
  });
}

function settleAtRest(harness) {
  harness.update();
  harness.advance(4000);
}

test('an Atlas scene lands on the poster frame, eases to the native frame, then sleeps with zero callbacks', () => {
  const harness = createProfiledHarness();
  harness.update();
  const first = harness.renders[0];
  assert.equal(first.posterBlend, 1, 'the first live frame is the poster frame');
  assert.ok(first.projectionLayout.crop, 'the poster frame is cropped to the viewport');
  first.nodes.forEach((node, index) => {
    const css = projectAnchor(node.position, first.projectionLayout);
    const rest = restCssIn(harness.profile, first.projectionLayout)[index];
    assert.ok(Math.hypot(css.xPx - rest.x, css.yPx - rest.y) < 1e-6, `${node.id} sits at its poster position`);
  });
  harness.advance(4000);
  const settled = harness.last();
  assert.equal(settled.posterBlend, 0);
  assert.deepEqual(settled.projectionLayout, harness.nativeFor(), 'the native frame, uncropped');
  assert.equal(settled.projectionLayout.crop, undefined);
  assert.deepEqual(settled.nodes.map((node) => node.position), harness.profile.graph.nodes.map((node) => node.anchor));
  assert.equal(settled.edgeSamples, undefined);
  assert.equal(settled.excitation, undefined);
  const snapshot = harness.controller.snapshot();
  assert.equal(snapshot.state, 'live');
  assert.equal(snapshot.pendingCallbacks, 0, 'a settled Atlas scene holds no callback');
  assert.equal(snapshot.targetFps, 0);
  assert.equal(harness.pending(), 0);
  const count = harness.renders.length;
  harness.advance(30000);
  assert.equal(harness.renders.length, count, 'no frame is drawn while it sleeps');
});

test('the poster ease of an Atlas scene runs at the ambient cadence, never above it', () => {
  const harness = createProfiledHarness();
  harness.update();
  harness.advance(2000);
  const gaps = harness.renderTimes.slice(1).map((time, index) => time - harness.renderTimes[index]);
  assert.ok(gaps.length > 10);
  assert.ok(Math.min(...gaps) >= 1000 / 30 - 1e-6, `wide ambient is at most 30fps, got a ${Math.min(...gaps)}ms gap`);
  const compact = createProfiledHarness({ tier: 'compact' });
  compact.update();
  compact.advance(2000);
  const compactGaps = compact.renderTimes.slice(1).map((time, index) => time - compact.renderTimes[index]);
  assert.ok(Math.min(...compactGaps) >= 1000 / 20 - 1e-6, 'compact ambient is at most 20fps');
});

test('Services and Projects keep the 30/20fps ambient cadence at rest with a profile', () => {
  for (const [tier, fps] of [['wide', 30], ['compact', 20]]) {
    for (const route of ['services', 'projects']) {
      const harness = createProfiledHarness({ route, tier });
      harness.update();
      harness.advance(6000);
      const snapshot = harness.controller.snapshot();
      assert.equal(snapshot.pendingCallbacks, 1, `${route} ${tier} keeps its ambient loop`);
      assert.equal(snapshot.targetFps, fps);
      const count = harness.renders.length;
      harness.advance(1000);
      near(harness.renders.length - count, fps, 1, `${route} ${tier} frames per second`);
    }
  }
});

test('a pointer wakes a sleeping Atlas scene; frames never exceed 60fps; nodes stay within the cap; it sleeps again after the tail', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  assert.equal(harness.pending(), 0);
  const before = harness.renders.length;
  harness.update({ pointer: { x: 780, y: 330, vx: 0, vy: 0 } });
  assert.equal(harness.controller.snapshot().pendingCallbacks, 1, 'the pointer scheduled a frame');
  let peak = 0;
  for (let frame = 0; frame < 60; frame += 1) {
    harness.update({ pointer: { x: 780 + frame * 3, y: 330, vx: 180, vy: 0 } });
    harness.advance(FRAME_MS);
    peak = Math.max(peak, ...displacements(harness.profile, harness.last()));
  }
  assert.ok(harness.renders.length > before + 20, 'frames were drawn while the pointer moved');
  assert.ok(peak > 2 && peak <= 34 + 1e-6, `displacement ${peak} is visible and within the 34px cap`);
  const active = harness.renderTimes.slice(before + 1).map((time, index) => time - harness.renderTimes[before + index]);
  assert.ok(Math.min(...active) >= 1000 / 60 - 1e-6, `active cadence never exceeds 60fps (smallest gap ${Math.min(...active)}ms)`);
  assert.equal(harness.last().projectionLayout.crop, undefined);
  assert.ok(harness.last().edgeSamples.length > 0 && harness.last().excitation.length > 0);

  harness.update({ pointer: null });
  harness.advance(12000);
  const asleep = harness.controller.snapshot();
  assert.equal(asleep.pendingCallbacks, 0, 'asleep again once the tail has settled');
  assert.equal(asleep.targetFps, 0);
  assert.deepEqual(harness.last().nodes.map((node) => node.position), harness.profile.graph.nodes.map((node) => node.anchor), 'exactly at rest');
  const count = harness.renders.length;
  harness.advance(10000);
  assert.equal(harness.renders.length, count);
});

test('pointer exit keeps the tail alive: the scene keeps drawing until motion settles', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  for (let frame = 0; frame < 30; frame += 1) {
    harness.update({ pointer: { x: 700 + frame * 6, y: 340, vx: 360, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  harness.update({ pointer: null });
  const at = harness.renders.length;
  harness.advance(240);
  assert.ok(harness.renders.length > at + 5, 'the tail is still being drawn 240ms after exit');
  assert.equal(harness.controller.snapshot().pendingCallbacks, 1);
});

test('an invalid pointer wakes nothing, and disabling input lets motion damp without new excitation', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  harness.update({ pointer: { x: Number.NaN, y: 100, vx: 0, vy: 0 } });
  harness.update({ pointer: { x: 100, y: Number.POSITIVE_INFINITY, vx: 0, vy: 0 } });
  assert.equal(harness.pending(), 0, 'a non-finite pointer is not input');
  for (let frame = 0; frame < 40; frame += 1) {
    harness.update({ pointer: { x: 760 + frame * 4, y: 330, vx: 240, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  assert.ok(Math.max(...displacements(harness.profile, harness.last())) > 2);
  harness.update({ inputEnabled: false, pointer: { x: 900, y: 330, vx: 900, vy: 0 }, scrollDeltaPx: 80 });
  let previous = Math.max(...displacements(harness.profile, harness.last()));
  harness.advance(FRAME_MS * 3);
  for (let frame = 0; frame < 20; frame += 1) {
    harness.update({ inputEnabled: false, pointer: { x: 900 + frame * 10, y: 330, vx: 600, vy: 0 } });
    harness.advance(FRAME_MS * 3);
    const current = Math.max(...displacements(harness.profile, harness.last()));
    assert.ok(current <= previous + 0.5, `disabled input adds no excitation (${current} after ${previous})`);
    previous = current;
  }
  harness.advance(12000);
  assert.equal(harness.pending(), 0);
});

test('classified scroll nudges an Atlas scene; raw scroll alone neither wakes nor moves it', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  const count = harness.renders.length;
  harness.update({ scrollY: 400, velocityPxPerSecond: 900 });
  harness.update({ scrollY: 800, velocityPxPerSecond: 900 });
  harness.advance(2000);
  assert.equal(harness.renders.length, count, 'scroll with no classified distance does nothing to a sleeping Atlas scene');
  assert.equal(harness.pending(), 0);
  for (let frame = 0; frame < 30; frame += 1) {
    harness.update({ scrollY: 800 + frame * 20, velocityPxPerSecond: 1200, scrollDeltaPx: 20 });
    harness.advance(FRAME_MS);
  }
  const moved = displacements(harness.profile, harness.last());
  assert.ok(Math.max(...moved) > 0.5 && Math.max(...moved) <= 34 + 1e-6);
  harness.advance(12000);
  assert.equal(harness.pending(), 0, 'and it sleeps again');
});

test('Contact nodes never move while its strings respond, and it sleeps afterwards', () => {
  const harness = createProfiledHarness({ route: 'contact' });
  settleAtRest(harness);
  for (let frame = 0; frame < 60; frame += 1) {
    harness.update({ pointer: { x: 1000 + frame * 5, y: 300 + (frame % 9) * 10, vx: 300, vy: 100 }, scrollDeltaPx: 30 });
    harness.advance(FRAME_MS);
    assert.deepEqual(harness.last().nodes.map((node) => node.position), harness.profile.graph.nodes.map((node) => node.anchor));
  }
  assert.ok(harness.last().edgeSamples.length > 0, 'its strings are drawn');
  harness.update({ pointer: null });
  harness.advance(12000);
  assert.equal(harness.pending(), 0);
});

test('Services keeps chapter progress as its base and adds the pointer response on top, then returns to the ambient cadence', () => {
  const harness = createProfiledHarness({ route: 'services' });
  harness.setLayout({ footerDocumentTop: 5000, viewportWidth: 1440, viewportHeight: 900 });
  harness.update({ scrollY: 2500, velocityPxPerSecond: 0 });
  harness.advance(4000);
  const base = harness.last();
  assert.ok(base.progress > 0.3, 'legacy progress still follows scroll');
  assert.equal(harness.controller.snapshot().targetFps, 30);
  for (let frame = 0; frame < 45; frame += 1) {
    harness.update({ scrollY: 2500, pointer: { x: 720 + frame * 2, y: 450, vx: 120, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  const touched = harness.last();
  assert.ok(touched.edgeSamples.length === 33 && touched.excitation.length > 0);
  assert.equal(harness.controller.snapshot().targetFps, 60, 'interaction renders at the active cadence');
  harness.update({ scrollY: 2500, pointer: null });
  harness.advance(12000);
  const after = harness.controller.snapshot();
  assert.equal(after.targetFps, 30);
  assert.equal(after.pendingCallbacks, 1);
  assert.ok(Math.abs(harness.last().progress - base.progress) < 1e-6, 'the chapter pose is untouched');
});

test('the frame is resolved once before the interaction and the interaction receives it', () => {
  const calls = [];
  const spy = (profile) => {
    const real = createConnectedInteraction(profile);
    return {
      step(input) {
        const pose = real.step(input);
        calls.push({ input, pose });
        return pose;
      },
      clear: () => real.clear(),
      isSettled: () => real.isSettled(),
    };
  };
  const harness = createProfiledHarness({ createInteraction: spy });
  harness.update();
  harness.advance(500);
  assert.equal(calls.length, harness.renders.length, 'one interaction step per render');
  calls.forEach(({ input, pose }, index) => {
    assert.equal(pose.projectionLayout, input.layout, 'the final pose carries the frame the interaction used');
    assert.equal(harness.renders[index].projectionLayout, input.layout);
    const rests = restCssIn(harness.profile, input.layout);
    input.base.nodes.forEach((node, nodeIndex) => {
      const css = projectAnchor(node.position, input.layout);
      assert.ok(Math.hypot(css.xPx - rests[nodeIndex].x, css.yPx - rests[nodeIndex].y) < 1e-6, 'the base pose is already in the resolved frame');
    });
  });
  assert.ok(calls[0].input.layout.crop && calls[0].input.layout.width > harness.viewport.width, 'the first frame is the poster frame');
});

test('a hidden tab is not replayed and drops the pointer; the first frame back integrates no time', () => {
  const deltas = [];
  const spy = (profile) => {
    const real = createConnectedInteraction(profile);
    return {
      step(input) {
        deltas.push(input.deltaMs);
        return real.step(input);
      },
      clear: () => real.clear(),
      isSettled: () => real.isSettled(),
    };
  };
  const harness = createProfiledHarness({ createInteraction: spy });
  settleAtRest(harness);
  for (let frame = 0; frame < 20; frame += 1) {
    harness.update({ pointer: { x: 780 + frame * 4, y: 330, vx: 240, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  harness.update({ visible: false });
  assert.equal(harness.controller.snapshot().state, 'suspended');
  assert.equal(harness.pending(), 0);
  harness.advance(60000);
  deltas.length = 0;
  harness.update({ visible: true });
  assert.equal(deltas[0], 0, 'the first frame after the hidden minute integrates no time');
  assert.ok(!harness.last().excitation?.some((record) => record.value > 0.3), 'the stale pointer was dropped, not replayed');
  harness.advance(12000);
  assert.equal(harness.pending(), 0);
});

test('Pause clears the stimulation at once and nothing is scheduled until Resume', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  for (let frame = 0; frame < 30; frame += 1) {
    harness.update({ pointer: { x: 780 + frame * 4, y: 330, vx: 240, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  assert.ok(Math.max(...displacements(harness.profile, harness.last())) > 1);
  harness.controller.pause();
  assert.equal(harness.controller.snapshot().state, 'paused');
  assert.equal(harness.pending(), 0);
  harness.update({ pointer: { x: 800, y: 330, vx: 900, vy: 0 }, scrollDeltaPx: 90 });
  assert.equal(harness.pending(), 0, 'input while paused schedules nothing');
  const count = harness.renders.length;
  harness.advance(5000);
  assert.equal(harness.renders.length, count);
  harness.controller.resume();
  harness.advance(2000);
  assert.deepEqual(harness.last().nodes.map((node) => node.position), harness.profile.graph.nodes.map((node) => node.anchor), 'resumed at rest, not mid-motion');
  assert.equal(harness.pending(), 0);
});

test('a disposed controller keeps no callbacks and a callback the host already queued stays inert', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  harness.update({ pointer: { x: 780, y: 330, vx: 0, vy: 0 } });
  assert.equal(harness.pending(), 1);
  harness.controller.dispose();
  const count = harness.renders.length;
  harness.advance(5000);
  assert.equal(harness.renders.length, count);
  harness.update({ pointer: { x: 790, y: 330, vx: 100, vy: 0 } });
  assert.equal(harness.pending(), 0);
  assert.equal(harness.controller.snapshot().state, 'disposed');
});

test('a new profile on update replaces the interaction: a resize is a state update, not a gesture', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  for (let frame = 0; frame < 30; frame += 1) {
    harness.update({ pointer: { x: 780 + frame * 4, y: 330, vx: 240, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  const resized = { width: 1200, height: 800 };
  const next = getConnectedProfile('studio', 'wide', resized);
  harness.setLayout({ footerDocumentTop: 500000, viewportWidth: resized.width, viewportHeight: resized.height });
  harness.update({ profile: next, graph: next.graph, pointer: null });
  const pose = harness.last();
  assert.deepEqual(pose.nodes.map((node) => node.position), next.graph.nodes.map((node) => node.anchor), 'the new rest pose, nothing replayed');
  assert.equal(pose.projectionLayout.width, resized.width);
  harness.advance(12000);
  assert.equal(harness.pending(), 0);
});

test('an unusable layout is skipped, not thrown: the render keeps going without a frame or interaction', () => {
  const harness = createProfiledHarness();
  harness.setLayout({ footerDocumentTop: 500000, viewportWidth: 0, viewportHeight: 0 });
  harness.update();
  harness.advance(500);
  assert.ok(harness.renders.length > 0);
  assert.equal(harness.last().projectionLayout, undefined);
  assert.ok(harness.last().nodes.every((node) => node.position.every(Number.isFinite)));
});

test('a controller without a profile is unchanged: no frame, no strings, no excitation', () => {
  const harness = createHarness();
  harness.controller.update(update());
  harness.advance(500);
  const pose = harness.renders[harness.renders.length - 1];
  assert.equal(pose.projectionLayout, undefined);
  assert.equal(pose.edgeSamples, undefined);
  assert.equal(pose.excitation, undefined);
  harness.controller.update({ ...update(), pointer: { x: 100, y: 100, vx: 500, vy: 0 }, scrollDeltaPx: 50 });
  harness.advance(500);
  assert.equal(harness.renders[harness.renders.length - 1].edgeSamples, undefined, 'pointer input without a profile is ignored');
});

test('the snapshot pose is the final rendered pose, frame included', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  assert.equal(harness.controller.snapshot().pose, harness.last());
  harness.update({ pointer: { x: 780, y: 330, vx: 200, vy: 0 } });
  harness.advance(FRAME_MS * 4);
  assert.equal(harness.controller.snapshot().pose, harness.last());
  assert.ok(harness.controller.snapshot().pose.projectionLayout);
});

test('a tier change swaps the profile: the new interaction knows the compact graph, not the wide one', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  for (let frame = 0; frame < 20; frame += 1) {
    harness.update({ pointer: { x: 780 + frame * 4, y: 330, vx: 240, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  const compact = getConnectedProfile('studio', 'compact', VIEWPORTS.compact);
  harness.setLayout({ footerDocumentTop: 500000, viewportWidth: VIEWPORTS.compact.width, viewportHeight: VIEWPORTS.compact.height });
  harness.update({ profile: compact, graph: compact.graph, tier: 'compact', pointer: null });
  harness.advance(FRAME_MS * 4);
  assert.equal(harness.last().nodes.length, 8);
  harness.update({ profile: compact, graph: compact.graph, tier: 'compact', pointer: { x: 100, y: 330, vx: 0, vy: 0 } });
  for (let frame = 0; frame < 30; frame += 1) {
    harness.update({ profile: compact, graph: compact.graph, tier: 'compact', pointer: { x: 100 + frame * 3, y: 330, vx: 180, vy: 0 } });
    harness.advance(FRAME_MS);
  }
  const pose = harness.last();
  assert.equal(pose.nodes.length, 8);
  assert.deepEqual(pose.edgeSamples.map((sample) => sample.id), compact.graph.edges.map((edge) => edge.id), 'strings follow the compact connections');
  assert.ok(Math.max(...displacements(compact, pose)) <= 14 + 1e-6, 'the compact cap of 14px applies');
});

// --- Reviewer R findings on PR 145 -----------------------------------------------------------------------------------

function nodeCss(harness) {
  return harness.last().nodes.map((node) => {
    const css = projectAnchor(node.position, harness.last().projectionLayout);
    return [css.xPx, css.yPx];
  });
}

test('a slow pointer gives the same result at 60 and 120 events per second, through the real controller', () => {
  const stream = (hz) => {
    const harness = createProfiledHarness();
    settleAtRest(harness);
    const total = 4 * hz;
    for (let k = 0; k <= total; k += 1) {
      const t = k / hz;
      harness.update({ pointer: { x: 700 + 20 * t, y: 350, vx: 20, vy: 0 } });
      harness.advance(1000 / hz);
    }
    return nodeCss(harness);
  };
  const slow = stream(60);
  const fast = stream(120);
  let worst = 0;
  slow.forEach(([x, y], index) => {
    worst = Math.max(worst, Math.hypot(x - fast[index][0], y - fast[index][1]));
  });
  assert.ok(worst <= 1.5, `60/120Hz slow-pointer difference ${worst}px`);
});

test('a pointer creeping in sub-pixel steps still ages, wakes and draws a sleeping scene', () => {
  const harness = createProfiledHarness();
  settleAtRest(harness);
  harness.update({ pointer: { x: 700, y: 350, vx: 0, vy: 0 } });
  harness.advance(15000);
  assert.equal(harness.pending(), 0, 'asleep with the pointer held still');
  const before = harness.renders.length;
  let woke = false;
  for (let step = 1; step <= 600; step += 1) {
    harness.update({ pointer: { x: 700 + step * 0.2, y: 350, vx: 12, vy: 0 } });
    if (harness.pending() > 0) woke = true;
    harness.advance(FRAME_MS);
  }
  assert.ok(woke, 'creeping movement wakes the scene');
  assert.ok(harness.renders.length > before + 100, `and keeps it drawing (${harness.renders.length - before} frames)`);
});

test('the controller reaches none of the physics modules through its static imports', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const { resolve, dirname } = await import('node:path');
  const reachable = (entry) => {
    const seen = new Set();
    const visit = (file) => {
      if (seen.has(file)) return;
      seen.add(file);
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/^\s*import\s+(?!type\b)(?:[^'"]*?\sfrom\s+)?['"](\.[^'"]+)['"]/gm)) {
        const target = resolve(dirname(file), match[1].endsWith('.ts') ? match[1] : `${match[1]}.ts`);
        if (existsSync(target)) visit(target);
      }
    };
    visit(entry);
    return [...seen].map((file) => file.replaceAll('\\', '/').split('/').pop());
  };
  const controller = reachable(resolve('lib/connected-studio/controller.ts'));
  for (const gated of ['projection.ts', 'rest-path.ts', 'profiles.ts', 'interaction.ts']) {
    assert.ok(!controller.includes(gated), `controller.ts must not statically reach ${gated} (reached: ${controller.join(', ')})`);
  }
  const kit = reachable(resolve('lib/connected-studio/interaction.ts'));
  for (const gated of ['projection.ts', 'rest-path.ts']) assert.ok(kit.includes(gated), `the profile kit carries ${gated}`);
});

test('a profile without the profile kit fails loudly instead of being silently ignored', () => {
  const profile = getConnectedProfile('studio', 'wide', VIEWPORTS.wide);
  const base = { clock: { now: () => 0 }, scheduler: { schedule: () => 1, cancel: () => undefined }, render: () => undefined, getLayout: () => ({ footerDocumentTop: 5000, viewportWidth: 1440, viewportHeight: 900 }) };
  assert.throws(() => createConnectedController({ ...base, profile }), /profile kit/);
  const controller = createConnectedController(base);
  assert.throws(() => controller.update({ graph: profile.graph, tier: 'wide', scrollY: 0, velocityPxPerSecond: 0, visible: true, footerDominant: false, profile }), /profile kit/);
});
