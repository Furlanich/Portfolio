import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateVendoredSkills } from './validate-vendored-skills.mjs';

const knownSkillHash = '3088e5b60779a95389e4ed08d2ecee6eaac2311c590dab3f2e4beb3090a54f00';
const pinnedRevision = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

async function createRoot(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'furlanich-vendored-skills-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, '.agents', 'skills'), { recursive: true });
  return root;
}

async function writeLock(root, skills) {
  await writeFile(
    path.join(root, '.agents', 'skills', 'vendor-lock.json'),
    `${JSON.stringify({ schemaVersion: 1, skills }, null, 2)}\n`,
  );
}

function validSkill(overrides = {}) {
  return {
    name: 'example-skill',
    source: 'https://github.com/example/skills',
    revision: pinnedRevision,
    license: 'MIT',
    files: [
      {
        path: '.agents/skills/example-skill/SKILL.md',
        sha256: knownSkillHash,
      },
    ],
    ...overrides,
  };
}

test('accepts pinned project-local vendored skills with matching hashes', async (t) => {
  const root = await createRoot(t);
  await mkdir(path.join(root, '.agents', 'skills', 'example-skill'), { recursive: true });
  await writeFile(path.join(root, '.agents', 'skills', 'example-skill', 'SKILL.md'), 'skill\n');
  await writeLock(root, [validSkill()]);

  assert.deepEqual(await validateVendoredSkills(root), []);
});

test('reports missing files and provenance or integrity drift', async (t) => {
  const root = await createRoot(t);
  await mkdir(path.join(root, '.agents', 'skills', 'drifted-skill'), { recursive: true });
  await writeFile(path.join(root, '.agents', 'skills', 'drifted-skill', 'SKILL.md'), 'changed\n');
  await writeLock(root, [
    validSkill({
      name: 'drifted-skill',
      revision: 'main',
      files: [
        {
          path: '.agents/skills/drifted-skill/SKILL.md',
          sha256: knownSkillHash,
        },
        {
          path: '.agents/skills/missing-skill/SKILL.md',
          sha256: knownSkillHash,
        },
        {
          path: 'README.md',
          sha256: 'not-a-sha256',
        },
      ],
    }),
  ]);

  const failures = await validateVendoredSkills(root);
  const output = failures.join('\n');

  assert.match(output, /missing vendored file/i);
  assert.match(output, /revision/i);
  assert.match(output, /hash mismatch/i);
  assert.match(output, /sha-256/i);
  assert.match(output, /project-local/i);
});
