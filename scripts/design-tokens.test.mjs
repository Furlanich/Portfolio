import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const { default: tailwindConfig } = await import('../tailwind.config.ts');

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
