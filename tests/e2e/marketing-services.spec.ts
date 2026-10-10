import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { backgroundOf, expectSequenceMarker, expectShortMonoOnly } from './support/editorial';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 6 owns this whole file (transferred from Task 3 after W2). The exact copy and the
// layout, hover and no-JavaScript behavior live in connected-studio-services.spec.ts; this file keeps
// the buyer-evaluation flow, the stable anchors and the editorial discipline running in every
// registered project, including the phone and tablet ones.

const serviceCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.services.es,
    contact: '/contacto/',
    heading: 'Software para que el trabajo avance.',
    catalogueLabel: 'Encontrá tu punto de partida',
    anchors: ['web', 'whatsapp', 'consultoria'],
    headlines: ['Una interfaz clara para el negocio.', 'Las herramientas dejan de trabajar aisladas.', 'Un sistema que puede seguir evolucionando.'],
    families: ['Sitios y aplicaciones web', 'Integraciones y automatización', 'Mejora de software existente'],
    rowHeadings: ['Qué recibís', 'Situaciones habituales', 'Punto de partida', 'Alcance acordado', 'Límites del servicio', 'Evidencia'],
    boundariesAnchor: 'condiciones',
    principlesHeading: 'Alcance claro. Entregas revisables.',
    shared: ['Acuerdo de trabajo', 'Límites comerciales', 'IA solo cuando aporta valor'],
    serviceAction: 'Contanos qué necesitás resolver',
    finalHeading: 'Contanos qué necesitás resolver',
    finalAction: 'Iniciar una consulta',
    evidenceLink: 'Examinar el prototipo de reservas',
    evidenceIndex: stableRoutes.projects.es,
  },
  {
    locale: 'English',
    route: stableRoutes.services.en,
    contact: '/en/contact/',
    heading: 'Software that moves work forward.',
    catalogueLabel: 'Find your starting point',
    anchors: ['web', 'whatsapp', 'consulting'],
    headlines: ['A clear interface for the business.', 'Tools stop working in isolation.', 'A system that can keep evolving.'],
    families: ['Websites and web applications', 'Integrations and automation', 'Improve existing software'],
    rowHeadings: ['What you receive', 'Common situations', 'Starting point', 'Agreed scope', 'Service boundaries', 'Evidence'],
    boundariesAnchor: 'working-boundaries',
    principlesHeading: 'Clear scope. Reviewable delivery.',
    shared: ['Working agreement', 'Commercial boundaries', 'AI only where it adds value'],
    serviceAction: 'Tell us what you need to solve',
    finalHeading: 'Tell us what you need to solve',
    finalAction: 'Start an enquiry',
    evidenceLink: 'Examine the reservation prototype',
    evidenceIndex: stableRoutes.projects.en,
  },
] as const;

for (const serviceCase of serviceCases) {
  test(serviceCase.locale + ' Services presents the buyer-evaluation flow', async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(serviceCase.route));

    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1, name: serviceCase.heading, exact: true })).toBeVisible();
    await expect(main.getByRole('navigation', { name: serviceCase.catalogueLabel, exact: true })).toBeVisible();

    for (const [index, sectionId] of serviceCase.anchors.entries()) {
      const section = main.locator('section#' + sectionId);
      await expect(section).toBeVisible();
      await expect(section.getByText(serviceCase.families[index], { exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 2, name: serviceCase.headlines[index], exact: true })).toBeVisible();
      for (const rowHeading of serviceCase.rowHeadings) {
        await expect(section.getByRole('heading', { level: 3, name: rowHeading, exact: true })).toBeVisible();
      }
      await expect(section.getByRole('link', { name: serviceCase.serviceAction, exact: true })).toHaveAttribute(
        'href',
        appPathname(serviceCase.contact),
      );
    }

    for (const heading of serviceCase.shared) {
      await expect(main.getByRole('heading', { level: 3, name: heading, exact: true })).toBeVisible();
    }
    await expect(main.locator('#' + serviceCase.boundariesAnchor)).toBeVisible();

    await expect(main.getByRole('link', { name: serviceCase.evidenceLink, exact: true })).toHaveAttribute(
      'href',
      appPathname(serviceCase.evidenceIndex) + '#general-reservation-system',
    );
    await expect(main.getByRole('link', { name: serviceCase.finalAction, exact: true })).toHaveAttribute(
      'href',
      appPathname(serviceCase.contact),
    );
    await expect(main).not.toContainText(/mismo día hábil|same business day|same-day response/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    assertNoBrowserErrors();
  });

  test(serviceCase.locale + ' Services catalogue keeps stable anchors', async ({ page }) => {
    await page.goto(appUrl(serviceCase.route));
    const links = page.getByRole('navigation', { name: serviceCase.catalogueLabel, exact: true }).getByRole('link');

    // Count first: iterating an empty list would pass without checking a single anchor.
    await expect(links).toHaveCount(3);
    for (const [index, link] of (await links.all()).entries()) {
      await expect(link).toHaveAttribute('href', appPathname(serviceCase.route) + '#' + serviceCase.anchors[index]);
      await expect(link).toContainText(serviceCase.families[index]);
    }
  });

  test(serviceCase.locale + ' Services keeps the editorial order, short mono metadata and opaque plates', async ({ page }) => {
    await page.goto(appUrl(serviceCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h2')).toHaveText([
      ...serviceCase.headlines,
      serviceCase.principlesHeading,
      serviceCase.finalHeading,
    ]);

    for (const [index, sectionId] of serviceCase.anchors.entries()) {
      await expectSequenceMarker(main.locator('section#' + sectionId), String(index + 1).padStart(2, '0'));
    }

    const mono = await expectShortMonoOnly(main);
    expect(mono).toEqual(expect.arrayContaining(['01', '02', '03']));

    // No translucent plate: every reading surface is a fully opaque color, so no scene path shows through copy.
    for (const sectionId of [...serviceCase.anchors, serviceCase.boundariesAnchor, 'cta']) {
      expect(await backgroundOf(main.locator('section#' + sectionId)), sectionId).toMatch(/^rgb\(/);
    }
  });
}
