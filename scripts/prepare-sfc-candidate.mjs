#!/usr/bin/env node
// PLAN-SFC-V1 Task 2: the reproducible QA candidate. Applies a committed patch to a disposable checkout so
// browser tests can run the commercial inquiry mode or the live-graph policy before either is committed,
// and restores the checkout afterwards. A candidate is never deployable: it carries a QA marker release id,
// and `verify-clean` (run by the validate job) fails when that marker or an unrestored candidate is present.
//
//   node scripts/prepare-sfc-candidate.mjs apply --kind=commercial|runtime|combined [--expect-head=<sha>]
//   node scripts/prepare-sfc-candidate.mjs restore [--kind=<the kind that was applied>]
//   node scripts/prepare-sfc-candidate.mjs verify-clean
//
// No network access, no environment-driven behavior and no persistence outside the git directory.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const QA_MARKER = 'QA-CANDIDATE-NOT-FOR-DEPLOYMENT';

/** Patch files, in application order, for each candidate kind. */
export const KINDS = Object.freeze({
  commercial: Object.freeze(['commercial-release.patch']),
  runtime: Object.freeze(['live-policy.patch']),
  combined: Object.freeze(['commercial-release.patch', 'live-policy.patch']),
});

const SCHEMA_VERSION = 1;
const STATE_FILE = 'sfc-candidate.json';
/** The marker must never reach these shipped trees. */
const APPLICATION_PATHS = ['app', 'components', 'lib', 'data', 'public'];

const defaultRoot = fileURLToPath(new URL('..', import.meta.url));

function git(cwd, args, input) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', input });
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: (result.stderr ?? '').trim() };
}

const fail = (message) => ({ ok: false, message });
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

/**
 * A patch is hashed and applied as LF text read into memory. A Windows checkout may convert the committed
 * file to CRLF, which `git apply` would reject; the normalized text is what was reviewed and recorded.
 */
function loadPatch(patchDir, name) {
  const file = path.join(patchDir, name);
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  return { name, file, text, sha256: sha256(text) };
}

function readPatches(patchDir, kind) {
  const names = KINDS[kind];
  if (!names) return { error: `Unknown kind "${String(kind)}" (expected commercial, runtime or combined)` };
  const patches = [];
  for (const name of names) {
    if (!existsSync(path.join(patchDir, name))) return { error: `Missing candidate patch ${name} in ${patchDir}` };
    patches.push(loadPatch(patchDir, name));
  }
  return { patches };
}

function statePathOf(repoRoot) {
  const result = git(repoRoot, ['rev-parse', '--absolute-git-dir']);
  return result.status === 0 ? path.join(result.stdout.trim(), STATE_FILE) : null;
}

function readState(statePath) {
  if (!statePath || !existsSync(statePath)) return null;
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    return { corrupt: true };
  }
}

/** Reverses already-applied patches, newest first. Used to leave no partial application behind. */
function reverse(repoRoot, patches) {
  for (const patch of [...patches].reverse()) git(repoRoot, ['apply', '-R', '-'], patch.text);
}

function verifyClean(repoRoot, statePath) {
  const state = readState(statePath);
  if (state) return fail(`A QA candidate (${state.kind ?? 'unreadable record'}) is still applied: restore it first.`);
  const found = git(repoRoot, ['grep', '-l', '-F', QA_MARKER, '--', ...APPLICATION_PATHS]);
  if (found.status === 0) return fail(`${QA_MARKER} appears in application source: ${found.stdout.trim().split('\n').join(', ')}`);
  return { ok: true, message: 'No QA candidate is applied and no QA marker is in application source.' };
}

function apply({ repoRoot, patchDir, kind, expectHead, statePath }) {
  const { patches, error } = readPatches(patchDir, kind);
  if (error) return fail(error);
  if (readState(statePath)) return fail('A QA candidate is already applied: restore it before applying another.');

  const head = git(repoRoot, ['rev-parse', 'HEAD']);
  if (head.status !== 0) return fail(`Cannot read HEAD: ${head.stderr}`);
  const headSha = head.stdout.trim();
  if (expectHead && expectHead !== headSha) return fail(`HEAD is ${headSha}, expected ${expectHead}.`);

  const dirty = git(repoRoot, ['status', '--porcelain', '--untracked-files=no']);
  if (dirty.stdout.trim()) return fail('The working tree has tracked changes; use a clean disposable checkout.');

  for (const patch of patches) {
    const check = git(repoRoot, ['apply', '--check', '-'], patch.text);
    if (check.status !== 0) return fail(`${patch.name} does not apply to this checkout: ${check.stderr}`);
  }
  const applied = [];
  for (const patch of patches) {
    const result = git(repoRoot, ['apply', '-'], patch.text);
    if (result.status !== 0) {
      reverse(repoRoot, applied);
      return fail(`${patch.name} failed to apply and was rolled back: ${result.stderr}`);
    }
    applied.push(patch);
  }

  const record = {
    schemaVersion: SCHEMA_VERSION,
    kind,
    head: headSha,
    appliedAt: new Date().toISOString(),
    patches: patches.map(({ name, sha256: hash }) => ({ name, sha256: hash })),
  };
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(record, null, 2)}\n`);
  return { ok: true, message: `Applied ${kind} candidate at ${headSha}. Restore it with: node scripts/prepare-sfc-candidate.mjs restore --kind=${kind}`, record };
}

function restore({ repoRoot, patchDir, kind, statePath }) {
  const state = readState(statePath);
  if (!state) return fail('No QA candidate is applied.');
  if (state.corrupt || state.schemaVersion !== SCHEMA_VERSION || !KINDS[state.kind]) return fail('The candidate record is unreadable; restore the checkout manually.');
  if (kind && kind !== state.kind) return fail(`The applied candidate is "${state.kind}", not "${kind}".`);

  const patches = [];
  for (const entry of state.patches) {
    if (!existsSync(path.join(patchDir, entry.name))) return fail(`${entry.name} is missing; restore the checkout manually.`);
    const patch = loadPatch(patchDir, entry.name);
    if (patch.sha256 !== entry.sha256) return fail(`${entry.name} no longer matches the patch that was applied; restore the checkout manually.`);
    patches.push(patch);
  }
  for (const patch of [...patches].reverse()) {
    const check = git(repoRoot, ['apply', '-R', '--check', '-'], patch.text);
    if (check.status !== 0) return fail(`${patch.name} cannot be reversed (the target changed): ${check.stderr}`);
  }
  reverse(repoRoot, patches);
  rmSync(statePath, { force: true });
  return { ok: true, message: `Restored the ${state.kind} candidate.` };
}

/** Runs one command. Always returns `{ ok, message, record? }`; never throws for an expected refusal. */
export function runCandidate({ command, kind, repoRoot = defaultRoot, patchDir = path.join(repoRoot, 'tests', 'fixtures', 'sfc'), expectHead } = {}) {
  const statePath = statePathOf(repoRoot);
  if (!statePath) return fail(`${repoRoot} is not a git checkout.`);
  switch (command) {
    case 'apply':
      return apply({ repoRoot, patchDir, kind, expectHead, statePath });
    case 'restore':
      return restore({ repoRoot, patchDir, kind, statePath });
    case 'verify-clean':
      return verifyClean(repoRoot, statePath);
    default:
      return fail(`Unknown command "${String(command)}" (expected apply, restore or verify-clean).`);
  }
}

function flag(argv, name) {
  const prefix = `--${name}=`;
  return argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const result = runCandidate({ command: argv[0], kind: flag(argv, 'kind'), expectHead: flag(argv, 'expect-head') });
  (result.ok ? console.log : console.error)(result.message);
  process.exitCode = result.ok ? 0 : 1;
}
