import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

// Task 7 acceptance matrix (PLAN-SKY-CHART-HOME-REDESIGN-V2 section 21). Scoped to the four RED
// items this task's packet lists: keyboard order past the chapters, the D-25 Pause visibility
// rule at rest and while receded, the D-27 compact hero label mask at scrollY 0, and axe with
// the enhancement active. The wider cross-viewport journey lives in Task 11's
// `sky-chart-acceptance.spec.ts`.

// Kept byte-identical to `immersive-home.spec.ts` (see the comment there): TypeScript's global
// augmentation merging requires every `declare global` for this property to agree exactly.
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
};

declare global {
  interface Window {
    __FURLANICH_SKY_CHART__?: SkyChartDebugHook;
  }
}

const locales = {
  es: { route: stableRoutes.home.es, pause: 'Pausar movimiento', resume: 'Reanudar movimiento' },
  en: { route: stableRoutes.home.en, pause: 'Pause motion', resume: 'Resume motion' },
} as const;

const mode = (page: Page) => page.locator('[data-instrument]').getAttribute('data-immersive-mode');

async function expectActive(page: Page) {
  await expect.poll(() => mode(page), { timeout: 20_000 }).toBe('webgl');
  await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(1);
}

for (const locale of ['es', 'en'] as const) {
  const copy = locales[locale];

  test(`${locale} keyboard reaches Pause once nothing in the chapters is focusable`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    // The Pause pill is only reachable once it is not `hidden` (D-25: hidden at scrollY 0), so
    // scroll to the first chapter first -- a real visitor tabs after having scrolled, not before.
    await page.evaluate(() => {
      const rect = document.querySelector('section[data-instrument-chapter]')!.getBoundingClientRect();
      window.scrollBy(0, rect.top);
    });
    await expect(page.locator('[data-pause-motion-pill]')).not.toHaveAttribute('hidden', '');

    // Tab from the hero's own last action; the chapters (D-12 atlas plates) contribute no
    // focusable element, so Pause must be the very next stop.
    const heroActions = page.getByRole('main').getByRole('link');
    const lastHeroAction = heroActions.last();
    await lastHeroAction.focus();
    await page.keyboard.press('Tab');
    const pause = page.getByRole('button', { name: copy.pause });
    await expect(pause).toBeFocused();
    const ring = await pause.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(ring, 'focus-visible outline').not.toBe('none');
  });

  test(`${locale} Pause pill is hidden at scrollY 0 and while fully receded (D-25)`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(appUrl(copy.route));
      await expectActive(page);
      await expect(page.locator('[data-pause-motion-pill]')).toHaveAttribute('hidden', '', { timeout: 5_000 });

      await page.locator('#services').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect.poll(() => page.locator('[data-instrument]').getAttribute('data-recede')).toBe('1');
      await expect(page.locator('[data-pause-motion-pill]')).toHaveAttribute('hidden', '');
    }
  });

  test(`${locale} at 390px the debug hook reports zero input-label opacity at scrollY 0 (D-27)`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);
    await expect.poll(() => page.evaluate(() => window.__FURLANICH_SKY_CHART__?.frame?.inputOpacity ?? -1)).toBe(0);
  });

  test(`${locale} enhanced Home passes axe with the runtime active`, async ({ page }) => {
    test.slow(); // axe over a live SwiftShader canvas
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  });
}
