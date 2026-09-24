'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { chooseImmersiveMode, chooseRenderQuality } from '@/lib/immersive-home/capability';
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

function webglAvailable(): boolean {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
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

  // Reads chapter/chapters-container geometry and returns everything a frame or a recede
  // decision needs. `heroBottom` (D-27) is the top of the chapters container: the hero section
  // sits immediately above it in document flow, so its bottom edge coincides with that point.
  const measure = useCallback(() => {
    const width = window.innerWidth;
    const vh = window.innerHeight;
    const containerRect = chaptersContainer()?.getBoundingClientRect() ?? null;
    const heroBottom = containerRect?.top ?? 0;
    const chaptersBottom = containerRect?.bottom ?? 0;
    const rects = chapters().map((chapter) => chapter.getBoundingClientRect());
    const progress = progressFromChapterRects(rects, vh);
    measurementRef.current = { width, vh, heroBottom };
    return { progress, chaptersBottom, vh, heroBottom, width };
  }, [chapters, chaptersContainer]);

  const applyRecede = useCallback((chaptersBottom: number, vh: number) => {
    const k = recedeFactor(chaptersBottom, vh);
    const element = root();
    if (element) element.dataset.recede = String(k);
    if (sceneRef.current) sceneRef.current.canvas.style.opacity = String(1 - 0.84 * k);
    if (k !== lastRecedeRef.current) {
      lastRecedeRef.current = k;
      sceneRef.current?.setLabelOpacity(labelOpacityMultiplier(k));
    }
    return k;
  }, [root]);

  const updatePauseVisibility = useCallback((heroBottom: number, vh: number, chaptersBottom: number) => {
    const hidden = heroBottom < 0.6 * vh || chaptersBottom < 0.3 * vh;
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
      debugRef.current.frame = frame;
      debugRef.current.labelCount = visible.length;
      debugRef.current.labels = visible.map((node) => labels[node.id]);
      debugRef.current.renderCount += 1;
    }
  }, [labels, root]);

  const tick = useCallback((immediate = false) => {
    if (pausedRef.current || !controllerRef.current) return;
    const { progress, chaptersBottom, vh, heroBottom } = measure();
    const k = applyRecede(chaptersBottom, vh);
    updatePauseVisibility(heroBottom, vh, chaptersBottom);
    // D-24: rendering is suspended while k=1. A large, sudden scroll (or a fast native jump,
    // as in `scrollIntoViewIfNeeded`) can otherwise leave the eased camera converging toward
    // its target for another second even after the environment is fully receded, which would
    // render extra frames the recede rule says must not happen. Snapping immediately once fully
    // receded closes that gap; short of full recede the normal damped ease still applies.
    controllerRef.current.setTarget(progress, immediate || k >= 1);
  }, [applyRecede, measure, updatePauseVisibility]);

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
        const mode = chooseImmersiveMode({
          reducedMotion: false,
          saveData: Boolean(connection?.saveData),
          webglAvailable: webglAvailable(),
          nearViewport: true,
          sessionContextLost: readSessionContextLost(),
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
          if (cancelled) {
            scene.dispose();
            sceneRef.current = null;
            return;
          }
          performance.mark('immersive:scene-created');
          controllerRef.current = new SkyChartController({
            scene,
            mapFrame: (t) => frameForProgress(t, measurementRef.current),
            onRender: handleRender,
          });
          if (process.env.NODE_ENV !== 'production') {
            debugRef.current = { frame: null, labelCount: 0, labels: [], disposeCount: sceneDisposeCount, renderCount: 0 };
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

  // Resize and orientation changes recompute from the document and never replay the sequence.
  useEffect(() => {
    if (!active) return;
    const element = root();
    if (!element || !sceneRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const { width, vh } = measure();
      sceneRef.current?.resize(width, vh);
      tick(true);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [active, measure, root, tick]);

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
