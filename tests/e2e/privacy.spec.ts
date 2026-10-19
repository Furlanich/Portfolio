import { expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

test.describe.configure({ timeout: 60_000 });

const routeCases = [
  {
    name: 'Spanish Privacy',
    route: stableRoutes.privacy.es,
    language: 'es-AR',
    heading: 'Privacidad y contacto',
    introduction:
      'Esta página explica qué ocurre al navegar por el sitio y al contactar a Samuel Furlanich por los canales publicados.',
    sections: ["Responsable y contacto","Contacto directo","Alojamiento y datos técnicos","Preferencias de navegación","Información que compartís","Mensajes y solicitudes sobre tus datos"],
    githubLabel: 'Ver la declaración de privacidad de GitHub',
  },
  {
    name: 'English Privacy',
    route: stableRoutes.privacy.en,
    language: 'en',
    heading: 'Privacy and contact',
    introduction:
      'This page explains what happens when you browse the website and contact Samuel Furlanich through the published channels.',
    sections: ["Responsible party and contact","Direct contact","Hosting and technical data","Browsing preferences","Information you share","Messages and requests about your information"],
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
    const contents = page.getByRole('navigation', { name: pageCase.language === 'es-AR' ? 'Contenido' : 'Contents' });
    await expect(contents.getByRole('listitem')).toHaveCount(pageCase.sections.length);

    for (const section of pageCase.sections) {
      await expect(page.getByRole('heading', { level: 2, name: section })).toBeVisible();
    }

    await expect(page.getByRole('main').getByRole('link', { name: pageCase.githubLabel })).toHaveAttribute(
      'href',
      'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
    );
    await expect(page.getByRole('main').getByRole('link', { name: pageCase.githubLabel })).not.toHaveAttribute('target', '_blank');
    await expect(page.locator('form')).toHaveCount(0);
    assertNoBrowserErrors();
  });
}

test('Privacy contents links stay below the sticky App Bar', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.privacy.es));
  const link = page.getByRole('navigation', { name: 'Contenido' }).getByRole('link').first();
  const targetId = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(new RegExp('#' + targetId?.slice(1) + '$'));
  const target = page.locator(targetId ?? '');
  const targetTop = await target.evaluate((element) => element.getBoundingClientRect().top);
  const appBarBottom = await page.getByRole('banner').evaluate((element) => element.getBoundingClientRect().bottom);
  expect(targetTop).toBeGreaterThanOrEqual(appBarBottom - 1);
});

async function switchLanguage(page: Page, language: string, route: string) {
  await Promise.all([
    page.waitForURL((url) => url.pathname === appPathname(route)),
    page.getByRole('banner').locator('a[hreflang="' + language + '"]').click(),
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
