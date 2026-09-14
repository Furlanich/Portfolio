import type { InquiryField, InquiryValidationCode } from '@/lib/inquiry/contracts';

export type InquiryPhase = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
export type InquiryFailureReason = 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown';
export type InquiryFieldErrors = Partial<Record<InquiryField, InquiryValidationCode>>;

export type InquiryFormState = {
  phase: InquiryPhase;
  fieldErrors: InquiryFieldErrors;
  focusField: InquiryField | null;
  requestId: number;
  failureReason?: InquiryFailureReason;
};

export const initialInquiryFormState: InquiryFormState = {
  phase: 'idle',
  fieldErrors: {},
  focusField: null,
  requestId: 0,
};

type InquiryAction =
  | { type: 'VALIDATE' }
  | { type: 'VALIDATION_FAILED'; fieldErrors: InquiryFieldErrors }
  | { type: 'SUBMIT_STARTED'; requestId: number }
  | { type: 'SUBMIT_SUCCEEDED'; requestId: number }
  | { type: 'SUBMIT_FAILED'; requestId: number; reason: unknown }
  | { type: 'CLEAR_FIELD_ERROR'; field: InquiryField }
  | { type: 'RETRY' }
  | { type: 'RESET' };

const orderedFields: InquiryField[] = ['name', 'email', 'company', 'message'];
const failureReasons = new Set<InquiryFailureReason>([
  'rate-limited',
  'misconfigured',
  'unavailable',
  'unknown',
]);

export function firstInvalidField(fieldErrors: InquiryFieldErrors): InquiryField | null {
  return orderedFields.find((field) => fieldErrors[field]) ?? null;
}

export function safeFailureReason(reason: unknown): InquiryFailureReason {
  return typeof reason === 'string' && failureReasons.has(reason as InquiryFailureReason)
    ? (reason as InquiryFailureReason)
    : 'unknown';
}

export function inquiryReducer(
  state: InquiryFormState,
  action: InquiryAction,
): InquiryFormState {
  switch (action.type) {
    case 'VALIDATE':
      {
        const withoutFailure = { ...state };
        delete withoutFailure.failureReason;
        return { ...withoutFailure, phase: 'validating', fieldErrors: {}, focusField: null };
      }
    case 'VALIDATION_FAILED':
      return {
        ...state,
        phase: 'idle',
        fieldErrors: action.fieldErrors,
        focusField: firstInvalidField(action.fieldErrors),
      };
    case 'SUBMIT_STARTED':
      if (state.phase === 'submitting') return state;
      return { phase: 'submitting', fieldErrors: {}, focusField: null, requestId: action.requestId };
    case 'SUBMIT_SUCCEEDED':
      if (state.phase !== 'submitting' || state.requestId !== action.requestId) return state;
      {
        const withoutFailure = { ...state };
        delete withoutFailure.failureReason;
        return { ...withoutFailure, phase: 'success', fieldErrors: {}, focusField: null };
      }
    case 'SUBMIT_FAILED':
      if (state.phase !== 'submitting' || state.requestId !== action.requestId) return state;
      return {
        ...state,
        phase: 'error',
        fieldErrors: {},
        focusField: null,
        failureReason: safeFailureReason(action.reason),
      };
    case 'CLEAR_FIELD_ERROR': {
      if (!state.fieldErrors[action.field]) return state;
      const fieldErrors = { ...state.fieldErrors };
      delete fieldErrors[action.field];
      return { ...state, fieldErrors };
    }
    case 'RETRY':
      if (state.phase !== 'error') return state;
      return { ...state, phase: 'validating', fieldErrors: {}, focusField: null };
    case 'RESET':
      return initialInquiryFormState;
    default:
      return state;
  }
}
