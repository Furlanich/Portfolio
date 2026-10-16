import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const cases = [
  { route: stableRoutes.privacy.es, contents: 'Contenido', headings: ['Qué ocurre con los datos del formulario', 'Alojamiento y datos técnicos', 'Alternativas externas', 'Información sensible', 'Conservación y consultas', 'Activación comercial futura'] },
  { route: stableRoutes.privacy.en, contents: 'Contents', headings: ['What happens to form data', 'Hosting and technical data', 'External alternatives', 'Sensitive information', 'Retention and questions', 'Future commercial activation'] },
];

test('Privacy is complete and navigable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(appUrl(stableRoutes.privacy.es));
    await expect(page.getByRole('navigation', { name: 'Contenido' })).toBeVisible();
    for (const heading of cases[0].headings) await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver la declaración de privacidad de GitHub' })).toBeVisible();
  } finally {
    await context.close();
  }
});

for (const pageCase of cases) {
  test('legal reading surface has unique ordered sections for ' + pageCase.contents, async ({ page }) => {
    await page.goto(appUrl(pageCase.route));
    const contents = page.getByRole('navigation', { name: pageCase.contents });
    await expect(contents.getByRole('listitem')).toHaveCount(pageCase.headings.length);
    const ids = await page.locator('main article > section').evaluateAll((sections) => sections.map((section) => section.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const [index, heading] of pageCase.headings.entries()) {
      const link = contents.getByRole('link', { name: heading });
      await expect(link).toHaveAttribute('href', '#' + ids[index]);
      await expect(page.locator('#' + ids[index] + ' h2')).toHaveText(heading);
    }
    await contents.getByRole('link').first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp('#' + ids[0] + '$'));
    await expect(page.locator('#' + ids[0] + ' h2')).toBeVisible();
  });
}

test('legal reading surface reflows without horizontal overflow', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.privacy.es));
  for (const width of [320, 390, 768, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth, 'horizontal overflow at ' + width + 'px').toBeLessThanOrEqual(dimensions.width);
  }
});

test('Terms routes remain unpublished', async ({ page }) => {
  for (const route of ['/terminos/', '/en/terms/']) {
    const response = await page.goto(appUrl(route));
    expect(response?.status()).toBe(404);
  }
});

test('Privacy has no serious or critical axe violations', async ({ page }) => {
  for (const route of [stableRoutes.privacy.es, stableRoutes.privacy.en]) {
    await page.goto(appUrl(route));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  }
});
