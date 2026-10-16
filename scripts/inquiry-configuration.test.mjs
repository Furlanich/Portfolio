import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const configurationModule = await import('../lib/inquiry/configuration.ts').catch(() => null);
const releaseModule = await import('../lib/inquiry/release.ts').catch(() => null);
const getInquiryConfiguration = configurationModule?.getInquiryConfiguration;
const createConfiguredSubmitInquiry = configurationModule?.createConfiguredSubmitInquiry;
const COMMERCIAL_INQUIRY_ENDPOINT = configurationModule?.COMMERCIAL_INQUIRY_ENDPOINT;
const INQUIRY_RELEASE = releaseModule?.INQUIRY_RELEASE;

const root = fileURLToPath(new URL('..', import.meta.url));
const exactEndpoint = 'https://formspree.io/f/meaqwnbr';
const commercialRelease = { mode: 'commercial', releaseId: 'CONFIGURATION-TEST' };
const validPayload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Please help us scope a product idea.',
  locale: 'en',
  source: '/en/contact/',
};

function requireImplementation() {
  assert.equal(typeof getInquiryConfiguration, 'function', 'getInquiryConfiguration has not been implemented');
  assert.equal(typeof createConfiguredSubmitInquiry, 'function', 'createConfiguredSubmitInquiry has not been implemented');
}

function withEnvironmentEndpoint(value, run) {
  const key = 'NEXT_PUBLIC_FORMSPREE_ENDPOINT';
  const previous = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

function jsonResponse(status, body) {
  return { status, ok: status >= 200 && status < 300, async json() { return body; } };
}

test('the committed release record is the frozen demonstration declaration', () => {
  assert.ok(INQUIRY_RELEASE, 'release.ts has not been created');
  assert.deepEqual({ ...INQUIRY_RELEASE }, { mode: 'demonstration', releaseId: 'DEMONSTRATION' });

  const source = readFileSync(new URL('../lib/inquiry/release.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(
    source,
    "export type InquiryReleaseRecord = { readonly mode: 'demonstration' | 'commercial'; readonly releaseId: string };\n\nexport const INQUIRY_RELEASE: InquiryReleaseRecord = {\n  mode: 'demonstration',\n  releaseId: 'DEMONSTRATION',\n};\n",
    'the commercial candidate patch is cut against these exact bytes',
  );
});

test('the committed commercial candidate patch applies to the real release declaration', () => {
  const patch = readFileSync(new URL('../tests/fixtures/sfc/commercial-release.patch', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  // --check never writes: it proves the patch still matches the working copy of lib/inquiry/release.ts.
  assert.doesNotThrow(() => execFileSync('git', ['apply', '--check', '-'], { cwd: root, input: patch, stdio: ['pipe', 'pipe', 'pipe'] }));
});

test('the exact public commercial endpoint is the owner-approved form', () => {
  requireImplementation();
  assert.equal(COMMERCIAL_INQUIRY_ENDPOINT, exactEndpoint);
});

test('the committed demonstration record needs no endpoint and ignores one', () => {
  requireImplementation();
  assert.deepEqual(getInquiryConfiguration({ release: INQUIRY_RELEASE }), { mode: 'demonstration' });
  assert.deepEqual(getInquiryConfiguration({ release: INQUIRY_RELEASE, endpoint: exactEndpoint }), { mode: 'demonstration' });
  assert.deepEqual(getInquiryConfiguration({ release: INQUIRY_RELEASE, endpoint: 'not even a url' }), { mode: 'demonstration' });
});

test('an endpoint in the environment alone never switches the mode', () => {
  requireImplementation();
  withEnvironmentEndpoint(exactEndpoint, () => {
    assert.deepEqual(getInquiryConfiguration(), { mode: 'demonstration' });
    assert.deepEqual(getInquiryConfiguration({ release: INQUIRY_RELEASE }), { mode: 'demonstration' });
  });
});

test('a commercial record accepts only the exact endpoint and reports the release id', () => {
  requireImplementation();
  assert.deepEqual(getInquiryConfiguration({ release: commercialRelease, endpoint: exactEndpoint }), {
    mode: 'commercial',
    endpoint: exactEndpoint,
    releaseId: 'CONFIGURATION-TEST',
  });
});

test('a commercial record reads the allowlisted build-time endpoint when none is passed', () => {
  requireImplementation();
  withEnvironmentEndpoint(exactEndpoint, () => {
    assert.deepEqual(getInquiryConfiguration({ release: commercialRelease }), {
      mode: 'commercial',
      endpoint: exactEndpoint,
      releaseId: 'CONFIGURATION-TEST',
    });
  });
  withEnvironmentEndpoint(undefined, () => {
    assert.throws(() => getInquiryConfiguration({ release: commercialRelease }), /endpoint/i);
  });
});

test('a commercial record rejects a missing, different or decorated endpoint', () => {
  requireImplementation();
  const rejected = [
    undefined,
    null,
    42,
    '',
    '   ',
    'formspree.io/f/meaqwnbr',
    'http://formspree.io/f/meaqwnbr',
    'https://formspree.io/f/another',
    'https://formspree.io/f/meaqwnbr/',
    'https://formspree.io/f/meaqwnbr?x=1',
    'https://formspree.io/f/meaqwnbr#fragment',
    'https://user:secret@formspree.io/f/meaqwnbr',
    'https://formspree.io:8443/f/meaqwnbr',
    'https://formspree.io:443/f/meaqwnbr',
    'https://www.formspree.io/f/meaqwnbr',
    'https://formspree.io.example.com/f/meaqwnbr',
    'https://example.com/f/meaqwnbr',
    ` ${exactEndpoint}`,
    `${exactEndpoint} `,
    exactEndpoint.toUpperCase(),
  ];
  for (const endpoint of rejected) {
    withEnvironmentEndpoint(undefined, () => {
      assert.throws(
        () => getInquiryConfiguration({ release: commercialRelease, endpoint }),
        /endpoint/i,
        `${String(endpoint)} must be rejected`,
      );
    });
  }
});

test('a configuration failure never echoes the offending endpoint or its credentials', () => {
  requireImplementation();
  assert.throws(
    () => getInquiryConfiguration({ release: commercialRelease, endpoint: 'https://user:topsecret@formspree.io/f/meaqwnbr?token=abc' }),
    (error) => {
      assert.ok(error instanceof Error);
      assert.equal(/topsecret|token=abc|user:/.test(error.message), false, error.message);
      return true;
    },
  );
});

test('an unknown mode, empty release id or malformed record is rejected, not defaulted', () => {
  requireImplementation();
  const records = [
    { mode: 'live', releaseId: 'X' },
    { mode: 'Commercial', releaseId: 'X' },
    { mode: 'commercial', releaseId: '' },
    { mode: 'commercial', releaseId: '   ' },
    { mode: 'commercial' },
    { mode: 'demonstration', releaseId: '' },
    { releaseId: 'X' },
    null,
    'commercial',
  ];
  for (const release of records) {
    assert.throws(
      () => getInquiryConfiguration({ release, endpoint: exactEndpoint }),
      /release/i,
      `${JSON.stringify(release)} must be rejected`,
    );
  }
});

test('the demonstration submitter transmits nothing', async () => {
  requireImplementation();
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls += 1; throw new Error('fetch must not run in demonstration'); };
  try {
    const submit = createConfiguredSubmitInquiry({ release: INQUIRY_RELEASE, endpoint: exactEndpoint, wait: async () => {} });
    assert.deepEqual(await submit(validPayload, { honeypot: '' }), { status: 'accepted' });
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('the commercial submitter posts to the exact endpoint with the real trap value', async () => {
  requireImplementation();
  const requests = [];
  const submit = createConfiguredSubmitInquiry({
    release: commercialRelease,
    endpoint: exactEndpoint,
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return jsonResponse(200, { ok: true });
    },
  });

  assert.deepEqual(await submit(validPayload, { honeypot: 'filled-by-a-bot' }), { status: 'accepted' });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, exactEndpoint);
  assert.equal(JSON.parse(requests[0].init.body)._gotcha, 'filled-by-a-bot');
});

test('a commercial release without a valid endpoint fails at creation and never simulates success', async () => {
  requireImplementation();
  withEnvironmentEndpoint(undefined, () => {
    assert.throws(() => createConfiguredSubmitInquiry({ release: commercialRelease }), /endpoint/i);
    assert.throws(() => createConfiguredSubmitInquiry({ release: commercialRelease, endpoint: 'https://formspree.io/f/other' }), /endpoint/i);
  });
});

test('an unavailable commercial provider is a failure, never a demonstration success', async () => {
  requireImplementation();
  const submit = createConfiguredSubmitInquiry({
    release: commercialRelease,
    endpoint: exactEndpoint,
    fetchImpl: async () => { throw new TypeError('network down'); },
  });
  assert.deepEqual(await submit(validPayload), { status: 'failed', reason: 'unavailable' });
});
