import test from 'node:test';
import assert from 'node:assert/strict';

const stateModule = await import('../components/contact/state.ts').catch(() => null);
const initialState = stateModule?.initialInquiryFormState;
const inquiryReducer = stateModule?.inquiryReducer;
const firstInvalidField = stateModule?.firstInvalidField;

function requireImplementation() {
  assert.equal(typeof inquiryReducer, 'function', 'inquiryReducer has not been implemented');
  assert.ok(initialState, 'initialInquiryFormState has not been implemented');
}

test('models the valid idle, validating, submitting, success, and error transitions', () => {
  requireImplementation();
  const invalid = { name: 'required', email: 'invalid-email', message: 'required' };
  const validating = inquiryReducer(initialState, { type: 'VALIDATE' });
  assert.equal(validating.phase, 'validating');
  assert.deepEqual(inquiryReducer(validating, { type: 'VALIDATION_FAILED', fieldErrors: invalid }), {
    phase: 'idle',
    fieldErrors: invalid,
    focusField: 'name',
    requestId: 0,
  });

  const submitting = inquiryReducer(validating, { type: 'SUBMIT_STARTED', requestId: 4 });
  assert.deepEqual(submitting, { phase: 'submitting', fieldErrors: {}, focusField: null, requestId: 4 });
  assert.deepEqual(inquiryReducer(submitting, { type: 'SUBMIT_STARTED', requestId: 5 }), submitting);
  assert.deepEqual(inquiryReducer(submitting, { type: 'SUBMIT_SUCCEEDED', requestId: 4 }), {
    phase: 'success',
    fieldErrors: {},
    focusField: null,
    requestId: 4,
  });
  assert.deepEqual(inquiryReducer(submitting, { type: 'SUBMIT_FAILED', requestId: 4, reason: 'unavailable' }), {
    phase: 'error',
    fieldErrors: {},
    focusField: null,
    requestId: 4,
    failureReason: 'unavailable',
  });
});

test('focuses the first invalid field and preserves all field errors', () => {
  requireImplementation();
  const fieldErrors = { message: 'required', company: 'max-length', email: 'invalid-email', name: 'required' };
  assert.equal(firstInvalidField(fieldErrors), 'name');
  const result = inquiryReducer(initialState, { type: 'VALIDATION_FAILED', fieldErrors });
  assert.deepEqual(result.fieldErrors, fieldErrors);
  assert.equal(result.focusField, 'name');
});

test('ignores stale submission results, safely normalizes reasons, retries, and resets success', () => {
  requireImplementation();
  let state = inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 8 });
  state = inquiryReducer(state, { type: 'SUBMIT_FAILED', requestId: 7, reason: 'private-provider-detail' });
  assert.equal(state.phase, 'submitting');
  state = inquiryReducer(state, { type: 'SUBMIT_FAILED', requestId: 8, reason: 'private-provider-detail' });
  assert.equal(state.failureReason, 'unknown');
  assert.deepEqual(inquiryReducer(state, { type: 'RETRY' }), {
    phase: 'validating',
    fieldErrors: {},
    focusField: null,
    requestId: 8,
    failureReason: 'unknown',
  });
  assert.deepEqual(inquiryReducer(state, { type: 'RESET' }), initialState);
});

test('a provider field rejection needs the matching request id and ends the busy phase', () => {
  requireImplementation();
  const submitting = inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 3 });
  const fieldErrors = { message: 'max-length', email: 'invalid-email' };

  assert.equal(inquiryReducer(submitting, { type: 'SUBMIT_REJECTED', requestId: 2, fieldErrors }), submitting);
  assert.equal(inquiryReducer(submitting, { type: 'SUBMIT_REJECTED', requestId: 4, fieldErrors }), submitting);
  assert.deepEqual(inquiryReducer(submitting, { type: 'SUBMIT_REJECTED', requestId: 3, fieldErrors }), {
    phase: 'idle',
    fieldErrors,
    focusField: 'email',
    requestId: 3,
  });
});

test('a provider field rejection outside a submission changes nothing', () => {
  requireImplementation();
  const fieldErrors = { name: 'required' };
  for (const state of [
    initialState,
    inquiryReducer(initialState, { type: 'VALIDATE' }),
    inquiryReducer(inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 1 }), { type: 'SUBMIT_SUCCEEDED', requestId: 1 }),
    inquiryReducer(inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 1 }), { type: 'SUBMIT_FAILED', requestId: 1, reason: 'unknown' }),
  ]) {
    assert.equal(inquiryReducer(state, { type: 'SUBMIT_REJECTED', requestId: state.requestId, fieldErrors }), state);
  }
});

test('local validation cannot touch a submission in flight', () => {
  requireImplementation();
  const submitting = inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 6 });
  assert.equal(inquiryReducer(submitting, { type: 'VALIDATE' }), submitting);
  assert.equal(inquiryReducer(submitting, { type: 'VALIDATION_FAILED', fieldErrors: { name: 'required' } }), submitting);
});

test('a late success, failure or rejection from an older request cannot replace a newer one', () => {
  requireImplementation();
  const first = inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 1 });
  const failed = inquiryReducer(first, { type: 'SUBMIT_FAILED', requestId: 1, reason: 'unavailable' });
  const second = inquiryReducer(inquiryReducer(failed, { type: 'VALIDATE' }), { type: 'SUBMIT_STARTED', requestId: 2 });

  assert.equal(second.requestId, 2);
  assert.equal(inquiryReducer(second, { type: 'SUBMIT_SUCCEEDED', requestId: 1 }), second);
  assert.equal(inquiryReducer(second, { type: 'SUBMIT_FAILED', requestId: 1, reason: 'unknown' }), second);
  assert.equal(inquiryReducer(second, { type: 'SUBMIT_REJECTED', requestId: 1, fieldErrors: { name: 'required' } }), second);
});

test('a request id that does not advance cannot start a second submission', () => {
  requireImplementation();
  const done = inquiryReducer(inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 5 }), { type: 'SUBMIT_FAILED', requestId: 5, reason: 'unknown' });
  assert.equal(inquiryReducer(done, { type: 'SUBMIT_STARTED', requestId: 5 }), done);
  assert.equal(inquiryReducer(done, { type: 'SUBMIT_STARTED', requestId: 4 }), done);
  assert.equal(inquiryReducer(done, { type: 'SUBMIT_STARTED', requestId: 6 }).phase, 'submitting');
});

test('a success followed by a late failure keeps the accepted state', () => {
  requireImplementation();
  const accepted = inquiryReducer(inquiryReducer(initialState, { type: 'SUBMIT_STARTED', requestId: 1 }), { type: 'SUBMIT_SUCCEEDED', requestId: 1 });
  assert.equal(inquiryReducer(accepted, { type: 'SUBMIT_FAILED', requestId: 1, reason: 'unavailable' }), accepted);
  assert.equal(inquiryReducer(accepted, { type: 'SUBMIT_SUCCEEDED', requestId: 1 }), accepted);
});
