'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import { CONNECTED_LIVE_POLICY, chooseConnectedMode } from '@/lib/connected-studio/capability';
import { createConnectedController } from '@/lib/connected-studio/controller';
import { getConnectedGraph, getQualityForTier, getTierForWidth, isFooterDominant } from '@/lib/connected-studio/model';
import { markConnectedContextLost, readConnectedSession } from '@/lib/connected-studio/session';
import { isSoftwareRenderer } from '@/lib/immersive-home/capability';
import type {
  CapabilityWords,
  ConnectedController,
  ConnectedLivePolicy,
  ConnectedRoute,
  ConnectedTier,
  ControllerOptions,
  SceneHandle,
  SceneLayout,
  SceneSnapshot,
} from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { ConnectedPauseControl } from './ConnectedPauseControl';

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
  pendingCallbacks: number;
  targetFps: number;
  progress: number;
  idleAngleRadians: number;
  nodes: readonly { id: string; position: readonly [number, number, number] }[];
  edgeGrowth: readonly number[];
  drawCalls: number;
  pixelRatio: number;
  tier: ConnectedTier | null;
  /** Times the dynamic engine import was started. */
  imports: number;
};

type LiveReading = Omit<ConnectedDiagnostics, 'route' | 'imports'>;

const counters = { imports: 0 };

const STATIC_READING: LiveReading = {
  mode: 'static',
  controller: 'none',
  renderCount: 0,
  pendingCallbacks: 0,
  targetFps: 0,
  progress: 0,
  idleAngleRadians: 0,
  nodes: [],
  edgeGrowth: [],
  drawCalls: 0,
  pixelRatio: 0,
  tier: null,
};

/** Installs the diagnostics hook; production builds never do. Returns the setter for the live reading. */
function installDiagnostics(route: ConnectedRoute): (reading: (() => LiveReading) | null) => void {
  if (process.env.NODE_ENV === 'production') return () => undefined;
  let reading: (() => LiveReading) | null = null;
  (window as typeof window & { __FURLANICH_CONNECTED__?: { read(): ConnectedDiagnostics } }).__FURLANICH_CONNECTED__ = {
    read: () => ({ route, imports: counters.imports, ...(reading ? reading() : STATIC_READING) }),
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

/** Preferences known at activation. With either set, the optional engine is never fetched. */
function readPreferences(): { reducedMotion: boolean; saveData: boolean } {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: connection?.saveData === true,
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
function createBrowserScheduler(): { scheduler: ControllerOptions['scheduler']; cancelAll(): void } {
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
  };
}

type LiveOptions = {
  createConnectedScene: typeof import('./runtime/create-connected-scene').createConnectedScene;
  mount: HTMLElement;
  route: ConnectedRoute;
  words: CapabilityWords;
  startPaused: boolean;
  publish: (reading: (() => LiveReading) | null) => void;
  onContextLost(): void;
};

type LiveScene = { controller: ConnectedController; dispose(): void };

/**
 * Builds the live scene: the engine, the controller and the browser bindings. Every acquisition
 * pushes its release onto one stack, so a failure at any step, or the final dispose, releases
 * exactly what was built, in reverse order. A throw leaves nothing behind.
 */
function attachLiveScene(options: LiveOptions): LiveScene {
  const releases: Array<() => void> = [];
  const dispose = () => {
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
    const sizeScene = () => {
      scene.resize(
        { width: options.mount.clientWidth, height: options.mount.clientHeight, pixelRatio: window.devicePixelRatio || 1, tier },
        graph,
      );
    };
    sizeScene();

    const timing = createBrowserScheduler();
    releases.push(timing.cancelAll);
    const controller = createConnectedController({
      clock: { now: () => performance.now() },
      scheduler: timing.scheduler,
      render: (pose) => scene.render(pose),
      getLayout: () => layout,
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
    };
    const onScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const velocity = ((scrollY - lastY) / Math.max(now - lastAt, 8)) * 1000;
      lastY = scrollY;
      lastAt = now;
      push(velocity);
    };
    const onResize = () => {
      layout = readLayout();
      tier = getTierForWidth(layout.viewportWidth);
      graph = getConnectedGraph(getQualityForTier(tier));
      sizeScene();
      push(0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    releases.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
        pendingCallbacks: snapshot.pendingCallbacks,
        targetFps: snapshot.targetFps,
        progress: snapshot.pose.progress,
        idleAngleRadians: snapshot.pose.idleAngleRadians,
        nodes: snapshot.pose.nodes.map((node) => ({ id: node.id, position: node.position })),
        edgeGrowth: snapshot.pose.edges.map((edge) => edge.growth),
        drawCalls: info.drawCalls,
        pixelRatio: info.pixelRatio,
        tier,
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
  const anchorRef = useRef<HTMLSpanElement>(null);
  const controllerRef = useRef<ConnectedController | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    const mount = anchor?.closest('[data-connected-ground]')?.querySelector<HTMLElement>('[data-connected-mount]');
    if (!mount) return;
    const publish = installDiagnostics(route);
    let cancelled = false;
    let liveScene: LiveScene | null = null;

    /** Quietly back to the complete static background: release everything, report it, show nothing. */
    const fallBack = () => {
      liveScene?.dispose();
      liveScene = null;
      controllerRef.current = null;
      publish(() => ({ ...STATIC_READING, mode: 'failed' }));
      setLive(false);
    };

    const activate = () => {
      // Every condition is read now, at activation, so a preference or a session that changed while the
      // page loaded is honored. The cheap gates run first: a page that cannot go live never probes.
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
      if (chooseConnectedMode({ ...gate, webgl2: true, softwareRenderer: false }) !== 'webgl') return;
      const probe = probeWebgl();
      if (chooseConnectedMode({ ...gate, webgl2: probe.available, softwareRenderer: probe.softwareRenderer && !hook.allowSoftwareRenderer }) !== 'webgl') {
        return;
      }
      counters.imports += 1;
      import('./runtime/create-connected-scene')
        .then(({ createConnectedScene }) => {
          if (cancelled) return;
          let lostEarly = false;
          liveScene = attachLiveScene({
            createConnectedScene,
            mount,
            route,
            words: capabilityWords,
            startPaused: session.paused,
            publish,
            onContextLost: () => {
              // The loss suppresses every connected route for the session; Home's own flag is only read.
              markConnectedContextLost();
              if (liveScene) fallBack();
              else lostEarly = true;
            },
          });
          controllerRef.current = liveScene.controller;
          setSlot(document.getElementById(`connected-pause-${route}`));
          setPaused(session.paused);
          setLive(true);
          if (lostEarly) fallBack();
        })
        .catch(fallBack);
    };

    const cancelActivation = scheduleAfterLoad(activate);

    return () => {
      cancelled = true;
      cancelActivation();
      liveScene?.dispose();
      liveScene = null;
      controllerRef.current = null;
      setLive(false);
    };
  }, [capabilityWords, locale, route]);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    if (next) controllerRef.current?.pause();
    else controllerRef.current?.resume();
  };

  return (
    <>
      <span ref={anchorRef} aria-hidden="true" hidden />
      {live && slot
        ? createPortal(
            <ConnectedPauseControl labels={CONNECTED_CONTROL_LABELS[locale]} paused={paused} fallback={false} onToggle={toggle} />,
            slot,
          )
        : null}
    </>
  );
}
