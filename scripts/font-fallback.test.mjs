import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Owner decision 2026-10-05 (extends E2). next/font's adjusted fallback for Instrument Sans is a
// single @font-face on local(Arial). Linux, Android and ChromeOS have no "Arial" for local() to
// find, so that face never loads and the text falls to a much wider system sans until the web
// font arrives (Linux CI: font-swap CLS 0.152 at EN 1440). A second fallback family covers the
// metric-compatible clones and the common platform sans with the same metric overrides.

const globals = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const fonts = readFileSync(new URL('../app/fonts.ts', import.meta.url), 'utf8');

const FAMILY = 'Instrument Sans Metric Fallback';

test('Instrument Sans lists the cross-platform metric fallback after next/font\'s own', () => {
  const block = fonts.slice(fonts.indexOf('export const instrumentSans'), fonts.indexOf('export const plexMono'));
  assert.match(block, new RegExp(`fallback:\\s*\\[\\s*'${FAMILY}'`));
});

test('the metric fallback @font-face covers Arial\'s clones and the platform sans with the same overrides', () => {
  const face = globals.match(new RegExp(`@font-face\\s*\\{[^}]*font-family:\\s*'${FAMILY}';[^}]*\\}`));
  assert.ok(face, `globals.css declares @font-face for '${FAMILY}'`);
  const rule = face[0];
  for (const local of ['Liberation Sans', 'Arimo', 'Roboto', 'Helvetica', 'Arial']) {
    assert.match(rule, new RegExp(`local\\('${local}'\\)`), `src includes local('${local}')`);
  }
  // The values next/font computes for Instrument Sans against Arial; Liberation Sans and Arimo
  // share Arial's metrics, so the same overrides make them width- and height-neutral.
  assert.match(rule, /size-adjust:\s*103\.22%/);
  assert.match(rule, /ascent-override:\s*93\.97%/);
  assert.match(rule, /descent-override:\s*24\.22%/);
  assert.match(rule, /line-gap-override:\s*0%/);
});
