import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const pages = [
  { name: 'services', route: stableRoutes.services.es },
  { name: 'projects', route: stableRoutes.projects.es },
  { name: 'project-detail', route: '/proyectos/general-reservation-system/' },
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
      await expect(page.locator('main')).toHaveScreenshot(`${name}-${viewport.name}.png`, { animations: 'disabled' });
    });
  }
}
