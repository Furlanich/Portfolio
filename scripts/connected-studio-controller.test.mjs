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

function createHarness({ layout = LAYOUT } = {}) {
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
