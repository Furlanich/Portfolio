import type { InquiryPayload, SubmitInquiry } from './contracts';

export type DemoSubmissionOptions = {
  delayMs?: number;
  wait?: (milliseconds: number) => Promise<void>;
};

const DEFAULT_DELAY_MS = 650;

const defaultWait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

function safeDelay(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : DEFAULT_DELAY_MS;
}

export function createDemoSubmitInquiry({
  delayMs,
  wait = defaultWait,
}: DemoSubmissionOptions = {}): SubmitInquiry {
  const effectiveDelay = safeDelay(delayMs);

  return async (payload: InquiryPayload) => {
    await wait(effectiveDelay);
    const email = payload.email.trim().toLowerCase();

    if (email === 'failure@example.invalid') {
      return { status: 'failed', reason: 'unavailable' };
    }

    return { status: 'accepted' };
  };
}
