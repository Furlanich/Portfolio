import type { InstrumentChapterId } from './types';

export type InstrumentState = {
  chapter: InstrumentChapterId;
  /** 0..1 position inside the active chapter. */
  localProgress: number;
  /** 0 intact .. 1 fully separated layers. */
  layerSpread: number;
  /** 0 no routes .. 1 every channel routed into the system. */
  connectionStrength: number;
  /** 0 unordered .. 1 one aligned, coordinated system. */
  coordination: number;
};

export type ChapterRect = { top: number; height: number };

const CHAPTERS: readonly InstrumentChapterId[] = ['recognition', 'fragmentation', 'connection', 'coordination'];

// Values at each chapter's midpoint (0.125, 0.375, 0.625, 0.875), interpolated linearly and
// held flat outside the first and last midpoint. DESIGN-VISUAL owns the four compositions.
const KEYFRAMES = {
  layerSpread: [0, 1, 0.4, 0],
  connectionStrength: [0, 0, 1, 1],
  coordination: [0, 0, 0.3, 1],
} as const;

const MATERIAL_EPSILON = 0.005;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function interpolate(values: readonly number[], progress: number): number {
  const position = progress * values.length - 0.5;
  if (position <= 0) return values[0];
  if (position >= values.length - 1) return values[values.length - 1];
  const index = Math.floor(position);
  const fraction = position - index;
  return values[index] + (values[index + 1] - values[index]) * fraction;
}

export function mapProgressToInstrumentState(progress: number): InstrumentState {
  const clamped = clamp01(progress);
  const index = Math.min(CHAPTERS.length - 1, Math.floor(clamped * CHAPTERS.length));

  return {
    chapter: CHAPTERS[index],
    localProgress: clamped * CHAPTERS.length - index,
    layerSpread: interpolate(KEYFRAMES.layerSpread, clamped),
    connectionStrength: interpolate(KEYFRAMES.connectionStrength, clamped),
    coordination: interpolate(KEYFRAMES.coordination, clamped),
  };
}

/**
 * Progress of the viewport centre through the chapter elements, read from their current
 * layout. Recomputing from the document after resize keeps the active chapter instead of
 * replaying from Recognition, whatever the width-specific composition is.
 */
export function progressFromChapterRects(rects: readonly ChapterRect[], viewportHeight: number): number {
  if (rects.length === 0) return 0;
  const centre = viewportHeight / 2;
  if (centre < rects[0].top) return 0;

  let index = 0;
  for (let candidate = 0; candidate < rects.length; candidate += 1) {
    if (rects[candidate].top <= centre) index = candidate;
  }
  const rect = rects[index];
  const local = rect.height > 0 ? clamp01((centre - rect.top) / rect.height) : 1;
  return (index + local) / rects.length;
}

export function isMaterialChange(previous: InstrumentState | undefined, next: InstrumentState): boolean {
  if (!previous || previous.chapter !== next.chapter) return true;
  return (
    Math.abs(previous.localProgress - next.localProgress) > MATERIAL_EPSILON ||
    Math.abs(previous.layerSpread - next.layerSpread) > MATERIAL_EPSILON ||
    Math.abs(previous.connectionStrength - next.connectionStrength) > MATERIAL_EPSILON ||
    Math.abs(previous.coordination - next.coordination) > MATERIAL_EPSILON
  );
}
