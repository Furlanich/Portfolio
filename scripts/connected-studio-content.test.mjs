import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { CONNECTED_CAPABILITY_WORDS, CONNECTED_CONTROL_LABELS, formatCapabilityLegend } = await import('../lib/connected-studio/content.ts');
const { connectedMediaManifest, getConnectedPoster } = await import('../lib/connected-studio/media-manifest.ts');

const root = fileURLToPath(new URL('..', import.meta.url));

function readDoc(relativePath) {
  return readFileSync(`${root}${relativePath}`, 'utf8');
}

/** The data rows of the first markdown table after `heading`, as arrays of trimmed cells. */
function tableRowsAfter(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, `heading not found: ${heading}`);
  const rows = [];
  let inTable = false;
  for (const line of lines.slice(start + 1)) {
    if (line.trim().startsWith('|')) {
      inTable = true;
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
      if (!cells.every((cell) => /^-+$/.test(cell))) rows.push(cells);
    } else if (inTable) {
      break;
    }
  }
  return rows.slice(1); // drop the header row
}

test('the capability tuples equal the approved Revision 5 table, in order, for both locales', () => {
  const rows = tableRowsAfter(readDoc('docs/product/pages/services.md'), '### Revision 5 capability words — proposed exact localized copy');
  assert.equal(rows.length, 8, 'the owning table lists eight words');
  assert.deepEqual([...CONNECTED_CAPABILITY_WORDS.es], rows.map((row) => row[0]), 'Spanish words');
  assert.deepEqual([...CONNECTED_CAPABILITY_WORDS.en], rows.map((row) => row[1]), 'English words');
  assert.equal(CONNECTED_CAPABILITY_WORDS.es.length, 8);
  assert.equal(CONNECTED_CAPABILITY_WORDS.en.length, 8);
  assert.ok(Object.isFrozen(CONNECTED_CAPABILITY_WORDS.es) && Object.isFrozen(CONNECTED_CAPABILITY_WORDS.en), 'the tuples are immutable');
});

test('the semantic legend joins the same words with the approved separator', () => {
  assert.equal(formatCapabilityLegend(CONNECTED_CAPABILITY_WORDS.es), 'Sitios web · Apps · Chatbots · Agentes · Automatización · Consultoría · Soporte · Modernización');
  assert.equal(formatCapabilityLegend(CONNECTED_CAPABILITY_WORDS.en), 'Websites · Apps · Chatbots · Agents · Automation · Consulting · Support · Modernization');
});

test('the Pause, Resume and static-background labels equal the approved IA rows', () => {
  const rows = tableRowsAfter(readDoc('docs/product/information-architecture.md'), '### Proposed Footer wording');
  const row = (field) => {
    const match = rows.find((cells) => cells[0] === field);
    assert.ok(match, `IA row not found: ${field}`);
    return match;
  };
  assert.deepEqual(CONNECTED_CONTROL_LABELS.es, {
    pause: row('Pause background')[1],
    resume: row('Resume background')[1],
    staticBackground: row('Focused control after fallback')[1],
  });
  assert.deepEqual(CONNECTED_CONTROL_LABELS.en, {
    pause: row('Pause background')[2],
    resume: row('Resume background')[2],
    staticBackground: row('Focused control after fallback')[2],
  });
});

test('the poster manifest types all four route and quality combinations with the approved ceilings', () => {
  const combinations = connectedMediaManifest.map((entry) => `${entry.route}-${entry.quality}`).sort();
  assert.deepEqual(combinations, ['projects-compact', 'projects-wide', 'services-compact', 'services-wide']);
  for (const entry of connectedMediaManifest) {
    assert.equal(entry.src, `/brand/connected-studio/${entry.route}-${entry.quality}.webp`, 'the path Task 8 publishes to');
    assert.equal(entry.maxBytes, entry.quality === 'wide' ? 150 * 1024 : 80 * 1024, `${entry.route}-${entry.quality} ceiling`);
    assert.ok(entry.width > 0 && entry.height > 0, 'intrinsic sizing is declared');
    assert.equal(getConnectedPoster(entry.route, entry.quality), entry, 'lookup returns the manifest entry');
  }
  assert.ok(Object.isFrozen(connectedMediaManifest), 'the manifest is immutable');
  assert.throws(() => getConnectedPoster('home', 'wide'), RangeError);
  assert.throws(() => getConnectedPoster('services', 'tablet'), RangeError);
});

test('a poster is marked published only when its file exists within its byte ceiling', () => {
  for (const entry of connectedMediaManifest) {
    const file = `${root}public${entry.src}`;
    assert.equal(entry.published, existsSync(file), `${entry.src}: the published flag must match the file on disk`);
    if (entry.published) assert.ok(statSync(file).size <= entry.maxBytes, `${entry.src} exceeds ${entry.maxBytes} bytes`);
  }
});
