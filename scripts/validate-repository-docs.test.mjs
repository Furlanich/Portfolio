import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateRepository } from './validate-repository-docs.mjs';

async function createFixture({ valid = true, defect } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'repository-docs-'));
  await mkdir(path.join(root, 'docs'), { recursive: true });
  await mkdir(path.join(root, '.agents', 'skills', 'sample-skill'), { recursive: true });

  const guide = `---
id: GUIDE
status: PROPOSED
related:
  - ROOT
---

# Guide

## Details

The guide links back to the [root](../README.md#root-document).
`;
  const rootDocument = `---
id: ROOT
status: APPROVED
related:
  - GUIDE
---

# Root document

See the [guide](docs/guide.md#guide).
`;
  const skill = `---
name: sample-skill
description: Use when validating a sample repository.
---

# Sample skill
`;

  await writeFile(path.join(root, 'README.md'), rootDocument);
  await writeFile(path.join(root, 'docs', 'guide.md'), guide);
  await writeFile(path.join(root, '.agents', 'skills', 'sample-skill', 'SKILL.md'), skill);

  if (!valid) {
    const defects = {
      'missing file': async () => {
        await writeFile(path.join(root, 'README.md'), `${rootDocument}\n[missing](docs/missing.md)\n`);
      },
      'missing anchor': async () => {
        await writeFile(path.join(root, 'README.md'), `${rootDocument}\n[missing](docs/guide.md#missing-anchor)\n`);
      },
      'duplicate document id': async () => {
        await writeFile(path.join(root, 'docs', 'duplicate.md'), guide.replace('GUIDE', 'ROOT'));
      },
      'unresolved related id': async () => {
        await writeFile(path.join(root, 'docs', 'guide.md'), guide.replace('  - ROOT', '  - UNKNOWN'));
      },
      'invalid status': async () => {
        await writeFile(path.join(root, 'docs', 'guide.md'), guide.replace('status: PROPOSED', 'status: UNKNOWN'));
      },
      'duplicate heading': async () => {
        await writeFile(path.join(root, 'docs', 'guide.md'), `${guide}\n## Details\n`);
      },
      skill: async () => {
        await writeFile(
          path.join(root, '.agents', 'skills', 'sample-skill', 'SKILL.md'),
          skill.replace('name: sample-skill', 'name: Sample Skill').replace('Use when', 'Maintain')
        );
      }
    };
    await defects[defect]();
  }

  return root;
}

test('accepts coherent documents and repository Skills', async () => {
  const root = await createFixture({ valid: true });
  try {
    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports a missing relative Markdown file', async () => {
  const root = await createFixture({ valid: false, defect: 'missing file' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /missing file/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports a missing Markdown anchor', async () => {
  const root = await createFixture({ valid: false, defect: 'missing anchor' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /missing anchor/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports duplicate document IDs', async () => {
  const root = await createFixture({ valid: false, defect: 'duplicate document id' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /duplicate document id/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports unresolved related IDs', async () => {
  const root = await createFixture({ valid: false, defect: 'unresolved related id' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /unresolved related id/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports invalid governance statuses', async () => {
  const root = await createFixture({ valid: false, defect: 'invalid status' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /invalid status/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports duplicate normalized headings', async () => {
  const root = await createFixture({ valid: false, defect: 'duplicate heading' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /duplicate heading/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports malformed Skill metadata', async () => {
  const root = await createFixture({ valid: false, defect: 'skill' });
  try {
    assert.match((await validateRepository(root)).join('\n'), /skill/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
