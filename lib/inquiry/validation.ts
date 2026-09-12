import type {
  InquiryField,
  InquiryPayload,
  InquiryValidationCode,
  InquiryValidationResult,
  InquiryValues,
} from './contracts';

const fieldLimits: Record<InquiryField, number> = {
  name: 100,
  email: 254,
  company: 120,
  message: 4000,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function characterLength(value: string): number {
  return [...value].length;
}

function sourceForLocale(locale: unknown): InquiryPayload['source'] | null {
  if (locale === 'es-AR') return '/contacto/';
  if (locale === 'en') return '/en/contact/';
  return null;
}

export function validateInquiry(
  values: InquiryValues,
  locale: InquiryPayload['locale'],
): InquiryValidationResult {
  const source = sourceForLocale(locale);
  const normalized = {
    name: trimValue(values?.name),
    email: trimValue(values?.email),
    company: trimValue(values?.company),
    message: trimValue(values?.message),
  };
  const fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>> = {};

  for (const field of ['name', 'email', 'company', 'message'] as const) {
    const value = normalized[field];
    if (field !== 'company' && value.length === 0) {
      fieldErrors[field] = 'required';
      continue;
    }
    if (characterLength(value) > fieldLimits[field]) {
      fieldErrors[field] = 'max-length';
    }
  }

  if (!fieldErrors.email && normalized.email && !emailPattern.test(normalized.email)) {
    fieldErrors.email = 'invalid-email';
  }

  if (source === null) {
    return { valid: false, fieldErrors };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors };
  }

  const payload: InquiryPayload = {
    name: normalized.name,
    email: normalized.email,
    message: normalized.message,
    locale,
    source,
  };
  if (normalized.company) payload.company = normalized.company;

  if (new TextEncoder().encode(JSON.stringify(payload)).byteLength > 24 * 1024) {
    return { valid: false, fieldErrors: { message: 'request-too-large' } };
  }

  return { valid: true, payload };
}
