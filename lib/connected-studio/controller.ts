// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { isConnectedTier, measureConnectedProgress, sampleConnectedPose } from './model.ts';
import type {
  ConnectedController,
  ConnectedTier,
  ControllerOptions,
  SceneLayout,
  SceneSnapshot,
  SceneUpdate,
  ScenePose,
} from './types';

/** Ambient cadence caps (PC-6): 30fps wide and tablet, 20fps compact. */
const AMBIENT_FPS: Record<ConnectedTier, number> = { wide: 30, tablet: 30, compact: 20 };
/** Active scroll cadence, up to 60fps. */
const ACTIVE_FPS = 60;
const ACTIVE_INTERVAL_MS = 1000 / ACTIVE_FPS;
/** Scroll activity above this renders at the active cadence. */
const ACTIVE_ACTIVITY_THRESHOLD = 0.02;
/** A velocity older than this is a scroll that already ended: no scroll event means no input. */
const VELOCITY_STALE_MS = 120;
/**
 * The start pose eases to the scroll pose with this time constant, slower than the normal progress damping
 * so the network visibly settles instead of snapping. After six time constants the offset is under 0.3%
 * and the settle ends. Sonnet tuning (PC-7): accepted only through owner review of the rendered scene.
 */
const START_SETTLE_SECONDS = 0.5;
const START_SETTLE_END_SECONDS = START_SETTLE_SECONDS * 6;

type StartPose = NonNullable<ControllerOptions['startPose']>;

function validStartPose(pose: ControllerOptions['startPose']): pose is StartPose {
  return (
    pose !== undefined &&
    Number.isFinite(pose.progress) &&
    pose.progress >= 0 &&
    pose.progress <= 1 &&
    Number.isFinite(pose.idleAngleRadians)
  );
}

function sameLayout(a: SceneLayout | undefined, b: SceneLayout): boolean {
  return (
    a !== undefined &&
    a.footerDocumentTop === b.footerDocumentTop &&
    a.viewportWidth === b.viewportWidth &&
    a.viewportHeight === b.viewportHeight
  );
}

export function createConnectedController(options: ControllerOptions): ConnectedController {
  let state: SceneSnapshot['state'] = 'static';
  let userPaused = false;
  let input: SceneUpdate | undefined;
  let layout: SceneLayout | undefined;
  let targetProgress = 0;
  let pose: ScenePose | undefined;
  let pendingId: number | undefined;
  let pendingDueAt = 0;
  /** Bumped whenever pending work is cancelled, so a callback the host already queued stays inert. */
  let generation = 0;
  let renderCount = 0;
  let lastRenderAt = options.clock.now();
  let lastUpdateAt = options.clock.now();
  /** Spent on the first live frame: Pause, Resume, a hidden tab and a resize never replay it. */
  let pendingStart: StartPose | undefined = validStartPose(options.startPose) ? options.startPose : undefined;
  let settleFrom = 0;
  let settleStartedAt: number | undefined;

  function isActive(): boolean {
    return pose !== undefined && pose.scrollActivity > ACTIVE_ACTIVITY_THRESHOLD;
  }

  function ambientIntervalMs(): number {
    return 1000 / AMBIENT_FPS[input?.tier ?? 'wide'];
  }

  function cancelPending() {
    generation += 1;
    if (pendingId === undefined) return;
    options.scheduler.cancel(pendingId);
    pendingId = undefined;
  }

  function scheduleAt(dueAt: number) {
    cancelPending();
    pendingDueAt = dueAt;
    const token = generation;
    pendingId = options.scheduler.schedule(() => tick(token), Math.max(0, dueAt - options.clock.now()));
  }

  function renderNow() {
    if (!input) return;
    const now = options.clock.now();
    const stale = now - lastUpdateAt > VELOCITY_STALE_MS;
    let progress = targetProgress;
    let posterBlend = 0;
    if (settleStartedAt !== undefined) {
      const elapsed = (now - settleStartedAt) / 1000;
      if (elapsed >= START_SETTLE_END_SECONDS) settleStartedAt = undefined;
      else {
        posterBlend = Math.exp(-elapsed / START_SETTLE_SECONDS);
        progress = targetProgress + (settleFrom - targetProgress) * posterBlend;
      }
    }
    pose = sampleConnectedPose(pose, {
      graph: input.graph,
      tier: input.tier,
      progress,
      velocityPxPerSecond: stale ? 0 : input.velocityPxPerSecond,
      deltaSeconds: (now - lastRenderAt) / 1000,
    });
    pose = { ...pose, posterBlend };
    lastRenderAt = now;
    renderCount += 1;
    options.render(pose);
  }

  function tick(token: number) {
    if (token !== generation || state !== 'live') return;
    pendingId = undefined;
    renderNow();
    scheduleAt(lastRenderAt + (isActive() ? ACTIVE_INTERVAL_MS : ambientIntervalMs()));
  }

  /** Pause outranks visibility and the Footer; a stopped scene holds no callback and draws nothing. */
  function reconcile() {
    if (state === 'disposed') return;
    if (userPaused) {
      cancelPending();
      state = 'paused';
      return;
    }
    // An unknown tier fails closed: no pose can be sampled for it, so no work is scheduled.
    if (!input || !isConnectedTier(input.tier) || !input.visible || input.footerDominant) {
      // Footer handoff: the damped pose trails a fast scroll, so suspending as-is would freeze the
      // network part-grown. One last frame lands on the current target (every connection complete
      // by the model's completion-before-hiding rule), then no further work or draws. A hidden
      // tab draws nothing, so only the Footer takes this frame.
      if (state === 'live' && input && isConnectedTier(input.tier) && input.visible && input.footerDominant) {
        settleStartedAt = undefined;
        if (pose) pose = { ...pose, progress: targetProgress, scrollActivity: 0 };
        renderNow();
      }
      cancelPending();
      if (input) state = 'suspended';
      return;
    }
    if (state === 'live') return;
    // Entering live (first show, un-hide, Footer left, Resume) samples the current state: the pose
    // lands on the current scroll and rotation continues without integrating unseen time.
    state = 'live';
    lastRenderAt = options.clock.now();
    if (pendingStart && !pose) {
      // The very first live frame: the poster's pose, easing to the scroll pose from here.
      pose = { progress: pendingStart.progress, idleAngleRadians: pendingStart.idleAngleRadians, scrollActivity: 0, nodes: [], edges: [] };
      settleFrom = pendingStart.progress;
      settleStartedAt = lastRenderAt;
    } else if (pose) {
      settleStartedAt = undefined;
      pose = { ...pose, progress: targetProgress, scrollActivity: 0 };
    }
    pendingStart = undefined;
    renderNow();
    scheduleAt(lastRenderAt + ambientIntervalMs());
  }

  return {
    update(next) {
      if (state === 'disposed') return;
      const measured = options.getLayout();
      const changed = !input || input.graph !== next.graph || input.tier !== next.tier || !sameLayout(layout, measured);
      input = next;
      layout = measured;
      lastUpdateAt = options.clock.now();
      targetProgress = measureConnectedProgress(next.scrollY, measured.footerDocumentTop, measured.viewportHeight);
      // A new layout, graph or tier lands on the current geometry; only the idle angle carries over.
      // While the start pose is easing, fonts and images measuring the page again must not cancel it: it
      // keeps easing toward the (new) target. After the settle a changed layout lands on the geometry as before.
      if (changed && pose && settleStartedAt === undefined) pose = { ...pose, progress: targetProgress, scrollActivity: 0 };
      const wasLive = state === 'live';
      reconcile();
      if (!wasLive || state !== 'live') return;
      if (changed) renderNow();
      // An active scroll must not wait for a pending ambient frame.
      if (next.velocityPxPerSecond !== 0 && pendingId !== undefined) {
        const activeDueAt = lastRenderAt + ACTIVE_INTERVAL_MS;
        if (pendingDueAt > activeDueAt) scheduleAt(activeDueAt);
      }
    },
    pause() {
      userPaused = true;
      reconcile();
    },
    resume() {
      userPaused = false;
      reconcile();
    },
    snapshot() {
      return {
        state,
        pose: pose ?? { progress: 0, idleAngleRadians: 0, scrollActivity: 0, nodes: [], edges: [] },
        pendingCallbacks: pendingId === undefined ? 0 : 1,
        renderCount,
        targetFps: state === 'live' ? (isActive() ? ACTIVE_FPS : AMBIENT_FPS[input?.tier ?? 'wide']) : 0,
      };
    },
    dispose() {
      cancelPending();
      state = 'disposed';
    },
  };
}
