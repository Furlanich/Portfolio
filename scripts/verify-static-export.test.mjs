import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerifier as runVerifierOn } from './export-test-support.mjs';

// PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11 / L-04: `verify-static-export.mjs` must require the
// HOME-IMPACT section ("Position fix", id `impact`) between Services and Proof, with its exact
// approved heading. These tests drive the real verifier against a fixture export
// (`STATIC_EXPORT_DIR`) so they need no build. The verifier reports every other missing route as
// well; each test asserts only on the Home messages it cares about.

const { homeContent: spanish } = await import('../app/(es)/_content/home.ts');
const { homeContent: english } = await import('../app/(en)/en/_content/home.ts');

const locales = {
  es: { content: spanish, file: 'index.html', lang: 'es-AR', processId: 'proceso' },
  en: { content: english, file: 'en/index.html', lang: 'en', processId: 'process' },
};

/** Home sections in the approved order, as [sectionId, headingId, heading]. */
function homeSections({ content, processId }) {
  return [
    ['problems', 'problems-heading', content.problems.heading],
    ['services', 'services-heading', content.servicesSection.heading],
    ['impact', 'impact-heading', content.impact.heading],
    ['proof', 'proof-heading', content.proof.heading],
    [processId, `${processId}-heading`, content.process.heading],
    ['founder', 'founder-heading', content.founderSection.heading],
    ['cta', 'cta-heading', content.cta.heading],
  ];
}

function homeHtml(locale, transform = (sections) => sections, tags = 2) {
  const { content, lang } = locale;
  const tagMarkup = Array.from({ length: tags }, () => `<span>${content.impact.illustrativeTag}</span>`).join('');
  const chapters = content.instrument.chapters
    .map((chapter) => `<section data-instrument-chapter="${chapter.id}"><h2>${chapter.heading}</h2><p>${chapter.description}</p></section>`)
    .join('');
  const sections = transform(homeSections(locale))
    .map(([id, headingId, heading]) => `<section id="${id}" aria-labelledby="${headingId}"><h2 id="${headingId}">${heading}</h2>${id === 'impact' ? tagMarkup : ''}</section>`)
    .join('');
  return [
    `<!doctype html><html lang="${lang}"><body>`,
    '<div data-environment-ground style="background-image:url(&quot;/brand/sky-chart/environment-wide.webp&quot;),url(&quot;/brand/sky-chart/environment-compact.webp&quot;)"></div>',
    `<main>${chapters}${sections}</main>`,
    '</body></html>',
  ].join('');
}

function runVerifier(transform, tags) {
  const files = {};
  for (const locale of Object.values(locales)) files[locale.file] = homeHtml(locale, transform, tags);
  return runVerifierOn({ files }).output;
}

const withoutImpact = (sections) => sections.filter(([id]) => id !== 'impact');

for (const [name, locale] of Object.entries(locales)) {
  test(`${name} Home export without the impact section fails verification`, () => {
    const output = runVerifier(withoutImpact);
    assert.match(output, new RegExp(`${locale.file.replace('.', '\\.')}: missing homepage section id "impact"`));
    assert.match(output, new RegExp(`${locale.file.replace('.', '\\.')}: missing homepage heading id "impact-heading"`));
  });
}

test('Home export with the impact section in the approved position passes the impact checks', () => {
  const output = runVerifier();
  assert.doesNotMatch(output, /"impact"|impact-heading/);
  assert.doesNotMatch(output, /homepage section ".*" is out of order/);
});

test('Home export with impact after Proof reports the order violation', () => {
  const output = runVerifier((sections) => {
    const rest = sections.filter(([id]) => id !== 'impact');
    const impact = sections.find(([id]) => id === 'impact');
    const proofIndex = rest.findIndex(([id]) => id === 'proof');
    return [...rest.slice(0, proofIndex + 1), impact, ...rest.slice(proofIndex + 1)];
  });
  assert.match(output, /homepage section "(?:impact|proof)" is out of order/);
});

test('Home export whose impact heading text differs from the approved copy fails', () => {
  const output = runVerifier((sections) => sections.map((entry) => (entry[0] === 'impact' ? [entry[0], entry[1], 'Impacto medido'] : entry)));
  assert.match(output, /missing visible homepage heading "(?:Menos lugares|Fewer places)/);
});

test('Home export whose impact section lacks the two visible illustrative tags fails', () => {
  const output = runVerifier(undefined, 1);
  assert.match(output, /impact section must show the illustrative-scenario tag twice/);
  assert.doesNotMatch(runVerifier(undefined, 2), /illustrative-scenario tag/);
});

// PLAN-SFC-V1 Task 16: the sixteenth and fifteenth documents are the localized Terms pair, and the
// reciprocal Privacy/Terms navigation is part of the same legal contract. These fixtures are built from the
// real typed Terms copy, so the verifier compares emitted HTML with what the route renders.
const { legalContent: spanishTerms } = await import('../app/(es)/_content/commercial/terms.ts');
const { legalContent: englishTerms } = await import('../app/(en)/en/_content/commercial/terms.ts');

const legalLocales = {
  es: {
    terms: { file: 'terminos/index.html', content: spanishTerms, route: '/terminos/', privacyRoute: '/privacidad/', date: '18 de octubre de 2026' },
    privacyFile: 'privacidad/index.html',
    lang: 'es-AR',
    header: ['Navegación principal', 'Abrir navegación principal', ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio'], 'Ver contacto'],
    footer: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio', 'Información de contacto', 'Privacidad', 'Términos y condiciones'],
  },
  en: {
    terms: { file: 'en/terms/index.html', content: englishTerms, route: '/en/terms/', privacyRoute: '/en/privacy/', date: 'October 18, 2026' },
    privacyFile: 'en/privacy/index.html',
    lang: 'en',
    header: ['Primary navigation', 'Open primary navigation', ['Services', 'Work', 'How we work', 'About'], 'Contact options'],
    footer: ['Services', 'Work', 'How we work', 'About', 'Contact information', 'Privacy', 'Terms and Conditions'],
  },
};

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function legalChrome(locale) {
  const [navigation, menu, subjects, primary] = locale.header;
  const header = `<header><nav aria-label="${navigation}"></nav><button aria-label="${menu}"></button>${subjects.map((label) => `<a>${label}</a>`).join('')}<a>${primary}</a></header>`;
  const footer = `<footer>${locale.footer.map((label) => `<a>${label}</a>`).join('')}<a hrefLang="x">switch</a>©<span>2026</span>FURLANICH`
    + '<a href="https://wa.me/5491150117565">w</a><a href="mailto:samuelfurlanich@gmail.com">m</a><a href="tel:+5491150117565">t</a></footer>';
  return { header, footer };
}

function termsHtml(locale, base = '', mutate = {}) {
  const { terms } = locale;
  const content = terms.content;
  const { header, footer } = legalChrome(locale);
  const sections = content.sections
    .filter((section) => section.id !== mutate.dropSection)
    .map((section) => `<section id="${section.id}"><h2 id="${section.id}-heading">${escapeHtml(section.heading)}</h2>${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</section>`)
    .join('');
  const contents = content.sections.map((section) => `<li><a href="#${section.id}">${escapeHtml(section.heading)}</a></li>`).join('');
  const date = mutate.date ?? terms.date;
  const reciprocal = mutate.reciprocalHref ?? base + terms.privacyRoute;
  return [
    `<!doctype html><html lang="${locale.lang}"><head><title>${escapeHtml(content.metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(content.metadata.description)}"/></head><body>`,
    header,
    `<main><h1>${escapeHtml(content.title)}</h1><dl><div><dt>${content.chrome.updateLabel}</dt><dd>${date}</dd></div></dl>`,
    `<nav aria-label="${content.chrome.contentsLabel}"><h2>${content.chrome.contentsLabel}</h2><ol>${contents}</ol></nav>`,
    `<article>${sections}<ul><li><a href="${reciprocal}">${escapeHtml(content.chrome.reciprocalLabel)}</a></li></ul></article>${mutate.extra ?? ''}</main>`,
    footer,
    '</body></html>',
  ].join('');
}

function termsMessages(locale, html, base = '') {
  const file = locale.terms.file;
  return runVerifierOn({ files: { [file]: html }, basePath: base }).output.split('\n').filter((line) => line.startsWith(`- ${file}:`));
}

for (const [name, locale] of Object.entries(legalLocales)) {
  test(`${name} Terms export is a required document`, () => {
    const output = runVerifierOn({ files: {} }).output;
    assert.match(output, new RegExp(`missing static artifact: ${locale.terms.file.replace('/', '\/')}`));
  });

  test(`${name} Terms export with the canonical sections, date, metadata and reciprocal link passes at root and /Portfolio`, () => {
    for (const base of ['', '/Portfolio']) assert.deepEqual(termsMessages(locale, termsHtml(locale, base), base), [], base || 'root');
  });

  test(`${name} Terms export without a section, a real update date or the Privacy link fails`, () => {
    assert.ok(termsMessages(locale, termsHtml(locale, '', { dropSection: locale.terms.content.sections[2].id })).some((line) => /Terms sections/.test(line)));
    assert.ok(termsMessages(locale, termsHtml(locale, '', { date: 'Pending' })).some((line) => /update date/.test(line)));
    assert.ok(termsMessages(locale, termsHtml(locale, '', { reciprocalHref: '/elsewhere/' })).some((line) => /Privacy reciprocal link/.test(line)));
    assert.ok(termsMessages(locale, termsHtml(locale, '', {}), '/Portfolio').some((line) => /base path/.test(line) || /Privacy reciprocal link/.test(line)));
  });

  test(`${name} Terms export rejects form controls, provider wording and unpublished-gate language`, () => {
    for (const extra of ['<form></form>', '<input name="message">', 'formspree.io', 'Simulate submission', 'nonpublishable', 'professional-review-and-factual-gates-open']) {
      assert.ok(termsMessages(locale, termsHtml(locale, '', { extra })).some((line) => /Terms/.test(line)), extra);
    }
  });

  test(`${name} Footer export requires the localized Terms label`, () => {
    const html = termsHtml(locale).replace(`<a>${locale.footer.at(-1)}</a>`, '');
    assert.ok(termsMessages(locale, html).some((line) => line.includes(`missing approved footer label "${locale.footer.at(-1)}"`)));
  });
}

for (const [name, locale] of Object.entries(legalLocales)) {
  const privacyMessages = (main, base = '') => runVerifierOn({
    files: { [locale.privacyFile]: `<!doctype html><html lang="${locale.lang}"><body><main><h1>x</h1>${main}</main></body></html>` },
    basePath: base,
  }).output.split('\n').filter((line) => line.startsWith(`- ${locale.privacyFile}:`));
  const label = name === 'es' ? 'Última actualización' : 'Last updated';

  test(`${name} Privacy export requires a real update date and the reciprocal Terms link`, () => {
    const dated = `<dl><div><dt>${label}</dt><dd>${locale.terms.date}</dd></div></dl>`;
    const link = `<a href="${locale.terms.route}">Terms</a>`;
    assert.ok(privacyMessages(dated).some((line) => /missing Terms reciprocal link/.test(line)));
    assert.ok(privacyMessages(link).some((line) => /Privacy is missing its .* update date/.test(line)));
    const ok = privacyMessages(dated + link);
    assert.ok(!ok.some((line) => /Terms reciprocal link|update date/.test(line)), ok.join('\n'));
    assert.ok(privacyMessages(dated + link, '/Portfolio').some((line) => /missing Terms reciprocal link/.test(line)), 'base path is required on the reciprocal link');
  });
}
