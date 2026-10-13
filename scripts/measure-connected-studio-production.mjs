// Production measurement of the optional connected-studio engine/runtime closure and the static
// posters (PLAN-SPF-V1 Task 9). Usage:
//   npm run measure:connected-studio [-- --skip-build] [--base-path=/Portfolio] [--out=report.json]
//
// What it does, per page (Services, Projects) and locale (ES, EN):
//   1. Reads the clean static export (`out/`) and builds the emitted chunk graph: every chunk's raw and
//      Brotli (quality 11) size, and the chunks each one names in its Turbopack async-loader lists.
//   2. Identifies the route's optional entries: chunks named by a loader inside a chunk the route's HTML
//      references, that the HTML does not itself reference. Their nested closure, minus what the matched
//      static route already loads, is counted once by `measureOptionalClosure` and gated at 120 KiB Brotli.
//   3. Cross-checks the emitted graph against the browser. With the shipped live policy (both tiers off) and
//      with each static-preference path (reduced motion, Save-Data, forced colors, a stored context loss) the
//      page must never request a closure chunk. A controlled live run (the test-only hook and SwiftShader,
//      labelled as controlled test evidence, never the shipped policy) must request exactly the closure.
//   4. Reports cold bytes in full and, separately, how much of the closure a second connected route reuses
//      from the shared HTTP cache. Cache reuse is never subtracted from the cold figure.
//   5. Checks the four posters against their byte ceilings (150 KiB wide, 80 KiB compact).
//
// The export is served by scripts/serve-static-export.mjs (a missing route is a real 404, never an index).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import { crossCheckClosure, measureOptionalClosure, OPTIONAL_CLOSURE_LIMIT_BYTES } from '../lib/connected-studio/measurement.ts';
import { createExportServer, normalizeBasePath } from './serve-static-export.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const KIB = 1024;
const basePath = normalizeBasePath(argument('base-path') ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '');
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  // Git Bash rewrites an argument like /Portfolio into a Windows path; run base-path measurements from PowerShell.
  throw new Error(`The base path "${basePath}" is not a plain /segment. Run from PowerShell, or set MSYS2_ARG_CONV_EXCL=* in Git Bash.`);
}

const DESTINATIONS = [
  { route: 'services', locale: 'es', pathname: '/servicios/' },
  { route: 'services', locale: 'en', pathname: '/en/services/' },
  { route: 'projects', locale: 'es', pathname: '/proyectos/' },
  { route: 'projects', locale: 'en', pathname: '/en/work/' },
];
const POSTER_CEILINGS = { wide: 150 * KIB, compact: 80 * KIB };

if (!process.argv.includes('--skip-build')) {
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath } });
}
// The build must have used the chosen base path: a root-only export is not a base-path proof.
const homeHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const exportedWithBase = homeHtml.includes(`${basePath}/_next/`);
if (!exportedWithBase || (!basePath && /="\/[A-Za-z0-9._-]+\/_next\//.test(homeHtml))) {
  throw new Error(`out/ was not exported with base path "${basePath || '/'}". Rebuild with the same NEXT_PUBLIC_BASE_PATH.`);
}

// --- Emitted chunk graph -------------------------------------------------------------------------
const chunkDir = path.join(outDir, '_next/static/chunks');
const brotli = (buffer) => zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const LITERAL = /static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g;
const chunks = fs.readdirSync(chunkDir).filter((name) => /\.(js|css)$/.test(name)).map((name) => {
  const buffer = fs.readFileSync(path.join(chunkDir, name));
  const imports = [...new Set([...buffer.toString('utf8').matchAll(LITERAL)].map((match) => match[1]))].filter((item) => item !== `chunks/${name}`);
  return { path: `chunks/${name}`, rawBytes: buffer.length, brotliBytes: brotli(buffer), imports };
});
const chunkByPath = new Map(chunks.map((item) => [item.path, item]));

function routeChunks(pathname) {
  const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
  return [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
}

function analyse(destination) {
  const referenced = routeChunks(destination.pathname);
  const referencedSet = new Set(referenced);
  const entries = [...new Set(referenced.flatMap((item) => chunkByPath.get(item)?.imports ?? []))].filter((item) => !referencedSet.has(item));
  const closure = measureOptionalClosure({ entries, chunks, alreadyLoaded: referenced });
  const containsThree = closure.chunks.some((item) => fs.readFileSync(path.join(outDir, '_next/static', item.path), 'utf8').includes('webglcontextlost'));
  const violations = [...closure.violations];
  if (!entries.length) violations.push('no optional entry chunk was found for this route: the closure measurement is empty');
  if (!containsThree) violations.push('the emitted closure does not contain three (no "webglcontextlost" marker)');
  return {
    ...destination,
    staticChunkCount: referenced.length,
    entries,
    closure: { ...closure, brotliKiB: +(closure.brotliBytes / KIB).toFixed(1), rawKiB: +(closure.rawBytes / KIB).toFixed(1), limitKiB: OPTIONAL_CLOSURE_LIMIT_BYTES / KIB },
    referenced,
    violations,
  };
}

// --- Browser observations ------------------------------------------------------------------------
const server = createExportServer({ root: outDir, basePath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = (pathname) => `${origin}${basePath}${pathname}`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const chunkOf = (requestUrl) => decodeURIComponent(new URL(requestUrl).pathname).match(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))$/)?.[1] ?? null;
const LIVE_HOOK = { allowSoftwareRenderer: true, livePolicy: { wide: true, compact: true } };

/** One page load in a fresh context; returns every `_next` chunk it requested once the page settled. */
async function observe(destination, { viewport = { width: 1440, height: 900 }, hook = null, preference = null, seedLoss = false, live = false, settleMs = 3000 } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: preference === 'reduced-motion' ? 'reduce' : 'no-preference', forcedColors: preference === 'forced-colors' ? 'active' : 'none' });
  const page = await context.newPage();
  const requested = [];
  page.on('request', (request) => {
    const chunk = chunkOf(request.url());
    if (chunk) requested.push(chunk);
  });
  if (hook) await page.addInitScript((value) => { window.__FURLANICH_CONNECTED_TEST__ = value; }, hook);
  if (preference === 'save-data') {
    await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
  }
  if (seedLoss) await page.addInitScript(() => sessionStorage.setItem('furlanich:connected-studio-context-lost', '1'));
  await page.goto(url(destination.pathname), { waitUntil: 'load' });
  if (live) {
    await page.waitForSelector('main [data-connected-ground] canvas[data-connected-canvas]', { timeout: 45_000 });
  }
  await page.waitForTimeout(settleMs);
  const canvases = await page.locator('canvas').count();
  return { context, page, requested: [...new Set(requested)], canvases };
}

const report = { kind: 'production export measurement (not field data)', basePath: basePath || '/', limitKiB: OPTIONAL_CLOSURE_LIMIT_BYTES / KIB, destinations: [], posters: {}, notes: [] };
const failures = [];

try {
  for (const destination of DESTINATIONS) {
    const analysis = analyse(destination);
    const tag = `${destination.route}/${destination.locale}`;
    const closurePaths = new Set(analysis.closure.chunks.map((item) => item.path));
    const record = {
      ...analysis,
      closure: { ...analysis.closure, chunks: analysis.closure.chunks.map((item) => ({ path: item.path, rawKiB: +(item.rawBytes / KIB).toFixed(1), brotliKiB: +(item.brotliBytes / KIB).toFixed(1) })) },
      shipped: null,
      preferences: {},
      live: null,
      warm: null,
    };
    for (const violation of analysis.violations) failures.push(`${tag}: ${violation}`);

    // Shipped policy and the static-preference paths never fetch the closure.
    const shipped = await observe(destination);
    record.shipped = { closureRequests: shipped.requested.filter((item) => closurePaths.has(item)), canvases: shipped.canvases, requestedChunkCount: shipped.requested.length };
    await shipped.context.close();
    if (record.shipped.closureRequests.length || shipped.canvases) failures.push(`${tag}: the shipped (static) policy fetched the optional closure or drew a canvas`);
    for (const [name, options] of Object.entries({
      'reduced-motion': { hook: LIVE_HOOK, preference: 'reduced-motion' },
      'save-data': { hook: LIVE_HOOK, preference: 'save-data' },
      'forced-colors': { hook: LIVE_HOOK, preference: 'forced-colors' },
      'stored-context-loss': { hook: LIVE_HOOK, seedLoss: true },
    })) {
      const result = await observe(destination, options);
      record.preferences[name] = { closureRequests: result.requested.filter((item) => closurePaths.has(item)), canvases: result.canvases };
      await result.context.close();
      if (record.preferences[name].closureRequests.length || result.canvases) failures.push(`${tag}: the ${name} path fetched the optional closure or drew a canvas`);
    }

    // Controlled live run (test hook + SwiftShader): the browser's extra requests must be exactly the closure.
    for (const [quality, viewport] of [['wide', { width: 1440, height: 900 }], ['compact', { width: 390, height: 844 }]]) {
      const baseline = await observe(destination, { viewport });
      const liveRun = await observe(destination, { viewport, hook: LIVE_HOOK, live: true });
      const baselineSet = new Set(baseline.requested);
      const extra = liveRun.requested.filter((item) => !baselineSet.has(item));
      await baseline.context.close();
      const check = crossCheckClosure({ requested: extra, closure: analysis.closure });
      record.live ??= {};
      record.live[quality] = { label: 'controlled test evidence (test hook, SwiftShader), not the shipped policy', extraRequests: extra, ...check };
      if (check.missingFromRequests.length || check.unexpectedRequests.length) failures.push(`${tag}/${quality}: browser requests and the emitted closure disagree (${JSON.stringify(check)})`);
      if (quality === 'wide') {
        // Warm: another connected route in the same context. Cache reuse is reported, never subtracted from cold bytes.
        const other = DESTINATIONS.find((item) => item.route !== destination.route && item.locale === destination.locale);
        await liveRun.page.goto(url(other.pathname), { waitUntil: 'load' });
        await liveRun.page.waitForTimeout(1500);
        const entries = await liveRun.page.evaluate(() => performance.getEntriesByType('resource').map((entry) => ({ name: entry.name, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })));
        const closureEntries = entries.filter((entry) => closurePaths.has(chunkOf(entry.name)));
        record.warm = {
          secondRoute: other.pathname,
          closureChunksRequestedByTheSecondRoute: closureEntries.length,
          servedFromCache: closureEntries.filter((entry) => entry.transferSize === 0 && entry.encodedBodySize > 0).length,
          note: 'shared-cache reuse, reported separately; the cold figure above is not reduced by it',
        };
      }
      await liveRun.context.close();
    }
    report.destinations.push(record);
  }

  for (const route of ['services', 'projects']) {
    for (const quality of ['wide', 'compact']) {
      const file = path.join(outDir, 'brand/connected-studio', `${route}-${quality}.webp`);
      const bytes = fs.statSync(file).size;
      report.posters[`${route}-${quality}`] = { bytes, kiB: +(bytes / KIB).toFixed(1), ceilingKiB: POSTER_CEILINGS[quality] / KIB };
      if (bytes > POSTER_CEILINGS[quality]) failures.push(`poster ${route}-${quality} is ${bytes} bytes, above ${POSTER_CEILINGS[quality]}`);
    }
  }
  report.notes.push('Closure bytes come from the emitted export (raw, Brotli quality 11), not from a network trace; the browser runs cross-check them.', 'The live runs set the controlled test hook and use SwiftShader: they are functional evidence of which files load, never a hardware or shipped-policy measurement.');
} finally {
  await browser.close();
  server.close();
}

const summary = report.destinations.map((item) => ({ destination: `${item.route}/${item.locale}`, brotliKiB: item.closure.brotliKiB, rawKiB: item.closure.rawKiB, chunks: item.closure.chunks.length, limitKiB: item.closure.limitKiB, warmFromCache: item.warm?.servedFromCache }));
console.log(JSON.stringify({ basePath: report.basePath, summary, posters: report.posters }, null, 2));
const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error('\nConnected-studio production gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nConnected-studio production gates passed.');
