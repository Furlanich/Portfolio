import test from 'node:test';
import assert from 'node:assert/strict';

const validationModule = await import('../lib/inquiry/validation.ts').catch(() => null);
const validateInquiry = validationModule?.validateInquiry;

const baseValues = {
  name: '  Ada Lovelace  ',
  email: '  ada@example.com  ',
  company: '  Analytical Engines  ',
  message: '  I need help with a product idea.  ',
};

function requireImplementation() {
  assert.equal(typeof validateInquiry, 'function', 'validateInquiry has not been implemented');
}

function valuesWith(field, value) {
  return { ...baseValues, [field]: value };
}

test('normalizes surrounding whitespace and binds the Spanish source', () => {
  requireImplementation();

  const values = { ...baseValues };
  const result = validateInquiry(values, 'es-AR');

  assert.deepEqual(result, {
    valid: true,
    payload: {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines',
      message: 'I need help with a product idea.',
      locale: 'es-AR',
      source: '/contacto/',
    },
  });
  assert.deepEqual(values, baseValues);
});

test('binds the English locale to the English Contact source', () => {
  requireImplementation();

  assert.deepEqual(validateInquiry(baseValues, 'en'), {
    valid: true,
    payload: {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines',
      message: 'I need help with a product idea.',
      locale: 'en',
      source: '/en/contact/',
    },
  });
});

test('omits an optional company when it is empty after trimming', () => {
  requireImplementation();

  const result = validateInquiry(valuesWith('company', '   '), 'en');

  assert.equal(result.valid, true);
  assert.deepEqual(result.payload, {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'I need help with a product idea.',
    locale: 'en',
    source: '/en/contact/',
  });
  assert.equal('company' in result.payload, false);
});

test('returns every required and email error together', () => {
  requireImplementation();

  assert.deepEqual(
    validateInquiry(
      { name: ' ', email: 'not-an-email', company: ' ', message: '\t' },
      'es-AR',
    ),
    {
      valid: false,
      fieldErrors: {
        name: 'required',
        email: 'invalid-email',
        message: 'required',
      },
    },
  );
});

test('accepts the exact approved maximum for every field', () => {
  requireImplementation();

  const result = validateInquiry(
    {
      name: 'N'.repeat(100),
      email: `${'e'.repeat(242)}@example.com`,
      company: 'C'.repeat(120),
      message: 'M'.repeat(4000),
    },
    'en',
  );

  assert.equal(result.valid, true);
  assert.equal(result.payload.name.length, 100);
  assert.equal(result.payload.email.length, 254);
  assert.equal(result.payload.company.length, 120);
  assert.equal(result.payload.message.length, 4000);
});

test('rejects every maximum-plus-one value with field-specific errors', () => {
  requireImplementation();

  assert.deepEqual(
    validateInquiry(
      {
        name: 'N'.repeat(101),
        email: `${'e'.repeat(243)}@example.com`,
        company: 'C'.repeat(121),
        message: 'M'.repeat(4001),
      },
      'en',
    ),
    {
      valid: false,
      fieldErrors: {
        name: 'max-length',
        email: 'max-length',
        company: 'max-length',
        message: 'max-length',
      },
    },
  );
});

test('rejects malformed email syntax while accepting a trimmed valid address', () => {
  requireImplementation();

  for (const email of ['', 'name', 'name@', '@example.com', 'name@example', 'a b@example.com']) {
    const result = validateInquiry(valuesWith('email', email), 'en');
    assert.equal(result.valid, false, `expected ${email || '<empty>'} to be rejected`);
    assert.equal(result.fieldErrors.email, email === '' ? 'required' : 'invalid-email');
  }

  assert.equal(validateInquiry(valuesWith('email', ' person@example.com '), 'en').valid, true);
});

test('excludes unsupported runtime fields from the normalized payload', () => {
  requireImplementation();

  const result = validateInquiry(
    { ...baseValues, extra: 'must not travel', file: { name: 'secret.txt' } },
    'es-AR',
  );

  assert.equal(result.valid, true);
  assert.deepEqual(Object.keys(result.payload).sort(), [
    'company',
    'email',
    'locale',
    'message',
    'name',
    'source',
  ]);
  assert.equal('extra' in result.payload, false);
  assert.equal('file' in result.payload, false);
});

test('preserves Unicode characters while applying the field ceiling', () => {
  requireImplementation();

  const result = validateInquiry(
    {
      name: 'José',
      email: 'jose@example.com',
      company: 'Compañía',
      message: '🙂'.repeat(4000),
    },
    'es-AR',
  );

  assert.deepEqual(result, {
    valid: true,
    payload: {
      name: 'José',
      email: 'jose@example.com',
      company: 'Compañía',
      message: '🙂'.repeat(4000),
      locale: 'es-AR',
      source: '/contacto/',
    },
  });

  const oversized = validateInquiry(
    {
      name: 'José',
      email: 'jose@example.com',
      company: 'Compañía',
      message: '🙂'.repeat(7000),
    },
    'es-AR',
  );
  assert.equal(oversized.valid, false);
  assert.equal(oversized.fieldErrors.message, 'max-length');
});

test('rejects an unsupported locale instead of fabricating a source binding', () => {
  requireImplementation();

  assert.deepEqual(validateInquiry(baseValues, 'fr'), {
    valid: false,
    fieldErrors: {},
  });
});

const REQUEST_BYTE_LIMIT = 24 * 1024;
const jsonBytes = (value) => new TextEncoder().encode(JSON.stringify(value)).byteLength;

test('counts Unicode code points, not UTF-16 units, at every limit', () => {
  requireImplementation();
  // U+1F600 is two UTF-16 units; the native maxlength is twice the code-point limit for exactly this reason.
  const limits = { name: 100, email: 254, company: 120, message: 4000 };
  for (const field of ['name', 'company', 'message']) {
    const atLimit = validateInquiry(valuesWith(field, '😀'.repeat(limits[field])), 'en');
    assert.equal(atLimit.valid, true, `${field} at ${limits[field]} code points`);
    assert.equal([...atLimit.payload[field]].length, limits[field]);
    assert.equal(atLimit.payload[field].length, limits[field] * 2, 'the payload keeps every character unclipped');

    const overLimit = validateInquiry(valuesWith(field, '😀'.repeat(limits[field] + 1)), 'en');
    assert.deepEqual(overLimit, { valid: false, fieldErrors: { [field]: 'max-length' } }, `${field} over by one code point`);
  }
});

test('counts a joined emoji sequence as every code point it contains', () => {
  requireImplementation();
  const family = '👨‍👩‍👧‍👦'; // four people and three zero-width joiners: seven code points
  assert.equal([...family].length, 7);
  assert.equal(validateInquiry(valuesWith('name', family.repeat(14)), 'en').valid, true, '98 code points');
  assert.deepEqual(validateInquiry(valuesWith('name', family.repeat(15)), 'en'), { valid: false, fieldErrors: { name: 'max-length' } }, '105 code points');
});

test('keeps an email whose local part is exactly 254 code points of non-BMP letters', () => {
  requireImplementation();
  const local = '𝒳'.repeat(250);
  const email = `${local}@b.c`;
  assert.equal([...email].length, 254);
  assert.equal(validateInquiry(valuesWith('email', email), 'en').valid, true);
  assert.deepEqual(validateInquiry(valuesWith('email', `𝒳${email}`), 'en'), { valid: false, fieldErrors: { email: 'max-length' } });
});

test('counts a multiline message by code point and preserves its inner line breaks', () => {
  requireImplementation();
  const unix = validateInquiry(valuesWith('message', `\n\n${'a\n'.repeat(1999)}a\n\n`), 'en');
  assert.equal(unix.valid, true);
  assert.equal([...unix.payload.message].length, 3999);
  assert.equal(unix.payload.message.startsWith('a\na'), true, 'surrounding blank lines are trimmed');

  const windows = validateInquiry(valuesWith('message', `${'a\r\n'.repeat(1333)}a`), 'en');
  assert.equal(windows.valid, true);
  assert.equal([...windows.payload.message].length, 4000, 'CRLF counts as two characters');
  assert.equal(windows.payload.message.includes('\r\n'), true, 'inner CRLF is not rewritten');

  const over = validateInquiry(valuesWith('message', `${'a\r\n'.repeat(1334)}a`), 'en');
  assert.deepEqual(over, { valid: false, fieldErrors: { message: 'max-length' } });
});

test('a message of only line breaks and spaces is required, not valid', () => {
  requireImplementation();
  assert.deepEqual(validateInquiry(valuesWith('message', ' \n\r\n\t    '), 'en'), {
    valid: false,
    fieldErrors: { message: 'required' },
  });
});

test('a lone surrogate counts as one character and never throws', () => {
  requireImplementation();
  const result = validateInquiry(valuesWith('name', `Ada\uD800`), 'en');
  assert.equal(result.valid, true);
  assert.equal([...result.payload.name].length, 4);
});

test('the 24 KiB serialized ceiling is exact in bytes and independent of character counts', () => {
  requireImplementation();
  // Control characters cost six JSON bytes each, so these fields stay inside every character limit.
  const control = '\u0001';
  const fixed = {
    name: control.repeat(100),
    email: 'ada@example.com',
    company: control.repeat(120),
  };
  const payloadFor = (message) => ({ ...fixed, message, locale: 'en', source: '/en/contact/' });
  const baseline = jsonBytes(payloadFor('a'.repeat(4000)));
  const wanted = REQUEST_BYTE_LIMIT - baseline;
  const controls = Math.floor(wanted / 5);
  const accents = wanted % 5; // each accented letter adds one byte over an ASCII letter
  assert.ok(controls >= 0 && controls + accents <= 4000, 'the fixture must fit the message limit');

  const message = control.repeat(controls) + 'é'.repeat(accents) + 'a'.repeat(4000 - controls - accents);
  assert.equal([...message].length, 4000);
  assert.equal(jsonBytes(payloadFor(message)), REQUEST_BYTE_LIMIT);
  assert.equal(validateInquiry({ ...fixed, message }, 'en').valid, true, 'exactly 24 KiB is accepted');

  const oneByteMore = control.repeat(controls) + 'é'.repeat(accents + 1) + 'a'.repeat(4000 - controls - accents - 1);
  assert.equal(jsonBytes(payloadFor(oneByteMore)), REQUEST_BYTE_LIMIT + 1);
  assert.deepEqual(validateInquiry({ ...fixed, message: oneByteMore }, 'en'), {
    valid: false,
    fieldErrors: { message: 'request-too-large' },
  });
});

test('character limits are reported before the byte ceiling', () => {
  requireImplementation();
  const result = validateInquiry(valuesWith('message', '\u0001'.repeat(4001)), 'en');
  assert.deepEqual(result, { valid: false, fieldErrors: { message: 'max-length' } });
});

test('an unsupported locale never yields a payload', () => {
  requireImplementation();
  for (const locale of ['es', 'fr', '', undefined, null, 'EN']) {
    const result = validateInquiry(baseValues, locale);
    assert.equal(result.valid, false, String(locale));
  }
});

test('non-string field values are required, never coerced', () => {
  requireImplementation();
  const result = validateInquiry({ name: 42, email: null, company: { toString: () => 'x' }, message: ['a'] }, 'en');
  assert.deepEqual(result, { valid: false, fieldErrors: { name: 'required', email: 'required', message: 'required' } });
});
