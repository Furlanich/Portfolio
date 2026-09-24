/**
 * Pure geometry and content contracts for the "Position fix" illustrative
 * visualization (HOME-IMPACT). See docs/plans/active/sky-chart-home-redesign-v2.md
 * section 12 (business-visualization architecture) for the approved spec.
 *
 * Everything here is deterministic and framework-free so it can be unit
 * tested directly (scripts/position-fix.test.mjs) without rendering React.
 */

export const POSITION_FIX_VIEW_BOX = { width: 600, height: 300 } as const;

/** Margin, in user units, reserved so on-chart text labels never clip the viewBox edge. */
export const LABEL_MARGIN = 20;

export type PositionFixSourceId = 'whatsapp' | 'book' | 'spreadsheet' | 'email' | 'call';

/** The fixed source id order approved in plan Appendix A / docs/product/pages/home.md HOME-IMPACT. */
export const SOURCE_IDS: readonly PositionFixSourceId[] = [
  'whatsapp',
  'book',
  'spreadsheet',
  'email',
  'call',
];

export interface PositionFixPoint {
  readonly x: number;
  readonly y: number;
}

export interface PositionFixSourcePoint extends PositionFixPoint {
  readonly id: PositionFixSourceId;
}

/** Source bearing origins, in the 600x300 viewBox, in the fixed id order. */
export const SOURCES: readonly PositionFixSourcePoint[] = [
  { id: 'whatsapp', x: 70, y: 70 },
  { id: 'book', x: 300, y: 34 },
  { id: 'spreadsheet', x: 540, y: 80 },
  { id: 'email', x: 560, y: 250 },
  { id: 'call', x: 60, y: 250 },
];

/** Where each source's bearing misses the true position, in SOURCES order. */
export const MISSES: readonly PositionFixPoint[] = [
  { x: 284, y: 150 },
  { x: 318, y: 142 },
  { x: 330, y: 166 },
  { x: 296, y: 178 },
  { x: 276, y: 168 },
];

/** The single point every source resolves to once it reads one connected record. */
export const EXACT_FIX: PositionFixPoint = { x: 300, y: 160 };

/** The dashed "area of doubt" ellipse containing every miss point. */
export const DOUBT_ELLIPSE = { cx: 304, cy: 160, rx: 44, ry: 30 } as const;

/** How far, as a fraction of the source-to-miss segment, the separate-state line overshoots the miss point. */
const MISS_OVERSHOOT_FACTOR = 0.25;

export interface PositionFixLine {
  readonly sourceId: PositionFixSourceId;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

function extendBeyond(from: PositionFixPoint, through: PositionFixPoint, factor: number): PositionFixPoint {
  return {
    x: through.x + (through.x - from.x) * factor,
    y: through.y + (through.y - from.y) * factor,
  };
}

/** Separate-sources state: each line runs from its source, past its miss point, overshooting by 25%. */
export function getSeparateLines(): PositionFixLine[] {
  return SOURCES.map((source, index) => {
    const miss = MISSES[index];
    const end = extendBeyond(source, miss, MISS_OVERSHOOT_FACTOR);
    return { sourceId: source.id, x1: source.x, y1: source.y, x2: end.x, y2: end.y };
  });
}

/** Connected-record state: every line runs from its source straight to the exact fix. */
export function getConnectedLines(): PositionFixLine[] {
  return SOURCES.map((source) => ({
    sourceId: source.id,
    x1: source.x,
    y1: source.y,
    x2: EXACT_FIX.x,
    y2: EXACT_FIX.y,
  }));
}

/**
 * Counts shown by ImpactCounts. Always computed from SOURCES so the displayed
 * numbers cannot drift from the geometry (the honesty rule in plan section 12).
 */
export const counts = {
  separate: SOURCES.length,
  connected: 1,
} as const;

/** One source's display content (bilingual, supplied by the page). */
export interface PositionFixSourceContent {
  readonly id: PositionFixSourceId;
  readonly name: string;
  readonly note: string;
}

/**
 * Props shape for PositionFixFigure / PositionFixToggle / ImpactCounts.
 *
 * Declared locally (not imported from components/homepage/content-types.ts,
 * which is owned by Task 4 and not yet merged). Structurally identical to the
 * planned HomeImpactContent minus `kicker`, `heading` and `introduction`, which
 * belong to the section wrapper (Task 9's HomeImpact.tsx), not this figure.
 */
export interface PositionFixContent {
  readonly illustrativeTag: string;
  readonly toggle: {
    readonly groupLabel: string;
    readonly separateLabel: string;
    readonly connectedLabel: string;
    /** Template containing a literal "{state}" placeholder, filled with separateLabel or connectedLabel. */
    readonly announcement: string;
  };
  readonly figure: {
    readonly title: string;
    readonly separateDescription: string;
    readonly connectedDescription: string;
    readonly doubtLabel: string;
    readonly fixLabel: string;
  };
  readonly sources: readonly PositionFixSourceContent[];
  /** Template containing a literal "{source}" placeholder, filled with each source's name. */
  readonly connectedNoteTemplate: string;
  readonly counts: {
    readonly title: string;
    readonly separateLabel: string;
    readonly connectedLabel: string;
    readonly caption: string;
  };
}
