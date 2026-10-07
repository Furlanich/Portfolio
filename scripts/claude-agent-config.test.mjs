import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readText = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const readSettings = async () => JSON.parse(await readText('.claude/settings.json'));

function readFrontMatter(source) {
  const match = source.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'agent file has front matter');
  return Object.fromEntries(
    match[1].split('\n').map((line) => {
      const [key, ...rest] = line.split(':');
      return [key.trim(), rest.join(':').trim()];
    })
  );
}

test('Claude project settings cap subagent spawn depth at 1', async () => {
  assert.equal((await readSettings()).env?.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH, '1');
});

test('Claude project settings cap concurrent subagents at 3', async () => {
  assert.equal((await readSettings()).env?.CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS, '3');
});

test('Claude project settings default subagents to sonnet without forcing it', async () => {
  const { env } = await readSettings();
  assert.equal(env?.CLAUDE_CODE_SUBAGENT_MODEL, 'sonnet');
  assert.equal(env?.CLAUDE_CODE_SUBAGENT_MODEL_FORCE, undefined);
});

test('Claude project settings gate every Agent spawn behind ask', async () => {
  assert.deepEqual((await readSettings()).permissions?.ask, ['Agent']);
});

test('Claude project settings deny opus and fable subagent tiers and codex rescue', async () => {
  const deny = (await readSettings()).permissions?.deny ?? [];
  for (const rule of ['Agent(model:opus)', 'Agent(model:fable)', 'Agent(codex:codex-rescue)']) {
    assert.ok(deny.includes(rule), `deny includes ${rule}`);
  }
});

test('Claude project settings preserve the brag plugin', async () => {
  assert.equal((await readSettings()).enabledPlugins?.['brag@brag'], true);
});

test('ADE specialist agent is read-only, cannot spawn, and has at most 25 turns', async () => {
  const source = await readText('.claude/agents/ade-readonly-specialist.md');
  const meta = readFrontMatter(source);
  assert.equal(meta.name, 'ade-readonly-specialist');
  assert.deepEqual(meta.tools.split(',').map((tool) => tool.trim()).sort(), ['Glob', 'Grep', 'Read']);
  assert.equal(meta.model, 'sonnet');
  assert.equal(meta.effort, 'medium');
  assert.ok(Number(meta.maxTurns) > 0 && Number(meta.maxTurns) <= 25);
  assert.match(source, /never spawn/i);
});
