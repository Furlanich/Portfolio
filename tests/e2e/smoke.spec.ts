import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const routeCases = [
  ['Spanish homepage', stableRoutes.home.es, 'es-AR'],
  ['English homepage', stableRoutes.home.en, 'en'],
  ['Spanish Services', stableRoutes.services.es, 'es-AR'],
  ['English Services', stableRoutes.services.en, 'en'],
  ['Spanish Projects', stableRoutes.projects.es, 'es-AR'],
  ['English Projects', stableRoutes.projects.en, 'en'],
  ['Spanish Studio', stableRoutes.studio.es, 'es-AR'],
  ['English Studio', stableRoutes.studio.en, 'en'],
  ['Spanish Founder', stableRoutes.founder.es, 'es-AR'],
  ['English Founder', stableRoutes.founder.en, 'en'],
] as const;

for (const [name, route, language] of routeCases) {
  test(`${name} loads with its document language and one visible H1`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const response = await page.goto(appUrl(route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    assertNoBrowserErrors();
  });
}

const homepageNarrativeCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.home.es,
    heading: 'Cuando el trabajo queda repartido entre herramientas',
    servicesHeading: 'Servicios para necesidades concretas',
    audience: 'Para pymes que coordinan pedidos, reservas o atención al cliente, o necesitan mejorar un sistema existente.',
    proofHeading: 'Una responsabilidad técnica clara',
    proofAction: 'Ver proyectos y sus límites',
    processHeading: 'Cómo trabajamos',
    founderHeading: 'Responsabilidad técnica directa',
    ctaHeading: '¿Tenés una necesidad concreta o un sistema que necesita atención?',
    demoStatement: 'Explorá las opciones de contacto y probá el formulario de demostración. No se envían consultas desde el formulario.',
    projectsPath: '/proyectos/',
  },
  {
    locale: 'English',
    route: stableRoutes.home.en,
    heading: 'When work is spread across tools',
    servicesHeading: 'Services for concrete business needs',
    audience: 'For small and medium-sized businesses managing orders, bookings or customer service, or improving an existing system.',
    proofHeading: 'Clear technical accountability',
    proofAction: 'Explore projects and their limitations',
    processHeading: 'How we work',
    founderHeading: 'Direct technical responsibility',
    ctaHeading: 'Do you have a concrete need or a system that needs attention?',
    demoStatement: 'Explore the contact options and try the demonstration form. The form does not send inquiries.',
    projectsPath: '/en/work/',
  },
] as const;

for (const narrativeCase of homepageNarrativeCases) {
  test(`${narrativeCase.locale} homepage presents the approved seven-section narrative`, async ({ page }) => {
    await page.goto(appUrl(narrativeCase.route));

    const main = page.getByRole('main');
    await expect(main.locator('section')).toHaveCount(7);
    await expect(main.locator('h2')).toHaveText([
      narrativeCase.heading,
      narrativeCase.servicesHeading,
      narrativeCase.proofHeading,
      narrativeCase.processHeading,
      narrativeCase.founderHeading,
      narrativeCase.ctaHeading,
    ]);
    await expect(main.getByText(narrativeCase.audience, { exact: true })).toBeVisible();
    await expect(main.getByRole('region', { name: narrativeCase.proofHeading }).getByRole('link', { name: narrativeCase.proofAction })).toHaveAttribute(
      'href',
      appPathname(narrativeCase.projectsPath),
    );
    await expect(main.getByText(narrativeCase.demoStatement, { exact: true })).toBeVisible();
    await expect(main.locator('img')).toHaveCount(0);
    await expect(main).not.toContainText('MPC Administración');
    await expect(main).not.toContainText('MPC Administration');
  });
}

test('language switching preserves equivalent homepage, Services, and Studio context', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  await page.getByRole('banner').locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.home.en));

  await page.goto(appUrl(stableRoutes.services.en));
  await page.getByRole('banner').locator('a[hreflang="es-AR"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.services.es));

  await page.goto(appUrl(stableRoutes.studio.es));
  await page.getByRole('banner').locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.studio.en));
});

test('visible Spanish primary-navigation destinations resolve without browser errors', async ({ page }) => {
  const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
  await page.goto(appUrl(stableRoutes.home.es));
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(navigation).toBeVisible();

  const hrefs = await navigation.getByRole('link').evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).href))],
  );
  expect(hrefs.length).toBeGreaterThanOrEqual(5);

  for (const href of hrefs) {
    const response = await page.goto(href);
    expect(response?.ok(), href).toBe(true);
    await expect(page.locator('main')).toHaveCount(1);
  }
  assertNoBrowserErrors();
});

test('language switching preserves Contact, Founder, and Projects context', async ({ page }) => {
  await page.goto(appUrl('/contacto/'));
  await page.getByRole('banner').locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname('/en/contact/'));

  await page.goto(appUrl(stableRoutes.founder.en));
  await page.getByRole('banner').locator('a[hreflang="es-AR"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.founder.es));

  await page.goto(appUrl(stableRoutes.projects.es));
  await page.getByRole('banner').locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.projects.en));
});
