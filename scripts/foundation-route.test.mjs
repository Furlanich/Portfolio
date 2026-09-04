import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routeDefinitions = [
  {
    locale: 'es',
    routeId: 'home',
    path: '../app/(es)/page.tsx',
    contentImport: "from './_content/home'",
  },
  {
    locale: 'es',
    routeId: 'services',
    path: '../app/(es)/servicios/page.tsx',
    contentImport: "from '../_content/services'",
  },
  {
    locale: 'es',
    routeId: 'contact',
    path: '../app/(es)/contacto/page.tsx',
    contentImport: "from '../_content/contact'",
  },
  {
    locale: 'es',
    routeId: 'founder',
    path: '../app/(es)/estudio/samuel-furlanich/page.tsx',
    contentImport: "from '../../_content/founder'",
  },
  {
    locale: 'en',
    routeId: 'home',
    path: '../app/(en)/en/page.tsx',
    contentImport: "from './_content/home'",
  },
  {
    locale: 'en',
    routeId: 'services',
    path: '../app/(en)/en/services/page.tsx',
    contentImport: "from '../_content/services'",
  },
  {
    locale: 'en',
    routeId: 'contact',
    path: '../app/(en)/en/contact/page.tsx',
    contentImport: "from '../_content/contact'",
  },
  {
    locale: 'en',
    routeId: 'founder',
    path: '../app/(en)/en/about/samuel-furlanich/page.tsx',
    contentImport: "from '../../_content/founder'",
  },
];

test('each foundation route owns one locale and semantic route id', async () => {
  for (const definition of routeDefinitions) {
    const source = await readFile(new URL(definition.path, import.meta.url), 'utf8');

    assert.match(source, new RegExp(`routeId:\\s*'${definition.routeId}'`));
    assert.match(source, new RegExp(`locale:\\s*'${definition.locale}'`));
    assert.equal(source.includes(definition.contentImport), true);
    assert.doesNotMatch(source, definition.locale === 'es' ? /\(en\).*_content/ : /\(es\).*_content/);
  }
});

test('foundation route entries export static page components', async () => {
  for (const definition of routeDefinitions) {
    const source = await readFile(new URL(definition.path, import.meta.url), 'utf8');

    assert.match(source, /export default function Page\s*\(/);
  }
});
