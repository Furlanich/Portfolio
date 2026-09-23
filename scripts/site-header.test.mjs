import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const siteHeaderPath = path.join(process.cwd(), 'components/foundation/SiteHeader.tsx');

test('keeps the shared SiteHeader server-renderable', () => {
  const source = fs.readFileSync(siteHeaderPath, 'utf8');

  assert.doesNotMatch(source, /\bon[A-Z][A-Za-z]+\s*=\s*\{/);
  assert.doesNotMatch(source, /\bwindow\./);
  assert.doesNotMatch(source, /\bdocument\./);
  assert.match(source, /paths\.projects/);
  assert.match(source, /labels\.projects/);
});

test('anchors the wordmark to a non-sticky top target on the localized home route', () => {
  const source = fs.readFileSync(siteHeaderPath, 'utf8');

  assert.match(source, /<div id="site-top" aria-hidden="true" \/>\s*<header className=/);
  assert.match(source, /href=\{`\$\{paths\.home\}#site-top`\}/);
  assert.doesNotMatch(source, /<header\s+id="site-top"/);
});

test('exposes four navigation subjects and one stable Contact action', () => {
  const source = fs.readFileSync(siteHeaderPath, 'utf8');

  assert.match(source, /NavigationDisclosure/);
  assert.match(source, /label: labels\.primaryAction/);
  assert.doesNotMatch(source, /\{ href: paths\.contact, label: labels\.contact \}/);
});

test('renders the protected mark beside the accessible text wordmark', () => {
  const signature = fs.readFileSync(path.join(process.cwd(), 'components/brand/BrandSignature.tsx'), 'utf8');

  assert.match(signature, /src=\{withBasePath\('\/brand\/furlanich-mark-azure-on-bone\.svg'\)\}/);
  assert.match(signature, /alt=""/, 'the mark is decorative beside the text wordmark');
  assert.match(signature, /width=\{40\}\s+height=\{40\}/, 'the mark keeps its square coordinate system');
  assert.match(signature, /loading="eager"/);
  assert.match(signature, /<span>FURLANICH<\/span>/);
  assert.match(signature, /font-bold tracking-\[0\.08em\] text-foundation-ink/);
  assert.match(signature, /gap-\[2\.6px\]/, '1.25x silhouette gap at the 40px mark size');
  assert.doesNotMatch(signature, /'use client'/);
});

test('keeps the approved Surface app bar with the shared signature and ink focus ring', () => {
  const source = fs.readFileSync(siteHeaderPath, 'utf8');

  assert.match(source, /<BrandSignature href=\{`\$\{paths\.home\}#site-top`\} \/>/);
  assert.match(source, /<header className="sticky top-0 z-50 border-b border-foundation-border bg-foundation-surface">/);
  assert.match(source, /focus-visible:ring-offset-foundation-action-strong/);
});

test('keeps the compact disclosure and language switch on the Surface role', () => {
  const disclosure = fs.readFileSync(path.join(process.cwd(), 'components/foundation/NavigationDisclosure.tsx'), 'utf8');
  const languageSwitch = fs.readFileSync(path.join(process.cwd(), 'components/foundation/LanguageSwitch.tsx'), 'utf8');

  assert.match(disclosure, /bg-foundation-surface p-2/);
  assert.match(disclosure, /shadow-\[0_12px_32px_rgba\(9,36,61,0\.12\)\]/);
  assert.doesNotMatch(disclosure, /rgba\(11,31,51/);
  assert.match(languageSwitch, /bg-foundation-surface/);
});
