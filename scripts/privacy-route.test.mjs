import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routeDefinitions = [
  { locale: 'es', path: '../app/(es)/privacidad/page.tsx', contentImport: "from '../_content/privacy'" },
  { locale: 'en', path: '../app/(en)/en/privacy/page.tsx', contentImport: "from '../_content/privacy'" },
];

const footerRouteFiles = [
  '../app/(es)/page.tsx', '../app/(es)/servicios/page.tsx', '../app/(es)/proyectos/page.tsx',
  '../app/(es)/proyectos/[projectSlug]/page.tsx', '../app/(es)/estudio/page.tsx',
  '../app/(es)/estudio/samuel-furlanich/page.tsx', '../app/(es)/contacto/page.tsx',
  '../app/(en)/en/page.tsx', '../app/(en)/en/services/page.tsx', '../app/(en)/en/work/page.tsx',
  '../app/(en)/en/work/[projectSlug]/page.tsx', '../app/(en)/en/about/page.tsx',
  '../app/(en)/en/about/samuel-furlanich/page.tsx', '../app/(en)/en/contact/page.tsx',
];

for (const definition of routeDefinitions) {
  test(definition.locale + ' Privacy route owns its locale and shared page', async () => {
    let source;
    try {
      source = await readFile(new URL(definition.path, import.meta.url), 'utf8');
    } catch (error) {
      assert.fail('Privacy route is missing: ' + definition.path + ' (' + error.code + ')');
    }
    assert.ok(source.includes("import { PrivacyPage } from '@/components/privacy/PrivacyPage'"));
    assert.ok(source.includes("routeId: 'privacy'"));
    assert.ok(source.includes("locale: '" + definition.locale + "'"));
    assert.equal(source.includes(definition.contentImport), true);
    assert.ok(source.includes('getFoundationNavigationPaths(route.locale, route.routeId)'));
    assert.equal(source.includes(definition.locale === 'es' ? '(en)' : '(es)'), false);
    assert.equal(source.includes('MinimumDestination'), false);
  });
}

test('all Privacy route language switches are semantic and trailing-slash safe', async () => {
  const { foundationRoutes } = await import('../lib/site-routes.ts');
  const { getFoundationNavigationPaths } = await import('../lib/foundation-navigation.ts');
  assert.deepEqual(foundationRoutes.privacy, { es: '/privacidad/', en: '/en/privacy/' });
  assert.equal(getFoundationNavigationPaths('es', 'privacy').alternateHref, '/en/privacy/');
  assert.equal(getFoundationNavigationPaths('en', 'privacy').alternateHref, '/privacidad/');
});

test('every existing localized shell exposes the localized Privacy footer destination', async () => {
  for (const path of footerRouteFiles) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.ok(source.includes('<SiteFooter'));
    assert.match(source, /privacy:/);
  }
});

test('Privacy routes and shared page remain Server Components', async () => {
  for (const definition of routeDefinitions) {
    let source;
    try {
      source = await readFile(new URL(definition.path, import.meta.url), 'utf8');
    } catch (error) {
      assert.fail('Privacy route is missing: ' + definition.path + ' (' + error.code + ')');
    }
    assert.doesNotMatch(source, /['"]use client['"]/);
  }
  let component;
  try {
    component = await readFile(new URL('../components/privacy/PrivacyPage.tsx', import.meta.url), 'utf8');
  } catch (error) {
    assert.fail('Shared PrivacyPage component is missing (' + error.code + ')');
  }
  assert.ok(component.includes('<main'));
  assert.ok(component.includes('<h1'));
  assert.equal(/['"]use client['"]/.test(component), false);
});
