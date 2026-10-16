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

const BODY_LIMIT = 24 * 1024;
const bodyBytes = (body) => new TextEncoder().encode(body).byteLength;

test('maps the real trap value to _gotcha and sends an empty trap when none is supplied', async () => {
  requireImplementation();
  const trapped = adapterReturning(response(200, { ok: true }));
  await trapped.submit(validPayload, { honeypot: 'a bot filled this' });
  const body = JSON.parse(trapped.received.init.body);
  assert.equal(body._gotcha, 'a bot filled this');
  assert.deepEqual(Object.keys(body).sort(), ['_gotcha', 'company', 'email', 'locale', 'message', 'name', 'source']);

  for (const context of [undefined, {}, { honeypot: undefined }, { honeypot: 7 }, { honeypot: null }, { honeypot: {} }]) {
    const harness = adapterReturning(response(200, { ok: true }));
    await harness.submit(validPayload, context);
    assert.equal(JSON.parse(harness.received.init.body)._gotcha, '', JSON.stringify(context));
  }
});

test('never logs or echoes the trap value in a result', async () => {
  requireImplementation();
  const logged = [];
  const originals = {};
  for (const method of ['log', 'info', 'warn', 'error', 'debug']) {
    originals[method] = console[method];
    console[method] = (...args) => logged.push(args);
  }
  try {
    for (const fixture of [response(200, { ok: true }), response(500, {}), response(422, { errors: [{ field: 'name', code: 'REQUIRED' }] })]) {
      const result = await adapterReturning(fixture).submit(validPayload, { honeypot: 'SECRET-TRAP' });
      assert.equal(JSON.stringify(result).includes('SECRET-TRAP'), false);
    }
  } finally {
    Object.assign(console, originals);
  }
  assert.deepEqual(logged, []);
});

test('the whole JSON body, including the trap, is held to 24 KiB at the exact byte', async () => {
  requireImplementation();
  const baseline = adapterReturning(response(200, { ok: true }));
  await baseline.submit({ ...validPayload, message: 'a' });
  const baseBytes = bodyBytes(baseline.received.init.body);
  const headroom = BODY_LIMIT - baseBytes;

  const atLimit = adapterReturning(response(200, { ok: true }));
  assert.deepEqual(await atLimit.submit({ ...validPayload, message: 'a'.repeat(1 + headroom) }), { status: 'accepted' });
  assert.equal(bodyBytes(atLimit.received.init.body), BODY_LIMIT);

  const overLimit = adapterReturning(response(200, { ok: true }));
  assert.deepEqual(await overLimit.submit({ ...validPayload, message: 'a'.repeat(2 + headroom) }), {
    status: 'invalid',
    fieldErrors: { message: 'request-too-large' },
  });
  assert.equal(overLimit.calls, 0);

  const trapPushesOver = adapterReturning(response(200, { ok: true }));
  assert.deepEqual(await trapPushesOver.submit({ ...validPayload, message: 'a'.repeat(1 + headroom) }, { honeypot: 'x' }), {
    status: 'invalid',
    fieldErrors: { message: 'request-too-large' },
  });
  assert.equal(trapPushesOver.calls, 0);

  const hugeTrap = adapterReturning(response(200, { ok: true }));
  assert.equal((await hugeTrap.submit(validPayload, { honeypot: 'x'.repeat(BODY_LIMIT) })).status, 'invalid');
  assert.equal(hugeTrap.calls, 0);
});

test('the byte limit counts UTF-8 bytes, not characters', async () => {
  requireImplementation();
  const harness = adapterReturning(response(200, { ok: true }));
  // 9000 two-byte characters are 18000 bytes; 13000 of them are 26000 bytes.
  assert.equal((await harness.submit({ ...validPayload, message: 'é'.repeat(9000) })).status, 'accepted');
  assert.equal((await harness.submit({ ...validPayload, message: 'é'.repeat(13000) })).status, 'invalid');
  assert.equal(harness.calls, 1);
});

test('rejects an endpoint with a nonstandard port, credentials, query or fragment without calling fetch', async () => {
  requireImplementation();
  for (const invalidEndpoint of [
    'https://formspree.io:8443/f/test-contact',
    'https://formspree.io:80/f/test-contact',
    'https://user@formspree.io/f/test-contact',
    'https://user:secret@formspree.io/f/test-contact',
    'https://formspree.io/f/test-contact?x=1',
    'https://formspree.io/f/test-contact#frag',
    'https://formspree.io/f/a/b',
    'https://formspree.io.evil.example/f/test-contact',
  ]) {
    let calls = 0;
    const submit = createFormspreeSubmitInquiry({
      endpoint: invalidEndpoint,
      fetchImpl: async () => { calls += 1; return response(200, { ok: true }); },
    });
    assert.deepEqual(await submit(validPayload), { status: 'failed', reason: 'misconfigured' }, invalidEndpoint);
    assert.equal(calls, 0, invalidEndpoint);
  }
});

test('only a 2xx status with a JSON object whose ok is exactly true is accepted', async () => {
  requireImplementation();
  for (const status of [200, 201, 202, 204, 299]) {
    const result = await adapterReturning(response(status, { ok: true })).submit(validPayload);
    assert.deepEqual(result, { status: 'accepted' }, String(status));
  }
  const notAccepted = [
    [response(200, { ok: false }), 'unknown'],
    [response(200, { ok: 1 }), 'unknown'],
    [response(200, { ok: 'true' }), 'unknown'],
    [response(200, {}), 'unknown'],
    [response(200, []), 'unknown'],
    [response(200, [{ ok: true }]), 'unknown'],
    [response(200, 'ok'), 'unknown'],
    [response(200, true), 'unknown'],
    [response(200, null), 'unknown'],
    [response(200, undefined), 'unknown'],
    [response(199, { ok: true }), 'unknown'],
    [response(300, { ok: true }), 'unknown'],
    [response(302, { ok: true }), 'unknown'],
    [response(400, { ok: true }), 'unknown'],
    [response(404, { ok: true }), 'unknown'],
    [response(429, { ok: true }), 'rate-limited'],
    [response(500, { ok: true }), 'unavailable'],
    [response(503, { ok: true }), 'unavailable'],
  ];
  for (const [fixture, reason] of notAccepted) {
    const result = await adapterReturning(fixture).submit(validPayload);
    assert.deepEqual(result, { status: 'failed', reason }, `status ${fixture.status}`);
  }
});

test('the timeout covers reading the JSON body, not only the response headers', async () => {
  requireImplementation();
  const stalledBody = { status: 200, async json() { return new Promise(() => {}); } };
  const harness = adapterReturning(stalledBody, { timeoutMs: 20 });
  const started = Date.now();
  assert.deepEqual(await harness.submit(validPayload), { status: 'failed', reason: 'unavailable' });
  assert.ok(Date.now() - started < 2000, 'the stalled body must not hold the submission open');
});

test('a fetch that ignores its abort signal still ends at the timeout', async () => {
  requireImplementation();
  const harness = adapterReturning(() => new Promise(() => {}), { timeoutMs: 20 });
  assert.deepEqual(await harness.submit(validPayload), { status: 'failed', reason: 'unavailable' });
});

test('leaves no timer behind after a finished submission', async () => {
  requireImplementation();
  const timers = () => process.getActiveResourcesInfo().filter((name) => name === 'Timeout').length;
  const before = timers();
  const accepted = adapterReturning(response(200, { ok: true }), { timeoutMs: 60_000 });
  await accepted.submit(validPayload);
  const unreadable = adapterReturning(response(200, undefined), { timeoutMs: 60_000 });
  await unreadable.submit(validPayload);
  const rejected = adapterReturning(() => Promise.reject(new Error('down')), { timeoutMs: 60_000 });
  await rejected.submit(validPayload);
  assert.equal(timers(), before);
});

test('a caller abort cancels the request in flight and reports it unavailable', async () => {
  requireImplementation();
  const caller = new AbortController();
  let transportSignal;
  const harness = adapterReturning((_url, init) => new Promise((_, reject) => {
    transportSignal = init.signal;
    init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
  }));
  const pending = harness.submit(validPayload, { signal: caller.signal });
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(transportSignal.aborted, false);
  caller.abort();
  assert.deepEqual(await pending, { status: 'failed', reason: 'unavailable' });
  assert.equal(transportSignal.aborted, true);
});

test('a caller abort also ends a fetch that ignores its signal and a stalled body', async () => {
  requireImplementation();
  const ignoring = new AbortController();
  const harness = adapterReturning(() => new Promise(() => {}));
  const pending = harness.submit(validPayload, { signal: ignoring.signal });
  setTimeout(() => ignoring.abort(), 5);
  assert.deepEqual(await pending, { status: 'failed', reason: 'unavailable' });

  const stalled = new AbortController();
  const bodyHarness = adapterReturning({ status: 200, async json() { return new Promise(() => {}); } });
  const bodyPending = bodyHarness.submit(validPayload, { signal: stalled.signal });
  setTimeout(() => stalled.abort(), 5);
  assert.deepEqual(await bodyPending, { status: 'failed', reason: 'unavailable' });
});

test('an already aborted signal sends nothing', async () => {
  requireImplementation();
  const caller = new AbortController();
  caller.abort();
  const harness = adapterReturning(response(200, { ok: true }));
  assert.deepEqual(await harness.submit(validPayload, { signal: caller.signal }), { status: 'failed', reason: 'unavailable' });
  assert.equal(harness.calls, 0);
});

test('a finished submission stops listening to the caller signal', async () => {
  requireImplementation();
  const caller = new AbortController();
  const harness = adapterReturning(response(200, { ok: true }));
  await harness.submit(validPayload, { signal: caller.signal });
  assert.equal(harness.received.init.signal.aborted, false);
  caller.abort();
  assert.equal(harness.received.init.signal.aborted, false, 'a late caller abort must not touch a finished request');
});

test('provider field rejections need every entry to be an approved field and code', async () => {
  requireImplementation();
  const unknown = { status: 'failed', reason: 'unknown' };
  const cases = [
    [[{ field: 'name', code: 'REQUIRED' }, { field: 'subject', code: 'REQUIRED' }], unknown],
    [[{ field: 'name', code: 'REQUIRED' }, { field: 'email', code: 'SOMETHING_NEW' }], unknown],
    [[{ field: '_gotcha', code: 'REQUIRED' }], unknown],
    [[{ field: 'locale', code: 'REQUIRED' }], unknown],
    [[{ field: 'source', code: 'MAX_LENGTH' }], unknown],
    [[{ field: '__proto__', code: 'REQUIRED' }], unknown],
    [[{ code: 'REQUIRED' }], unknown],
    [[{ field: 'name' }], unknown],
    [[{ field: ['name'], code: 'REQUIRED' }], unknown],
    [[null], unknown],
    [['name'], unknown],
    [[], unknown],
    [[{ field: 'company', code: 'required' }], { status: 'invalid', fieldErrors: { company: 'required' } }],
    [[{ field: 'email', code: 'type-email' }], { status: 'invalid', fieldErrors: { email: 'invalid-email' } }],
    [[{ field: 'message', code: ' Max Length ' }], { status: 'invalid', fieldErrors: { message: 'max-length' } }],
  ];
  for (const [errors, expected] of cases) {
    const result = await adapterReturning(response(422, { errors })).submit(validPayload);
    assert.deepEqual(result, expected, JSON.stringify(errors));
  }
});

test('provider HTML and prose never reach a result', async () => {
  requireImplementation();
  const html = '<script>alert(1)</script> PROVIDER PROSE';
  for (const fixture of [
    response(422, { errors: [{ field: 'name', code: 'REQUIRED', message: html }], message: html }),
    response(500, { error: html }),
    response(429, { error: html }),
    response(404, { code: 'FORM_NOT_FOUND', message: html }),
    response(400, { error: html, message: html }),
    response(200, { ok: false, error: html }),
  ]) {
    const result = await adapterReturning(fixture).submit(validPayload);
    assert.equal(JSON.stringify(result).includes('PROVIDER'), false);
    assert.equal(JSON.stringify(result).includes('<script>'), false);
    assert.ok(['invalid', 'failed'].includes(result.status));
  }
});

test('network failures never leak their detail', async () => {
  requireImplementation();
  const harness = adapterReturning(() => Promise.reject(new TypeError('https://user:secret@formspree.io/f/x: ECONNRESET')));
  const result = await harness.submit(validPayload);
  assert.deepEqual(result, { status: 'failed', reason: 'unavailable' });
  assert.equal(JSON.stringify(result).includes('secret'), false);
});

test('a throwing json() is an unknown failure, not an unhandled rejection', async () => {
  requireImplementation();
  const throwing = adapterReturning({ status: 200, json() { throw new SyntaxError('Unexpected token <'); } });
  assert.deepEqual(await throwing.submit(validPayload), { status: 'failed', reason: 'unknown' });
});
