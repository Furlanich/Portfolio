import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { IDENTITY_TINT, backgroundOf, expectSequenceMarker, expectShortMonoOnly } from './support/editorial';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const serviceCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.services.es,
    heading: 'Software para tu negocio',
    indexLabel: 'Ir a un servicio',
    serviceHeadings: ['Sitios y aplicaciones web', 'WhatsApp e integraciones', 'Mejoras para sistemas existentes'],
    workHeading: 'Tipos de trabajo',
    startingHeading: 'Punto de partida',
    fitHeading: 'Buen encaje',
    boundariesHeading: 'Límites del servicio',
    evidenceHeading: 'Evidencia disponible',
    principlesAnchor: 'condiciones',
    principles: ['Acuerdo de trabajo', 'Límites comerciales', 'IA solo cuando aporta valor'],
    principlesHeading: 'Qué podés esperar de cualquier servicio',
    indexLabels: ['Sitios y aplicaciones web', 'WhatsApp e integraciones', 'Mantenimiento y consultoría'],
    finalHeading: 'Contanos qué necesitás resolver',
    work: [
      'Sitio o catálogo: presentar la oferta.',
      'Pedidos o reservas: organizar solicitudes e integrar proveedores cuando sea viable.',
      'Portal o aplicación: dar acceso y gestionar un proceso específico.',
      'Un enlace abre una conversación.',
      'Un flujo automatizado organiza pasos.',
      'Un bot ayuda con respuestas definidas.',
      'Una integración conecta sistemas cuando la plataforma y los proveedores lo permiten.',
      'Diagnóstico y corrección de fallas.',
      'Actualizaciones e integraciones.',
      'Revisión de rendimiento y plan de modernización.',
    ],
    contactLabel: 'Ver contacto',
    finalAction: 'Iniciar una consulta',
    evidenceLink: 'Ver el proyecto y sus límites',
    evidencePath: '/proyectos/general-reservation-system/',
  },
  {
    locale: 'English',
    route: stableRoutes.services.en,
    heading: 'Software for your business',
    indexLabel: 'Jump to a service',
    serviceHeadings: ['Websites and web applications', 'WhatsApp and integrations', 'Improvements to existing systems'],
    workHeading: 'Ways of working',
    startingHeading: 'Starting point',
    fitHeading: 'A good fit',
    boundariesHeading: 'Service boundaries',
    evidenceHeading: 'Available evidence',
    principlesAnchor: 'working-boundaries',
    principles: ['Working agreement', 'Commercial boundaries', 'AI only where it adds value'],
    principlesHeading: 'What you can expect from every service',
    indexLabels: ['Websites and web applications', 'WhatsApp and integrations', 'Maintenance and consulting'],
    finalHeading: 'Tell us what you need to solve',
    work: [
      'Website or catalogue: present the offer.',
      'Orders or bookings: organize requests and integrate providers where feasible.',
      'Portal or application: provide access and manage a specific workflow.',
      'A link opens a conversation.',
      'An automated flow organizes steps.',
      'A bot supports defined responses.',
      'An integration connects systems where the platform and providers allow it.',
      'Fault diagnosis and fixes.',
      'Updates and integrations.',
      'Performance review and modernization planning.',
    ],
    contactLabel: 'Contact options',
    finalAction: 'Start an enquiry',
    evidenceLink: 'View the project and its limitations',
    evidencePath: '/en/work/general-reservation-system/',
  },
] as const;

for (const serviceCase of serviceCases) {
  test(serviceCase.locale + ' Services presents the buyer-evaluation flow', async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(serviceCase.route));

    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1, name: serviceCase.heading, exact: true })).toBeVisible();
    await expect(main.getByRole('navigation', { name: serviceCase.indexLabel, exact: true })).toBeVisible();

    const serviceSections = ['web', 'whatsapp', serviceCase.locale === 'Spanish' ? 'consultoria' : 'consulting'];
    for (const [index, sectionId] of serviceSections.entries()) {
      const section = main.locator('section#' + sectionId);
      await expect(section).toBeVisible();
      await expect(section.getByRole('heading', { level: 2, name: serviceCase.serviceHeadings[index], exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: serviceCase.workHeading, exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: serviceCase.startingHeading, exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: serviceCase.fitHeading, exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: serviceCase.boundariesHeading, exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: serviceCase.evidenceHeading, exact: true })).toBeVisible();
      await expect(section.getByRole('link', { name: serviceCase.contactLabel, exact: true })).toHaveAttribute(
        'href',
        appPathname(serviceCase.locale === 'Spanish' ? '/contacto/' : '/en/contact/'),
      );
    }

    for (const workItem of serviceCase.work) {
      await expect(main.getByText(workItem, { exact: true })).toBeVisible();
    }
    for (const heading of serviceCase.principles) {
      await expect(main.getByRole('heading', { level: 3, name: heading, exact: true })).toBeVisible();
    }
    await expect(main.locator('#' + serviceCase.principlesAnchor)).toBeVisible();

    await expect(main.getByRole('link', { name: serviceCase.evidenceLink, exact: true })).toHaveAttribute(
      'href',
      appPathname(serviceCase.evidencePath),
    );
    await expect(main.getByRole('link', { name: serviceCase.finalAction, exact: true })).toHaveAttribute(
      'href',
      appPathname(serviceCase.locale === 'Spanish' ? '/contacto/' : '/en/contact/'),
    );
    await expect(main).not.toContainText(/mismo día hábil|same business day|same-day response/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    assertNoBrowserErrors();
  });

  test(serviceCase.locale + ' Services index keeps stable anchors', async ({ page }) => {
    await page.goto(appUrl(serviceCase.route));
    const navigation = page.getByRole('navigation', { name: serviceCase.indexLabel, exact: true });
    const anchorBase = serviceCase.locale === 'Spanish' ? '/servicios/' : '/en/services/';
    const anchors = serviceCase.locale === 'Spanish'
      ? ['web', 'whatsapp', 'consultoria']
      : ['web', 'whatsapp', 'consulting'];

    for (const [index, link] of (await navigation.getByRole('link').all()).entries()) {
      await expect(link).toHaveAttribute('href', appPathname(anchorBase) + '#' + anchors[index]);
    }
  });

  test(serviceCase.locale + ' Services uses the precision editorial system without changing its order', async ({ page }) => {
    await page.goto(appUrl(serviceCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h2')).toHaveText([
      ...serviceCase.serviceHeadings,
      serviceCase.principlesHeading,
      serviceCase.finalHeading,
    ]);

    const serviceSections = ['web', 'whatsapp', serviceCase.locale === 'Spanish' ? 'consultoria' : 'consulting'];
    for (const [index, sectionId] of serviceSections.entries()) {
      await expectSequenceMarker(main.locator('section#' + sectionId), String(index + 1).padStart(2, '0'));
    }

    const index = main.getByRole('navigation', { name: serviceCase.indexLabel, exact: true });
    for (const [position, link] of (await index.getByRole('link').all()).entries()) {
      await expect(link).toHaveAccessibleName(serviceCase.indexLabels[position]);
    }

    const mono = await expectShortMonoOnly(main);
    expect(mono).toEqual(expect.arrayContaining(['01', '02', '03']));
    expect(await backgroundOf(main.locator('section#cta'))).toBe(IDENTITY_TINT);
  });
}
