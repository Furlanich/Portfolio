import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

async function hideDevelopmentIndicator(page: Page) {
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

// Capture the actual viewport: the connected ground is fixed to it, so an element screenshot of the
// complete long page would tile the viewport background and introduce a false color seam.
test('Spanish Privacy wide reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl(stableRoutes.privacy.es));
  await hideDevelopmentIndicator(page);
  await expect(page).toHaveScreenshot('privacy-es-wide.png');
});

test('Spanish Privacy compact reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.privacy.es));
  await hideDevelopmentIndicator(page);
  await expect(page).toHaveScreenshot('privacy-es-compact.png');
});

test('English Privacy wide reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl(stableRoutes.privacy.en));
  await hideDevelopmentIndicator(page);
  await expect(page).toHaveScreenshot('privacy-en-wide.png');
});

test('English Privacy compact reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.privacy.en));
  await hideDevelopmentIndicator(page);
  await expect(page).toHaveScreenshot('privacy-en-compact.png');
});

for (const [language, route] of [['es', stableRoutes.terms.es], ['en', stableRoutes.terms.en]] as const) {
  for (const [name, viewport] of [['wide', { width: 1440, height: 1000 }], ['compact', { width: 390, height: 844 }]] as const) {
    test((language === 'es' ? 'Spanish' : 'English') + ' Terms ' + name + ' reading surface', async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(appUrl(route));
      await hideDevelopmentIndicator(page);
      await expect(page).toHaveScreenshot('terms-' + language + '-' + name + '.png');
    });
  }
}
