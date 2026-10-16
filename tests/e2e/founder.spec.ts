import { expect, test } from '@playwright/test';
import { expectShortMonoOnly } from './support/editorial';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const founderCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.founder.es,
    alternateLocale: 'en',
    alternateRoute: stableRoutes.founder.en,
    professionalHeading: 'Perfil profesional',
    experienceHeading: 'Experiencia profesional',
    educationHeading: 'Formación',
    biographyHeading: 'Biografía profesional',
    capabilitiesHeading: 'Capacidades para construir y mejorar sistemas',
    projectsHeading: 'Trabajo y evidencia técnica',
    finalHeading: '¿Querés conversar sobre una necesidad de tu negocio?',
    biography: [
      'Samuel Furlanich es ingeniero de software y fundador de FURLANICH. Trabaja de forma independiente desde 2024, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones.',
      'Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor.',
      'También se desempeña como Software Developer en Clever Soft SA, experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
    ],
    projectsDescription: 'Los proyectos públicos permiten explorar código, contexto y límites.',
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
    biographyHeading: 'Professional biography',
    capabilitiesHeading: 'Capabilities for building and improving systems',
    projectsHeading: 'Work and technical evidence',
    finalHeading: 'Want to discuss a business need?',
    biography: [
      'Samuel Furlanich is a Software Engineer and the founder of FURLANICH. He has worked independently since 2024, designing and maintaining web and desktop applications, management systems, and automations.',
      'He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor.',
      'He also works as a Software Developer at Clever Soft SA, experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.',
    ],
    projectsDescription: 'The public projects let you explore code, context and limitations.',
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
      founderCase.biographyHeading,
      founderCase.educationHeading,
      founderCase.capabilitiesHeading,
      founderCase.projectsHeading,
      founderCase.finalHeading,
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    const biography = page.locator('[data-founder-biography]');
    await expect(biography.getByRole('heading', { name: founderCase.biographyHeading })).toBeVisible();
    await expect(biography.locator('[data-founder-biography-paragraph]')).toHaveText([...founderCase.biography]);
    await expect(page.getByText(founderCase.projectsDescription, { exact: true })).toBeVisible();
    const experience = page.getByRole('region', { name: founderCase.experienceHeading });
    const introPlate = page.locator('[data-founder-intro-plate]');
    const historyPlate = page.locator('[data-founder-history-plate]');
    await expect(introPlate).toContainText(founderCase.biography[0]);
    await expect(introPlate.getByRole('region', { name: founderCase.professionalHeading })).toBeVisible();
    await expect(page.locator('#connected-pause-founder')).toContainText(
      founderCase.locale === 'Spanish' ? 'Fondo estático' : 'Static background',
    );
    const experienceBox = await experience.boundingBox();
    const biographyBox = await biography.boundingBox();
    const linksBox = await page.getByRole('region', { name: founderCase.professionalHeading }).boundingBox();
    const introBox = await introPlate.boundingBox();
    const historyBox = await historyPlate.boundingBox();
    expect(experienceBox).not.toBeNull();
    expect(biographyBox).not.toBeNull();
    expect(linksBox).not.toBeNull();
    expect(introBox).not.toBeNull();
    expect(historyBox).not.toBeNull();
    expect(biographyBox!.y).toBeGreaterThan(introBox!.y);
    expect(linksBox!.y).toBeGreaterThan(biographyBox!.y);
    expect(experienceBox!.y).toBeGreaterThan(linksBox!.y);
    expect(historyBox!.y).toBeGreaterThan(introBox!.y);

    const capabilityGroups = page.locator('[data-founder-capability-group]');
    const references = await capabilityGroups.evaluateAll((groups) => groups.map((group) => ({
      reference: group.getAttribute('aria-labelledby'),
      heading: group.querySelector('h3')?.id,
    })));
    expect(references).toHaveLength(4);
    expect(new Set(references.map(({ reference }) => reference)).size).toBe(4);
    for (const { reference, heading } of references) {
      expect(reference).toBeTruthy();
      expect(heading).toBe(reference);
      expect(reference).not.toMatch(/\s/);
    }

    await expect(page.getByRole('main').getByRole('link', { name: founderCase.projectsLabel })).toHaveAttribute(
      'href',
      appPathname(founderCase.projectsRoute) + '#site-top',
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
    await expect(page.getByRole('main').locator('[data-connected-mount]')).toHaveAttribute(
      'data-word-bindings',
      JSON.stringify([
        { nodeId: 'n0', word: '.NET' },
        { nodeId: 'n4', word: 'React' },
        { nodeId: 'n8', word: 'Next.js' },
        { nodeId: 'n12', word: 'Blazor' },
      ]),
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

    await page.getByRole('banner').locator('a[hreflang="' + founderCase.alternateLocale + '"]').click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(founderCase.alternateRoute));
  });

  test(`${founderCase.locale} Founder downloads the unchanged CV as a valid PDF`, async ({ page }) => {
    await page.goto(appUrl(founderCase.route));

    const cv = page.getByRole('main').getByRole('link', { name: founderCase.cvLabel, exact: true });
    await expect(cv).toHaveAttribute('download', 'Samuel-Furlanich-CV.pdf');
    const response = await page.request.get(new URL(appPathname('/Samuel-Furlanich-CV.pdf'), page.url()).toString());
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');

    const [download] = await Promise.all([page.waitForEvent('download'), cv.click()]);
    expect(download.suggestedFilename()).toBe('Samuel-Furlanich-CV.pdf');
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
    contactFounderLabel: 'Conocer la trayectoria de Samuel',
    projectFounderLabel: 'Conocer a Samuel',
    founderRoute: stableRoutes.founder.es,
    projectsRoute: stableRoutes.projects.es,
  },
  {
    locale: 'English',
    contactRoute: '/en/contact/',
    contactActionLabels: ['Write on WhatsApp', 'Send an email', 'Call'],
    contactFounderLabel: "View Samuel's background",
    projectFounderLabel: 'Meet Samuel',
    founderRoute: stableRoutes.founder.en,
    projectsRoute: stableRoutes.projects.en,
  },
] as const;

for (const integrationCase of integrationCases) {
  test(`${integrationCase.locale} Contact exposes Founder context after direct contact choices`, async ({ page }) => {
    await page.goto(appUrl(integrationCase.contactRoute));

    const main = page.getByRole('main');
    const founderLink = main.getByRole('link', { name: integrationCase.contactFounderLabel });
    await expect(founderLink).toHaveAttribute('href', appPathname(integrationCase.founderRoute));

    const linkOrder = await main.getByRole('link').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).textContent?.trim()),
    );
    expect(linkOrder.slice(-1)[0]).toBe(integrationCase.contactFounderLabel);
    expect(linkOrder.filter((label) => integrationCase.contactActionLabels.includes(label as never))).toEqual(
      integrationCase.contactActionLabels,
    );
  });

  // Dated 2026-10-06 (PLAN-SPF-V1 Task 3): the project-detail pages are retired, so Founder context now
  // belongs to the two index dossiers. MPC is not on Projects; its Founder context links to its source.
  test(`${integrationCase.locale} Projects dossiers expose Founder context only when evidence authorizes it`, async ({ page }) => {
    await page.goto(appUrl(integrationCase.projectsRoute));
    const founderLinks = page.getByRole('main').getByRole('link', { name: integrationCase.projectFounderLabel, exact: true });
    await expect(founderLinks).toHaveCount(2);
    for (const link of await founderLinks.all()) {
      await expect(link).toHaveAttribute('href', appPathname(integrationCase.founderRoute));
    }
  });
}

const founderEditorialCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.founder.es,
    headings: [
      'Biografía profesional',
      'Perfil profesional',
      'Experiencia profesional',
      'Formación',
      'Capacidades para construir y mejorar sistemas',
      'Trabajo y evidencia técnica',
      '¿Querés conversar sobre una necesidad de tu negocio?',
    ],
  },
  {
    locale: 'English',
    route: stableRoutes.founder.en,
    headings: [
      'Professional biography',
      'Professional profile',
      'Professional experience',
      'Education',
      'Capabilities for building and improving systems',
      'Work and technical evidence',
      'Want to discuss a business need?',
    ],
  },
] as const;

for (const founderCase of founderEditorialCases) {
  test(`${founderCase.locale} Founder uses the section heading scale and mono period metadata`, async ({ page }) => {
    await page.goto(appUrl(founderCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h2')).toHaveText([...founderCase.headings]);
    for (const [index, heading] of founderCase.headings.entries()) {
      if (index === 1) continue;
      const size = await main.getByRole('heading', { level: 2, name: heading, exact: true })
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      expect(size, `${heading} uses the approved section H2 scale`).toBeGreaterThanOrEqual(32);
    }

    const periods = main.locator('[data-founder-period]');
    await expect(periods).toHaveCount(2);
    for (const period of await periods.all()) {
      expect(await period.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/plexMono/i);
    }
    await expectShortMonoOnly(main);
  });
}
