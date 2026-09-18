import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const siteFooterPath = path.join(process.cwd(), 'components/foundation/SiteFooter.tsx');

test('renders the approved compact footer groups and utility row', () => {
  const source = fs.readFileSync(siteFooterPath, 'utf8');

  assert.match(source, /LanguageSwitch/);
  assert.match(source, /paths\.alternateHref/);
  assert.match(source, /new Date\(\)\.getFullYear\(\)/);
  assert.match(source, /contactActions\.map/);
  assert.match(source, /founderLinks\.map/);
});

test('keeps footer direct channels in the content-owned order', () => {
  const source = fs.readFileSync(siteFooterPath, 'utf8');

  assert.match(source, /contactActions\.map\(\(action\) =>/);
  assert.match(source, /key=\{action\.kind\}/);
});
