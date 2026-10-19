import type { SubmitInquiry } from './contracts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { createDemoSubmitInquiry, type DemoSubmissionOptions } from './demo.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { createFormspreeSubmitInquiry, type FormspreeSubmitInquiryOptions } from './formspree.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { INQUIRY_RELEASE, type InquiryReleaseRecord } from './release.ts';

/** The one owner-approved public Formspree form. It is an address, not a secret. */
export const COMMERCIAL_INQUIRY_ENDPOINT = 'https://formspree.io/f/meaqwnbr';

export type InquiryConfiguration =
  | { mode: 'demonstration' }
  | { mode: 'commercial'; endpoint: string; releaseId: string };

export type InquiryConfigurationInput = {
  /** The committed release record. Only tests pass another one. */
  release?: InquiryReleaseRecord;
  /** The build-time endpoint; falls back to NEXT_PUBLIC_FORMSPREE_ENDPOINT. Ignored in demonstration. */
  endpoint?: string;
};

export type ConfiguredSubmitInquiryOptions = InquiryConfigurationInput &
  Pick<FormspreeSubmitInquiryOptions, 'fetchImpl' | 'timeoutMs'> &
  Pick<DemoSubmissionOptions, 'delayMs' | 'wait'>;

/** Messages never carry the offending value: an endpoint may hold credentials. */
export class InquiryConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InquiryConfigurationError';
  }
}

function validRelease(release: unknown): release is InquiryReleaseRecord {
  if (release === null || typeof release !== 'object') return false;
  const { mode, releaseId } = release as Partial<InquiryReleaseRecord>;
  return (
    (mode === 'demonstration' || mode === 'commercial') &&
    typeof releaseId === 'string' &&
    releaseId.trim().length > 0
  );
}

/**
 * The mode comes only from the committed release record. An endpoint in the environment can complete a
 * commercial release but can never switch a demonstration one; a commercial release without the exact
 * approved endpoint is an error, never a fallback to the demonstration submitter.
 */
export function getInquiryConfiguration({
  release = INQUIRY_RELEASE,
  // A literal property access, so the bundler can inline the build-time value.
  endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT,
}: InquiryConfigurationInput = {}): InquiryConfiguration {
  if (!validRelease(release)) {
    throw new InquiryConfigurationError('The inquiry release record is invalid.');
  }
  if (release.mode === 'demonstration') return { mode: 'demonstration' };

  if (endpoint !== COMMERCIAL_INQUIRY_ENDPOINT) {
    throw new InquiryConfigurationError(
      'A commercial inquiry release requires the approved Formspree endpoint at build time.',
    );
  }
  return { mode: 'commercial', endpoint, releaseId: release.releaseId };
}

export function createConfiguredSubmitInquiry({
  release,
  endpoint,
  fetchImpl,
  timeoutMs,
  delayMs,
  wait,
}: ConfiguredSubmitInquiryOptions = {}): SubmitInquiry {
  const configuration = getInquiryConfiguration({ release, endpoint });
  if (configuration.mode === 'demonstration') return createDemoSubmitInquiry({ delayMs, wait });
  return createFormspreeSubmitInquiry({ endpoint: configuration.endpoint, fetchImpl, timeoutMs });
}
