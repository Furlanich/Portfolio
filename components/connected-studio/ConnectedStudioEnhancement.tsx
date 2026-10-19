'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import { CONNECTED_LIVE_POLICY, chooseConnectedMode } from '@/lib/connected-studio/capability';
import { createConnectedController, type ConnectedPointerInput, type ProfiledConnectedController } from '@/lib/connected-studio/controller';
import { createFrameScheduler, type FrameEnvironment } from '@/lib/connected-studio/frame-scheduler';
import { isOccludedAt, resolveLabelVisibility, resolveNodeWord, type LabelWordSource } from '@/lib/connected-studio/labels';
import { CONNECTED_POSTER_POSE } from '@/lib/connected-studio/media-manifest';
import { getQualityForTier, getTierForWidth, isFooterDominant } from '@/lib/connected-studio/model';
import { markConnectedContextLost, readConnectedSession, setConnectedPaused } from '@/lib/connected-studio/session';
import { isSoftwareRenderer } from '@/lib/immersive-home/capability';
import type {
  CapabilityWords,
  ConnectedLivePolicy,
  ConnectedRoute,
  ConnectedTier,
  ConnectedWordBinding,
  GraphDefinition,
  LabelBox,
  LabelProjection,
  LegacyConnectedRoute,
  OccluderRect,
  ProfileConnectedRoute,
  SceneLayout,
  ScenePose,
  SceneSnapshot,
} from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { ConnectedPauseControl } from './ConnectedPauseControl';
import {
  createFormSuspension,
  createPointerSampler,
  createScrollClassifier,
  exclusionRects,
  isEditableTarget,
  isExcluded,
  isInteractiveTarget,
  labelOccluders,
  type ConnectedBox,
} from './connected-input';
import styles from './connected-studio.module.css';

type ConnectedStudioEnhancementProps = { locale: Locale } & (
  | {
      route: LegacyConnectedRoute;
      /** The localized eight-word vocabulary, for the engine's labels. */
      capabilityWords: CapabilityWords;
    }
  | {
      route: ProfileConnectedRoute;
      /** Decorative node words of a profile route; consumed by the PLAN-SFC-V1 Task 11 host. */
      wordBindings: readonly ConnectedWordBinding[];
    }
);

/**
 * The non-production diagnostics shape behind `window.__FURLANICH_CONNECTED__` (development and test
 * builds only), following Home's `__FURLANICH_SKY_CHART__` precedent. The Playwright helpers read it.
 * The counters span the page lifetime, so they also witness what a static page did *not* do: a gated
 * page never counts an import, a canvas or a renderer.
 */
export type ConnectedDiagnostics = {
  route: ConnectedRoute;
  mode: 'static' | 'live' | 'failed';
  controller: SceneSnapshot['state'] | 'none';
  renderCount: number;
  /** The highest scroll impulse any drawn frame has carried since the scene attached (0 to 1). */
  peakScrollActivity: number;
  /** The controller's own pending count. */
  pendingCallbacks: number;
  /** Timers and animation frames the browser scheduler actually holds; zero whenever the scene is stopped. */
  schedulerPending: number;
  targetFps: number;
  progress: number;
  idleAngleRadians: number;
  nodes: readonly { id: string; position: readonly [number, number, number] }[];
  edgeGrowth: readonly number[];
  drawCalls: number;
  pixelRatio: number;
  tier: ConnectedTier | null;
  /** The cached layout the controller reads: where the Footer starts in the document, and the viewport. */
  layout: SceneLayout | null;
  /** Times the dynamic engine import was started. */
  imports: number;
  /** Times the bounded wait for Home's renderer ran out, after which the page stays static. */
  deferralsExhausted: number;
  /** Batched layout passes (boxes, label sizes, viewport) since the page loaded. Pointer movement and scrolling never add one. */
  layoutReads: number;
  /** The inquiry form holds focus or is submitting, or no eligible background input has arrived since. */
  formSuspended: boolean;
  /** A mouse position is currently driving the interaction. */
  pointerActive: boolean;
  /** The profile in use: its route, tier and node style. */
  profile: { route: ConnectedRoute; tier: ConnectedTier; nodeStyle: string; wordNodeIds: readonly string[] } | null;
  /**
   * The seven final points (anchor space) of every string the pose bends, by graph edge id. Empty for a scene at rest,
   * so rendered evidence can measure pins, caps and settling without reading the canvas.
   */
  edgeSamples: readonly { id: string; points: readonly (readonly [number, number, number])[] }[];
};

type LiveReading = Omit<ConnectedDiagnostics, 'route' | 'imports' | 'deferralsExhausted' | 'layoutReads'>;

const counters = { imports: 0, deferralsExhausted: 0, layoutReads: 0 };

const STATIC_READING: LiveReading = {
  mode: 'static',
  controller: 'none',
  renderCount: 0,
  peakScrollActivity: 0,
  pendingCallbacks: 0,
  schedulerPending: 0,
  targetFps: 0,
  progress: 0,
  idleAngleRadians: 0,
  nodes: [],
  edgeGrowth: [],
  drawCalls: 0,
  pixelRatio: 0,
  tier: null,
  layout: null,
  formSuspended: false,
  pointerActive: false,
  profile: null,
  edgeSamples: [],
};

/** Installs the diagnostics hook; production builds never do. Returns the setter for the live reading. */
function installDiagnostics(route: ConnectedRoute): (reading: (() => LiveReading) | null) => void {
  if (process.env.NODE_ENV === 'production') return () => undefined;
  let reading: (() => LiveReading) | null = null;
  (window as typeof window & { __FURLANICH_CONNECTED__?: { read(): ConnectedDiagnostics } }).__FURLANICH_CONNECTED__ = {
    read: () => ({ route, imports: counters.imports, deferralsExhausted: counters.deferralsExhausted, layoutReads: counters.layoutReads, ...(reading ? reading() : STATIC_READING) }),
  };
  return (next) => {
    reading = next;
  };
}

type WebglProbe = { available: boolean; softwareRenderer: boolean };

/**
 * A coarse WebGL2 probe on a throwaway canvas. The probe context is released immediately
 * (`WEBGL_lose_context`), before the engine creates its own, so the page never holds two.
 */
function probeWebgl(): WebglProbe {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    if (!gl) return { available: false, softwareRenderer: false };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const softwareRenderer = isSoftwareRenderer(renderer);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { available: true, softwareRenderer };
  } catch {
    return { available: false, softwareRenderer: false };
  }
}

/**
 * The controlled test hook (`tests/e2e/support/connected-studio-test-hooks.ts`), set only by
 * `page.addInitScript`. It is read as data and never from a query string, storage or UI.
 */
function readTestHook(): { allowSoftwareRenderer: boolean; livePolicy?: ConnectedLivePolicy } {
  const hook = (window as typeof window & { __FURLANICH_CONNECTED_TEST__?: { allowSoftwareRenderer?: unknown; livePolicy?: { wide?: unknown; compact?: unknown } } }).__FURLANICH_CONNECTED_TEST__;
  const policy = hook?.livePolicy;
  return {
    allowSoftwareRenderer: hook?.allowSoftwareRenderer === true,
    livePolicy:
      policy && typeof policy.wide === 'boolean' && typeof policy.compact === 'boolean'
        ? { wide: policy.wide, compact: policy.compact }
        : undefined,
  };
}

/** Preferences known at activation. With reduced motion, Save-Data or forced colors set, the optional engine is never fetched. */
function readPreferences(): { reducedMotion: boolean; saveData: boolean; forcedColors: boolean } {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: connection?.saveData === true,
    // Forced colors removes the decorative environment (DESIGN-SPF-V1), so the scene would draw unseen.
    forcedColors: window.matchMedia('(forced-colors: active)').matches,
  };
}

function readLayout(): SceneLayout {
  const footer = document.querySelector<HTMLElement>('[data-site-footer]');
  return {
    footerDocumentTop: footer ? footer.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

/** Home's canvas (`create-sky-chart-scene`). Connected routes read its presence and never touch it. */
const HOME_RENDERER_SELECTOR = 'canvas[data-sky-chart-canvas]';
const DEFERRAL_INTERVAL_MS = 250;
const MAX_DEFERRALS = 40;

/** Idle time after `load` before the optional engine starts, so first paint and layout always come first. */
const ACTIVATION_DELAY_MS = 250;

/** Runs `callback` once the page has loaded plus the activation delay; the returned function cancels it. */
function scheduleAfterLoad(callback: () => void): () => void {
  let timer = 0;
  const arm = () => {
    timer = window.setTimeout(callback, ACTIVATION_DELAY_MS);
  };
  if (document.readyState === 'complete') arm();
  else window.addEventListener('load', arm, { once: true });
  return () => {
    window.removeEventListener('load', arm);
    window.clearTimeout(timer);
  };
}

/** The browser primitives the frame scheduler runs on. */
const browserFrameEnvironment: FrameEnvironment = {
  now: () => performance.now(),
  setTimeout: (callback, delayMs) => window.setTimeout(callback, delayMs),
  clearTimeout: (id) => window.clearTimeout(id),
  requestAnimationFrame: (callback) => window.requestAnimationFrame(() => callback()),
  cancelAnimationFrame: (id) => window.cancelAnimationFrame(id),
};

type LabelEntry = {
  id: string;
  element: HTMLElement;
  width: number;
  height: number;
  depthScale: number;
  visible: boolean;
  occluded: boolean;
  x: number;
  y: number;
};

/**
 * The projected DOM labels (DESIGN-SPF-V1, "Motion and interaction contract"): one upright, decorative,
 * pointer-inert word per node that carries one, placed from the engine's projections and then clamped,
 * occlusion-checked and de-overlapped by `resolveLabelVisibility` (PC-2). Sizes and the cached foreground
 * boxes (opaque plates, reading scrims, legacy masks) are measured in one batch (`measure`), so a frame reads
 * no layout: it only reads the scroll offset and the App Bar. The same boxes feed the pointer exclusion.
 */
function createLabelLayer(mount: HTMLElement) {
  const host = document.createElement('div');
  host.setAttribute('data-connected-labels', '');
  host.className = styles.labels;
  mount.appendChild(host);
  let entries: LabelEntry[] = [];
  let byId = new Map<string, LabelEntry>();
  let boxes: ConnectedBox[] = [];
  let appBarRect: OccluderRect | null = null;
  let viewport = { width: 0, height: 0 };

  return {
    /** One element per node that carries a word; call again when the graph or the profile changes. */
    rebuild(graph: GraphDefinition, source: LabelWordSource) {
      host.replaceChildren();
      entries = [];
      for (const node of graph.nodes) {
        const word = resolveNodeWord(node, source);
        if (word === undefined) continue;
        const element = document.createElement('span');
        element.className = styles.label;
        element.setAttribute('data-connected-label', '');
        element.dataset.nodeId = node.id;
        element.dataset.visible = 'false';
        element.textContent = word;
        host.appendChild(element);
        entries.push({ id: node.id, element, width: 0, height: 0, depthScale: node.depthScale, visible: false, occluded: false, x: 0, y: 0 });
      }
      byId = new Map(entries.map((entry) => [entry.id, entry]));
    },
    /** Batched layout reads: label sizes, the viewport the labels live in, and the foreground boxes. */
    measure() {
      counters.layoutReads += 1;
      for (const entry of entries) {
        entry.width = entry.element.offsetWidth;
        entry.height = entry.element.offsetHeight;
      }
      viewport = { width: mount.clientWidth, height: mount.clientHeight };
      const scrollY = window.scrollY;
      boxes = Array.from(
        document.querySelectorAll<HTMLElement>('[data-connected-opaque-plate],[data-connected-reading-mask]'),
      ).map((element) => {
        const rect = element.getBoundingClientRect();
        const isMask = element.hasAttribute('data-connected-reading-mask');
        const clearance = Number(element.getAttribute('data-connected-clearance'));
        const kind: ConnectedBox['kind'] = isMask ? (Number.isFinite(clearance) && clearance > 0 ? 'scrim' : 'legacy') : 'plate';
        return { kind, left: rect.left, docTop: rect.top + scrollY, width: rect.width, height: rect.height, clearance: kind === 'scrim' ? clearance : 0 };
      });
      // The App Bar is sticky with a fixed height, so its viewport box only changes with the viewport: cached here.
      const bar = document.querySelector<HTMLElement>('[data-app-bar]')?.getBoundingClientRect();
      appBarRect = bar ? { left: bar.left, top: bar.top, width: bar.width, height: bar.height } : null;
    },
    /** The cached boxes, for the pointer exclusion. */
    boxes: (): readonly ConnectedBox[] => boxes,
    update(projections: readonly LabelProjection[], scrollY: number) {
      const labelBoxes: LabelBox[] = [];
      for (const projection of projections) {
        const entry = byId.get(projection.id);
        if (!entry || !projection.inView) continue;
        labelBoxes.push({
          id: entry.id,
          left: projection.xPx - entry.width / 2,
          top: projection.yPx,
          width: entry.width,
          height: entry.height,
          depthScale: projection.depthScale,
        });
      }
      const occluders: OccluderRect[] = labelOccluders(boxes, scrollY);
      if (appBarRect) occluders.push(appBarRect);
      const resolved = new Map(resolveLabelVisibility(labelBoxes, occluders, viewport).map((result) => [result.id, result]));
      for (const entry of entries) {
        const result = resolved.get(entry.id);
        const visible = result?.visible === true;
        // The labels sit in the fixed ground and reading surfaces scroll over them faster than any fade: an occluded
        // label goes at once (the CSS drops its transition), so it never shows inside a mask while it fades. A hidden
        // label keeps painting at its last position until it has faded, so a mask over that spot counts too, whatever
        // hid it (out of view, a nearer label, or an occluder at its new projection).
        const occluded =
          result?.occluded === true ||
          (!visible && isOccludedAt({ left: entry.x, top: entry.y, width: entry.width, height: entry.height }, occluders));
        if (occluded !== entry.occluded) {
          entry.occluded = occluded;
          entry.element.dataset.occluded = String(occluded);
        }
        if (result && visible && (entry.x !== result.left || entry.y !== result.top)) {
          entry.x = result.left;
          entry.y = result.top;
          entry.element.style.transform = `translate3d(${result.left}px, ${result.top}px, 0)`;
        }
        if (visible !== entry.visible) {
          entry.visible = visible;
          entry.element.dataset.visible = String(visible);
          entry.element.style.opacity = visible ? String(0.62 + 0.38 * entry.depthScale) : '0';
        }
      }
    },
    dispose() {
      host.remove();
    },
  };
}

type ConnectedEntry = typeof import('./runtime/create-connected-scene');
type SceneProfile = ReturnType<ConnectedEntry['getConnectedProfile']>;

type LiveOptions = {
  /** The dynamically imported gated entry: the renderer and the pure profile, interaction and controller kit. */
  entry: ConnectedEntry;
  mount: HTMLElement;
  route: ConnectedRoute;
  /** The localized vocabulary (Services, Projects) or the few words bound to node ids (Studio, Founder, Contact). */
  words: { capabilityWords: CapabilityWords } | { wordBindings: readonly ConnectedWordBinding[] };
  startPaused: boolean;
  livePolicy: ConnectedLivePolicy;
  publish: (reading: (() => LiveReading) | null) => void;
  onContextLost(): void;
  onIneligible(): void;
};

type LiveScene = { controller: ProfiledConnectedController; setVisitorPaused(paused: boolean): void; dispose(): void };

/** Keys that scroll the document. A key typed anywhere else is not a scroll gesture. */
const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);
const FORM_SELECTOR = 'form[data-inquiry-phase]';

/**
 * Builds the live scene: the engine, the controller and the browser bindings. Every acquisition
 * pushes its release onto one stack, so a failure at any step, or the final dispose, releases
 * exactly what was built, in reverse order. A throw leaves nothing behind.
 */
function attachLiveScene(options: LiveOptions): LiveScene {
  const { entry } = options;
  const releases: Array<() => void> = [];
  const ground = options.mount.closest<HTMLElement>('[data-connected-ground]');
  let released = false;
  let firstDraw = true;
  releases.push(() => { if (ground) delete ground.dataset.connectedLive; });
  const dispose = () => {
    released = true;
    while (releases.length) {
      try {
        releases.pop()?.();
      } catch {
        // A release that throws must not stop the rest from running.
      }
    }
  };
  try {
    let layout = readLayout();
    let tier = getTierForWidth(layout.viewportWidth);
    // All five routes run through their immutable profile: the Atlas anchors depend on the viewport, so a size
    // change builds a new one; Services and Projects reuse one per tier.
    const buildProfile = (): SceneProfile => entry.getConnectedProfile(options.route, tier, { width: layout.viewportWidth, height: layout.viewportHeight });
    let profile = buildProfile();
    let profileViewport = { width: layout.viewportWidth, height: layout.viewportHeight };
    let graph = profile.graph;
    const wordSource = (): LabelWordSource =>
      'capabilityWords' in options.words
        ? { capabilityWords: options.words.capabilityWords }
        : { wordBindings: options.words.wordBindings, wordNodeIds: profile.wordNodeIds };
    const scene = entry.createConnectedScene({
      mount: options.mount,
      graph,
      quality: graph.quality,
      tier,
      profile,
      words: 'capabilityWords' in options.words ? options.words.capabilityWords : undefined,
      onContextLost: options.onContextLost,
    });
    releases.push(() => scene.dispose());
    let sceneWidth = options.mount.clientWidth;
    let sceneHeight = options.mount.clientHeight;
    let resizePending = false;
    const sizeScene = () => {
      sceneWidth = options.mount.clientWidth;
      sceneHeight = options.mount.clientHeight;
      scene.resize(
        { width: sceneWidth, height: sceneHeight, pixelRatio: window.devicePixelRatio || 1, tier },
        graph,
        profile,
      );
    };
    sizeScene();

    const labelLayer = createLabelLayer(options.mount);
    releases.push(labelLayer.dispose);
    let labelledGraph = graph;
    labelLayer.rebuild(graph, wordSource());
    labelLayer.measure();
    let lastPose: ScenePose | null = null;
    let draws = 0;
    let peakScrollActivity = 0;
    const drawLabels = (pose: ScenePose) => {
      const projections = scene.projectLabels(pose);
      // A paused resize stretches the held canvas paint; labels follow it until Resume fits the field.
      const scaleX = resizePending && sceneWidth > 0 ? options.mount.clientWidth / sceneWidth : 1;
      const scaleY = resizePending && sceneHeight > 0 ? options.mount.clientHeight / sceneHeight : 1;
      labelLayer.update(resizePending ? projections.map(label => ({ ...label, xPx: label.xPx * scaleX, yPx: label.yPx * scaleY })) : projections, window.scrollY);
    };

    const timing = createFrameScheduler(browserFrameEnvironment);
    releases.push(timing.cancelAll);
    const controller = createConnectedController({
      clock: { now: () => performance.now() },
      scheduler: timing.scheduler,
      render: (pose) => {
        if (resizePending) {
          sizeScene();
          resizePending = false;
          if (graph !== labelledGraph) {
            labelledGraph = graph;
            labelLayer.rebuild(graph, wordSource());
          }
          labelLayer.measure();
        }
        scene.render(pose);
        if (firstDraw && !released && scene.diagnostics().renderCount > 0) {
          if (ground) ground.dataset.connectedLive = 'true';
          firstDraw = false;
        }
        lastPose = pose;
        draws += 1;
        if (process.env.NODE_ENV !== 'production') peakScrollActivity = Math.max(peakScrollActivity, pose.scrollActivity);
        drawLabels(pose);
      },
      getLayout: () => layout,
      // The first live frame is the poster pose, so the fade from poster to canvas has no jump.
      startPose: CONNECTED_POSTER_POSE,
      profile,
      profileKit: entry.connectedProfileKit,
    });
    releases.push(() => controller.dispose());

    // Input state. The pointer, the scroll classifier and the form suspension are small pure helpers
    // (connected-input.ts); every rectangle they use was cached by `labelLayer.measure`.
    const pointerSampler = createPointerSampler();
    const scrollClassifier = createScrollClassifier();
    const formSuspension = createFormSuspension();
    let pointer: ConnectedPointerInput | null = null;
    let visitorPaused = options.startPaused;
    let heldPaused = false;
    let cachedScrollY = window.scrollY;
    let lastY = cachedScrollY;
    let lastAt = performance.now();
    let lastVelocity = 0;
    let inputFrame = 0;

    // The visitor Pause, or the inquiry form holding focus or submitting, pauses the scene. A pause clears every
    // stimulation at once and holds zero callbacks; the held frame stays visible, and nothing replays on release.
    const syncPause = () => {
      const next = visitorPaused || formSuspension.suspended();
      if (next === heldPaused) return;
      heldPaused = next;
      if (next) {
        // A paused scene forgets the pointer and cancels any queued pointer work, so a later resume starts from the
        // next real movement.
        pointer = null;
        pointerSampler.reset();
        window.cancelAnimationFrame(inputFrame);
        inputFrame = 0;
        controller.pause();
      } else controller.resume();
    };
    const push = (velocity: number, scrollDeltaPx = 0, fromScroll = false) => {
      const scrollY = window.scrollY;
      cachedScrollY = scrollY;
      const footerDominant = isFooterDominant(scrollY, layout.footerDocumentTop, layout.viewportHeight);
      if (pointer && (document.hidden || footerDominant || isExcluded(pointer.x, pointer.y, exclusionRects(labelLayer.boxes(), scrollY)))) {
        // A hidden tab or the Footer supplies no input, and content scrolled under a still pointer may now rest over
        // a plate or reading text: either way the pointer is forgotten, so it carries no velocity back.
        pointer = null;
        pointerSampler.reset();
      }
      const drawsBefore = draws;
      controller.update({
        graph,
        tier,
        profile,
        scrollY,
        velocityPxPerSecond: velocity,
        visible: !document.hidden,
        footerDominant,
        pointer,
        scrollDeltaPx,
      });
      // A suspended scene (hidden tab, Footer handoff) is hidden. Any other scene whose controller drew nothing for
      // this update (a paused one, or an Atlas page asleep at rest) keeps its pose, but its labels still follow the
      // content that scrolls past them: one refresh from the cached boxes, without waking the physics. A scroll refreshes
      // in its own event, which runs before every animation-frame callback of the frame, so nothing in that frame sees a
      // label the masks have already moved over; other input coalesces into one animation frame.
      const state = controller.snapshot().state;
      options.mount.dataset.connectedState = state;
      if (state === 'suspended' || draws !== drawsBefore || !lastPose) return;
      if (fromScroll) {
        window.cancelAnimationFrame(labelFrame);
        labelFrame = 0;
        drawLabels(lastPose);
      } else if (!labelFrame) labelFrame = window.requestAnimationFrame(refreshLabels);
    };
    let labelFrame = 0;
    const refreshLabels = () => {
      labelFrame = 0;
      if (lastPose) drawLabels(lastPose);
    };
    // Pointer samples coalesce into one controller update per frame; nothing reads layout in between.
    const currentVelocity = () => (performance.now() - lastAt > 120 ? 0 : lastVelocity);
    const scheduleInput = () => {
      if (inputFrame) return;
      inputFrame = window.requestAnimationFrame(() => {
        inputFrame = 0;
        push(currentVelocity());
      });
    };
    const dropPointer = () => {
      pointerSampler.reset();
      if (!pointer) return;
      pointer = null;
      scheduleInput();
    };
    const onScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const delta = scrollClassifier.classify(now, scrollY - lastY);
      const velocity = ((scrollY - lastY) / Math.max(now - lastAt, 8)) * 1000;
      lastY = scrollY;
      lastAt = now;
      lastVelocity = velocity;
      if (delta !== 0 && formSuspension.backgroundInput()) syncPause();
      push(velocity, delta, true);
    };
    // Desktop mouse only: touch and pen keep ordinary native scrolling and nothing else. The handler reads the
    // event and the cached boxes, never layout.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const x = event.clientX;
      const y = event.clientY;
      if (isInteractiveTarget(event.target) || isExcluded(x, y, exclusionRects(labelLayer.boxes(), cachedScrollY))) {
        dropPointer();
        return;
      }
      if (formSuspension.backgroundInput()) syncPause();
      // Eligible input may lift the form's waiting state above; the visitor's Pause (or a form still holding) takes
      // no sample at all.
      if (heldPaused || formSuspension.suspended()) {
        dropPointer();
        return;
      }
      const sample = pointerSampler.sample({ x, y, timeStampMs: event.timeStamp });
      if (!sample) return;
      pointer = sample;
      scheduleInput();
    };
    const onPointerLeave = () => dropPointer();
    // Wheel, touch and scroll keys mark the scroll that follows as the visitor own. Typing and scrolling inside
    // a field are not gestures.
    const onGesture = (event: Event) => {
      if (isEditableTarget(event.target)) return;
      if (event.type === 'keydown' && !SCROLL_KEYS.has((event as KeyboardEvent).key)) return;
      scrollClassifier.noteGesture(performance.now());
    };
    const onJump = () => scrollClassifier.noteJump(performance.now());
    // The inquiry form (Contact): focus inside it, or a submission, suspends the drawing; it resumes with the next
    // eligible background input after focus has left, not by itself.
    const forms = Array.from(document.querySelectorAll<HTMLElement>(FORM_SELECTOR));
    const readPhase = () => (forms.some((form) => form.dataset.inquiryPhase === 'submitting') ? 'submitting' : (forms[0]?.dataset.inquiryPhase ?? null));
    const onFocusIn = (event: FocusEvent) => {
      formSuspension.focusChanged(Boolean((event.target as Element | null)?.closest?.(FORM_SELECTOR)));
      dropPointer();
      syncPause();
    };
    const onFocusOut = (event: FocusEvent) => {
      // Moving between the fields of the form is not leaving it.
      if ((event.relatedTarget as Element | null)?.closest?.(FORM_SELECTOR)) return;
      formSuspension.focusChanged(false);
      syncPause();
    };
    const phaseObserver = forms.length
      ? new MutationObserver(() => {
          formSuspension.phaseChanged(readPhase());
          dropPointer();
          syncPause();
        })
      : null;
    for (const form of forms) phaseObserver?.observe(form, { attributes: true, attributeFilter: ['data-inquiry-phase'] });
    formSuspension.phaseChanged(readPhase());
    formSuspension.focusChanged(Boolean((document.activeElement as Element | null)?.closest?.(FORM_SELECTOR)));

    // Layout is read in one batch, outside the scroll path, whenever anything that moves the Footer or
    // the viewport changes: a resize or orientation change, the visual viewport (mobile browser chrome),
    // late fonts and content that grows or wraps differently. Several triggers in a frame share one read.
    let remeasureFrame = 0;
    const remeasure = () => {
      remeasureFrame = 0;
      // A resize moves the document without a gesture: not an impulse to replay.
      scrollClassifier.noteJump(performance.now());
      layout = readLayout();
      tier = getTierForWidth(layout.viewportWidth);
      if (options.livePolicy[getQualityForTier(tier)] !== true) {
        options.onIneligible();
        return;
      }
      const resized = layout.viewportWidth !== profileViewport.width || layout.viewportHeight !== profileViewport.height;
      if (profile.tier !== tier || (resized && profile.nodeStyle === 'atlas')) {
        profile = buildProfile();
        profileViewport = { width: layout.viewportWidth, height: layout.viewportHeight };
        graph = profile.graph;
      }
      // Resizing a WebGL backing store clears its paint. Pause promises zero draws, so retain that
      // store and apply the latest viewport/graph at the next live draw instead.
      resizePending = true;
      if (controller.snapshot().state !== 'paused') {
        sizeScene();
        resizePending = false;
        if (graph !== labelledGraph) {
          labelledGraph = graph;
          labelLayer.rebuild(graph, wordSource());
        }
      }
      labelLayer.measure();
      push(0);
      if (controller.snapshot().state !== 'live' && lastPose) drawLabels(lastPose);
    };
    const scheduleRemeasure = () => {
      if (!remeasureFrame) remeasureFrame = window.requestAnimationFrame(remeasure);
    };
    // A hidden tab stops all scheduled work; showing it again resumes from the current scroll state.
    const onVisibility = () => push(0);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleRemeasure);
    window.visualViewport?.addEventListener('resize', scheduleRemeasure);
    document.addEventListener('visibilitychange', onVisibility);
    document.fonts?.addEventListener('loadingdone', scheduleRemeasure);
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('wheel', onGesture, { passive: true });
    document.addEventListener('touchmove', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    for (const type of ['hashchange', 'popstate', 'pageshow'] as const) window.addEventListener(type, onJump);
    const contentObserver = new ResizeObserver(scheduleRemeasure);
    contentObserver.observe(document.documentElement);
    releases.push(() => {
      window.cancelAnimationFrame(remeasureFrame);
      window.cancelAnimationFrame(labelFrame);
      window.cancelAnimationFrame(inputFrame);
      delete options.mount.dataset.connectedState;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleRemeasure);
      window.visualViewport?.removeEventListener('resize', scheduleRemeasure);
      document.removeEventListener('visibilitychange', onVisibility);
      document.fonts?.removeEventListener('loadingdone', scheduleRemeasure);
      document.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('wheel', onGesture);
      document.removeEventListener('touchmove', onGesture);
      document.removeEventListener('keydown', onGesture);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      for (const type of ['hashchange', 'popstate', 'pageshow'] as const) window.removeEventListener(type, onJump);
      phaseObserver?.disconnect();
      contentObserver.disconnect();
    });
    push(0);
    // A stored Pause starts from one drawn frame on the current pose, then holds; so does a form that already has focus.
    syncPause();

    options.publish(() => {
      const snapshot = controller.snapshot();
      const info = scene.diagnostics();
      return {
        mode: 'live',
        controller: snapshot.state,
        renderCount: info.renderCount,
        peakScrollActivity,
        pendingCallbacks: snapshot.pendingCallbacks,
        schedulerPending: timing.size(),
        targetFps: snapshot.targetFps,
        progress: snapshot.pose.progress,
        idleAngleRadians: snapshot.pose.idleAngleRadians,
        nodes: snapshot.pose.nodes.map((node) => ({ id: node.id, position: node.position })),
        edgeGrowth: snapshot.pose.edges.map((edge) => edge.growth),
        drawCalls: info.drawCalls,
        pixelRatio: info.pixelRatio,
        tier,
        layout,
        formSuspended: formSuspension.suspended(),
        pointerActive: pointer !== null,
        profile: { route: profile.route, tier: profile.tier, nodeStyle: profile.nodeStyle, wordNodeIds: profile.wordNodeIds },
        edgeSamples: (snapshot.pose.edgeSamples ?? []).map((edge) => ({ id: edge.id, points: edge.points.map((point) => [point[0], point[1], point[2]] as const) })),
      };
    });
    releases.push(() => options.publish(null));
    return {
      controller,
      setVisitorPaused(paused) {
        visitorPaused = paused;
        // A deliberate Resume is an eligible input for the form's waiting state too.
        if (!paused) formSuspension.deliberateResume();
        syncPause();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}

/**
 * PLAN-SPF-V1 Task 7: the thin client leaf that attaches the optional live scene to a connected
 * route. It owns browser layout, scroll, visibility, session and cancellation; the controller owns
 * the clock and scheduling, and the dynamically imported engine owns the GPU.
 */
export function ConnectedStudioEnhancement(props: ConnectedStudioEnhancementProps) {
  const { route, locale } = props;
  // Services and Projects label their nodes with the localized vocabulary; Studio, Founder and Contact bind a few
  // decorative words to node ids. Either way every route attaches the same host.
  const capabilityWords = 'capabilityWords' in props ? props.capabilityWords : null;
  const wordBindings = 'wordBindings' in props ? props.wordBindings : null;
  const sceneRef = useRef<LiveScene | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  // After a fallback the control stays only while it holds keyboard focus (DESIGN-SPF-V1, Motion).
  const [fallbackHeld, setFallbackHeld] = useState(false);

  useEffect(() => {
    const words: LiveOptions['words'] | null = capabilityWords ? { capabilityWords } : wordBindings ? { wordBindings } : null;
    if (!words) return;
    const mount = document.querySelector<HTMLElement>(
      `[data-connected-ground][data-connected-route="${route}"][data-connected-locale="${locale}"] [data-connected-mount]`,
    );
    if (!mount) return;
    const publish = installDiagnostics(route);
    let cancelled = false;
    let stopped = false;
    let ready = false;
    let importing = false;
    let engine: Promise<typeof import('./runtime/create-connected-scene')> | null = null;
    let liveScene: LiveScene | null = null;
    let deferTimer = 0;
    let deferrals = 0;

    /**
     * Quietly back to the complete static background: release everything and report it. A Pause control
     * that holds focus stays in place as the inactive "Static background" control; any other goes away.
     */
    const fallBack = (mode: 'failed' | 'static' = 'failed') => {
      stopped = true;
      window.clearTimeout(deferTimer);
      liveScene?.dispose();
      liveScene = null;
      sceneRef.current = null;
      publish(() => ({ ...STATIC_READING, mode }));
      const pauseSlot = document.getElementById(`connected-pause-${route}`);
      setFallbackHeld(Boolean(pauseSlot && document.activeElement && pauseSlot.contains(document.activeElement)));
      setLive(false);
    };

    const readEligibility = () => {
      const preferences = readPreferences();
      const session = readConnectedSession();
      const hook = readTestHook();
      const gate = {
        reducedMotion: preferences.reducedMotion,
        saveData: preferences.saveData,
        sessionContextLost: session.contextLost,
        loaded: document.readyState === 'complete',
        visible: !document.hidden,
        tier: getTierForWidth(window.innerWidth),
        livePolicy: hook.livePolicy ?? CONNECTED_LIVE_POLICY,
      };
      return { preferences, session, hook, gate };
    };

    const isEligible = ({ preferences, gate }: ReturnType<typeof readEligibility>) =>
      !preferences.forcedColors && chooseConnectedMode({ ...gate, webgl2: true, softwareRenderer: false }) === 'webgl';

    const activate = () => {
      if (cancelled || stopped || importing || liveScene || document.hidden) return;
      // One live renderer: while Home's renderer is still mounted, wait for it instead of creating a second
      // context. A visitor who left Home has released it by the time they read this page, so the wait is short.
      if (document.querySelector(HOME_RENDERER_SELECTOR)) {
        if (deferrals < MAX_DEFERRALS) {
          deferrals += 1;
          deferTimer = window.setTimeout(activate, DEFERRAL_INTERVAL_MS);
        } else {
          stopped = true;
          counters.deferralsExhausted += 1;
        }
        return;
      }
      // Every condition is read now, at activation, so a preference or a session that changed while the
      // page loaded is honored. The cheap gates run first: a page that cannot go live never probes.
      const eligibility = readEligibility();
      if (!isEligible(eligibility)) {
        stopped = true;
        return;
      }
      const { gate, hook } = eligibility;
      const probe = probeWebgl();
      if (chooseConnectedMode({ ...gate, webgl2: probe.available, softwareRenderer: probe.softwareRenderer && !hook.allowSoftwareRenderer }) !== 'webgl') {
        stopped = true;
        return;
      }
      importing = true;
      if (!engine) {
        counters.imports += 1;
        engine = import('./runtime/create-connected-scene');
      }
      engine
        .then((entry) => {
          importing = false;
          if (cancelled || stopped || document.hidden) return;
          if (document.querySelector(HOME_RENDERER_SELECTOR)) {
            activate();
            return;
          }
          const current = readEligibility();
          if (!isEligible(current)) {
            fallBack('static');
            return;
          }
          let lostEarly = false;
          liveScene = attachLiveScene({
            entry,
            mount,
            route,
            words,
            startPaused: current.session.paused,
            livePolicy: current.gate.livePolicy,
            publish,
            onIneligible: () => fallBack('static'),
            onContextLost: () => {
              // The loss suppresses every connected route for the session; Home's own flag is only read.
              markConnectedContextLost();
              if (liveScene) fallBack();
              else lostEarly = true;
            },
          });
          sceneRef.current = liveScene;
          setSlot(document.getElementById(`connected-pause-${route}`));
          setPaused(current.session.paused);
          setLive(true);
          if (lostEarly) fallBack();
        })
        .catch(() => {
          importing = false;
          if (!cancelled) fallBack();
        });
    };

    const cancelActivation = scheduleAfterLoad(() => {
      ready = true;
      activate();
    });
    // A tab opened in the background waits for visibility. A cached module can be attached when
    // shown, but a failed or permanently rejected activation never retries.
    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(deferTimer);
      else if (ready) activate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Reduced motion turned on while the scene runs ends it at once; turning it off again never restarts it.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const onPreference = (event: MediaQueryListEvent) => {
      if (event.matches) fallBack('static');
    };
    reducedMotion.addEventListener('change', onPreference);
    forcedColors.addEventListener('change', onPreference);

    return () => {
      cancelled = true;
      cancelActivation();
      window.clearTimeout(deferTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onPreference);
      forcedColors.removeEventListener('change', onPreference);
      liveScene?.dispose();
      liveScene = null;
      sceneRef.current = null;
      setLive(false);
      setFallbackHeld(false);
    };
  }, [capabilityWords, wordBindings, locale, route]);

  // The server renders the static-background label in the reserved slot. Studio and Founder hide it with a CSS
  // :has() rule; the host does the same for every route (Contact has no such rule), and gives it back when the
  // control goes away, so the slot never shows both or neither.
  useEffect(() => {
    if (!slot || !(live || fallbackHeld)) return;
    const label = slot.querySelector<HTMLElement>('[data-connected-static-label]');
    if (!label) return;
    label.style.display = 'none';
    return () => {
      label.style.removeProperty('display');
    };
  }, [slot, live, fallbackHeld]);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    setConnectedPaused(next);
    sceneRef.current?.setVisitorPaused(next);
  };

  return (
    <>
      {(live || fallbackHeld) && slot
        ? createPortal(
            <ConnectedPauseControl
              labels={CONNECTED_CONTROL_LABELS[locale]}
              paused={paused}
              fallback={!live}
              onToggle={toggle}
              onBlur={() => setFallbackHeld(false)}
            />,
            slot,
          )
        : null}
    </>
  );
}
