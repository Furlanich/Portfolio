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
