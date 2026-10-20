import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { buildRouteClosure, chunkImports, CONNECTED_HOST_MARKERS, findOptionalCodeInCriticalChunks, OPTIONAL_ENGINE_MARKERS } from '../../lib/connected-studio/measurement';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';

// PLAN-SFC-V1 Task 14: the Studio, Founder and Contact pages as the clean static export ships them. This spec runs
// only in the `sfc-production-{chromium,firefox,webkit}` projects (PLAYWRIGHT_SERVE_EXPORT=1), against `out/` served
// by scripts/serve-static-export.mjs. Since Tasks 18 and 25 the shipped policy is { wide: true, compact: true }: the host is
// attached to the three pages through the live-host seam and goes live for an eligible wide visitor, while every other
// visitor (compact, reduced motion, Save-Data, no hardware WebGL2) keeps a complete static page: their own matched poster
// (the responsive variant only), no canvas, no optional engine request and no engine-only code in anything they load.
// The production build compiles the diagnostics hook out, so everything here is the public DOM, the network and the
// emitted files; the live cases open the software-renderer gate through the controlled test hook (SwiftShader) and are
// functional evidence, never hardware acceptance.

test.describe.configure({ timeout: 90_000 });

const outDir = path.join(process.cwd(), 'out');

const atlasPages = [
  { route: 'studio', locale: 'es', pathname: stableRoutes.studio.es },
  { route: 'studio', locale: 'en', pathname: stableRoutes.studio.en },
  { route: 'founder', locale: 'es', pathname: stableRoutes.founder.es },
  { route: 'founder', locale: 'en', pathname: stableRoutes.founder.en },
  { route: 'contact', locale: 'es', pathname: stableRoutes.contact.es },
  { route: 'contact', locale: 'en', pathname: stableRoutes.contact.en },
] as const;

const emittedChunks = (() => {
  const dir = path.join(outDir, '_next', 'static', 'chunks');
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(js|css)$/.test(name))
    .map((name) => ({ path: `chunks/${name}`, rawBytes: 0, brotliBytes: 0, imports: chunkImports(fs.readFileSync(path.join(dir, name), 'utf8'), `chunks/${name}`) }));
})();

function emittedHtml(pathname: string): string {
  return fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
}
function emittedClosure(pathname: string) {
  const referenced = [...new Set([...emittedHtml(pathname).matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
  return { referenced, ...buildRouteClosure({ referenced, chunks: emittedChunks }) };
}
/** The engine chunk files, from the Services page, which is the one connected page that always ships its host. */
const engineChunkNames = (): string[] => emittedClosure(stableRoutes.services.es).closure.chunks.map((item) => item.path);

/** A file path at the served base path. `appPathname` is for routes and adds a trailing slash. */
const assetPath = (file: string): string => appPathname('/').slice(0, -1) + file;

type Observed = { posters: string[]; scripts: string[] };

/**
 * Reduced motion is how the static page is reached on a wide viewport in every engine: since Task 18 a wide visitor whose browser reports
 * a hardware WebGL2 renderer goes live, and whether a headless engine reports one depends on the machine. A compact visitor now goes live under the shipped policy too (Task 25).
 */
async function load(browser: Browser, baseURL: string | undefined, viewport: { width: number; height: number }, pathname: string): Promise<{ page: Page; observed: Observed; close: () => Promise<void> }> {
  const context = await browser.newContext({ baseURL, viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const observed: Observed = { posters: [], scripts: [] };
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (/\/brand\/connected-studio\//.test(url.pathname)) observed.posters.push(url.pathname);
    const chunk = decodeURIComponent(url.pathname).match(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.js)$/)?.[1];
    if (chunk) observed.scripts.push(chunk);
  });
  await page.goto(appUrl(pathname));
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  // A CSS background image starts when the Ground is styled; a stray second request would arrive well inside this.
  await page.waitForTimeout(800);
  return { page, observed, close: () => context.close() };
}

test.describe('the Atlas pages in the static export', () => {
  const sizes = [
    { name: 'wide', quality: 'wide', viewport: { width: 1440, height: 900 } },
    { name: 'compact', quality: 'compact', viewport: { width: 390, height: 844 } },
  ] as const;

  for (const { route, locale, pathname } of atlasPages) {
    test(`${route}/${locale} ships its own matching poster, no canvas and no engine request to an ineligible visitor`, async ({ browser, baseURL }) => {
      const engine = engineChunkNames();
      expect(engine.length, 'the engine closure was found in the export').toBeGreaterThan(0);

      // The emitted HTML itself: no optional entry, no engine chunk, no engine-only code, only this page's two posters.
      const closure = emittedClosure(pathname);
      expect(closure.referenced.filter((item) => engine.includes(item)), 'the HTML references no engine chunk').toEqual([]);
      const referencedScripts = closure.referenced.filter((item) => item.endsWith('.js'));
      expect(
        findOptionalCodeInCriticalChunks({ chunks: referencedScripts.map((item) => ({ path: item, text: fs.readFileSync(path.join(outDir, '_next', 'static', item), 'utf8') })), markers: OPTIONAL_ENGINE_MARKERS }),
        'no referenced script carries engine-only code',
      ).toEqual([]);
      const named = [...new Set([...emittedHtml(pathname).matchAll(/brand\/connected-studio\/([a-z]+-(?:wide|compact))\.webp/g)].map((match) => match[1]))].sort();
      expect(named, 'the HTML names only this page’s posters').toEqual([`${route}-compact`, `${route}-wide`]);

      for (const size of sizes) {
        const { page, observed, close } = await load(browser, baseURL, size.viewport, pathname);
        try {
          expect(observed.posters, `${size.name}: exactly the ${size.quality} poster of this page`).toEqual([assetPath(`/brand/connected-studio/${route}-${size.quality}.webp`)]);
          expect(observed.scripts.filter((item) => engine.includes(item)), `${size.name}: no engine chunk was requested`).toEqual([]);
          expect(
            findOptionalCodeInCriticalChunks({ chunks: [...new Set(observed.scripts)].map((item) => ({ path: item, text: fs.readFileSync(path.join(outDir, '_next', 'static', item), 'utf8') })), markers: OPTIONAL_ENGINE_MARKERS }),
            `${size.name}: nothing requested carries engine-only code`,
          ).toEqual([]);
          await expect(page.locator('canvas')).toHaveCount(0);
          const ground = page.locator('main [data-connected-ground]');
          await expect(ground).toHaveCount(1);
          await expect(ground).not.toHaveAttribute('data-connected-live', 'true');
          await expect(page.locator(`#connected-pause-${route}`)).toHaveCount(1);
          const painted = await page.locator('[data-connected-poster]').evaluate((element) => getComputedStyle(element).backgroundImage);
          expect(painted, `${size.name}: the poster layer paints the matching file`).toContain(`${route}-${size.quality}.webp`);
          const preloads = await page.locator('link[rel="preload"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
          expect(preloads.filter((href) => /connected-studio/.test(href)), `${size.name}: the poster is never preloaded`).toEqual([]);
        } finally {
          await close();
        }
      }
    });
  }

  // The Task 14 finding, fixed in Task 16 and resolved the other way in Task 18: the host chunk (about 13.7 KiB Brotli) reaches
  // an Atlas page only through the live-host seam (scripts/sfc-contracts.test.mjs walks the import graph). Now that the wide
  // tier is qualified the seam is filled, so every Atlas page references the host and names the optional engine entry the host
  // loads on demand, while the engine itself stays out of everything the page references.
  test('every Atlas page references the host through the seam and keeps the engine optional', async () => {
    for (const { route, locale, pathname } of atlasPages) {
      const closure = emittedClosure(pathname);
      expect(closure.entries.length, `${route}/${locale}: the host names the optional engine entry`).toBeGreaterThan(0);
      const scripts = closure.referenced.filter((item) => item.endsWith('.js'));
      const chunks = scripts.map((item) => ({ path: item, text: fs.readFileSync(path.join(outDir, '_next', 'static', item), 'utf8') }));
      expect(findOptionalCodeInCriticalChunks({ chunks, markers: CONNECTED_HOST_MARKERS }).length, `${route}/${locale}: a referenced script carries the host`).toBeGreaterThan(0);
      expect(findOptionalCodeInCriticalChunks({ chunks, markers: OPTIONAL_ENGINE_MARKERS }), `${route}/${locale}: no referenced script carries engine-only code`).toEqual([]);
    }
  });

  // Controlled functional evidence on SwiftShader (Chromium only): the hook opens the software-renderer gate and nothing else, so the
  // policy under test is the one the build ships.
  for (const { route, locale, pathname } of atlasPages) {
    test(`${route}/${locale}: the shipped policy takes an eligible wide and compact visitor live and keeps ineligible visitors static`, async ({ browser, baseURL, browserName }) => {
      test.skip(browserName !== 'chromium', 'WebGL2 on SwiftShader is exercised in Chromium only');
      const engine = engineChunkNames();
      const open = async (viewport: { width: number; height: number }, arrange?: (page: Page) => Promise<void>) => {
        const context = await browser.newContext({ baseURL, viewport });
        const page = await context.newPage();
        const requested: string[] = [];
        page.on('request', (request) => {
          const chunk = decodeURIComponent(new URL(request.url()).pathname).match(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.js)$/)?.[1];
          if (chunk && engine.includes(chunk)) requested.push(chunk);
        });
        await setConnectedTestHook(page, { allowSoftwareRenderer: true });
        await arrange?.(page);
        await page.goto(appUrl(pathname));
        return { page, requested, close: () => context.close() };
      };

      const wide = await open({ width: 1440, height: 900 });
      try {
        await expect(wide.page.locator('main [data-connected-ground]')).toHaveAttribute('data-connected-live', 'true', { timeout: 45_000 });
        await expect(wide.page.locator('main [data-connected-ground] canvas')).toHaveCount(1);
        await expect(wide.page.locator(`#connected-pause-${route} button`)).toHaveCount(1);
        expect(wide.requested.length, 'the engine was requested for the eligible visitor').toBeGreaterThan(0);
      } finally {
        await wide.close();
      }

      const compact = await open({ width: 390, height: 844 });
      try {
        await expect(compact.page.locator('main [data-connected-ground]')).toHaveAttribute('data-connected-live', 'true', { timeout: 45_000 });
        await expect(compact.page.locator('main [data-connected-ground] canvas')).toHaveCount(1);
        await expect(compact.page.locator(`#connected-pause-${route} button`)).toHaveCount(1);
        expect(compact.requested.length, 'the engine was requested for the eligible compact visitor').toBeGreaterThan(0);
      } finally {
        await compact.close();
      }

      const ineligible: Array<{ name: string; viewport: { width: number; height: number }; arrange?: (page: Page) => Promise<void> }> = [
        { name: 'reduced motion', viewport: { width: 1440, height: 900 }, arrange: async (page) => { await page.emulateMedia({ reducedMotion: 'reduce' }); } },
        {
          name: 'Save-Data',
          viewport: { width: 1440, height: 900 },
          arrange: async (page) => {
            await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
          },
        },
      ];
      for (const gate of ineligible) {
        const stayed = await open(gate.viewport, gate.arrange);
        try {
          await stayed.page.waitForTimeout(2_000);
          await expect(stayed.page.locator('canvas'), `${gate.name}: no canvas`).toHaveCount(0);
          await expect(stayed.page.locator('main [data-connected-ground]'), `${gate.name}: not live`).not.toHaveAttribute('data-connected-live', 'true');
          expect(stayed.requested, `${gate.name}: no engine chunk was requested`).toEqual([]);
        } finally {
          await stayed.close();
        }
      }
    });
  }

  test('a failed poster leaves the reading page complete on the CSS chart in every engine', async ({ browser, baseURL }) => {
    for (const { route, pathname } of [atlasPages[0], atlasPages[2], atlasPages[4]]) {
      const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route(/\/brand\/connected-studio\//, (request) => request.fulfill({ status: 404, body: 'missing' }));
      await page.goto(appUrl(pathname));
      await page.waitForLoadState('load');
      await page.waitForTimeout(600);
      await expect(page.getByRole('main').getByRole('heading', { level: 1 }), route).toBeVisible();
      const chart = await page.locator('[data-connected-ground]').evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(chart, `${route}: the pure CSS chart is the Ground itself`).toContain('gradient');
      await expect(page.locator('canvas')).toHaveCount(0);
      expect(errors, route).toEqual([]);
      await context.close();
    }
  });
});
