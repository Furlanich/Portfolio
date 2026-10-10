import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 6: the Atlas Services composition. The oracle for every string is the approved
// copy in docs/product/pages/services.md ("SPF-V1 proposed Services copy", the D05 compressed
// boundaries and "Revision 5 capability words"). It is restated here on purpose, so a drift in
// the content modules cannot make its own test pass. English row labels that the approved table
// does not fix (Common situations, Agreed scope, Evidence) are Task 6 rulings, recorded in the receipt.

type ServiceId = 'web' | 'whatsapp' | 'consulting';

const cases = {
  es: {
    locale: 'Spanish',
    route: stableRoutes.services.es,
    contact: '/contacto/',
    projectsIndex: stableRoutes.projects.es,
    anchors: { web: 'web', whatsapp: 'whatsapp', consulting: 'consultoria' } as Record<ServiceId, string>,
    boundariesAnchor: 'condiciones',
    heading: 'Software para que el trabajo avance.',
    introduction:
      'Sitios, aplicaciones e integraciones para resolver necesidades concretas. Empezamos por el problema y acordamos qué construir, conectar o mejorar.',
    catalogueLabel: 'Encontrá tu punto de partida',
    catalogueAction: 'Explorar el servicio',
    sceneCaption: 'Capacidades conectadas · modelo ilustrativo',
    legend: 'Sitios web · Apps · Chatbots · Agentes · Automatización · Consultoría · Soporte · Modernización',
    labels: {
      delivery: 'Qué recibís',
      situations: 'Situaciones habituales',
      starting: 'Punto de partida',
      scope: 'Alcance acordado',
      boundaries: 'Límites del servicio',
      evidence: 'Evidencia',
    },
    boundariesLink: 'Ver condiciones de trabajo',
    contactAction: 'Contanos qué necesitás resolver',
    grsAction: 'Examinar el prototipo de reservas',
    services: {
      web: {
        family: 'Sitios y aplicaciones web',
        headline: 'Una interfaz clara para el negocio.',
        outcome: 'Un sitio comercial, un portal o una aplicación según el problema.',
        delivery: 'Un sitio o aplicación, recorridos acordados y documentación proporcional al alcance.',
        evidence: 'Evidencia disponible: prototipo de reservas, con código público y ejecución actual no revalidada.',
        summary: 'Una presencia clara. Una operación más simple.',
        situations: 'Publicar una oferta; gestionar reservas o pedidos; coordinar información en una aplicación.',
        starting: 'El objetivo, los recorridos principales y los datos necesarios.',
        scope: 'Hosting, licencias e integraciones se definen según lo que el proyecto necesita.',
        boundary:
          'Diseño, contenido, integraciones, administración y pruebas se acuerdan según el proyecto. Marca, producción de contenido, alojamiento, cargos de proveedores, aplicaciones móviles y mantenimiento no están incluidos salvo acuerdo. Los resultados comerciales no se garantizan.',
      },
      whatsapp: {
        family: 'Integraciones y automatización',
        headline: 'Las herramientas dejan de trabajar aisladas.',
        outcome: 'Flujos y datos conectados para reducir traspasos manuales.',
        delivery: 'Un flujo integrado, sus límites y una forma acordada de comprobarlo.',
        evidence: 'No se publica actualmente un caso verificado de este servicio. El modelo de fondo es ilustrativo.',
        summary: 'Menos traspasos manuales.',
        situations: 'Información que se copia entre herramientas; pedidos o consultas que se pierden entre mensajes.',
        starting: 'Mapear el flujo actual y comprobar acceso a herramientas, APIs y datos.',
        scope:
          'WhatsApp requiere un proveedor habilitado y aprobaciones. Definimos qué se automatiza y dónde interviene una persona.',
        boundary:
          'La viabilidad depende de las políticas de WhatsApp/Meta, aprobaciones de cuentas y plantillas cuando correspondan, proveedores, costos, datos y sistemas disponibles. FURLANICH no controla esas aprobaciones, disponibilidad, entrega de mensajes ni cambios de precios. Los pagos dependen del proveedor; no se procesan necesariamente dentro de WhatsApp.',
      },
      consulting: {
        family: 'Mejora de software existente',
        headline: 'Un sistema que puede seguir evolucionando.',
        outcome: 'Diagnóstico, mantenimiento y modernización con prioridades claras.',
        delivery: 'Un diagnóstico acotado, mejoras priorizadas y próximos pasos acordados.',
        evidence: 'No se publica actualmente un caso verificado de este servicio. El modelo de fondo es ilustrativo.',
        summary: 'Mejorá lo que ya tenés.',
        situations: 'Errores recurrentes, tareas lentas, software heredado o una integración que necesita continuidad.',
        starting: 'Revisar el código, el entorno y el problema. Acordar primero una intervención acotada.',
        scope: 'Definimos prioridades, responsabilidades y una modalidad de soporte o mantenimiento adecuada.',
        boundary:
          'Se necesitan accesos autorizados al código, entornos, registros, documentación y personas que conocen el sistema. No incluye por defecto reconstrucción, sistema nuevo, guardias, SLA, certificación, licencias, infraestructura ni tareas de otro proveedor.',
      },
    },
    principlesHeading: 'Alcance claro. Entregas revisables.',
    principles: [
      'Definimos responsabilidades, recorridos y criterios de aceptación antes de construir.',
      'La documentación y el traspaso son proporcionales al alcance. Mantenimiento y soporte se acuerdan de forma explícita.',
      'IA cuando aporta una función concreta, con sus límites y supervisión definidos. No es una promesa de automatización total.',
    ],
    shared: [
      ['Acuerdo de trabajo', 'Antes de avanzar se acuerdan alcance, entregables, responsabilidades, validaciones y entrega. Samuel mantiene la responsabilidad técnica, con implementación mantenible y documentación proporcional. El trabajo depende de la participación del negocio y de los accesos necesarios. Costos externos, propiedad, licencias y continuidad se definen en el acuerdo correspondiente.'],
      ['IA solo cuando aporta valor', 'La IA no es un cuarto servicio ni se incorpora por defecto. Puede formar parte de una automatización o sistema a medida —por ejemplo, para procesar documentos, asistir un flujo interno o interpretar una solicitud acotada— solo cuando aporta valor, puede evaluarse responsablemente y sus proveedores, datos, costos, límites y supervisión quedan explícitos.'],
    ],
    aiScope: 'Chatbots y agentes se evalúan con alcance, datos, proveedores, costos, límites y supervisión humana acordados.',
    commercialHeading: 'Límites comerciales',
    commercialDescription:
      'El precio y el plazo se definen después de entender y acotar el trabajo. Ninguna descripción de esta página garantiza una métrica de negocio, un plazo fijo, disponibilidad continua ni un resultado que dependa de adopción, contenidos, proveedores o sistemas externos.',
    commercialItems: [
      'Hosting, dominios, licencias, medios de pago, mensajería, APIs y suscripciones de terceros se cotizan o contratan por separado salvo inclusión expresa.',
      'El cliente aporta o autoriza contenidos, datos, accesos, cuentas, decisiones y validaciones necesarios para el alcance acordado.',
      'El mantenimiento posterior, los cambios de alcance y el soporte continuo son acuerdos separados.',
      'Un tiempo de respuesta para consultas comerciales no es un SLA de soporte. Cualquier guardia, prioridad o nivel de servicio requiere un acuerdo específico.',
      'Los términos definitivos de pago, aceptación, propiedad, garantía y responsabilidad pertenecen a cada propuesta o contrato y siguen sujetos a revisión comercial y legal.',
    ],
    finalHeading: 'Contanos qué necesitás resolver',
    finalDescription: 'Explorá el contacto y probá la demostración del formulario.',
    finalAction: 'Iniciar una consulta',
  },
  en: {
    locale: 'English',
    route: stableRoutes.services.en,
    contact: '/en/contact/',
    projectsIndex: stableRoutes.projects.en,
    anchors: { web: 'web', whatsapp: 'whatsapp', consulting: 'consulting' } as Record<ServiceId, string>,
    boundariesAnchor: 'working-boundaries',
    heading: 'Software that moves work forward.',
    introduction:
      'Websites, applications and integrations for concrete needs. We start with the problem and agree what to build, connect or improve.',
    catalogueLabel: 'Find your starting point',
    catalogueAction: 'Explore the service',
    sceneCaption: 'Connected capabilities · illustrative model',
    legend: 'Websites · Apps · Chatbots · Agents · Automation · Consulting · Support · Modernization',
    labels: {
      delivery: 'What you receive',
      situations: 'Common situations',
      starting: 'Starting point',
      scope: 'Agreed scope',
      boundaries: 'Service boundaries',
      evidence: 'Evidence',
    },
    boundariesLink: 'Read working boundaries',
    contactAction: 'Tell us what you need to solve',
    grsAction: 'Examine the reservation prototype',
    services: {
      web: {
        family: 'Websites and web applications',
        headline: 'A clear interface for the business.',
        outcome: 'A business website, portal or application shaped around the problem.',
        delivery: 'A website or application, agreed journeys and documentation proportionate to scope.',
        evidence: 'Available evidence: reservation prototype, with public code and current execution not revalidated.',
        summary: 'A clear presence. Simpler operations.',
        situations: 'Publish an offer; manage bookings or orders; coordinate information in an application.',
        starting: 'The objective, main journeys and data required.',
        scope: 'Hosting, licenses and integrations are defined around the project’s needs.',
        boundary:
          'Design, content, integrations, administration and testing are scoped for each project. Branding, content production, hosting, provider charges, mobile apps and maintenance are included only by agreement. Business results are not guaranteed.',
      },
      whatsapp: {
        family: 'Integrations and automation',
        headline: 'Tools stop working in isolation.',
        outcome: 'Connected workflows and data to reduce manual handoffs.',
        delivery: 'An integrated workflow, its boundaries and an agreed way to check it.',
        evidence: 'No verified case is currently published for this service. The background model is illustrative.',
        summary: 'Fewer manual handoffs.',
        situations: 'Information copied between tools; orders or questions lost between messages.',
        starting: 'Map the existing workflow and check access to tools, APIs and data.',
        scope:
          'WhatsApp requires an eligible provider and approvals. Define what is automated and where a person takes over.',
        boundary:
          'Feasibility depends on WhatsApp/Meta policies, account and template approvals where required, providers, costs, data and available systems. FURLANICH does not control those approvals, availability, message delivery or price changes. Payments depend on the provider and do not necessarily happen inside WhatsApp.',
      },
      consulting: {
        family: 'Improve existing software',
        headline: 'A system that can keep evolving.',
        outcome: 'Diagnosis, maintenance and modernization with clear priorities.',
        delivery: 'A bounded diagnosis, prioritized improvements and agreed next steps.',
        evidence: 'No verified case is currently published for this service. The background model is illustrative.',
        summary: 'Build on what you already have.',
        situations: 'Recurring errors, slow tasks, legacy software or an integration that needs continuity.',
        starting: 'Review the code, environment and problem. Agree on a bounded intervention first.',
        scope: 'Define priorities, responsibilities and a suitable support or maintenance arrangement.',
        boundary:
          'Authorized access to code, environments, logs, documentation and people who know the system is needed. Rebuilds, new systems, on-call response, SLAs, certification, licenses, infrastructure and another provider’s work are not included by default.',
      },
    },
    principlesHeading: 'Clear scope. Reviewable delivery.',
    principles: [
      'Agree on responsibilities, journeys and acceptance criteria before building.',
      'Documentation and handover are proportionate to scope. Maintenance and support are agreed explicitly.',
      'AI where it serves a specific function, with defined limits and oversight. It is not a promise of total automation.',
    ],
    shared: [
      ['Working agreement', 'Scope, deliverables, responsibilities, validation and handover are agreed before proceeding. Samuel retains technical responsibility, with maintainable implementation and proportionate documentation. Work depends on business participation and the necessary access. External costs, ownership, licenses and ongoing support are defined in the relevant agreement.'],
      ['AI only where it adds value', 'AI is not a fourth service and is not included by default. It may be one capability inside a tailored automation or system — for example, document processing, an AI-assisted internal workflow, or interpretation of a bounded request — only when it adds value and its providers, data, costs, limitations, evaluation, and human oversight are explicit.'],
    ],
    aiScope: 'Chatbots and agents are evaluated with agreed scope, data, providers, costs, limits and human oversight.',
    commercialHeading: 'Commercial boundaries',
    commercialDescription:
      'Price and timing are defined after the work has been understood and scoped. Nothing on this page guarantees a business metric, a fixed delivery date, continuous availability, or an outcome that depends on adoption, content, providers, or external systems.',
    commercialItems: [
      'Hosting, domains, licences, payment services, messaging, APIs, and third-party subscriptions are quoted or contracted separately unless expressly included.',
      'The client provides or authorizes the content, data, access, accounts, decisions, and validation required by the agreed scope.',
      'Post-delivery maintenance, scope changes, and ongoing support are separate agreements.',
      'A response target for commercial enquiries is not a support SLA. Any on-call coverage, priority, or service level requires a specific agreement.',
      'Final payment, acceptance, ownership, warranty, and liability terms belong in each proposal or contract and remain subject to commercial and legal review.',
    ],
    finalHeading: 'Tell us what you need to solve',
    finalDescription: 'Explore the contact options and try the form demonstration.',
    finalAction: 'Start an enquiry',
  },
} as const;

const serviceIds: ServiceId[] = ['web', 'whatsapp', 'consulting'];
const words = {
  es: ['Sitios web', 'Apps', 'Chatbots', 'Agentes', 'Automatización', 'Consultoría', 'Soporte', 'Modernización'],
  en: ['Websites', 'Apps', 'Chatbots', 'Agents', 'Automation', 'Consulting', 'Support', 'Modernization'],
} as const;

function catalogueLink(page: Page, copy: (typeof cases)['es' | 'en'], id: ServiceId): Locator {
  return page
    .getByRole('main')
    .getByRole('navigation', { name: copy.catalogueLabel, exact: true })
    .locator(`a[href$="#${copy.anchors[id]}"]`);
}

async function box(locator: Locator) {
  const result = await locator.boundingBox();
  expect(result, 'element has a box').not.toBeNull();
  return result!;
}

test.describe('before enhancement (JavaScript disabled)', () => {
  test.use({ javaScriptEnabled: false });

  for (const [key, copy] of Object.entries(cases) as ['es' | 'en', (typeof cases)['es' | 'en']][]) {
    // The first RED of Task 6: the composition lacked the catalogue and the new chapter structure.
    test(`${copy.locale} Services exposes three native catalogue anchors and the complete scoped boundaries before enhancement`, async ({ page }) => {
      await page.goto(appUrl(copy.route));
      const main = page.getByRole('main');
      const nav = main.getByRole('navigation', { name: copy.catalogueLabel, exact: true });
      await expect(nav).toBeVisible();

      // Three native anchors, in the approved order, each reaching a visible chapter heading.
      const links = nav.getByRole('link');
      await expect(links).toHaveCount(3);
      for (const [position, id] of serviceIds.entries()) {
        const link = links.nth(position);
        await expect(link).toHaveAttribute('href', appPathname(copy.route) + '#' + copy.anchors[id]);
        await expect(link).toContainText(copy.services[id].family);
        await expect(link).toContainText(copy.services[id].summary);
        await expect(link).toContainText(copy.catalogueAction);
        const chapter = main.locator('section#' + copy.anchors[id]);
        await expect(chapter.getByRole('heading', { level: 2, name: copy.services[id].headline, exact: true })).toBeVisible();
      }

      // Every compressed D05 boundary is ordinary visible text inside its own chapter, followed by the
      // same-page working-boundaries link.
      for (const id of serviceIds) {
        const chapter = main.locator('section#' + copy.anchors[id]);
        await expect(chapter.getByText(copy.services[id].boundary, { exact: true })).toBeVisible();
        await expect(chapter.getByRole('link', { name: copy.boundariesLink, exact: true })).toHaveAttribute(
          'href',
          '#' + copy.boundariesAnchor,
        );
      }

      // The complete working boundaries: three principles, the shared agreement, the AI/ERP note with its
      // scope sentence, and the full commercial block, with no accordion or reveal.
      const boundaries = main.locator('section#' + copy.boundariesAnchor);
      await expect(boundaries.getByRole('heading', { level: 2, name: copy.principlesHeading, exact: true })).toBeVisible();
      for (const principle of copy.principles) await expect(boundaries.getByText(principle, { exact: true })).toBeVisible();
      for (const [heading, body] of copy.shared) {
        await expect(boundaries.getByRole('heading', { level: 3, name: heading, exact: true })).toBeVisible();
        await expect(boundaries.getByText(body, { exact: true })).toBeVisible();
      }
      await expect(boundaries.getByText(copy.aiScope, { exact: true })).toBeVisible();
      await expect(boundaries.getByRole('heading', { level: 3, name: copy.commercialHeading, exact: true })).toBeVisible();
      await expect(boundaries.getByText(copy.commercialDescription, { exact: true })).toBeVisible();
      await expect(boundaries.getByRole('listitem')).toHaveText([...copy.commercialItems]);
      await expect(boundaries.locator('details, [aria-expanded], [hidden]')).toHaveCount(0);
      expect(key).toBeTruthy();
    });

    test(`${copy.locale} Services carries the connected-page contract and a reserved Pause slot before JavaScript`, async ({ page }) => {
      await page.goto(appUrl(copy.route));
      const main = page.getByRole('main');
      await expect(main).toHaveAttribute('data-connected-page');
      await expect(main).toHaveAttribute('data-connected-route', 'services');
      await expect(main).toHaveAttribute('data-connected-locale', key);

      const ground = page.locator('[data-connected-ground]');
      await expect(ground).toHaveCount(1);
      await expect(ground).toHaveAttribute('data-connected-route', 'services');
      await expect(ground).toHaveAttribute('aria-hidden', 'true');
      expect(JSON.parse((await ground.locator('[data-connected-mount]').getAttribute('data-capability-words')) ?? '[]')).toEqual(words[key]);
      await expect(page.locator('canvas')).toHaveCount(0);

      // One H1 inside a reading mask, the legend once, in order, and the scene caption.
      await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(main.getByRole('heading', { level: 1, name: copy.heading, exact: true })).toBeVisible();
      await expect(main.locator('[data-connected-reading-mask]').filter({ has: page.getByRole('heading', { level: 1 }) })).toHaveCount(1);
      await expect(main.getByText(copy.introduction, { exact: true })).toBeVisible();
      await expect(main.getByText(copy.sceneCaption, { exact: true })).toBeVisible();
      await expect(main.getByText(copy.legend, { exact: true })).toHaveCount(1);

      // The Pause slot is reserved in the introduction plate, at least 44px, and never over body copy.
      const slot = page.locator('#connected-pause-services');
      await expect(slot).toHaveCount(1);
      await expect(slot).toBeEmpty();
      expect((await box(slot)).height).toBeGreaterThanOrEqual(44);
      await expect(page.locator('[data-connected-reading-mask]').filter({ has: slot })).toHaveCount(1);
      expect((await box(slot)).y).toBeGreaterThan((await box(main.getByText(copy.introduction, { exact: true }))).y);
    });

    test(`${copy.locale} Services chapters keep the approved copy and order before the working-boundaries link, evidence and Contact`, async ({ page }) => {
      await page.goto(appUrl(copy.route));
      const main = page.getByRole('main');
      await expect(main.locator('h2')).toHaveText([
        ...serviceIds.map((id) => copy.services[id].headline),
        copy.principlesHeading,
        copy.finalHeading,
      ]);

      for (const id of serviceIds) {
        const service = copy.services[id];
        const chapter = main.locator('section#' + copy.anchors[id]);
        await expect(chapter.getByText(service.family, { exact: true })).toBeVisible();
        await expect(chapter.getByText(service.outcome, { exact: true })).toBeVisible();
        await expect(chapter.getByRole('heading', { level: 3, name: copy.labels.delivery, exact: true })).toBeVisible();
        await expect(chapter.getByText(service.delivery, { exact: true })).toBeVisible();
        for (const [label, text] of [
          [copy.labels.situations, service.situations],
          [copy.labels.starting, service.starting],
          [copy.labels.scope, service.scope],
          [copy.labels.evidence, service.evidence],
        ] as const) {
          await expect(chapter.getByRole('heading', { level: 3, name: label, exact: true })).toBeVisible();
          await expect(chapter.getByText(text, { exact: true })).toBeVisible();
        }
        await expect(chapter.getByRole('heading', { level: 3, name: copy.labels.boundaries, exact: true })).toBeVisible();

        // Document order inside the chapter: delivery, the engagement facts, the service boundary, the
        // working-boundaries link, evidence, then the Contact action.
        const order = await chapter.evaluate((root, probes) => {
          const text = root.textContent ?? '';
          return probes.map((probe) => text.indexOf(probe));
        }, [service.delivery, service.starting, service.scope, service.boundary, copy.boundariesLink, service.evidence, copy.contactAction]);
        expect(order.every((position) => position >= 0), `${id} probes present`).toBe(true);
        expect([...order].sort((a, b) => a - b), `${id} document order`).toEqual(order);

        await expect(chapter.getByRole('link', { name: copy.contactAction, exact: true })).toHaveAttribute('href', appPathname(copy.contact));
      }

      // The GRS evidence action reaches the complete index dossier; automation and maintenance borrow no proof.
      await expect(main.locator('section#web').getByRole('link', { name: copy.grsAction, exact: true })).toHaveAttribute(
        'href',
        appPathname(copy.projectsIndex) + '#general-reservation-system',
      );
      await expect(main.locator('section#whatsapp').getByRole('link', { name: copy.grsAction })).toHaveCount(0);
      await expect(main.locator('section#' + copy.anchors.consulting).getByRole('link', { name: copy.grsAction })).toHaveCount(0);

      await expect(main.getByRole('heading', { level: 2, name: copy.finalHeading, exact: true })).toBeVisible();
      await expect(main.getByText(copy.finalDescription, { exact: true })).toBeVisible();
      await expect(main.getByRole('link', { name: copy.finalAction, exact: true })).toHaveAttribute('href', appPathname(copy.contact));
      await expect(main).not.toContainText(/mismo día hábil|same business day|same-day response/i);
    });
  }
});

test.describe('catalogue composition and anchors', () => {
  for (const copy of Object.values(cases)) {
    test(`${copy.locale} Services makes web the single large left card at 1024px and wider`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(appUrl(copy.route));
      const web = await box(catalogueLink(page, copy, 'web'));
      const whatsapp = await box(catalogueLink(page, copy, 'whatsapp'));
      const consulting = await box(catalogueLink(page, copy, 'consulting'));

      // Left column: one tall card. Right column: two supporting cards stacked, level with it.
      expect(web.x).toBeLessThan(whatsapp.x);
      expect(whatsapp.x).toBeCloseTo(consulting.x, 0);
      expect(whatsapp.y).toBeLessThan(consulting.y);
      expect(web.width).toBeGreaterThan(whatsapp.width);
      expect(web.height).toBeGreaterThan(whatsapp.height * 1.5);
      expect(web.height).toBeGreaterThan(consulting.height * 1.5);
      expect(Math.abs(web.y - whatsapp.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(web.y + web.height - (consulting.y + consulting.height))).toBeLessThanOrEqual(2);
    });

    test(`${copy.locale} Services lands each catalogue anchor with its heading fully below the App Bar`, async ({ page }) => {
      await page.goto(appUrl(copy.route));
      const header = page.locator('header[data-app-bar]');
      for (const id of serviceIds) {
        await catalogueLink(page, copy, id).click();
        await expect(page).toHaveURL(new RegExp('#' + copy.anchors[id] + '$'));
        const heading = page.getByRole('main').locator('section#' + copy.anchors[id]).getByRole('heading', { level: 2 });
        // Wait for the browser's own anchor scroll to settle before measuring.
        await expect.poll(async () => Math.round((await box(heading)).y), { timeout: 5000 }).toBeGreaterThan(0);
        const settled = await page.evaluate(() => new Promise<number>((resolve) => {
          let previous = -1;
          const tick = () => {
            if (window.scrollY === previous) resolve(window.scrollY);
            else { previous = window.scrollY; requestAnimationFrame(tick); }
          };
          requestAnimationFrame(tick);
        }));
        expect(settled).toBeGreaterThan(0);
        const bar = await box(header);
        expect((await box(heading)).y, `${id} heading below App Bar`).toBeGreaterThanOrEqual(bar.y + bar.height);
      }
    });
  }
});

test.describe('layout resilience', () => {
  for (const copy of Object.values(cases)) {
    for (const [name, viewport] of [
      ['320px', { width: 320, height: 640 }],
      ['200% zoom (a 720px CSS viewport)', { width: 720, height: 450 }],
      ['landscape phone', { width: 844, height: 390 }],
    ] as const) {
      test(`${copy.locale} Services reflows without horizontal overflow or clipped content at ${name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(appUrl(copy.route));
        await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
        const overflow = await page.evaluate(() => ({
          page: document.documentElement.scrollWidth - window.innerWidth,
          wide: [...document.querySelectorAll<HTMLElement>('main *')]
            .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1)
            .map((element) => element.tagName.toLowerCase() + (element.className ? '.' + String(element.className).split(' ')[0] : '')),
        }));
        expect(overflow.page, 'document scroll width').toBeLessThanOrEqual(0);
        expect(overflow.wide, 'elements past the viewport edge').toEqual([]);
        // Below 768px the catalogue is the natural single column, in document order.
        if (viewport.width < 768) {
          const [first, second, third] = [
            await box(catalogueLink(page, copy, 'web')),
            await box(catalogueLink(page, copy, 'whatsapp')),
            await box(catalogueLink(page, copy, 'consulting')),
          ];
          expect(Math.abs(first.x - second.x)).toBeLessThanOrEqual(1);
          expect(Math.abs(second.x - third.x)).toBeLessThanOrEqual(1);
          expect(first.y).toBeLessThan(second.y);
          expect(second.y).toBeLessThan(third.y);
        }
        // Action targets stay at least 44px.
        for (const target of await page.getByRole('main').getByRole('link').all()) {
          if (!(await target.isVisible())) continue;
          expect((await box(target)).height, `link target ${await target.innerText()}`).toBeGreaterThanOrEqual(43.5);
        }
      });
    }
  }
});

test.describe('catalogue hover and focus', () => {
  for (const copy of Object.values(cases)) {
    test(`${copy.locale} Services catalogue cards lift at most 3px on fine-pointer hover with 160-220ms explicit transitions`, async ({ page }) => {
      await page.goto(appUrl(copy.route));
      const fine = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
      test.skip(!fine, 'Hover is a fine-pointer-only affordance');
      const card = catalogueLink(page, copy, 'whatsapp');
      await card.scrollIntoViewIfNeeded();
      const before = await box(card);
      const rest = await card.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderColor, property: style.transitionProperty, duration: style.transitionDuration };
      });
      // Explicit properties only, never `all`, each between 160ms and 220ms.
      expect(rest.property).not.toMatch(/\ball\b/);
      for (const duration of rest.duration.split(',').map((value) => parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000))) {
        expect(duration).toBeGreaterThanOrEqual(160);
        expect(duration).toBeLessThanOrEqual(220);
      }

      await card.hover();
      await page.waitForTimeout(400);
      const after = await box(card);
      const lift = before.y - after.y;
      expect(lift, 'the card rises').toBeGreaterThan(0);
      expect(lift, 'at most 3px').toBeLessThanOrEqual(3.01);
      expect(Math.abs(before.x - after.x)).toBeLessThanOrEqual(0.5);
      const hovered = await card.evaluate((element) => getComputedStyle(element).borderColor);
      expect(hovered, 'brighter border').not.toBe(rest.border);

      // The arrow moves at most 3px, on its own explicit transform transition.
      const arrow = card.locator('[data-catalogue-arrow]');
      await expect(arrow).toHaveCount(1);
      const arrowShift = await arrow.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
      expect(arrowShift).toBeGreaterThan(0);
      expect(arrowShift).toBeLessThanOrEqual(3.01);
    });

    test(`${copy.locale} Services catalogue shows the same affordance on keyboard focus-visible`, async ({ page, browserName }) => {
      // Playwright's WebKit never moves focus to a link on Tab (it reaches only the body and the dev
      // overlay), a host Safari link-tabbing policy rather than a page behavior; Chromium and Firefox
      // walk the real tab order. See "Mobile WebKit link tabbing" in docs/testing/playwright.md.
      test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default on this host');
      await page.goto(appUrl(copy.route));
      const card = catalogueLink(page, copy, 'consulting');
      await card.scrollIntoViewIfNeeded();
      const rest = await card.evaluate((element) => getComputedStyle(element).borderColor);
      await card.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(card).toBeFocused();
      await page.waitForTimeout(400);
      const focused = await card.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderColor, outline: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth) };
      });
      expect(focused.border, 'brighter border on focus').not.toBe(rest);
      expect(focused.outline).not.toBe('none');
      expect(focused.outlineWidth).toBeGreaterThanOrEqual(2);
    });

    test(`${copy.locale} Services removes catalogue movement under reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(appUrl(copy.route));
      const fine = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
      test.skip(!fine, 'Hover is a fine-pointer-only affordance');
      const card = catalogueLink(page, copy, 'whatsapp');
      await card.scrollIntoViewIfNeeded();
      const before = await box(card);
      await card.hover();
      await page.waitForTimeout(400);
      const after = await box(card);
      expect(after.y).toBeCloseTo(before.y, 1);
      const arrowShift = await card.locator('[data-catalogue-arrow]').evaluate((element) => {
        const { transform } = getComputedStyle(element);
        return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
      });
      expect(arrowShift).toBe(0);
    });
  }
});

test.describe('accessibility and console health', () => {
  for (const copy of Object.values(cases)) {
    test(`${copy.locale} Services has no serious or critical axe violations and no console errors`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await page.goto(appUrl(copy.route));
      await expect(page.getByRole('main').getByRole('heading', { level: 1, name: copy.heading, exact: true })).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
      assertNoBrowserErrors();
    });
  }
});
