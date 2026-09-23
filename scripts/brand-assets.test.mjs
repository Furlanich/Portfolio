import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();

const BONE = '#F9F6EE';
const AZURE = '#004589';
const INK = '#09243D';

const CANONICAL_CHEVRONS = [
  '30,102 128,28 226,102',
  '30,166 128,92 226,166',
  '30,230 128,156 226,230',
];

const markVariants = [
  { file: 'public/brand/furlanich-mark-azure-on-bone.svg', mark: AZURE },
  { file: 'public/brand/furlanich-mark-bone-on-azure.svg', mark: BONE },
];

const lockupVariants = [
  { file: 'public/brand/furlanich-lockup-azure-on-bone.svg', ground: BONE, mark: AZURE, wordmark: INK },
  { file: 'public/brand/furlanich-lockup-bone-on-azure.svg', ground: AZURE, mark: BONE, wordmark: BONE },
];

const fontFiles = [
  { file: 'app/fonts/instrument-sans-variable-latin.woff2', family: 'Instrument Sans' },
  { file: 'app/fonts/ibm-plex-mono-regular-latin.woff2', family: 'IBM Plex Mono', weight: 400 },
  { file: 'app/fonts/ibm-plex-mono-semibold-latin.woff2', family: 'IBM Plex Mono', weight: 600 },
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readBytes(relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

function assertSafeStandaloneSvg(source, file) {
  assert.match(source, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${file} starts with a namespaced <svg>`);
  assert.doesNotMatch(source, /<script|<foreignObject|<image|<text|<style|<use\b/i, `${file} contains only vector geometry`);
  assert.doesNotMatch(source, /\b(?:xlink:)?href=|url\(|data:|@import|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i, `${file} references no external or embedded resource`);
  assert.doesNotMatch(source, /\son[a-z]+=/i, `${file} has no event handlers`);
  assert.doesNotMatch(source, /\s(?:id|class|data-[a-z-]+)=/i, `${file} has no motion hooks or scene IDs`);
  assert.doesNotMatch(source, /gradient|filter|opacity|transform="[^"]*(?:rotate|skew|matrix)/i, `${file} has no effects or distortion`);
}

function chevronGroups(source) {
  return [...source.matchAll(/<g([^>]*)>\s*((?:<polyline points="[^"]+"\/>\s*){3})<\/g>/g)].map((match) => ({
    attributes: match[1],
    points: [...match[2].matchAll(/points="([^"]+)"/g)].map((point) => point[1]),
  }));
}

function assertCanonicalMark(source, file, color) {
  const groups = chevronGroups(source);
  assert.equal(groups.length, 1, `${file} draws one protected mark`);
  const [{ attributes, points }] = groups;

  assert.deepEqual(points, CANONICAL_CHEVRONS, `${file} keeps the G0 centerlines`);
  assert.match(attributes, /fill="none"/);
  assert.match(attributes, new RegExp(`stroke="${color}"`), `${file} uses one ${color} layer color`);
  assert.match(attributes, /stroke-width="30"/);
  assert.match(attributes, /stroke-linecap="butt"/);
  assert.match(attributes, /stroke-linejoin="miter"/);
  assert.match(attributes, /stroke-miterlimit="4"/);

  const transform = attributes.match(/transform="([^"]*)"/)?.[1] ?? '';
  const scales = [...transform.matchAll(/scale\(([^)]+)\)/g)].map((match) => match[1].trim().split(/[\s,]+/));
  for (const scale of scales) {
    assert.equal(scale.length, 1, `${file} scales the mark uniformly`);
  }
}

function pngSize(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'PNG signature');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

// Minimal WOFF2 reader: enough to read untransformed cmap, OS/2, fvar and name tables.
const WOFF2_KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep',
  'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE',
  'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt',
  'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar',
  'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
];

function readWoff2Tables(bytes) {
  assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', 'WOFF2 signature');
  const numTables = bytes.readUInt16BE(12);
  const totalCompressedSize = bytes.readUInt32BE(20);
  let offset = 48;

  function base128() {
    let value = 0;
    for (let index = 0; index < 5; index += 1) {
      const byte = bytes[offset++];
      value = value * 128 + (byte & 0x7f);
      if ((byte & 0x80) === 0) return value;
    }
    throw new Error('invalid UIntBase128');
  }

  const directory = [];
  for (let index = 0; index < numTables; index += 1) {
    const flags = bytes[offset++];
    const tagIndex = flags & 0x3f;
    const tag = tagIndex === 63 ? bytes.subarray(offset, (offset += 4)).toString('latin1') : WOFF2_KNOWN_TAGS[tagIndex];
    const version = flags >> 6;
    const origLength = base128();
    const transformed = tag === 'glyf' || tag === 'loca' ? version === 0 : version !== 0;
    const length = transformed ? base128() : origLength;
    directory.push({ tag, length });
  }

  const stream = zlib.brotliDecompressSync(bytes.subarray(offset, offset + totalCompressedSize));
  const tables = new Map();
  let position = 0;
  for (const { tag, length } of directory) {
    tables.set(tag, stream.subarray(position, position + length));
    position += length;
  }
  return tables;
}

function cmapCodePoints(cmap) {
  const codePoints = new Set();
  const subtableCount = cmap.readUInt16BE(2);
  for (let index = 0; index < subtableCount; index += 1) {
    const subtable = cmap.readUInt32BE(4 + index * 8 + 4);
    const format = cmap.readUInt16BE(subtable);
    if (format === 4) {
      const segments = cmap.readUInt16BE(subtable + 6) / 2;
      const ends = subtable + 14;
      const starts = ends + segments * 2 + 2;
      for (let segment = 0; segment < segments; segment += 1) {
        const end = cmap.readUInt16BE(ends + segment * 2);
        const start = cmap.readUInt16BE(starts + segment * 2);
        for (let code = start; code <= end && code !== 0xffff; code += 1) codePoints.add(code);
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(subtable + 12);
      for (let group = 0; group < groups; group += 1) {
        const start = cmap.readUInt32BE(subtable + 16 + group * 12);
        const end = cmap.readUInt32BE(subtable + 20 + group * 12);
        for (let code = start; code <= end; code += 1) codePoints.add(code);
      }
    }
  }
  return codePoints;
}

function familyName(nameTable) {
  const count = nameTable.readUInt16BE(2);
  const storage = nameTable.readUInt16BE(4);
  for (let index = 0; index < count; index += 1) {
    const record = 6 + index * 12;
    const platform = nameTable.readUInt16BE(record);
    const nameId = nameTable.readUInt16BE(record + 6);
    if (platform !== 3 || nameId !== 1) continue;
    const length = nameTable.readUInt16BE(record + 8);
    const start = storage + nameTable.readUInt16BE(record + 10);
    const utf16 = nameTable.subarray(start, start + length);
    let name = '';
    for (let offset = 0; offset < utf16.length; offset += 2) name += String.fromCharCode(utf16.readUInt16BE(offset));
    return name;
  }
  return '';
}

function variationAxes(fvar) {
  if (!fvar) return [];
  const axesOffset = fvar.readUInt16BE(4);
  const axisCount = fvar.readUInt16BE(8);
  const axisSize = fvar.readUInt16BE(10);
  return Array.from({ length: axisCount }, (_, index) => {
    const axis = axesOffset + index * axisSize;
    return {
      tag: fvar.subarray(axis, axis + 4).toString('latin1'),
      min: fvar.readInt32BE(axis + 4) / 65536,
      max: fvar.readInt32BE(axis + 12) / 65536,
    };
  });
}

function localeContentCharacters() {
  const directories = ['app/(es)/_content', 'app/(en)/en/_content'];
  const characters = new Set();
  for (const directory of directories) {
    for (const file of fs.readdirSync(path.join(root, directory))) {
      for (const character of read(path.join(directory, file))) {
        if (character.codePointAt(0) >= 0x20) characters.add(character);
      }
    }
  }
  return characters;
}

test('publishes the protected mark in the two approved color variants', () => {
  for (const { file, mark } of markVariants) {
    const source = read(file);
    assertSafeStandaloneSvg(source, file);
    assert.match(source, /viewBox="0 0 256 256"/, `${file} keeps the canonical coordinate system`);
    assert.doesNotMatch(source, /<rect|<path/, `${file} is the transparent protected mark only`);
    assertCanonicalMark(source, file, mark);
  }
});

test('publishes horizontal lockups with an outlined FURLANICH wordmark', () => {
  const viewBoxes = new Set();
  for (const { file, ground, mark, wordmark } of lockupVariants) {
    const source = read(file);
    assertSafeStandaloneSvg(source, file);
    viewBoxes.add(source.match(/viewBox="([^"]+)"/)?.[1]);
    assert.match(source, new RegExp(`<rect width="[0-9.]+" height="[0-9.]+" fill="${ground}"/>`), `${file} carries its ground`);
    assertCanonicalMark(source, file, mark);

    const wordmarkPaths = [...source.matchAll(/<path fill="(#[0-9A-F]{6})" d="[^"]+"\/>/g)];
    assert.equal(wordmarkPaths.length, 'FURLANICH'.length, `${file} outlines each wordmark letter`);
    for (const [, color] of wordmarkPaths) assert.equal(color, wordmark);
    assert.match(source, /role="img" aria-label="FURLANICH"/);
  }
  assert.equal(viewBoxes.size, 1, 'both lockups share one stable view box');
});

test('replaces the legacy site icon with favicons from the approved master', () => {
  const svg = read('public/favicon.svg');
  assertSafeStandaloneSvg(svg, 'public/favicon.svg');
  assert.match(svg, /viewBox="0 0 256 256"/);
  assert.match(svg, new RegExp(`<rect width="256" height="256" fill="${AZURE}"/>`));
  assertCanonicalMark(svg, 'public/favicon.svg', BONE);

  assert.deepEqual(pngSize(readBytes('public/favicon.png')), { width: 32, height: 32 });
  assert.deepEqual(pngSize(readBytes('public/apple-touch-icon.png')), { width: 180, height: 180 });
  assert.deepEqual(pngSize(readBytes('public/icon.png')), { width: 512, height: 512 });

  const ico = readBytes('public/favicon.ico');
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1, 'ICO resource type');
  const count = ico.readUInt16LE(4);
  const entries = Array.from({ length: count }, (_, index) => {
    const entry = 6 + index * 16;
    const size = ico[entry] || 256;
    const imageOffset = ico.readUInt32LE(entry + 12);
    assert.deepEqual(pngSize(ico.subarray(imageOffset)), { width: size, height: size }, 'ICO embeds matching PNG images');
    return size;
  });
  assert.deepEqual(entries, [16, 32]);
});

test('retains both OFL notices beside the self-hosted fonts', () => {
  const instrument = read('app/fonts/OFL-instrument-sans.txt');
  const plex = read('app/fonts/OFL-ibm-plex.txt');

  for (const license of [instrument, plex]) {
    assert.match(license, /SIL Open Font License, Version 1\.1/);
    assert.match(license, /PERMISSION & CONDITIONS/);
  }
  assert.match(instrument, /The Instrument Sans Project Authors/);
  assert.match(plex, /IBM Corp\. with Reserved Font Name "Plex"/);
});

test('ships only the approved font faces with provenance recorded in DESIGN-VISUAL', () => {
  const design = read('docs/design/visual-language.md');
  const shipped = fs.readdirSync(path.join(root, 'app/fonts')).filter((file) => file.endsWith('.woff2')).sort();
  assert.deepEqual(shipped, fontFiles.map(({ file }) => path.basename(file)).sort());

  for (const { file, family, weight } of fontFiles) {
    const bytes = readBytes(file);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    assert.ok(design.includes(hash), `${file} SHA-256 ${hash} is recorded in DESIGN-VISUAL`);

    const tables = readWoff2Tables(bytes);
    assert.equal(familyName(tables.get('name')), family);
    const axes = variationAxes(tables.get('fvar'));
    if (weight) {
      assert.deepEqual(axes, [], `${file} is a static face`);
      assert.equal(tables.get('OS/2').readUInt16BE(4), weight);
    } else {
      assert.deepEqual(axes, [{ tag: 'wght', min: 400, max: 700 }], `${file} keeps only the 400–700 weight axis`);
    }
  }
});

test('covers every Spanish and English content character in the primary face', () => {
  const primary = cmapCodePoints(readWoff2Tables(readBytes(fontFiles[0].file)).get('cmap'));
  const missing = [...localeContentCharacters()].filter((character) => !primary.has(character.codePointAt(0)));
  assert.deepEqual(missing, []);

  const spanishLabels = '0123456789·—–/ÁÉÍÓÚÑÜáéíóúñü¿¡';
  for (const { file } of fontFiles.slice(1)) {
    const mono = cmapCodePoints(readWoff2Tables(readBytes(file)).get('cmap'));
    assert.deepEqual([...spanishLabels].filter((character) => !mono.has(character.codePointAt(0))), [], file);
  }
});
