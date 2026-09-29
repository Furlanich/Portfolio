import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const { instrumentMediaManifest } = await import('../lib/immersive-home/media-manifest.ts');

const KIB = 1024;
const EXPECTED = [
  { id: 'environment-wide', src: '/brand/sky-chart/environment-wide.webp', width: 1920, height: 1080, budget: 150 * KIB },
  { id: 'environment-compact', src: '/brand/sky-chart/environment-compact.webp', width: 900, height: 1600, budget: 80 * KIB },
];

function publicFile(src) {
  return path.join(root, 'public', src);
}

// Reads the pixel dimensions from a WebP container header: a RIFF/WEBP file whose first chunk
// is lossy `VP8 `, lossless `VP8L` or extended `VP8X` (which carries the canvas size).
function readWebpSize(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', 'RIFF container');
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', 'WEBP form type');
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  if (chunk === 'VP8L') {
    assert.equal(buffer[20], 0x2f, 'VP8L signature');
    const bits = buffer.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (chunk === 'VP8 ') {
    assert.deepEqual([...buffer.subarray(23, 26)], [0x9d, 0x01, 0x2a], 'VP8 start code');
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  assert.fail(`unsupported WebP chunk "${chunk}"`);
}

test('declares exactly the two D-23 environment posters, wide first', () => {
  assert.deepEqual(instrumentMediaManifest.map((entry) => entry.id), EXPECTED.map((entry) => entry.id));
  for (const [index, expected] of EXPECTED.entries()) {
    const entry = instrumentMediaManifest[index];
    assert.equal(entry.kind, 'poster');
    assert.equal(entry.src, expected.src);
    assert.deepEqual([entry.width, entry.height], [expected.width, expected.height]);
    assert.equal(entry.maxBytes, expected.budget);
  }
});

test('classifies both posters as locale-neutral brand motion without evidence claims', () => {
  for (const entry of instrumentMediaManifest) {
    assert.equal(entry.classification, 'brand-motion');
    assert.equal(entry.locale, 'neutral');
    assert.equal(entry.evidence, false);
    assert.equal(entry.decorative, true, 'the adjacent HTML carries all meaning');
  }
});

test('ships both poster files within their byte budgets (150 KiB wide, 80 KiB compact)', () => {
  for (const expected of EXPECTED) {
    const file = publicFile(expected.src);
    assert.ok(fs.existsSync(file), `${expected.src} exists`);
    const bytes = fs.statSync(file).size;
    assert.ok(bytes > 0 && bytes <= expected.budget, `${expected.src} is ${bytes} bytes (budget ${expected.budget})`);
  }
});

test('ships both posters as WebP at exactly 1920x1080 and 900x1600', () => {
  for (const expected of EXPECTED) {
    const size = readWebpSize(fs.readFileSync(publicFile(expected.src)));
    assert.deepEqual(size, { width: expected.width, height: expected.height }, expected.src);
  }
});

test('leaves no chapter poster art behind', () => {
  assert.equal(fs.existsSync(path.join(root, 'public/brand/immersive')), false, 'public/brand/immersive is deleted');
});
