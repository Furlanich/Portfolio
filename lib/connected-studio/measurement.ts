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

/**
 * The cadence of a run of frames, from their timestamps: intervals divided by the time they span. Counting frames
 * and dividing by an observation window overstates it when the window is shorter than the frames' own span.
 */
export function cadenceFps(timestampsMs: readonly number[]): number | null {
  if (timestampsMs.length < 2) return null;
  const span = timestampsMs[timestampsMs.length - 1] - timestampsMs[0];
  return span > 0 ? ((timestampsMs.length - 1) / span) * 1000 : null;
}

// --- PLAN-SFC-V1 Task 3: early baselines for the reading, intake and legal routes ---------------------------

export const COLD_BASELINE_JOURNEYS = 5;
export const FRAME_INTERVAL_SOURCE = 'frame-timestamps';

export type ColdJourneySample = {
  startupCpuMs: number;
  longestTaskMs: number;
};

export type ColdBaselineSummary = {
  route: string;
  locale: string;
  profile: string;
  basePath: string;
  journeys: number;
  firstLoadJsBrotliBytes: number;
  criticalJsBrotliBytes: number;
  startupCpuP95Ms: number;
  longestTaskMs: number;
  method: string;
  tracePaths: readonly string[];
};

/** Nearest-rank percentile. Zero samples is an error: a missing measurement is never a passing zero. */
export function percentileOf(values: readonly number[], p: number): number {
  if (!values.length) throw new Error('A percentile was requested over zero samples.');
  if (values.some((value) => !Number.isFinite(value))) throw new Error('A percentile needs finite samples.');
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
}

/**
 * Frame intervals from the timestamps of consecutive renders. The source label is part of the contract: a render's
 * CPU submit time, a GPU timer query or a task duration is not an interval between frames and would pass the 20 ms
 * row on any scene. A gap of `maxGapMs` or more is a pause between scroll bursts, not a frame interval.
 */
export function activeFrameIntervals(input: { source: string; timestampsMs: readonly number[]; maxGapMs?: number }): number[] {
  if (input.source !== FRAME_INTERVAL_SOURCE) {
    throw new Error(`A frame interval must come from ${FRAME_INTERVAL_SOURCE}, got "${String(input.source)}"`);
  }
  const timestamps = input.timestampsMs;
  if (timestamps.length < 2) throw new Error(`Frame intervals need at least two frame timestamps, got ${timestamps.length}`);
  if (timestamps.some((value) => !Number.isFinite(value))) throw new Error('Frame timestamps must be finite numbers');
  for (let index = 1; index < timestamps.length; index += 1) {
    if (timestamps[index] <= timestamps[index - 1]) throw new Error('Frame timestamps must be strictly increasing (monotonic)');
  }
  const maxGapMs = input.maxGapMs ?? 250;
  const intervals: number[] = [];
  for (let index = 1; index < timestamps.length; index += 1) {
    const gap = timestamps[index] - timestamps[index - 1];
    if (gap < maxGapMs) intervals.push(gap);
  }
  if (!intervals.length) throw new Error(`Every gap was ${maxGapMs} ms or longer: there is no frame interval to measure`);
  return intervals;
}

const requireText = (name: string, value: unknown): string => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`A cold baseline needs a ${name}`);
  return value;
};
const requireSampleNumber = (name: string, value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`Every cold journey needs a finite ${name} of zero or more, got ${String(value)}`);
  return value;
};

/**
 * The cold-route baseline of one route, locale and profile: the first-load JS of the emitted export (everything the
 * browser requested through the settle window, and the critical part requested before the load event) and the p95 of
 * the startup CPU over at least five cold journeys, with the method and one retained trace per journey. Absent
 * samples, profile, method or traces are rejected, never summarized.
 */
export function summarizeColdBaseline(input: {
  route: string;
  locale: string;
  profile: string;
  basePath: string;
  firstLoadJsBrotliBytes: number;
  criticalJsBrotliBytes: number;
  samples: readonly ColdJourneySample[];
  method: string;
  tracePaths: readonly string[];
}): ColdBaselineSummary {
  const route = requireText('route', input.route);
  const locale = requireText('locale', input.locale);
  const profile = requireText('profile', input.profile);
  const method = requireText('method', input.method);
  if (typeof input.basePath !== 'string') throw new Error('A cold baseline needs a base path');
  if (input.samples.length < COLD_BASELINE_JOURNEYS) {
    throw new Error(`A cold baseline needs ${COLD_BASELINE_JOURNEYS} cold journeys of samples, got ${input.samples.length}`);
  }
  if (input.tracePaths.length !== input.samples.length || input.tracePaths.some((trace) => typeof trace !== 'string' || !trace.trim())) {
    throw new Error(`A cold baseline retains one raw trace per journey: ${input.samples.length} samples, ${input.tracePaths.length} traces`);
  }
  if (typeof input.firstLoadJsBrotliBytes !== 'number' || !Number.isFinite(input.firstLoadJsBrotliBytes) || input.firstLoadJsBrotliBytes <= 0) {
    throw new Error(`A cold baseline needs the first-load JS Brotli bytes, got ${String(input.firstLoadJsBrotliBytes)}`);
  }
  if (typeof input.criticalJsBrotliBytes !== 'number' || !Number.isFinite(input.criticalJsBrotliBytes) || input.criticalJsBrotliBytes <= 0) {
    throw new Error(`A cold baseline needs the critical JS Brotli bytes (requested before the load event), got ${String(input.criticalJsBrotliBytes)}`);
  }
  if (input.criticalJsBrotliBytes > input.firstLoadJsBrotliBytes) {
    throw new Error('The critical JS bytes cannot exceed the first-load JS bytes they are a part of');
  }
  const startup = input.samples.map((sample) => requireSampleNumber('startupCpuMs', sample.startupCpuMs));
  const tasks = input.samples.map((sample) => requireSampleNumber('longestTaskMs', sample.longestTaskMs));
  return {
    route,
    locale,
    profile,
    basePath: input.basePath,
    journeys: input.samples.length,
    firstLoadJsBrotliBytes: input.firstLoadJsBrotliBytes,
    criticalJsBrotliBytes: input.criticalJsBrotliBytes,
    startupCpuP95Ms: percentileOf(startup, 95),
    longestTaskMs: Math.max(...tasks),
    method,
    tracePaths: [...input.tracePaths],
  };
}

export type TraceEvent = {
  pid: number;
  tid: number;
  ts: number;
  ph: string;
  name: string;
  dur?: number;
  args?: Record<string, unknown>;
};

export type StartupCost = {
  pid: number;
  tid: number;
  tasks: number;
  taskCpuMs: number;
  longestTaskMs: number;
  scriptCpuMs: number;
  evaluationCpuMs: number;
};

const SCRIPT_EVENTS = new Set(['EvaluateScript', 'v8.compile', 'FunctionCall', 'RunMicrotasks']);
const EVALUATION_EVENTS = new Set(['EvaluateScript', 'v8.compile']);

/**
 * The main-thread cost of loading one document, from a Chromium trace (timestamps and durations in microseconds):
 * every RunTask of that document's renderer main thread from its navigationStart on, and the script work inside
 * them (evaluation, compile, calls and microtasks, each counted once where they nest). Network time and idle time
 * are not tasks and cost nothing here. A trace that cannot be tied to the document, its main thread or at least
 * one task is rejected: a missing measurement is never zero.
 */
export function mainThreadStartupCost(input: { events: readonly TraceEvent[]; documentUrl: string }): StartupCost {
  const navigation = input.events.find((event) => {
    const data = event.args?.data as { documentLoaderURL?: string } | undefined;
    return event.name === 'navigationStart' && data?.documentLoaderURL === input.documentUrl;
  });
  if (!navigation) throw new Error(`The trace has no navigationStart event for ${input.documentUrl}`);
  const thread = input.events.find((event) => event.ph === 'M' && event.name === 'thread_name' && event.pid === navigation.pid && event.args?.name === 'CrRendererMain');
  if (!thread) throw new Error(`The trace has no CrRendererMain thread for process ${navigation.pid}`);
  const onThread = input.events.filter((event) => event.pid === thread.pid && event.tid === thread.tid && event.ph === 'X' && typeof event.dur === 'number' && event.ts >= navigation.ts);
  const tasks = onThread.filter((event) => event.name === 'RunTask');
  if (!tasks.length) throw new Error('The trace has no main-thread tasks after navigationStart');
  // Nested events (a call inside an evaluation) are counted once: only the time not already covered is added.
  const coveredMicros = (names: ReadonlySet<string>): number => {
    let total = 0;
    let coveredUntil = -Infinity;
    for (const event of onThread.filter((item) => names.has(item.name)).sort((a, b) => a.ts - b.ts)) {
      const end = event.ts + (event.dur as number);
      if (end <= coveredUntil) continue;
      total += end - Math.max(event.ts, coveredUntil);
      coveredUntil = end;
    }
    return total;
  };
  const taskMillis = tasks.map((task) => (task.dur as number) / 1000);
  return {
    pid: thread.pid,
    tid: thread.tid,
    tasks: tasks.length,
    taskCpuMs: taskMillis.reduce((sum, value) => sum + value, 0),
    longestTaskMs: Math.max(...taskMillis),
    scriptCpuMs: coveredMicros(SCRIPT_EVENTS) / 1000,
    evaluationCpuMs: coveredMicros(EVALUATION_EVENTS) / 1000,
  };
}
