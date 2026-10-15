import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SPF-V1 Task 9 follow-up: frame pacing. The hardware candidate run on an RTX 2060 measured an
// active-scroll frame interval p95 of 34.1 ms against a 20 ms limit, while the same page scrolled with the scene
// paused held 16.8 ms. The host waited for the controller's due time with a timer and only then asked for an
// animation frame, so a timer that landed just after a vsync pushed that frame to the next refresh. These tests drive
// the real controller and the host scheduler with a virtual display (vsync clock, timers that fire late) so the
// property is checked deterministically: the cadence must not depend on how late a timer fires.

const { createConnectedController } = await import('../lib/connected-studio/controller.ts');
const { createFrameScheduler } = await import('../lib/connected-studio/frame-scheduler.ts');

const GRAPH = Object.freeze({
  quality: 'wide',
  nodes: Object.freeze([
    Object.freeze({ id: 'a', capabilityIndex: 0, anchor: [-1, 0.5, 0], seed: 0.25, depthScale: 1 }),
    Object.freeze({ id: 'b', capabilityIndex: 1, anchor: [1, -0.5, -0.4], seed: 0.75, depthScale: 0.8 }),
  ]),
  edges: Object.freeze([Object.freeze({ id: 'a-b', from: 'a', to: 'b', revealStart: 0, revealEnd: 1 })]),
});
const LAYOUT = Object.freeze({ footerDocumentTop: 500000, viewportWidth: 1440, viewportHeight: 900 });

/**
 * A virtual display. Animation-frame callbacks run at each vsync; timers fire after their delay (truncated to a
 * whole millisecond, as browsers do) plus a lateness: usually a fraction of a millisecond, with occasional spikes of
 * one to three milliseconds, which is what a busy main thread does to a timer. Seeded, so every run is identical.
 */
function createVirtualDisplay({ refreshHz = 60, spikeRate = 0.05, seed = 7 } = {}) {
  const frame = 1000 / refreshHz;
  let now = 0;
  let lastVsync = 0;
  let nextId = 1;
  let state = seed;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  const timers = new Map();
  const frames = new Map();
  const env = {
    now: () => now,
    setTimeout(callback, delayMs) {
      const id = nextId++;
      const lateness = random() < spikeRate ? 1 + random() * 2 : random() * 0.25;
      timers.set(id, { at: now + Math.trunc(Math.max(0, delayMs)) + lateness, callback });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame(callback) {
      const id = nextId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  function runUntil(end) {
    for (;;) {
      let timerId = null;
      let timerAt = Infinity;
      for (const [id, timer] of timers) {
        if (timer.at < timerAt) {
          timerAt = timer.at;
          timerId = id;
        }
      }
      const vsyncAt = (lastVsync + 1) * frame;
      const at = Math.min(timerAt, vsyncAt);
      if (at > end) break;
      now = Math.max(now, at);
      if (timerAt <= vsyncAt) {
        const timer = timers.get(timerId);
        timers.delete(timerId);
        timer.callback();
      } else {
        lastVsync += 1;
        const due = [...frames];
        frames.clear();
        for (const [, callback] of due) callback();
      }
    }
    now = Math.max(now, end);
  }
  return { env, runUntil, busy: (ms) => (now += ms), now: () => now, frame, pendingTimers: () => timers.size, pendingFrames: () => frames.size };
}

function createScene({ refreshHz, spikeRate, tier = 'wide', renderCostMs = 0.35 } = {}) {
  const display = createVirtualDisplay({ refreshHz, spikeRate });
  const scheduling = createFrameScheduler(display.env);
  const renderTimes = [];
  const controller = createConnectedController({
    clock: { now: () => display.now() },
    scheduler: scheduling.scheduler,
    render: () => {
      renderTimes.push(display.now());
      display.busy(renderCostMs);
    },
    getLayout: () => LAYOUT,
  });
  const update = (scrollY, velocityPxPerSecond) =>
    controller.update({ graph: GRAPH, tier, scrollY, velocityPxPerSecond, visible: true, footerDominant: false });
  return { display, scheduling, controller, renderTimes, update };
}

const intervals = (times, from = 0) => {
  const out = [];
  for (let i = 1; i < times.length; i += 1) if (times[i] >= from) out.push(times[i] - times[i - 1]);
  return out;
};
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
};

/** Native wheel-like scrolling: an input every 16 ms for `ms`, from `startAt`. */
function scroll(scene, startAt, ms) {
  scene.update(0, 0);
  for (let t = 0; t <= ms; t += 16) {
    scene.display.runUntil(startAt + t);
    scene.update(1000 + t * 2, 1500);
  }
}

test('active scrolling renders on every refresh and does not depend on how late a timer fires', () => {
  const scene = createScene();
  scroll(scene, 0, 6000);
  const gaps = intervals(scene.renderTimes, 1000);
  assert.ok(gaps.length > 250, `expected a long active run, got ${gaps.length} intervals`);
  const slow = gaps.filter((gap) => gap > 25).length;
  assert.ok(slow / gaps.length <= 0.01, `${slow} of ${gaps.length} active intervals (${((slow / gaps.length) * 100).toFixed(1)}%) took two refreshes or more; p95 ${percentile(gaps, 95).toFixed(1)} ms`);
  assert.ok(percentile(gaps, 95) <= 18, `active interval p95 ${percentile(gaps, 95).toFixed(1)} ms must stay within a refresh`);
});

test('a render that takes 4 ms does not push the next frame to the following refresh', () => {
  const scene = createScene({ renderCostMs: 4 });
  scroll(scene, 0, 6000);
  const gaps = intervals(scene.renderTimes, 1000);
  assert.ok(percentile(gaps, 95) <= 18, `active interval p95 ${percentile(gaps, 95).toFixed(1)} ms with a 4 ms render`);
});

test('ambient cadence reaches its cap on a 60 Hz display and never exceeds it', () => {
  for (const [tier, cap] of [['wide', 30], ['compact', 20]]) {
    const scene = createScene({ tier });
    scene.update(0, 0);
    scene.display.runUntil(8000);
    const gaps = intervals(scene.renderTimes, 1000);
    const fps = 1000 / (gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length);
    assert.ok(fps <= cap + 0.2, `${tier} ambient ${fps.toFixed(1)} fps must not exceed ${cap}`);
    assert.ok(fps >= cap - 2, `${tier} ambient ${fps.toFixed(1)} fps should reach its ${cap} fps cap, not a fraction of it`);
    assert.ok(Math.min(...gaps) >= 1000 / cap - 1.01, `${tier}: no ambient frame earlier than the cap allows`);
  }
});

test('active cadence is capped at 60 fps on a faster display', () => {
  for (const refreshHz of [120, 144, 240]) {
    const scene = createScene({ refreshHz });
    scroll(scene, 0, 4000);
    const gaps = intervals(scene.renderTimes, 1000);
    assert.ok(Math.min(...gaps) >= 1000 / 60 - 1.01, `${refreshHz} Hz: an active frame came ${Math.min(...gaps).toFixed(1)} ms after the last`);
  }
});

test('a callback never runs earlier than a millisecond before it is due', () => {
  const display = createVirtualDisplay({ spikeRate: 0 });
  const { scheduler } = createFrameScheduler(display.env);
  for (const delay of [0, 5, 16.6, 33.3, 50, 120]) {
    const scheduledAt = display.now();
    let ranAt = null;
    scheduler.schedule(() => {
      ranAt = display.now();
    }, delay);
    display.runUntil(scheduledAt + delay + 100);
    assert.ok(ranAt !== null, `delay ${delay} ran`);
    assert.ok(ranAt >= scheduledAt + delay - 1.01, `delay ${delay} ran ${(scheduledAt + delay - ranAt).toFixed(2)} ms early`);
  }
});

test('a long wait sleeps on one timer and only watches animation frames near its due time', () => {
  const display = createVirtualDisplay({ spikeRate: 0 });
  const { scheduler } = createFrameScheduler(display.env);
  scheduler.schedule(() => undefined, 50);
  assert.equal(display.pendingTimers(), 1, 'one wake-up timer');
  assert.equal(display.pendingFrames(), 0, 'no animation-frame polling during the long sleep');
  display.runUntil(30);
  assert.ok(display.pendingFrames() <= 1, 'one animation frame is watched once the timer has woken it');
});

test('cancelling clears whichever stage is pending, and a stopped scene holds nothing', () => {
  const scene = createScene();
  scene.update(0, 0);
  scene.display.runUntil(500);
  assert.ok(scene.scheduling.size() > 0, 'a live scene holds a pending callback');
  scene.controller.pause();
  assert.equal(scene.scheduling.size(), 0, 'paused: nothing pending');
  assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0, 'paused: no timer and no animation frame');
  const drawn = scene.renderTimes.length;
  scene.display.runUntil(2500);
  assert.equal(scene.renderTimes.length, drawn, 'paused: no draws');
  scene.controller.resume();
  scene.display.runUntil(3500);
  assert.ok(scene.renderTimes.length > drawn, 'resume draws again');
  scene.controller.dispose();
  scene.scheduling.cancelAll();
  assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0, 'disposed: nothing scheduled');
});

// --- PLAN-SFC-V1 Task 4: a sleeping Atlas scene on the real host scheduler ------------------------------------------
const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
const { CONNECTED_POSTER_POSE } = await import('../lib/connected-studio/media-manifest.ts');

function createAtlasScene({ refreshHz = 60 } = {}) {
  const display = createVirtualDisplay({ refreshHz, spikeRate: 0.05 });
  const scheduling = createFrameScheduler(display.env);
  const profile = getConnectedProfile('studio', 'wide', { width: 1440, height: 900 });
  const renderTimes = [];
  const controller = createConnectedController({
    clock: { now: () => display.now() },
    scheduler: scheduling.scheduler,
    startPose: CONNECTED_POSTER_POSE,
    profile,
    render: () => {
      renderTimes.push(display.now());
      display.busy(0.35);
    },
    getLayout: () => LAYOUT,
  });
  const update = (extra = {}) =>
    controller.update({ graph: profile.graph, tier: 'wide', scrollY: 0, velocityPxPerSecond: 0, visible: true, footerDominant: false, ...extra });
  return { display, scheduling, controller, renderTimes, update };
}

test('a settled Atlas scene holds no timer, no animation frame and no draw; a pointer wakes it at up to 60 fps and it sleeps again', () => {
  for (const refreshHz of [60, 144]) {
    const scene = createAtlasScene({ refreshHz });
    scene.update();
    scene.display.runUntil(6000);
    assert.equal(scene.scheduling.size(), 0, `${refreshHz} Hz: nothing pending once the poster ease is over`);
    assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0, `${refreshHz} Hz: no timer and no animation frame while asleep`);
    const asleepDraws = scene.renderTimes.length;
    scene.display.runUntil(16000);
    assert.equal(scene.renderTimes.length, asleepDraws, `${refreshHz} Hz: no draws while asleep`);

    const wokenAt = scene.display.now();
    for (let t = 0; t <= 1000; t += 16) {
      scene.display.runUntil(wokenAt + t);
      scene.update({ pointer: { x: 780 + t * 0.2, y: 330, vx: 200, vy: 0 } });
    }
    const gaps = intervals(scene.renderTimes.filter((time) => time >= wokenAt), 0);
    assert.ok(gaps.length > 20, `${refreshHz} Hz: frames were drawn while the pointer moved`);
    assert.ok(Math.min(...gaps) >= 1000 / 60 - 1.01, `${refreshHz} Hz: active frames never beat 60 fps (smallest gap ${Math.min(...gaps).toFixed(1)} ms)`);

    scene.update({ pointer: null });
    scene.display.runUntil(scene.display.now() + 12000);
    assert.equal(scene.scheduling.size(), 0, `${refreshHz} Hz: asleep again after the tail`);
    assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0);
    const settled = scene.renderTimes.length;
    scene.display.runUntil(scene.display.now() + 8000);
    assert.equal(scene.renderTimes.length, settled, `${refreshHz} Hz: and no draw follows`);
  }
});

test('pausing or hiding an awake Atlas scene cancels the host timer and animation frame at once', () => {
  const scene = createAtlasScene();
  scene.update();
  scene.display.runUntil(6000);
  for (let t = 0; t <= 300; t += 16) {
    scene.display.runUntil(6000 + t);
    scene.update({ pointer: { x: 780 + t, y: 330, vx: 300, vy: 0 } });
  }
  assert.ok(scene.scheduling.size() > 0, 'awake: a callback is pending');
  scene.controller.pause();
  assert.equal(scene.scheduling.size(), 0);
  assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0, 'paused: no timer and no animation frame');
  scene.controller.resume();
  scene.update({ visible: false });
  assert.equal(scene.display.pendingTimers() + scene.display.pendingFrames(), 0, 'hidden: no timer and no animation frame');
});
