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
