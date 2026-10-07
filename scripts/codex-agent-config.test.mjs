import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readText = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8').then((text) => text.replace(/\r\n/g, '\n'));

// The project files are simple key = value TOML. Read them as text so the
// suite needs no TOML dependency.
function tomlSection(source, name) {
  const header = source.match(new RegExp(`^\\[${name}\\]\\s*$`, 'm'));
  assert.ok(header, `[${name}] section exists`);
  const rest = source.slice(header.index + header[0].length);
  const next = rest.search(/^\[/m);
  return next < 0 ? rest : rest.slice(0, next);
}

function tomlValue(section, key) {
  const match = section.match(new RegExp(`^${key}\\s*=\\s*(.+?)\\s*(?:#.*)?$`, 'm'));
  return match ? match[1].trim() : undefined;
}

test('Codex project config caps concurrent agent threads at 3', async () => {
  const agents = tomlSection(await readText('.codex/config.toml'), 'agents');
  assert.equal(tomlValue(agents, 'max_concurrent_threads_per_session'), '3');
});

test('Codex ADE specialist role declares an explicit model and medium effort', async () => {
  const role = await readText('.codex/agents/ade-readonly-specialist.toml');
  assert.match(tomlValue(role, 'name') ?? '', /^"ade-readonly-specialist"$/);
  assert.match(tomlValue(role, 'model') ?? '', /^"[a-z0-9][a-z0-9.-]*"$/);
  assert.equal(tomlValue(role, 'model_reasoning_effort'), '"medium"');
});

test('Codex ADE specialist role forbids spawning and edits in its instructions', async () => {
  const role = await readText('.codex/agents/ade-readonly-specialist.toml');
  const instructions = role.match(/developer_instructions\s*=\s*"""([\s\S]*?)"""/)?.[1] ?? '';
  assert.match(instructions, /never spawn/i);
  assert.match(instructions, /never edit/i);
  assert.match(instructions, /read-only/i);
});

test('Codex project config does not claim a nested-delegation cap that Codex ignores', async () => {
  // agents.max_depth is V1-only; the multi-agent v2 backend ignores it. Probed
  // on 2026-10-07 with Codex 0.160.1. Add a depth key only after a new probe
  // shows it is enforced, and record the evidence in GOV-AGENT-USAGE.
  const config = await readText('.codex/config.toml');
  assert.doesNotMatch(config, /^\s*max_depth\s*=/m);
});
