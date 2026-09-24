import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const {
  SOURCES,
  SOURCE_IDS,
  MISSES,
  EXACT_FIX,
  DOUBT_ELLIPSE,
  POSITION_FIX_VIEW_BOX,
  LABEL_MARGIN,
  getSeparateLines,
  getConnectedLines,
  counts,
  computeCounts,
  fixLabelUnitForWidth,
  renderedFixLabelPx,
  markerNumberForSourceId,
  MARKER_NUMBER_UNIT,
  MARKER_NUMBER_MIN_EXPECTED_WIDTH,
  MARKER_RADIUS,
  markerNumberVerticalExtent,
} = await import('../lib/impact/position-fix.ts');

const componentsDir = path.join(process.cwd(), 'components/homepage/impact');
const figurePath = path.join(componentsDir, 'PositionFixFigure.tsx');
const togglePath = path.join(componentsDir, 'PositionFixToggle.tsx');
const countsPath = path.join(componentsDir, 'ImpactCounts.tsx');
const cssPath = path.join(componentsDir, 'position-fix.module.css');

// NEW-2 (independent review round 3, should-fix): the repo has
// core.autocrlf=true, so a fresh checkout on Windows can materialize these
// source files with CRLF line endings even though they were authored with
// LF. Several regexes below match "\n" immediately after a non-whitespace
// character (e.g. "\}\n" for a CSS block's closing brace) -- on a CRLF
// checkout that closing brace is followed by "\r\n", not "\n", so the match
// silently fails. Normalizing every file read here to LF, once, means every
// regex in this file can keep assuming LF without auditing each one by hand.
function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function readAllComponentSources() {
  return fs
    .readdirSync(componentsDir)
    .filter((name) => name.endsWith('.tsx') || name.endsWith('.ts'))
    .map((name) => ({ name, source: readSource(path.join(componentsDir, name)) }));
}

/*
 * N-A1 (independent review round 3, blocking): a prior fix relied on
 * `.sourceList li::marker` for the visible ordinal numbering, verified only
 * by reading the CSS source text -- but `.sourceList li { display: flex }`
 * silences `::marker` (it only paints on `display: list-item` elements), so
 * no number was ever actually drawn. That is exactly the class of bug a
 * source-text regex on the CSS cannot catch: the CSS "looks right" in
 * isolation. This genuinely renders PositionFixFigure (via TypeScript's own
 * transpileModule, since this project's tests otherwise never touch JSX --
 * ts.transpileModule turns .tsx into plain createElement calls, which run
 * exactly like handwritten React) and inspects the real output markup for
 * the numeral text nodes, so a CSS-only "fix" can never pass this again.
 * PositionFixToggle is stubbed out (renders null): the source list markup
 * this test cares about is a sibling of it, not a descendant, and the
 * toggle's own hooks (useSyncExternalStore etc.) are unrelated to this test.
 */
function transpileToCommonJs(filePath) {
  const output = ts.transpileModule(readSource(filePath), {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filePath,
  });
  return output.outputText;
}

function loadTranspiledModule(filePath, resolveMap) {
  const mod = new Module(filePath);
  mod.filename = filePath;
  mod.paths = Module._nodeModulePaths(path.dirname(filePath));
  mod.require = (request) =>
    Object.prototype.hasOwnProperty.call(resolveMap, request) ? resolveMap[request] : mod.constructor._load(request, mod, false);
  mod._compile(transpileToCommonJs(filePath), filePath);
  return mod.exports;
}

const MOCK_POSITION_FIX_CONTENT = {
  illustrativeTag: 'Illustrative scenario',
  toggle: { groupLabel: 'Scenario', separateLabel: 'Separate sources', connectedLabel: 'Connected record', announcement: 'Showing: {state}' },
  figure: {
    title: 'Where one order stands',
    separateDescription: 'Five bearings cross in different places.',
    connectedDescription: 'Every bearing meets at one exact point.',
    doubtLabel: 'Area of doubt',
    fixLabel: 'Exact fix',
  },
  sources: [
    { id: 'whatsapp', name: 'WhatsApp thread', note: 'Confirmed in the chat' },
    { id: 'book', name: 'Paper order book', note: 'Written down, not yet paid' },
    { id: 'spreadsheet', name: 'Spreadsheet', note: 'Updated yesterday evening' },
    { id: 'email', name: 'Email', note: 'Customer asked to change the date' },
    { id: 'call', name: 'Phone call', note: 'Promised for Friday' },
  ],
  connectedNoteTemplate: '{source}: reads the connected record',
  counts: { title: 'Places checked', separateLabel: 'Separate sources', connectedLabel: 'Connected record', caption: 'Counts come from this example.' },
};

function renderPositionFixFigureMarkup() {
  const libModule = loadTranspiledModule(path.join(process.cwd(), 'lib/impact/position-fix.ts'), {});

  // Stub the client toggle (renders null): this test only needs the visible
  // <ol> source list PositionFixFigure renders as its own sibling markup.
  const toggleStubMod = new Module(togglePath);
  toggleStubMod.filename = togglePath;
  toggleStubMod._compile(
    "function PositionFixToggle() { return null; }\nmodule.exports = { PositionFixToggle };\n",
    togglePath,
  );

  // CSS Modules have no meaning outside a bundler; stub each class name to
  // itself so rendered `class="..."` attributes stay legible in assertions.
  const cssStub = new Proxy({}, { get: (_target, prop) => String(prop) });

  const figureModule = loadTranspiledModule(figurePath, {
    '@/lib/impact/position-fix': libModule,
    './PositionFixToggle': toggleStubMod.exports,
    './position-fix.module.css': cssStub,
  });

  return renderToStaticMarkup(createElement(figureModule.PositionFixFigure, { content: MOCK_POSITION_FIX_CONTENT }));
}

test('counts are computed from SOURCES, never hard-coded', () => {
  assert.equal(SOURCES.length, 5);
  assert.equal(counts.separate, SOURCES.length);
  assert.equal(counts.separate, 5);
  assert.equal(counts.connected, 1);
});

test('N4: counts are driven by source-array length, not a hard-coded number (mutation check)', () => {
  // Proves computeCounts (and therefore the exported `counts`) really reads
  // .length, rather than someone having hard-coded `separate: 5`: a mutated
  // copy of SOURCES must change the result.
  assert.deepEqual(computeCounts(SOURCES.slice(0, 3)), { separate: 3, connected: 1 });
  assert.deepEqual(computeCounts([]), { separate: 0, connected: 1 });
  assert.deepEqual(computeCounts(SOURCES), counts);
});

test('the five source ids are whatsapp, book, spreadsheet, email, call in that fixed order', () => {
  assert.deepEqual(
    SOURCES.map((source) => source.id),
    ['whatsapp', 'book', 'spreadsheet', 'email', 'call'],
  );
  assert.deepEqual(SOURCE_IDS, ['whatsapp', 'book', 'spreadsheet', 'email', 'call']);
});

test('every miss point lies inside the doubt ellipse', () => {
  assert.equal(MISSES.length, SOURCES.length);

  for (const [index, miss] of MISSES.entries()) {
    const normalized =
      ((miss.x - DOUBT_ELLIPSE.cx) ** 2) / (DOUBT_ELLIPSE.rx ** 2) +
      ((miss.y - DOUBT_ELLIPSE.cy) ** 2) / (DOUBT_ELLIPSE.ry ** 2);

    assert.ok(normalized <= 1, `miss ${index} (${miss.x}, ${miss.y}) falls outside the doubt ellipse: ${normalized}`);
  }
});

test('all connected lines end at EXACT_FIX', () => {
  const lines = getConnectedLines();
  assert.equal(lines.length, SOURCES.length);

  for (const line of lines) {
    assert.equal(line.x2, EXACT_FIX.x);
    assert.equal(line.y2, EXACT_FIX.y);
  }
});

test('separate lines start at their source and extend 25% past their miss point', () => {
  const lines = getSeparateLines();
  assert.equal(lines.length, SOURCES.length);

  lines.forEach((line, index) => {
    const source = SOURCES[index];
    const miss = MISSES[index];
    assert.equal(line.x1, source.x);
    assert.equal(line.y1, source.y);
    assert.ok(Math.abs(line.x2 - (miss.x + (miss.x - source.x) * 0.25)) < 1e-9);
    assert.ok(Math.abs(line.y2 - (miss.y + (miss.y - source.y) * 0.25)) < 1e-9);
  });
});

test('every plotted coordinate stays inside the viewBox with a 20-unit label margin', () => {
  const minX = LABEL_MARGIN;
  const maxX = POSITION_FIX_VIEW_BOX.width - LABEL_MARGIN;
  const minY = LABEL_MARGIN;
  const maxY = POSITION_FIX_VIEW_BOX.height - LABEL_MARGIN;

  const points = [
    ...SOURCES,
    EXACT_FIX,
    { x: DOUBT_ELLIPSE.cx - DOUBT_ELLIPSE.rx, y: DOUBT_ELLIPSE.cy },
    { x: DOUBT_ELLIPSE.cx + DOUBT_ELLIPSE.rx, y: DOUBT_ELLIPSE.cy },
    { x: DOUBT_ELLIPSE.cx, y: DOUBT_ELLIPSE.cy - DOUBT_ELLIPSE.ry },
    { x: DOUBT_ELLIPSE.cx, y: DOUBT_ELLIPSE.cy + DOUBT_ELLIPSE.ry },
    ...getSeparateLines().flatMap((line) => [
      { x: line.x1, y: line.y1 },
      { x: line.x2, y: line.y2 },
    ]),
    ...getConnectedLines().flatMap((line) => [
      { x: line.x1, y: line.y1 },
      { x: line.x2, y: line.y2 },
    ]),
  ];

  for (const point of points) {
    assert.ok(
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY,
      `point (${point.x}, ${point.y}) breaches the ${LABEL_MARGIN}-unit label margin`,
    );
  }
});

test('PositionFixToggle is the only client component under components/homepage/impact', () => {
  const clientFiles = readAllComponentSources().filter(({ source }) => /^['"]use client['"];?/m.test(source));

  assert.deepEqual(
    clientFiles.map((file) => file.name),
    ['PositionFixToggle.tsx'],
  );
});

test('both SVGs declare role="img" with a title and a description', () => {
  const source = readSource(figurePath);
  const svgOpenTags = [...source.matchAll(/<svg\b[^>]*>/g)].map((match) => match[0]);

  assert.equal(svgOpenTags.length, 2, 'expects exactly two SVGs (small multiples): separate and connected');
  for (const tag of svgOpenTags) {
    assert.match(tag, /role="img"/);
  }

  assert.match(source, /<title[^>]*>[\s\S]*?<\/title>/);
  assert.match(source, /<desc[^>]*>[\s\S]*?<\/desc>/);
});

test('the figure renders a visible source list as the text equivalent', () => {
  const source = readSource(figurePath);
  // An <ol>, not a <ul>, per the S4 amendment: the list's own numbering must
  // match the SVG's decorative numeral keys (see the S4-amendment tests below).
  assert.match(source, /<ol[^>]*>/);
  assert.match(source, /sources\.map/);
});

test('the toggle uses aria-pressed buttons, a polite live region and role="group"', () => {
  const source = readSource(togglePath);

  assert.match(source, /^['"]use client['"];?/m);
  assert.match(source, /role="group"/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /aria-live="polite"/);
});

// N-S1 (independent review round 2, should-fix): the live region used to
// fill in as soon as `mounted` became true, so a screen reader would
// announce "Showing: Separate sources" on page load even though the user
// never touched the toggle. It must start empty and only be set from an
// actual click, inside select().
test('N-S1: the live-region announcement starts empty and is only set from a click', () => {
  const source = readSource(togglePath);

  assert.doesNotMatch(
    source,
    /const announcement = mounted\s*\n?\s*\?/,
    'announcement must not be derived from `mounted` alone',
  );
  assert.match(source, /useState\(['"]{2}\)/, 'expects announcement state to start as an empty string');

  const selectBody = source.match(/function select\([^)]*\)\s*\{[\s\S]*?\n {2}\}/);
  assert.ok(selectBody, 'expects a select() function');
  assert.match(
    selectBody[0],
    /setAnnouncement\(/,
    'expects select() to be the place that sets the announcement text',
  );
});

test('the toggle hides the inactive SVG with the native hidden attribute', () => {
  const source = readSource(togglePath);
  assert.match(source, /\bhidden(=|\s|})/);
});

// B1 (independent review round 1): real progressive enhancement. Deep dynamic
// behaviour (what an actual browser paints before vs. after hydration, and
// after a click) needs a real DOM, which this Node-only test suite does not
// have (no jsdom/browser here, matching every other test in this file). These
// tests are the static-analysis proxy the review asked for; the PR
// description lists what Task 9's tests/e2e/home-sections.spec.ts must still
// verify live in a browser.
test('B1: no <button> is ever rendered before the toggle has mounted', () => {
  const source = readSource(togglePath);

  // Mount detection uses useSyncExternalStore's server/client snapshots
  // (false on the server and on the first client render, true after), not
  // useState(false) + useEffect(() => setMounted(true), []): that pattern
  // calls setState synchronously inside an effect, which the
  // react-hooks/set-state-in-effect lint rule flags. Either mechanism yields
  // the same false-until-mounted value; what matters here is that the button
  // group is gated on it.
  assert.match(source, /useSyncExternalStore/, 'expects a hydration-safe mounted flag');
  assert.match(source, /getServerSnapshot\s*=\s*\(\)\s*=>\s*false/, 'expects the server/pre-hydration snapshot to be false');
  assert.match(source, /\{\s*mounted\s*&&/, 'expects the button group to be gated on `mounted`');

  const gateIndex = source.search(/\{\s*mounted\s*&&/);
  const firstButtonIndex = source.indexOf('<button');
  assert.ok(gateIndex !== -1 && firstButtonIndex !== -1, 'expects both a mounted gate and a <button>');
  assert.ok(gateIndex < firstButtonIndex, 'expects <button> to appear only inside the mounted-gated block');
});

test('B1: the initial "separate" selection is in effect once mounted, without a click', () => {
  const source = readSource(togglePath);

  assert.match(source, /INITIAL_MODE\s*[:=][^;]*'separate'/, 'expects the fixed initial selection to be "separate"');
  assert.match(
    source,
    /useState<PositionFixMode>\(INITIAL_MODE\)/,
    '`selected` should start at INITIAL_MODE directly, not at null',
  );
  // No setState call should run inside a useEffect body (the fix for the
  // react-hooks/set-state-in-effect violation this replaced): the effective
  // hidden layer is derived from `mounted` and `selected` in render instead.
  assert.doesNotMatch(source, /useEffect\(\s*\(\)\s*=>\s*\{[^}]*set[A-Z]/, 'expects no setState call inside a useEffect body');
});

test('B1: neither figure is hidden before mount, so both stay visible and stacked without JS', () => {
  const source = readSource(togglePath);
  // Only `hiddenLayer` should be nullable now: it starts at null (nothing
  // hidden pre-mount, and no click has happened yet post-mount either).
  // `selected` is asserted separately to start at INITIAL_MODE.
  const nullableDeclarations = source.match(/useState<PositionFixMode \| null>\(null\)/g) ?? [];
  assert.equal(nullableDeclarations.length, 1, 'expects exactly one nullable PositionFixMode state (hiddenLayer)');
  assert.match(
    source,
    /effectiveHiddenLayer[^=]*=\s*!mounted\s*\n?\s*\?\s*null/,
    'expects the effective hidden layer to be null whenever `mounted` is false',
  );
});

test('B1: the pressed state always matches what is visible once mounted', () => {
  const source = readSource(togglePath);
  // Both buttons key off the same non-nullable `selected` value directly
  // (no `!== 'connected'` fallback-to-true heuristic for the unmounted case,
  // now that the group only renders post-mount).
  assert.match(source, /aria-pressed=\{selected === 'separate'\}/);
  assert.match(source, /aria-pressed=\{selected === 'connected'\}/);
});

test('no forbidden metric/case-study/testimonial identifiers appear anywhere in the owned component or lib sources', () => {
  const forbidden = /metric-card|case-study|testimonial/i;
  const geometrySource = readSource(path.join(process.cwd(), 'lib/impact/position-fix.ts'));

  assert.doesNotMatch(geometrySource, forbidden);
  for (const { name, source } of readAllComponentSources()) {
    assert.doesNotMatch(source, forbidden, `${name} contains a forbidden identifier`);
  }
});

// N1 (independent review round 1): the original honesty guard banned any "%"
// character anywhere in source, which is too broad — ImpactCounts legitimately
// computes a CSS width percentage in JS for its decorative, aria-hidden bar
// (D-15 / section 12), never displays it as text. Scoped to rendered JSX text
// nodes only (the ">...<" pattern), where a literal percentage or duration
// really would be a false statistic. Content-string checks (Task 4's copy)
// stay owned by Task 4's scripts/homepage-content.test.mjs.
test('honesty rule: no visible percentage or duration claim in rendered JSX text', () => {
  const percentInText = />[^<{]*\d\s*%[^<]*</;
  const durationInText = />[^<{]*\b\d+\s*(ms|s|sec|seconds?|min|mins?|minutes?|hours?|hrs?|days?|weeks?|months?|years?)\b[^<]*</i;

  for (const { name, source } of readAllComponentSources()) {
    assert.doesNotMatch(source, percentInText, `${name} renders a visible percentage`);
    assert.doesNotMatch(source, durationInText, `${name} renders a visible duration`);
  }
});

test('honesty rule: no currency or "x faster"-shaped literals anywhere in the owned sources', () => {
  const forbidden = /x faster|\$\d|\bUSD\b|\bEUR\b/;
  for (const { name, source } of readAllComponentSources()) {
    assert.doesNotMatch(source, forbidden, `${name} contains a forbidden literal`);
  }
});

// N3 (independent review round 1): use the @/ path alias instead of a
// relative ../../../ climb, matching the rest of the codebase's convention.
test('N3: imports lib/impact/position-fix via the @/ path alias', () => {
  for (const { name, source } of readAllComponentSources()) {
    if (!/lib\/impact\/position-fix/.test(source)) continue;
    assert.doesNotMatch(source, /\.\.\/.*lib\/impact\/position-fix/, `${name} should not use a relative import`);
    assert.match(source, /@\/lib\/impact\/position-fix/, `${name} should import via @/lib/impact/position-fix`);
  }
});

test('the chart pair uses the exact D-04 chart tokens, with the token name recorded in a comment', () => {
  const css = readSource(cssPath);

  assert.match(css, /#8FA3B6/i, 'chart.context-light');
  assert.match(css, /chart\.context-light/i);
  assert.match(css, /#004589/i, 'chart.signal-light');
  assert.match(css, /chart\.signal-light/i);
});

// S2 (independent review round 1): use the shared next/font/local variables
// (app/fonts.ts) instead of literal family names, so the figure picks up the
// site's actual loaded fonts rather than whatever "IBM Plex Mono"/"Instrument
// Sans" happens to resolve to outside next/font's font-loading strategy.
test('S2: no literal font-family names; uses the shared --font-mono / --font-sans variables', () => {
  const css = readSource(cssPath);

  assert.doesNotMatch(css, /'IBM Plex Mono'/);
  assert.doesNotMatch(css, /'Instrument Sans'/);
  assert.match(css, /var\(--font-mono\),\s*ui-monospace,\s*monospace/);
  assert.match(css, /var\(--font-sans\),\s*ui-sans-serif,\s*system-ui,\s*sans-serif/);
});

test('ImpactCounts renders a title, two proportional rows and a caption, computed from counts', () => {
  const source = readSource(countsPath);

  assert.doesNotMatch(source, /^['"]use client['"];?/m);
  assert.match(source, /counts\.separate/);
  assert.match(source, /counts\.connected/);
  assert.match(source, /aria-hidden/);
});

test('the crossfade is 240ms opacity plus a 2px blur with the approved easing, instant under reduced motion', () => {
  const css = readSource(cssPath);

  assert.match(css, /240ms/);
  assert.match(css, /blur\(2px\)/);
  assert.match(css, /cubic-bezier\(\.23,\s*1,\s*\.32,\s*1\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

// S1 (independent review round 1): stable height during the crossfade, and a
// real fade-in (not an instant snap once `hidden` is removed).
test('S1: both figure layers share one grid cell so the figure height stays stable', () => {
  const toggleSource = readSource(togglePath);
  assert.match(toggleSource, /styles\.layerStack/, 'expects a grid container wrapping both .layer divs');

  const css = readSource(cssPath);
  const layerStackBlock = css.match(/\.layerStack\s*\{[^}]*\}/);
  assert.ok(layerStackBlock, 'expects a .layerStack rule');
  assert.match(layerStackBlock[0], /display:\s*grid/);

  const layerBlock = css.match(/\.layer\s*\{[^}]*\}/);
  assert.ok(layerBlock, 'expects a .layer rule');
  assert.match(layerBlock[0], /grid-area:\s*1\s*\/\s*1/, 'expects both layers stacked on the same grid cell');
});

test('S1: the incoming layer has a real starting style to fade in from', () => {
  const css = readSource(cssPath);
  assert.match(css, /@starting-style/);

  const startingBlock = css.match(/@starting-style\s*\{[\s\S]*?\.layer\[data-fade=(['"])in\1\][^}]*\{[^}]*\}/);
  assert.ok(startingBlock, 'expects @starting-style to declare the faded-out start for .layer[data-fade="in"]');
  assert.match(startingBlock[0], /opacity:\s*0/);
  assert.match(startingBlock[0], /blur\(2px\)/);
});

// N-B1 (independent review round 2, blocking): `.layer { grid-area: 1/1 }`
// applied unconditionally means a no-JS or pre-hydration render stacks both
// SVGs (and captions) in the same grid cell, overlapping each other — that
// breaks the "without JS both SVGs show stacked [vertically]" contract and
// flashes overlapping charts before hydration. The grid-cell sharing must be
// scoped to only apply once mounted.
test('N-B1: layers only share a grid cell once mounted; unmounted, they flow vertically', () => {
  const toggleSource = readSource(togglePath);
  assert.match(
    toggleSource,
    /data-enhanced=\{mounted\s*\|\|\s*undefined\}/,
    'expects the layer-stack container to carry a data-enhanced attribute only once mounted',
  );

  const css = readSource(cssPath);
  // The unconditional .layer { grid-area: 1/1 } rule must be gone...
  const unconditionalGridArea = css.match(/^\.layer\s*\{[^}]*\}/m);
  assert.ok(unconditionalGridArea, 'expects a base .layer rule');
  assert.doesNotMatch(unconditionalGridArea[0], /grid-area/, '.layer itself must not set grid-area unconditionally');

  // ...and scoped instead to .layerStack[data-enhanced] > .layer.
  assert.match(css, /\.layerStack\[data-enhanced\]\s*>\s*\.layer\s*\{[^}]*grid-area:\s*1\s*\/\s*1/);
});

// S4 (independent review round 1): replaced the two-step viewport media query
// with a container-query ladder, since a viewport-width breakpoint is wrong
// once the figure sits in a narrower grid column than the viewport. The pure
// helpers are the test seam: they prove the chosen unit/width pairs never
// render below the 12px legibility floor, independent of any CSS engine.
test('S4: the fixLabel ladder keeps the rendered label size >= 12px at every width', () => {
  for (const width of [300, 399, 400, 499, 500, 599, 600, 900]) {
    const unit = fixLabelUnitForWidth(width);
    assert.ok(unit !== null, `expected a visible unit at width ${width}`);
    const renderedPx = renderedFixLabelPx(width, unit);
    assert.ok(renderedPx >= 12, `width ${width} renders .fixLabel at ${renderedPx}px, below the 12px floor`);
  }
});

test('S4: labels are hidden (not just tiny) below the 300px container-width floor', () => {
  assert.equal(fixLabelUnitForWidth(299), null);
  assert.equal(fixLabelUnitForWidth(0), null);
});

test('S4: the CSS declares an inline-size container and a matching @container ladder for .fixLabel', () => {
  const css = readSource(cssPath);

  assert.match(css, /container-type:\s*inline-size/);
  assert.match(css, /@container[^{]*max-width:\s*299(\.\d+)?px[^{]*\{[^}]*\.fixLabel\s*\{[^}]*display:\s*none/s);

  for (const width of [300, 400, 500, 600]) {
    assert.match(
      css,
      new RegExp(`@container[^{]*min-width:\\s*${width}px`),
      `expects an @container rule starting at ${width}px`,
    );
  }

  // The old viewport-width media query is gone, replaced by the container ladder.
  assert.doesNotMatch(css, /@media \(min-width: 768px\)/);
});

test('S4: PositionFixFigure wraps each chart SVG in the inline-size container', () => {
  const source = readSource(figurePath);
  const wrapperCount = (source.match(/styles\.chartWrapper/g) ?? []).length;
  assert.equal(wrapperCount, 2, 'expects both the separate and connected SVGs wrapped in .chartWrapper');
});

// S4 amendment (orchestrator decision, plan SHA 5b8a8e5): below 300px the
// full-name label is replaced by a numeral key (1-5), not hidden outright.
test('S4-amendment: numeral keys are assigned in fixed source order (whatsapp=1 ... call=5)', () => {
  assert.deepEqual(
    SOURCE_IDS.map((id) => markerNumberForSourceId(id)),
    [1, 2, 3, 4, 5],
  );
});

test('S4-amendment: the numeral key renders >= 12px at the narrowest expected figure width', () => {
  const renderedPx = renderedFixLabelPx(MARKER_NUMBER_MIN_EXPECTED_WIDTH, MARKER_NUMBER_UNIT);
  assert.ok(
    renderedPx >= 12,
    `${MARKER_NUMBER_MIN_EXPECTED_WIDTH}px numeral renders at ${renderedPx}px, below the 12px floor`,
  );
});

test('S4-amendment: full-name labels are hidden and numeral keys shown below the 300px floor', () => {
  const css = readSource(cssPath);
  const belowFloorBlock = css.match(/@container[^{]*max-width:\s*299(\.\d+)?px[^{]*\{[\s\S]*?\n\}\n/);

  assert.ok(belowFloorBlock, 'expects the below-300px @container block');
  assert.match(belowFloorBlock[0], /\.fixLabel\s*\{[^}]*display:\s*none/, 'full labels hidden below 300px');
  assert.match(belowFloorBlock[0], /\.markerNumber\s*\{[^}]*display:\s*inline/, 'numerals shown below 300px');

  // Numerals are hidden by default (>= 300px): the *first* .markerNumber
  // rule in document order is expected to be the plain, top-level one
  // (declared before any @container block), setting display: none.
  const allMarkerNumberBlocks = [...css.matchAll(/\.markerNumber\s*\{[^}]*\}/g)];
  assert.ok(allMarkerNumberBlocks.length >= 2, 'expects a default rule plus the below-300px override');
  assert.match(allMarkerNumberBlocks[0][0], /display:\s*none/, 'expects the first (default) .markerNumber rule to hide it');
});

test('S4-amendment: the visible source list is an ordered list, at every width', () => {
  const source = readSource(figurePath);
  assert.match(source, /<ol[^>]*>/);
  assert.doesNotMatch(source, /<ul[^>]*>/);
});

// N-A1 (independent review round 2 fix, corrected in round 3, blocking):
// round 2 relied on `.sourceList li::marker` plus `list-style: decimal` for
// visible ordinal numbering, verified only by reading the CSS source text.
// But `.sourceList li { display: flex }` silences `::marker` -- it only
// paints on `display: list-item` elements -- so headless Chromium confirmed
// no number was ever actually drawn. Numbers are now explicit <span>
// elements in the markup, independent of any list-style/::marker behaviour;
// `list-style: none` is back on the <ol> (nothing left to suppress), with
// `role="list"` to keep list semantics for assistive tech that drops them
// on a styleless list (notably Safari/VoiceOver).
//
// This test renders the real component (see renderPositionFixFigureMarkup
// above) and reads the actual output markup, specifically so a CSS-only fix
// -- the same class of bug that shipped in round 2 -- cannot pass it again.
test('N-A1: the source list renders visible numeral spans (1-5, source order) with role="list"', () => {
  const html = renderPositionFixFigureMarkup();

  assert.match(html, /<ol\b[^>]*\brole="list"/, 'expects role="list" on the <ol>');

  const numbers = [...html.matchAll(/<span aria-hidden="true"[^>]*>(\d)\.<\/span>/g)].map((match) => match[1]);
  assert.deepEqual(
    numbers,
    ['1', '2', '3', '4', '5'],
    `expects visible "1." .. "5." numeral spans in source order; got ${JSON.stringify(numbers)} from: ${html}`,
  );
});

test('N-A1: .sourceList sets list-style: none (nothing left for ::marker to suppress) and no stale ::marker rule remains', () => {
  const css = readSource(cssPath);
  const sourceListBlock = css.match(/\.sourceList\s*\{[^}]*\}/);

  assert.ok(sourceListBlock, 'expects a .sourceList rule');
  assert.match(sourceListBlock[0], /list-style:\s*none/, 'expects list-style: none now that numbers are explicit spans');
  // A real rule (selector immediately followed by "{"), not a prose mention
  // of the pseudo-element inside an explanatory comment above.
  assert.doesNotMatch(
    css,
    /::marker\s*\{/,
    'the ineffective li::marker rule should be removed, not left as dead CSS',
  );
});

// NEW-1 (independent review round 3, nit): lock in that the numeral <text>
// elements actually use markerNumberAnchor's x/y, not just that the helper
// itself computes safe coordinates (N-A2 already proves that). Old-anchor
// mutation result, recorded here per the review (not re-derived by a
// committed test, since markerNumberAnchor's own offsets are already
// covered by N-A2): with the pre-round-2 offsets (-12 top / +22 bottom,
// shared with the name label) and the same 0.75 ascent-ratio estimate,
// `book`'s numeral (y=34, top offset -12) has its top edge at
// 34 - 12 - 32*0.75 = -2, outside the viewBox (y < 0); `email`/`call`'s
// numeral (y=250, bottom offset +22) has its top edge at
// 250 + 22 - 32*0.75 = 248, inside their own marker circle, which reaches
// down to y=256 (250+6) -- i.e. N-A2's test would have failed against the
// pre-round-2 code, which is exactly why round 2 gave the numeral its own
// offsets instead of reusing the name label's.
test('NEW-1: the numeral is actually positioned by markerNumberAnchor, not a separate/hard-coded offset', () => {
  const source = readSource(figurePath);

  assert.match(
    source,
    /const numberAnchor = markerNumberAnchor\(point\);/,
    'expects the numeral position to come from markerNumberAnchor(point)',
  );
  assert.match(source, /x=\{numberAnchor\.x\}/, 'expects the numeral <text> x to read from numberAnchor');
  assert.match(source, /y=\{numberAnchor\.y\}/, 'expects the numeral <text> y to read from numberAnchor');
  assert.match(
    source,
    /textAnchor=\{numberAnchor\.textAnchor\}/,
    'expects the numeral <text> textAnchor to read from numberAnchor',
  );
});

test('S4-amendment: doubt/exact-fix labels have a visible caption fallback below the figures', () => {
  const source = readSource(figurePath);
  assert.match(source, /styles\.chartCaption/);
  assert.match(source, /content\.figure\.separateDescription/);
  assert.match(source, /content\.figure\.connectedDescription/);
});

test('S4-amendment: each marker renders a decorative numeral key alongside its name label', () => {
  const source = readSource(figurePath);
  assert.match(source, /markerNumberForSourceId/);
  assert.match(source, /styles\.markerNumber/);
});

// N-A2 (independent review round 2, should-fix): bottom-half numerals (email,
// call) collided with their own marker circle at the old +22 baseline offset.
// Pure geometry test, independent of any rendered CSS: at every source, the
// numeral's approximate vertical extent must not overlap the marker circle's
// vertical extent, and must stay inside the raw viewBox.
test('N-A2: every numeral clears its own marker circle and stays inside the viewBox', () => {
  for (const point of SOURCES) {
    const { top, bottom } = markerNumberVerticalExtent(point);
    const circleTop = point.y - MARKER_RADIUS;
    const circleBottom = point.y + MARKER_RADIUS;

    const overlapsCircle = bottom > circleTop && top < circleBottom;
    assert.ok(
      !overlapsCircle,
      `${point.id}: numeral extent [${top}, ${bottom}] overlaps its marker circle [${circleTop}, ${circleBottom}]`,
    );
    assert.ok(top >= 0 && bottom <= POSITION_FIX_VIEW_BOX.height, `${point.id}: numeral extent [${top}, ${bottom}] escapes the viewBox`);
  }
});
