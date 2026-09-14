import test from 'node:test';
import assert from 'node:assert/strict';

const adapterModule = await import('../lib/inquiry/demo.ts').catch(() => null);
const createDemoSubmitInquiry = adapterModule?.createDemoSubmitInquiry;

const validPayload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  message: 'Please help us scope a product idea.',
  locale: 'en',
  source: '/en/contact/',
};

function requireImplementation() {
  assert.equal(typeof createDemoSubmitInquiry, 'function', 'createDemoSubmitInquiry has not been implemented');
}

test('uses the approved default delay and accepts a valid payload without mutation', async () => {
  requireImplementation();
  const waits = [];
  const before = structuredClone(validPayload);
  const submit = createDemoSubmitInquiry({ wait: async (milliseconds) => waits.push(milliseconds) });

  assert.deepEqual(await submit(validPayload), { status: 'accepted' });
  assert.deepEqual(waits, [650]);
  assert.deepEqual(validPayload, before);
});

test('uses an injected delay and resolves exactly once on the reserved failure path', async () => {
  requireImplementation();
  const waits = [];
  let resolutions = 0;
  const submit = createDemoSubmitInquiry({ delayMs: 0, wait: async (milliseconds) => waits.push(milliseconds) });
  const result = await submit({ ...validPayload, email: '  FAILURE@EXAMPLE.INVALID  ' });
  resolutions += 1;

  assert.deepEqual(result, { status: 'failed', reason: 'unavailable' });
  assert.deepEqual(waits, [0]);
  assert.equal(resolutions, 1);
});

test('has no global fetch, endpoint, storage, logging, or retry dependency', async () => {
  requireImplementation();
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls += 1; throw new Error('fetch must not run'); };
  try {
    const submit = createDemoSubmitInquiry({ wait: async () => {} });
    assert.deepEqual(await submit(validPayload), { status: 'accepted' });
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
