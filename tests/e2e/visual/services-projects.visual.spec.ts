import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const pages = [
  { name: 'services', route: stableRoutes.services.es },
  { name: 'projects', route: stableRoutes.projects.es },
] as const;

const viewports = [
  { name: 'wide', width: 1440, height: 900 },
  { name: 'compact', width: 390, height: 844 },
] as const;

for (const { name, route } of pages) {
  for (const viewport of viewports) {
    test(`Spanish ${name} ${viewport.name} visual baseline`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(appUrl(route));
      await page.evaluate(() => document.fonts.ready);
      await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
      // PLAN-SPF-V1 Task 3: the connected ground is viewport-fixed, so a tall element capture would contain
      // whichever slice sits behind each plate. Hiding the layer leaves the same Abyss html background and
      // makes the plates the whole subject; the Ground has its own assertions. A no-op where no ground exists.
      await page.addStyleTag({ content: '[data-connected-ground]{display:none !important}' });
      await expect(page.locator('main')).toHaveScreenshot(`${name}-${viewport.name}.png`, { animations: 'disabled' });
    });
  }
}
