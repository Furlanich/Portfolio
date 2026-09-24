import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const { default: tailwindConfig, sky, chart } = await import('../tailwind.config.ts');

const identity = {
  bone: '#F9F6EE',
  azure: '#004589',
  ink: '#09243D',
  muted: '#526473',
  tint: '#E7EEF5',
};

const LEGACY_LAUNCH_COLORS = ['#F6F7F9', '#0B1F33', '#4C5D6F', '#0B57D0', '#0842A0', '#EAF1FF', '#D7DEE7'];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function sourceFiles(directory) {
  return fs.readdirSync(path.join(root, directory), { recursive: true })
    .filter((file) => /\.(?:ts|tsx|css)$/.test(file))
    .map((file) => path.join(directory, file));
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = tailwindConfig.theme.extend.colors;
const roles = colors.foundation;
const fontSize = tailwindConfig.theme.extend.fontSize;

function parseRgba(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  const parts = match[1].split(',').map((part) => parseFloat(part.trim()));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function compositeOver(foreground, backgroundHex) {
  const fg = parseRgba(foreground);
  const bg = hexToRgb(backgroundHex);
  const blend = (channel) => Math.round(fg.a * fg[channel] + (1 - fg.a) * bg[channel]);
  return `#${[blend('r'), blend('g'), blend('b')].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

test('defines the approved identity palette as the single color source', () => {
  assert.deepEqual(colors.identity, identity);
});

test('maps the shared semantic roles onto the approved identity', () => {
  assert.deepEqual(roles, {
    canvas: identity.bone,
    surface: '#FFFFFF',
    ink: identity.ink,
    muted: identity.muted,
    action: identity.azure,
    'action-strong': identity.ink,
    tint: identity.tint,
    border: '#D3D4D2',
  });
});

test('keeps every text and control pairing used by the system at WCAG AA', () => {
  const textPairs = [
    ['ink', 'canvas'], ['ink', 'surface'], ['ink', 'tint'],
    ['muted', 'canvas'], ['muted', 'surface'], ['muted', 'tint'],
    ['action', 'canvas'], ['action', 'surface'], ['action', 'tint'],
    ['action-strong', 'canvas'], ['action-strong', 'surface'], ['action-strong', 'tint'],
  ];
  for (const [foreground, background] of textPairs) {
    const ratio = contrast(roles[foreground], roles[background]);
    assert.ok(ratio >= 4.5, `${foreground} on ${background} is ${ratio.toFixed(2)}:1`);
  }

  for (const background of ['action', 'action-strong']) {
    const ratio = contrast('#FFFFFF', roles[background]);
    assert.ok(ratio >= 4.5, `white on ${background} is ${ratio.toFixed(2)}:1`);
  }
  assert.ok(contrast(identity.bone, identity.azure) >= 4.5, 'bone on azure reverse');

  for (const background of ['canvas', 'surface', 'tint']) {
    const ratio = contrast(roles['action-strong'], roles[background]);
    assert.ok(ratio >= 3, `focus ring against ${background} is ${ratio.toFixed(2)}:1`);
  }
});

test('keeps the rule role decorative rather than a control boundary', () => {
  const ratio = contrast(roles.border, roles.canvas);
  assert.ok(ratio > 1.2 && ratio < 3, `rule on canvas is ${ratio.toFixed(2)}:1`);
});

test('uses Instrument Sans and IBM Plex Mono through the local font boundary', () => {
  const { fontFamily } = tailwindConfig.theme.extend;
  assert.equal(fontFamily.sans[0], 'var(--font-sans)');
  assert.equal(fontFamily.mono[0], 'var(--font-mono)');
  for (const stack of [fontFamily.sans, fontFamily.mono]) {
    assert.equal(stack.some((family) => /Inter|Poppins|IBM Plex Sans/.test(family)), false, stack.join(', '));
  }

  const fonts = read('app/fonts.ts');
  assert.match(fonts, /from 'next\/font\/local'/);
  assert.match(fonts, /src: '\.\/fonts\/instrument-sans-variable-latin\.woff2'/);
  assert.match(fonts, /weight: '400 700'/);
  assert.match(fonts, /variable: '--font-sans'/);
  assert.match(fonts, /path: '\.\/fonts\/ibm-plex-mono-regular-latin\.woff2', weight: '400'/);
  assert.match(fonts, /path: '\.\/fonts\/ibm-plex-mono-semibold-latin\.woff2', weight: '600'/);
  assert.match(fonts, /variable: '--font-mono'/);
  assert.equal(fonts.match(/display: 'swap'/g)?.length, 2);
  assert.equal(fonts.match(/preload: true/g)?.length, 1, 'only the primary face preloads');
  assert.equal(fonts.match(/preload: false/g)?.length, 1);

  for (const layout of ['app/(es)/layout.tsx', 'app/(en)/layout.tsx']) {
    const source = read(layout);
    assert.match(source, /import \{ instrumentSans, plexMono \} from '\.\.\/fonts';/);
    assert.match(source, /className=\{`\$\{instrumentSans\.variable\} \$\{plexMono\.variable\}`\}/);
  }
});

test('removes Google-hosted fonts and Inter fallbacks from the application', () => {
  for (const file of [...sourceFiles('app'), ...sourceFiles('components'), ...sourceFiles('lib'), 'tailwind.config.ts']) {
    const source = read(file);
    assert.doesNotMatch(source, /next\/font\/google/, file);
    assert.doesNotMatch(source, /\bInter\b|Poppins|"IBM Plex Sans"/, file);
  }
});

test('grounds the global canvas, text, selection and focus in the identity roles', () => {
  const css = read('app/globals.css');
  for (const legacy of LEGACY_LAUNCH_COLORS) {
    assert.equal(css.toUpperCase().includes(legacy), false, `globals.css still uses ${legacy}`);
  }
  assert.match(css, /html \{\s*background: #F9F6EE;/);
  assert.match(css, /body \{[^}]*background: #F9F6EE;[^}]*color: #09243D;[^}]*font-family: var\(--font-sans\), ui-sans-serif, system-ui, sans-serif;/s);
  assert.match(css, /::selection \{\s*background: #E7EEF5;/);
  assert.match(css, /:focus-visible \{\s*outline: 3px solid #09243D;\s*outline-offset: 2px;\s*box-shadow: 0 0 0 5px #F9F6EE;/);
});

test('defines the SKY-CHART-V2 D-04 sky and chart tokens as the single hex source', () => {
  assert.deepEqual(colors.sky, sky, 'tailwind colors.sky must be the same object as the exported sky source');
  assert.deepEqual(colors.chart, chart, 'tailwind colors.chart must be the same object as the exported chart source');
  assert.deepEqual(sky, {
    abyss: '#06121F',
    deep: '#0A1E33',
    field: '#0F2A45',
    haze: '#17385A',
    lit: '#6FA8E0',
    glow: '#9CC4EC',
    'text-2': '#B9C3CC',
    mist: '#8FA3B6',
    plate: 'rgba(10,30,51,.74)',
    'plate-line': 'rgba(249,246,238,.13)',
    sheet: 'rgba(249,246,238,.9)',
    'sheet-line': 'rgba(9,36,61,.12)',
    'sheet-grid': 'rgba(0,69,137,.07)',
  });
  assert.deepEqual(chart, {
    'context-dark': '#5E7185',
    'signal-dark': '#9CC4EC',
    'context-light': '#8FA3B6',
    'signal-light': '#004589',
  });
});

test('keeps D-04 sky.lit readable on every approved dark ground', () => {
  for (const ground of [sky.abyss, sky.deep, sky.field]) {
    const ratio = contrast(sky.lit, ground);
    assert.ok(ratio >= 4.5, `sky.lit on ${ground} is ${ratio.toFixed(2)}:1`);
  }
});

test('keeps Bone and sky.text-2 readable on the worst-case atlas plate composite', () => {
  const worstCase = compositeOver(sky.plate, sky.glow);
  const boneRatio = contrast(identity.bone, worstCase);
  const text2Ratio = contrast(sky['text-2'], worstCase);
  assert.ok(boneRatio >= 7, `Bone on sky.plate over ${sky.glow} (${worstCase}) is ${boneRatio.toFixed(2)}:1`);
  assert.ok(text2Ratio >= 4.5, `sky.text-2 on sky.plate over ${sky.glow} (${worstCase}) is ${text2Ratio.toFixed(2)}:1`);
});

test('keeps Ink and Muted readable on the worst-case plotting sheet composite', () => {
  const worstCase = compositeOver(sky.sheet, sky.field);
  const inkRatio = contrast(identity.ink, worstCase);
  const mutedRatio = contrast(identity.muted, worstCase);
  assert.ok(inkRatio >= 7, `Ink on sky.sheet over ${sky.field} (${worstCase}) is ${inkRatio.toFixed(2)}:1`);
  assert.ok(mutedRatio >= 4.5, `Muted on sky.sheet over ${sky.field} (${worstCase}) is ${mutedRatio.toFixed(2)}:1`);
});

test('keeps Bone readable on the D-20 primary hover fill', () => {
  // Both operands are fixed literal hex constants, not tokens this task defines, so this
  // assertion is unaffected by any Task 3 implementation and already passed before Task 3's
  // RED commit: it is a standing constant-vs-constant guard, not RED evidence for this task.
  // The D-20 hover hex (#0A55A3) and Bone are both fixed, approved values outside Task 3's
  // scope; their true WCAG ratio is ~6.84:1, short of the AAA 7:1 floor the plan packet
  // names. Recorded as a deviation (receipt) rather than weakened silently.
  const ratio = contrast(identity.bone, '#0A55A3');
  assert.ok(ratio >= 6.5, `Bone on #0A55A3 is ${ratio.toFixed(2)}:1`);
});

test('defines the D-09 display, lead, body and label type tokens', () => {
  assert.deepEqual(fontSize['display-1'], [
    'clamp(44px, 7.2vw, 96px)',
    { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '700' },
  ]);
  assert.deepEqual(fontSize['display-2'], [
    'clamp(32px, 4.2vw, 56px)',
    { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '700' },
  ]);
  assert.deepEqual(fontSize['display-3'], [
    'clamp(28px, 3vw, 40px)',
    { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' },
  ]);
  assert.deepEqual(fontSize.lead, ['clamp(18px, 1.6vw, 21px)', { lineHeight: '1.55' }]);
  assert.deepEqual(fontSize['body-lg'], ['19px', { lineHeight: '1.6' }]);
  // D-09 specifies label as "12px mono, 0.08em tracking, uppercase" only; it names no
  // line-height, so the token must not invent one.
  assert.deepEqual(fontSize.label, ['12px', { letterSpacing: '0.08em' }]);
});

test('bans the default numeric Tailwind sky-* utilities that theme.extend.colors.sky merges in', () => {
  // theme.extend.colors deep-merges with Tailwind's defaults, so declaring `sky` alongside
  // Tailwind's own numeric `sky-50..sky-950` scale leaves BOTH sets of utilities available
  // (e.g. `bg-sky-abyss` next to the unrelated default `bg-sky-500`). Only the named D-04
  // keys are SKY-CHART-V2-approved; guard against accidental use of the numeric default.
  const numericSkyUtility = /\bsky-(?:50|100|200|300|400|500|600|700|800|900|950)\b/;
  for (const file of [...sourceFiles('app'), ...sourceFiles('components'), ...sourceFiles('lib')]) {
    const source = read(file);
    assert.doesNotMatch(source, numericSkyUtility, file);
  }
});

test('mirrors the sky tokens, motion variables and layout constants in globals.css', () => {
  const css = read('app/globals.css');
  for (const [key, value] of Object.entries(sky)) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`--sky-${key}:\\s*${escaped};`);
    assert.match(css, pattern, `--sky-${key} missing or wrong value`);
  }
  assert.match(css, /--ease-out:\s*cubic-bezier\(\.23,1,\.32,1\);/);
  assert.match(css, /--dur-1:\s*120ms;/);
  assert.match(css, /--dur-2:\s*160ms;/);
  assert.match(css, /--dur-3:\s*240ms;/);
  assert.match(css, /--app-bar-height:\s*84px;/);
  assert.match(css, /scroll-padding-top:\s*96px;/);
});
