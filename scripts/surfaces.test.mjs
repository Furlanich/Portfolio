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

test('keeps the D-07 forced-colors override in surfaces.module.css so it wins over the plate/sheet border and background-image', () => {
  // app/globals.css loads before component-level CSS Modules, so a forced-colors override
  // declared only in globals.css (equal specificity, earlier in the cascade) is silently
  // beaten by surfaces.module.css's unconditional .atlasPlate border and .plottingSheet
  // background-image rules. The override must live in surfaces.module.css itself, after
  // the base rules it corrects, so normal cascade order lets it win.
  const moduleCss = read('components/surfaces/surfaces.module.css');
  const atlasPlateBaseIndex = moduleCss.indexOf('.atlasPlate {');
  const plottingSheetBaseIndex = moduleCss.indexOf('.plottingSheet {');
  const forcedColorsIndex = moduleCss.indexOf('@media (forced-colors: active)');

  assert.ok(atlasPlateBaseIndex !== -1, '.atlasPlate base rule missing');
  assert.ok(plottingSheetBaseIndex !== -1, '.plottingSheet base rule missing');
  assert.ok(forcedColorsIndex !== -1, 'surfaces.module.css has no forced-colors block');
  assert.ok(atlasPlateBaseIndex < forcedColorsIndex, '.atlasPlate must be declared before the forced-colors override');
  assert.ok(plottingSheetBaseIndex < forcedColorsIndex, '.plottingSheet must be declared before the forced-colors override');

  const forcedColorsBlock = moduleCss.slice(forcedColorsIndex);
  assert.match(forcedColorsBlock, /\.atlasPlate[\s\S]*\{[^}]*border:\s*1px solid CanvasText;/);
  assert.match(forcedColorsBlock, /\.plottingSheet[\s\S]*\{[^}]*border:\s*1px solid CanvasText;/);
  assert.match(forcedColorsBlock, /background-image:\s*none;/);
  assert.match(forcedColorsBlock, /\.plottingSheetCrease/, 'the corner crease gradient must also be cleared');
});

test('drops the ineffective global forced-colors override now that surfaces.module.css owns it', () => {
  const css = read('app/globals.css');
  assert.doesNotMatch(css, /@media \(forced-colors: active\)/);
});

test('gives AtlasPlate and PlottingSheet default D-05/D-06 text colors so consumers inherit them', () => {
  const css = read('components/surfaces/surfaces.module.css');

  const atlasPlateRule = css.match(/\.atlasPlate\s*\{([^}]*)\}/s);
  assert.ok(atlasPlateRule, '.atlasPlate base rule missing');
  assert.match(
    atlasPlateRule[1],
    /color:\s*var\(--sky-text-2\);/,
    'AtlasPlate body text must default to sky.text-2 (D-05)',
  );

  assert.match(
    css,
    /\.atlasPlate\s+:where\([^)]*h1[^)]*\)\s*\{[^}]*color:\s*#F9F6EE;/s,
    'AtlasPlate headings must default to Bone (D-05)',
  );

  const plottingSheetRule = css.match(/\.plottingSheet\s*\{([^}]*)\}/s);
  assert.ok(plottingSheetRule, '.plottingSheet base rule missing');
  assert.match(
    plottingSheetRule[1],
    /color:\s*#09243D;/,
    'PlottingSheet text must default to Ink (D-06)',
  );
});

test('registers the future Wave 2/3 Playwright specs in exactly their required projects', () => {
  const source = read('playwright.config.ts');

  // Every project currently defined in playwright.config.ts. Kept as an explicit list (not
  // derived from the file) so this test independently proves both presence in the required
  // projects AND absence from every other one, rather than only ever checking a subset.
  const ALL_PROJECTS = [
    'chromium-desktop',
    'firefox-desktop',
    'webkit-desktop',
    'mobile-chromium',
    'mobile-webkit',
    'tablet-chromium',
    'wide-chromium',
    'compact-320-chromium',
    'tablet-portrait-chromium',
    'accessibility-chromium',
    'immersive-chromium',
    'visual-chromium',
  ];

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

  function projectBlock(projectName) {
    const marker = `name: '${projectName}',`;
    const start = source.indexOf(marker);
    assert.ok(start !== -1, `project ${projectName} not found in playwright.config.ts`);
    const end = source.indexOf('\n    },', start);
    assert.ok(end !== -1, `project ${projectName} block not closed as expected`);
    return source.slice(start, end);
  }

  for (const [spec, requiredProjects] of Object.entries(registrations)) {
    // Look for the literal regex-literal text (e.g. /app-bar\.spec\.ts/) as written in
    // playwright.config.ts, not an interpreted regular expression.
    const literalSpec = spec.split('.').join('\\.');
    const needle = `/${literalSpec}/`;
    const requiredSet = new Set(requiredProjects);

    for (const projectName of ALL_PROJECTS) {
      const block = projectBlock(projectName);
      if (requiredSet.has(projectName)) {
        assert.ok(block.includes(needle), `${projectName} testMatch missing ${needle}`);
      } else {
        assert.ok(!block.includes(needle), `${projectName} testMatch must not include ${needle}`);
      }
    }
  }
});
