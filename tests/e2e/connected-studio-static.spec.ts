import { expect, test } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 3: the Projects index is the one place where both dossiers live. These tests run
// with JavaScript disabled, so everything they find is server HTML. Every string below is the exact
// approved copy from docs/product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation.

const projectsCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.projects.es,
    servicesIndex: stableRoutes.services.es,
    founder: stableRoutes.founder.es,
    heading: 'Trabajo que podés examinar.',
    introduction:
      'Código e implementación con su contexto y sus límites. Cada proyecto declara qué se hizo y qué evidencia está disponible.',
    sourceAction: 'Ver código fuente',
    relatedAction: 'Sitios y aplicaciones web',
    founderAction: 'Conocer a Samuel',
    disclosureHeading: 'El contexto importa.',
    disclosureCopy:
      'Cada dossier mantiene su madurez, relación y límites de publicación. Las ilustraciones explican el alcance; no son capturas del producto ni pruebas de operación.',
    sceneCaption: 'Capacidades conectadas · modelo ilustrativo',
    legend: 'Sitios web · Apps · Chatbots · Agentes · Automatización · Consultoría · Soporte · Modernización',
    dossiers: [
      {
        slug: 'general-reservation-system',
        sourceHref: 'https://github.com/Furlanich/GeneralReservationSystem',
        jump: 'Reservas de transporte',
        title: 'Gestión de reservas para transporte de pasajeros',
        maturity: 'Prototipo de reservas',
        summary: 'Coordinar recorridos, estaciones, asientos y autogestión de pasajeros.',
        relationship: 'Repositorio publicado por el fundador con otro colaborador. No se presenta como trabajo para un cliente.',
        caption: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
        opportunity: ['La oportunidad modelada', 'El alcance modela una oportunidad de coordinación en transporte de pasajeros; no es un problema confirmado de un cliente.'],
        scopeHeading: 'Alcance implementado',
        scope: [
          'Acceso de cuentas y administración',
          'Recorridos, estaciones y disponibilidad de asientos',
          'Creación y cancelación de reservas',
          'Autogestión de pasajeros e intercambio de estaciones mediante CSV',
        ],
        evidence: [
          'Qué podés comprobar',
          'El resultado público es evidencia de implementación: código, proyectos de pruebas, configuración Docker e historial técnico disponible. Un historial exitoso de CI no demuestra operación actual.',
        ],
        limits: [
          'Límites de la evidencia',
          'La demo documentada no está disponible y la ejecución actual no fue revalidada. No se afirma uso en producción, pagos implementados, adopción, uptime ni un resultado comercial medido.',
        ],
      },
      {
        slug: 'the-system',
        sourceHref: 'https://github.com/Furlanich/The-System',
        jump: 'Campañas multiusuario',
        title: 'Gestión multiusuario de campañas de rol',
        maturity: 'Laboratorio FURLANICH',
        summary: 'Organizar campañas de rol con identidad, membresías e invitaciones.',
        relationship: 'Exploración de laboratorio publicada por el fundador. El dominio es la gestión de campañas de rol.',
        caption: 'Ilustración conceptual · no es una captura del producto',
        alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
        opportunity: ['La oportunidad modelada', 'El laboratorio explora límites de acceso y organización multiusuario. No se presenta como una necesidad confirmada de un cliente.'],
        scopeHeading: 'Alcance implementado',
        scope: [
          'Identidad, autenticación y recuperación de cuentas',
          'Campañas, membresías e invitaciones',
          'Permisos multiusuario',
          'Abstracciones de suscripción/facturación y base de cliente web',
        ],
        evidence: [
          'Qué podés comprobar',
          'El resultado público es evidencia de implementación: repositorio, pruebas en capas de backend y frontend y configuración de desarrollo.',
        ],
        limits: [
          'Límites de la evidencia',
          'No hay demo pública ni verificación de ejecución actual. La suscripción está modelada en el código; no se presenta como facturación operativa. Escenas, activos, notas y colaboración completa no se presentan como entregados. No se afirma uso en producción.',
        ],
      },
    ],
  },
  {
    locale: 'English',
    route: stableRoutes.projects.en,
    servicesIndex: stableRoutes.services.en,
    founder: stableRoutes.founder.en,
    heading: 'Work you can examine.',
    introduction:
      'Code and implementation, with context and limits. Each project states what was built and which evidence is available.',
    sourceAction: 'View source code',
    relatedAction: 'Websites and web applications',
    founderAction: 'Meet Samuel',
    disclosureHeading: 'Context matters.',
    disclosureCopy:
      'Each dossier retains its maturity, relationship and publication limits. Illustrations explain the scope; they are not product screenshots or evidence of operation.',
    sceneCaption: 'Connected capabilities · illustrative model',
    legend: 'Websites · Apps · Chatbots · Agents · Automation · Consulting · Support · Modernization',
    dossiers: [
      {
        slug: 'general-reservation-system',
        sourceHref: 'https://github.com/Furlanich/GeneralReservationSystem',
        jump: 'Transport reservations',
        title: 'Passenger transport reservation management',
        maturity: 'Reservation prototype',
        summary: 'Coordinate routes, stations, seats and passenger self-service.',
        relationship: 'Founder-published repository with another contributor. It is not presented as client work.',
        caption: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
        opportunity: ['The modeled opportunity', 'The scope models a coordination opportunity in passenger transport; it is not a confirmed client problem.'],
        scopeHeading: 'Implemented scope',
        scope: [
          'Account access and administration',
          'Routes, stations and seat availability',
          'Reservation creation and cancellation',
          'Passenger self-service and station exchange through CSV',
        ],
        evidence: [
          'What you can examine',
          'The public result is implementation evidence: code, test projects, Docker configuration and available technical history. Historical successful CI does not establish current operation.',
        ],
        limits: [
          'Evidence limits',
          'The documented demo is unavailable and current execution has not been revalidated. Production use, implemented payments, adoption, uptime and measured business outcomes are not claimed.',
        ],
      },
      {
        slug: 'the-system',
        sourceHref: 'https://github.com/Furlanich/The-System',
        jump: 'Multi-user campaigns',
        title: 'Multi-user role-playing campaign management',
        maturity: 'FURLANICH Lab',
        summary: 'Organize role-playing campaigns with identity, memberships and invitations.',
        relationship: 'Founder-published laboratory exploration. Its domain is role-playing campaign management.',
        caption: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
        opportunity: ['The modeled opportunity', 'The laboratory explores access boundaries and multi-user organization. It is not presented as a confirmed client need.'],
        scopeHeading: 'Implemented scope',
        scope: [
          'Identity, authentication and account recovery',
          'Campaigns, memberships and invitations',
          'Multi-user permissions',
          'Subscription/billing abstractions and a web-client foundation',
        ],
        evidence: [
          'What you can examine',
          'The public result is implementation evidence: repository, backend/frontend test source and development configuration.',
        ],
        limits: [
          'Evidence limits',
          'No public demo or current runtime verification. Subscription boundaries are modeled in code, not presented as operational billing. Scenes, assets, notes and complete collaboration are not presented as delivered. Production use is not claimed.',
        ],
      },
    ],
  },
] as const;

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  const words = {
    Spanish: ['Sitios web', 'Apps', 'Chatbots', 'Agentes', 'Automatización', 'Consultoría', 'Soporte', 'Modernización'],
    English: ['Websites', 'Apps', 'Chatbots', 'Agents', 'Automation', 'Consulting', 'Support', 'Modernization'],
  } as const;

  for (const projectCase of projectsCases) {
    test(`${projectCase.locale} Projects carries the connected-page contract and a complete static ground before JavaScript`, async ({ page }) => {
      await page.goto(appUrl(projectCase.route));
      const main = page.getByRole('main');
      await expect(main).toHaveAttribute('data-connected-page');
      await expect(main).toHaveAttribute('data-connected-route', 'projects');
      await expect(main).toHaveAttribute('data-connected-locale', projectCase.locale === 'Spanish' ? 'es' : 'en');

      // The decorative ground and its reserved mount are in the server HTML, hidden from assistive technology.
      const ground = page.locator('[data-connected-ground]');
      await expect(ground).toHaveCount(1);
      await expect(ground).toHaveAttribute('aria-hidden', 'true');
      await expect(ground).toHaveAttribute('data-connected-route', 'projects');
      expect(JSON.parse((await ground.locator('[data-connected-mount]').getAttribute('data-capability-words')) ?? '[]')).toEqual(words[projectCase.locale]);
      await expect(page.locator('canvas')).toHaveCount(0);

      // One H1 inside a reading mask, then the semantic legend once, in order, as ordinary text.
      await expect(main.getByRole('heading', { level: 1, name: projectCase.heading, exact: true })).toBeVisible();
      await expect(main.locator('[data-connected-reading-mask]').filter({ has: page.getByRole('heading', { level: 1 }) })).toHaveCount(1);
      await expect(main.getByText(projectCase.introduction, { exact: true })).toBeVisible();
      await expect(main.getByText(projectCase.sceneCaption, { exact: true })).toBeVisible();
      await expect(main.getByText(projectCase.legend, { exact: true })).toHaveCount(1);
      await expect(main.getByText(projectCase.disclosureHeading, { exact: true })).toBeVisible();
      await expect(main.getByText(projectCase.disclosureCopy, { exact: true })).toBeVisible();
    });

    test(`${projectCase.locale} Projects reserves the hero Pause slot before any enhancement`, async ({ page }) => {
      await page.goto(appUrl(projectCase.route));
      const slot = page.locator('#connected-pause-projects');
      await expect(slot).toHaveCount(1);
      await expect(slot).toBeEmpty();
      const box = await slot.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      // The slot lives inside the introduction plate, beneath the jump links, and never over body copy.
      await expect(page.locator('[data-connected-reading-mask]').filter({ has: slot })).toHaveCount(1);
      const jump = await page.getByRole('main').locator('a[href="#the-system"]').boundingBox();
      expect(box!.y).toBeGreaterThan(jump!.y);
    });

    test(`${projectCase.locale} Projects index exposes both complete dossiers before JavaScript`, async ({ page }) => {
      await page.goto(appUrl(projectCase.route));
      const main = page.getByRole('main');

      for (const dossier of projectCase.dossiers) {
        const article = main.locator('article').filter({
          has: page.getByRole('heading', { name: dossier.title, exact: true }),
        });
        await expect(article, `${dossier.slug} article`).toBeVisible();

        await expect(article.getByText(dossier.maturity, { exact: true })).toBeVisible();
        await expect(article.getByText(dossier.summary, { exact: true })).toBeVisible();
        await expect(article.getByText(dossier.relationship, { exact: true })).toBeVisible();
        await expect(article.getByText(dossier.caption, { exact: true })).toBeVisible();

        await expect(article.getByRole('heading', { name: dossier.opportunity[0], exact: true })).toBeVisible();
        await expect(article.getByText(dossier.opportunity[1], { exact: true })).toBeVisible();

        await expect(article.getByRole('heading', { name: dossier.scopeHeading, exact: true })).toBeVisible();
        await expect(article.getByRole('listitem')).toHaveText([...dossier.scope]);

        await expect(article.getByRole('heading', { name: dossier.evidence[0], exact: true })).toBeVisible();
        await expect(article.getByText(dossier.evidence[1], { exact: true })).toBeVisible();

        await expect(article.getByRole('heading', { name: dossier.limits[0], exact: true })).toBeVisible();
        await expect(article.getByText(dossier.limits[1], { exact: true })).toBeVisible();

        await expect(article.getByRole('link', { name: projectCase.sourceAction, exact: true })).toHaveAttribute('href', dossier.sourceHref);
        await expect(article.getByRole('link', { name: projectCase.relatedAction, exact: true })).toHaveAttribute('href', appPathname(projectCase.servicesIndex) + '#web');
        await expect(article.getByRole('link', { name: projectCase.founderAction, exact: true })).toHaveAttribute('href', appPathname(projectCase.founder));
        await expect(article.getByRole('img', { name: dossier.alt, exact: true })).toBeVisible();
      }
    });
  }
});
