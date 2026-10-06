import test from 'node:test';
import assert from 'node:assert/strict';

const {
  foundationRouteIds,
  foundationRoutes,
  getFoundationPath,
  homeProcessAnchors,
  getHomeProcessHref,
  getProjectDossierHref,
  projectDossierSlugs,
  serviceSectionIds,
  serviceSectionAnchors,
  getServiceSectionHref,
} = await import('../lib/site-routes.ts');
const siteRoutes = await import('../lib/site-routes.ts');
const foundationNavigation = await import('../lib/foundation-navigation.ts');
const { getFoundationNavigationPaths } = foundationNavigation;

const expectedRoutes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  projects: { es: '/proyectos/', en: '/en/work/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  studio: { es: '/estudio/', en: '/en/about/' },
  founder: {
    es: '/estudio/samuel-furlanich/',
    en: '/en/about/samuel-furlanich/',
  },
};

test('defines the exact foundation route ids and localized paths', () => {
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'projects', 'contact', 'privacy', 'studio', 'founder']);
  assert.deepEqual(foundationRoutes, expectedRoutes);

  const paths = foundationRouteIds.flatMap((routeId) => [
    foundationRoutes[routeId].es,
    foundationRoutes[routeId].en,
  ]);

  assert.equal(new Set(paths).size, 14);
  assert.ok(paths.filter((path) => path !== '/').every((path) => path.endsWith('/')));
});

test('resolves each semantic route id to its locale-specific path', () => {
  for (const routeId of foundationRouteIds) {
    assert.equal(getFoundationPath(routeId, 'es'), expectedRoutes[routeId].es);
    assert.equal(getFoundationPath(routeId, 'en'), expectedRoutes[routeId].en);
  }
});

test('resolves the localized homepage Process anchor without adding a route', () => {
  assert.deepEqual(homeProcessAnchors, { es: 'proceso', en: 'process' });
  assert.equal(getHomeProcessHref('es'), '/#proceso');
  assert.equal(getHomeProcessHref('en'), '/en/#process');
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'projects', 'contact', 'privacy', 'studio', 'founder']);
});

test('resolves localized Services fragments without adding routes', () => {
  assert.deepEqual(serviceSectionIds, ['web', 'whatsapp', 'consulting']);
  assert.deepEqual(serviceSectionAnchors, {
    web: { es: 'web', en: 'web' },
    whatsapp: { es: 'whatsapp', en: 'whatsapp' },
    consulting: { es: 'consultoria', en: 'consulting' },
  });
  assert.equal(getServiceSectionHref('es', 'web'), '/servicios/#web');
  assert.equal(getServiceSectionHref('es', 'whatsapp'), '/servicios/#whatsapp');
  assert.equal(getServiceSectionHref('es', 'consulting'), '/servicios/#consultoria');
  assert.equal(getServiceSectionHref('en', 'web'), '/en/services/#web');
  assert.equal(getServiceSectionHref('en', 'whatsapp'), '/en/services/#whatsapp');
  assert.equal(getServiceSectionHref('en', 'consulting'), '/en/services/#consulting');
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'projects', 'contact', 'privacy', 'studio', 'founder']);
});

test('resolves the two Projects dossiers as the localized index plus a stable fragment', () => {
  assert.deepEqual(projectDossierSlugs, ['general-reservation-system', 'the-system']);
  assert.equal(getProjectDossierHref('es', 'general-reservation-system'), '/proyectos/#general-reservation-system');
  assert.equal(getProjectDossierHref('es', 'the-system'), '/proyectos/#the-system');
  assert.equal(getProjectDossierHref('en', 'general-reservation-system'), '/en/work/#general-reservation-system');
  assert.equal(getProjectDossierHref('en', 'the-system'), '/en/work/#the-system');
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'projects', 'contact', 'privacy', 'studio', 'founder']);
});

test('fails closed for a dossier slug outside the approved pair, including the retired MPC slug', () => {
  for (const slug of ['mpc-administracion', 'unknown', '', '__proto__']) {
    assert.throws(() => getProjectDossierHref('es', slug), RangeError, slug);
    assert.throws(() => getProjectDossierHref('en', slug), RangeError, slug);
  }
});

// Dated negative (2026-10-06, PLAN-SPF-V1 Task 3): the six project-detail destinations are retired,
// so their route helpers no longer exist. This replaces the former positive detail-path assertions.
test('no helper builds a retired project-detail destination', () => {
  assert.equal('getProjectDetailPath' in siteRoutes, false);
  assert.equal('getProjectDetailNavigationPaths' in foundationNavigation, false);
});

test('returns working navigation links, Projects, Process, and the equivalent-language destination', () => {
  for (const locale of ['es', 'en']) {
    const alternateLocale = locale === 'es' ? 'en' : 'es';

    for (const currentRouteId of foundationRouteIds) {
      const paths = getFoundationNavigationPaths(locale, currentRouteId);

      assert.deepEqual(
        {
          home: paths.home,
          services: paths.services,
          projects: paths.projects,
          contact: paths.contact,
          studio: paths.studio,
          founder: paths.founder,
          process: paths.process,
        },
        {
          home: expectedRoutes.home[locale],
          services: expectedRoutes.services[locale],
          projects: expectedRoutes.projects[locale],
          contact: expectedRoutes.contact[locale],
          studio: expectedRoutes.studio[locale],
          founder: expectedRoutes.founder[locale],
          process: getHomeProcessHref(locale),
        },
      );
      assert.equal(paths.alternateLocale, alternateLocale);
      assert.equal(paths.alternateHref, expectedRoutes[currentRouteId][alternateLocale]);
    }
  }
});
