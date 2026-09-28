import { expect, test, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { observeUnexpectedBrowserErrors } from './support/console-errors';

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

const CHAPTERS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
const labels = {
  es: { route: stableRoutes.home.es, other: stableRoutes.home.en, pause: 'Pausar movimiento', resume: 'Reanudar movimiento', switchLabel: 'Ver sitio en inglés' },
  en: { route: stableRoutes.home.en, other: stableRoutes.home.es, pause: 'Pause motion', resume: 'Resume motion', switchLabel: 'View site in Spanish' },
} as const;

// Kept byte-identical across every spec file that reads this hook: TypeScript's global
// augmentation merging requires every `declare global` for the same property to agree on its
// exact type, and `tests/e2e/support/**` (where a single shared declaration would otherwise
// live) is Task 11's owned path, not Task 7's.
type SkyChartDebugFrame = {
  yaw: number;
  pitch: number;
  groupOpacity: Record<string, number>;
  linkFraction: number;
  inputOpacity: number;
  visibleTiers: readonly number[];
  heroMask: number;
};

type SkyChartDebugHook = {
  frame: SkyChartDebugFrame | null;
  labelCount: number;
  labels: readonly string[];
  disposeCount: number;
  renderCount: number;
  drawCalls: number;
  pixelRatio: number;
  labelTextureSizes: readonly [number, number][];
  labelOpacities: Record<string, number>;
};

declare global {
  interface Window {
    __FURLANICH_SKY_CHART__?: SkyChartDebugHook;
    __SKY_CHART_ALLOW_SOFTWARE_RENDERER__?: boolean;
  }
}

async function allowSoftwareRenderer(page: Page) {
  await page.addInitScript(() => {
    window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
  });
}

const mode = (page: Page) => page.locator('[data-instrument]').getAttribute('data-immersive-mode');
const renderedChapter = (page: Page) => page.locator('[data-instrument]').getAttribute('data-rendered-chapter');
const recede = (page: Page) => page.locator('[data-instrument]').getAttribute('data-recede');
const debugHook = (page: Page) => page.evaluate(() => window.__FURLANICH_SKY_CHART__ ?? null);

async function expectActive(page: Page, timeout = 20_000) {
  await expect.poll(() => mode(page), { timeout }).toBe('webgl');
  const canvas = page.locator('canvas[data-sky-chart-canvas]');
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await expect(canvas).toHaveAttribute('tabindex', '-1');
  expect(await canvas.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe('none');
}

async function expectStatic(page: Page) {
  await page.waitForLoadState('load');
  await page.waitForTimeout(1_500);
  expect(await mode(page)).toBe('static');
  await expect(page.locator('canvas')).toHaveCount(0);
}

async function centreChapter(page: Page, chapter: (typeof CHAPTERS)[number]) {
  await page.evaluate((id) => {
    const rect = document.querySelector(`section[data-instrument-chapter="${id}"]`)!.getBoundingClientRect();
    window.scrollBy(0, rect.top + rect.height / 2 - window.innerHeight / 2);
  }, chapter);
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
    await expect.poll(async () => (await debugHook(page))?.labelCount).toBe(20);
    const hook = await debugHook(page);
    expect(hook?.labels).toContain('Orders');
    expect(hook?.labels).toContain('Hand over');
  });

  test('the debug hook reports Spanish node labels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await expect.poll(async () => (await debugHook(page))?.labelCount).toBe(20);
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
    await expect.poll(async () => (await debugHook(page))?.labelCount).toBe(20);
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
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
      await centreChapter(page, chapter);
      await expect.poll(() => renderedChapter(page)).toBe(chapter);
    }
  });

  test('the frame counter stops increasing once scrolling settles (demand rendering)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page)).toBe('fragmentation');
    // The T-06 damped ease takes a real, variable number of frames to converge -- observed up
    // to ~2.5s under this environment's software SwiftShader renderer, with occasional
    // multi-hundred-ms scheduling stalls that a short equality-poll could mistake for settling.
    // 4s comfortably covers the observed worst case before "first" is read at all.
    await page.waitForTimeout(4_000);
    const first = (await debugHook(page))?.renderCount ?? -1;
    await page.waitForTimeout(1_500);
    const second = (await debugHook(page))?.renderCount ?? -2;
    expect(second, 'no idle loop: the render count must not grow once settled').toBe(first);
  });

  test('recede reaches 1 and rendering stops while a later section is in view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect.poll(() => recede(page)).toBe('1');
    const before = (await debugHook(page))?.renderCount ?? -1;
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);
    const after = (await debugHook(page))?.renderCount ?? -2;
    expect(after, 'fully receded: further scroll renders zero new frames').toBe(before);
  });

  test('Pause freezes the frame and Resume recalculates from the document', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page)).toBe('fragmentation');

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
    await expect.poll(() => renderedChapter(page)).toBe('coordination');
  });

  // B3: while paused, recede and Pause visibility must keep tracking scroll -- only the camera
  // target freezes. Paused at Services (fully receded) must show recede=1 and low opacity;
  // paused at the top must keep the pill hidden over the hero.
  test('B3: while paused, recede and the pill visibility keep updating with scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => renderedChapter(page)).toBe('fragmentation');

    const pause = page.getByRole('button', { name: labels.en.pause });
    await pause.click();
    await expect(pause).toHaveAttribute('data-state', 'paused');

    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect.poll(() => recede(page)).toBe('1');
    const scrimOpacity = await page.locator('[data-environment-scrim]').evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(scrimOpacity)).toBeLessThan(0.3);
    await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();

    // The camera itself must not have moved: rendered chapter stays at the frozen fragmentation.
    expect(await renderedChapter(page)).toBe('fragmentation');
  });

  test('resize keeps the active chapter instead of replaying the sequence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page)).toBe('connection');

    await page.setViewportSize({ width: 390, height: 844 });
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page)).toBe('connection');
    await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(1);
  });

  // N6: language-switch reactivation, restored from the pre-rewrite acceptance matrix.
  for (const locale of ['es', 'en'] as const) {
    const copy = labels[locale];
    test(`${locale} language switch reactivates cleanly with no console error or failed asset`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      const failedAssets: string[] = [];
      page.on('response', (response) => {
        if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`);
      });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(appUrl(copy.route));
      await expectActive(page);

      await page.getByRole('banner').getByRole('link', { name: copy.switchLabel }).click();
      await page.waitForURL(`**${appPathname(copy.other)}`);
      await expectActive(page);
      await expect(page.locator('canvas')).toHaveCount(1);

      expect(failedAssets, 'missing or failed assets').toEqual([]);
      assertNoBrowserErrors();
    });
  }

  // N6: the optional Connection film stays withdrawn (ADR-SKY-CHART-HOMEPAGE-RUNTIME); no
  // video element or media request anywhere on the activated page.
  test('no video element or media request appears anywhere on the activated page', async ({ page }) => {
    const media: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'media' || /\.(mp4|webm|mov)(\?|$)/.test(request.url())) media.push(request.url());
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => renderedChapter(page)).toBe('connection');
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
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await allowSoftwareRenderer(page);
    await page.route('**/_next/static/chunks/**', async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      if (body.includes('webglcontextlost')) return route.abort();
      return route.fulfill({ response, body });
    });
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
    assertNoBrowserErrors();
  });

  test('forced context loss removes the canvas for the rest of the session, with no console error', async ({ page }) => {
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
