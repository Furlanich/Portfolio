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
