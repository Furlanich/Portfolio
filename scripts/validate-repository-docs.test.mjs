import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateRepository } from './validate-repository-docs.mjs';

async function createFixture({
  valid = true,
  defect,
  sameFileAnchor = false,
  inlineCodeLink = false,
  relatedHeadingId = false
} = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'repository-docs-'));
  await mkdir(path.join(root, 'docs'), { recursive: true });
  await mkdir(path.join(root, '.agents', 'skills', 'sample-skill'), { recursive: true });

  const guide = `---
id: GUIDE
status: PROPOSED
related:
  - ROOT
${relatedHeadingId ? '  - SECTION-ID\n' : ''}---

# Guide

## Details

${relatedHeadingId ? '## SECTION-ID\n' : ''}

The guide links back to the [root](../README.md#root-document).
${sameFileAnchor ? 'The [details](#details) are in this document.' : ''}
${inlineCodeLink ? 'The literal `[missing](docs/not-real.md)` is inline code.' : ''}
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

test('ignores Git worktree checkouts during repository document discovery', async () => {
  const root = await createFixture({ valid: true });
  try {
    await mkdir(path.join(root, '.worktrees', 'linked-checkout'), { recursive: true });
    await writeFile(
      path.join(root, '.worktrees', 'linked-checkout', 'duplicate.md'),
      `---\nid: ROOT\nstatus: APPROVED\n---\n\n# Root document\n`,
    );

    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ignores Claude Code worktree checkouts during repository document discovery', async () => {
  const root = await createFixture({ valid: true });
  try {
    await mkdir(path.join(root, '.claude', 'worktrees', 'linked-checkout'), { recursive: true });
    await writeFile(
      path.join(root, '.claude', 'worktrees', 'linked-checkout', 'duplicate.md'),
      `---\nid: ROOT\nstatus: APPROVED\n---\n\n# Root document\n`,
    );

    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('keeps validating tracked Claude Code documents outside worktrees', async () => {
  const root = await createFixture({ valid: true });
  try {
    await mkdir(path.join(root, '.claude', 'agents'), { recursive: true });
    await writeFile(
      path.join(root, '.claude', 'agents', 'reviewer.md'),
      `---\nid: ROOT\nstatus: APPROVED\n---\n\n# Reviewer\n`,
    );

    assert.match((await validateRepository(root)).join('\n'), /duplicate document id "ROOT"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('preserves upstream descriptions for integrity-locked vendored Skills', async () => {
  const root = await createFixture({ valid: true });
  try {
    await writeFile(
      path.join(root, '.agents', 'skills', 'sample-skill', 'SKILL.md'),
      `---
name: sample-skill
description: Upstream metadata preserved byte-for-byte.
metadata:
  version: 1.0.0
---

# Sample skill
`,
    );
    await writeFile(
      path.join(root, '.agents', 'skills', 'sample-skill', 'REFERENCE.md'),
      '# Upstream reference\n\n## Repeated section\n\nFirst.\n\n## Repeated section\n\nSecond.\n',
    );
    await writeFile(
      path.join(root, '.agents', 'skills', 'vendor-lock.json'),
      `${JSON.stringify({
        schemaVersion: 1,
        skills: [{
          name: 'sample-skill',
          source: 'https://github.com/example/skills',
          revision: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          license: 'MIT',
          files: [{
            path: '.agents/skills/sample-skill/SKILL.md',
            sha256: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          }, {
            path: '.agents/skills/sample-skill/REFERENCE.md',
            sha256: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
          }],
        }],
      }, null, 2)}\n`,
    );

    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('resolves same-file Markdown anchors', async () => {
  const root = await createFixture({ valid: true, sameFileAnchor: true });
  try {
    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ignores Markdown-looking links inside inline code', async () => {
  const root = await createFixture({ valid: true, inlineCodeLink: true });
  try {
    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('resolves related IDs declared in stable headings', async () => {
  const root = await createFixture({ valid: true, relatedHeadingId: true });
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

const SINGLE_AGENT_BLOCK = `**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0`;

function boundedBlock({ allowed = '2', responsibilities = 2, overrides = {} } = {}) {
  const fields = {
    'Single-agent insufficiency': 'Two unrelated areas must be read in parallel.',
    'Cost justification': 'Reading both areas sequentially costs more than two small readers.',
    'Isolation / File Boundaries': 'Read-only; docs/a and docs/b respectively.',
    Nesting: 'forbidden',
    ...overrides
  };
  const items = Array.from({ length: responsibilities }, (_, index) => `  ${index + 1}. Read area ${index + 1} (sonnet, medium)`);
  return [
    '**Execution**',
    '- Execution Mode: BOUNDED_MULTI_AGENT',
    '- Work Class: RESEARCH',
    `- Subagents Allowed: ${allowed}`,
    `- Single-agent insufficiency: ${fields['Single-agent insufficiency']}`,
    `- Cost justification: ${fields['Cost justification']}`,
    '- Subagent Responsibilities:',
    ...items,
    `- Isolation / File Boundaries: ${fields['Isolation / File Boundaries']}`,
    `- Nesting: ${fields.Nesting}`
  ].join('\n');
}

async function writePlan(root, { id = 'PLAN-SAMPLE', planStatus = 'ACTIVE', policy = 'ADE-AGENT-USAGE-V1', tasks = [SINGLE_AGENT_BLOCK] } = {}) {
  await mkdir(path.join(root, 'docs', 'plans', 'active'), { recursive: true });
  const sections = tasks.map((block, index) => (
    `## Task ${index + 1} / PR ${index + 1} - Sample\n\n${block ?? ''}\n\n- [ ] **Step 1:** Do the work.\n`
  ));
  await writeFile(
    path.join(root, 'docs', 'plans', 'active', 'sample.md'),
    `---
id: ${id}
type: execution-plan
status: APPROVED
plan_status: ${planStatus}
${policy ? `execution_policy: ${policy}\n` : ''}---

# Sample plan

${sections.join('\n')}`
  );
}

async function violationsForPlan(options) {
  const root = await createFixture({ valid: true });
  try {
    await writePlan(root, options);
    return (await validateRepository(root)).join('\n');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('accepts an active plan whose tasks declare SINGLE_AGENT execution', async () => {
  assert.equal(await violationsForPlan({ tasks: [SINGLE_AGENT_BLOCK, SINGLE_AGENT_BLOCK] }), '');
});

test('accepts a valid BOUNDED_MULTI_AGENT task with two responsibilities', async () => {
  assert.equal(await violationsForPlan({ tasks: [boundedBlock()] }), '');
});

test('reports an active plan without the execution policy marker', async () => {
  assert.match(await violationsForPlan({ policy: '' }), /execution_policy must be "ADE-AGENT-USAGE-V1"/);
});

test('reports a task without an Execution block', async () => {
  assert.match(await violationsForPlan({ tasks: [SINGLE_AGENT_BLOCK, null] }), /Task 2: missing Execution block/);
});

test('reports SINGLE_AGENT with nonzero Subagents Allowed', async () => {
  const block = SINGLE_AGENT_BLOCK.replace('Subagents Allowed: 0', 'Subagents Allowed: 1');
  assert.match(await violationsForPlan({ tasks: [block] }), /Task 1: SINGLE_AGENT requires Subagents Allowed: 0/);
});

test('reports BOUNDED_MULTI_AGENT above three subagents', async () => {
  assert.match(
    await violationsForPlan({ tasks: [boundedBlock({ allowed: '4', responsibilities: 4 })] }),
    /Task 1: Subagents Allowed must be 1-3/
  );
});

test('reports BOUNDED_MULTI_AGENT missing justification fields', async () => {
  assert.match(
    await violationsForPlan({ tasks: [boundedBlock({ overrides: { 'Cost justification': '...' } })] }),
    /Task 1: Cost justification is required/
  );
});

test('reports responsibility count that differs from Subagents Allowed', async () => {
  assert.match(
    await violationsForPlan({ tasks: [boundedBlock({ allowed: '2', responsibilities: 1 })] }),
    /Task 1: expected 2 Subagent Responsibilities, found 1/
  );
});

test('exempts completed and legacy active plans', async () => {
  assert.equal(await violationsForPlan({ planStatus: 'COMPLETED', policy: '', tasks: [null] }), '');
  assert.equal(await violationsForPlan({ id: 'PLAN-SPF-V1', policy: '', tasks: [null] }), '');
});

test('keeps the plan template defaulting to SINGLE_AGENT', async () => {
  const template = await readFile(new URL('../docs/plans/template.md', import.meta.url), 'utf8');
  assert.match(template, /Execution Mode: SINGLE_AGENT/);
  assert.match(template, /Subagents Allowed: 0/);
  assert.match(template, /execution_policy: ADE-AGENT-USAGE-V1/);
});

test('ignores local Superpowers orchestration ledgers during discovery', async () => {
  const root = await createFixture({ valid: true });
  try {
    await mkdir(path.join(root, '.superpowers', 'sdd', 'sample'), { recursive: true });
    await writeFile(
      path.join(root, '.superpowers', 'sdd', 'sample', 'task-1-brief.md'),
      '# Brief\n\nSee [missing](docs/not-real.md).\n'
    );
    assert.deepEqual(await validateRepository(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
