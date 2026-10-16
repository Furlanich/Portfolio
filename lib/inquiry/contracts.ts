export type InquiryField = 'name' | 'email' | 'company' | 'message';

export type InquiryValues = Record<InquiryField, string>;

export type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  locale: 'es-AR' | 'en';
  source: '/contacto/' | '/en/contact/';
};

export type InquiryValidationCode =
  | 'required'
  | 'invalid-email'
  | 'max-length'
  | 'request-too-large';

export type InquirySubmissionResult =
  | { status: 'accepted' }
  | {
      status: 'invalid';
      fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>>;
    }
  | {
      status: 'failed';
      reason: 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown';
    };

/**
 * Provider-neutral context for one submission, kept apart from the public payload. The honeypot is the
 * real value of the hidden text trap (never a fifth business field); only the Formspree transport maps it
 * to `_gotcha`. The signal cancels client work on unmount; an abort is not proof the server did not
 * receive the request.
 */
export type InquirySubmissionContext = {
  honeypot?: string;
  signal?: AbortSignal;
};

export type SubmitInquiry = (
  payload: InquiryPayload,
  context?: InquirySubmissionContext,
) => Promise<InquirySubmissionResult>;

export type InquiryValidationResult =
  | { valid: true; payload: InquiryPayload }
  | {
      valid: false;
      fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>>;
    };
