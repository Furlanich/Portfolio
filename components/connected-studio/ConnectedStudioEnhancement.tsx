'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import { CONNECTED_LIVE_POLICY, chooseConnectedMode } from '@/lib/connected-studio/capability';
import { createConnectedController } from '@/lib/connected-studio/controller';
import { resolveLabelVisibility } from '@/lib/connected-studio/labels';
import { CONNECTED_POSTER_POSE } from '@/lib/connected-studio/media-manifest';
import { getConnectedGraph, getQualityForTier, getTierForWidth, isFooterDominant } from '@/lib/connected-studio/model';
import { markConnectedContextLost, readConnectedSession, setConnectedPaused } from '@/lib/connected-studio/session';
import { isSoftwareRenderer } from '@/lib/immersive-home/capability';
import type {
  CapabilityWords,
  ConnectedController,
  ConnectedLivePolicy,
  ConnectedRoute,
  ConnectedTier,
  ControllerOptions,
  GraphDefinition,
  LabelBox,
  LabelProjection,
  OccluderRect,
  SceneHandle,
  SceneLayout,
  ScenePose,
  SceneSnapshot,
} from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { ConnectedPauseControl } from './ConnectedPauseControl';
import styles from './connected-studio.module.css';

type ConnectedStudioEnhancementProps = {
  route: ConnectedRoute;
  locale: Locale;
  /** The localized eight-word vocabulary, for the engine's labels. */
  capabilityWords: CapabilityWords;
};

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
};

type LiveReading = Omit<ConnectedDiagnostics, 'route' | 'imports' | 'deferralsExhausted'>;

const counters = { imports: 0, deferralsExhausted: 0 };

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
};

/** Installs the diagnostics hook; production builds never do. Returns the setter for the live reading. */
function installDiagnostics(route: ConnectedRoute): (reading: (() => LiveReading) | null) => void {
  if (process.env.NODE_ENV === 'production') return () => undefined;
  let reading: (() => LiveReading) | null = null;
  (window as typeof window & { __FURLANICH_CONNECTED__?: { read(): ConnectedDiagnostics } }).__FURLANICH_CONNECTED__ = {
    read: () => ({ route, imports: counters.imports, deferralsExhausted: counters.deferralsExhausted, ...(reading ? reading() : STATIC_READING) }),
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

/**
 * The controller's scheduler on the browser clock: a timer for the interval, then one animation frame
 * so a draw lands on a frame boundary. Cancelling clears whichever stage is pending.
 */
function createBrowserScheduler(): { scheduler: ControllerOptions['scheduler']; cancelAll(): void; size(): number } {
  const pending = new Map<number, { timeout: number; frame: number }>();
  let nextId = 1;
  const clear = (entry: { timeout: number; frame: number }) => {
    window.clearTimeout(entry.timeout);
    window.cancelAnimationFrame(entry.frame);
  };
  return {
    scheduler: {
      schedule(callback, delayMs) {
        const id = nextId++;
        const entry = { timeout: 0, frame: 0 };
        entry.timeout = window.setTimeout(() => {
          entry.frame = window.requestAnimationFrame(() => {
            pending.delete(id);
            callback();
          });
        }, delayMs);
        pending.set(id, entry);
        return id;
      },
      cancel(id) {
        const entry = pending.get(id);
        if (!entry) return;
        clear(entry);
        pending.delete(id);
      },
    },
    cancelAll() {
      pending.forEach(clear);
      pending.clear();
    },
    size: () => pending.size,
  };
}

type LabelEntry = {
  id: string;
  element: HTMLElement;
  width: number;
  height: number;
  depthScale: number;
  visible: boolean;
  x: number;
  y: number;
};

/** Document-space rectangle of a foreground block the labels must stay clear of. */
type MaskRect = { left: number; docTop: number; width: number; height: number };

/**
 * The projected DOM labels (DESIGN-SPF-V1, "Motion and interaction contract"): one upright, decorative,
 * pointer-inert word per node, placed from the engine's projections and then clamped, occlusion-checked
 * and de-overlapped by `resolveLabelVisibility` (PC-2). Sizes and the reading masks are measured in one
 * batch (`measure`), so a frame reads no layout: it only reads the scroll offset and the App Bar.
 */
function createLabelLayer(mount: HTMLElement, words: CapabilityWords) {
  const host = document.createElement('div');
  host.setAttribute('data-connected-labels', '');
  host.className = styles.labels;
  mount.appendChild(host);
  let entries: LabelEntry[] = [];
  let byId = new Map<string, LabelEntry>();
  let masks: MaskRect[] = [];
  let appBar: HTMLElement | null = null;
  let viewport = { width: 0, height: 0 };

  return {
    /** One element per node of the graph in use; call again when the graph changes. */
    rebuild(graph: GraphDefinition) {
      host.replaceChildren();
      entries = graph.nodes.map((node) => {
        const element = document.createElement('span');
        element.className = styles.label;
        element.setAttribute('data-connected-label', '');
        element.dataset.nodeId = node.id;
        element.dataset.visible = 'false';
        element.textContent = words[node.capabilityIndex];
        host.appendChild(element);
        return { id: node.id, element, width: 0, height: 0, depthScale: node.depthScale, visible: false, x: 0, y: 0 };
      });
      byId = new Map(entries.map((entry) => [entry.id, entry]));
    },
    /** Batched layout reads: label sizes, the viewport the labels live in, and the foreground masks. */
    measure() {
      for (const entry of entries) {
        entry.width = entry.element.offsetWidth;
        entry.height = entry.element.offsetHeight;
      }
      viewport = { width: mount.clientWidth, height: mount.clientHeight };
      const scrollY = window.scrollY;
      masks = Array.from(document.querySelectorAll<HTMLElement>('[data-connected-reading-mask]')).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, docTop: rect.top + scrollY, width: rect.width, height: rect.height };
      });
      appBar = document.querySelector<HTMLElement>('[data-app-bar]');
    },
    update(projections: readonly LabelProjection[]) {
      const scrollY = window.scrollY;
      const boxes: LabelBox[] = [];
      for (const projection of projections) {
        const entry = byId.get(projection.id);
        if (!entry || !projection.inView) continue;
        boxes.push({
          id: entry.id,
          left: projection.xPx - entry.width / 2,
          top: projection.yPx,
          width: entry.width,
          height: entry.height,
          depthScale: projection.depthScale,
        });
      }
      const occluders: OccluderRect[] = masks.map((mask) => ({ left: mask.left, top: mask.docTop - scrollY, width: mask.width, height: mask.height }));
      if (appBar) {
        const rect = appBar.getBoundingClientRect();
        occluders.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      }
      const shown = new Map(resolveLabelVisibility(boxes, occluders, viewport).filter((result) => result.visible).map((result) => [result.id, result]));
      for (const entry of entries) {
        const result = shown.get(entry.id);
        const visible = result !== undefined;
        if (result && (entry.x !== result.left || entry.y !== result.top)) {
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

type LiveOptions = {
  createConnectedScene: typeof import('./runtime/create-connected-scene').createConnectedScene;
  mount: HTMLElement;
  route: ConnectedRoute;
  words: CapabilityWords;
  startPaused: boolean;
  livePolicy: ConnectedLivePolicy;
  publish: (reading: (() => LiveReading) | null) => void;
  onContextLost(): void;
  onIneligible(): void;
};

type LiveScene = { controller: ConnectedController; dispose(): void };

/**
 * Builds the live scene: the engine, the controller and the browser bindings. Every acquisition
 * pushes its release onto one stack, so a failure at any step, or the final dispose, releases
 * exactly what was built, in reverse order. A throw leaves nothing behind.
 */
function attachLiveScene(options: LiveOptions): LiveScene {
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
    let graph = getConnectedGraph(getQualityForTier(tier));
    const scene: SceneHandle = options.createConnectedScene({
      mount: options.mount,
      graph,
      quality: graph.quality,
      tier,
      words: options.words,
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
      );
    };
    sizeScene();

    const labelLayer = createLabelLayer(options.mount, options.words);
    releases.push(labelLayer.dispose);
    let labelledGraph = graph;
    labelLayer.rebuild(graph);
    labelLayer.measure();
    let lastPose: ScenePose | null = null;
    let peakScrollActivity = 0;
    const drawLabels = (pose: ScenePose) => {
      const projections = scene.projectLabels(pose);
      // A paused resize stretches the held canvas paint; labels follow it until Resume fits the field.
      const scaleX = resizePending && sceneWidth > 0 ? options.mount.clientWidth / sceneWidth : 1;
      const scaleY = resizePending && sceneHeight > 0 ? options.mount.clientHeight / sceneHeight : 1;
      labelLayer.update(resizePending ? projections.map(label => ({ ...label, xPx: label.xPx * scaleX, yPx: label.yPx * scaleY })) : projections);
    };

    const timing = createBrowserScheduler();
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
            labelLayer.rebuild(graph);
          }
          labelLayer.measure();
        }
        scene.render(pose);
        if (firstDraw && !released && scene.diagnostics().renderCount > 0) {
          if (ground) ground.dataset.connectedLive = 'true';
          firstDraw = false;
        }
        lastPose = pose;
        if (process.env.NODE_ENV !== 'production') peakScrollActivity = Math.max(peakScrollActivity, pose.scrollActivity);
        drawLabels(pose);
      },
      getLayout: () => layout,
      // The first live frame is the poster's pose, so the fade from poster to canvas has no jump.
      startPose: CONNECTED_POSTER_POSE,
    });
    releases.push(() => controller.dispose());

    let lastY = window.scrollY;
    let lastAt = performance.now();
    const push = (velocity: number) => {
      const scrollY = window.scrollY;
      controller.update({
        graph,
        tier,
        scrollY,
        velocityPxPerSecond: velocity,
        visible: !document.hidden,
        footerDominant: isFooterDominant(scrollY, layout.footerDocumentTop, layout.viewportHeight),
      });
      // A suspended scene (hidden tab, Footer handoff) is hidden; a paused one keeps its pose, but its
      // labels still follow the content that scrolls past them.
      const state = controller.snapshot().state;
      options.mount.dataset.connectedState = state;
      if (state === 'paused' && lastPose && !labelFrame) labelFrame = window.requestAnimationFrame(refreshLabels);
    };
    let labelFrame = 0;
    const refreshLabels = () => {
      labelFrame = 0;
      if (lastPose) drawLabels(lastPose);
    };
    const onScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const velocity = ((scrollY - lastY) / Math.max(now - lastAt, 8)) * 1000;
      lastY = scrollY;
      lastAt = now;
      push(velocity);
    };
    // Layout is read in one batch, outside the scroll path, whenever anything that moves the Footer or
    // the viewport changes: a resize or orientation change, the visual viewport (mobile browser chrome),
    // late fonts and content that grows or wraps differently. Several triggers in a frame share one read.
    let remeasureFrame = 0;
    const remeasure = () => {
      remeasureFrame = 0;
      layout = readLayout();
      tier = getTierForWidth(layout.viewportWidth);
      if (options.livePolicy[getQualityForTier(tier)] !== true) {
        options.onIneligible();
        return;
      }
      graph = getConnectedGraph(getQualityForTier(tier));
      // Resizing a WebGL backing store clears its paint. Pause promises zero draws, so retain that
      // store and apply the latest viewport/graph at the next live draw instead.
      resizePending = true;
      if (controller.snapshot().state !== 'paused') {
        sizeScene();
        resizePending = false;
        if (graph !== labelledGraph) {
          labelledGraph = graph;
          labelLayer.rebuild(graph);
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
    const contentObserver = new ResizeObserver(scheduleRemeasure);
    contentObserver.observe(document.documentElement);
    releases.push(() => {
      window.cancelAnimationFrame(remeasureFrame);
      window.cancelAnimationFrame(labelFrame);
      delete options.mount.dataset.connectedState;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleRemeasure);
      window.visualViewport?.removeEventListener('resize', scheduleRemeasure);
      document.removeEventListener('visibilitychange', onVisibility);
      document.fonts?.removeEventListener('loadingdone', scheduleRemeasure);
      contentObserver.disconnect();
    });
    push(0);
    // A stored Pause starts from one drawn frame on the current pose, then holds.
    if (options.startPaused) controller.pause();

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
      };
    });
    releases.push(() => options.publish(null));
    return { controller, dispose };
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
export function ConnectedStudioEnhancement({ route, locale, capabilityWords }: ConnectedStudioEnhancementProps) {
  const controllerRef = useRef<ConnectedController | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  // After a fallback the control stays only while it holds keyboard focus (DESIGN-SPF-V1, Motion).
  const [fallbackHeld, setFallbackHeld] = useState(false);

  useEffect(() => {
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
      controllerRef.current = null;
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
        .then(({ createConnectedScene }) => {
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
            createConnectedScene,
            mount,
            route,
            words: capabilityWords,
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
          controllerRef.current = liveScene.controller;
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
      controllerRef.current = null;
      setLive(false);
      setFallbackHeld(false);
    };
  }, [capabilityWords, locale, route]);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    setConnectedPaused(next);
    if (next) controllerRef.current?.pause();
    else controllerRef.current?.resume();
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
