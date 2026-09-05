import test from 'node:test';
import assert from 'node:assert/strict';

const {
  foundationRouteIds,
  foundationRoutes,
  getFoundationPath,
  homeProcessAnchors,
  getHomeProcessHref,
  serviceSectionIds,
  serviceSectionAnchors,
  getServiceSectionHref,
} = await import('../lib/site-routes.ts');
const { getFoundationNavigationPaths } = await import('../lib/foundation-navigation.ts');

const expectedRoutes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  founder: {
    es: '/estudio/samuel-furlanich/',
    en: '/en/about/samuel-furlanich/',
  },
};

test('defines the exact foundation route ids and localized paths', () => {
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'contact', 'founder']);
  assert.deepEqual(foundationRoutes, expectedRoutes);

  const paths = foundationRouteIds.flatMap((routeId) => [
    foundationRoutes[routeId].es,
    foundationRoutes[routeId].en,
  ]);

  assert.equal(new Set(paths).size, 8);
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
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'contact', 'founder']);
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
  assert.deepEqual(foundationRouteIds, ['home', 'services', 'contact', 'founder']);
});

test('returns working navigation links, Process, and the equivalent-language destination', () => {
  for (const locale of ['es', 'en']) {
    const alternateLocale = locale === 'es' ? 'en' : 'es';

    for (const currentRouteId of foundationRouteIds) {
      const paths = getFoundationNavigationPaths(locale, currentRouteId);

      assert.deepEqual(
        {
          home: paths.home,
          services: paths.services,
          contact: paths.contact,
          founder: paths.founder,
          process: paths.process,
        },
        {
          home: expectedRoutes.home[locale],
          services: expectedRoutes.services[locale],
          contact: expectedRoutes.contact[locale],
          founder: expectedRoutes.founder[locale],
          process: getHomeProcessHref(locale),
        },
      );
      assert.equal(paths.alternateLocale, alternateLocale);
      assert.equal(paths.alternateHref, expectedRoutes[currentRouteId][alternateLocale]);
    }
  }
});
