// Synthetic (lab) LCP and INP for the connected Services and Projects pages in both locales
// (PLAN-SPF-V1 Task 9). These are throttled Chromium journeys over the clean static export, not field
// data. Usage:
//   npm run measure:connected-studio-vitals [-- --skip-build] [--journeys=10] [--profile=mobile|desktop]
//     [--expect-mode=static|live] [--base-path=/Portfolio] [--out=report.json]
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
// measured stay OPEN: there is no software-rendered substitute here.
//
// Each journey is a cold navigation (a fresh context) followed by required interactions: an in-page
// fragment link, keyboard focus movement, scrolling and a link to the other connected route (plus Pause and
// Resume when live). A missing control, a navigation that does not land, or a mode other than the expected
// one fails the run: it never contributes a sample. Layout shift from the enhancement is attributed by
// `attributeShifts` and gated unrounded at zero.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';
import { attributeShifts, missingInteractions, validateVitalsOptions } from '../lib/connected-studio/measurement.ts';
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

// Validate before building, serving or launching anything: a typo must not become a passing gate.
let options;
try {
  options = validateVitalsOptions({
    journeys: argument('journeys') ?? '10',
    profile: argument('profile'),
    profiles: Object.keys(PROFILES),
    expectMode: argument('expect-mode'),
  });
} catch (error) {
  console.error(`measure-connected-studio-vitals: ${error.message}`);
  process.exit(1);
}
const { journeys: JOURNEYS_PER_LOCALE, profiles: SELECTED_PROFILES, expectMode: EXPECT_MODE } = options;
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
};

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
    if ((await fragment.count()) === 0) throw new Error(`${route}/${locale}: no visible in-page fragment link to follow`);
    await tap(fragment);
    completed.push('fragment-link');
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
    const missing = missingInteractions({ mode, completed });
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

const browser = await chromium.launch();
const report = {
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
    for (const route of Object.keys(DESTINATIONS)) {
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
