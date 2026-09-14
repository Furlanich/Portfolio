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
