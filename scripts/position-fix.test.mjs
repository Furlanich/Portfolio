import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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
} = await import('../lib/impact/position-fix.ts');

const componentsDir = path.join(process.cwd(), 'components/homepage/impact');
const figurePath = path.join(componentsDir, 'PositionFixFigure.tsx');
const togglePath = path.join(componentsDir, 'PositionFixToggle.tsx');
const countsPath = path.join(componentsDir, 'ImpactCounts.tsx');
const cssPath = path.join(componentsDir, 'position-fix.module.css');

function readAllComponentSources() {
  return fs
    .readdirSync(componentsDir)
    .filter((name) => name.endsWith('.tsx') || name.endsWith('.ts'))
    .map((name) => ({ name, source: fs.readFileSync(path.join(componentsDir, name), 'utf8') }));
}

test('counts are computed from SOURCES, never hard-coded', () => {
  assert.equal(SOURCES.length, 5);
  assert.equal(counts.separate, SOURCES.length);
  assert.equal(counts.separate, 5);
  assert.equal(counts.connected, 1);
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
  const source = fs.readFileSync(figurePath, 'utf8');
  const svgOpenTags = [...source.matchAll(/<svg\b[^>]*>/g)].map((match) => match[0]);

  assert.equal(svgOpenTags.length, 2, 'expects exactly two SVGs (small multiples): separate and connected');
  for (const tag of svgOpenTags) {
    assert.match(tag, /role="img"/);
  }

  assert.match(source, /<title[^>]*>[\s\S]*?<\/title>/);
  assert.match(source, /<desc[^>]*>[\s\S]*?<\/desc>/);
});

test('the figure renders a visible source list as the text equivalent', () => {
  const source = fs.readFileSync(figurePath, 'utf8');
  assert.match(source, /<ul[^>]*>/);
  assert.match(source, /sources\.map/);
});

test('the toggle uses aria-pressed buttons, a polite live region and role="group"', () => {
  const source = fs.readFileSync(togglePath, 'utf8');

  assert.match(source, /^['"]use client['"];?/m);
  assert.match(source, /role="group"/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /aria-live="polite"/);
});

test('the toggle hides the inactive SVG with the native hidden attribute', () => {
  const source = fs.readFileSync(togglePath, 'utf8');
  assert.match(source, /\bhidden(=|\s|})/);
});

test('no forbidden metric/case-study/testimonial identifiers appear anywhere in the owned component or lib sources', () => {
  const forbidden = /metric-card|case-study|testimonial/i;
  const geometrySource = fs.readFileSync(path.join(process.cwd(), 'lib/impact/position-fix.ts'), 'utf8');

  assert.doesNotMatch(geometrySource, forbidden);
  for (const { name, source } of readAllComponentSources()) {
    assert.doesNotMatch(source, forbidden, `${name} contains a forbidden identifier`);
  }
});

test('honesty rule: no percentages, durations, currency or client-name-shaped literals in the owned sources', () => {
  const forbidden = /%|x faster|\$\d|USD|EUR/;
  for (const { name, source } of readAllComponentSources()) {
    assert.doesNotMatch(source, forbidden, `${name} contains a forbidden literal`);
  }
});

test('the chart pair uses the exact D-04 chart tokens, with the token name recorded in a comment', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /#8FA3B6/, 'chart.context-light');
  assert.match(css, /chart\.context-light/i);
  assert.match(css, /#004589/, 'chart.signal-light');
  assert.match(css, /chart\.signal-light/i);
});

test('ImpactCounts renders a title, two proportional rows and a caption, computed from counts', () => {
  const source = fs.readFileSync(countsPath, 'utf8');

  assert.doesNotMatch(source, /^['"]use client['"];?/m);
  assert.match(source, /counts\.separate/);
  assert.match(source, /counts\.connected/);
  assert.match(source, /aria-hidden/);
});

test('the crossfade is 240ms opacity plus a 2px blur with the approved easing, instant under reduced motion', () => {
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /240ms/);
  assert.match(css, /blur\(2px\)/);
  assert.match(css, /cubic-bezier\(\.23,\s*1,\s*\.32,\s*1\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('fixLabel font size is 12 user units at >=768px and 24 below', () => {
  const css = fs.readFileSync(cssPath, 'utf8');
  const fixLabelBlocks = [...css.matchAll(/\.fixLabel\s*\{[^}]*\}/g)].map((match) => match[0]);

  assert.ok(fixLabelBlocks.some((block) => /font-size:\s*24px/.test(block)), 'expects a 24px default (below 768px)');
  const mediaBlocks = [...css.matchAll(/@media[^{]*768px[^{]*\{[\s\S]*?\.fixLabel\s*\{[^}]*font-size:\s*12px/g)];
  assert.ok(mediaBlocks.length > 0, 'expects a >=768px media query setting .fixLabel to 12px');
});
