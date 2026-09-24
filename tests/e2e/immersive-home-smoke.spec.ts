import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

// Cross-engine smoke: whichever mode the engine reaches, the semantic Sky Chart composition
// stays whole and activation or fallback produces no browser errors.
for (const route of [stableRoutes.home.es, stableRoutes.home.en]) {
  test(`Sky Chart activates or falls back cleanly on ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(appUrl(route));
    await page.waitForLoadState('load');
    await page.waitForTimeout(2_000);

    const mode = await page.locator('[data-instrument]').getAttribute('data-immersive-mode');
    expect(['static', 'webgl']).toContain(mode);
    await expect(page.locator('section[data-instrument-chapter]')).toHaveCount(4);
    await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(mode === 'webgl' ? 1 : 0);
    expect(errors).toEqual([]);
  });
}
