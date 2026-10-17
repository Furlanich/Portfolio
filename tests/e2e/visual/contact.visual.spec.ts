import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const routes = [
  { locale: 'Spanish', route: stableRoutes.contact.es, prefix: 'contact-es' },
  { locale: 'English', route: stableRoutes.contact.en, prefix: 'contact-en' },
] as const;

async function prepare(page: Page) {
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

for (const contact of routes) {
  test(`${contact.locale} Contact wide visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(appUrl(contact.route));
    await prepare(page);
    await expect(page).toHaveScreenshot(`${contact.prefix}-wide.png`, { animations: 'disabled' });
  });

  test(`${contact.locale} Contact compact visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(contact.route));
    await prepare(page);
    await expect(page).toHaveScreenshot(`${contact.prefix}-compact.png`, { animations: 'disabled' });
  });
}
