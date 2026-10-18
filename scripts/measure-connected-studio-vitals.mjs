// Synthetic (lab) LCP and INP for the connected Services and Projects pages in both locales
// (PLAN-SPF-V1 Task 9). These are throttled Chromium journeys over the clean static export, not field
// data. Usage:
//   npm run measure:connected-studio-vitals [-- --skip-build] [--journeys=10] [--profile=mobile|desktop]
//     [--expect-mode=static|live] [--hardware] [--base-path=/Portfolio] [--out=report.json]
//
// The profile constants and the gzip lab server are copied verbatim from scripts/measure-home-web-vitals.mjs
// (the established method; that script is not importable because it runs on import, and it is not edited
// here). GitHub Pages serves text assets gzip-compressed, so the lab server does too, and it charges the
// navigation document the profile's request latency and transfer time, which CDP throttling does not.
//
// This script never sets the connected test hook and never forces a software renderer: it observes the
// export it is given under that build's own policy ("Production measurements ... never set it", PLAN-SPF-V1,
// Interfaces). The shipped build keeps both live tiers off, so the expected mode is `static` (the default)
// and every journey must stay static. To measure a live tier, build the isolated candidate (the plan's
// "Isolated candidate evaluation"), run this on hardware with `--expect-mode=live`, and the page must go live
// without any override; Pause and Resume then become required interactions. Live results that cannot be
// measured stay OPEN: there is no software-rendered substitute here. `--hardware` launches new-headless Chromium so it can use
// the machine's GPU instead of the bundled software-rendered headless shell, and the run fails if the renderer is a
// software one: a live number is only reported from real hardware WebGL2.
//
// Each journey is a cold navigation (a fresh context) followed by required interactions: an in-page
// fragment link, keyboard focus movement, scrolling and a link to the other connected route (plus Pause and
// Resume when live). A missing control, a navigation that does not land, or a mode other than the expected
// one fails the run: it never contributes a sample. Layout shift from the enhancement is attributed by
// `attributeShifts` and gated unrounded at zero.
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import {
  attributeShifts,
  COLD_BASELINE_JOURNEYS,
  findOptionalCodeInCriticalChunks,
  judgeStaticRouteCost,
  mainThreadStartupCost,
  missingInteractions,
  percentileOf,
  readBaselineEntry,
  summarizeColdBaseline,
  validateVitalsOptions,
} from '../lib/connected-studio/measurement.ts';
import { normalizeBasePath } from './serve-static-export.mjs';

const root = process.cwd();
const outDir = path.join(root, 'out');
const argument = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);

// Lighthouse "devtools" (applied) throttling presets, copied verbatim from scripts/measure-home-web-vitals.mjs.
// Their request latency already includes the 3.75x RTT multiplier that stands in for connection setup, so every
// request, including the document, pays it once.
const PROFILES = {
  mobile: {
    label: 'Mobile: 390x844, DPR 3, touch, 4x CPU slowdown, Slow 4G applied (562.5 ms request latency, 1.47 Mbps down)',
    context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    cpu: 4,
    network: { latency: 562.5, downloadThroughput: (1474.56 * 1024) / 8, uploadThroughput: (675 * 1024) / 8 },
  },
  desktop: {
    label: 'Desktop: 1440x900, DPR 1, 1x CPU, desktop applied (150 ms request latency, 9.2 Mbps down)',
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    cpu: 1,
    network: { latency: 150, downloadThroughput: (9216 * 1024) / 8, uploadThroughput: (9216 * 1024) / 8 },
  },
};

// `--startup-baseline` (PLAN-SFC-V1 Task 3) does not measure vitals: it records the cold first-load JS and the
// main-thread startup cost of the reading, intake and legal routes, with one raw Chromium trace per journey.
const STARTUP = process.argv.includes('--startup-baseline');

// The pages the vitals journeys can measure (PLAN-SFC-V1 Task 14 adds the three Atlas pages).
const KNOWN_ROUTES = ['services', 'projects', 'studio', 'founder', 'contact'];

// Validate before building, serving or launching anything: a typo must not become a passing gate.
let options;
try {
  if (STARTUP && argument('routes') !== undefined) throw new Error('--routes does not apply to --startup-baseline, which measures the reading, intake and legal routes');
  options = validateVitalsOptions({
    journeys: argument('journeys') ?? (STARTUP ? String(COLD_BASELINE_JOURNEYS) : '10'),
    profile: argument('profile'),
    profiles: Object.keys(PROFILES),
    expectMode: argument('expect-mode'),
    routes: argument('routes'),
    knownRoutes: KNOWN_ROUTES,
  });
} catch (error) {
  console.error(`measure-connected-studio-vitals: ${error.message}`);
  process.exit(1);
}
const { journeys: JOURNEYS_PER_LOCALE, profiles: SELECTED_PROFILES, expectMode: EXPECT_MODE, routes: SELECTED_ROUTES } = options;
if (STARTUP && JOURNEYS_PER_LOCALE < COLD_BASELINE_JOURNEYS) {
  console.error(`measure-connected-studio-vitals: --startup-baseline needs --journeys of at least ${COLD_BASELINE_JOURNEYS}, got ${JOURNEYS_PER_LOCALE}`);
  process.exit(1);
}
const HARDWARE = process.argv.includes('--hardware');
const basePath = normalizeBasePath(argument('base-path') ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '');
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error(`The base path "${basePath}" is not a plain /segment. Run from PowerShell, or set MSYS2_ARG_CONV_EXCL=* in Git Bash.`);
}
const GATES = { lcpP75Ms: 2500, inpP75Ms: 200, clsFromEnhancement: 0 };

const DESTINATIONS = {
  services: {
    es: { pathname: '/servicios/', other: '/proyectos/', pause: 'Pausar fondo', resume: 'Reanudar fondo' },
    en: { pathname: '/en/services/', other: '/en/work/', pause: 'Pause background', resume: 'Resume background' },
  },
  projects: {
    es: { pathname: '/proyectos/', other: '/servicios/', pause: 'Pausar fondo', resume: 'Reanudar fondo' },
    en: { pathname: '/en/work/', other: '/en/services/', pause: 'Pause background', resume: 'Resume background' },
  },
  // PLAN-SFC-V1 Task 14: the Atlas pages have no in-page fragment links in their main content (checked in the emitted
  // HTML), so they say so explicitly instead of silently skipping the step; every other journey step is the same.
  studio: {
    es: { pathname: '/estudio/', other: '/servicios/', pause: 'Pausar fondo', resume: 'Reanudar fondo', fragmentLink: false },
    en: { pathname: '/en/about/', other: '/en/services/', pause: 'Pause background', resume: 'Resume background', fragmentLink: false },
  },
  founder: {
    es: { pathname: '/estudio/samuel-furlanich/', other: '/proyectos/', pause: 'Pausar fondo', resume: 'Reanudar fondo', fragmentLink: false },
    en: { pathname: '/en/about/samuel-furlanich/', other: '/en/work/', pause: 'Pause background', resume: 'Resume background', fragmentLink: false },
  },
  contact: {
    es: { pathname: '/contacto/', other: '/servicios/', pause: 'Pausar fondo', resume: 'Reanudar fondo', fragmentLink: false },
    en: { pathname: '/en/contact/', other: '/en/services/', pause: 'Pause background', resume: 'Resume background', fragmentLink: false },
  },
};
if (JSON.stringify(Object.keys(DESTINATIONS)) !== JSON.stringify(KNOWN_ROUTES)) throw new Error('DESTINATIONS and KNOWN_ROUTES must list the same routes in the same order');

if (!process.argv.includes('--skip-build')) {
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath } });
}
if (!fs.readFileSync(path.join(outDir, 'index.html'), 'utf8').includes(`${basePath}/_next/`)) {
  throw new Error(`out/ was not exported with base path "${basePath || '/'}". Rebuild with the same NEXT_PUBLIC_BASE_PATH.`);
}

// GitHub Pages serves text assets gzip-compressed, so the lab server does too (verbatim from the Home script,
// plus the base-path prefix).
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const compressible = new Set(['.html', '.js', '.css', '.svg', '.txt']);
const resolveFile = (pathname) => {
  if (basePath) {
    if (!pathname.startsWith(`${basePath}/`)) return null;
    pathname = pathname.slice(basePath.length);
  }
  let file = path.join(outDir, pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  // Windows exports nest segment prefetch files; Linux builds (GitHub Pages) use dotted names.
  const segment = !fs.existsSync(file) && path.basename(file).match(/^__next\.(.+)\.txt$/);
  if (segment) {
    const [group, ...rest] = segment[1].split('.');
    const nested = path.join(path.dirname(file), `__next.${group}`, ...rest) + '.txt';
    if (fs.existsSync(nested)) file = nested;
  }
  return fs.existsSync(file) ? file : null;
};
// Chrome's CDP throttling does not delay the navigation document, so the server charges the
// profile's request latency and transfer time for it (x-lab-* headers).
const server = http.createServer(async (request, response) => {
  const file = resolveFile(decodeURIComponent(new URL(request.url, 'http://x').pathname));
  if (!file) { response.writeHead(404); response.end(); return; }
  const extension = path.extname(file);
  const headers = { 'content-type': types[extension] ?? 'application/octet-stream', 'cache-control': 'no-store' };
  if (compressible.has(extension) && /gzip/.test(request.headers['accept-encoding'] ?? '')) {
    const body = zlib.gzipSync(fs.readFileSync(file));
    const rtt = Number(request.headers['x-lab-rtt'] ?? 0);
    if (extension === '.html' && rtt) {
      const bytesPerMs = Number(request.headers['x-lab-down'] ?? Infinity) / 1000;
      await new Promise((resolve) => setTimeout(resolve, rtt + body.length / bytesPerMs));
    }
    response.writeHead(200, { ...headers, 'content-encoding': 'gzip' });
    response.end(body);
    return;
  }
  response.writeHead(200, headers);
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const percentile = (values, p) => {
  if (!values.length) throw new Error('A percentile was requested over zero samples.');
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
};
const max = (values) => Math.max(0, ...values);

/** Installed before any page script. Self-contained: it is serialized into the page. */
function installObservers() {
  const state = { lcp: [], events: [], shifts: [], fontLoads: [], activationAt: null };
  window.__connectedVitals = state;
  new PerformanceObserver((list) => list.getEntries().forEach((entry) => state.lcp.push({ time: entry.startTime, element: entry.element?.tagName ?? null, size: entry.size }))).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (entry.interactionId) state.events.push({ id: entry.interactionId, name: entry.name, duration: entry.duration }); })).observe({ type: 'event', durationThreshold: 16, buffered: true });
  document.fonts?.addEventListener('loading', () => state.fontLoads.push([performance.now(), null]));
  document.fonts?.addEventListener('loadingdone', () => {
    const open = state.fontLoads.findLast((load) => load[1] === null);
    if (open) open[1] = performance.now();
  });
  const describe = (node) => {
    const element = node instanceof Element ? node : (node?.parentElement ?? null);
    if (!element) return { text: 'detached', enhancement: false };
    const enhancement = element.tagName === 'CANVAS' || Boolean(element.closest('[data-connected-ground]'));
    const where = element.closest('[data-app-bar]') ? 'app-bar' : element.closest('[data-connected-ground]') ? 'ground' : element.closest('main') ? 'main' : element.closest('[data-site-footer]') ? 'footer' : 'page';
    return { text: `${element.tagName.toLowerCase()} in ${where}`, enhancement };
  };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const sources = (entry.sources ?? []).map((source) => describe(source.node));
      state.shifts.push({ value: entry.value, time: entry.startTime, enhancement: sources.some((source) => source.enhancement), sources: sources.map((source) => source.text) });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new MutationObserver((records) => {
    if (state.activationAt !== null) return;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element && (node.matches('canvas, [data-connected-pause], [data-connected-labels]') || node.querySelector('canvas, [data-connected-pause]'))) {
          state.activationAt = performance.now();
          return;
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
}

async function journey(browser, profile, route, locale) {
  const copy = DESTINATIONS[route][locale];
  const context = await browser.newContext({
    ...profile.context,
    extraHTTPHeaders: { 'x-lab-rtt': String(profile.network.latency), 'x-lab-down': String(profile.network.downloadThroughput) },
  });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, ...profile.network });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
    await page.addInitScript(installObservers);

    await page.goto(`${origin}${basePath}${copy.pathname}`, { waitUntil: 'load', timeout: 90_000 });
    let mode;
    if (EXPECT_MODE === 'live') {
      // No override: a hardware candidate goes live by itself or the journey fails.
      mode = await page.waitForSelector('main [data-connected-ground] canvas[data-connected-canvas]', { timeout: 60_000 }).then(() => 'live', () => 'not-live');
    } else {
      await page.waitForTimeout(1_500);
      mode = (await page.locator('canvas').count()) === 0 ? 'static' : 'unexpected-canvas';
    }
    if (mode !== EXPECT_MODE) throw new Error(`${route}/${locale}: the page ended in mode "${mode}", expected "${EXPECT_MODE}"`);
    await page.waitForTimeout(1_000);
    const lcpEntries = await page.evaluate(() => window.__connectedVitals.lcp);
    const navigation = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation');
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return { ttfb: entry.responseStart, fcp: fcp?.startTime ?? null };
    });

    const tap = (locator) => (profile.context.hasTouch ? locator.tap() : locator.click());
    const completed = [];
    if (mode === 'live') {
      const slot = page.locator(`#connected-pause-${route}`);
      await tap(slot.getByRole('button', { name: copy.pause, exact: true }));
      completed.push('pause');
      await tap(slot.getByRole('button', { name: copy.resume, exact: true }));
      completed.push('resume');
    }
    const fragment = page.locator('main a[href^="#"]:visible').first();
    if (copy.fragmentLink === false) {
      // Declared fragment-free: a fragment link appearing here means the declaration is stale, which must be noticed.
      if ((await fragment.count()) > 0) throw new Error(`${route}/${locale}: the page now has an in-page fragment link; update its journey declaration`);
    } else {
      if ((await fragment.count()) === 0) throw new Error(`${route}/${locale}: no visible in-page fragment link to follow`);
      await tap(fragment);
      completed.push('fragment-link');
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    completed.push('keyboard-focus');
    for (let step = 0; step < 12; step += 1) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(50);
    }
    completed.push('scroll');
    await page.waitForTimeout(500);
    // At compact widths the App Bar links live in a closed disclosure: open it with the real control first.
    const disclosure = page.locator('summary[aria-controls="primary-navigation-panel"]');
    if (await disclosure.isVisible()) await tap(disclosure);
    const bar = page.locator(`[data-app-bar] a[href^="${basePath}${copy.other}"]:visible`).first();
    if ((await bar.count()) === 0) throw new Error(`${route}/${locale}: no visible App Bar link to ${copy.other}`);
    await tap(bar);
    // A timeout here fails the journey; the destination must actually render.
    await page.waitForURL((url) => url.pathname === `${basePath}${copy.other}`, { timeout: 30_000 });
    await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 30_000 });
    completed.push('route-link');
    const missing = missingInteractions({ mode, completed, fragmentLink: copy.fragmentLink !== false });
    if (missing.length) throw new Error(`${route}/${locale}: journey incomplete, missing ${missing.join(', ')}`);

    const { events, shifts, fontLoads, activationAt } = await page.evaluate(() => window.__connectedVitals);
    const byInteraction = new Map();
    for (const event of events) byInteraction.set(event.id, Math.max(byInteraction.get(event.id) ?? 0, event.duration));
    const attributed = attributeShifts({ shifts, fontLoads, activationAt });
    const lcp = lcpEntries.at(-1);
    if (!lcp) throw new Error(`${route}/${locale}: the journey reported no LCP`);
    return {
      route, locale, mode, interactions: completed,
      ttfbMs: Math.round(navigation.ttfb),
      fcpMs: navigation.fcp === null ? null : Math.round(navigation.fcp),
      lcpMs: Math.round(lcp.time),
      lcpElement: lcp.element,
      interactionCount: byInteraction.size,
      inpMs: Math.round(max(byInteraction.values())),
      // Raw sums: the zero gate compares them unrounded. Rounding is for display only.
      clsWholePage: attributed.wholePage,
      clsFromEnhancement: attributed.fromEnhancement,
      enhancementShiftDetail: attributed.enhancementDetail.map((shift) => ({ value: shift.value, atMs: Math.round(shift.time) })),
      activationAtMs: activationAt === null ? null : Math.round(activationAt),
    };
  } finally {
    await context.close();
  }
}

// --- Startup baseline (PLAN-SFC-V1 Task 3) -----------------------------------------------------------------
// The routes the commercial redesign changes. Terms does not exist yet: its legal baseline is Privacy.
const READING_ROUTES = {
  studio: { es: '/estudio/', en: '/en/about/' },
  founder: { es: '/estudio/samuel-furlanich/', en: '/en/about/samuel-furlanich/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
};
const TRACE_CATEGORIES = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'toplevel', 'blink.user_timing', 'loading'];
const STARTUP_SETTLE_MS = 2_000;
const STARTUP_METHOD =
  `one cold fresh-context navigation per journey under the profile's CPU/network throttling and the gzip lab server, no test hook and no forced renderer; ` +
  `a Chromium trace (${TRACE_CATEGORIES.join(', ')}) from before the navigation until ${STARTUP_SETTLE_MS} ms after the load event; startup CPU is the top-level script work ` +
  `(EvaluateScript, v8.compile, FunctionCall, RunMicrotasks: evaluation and hydration) of the document's CrRendererMain thread from its navigationStart; network and idle time are not tasks and cost nothing; ` +
  `first-load JS is the Brotli quality 11 size of the emitted files for every script the browser requested`;
const brotliSize = (buffer) => zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const packageVersion = (name) => JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version;
const sizeCache = new Map();
const emittedScriptSize = (relative) => {
  if (!sizeCache.has(relative)) {
    const buffer = fs.readFileSync(path.join(outDir, '_next/static', relative));
    sizeCache.set(relative, { rawBytes: buffer.length, brotliBytes: brotliSize(buffer) });
  }
  return sizeCache.get(relative);
};

async function startupJourney(browser, profileName, route, locale, run, traceDir) {
  const profile = PROFILES[profileName];
  const documentUrl = `${origin}${basePath}${READING_ROUTES[route][locale]}`;
  const context = await browser.newContext({
    ...profile.context,
    extraHTTPHeaders: { 'x-lab-rtt': String(profile.network.latency), 'x-lab-down': String(profile.network.downloadThroughput) },
  });
  let tracing = false;
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, ...profile.network });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
    const scripts = new Set();
    const critical = new Set(); // requested before the load event; the rest is fetched after it (route prefetch, deferred work)
    let loaded = false;
    page.on('load', () => {
      loaded = true;
    });
    page.on('request', (request) => {
      if (request.resourceType() !== 'script') return;
      const match = decodeURIComponent(new URL(request.url()).pathname).match(/_next\/static\/(.+\.js)$/);
      if (!match) return;
      scripts.add(match[1]);
      if (!loaded) critical.add(match[1]);
    });
    const tracePath = path.join(traceDir, `${route}-${locale}-${profileName}-${run + 1}.json`);
    await browser.startTracing(page, { path: tracePath, categories: TRACE_CATEGORIES });
    tracing = true;
    await page.goto(documentUrl, { waitUntil: 'load', timeout: 90_000 });
    await page.waitForTimeout(STARTUP_SETTLE_MS);
    await browser.stopTracing();
    tracing = false;
    const trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
    const cost = mainThreadStartupCost({ events: trace.traceEvents ?? trace, documentUrl });
    const canvases = await page.locator('canvas').count();
    if (canvases) throw new Error(`${route}/${locale}: the page drew ${canvases} canvas(es): a baseline of the static route would be wrong`);
    const sizes = [...scripts].sort().map((script) => ({ script, critical: critical.has(script), ...emittedScriptSize(script) }));
    // PLAN-SFC-V1 Task 14: a byte budget alone would pass a small slice of the optional engine moved into the code a
    // static route loads, so every script the journey requested is scanned for engine-only text.
    const optionalCode = findOptionalCodeInCriticalChunks({
      chunks: sizes.map((entry) => ({ path: entry.script, text: fs.readFileSync(path.join(outDir, '_next/static', entry.script), 'utf8') })),
    });
    if (optionalCode.length) {
      throw new Error(`${route}/${locale}: optional engine code in requested scripts: ${optionalCode.map((item) => `${item.path} (${item.marker}${critical.has(item.path) ? ', critical' : ''})`).join(', ')}`);
    }
    return {
      startupCpuMs: cost.scriptCpuMs,
      evaluationCpuMs: cost.evaluationCpuMs,
      longestTaskMs: cost.longestTaskMs,
      taskCpuMs: cost.taskCpuMs,
      tasks: cost.tasks,
      scripts: sizes,
      firstLoadJsBrotliBytes: sizes.reduce((sum, item) => sum + item.brotliBytes, 0),
      firstLoadJsRawBytes: sizes.reduce((sum, item) => sum + item.rawBytes, 0),
      criticalJsBrotliBytes: sizes.filter((item) => item.critical).reduce((sum, item) => sum + item.brotliBytes, 0),
      tracePath,
      traceSha256: crypto.createHash('sha256').update(fs.readFileSync(tracePath)).digest('hex'),
    };
  } finally {
    if (tracing) await browser.stopTracing().catch(() => {});
    await context.close();
  }
}

/** Brotli bytes of the scripts a route's own emitted HTML references: the deterministic second first-load measure. */
function staticHtmlJsBrotliBytes(pathname) {
  const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
  const scripts = [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.js)/g)].map((match) => match[1]))];
  if (!scripts.length) throw new Error(`${pathname}: the emitted HTML references no scripts`);
  return scripts.reduce((sum, script) => sum + emittedScriptSize(script).brotliBytes, 0);
}

const readJsonArgument = (name) => {
  const file = argument(name);
  if (file === undefined) return undefined;
  if (!file || !fs.existsSync(file)) throw new Error(`--${name} must name an existing report file, got "${file}"`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

/** The legal budget compares Terms against Privacy; Terms does not exist yet, so Privacy is judged against its own baseline. */
const COST_KIND = { studio: 'studio', founder: 'founder', contact: 'contact', privacy: 'legal' };

/** Judges every measured route of a finished startup report against Task 3's committed baseline. */
function compareWithBaseline(report, baselineReport, baselineProduction) {
  const comparison = [];
  for (const [profileName, profile] of Object.entries(report.profiles)) {
    for (const [key, entry] of Object.entries(profile.routes)) {
      const [route, locale] = key.split('/');
      const baseline = readBaselineEntry({ report: baselineReport, route, locale, profile: profileName });
      const productionEntry = baselineProduction?.readingRoutes?.find((item) => item.route === route && item.locale === locale);
      if (productionEntry) baseline.staticHtmlJsBrotliBytes = Math.round(productionEntry.jsBrotliKiB * 1024);
      const current = {
        route,
        locale,
        profile: profileName,
        basePath: report.basePath,
        journeys: entry.journeys,
        criticalJsBrotliBytes: entry.criticalJsBrotliBytes,
        firstLoadJsBrotliBytes: entry.firstLoadJsBrotliBytes,
        staticHtmlJsBrotliBytes: entry.staticHtmlJsBrotliBytes,
        startupCpuP95Ms: entry.startupCpuP95Ms,
        startupCpuSpreadMs: Math.max(...entry.journeysDetail.map((item) => item.startupCpuMs)) - Math.min(...entry.journeysDetail.map((item) => item.startupCpuMs)),
        longestTaskMs: entry.longestTaskMs,
      };
      if (baseline.basePath !== current.basePath) throw new Error(`${key} ${profileName}: the baseline is for base path ${baseline.basePath}, this run is ${current.basePath}`);
      const judged = judgeStaticRouteCost({ kind: COST_KIND[route], baseline, current });
      comparison.push({
        profile: profileName,
        route: key,
        kind: COST_KIND[route],
        verdict: judged.verdict,
        rows: judged.rows,
        firstLoadSettledJsAddedKiB: +((current.firstLoadJsBrotliBytes - baseline.firstLoadJsBrotliBytes) / 1024).toFixed(1),
      });
    }
  }
  return comparison;
}

async function runStartupBaseline() {
  // --compare=<Task 3 startup report> judges this run against it; --compare-production=<Task 3 production report> adds the
  // static-HTML first-load figure. Both are read before any browser work so a wrong path fails fast.
  const baselineReport = readJsonArgument('compare');
  const baselineProduction = readJsonArgument('compare-production');
  if (baselineProduction && !baselineReport) throw new Error('--compare-production needs --compare');
  const traceDir = path.resolve(argument('trace-dir') ?? path.join(root, '.superpowers', 'reports', baselineReport ? 'sfc-14' : 'sfc-03', 'traces', basePath ? basePath.slice(1) : 'root'));
  fs.mkdirSync(traceDir, { recursive: true });
  const browser = await chromium.launch();
  const report = {
    kind: 'cold startup baseline of the reading, intake and legal routes (one machine, lab throttling; not field data, not a pass/fail gate)',
    basePath: basePath || '/',
    journeysPerRoute: JOURNEYS_PER_LOCALE,
    method: STARTUP_METHOD,
    limitations: [
      'Tracing adds overhead to every figure; the same method must be used for any later comparison against this baseline.',
      'Lab data on one machine: the p95 of five journeys is the largest of the five (nearest rank).',
      'Terms does not exist yet: its comparator is Privacy.',
      'The server charges the navigation document the profile latency; scripts are served gzip with no added latency.',
    ],
    machine: { cpu: os.cpus()[0]?.model, logicalCores: os.cpus().length, memoryGiB: +(os.totalmem() / 1024 ** 3).toFixed(1), platform: `${os.platform()} ${os.release()}`, node: process.version },
    versions: { next: packageVersion('next'), react: packageVersion('react'), 'react-dom': packageVersion('react-dom'), three: packageVersion('three'), playwright: packageVersion('playwright'), chromium: browser.version() },
    head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    traceDir,
    profiles: {},
    notes: [],
  };
  const failures = [];
  try {
    for (const profileName of SELECTED_PROFILES) {
      report.profiles[profileName] = { label: PROFILES[profileName].label, routes: {} };
      for (const route of Object.keys(READING_ROUTES)) {
        for (const locale of Object.keys(READING_ROUTES[route])) {
          const journeys = [];
          for (let run = 0; run < JOURNEYS_PER_LOCALE; run += 1) journeys.push(await startupJourney(browser, profileName, route, locale, run, traceDir));
          const scriptSets = new Set(journeys.map((item) => item.scripts.map((entry) => entry.script).join('|')));
          if (scriptSets.size > 1) report.notes.push(`${profileName}/${route}/${locale}: the requested script set varied between journeys; the largest first-load figure is reported`);
          const summary = summarizeColdBaseline({
            route,
            locale,
            profile: profileName,
            basePath: basePath || '/',
            firstLoadJsBrotliBytes: Math.max(...journeys.map((item) => item.firstLoadJsBrotliBytes)),
            criticalJsBrotliBytes: Math.max(...journeys.map((item) => item.criticalJsBrotliBytes)),
            samples: journeys.map((item) => ({ startupCpuMs: item.startupCpuMs, longestTaskMs: item.longestTaskMs })),
            method: STARTUP_METHOD,
            tracePaths: journeys.map((item) => item.tracePath),
          });
          report.profiles[profileName].routes[`${route}/${locale}`] = {
            ...summary,
            firstLoadJsBrotliKiB: +(summary.firstLoadJsBrotliBytes / 1024).toFixed(1),
            criticalJsBrotliKiB: +(summary.criticalJsBrotliBytes / 1024).toFixed(1),
            staticHtmlJsBrotliBytes: staticHtmlJsBrotliBytes(READING_ROUTES[route][locale]),
            firstLoadJsRawKiB: +(Math.max(...journeys.map((item) => item.firstLoadJsRawBytes)) / 1024).toFixed(1),
            scriptCount: journeys[0].scripts.length,
            startupCpuMedianMs: +percentileOf(journeys.map((item) => item.startupCpuMs), 50).toFixed(1),
            startupCpuP95Ms: +summary.startupCpuP95Ms.toFixed(1),
            evaluationCpuP95Ms: +percentileOf(journeys.map((item) => item.evaluationCpuMs), 95).toFixed(1),
            taskCpuP95Ms: +percentileOf(journeys.map((item) => item.taskCpuMs), 95).toFixed(1),
            longestTaskMs: +summary.longestTaskMs.toFixed(1),
            journeysDetail: journeys.map((item) => ({ startupCpuMs: +item.startupCpuMs.toFixed(1), evaluationCpuMs: +item.evaluationCpuMs.toFixed(1), taskCpuMs: +item.taskCpuMs.toFixed(1), longestTaskMs: +item.longestTaskMs.toFixed(1), tasks: item.tasks, traceSha256: item.traceSha256 })),
            scripts: journeys[0].scripts.map((entry) => ({ script: entry.script, critical: entry.critical, rawKiB: +(entry.rawBytes / 1024).toFixed(1), brotliKiB: +(entry.brotliBytes / 1024).toFixed(1) })),
          };
        }
      }
    }
  } catch (error) {
    failures.push(error.stack ?? error.message);
  } finally {
    await browser.close();
    server.close();
  }
  let comparison = null;
  if (!failures.length && baselineReport) {
    try {
      comparison = compareWithBaseline(report, baselineReport, baselineProduction);
      report.comparison = comparison;
    } catch (error) {
      failures.push(error.message);
    }
  }
  const outFile = argument('out');
  if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
  if (comparison) {
    for (const item of comparison) {
      console.log(`${item.verdict} ${item.profile} ${item.route} (${item.kind}): ${item.rows.map((row) => `${row.metric} ${row.verdict} [${row.note}]`).join('; ')}; settled first-load JS ${item.firstLoadSettledJsAddedKiB >= 0 ? '+' : ''}${item.firstLoadSettledJsAddedKiB} KiB (reported, not gated)`);
    }
    const counts = comparison.reduce((tally, item) => ({ ...tally, [item.verdict]: (tally[item.verdict] ?? 0) + 1 }), {});
    console.log(`\nStatic release cost against the Task 3 baseline: ${JSON.stringify(counts)}`);
    if (comparison.some((item) => item.verdict === 'FAIL')) failures.push('one or more routes exceed their added-cost budget');
  }
  const table = Object.entries(report.profiles).flatMap(([profileName, profile]) =>
    Object.entries(profile.routes).map(([key, value]) => ({ profile: profileName, route: key, firstLoadJsBrotliKiB: value.firstLoadJsBrotliKiB, criticalJsBrotliKiB: value.criticalJsBrotliKiB, startupCpuMedianMs: value.startupCpuMedianMs, startupCpuP95Ms: value.startupCpuP95Ms, evaluationCpuP95Ms: value.evaluationCpuP95Ms, longestTaskMs: value.longestTaskMs })));
  console.log(JSON.stringify({ basePath: report.basePath, versions: report.versions, table }, null, 2));
  if (failures.length) {
    console.error('\nStartup baseline failed:\n- ' + failures.join('\n- '));
    process.exit(1);
  }
  console.log('\nStartup baseline recorded (no pass/fail gate).');
  process.exit(0);
}
if (STARTUP) await runStartupBaseline();

const browser = await chromium.launch(HARDWARE ? { channel: 'chromium' } : {});
let rendererName = null;
if (HARDWARE) {
  const probePage = await browser.newPage();
  rendererName = await probePage.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return gl ? String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : null;
  });
  await probePage.close();
  if (!rendererName || /swiftshader|llvmpipe|software|softpipe|microsoft basic/i.test(rendererName)) {
    await browser.close();
    server.close();
    console.error(`measure-connected-studio-vitals: --hardware needs a hardware renderer, got "${rendererName}"`);
    process.exit(1);
  }
}
const report = {
  renderer: rendererName,
  kind: 'synthetic lab measurement (not field data)',
  basePath: basePath || '/',
  expectedMode: EXPECT_MODE,
  journeysPerLocale: JOURNEYS_PER_LOCALE,
  gates: GATES,
  method: 'cold fresh-context navigation per journey under the build\'s own policy, no test hook and no forced software renderer; then required interactions (fragment link, keyboard focus, scrolling, a link to the other connected route, plus Pause and Resume when live)',
  limitations: [
    'Lab data on one machine, not field data; the p75 is over the journeys of both locales for one page.',
    'INP is the longest interaction of a scripted journey, a conservative stand-in for the 98th percentile of a real session.',
    'Enhancement layout shift is attributed by timing and by source; a shift with no source elements is attributed by timing only.',
    EXPECT_MODE === 'static'
      ? 'The shipped policy keeps both live tiers off, so this report measures the static pages. Live-tier figures stay OPEN until a hardware candidate run with --expect-mode=live; none is substituted here.'
      : 'Candidate live run: valid only on hardware WebGL2 with no override; the build under test is a private candidate, not the shipped policy.',
  ],
  profiles: {},
};
const failures = [];
try {
  for (const name of SELECTED_PROFILES) {
    const profile = PROFILES[name];
    report.profiles[name] = {};
    for (const route of SELECTED_ROUTES) {
      const journeys = [];
      for (let run = 0; run < JOURNEYS_PER_LOCALE; run += 1) {
        for (const locale of Object.keys(DESTINATIONS[route])) journeys.push(await journey(browser, profile, route, locale));
      }
      if (!journeys.length) throw new Error(`${name}/${route}: no journey was measured`);
      const summary = {
        label: profile.label,
        journeys: journeys.length,
        modes: journeys.reduce((counts, item) => ({ ...counts, [item.mode]: (counts[item.mode] ?? 0) + 1 }), {}),
        lcpP75Ms: percentile(journeys.map((item) => item.lcpMs), 75),
        inpP75Ms: percentile(journeys.map((item) => item.inpMs), 75),
        fcpP75Ms: percentile(journeys.map((item) => item.fcpMs ?? 0), 75),
        ttfbP75Ms: percentile(journeys.map((item) => item.ttfbMs), 75),
        lcpElements: [...new Set(journeys.map((item) => item.lcpElement))],
        clsWholePageMax: +max(journeys.map((item) => item.clsWholePage)).toFixed(5),
        clsFromEnhancementMax: max(journeys.map((item) => item.clsFromEnhancement)),
      };
      report.profiles[name][route] = { summary, journeys };
      const tag = `${name}/${EXPECT_MODE}/${route}`;
      if (summary.lcpP75Ms > GATES.lcpP75Ms) failures.push(`${tag}: LCP p75 ${summary.lcpP75Ms} ms exceeds ${GATES.lcpP75Ms} ms`);
      if (summary.inpP75Ms > GATES.inpP75Ms) failures.push(`${tag}: INP p75 ${summary.inpP75Ms} ms exceeds ${GATES.inpP75Ms} ms`);
      // Unrounded comparison: any positive enhancement shift fails the zero gate.
      if (summary.clsFromEnhancementMax > GATES.clsFromEnhancement) failures.push(`${tag}: layout shift from the enhancement ${summary.clsFromEnhancementMax} exceeds ${GATES.clsFromEnhancement}`);
    }
  }
} catch (error) {
  failures.push(error.message);
} finally {
  await browser.close();
  server.close();
}

const outFile = argument('out');
if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.profiles).map(([name, routes]) => [name, Object.fromEntries(Object.entries(routes).map(([key, value]) => [key, value.summary]))])), null, 2));
if (failures.length) {
  console.error('\nConnected-studio web-vitals gates failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nConnected-studio web-vitals gates passed (synthetic lab p75).');
