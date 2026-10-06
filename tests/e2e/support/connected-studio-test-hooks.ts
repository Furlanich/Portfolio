import type { Page } from '@playwright/test';
import type { ConnectedLivePolicy } from '../../../lib/connected-studio/types';

// The one test-injection mechanism for the connected routes (PLAN-SPF-V1 Task 2), mirroring Home's
// accepted `__SKY_CHART_ALLOW_SOFTWARE_RENDERER__`. It is set only through `page.addInitScript`,
// never from a query string, storage, UI or public configuration. Functional tests and poster
// capture may use it and must label the result as controlled test evidence. Production
// measurements and owner hardware acceptance never set it.
export type ConnectedTestHook = {
  /** Folds into the software-renderer gate so SwiftShader can exercise the live scene. */
  allowSoftwareRenderer?: boolean;
  /** Replaces the shipped `CONNECTED_LIVE_POLICY` (both tiers off) for this page only. */
  livePolicy?: ConnectedLivePolicy;
};

declare global {
  interface Window {
    __FURLANICH_CONNECTED_TEST__?: ConnectedTestHook;
  }
}

const FIELDS = ['allowSoftwareRenderer', 'livePolicy'] as const;

function validate(hook: unknown): ConnectedTestHook {
  if (typeof hook !== 'object' || hook === null || Array.isArray(hook)) {
    throw new TypeError('The connected test hook must be an object.');
  }
  const record = hook as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!(FIELDS as readonly string[]).includes(key)) throw new TypeError(`Unknown connected test hook field: ${key}`);
  }
  const checked: ConnectedTestHook = {};
  if ('allowSoftwareRenderer' in record) {
    if (typeof record.allowSoftwareRenderer !== 'boolean') throw new TypeError('allowSoftwareRenderer must be a boolean.');
    checked.allowSoftwareRenderer = record.allowSoftwareRenderer;
  }
  if ('livePolicy' in record) {
    const policy = record.livePolicy as Record<string, unknown> | null;
    if (typeof policy !== 'object' || policy === null || typeof policy.wide !== 'boolean' || typeof policy.compact !== 'boolean') {
      throw new TypeError('livePolicy must be { wide: boolean; compact: boolean }.');
    }
    checked.livePolicy = { wide: policy.wide, compact: policy.compact };
  }
  return checked;
}

/** Installs the hook before any page script runs; call it before the first navigation. */
export async function setConnectedTestHook(page: Page, hook: ConnectedTestHook): Promise<void> {
  const checked = validate(hook);
  await page.addInitScript((value) => {
    window.__FURLANICH_CONNECTED_TEST__ = value;
  }, checked);
}
