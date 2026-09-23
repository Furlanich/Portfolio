import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const CHAPTERS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
const labels = {
  es: { route: stableRoutes.home.es, pause: 'Pausar movimiento', resume: 'Reanudar movimiento' },
  en: { route: stableRoutes.home.en, pause: 'Pause motion', resume: 'Resume motion' },
} as const;

const mode = (page: Page) => page.locator('[data-instrument]').getAttribute('data-immersive-mode');

async function expectActive(page: Page) {
  await expect.poll(() => mode(page), { timeout: 20_000 }).toBe('webgl');
  const canvas = page.locator('canvas[data-instrument-canvas]');
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
  const poster = page.locator('section[data-instrument-chapter="connection"] [data-instrument-artwork]');
  await poster.scrollIntoViewIfNeeded();
  expect(await poster.evaluate((element) => getComputedStyle(element).visibility)).toBe('visible');
}

async function centreChapter(page: Page, chapter: (typeof CHAPTERS)[number]) {
  await page.evaluate((id) => {
    const rect = document.querySelector(`section[data-instrument-chapter="${id}"]`)!.getBoundingClientRect();
    window.scrollBy(0, rect.top + rect.height / 2 - window.innerHeight / 2);
  }, chapter);
}

const rendered = (page: Page) => page.locator('[data-instrument-overlay]').getAttribute('data-rendered-chapter');

test.describe('enhanced instrument', () => {
  for (const locale of ['es', 'en'] as const) {
    for (const width of [1440, 1024, 768, 390, 320]) {
      test(`${locale} ${width} activates without overflow or covering chapter copy`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setViewportSize({ width, height: 900 });
        await page.goto(appUrl(labels[locale].route));
        await expectActive(page);
        await expect(page.getByRole('button', { name: labels[locale].pause })).toBeVisible();

        for (const chapter of CHAPTERS) {
          await centreChapter(page, chapter);
          await expect.poll(() => rendered(page)).toBe(chapter);
          const overlap = await page.evaluate((id) => {
            const overlay = document.querySelector('[data-instrument-overlay]')!.getBoundingClientRect();
            return [...document.querySelectorAll(`section[data-instrument-chapter="${id}"] h2, section[data-instrument-chapter="${id}"] h2 + p`)]
              .map((node) => node.getBoundingClientRect())
              .some((text) => !(text.right <= overlay.left || text.left >= overlay.right || text.bottom <= overlay.top || text.top >= overlay.bottom));
          }, chapter);
          expect(overlap, `${chapter} copy stays clear of the stage`).toBe(false);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        expect(errors).toEqual([]);
      });
    }
  }

  test('scrolling forward and back follows the same reversible chapters', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
      await centreChapter(page, chapter);
      await expect.poll(() => rendered(page)).toBe(chapter);
    }
  });

  test('Pause freezes the chapter and Resume recalculates from the document', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.en.route));
    await expectActive(page);
    await centreChapter(page, 'fragmentation');
    await expect.poll(() => rendered(page)).toBe('fragmentation');

    const pause = page.getByRole('button', { name: labels.en.pause });
    await pause.focus();
    await page.keyboard.press('Enter');
    const resume = page.getByRole('button', { name: labels.en.resume });
    await expect(resume).toBeFocused();
    await expect(resume).toHaveAttribute('data-state', 'paused');

    await centreChapter(page, 'coordination');
    await page.waitForTimeout(300);
    expect(await rendered(page)).toBe('fragmentation');

    await resume.click();
    await expect(page.getByRole('button', { name: labels.en.pause })).toHaveAttribute('data-state', 'playing');
    await expect.poll(() => rendered(page)).toBe('coordination');
  });

  test('resize keeps the active chapter instead of replaying the sequence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => rendered(page)).toBe('connection');

    await page.setViewportSize({ width: 390, height: 844 });
    await centreChapter(page, 'connection');
    await expect.poll(() => rendered(page)).toBe('connection');
    await expect(page.locator('canvas[data-instrument-canvas]')).toHaveCount(1);

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect.poll(() => rendered(page)).not.toBe('recognition');
  });
});

test.describe('static fallbacks', () => {
  test('reduced motion never initializes the canvas', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
    await expect(page.getByRole('button', { name: labels.es.pause })).toHaveCount(0);
    await context.close();
  });

  test('Save-Data keeps the static composition', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });
    });
    await page.goto(appUrl(labels.en.route));
    await expectStatic(page);
  });

  test('missing WebGL keeps the static composition', async ({ page }) => {
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
    const uncaught: string[] = [];
    page.on('pageerror', (error) => uncaught.push(error.message));
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
    expect(uncaught).toEqual([]);
  });

  test('a failed runtime import returns quietly to static', async ({ page }) => {
    const uncaught: string[] = [];
    page.on('pageerror', (error) => uncaught.push(error.message));
    await page.route('**/_next/static/chunks/**', async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      if (body.includes('webglcontextlost')) return route.abort();
      return route.fulfill({ response, body });
    });
    await page.goto(appUrl(labels.es.route));
    await expectStatic(page);
    expect(uncaught).toEqual([]);
  });

  test('context loss removes the canvas for the rest of the session', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(labels.es.route));
    await expectActive(page);
    await page.locator('canvas[data-instrument-canvas]').evaluate((canvas: HTMLCanvasElement) => {
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect.poll(() => mode(page)).toBe('static');
    await expect(page.locator('canvas')).toHaveCount(0);
    await centreChapter(page, 'coordination');
    await page.waitForTimeout(500);
    await expect(page.locator('canvas')).toHaveCount(0);

    await page.reload();
    await expectStatic(page);
  });

  test('no JavaScript keeps the complete static document', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(appUrl(labels.en.route));
    await expect(page.locator('section[data-instrument-chapter]')).toHaveCount(4);
    await expect(page.locator('canvas')).toHaveCount(0);
    await context.close();
  });
});
