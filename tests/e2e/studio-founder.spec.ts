import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
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
    professionalLabel: 'Enlaces profesionales',
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
    professionalLabel: 'Professional links',
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

    await page.locator(`a[hreflang="${studioCase.alternateLocale}"]`).click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(studioCase.alternateRoute));
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

  test(`${studioCase.locale} footer keeps Founder distinct beside professional links`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: studioCase.professionalLabel })).toBeVisible();
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
