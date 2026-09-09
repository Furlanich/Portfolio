import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const founderVisualCases = [
  { locale: 'Spanish', route: stableRoutes.founder.es, prefix: 'founder-spanish' },
  { locale: 'English', route: stableRoutes.founder.en, prefix: 'founder-english' },
] as const;

for (const founderCase of founderVisualCases) {
  test(`${founderCase.locale} Founder wide visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(founderCase.route));
    await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator('main')).toHaveScreenshot(`${founderCase.prefix}-wide.png`, { animations: 'disabled' });
  });

  test(`${founderCase.locale} Founder compact visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(founderCase.route));
    await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator('main')).toHaveScreenshot(`${founderCase.prefix}-compact.png`, { animations: 'disabled' });
  });
}