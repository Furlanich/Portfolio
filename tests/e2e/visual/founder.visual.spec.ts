import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

test('Founder wide visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.founder.es));
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await expect(page.locator('main')).toHaveScreenshot('founder-wide.png', { animations: 'disabled' });
});

test('Founder compact visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.founder.es));
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await expect(page.locator('main')).toHaveScreenshot('founder-compact.png', { animations: 'disabled' });
});