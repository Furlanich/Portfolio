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
});

test('anchors the wordmark to a non-sticky top target on the localized home route', () => {
  const source = fs.readFileSync(siteHeaderPath, 'utf8');

  assert.match(source, /<div id="site-top" aria-hidden="true" \/>\s*<header className=/);
  assert.match(source, /href=\{`\$\{paths\.home\}#site-top`\}/);
  assert.doesNotMatch(source, /<header\s+id="site-top"/);
});
