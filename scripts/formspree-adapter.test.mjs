import test from 'node:test';
import assert from 'node:assert/strict';

const adapterModule = await import('../lib/inquiry/formspree.ts').catch(() => null);
const createFormspreeSubmitInquiry = adapterModule?.createFormspreeSubmitInquiry;

const endpoint = 'https://formspree.io/f/test-contact';
const validPayload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  message: 'Please help us scope a product idea.',
  locale: 'en',
  source: '/en/contact/',
};

function requireImplementation() {
  assert.equal(
    typeof createFormspreeSubmitInquiry,
    'function',
    'createFormspreeSubmitInquiry has not been implemented',
  );
}

function response(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    async json() {
      if (body === undefined) throw new SyntaxError('invalid JSON');
      return body;
    },
  };
}

function adapterReturning(responseValue, options = {}) {
  let calls = 0;
  let received;
  const fetchImpl = async (url, init) => {
    calls += 1;
    received = { url, init };
    return typeof responseValue === 'function' ? responseValue(url, init) : responseValue;
  };
  const submit = createFormspreeSubmitInquiry({ endpoint, fetchImpl, ...options });
  return { submit, get calls() { return calls; }, get received() { return received; } };
}

test('posts one exact allowlisted JSON request and accepts the documented success object', async () => {
  requireImplementation();
  const harness = adapterReturning(response(200, { ok: true }));

  assert.deepEqual(await harness.submit(validPayload), { status: 'accepted' });
  assert.equal(harness.calls, 1);
  assert.equal(harness.received.url, endpoint);
  assert.equal(harness.received.init.method, 'POST');
  assert.deepEqual(harness.received.init.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  assert.deepEqual(JSON.parse(harness.received.init.body), {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Analytical Engines',
    message: 'Please help us scope a product idea.',
    locale: 'en',
    source: '/en/contact/',
    _gotcha: '',
  });
  assert.ok(harness.received.init.signal instanceof AbortSignal);
});

test('trims transport values and omits an empty optional company', async () => {
  requireImplementation();
  const harness = adapterReturning(response(200, { ok: true }));

  await harness.submit({
    ...validPayload,
    name: '  Ada Lovelace ',
    email: ' ada@example.com ',
    company: '  ',
    message: ' Please help us scope a product idea. ',
    locale: 'es-AR',
    source: '/contacto/',
  });

  assert.deepEqual(JSON.parse(harness.received.init.body), {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Please help us scope a product idea.',
    locale: 'es-AR',
    source: '/contacto/',
    _gotcha: '',
  });
});

test('maps only approved provider field codes and never returns provider prose', async () => {
  requireImplementation();
  const harness = adapterReturning(
    response(422, {
      errors: [
        { field: 'name', code: 'REQUIRED', message: 'SENSITIVE PROVIDER MESSAGE' },
        { field: 'email', code: 'TYPE_EMAIL', message: 'ANOTHER PROVIDER MESSAGE' },
        { field: 'message', code: 'MAX_LENGTH', message: 'DO NOT LEAK THIS' },
      ],
    }),
  );

  const result = await harness.submit(validPayload);
  assert.deepEqual(result, {
    status: 'invalid',
    fieldErrors: {
      name: 'required',
      email: 'invalid-email',
      message: 'max-length',
    },
  });
  assert.equal(JSON.stringify(result).includes('PROVIDER'), false);
});

test('maps unknown provider fields or codes to an opaque failure', async () => {
  requireImplementation();
  for (const errors of [
    [{ field: 'subject', code: 'REQUIRED', message: 'provider-only field' }],
    [{ field: 'email', code: 'PROVIDER_ONLY_CODE', message: 'provider-only code' }],
  ]) {
    const harness = adapterReturning(response(422, { errors }));
    assert.deepEqual(await harness.submit(validPayload), {
      status: 'failed',
      reason: 'unknown',
    });
  }
});

test('maps rate limits, documented missing/inactive forms, server failures, and generic statuses', async () => {
  requireImplementation();
  const cases = [
    [response(429, { error: 'quota exceeded' }), { status: 'failed', reason: 'rate-limited' }],
    [response(404, { code: 'FORM_NOT_FOUND', message: 'private provider prose' }), { status: 'failed', reason: 'misconfigured' }],
    [response(400, { code: 'FORM_INACTIVE', message: 'private provider prose' }), { status: 'failed', reason: 'misconfigured' }],
    [response(500, { error: 'server failure' }), { status: 'failed', reason: 'unavailable' }],
    [response(400, { error: 'generic rejection' }), { status: 'failed', reason: 'unknown' }],
    [response(403, { error: 'generic rejection' }), { status: 'failed', reason: 'unknown' }],
    [response(404, { error: 'generic rejection' }), { status: 'failed', reason: 'unknown' }],
    [response(422, { error: 'generic rejection' }), { status: 'failed', reason: 'unknown' }],
  ];

  for (const [fixture, expected] of cases) {
    const harness = adapterReturning(fixture);
    const result = await harness.submit(validPayload);
    assert.deepEqual(result, expected);
    assert.equal(JSON.stringify(result).includes('provider'), false);
  }
});

test('maps network rejection, abort, malformed JSON, empty bodies, and unexpected shapes safely', async () => {
  requireImplementation();
  const network = adapterReturning(() => Promise.reject(new Error('private network detail')));
  assert.deepEqual(await network.submit(validPayload), { status: 'failed', reason: 'unavailable' });

  const malformed = adapterReturning(response(200, undefined));
  assert.deepEqual(await malformed.submit(validPayload), { status: 'failed', reason: 'unknown' });

  for (const body of [null, {}, { ok: false }, { ok: 'true' }, { errors: 'not-an-array' }]) {
    const harness = adapterReturning(response(200, body));
    assert.deepEqual(await harness.submit(validPayload), { status: 'failed', reason: 'unknown' });
  }

  let abortObserved = false;
  const aborting = adapterReturning((_url, init) => new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => {
      abortObserved = true;
      reject(new DOMException('aborted', 'AbortError'));
    });
  }), { timeoutMs: 10 });
  assert.deepEqual(await aborting.submit(validPayload), { status: 'failed', reason: 'unavailable' });
  assert.equal(abortObserved, true);
});

test('rejects missing or malformed endpoints without calling fetch', async () => {
  requireImplementation();
  for (const invalidEndpoint of [undefined, '', 'http://formspree.io/f/test-contact', 'https://example.com/f/test-contact', 'https://formspree.io/', 'https://formspree.io/f/']) {
    let calls = 0;
    const submit = createFormspreeSubmitInquiry({
      endpoint: invalidEndpoint,
      fetchImpl: async () => {
        calls += 1;
        return response(200, { ok: true });
      },
    });
    assert.deepEqual(await submit(validPayload), { status: 'failed', reason: 'misconfigured' });
    assert.equal(calls, 0);
  }
});

test('returns a provider-neutral request-too-large result before network transport', async () => {
  requireImplementation();
  const harness = adapterReturning(response(200, { ok: true }));
  const oversized = { ...validPayload, message: '🙂'.repeat(7000) };

  assert.deepEqual(await harness.submit(oversized), {
    status: 'invalid',
    fieldErrors: { message: 'request-too-large' },
  });
  assert.equal(harness.calls, 0);
});

test('makes no automatic retry after a non-accepted response', async () => {
  requireImplementation();
  const harness = adapterReturning(response(503, { error: 'retry later' }));

  assert.deepEqual(await harness.submit(validPayload), { status: 'failed', reason: 'unavailable' });
  assert.equal(harness.calls, 1);
});
