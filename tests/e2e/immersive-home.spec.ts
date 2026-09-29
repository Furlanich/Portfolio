import { expect, test, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import {
  CHAPTERS,
  allowSoftwareRenderer,
  centreChapter,
  debugHook,
  expectActive,
  instrumentMode,
  recedeValue,
  renderedChapter,
} from './support/sky-chart';

// Sky Chart runtime (PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 7). The DOM contract this file reads
// is produced by Task 8's static composition: root `[data-instrument]`, four
// `section[data-instrument-chapter]` elements and their `[data-instrument-chapters]` container.
// This runtime sets the root's `data-immersive-mode`, `data-rendered-chapter` and `data-recede`,
// and creates the canvas with `data-sky-chart-canvas`, portaled to `document.body`.
//
// B1 (PR #83 review, amended ADR 2026-09-28): SwiftShader is a software renderer and now fails
// the capability gate on its own. Every test below that expects `webgl` mode sets the
// explicit test-only override before navigating; the "software renderer gate" tests exercise
// the un-overridden behaviour directly.

// Playwright's page-video recorder plus SwiftShader compositing the canvas can hang a full-page
// navigation ("until load" never fires) when two such pages navigate at once: reproduced on Windows
// with the config's `video: 'retain-on-failure'`, gone with video off, and serial runs are
// unaffected. `use({ video })` must be top-level, so the whole file records screenshots and traces
// (on first retry) but no video.
test.use({ video: 'off' });

const labels = {
  es: { route: stableRoutes.home.es, other: stableRoutes.home.en, pause: 'Pausar movimiento', resume: 'Reanudar movimiento', switchLabel: 'Ver sitio en inglés' },
  en: { route: stableRoutes.home.en, other: stableRoutes.home.es, pause: 'Pause motion', resume: 'Resume motion', switchLabel: 'View site in Spanish' },
} as const;

const mode = instrumentMode;
const recede = recedeValue;
// Polling budget for eased values: SwiftShader frames are 100-180 ms and parallel workers share
// the CPU, so a fixed 5 s default flakes under load (plan W2 follow-up 3). Thresholds unchanged.
const EASE = { timeout: 20_000 } as const;

async function expectStatic(page: Page) {
  await page.waitForLoadState('load');
  await page.waitForTimeout(1_500);
  expect(await mode(page)).toBe('static');
  await expect(page.locator('canvas')).toHaveCount(0);
}

test.describe('Sky Chart runtime', () => {
  test.beforeEach(async ({ page }) => {
    await allowSoftwareRenderer(page);
  });

  for (const locale of ['es', 'en'] as const) {
    test(`${locale} activates a portaled canvas in webgl mode`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(appUrl(labels[locale].route));
      await expectActive(page);

      // The canvas is a child of <body>, not of the immersive root's own subtree.
      const parentTag = await page.locator('canvas[data-sky-chart-canvas]').evaluate((el) => el.parentElement?.parentElement?.tagName);
      expect(parentTag).toBe('BODY');
    });
  }

  test('the debug hook reports twenty node labels in the locale text at >=1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await expect.poll(async () => (await debugHook(page))?.labelCount, EASE).toBe(20);
    const hook = await debugHook(page);
    expect(hook?.labels).toContain('Orders');
    expect(hook?.labels).toContain('Hand over');
  });

  test('the debug hook reports Spanish node labels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await expect.poll(async () => (await debugHook(page))?.labelCount, EASE).toBe(20);
    const hook = await debugHook(page);
    expect(hook?.labels).toContain('Pedidos');
    expect(hook?.labels).toContain('Entregar');
  });

  // N7: the plan's performance gates (draw calls <=28, label textures <=20 of <=1024x64, DPR
  // caps) are asserted directly through the debug hook the runtime already exposes.
  test('N7: draw calls stay within budget, textures are <=1024x64, and DPR matches the quality cap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await expect.poll(async () => (await debugHook(page))?.labelCount, EASE).toBe(20);
    const hook = await debugHook(page);
    expect(hook?.drawCalls, 'draw calls: 1 graticule + 1 stars + 1 links + <=20 sprites + margin').toBeLessThanOrEqual(28);
    expect(hook?.labelTextureSizes).toHaveLength(20);
    for (const [width, height] of hook?.labelTextureSizes ?? []) {
      expect(width).toBeLessThanOrEqual(1024);
      expect(height).toBeLessThanOrEqual(64);
    }
    expect(hook?.pixelRatio).toBeLessThanOrEqual(1.5);
  });

  test('scrolling forward and back gives the expected rendered chapter and reverses', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
      await centreChapter(page, chapter);
      await expect.poll(() => renderedChapter(page), EASE).toBe(chapter);
    }
  });

  test('the frame counter stops increasing once scrolling settles (demand rendering)', async ({ page }) => {
    test.slow(); // CI's software SwiftShader renderer can take several seconds to damp to a stop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page), EASE).toBe('fragmentation');

    // The T-06 damped ease (`t += (target - t) * 0.12`, snaps below |delta| 0.0005) takes a real,
    // variable number of frames to converge. From a fresh centre (delta ~0.3) that is ~50 frames,
    // which under CI's ~117ms SwiftShader frame interval is ~6s -- longer than a fixed window can
    // reliably cover. Poll until two renderCount reads 1.5s apart agree (a generous 20s budget),
    // then re-confirm the count stays put for one further 1.5s window. An idle loop that never
    // stops still fails: the poll times out because no two consecutive reads ever match.
    let previousCount: number | null = null;
    await expect
      .poll(
        async () => {
          const current = (await debugHook(page))?.renderCount ?? null;
          const stable = previousCount !== null && current === previousCount;
          previousCount = current;
          return stable;
        },
        { timeout: 20_000, intervals: [1_500] },
      )
      .toBe(true);

    const first = (await debugHook(page))?.renderCount ?? -1;
    await page.waitForTimeout(1_500);
    const second = (await debugHook(page))?.renderCount ?? -2;
    expect(second, 'no idle loop: the render count must not grow once settled').toBe(first);
  });

  test('recede reaches 1 and rendering stops while a later section is in view', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect.poll(() => recede(page), EASE).toBe('1');
    const before = (await debugHook(page))?.renderCount ?? -1;
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);
    const after = (await debugHook(page))?.renderCount ?? -2;
    expect(after, 'fully receded: further scroll renders zero new frames').toBe(before);
  });

  test('Pause freezes the frame and Resume recalculates from the document', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page), EASE).toBe('fragmentation');

    const pause = page.getByRole('button', { name: labels.en.pause });
    await pause.focus();
    await page.keyboard.press('Enter');
    const resume = page.getByRole('button', { name: labels.en.resume });
    await expect(resume).toBeFocused();
    await expect(resume).toHaveAttribute('data-state', 'paused');
    await expect(resume).toHaveAttribute('aria-pressed', 'true');

    await centreChapter(page, 'coordination');
    await page.waitForTimeout(300);
    expect(await renderedChapter(page)).toBe('fragmentation');

    await resume.click();
    await expect(page.getByRole('button', { name: labels.en.pause })).toHaveAttribute('data-state', 'playing');
    await expect.poll(() => renderedChapter(page), EASE).toBe('coordination');
  });

  // B3: while paused, recede and Pause visibility must keep tracking scroll -- only the camera
  // target freezes. Paused at Services (fully receded) must show recede=1 and low opacity;
  // paused at the top must keep the pill hidden over the hero.
  test('B3: while paused, recede and the pill visibility keep updating with scroll', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page), EASE).toBe('fragmentation');

    const pause = page.getByRole('button', { name: labels.en.pause });
    await pause.click();
    // The button's accessible name swaps to "Resume motion" the instant it renders paused, so
    // the `pause` locator (bound to the old name) no longer resolves to it afterward.
    const resume = page.getByRole('button', { name: labels.en.resume });
    await expect(resume).toHaveAttribute('data-state', 'paused');

    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect.poll(() => recede(page), EASE).toBe('1');
    // The scrim's opacity animates through an inline CSS transition, so a single read at a fixed
    // delay can land mid-transition (observed 0.883 and 0.650, both well above the 0.3 gate).
    // Poll the computed value instead of reading it once; the < 0.3 threshold is unchanged.
    await expect
      .poll(() => page.locator('[data-environment-scrim]').evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeLessThan(0.3);
    await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();

    // The camera itself must not have moved: rendered chapter stays at the frozen fragmentation.
    expect(await renderedChapter(page)).toBe('fragmentation');
  });

  test('resize keeps the active chapter instead of replaying the sequence', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page), EASE).toBe('connection');

    await page.setViewportSize({ width: 390, height: 844 });
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page), EASE).toBe('connection');
    await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(1);
  });

  // N6: language-switch reactivation, restored from the pre-rewrite acceptance matrix.
  test.describe('language switch', () => {
    for (const locale of ['es', 'en'] as const) {
      const copy = labels[locale];
      test(`${locale} language switch reactivates cleanly with no console error or failed asset`, async ({ page }) => {
        test.slow(); // N2: reactivation recreates the WebGL context; a slow environment needs the room
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        const failedAssets: string[] = [];
        page.on('response', (response) => {
          if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`);
        });
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(appUrl(copy.route));
        await expectActive(page);
        // Start waiting before the click: under parallel load the navigation can commit (or be
        // superseded) before a wait registered afterwards runs, which surfaced as net::ERR_ABORTED.
        await Promise.all([
          page.waitForURL(`**${appPathname(copy.other)}`),
          page.getByRole('banner').getByRole('link', { name: copy.switchLabel }).click(),
        ]);
        await expectActive(page);
        await expect(page.locator('canvas')).toHaveCount(1);

        expect(failedAssets, 'missing or failed assets').toEqual([]);
        assertNoBrowserErrors();
      });
    }
  });

  // N6: the optional Connection film stays withdrawn (ADR-SKY-CHART-HOMEPAGE-RUNTIME); no
  // video element or media request anywhere on the activated page.
  test('no video element or media request appears anywhere on the activated page', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    const media: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'media' || /\.(mp4|webm|mov)(\?|$)/.test(request.url())) media.push(request.url());
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page), EASE).toBe('connection');
    await expect(page.locator('video')).toHaveCount(0);
    expect(media).toEqual([]);
  });
});

test.describe('static fallbacks', () => {
  test('reduced motion never initializes the canvas', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await allowSoftwareRenderer(page);
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
    await expect(page.getByRole('button', { name: labels.es.pause })).toHaveCount(0);
    await context.close();
  });

  test('Save-Data keeps the static composition', async ({ page }) => {
    await allowSoftwareRenderer(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });
    });
    await page.goto(appUrl(labels.en.route));
    await expectStatic(page);
  });

  test('missing WebGL keeps the static composition', async ({ page }) => {
    await allowSoftwareRenderer(page);
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (type === 'webgl2' || type === 'webgl') return null;
        return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
  });

  test('a renderer that fails after the capability probe returns quietly to static', async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await allowSoftwareRenderer(page);
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      let probes = 0;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (type === 'webgl2' && ++probes > 1) return null;
        return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });
    await page.goto(appUrl(labels.en.route));
    await expectStatic(page);
    assertNoBrowserErrors();
  });

  test('a failed runtime import returns quietly to static', async ({ page }) => {
    // Deliberately aborting the chunk request below makes the browser itself log a network-level
    // "Failed to load resource" console entry -- that is an expected side effect of this test's
    // own setup, not something the runtime's error handling could suppress. The real assertion
    // is that the failure never escapes as an *uncaught exception*.
    const uncaught: string[] = [];
    page.on('pageerror', (error) => uncaught.push(error.message));
    await allowSoftwareRenderer(page);
    await page.route('**/_next/static/chunks/**', async (route) => {
      try {
        const response = await route.fetch();
        const body = await response.text();
        if (body.includes('webglcontextlost')) return await route.abort();
        return await route.fulfill({ response, body });
      } catch {
        // A request still in flight when the page or test closes is disposed by Playwright.
        return route.abort().catch(() => undefined);
      }
    });
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
    expect(uncaught).toEqual([]);
  });

  test('forced context loss removes the canvas for the rest of the session, with no console error', async ({ page }) => {
    test.slow(); // load-sensitive: software rendering shares the CPU with parallel workers
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await allowSoftwareRenderer(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await page.locator('canvas[data-sky-chart-canvas]').evaluate((canvas: HTMLCanvasElement) => {
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect.poll(() => mode(page)).toBe('static');
    await expect(page.locator('canvas')).toHaveCount(0);

    await page.reload();
    await expectStatic(page);
    assertNoBrowserErrors();
  });

  test('no JavaScript keeps the complete static document', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(appUrl(labels.en.route));
    await expect(page.locator('section[data-instrument-chapter]')).toHaveCount(4);
    await expect(page.locator('canvas')).toHaveCount(0);
    await context.close();
  });

  // B1 (amended ADR 2026-09-28): SwiftShader is a software renderer. Without the test-only
  // override it fails the capability gate like every other gate, quietly; with the override it
  // activates as normal. This is the direct evidence for the gate itself, separate from every
  // other test above which sets the override to keep testing the runtime's own behaviour.
  test.describe('software renderer gate', () => {
    test('under SwiftShader, without the override, Home stays static with no console error', async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await page.goto(appUrl(labels.es.route));
      await expectStatic(page);
      assertNoBrowserErrors();
    });

    test('under SwiftShader, with the override, Home activates', async ({ page }) => {
      await allowSoftwareRenderer(page);
      await page.goto(appUrl(labels.es.route));
      await expectActive(page);
    });
  });
});

test.describe('lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await allowSoftwareRenderer(page);
  });

  test('client navigation away and back leaves one canvas and disposes exactly once each way', async ({ page }) => {
    test.slow(); // reactivation recreates the WebGL context; a slow environment needs the room
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(stableRoutes.home.en));
    await expectActive(page);
    const firstDisposeCount = (await debugHook(page))?.disposeCount ?? -1;

    await page.getByRole('main').getByRole('link', { name: 'Explore services', exact: true }).first().click();
    await page.waitForURL('**/en/services/**');
    await expect(page.locator('canvas')).toHaveCount(0);

    await page.goBack();
    // Root-caused via scripts/measure-immersive-production.mjs's identical remount cycle: the
    // scroll position the browser restores on `goBack()` is not guaranteed to leave
    // `[data-instrument]` near the viewport (observed scrollY up to ~4900px with the root fully
    // outside the viewport), and the T-04 near-viewport gate then correctly, quietly stays
    // static -- not a runtime bug. Scrolling to the top guarantees the precondition the gate
    // requires; `expectActive`'s wider budget is kept as a smaller safety margin on top.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expectActive(page, 40_000);
    await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(1);
    const laterDisposeCount = (await debugHook(page))?.disposeCount ?? -2;
    expect(laterDisposeCount).toBeGreaterThan(firstDisposeCount);
  });
});
