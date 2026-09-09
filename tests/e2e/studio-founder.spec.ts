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

const founderCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.founder.es,
    alternateLocale: 'en',
    alternateRoute: stableRoutes.founder.en,
    professionalHeading: 'Perfil profesional',
    experienceHeading: 'Experiencia profesional',
    educationHeading: 'Formación',
    capabilitiesHeading: 'Sistemas que podemos construir',
    projectsHeading: 'Trabajo y evidencia técnica',
    finalHeading: '¿Querés conversar sobre una necesidad de tu negocio?',
    cvLabel: 'Descargar CV',
    projectsLabel: 'Ver proyectos seleccionados',
    contactLabel: 'Iniciar una consulta',
    contactRoute: '/contacto/',
    projectsRoute: '/proyectos/',
  },
  {
    locale: 'English',
    route: stableRoutes.founder.en,
    alternateLocale: 'es-AR',
    alternateRoute: stableRoutes.founder.es,
    professionalHeading: 'Professional profile',
    experienceHeading: 'Professional experience',
    educationHeading: 'Education',
    capabilitiesHeading: 'Systems we can engineer',
    projectsHeading: 'Work and technical evidence',
    finalHeading: 'Want to discuss a business need?',
    cvLabel: 'Download CV',
    projectsLabel: 'View selected work',
    contactLabel: 'Start an enquiry',
    contactRoute: '/en/contact/',
    projectsRoute: '/en/work/',
  },
] as const;

for (const founderCase of founderCases) {
  test(founderCase.locale + ' Founder renders the approved hierarchy and links', async ({ page }) => {
    const response = await page.goto(appUrl(founderCase.route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    for (const heading of [
      founderCase.professionalHeading,
      founderCase.experienceHeading,
      founderCase.educationHeading,
      founderCase.capabilitiesHeading,
      founderCase.projectsHeading,
      founderCase.finalHeading,
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    await expect(page.getByRole('main').getByRole('link', { name: founderCase.projectsLabel })).toHaveAttribute(
      'href',
      appPathname(founderCase.projectsRoute),
    );
    await expect(page.getByRole('main').getByRole('link', { name: founderCase.contactLabel })).toHaveAttribute(
      'href',
      appPathname(founderCase.contactRoute),
    );
    await expect(page.getByRole('main').getByRole('link', { name: founderCase.cvLabel })).toHaveAttribute(
      'href',
      appPathname('/Samuel-Furlanich-CV.pdf').replace(/\/$/, ''),
    );
    await expect(page.getByRole('main').getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/samuel-furlanich/',
    );
    await expect(page.getByRole('main').getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Furlanich',
    );
  });

  test(founderCase.locale + ' Founder preserves language switching and professional keyboard order', async ({ page }) => {
    await page.goto(appUrl(founderCase.route));

    const profile = page.getByRole('region', { name: founderCase.professionalHeading });
    const actions = profile.getByRole('link');
    await expect(actions).toHaveCount(3);
    await actions.nth(0).focus();
    await expect(actions.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(actions.nth(1)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(actions.nth(2)).toBeFocused();

    await page.locator('a[hreflang="' + founderCase.alternateLocale + '"]').click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(founderCase.alternateRoute));
  });

  test(founderCase.locale + ' Founder keeps periods attached to their experience entries on compact layout', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(founderCase.route));

    const entries = page.getByRole('region', { name: founderCase.experienceHeading }).getByRole('listitem');
    await expect(entries).toHaveCount(2);
    for (const entry of await entries.all()) {
      const period = entry.locator('[data-founder-period]');
      const role = entry.getByRole('heading', { level: 3 });
      const periodBox = await period.boundingBox();
      const roleBox = await role.boundingBox();
      expect(periodBox).not.toBeNull();
      expect(roleBox).not.toBeNull();
      expect(roleBox!.y).toBeGreaterThanOrEqual(periodBox!.y);
    }
  });
}
const integrationCases = [
  {
    locale: 'Spanish',
    contactRoute: '/contacto/',
    contactActionLabels: ['Escribir por WhatsApp', 'Enviar un correo', 'Llamar'],
    founderLabel: 'Conocer a Samuel',
    founderRoute: stableRoutes.founder.es,
    projectRoutes: {
      'general-reservation-system': '/proyectos/general-reservation-system/',
      'the-system': '/proyectos/the-system/',
      'mpc-administracion': '/proyectos/mpc-administracion/',
    },
  },
  {
    locale: 'English',
    contactRoute: '/en/contact/',
    contactActionLabels: ['Write on WhatsApp', 'Send an email', 'Call'],
    founderLabel: 'Meet Samuel',
    founderRoute: stableRoutes.founder.en,
    projectRoutes: {
      'general-reservation-system': '/en/work/general-reservation-system/',
      'the-system': '/en/work/the-system/',
      'mpc-administracion': '/en/work/mpc-administracion/',
    },
  },
] as const;

for (const integrationCase of integrationCases) {
  test(`${integrationCase.locale} Contact exposes Founder context after direct contact choices`, async ({ page }) => {
    await page.goto(appUrl(integrationCase.contactRoute));

    const main = page.getByRole('main');
    const founderLink = main.getByRole('link', { name: integrationCase.founderLabel });
    await expect(founderLink).toHaveAttribute('href', appPathname(integrationCase.founderRoute));

    const linkOrder = await main.getByRole('link').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).textContent?.trim()),
    );
    expect(linkOrder.slice(-1)[0]).toBe(integrationCase.founderLabel);
    expect(linkOrder.slice(0, 3)).toEqual(integrationCase.contactActionLabels);
  });

  test(`${integrationCase.locale} project details expose Founder context only when evidence authorizes it`, async ({ page }) => {
    for (const slug of ['general-reservation-system', 'the-system'] as const) {
      await page.goto(appUrl(integrationCase.projectRoutes[slug]));
      await expect(page.getByRole('main').getByRole('link', { name: integrationCase.founderLabel })).toHaveAttribute(
        'href',
        appPathname(integrationCase.founderRoute),
      );
    }

    await page.goto(appUrl(integrationCase.projectRoutes['mpc-administracion']));
    await expect(page.getByRole('main').getByRole('link', { name: integrationCase.founderLabel })).toHaveCount(0);
  });
}
