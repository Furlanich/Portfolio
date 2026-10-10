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
};

type ConnectedHook = { read(): ConnectedDiagnostics };

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
    let cancelled = false;
    let scene: SceneHandle | null = null;
    let teardown = () => undefined as void;

    void import('./runtime/create-connected-scene').then(({ createConnectedScene }) => {
      if (cancelled) return;
      const readLayout = (): SceneLayout => {
        const footer = document.querySelector<HTMLElement>('[data-site-footer]');
        return {
          footerDocumentTop: footer ? footer.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        };
      };
      let layout = readLayout();
      let tier = getTierForWidth(layout.viewportWidth);
      let graph = getConnectedGraph(getQualityForTier(tier));
      scene = createConnectedScene({
        mount,
        graph,
        quality: graph.quality,
        tier,
        words: capabilityWords,
        onContextLost: () => undefined,
      });
      const current = scene;
      const sizeScene = () => {
        current.resize(
          { width: mount.clientWidth, height: mount.clientHeight, pixelRatio: window.devicePixelRatio || 1, tier },
          graph,
        );
      };
      sizeScene();

      const timers = new Map<number, { timeout: number; frame: number }>();
      let nextTimerId = 1;
      const controller = createConnectedController({
        clock: { now: () => performance.now() },
        scheduler: {
          schedule(callback, delayMs) {
            const id = nextTimerId++;
            const entry = { timeout: 0, frame: 0 };
            entry.timeout = window.setTimeout(() => {
              entry.frame = window.requestAnimationFrame(() => {
                timers.delete(id);
                callback();
              });
            }, delayMs);
            timers.set(id, entry);
            return id;
          },
          cancel(id) {
            const entry = timers.get(id);
            if (!entry) return;
            window.clearTimeout(entry.timeout);
            window.cancelAnimationFrame(entry.frame);
            timers.delete(id);
          },
        },
        render: (pose) => current.render(pose),
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

      const diagnostics = {
        read() {
          const snapshot = controller.snapshot();
          const info = current.diagnostics();
          return {
            route,
            mode: 'live' as const,
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
        },
      } satisfies ConnectedHook;
      if (process.env.NODE_ENV !== 'production') {
        (window as typeof window & { __FURLANICH_CONNECTED__?: ConnectedHook }).__FURLANICH_CONNECTED__ = diagnostics;
      }

      teardown = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        controller.dispose();
        for (const id of Array.from(timers.keys())) {
          const entry = timers.get(id);
          if (entry) {
            window.clearTimeout(entry.timeout);
            window.cancelAnimationFrame(entry.frame);
          }
          timers.delete(id);
        }
        current.dispose();
        controllerRef.current = null;
      };
      setSlot(document.getElementById(`connected-pause-${route}`));
      setLive(true);
    });

    return () => {
      cancelled = true;
      teardown();
      scene = null;
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
