import { expect, test, type Page, type Route } from '@playwright/test';
import { readConnected } from './support/connected-studio';
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

// PLAN-SPF-V1 Task 8: matched static posters and truthful responsive imagery. Both live tiers stay off in
// every merged build, so every page here is the static page: a poster (or the CSS chart beneath it), no
// canvas and no engine. The poster is chosen by the 768px boundary in the Ground's own CSS, and only the
// matching file is requested.

const posterPattern = /\/brand\/connected-studio\/(services|projects|studio|founder|contact)-(wide|compact)\.webp/;

const connectedPages = [
  { route: 'services', locale: 'es', path: stableRoutes.services.es },
  { route: 'services', locale: 'en', path: stableRoutes.services.en },
  { route: 'projects', locale: 'es', path: stableRoutes.projects.es },
  { route: 'projects', locale: 'en', path: stableRoutes.projects.en },
] as const;

/** A file path at the served base path. `appPathname` is for routes and adds a trailing slash. */
function assetPath(path: string): string {
  return appPathname('/').slice(0, -1) + path;
}

function watchPosterRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (posterPattern.test(request.url())) urls.push(new URL(request.url()).pathname);
  });
  return urls;
}

async function waitForLoadedAndSettled(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  // A CSS background image starts when the Ground is styled; a stray second request would arrive well inside this.
  await page.waitForTimeout(600);
}

test.describe('static posters', () => {
  const widths = [
    { width: 320, quality: 'compact' },
    { width: 390, quality: 'compact' },
    { width: 767, quality: 'compact' },
    { width: 768, quality: 'wide' },
    { width: 1024, quality: 'wide' },
    { width: 1440, quality: 'wide' },
  ] as const;

  for (const { route, locale, path } of connectedPages) {
    for (const { width, quality } of widths) {
      test(`${locale} ${route} requests only the ${quality} poster at ${width}px, at the served base path, with no canvas and no engine`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        const requested = watchPosterRequests(page);
        await page.goto(appUrl(path));
        await waitForLoadedAndSettled(page);

        expect(requested, 'exactly one poster request, the one for this viewport').toEqual([assetPath(`/brand/connected-studio/${route}-${quality}.webp`)]);
        // `next dev` lists the engine chunk on every connected page, so the dev-only witness counts imports instead;
        // a production export has no hook, and the canvas assertion below holds either way.
        const reading = await readConnected(page);
        if (reading) {
          expect(reading.mode, 'a static page').toBe('static');
          expect(reading.imports, 'the engine import never started').toBe(0);
        }
        await expect(page.locator('canvas')).toHaveCount(0);
        // The poster layer paints the matching file; the CSS chart sits beneath it on the Ground itself.
        const poster = await page.locator('[data-connected-poster]').evaluate((element) => getComputedStyle(element).backgroundImage);
        expect(poster).toContain(`${route}-${quality}.webp`);
      });
    }

    test(`${locale} ${route} keeps its poster and no canvas under reduced motion`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      const requested = watchPosterRequests(page);
      await page.goto(appUrl(path));
      await waitForLoadedAndSettled(page);
      expect(requested).toEqual([assetPath(`/brand/connected-studio/${route}-wide.webp`)]);
      await expect(page.locator('canvas')).toHaveCount(0);
      await context.close();
    });

    test(`${locale} ${route} falls back to the CSS chart and stays complete when its poster fails to load`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const failures: string[] = [];
      page.on('pageerror', (error) => failures.push(error.message));
      await page.route(posterPattern, (route) => route.fulfill({ status: 404, body: 'missing' }));
      await page.goto(appUrl(path));
      await waitForLoadedAndSettled(page);

      await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
      const chart = await page.locator('[data-connected-ground]').evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(chart, 'the pure CSS chart is the Ground itself').toContain('gradient');
      await expect(page.locator('canvas')).toHaveCount(0);
      expect(failures).toEqual([]);
    });
  }

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    for (const { route, locale, path } of connectedPages) {
      test(`${locale} ${route} still paints its poster before any enhancement`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const requested = watchPosterRequests(page);
        await page.goto(appUrl(path));
        // No page.evaluate here: Firefox cannot run it with JavaScript disabled.
        await page.waitForLoadState('load');
        await page.waitForTimeout(800);
        expect(requested).toEqual([assetPath(`/brand/connected-studio/${route}-wide.webp`)]);
        await expect(page.locator('canvas')).toHaveCount(0);
      });
    }
  });
});

test.describe('project illustrations', () => {
  const projectPages = connectedPages.filter((entry) => entry.route === 'projects');
  const candidates = [640, 960, 1280, 1599];

  for (const { locale, path } of projectPages) {
    for (const width of [320, 768, 1024]) {
      test(`${locale} Projects reserves each illustration's 1599:900 box before it loads, at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        // Hold every illustration request so the box is measured with no pixels in it.
        const held: Route[] = [];
        await page.route(/conceptual-[a-z-]+(?:-\d+)?\.webp/, (route) => {
          held.push(route);
        });
        await page.goto(appUrl(path), { waitUntil: 'domcontentloaded' });

        const images = page.locator('main article img');
        await expect(images).toHaveCount(2);
        for (let index = 0; index < 2; index += 1) {
          const image = images.nth(index);
          await expect(image).toHaveAttribute('width', '1599');
          await expect(image).toHaveAttribute('height', '900');
          await expect(image).toHaveAttribute('loading', 'lazy');
          const box = await image.boundingBox();
          expect(box, 'the image has a box').not.toBeNull();
          expect(Math.abs(box!.height - (box!.width * 900) / 1599), `box ${box!.width}x${box!.height} keeps 1599:900`).toBeLessThanOrEqual(1);
        }
        await Promise.all(held.map((route) => route.abort()));
      });
    }

    test(`${locale} Projects offers the full candidate list and picks one that is sharp without being the original unless needed`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(appUrl(path));
      const images = page.locator('main article img');
      await expect(images).toHaveCount(2);

      for (let index = 0; index < 2; index += 1) {
        const image = images.nth(index);
        const srcset = (await image.getAttribute('srcset')) ?? '';
        expect(srcset.split(',').map((entry) => Number(entry.trim().split(/\s+/)[1]?.replace('w', ''))), 'every candidate is listed').toEqual(candidates);
        expect(srcset.split(',').every((entry) => entry.trim().startsWith(appPathname('/projects/'))), 'candidates carry the base path').toBe(true);

        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
        const { currentSrc, renderedWidth, density } = await image.evaluate((element: HTMLImageElement) => ({
          currentSrc: element.currentSrc,
          renderedWidth: element.getBoundingClientRect().width,
          density: window.devicePixelRatio,
        }));
        // With `w` descriptors `naturalWidth` is density-corrected, so the chosen candidate comes from its file name.
        const chosen = Number(/-(\d+)\.webp$/.exec(currentSrc)?.[1] ?? 1599);
        const required = Math.ceil(renderedWidth * density);
        const smallestSufficient = candidates.find((candidate) => candidate >= required) ?? candidates.at(-1)!;
        expect(candidates, `the browser chose ${currentSrc}`).toContain(chosen);
        // Browsers differ on ties, so the choice may be the smallest sufficient candidate or the next one up, never smaller.
        expect(chosen).toBeGreaterThanOrEqual(smallestSufficient);
        expect(chosen).toBeLessThanOrEqual(candidates[Math.min(candidates.indexOf(smallestSufficient) + 1, candidates.length - 1)]);
      }
    });

    test(`${locale} Projects preloads neither illustration nor poster, and marks both illustrations lazy`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(appUrl(path));
      await waitForLoadedAndSettled(page);

      // Next preloads fonts; the artwork is never preloaded. When a lazy image is fetched is the browser's
      // own distance threshold (Chromium reaches 2500px when it cannot read the connection), so the
      // contract asserted here is the attribute, not the moment.
      const preloaded = await page.locator('link[rel="preload"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
      expect(preloaded.filter((href) => /connected-studio|conceptual-/.test(href))).toEqual([]);
      await expect(page.locator('main article img[loading="lazy"]')).toHaveCount(2);
      await expect(page.locator('main article img[fetchpriority="high"]')).toHaveCount(0);
    });
  }
});

// PLAN-SFC-V1 Task 14: the matched static posters of the three Atlas pages. Their live host is policy-omitted in
// every merged build, so these pages are the complete static page: a poster over the CSS chart, no host, no canvas
// and no engine request. Three cases per page keep the shared-project case count inside the 3200 planning
// envelope (each case runs in every project that matches this file); the served-export family
// (sfc-production.spec.ts) owns the per-engine and closure proof.

const atlasPages = [
  { route: 'studio', locale: 'es', path: stableRoutes.studio.es },
  { route: 'studio', locale: 'en', path: stableRoutes.studio.en },
  { route: 'founder', locale: 'es', path: stableRoutes.founder.es },
  { route: 'founder', locale: 'en', path: stableRoutes.founder.en },
  { route: 'contact', locale: 'es', path: stableRoutes.contact.es },
  { route: 'contact', locale: 'en', path: stableRoutes.contact.en },
] as const;

test.describe('Atlas static posters', () => {
  const sizes = [
    { width: 320, quality: 'compact' },
    { width: 767, quality: 'compact' },
    { width: 768, quality: 'wide' },
    { width: 1440, quality: 'wide' },
  ] as const;

  for (const { route, locale, path } of atlasPages) {
    test(`${locale} ${route} requests only its own matching poster at each width, with no host and no canvas`, async ({ browser, baseURL }) => {
      // Four sequential page loads (one fresh context per width) against a cold dev compile need more than the default 30 s.
      test.setTimeout(60_000);
      for (const { width, quality } of sizes) {
        // A fresh context per width: a cached poster from the previous size would hide a second request.
        const context = await browser.newContext({ baseURL, viewport: { width, height: 800 } });
        const page = await context.newPage();
        const requested = watchPosterRequests(page);
        await page.goto(appUrl(path));
        await waitForLoadedAndSettled(page);

        expect(requested, `${width}px: exactly the ${quality} poster of this page`).toEqual([assetPath(`/brand/connected-studio/${route}-${quality}.webp`)]);
        const poster = await page.locator('[data-connected-poster]').evaluate((element) => getComputedStyle(element).backgroundImage);
        expect(poster, `${width}px: the poster layer paints the matching file`).toContain(`${route}-${quality}.webp`);
        await expect(page.locator('canvas')).toHaveCount(0);
        // The server omitted the live host: nothing hydrated, so no diagnostics hook exists to read.
        expect(await readConnected(page), `${width}px: no host on a policy-disabled page`).toBeNull();
        await expect(page.locator('[data-connected-ground] [data-connected-mount]')).toHaveCount(1);
        const preloads = await page.locator('link[rel="preload"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
        expect(preloads.filter((href) => /connected-studio/.test(href)), `${width}px: the poster is never preloaded`).toEqual([]);
        await context.close();
      }
    });

    test(`${locale} ${route} keeps its wide poster under reduced motion and stays complete on the CSS chart when the poster fails`, async ({ browser, baseURL }) => {
      test.setTimeout(60_000);
      const context = await browser.newContext({ baseURL, reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      const requested = watchPosterRequests(page);
      await page.goto(appUrl(path));
      await waitForLoadedAndSettled(page);
      expect(requested).toEqual([assetPath(`/brand/connected-studio/${route}-wide.webp`)]);
      await expect(page.locator('canvas')).toHaveCount(0);
      await context.close();

      const failing = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } });
      const failed = await failing.newPage();
      const errors: string[] = [];
      failed.on('pageerror', (error) => errors.push(error.message));
      await failed.route(posterPattern, (request) => request.fulfill({ status: 404, body: 'missing' }));
      await failed.goto(appUrl(path));
      await waitForLoadedAndSettled(failed);
      await expect(failed.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
      const chart = await failed.locator('[data-connected-ground]').evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(chart, 'the pure CSS chart is the Ground itself').toContain('gradient');
      await expect(failed.locator('canvas')).toHaveCount(0);
      expect(errors).toEqual([]);
      await failing.close();
    });
  }

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    for (const { route, locale, path } of atlasPages) {
      test(`${locale} ${route} still paints its poster before any enhancement`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const requested = watchPosterRequests(page);
        await page.goto(appUrl(path));
        await page.waitForLoadState('load');
        await page.waitForTimeout(800);
        expect(requested).toEqual([assetPath(`/brand/connected-studio/${route}-wide.webp`)]);
        await expect(page.locator('canvas')).toHaveCount(0);
      });
    }
  });
});
