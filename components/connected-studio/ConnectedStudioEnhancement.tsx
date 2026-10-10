'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import { createConnectedController } from '@/lib/connected-studio/controller';
import { getConnectedGraph, getQualityForTier, getTierForWidth, isFooterDominant } from '@/lib/connected-studio/model';
import type {
  CapabilityWords,
  ConnectedController,
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

/** Preferences known at entry. With either set, the optional engine is never fetched. */
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
    const preferences = readPreferences();
    if (preferences.reducedMotion || preferences.saveData) return;
    let cancelled = false;
    let teardown = () => undefined as void;

    counters.imports += 1;
    void import('./runtime/create-connected-scene').then(({ createConnectedScene }) => {
      if (cancelled) return;
      let layout = readLayout();
      let tier = getTierForWidth(layout.viewportWidth);
      let graph = getConnectedGraph(getQualityForTier(tier));
      const scene: SceneHandle = createConnectedScene({
        mount,
        graph,
        quality: graph.quality,
        tier,
        words: capabilityWords,
        onContextLost: () => undefined,
      });
      const sizeScene = () => {
        scene.resize(
          { width: mount.clientWidth, height: mount.clientHeight, pixelRatio: window.devicePixelRatio || 1, tier },
          graph,
        );
      };
      sizeScene();

      const timing = createBrowserScheduler();
      const controller = createConnectedController({
        clock: { now: () => performance.now() },
        scheduler: timing.scheduler,
        render: (pose) => scene.render(pose),
        getLayout: () => layout,
      });
      controllerRef.current = controller;

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
      push(0);

      publish(() => {
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

      teardown = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        controller.dispose();
        timing.cancelAll();
        scene.dispose();
        controllerRef.current = null;
        publish(null);
      };
      setSlot(document.getElementById(`connected-pause-${route}`));
      setLive(true);
    });

    return () => {
      cancelled = true;
      teardown();
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
