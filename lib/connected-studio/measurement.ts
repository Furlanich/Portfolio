/**
 * PLAN-SPF-V1 Task 9: deterministic accounting for the optional connected-studio engine/runtime
 * closure. Pure data in, report out: the production scripts do the file and browser I/O.
 */

export const OPTIONAL_CLOSURE_LIMIT_BYTES = 120 * 1024;

export type EmittedChunk = {
  path: string;
  rawBytes: number;
  brotliBytes: number;
  imports: readonly string[];
};

export type ClosureReport = {
  chunks: readonly { path: string; rawBytes: number; brotliBytes: number }[];
  rawBytes: number;
  brotliBytes: number;
  limitBytes: number;
  withinLimit: boolean;
  violations: readonly string[];
};

/**
 * The bytes of everything the optional engine pulls in on top of the matched static route: the entry
 * chunks plus every nested dependency, each counted once. Chunks in `alreadyLoaded` (the static route's
 * own requests) cost nothing and end that branch, because whatever they import was fetched with them.
 * A dependency absent from the emitted graph is a violation: skipping it would undercount the closure.
 */
export function measureOptionalClosure(input: {
  entries: readonly string[];
  chunks: readonly EmittedChunk[];
  alreadyLoaded?: readonly string[];
  limitBytes?: number;
}): ClosureReport {
  const limitBytes = input.limitBytes ?? OPTIONAL_CLOSURE_LIMIT_BYTES;
  const byPath = new Map(input.chunks.map((item) => [item.path, item]));
  const alreadyLoaded = new Set(input.alreadyLoaded ?? []);
  const counted: { path: string; rawBytes: number; brotliBytes: number }[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();
  const pending = [...input.entries];
  while (pending.length) {
    const next = pending.pop() as string;
    if (seen.has(next) || alreadyLoaded.has(next)) continue;
    seen.add(next);
    const found = byPath.get(next);
    if (!found) {
      unknown.push(next);
      continue;
    }
    counted.push({ path: found.path, rawBytes: found.rawBytes, brotliBytes: found.brotliBytes });
    pending.push(...found.imports);
  }
  const rawBytes = counted.reduce((sum, item) => sum + item.rawBytes, 0);
  const brotliBytes = counted.reduce((sum, item) => sum + item.brotliBytes, 0);
  const violations = [
    ...unknown.sort().map((path) => `${path} is referenced by the closure but is not in the emitted chunk graph`),
    ...(brotliBytes > limitBytes ? [`${brotliBytes} bytes Brotli exceeds the ${limitBytes} byte ceiling`] : []),
  ];
  return { chunks: counted, rawBytes, brotliBytes, limitBytes, withinLimit: violations.length === 0, violations };
}

/**
 * The browser's optional script requests against the emitted closure. Both directions matter: a closure
 * chunk that was never fetched means the graph overstates the route, and a fetched script the graph does
 * not explain means the measurement missed a dependency.
 */
export function crossCheckClosure(input: { requested: readonly string[]; closure: Pick<ClosureReport, 'chunks'> }): {
  missingFromRequests: string[];
  unexpectedRequests: string[];
} {
  const requested = new Set(input.requested);
  const emitted = new Set(input.closure.chunks.map((item) => item.path));
  return {
    missingFromRequests: [...emitted].filter((path) => !requested.has(path)).sort(),
    unexpectedRequests: [...requested].filter((path) => !emitted.has(path)).sort(),
  };
}

/**
 * The optional entries of a route and their complete closure. A route's own chunks are the ones its HTML
 * references; the optional entries are the chunks those name in their async loaders without the route loading
 * them itself. An empty entry list is returned, not hidden: the caller must report a route with nothing to measure.
 */
export function buildRouteClosure(input: { referenced: readonly string[]; chunks: readonly EmittedChunk[]; limitBytes?: number }): {
  entries: string[];
  closure: ClosureReport;
} {
  const referenced = new Set(input.referenced);
  const byPath = new Map(input.chunks.map((item) => [item.path, item]));
  const entries = [...new Set(input.referenced.flatMap((path) => byPath.get(path)?.imports ?? []))].filter((path) => !referenced.has(path)).sort();
  return { entries, closure: measureOptionalClosure({ entries, chunks: input.chunks, alreadyLoaded: input.referenced, limitBytes: input.limitBytes }) };
}

export const VITALS_EXPECT_MODES = ['static', 'live'] as const;
export type VitalsExpectMode = (typeof VITALS_EXPECT_MODES)[number];

/**
 * The vitals script's arguments. A typo must never turn missing evidence into a passing gate, so the journey
 * count must be a positive integer, the profile one the script defines, and the expected mode a known one.
 */
export function validateVitalsOptions(input: {
  journeys: unknown;
  profile?: string;
  profiles: readonly string[];
  expectMode?: string;
}): { journeys: number; profiles: string[]; expectMode: VitalsExpectMode } {
  const raw = typeof input.journeys === 'string' ? input.journeys.trim() : '';
  const journeys = Number(raw);
  if (!/^[0-9]+$/.test(raw) || !Number.isSafeInteger(journeys) || journeys < 1) {
    throw new Error(`--journeys must be a positive integer, got "${String(input.journeys)}"`);
  }
  if (input.profile !== undefined && !input.profiles.includes(input.profile)) {
    throw new Error(`--profile "${input.profile}" is not one of: ${input.profiles.join(', ')}`);
  }
  const expectMode = input.expectMode ?? 'static';
  if (!(VITALS_EXPECT_MODES as readonly string[]).includes(expectMode)) {
    throw new Error(`--expect-mode must be one of: ${VITALS_EXPECT_MODES.join(', ')}, got "${expectMode}"`);
  }
  return { journeys, profiles: input.profile ? [input.profile] : [...input.profiles], expectMode: expectMode as VitalsExpectMode };
}

const REQUIRED_INTERACTIONS = ['fragment-link', 'keyboard-focus', 'scroll', 'route-link'] as const;
const LIVE_INTERACTIONS = ['pause', 'resume'] as const;

/** The interactions a journey still owes. A page that is live also owes Pause and Resume. */
export function missingInteractions(input: { mode: 'static' | 'live'; completed: readonly string[] }): string[] {
  const required: readonly string[] = input.mode === 'live' ? [...REQUIRED_INTERACTIONS, ...LIVE_INTERACTIONS] : REQUIRED_INTERACTIONS;
  return required.filter((name) => !input.completed.includes(name));
}

export type LayoutShiftEntry = { value: number; time: number; enhancement: boolean };

/**
 * Splits a page's layout shifts into the whole page and the part caused by the enhancement: a shift with a
 * source inside the connected ground, or one at or after activation that is not a web-font swap (during a font
 * load or within 500 ms after it). Sums stay raw: the zero gate compares them unrounded.
 */
export function attributeShifts(input: {
  shifts: readonly LayoutShiftEntry[];
  fontLoads: readonly (readonly [number, number | null])[];
  activationAt: number | null;
}): { wholePage: number; fromEnhancement: number; enhancementDetail: readonly LayoutShiftEntry[] } {
  const nearFontSwap = (shift: LayoutShiftEntry) =>
    input.fontLoads.some(([start, end]) => shift.time >= start && (end === null || shift.time <= end + 500));
  const attributed = input.shifts.filter(
    (shift) => shift.enhancement || (input.activationAt !== null && shift.time >= input.activationAt - 50 && !nearFontSwap(shift)),
  );
  const sum = (list: readonly LayoutShiftEntry[]) => list.reduce((total, shift) => total + shift.value, 0);
  return { wholePage: sum(input.shifts), fromEnhancement: sum(attributed), enhancementDetail: attributed };
}

/**
 * The chunk files a chunk's source names in its Turbopack async-loader lists ("static/chunks/NAME"),
 * each once and never itself. Media files and prose that merely mention the directory are not chunks.
 */
export function chunkImports(source: string, ownPath: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)) found.add(match[1]);
  found.delete(ownPath);
  return [...found];
}

export type Rgb = readonly [number, number, number];
export type Verdict = 'PASS' | 'FAIL' | 'OPEN';

const channel = (value: number): number => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** WCAG 2 contrast ratio, symmetric, from 1 to 21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** The lowest contrast of a text colour against every background sample behind it: the worst pixel decides. */
export function worstContrast(text: Rgb, backgrounds: readonly Rgb[]): number {
  if (!backgrounds.length) throw new Error('worstContrast needs at least one background sample');
  return Math.min(...backgrounds.map((background) => contrastRatio(text, background)));
}

/**
 * A measured value against its limit. A missing value is OPEN, never a passing zero: "max" is inclusive
 * (value <= limit), "below" is strict (value < limit).
 */
export function judgeMetric(value: number | null | undefined, limit: number, direction: 'max' | 'below' = 'max'): Verdict {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'OPEN';
  return (direction === 'max' ? value <= limit : value < limit) ? 'PASS' : 'FAIL';
}

export type HardwareMetrics = {
  activeIntervalP95Ms?: number | null;
  renderCpuP95Ms?: number | null;
  renderGpuP95Ms?: number | null;
  interactionTaskMaxMs?: number | null;
  drawCallsMax?: number | null;
  pixelRatio?: number | null;
  ambientFps?: number | null;
  pausedDraws?: number | null;
  pausedRafCalls?: number | null;
  hiddenDraws?: number | null;
  footerDraws?: number | null;
  maxContexts?: number | null;
  listenerGrowth?: number | null;
};

/**
 * The plan's pass criteria (Task 9, hardware protocol) per tier. Every row must pass for the tier; a row that
 * fails fails the run even if another is unmeasured, and an unmeasured row leaves the run OPEN. The CPU submit
 * time is a CPU-only estimate and is never called a GPU measurement: the GPU row needs timer queries.
 */
export function judgeHardware(metrics: HardwareMetrics, tier: 'wide' | 'compact'): {
  verdict: Verdict;
  rows: Record<keyof HardwareMetrics, { value: number | null | undefined; limit: number; verdict: Verdict }>;
} {
  const wide = tier === 'wide';
  const limits: Record<keyof HardwareMetrics, [number, 'max' | 'below']> = {
    activeIntervalP95Ms: [20, 'max'],
    renderCpuP95Ms: [20, 'max'],
    renderGpuP95Ms: [20, 'max'],
    interactionTaskMaxMs: [50, 'below'],
    drawCallsMax: [wide ? 28 : 18, 'max'],
    pixelRatio: [wide ? 1.5 : 1.25, 'max'],
    ambientFps: [wide ? 30 : 20, 'max'],
    pausedDraws: [0, 'max'],
    pausedRafCalls: [0, 'max'],
    hiddenDraws: [0, 'max'],
    footerDraws: [0, 'max'],
    maxContexts: [1, 'max'],
    listenerGrowth: [2, 'max'],
  };
  const rows = Object.fromEntries(
    (Object.keys(limits) as (keyof HardwareMetrics)[]).map((key) => [key, { value: metrics[key], limit: limits[key][0], verdict: judgeMetric(metrics[key], limits[key][0], limits[key][1]) }]),
  ) as Record<keyof HardwareMetrics, { value: number | null | undefined; limit: number; verdict: Verdict }>;
  const verdicts = Object.values(rows).map((row) => row.verdict);
  return { verdict: verdicts.includes('FAIL') ? 'FAIL' : verdicts.includes('OPEN') ? 'OPEN' : 'PASS', rows };
}
