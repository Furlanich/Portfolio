import type { InquiryAction, InquiryFieldErrors } from '@/components/contact/state';
import type {
  InquiryField,
  InquiryPayload,
  InquirySubmissionResult,
  InquiryValidationCode,
  InquiryValues,
  SubmitInquiry,
} from './contracts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { validateInquiry } from './validation.ts';

export type InquirySubmissionController = {
  /** Resolves once the attempt settles. A call made while another is in flight does nothing. */
  submit: (values: InquiryValues, locale: InquiryPayload['locale'], honeypot: string) => Promise<void>;
  /** Aborts the request in flight and ignores everything that arrives afterwards. */
  dispose: () => void;
};

export type InquirySubmissionControllerOptions = {
  submit: SubmitInquiry;
  dispatch: (action: InquiryAction) => void;
};

const fields: readonly InquiryField[] = ['name', 'email', 'company', 'message'];
const validationCodes: ReadonlySet<string> = new Set<InquiryValidationCode>([
  'required',
  'invalid-email',
  'max-length',
  'request-too-large',
]);

/** Keeps only known fields with known codes, so nothing a submitter invents is ever displayed. */
function approvedFieldErrors(candidate: unknown): InquiryFieldErrors {
  const approved: InquiryFieldErrors = {};
  if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) return approved;
  for (const field of fields) {
    const code = (candidate as Record<string, unknown>)[field];
    if (typeof code === 'string' && validationCodes.has(code)) {
      approved[field] = code as InquiryValidationCode;
    }
  }
  return approved;
}

/**
 * Owns the one in-flight inquiry request. The lock is a plain variable taken before anything is awaited,
 * so two submissions in the same tick cannot both reach the provider; React state alone would not stop them.
 * The lock lasts until the request settles, so a result can only belong to the current request; a monotonic
 * sequence tags it anyway and the reducer drops any result whose id is not the one in flight. After disposal
 * nothing is dispatched. The controller never retries, stores, or logs anything.
 */
export function createInquirySubmissionController({
  submit,
  dispatch,
}: InquirySubmissionControllerOptions): InquirySubmissionController {
  let sequence = 0;
  let inFlight = false;
  let disposed = false;
  let current: AbortController | null = null;

  async function run(
    values: InquiryValues,
    locale: InquiryPayload['locale'],
    honeypot: string,
  ): Promise<void> {
    if (disposed || inFlight) return;

    dispatch({ type: 'VALIDATE' });
    const validation = validateInquiry(values, locale);
    if (!validation.valid) {
      dispatch({ type: 'VALIDATION_FAILED', fieldErrors: validation.fieldErrors });
      return;
    }

    inFlight = true;
    const requestId = ++sequence;
    const request = new AbortController();
    current = request;

    try {
      dispatch({ type: 'SUBMIT_STARTED', requestId });
      let result: InquirySubmissionResult | undefined;
      try {
        result = await submit(validation.payload, {
          honeypot: typeof honeypot === 'string' ? honeypot : '',
          signal: request.signal,
        });
      } catch {
        // A thrown or rejected submitter is an unknown outcome, never a success. Detail is not kept.
        result = { status: 'failed', reason: 'unknown' };
      }
      if (disposed) return;

      if (result?.status === 'accepted') {
        dispatch({ type: 'SUBMIT_SUCCEEDED', requestId });
      } else if (result?.status === 'invalid') {
        const fieldErrors = approvedFieldErrors(result.fieldErrors);
        if (Object.keys(fieldErrors).length > 0) {
          dispatch({ type: 'SUBMIT_REJECTED', requestId, fieldErrors });
        } else {
          dispatch({ type: 'SUBMIT_FAILED', requestId, reason: 'unknown' });
        }
      } else {
        dispatch({
          type: 'SUBMIT_FAILED',
          requestId,
          reason: result?.status === 'failed' ? result.reason : 'unknown',
        });
      }
    } finally {
      inFlight = false;
      if (current === request) current = null;
    }
  }

  return {
    submit: run,
    dispose() {
      disposed = true;
      current?.abort();
      current = null;
    },
  };
}
