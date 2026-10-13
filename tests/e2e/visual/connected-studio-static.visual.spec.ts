import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

// PLAN-SPF-V1 Task 8: the matched static posters as the pages paint them. Both live tiers are off in every
// merged build, so this is also the paused, reduced-motion and no-JavaScript look: the visual-chromium
// project runs with reduced motion, and one case runs with JavaScript off. Two captures per page and size:
//   - `ground`: the poster layer alone, cropped as the Ground crops it at that viewport (no text);
//   - `top`: the first screen as a static visitor sees it, hero text over the poster.
// Never alter a baseline to shrink a difference: label and caption text stays in the page.

const pages = [
  { name: 'services', route: stableRoutes.services.es },
  { name: 'projects', route: stableRoutes.projects.es },
] as const;

const viewports = [
  { name: 'wide', width: 1440, height: 900 },
  { name: 'compact', width: 390, height: 844 },
] as const;

async function prepare(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(appUrl(route));
  await page.evaluate(() => document.fonts.ready);
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  // The poster is a CSS background: wait until it has actually decoded before the capture.
  await page.waitForFunction(async () => {
    const poster = document.querySelector('[data-connected-poster]');
    const url = poster && /url\("([^"]+)"\)/.exec(getComputedStyle(poster).backgroundImage)?.[1];
    if (!url) return false;
    const image = new Image();
    image.src = url;
    await image.decode().catch(() => undefined);
    return image.naturalWidth > 0;
  });
}

for (const { name, route } of pages) {
  for (const viewport of viewports) {
    test(`Spanish ${name} ${viewport.name} poster ground visual baseline`, async ({ page }) => {
      await prepare(page, route, viewport);
      // Hide everything but the Ground without changing layout, so the poster's own crop is the whole subject.
      await page.addStyleTag({
        content:
          'body *:not([data-connected-ground]):not([data-connected-ground] *) { visibility: hidden !important; }' +
          '[data-connected-ground], [data-connected-ground] * { visibility: visible !important; }',
      });
      await expect(page).toHaveScreenshot(`${name}-${viewport.name}-ground.png`, { animations: 'disabled' });
    });

    test(`Spanish ${name} ${viewport.name} first screen over the poster visual baseline`, async ({ page }) => {
      await prepare(page, route, viewport);
      await expect(page).toHaveScreenshot(`${name}-${viewport.name}-top.png`, { animations: 'disabled' });
    });
  }
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('Spanish services wide first screen keeps its poster before any enhancement visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(stableRoutes.services.es));
    await page.waitForLoadState('load');
    await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    // No script can decode for us, so give the CSS background a moment to paint.
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot('services-wide-top-no-js.png', { animations: 'disabled' });
  });
});
