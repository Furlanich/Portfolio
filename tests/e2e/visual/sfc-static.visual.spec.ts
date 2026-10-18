import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

// PLAN-SFC-V1 Task 14: the matched static posters of Studio, Founder and Contact as the Ground paints them. Both
// live tiers are off in every merged build, so this is also the paused, reduced-motion and no-JavaScript look. One
// capture per page and size: the poster layer alone, cropped as the Ground crops it at that viewport (no text, no
// plates). The first screen over the poster is already each page owner's visual baseline (studio, founder and
// contact visual specs), so it is not duplicated here. Never alter a baseline to shrink a difference.

const pages = [
  { name: 'studio', route: stableRoutes.studio.es },
  { name: 'founder', route: stableRoutes.founder.es },
  { name: 'contact', route: stableRoutes.contact.es },
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
  }
}
