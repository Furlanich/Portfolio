import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const termsCases = [
  {
    route: stableRoutes.terms.es,
    language: 'es-AR',
    title: 'Términos y condiciones',
    pageTitle: 'Términos y condiciones | FURLANICH',
    contents: 'Contenido',
    updateLabel: 'Última actualización',
    updatedAt: '18 de octubre de 2026',
    headings: ['Responsable y alcance', 'Información del sitio', 'Consultas y contratación', 'Uso responsable', 'Materiales y licencias', 'Enlaces y disponibilidad', 'Privacidad y cambios'],
    reciprocal: { name: 'Ver la política de privacidad', route: stableRoutes.privacy.es },
    footerName: 'Términos y condiciones',
  },
  {
    route: stableRoutes.terms.en,
    language: 'en',
    title: 'Terms and Conditions',
    pageTitle: 'Terms and Conditions | FURLANICH',
    contents: 'Contents',
    updateLabel: 'Last updated',
    updatedAt: 'October 18, 2026',
    headings: ['Responsible party and scope', 'Website information', 'Inquiries and engagements', 'Responsible use', 'Materials and licenses', 'Links and availability', 'Privacy and changes'],
    reciprocal: { name: 'Read the Privacy Policy', route: stableRoutes.privacy.en },
    footerName: 'Terms and Conditions',
  },
] as const;

const cases = [
  { route: stableRoutes.privacy.es, contents: 'Contenido', headings: ["Responsable y contacto","Contacto directo","Alojamiento y datos técnicos","Preferencias de navegación","Información que compartís","Mensajes y solicitudes sobre tus datos"] },
  { route: stableRoutes.privacy.en, contents: 'Contents', headings: ["Responsible party and contact","Direct contact","Hosting and technical data","Browsing preferences","Information you share","Messages and requests about your information"] },
  ...termsCases.map(({ route, contents, headings }) => ({ route, contents, headings })),
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
  test('legal reading surface has unique ordered sections for ' + pageCase.route, async ({ page }) => {
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

test('legal reading pages use the shared connected background and one opaque plate', async ({ page }) => {
  for (const pageCase of cases) {
    await page.goto(appUrl(pageCase.route));
    await expect(page.locator('[data-connected-ground]')).toHaveCount(1);
    await expect(page.locator('main [data-connected-opaque-plate]')).toHaveCount(1);
  }
});

test('legal reading surface reflows without horizontal overflow', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.privacy.es));
  for (const width of [320, 390, 768, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth, 'horizontal overflow at ' + width + 'px').toBeLessThanOrEqual(dimensions.width);
  }
});

test('legal titles stay inside the reading surface at 200% text size and 320px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 } });

  try {
    for (const pageCase of cases) {
      const page = await context.newPage();
      await page.goto(appUrl(pageCase.route));
      await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });

      const title = page.locator('main h1');
      const bounds = await title.evaluate((heading) => {
        const range = document.createRange();
        range.selectNodeContents(heading);
        const headingBounds = heading.getBoundingClientRect();

        return {
          clientWidth: heading.clientWidth,
          scrollWidth: heading.scrollWidth,
          lines: Array.from(range.getClientRects()).map((rect) => ({
            left: rect.left - headingBounds.left,
            right: rect.right - headingBounds.left,
          })),
        };
      });

      expect(bounds.scrollWidth, pageCase.route + ' title scroll width').toBeLessThanOrEqual(bounds.clientWidth);
      expect(bounds.lines.length, pageCase.route + ' title line boxes').toBeGreaterThan(0);
      for (const [index, line] of bounds.lines.entries()) {
        expect(line.left, pageCase.route + ' title line ' + index + ' left edge').toBeGreaterThanOrEqual(-0.5);
        expect(line.right, pageCase.route + ' title line ' + index + ' right edge').toBeLessThanOrEqual(bounds.clientWidth + 0.5);
      }
    }
  } finally {
    await context.close();
  }
});

for (const termsCase of termsCases) {
  test('Terms ' + termsCase.language + ' is published with one H1, its update date and the canonical sections', async ({ page }) => {
    const response = await page.goto(appUrl(termsCase.route));
    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', termsCase.language);
    await expect(page).toHaveTitle(termsCase.pageTitle);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1:visible')).toHaveText(termsCase.title);
    await expect(page.locator('main dt')).toHaveText(termsCase.updateLabel);
    await expect(page.locator('main dd')).toHaveText(termsCase.updatedAt);
    for (const heading of termsCase.headings) await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    await expect(page.locator('form, input, textarea, button[type="submit"]')).toHaveCount(0);
  });

  test('Terms ' + termsCase.language + ' is complete without JavaScript and links back to Privacy', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    try {
      const page = await context.newPage();
      await page.goto(appUrl(termsCase.route));
      await expect(page.getByRole('navigation', { name: termsCase.contents })).toBeVisible();
      for (const heading of termsCase.headings) await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
      const reciprocal = page.getByRole('main').getByRole('link', { name: termsCase.reciprocal.name });
      await expect(reciprocal).toHaveAttribute('href', appPathname(termsCase.reciprocal.route));
      await Promise.all([page.waitForURL((url) => url.pathname === appPathname(termsCase.reciprocal.route)), reciprocal.click()]);
    } finally {
      await context.close();
    }
  });

  test('Terms ' + termsCase.language + ' is reachable from the Footer and switches language to its pair', async ({ page }) => {
    await page.goto(appUrl(termsCase.route.startsWith('/en/') ? stableRoutes.home.en : stableRoutes.home.es));
    const footerLink = page.getByRole('contentinfo').getByRole('link', { name: termsCase.footerName, exact: true });
    await expect(footerLink).toHaveAttribute('href', appPathname(termsCase.route));
    await Promise.all([page.waitForURL((url) => url.pathname === appPathname(termsCase.route)), footerLink.click()]);
    const other = termsCase.language === 'en' ? stableRoutes.terms.es : stableRoutes.terms.en;
    const hreflang = termsCase.language === 'en' ? 'es-AR' : 'en';
    await Promise.all([page.waitForURL((url) => url.pathname === appPathname(other)), page.getByRole('banner').locator('a[hreflang="' + hreflang + '"]').click()]);
  });
}

for (const privacyRoute of [stableRoutes.privacy.es, stableRoutes.privacy.en]) {
  test('Privacy ' + privacyRoute + ' shows its update date and links to its Terms pair', async ({ page }) => {
    const english = privacyRoute.startsWith('/en/');
    const pair = termsCases[english ? 1 : 0];
    await page.goto(appUrl(privacyRoute));
    await expect(page.locator('main dt')).toHaveText(pair.updateLabel);
    await expect(page.locator('main dd')).toHaveText(pair.updatedAt);
    const link = page.getByRole('main').getByRole('link', { name: english ? 'Read the Terms and Conditions' : 'Ver los términos y condiciones' });
    await expect(link).toHaveAttribute('href', appPathname(pair.route));
  });
}

test('Privacy has no serious or critical axe violations', async ({ page }) => {
  for (const route of [stableRoutes.privacy.es, stableRoutes.privacy.en]) {
    await page.goto(appUrl(route));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  }
});
