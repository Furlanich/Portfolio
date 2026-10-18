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
  /** The comma-separated --routes value; omitted means every known route. */
  routes?: string;
  knownRoutes?: readonly string[];
}): { journeys: number; profiles: string[]; expectMode: VitalsExpectMode; routes: string[] } {
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
  const known = input.knownRoutes ?? [];
  let routes = [...known];
  if (input.routes !== undefined) {
    routes = input.routes.split(',').map((route) => route.trim());
    const unknown = routes.filter((route) => !known.includes(route));
    if (!routes.length || unknown.length) {
      throw new Error(`--routes must name known routes (${known.join(', ')}), got "${input.routes}"${unknown.length ? `; unknown: ${unknown.join(', ')}` : ''}`);
    }
    if (new Set(routes).size !== routes.length) throw new Error(`--routes names a route more than once: "${input.routes}"`);
  }
  return { journeys, profiles: input.profile ? [input.profile] : [...input.profiles], expectMode: expectMode as VitalsExpectMode, routes };
}

const REQUIRED_INTERACTIONS = ['fragment-link', 'keyboard-focus', 'scroll', 'route-link'] as const;
const LIVE_INTERACTIONS = ['pause', 'resume'] as const;

/** The interactions a journey still owes. A page that is live also owes Pause and Resume. */
export function missingInteractions(input: { mode: 'static' | 'live'; completed: readonly string[]; fragmentLink?: boolean }): string[] {
  // A page with no in-page fragment links (the Atlas pages) declares so explicitly; the default still owes one.
  const base: readonly string[] = input.fragmentLink === false ? REQUIRED_INTERACTIONS.filter((name) => name !== 'fragment-link') : REQUIRED_INTERACTIONS;
  const required: readonly string[] = input.mode === 'live' ? [...base, ...LIVE_INTERACTIONS] : base;
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

export type RenderedFrame = { t: number; cpuMs: number; gpuMs: number | null };

export type LateFrameAttribution = {
  intervals: number;
  late: number;
  renderCpu: number;
  gpu: number;
  schedulerOrPresentation: number;
  unmeasured: number;
};

const RENDER_CPU_BLOCKING_MS = 8; // half a 60 Hz refresh spent submitting draw calls
const GPU_BACKPRESSURE_MS = 20; // the plan's per-render row: a frame the GPU held longer than this

/**
 * What the frame before a late interval was doing. An interval of `lateMs` or more (and under the 250 ms that
 * separates scroll bursts) is attributed to that frame's render CPU time, to its GPU time, to neither, or left
 * unmeasured when the GPU time is missing: a missing GPU time can never clear the GPU. "Neither" means the render
 * itself was cheap, so the delay came from when the frame was requested or when it was presented: the scheduler,
 * the main thread or the compositor and display path. It narrows the next trace, it does not prove a cause.
 */
export function classifyLateFrames(input: { frames: readonly RenderedFrame[]; lateMs?: number }): LateFrameAttribution {
  const { frames } = input;
  const lateMs = input.lateMs ?? 25;
  if (frames.length < 2) throw new Error(`Late-frame attribution needs at least two frames, got ${frames.length}`);
  frames.forEach((frame) => {
    if (!Number.isFinite(frame.t)) throw new Error('Every frame needs a finite timestamp t');
    if (!Number.isFinite(frame.cpuMs) || frame.cpuMs < 0) throw new Error(`Every frame needs a finite cpuMs of zero or more, got ${String(frame.cpuMs)}`);
    if (frame.gpuMs !== null && (!Number.isFinite(frame.gpuMs) || frame.gpuMs < 0)) throw new Error(`gpuMs must be null or a finite number of zero or more, got ${String(frame.gpuMs)}`);
  });
  const result: LateFrameAttribution = { intervals: 0, late: 0, renderCpu: 0, gpu: 0, schedulerOrPresentation: 0, unmeasured: 0 };
  for (let index = 1; index < frames.length; index += 1) {
    const gap = frames[index].t - frames[index - 1].t;
    if (gap <= 0) throw new Error('Frame timestamps must be strictly increasing (monotonic)');
    if (gap >= 250) continue;
    result.intervals += 1;
    if (gap < lateMs) continue;
    result.late += 1;
    const before = frames[index - 1];
    if (before.cpuMs >= RENDER_CPU_BLOCKING_MS) result.renderCpu += 1;
    else if (before.gpuMs === null) result.unmeasured += 1;
    else if (before.gpuMs >= GPU_BACKPRESSURE_MS) result.gpu += 1;
    else result.schedulerOrPresentation += 1;
  }
  return result;
}

// --- PLAN-SFC-V1 Task 14: the static release cost of the new routes against the Task 3 baseline -----------------

/**
 * The budgets are relative to Task 3's same-version, same-base-path cold baseline (PLAN-SFC-V1, "Critical route
 * budgets"): added first-load JS (Brotli) 12 KiB Studio and Founder, 16 KiB Contact, 2 KiB legal (Terms against
 * Privacy); added startup evaluation and hydration CPU p95 of 25 ms; and no added task of 50 ms or more.
 */
export const STATIC_ROUTE_BUDGETS = Object.freeze({
  addedJsKiB: Object.freeze({ studio: 12, founder: 12, contact: 16, legal: 2 }),
  addedStartupCpuP95Ms: 25,
  longTaskMs: 50,
});

export type StaticRouteKind = keyof typeof STATIC_ROUTE_BUDGETS.addedJsKiB;

/** One route, locale, profile and base path as measured by the cold-startup collector. */
export type RouteCostFigures = {
  route: string;
  locale: string;
  profile: string;
  basePath: string;
  journeys: number;
  /** Brotli bytes of the scripts requested before the load event: the first-load definition the budgets gate. */
  criticalJsBrotliBytes: number;
  /** Brotli bytes of every script requested through the settle window; reported beside the critical figure, never gated. */
  firstLoadJsBrotliBytes: number;
  /** Brotli bytes of the scripts the route's own emitted HTML references: the deterministic second measure. */
  staticHtmlJsBrotliBytes?: number;
  startupCpuP95Ms: number;
  /** Largest minus smallest startup CPU of the baseline's own journeys: what an unchanged route already varies by. */
  startupCpuSpreadMs: number;
  longestTaskMs: number;
};

export type CostRow = { metric: 'critical-js' | 'static-html-js' | 'startup-cpu-p95' | 'long-task'; baseline: number; current: number; added: number; limit: number; verdict: Verdict; note: string };

const COST_NUMBER_FIELDS = ['criticalJsBrotliBytes', 'firstLoadJsBrotliBytes', 'startupCpuP95Ms', 'startupCpuSpreadMs', 'longestTaskMs'] as const;

function checkFigures(name: 'baseline' | 'current', figures: RouteCostFigures | undefined): RouteCostFigures {
  if (!figures || typeof figures !== 'object') throw new Error(`A static route cost needs its ${name}: an absent ${name} is never a pass`);
  for (const field of COST_NUMBER_FIELDS) {
    const value = figures[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`The ${name} needs a finite ${field} of zero or more, got ${String(value)}`);
  }
  if (figures.staticHtmlJsBrotliBytes !== undefined && (!Number.isFinite(figures.staticHtmlJsBrotliBytes) || figures.staticHtmlJsBrotliBytes < 0)) {
    throw new Error(`The ${name} staticHtmlJsBrotliBytes must be finite when present, got ${String(figures.staticHtmlJsBrotliBytes)}`);
  }
  if (!Number.isInteger(figures.journeys) || figures.journeys < COLD_BASELINE_JOURNEYS) {
    throw new Error(`The ${name} needs at least five cold journeys, got ${String(figures.journeys)}`);
  }
  return figures;
}

/**
 * Judges one route/locale/profile/base-path against its Task 3 baseline. First-load JS is gated on the critical figure
 * (requested before the load event, stable across profiles and base paths) and, when both sides carry it, on the
 * static-HTML figure. The CPU gate cannot be adjudicated by five cold journeys when an unchanged route already varied
 * by more than the 25 ms allowance (Task 3, Risk 1): beyond the allowance but inside that spread the row is OPEN, not a
 * pass and not a failure; only an increase beyond both fails. A 50 ms task counts as added only when the baseline had
 * none; against a baseline that already had one, a longer task is OPEN. A missing, mismatched or non-finite figure
 * throws.
 */
export function judgeStaticRouteCost(input: { kind: string; baseline: RouteCostFigures | undefined; current: RouteCostFigures | undefined }): { rows: CostRow[]; verdict: Verdict } {
  const { kind } = input;
  if (!Object.hasOwn(STATIC_ROUTE_BUDGETS.addedJsKiB, kind)) throw new Error(`Unknown static route kind "${String(kind)}" (expected ${Object.keys(STATIC_ROUTE_BUDGETS.addedJsKiB).join(', ')})`);
  const baseline = checkFigures('baseline', input.baseline);
  const current = checkFigures('current', input.current);
  if (baseline.locale !== current.locale) throw new Error(`The baseline must be the same locale: ${baseline.locale} against ${current.locale}`);
  if (baseline.profile !== current.profile) throw new Error(`The baseline must be the same profile: ${baseline.profile} against ${current.profile}`);
  if (baseline.basePath !== current.basePath) throw new Error(`The baseline must be the same base path: ${baseline.basePath} against ${current.basePath}`);

  const limitBytes = STATIC_ROUTE_BUDGETS.addedJsKiB[kind as StaticRouteKind] * 1024;
  const rows: CostRow[] = [];
  const jsRow = (metric: 'critical-js' | 'static-html-js', before: number, now: number): CostRow => {
    const added = now - before;
    return { metric, baseline: before, current: now, added, limit: limitBytes, verdict: added <= limitBytes ? 'PASS' : 'FAIL', note: `added ${(added / 1024).toFixed(1)} KiB of ${limitBytes / 1024} KiB` };
  };
  rows.push(jsRow('critical-js', baseline.criticalJsBrotliBytes, current.criticalJsBrotliBytes));
  if (baseline.staticHtmlJsBrotliBytes !== undefined && current.staticHtmlJsBrotliBytes !== undefined) {
    rows.push(jsRow('static-html-js', baseline.staticHtmlJsBrotliBytes, current.staticHtmlJsBrotliBytes));
  }

  const allowance = STATIC_ROUTE_BUDGETS.addedStartupCpuP95Ms;
  const addedCpu = current.startupCpuP95Ms - baseline.startupCpuP95Ms;
  let cpuVerdict: Verdict = 'PASS';
  let cpuNote = `added ${addedCpu.toFixed(1)} ms of ${allowance} ms`;
  if (addedCpu > allowance) {
    if (addedCpu <= allowance + baseline.startupCpuSpreadMs) {
      cpuVerdict = 'OPEN';
      cpuNote = `added ${addedCpu.toFixed(1)} ms is beyond ${allowance} ms but within the ${baseline.startupCpuSpreadMs.toFixed(1)} ms spread of the baseline's own journeys: cost cannot be told from noise`;
    } else {
      cpuVerdict = 'FAIL';
      cpuNote = `added ${addedCpu.toFixed(1)} ms is beyond ${allowance} ms and beyond the ${baseline.startupCpuSpreadMs.toFixed(1)} ms spread of the baseline's own journeys`;
    }
  }
  rows.push({ metric: 'startup-cpu-p95', baseline: baseline.startupCpuP95Ms, current: current.startupCpuP95Ms, added: addedCpu, limit: allowance, verdict: cpuVerdict, note: cpuNote });

  const task = STATIC_ROUTE_BUDGETS.longTaskMs;
  let taskVerdict: Verdict = 'PASS';
  let taskNote = `longest task ${current.longestTaskMs.toFixed(1)} ms, under ${task} ms`;
  if (current.longestTaskMs >= task) {
    if (baseline.longestTaskMs < task) {
      taskVerdict = 'FAIL';
      taskNote = `a task of ${current.longestTaskMs.toFixed(1)} ms is new: the baseline's longest was ${baseline.longestTaskMs.toFixed(1)} ms`;
    } else if (current.longestTaskMs <= baseline.longestTaskMs) {
      taskNote = `the longest task (${current.longestTaskMs.toFixed(1)} ms) is no longer than the baseline's own (${baseline.longestTaskMs.toFixed(1)} ms)`;
    } else {
      taskVerdict = 'OPEN';
      taskNote = `the longest task grew from ${baseline.longestTaskMs.toFixed(1)} to ${current.longestTaskMs.toFixed(1)} ms over a baseline that already had one: it cannot be attributed to this change`;
    }
  }
  rows.push({ metric: 'long-task', baseline: baseline.longestTaskMs, current: current.longestTaskMs, added: current.longestTaskMs - baseline.longestTaskMs, limit: task, verdict: taskVerdict, note: taskNote });

  const verdict: Verdict = rows.some((row) => row.verdict === 'FAIL') ? 'FAIL' : rows.some((row) => row.verdict === 'OPEN') ? 'OPEN' : 'PASS';
  return { rows, verdict };
}

type BaselineReport = { basePath?: string; profiles?: Record<string, { routes?: Record<string, Record<string, unknown>> } | undefined> };

/**
 * One entry of a committed Task 3 report (`--startup-baseline`) as baseline figures, with the spread of its own
 * journeys. A report that has no such entry is an error: a missing baseline is never read as zero.
 */
export function readBaselineEntry(input: { report: BaselineReport; route: string; locale: string; profile: string }): RouteCostFigures {
  const entry = input.report?.profiles?.[input.profile]?.routes?.[`${input.route}/${input.locale}`];
  if (!entry) throw new Error(`The report has no baseline entry for ${input.route}/${input.locale} on the ${input.profile} profile`);
  const detail = entry.journeysDetail;
  if (!Array.isArray(detail) || detail.length < COLD_BASELINE_JOURNEYS) throw new Error(`The baseline entry for ${input.route}/${input.locale} retains no journey detail to take a spread from`);
  const cpu = detail.map((journey: { startupCpuMs?: number }) => journey.startupCpuMs as number);
  if (cpu.some((value) => typeof value !== 'number' || !Number.isFinite(value))) throw new Error(`The baseline entry for ${input.route}/${input.locale} has a journey without a startup CPU`);
  return {
    route: entry.route as string,
    locale: entry.locale as string,
    profile: entry.profile as string,
    basePath: entry.basePath as string,
    journeys: entry.journeys as number,
    criticalJsBrotliBytes: entry.criticalJsBrotliBytes as number,
    firstLoadJsBrotliBytes: entry.firstLoadJsBrotliBytes as number,
    startupCpuP95Ms: entry.startupCpuP95Ms as number,
    startupCpuSpreadMs: Math.max(...cpu) - Math.min(...cpu),
    longestTaskMs: entry.longestTaskMs as number,
  };
}

/** Text that only the optional engine carries. Present in a critical chunk, the optional bytes are hidden in critical code. */
export const OPTIONAL_ENGINE_MARKERS = Object.freeze(['webglcontextlost', 'WebGLRenderer']);

/**
 * Text that only the connected host (the client component that gates and mounts the live scene) carries: its session
 * keys and its non-production diagnostics hook. A page whose live tier is policy-disabled must not load it either:
 * "No host hydration in policy-disabled builds; verify emitted requests rather than assume tree shaking" (PLAN-SFC-V1).
 */
export const CONNECTED_HOST_MARKERS = Object.freeze(['furlanich:connected-studio', '__FURLANICH_CONNECTED']);

/**
 * Optional engine or connected-host code inside the chunks a route loads before it can read, whatever its size: a byte budget alone
 * would pass a small slice moved out of the optional closure into the critical path.
 */
export function findOptionalCodeInCriticalChunks(input: { chunks: readonly { path: string; text: string }[]; markers?: readonly string[] }): { path: string; marker: string }[] {
  if (!input.chunks.length) throw new Error('There are no critical chunks to inspect: an empty set would pass anything');
  const markers = input.markers ?? [...OPTIONAL_ENGINE_MARKERS, ...CONNECTED_HOST_MARKERS];
  const found: { path: string; marker: string }[] = [];
  for (const chunk of input.chunks) {
    const marker = markers.find((candidate) => chunk.text.includes(candidate));
    if (marker) found.push({ path: chunk.path, marker });
  }
  return found;
}

/** Journeys per side of a paired comparison: two interleaved rounds (baseline, current, current, baseline) of five. */
export const PAIRED_JOURNEYS_PER_SIDE = 2 * COLD_BASELINE_JOURNEYS;

export type PairedStartupJudgement = {
  baselineMedianMs: number;
  currentMedianMs: number;
  baselineP95Ms: number;
  currentP95Ms: number;
  addedMedianMs: number;
  addedP95Ms: number;
  verdict: Verdict;
  note: string;
};

/**
 * Adjudicates the 25 ms added-startup-CPU allowance where the committed Task 3 baseline cannot (its own journeys varied by
 * more than the allowance): both heads are measured in one session, interleaved, ten journeys each. The cost is real only
 * when the median and the p95 both moved by more than the allowance; one alone is a spike or a bimodal baseline and stays
 * OPEN; both inside is a pass.
 */
export function judgePairedStartup(input: { baseline: readonly number[] | undefined; current: readonly number[] | undefined; allowanceMs?: number }): PairedStartupJudgement {
  const check = (name: string, values: readonly number[] | undefined): readonly number[] => {
    if (!values) throw new Error(`A paired startup comparison needs its ${name} journeys: an absent side is never a pass`);
    if (values.length < PAIRED_JOURNEYS_PER_SIDE) throw new Error(`A paired startup comparison needs ten journeys per side (two interleaved rounds of five), the ${name} has ${values.length}`);
    if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value < 0)) throw new Error(`The ${name} journeys must be finite startup CPU values of zero or more`);
    return values;
  };
  const baseline = check('baseline', input.baseline);
  const current = check('current', input.current);
  const allowance = input.allowanceMs ?? STATIC_ROUTE_BUDGETS.addedStartupCpuP95Ms;
  const baselineMedianMs = percentileOf(baseline, 50);
  const currentMedianMs = percentileOf(current, 50);
  const baselineP95Ms = percentileOf(baseline, 95);
  const currentP95Ms = percentileOf(current, 95);
  const addedMedianMs = currentMedianMs - baselineMedianMs;
  const addedP95Ms = currentP95Ms - baselineP95Ms;
  let verdict: Verdict = 'OPEN';
  let note = `median ${addedMedianMs >= 0 ? '+' : ''}${addedMedianMs.toFixed(1)} ms and p95 ${addedP95Ms >= 0 ? '+' : ''}${addedP95Ms.toFixed(1)} ms against the ${allowance} ms allowance: only one of the two exceeds it`;
  if (addedMedianMs <= allowance && addedP95Ms <= allowance) {
    verdict = 'PASS';
    note = `median ${addedMedianMs.toFixed(1)} ms and p95 ${addedP95Ms.toFixed(1)} ms, both inside ${allowance} ms`;
  } else if (addedMedianMs > allowance && addedP95Ms > allowance) {
    verdict = 'FAIL';
    note = `median +${addedMedianMs.toFixed(1)} ms and p95 +${addedP95Ms.toFixed(1)} ms both exceed ${allowance} ms`;
  }
  return { baselineMedianMs, currentMedianMs, baselineP95Ms, currentP95Ms, addedMedianMs, addedP95Ms, verdict, note };
}
