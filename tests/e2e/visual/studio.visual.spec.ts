import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

test('Studio wide visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.studio.es));
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await expect(page.locator('main')).toHaveScreenshot('studio-wide.png', { animations: 'disabled' });
});

test('Studio compact visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.studio.es));
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await expect(page.locator('main')).toHaveScreenshot('studio-compact.png', { animations: 'disabled' });
});
