import { expect, test } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const navigationLabels = {
  es: {
    navigation: 'Navegación principal',
    menu: 'Abrir navegación principal',
    links: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio'],
    primary: 'Ver contacto',
    alternate: 'en',
  },
  en: {
    navigation: 'Primary navigation',
    menu: 'Open primary navigation',
    links: ['Services', 'Work', 'How we work', 'About'],
    primary: 'Contact options',
    alternate: 'es-AR',
  },
} as const;

const detailRoutes = [
  stableRoutes.projects.es.replace(/\/$/, '/general-reservation-system/'),
  stableRoutes.projects.es.replace(/\/$/, '/the-system/'),
  stableRoutes.projects.es.replace(/\/$/, '/mpc-administracion/'),
  stableRoutes.projects.en.replace(/\/$/, '/general-reservation-system/'),
  stableRoutes.projects.en.replace(/\/$/, '/the-system/'),
  stableRoutes.projects.en.replace(/\/$/, '/mpc-administracion/'),
] as const;

const allRoutes = [
  stableRoutes.home.es,
  stableRoutes.home.en,
  stableRoutes.services.es,
  stableRoutes.services.en,
  stableRoutes.projects.es,
  stableRoutes.projects.en,
  stableRoutes.studio.es,
  stableRoutes.studio.en,
  stableRoutes.founder.es,
  stableRoutes.founder.en,
  stableRoutes.privacy.es,
  stableRoutes.privacy.en,
  stableRoutes.contact.es,
  stableRoutes.contact.en,
  ...detailRoutes,
] as const;

const desktopNavigationProjects = new Set([
  'chromium-desktop',
  'firefox-desktop',
  'webkit-desktop',
  'tablet-chromium',
  'wide-chromium',
]);

function localeFor(route: string) {
  return route.startsWith('/en/') ? navigationLabels.en : navigationLabels.es;
}

for (const route of allRoutes) {
  test('renders one predictable Contact action and four navigation subjects on ' + route, async ({ page }, testInfo) => {
    test.skip(!desktopNavigationProjects.has(testInfo.project.name), 'desktop navigation is covered by the compact disclosure tests on narrow projects');
    const labels = localeFor(route);
    await page.goto(appUrl(route));

    const header = page.getByRole('banner');
    const navigation = header.getByRole('navigation', { name: labels.navigation });
    const visibleLinks = navigation.getByRole('link');

    await expect(visibleLinks).toHaveCount(5);
    await expect(visibleLinks.nth(0)).toHaveText(labels.links[0]);
    await expect(visibleLinks.nth(1)).toHaveText(labels.links[1]);
    await expect(visibleLinks.nth(2)).toHaveText(labels.links[2]);
    await expect(visibleLinks.nth(3)).toHaveText(labels.links[3]);
    await expect(visibleLinks.nth(4)).toHaveText(labels.primary);
    await expect(navigation.getByRole('link', { name: labels.primary, exact: true })).toHaveCount(1);
    await expect(navigation.getByRole('link', { name: /contact|contacto/i })).toHaveCount(1);
  });
}

for (const route of detailRoutes) {
  test('keeps equivalent language switching in the footer for ' + route, async ({ page }) => {
    const labels = localeFor(route);
    const alternateRoute = route.startsWith('/en/')
      ? route.replace('/en/work/', '/proyectos/')
      : route.replace('/proyectos/', '/en/work/');

    await page.goto(appUrl(route));

    const footer = page.locator('footer');
    const languageSwitch = footer.locator('a[hreflang="' + labels.alternate + '"]');
    await expect(languageSwitch).toHaveCount(1);
    await expect(languageSwitch).toHaveAttribute('href', appPathname(alternateRoute));
    await expect(footer.getByText(/© \d{4} FURLANICH/)).toBeVisible();

    const directChannelHrefs = await footer
      .locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href')));
    expect(directChannelHrefs).toEqual([
      'https://wa.me/5491150117565',
      'mailto:samuelfurlanich@gmail.com',
      'tel:+5491150117565',
    ]);
  });
}

test.describe('enhanced mobile disclosure', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('closes after a same-page Process selection and focuses the visible destination heading', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const menu = page.locator('summary[aria-label="Abrir navegación principal"]');
    const details = menu.locator('xpath=ancestor::details');

    await menu.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await details.locator('nav').getByRole('link', { name: 'Cómo trabajamos', exact: true }).click();

    await expect(details).not.toHaveAttribute('open', '');
    await expect.poll(() => page.evaluate(() => ({
      focusedId: document.activeElement?.id,
      headingTop: document.getElementById('proceso-heading')?.getBoundingClientRect().top ?? -1,
      headerBottom: document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
    }))).toMatchObject({ focusedId: 'proceso-heading' });
    expect(await page.locator('#proceso-heading').boundingBox()).not.toBeNull();
  });

  test('closes on Escape and returns focus to the disclosure trigger', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const menu = page.locator('summary[aria-label="Abrir navegación principal"]');
    const details = menu.locator('xpath=ancestor::details');

    await menu.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(details).not.toHaveAttribute('open', '');
    await expect(menu).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(details).not.toHaveAttribute('open', '');
  });

  test('closes after a cross-page selection', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const menu = page.locator('summary[aria-label="Abrir navegación principal"]');

    await menu.press('Enter');
    await menu.locator('xpath=ancestor::details').locator('nav').getByRole('link', { name: 'Servicios', exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.services.es));
    await expect(page.locator('summary[aria-label="Abrir navegación principal"]').locator('xpath=ancestor::details')).not.toHaveAttribute('open', '');
  });
});

test.describe('native disclosure fallback', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('keeps the menu and ordinary links usable without JavaScript', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const menu = page.locator('summary[aria-label="Abrir navegación principal"]');
    const details = menu.locator('xpath=ancestor::details');

    await menu.click();
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('nav').getByRole('link', { name: 'Servicios', exact: true })).toBeVisible();
    await expect(details.locator('nav').getByRole('link', { name: 'Cómo trabajamos', exact: true })).toHaveAttribute(
      'href',
      appPathname(stableRoutes.home.es) + '#proceso',
    );
  });
});
