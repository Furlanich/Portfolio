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

export interface PositionFixCounts {
  readonly separate: number;
  readonly connected: number;
}

/**
 * Drives the counts shown by ImpactCounts from a sources array's length,
 * rather than a hard-coded number, so the displayed numbers cannot drift
 * from the geometry (the honesty rule in plan section 12). Exported as its
 * own function (not inlined into `counts` below) so a test can prove the
 * count genuinely tracks array length by calling it on a mutated copy of
 * SOURCES, instead of only checking the fixed value 5.
 */
export function computeCounts(sources: readonly PositionFixSourcePoint[]): PositionFixCounts {
  return {
    separate: sources.length,
    connected: 1,
  };
}

/** Counts shown by ImpactCounts, computed from the real SOURCES list. */
export const counts: PositionFixCounts = computeCounts(SOURCES);

/**
 * S4 (independent review round 1, amended by the orchestrator): container-
 * query ladder for on-chart SVG text labels (.fixLabel: source names, "area
 * of doubt", "exact fix"). From 300px the label's SVG user-unit font-size
 * steps down as the container narrows, so the *rendered* pixel size
 * (unit * width / 600, since the SVG's viewBox width is 600 and it scales to
 * fill its container) never drops below 12px. Below 300px the full-name
 * label is hidden (unit: null) and replaced by a numeral key (see
 * MARKER_NUMBER_UNIT below), not by nothing. Mirrored by hand in
 * position-fix.module.css's `@container` rules, since CSS cannot read this
 * table directly; this table and renderedFixLabelPx are the test seam that
 * proves the chosen steps hold the >=12px floor at every width
 * (scripts/position-fix.test.mjs).
 */
export const FIX_LABEL_BREAKPOINTS: readonly { readonly minWidth: number; readonly unit: number | null }[] = [
  { minWidth: 600, unit: 12 },
  { minWidth: 500, unit: 15 },
  { minWidth: 400, unit: 18 },
  { minWidth: 300, unit: 24 },
  { minWidth: 0, unit: null }, // below 300px: the full-name .fixLabel is hidden; a .markerNumber key replaces it
];

/** The .fixLabel SVG font-size (in user units), or null when it should be hidden, for a given container width. */
export function fixLabelUnitForWidth(width: number): number | null {
  const band = FIX_LABEL_BREAKPOINTS.find((candidate) => width >= candidate.minWidth);
  return band ? band.unit : null;
}

/**
 * The rendered on-screen pixel size of a .fixLabel (or .markerNumber) set at
 * `unit` SVG user units, once the (viewBox width 600) SVG is scaled to fill
 * a container of `width` CSS pixels. Pure "test seam" per the independent
 * review: it takes the unit directly rather than looking it up, so a test
 * can pair it with fixLabelUnitForWidth and assert the floor holds at each
 * breakpoint.
 */
export function renderedFixLabelPx(width: number, unit: number): number {
  return (unit * width) / POSITION_FIX_VIEW_BOX.width;
}

/**
 * S4 amendment (orchestrator decision, plan SHA 5b8a8e5): below the 300px
 * container-width floor, source markers show a numeral key (1-5, in fixed
 * SOURCES order) instead of hiding their label outright. The figure is
 * expected to render at roughly 236px wide inside a 320px viewport (the
 * narrowest width this design targets); renderedFixLabelPx(236,
 * MARKER_NUMBER_UNIT) must stay >=12px. 32 user units clears that floor
 * (~12.19px at 236px) with a documented safety margin over the ~30.51-unit
 * value that would land exactly on 12px, in case the figure renders a few
 * pixels narrower than 236px in practice.
 */
export const MARKER_NUMBER_UNIT = 32;

/** The narrowest container width (px) this figure is designed for: roughly the SVG's width inside a 320px viewport. */
export const MARKER_NUMBER_MIN_EXPECTED_WIDTH = 236;

/**
 * The numeral key (1-5) shown beside a source's marker below the 300px
 * floor, in fixed SOURCES/SOURCE_IDS order (whatsapp=1 ... call=5). These
 * are decorative duplicates of the visible source <ol>'s own numbering
 * (both the SVG's numeral text and the list's implicit ordinal are driven
 * by the same SOURCE_IDS order, so they can never disagree); the SVG's
 * role="img" name/description (its <title>/<desc>) carry the accessible
 * meaning, not this numeral glyph.
 */
export function markerNumberForSourceId(id: PositionFixSourceId): number {
  return SOURCE_IDS.indexOf(id) + 1;
}

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
