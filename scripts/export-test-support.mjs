// PLAN-SFC-V1 Task 2: shared fixture infrastructure for the page-owner export tests
// ({studio,founder,contact}-export.test.mjs). Each owner builds a small fixture export for its own pair of
// routes and drives the real verifier (`scripts/verify-static-export.mjs`) against it through
// STATIC_EXPORT_DIR, so a page packet needs no edit to another page's requirements or to the verifier.
// Nothing here builds the site or opens a network connection.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const verifierPath = fileURLToPath(new URL('./verify-static-export.mjs', import.meta.url));

/**
 * Writes `files` (export-relative path to file content) into a fresh temporary directory.
 * Call `cleanup()` when done; it is safe to call twice.
 */
export function createExportFixture(files = {}) {
  const directory = mkdtempSync(path.join(tmpdir(), 'sfc-export-'));
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(directory, name);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  return { directory, cleanup: () => rmSync(directory, { recursive: true, force: true }) };
}

/**
 * Runs the real verifier against a fixture export and returns `{ status, output }`, where `output` is the
 * verifier's combined stdout and stderr. Pass either `files` (a throwaway fixture is created and removed)
 * or an existing `directory`. The verifier reports every missing route, so an owner asserts only on the
 * messages for its own pair. `basePath` mirrors NEXT_PUBLIC_BASE_PATH ('' for the root export).
 */
export function runVerifier({ files, directory, basePath = '', env = {} } = {}) {
  const fixture = directory ? null : createExportFixture(files);
  try {
    const result = spawnSync(process.execPath, [verifierPath], {
      env: { ...process.env, ...env, STATIC_EXPORT_DIR: directory ?? fixture.directory, NEXT_PUBLIC_BASE_PATH: basePath },
      encoding: 'utf8',
    });
    return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
  } finally {
    fixture?.cleanup();
  }
}
