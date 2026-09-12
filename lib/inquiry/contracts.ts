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

export type SubmitInquiry = (
  payload: InquiryPayload,
) => Promise<InquirySubmissionResult>;

export type InquiryValidationResult =
  | { valid: true; payload: InquiryPayload }
  | {
      valid: false;
      fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>>;
    };
