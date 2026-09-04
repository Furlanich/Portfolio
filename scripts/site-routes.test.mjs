import test from 'node:test';
import assert from 'node:assert/strict';

const {
  foundationRouteIds,
  foundationRoutes,
  getFoundationPath,
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

test('returns working navigation links and the equivalent-language destination', () => {
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
        },
        {
          home: expectedRoutes.home[locale],
          services: expectedRoutes.services[locale],
          contact: expectedRoutes.contact[locale],
          founder: expectedRoutes.founder[locale],
        },
      );
      assert.equal(paths.alternateLocale, alternateLocale);
      assert.equal(paths.alternateHref, expectedRoutes[currentRouteId][alternateLocale]);
    }
  }
});
