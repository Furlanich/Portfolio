import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { IDENTITY_TINT, backgroundOf, expectSequenceMarker, expectShortMonoOnly } from './support/editorial';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const projectCases = [
  {
    locale: 'Spanish',
    index: stableRoutes.projects.es,
    founder: stableRoutes.founder.es,
    titles: ['Gestión de reservas para transporte de pasajeros', 'Gestión multiusuario de campañas de rol'],
    relationship: 'Prototipo publicado por Samuel',
    limitation: 'Demostración pública no disponible',
    mpcTitle: 'MPC Administración',
    detailPrefix: '/proyectos/',
    serviceLabel: 'Sitios y aplicaciones web comerciales',
    founderLabel: 'Conocer la trayectoria de Samuel',
    publicationScope: 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.',
    groupHeadings: ['Contexto y oportunidad', 'Alcance implementado', 'Evidencia y límites', 'Siguientes destinos'],
    contact: stableRoutes.contact.es,
    finalHeading: '¿Necesitás resolver algo parecido?',
    finalAction: 'Hablar sobre tu proyecto',
    limitationsHeading: 'Limitaciones y alcance',
  },
  {
    locale: 'English',
    index: stableRoutes.projects.en,
    founder: stableRoutes.founder.en,
    titles: ['Passenger transport reservation management', 'Multi-user role-playing campaign management'],
    relationship: 'Prototype published by Samuel',
    limitation: 'No current public demo',
    mpcTitle: 'MPC Administración',
    detailPrefix: '/en/work/',
    serviceLabel: 'Commercial websites and web applications',
    founderLabel: "View Samuel's background",
    publicationScope: 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.',
    groupHeadings: ['Context and opportunity', 'Implemented scope', 'Evidence and limitations', 'Next destinations'],
    contact: stableRoutes.contact.en,
    finalHeading: 'Need to solve something similar?',
    finalAction: 'Discuss your project',
    limitationsHeading: 'Limitations and scope',
  },
] as const;

for (const projectCase of projectCases) {
  test(`${projectCase.locale} Projects selects GRS and Lab with editorial priority`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(projectCase.index));

    const main = page.getByRole('main');
    const cards = main.locator('[data-project-slug]');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toHaveAttribute('data-project-slug', 'general-reservation-system');
    await expect(cards.nth(0)).toHaveAttribute('data-project-presentation', 'lead');
    await expect(cards.nth(1)).toHaveAttribute('data-project-slug', 'the-system');
    await expect(cards.nth(1)).toHaveAttribute('data-project-presentation', 'secondary');
    await expect(main.getByText(projectCase.titles[0], { exact: true })).toBeVisible();
    await expect(main.getByText(projectCase.titles[1], { exact: true })).toBeVisible();
    await expect(main.getByText(projectCase.mpcTitle, { exact: true })).toHaveCount(0);
    await expect(main.getByText(projectCase.relationship)).toBeVisible();
    await expect(main.getByText(projectCase.limitation)).toBeVisible();

    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      const lead = await cards.nth(0).boundingBox();
      const secondary = await cards.nth(1).boundingBox();
      expect(lead?.width).toBeGreaterThan(secondary?.width ?? 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    assertNoBrowserErrors();
  });

  test(`${projectCase.locale} Founder exposes the educational MPC detail from education`, async ({ page }) => {
    await page.goto(appUrl(projectCase.founder));

    const education = page.locator('section[aria-labelledby="founder-education-heading"]');
    await expect(education.getByText(projectCase.mpcTitle, { exact: true })).toBeVisible();
    await expect(education.getByText(/(?:Trabajo educativo grupal|Educational group work) · 2021/)).toBeVisible();
    await expect(education.getByText(/fictic|ficticio|fictional/i)).toBeVisible();
    await expect(education.getByRole('link')).toHaveAttribute('href', appPathname(`${projectCase.detailPrefix}mpc-administracion/`));
  });

  for (const slug of ['general-reservation-system', 'the-system', 'mpc-administracion'] as const) {
    test(`${projectCase.locale} ${slug} detail preserves evidence boundaries and grouped reading order`, async ({ page }) => {
      await page.goto(appUrl(`${projectCase.detailPrefix}${slug}/`));

      const main = page.getByRole('main');
      await expect(main.locator('[data-detail-group]')).toHaveCount(4);
      for (const heading of projectCase.groupHeadings) {
        await expect(main.getByRole('heading', { name: heading, exact: true })).toBeVisible();
      }
      const publicationScope =
        slug === 'mpc-administracion'
          ? projectCase.locale === 'Spanish'
            ? 'La descripción pública está limitada por el contexto educativo y los permisos de publicación. La imagen es conceptual y no muestra una interfaz real.'
            : 'The public description is limited by the educational context and publication permissions. The image is conceptual and does not show a real interface.'
          : projectCase.publicationScope;
      await expect(main.getByText(publicationScope, { exact: true })).toBeVisible();
      await expect(main.getByRole('link', { name: /external link|enlace externo/i })).toHaveCount(1);

      if (slug === 'mpc-administracion') {
        await expect(main.getByRole('link', { name: projectCase.serviceLabel, exact: true })).toHaveCount(0);
        await expect(main.getByRole('link', { name: projectCase.founderLabel, exact: true })).toHaveAttribute(
          'href',
          appPathname(projectCase.founder),
        );
      } else {
        await expect(main.getByRole('link', { name: projectCase.serviceLabel, exact: true })).toHaveAttribute(
          'href',
          projectCase.locale === 'Spanish' ? appPathname('/servicios/') + '#web' : appPathname('/en/services/') + '#web',
        );
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
}

for (const projectCase of projectCases) {
  test(`${projectCase.locale} Projects keeps evidence cards bounded and ends on the inquiry band`, async ({ page }) => {
    await page.goto(appUrl(projectCase.index));
    const main = page.getByRole('main');
    const cards = main.locator('[data-project-slug]');

    for (const card of await cards.all()) {
      await expect(card.getByRole('link')).toHaveCount(1);
      await expect(card).not.toHaveAttribute('tabindex', /.*/);
      expect(await card.evaluate((element) => getComputedStyle(element).cursor)).not.toBe('pointer');
      await expect(card.locator('[data-project-meta]')).toBeVisible();
    }

    const mono = await expectShortMonoOnly(main);
    expect(mono.length).toBeGreaterThan(0);

    const ending = main.locator('section[aria-labelledby="projects-cta-heading"]');
    await expect(ending.getByRole('heading', { level: 2, name: projectCase.finalHeading, exact: true })).toBeVisible();
    await expect(ending.getByRole('link', { name: projectCase.finalAction, exact: true })).toHaveAttribute('href', appPathname(projectCase.contact));
    expect(await backgroundOf(ending)).toBe(IDENTITY_TINT);
  });

  test(`${projectCase.locale} project detail numbers its groups and keeps limitations in a bounded panel`, async ({ page }) => {
    await page.goto(appUrl(`${projectCase.detailPrefix}general-reservation-system/`));
    const main = page.getByRole('main');

    const groups = main.locator('[data-detail-group]');
    for (const [index, heading] of projectCase.groupHeadings.entries()) {
      const group = groups.nth(index);
      await expect(group.getByRole('heading', { level: 2, name: heading, exact: true })).toBeVisible();
      await expectSequenceMarker(group, String(index + 1).padStart(2, '0'));
    }

    const limitations = main.locator('[data-detail-limitations]');
    await expect(limitations.getByRole('heading', { level: 3, name: projectCase.limitationsHeading, exact: true })).toBeVisible();
    await expect(limitations.getByText(projectCase.publicationScope, { exact: true })).toBeVisible();
    expect(await limitations.evaluate((element) => getComputedStyle(element).borderTopStyle)).toBe('solid');

    await expectShortMonoOnly(main);

    const ending = main.locator('section[aria-labelledby="detail-cta-heading"]');
    await expect(ending.getByRole('link', { name: projectCase.finalAction, exact: true })).toHaveAttribute('href', appPathname(projectCase.contact));
    expect(await backgroundOf(ending)).toBe(IDENTITY_TINT);
  });
}

test('MPC education link remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(appUrl(stableRoutes.founder.es));
  await page.getByRole('link', { name: 'Ver proyecto educativo' }).click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname('/proyectos/mpc-administracion/'));
  await context.close();
});
