'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { chooseImmersiveMode, chooseRenderQuality } from '@/lib/immersive-home/capability';
import {
  isMaterialChange,
  mapProgressToInstrumentState,
  progressFromChapterRects,
  type InstrumentState,
} from '@/lib/immersive-home/state';
import type { InstrumentSceneHandle } from './runtime/create-instrument-scene';
import { PauseMotionControl } from './PauseMotionControl';
import styles from './immersive-home.module.css';

interface ImmersiveEnhancementProps {
  statusLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  sequences: readonly string[];
}

type FrameBox = Pick<CSSProperties, 'top' | 'left' | 'width' | 'height'>;

const CHAPTER_IDS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
const CONTEXT_LOST_KEY = 'furlanich:instrument-context-lost';
const WIDE_QUERY = '(min-width: 1024px)';
let sessionContextLost = false;

function readSessionContextLost() {
  if (sessionContextLost) return true;
  try {
    return window.sessionStorage.getItem(CONTEXT_LOST_KEY) === '1';
  } catch {
    return false;
  }
}

function markSessionContextLost() {
  sessionContextLost = true;
  try {
    window.sessionStorage.setItem(CONTEXT_LOST_KEY, '1');
  } catch {
    // Storage may be unavailable; the module flag still prevents retries in this page.
  }
}

function webglAvailable() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

function afterLoad(callback: () => void) {
  if (document.readyState === 'complete') {
    callback();
    return () => undefined;
  }
  window.addEventListener('load', callback, { once: true });
  return () => window.removeEventListener('load', callback);
}

/**
 * The homepage's only client boundary. It leaves the server-rendered static instrument
 * untouched unless every capability gate passes, then loads the Three.js runtime once and
 * renders on demand from native scroll. Any failure returns quietly to the static posters.
 *
 * Wide layouts show the scene in a sticky 4:5 stage over the poster column. Compact layouts
 * lay the same overlay over the active chapter's own frame, so nothing is pinned.
 */
export function ImmersiveEnhancement({ statusLabel, pauseLabel, resumeLabel, sequences }: ImmersiveEnhancementProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<InstrumentSceneHandle | null>(null);
  const attemptedRef = useRef(false);
  const lastStateRef = useRef<InstrumentState | undefined>(undefined);
  const frameRef = useRef(0);
  const pausedRef = useRef(false);

  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wide, setWide] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [frameBox, setFrameBox] = useState<FrameBox | null>(null);

  const root = useCallback(() => trackRef.current?.closest<HTMLElement>('[data-instrument]') ?? null, []);
  const chapters = useCallback(
    () => Array.from(root()?.querySelectorAll<HTMLElement>('section[data-instrument-chapter]') ?? []),
    [root],
  );

  const setMode = useCallback((mode: 'static' | 'webgl') => {
    const element = root();
    if (element) element.dataset.immersiveMode = mode;
  }, [root]);

  const teardown = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    sceneRef.current?.dispose();
    sceneRef.current = null;
    lastStateRef.current = undefined;
    setMode('static');
    setActive(false);
  }, [setMode]);

  const readState = useCallback(() => {
    const rects = chapters().map((chapter) => chapter.getBoundingClientRect());
    const progress = progressFromChapterRects(rects, window.innerHeight);
    const state = mapProgressToInstrumentState(progress);
    return { progress, state, index: CHAPTER_IDS.indexOf(state.chapter) };
  }, [chapters]);

  // Compact placement: the overlay covers the active chapter's frame inside the track.
  const measureFrame = useCallback((index: number) => {
    const track = trackRef.current;
    const frame = chapters()[index]?.querySelector<HTMLElement>('[data-instrument-artwork]');
    if (!track || !frame) return;
    const trackBounds = track.getBoundingClientRect();
    const bounds = frame.getBoundingClientRect();
    setFrameBox({ top: bounds.top - trackBounds.top, left: bounds.left - trackBounds.left, width: bounds.width, height: bounds.height });
  }, [chapters]);

  const renderIfChanged = useCallback((force = false) => {
    if (!sceneRef.current || pausedRef.current) return;
    const { progress, state, index } = readState();
    setChapterIndex(index);
    if (!force && !isMaterialChange(lastStateRef.current, state)) return;
    lastStateRef.current = state;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => sceneRef.current?.render(state, progress));
  }, [readState]);

  // One-shot activation behind every capability gate, after the page and first poster load.
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
          const { createInstrumentScene } = await import('./runtime/create-instrument-scene');
          performance.mark('immersive:import-end');
          if (cancelled) return;
          sceneRef.current = createInstrumentScene({
            quality: chooseRenderQuality({
              viewportWidth: window.innerWidth,
              devicePixelRatio: window.devicePixelRatio,
              hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
            }),
            onContextLost: () => {
              markSessionContextLost();
              teardown();
            },
          });
          await sceneRef.current.prepare();
          if (cancelled) return;
          performance.mark('immersive:scene-created');
          const { index } = readState();
          setChapterIndex(index);
          setWide(window.matchMedia(WIDE_QUERY).matches);
          measureFrame(index);
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
  }, [measureFrame, readState, reducedMotion, root, setMode, teardown]);

  // Attach the canvas to the mounted overlay, size it, and only then hide the posters it covers.
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const canvasHost = canvasHostRef.current;
    if (!active || !scene || !canvasHost) return;
    if (scene.canvas.parentElement !== canvasHost) canvasHost.appendChild(scene.canvas);
    const bounds = canvasHost.getBoundingClientRect();
    scene.resize(bounds.width, bounds.height);
    renderIfChanged(true);
    const frame = requestAnimationFrame(() => setMode(sceneRef.current ? 'webgl' : 'static'));
    return () => cancelAnimationFrame(frame);
  }, [active, wide, frameBox, renderIfChanged, setMode]);

  // Resize and orientation changes recompute from the document and never replay the sequence.
  useEffect(() => {
    if (!active) return;
    const element = root();
    if (!element) return;
    const resizeObserver = new ResizeObserver(() => {
      setWide(window.matchMedia(WIDE_QUERY).matches);
      if (!pausedRef.current) measureFrame(readState().index);
      renderIfChanged(true);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [active, measureFrame, readState, renderIfChanged, root]);

  // Compact layouts follow the active chapter unless paused or the control holds focus.
  useEffect(() => {
    if (!active || wide || pausedRef.current) return;
    if (overlayRef.current?.contains(document.activeElement)) return;
    measureFrame(chapterIndex);
  }, [active, chapterIndex, measureFrame, wide]);

  useMotionValueEvent(scrollY, 'change', () => renderIfChanged());

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    sceneRef.current?.dispose();
    sceneRef.current = null;
  }, []);

  const togglePaused = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (!next) {
      measureFrame(readState().index);
      renderIfChanged(true);
    }
  };

  const status = statusLabel.replace('{current}', sequences[chapterIndex] ?? sequences[0]);
  const overlay = (
    <div
      ref={overlayRef}
      data-instrument-overlay
      data-rendered-chapter={CHAPTER_IDS[chapterIndex]}
      className={styles.enhancementOverlay}
      style={wide ? undefined : frameBox ?? undefined}
    >
      <div ref={canvasHostRef} className={styles.enhancementCanvasHost} />
      <div className={styles.enhancementBar}>
        <span aria-hidden="true" className="hidden font-mono text-[13px] font-semibold leading-5 text-foundation-muted lg:inline">{status}</span>
        <PauseMotionControl paused={paused} pauseLabel={pauseLabel} resumeLabel={resumeLabel} onToggle={togglePaused} />
      </div>
    </div>
  );

  return (
    <div ref={trackRef} data-instrument-track className={styles.enhancementTrack}>
      {active ? (wide ? <div className={styles.enhancementSticky}>{overlay}</div> : overlay) : null}
    </div>
  );
}
