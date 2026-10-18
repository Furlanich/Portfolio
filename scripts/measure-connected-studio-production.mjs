// Production measurement of the optional connected-studio engine/runtime closure and the static
// posters (PLAN-SPF-V1 Task 9). Usage:
//   npm run measure:connected-studio [-- --skip-build] [--base-path=/Portfolio] [--out=report.json]
//
// This script never sets the connected test hook and never forces a software renderer ("Production
// measurements ... never set it", PLAN-SPF-V1, Interfaces). It reads the clean static export (`out/`) and the
// browser's behavior under that build's own policy. The cross-check of the emitted closure against a
// controlled live load is functional evidence and lives in tests/e2e/connected-studio-production.spec.ts.
//
// Per page (Services, Projects) and locale (ES, EN):
//   1. Builds the emitted chunk graph: every chunk's raw and Brotli (quality 11) size and the chunks each one
//      names in its Turbopack async-loader lists.
//   2. Identifies the route's optional entries (chunks named by a loader in a chunk the route's HTML
//      references, that the HTML does not itself reference) and counts their nested closure once, minus what
//      the matched static route already loads (`buildRouteClosure`). Gated at 120 KiB Brotli per cold route.
//   3. Loads the page under the shipped policy, and under each static-preference path (reduced motion,
//      Save-Data, forced colors, a stored context loss): none may request a closure chunk or draw a canvas.
//   4. Reports how the closure is shared across the four destinations. Cache reuse by a second route is derived
//      from that (the same files, served with `max-age`), not observed here: observing it needs the engine to
//      load, which the shipped policy never does. The functional spec observes it with the controlled hook.
//   5. Checks the four posters against their byte ceilings (150 KiB wide, 80 KiB compact).
//
// The export is served by scripts/serve-static-export.mjs (a missing route is a real 404, never an index).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import { buildRouteClosure, chunkImports, findOptionalCodeInCriticalChunks, OPTIONAL_CLOSURE_LIMIT_BYTES } from '../lib/connected-studio/measurement.ts';
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
const POSTER_ROUTES = ['services', 'projects', 'studio', 'founder', 'contact'];
// PLAN-SFC-V1 Task 14: the Atlas pages ship policy-disabled, so their static release must carry the poster, no host
// and no optional request: nothing of the optional closure may be referenced by their HTML or requested by the page,
// and no script they request may carry engine-only code.
const ATLAS_DESTINATIONS = [
  { route: 'studio', locale: 'es', pathname: '/estudio/' },
  { route: 'studio', locale: 'en', pathname: '/en/about/' },
  { route: 'founder', locale: 'es', pathname: '/estudio/samuel-furlanich/' },
  { route: 'founder', locale: 'en', pathname: '/en/about/samuel-furlanich/' },
  { route: 'contact', locale: 'es', pathname: '/contacto/' },
  { route: 'contact', locale: 'en', pathname: '/en/contact/' },
];
// PLAN-SFC-V1 Task 3: the reading, intake and legal routes the commercial redesign changes (Terms does not exist
// yet; Privacy is its baseline). They have no optional engine: only the chunks their own HTML references are measured.
const READING_DESTINATIONS = [
  { route: 'studio', locale: 'es', pathname: '/estudio/' },
  { route: 'studio', locale: 'en', pathname: '/en/about/' },
  { route: 'founder', locale: 'es', pathname: '/estudio/samuel-furlanich/' },
  { route: 'founder', locale: 'en', pathname: '/en/about/samuel-furlanich/' },
  { route: 'contact', locale: 'es', pathname: '/contacto/' },
  { route: 'contact', locale: 'en', pathname: '/en/contact/' },
  { route: 'privacy', locale: 'es', pathname: '/privacidad/' },
  { route: 'privacy', locale: 'en', pathname: '/en/privacy/' },
];

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
const chunks = fs.readdirSync(chunkDir).filter((name) => /\.(js|css)$/.test(name)).map((name) => {
  const buffer = fs.readFileSync(path.join(chunkDir, name));
  return { path: `chunks/${name}`, rawBytes: buffer.length, brotliBytes: brotli(buffer), imports: chunkImports(buffer.toString('utf8'), `chunks/${name}`) };
});

function routeChunks(pathname) {
  const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
  return [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
}

function analyse(destination) {
  const referenced = routeChunks(destination.pathname);
  const { entries, closure } = buildRouteClosure({ referenced, chunks });
  const containsThree = closure.chunks.some((item) => fs.readFileSync(path.join(outDir, '_next/static', item.path), 'utf8').includes('webglcontextlost'));
  const violations = [...closure.violations];
  if (!entries.length) violations.push('no optional entry chunk was found for this route: the closure measurement is empty');
  if (!containsThree) violations.push('the emitted closure does not contain three (no "webglcontextlost" marker)');
  return { ...destination, staticChunkCount: referenced.length, entries, closure, violations };
}

// --- Browser observations (the build's own policy: no test hook, no forced renderer) ---------------
const server = createExportServer({ root: outDir, basePath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = (pathname) => `${origin}${basePath}${pathname}`;
const browser = await chromium.launch();
const chunkOf = (requestUrl) => decodeURIComponent(new URL(requestUrl).pathname).match(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))$/)?.[1] ?? null;

/** One page load in a fresh context; returns every `_next` chunk it requested once the page settled. */
async function observe(destination, { preference = null, seedLoss = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: preference === 'reduced-motion' ? 'reduce' : 'no-preference',
    forcedColors: preference === 'forced-colors' ? 'active' : 'none',
  });
  try {
    const page = await context.newPage();
    const requested = [];
    page.on('request', (request) => {
      const chunk = chunkOf(request.url());
      if (chunk) requested.push(chunk);
    });
    if (preference === 'save-data') {
      await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
    }
    if (seedLoss) await page.addInitScript(() => sessionStorage.setItem('furlanich:connected-studio-context-lost', '1'));
    await page.goto(url(destination.pathname), { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    return { requested: [...new Set(requested)], canvases: await page.locator('canvas').count() };
  } finally {
    await context.close();
  }
}

const report = { kind: 'production export measurement (not field data)', basePath: basePath || '/', limitKiB: OPTIONAL_CLOSURE_LIMIT_BYTES / KIB, destinations: [], readingRoutes: [], atlasRoutes: [], sharing: null, posters: {}, notes: [] };
const failures = [];

try {
  for (const destination of DESTINATIONS) {
    const analysis = analyse(destination);
    const tag = `${destination.route}/${destination.locale}`;
    const closurePaths = new Set(analysis.closure.chunks.map((item) => item.path));
    const record = {
      ...analysis,
      closure: {
        ...analysis.closure,
        brotliKiB: +(analysis.closure.brotliBytes / KIB).toFixed(1),
        rawKiB: +(analysis.closure.rawBytes / KIB).toFixed(1),
        limitKiB: OPTIONAL_CLOSURE_LIMIT_BYTES / KIB,
        chunks: analysis.closure.chunks.map((item) => ({ path: item.path, rawKiB: +(item.rawBytes / KIB).toFixed(1), brotliKiB: +(item.brotliBytes / KIB).toFixed(1) })),
      },
      shipped: null,
      preferences: {},
    };
    for (const violation of analysis.violations) failures.push(`${tag}: ${violation}`);

    // The shipped policy and each static-preference path of the shipped build never fetch the closure.
    const shipped = await observe(destination);
    record.shipped = { closureRequests: shipped.requested.filter((item) => closurePaths.has(item)), canvases: shipped.canvases, requestedChunkCount: shipped.requested.length };
    if (record.shipped.closureRequests.length || shipped.canvases) failures.push(`${tag}: the shipped (static) policy fetched the optional closure or drew a canvas`);
    for (const [name, options] of Object.entries({
      'reduced-motion': { preference: 'reduced-motion' },
      'save-data': { preference: 'save-data' },
      'forced-colors': { preference: 'forced-colors' },
      'stored-context-loss': { seedLoss: true },
    })) {
      const result = await observe(destination, options);
      record.preferences[name] = { closureRequests: result.requested.filter((item) => closurePaths.has(item)), canvases: result.canvases };
      if (record.preferences[name].closureRequests.length || result.canvases) failures.push(`${tag}: the ${name} path fetched the optional closure or drew a canvas`);
    }
    report.destinations.push(record);
  }

  const closureSets = report.destinations.map((item) => item.closure.chunks.map((chunk) => chunk.path).sort().join('|'));
  report.sharing = {
    identicalAcrossDestinations: new Set(closureSets).size === 1,
    sharedChunks: report.destinations[0].closure.chunks.map((chunk) => chunk.path),
    note: 'derived from the emitted graph, not observed: a second connected route reuses these same files from the shared HTTP cache (the export is served with max-age). The cold figure is never reduced by it. The functional spec observes the reuse with the controlled test hook.',
  };
  if (!report.sharing.identicalAcrossDestinations) report.notes.push('The closure differs between destinations; a second route does not reuse all of it.');

  for (const route of POSTER_ROUTES) {
    for (const quality of ['wide', 'compact']) {
      const file = path.join(outDir, 'brand/connected-studio', `${route}-${quality}.webp`);
      if (!fs.existsSync(file)) {
        failures.push(`poster ${route}-${quality} is not in the export`);
        continue;
      }
      const bytes = fs.statSync(file).size;
      report.posters[`${route}-${quality}`] = { bytes, kiB: +(bytes / KIB).toFixed(1), ceilingKiB: POSTER_CEILINGS[quality] / KIB };
      if (bytes > POSTER_CEILINGS[quality]) failures.push(`poster ${route}-${quality} is ${bytes} bytes, above ${POSTER_CEILINGS[quality]}`);
    }
  }
  // The Atlas pages: poster present, the host and the optional closure absent, whatever the preference path.
  const closureUnion = new Set(report.destinations.flatMap((item) => item.closure.chunks.map((chunk) => chunk.path)));
  for (const destination of ATLAS_DESTINATIONS) {
    const tag = `${destination.route}/${destination.locale}`;
    const referenced = routeChunks(destination.pathname);
    const inClosure = referenced.filter((item) => closureUnion.has(item));
    const html = fs.readFileSync(path.join(outDir, ...destination.pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
    const posterRefs = [...html.matchAll(/brand\/connected-studio\/([a-z]+)-(wide|compact)\.webp/g)].map((match) => `${match[1]}-${match[2]}`);
    const scripts = referenced.filter((item) => item.endsWith('.js')).map((item) => ({ path: item, text: fs.readFileSync(path.join(outDir, '_next/static', item), 'utf8') }));
    const hidden = findOptionalCodeInCriticalChunks({ chunks: scripts });
    const shipped = await observe(destination);
    const requestedClosure = shipped.requested.filter((item) => closureUnion.has(item));
    const record = {
      ...destination,
      referencedChunks: referenced.length,
      closureChunksInHtml: inClosure,
      optionalCodeInReferencedScripts: hidden,
      posterReferences: [...new Set(posterRefs)].sort(),
      shipped: { closureRequests: requestedClosure, canvases: shipped.canvases, requestedChunkCount: shipped.requested.length },
      preferences: {},
    };
    if (inClosure.length) failures.push(`${tag}: its HTML references optional closure chunks: ${inClosure.join(', ')}`);
    if (hidden.length) failures.push(`${tag}: optional engine or connected host code in referenced scripts: ${hidden.map((item) => `${item.path} (${item.marker})`).join(', ')}`);
    const expectedPosters = [`${destination.route}-compact`, `${destination.route}-wide`].sort();
    if (JSON.stringify(record.posterReferences) !== JSON.stringify(expectedPosters)) failures.push(`${tag}: the HTML names posters ${JSON.stringify(record.posterReferences)}, expected only ${JSON.stringify(expectedPosters)}`);
    if (requestedClosure.length || shipped.canvases) failures.push(`${tag}: the shipped (static) policy fetched the optional closure or drew a canvas`);
    for (const [name, options] of Object.entries({ 'reduced-motion': { preference: 'reduced-motion' }, 'save-data': { preference: 'save-data' }, 'forced-colors': { preference: 'forced-colors' }, 'stored-context-loss': { seedLoss: true } })) {
      const result = await observe(destination, options);
      record.preferences[name] = { closureRequests: result.requested.filter((item) => closureUnion.has(item)), canvases: result.canvases };
      if (record.preferences[name].closureRequests.length || result.canvases) failures.push(`${tag}: the ${name} path fetched the optional closure or drew a canvas`);
    }
    report.atlasRoutes.push(record);
  }
  // First-load JS of the reading routes: the JS chunks the route's own HTML references, from the emitted export.
  // This is the static-analysis side of the Task 3 baseline; the browser-observed side is `--startup-baseline` in the vitals script.
  const chunkByPath = new Map(chunks.map((item) => [item.path, item]));
  for (const destination of READING_DESTINATIONS) {
    const referenced = routeChunks(destination.pathname);
    const missing = referenced.filter((item) => !chunkByPath.has(item));
    if (missing.length) failures.push(`${destination.route}/${destination.locale}: referenced chunks are not in the emitted export: ${missing.join(', ')}`);
    const scripts = referenced.filter((item) => item.endsWith('.js')).map((item) => chunkByPath.get(item)).filter(Boolean);
    const styles = referenced.filter((item) => item.endsWith('.css')).map((item) => chunkByPath.get(item)).filter(Boolean);
    const total = (list, key) => list.reduce((sum, item) => sum + item[key], 0);
    report.readingRoutes.push({
      ...destination,
      jsChunks: scripts.length,
      jsBrotliKiB: +(total(scripts, 'brotliBytes') / KIB).toFixed(1),
      jsRawKiB: +(total(scripts, 'rawBytes') / KIB).toFixed(1),
      cssBrotliKiB: +(total(styles, 'brotliBytes') / KIB).toFixed(1),
      chunks: scripts.map((item) => item.path).sort(),
    });
  }
  const headroom = report.destinations.map((item) => ({ destination: `${item.route}/${item.locale}`, brotliKiB: item.closure.brotliKiB, headroomKiB: +(report.limitKiB - item.closure.brotliKiB).toFixed(1), headroomWarning: item.closure.brotliBytes > 118 * KIB }));
  report.closureHeadroom = headroom;
  report.notes.push('Closure bytes come from the emitted export (raw, Brotli quality 11), not from a network trace. Live-tier behavior and its hardware figures are OPEN until the owner-executed device protocol; nothing here is a live measurement.');
} catch (error) {
  failures.push(error.message);
} finally {
  await browser.close();
  server.close();
}

const summary = report.destinations.map((item) => ({ destination: `${item.route}/${item.locale}`, brotliKiB: item.closure.brotliKiB, rawKiB: item.closure.rawKiB, chunks: item.closure.chunks.length, limitKiB: item.closure.limitKiB }));
console.log(JSON.stringify({ basePath: report.basePath, summary, closureHeadroom: report.closureHeadroom, readingRoutes: report.readingRoutes.map((item) => ({ route: item.route, locale: item.locale, jsChunks: item.jsChunks, jsBrotliKiB: item.jsBrotliKiB, jsRawKiB: item.jsRawKiB, cssBrotliKiB: item.cssBrotliKiB })), atlasRoutes: report.atlasRoutes.map((item) => ({ route: item.route, locale: item.locale, referencedChunks: item.referencedChunks, posterReferences: item.posterReferences, closureChunksInHtml: item.closureChunksInHtml.length, optionalCode: item.optionalCodeInReferencedScripts.length, shippedClosureRequests: item.shipped.closureRequests.length, canvases: item.shipped.canvases })), sharing: report.sharing, posters: report.posters }, null, 2));
const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error('\nConnected-studio production gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nConnected-studio production gates passed.');
