import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { expectSequenceMarker, expectShortMonoOnly } from './support/editorial';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const studioCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    heading: 'Software a medida con responsabilidad técnica directa.',
    alternateLocale: 'en',
    alternateRoute: stableRoutes.studio.en,
    contactLabel: 'Contanos qué necesitás resolver',
    finalContactLabel: 'Iniciar una consulta',
    contactRoute: '/contacto/',
    founderLabel: 'Conocer a Samuel',
    founderRoute: stableRoutes.founder.es,
    navigationLabel: 'Navegación principal',
    studioLabel: 'El estudio',
    menuLabel: 'Abrir navegación principal',
    accountabilityLabel: 'Responsabilidad directa',
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    heading: 'Custom software with direct technical accountability.',
    alternateLocale: 'es-AR',
    alternateRoute: stableRoutes.studio.es,
    contactLabel: 'Tell us what you need to solve',
    finalContactLabel: 'Start an enquiry',
    contactRoute: '/en/contact/',
    founderLabel: 'Meet Samuel',
    founderRoute: stableRoutes.founder.en,
    navigationLabel: 'Primary navigation',
    studioLabel: 'About',
    menuLabel: 'Open primary navigation',
    accountabilityLabel: 'Direct accountability',
  },
] as const;

for (const studioCase of studioCases) {
  test(`${studioCase.locale} Studio renders its approved heading and equivalent actions`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const response = await page.goto(appUrl(studioCase.route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: studioCase.heading })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: studioCase.contactLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.contactRoute),
    );
    await expect(page.getByRole('main').getByRole('link', { name: studioCase.finalContactLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.contactRoute),
    );
    const founderActions = page.getByRole('main').getByRole('link', { name: studioCase.founderLabel });
    await expect(founderActions).toHaveCount(2);
    for (const founderAction of await founderActions.all()) {
      await expect(founderAction).toHaveAttribute('href', appPathname(studioCase.founderRoute));
    }

    await Promise.all([
      page.waitForURL((url) => url.pathname === appPathname(studioCase.alternateRoute)),
      page.getByRole('banner').locator(`a[hreflang="${studioCase.alternateLocale}"]`).click(),
    ]);
    assertNoBrowserErrors();
  });

  test(`${studioCase.locale} primary navigation targets Studio on desktop and compact layouts`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const navigation = page.getByRole('navigation', { name: studioCase.navigationLabel });
    await expect(navigation.getByRole('link', { name: studioCase.studioLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.route),
    );

    await page.setViewportSize({ width: 320, height: 800 });
    const menu = page.locator(`summary[aria-label="${studioCase.menuLabel}"]`);
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link', { name: studioCase.studioLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.route),
    );
  });

  test(`${studioCase.locale} footer keeps Founder distinct beside the professional profiles under direct accountability`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: studioCase.accountabilityLabel })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Samuel Furlanich' })).toHaveAttribute(
      'href',
      appPathname(studioCase.founderRoute),
    );
    for (const professionalLink of ['LinkedIn', 'GitHub']) {
      const link = footer.getByRole('link', { name: professionalLink });
      await expect(link).toBeVisible();
      await expect(link).not.toHaveAttribute('target', '_blank');
    }
  });
}

const studioEditorialCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    headings: [
      'Modelo de trabajo',
      'Dirección técnica de principio a fin',
      'Principios para trabajar con claridad',
      'Base en Buenos Aires, disponibilidad nacional e internacional',
      'La persona detrás de la dirección técnica',
      'Conversemos sobre lo que hoy frena a tu negocio',
    ],
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    headings: [
      'Operating model',
      'Technical direction from start to finish',
      'Principles for clear delivery',
      'Based in Buenos Aires, available nationally and internationally',
      'The person behind the technical direction',
      "Let's talk about what's holding your business back",
    ],
  },
] as const;

for (const studioCase of studioEditorialCases) {
  test(`${studioCase.locale} Studio keeps its order and numbers its editorial sections`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h2')).toHaveText([...studioCase.headings]);
    const numbered = ['studio-accountability-heading', 'studio-principles-heading', 'studio-location-heading', 'studio-founder-heading'];
    for (const [index, headingId] of numbered.entries()) {
      await expectSequenceMarker(main.locator(`section[aria-labelledby="${headingId}"]`), String(index + 1).padStart(2, '0'));
    }
    await expectShortMonoOnly(main);
  });
}
