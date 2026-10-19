import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Page, type Request } from '@playwright/test';
import { CONNECTED_CAPABILITY_WORDS } from '../../lib/connected-studio/content';
import { buildRouteClosure, chunkImports, crossCheckClosure } from '../../lib/connected-studio/measurement';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';
import {
  closeContext,
  connectedCanvas,
  enableLiveForTest,
  liveContexts,
  observePageErrors,
  pauseLabels,
  pauseSlot,
  readLabelGeometry,
  readSession,
  seedSession,
  trackWebglContexts,
  type ConnectedLocale,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 9: the production journeys. This spec runs only in the `connected-production-chromium`
// project (PLAYWRIGHT_SERVE_EXPORT=1), against the clean static export in `out/` served by
// scripts/serve-static-export.mjs, which never rewrites a missing route to an index. The production build
// compiles the diagnostics hook out, so everything here observes the public DOM, the network and the WebGL
// API. The live cases open the software-renderer gate (and, where they need a tier the shipped policy leaves off,
// the policy) through the controlled test hook and run on SwiftShader: they are functional evidence, never
// hardware acceptance. Since PLAN-SFC-V1 Task 18 the shipped policy is { wide: true, compact: false }.

test.describe.configure({ timeout: 120_000 });

const outDir = path.join(process.cwd(), 'out');
const NEW_PAGE_TIMEOUT_MS = 45_000;

const retiredPaths = [
  '/proyectos/general-reservation-system/',
  '/proyectos/the-system/',
  '/proyectos/mpc-administracion/',
  '/en/work/general-reservation-system/',
  '/en/work/the-system/',
  '/en/work/mpc-administracion/',
];
const retiredDestination = /(?:\/proyectos\/|\/en\/work\/)(?:general-reservation-system|the-system|mpc-administracion)(?![\w-])/;

const ground = (page: Page) => page.locator('main [data-connected-ground]');
/** The scene is live once the host has drawn its first frame (`data-connected-live`); production has no diagnostics hook. */
const expectLiveProduction = (page: Page) => expect(ground(page)).toHaveAttribute('data-connected-live', 'true', { timeout: NEW_PAGE_TIMEOUT_MS });
const expectNoCanvas = async (page: Page) => {
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(ground(page)).not.toHaveAttribute('data-connected-live', 'true');
};
/** Counts WebGL `clear` calls (one per rendered frame) so a spec can prove a paused scene draws nothing. Install before navigating. */
async function countDraws(page: Page): Promise<() => Promise<number>> {
  await page.addInitScript(() => {
    const state = { clears: 0 };
    (window as unknown as { __connectedDraws: typeof state }).__connectedDraws = state;
    const original = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function (this: WebGL2RenderingContext, mask: number) {
      state.clears += 1;
      return original.call(this, mask);
    };
  });
  return () => page.evaluate(() => (window as unknown as { __connectedDraws: { clears: number } }).__connectedDraws.clears);
}
const chunkOf = (request: Request) => decodeURIComponent(new URL(request.url()).pathname).match(/_next\/static\/(chunks\/[A-Za-z0-9._-]+)$/)?.[1] ?? null;

/**
 * The emitted export, read from disk: every chunk with the chunks it names in its async loaders. The optional
 * engine closure of a page is what that page's chunks load lazily and its HTML does not reference. Production
 * file names are hashed, so they come from here, not from a guess. The functional cross-check below proves the
 * browser requests exactly this set; `measure:connected-studio` gates its size.
 */
const emittedChunks = (() => {
  const dir = path.join(outDir, '_next', 'static', 'chunks');
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(js|css)$/.test(name))
    .map((name) => ({ path: `chunks/${name}`, rawBytes: 0, brotliBytes: 0, imports: chunkImports(fs.readFileSync(path.join(dir, name), 'utf8'), `chunks/${name}`) }));
})();
function emittedClosure(pathname: string) {
  const html = fs.readFileSync(path.join(outDir, ...pathname.split('/').filter(Boolean), 'index.html'), 'utf8');
  const referenced = [...new Set([...html.matchAll(/_next\/static\/(chunks\/[A-Za-z0-9._-]+\.(?:js|css))/g)].map((match) => match[1]))];
  return buildRouteClosure({ referenced, chunks: emittedChunks });
}
/** The engine chunk files of the Services page; every connected page shares them (the measurement script reports it). */
const engineChunkNames = (): string[] => emittedClosure(stableRoutes.services.es).closure.chunks.map((item) => item.path);
const matchesEngine = (names: readonly string[]) => (url: URL) => names.some((name) => url.pathname.endsWith(`/_next/static/${name}`));

const connectedPages = [
  { route: 'services', locale: 'es', pathname: stableRoutes.services.es },
  { route: 'services', locale: 'en', pathname: stableRoutes.services.en },
  { route: 'projects', locale: 'es', pathname: stableRoutes.projects.es },
  { route: 'projects', locale: 'en', pathname: stableRoutes.projects.en },
] as const;

test.describe('retired project-detail URLs', () => {
  for (const retired of retiredPaths) {
    test(`${retired} is a real 404 with no residual file`, async ({ request, baseURL }) => {
      const response = await request.get(new URL(`.${retired}`, baseURL).toString());
      expect(response.status(), 'the static server answers a missing route with 404, never an index').toBe(404);
      expect(fs.existsSync(path.join(outDir, ...retired.split('/').filter(Boolean))), 'no exported directory').toBe(false);
      expect(fs.existsSync(path.join(outDir, 'projects', 'mpc-administracion')), 'the retired MPC concept directory').toBe(false);
    });
  }

  test('no page links to a retired destination', async ({ page }) => {
    const hrefs: string[] = [];
    for (const route of [stableRoutes.home, stableRoutes.services, stableRoutes.projects, stableRoutes.founder, stableRoutes.contact]) {
      for (const pathname of [route.es, route.en]) {
        await page.goto(appUrl(pathname));
        hrefs.push(...(await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))));
      }
    }
    expect(hrefs.length).toBeGreaterThan(50);
    expect(hrefs.filter((href) => retiredDestination.test(href))).toEqual([]);
  });
});

test.describe('fragments and the locale switch on the export', () => {
  for (const [route, alternate, hreflang] of [
    [stableRoutes.projects.es, stableRoutes.projects.en, 'en'],
    [stableRoutes.projects.en, stableRoutes.projects.es, 'es-AR'],
  ] as const) {
    test(`${route} lands a recognized fragment below the App Bar and the switch keeps it`, async ({ page }) => {
      await page.goto(appUrl(route) + '#the-system');
      const article = page.locator('article#the-system');
      await expect(article).toBeVisible();
      const top = await article.evaluate((element) => element.getBoundingClientRect().top);
      const headerBottom = await page.getByRole('banner').evaluate((element) => element.getBoundingClientRect().bottom);
      expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
      const link = page.getByRole('banner').locator(`a[hreflang="${hreflang}"]`);
      await expect(link).toHaveAttribute('href', appPathname(alternate) + '#the-system');
      await link.click();
      await expect(page).toHaveURL((url) => url.pathname === appPathname(alternate) && url.hash === '#the-system');
      await expect(page.locator('article#the-system')).toBeVisible();
    });

    test(`${route} drops an unknown fragment and lands on the equivalent index`, async ({ page }) => {
      const errors = observeUnexpectedBrowserErrors(page);
      await page.goto(appUrl(route) + '#nope');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.getByRole('banner').locator(`a[hreflang="${hreflang}"]`).click();
      await expect(page).toHaveURL((url) => url.pathname === appPathname(alternate) && url.hash === '');
      errors();
    });
  }
});

test.describe('the journey through the exported site', () => {
  test('Home, Services, Projects, locale switch, Founder and Contact, then back and forward, with one context at a time', async ({ page }) => {
    const errors = observeUnexpectedBrowserErrors(page);
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.home.es));
    await page.locator('a[data-app-bar-nav-link]:is([href$="/servicios/"], [href$="/servicios/#site-top"]):visible').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.services.es));
    await expectLiveProduction(page);
    await expect(connectedCanvas(page)).toHaveCount(1);

    await page.locator('a[data-app-bar-nav-link]:is([href$="/proyectos/"], [href$="/proyectos/#site-top"]):visible').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.es));
    await expect(ground(page)).toHaveAttribute('data-connected-route', 'projects');
    await expectLiveProduction(page);
    await expect(connectedCanvas(page)).toHaveCount(1);
    expect(await contexts.maxAlive(), 'one live renderer across the client navigation').toBeLessThanOrEqual(1);

    // The locale switch is a native document navigation.
    await page.getByRole('banner').locator('a[hreflang="en"]').click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.en));
    await expectLiveProduction(page);
    // Follow the rendered Founder link and the Contact action: real client navigations, so the live scene is
    // disposed by the route change itself and the links are exercised, not replaced by fresh document loads.
    const founderPath = appPathname(stableRoutes.founder.en);
    await page.locator(`a[href$="${founderPath}"]:visible`).first().click();
    await expect(page).toHaveURL((url) => url.pathname === founderPath);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(liveContexts(await contexts.events()), 'leaving the connected route released its context').toBe(0);
    const contactPath = appPathname(stableRoutes.contact.en);
    await page.locator(`a[href$="${contactPath}"]:visible`).first().click();
    await expect(page).toHaveURL((url) => url.pathname === contactPath);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    // Back and forward through that real history.
    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === founderPath);
    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.en));
    await expectLiveProduction(page);
    await expect(connectedCanvas(page)).toHaveCount(1);
    await page.goForward();
    await expect(page).toHaveURL((url) => url.pathname === founderPath);
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.goForward();
    await expect(page).toHaveURL((url) => url.pathname === contactPath);
    expect(await contexts.maxAlive(), 'never two live contexts').toBeLessThanOrEqual(1);
    expect(liveContexts(await contexts.events()), 'no context outlives the connected route').toBe(0);
    errors();
  });

  test('Pause persists across routes and locales for the session, and Resume continues', async ({ page }) => {
    const draws = await countDraws(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es));
    await expectLiveProduction(page);
    await pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.pause }).click();
    await expect(pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.resume })).toHaveAttribute('aria-pressed', 'true');

    await page.locator('a[data-app-bar-nav-link]:is([href$="/proyectos/"], [href$="/proyectos/#site-top"]):visible').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.es));
    const resume = pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.es.resume });
    await expect(resume).toHaveAttribute('aria-pressed', 'true', { timeout: NEW_PAGE_TIMEOUT_MS });
    expect((await readSession(page)).paused, 'the preference lives in the browsing session').toBe('1');

    await page.getByRole('banner').locator('a[hreflang="en"]').click();
    const resumeEn = pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.resume });
    await expect(resumeEn).toHaveAttribute('aria-pressed', 'true', { timeout: NEW_PAGE_TIMEOUT_MS });
    // A paused scene holds its one painted frame: no scheduled work, no draws.
    const held = await draws();
    await page.waitForTimeout(1_500);
    expect(await draws(), 'a paused scene draws nothing').toBe(held);
    await resumeEn.click();
    await expect(pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.pause })).toHaveAttribute('aria-pressed', 'false');
    expect((await readSession(page)).paused).toBe('0');
    await expect.poll(draws, { message: 'Resume draws again', timeout: 10_000 }).toBeGreaterThan(held);
  });

  test('labels carry only the current locale: no stale words after a locale switch', async ({ page }) => {
    await enableLiveForTest(page);
    for (const locale of ['es', 'en'] as ConnectedLocale[]) {
      await page.goto(appUrl(stableRoutes.services[locale]));
      await expectLiveProduction(page);
      await expect.poll(async () => (await readLabelGeometry(page)).labels.filter((label) => label.visible).length, { timeout: 20_000 }).toBeGreaterThan(0);
      const { labels } = await readLabelGeometry(page);
      const own = new Set<string>(CONNECTED_CAPABILITY_WORDS[locale]);
      const other = (locale === 'es' ? CONNECTED_CAPABILITY_WORDS.en : CONNECTED_CAPABILITY_WORDS.es).filter((word) => !own.has(word));
      expect(labels.length).toBeGreaterThan(0);
      for (const label of labels) {
        expect(own.has(label.text), `label "${label.text}" belongs to the ${locale} vocabulary`).toBe(true);
        expect(other).not.toContain(label.text);
      }
    }
  });

  test('repeated route changes leave one canvas and no growing listener count', async ({ page, context }) => {
    test.setTimeout(240_000);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es));
    await expectLiveProduction(page);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const listeners = async () => {
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      return metrics.find((metric) => metric.name === 'JSEventListeners')?.value ?? 0;
    };
    const nextRoute = async (target: 'services' | 'projects') => {
      const pathname = appPathname(stableRoutes[target].es);
      await page.locator(`a[data-app-bar-nav-link]:is([href="${pathname}"], [href="${pathname}#site-top"]):visible`).first().click();
      await expect(page).toHaveURL((url) => url.pathname === pathname);
      await expectLiveProduction(page);
      await expect(connectedCanvas(page)).toHaveCount(1);
    };
    // Warm-up first, so router, prefetch and host listeners are established before the baseline.
    for (const target of ['projects', 'services', 'projects'] as const) await nextRoute(target);
    const baseline = await listeners();
    for (const target of ['services', 'projects', 'services', 'projects'] as const) await nextRoute(target);
    expect(await listeners(), `listeners after the remounts (baseline ${baseline})`).toBeLessThanOrEqual(baseline + 2);
  });
});

test.describe('session loss, import races and failures', () => {
  test('a lost context returns to the static background, writes only its own flag and suppresses both routes', async ({ page }) => {
    const errors = observePageErrors(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es));
    await expectLiveProduction(page);
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-connected-canvas]');
      canvas?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect(page.locator('canvas')).toHaveCount(0, { timeout: 20_000 });
    await expect(pauseSlot(page, 'services').getByRole('button')).toHaveCount(0);
    const session = await readSession(page);
    expect(session.contextLost).toBe('1');
    expect(session.homeContextLost, 'Home\'s own flag is only read').toBeNull();

    await page.locator('a[data-app-bar-nav-link]:is([href$="/proyectos/"], [href$="/proyectos/#site-top"]):visible').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.es));
    await page.waitForTimeout(2_500);
    await expectNoCanvas(page);
    expect(errors.errors).toEqual([]);
  });

  test('a stored session loss keeps every connected page static without fetching the engine', async ({ page }) => {
    const names = engineChunkNames();
    expect(names.length, 'the learned engine closure is not empty').toBeGreaterThan(0);
    const requested: string[] = [];
    page.on('request', (request) => {
      const chunk = chunkOf(request);
      if (chunk && names.includes(chunk)) requested.push(chunk);
    });
    await enableLiveForTest(page);
    await seedSession(page, { contextLost: '1' });
    for (const connected of connectedPages) {
      await page.goto(appUrl(connected.pathname));
      await page.waitForTimeout(1_500);
      await expectNoCanvas(page);
    }
    expect(requested).toEqual([]);
  });

  test('leaving while the engine import is still in flight creates no late canvas, context or error', async ({ page }) => {
    const names = engineChunkNames();
    const errors = observeUnexpectedBrowserErrors(page);
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    let delayed = 0;
    await page.route(matchesEngine(names), async (route) => {
      delayed += 1;
      await new Promise((resolve) => setTimeout(resolve, 4_000));
      await route.continue().catch(() => undefined);
    });
    await page.goto(appUrl(stableRoutes.services.es));
    await expect.poll(() => delayed, { timeout: 15_000 }).toBeGreaterThan(0);
    // Leave for an ordinary page before the import resolves. Studio is connected since Task 18 and would load the engine
    // legitimately, so the destination is Privacy, which mounts no scene.
    await page.locator('[data-site-footer] a[href$="/privacidad/"]').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.privacy.es));
    await page.waitForTimeout(6_000);
    await expect(page.locator('canvas')).toHaveCount(0);
    const events = await contexts.events();
    expect(liveContexts(events), 'the probe context was released and no engine context was created').toBe(0);
    errors();
  });

  test('a delayed import that resolves on another connected route yields exactly one scene', async ({ page }) => {
    const names = engineChunkNames();
    const errors = observePageErrors(page);
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await page.route(matchesEngine(names), async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_500));
      await route.continue().catch(() => undefined);
    });
    await page.goto(appUrl(stableRoutes.services.es));
    await page.waitForTimeout(800);
    await page.locator('a[data-app-bar-nav-link]:is([href$="/proyectos/"], [href$="/proyectos/#site-top"]):visible').first().click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.es));
    await expectLiveProduction(page);
    await expect(connectedCanvas(page)).toHaveCount(1);
    await expect(ground(page)).toHaveAttribute('data-connected-route', 'projects');
    expect(await contexts.maxAlive()).toBeLessThanOrEqual(1);
    expect(errors.errors).toEqual([]);
  });

  test('a failed engine module stays static without an unhandled error or a retry', async ({ page }) => {
    const names = engineChunkNames();
    const errors = observePageErrors(page);
    let attempts = 0;
    await enableLiveForTest(page);
    await page.route(matchesEngine(names), (route) => {
      attempts += 1;
      return route.abort();
    });
    await page.goto(appUrl(stableRoutes.projects.en));
    await expect.poll(() => attempts, { timeout: 20_000 }).toBeGreaterThan(0);
    // The bundler's chunk loader re-fetches each failed script once, in the first second or two. The page itself
    // never retries, so the count settles; wait for it to stop moving, then prove it stays put.
    let settled = -1;
    await expect
      .poll(
        async () => {
          const before = attempts;
          await page.waitForTimeout(2_000);
          settled = attempts;
          return settled === before;
        },
        { timeout: 30_000 },
      )
      .toBe(true);
    const first = settled;
    await page.waitForTimeout(3_000);
    await expectNoCanvas(page);
    await expect(pauseSlot(page, 'projects').getByRole('button')).toHaveCount(0);
    await expect(page.locator('[data-connected-poster]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(attempts, 'a rejected import is not retried by the page').toBe(first);
    expect(first, 'only the bundler re-fetches, once per chunk').toBeLessThanOrEqual(names.length * 2);
    expect(errors.errors).toEqual([]);
  });

  test('a failed poster image leaves the complete page and the live scene intact', async ({ page }) => {
    const errors = observePageErrors(page);
    await enableLiveForTest(page);
    await page.route('**/brand/connected-studio/*.webp', (route) => route.abort());
    await page.goto(appUrl(stableRoutes.services.en));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectLiveProduction(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors.errors).toEqual([]);
  });

  test('a focused Pause control keeps focus and reads the inactive Static background after reduced motion turns on', async ({ page }) => {
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.en));
    await expectLiveProduction(page);
    const pause = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.pause });
    await pause.focus();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const held = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.staticBackground });
    await expect(held).toBeFocused();
    await expect(held).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('canvas')).toHaveCount(0);
  });
});

test.describe('preferences and capability gates fetch no engine', () => {
  const gates: { name: string; arrange(page: Page): Promise<unknown>; live?: 'software-gate-open' }[] = [
    { name: 'reduced motion', arrange: (page) => page.emulateMedia({ reducedMotion: 'reduce' }) },
    { name: 'forced colors', arrange: (page) => page.emulateMedia({ forcedColors: 'active' }) },
    {
      name: 'Save-Data',
      arrange: (page) =>
        page.addInitScript(() => {
          Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, addEventListener() {}, removeEventListener() {} } });
        }),
    },
    {
      name: 'no WebGL2',
      arrange: (page) =>
        page.addInitScript(() => {
          const original = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
            return type === 'webgl2' ? null : (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
          } as typeof HTMLCanvasElement.prototype.getContext;
        }),
    },
  ];
  for (const gate of gates) {
    for (const connected of [connectedPages[0], connectedPages[3]]) {
      test(`${gate.name} on ${connected.route}/${connected.locale} stays static and requests no engine chunk`, async ({ page }) => {
        const names = engineChunkNames();
        const errors = observeUnexpectedBrowserErrors(page);
        const requested: string[] = [];
        page.on('request', (request) => {
          const chunk = chunkOf(request);
          if (chunk && names.includes(chunk)) requested.push(chunk);
        });
        await gate.arrange(page);
        await enableLiveForTest(page);
        await page.goto(appUrl(connected.pathname));
        await page.waitForTimeout(2_000);
        await expectNoCanvas(page);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(requested).toEqual([]);
        errors();
      });
    }
  }

  for (const connected of [connectedPages[1], connectedPages[2]]) {
    // Task 18: the shipped policy takes the qualified wide tier live. Only the software gate is opened here (SwiftShader
    // stands in for hardware); the policy is the one the build ships.
    test(`the shipped policy takes the wide tier live on ${connected.route}/${connected.locale} once the software gate is open`, async ({ page }) => {
      await setConnectedTestHook(page, { allowSoftwareRenderer: true });
      await page.goto(appUrl(connected.pathname));
      await expectLiveProduction(page);
      await expect(connectedCanvas(page)).toHaveCount(1);
    });

    test(`the shipped policy keeps the unqualified compact tier static on ${connected.route}/${connected.locale} even when the software gate is open`, async ({ page }) => {
      const names = engineChunkNames();
      const requested: string[] = [];
      page.on('request', (request) => {
        const chunk = chunkOf(request);
        if (chunk && names.includes(chunk)) requested.push(chunk);
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await setConnectedTestHook(page, { allowSoftwareRenderer: true });
      await page.goto(appUrl(connected.pathname));
      await page.waitForTimeout(2_000);
      await expectNoCanvas(page);
      expect(requested).toEqual([]);
    });

    test(`a software renderer is rejected on ${connected.route}/${connected.locale} even with the live policy on`, async ({ page }) => {
      const names = engineChunkNames();
      const requested: string[] = [];
      page.on('request', (request) => {
        const chunk = chunkOf(request);
        if (chunk && names.includes(chunk)) requested.push(chunk);
      });
      await setConnectedTestHook(page, { livePolicy: { wide: true, compact: true } });
      await page.goto(appUrl(connected.pathname));
      await page.waitForTimeout(2_000);
      await expectNoCanvas(page);
      expect(requested).toEqual([]);
    });
  }
});

test.describe('the emitted closure and the browser agree (functional evidence)', () => {
  // Controlled test evidence: the hook and SwiftShader are the only way to exercise the engine while both live
  // tiers are off. Sizes and budgets are gated by `measure:connected-studio`, which never sets the hook.
  const cases = [
    ...connectedPages.map((connected) => ({ connected, quality: 'wide', viewport: { width: 1440, height: 900 } })),
    { connected: connectedPages[0], quality: 'compact', viewport: { width: 390, height: 844 } },
    { connected: connectedPages[3], quality: 'compact', viewport: { width: 390, height: 844 } },
  ];
  for (const { connected, quality, viewport } of cases) {
    test(`${connected.route}/${connected.locale} at ${quality} width: the live load requests exactly the emitted closure`, async ({ browser, baseURL }) => {
      const { entries, closure } = emittedClosure(connected.pathname);
      expect(entries.length, 'the page has optional entries to measure').toBeGreaterThan(0);
      expect(closure.violations).toEqual([]);
      const load = async (live: boolean) => {
        const context = await browser.newContext({ baseURL, viewport });
        const page = await context.newPage();
        const seen = new Set<string>();
        page.on('request', (request) => {
          const chunk = chunkOf(request);
          if (chunk) seen.add(chunk);
        });
        if (live) await enableLiveForTest(page);
        await page.goto(appUrl(connected.pathname));
        if (live) await expectLiveProduction(page);
        else await page.waitForTimeout(2_000);
        await closeContext(context);
        return seen;
      };
      const shipped = await load(false);
      const live = await load(true);
      const extra = [...live].filter((chunk) => !shipped.has(chunk));
      expect(crossCheckClosure({ requested: extra, closure })).toEqual({ missingFromRequests: [], unexpectedRequests: [] });
    });
  }

  test('a second connected route reuses the engine chunks from the HTTP cache', async ({ page }) => {
    const names = engineChunkNames();
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es));
    await expectLiveProduction(page);
    await page.goto(appUrl(stableRoutes.projects.es));
    await expectLiveProduction(page);
    const entries = await page.evaluate(() =>
      performance.getEntriesByType('resource').map((entry) => ({ name: entry.name, transferSize: (entry as PerformanceResourceTiming).transferSize, encodedBodySize: (entry as PerformanceResourceTiming).encodedBodySize })),
    );
    const engine = entries.filter((entry) => names.some((name) => entry.name.endsWith(`/_next/static/${name}`)));
    expect(engine.length, 'the second route loaded every engine chunk').toBe(names.length);
    for (const entry of engine) {
      expect(entry.transferSize, `${entry.name} comes from the cache`).toBe(0);
      expect(entry.encodedBodySize).toBeGreaterThan(0);
    }
  });
});

test.describe('loading discipline', () => {
  for (const connected of connectedPages) {
    test(`${connected.route}/${connected.locale} preloads neither the engine nor the project illustrations`, async ({ page }) => {
      const names = engineChunkNames();
      await page.goto(appUrl(connected.pathname));
      const hints = await page.locator('link[rel="preload"], link[rel="modulepreload"], link[rel="prefetch"]').evaluateAll((links) =>
        links.map((link) => ({ rel: link.getAttribute('rel') ?? '', as: link.getAttribute('as') ?? '', href: link.getAttribute('href') ?? '' })),
      );
      expect(hints.filter((hint) => names.some((name) => hint.href.endsWith(name))), 'no hint names an engine chunk').toEqual([]);
      expect(hints.filter((hint) => /\/projects\//.test(hint.href)), 'no hint names a project illustration').toEqual([]);
    });
  }

  test('both project illustrations are lazy and each fetches exactly one responsive candidate', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (request) => {
      const match = request.url().match(/\/projects\/([a-z-]+)\/conceptual-[a-z-]+?(?:-\d+)?\.webp/);
      if (match) requested.push(match[1]);
    });
    await page.goto(appUrl(stableRoutes.projects.en));
    await page.waitForLoadState('load');
    await page.waitForTimeout(1_500);
    // Chrome's lazy-load margin can still fetch an image shortly below the fold; the rule is no preload and one candidate.
    const images = await page.locator('article img[srcset]').evaluateAll((list) => list.map((image) => ({ loading: image.getAttribute('loading'), candidates: (image.getAttribute('srcset') ?? '').split(',').length })));
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image.loading).toBe('lazy');
      expect(image.candidates, 'the responsive candidates are listed, not all fetched').toBeGreaterThan(1);
    }
    for (const slug of ['general-reservation-system', 'the-system']) {
      expect(requested.filter((item) => item === slug).length, `${slug}: one candidate`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('without JavaScript', () => {
  for (const connected of connectedPages) {
    test(`${connected.route}/${connected.locale} is complete server HTML with the static background`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
      const page = await context.newPage();
      await page.goto(appUrl(connected.pathname));
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.locator('[data-connected-poster]')).toBeAttached();
      await expect(page.locator('canvas')).toHaveCount(0);
      if (connected.route === 'projects') {
        await expect(page.locator('article#general-reservation-system')).toBeVisible();
        await expect(page.locator('article#the-system')).toBeVisible();
      }
      await context.close();
    });
  }
});
