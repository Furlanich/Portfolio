import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const routes = [
  { locale: 'Spanish', route: stableRoutes.founder.es, prefix: 'founder-spanish' },
  { locale: 'English', route: stableRoutes.founder.en, prefix: 'founder-english' },
] as const;

for (const founder of routes) {
  test(`${founder.locale} Founder wide visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(founder.route));
    await page.evaluate(() => document.fonts.ready);
    await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator('main')).toHaveScreenshot(`${founder.prefix}-wide.png`, {
      animations: 'disabled',
    });
  });

  test(`${founder.locale} Founder compact visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(founder.route));
    await page.evaluate(() => document.fonts.ready);
    await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator('main')).toHaveScreenshot(`${founder.prefix}-compact.png`, {
      animations: 'disabled',
    });
  });
}
