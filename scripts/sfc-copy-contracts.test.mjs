import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSfcCopyContracts } from './sfc-copy-contracts.mjs';

test('all four canonical bounded copy fences exactly match their typed exports', async () => {
  const result = await checkSfcCopyContracts();
  assert.deepEqual(result.mismatches, []);
  assert.equal(result.checked.length, 4);
});

test('copy contract rejects altered paragraph, link, order, or missing locale fence', async () => {
  const result = await checkSfcCopyContracts({
    readFile: async (path, encoding) => {
      const source = await import('node:fs/promises').then(({ readFile }) => readFile(path, encoding));
      if (String(path).endsWith('terms-and-conditions.md')) {
        return source.replace('"title": "Términos y condiciones"', '"title": "Términos alterados"');
      }
      return source.replace('<!-- SFC-PUBLIC-COPY-EN:START -->', '<!-- missing fence -->');
    },
  });
  assert.equal(result.mismatches.length, 2);
});
