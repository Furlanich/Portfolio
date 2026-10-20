import { readFileSync } from 'node:fs';
import path from 'node:path';
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
      'Samuel Furlanich es ingeniero de software y fundador de FURLANICH. Trabaja de forma independiente desde 2023, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones.',
      'Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor.',
      'También se desempeña como Software Developer en CleverSoft S.A., experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
    ],
    projectsDescription: 'Los proyectos públicos permiten explorar código, contexto y límites.',
    cvLabel: 'Descargar CV',
    cvPath: '/Samuel-Furlanich-CV-ES.pdf',
    cvFile: 'Samuel-Furlanich-CV-ES.pdf',
    firstEntry: {
      period: 'Desde junio de 2026',
      role: 'Software Developer',
      context: 'CleverSoft S.A.',
      summary:
        'Ingreso como analista de soporte (Support Analyst) y posterior paso a Software Developer. Mantenimiento y desarrollo de soluciones ERP y de software para la resolución de pagos.',
    },
    periods: ['Desde junio de 2026', 'Desde 2023', '2021'],
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
      'Samuel Furlanich is a Software Engineer and the founder of FURLANICH. He has worked independently since 2023, designing and maintaining web and desktop applications, management systems, and automations.',
      'He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor.',
      'He also works as a Software Developer at CleverSoft S.A., experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.',
    ],
    projectsDescription: 'The public projects let you explore code, context and limitations.',
    cvLabel: 'Download CV',
    cvPath: '/Samuel-Furlanich-CV-EN.pdf',
    cvFile: 'Samuel-Furlanich-CV-EN.pdf',
    firstEntry: {
      period: 'Since June 2026',
      role: 'Software Developer',
      context: 'CleverSoft S.A.',
      summary:
        'Joined as a Support Analyst and later moved into the Software Developer role. Maintenance and development of ERP and payment-resolution software.',
    },
    periods: ['Since June 2026', 'Since 2023', '2021'],
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
    const cvLink = page.getByRole('main').getByRole('link', { name: founderCase.cvLabel });
    await expect(cvLink).toHaveAttribute('href', appPathname(founderCase.cvPath).replace(/\/$/, ''));
    await expect(cvLink).toHaveAttribute('download', founderCase.cvFile);

    const entries = experience.getByRole('listitem');
    await expect(entries).toHaveCount(3);
    await expect(entries.locator('[data-founder-period]')).toHaveText([...founderCase.periods]);
    const first = entries.first();
    await expect(first.locator('[data-founder-period]')).toHaveText(founderCase.firstEntry.period);
    await expect(first.getByRole('heading', { level: 3, name: founderCase.firstEntry.role, exact: true })).toBeVisible();
    await expect(first).toContainText(founderCase.firstEntry.context);
    await expect(first).toContainText(founderCase.firstEntry.summary);
    await expect(first.getByRole('heading')).not.toContainText(founderCase.firstEntry.context);
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
    const [keyboardDownload] = await Promise.all([page.waitForEvent('download'), page.keyboard.press('Enter')]);
    expect(keyboardDownload.suggestedFilename()).toBe(founderCase.cvFile);
    await expect(page).toHaveURL(appUrl(founderCase.route));
    await expect(actions.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(actions.nth(1)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(actions.nth(2)).toBeFocused();

    await page.getByRole('banner').locator('a[hreflang="' + founderCase.alternateLocale + '"]').click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(founderCase.alternateRoute));
  });

  test(`${founderCase.locale} Founder downloads its own localized CV as a valid PDF`, async ({ page }) => {
    const otherCase = founderCases.find((candidate) => candidate !== founderCase)!;
    const source = (file: string) => readFileSync(path.join(process.cwd(), 'public', file));

    async function downloadCv(current: typeof founderCase) {
      const cv = page.getByRole('main').getByRole('link', { name: current.cvLabel, exact: true });
      await expect(cv).toHaveAttribute('download', current.cvFile);
      const response = await page.request.get(new URL(appPathname(current.cvPath).replace(/\/$/, ''), page.url()).toString());
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('application/pdf');
      const served = await response.body();
      expect(served.subarray(0, 5).toString()).toBe('%PDF-');
      expect(served.equals(source(current.cvFile))).toBe(true);

      const [download] = await Promise.all([page.waitForEvent('download'), cv.click()]);
      expect(download.suggestedFilename()).toBe(current.cvFile);
      expect(await download.failure()).toBeNull();
      expect(readFileSync((await download.path())!).equals(source(current.cvFile))).toBe(true);
    }

    await page.goto(appUrl(founderCase.route));
    await downloadCv(founderCase);
    expect(source(founderCase.cvFile).equals(source(otherCase.cvFile))).toBe(false);

    // The other locale supplies its own file with no stale state from this one.
    await page.getByRole('banner').locator('a[hreflang="' + founderCase.alternateLocale + '"]').click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(founderCase.alternateRoute));
    await downloadCv(otherCase);
  });

  test(founderCase.locale + ' Founder keeps periods attached to their experience entries on compact layout', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(founderCase.route));

    const entries = page.getByRole('region', { name: founderCase.experienceHeading }).getByRole('listitem');
    await expect(entries).toHaveCount(3);
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
    await expect(periods).toHaveCount(3);
    for (const period of await periods.all()) {
      expect(await period.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/plexMono/i);
    }
    await expectShortMonoOnly(main);
  });
}
