import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const SURFACE_FILES = [
  'components/surfaces/AtlasPlate.tsx',
  'components/surfaces/PlottingSheet.tsx',
];

test('keeps the surface primitives server-renderable with no interactive affordances', () => {
  for (const file of SURFACE_FILES) {
    const source = read(file);
    assert.doesNotMatch(source, /'use client'/, file);
    assert.doesNotMatch(source, /\bon[A-Z][A-Za-z]*\s*=\s*\{/, file);
    assert.doesNotMatch(source, /cursor-pointer/, file);
    assert.doesNotMatch(source, /hover:/, file);
  }
});

test('marks every decorative span aria-hidden in the surface primitives', () => {
  for (const file of SURFACE_FILES) {
    const source = read(file);
    const spans = [...source.matchAll(/<span\b[^>]*>/g)].map((match) => match[0]);
    assert.ok(spans.length > 0, `${file} defines no decorative spans`);
    for (const span of spans) {
      assert.match(span, /aria-hidden="true"/, `${span} in ${file}`);
    }
  }
});

test('exposes the AtlasPlate props contract from D-05', () => {
  const source = read('components/surfaces/AtlasPlate.tsx');
  assert.match(source, /as\?:\s*'article'\s*\|\s*'div'\s*\|\s*'li'\s*\|\s*'section'/);
  assert.match(source, /plateNumber\?:\s*string/);
  assert.match(source, /blur\?:\s*boolean/);
  assert.match(source, /blur\s*=\s*true/);
});

test('exposes the PlottingSheet props contract from D-06', () => {
  const source = read('components/surfaces/PlottingSheet.tsx');
  assert.match(source, /as\?:\s*'article'\s*\|\s*'div'\s*\|\s*'li'\s*\|\s*'section'/);
  assert.match(source, /bearing\?:\s*string/);
});

test('omits the backdrop-filter blur from AtlasPlate when blur is false', () => {
  const source = read('components/surfaces/AtlasPlate.tsx');
  assert.match(source, /blur\s*\?\s*'sky-plate-material'\s*:\s*'sky-plate-material-solid'/);

  const css = read('app/globals.css');
  const solidRule = css.match(/\.sky-plate-material-solid\s*\{([^}]*)\}/s);
  assert.ok(solidRule, 'sky-plate-material-solid rule missing from globals.css');
  assert.doesNotMatch(solidRule[1], /blur\(/);
  assert.match(solidRule[1], /backdrop-filter:\s*none;/);
});

test('implements the D-07 material fallbacks for backdrop-filter, reduced transparency and forced colors', () => {
  const combined = read('app/globals.css') + read('components/surfaces/surfaces.module.css');
  assert.match(combined, /@supports not \(backdrop-filter: blur\(1px\)\)/);
  assert.match(combined, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(combined, /@media \(forced-colors: active\)/);
});

test('registers the future Wave 2/3 Playwright specs in their required projects', () => {
  const source = read('playwright.config.ts');
  const registrations = {
    'app-bar.spec.ts': [
      'chromium-desktop',
      'firefox-desktop',
      'webkit-desktop',
      'mobile-chromium',
      'mobile-webkit',
      'tablet-chromium',
      'compact-320-chromium',
      'tablet-portrait-chromium',
    ],
    'home-sections.spec.ts': [
      'chromium-desktop',
      'firefox-desktop',
      'webkit-desktop',
      'mobile-chromium',
      'tablet-chromium',
      'compact-320-chromium',
    ],
    'sky-chart-acceptance.spec.ts': ['immersive-chromium'],
  };

  for (const [spec, projects] of Object.entries(registrations)) {
    for (const projectName of projects) {
      const marker = `name: '${projectName}',`;
      const start = source.indexOf(marker);
      assert.ok(start !== -1, `project ${projectName} not found in playwright.config.ts`);
      const end = source.indexOf('\n    },', start);
      assert.ok(end !== -1, `project ${projectName} block not closed as expected`);
      const block = source.slice(start, end);
      // Look for the literal regex-literal text (e.g. /app-bar\.spec\.ts/) as written in
      // playwright.config.ts, not an interpreted regular expression.
      const literalSpec = spec.split('.').join('\\.');
      assert.ok(
        block.includes(`/${literalSpec}/`),
        `${projectName} testMatch missing /${literalSpec}/`,
      );
    }
  }
});
