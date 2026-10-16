import type {
  InquiryField,
  InquiryPayload,
  InquirySubmissionContext,
  InquirySubmissionResult,
  InquiryValidationCode,
  SubmitInquiry,
} from './contracts';

const REQUEST_BYTE_LIMIT = 24 * 1024;
const endpointPattern = /^\/f\/[^/]+\/?$/;
const approvedFields = new Set<InquiryField>(['name', 'email', 'company', 'message']);
const approvedProviderCodes = new Map<string, InquiryValidationCode>([
  ['REQUIRED', 'required'],
  ['INVALID_EMAIL', 'invalid-email'],
  ['TYPE_EMAIL', 'invalid-email'],
  ['MAX_LENGTH', 'max-length'],
]);
const configurationCodes = new Set([
  'FORM_INACTIVE',
  'FORM_DISABLED',
  'FORM_MISSING',
  'FORM_NOT_FOUND',
  'INACTIVE_FORM',
  'MISSING_FORM',
]);

type FormspreeResponse = {
  status: number;
  json: () => Promise<unknown>;
};

type FormspreeFetch = (
  input: string,
  init: RequestInit,
) => Promise<FormspreeResponse>;

export type FormspreeSubmitInquiryOptions = {
  endpoint?: string;
  fetchImpl?: FormspreeFetch;
  timeoutMs?: number;
};

function isValidEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== 'string' || endpoint.length === 0) return false;

  try {
    const url = new URL(endpoint);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'formspree.io' &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      url.search === '' &&
      url.hash === '' &&
      endpointPattern.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function failed(reason: 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown'): InquirySubmissionResult {
  return { status: 'failed', reason };
}

function normalizedCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function mapFieldErrors(body: unknown): InquirySubmissionResult | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const errors = (body as { errors?: unknown }).errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;

  const fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>> = {};
  for (const error of errors) {
    if (!error || typeof error !== 'object' || Array.isArray(error)) return failed('unknown');
    const field = (error as { field?: unknown }).field;
    const code = normalizedCode((error as { code?: unknown }).code);
    if (typeof field !== 'string' || !approvedFields.has(field as InquiryField) || !code) {
      return failed('unknown');
    }
    const mapped = approvedProviderCodes.get(code);
    if (!mapped) return failed('unknown');
    fieldErrors[field as InquiryField] = mapped;
  }

  return { status: 'invalid', fieldErrors };
}

function isConfigurationBody(body: unknown): boolean {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const record = body as { code?: unknown; error?: unknown };
  return [record.code, record.error].some((value) => {
    const code = normalizedCode(value);
    return code !== null && configurationCodes.has(code);
  });
}

function transportPayload(payload: InquiryPayload, honeypot: unknown): Record<string, string> {
  const transport: Record<string, string> = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
    locale: payload.locale,
    source: payload.source,
    // The trap's real value, supplied by the form; a visitor never types here, so a value marks a bot.
    _gotcha: typeof honeypot === 'string' ? honeypot : '',
  };
  const company = typeof payload.company === 'string' ? payload.company.trim() : '';
  if (company) transport.company = company;
  return transport;
}

export function createFormspreeSubmitInquiry({
  endpoint,
  fetchImpl = fetch as FormspreeFetch,
  timeoutMs = 10_000,
}: FormspreeSubmitInquiryOptions): SubmitInquiry {
  const configuredEndpoint = isValidEndpoint(endpoint) ? endpoint : null;
  const effectiveTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 10_000;

  return async (payload, context?: InquirySubmissionContext) => {
    if (configuredEndpoint === null) return failed('misconfigured');

    const body = JSON.stringify(transportPayload(payload, context?.honeypot));
    if (new TextEncoder().encode(body).byteLength > REQUEST_BYTE_LIMIT) {
      return {
        status: 'invalid',
        fieldErrors: { message: 'request-too-large' },
      };
    }

    const callerSignal = context?.signal;
    if (callerSignal?.aborted) return failed('unavailable');

    // One deadline covers the request, the response headers and reading the body. Racing it keeps the
    // submission finite even when a fetch or a body reader ignores the abort signal.
    const controller = new AbortController();
    const deadline = new Promise<never>((_resolve, reject) => {
      controller.signal.addEventListener('abort', () => reject(new Error('deadline')), { once: true });
    });
    deadline.catch(() => {});
    const abortFromCaller = () => controller.abort();
    callerSignal?.addEventListener('abort', abortFromCaller, { once: true });
    const timer = setTimeout(() => controller.abort(), effectiveTimeout);

    try {
      let response: FormspreeResponse;
      try {
        response = await Promise.race([
          fetchImpl(configuredEndpoint, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
            signal: controller.signal,
          }),
          deadline,
        ]);
      } catch {
        return failed('unavailable');
      }

      if (response.status === 429) return failed('rate-limited');
      if (response.status >= 500 && response.status <= 599) return failed('unavailable');

      let responseBody: unknown;
      try {
        responseBody = await Promise.race([response.json(), deadline]);
      } catch {
        // A deadline that fires while reading the body leaves acceptance uncertain; unreadable JSON is unknown.
        return failed(controller.signal.aborted ? 'unavailable' : 'unknown');
      }

      if (response.status >= 200 && response.status <= 299) {
        if (
          responseBody !== null &&
          typeof responseBody === 'object' &&
          !Array.isArray(responseBody) &&
          (responseBody as { ok?: unknown }).ok === true
        ) {
          return { status: 'accepted' };
        }
        return failed('unknown');
      }

      const fieldResult = mapFieldErrors(responseBody);
      if (fieldResult) return fieldResult;
      if (isConfigurationBody(responseBody)) return failed('misconfigured');
      return failed('unknown');
    } finally {
      clearTimeout(timer);
      callerSignal?.removeEventListener('abort', abortFromCaller);
    }
  };
}
