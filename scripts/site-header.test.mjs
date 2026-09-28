import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const siteHeaderPath = path.join(process.cwd(), 'components/foundation/SiteHeader.tsx');
const appBarBehaviorPath = path.join(process.cwd(), 'components/foundation/AppBarBehavior.tsx');

function readSiteHeader() {
  return fs.readFileSync(siteHeaderPath, 'utf8');
}

test('keeps the shared SiteHeader server-renderable', () => {
  const source = readSiteHeader();

  assert.doesNotMatch(source, /\bon[A-Z][A-Za-z]+\s*=\s*\{/);
  assert.doesNotMatch(source, /\bwindow\./);
  assert.doesNotMatch(source, /\bdocument\./);
  assert.match(source, /paths\.projects/);
  assert.match(source, /labels\.projects/);
});

test('anchors the wordmark to a non-sticky top target on the localized home route', () => {
  const source = readSiteHeader();

  assert.match(source, /<div id="site-top" aria-hidden="true" \/>\s*<header data-app-bar className=/);
  assert.match(source, /href=\{`\$\{paths\.home\}#site-top`\}/);
  assert.doesNotMatch(source, /<header\s+id="site-top"/);
});

test('exposes four navigation subjects and one stable Contact action', () => {
  const source = readSiteHeader();

  assert.match(source, /NavigationDisclosure/);
  assert.match(source, /label: labels\.primaryAction/);
  assert.doesNotMatch(source, /\{ href: paths\.contact, label: labels\.contact \}/);
});

test('renders the protected mark beside the accessible text wordmark', () => {
  const signature = fs.readFileSync(path.join(process.cwd(), 'components/brand/BrandSignature.tsx'), 'utf8');

  // Inline rather than an image element: the static-export gate counts page images as content media.
  assert.doesNotMatch(signature, /<img|<Image|next\/image/);
  assert.match(signature, /<svg\s+aria-hidden="true"\s+focusable="false"\s+viewBox="0 0 256 256"\s+width=\{40\}\s+height=\{40\}/);
  assert.match(signature, /stroke="#004589" strokeWidth=\{30\} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit=\{4\}/);
  assert.deepEqual(
    [...signature.matchAll(/<polyline points="([^"]+)" \/>/g)].map((match) => match[1]),
    [
      '30,102 128,28 226,102', '30,166 128,92 226,166', '30,230 128,156 226,230',
      '30,102 128,28 226,102', '30,166 128,92 226,166', '30,230 128,156 226,230',
    ],
    'both variants keep the G0 centerlines (default variant first, then on-dark)',
  );
  assert.match(signature, /<span>FURLANICH<\/span>/);
  assert.match(signature, /font-bold tracking-\[0\.08em\] text-foundation-ink/);
  assert.match(signature, /gap-\[2\.6px\]/, '1.25x silhouette gap at the 40px mark size');
  assert.doesNotMatch(signature, /'use client'/);
});

test('renders the SKY-CHART-V2 App Bar on the atlas-plate material, docked by default', () => {
  const source = readSiteHeader();

  assert.match(source, /<header data-app-bar className="sticky top-0 z-50/, 'sticky, top-0, z-50 (D-22 structure)');
  assert.match(source, /data-app-bar-surface/);
  // Docked is the default and the only state reachable without JavaScript (D-22): the fill,
  // blur and border classes below must be unconditional base classes, not gated behind any
  // `data-docked` variant. Pull out the surface element's own className (not the whole file)
  // so each required token is asserted precisely, regardless of class order.
  const surfaceMatch = source.match(/data-app-bar-surface[\s\S]{0,40}className="([^"]*)"/);
  assert.ok(surfaceMatch, 'the [data-app-bar-surface] element has a className');
  const surfaceClasses = surfaceMatch[1];
  assert.match(surfaceClasses, /bg-\[rgba\(10,30,51,\.82\)\]/, 'D-22 docked fill');
  assert.match(surfaceClasses, /backdrop-blur-\[16px\]/);
  assert.match(surfaceClasses, /backdrop-saturate-\[125%\]/);
  assert.match(surfaceClasses, /border-sky-plate-line/);
  assert.match(source, /data-\[docked=false\]:bg-transparent/, 'Home-only transparent override (D-22 undocked state)');
  assert.match(source, /data-\[docked=false\]:border-transparent/);
  assert.match(source, /focus-visible:\[outline:3px_solid_#9CC4EC\]/, 'D-21 dark-context focus ring');

  // D-22/D-07: without backdrop-filter support the docked fill is .94, not .82. Tailwind's
  // arbitrary `supports-[...]` variant expresses this without touching app/globals.css,
  // which Task 3 owns and locks (L-02).
  assert.match(
    surfaceClasses,
    /supports-\[not_\(backdrop-filter:blur\(1px\)\)\]:bg-\[rgba\(10,30,51,\.94\)\]/,
    'D-07 no-backdrop-filter fallback fill (.94)',
  );
  assert.match(
    surfaceClasses,
    /data-\[docked=false\]:supports-\[not_\(backdrop-filter:blur\(1px\)\)\]:bg-transparent/,
    'the Home-top transparent state still wins over the .94 fallback fill',
  );
});

test('renders the Home-only decorative readout and marks route links for AppBarBehavior', () => {
  const source = readSiteHeader();

  assert.match(source, /data-app-bar-readout/);
  assert.match(source, /aria-hidden="true"[\s\S]{0,20}className="hidden[^"]*lg:data-\[home=true\]:block/);
  assert.match(source, /data-app-bar-nav-link/);
});

test('keeps the compact disclosure and language switch on the App Bar atlas-plate material', () => {
  const disclosure = fs.readFileSync(path.join(process.cwd(), 'components/foundation/NavigationDisclosure.tsx'), 'utf8');
  const languageSwitch = fs.readFileSync(path.join(process.cwd(), 'components/foundation/LanguageSwitch.tsx'), 'utf8');

  assert.match(disclosure, /bg-\[rgba\(10,30,51,\.96\)\]/, 'D-22 compact panel fill, no blur');
  assert.doesNotMatch(disclosure, /backdrop-blur/, 'the compact panel has no blur (D-22)');
  assert.match(disclosure, /rounded-\[14px\]/);
  assert.match(disclosure, /p-2/);
  assert.match(disclosure, /gap-1/);
  assert.doesNotMatch(disclosure, /bg-foundation-surface/);
  assert.match(languageSwitch, /border-sky-plate-line/);
  assert.match(languageSwitch, /rounded-\[8px\]/);
  assert.match(languageSwitch, /font-mono/);
  assert.doesNotMatch(languageSwitch, /bg-foundation-surface/);
});

test('AppBarBehavior is a client leaf that renders nothing', () => {
  const source = fs.readFileSync(appBarBehaviorPath, 'utf8');

  assert.match(source, /^'use client';/);
  assert.match(source, /return null;/);
  assert.match(source, /export function AppBarBehavior/);
});

test('AppBarBehavior sets up a rAF-throttled scroll listener and an IntersectionObserver, both cleaned up', () => {
  const source = fs.readFileSync(appBarBehaviorPath, 'utf8');

  assert.match(source, /addEventListener\('scroll', onScroll, \{ passive: true \}\)/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /removeEventListener\('scroll', onScroll\)/, 'scroll listener is cleaned up on unmount');
  assert.match(source, /cancelAnimationFrame/, 'a pending frame is cancelled on unmount');
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /observer\.disconnect\(\)/, 'the observer is disconnected on unmount');
});

test('AppBarBehavior computes aria-current from a normalized pathname, ignoring the Process hash link', () => {
  const source = fs.readFileSync(appBarBehaviorPath, 'utf8');

  assert.match(source, /import \{ normalizeAppBarPath \} from '\.\/app-bar-path'/);
  assert.match(source, /setAttribute\('aria-current', 'page'\)/);
  assert.match(source, /setAttribute\('aria-current', 'location'\)/);
  assert.match(source, /isProcessLink/);
});

// D-22: "Text is `{NN} · {name}`". `[data-readout]` sections (rendered by Tasks 8/9) only
// carry the plain name (e.g. "Position fix"); several sections share the same name (the
// hero and all four chapters are "Home"). So the two-digit index is not read off the DOM,
// it is derived here: the position of each distinct data-readout value's first appearance
// in document order. That reproduces the reference prototype's fixed `secs` array (Home 00,
// Problems 01, Services 02, Position fix 03, ...) without hardcoding section ids/labels.
//
// This runs the extracted pure functions directly (buildReadoutIndex/formatReadout in
// components/foundation/app-bar-readout.ts) rather than pattern-matching AppBarBehavior.tsx's
// source text, per the PR #89 review (GPT-5.6 Luna, BLOCKING 3): a source-regex assertion
// would keep passing even if the formatting logic were subtly wrong.
test('AppBarBehavior numbers the readout by first appearance of each distinct data-readout value', async () => {
  const { buildReadoutIndex, formatReadout } = await import('../components/foundation/app-bar-readout.ts');

  // The hero and all four chapters render the same "Home" readout value (D-12); the real
  // document order for a Home page is hero, four chapters, then the seven restyled sections
  // in CommercialHomepage's render order (Problems, Services, Position fix, Proof, Process,
  // Founder, Contact).
  const en = ['Home', 'Home', 'Home', 'Home', 'Home', 'Problems', 'Services', 'Position fix', 'Accountability', 'Process', 'Founder', 'Contact'];
  const es = ['Inicio', 'Inicio', 'Inicio', 'Inicio', 'Inicio', 'Problemas', 'Servicios', 'Posición', 'Responsabilidad', 'Proceso', 'Fundador', 'Contacto'];

  const enIndex = buildReadoutIndex(en);
  const esIndex = buildReadoutIndex(es);

  assert.equal(formatReadout('Home', enIndex), '00 · Home');
  assert.equal(formatReadout('Position fix', enIndex), '03 · Position fix');
  assert.equal(formatReadout('Contact', enIndex), '07 · Contact');
  assert.equal(formatReadout('Inicio', esIndex), '00 · Inicio');
  assert.equal(formatReadout('Posición', esIndex), '03 · Posición');
  assert.equal(formatReadout('Contacto', esIndex), '07 · Contacto');

  // A repeated value keeps its first-seen index, not a later one.
  assert.equal(buildReadoutIndex(en).get('Home'), 0);
  assert.equal([...buildReadoutIndex(en).keys()].filter((key) => key === 'Home').length, 1);
});

test('AppBarBehavior.tsx uses the extracted app-bar-readout helpers, not inline logic', () => {
  const source = fs.readFileSync(appBarBehaviorPath, 'utf8');

  assert.match(source, /import \{ buildReadoutIndex, formatReadout \} from '\.\/app-bar-readout'/);
  assert.doesNotMatch(source, /padStart\(2, ?'0'\)/, 'the zero-padding now lives in app-bar-readout.ts, not inline');
});

// REFACTOR: normalizeAppBarPath is extracted from AppBarBehavior.tsx into its own
// DOM-free, plain .ts module (components/foundation/app-bar-path.ts) so it can be unit
// tested directly with node --test -- AppBarBehavior.tsx itself cannot be imported here
// because JSX is not type-strippable by Node's built-in TypeScript support.
test('normalizeAppBarPath ignores a trailing slash and a configured base path', async () => {
  const { normalizeAppBarPath } = await import('../components/foundation/app-bar-path.ts');

  assert.equal(normalizeAppBarPath('/'), '/');
  assert.equal(normalizeAppBarPath(''), '/');
  assert.equal(normalizeAppBarPath('/en/services/'), '/en/services');
  assert.equal(normalizeAppBarPath('/en/services'), '/en/services');
  assert.equal(normalizeAppBarPath('en/services/'), '/en/services');
  assert.equal(normalizeAppBarPath('/base/en/services/', '/base'), '/en/services');
  assert.equal(normalizeAppBarPath('/base/', '/base'), '/');
  assert.equal(normalizeAppBarPath('/base', '/base'), '/', 'the base path alone, with no trailing slash, is also the root');
  assert.equal(
    normalizeAppBarPath('/en/services/', ''),
    normalizeAppBarPath('/en/services'),
    'a route link and the current location normalize to the same value regardless of a trailing slash',
  );
});

// PR #89 review (GPT-5.6 Luna, NON-BLOCKING): stripping the base path with a bare
// `startsWith` also matches a longer sibling segment ("/baseball" starts with "/base"),
// which would wrongly treat /baseball/services as based and mangle it to /ball/services.
// The base path must be followed by a segment boundary -- either nothing (the base path is
// the whole pathname) or a "/" -- before it is stripped.
test('normalizeAppBarPath only strips the base path at a segment boundary', async () => {
  const { normalizeAppBarPath } = await import('../components/foundation/app-bar-path.ts');

  assert.equal(
    normalizeAppBarPath('/baseball/services/', '/base'),
    '/baseball/services',
    'a sibling segment that merely starts with the base path is not stripped',
  );
  assert.equal(normalizeAppBarPath('/basement', '/base'), '/basement');
  assert.equal(normalizeAppBarPath('/base/services/', '/base'), '/services', 'the real base path is still stripped');
});
