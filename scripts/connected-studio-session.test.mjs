import test from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
// A fresh module instance per test isolates the connected-module memory fallback, like a fresh page load.
async function freshSession() {
  instance += 1;
  return import(`../lib/connected-studio/session.ts?instance=${instance}`);
}

const PAUSE_KEY = 'furlanich:connected-studio-paused';
const LOSS_KEY = 'furlanich:connected-studio-context-lost';
const HOME_LOSS_KEY = 'furlanich:sky-chart-context-lost';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    writes,
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem(key, value) {
      writes.push(key);
      values.set(key, String(value));
    },
  };
}

const deniedStorage = {
  getItem() {
    throw new Error('SecurityError: storage denied');
  },
  setItem() {
    throw new Error('SecurityError: storage denied');
  },
};

test('storage denied: reads and writes never throw and fall back to the connected-module memory store', async () => {
  for (const [label, storage] of [
    ['null storage', null],
    ['throwing storage', deniedStorage],
  ]) {
    const session = await freshSession();
    assert.deepEqual(session.readConnectedSession(storage), { paused: false, contextLost: false }, `${label}: defaults`);

    assert.deepEqual(session.setConnectedPaused(true, storage), { paused: true, contextLost: false }, `${label}: pause`);
    assert.equal(session.readConnectedSession(storage).paused, true, `${label}: pause survives a later read in the same page`);
    assert.equal(session.setConnectedPaused(false, storage).paused, false, `${label}: resume`);
    assert.equal(session.readConnectedSession(storage).paused, false);

    assert.deepEqual(session.markConnectedContextLost(storage), { paused: false, contextLost: true }, `${label}: loss`);
    assert.equal(session.readConnectedSession(storage).contextLost, true, `${label}: loss is not retried in the same page`);
  }
});

test('the default storage boundary is guarded when no session storage exists', async () => {
  const session = await freshSession();
  assert.deepEqual(session.readConnectedSession(), { paused: false, contextLost: false });
  assert.equal(session.setConnectedPaused(true).paused, true);
  assert.equal(session.markConnectedContextLost().contextLost, true);
});

test('pause and context loss persist across routes and locales through the namespaced keys', async () => {
  const storage = memoryStorage();
  const first = await freshSession();
  first.setConnectedPaused(true, storage);
  first.markConnectedContextLost(storage);
  assert.equal(storage.values.get(PAUSE_KEY), '1');
  assert.equal(storage.values.get(LOSS_KEY), '1');

  // Another route or locale is a fresh module instance reading the same tab's storage.
  const next = await freshSession();
  assert.deepEqual(next.readConnectedSession(storage), { paused: true, contextLost: true });
  next.setConnectedPaused(false, storage);
  assert.equal(storage.values.get(PAUSE_KEY), '0');
  assert.equal((await freshSession()).readConnectedSession(storage).paused, false, 'resume is persisted too');
});

test("Home's context-loss flag suppresses the connected routes and is never written", async () => {
  const storage = memoryStorage({ [HOME_LOSS_KEY]: '1' });
  const session = await freshSession();
  assert.deepEqual(session.readConnectedSession(storage), { paused: false, contextLost: true }, 'a Home loss suppresses activation');

  session.setConnectedPaused(true, storage);
  session.markConnectedContextLost(storage);
  assert.ok(storage.writes.length > 0 && storage.writes.every((key) => key === PAUSE_KEY || key === LOSS_KEY), `only namespaced keys are written, got ${storage.writes}`);
  assert.equal(storage.values.get(HOME_LOSS_KEY), '1', "Home's flag keeps its value");

  const clean = memoryStorage();
  const fresh = await freshSession();
  fresh.markConnectedContextLost(clean);
  assert.equal(clean.values.has(HOME_LOSS_KEY), false, 'a connected loss never sets the Home key');
});

test('unrecognized stored values never pause the scene or claim a loss', async () => {
  const session = await freshSession();
  const storage = memoryStorage({ [PAUSE_KEY]: 'yes', [LOSS_KEY]: 'true', [HOME_LOSS_KEY]: '0' });
  assert.deepEqual(session.readConnectedSession(storage), { paused: false, contextLost: false });
});

// Readable but write-denied storage (a quota error, a locked-down profile): the stored value goes stale.
function writeDeniedStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem() {
      throw new Error('QuotaExceededError: writes denied');
    },
  };
}

test('a denied write never lets stale stored state override this page\'s Pause or Resume', async () => {
  const session = await freshSession();
  const staleResumed = writeDeniedStorage({ [PAUSE_KEY]: '0' });
  assert.equal(session.readConnectedSession(staleResumed).paused, false, 'the stored value is honored before this page sets anything');
  assert.deepEqual(session.setConnectedPaused(true, staleResumed), { paused: true, contextLost: false }, 'Pause survives the denied write');
  assert.equal(session.readConnectedSession(staleResumed).paused, true, 'a later read in the same page still sees Pause');

  const fresh = await freshSession();
  const stalePaused = writeDeniedStorage({ [PAUSE_KEY]: '1' });
  assert.equal(fresh.readConnectedSession(stalePaused).paused, true, 'a fresh page honors the stored Pause');
  assert.deepEqual(fresh.setConnectedPaused(false, stalePaused), { paused: false, contextLost: false }, 'Resume survives the denied write');
  assert.equal(fresh.readConnectedSession(stalePaused).paused, false, 'a later read in the same page still sees Resume');
});
