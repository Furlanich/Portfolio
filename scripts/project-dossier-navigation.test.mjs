import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// PLAN-SPF-V1 Task 3: a locale switch on the Projects index keeps a recognized dossier fragment and
// drops anything else. The function is pure so the contract is testable without a browser; the
// client enhancement in LanguageSwitch only supplies `window.location` values.

const { resolveDossierAlternateHref } = await import('../lib/project-dossier-navigation.ts');

const ES_INDEX = '/proyectos/';
const EN_INDEX = '/en/work/';

// CI builds and tests with NEXT_PUBLIC_BASE_PATH=/Portfolio, so every test starts from a known state:
// no base path unless the test sets one.
test.beforeEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

test.afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

test('keeps a known dossier fragment across the locale switch, in both directions', () => {
  for (const slug of ['general-reservation-system', 'the-system']) {
    assert.equal(resolveDossierAlternateHref(ES_INDEX, `#${slug}`, EN_INDEX), `${EN_INDEX}#${slug}`);
    assert.equal(resolveDossierAlternateHref(EN_INDEX, `#${slug}`, ES_INDEX), `${ES_INDEX}#${slug}`);
  }
});

test('drops an unknown, empty, mis-cased or malformed fragment and returns the equivalent index', () => {
  for (const hash of [
    '', '#', '#nope', '#The-System', '#the-system-2', '#the-system/', '#the-system%20', '#mpc-administracion',
    '#web', '#__proto__', '#constructor', 'the-system', '##the-system', '#the-system#the-system',
    '#general-reservation-system?x=1',
  ]) {
    assert.equal(resolveDossierAlternateHref(ES_INDEX, hash, EN_INDEX), EN_INDEX, `es ${JSON.stringify(hash)}`);
    assert.equal(resolveDossierAlternateHref(EN_INDEX, hash, ES_INDEX), ES_INDEX, `en ${JSON.stringify(hash)}`);
  }
});

test('leaves every ordinary page on its existing equivalent route, hash or not', () => {
  const pairs = [
    ['/servicios/', '/en/services/'],
    ['/en/services/', '/servicios/'],
    ['/contacto/', '/en/contact/'],
    ['/estudio/samuel-furlanich/', '/en/about/samuel-furlanich/'],
    ['/privacidad/', '/en/privacy/'],
    ['/', '/en/'],
    ['/en/', '/'],
  ];
  for (const [current, alternate] of pairs) {
    for (const hash of ['', '#the-system', '#general-reservation-system', '#web']) {
      assert.equal(resolveDossierAlternateHref(current, hash, alternate), alternate, `${current} ${hash}`);
    }
  }
});

test('only honours the fragment when the alternate really is the opposite Projects index', () => {
  assert.equal(resolveDossierAlternateHref(ES_INDEX, '#the-system', '/en/services/'), '/en/services/');
  assert.equal(resolveDossierAlternateHref(ES_INDEX, '#the-system', ES_INDEX), ES_INDEX);
  assert.equal(resolveDossierAlternateHref(EN_INDEX, '#the-system', EN_INDEX), EN_INDEX);
  assert.equal(resolveDossierAlternateHref('/servicios/', '#the-system', EN_INDEX), EN_INDEX);
});

test('tolerates a missing trailing slash on the current path', () => {
  assert.equal(resolveDossierAlternateHref('/proyectos', '#the-system', EN_INDEX), `${EN_INDEX}#the-system`);
  assert.equal(resolveDossierAlternateHref('/en/work', '#the-system', ES_INDEX), `${ES_INDEX}#the-system`);
});

test('follows the base-path convention: the current path carries it, the alternate href does not', () => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/Portfolio';
  assert.equal(resolveDossierAlternateHref('/Portfolio/proyectos/', '#the-system', EN_INDEX), `${EN_INDEX}#the-system`);
  assert.equal(resolveDossierAlternateHref('/Portfolio/en/work/', '#general-reservation-system', ES_INDEX), `${ES_INDEX}#general-reservation-system`);
  assert.equal(resolveDossierAlternateHref('/Portfolio/servicios/', '#the-system', '/en/services/'), '/en/services/');
  // A path outside the configured base path is not the Projects index.
  assert.equal(resolveDossierAlternateHref('/proyectos/', '#the-system', EN_INDEX), EN_INDEX);
  assert.equal(resolveDossierAlternateHref('/Portfoliox/proyectos/', '#the-system', EN_INDEX), EN_INDEX);
  assert.equal(resolveDossierAlternateHref('/Other/Portfolio/proyectos/', '#the-system', EN_INDEX), EN_INDEX);
});

test('without a base path a base-prefixed path is not the Projects index', () => {
  assert.equal(resolveDossierAlternateHref('/Portfolio/proyectos/', '#the-system', EN_INDEX), EN_INDEX);
});

test('a trailing-slash base path configuration behaves like the bare one', () => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/Portfolio/';
  assert.equal(resolveDossierAlternateHref('/Portfolio/proyectos/', '#the-system', EN_INDEX), `${EN_INDEX}#the-system`);
});

test('is a pure, total function: odd inputs return the alternate href and never throw', () => {
  for (const [current, hash] of [['', ''], ['', '#the-system'], ['//', '#the-system'], ['/proyectos/\u0000', '#the-system'], ['/proyectos//', '#the-system']]) {
    assert.equal(resolveDossierAlternateHref(current, hash, EN_INDEX), EN_INDEX, `${JSON.stringify(current)} ${hash}`);
  }
});

test('the module is a plain server-safe helper with no browser global or client boundary', async () => {
  const source = await readFile('lib/project-dossier-navigation.ts', 'utf8');
  assert.doesNotMatch(source, /^['"]use client['"];?$/m);
  assert.doesNotMatch(source, /\bwindow\b|\bdocument\b|\blocation\b/);
});
