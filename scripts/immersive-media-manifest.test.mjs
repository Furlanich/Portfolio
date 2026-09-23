import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const { instrumentMediaManifest, INSTRUMENT_CHAPTER_IDS } = await import('../lib/immersive-home/media-manifest.ts');

const FIRST_POSTER_LIMIT = 150 * 1024;
const PROTECTED_CENTERLINES = ['30,102 128,28 226,102', '30,166 128,92 226,166', '30,230 128,156 226,230'];

function publicFile(src) {
  return path.join(root, 'public', src);
}

test('declares one static poster per chapter in the fixed chapter order', () => {
  assert.deepEqual(INSTRUMENT_CHAPTER_IDS, ['recognition', 'fragmentation', 'connection', 'coordination']);
  assert.deepEqual(instrumentMediaManifest.map((entry) => entry.chapter), INSTRUMENT_CHAPTER_IDS);
  assert.equal(new Set(instrumentMediaManifest.map((entry) => entry.id)).size, 4);

  for (const entry of instrumentMediaManifest) {
    assert.equal(entry.id, `${entry.chapter}-poster`);
    assert.equal(entry.src, `/brand/immersive/${entry.chapter}.svg`);
    assert.equal(entry.kind, 'poster');
    assert.deepEqual([entry.width, entry.height], [800, 1000], 'posters share the 4:5 stage');
  }
});

test('classifies every poster as locale-neutral brand motion without evidence claims', () => {
  for (const entry of instrumentMediaManifest) {
    assert.equal(entry.classification, 'brand-motion');
    assert.equal(entry.locale, 'neutral');
    assert.equal(entry.evidence, false);
    assert.equal(entry.decorative, true, 'adjacent HTML carries the chapter meaning');
  }
});

test('keeps every poster within its byte budget and the first poster within 150 KiB', () => {
  assert.ok(instrumentMediaManifest[0].maxBytes <= FIRST_POSTER_LIMIT);
  for (const entry of instrumentMediaManifest) {
    const bytes = fs.statSync(publicFile(entry.src)).size;
    assert.ok(bytes <= entry.maxBytes, `${entry.src} is ${bytes} bytes (budget ${entry.maxBytes})`);
  }
});

test('ships safe, text-free artwork that is separate from the protected mark', () => {
  for (const entry of instrumentMediaManifest) {
    const source = fs.readFileSync(publicFile(entry.src), 'utf8');
    assert.match(source, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 800 1000"/, entry.src);
    assert.doesNotMatch(source, /<script|<foreignObject|<image|<text|<style|<use\b/i, `${entry.src} contains only vector geometry`);
    assert.doesNotMatch(source, /\b(?:xlink:)?href=|url\(|data:|@import|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i, `${entry.src} references no external or embedded resource`);
    assert.doesNotMatch(source, /\son[a-z]+=/i, `${entry.src} has no event handlers`);
    assert.doesNotMatch(source, /aria-label|role="img"|<title|<desc/i, `${entry.src} carries no accessible name of its own`);
    for (const centerline of PROTECTED_CENTERLINES) {
      assert.equal(source.includes(centerline), false, `${entry.src} must not reuse the protected mark geometry`);
    }
  }
});
