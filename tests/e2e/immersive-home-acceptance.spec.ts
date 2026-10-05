import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';
import { allowSoftwareRenderer, expectActive } from './support/sky-chart';

// Task 7 acceptance matrix (PLAN-SKY-CHART-HOME-REDESIGN-V2 section 21). Scoped to the four RED
// items this task's packet lists: keyboard order past the chapters, the D-25 Pause visibility
// rule at rest and while receded, the D-27 compact hero label mask at scrollY 0, and axe with
// the enhancement active. The wider cross-viewport journey lives in Task 11's
// `sky-chart-acceptance.spec.ts`.
//
// B1 (PR #83 review, amended ADR 2026-09-28): every test here expects webgl activation under
// SwiftShader, so the whole file sets the explicit test-only software-renderer override.

const locales = {
  es: { route: stableRoutes.home.es, pause: 'Pausar movimiento', resume: 'Reanudar movimiento' },
  en: { route: stableRoutes.home.en, pause: 'Pause motion', resume: 'Resume motion' },
} as const;

const EASE = { timeout: 20_000 } as const;

test.beforeEach(async ({ page }) => {
  await allowSoftwareRenderer(page);
});

for (const locale of ['es', 'en'] as const) {
  const copy = locales[locale];

  test(`${locale} keyboard reaches Pause once nothing in the chapters is focusable`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    // The Pause pill is only reachable once it is not hidden (D-25: hidden at scrollY 0), so
    // scroll to the first chapter first -- a real visitor tabs after having scrolled, not before.
    await page.evaluate(() => {
      const rect = document.querySelector('section[data-instrument-chapter]')!.getBoundingClientRect();
      // `html` has `scroll-behavior: smooth`; an instant jump keeps the position deterministic.
      window.scrollBy({ top: rect.top, behavior: 'instant' });
    });
    await expect(page.locator('[data-pause-motion-pill]')).toBeVisible({ timeout: 10_000 });

    // Tab from the hero's own last action, scoped to the hero section itself (D-11): the rest
    // of Home has its own actions further down the page, so an unscoped "last link in main"
    // would land on one of those instead of the hero's. The chapters (D-12 atlas plates)
    // contribute no focusable element, so Pause must be the very next stop after the hero.
    const heroActions = page.locator('section[aria-labelledby="home-heading"]').getByRole('link');
    const lastHeroAction = heroActions.last();
    // Focus without scrolling: a plain focus() scrolls the hero back into view, which (D-25)
    // re-hides the pill and makes the next Tab race the runtime's visibility update. A
    // visitor who scrolled to the chapters and then presses Tab never jumps back up first.
    await lastHeroAction.evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
    await expect(page.locator('[data-pause-motion-pill]')).toBeVisible();
    await page.keyboard.press('Tab');
    const pause = page.getByRole('button', { name: copy.pause });
    await expect(pause).toBeFocused();
    const ring = await pause.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(ring, 'focus-visible outline').not.toBe('none');
  });

  // B2: `hidden` must actually hide the pill (Tailwind's `.flex{display:flex}` must not win
  // over preflight's `[hidden]{display:none}`), and a hidden pill must not be keyboard
  // reachable -- both assert real rendered state (toBeHidden/toBeVisible), not the attribute.
  test(`${locale} Pause pill is hidden and keyboard-unreachable at scrollY 0, and hidden again while fully receded (D-25/B2)`, async ({ page }) => {
    test.slow(); // two page loads and two activations
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(appUrl(copy.route));
      await expectActive(page);
      await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();

      // B2: at scrollY 0 the pill must not be in the keyboard tab order or visibly covering
      // the hero (at 390 this specifically covers the trust row when the bug is present).
      await page.keyboard.press('Tab'); // brand
      await page.keyboard.press('Tab'); // language switch
      await page.keyboard.press('Tab'); // primary hero action
      await page.keyboard.press('Tab'); // secondary hero action
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-pause-motion'));
      expect(focused, 'Pause must not be reachable while its pill is hidden').not.toBe('true');

      await page.locator('#services').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect.poll(() => page.locator('[data-instrument]').getAttribute('data-recede'), EASE).toBe('1');
      await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();
    }
  });

  test(`${locale} at 390px the debug hook reports zero input-label opacity at scrollY 0 (D-27)`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);
    await expect.poll(() => page.evaluate(() => window.__FURLANICH_SKY_CHART__?.frame?.inputOpacity ?? -1), EASE).toBe(0);
  });

  // N14: at >=768px, tier-2 labels whose projected position falls over the hero's text column
  // fade to 0 while the hero is in view. The reference itself places Messages against the
  // trust row at 1440, so this is the concrete case to check through the debug hook.
  test(`${locale} at 1440px the Messages label fades to 0 while it projects over the hero text (N14)`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);
    // At the very top of the page (t=0), the "inputs" tier-2 labels reveal near-immediately
    // (group reveal g=0) and the hero fills the viewport -- the reference itself places
    // Messages against the trust row here, so this is the concrete case N14 fixes.
    await expect.poll(async () => (await page.evaluate(() => window.__FURLANICH_SKY_CHART__?.labelOpacities?.messages)) ?? -1, EASE).toBe(0);
  });

  test(`${locale} enhanced Home passes axe with the runtime active, playing and paused`, async ({ page }) => {
    test.slow(); // axe over a live SwiftShader canvas, twice
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    // N6: restored from the pre-rewrite acceptance matrix -- axe must pass in both states, not
    // only while playing, since the Pause pill's aria-pressed/label swap changes the tree.
    for (const state of ['playing', 'paused'] as const) {
      if (state === 'paused') {
        await page.evaluate(() => {
          const rect = document.querySelector('section[data-instrument-chapter]')!.getBoundingClientRect();
          window.scrollBy(0, rect.top);
        });
        await page.getByRole('button', { name: copy.pause }).click();
      }
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'), state).toEqual([]);
    }
  });
}
