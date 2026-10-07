---
id: GOV-AGENT-USAGE
type: engineering-governance
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-ADE-AGENT-USAGE
  - RFC-ADE-AGENT-USAGE-V1
  - PLAN-ADE-AGENT-USAGE-V1
  - PLAN-TEMPLATE
  - PLAN-SPF-V1
last_verified: 2026-10-07
---

# Agent usage

This is the owning record for how agents delegate work in the FURLANICH ADE (the Claude Code and Codex development environment). Decision: [ADR-ADE-AGENT-USAGE](../decisions/ade-agent-usage.md). Proposal history: [RFC-ADE-AGENT-USAGE-V1](../rfcs/ade-agent-usage-v1.md). Delivery: [PLAN-ADE-AGENT-USAGE-V1](../plans/active/ade-agent-usage-optimization-v1.md). `AGENTS.md` and the [engineering lifecycle](engineering-lifecycle.md) point here and do not repeat it.

## Invariants

- **I-1 Default.** One task = one primary agent. Every task is `SINGLE_AGENT` with `Subagents Allowed: 0` unless its plan block validly declares `BOUNDED_MULTI_AGENT`. An absent or invalid block means `SINGLE_AGENT`.
- **I-2 Never delegate:** file inspection, understanding a localized feature, implementing one page/section/endpoint, writing the task's own tests, running lint/typecheck/build/tests, routine review of one's own work, work touching the same files, or anything the primary agent can complete sequentially.
- **I-3 Exception ceiling.** `BOUNDED_MULTI_AGENT` allows 1–3 subagents per task, counted as **total spawns** over the task, not concurrent ones. Prefer fewer.
- **I-4 Mandatory justification:** subagent count; why single-agent is insufficient; each subagent's responsibility; file/workstream boundaries; why the parallelism is worth its token cost. Any field missing means the task stays `SINGLE_AGENT`.
- **I-5 No recursion.** Subagents never spawn. The primary agent integrates and runs the final validation.
- **I-6 Work classes.** See [Work classes](#work-classes).
- **I-7 Model economy.** A subagent names its model and effort. It never inherits the most capable session model by default.
- **I-8 Independent review is a gate, not a subagent.** The PR's independent reviewer is a separate top-level session (for example a fresh Codex session started through the `codex` plugin at its default model) that has not contributed to the PR. It does not count against the implementer's allowance. The implementer self-reviews inline and never spawns its own reviewer. The reviewer session may itself use `BOUNDED_MULTI_AGENT` with work class `REVIEW` when justified. No specific reviewer or implementer model is required; a plan may name one when its risk warrants it.
- **I-9 Task-level parallelism.** Independent tasks run concurrently as separate sessions in separate worktrees. They need disjoint write sets, as in the ADE v2 waves. Keep at most 3 concurrent task sessions per provider.
- **I-10 Precedence.** This policy outranks any Skill, plugin or harness instruction that asks for delegation. A Skill that cannot run inline records a degraded run instead of spawning.

## Work classes

| Class | Writes | Rule |
| --- | --- | --- |
| `IMPLEMENTATION` | Yes | Strictest. A writing subagent needs a disjoint write set and its own worktree. |
| `RESEARCH` | No | Read-only. Needs independent perspectives or unrelated areas. |
| `REVIEW` | No | Read-only. Needs independent perspectives or unrelated areas. |

## Execution block schema

Every task packet in a new active plan carries one `**Execution**` block. The [plan template](../plans/template.md) defaults to the first form; the docs validator enforces the schema once the template task merges.

```text
**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0
```

The exceptional form. Every field is required and must not be a placeholder:

```text
**Execution**
- Execution Mode: BOUNDED_MULTI_AGENT
- Work Class: RESEARCH
- Subagents Allowed: 2
- Single-agent insufficiency: <why sequential work by the primary agent is materially worse>
- Cost justification: <why parallelism repays its extra tokens/credits>
- Subagent Responsibilities:
  1. <independent responsibility, model, effort>
  2. <independent responsibility, model, effort>
- Isolation / File Boundaries: <disjoint paths or read-only scope per subagent; worktree per writer>
- Nesting: forbidden
```

## Orchestration

An orchestrator is a **coordination-only** session. It runs wave checkpoints, keeps the ledger and hands out task packets. It does not spawn a task's implementer as a subagent; each task starts as its own top-level session in its own worktree on a `codex/` branch (decision D1). Implementers execute plans inline with `superpowers:executing-plans` or the Codex equivalent. Each PR gets an independent review session (I-8) and a human merge.

## Models

Implementation sessions use Claude Sonnet unless a plan names another model with a reason. The independent reviewer is a fresh session that has not contributed to the PR. Reviews run through the `codex` plugin at the model the plugin resolves, because the plugin cannot select the GPT-6 Luna or GPT-6.1 Sol models that earlier plans named. Those names are not requirements of this policy (owner amendment of D6, 2026-10-07). Subagent models are set per control below, never inherited from the most capable session model (I-7).

## Claude Code controls

Owned by Task 4 of the plan. Values come from decisions D3 and D5 and live in `.claude/settings.json`. Every row was probed on 2026-10-07 with Claude Code 2.1.286 through `claude -p` (haiku session model, `--max-turns` 8). The desktop apps were not probed.

| Control | Value | Status | Evidence |
| --- | --- | --- | --- |
| `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | `1` | VERIFIED (CLI) | Before: a subagent spawned a grandchild. After: the subagent reported it had no `Agent` tool. |
| `env.CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | `3` | VERIFIED (CLI) | Before: four background subagents ran together. After: the 4th spawn returned "Concurrent subagent limit reached. You can run 3 subagents at once." |
| `env.CLAUDE_CODE_SUBAGENT_MODEL` | `sonnet` (no `_FORCE`) | VERIFIED (CLI) | Before: a spawn with no model inherited the session model (haiku). After: it ran on `claude-sonnet-5-5`. |
| `permissions.ask` | `Agent` | VERIFIED headless; interactive prompt OPEN | In `default`, `acceptEdits`, `auto`, `plan` and `bypassPermissions` the spawn was refused ("requested permissions to use Agent, but you haven't granted it yet"), because `-p` cannot answer a prompt. `dontAsk` denied it. `--allowedTools Agent` did not override the rule. The prompt itself was not observed. |
| `permissions.deny` `Agent(model:opus)`, `Agent(model:fable)` | as listed | VERIFIED (CLI) | "Permission to use Agent with model:opus has been denied", and the same for fable. |
| `permissions.deny` `Agent(codex:codex-rescue)` | as listed | VERIFIED with a caveat | With the plugin loaded and the rule passed as a flag setting, the call returned "Agent type 'codex:codex-rescue' has been denied". `Agent(codex-rescue)` and `Agent(codex:*)` did not match. Under the project `ask` rule the headless call stops at the ask stage first, so the type deny takes effect only after a human approves the ask. |
| Specialist agent | `.claude/agents/ade-readonly-specialist.md` | VERIFIED (CLI) | Spawned by name, it listed only Read, Grep and Glob, ran on sonnet, and had no write or spawn tool. |

Open items:

- **Desktop app: OPEN.** None of the settings were probed in the Claude desktop app. Treat the caps as CLI-verified until the owner repeats the three spawn probes there.
- **Interactive `ask` prompt: OPEN.** Headless mode only shows that the spawn is blocked until a human answers. Whether auto and bypass modes prompt interactively was not observed.
- **Total spawns: no control.** The concurrency cap bounds simultaneous spawns only. The receipt's "Agent usage" line and review still carry the total.
- **Probe method.** The cap probes (depth, concurrency, model) ran with the same `env` block passed through `--settings` and no project `ask` rule, because the ask gate would otherwise refuse the spawn before the caps could be observed.

## Codex controls

OPEN until Task 5 of the plan probes and records each control. The intended values come from decisions D2 and D5.

| Control | Intended value | Status |
| --- | --- | --- |
| `[agents] max_concurrent_threads_per_session` | `3` | OPEN |
| `[agents] max_depth` | Value chosen by the Task 5 semantics probe; no nested delegation | OPEN |
| `default_subagent_model` | Unset; role files set models | OPEN |
| Specialist role | `.codex/agents/ade-readonly-specialist.toml`, explicit model, medium effort, read-only by instruction | OPEN |

## Skill and plugin override register

I-10 applies to every row. Vendored Skills are not edited (see `.agents/skills/vendor-lock.json` and `skills-lock.json`); this register overrides them instead.

| Source | Instruction that delegates | Ruling |
| --- | --- | --- |
| Vendored Impeccable critique | Two assessments "MUST run as two isolated sub-agents" | Run inline with a degraded banner by default. Dual subagents only as a `REVIEW`-class `BOUNDED_MULTI_AGENT` block with 2 subagents. |
| Vendored Impeccable craft, live, typeset and layout flows | Spawn finish reviewer, documenter, producers "one per card", edit applier | Forbidden in plan execution, except through a valid `BOUNDED_MULTI_AGENT` block. |
| Vendored `improve-animations` | Fans out ≤4 (`standard`) or ≤8 (`deep`) subagents and an executor subagent | Capped at 3 read-only `RESEARCH` subagents. Never its executor subagent. |
| `superpowers:subagent-driven-development`, `dispatching-parallel-agents`, `requesting-code-review` | Per-task implementer and reviewer subagents; parallel dispatch | Not used for plan execution. Use `superpowers:executing-plans`. |
| `superpowers:writing-plans` header | Recommends subagent-driven-development | Superseded by `AGENTS.md`. New plans carry execution blocks instead. |
| `superpowers:using-superpowers` | "1% chance a skill applies, you MUST invoke" | Invoke a Skill's instructions inline. Invoking a Skill never implies delegation. |
| `anthropic-skills:deep-research`, built-in `Explore` agent | Research subagents, broad fan-out | `RESEARCH`-class blocks only. |
| `codex:codex-rescue` | "Proactively use when Claude Code is stuck" | Denied for Claude subagent spawns (D3). The `codex` plugin may still start the independent review session (I-8) on the owner's request. |
| `.agents/skills/verification-before-completion` | Verifies a delegated agent's report | No conflict. |
| `.agents/skills/typesafe-ai` | "Speculative fan-out" in LLM product code | No conflict. |
| PLAN-SPF-V1 header, model routing and Task 8 | Orchestrator-dispatched tasks; a separable subtask handed to a cheaper model | Remaining SPF tasks adopt this policy through Task 7 of the plan. Until then SPF keeps its approved packets. |

## Failure modes and mitigations

- **Sequential spawning under a concurrency cap.** Neither tool caps total spawns. Only the receipt's "Agent usage" line and the independent reviewer catch it; an over-allowance count is a review finding.
- **A setting is not honored in a desktop app.** Tasks 4 and 5 probe where the owner works. A key that does not hold is removed and recorded OPEN rather than claimed.
- **An `ask` rule is auto-approved.** Task 4 records the observed behavior per permission mode.
- **A legacy plan used as a template.** Only `PLAN-SPF-V1` is exempt from the validator, by ID, so a copy fails.
- **A worktree predates the controls.** Configuration applies per checkout; rebase to pick it up.
- **An `ask` gate stalls an unattended run.** Accepted by design. Record the blocked spawn as OPEN instead of bypassing it.

## Operator setup

User-level files are outside the repository. This record only recommends; the owner applies changes by hand.

- `~/.codex/config.toml`: optionally lower the global `model_reasoning_effort`, which every Codex subagent inherits, or rely on the project `[agents]` and role settings from Task 5.
- Claude: keep the global `"model": "sonnet"`. Consider disabling `codex@openai-codex` in sessions for this repository if `codex:codex-rescue` should not be reachable at all.
