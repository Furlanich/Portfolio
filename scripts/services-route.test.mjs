import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const routes = [
  {
    locale: 'es',
    source: 'app/(es)/servicios/page.tsx',
    contentImport: "import { servicesPageContent } from '../_content/services';",
    contentProp: 'servicesPageContent',
  },
  {
    locale: 'en',
    source: 'app/(en)/en/services/page.tsx',
    contentImport: "import { servicesPageContent } from '../_content/services';",
    contentProp: 'servicesPageContent',
  },
];

test('localized Services routes use the shared complete page composition', () => {
  for (const route of routes) {
    const source = fs.readFileSync(path.join(root, route.source), 'utf8');

    assert.match(source, /import \{ ServicesPage \} from ['"]@\/components\/services\/ServicesPage['"]/);
    assert.match(source, new RegExp(route.contentImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(source, new RegExp(`<ServicesPage\\s+content=\\{${route.contentProp}\\}`));
    assert.doesNotMatch(source, /MinimumDestination/);
    assert.doesNotMatch(source, /servicesContent/);
  }
});

test('Services T4 composition uses plain buyer-evaluation content instead of package cards', () => {
  const files = [
    'components/services/ServiceSection.tsx',
    'components/services/ServicesPrinciples.tsx',
    'components/services/ServicesFinalCta.tsx',
  ];

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /CommercialContentCard|commercialEqualHeightCardGrid/);
  }

  const sectionSource = fs.readFileSync(path.join(root, files[0]), 'utf8');
  assert.match(sectionSource, /content\.work/);
  assert.match(sectionSource, /content\.startingPoint/);
  assert.match(sectionSource, /content\.boundaries/);
  assert.match(sectionSource, /evidenceHref/);

  const finalSource = fs.readFileSync(path.join(root, files[2]), 'utf8');
  assert.doesNotMatch(finalSource, /responseStatement/);
});
