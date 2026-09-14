import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routeDefinitions = [
  { locale: 'es', path: '../app/(es)/contacto/page.tsx', contentImport: "from '../_content/contact'" },
  { locale: 'en', path: '../app/(en)/en/contact/page.tsx', contentImport: "from '../_content/contact'" },
];

for (const definition of routeDefinitions) {
  test(definition.locale + ' Contact route owns its locale and shared page', async () => {
    let source;
    try {
      source = await readFile(new URL(definition.path, import.meta.url), 'utf8');
    } catch (error) {
      assert.fail('Contact route is missing: ' + definition.path + ' (' + error.code + ')');
    }
    assert.ok(source.includes("import { ContactPage } from '@/components/contact/ContactPage'"));
    assert.ok(source.includes("routeId: 'contact'"));
    assert.ok(source.includes("locale: '" + definition.locale + "'"));
    assert.ok(source.includes(definition.contentImport));
    assert.ok(source.includes('getFoundationNavigationPaths(route.locale, route.routeId)'));
    assert.doesNotMatch(source, /['"]use client['"]/);
    assert.doesNotMatch(source, /MinimumDestination/);
    assert.ok(source.includes("mode=\"demonstration\""));
    assert.doesNotMatch(source, /formspree/i);
  });
}

test('Contact route and shared page keep the client boundary narrow', async () => {
  for (const definition of routeDefinitions) {
    const source = await readFile(new URL(definition.path, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /['"]use client['"]/);
  }
  const page = await readFile(new URL('../components/contact/ContactPage.tsx', import.meta.url), 'utf8');
  const form = await readFile(new URL('../components/contact/ContactForm.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /['"]use client['"]/);
  assert.ok(form.includes('createDemoSubmitInquiry'));
  assert.match(form, /^['"]use client['"]/);
  assert.doesNotMatch(form, /formspree|NEXT_PUBLIC_FORMSPREE_ENDPOINT|localStorage|sessionStorage|console\./i);
});

test('deployment does not expose a Formspree endpoint', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(workflow, /NEXT_PUBLIC_FORMSPREE_ENDPOINT|FORMSPREE/i);
});
