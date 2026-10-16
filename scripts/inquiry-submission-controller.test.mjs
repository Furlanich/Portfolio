import test from 'node:test';
import assert from 'node:assert/strict';

const controllerModule = await import('../lib/inquiry/submission-controller.ts').catch(() => null);
const stateModule = await import('../components/contact/state.ts').catch(() => null);
const createInquirySubmissionController = controllerModule?.createInquirySubmissionController;
const inquiryReducer = stateModule?.inquiryReducer;
const initialInquiryFormState = stateModule?.initialInquiryFormState;

const values = {
  name: '  Ada Lovelace ',
  email: ' ada@example.com ',
  company: '',
  message: ' Please help us scope a product idea. ',
};
const expectedPayload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Please help us scope a product idea.',
  locale: 'en',
  source: '/en/contact/',
};

function requireImplementation() {
  assert.equal(typeof createInquirySubmissionController, 'function', 'createInquirySubmissionController has not been implemented');
  assert.equal(typeof inquiryReducer, 'function', 'inquiryReducer has not been implemented');
}

/** A submitter whose promises the test settles by hand, so every race is explicit. */
function deferredSubmitter() {
  const calls = [];
  const submit = (payload, context) =>
    new Promise((resolve, reject) => {
      calls.push({ payload, context, resolve, reject });
    });
  return { submit, calls };
}

/** The controller wired to the real reducer, recording every dispatched action. */
function harness(submit) {
  const actions = [];
  let state = initialInquiryFormState;
  const dispatch = (action) => {
    actions.push(action);
    state = inquiryReducer(state, action);
  };
  const controller = createInquirySubmissionController({ submit, dispatch });
  return { controller, actions, get state() { return state; } };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 15));

test('a valid submission snapshots the trimmed payload, carries the real trap value and a live signal', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);

  const pending = form.controller.submit(values, 'en', 'trap-value');
  assert.equal(submitter.calls.length, 1, 'the submitter runs synchronously, before any await');
  assert.deepEqual(submitter.calls[0].payload, expectedPayload);
  assert.equal(submitter.calls[0].context.honeypot, 'trap-value');
  assert.ok(submitter.calls[0].context.signal instanceof AbortSignal);
  assert.equal(submitter.calls[0].context.signal.aborted, false);
  assert.deepEqual(form.actions.map((action) => action.type), ['VALIDATE', 'SUBMIT_STARTED']);
  assert.equal(form.actions[1].requestId, 1);
  assert.equal(form.state.phase, 'submitting');

  submitter.calls[0].resolve({ status: 'accepted' });
  await pending;
  assert.deepEqual(form.actions.map((action) => action.type), ['VALIDATE', 'SUBMIT_STARTED', 'SUBMIT_SUCCEEDED']);
  assert.equal(form.state.phase, 'success');
});

test('the Spanish locale binds the Spanish source', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'es-AR', '');
  assert.equal(submitter.calls[0].payload.locale, 'es-AR');
  assert.equal(submitter.calls[0].payload.source, '/contacto/');
  submitter.calls[0].resolve({ status: 'accepted' });
  await pending;
});

test('same-tick submissions call the submitter once and dispatch one start', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);

  const first = form.controller.submit(values, 'en', '');
  const second = form.controller.submit(values, 'en', '');
  const third = form.controller.submit({ ...values, name: 'Grace Hopper' }, 'en', '');
  assert.equal(submitter.calls.length, 1, 'the lock is synchronous, not React state');
  assert.equal(form.actions.filter((action) => action.type === 'SUBMIT_STARTED').length, 1);

  await tick();
  assert.equal(submitter.calls.length, 1, 'no later microtask or timer starts another request');

  submitter.calls[0].resolve({ status: 'accepted' });
  await Promise.all([first, second, third]);
  assert.equal(submitter.calls.length, 1);
  assert.equal(form.actions.filter((action) => action.type === 'SUBMIT_SUCCEEDED').length, 1);
});

test('a duplicate while a request is in flight dispatches nothing at all', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const first = form.controller.submit(values, 'en', '');
  const before = form.actions.length;

  await form.controller.submit(values, 'en', '');
  await form.controller.submit({ name: '', email: '', company: '', message: '' }, 'en', '');
  assert.equal(form.actions.length, before, 'not even a validation failure is dispatched while submitting');
  assert.equal(form.state.phase, 'submitting');

  submitter.calls[0].resolve({ status: 'accepted' });
  await first;
});

test('invalid local values never reach the submitter and never carry a request id', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);

  await form.controller.submit({ name: '', email: 'not-an-email', company: '', message: '' }, 'en', '');
  assert.equal(submitter.calls.length, 0);
  assert.deepEqual(form.actions.map((action) => action.type), ['VALIDATE', 'VALIDATION_FAILED']);
  assert.equal('requestId' in form.actions[1], false);
  assert.deepEqual(form.state.fieldErrors, { name: 'required', email: 'invalid-email', message: 'required' });
  assert.equal(form.state.focusField, 'name');
  assert.equal(form.state.phase, 'idle');

  // The lock was never taken, so the corrected inquiry goes through.
  const pending = form.controller.submit(values, 'en', '');
  assert.equal(submitter.calls.length, 1);
  submitter.calls[0].resolve({ status: 'accepted' });
  await pending;
  assert.equal(form.state.phase, 'success');
});

test('every non-accepted outcome keeps the form editable and the lock released', async () => {
  requireImplementation();
  const outcomes = [
    ['invalid', () => ({ status: 'invalid', fieldErrors: { email: 'invalid-email' } }), 'idle'],
    ['rate-limited', () => ({ status: 'failed', reason: 'rate-limited' }), 'error'],
    ['misconfigured', () => ({ status: 'failed', reason: 'misconfigured' }), 'error'],
    ['unavailable', () => ({ status: 'failed', reason: 'unavailable' }), 'error'],
    ['unknown', () => ({ status: 'failed', reason: 'unknown' }), 'error'],
    ['arbitrary reason', () => ({ status: 'failed', reason: 'PRIVATE PROVIDER PROSE' }), 'error'],
    ['undefined result', () => undefined, 'error'],
    ['null result', () => null, 'error'],
    ['unknown status', () => ({ status: 'queued' }), 'error'],
    ['string result', () => 'ok', 'error'],
  ];
  for (const [label, makeResult, expectedPhase] of outcomes) {
    const submitter = deferredSubmitter();
    const form = harness(submitter.submit);
    const pending = form.controller.submit(values, 'en', '');
    submitter.calls[0].resolve(makeResult());
    await pending;
    assert.equal(form.state.phase, expectedPhase, label);
    assert.notEqual(form.state.phase, 'success', `${label} must never look accepted`);
    if (expectedPhase === 'error') {
      assert.ok(['rate-limited', 'misconfigured', 'unavailable', 'unknown'].includes(form.state.failureReason), label);
    }
    assert.equal(form.actions.some((action) => action.type === 'RESET'), false, `${label} must not reset values`);

    // Retry is the visitor's explicit action: it validates again and takes a fresh snapshot.
    const retry = form.controller.submit(values, 'en', '');
    assert.equal(submitter.calls.length, 2, `${label}: explicit retry reaches the submitter`);
    submitter.calls[1].resolve({ status: 'accepted' });
    await retry;
    assert.equal(form.state.phase, 'success', label);
    assert.equal(form.state.requestId, 2, label);
  }
});

test('only an accepted result produces the success phase that resets the form', async () => {
  requireImplementation();
  const results = [
    { status: 'accepted' },
    { status: 'invalid', fieldErrors: { name: 'required' } },
    { status: 'failed', reason: 'unavailable' },
  ];
  const phases = [];
  for (const result of results) {
    const submitter = deferredSubmitter();
    const form = harness(submitter.submit);
    const pending = form.controller.submit(values, 'en', '');
    submitter.calls[0].resolve(result);
    await pending;
    phases.push(form.state.phase);
  }
  assert.deepEqual(phases, ['success', 'idle', 'error']);
});

test('a provider field rejection is bound to its request and focuses the first invalid field', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'en', '');
  submitter.calls[0].resolve({ status: 'invalid', fieldErrors: { message: 'max-length', email: 'invalid-email' } });
  await pending;

  const rejection = form.actions.find((action) => action.type === 'SUBMIT_REJECTED');
  assert.ok(rejection, 'a provider rejection is its own action');
  assert.equal(rejection.requestId, 1);
  assert.equal(form.actions.filter((action) => action.type === 'VALIDATION_FAILED').length, 0);
  assert.equal(form.state.phase, 'idle');
  assert.deepEqual(form.state.fieldErrors, { message: 'max-length', email: 'invalid-email' });
  assert.equal(form.state.focusField, 'email');
});

test('a field rejection outside the field and code allowlists is dropped, never shown', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'en', '');
  submitter.calls[0].resolve({
    status: 'invalid',
    fieldErrors: { name: 'required', _gotcha: 'required', locale: 'required', email: 'PROVIDER PROSE', message: 'max-length' },
  });
  await pending;
  assert.deepEqual(form.state.fieldErrors, { name: 'required', message: 'max-length' });
});

test('a rejection with nothing recognisable becomes an unknown failure', async () => {
  requireImplementation();
  for (const fieldErrors of [{}, { subject: 'required' }, { name: 'nope' }, undefined, null, 'name']) {
    const submitter = deferredSubmitter();
    const form = harness(submitter.submit);
    const pending = form.controller.submit(values, 'en', '');
    submitter.calls[0].resolve({ status: 'invalid', fieldErrors });
    await pending;
    assert.equal(form.state.phase, 'error', JSON.stringify(fieldErrors));
    assert.equal(form.state.failureReason, 'unknown');
  }
});

test('a thrown or rejecting submitter is an unknown failure with the lock released, and nothing is logged', async () => {
  requireImplementation();
  const logged = [];
  const originals = {};
  for (const method of ['log', 'info', 'warn', 'error', 'debug']) {
    originals[method] = console[method];
    console[method] = (...args) => logged.push([method, args]);
  }
  try {
    const throwing = harness(() => { throw new Error('private submitter detail'); });
    await throwing.controller.submit(values, 'en', '');
    assert.equal(throwing.state.phase, 'error');
    assert.equal(throwing.state.failureReason, 'unknown');

    const rejecting = deferredSubmitter();
    const form = harness(rejecting.submit);
    const pending = form.controller.submit(values, 'en', '');
    rejecting.calls[0].reject(new Error('private rejection detail'));
    await pending;
    assert.equal(form.state.phase, 'error');
    assert.equal(form.state.failureReason, 'unknown');

    const again = form.controller.submit(values, 'en', '');
    assert.equal(rejecting.calls.length, 2, 'a rejection does not leave the lock held');
    rejecting.calls[1].resolve({ status: 'accepted' });
    await again;
    assert.equal(form.state.phase, 'success');
  } finally {
    Object.assign(console, originals);
  }
  assert.deepEqual(logged, []);
});

test('a missing or non-string trap value is sent as an empty string', async () => {
  requireImplementation();
  for (const trap of [undefined, null, 7, {}]) {
    const submitter = deferredSubmitter();
    const form = harness(submitter.submit);
    const pending = form.controller.submit(values, 'en', trap);
    assert.equal(submitter.calls[0].context.honeypot, '');
    submitter.calls[0].resolve({ status: 'accepted' });
    await pending;
  }
});

test('each request has its own signal and a later request is not cancelled by an earlier one', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);

  const first = form.controller.submit(values, 'en', '');
  submitter.calls[0].resolve({ status: 'failed', reason: 'unavailable' });
  await first;
  const second = form.controller.submit(values, 'en', '');

  assert.notEqual(submitter.calls[0].context.signal, submitter.calls[1].context.signal);
  assert.equal(submitter.calls[1].context.signal.aborted, false);
  assert.equal(form.actions.filter((action) => action.type === 'SUBMIT_STARTED').at(-1).requestId, 2);
  submitter.calls[1].resolve({ status: 'accepted' });
  await second;
  assert.equal(form.state.phase, 'success');
  assert.equal(form.state.requestId, 2);
});

test('disposal aborts the request in flight and ignores every late result', async () => {
  requireImplementation();
  const lateResults = [
    { status: 'accepted' },
    { status: 'invalid', fieldErrors: { name: 'required' } },
    { status: 'failed', reason: 'unavailable' },
  ];
  for (const late of lateResults) {
    const submitter = deferredSubmitter();
    const form = harness(submitter.submit);
    const pending = form.controller.submit(values, 'en', '');
    const dispatched = form.actions.length;

    form.controller.dispose();
    assert.equal(submitter.calls[0].context.signal.aborted, true);

    submitter.calls[0].resolve(late);
    await pending;
    assert.equal(form.actions.length, dispatched, `${late.status}: nothing is dispatched after disposal`);
  }

  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'en', '');
  const dispatched = form.actions.length;
  form.controller.dispose();
  submitter.calls[0].reject(new DOMException('aborted', 'AbortError'));
  await pending;
  assert.equal(form.actions.length, dispatched, 'a late abort rejection is ignored too');
});

test('after disposal no new request starts, and disposing twice is harmless', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  form.controller.dispose();
  form.controller.dispose();
  await form.controller.submit(values, 'en', '');
  assert.equal(submitter.calls.length, 0);
  assert.equal(form.actions.length, 0);
});

test('disposing an idle controller aborts nothing and leaves finished signals alone', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'en', '');
  submitter.calls[0].resolve({ status: 'accepted' });
  await pending;
  form.controller.dispose();
  assert.equal(submitter.calls[0].context.signal.aborted, false, 'a settled request is not retroactively aborted');
});

test('a dispatch that throws still releases the lock', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  let failNext = true;
  const dispatch = (action) => {
    if (failNext && action.type === 'SUBMIT_SUCCEEDED') {
      failNext = false;
      throw new Error('dispatch failed');
    }
  };
  const controller = createInquirySubmissionController({ submit: submitter.submit, dispatch });
  const pending = controller.submit(values, 'en', '');
  submitter.calls[0].resolve({ status: 'accepted' });
  await pending.catch(() => {});

  const again = controller.submit(values, 'en', '');
  assert.equal(submitter.calls.length, 2);
  submitter.calls[1].resolve({ status: 'accepted' });
  await again;
});

test('the controller never retries by itself', async () => {
  requireImplementation();
  const submitter = deferredSubmitter();
  const form = harness(submitter.submit);
  const pending = form.controller.submit(values, 'en', '');
  submitter.calls[0].resolve({ status: 'failed', reason: 'unavailable' });
  await pending;
  await tick();
  await tick();
  assert.equal(submitter.calls.length, 1);
  assert.equal(form.state.phase, 'error');
});
