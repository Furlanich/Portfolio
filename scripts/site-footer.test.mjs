import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getDirectChannelText,
  getFooterConclusionContent,
  resolveFooterLocale,
} from '../components/foundation/footer-content.ts';

// PLAN-SPF-V1 Task 4: the shared Footer's approved copy is content data, owned by footer-content.ts.
// The expected strings are restated from the IA table ("Proposed Footer wording", APPROVED 2026-09-30)
// on purpose, so a drift in the module cannot make its own test pass. Composition, order, geometry and
// contrast are browser behavior and live in tests/e2e/connected-studio-footer.spec.ts.

const approved = {
  es: {
    headline: 'Dale un próximo paso a tu proyecto.',
    introduction:
      'Contanos qué necesitás construir, conectar o mejorar. Samuel Furlanich es el responsable técnico directo.',
    whatsappAction: 'Escribinos por WhatsApp',
    directContactHeading: 'Contacto directo',
    contactRouteAction: 'Información de contacto',
    locationAccountability: 'Buenos Aires, Argentina · Estudio liderado por su fundador',
    exploreHeading: 'Explorar',
    accountabilityHeading: 'Responsabilidad directa',
  },
  en: {
    headline: 'Give your project a next step.',
    introduction:
      'Tell us what you need to build, connect or improve. Samuel Furlanich is the directly accountable technical lead.',
    whatsappAction: 'Write on WhatsApp',
    directContactHeading: 'Direct contact',
    contactRouteAction: 'Contact information',
    locationAccountability: 'Buenos Aires, Argentina · Founder-led studio',
    exploreHeading: 'Explore',
    accountabilityHeading: 'Direct accountability',
  },
};

for (const locale of ['es', 'en']) {
  test(`${locale} conclusion content is the exact approved IA copy`, () => {
    assert.deepEqual(getFooterConclusionContent(locale), approved[locale]);
  });
}

test('the footer locale is the opposite of the typed alternate locale (two-locale invariant)', () => {
  assert.equal(resolveFooterLocale('en'), 'es');
  assert.equal(resolveFooterLocale('es'), 'en');
});

test('direct-channel text shows the approved public values and derives from the content-owned href', () => {
  assert.equal(
    getDirectChannelText({ kind: 'email', label: 'Enviar un correo', href: 'mailto:samuelfurlanich@gmail.com' }),
    'samuelfurlanich@gmail.com',
  );
  assert.equal(
    getDirectChannelText({ kind: 'phone', label: 'Llamar', href: 'tel:+5491150117565' }),
    '+54 9 11 5011-7565',
  );
});

test('direct-channel text fails soft: an unrecognized phone shape shows the dialed number, never an invented one', () => {
  assert.equal(getDirectChannelText({ kind: 'phone', label: 'Call', href: 'tel:+12025550123' }), '+12025550123');
  assert.equal(getDirectChannelText({ kind: 'whatsapp', label: 'Write', href: 'https://wa.me/5491150117565' }), 'Write');
});

// The rules below are about code, not about the comments that explain them.
const withoutComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const readCode = (file) => withoutComments(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));

test('the copy module is plain data: no runtime, window, storage or Three', () => {
  const source = readCode('components/foundation/footer-content.ts');
  assert.doesNotMatch(source, /\bwindow\b|\bdocument\b|localStorage|sessionStorage|from 'three'|'use client'/);
});

test('the Footer owns its signature: it never reuses the shared BrandSignature or its App Bar marker', () => {
  const footer = readCode('components/foundation/SiteFooter.tsx');
  const signature = readCode('components/foundation/FooterBrandSignature.tsx');

  assert.doesNotMatch(footer, /components\/brand\/BrandSignature/);
  assert.match(footer, /FooterBrandSignature/);
  assert.doesNotMatch(signature, /data-app-bar-brand/);
  assert.doesNotMatch(signature, /components\/brand\/BrandSignature/);
});

test('the Footer keeps its compatible props and the shared locale control', () => {
  const footer = fs.readFileSync(path.join(process.cwd(), 'components/foundation/SiteFooter.tsx'), 'utf8');

  assert.match(footer, /contactActions: ContactAction\[\]/);
  assert.match(footer, /founderLinks: ExternalLink\[\]/);
  assert.match(footer, /labels: SiteFooterLabels/);
  assert.match(footer, /paths: FoundationNavigationPaths/);
  assert.match(footer, /<LanguageSwitch/);
  assert.match(footer, /data-site-footer/);
  assert.match(footer, /new Date\(\)\.getFullYear\(\)/);
});
