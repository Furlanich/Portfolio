import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import {
  enableLiveForTest,
  expectLive,
  expectStatic,
  expectStopped,
  gotoConnected,
  pauseLabels,
  pauseSlot,
  readConnected,
  type ConnectedLocale,
} from './support/connected-studio';
import type { ConnectedRoute } from '../../lib/connected-studio/types';

// PLAN-SPF-V1 Task 7: accessibility of the connected routes with the optional scene absent and
// present. Automated axe results are not a conformance claim; the manual checks (screen-reader
// reading order, real zoom, touch) are the owner's under OD-4 and stay OPEN in the receipt.

const pages: readonly { route: ConnectedRoute; locale: ConnectedLocale }[] = [
  { route: 'services', locale: 'es' },
  { route: 'services', locale: 'en' },
  { route: 'projects', locale: 'es' },
  { route: 'projects', locale: 'en' },
];

async function blockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
}

// The live cases need a software WebGL backend. The flag is file-wide (Playwright forbids it per group);
// the static cases never enable the live policy, so it changes nothing for them.
test.use({ launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } });

test.describe('static background', () => {
  // The page hydrates on a CPU that software-rendered live cases in the other worker are using; the default 30 s
  // was not always enough for that, and these cases wait for the hydrated page before asserting that nothing started.
  test.describe.configure({ timeout: 60_000 });

  for (const { route, locale } of pages) {
    test(`${route} ${locale} has no critical or serious axe violations and no live control`, async ({ page }) => {
      await gotoConnected(page, route, locale);
      await expectStatic(page, route);
      expect(await blockingViolations(page)).toEqual([]);
      await expect(page.locator('main h1:visible')).toHaveCount(1);
    });
  }
});

test.describe('live background (controlled test evidence on SwiftShader)', () => {
  // Software rendering shares the CPU with axe, so each live case is slow (about a minute when alone).
  test.describe.configure({ timeout: 150_000 });

  // Leave the page first: tearing a browser context down around a running software-rendered scene can stall
  // under load, while unmounting the scene releases its context at once.
  test.afterEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  // Two representative pages: the locale strings are covered by the static matrix, and every live case is expensive.
  for (const { route, locale } of [pages[0], pages[3]]) {
    test(`${route} ${locale} has no critical or serious axe violations with the scene running`, async ({ page }) => {
      await enableLiveForTest(page);
      await gotoConnected(page, route, locale);
      await expectLive(page);
      const pause = pauseSlot(page, route).getByRole('button', { name: pauseLabels[locale].pause });
      await expect(pause).toBeVisible();
      expect(await blockingViolations(page)).toEqual([]);
      // The canvas is decorative: hidden from the accessibility tree, unfocusable and pointer-inert.
      await expect(page.locator('canvas[data-connected-canvas]')).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('[data-connected-ground]')).toHaveAttribute('aria-hidden', 'true');
    });
  }

  test('the Pause control is reachable and operable by keyboard, with a visible focus ring', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectLive(page);
    const pause = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.pause });
    await pause.focus();
    await expect(pause).toBeFocused();
    const outline = await pause.evaluate((element) => {
      const style = getComputedStyle(element);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(3);

    await page.keyboard.press('Enter');
    const resume = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.resume });
    await expect(resume).toHaveAttribute('aria-pressed', 'true');
    await expect(resume).toBeFocused();
    await expectStopped(page);
    await page.keyboard.press('Space');
    await expect(pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.pause })).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('live');
  });
});

test.describe('motion preferences', () => {
  async function hoveredScale(page: Page) {
    const figure = page.locator('main figure').first();
    await figure.scrollIntoViewIfNeeded();
    const image = figure.locator('img');
    await figure.hover();
    await page.waitForTimeout(500);
    return image.evaluate((element) => {
      const { transform } = getComputedStyle(element);
      return transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).a;
    });
  }

  test('with motion allowed the artwork zoom stays within its 1.018 ceiling', async ({ page }) => {
    await gotoConnected(page, 'projects', 'en');
    test.skip(!(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)), 'Hover is fine-pointer only');
    const scale = await hoveredScale(page);
    expect(scale).toBeGreaterThan(1);
    expect(scale).toBeLessThanOrEqual(1.018 + 1e-6);
  });

  test('reduced motion removes the artwork zoom and every hover movement', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'es');
    test.skip(!(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)), 'Hover is fine-pointer only');
    expect(await hoveredScale(page)).toBe(1);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('forced colors fetch no engine and leave the system-colored page complete', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectStatic(page, 'services');
    await expect(page.locator('[data-connected-ground]')).toBeHidden();
    await expect(page.locator('main h1:visible')).toHaveCount(1);
  });
});
