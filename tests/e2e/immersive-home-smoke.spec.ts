import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

declare global {
  interface Window {
    __SKY_CHART_ALLOW_SOFTWARE_RENDERER__?: boolean;
  }
}

// Cross-engine smoke: whichever mode the engine reaches, the semantic Sky Chart composition
// stays whole and activation or fallback produces no browser errors.
//
// N1: the review found this reading `data-immersive-mode` once after a fixed 2s wait, while
// activation was sometimes still in flight (webkit passed 1 of 5 runs). Poll until the mode
// attribute and the canvas count agree with each other instead of trusting a fixed delay.
const modeAndCanvasAgree = async (page: Page) => {
  const mode = await page.locator('[data-instrument]').getAttribute('data-immersive-mode');
  if (mode !== 'static' && mode !== 'webgl') return null;
  const canvases = await page.locator('canvas').count();
  const expectedCanvases = mode === 'webgl' ? 1 : 0;
  if (canvases !== expectedCanvases) return null;
  return mode;
};

for (const route of [stableRoutes.home.es, stableRoutes.home.en]) {
  test(`Sky Chart activates or falls back cleanly on ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
    });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(appUrl(route));
    await page.waitForLoadState('load');

    let settledMode: string | null = null;
    await expect
      .poll(async () => {
        settledMode = await modeAndCanvasAgree(page);
        return settledMode;
      }, { timeout: 20_000 })
      .not.toBeNull();
    expect(['static', 'webgl']).toContain(settledMode);
    await expect(page.locator('section[data-instrument-chapter] h2')).toHaveCount(4);
    expect(errors).toEqual([]);
  });
}
