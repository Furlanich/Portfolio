import { expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

test.describe.configure({ timeout: 60_000 });

const routeCases = [
  {
    name: 'Spanish Privacy',
    route: stableRoutes.privacy.es,
    language: 'es-AR',
    heading: 'Privacidad de esta demostración',
    introduction:
      'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.',
    sections: [
      'Qué ocurre con los datos del formulario',
      'Alojamiento y datos técnicos',
      'Alternativas externas',
      'Información sensible',
      'Conservación y consultas',
      'Activación comercial futura',
    ],
    githubLabel: 'Ver la declaración de privacidad de GitHub',
  },
  {
    name: 'English Privacy',
    route: stableRoutes.privacy.en,
    language: 'en',
    heading: 'Privacy in this demonstration',
    introduction:
      'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.',
    sections: [
      'What happens to form data',
      'Hosting and technical data',
      'External alternatives',
      'Sensitive information',
      'Retention and questions',
      'Future commercial activation',
    ],
    githubLabel: "View GitHub's privacy statement",
  },
] as const;

for (const pageCase of routeCases) {
  test(pageCase.name + ' renders its approved content', async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const response = await page.goto(appUrl(pageCase.route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', pageCase.language);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1:visible')).toHaveText(pageCase.heading);
    await expect(page.locator('main p').first()).toHaveText(pageCase.introduction);

    for (const section of pageCase.sections) {
      await expect(page.getByRole('heading', { level: 2, name: section })).toBeVisible();
    }

    await expect(page.getByRole('main').getByRole('link', { name: pageCase.githubLabel })).toHaveAttribute(
      'href',
      'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
    );
    await expect(page.locator('form')).toHaveCount(0);
    assertNoBrowserErrors();
  });
}

async function switchLanguage(page: Page, language: string, route: string) {
  await Promise.all([
    page.waitForURL((url) => url.pathname === appPathname(route)),
    page.locator('a[hreflang="' + language + '"]').click(),
  ]);
}

test('Privacy language switching preserves the paired route', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.privacy.es));
  await switchLanguage(page, 'en', stableRoutes.privacy.en);

  await page.goto(appUrl(stableRoutes.privacy.en));
  await switchLanguage(page, 'es-AR', stableRoutes.privacy.es);
});

test('Privacy footer links resolve to the localized Privacy route', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.privacy.es));
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacidad' })).toHaveAttribute(
    'href',
    appPathname(stableRoutes.privacy.es),
  );

  await page.goto(appUrl(stableRoutes.privacy.en));
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })).toHaveAttribute(
    'href',
    appPathname(stableRoutes.privacy.en),
  );
});
