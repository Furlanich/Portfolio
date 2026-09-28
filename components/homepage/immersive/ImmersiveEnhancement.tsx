'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { chooseImmersiveMode, chooseRenderQuality, isSoftwareRenderer } from '@/lib/immersive-home/capability';
import { progressFromChapterRects } from '@/lib/immersive-home/state';
import {
  frameForProgress,
  labelOpacityMultiplier,
  recedeFactor,
  SKY_CHART_NODES,
  type SkyChartFrame,
} from '@/lib/immersive-home/sky-chart-model';
import type { SkyChartNodeId } from '@/lib/immersive-home/types';
import type { SkyChartSceneHandle } from './runtime/create-sky-chart-scene';
import { SkyChartController } from './runtime/sky-chart-controller';
import { PauseMotionControl } from './PauseMotionControl';

interface ImmersiveEnhancementProps {
  /** Localized labels for the 20 Sky Chart scene nodes, keyed by node id. */
  labels: Record<SkyChartNodeId, string>;
  /** Decorative per-chapter plate number template; not consumed here (Task 8's `ImmersiveChapter`
   * owns the D-12 plate number). Accepted to match the agreed call-site signature. */
  plateLabel?: string;
  locale: string;
  statusLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  sequences: readonly string[];
}

const CHAPTER_IDS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
const CONTEXT_LOST_KEY = 'furlanich:sky-chart-context-lost';
const HERO_EXCLUSION_MIN_WIDTH = 768;
let sessionContextLost = false;
let sceneDisposeCount = 0;

function readSessionContextLost(): boolean {
  if (sessionContextLost) return true;
  try {
    return window.sessionStorage.getItem(CONTEXT_LOST_KEY) === '1';
  } catch {
    return false;
  }
}

function markSessionContextLost(): void {
  sessionContextLost = true;
  try {
    window.sessionStorage.setItem(CONTEXT_LOST_KEY, '1');
  } catch {
    // Storage may be unavailable; the module flag still prevents retries in this page.
  }
}

type WebglProbe = { available: boolean; softwareRenderer: boolean };

/**
 * N5/N11: probes WebGL2 on a throwaway canvas, reads the renderer string (B1) and releases the
 * probe context immediately (`WEBGL_lose_context`) so it never lingers alongside the real
 * canvas's own context. This is deliberately a *second*, separate context from the one
 * `createSkyChartScene` creates for the real canvas -- probing must never risk holding the
 * context the actual renderer needs.
 */
function probeWebgl(): WebglProbe {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    if (!gl) return { available: false, softwareRenderer: false };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererString = String(debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const softwareRenderer = isSoftwareRenderer(rendererString);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { available: true, softwareRenderer };
  } catch {
    return { available: false, softwareRenderer: false };
  }
}

function afterLoad(callback: () => void): () => void {
  if (document.readyState === 'complete') {
    callback();
    return () => undefined;
  }
  window.addEventListener('load', callback, { once: true });
  return () => window.removeEventListener('load', callback);
}

type Measurement = { width: number; vh: number; heroBottom: number };

type DebugHook = {
  frame: SkyChartFrame | null;
  labelCount: number;
  labels: readonly string[];
  disposeCount: number;
  /** Incremented once per rendered frame; used to assert demand rendering stops when settled. */
  renderCount: number;
  drawCalls: number;
  pixelRatio: number;
  labelTextureSizes: readonly [number, number][];
  labelOpacities: Record<string, number>;
};

/**
 * The homepage's only client boundary. It leaves the server-rendered static environment
 * untouched unless every capability gate passes, then loads the Three.js Sky Chart runtime
 * once and renders on demand from native scroll. Any failure returns quietly to the static
 * poster pair. The canvas is portaled to `document.body`, fixed at z-index -2 (plan D-01, T-04).
 */
export function ImmersiveEnhancement({
  labels,
  locale,
  statusLabel,
  pauseLabel,
  resumeLabel,
  sequences,
}: ImmersiveEnhancementProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const portalHostRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SkyChartSceneHandle | null>(null);
  const controllerRef = useRef<SkyChartController | null>(null);
  const attemptedRef = useRef(false);
  const disposedRef = useRef(false);
  const measurementRef = useRef<Measurement>({ width: 0, vh: 0, heroBottom: 0 });
  const lastRecedeRef = useRef(-1);
  const chapterIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const debugRef = useRef<DebugHook | null>(null);

  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [pauseHidden, setPauseHidden] = useState(true);

  const root = useCallback(() => anchorRef.current?.closest<HTMLElement>('[data-instrument]') ?? null, []);
  const chapters = useCallback(
    () => Array.from(root()?.querySelectorAll<HTMLElement>('section[data-instrument-chapter]') ?? []),
    [root],
  );
  const chaptersContainer = useCallback(
    () => root()?.querySelector<HTMLElement>('[data-instrument-chapters]') ?? null,
    [root],
  );
  // D-25/D-27's "hero's bottom edge" (plan Progress, 2026-09-25 orchestrator decision): the
  // hero section itself, not a proxy. Works unchanged before and after Task 8, since both mark
  // the hero with `aria-labelledby="home-heading"`.
  const hero = useCallback(
    () => root()?.querySelector<HTMLElement>('section[aria-labelledby="home-heading"]') ?? null,
    [root],
  );

  const setMode = useCallback((mode: 'static' | 'webgl') => {
    const element = root();
    if (element) element.dataset.immersiveMode = mode;
  }, [root]);

  const teardown = useCallback(() => {
    controllerRef.current?.dispose();
    controllerRef.current = null;
    if (sceneRef.current && !disposedRef.current) {
      disposedRef.current = true;
      sceneRef.current.dispose();
      sceneDisposeCount += 1;
      if (debugRef.current) debugRef.current.disposeCount = sceneDisposeCount;
    }
    sceneRef.current = null;
    setMode('static');
    setActive(false);
  }, [setMode]);

  // Reads hero/chapter/chapters-container geometry and returns everything a frame or a recede
  // decision needs. `heroBottom` (D-25, D-27) is the hero section's own bottom edge. If the hero
  // cannot be found, +Infinity keeps `heroMaskFor`'s fail-safe: an unmeasurable state must hide
  // (mask 0) below 768px rather than risk showing a label that could still collide with it.
  const measure = useCallback(() => {
    const width = window.innerWidth;
    const vh = window.innerHeight;
    const heroElement = hero();
    const heroClientRect = heroElement?.getBoundingClientRect() ?? null;
    const heroBottom = heroClientRect?.bottom ?? Number.POSITIVE_INFINITY;
    const containerRect = chaptersContainer()?.getBoundingClientRect() ?? null;
    const chaptersBottom = containerRect?.bottom ?? 0;
    const rects = chapters().map((chapter) => chapter.getBoundingClientRect());
    const progress = progressFromChapterRects(rects, vh);
    measurementRef.current = { width, vh, heroBottom };
    return { progress, chaptersBottom, vh, heroBottom, width, heroClientRect };
  }, [chapters, chaptersContainer, hero]);

  // N14: at >=768px, tier-2 labels projected over the hero's content box fade to 0 while the
  // hero is in view. The hero section itself (coordinate line, H1, lede, actions, trust row --
  // D-11's whole content, bottom-aligned within it) is used as that box: Task 8's markup has no
  // narrower selector for just the text column.
  const applyHeroExclusion = useCallback((width: number, heroClientRect: DOMRect | null) => {
    const active = width >= HERO_EXCLUSION_MIN_WIDTH && heroClientRect !== null && heroClientRect.bottom > 0;
    sceneRef.current?.setHeroExclusion(
      heroClientRect && { left: heroClientRect.left, top: heroClientRect.top, right: heroClientRect.right, bottom: heroClientRect.bottom },
      active,
    );
  }, []);

  const applyRecede = useCallback((chaptersBottom: number, vh: number) => {
    const k = recedeFactor(chaptersBottom, vh);
    const element = root();
    if (element) element.dataset.recede = String(k);
    // D-24: "Canvas and scrim opacity: 1 - 0.84k." EnvironmentGround's `.scrim` (Task 8) leaves
    // this to be animated at runtime here; the canvas opacity is this scene's own inline style.
    const opacity = String(1 - 0.84 * k);
    if (sceneRef.current) sceneRef.current.canvas.style.opacity = opacity;
    const scrim = element?.querySelector<HTMLElement>('[data-environment-scrim]');
    if (scrim) {
      scrim.style.transition = 'opacity 240ms linear';
      scrim.style.opacity = opacity;
    }
    if (k !== lastRecedeRef.current) {
      lastRecedeRef.current = k;
      // N8: routed through the controller, which stores the scale without rendering while
      // paused (B3) instead of this calling the scene directly on every scroll event.
      controllerRef.current?.setLabelOpacityScale(labelOpacityMultiplier(k));
    }
    return k;
  }, [root]);

  const updatePauseVisibility = useCallback((heroBottom: number, vh: number, chaptersBottom: number) => {
    // D-25: hidden while the hero's bottom edge is still below (further down than) the 60% line
    // -- i.e. heroBottom is large, the same "hero still fills the viewport" direction as the
    // D-27 heroMaskFor rule -- or once the chapter span has receded past the 30% line.
    // +Infinity (hero not found) fails safe to hidden, matching heroMaskFor's own fail-safe.
    const hidden = heroBottom > 0.6 * vh || chaptersBottom < 0.3 * vh;
    setPauseHidden((previous) => (previous === hidden ? previous : hidden));
  }, []);

  const handleRender = useCallback((t: number) => {
    const index = Math.min(CHAPTER_IDS.length - 1, Math.floor(t * CHAPTER_IDS.length));
    const element = root();
    if (element) element.dataset.renderedChapter = CHAPTER_IDS[index];
    if (chapterIndexRef.current !== index) {
      chapterIndexRef.current = index;
      setChapterIndex(index);
    }
    if (debugRef.current) {
      const frame = frameForProgress(t, measurementRef.current);
      const visible = SKY_CHART_NODES.filter((node) => frame.visibleTiers.includes(node.tier));
      const info = sceneRef.current?.getDebugInfo();
      debugRef.current.frame = frame;
      debugRef.current.labelCount = visible.length;
      debugRef.current.labels = visible.map((node) => labels[node.id]);
      debugRef.current.renderCount += 1;
      if (info) {
        debugRef.current.drawCalls = info.drawCalls;
        debugRef.current.pixelRatio = info.pixelRatio;
        debugRef.current.labelTextureSizes = info.labelTextureSizes;
        debugRef.current.labelOpacities = info.labelOpacities;
      }
    }
  }, [labels, root]);

  // B3: always measure, apply recede and update the Pause pill's visibility -- Pause only
  // freezes the camera target (skipped below), never the recede/pill tracking. Without this, a
  // visitor paused at Services kept recede at 0 and full canvas/scrim opacity, and a visitor
  // paused at the top kept the pill showing over the hero.
  const tick = useCallback((immediate = false) => {
    if (!controllerRef.current) return;
    const { progress, chaptersBottom, vh, heroBottom, width, heroClientRect } = measure();
    const k = applyRecede(chaptersBottom, vh);
    updatePauseVisibility(heroBottom, vh, chaptersBottom);
    applyHeroExclusion(width, heroClientRect);
    if (pausedRef.current) return;
    // D-24: rendering is suspended while k=1. A large, sudden scroll (or a fast native jump,
    // as in `scrollIntoViewIfNeeded`) can otherwise leave the eased camera converging toward
    // its target for another second even after the environment is fully receded, which would
    // render extra frames the recede rule says must not happen. Snapping immediately once fully
    // receded closes that gap; short of full recede the normal damped ease still applies.
    controllerRef.current.setTarget(progress, immediate || k >= 1);
  }, [applyHeroExclusion, applyRecede, measure, updatePauseVisibility]);

  // N13: even on a static-with-JS path (reduced motion, Save-Data, no WebGL2, the software
  // gate, or a failure -- anywhere JavaScript still runs but no canvas/controller exists), the
  // D-24 scrim recede still applies, instantly and with no transition. Only the no-JavaScript
  // path (no React at all) leaves the scrim static. Stops the moment the WebGL runtime takes
  // over, which then drives the same scrim through `applyRecede` above with its own transition.
  useEffect(() => {
    if (active) return;
    const element = root();
    if (!element) return;
    const applyStaticRecede = () => {
      const containerRect = chaptersContainer()?.getBoundingClientRect() ?? null;
      const chaptersBottom = containerRect?.bottom ?? 0;
      const vh = window.innerHeight;
      const k = recedeFactor(chaptersBottom, vh);
      element.dataset.recede = String(k);
      const scrim = element.querySelector<HTMLElement>('[data-environment-scrim]');
      if (scrim) {
        scrim.style.transition = 'none';
        scrim.style.opacity = String(1 - 0.84 * k);
      }
    };
    applyStaticRecede();
    window.addEventListener('scroll', applyStaticRecede, { passive: true });
    window.addEventListener('resize', applyStaticRecede);
    return () => {
      window.removeEventListener('scroll', applyStaticRecede);
      window.removeEventListener('resize', applyStaticRecede);
    };
  }, [active, chaptersContainer, root]);

  // One-shot activation behind every capability gate, after the page and first paint load.
  useEffect(() => {
    if (reducedMotion === null || attemptedRef.current) return;
    const element = root();
    if (!element) return;
    setMode('static');
    if (reducedMotion) return;

    let cancelled = false;
    let removeLoad: () => void = () => undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || attemptedRef.current) return;
      observer.disconnect();
      removeLoad = afterLoad(async () => {
        if (cancelled || attemptedRef.current) return;
        attemptedRef.current = true;
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        const probe = probeWebgl();
        // B1 (amended ADR 2026-09-28): a software rasterizer fails the gate like every other
        // gate, quietly. An explicit, test-only global bypasses it for Playwright and
        // measure:immersive under SwiftShader; production visitors never set it.
        const allowSoftwareRenderer = Boolean(
          (window as typeof window & { __SKY_CHART_ALLOW_SOFTWARE_RENDERER__?: boolean }).__SKY_CHART_ALLOW_SOFTWARE_RENDERER__,
        );
        const mode = chooseImmersiveMode({
          reducedMotion: false,
          saveData: Boolean(connection?.saveData),
          webglAvailable: probe.available,
          nearViewport: true,
          sessionContextLost: readSessionContextLost(),
          softwareRenderer: probe.softwareRenderer && !allowSoftwareRenderer,
        });
        if (mode !== 'webgl') return;
        try {
          performance.mark('immersive:import-start');
          const { createSkyChartScene } = await import('./runtime/create-sky-chart-scene');
          performance.mark('immersive:import-end');
          if (cancelled) return;
          const scene = createSkyChartScene({
            quality: chooseRenderQuality({
              viewportWidth: window.innerWidth,
              devicePixelRatio: window.devicePixelRatio,
              hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
            }),
            locale,
            nodeLabels: labels,
            onContextLost: () => {
              markSessionContextLost();
              teardown();
            },
          });
          disposedRef.current = false;
          sceneRef.current = scene;
          await scene.prepare();
          // N9: context loss during `prepare()` runs `onContextLost` -> `teardown()`
          // synchronously, which disposes this exact `scene` and clears `sceneRef.current`.
          // `cancelled` alone does not cover that: the effect itself was never cleaned up, so
          // check identity too, or activation would continue around an already-disposed scene.
          if (cancelled || sceneRef.current !== scene) {
            if (sceneRef.current === scene) scene.dispose();
            if (sceneRef.current === scene) sceneRef.current = null;
            return;
          }
          performance.mark('immersive:scene-created');
          controllerRef.current = new SkyChartController({
            scene,
            mapFrame: (t) => frameForProgress(t, measurementRef.current),
            onRender: handleRender,
          });
          if (process.env.NODE_ENV !== 'production') {
            debugRef.current = {
              frame: null,
              labelCount: 0,
              labels: [],
              disposeCount: sceneDisposeCount,
              renderCount: 0,
              drawCalls: 0,
              pixelRatio: 1,
              labelTextureSizes: [],
              labelOpacities: {},
            };
            (window as typeof window & { __FURLANICH_SKY_CHART__?: DebugHook }).__FURLANICH_SKY_CHART__ = debugRef.current;
          }
          setActive(true);
        } catch {
          teardown();
        }
      });
    }, { rootMargin: '0px 0px 200px 0px' });
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      removeLoad();
    };
  }, [handleRender, labels, locale, reducedMotion, root, setMode, teardown]);

  // Mount the canvas, size it from the document, render the first frame, then flip the mode
  // attribute so the static poster hides only once the canvas has something to show.
  useEffect(() => {
    if (!active || !sceneRef.current) return;
    const { width, vh } = measure();
    sceneRef.current.resize(width, vh);
    tick(true);
    const frame = requestAnimationFrame(() => setMode(sceneRef.current ? 'webgl' : 'static'));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // N10 (plan section 10): resize and orientation changes recompute from the *document* --
  // observing document.documentElement instead of [data-instrument] so a resize that changes
  // the instrument root's own height (e.g. content reflow below it) doesn't miss a real
  // viewport change, and so this matches every other width/height read in this file, which
  // already use window.innerWidth/innerHeight, not the root's own box.
  useEffect(() => {
    if (!active) return;
    if (!sceneRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const { width, vh } = measure();
      sceneRef.current?.resize(width, vh);
      tick(true);
    });
    resizeObserver.observe(document.documentElement);
    return () => resizeObserver.disconnect();
  }, [active, measure, tick]);

  useMotionValueEvent(scrollY, 'change', () => tick());

  useEffect(() => () => {
    controllerRef.current?.dispose();
    controllerRef.current = null;
    if (sceneRef.current && !disposedRef.current) {
      disposedRef.current = true;
      sceneRef.current.dispose();
      sceneDisposeCount += 1;
    }
    sceneRef.current = null;
  }, []);

  const togglePaused = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    controllerRef.current?.setPaused(next);
    if (!next) {
      const { progress } = measure();
      controllerRef.current?.resume(progress);
    }
  }, [measure]);

  const phaseLabel = statusLabel.replace('{current}', sequences[chapterIndex] ?? sequences[0] ?? '');

  return (
    <>
      <span ref={anchorRef} aria-hidden="true" hidden />
      {active
        ? createPortal(
            <div
              ref={(node) => {
                portalHostRef.current = node;
                if (node && sceneRef.current && sceneRef.current.canvas.parentElement !== node) {
                  node.appendChild(sceneRef.current.canvas);
                }
              }}
            />,
            document.body,
          )
        : null}
      {active ? (
        <PauseMotionControl
          paused={paused}
          hidden={pauseHidden}
          pauseLabel={pauseLabel}
          resumeLabel={resumeLabel}
          phaseLabel={phaseLabel}
          onToggle={togglePaused}
        />
      ) : null}
    </>
  );
}
