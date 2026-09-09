import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lockPath = path.join('.agents', 'skills', 'vendor-lock.json');
const commitPattern = /^[0-9a-f]{40}$/;
const sha256Pattern = /^[0-9a-f]{64}$/;

function isProjectLocalSkillPath(skillName, filePath) {
  if (typeof filePath !== 'string' || filePath.includes('\\')) return false;
  const normalized = path.posix.normalize(filePath);
  return normalized === filePath && normalized.startsWith(`.agents/skills/${skillName}/`);
}

async function readLock(rootDir) {
  const absoluteLockPath = path.join(rootDir, lockPath);
  try {
    return JSON.parse(await readFile(absoluteLockPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return { error: `${lockPath}: missing vendor lock` };
    return { error: `${lockPath}: invalid vendor lock (${error.message})` };
  }
}

export async function validateVendoredSkills(rootDir) {
  const root = path.resolve(rootDir);
  const lock = await readLock(root);
  if (lock.error) return [lock.error];

  const failures = [];
  if (lock.schemaVersion !== 1) failures.push(`${lockPath}: unsupported schema version`);
  if (!Array.isArray(lock.skills)) return [...failures, `${lockPath}: skills must be an array`].sort();

  const seenNames = new Set();
  for (const skill of lock.skills) {
    const name = typeof skill?.name === 'string' ? skill.name : '(unnamed)';
    if (seenNames.has(name)) failures.push(`${lockPath}: duplicate vendored skill ${name}`);
    seenNames.add(name);

    if (typeof skill?.source !== 'string' || !/^https:\/\/github\.com\//.test(skill.source)) {
      failures.push(`${name}: source must be an authoritative GitHub URL`);
    }
    if (!commitPattern.test(skill?.revision ?? '')) {
      failures.push(`${name}: revision must be a pinned 40-character Git commit`);
    }
    if (typeof skill?.license !== 'string' || !skill.license.trim()) {
      failures.push(`${name}: license is required`);
    }
    if (!Array.isArray(skill?.files) || skill.files.length === 0) {
      failures.push(`${name}: at least one vendored file is required`);
      continue;
    }

    for (const file of skill.files) {
      const filePath = file?.path ?? '(missing path)';
      if (!isProjectLocalSkillPath(name, filePath)) {
        failures.push(`${name}: vendored path must be project-local under .agents/skills/${name}/ (${filePath})`);
      }
      if (!sha256Pattern.test(file?.sha256 ?? '')) {
        failures.push(`${name}: invalid SHA-256 for ${filePath}`);
      }
      if (typeof filePath !== 'string') continue;

      const absolutePath = path.resolve(root, ...filePath.split('/'));
      try {
        const source = await readFile(absolutePath);
        if (sha256Pattern.test(file?.sha256 ?? '')) {
          const actualHash = createHash('sha256').update(Buffer.from(source.toString('utf8').replace(/\r\n?/g, '\n'))).digest('hex');
          if (actualHash !== file.sha256) {
            failures.push(`${name}: hash mismatch for ${filePath}`);
          }
        }
      } catch (error) {
        if (error.code === 'ENOENT') failures.push(`${name}: missing vendored file ${filePath}`);
        else failures.push(`${name}: could not read ${filePath} (${error.message})`);
      }
    }
  }

  return failures.sort();
}

async function main() {
  const failures = await validateVendoredSkills(process.cwd());
  if (failures.length > 0) {
    process.stdout.write(`Vendored Skill validation failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
    process.exitCode = 1;
    return;
  }

  const lock = await readLock(process.cwd());
  const fileCount = lock.skills.reduce((count, skill) => count + skill.files.length, 0);
  process.stdout.write(`Vendored Skill validation passed: ${lock.skills.length} Skills, ${fileCount} files.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stdout.write(`Vendored Skill validation failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
