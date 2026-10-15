// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { isConnectedTier, measureConnectedProgress, sampleConnectedPose } from './model.ts';
// The projection and physics modules are deliberately not imported here: this controller is in the always-loaded client
// script, and the profile kit below is supplied by the gated runtime closure.
import type { ConnectedInteraction } from './interaction';
import type { computeProjectionLayout, resolvePosterProjection } from './projection';
import type { ConnectedSceneProfile } from './profiles';
import type {
  ConnectedController,
  ConnectedProjectionLayout,
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
/** Any change of position larger than float noise is movement, so age and waking never depend on the event rate. */
const POINTER_MOVE_EPSILON_PX = 1e-3;

type StartPose = NonNullable<ControllerOptions['startPose']>;

/** CSS px position and px/s velocity of the pointer, as the host measured them. The controller derives its age. */
export type ConnectedPointerInput = {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
};

/** The pure projection and physics a profiled controller calls. Supplied by the gated runtime closure (`connectedProfileKit`). */
export type ConnectedProfileKit = {
  readonly createInteraction: (profile: ConnectedSceneProfile) => ConnectedInteraction;
  readonly computeProjectionLayout: typeof computeProjectionLayout;
  readonly resolvePosterProjection: typeof resolvePosterProjection;
};

export type ConnectedControllerOptions = ControllerOptions & {
  /** The route profile. Without one the controller behaves exactly as it did before profiles. */
  readonly profile?: ConnectedSceneProfile;
  /** Required with a profile (the controller itself carries none of the physics). Tests may wrap `createInteraction`. */
  readonly profileKit?: ConnectedProfileKit;
};

const PROFILE_KIT_MESSAGE = 'connected-studio: a profile needs the profile kit (connectedProfileKit from interaction.ts)';

/** `SceneUpdate` plus the optional input of a profiled scene. Every added field may be omitted. */
export type ConnectedSceneUpdate = SceneUpdate & {
  /** A new profile (a resize rebuilds the Atlas anchors): the interaction restarts at rest, nothing is replayed. */
  readonly profile?: ConnectedSceneProfile;
  /** `undefined` keeps the last sample, `null` removes the pointer, a non-finite sample is ignored. */
  readonly pointer?: ConnectedPointerInput | null;
  /** Classified ordinary scroll distance since the previous update, in CSS px. Jumps and restores are not passed. */
  readonly scrollDeltaPx?: number;
  /** False removes new excitation at once and lets existing motion damp. Defaults to true. */
  readonly inputEnabled?: boolean;
};

export type ProfiledConnectedController = Omit<ConnectedController, 'update'> & {
  update(input: ConnectedSceneUpdate): void;
};

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

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function createConnectedController(options: ConnectedControllerOptions): ProfiledConnectedController {
  if (options.profile && !options.profileKit) throw new Error(PROFILE_KIT_MESSAGE);
  let state: SceneSnapshot['state'] = 'static';
  let userPaused = false;
  let input: SceneUpdate | undefined;
  let layout: SceneLayout | undefined;
  let targetProgress = 0;
  /** The model pose: chapter progress, scroll activity and the idle angle. Never carries the interaction. */
  let pose: ScenePose | undefined;
  /** The final pose the host drew: the model pose in its resolved frame, plus the interaction when there is one. */
  let output: ScenePose | undefined;
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

  // Profile, interaction and input. All of it is inert while there is no profile.
  let profile: ConnectedSceneProfile | undefined = options.profile;
  let interaction: ConnectedInteraction | undefined;
  let pointer: { x: number; y: number; vx: number; vy: number; movedAt: number } | undefined;
  let pendingScroll = 0;
  let inputEnabled = true;
  let nativeCache: { profile: ConnectedSceneProfile; width: number; height: number; tier: ConnectedTier; layout: ConnectedProjectionLayout } | undefined;

  function ensureInteraction(): ConnectedInteraction | undefined {
    if (!profile) return undefined;
    interaction ??= (options.profileKit as ConnectedProfileKit).createInteraction(profile);
    return interaction;
  }

  /** Motion still in flight: the controller must keep drawing until it settles. */
  function interactionAwake(): boolean {
    return interaction !== undefined && !interaction.isSettled();
  }

  function isActive(): boolean {
    return (pose !== undefined && pose.scrollActivity > ACTIVE_ACTIVITY_THRESHOLD) || interactionAwake();
  }

  function ambientIntervalMs(): number {
    return 1000 / AMBIENT_FPS[input?.tier ?? 'wide'];
  }

  function frameIntervalMs(): number {
    return isActive() ? ACTIVE_INTERVAL_MS : ambientIntervalMs();
  }

  /**
   * A scene with the sleep policy holds no callback once its poster ease has ended and its motion has settled; every
   * other scene (legacy, or no profile) keeps its capped ambient loop.
   */
  function wantsFrames(): boolean {
    if (profile?.ambient !== 'sleep') return true;
    return interactionAwake() || settleStartedAt !== undefined;
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

  /** Stops all stimulation at once: a pause, a hidden tab, the Footer and a disposal do not carry motion over. */
  function clearStimulation() {
    interaction?.clear();
    pointer = undefined;
    pendingScroll = 0;
  }

  function nativeLayoutFor(active: ConnectedSceneProfile, viewport: SceneLayout, tier: ConnectedTier): ConnectedProjectionLayout | undefined {
    if (
      nativeCache &&
      nativeCache.profile === active &&
      nativeCache.width === viewport.viewportWidth &&
      nativeCache.height === viewport.viewportHeight &&
      nativeCache.tier === tier
    ) {
      return nativeCache.layout;
    }
    try {
      const native = (options.profileKit as ConnectedProfileKit).computeProjectionLayout(active, { width: viewport.viewportWidth, height: viewport.viewportHeight, tier });
      nativeCache = { profile: active, width: viewport.viewportWidth, height: viewport.viewportHeight, tier, layout: native };
      return native;
    } catch {
      // An unmeasurable viewport yields no frame and no interaction rather than a non-finite pose.
      return undefined;
    }
  }

  /**
   * Resolves the native or poster frame once, then lets the interaction act in it: the interaction's CSS caps apply in the
   * frame the renderer and the labels use, and the final pose carries that frame to them.
   */
  function finalize(model: ScenePose, now: number, elapsedMs: number): ScenePose {
    if (!profile || !input || !layout) return model;
    const native = nativeLayoutFor(profile, layout, input.tier);
    if (!native) return model;
    const framed = (options.profileKit as ConnectedProfileKit).resolvePosterProjection(profile, model, native);
    const stepper = ensureInteraction() as ConnectedInteraction;
    const scroll = pendingScroll;
    pendingScroll = 0;
    return stepper.step({
      nowMs: now,
      deltaMs: elapsedMs,
      base: framed.pose,
      layout: framed.layout,
      pointer:
        inputEnabled && pointer
          ? { x: pointer.x, y: pointer.y, vx: pointer.vx, vy: pointer.vy, ageSeconds: Math.max(0, (now - pointer.movedAt) / 1000) }
          : null,
      scrollDeltaPx: inputEnabled ? scroll : 0,
    });
  }

  function renderNow() {
    if (!input) return;
    const now = options.clock.now();
    const elapsedMs = now - lastRenderAt;
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
      deltaSeconds: elapsedMs / 1000,
      fixedRest: profile?.nodeStyle === 'atlas',
    });
    pose = { ...pose, posterBlend };
    lastRenderAt = now;
    renderCount += 1;
    output = finalize(pose, now, elapsedMs);
    options.render(output);
  }

  function tick(token: number) {
    if (token !== generation || state !== 'live') return;
    pendingId = undefined;
    renderNow();
    if (wantsFrames()) scheduleAt(lastRenderAt + frameIntervalMs());
  }

  /** Pause outranks visibility and the Footer; a stopped scene holds no callback and draws nothing. */
  function reconcile() {
    if (state === 'disposed') return;
    if (userPaused) {
      cancelPending();
      clearStimulation();
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
      clearStimulation();
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
    if (wantsFrames()) scheduleAt(lastRenderAt + frameIntervalMs());
  }

  /** Records a host pointer sample; returns whether it is new input that must wake a sleeping scene. */
  function applyPointer(sample: ConnectedPointerInput | null, now: number): boolean {
    if (sample === null) {
      const had = pointer !== undefined;
      pointer = undefined;
      return had;
    }
    if (!finite(sample.x) || !finite(sample.y)) return false;
    const vx = finite(sample.vx) ? sample.vx : 0;
    const vy = finite(sample.vy) ? sample.vy : 0;
    const moved = !pointer || Math.hypot(sample.x - pointer.x, sample.y - pointer.y) > POINTER_MOVE_EPSILON_PX;
    pointer = { x: sample.x, y: sample.y, vx, vy, movedAt: moved || !pointer ? now : pointer.movedAt };
    return moved;
  }

  return {
    update(next) {
      if (state === 'disposed') return;
      if (next.profile && !options.profileKit) throw new Error(PROFILE_KIT_MESSAGE);
      const measured = options.getLayout();
      const now = options.clock.now();
      const nextProfile = next.profile ?? profile;
      const profileChanged = nextProfile !== profile;
      if (profileChanged) {
        // A new profile is a new rest pose (a resize): the old interaction and its stimulation are dropped, not replayed.
        clearStimulation();
        interaction = undefined;
        profile = nextProfile;
      }
      const changed =
        !input || input.graph !== next.graph || input.tier !== next.tier || !sameLayout(layout, measured) || profileChanged;
      input = next;
      layout = measured;
      lastUpdateAt = now;
      targetProgress = measureConnectedProgress(next.scrollY, measured.footerDocumentTop, measured.viewportHeight);
      // Input only matters to a profiled scene that is allowed to draw; everything else drops it.
      let inputChanged = false;
      if (profile) {
        if (next.inputEnabled !== undefined && next.inputEnabled !== inputEnabled) {
          inputEnabled = next.inputEnabled;
          if (!inputEnabled) {
            // New excitation stops at once; the interaction keeps damping what is already moving.
            pointer = undefined;
            pendingScroll = 0;
          }
          inputChanged = true;
        }
        if (inputEnabled && state !== 'paused' && !userPaused) {
          if (next.pointer !== undefined && applyPointer(next.pointer, now)) inputChanged = true;
          if (finite(next.scrollDeltaPx) && next.scrollDeltaPx !== 0) {
            pendingScroll += next.scrollDeltaPx;
            inputChanged = true;
          }
        }
      }
      // A new layout, graph or tier lands on the current geometry; only the idle angle carries over.
      // While the start pose is easing, fonts and images measuring the page again must not cancel it: it
      // keeps easing toward the (new) target. After the settle a changed layout lands on the geometry as before.
      if (changed && pose && settleStartedAt === undefined) pose = { ...pose, progress: targetProgress, scrollActivity: 0 };
      const wasLive = state === 'live';
      reconcile();
      if (!wasLive || state !== 'live') return;
      if (changed) renderNow();
      // New input wakes a sleeping scene and must not wait for a pending ambient frame.
      if (inputChanged) {
        const dueAt = Math.max(options.clock.now(), lastRenderAt + ACTIVE_INTERVAL_MS);
        if (pendingId === undefined || pendingDueAt > dueAt) scheduleAt(dueAt);
      } else if (changed && pendingId === undefined && wantsFrames()) {
        scheduleAt(lastRenderAt + frameIntervalMs());
      }
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
      let targetFps = 0;
      if (state === 'live') {
        if (profile?.ambient === 'sleep') targetFps = interactionAwake() ? ACTIVE_FPS : settleStartedAt !== undefined ? AMBIENT_FPS[input?.tier ?? 'wide'] : 0;
        else targetFps = isActive() ? ACTIVE_FPS : AMBIENT_FPS[input?.tier ?? 'wide'];
      }
      return {
        state,
        pose: output ?? pose ?? { progress: 0, idleAngleRadians: 0, scrollActivity: 0, nodes: [], edges: [] },
        pendingCallbacks: pendingId === undefined ? 0 : 1,
        renderCount,
        targetFps,
      };
    },
    dispose() {
      cancelPending();
      clearStimulation();
      state = 'disposed';
    },
  };
}
