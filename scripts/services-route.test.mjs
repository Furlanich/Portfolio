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

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('localized Services routes use the shared complete page composition', () => {
  for (const route of routes) {
    const source = read(route.source);

    assert.match(source, /import \{ ServicesPage \} from ['"]@\/components\/services\/ServicesPage['"]/);
    assert.match(source, new RegExp(route.contentImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(source, new RegExp(`<ServicesPage\\s+content=\\{${route.contentProp}\\}`));
    assert.doesNotMatch(source, /MinimumDestination/);
    assert.doesNotMatch(source, /servicesContent/);
  }
});

test('the route shells stay compatible: Header, the shared Footer and no new props on the page', () => {
  for (const route of routes) {
    const source = read(route.source);
    assert.match(source, /<SiteHeader/);
    assert.match(source, /<SiteFooter/);
    assert.doesNotMatch(source, /<ServicesPage[^>]*\b(?:route|ground|capabilityWords)\b/);
  }
});

test('Services composes the connected ground, the catalogue, the chapters and the working boundaries without package cards', () => {
  const page = read('components/services/ServicesPage.tsx');
  assert.match(page, /ConnectedStudioGround/);
  assert.match(page, /route="services"/);
  assert.match(page, /data-connected-page/);
  assert.match(page, /data-connected-route="services"/);
  assert.match(page, /ServiceCatalogue/);
  assert.match(page, /CONNECTED_CAPABILITY_WORDS/);
  // The reading masks, the Pause mount and the legend live in the composed parts.
  const parts = ['ServicesIntroduction', 'ServiceCatalogue', 'ServiceSection', 'ServicesPrinciples', 'ServicesFinalCta']
    .map((name) => read('components/services/' + name + '.tsx'))
    .join('\n');
  assert.match(parts, /data-connected-reading-mask/);
  assert.match(parts, /connected-pause-services/);
  assert.match(parts, /formatCapabilityLegend/);

  for (const file of [
    'components/services/ServiceCatalogue.tsx',
    'components/services/ServiceSection.tsx',
    'components/services/ServicesPrinciples.tsx',
    'components/services/ServicesFinalCta.tsx',
    'components/services/ServicesIntroduction.tsx',
  ]) {
    assert.doesNotMatch(read(file), /CommercialContentCard|commercialEqualHeightCardGrid/, file);
  }
});

test('the catalogue cards are native anchors with CSS-only hover: no pointer tracking, no press-scale', () => {
  const catalogue = read('components/services/ServiceCatalogue.tsx');
  assert.match(catalogue, /<a\b|<Link\b/);
  assert.match(catalogue, /data-catalogue-arrow/);
  assert.doesNotMatch(catalogue, /'use client'|"use client"|useState|useEffect|onPointer|onMouse|mousemove|pointermove/);

  const css = read('components/services/services.module.css');
  assert.doesNotMatch(css, /transition:\s*all\b/);
  assert.doesNotMatch(css, /:active\s*\{[^}]*scale\(/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /forced-colors/);
  // The reading plates are opaque; no translucent plate fill lets scene paths show through paragraphs.
  assert.doesNotMatch(css, /\.plate\s*\{[^}]*background(?:-color)?:\s*rgba\(/);
});

test('every Services component stays a Server Component and imports no runtime, storage or Three', () => {
  for (const file of fs.readdirSync(path.join(root, 'components/services')).filter((name) => name.endsWith('.tsx'))) {
    const source = read(path.join('components/services', file));
    assert.doesNotMatch(source, /['"]use client['"]/, file);
    assert.doesNotMatch(source, /from ['"]three['"]|localStorage|sessionStorage|window\./, file);
  }
});
