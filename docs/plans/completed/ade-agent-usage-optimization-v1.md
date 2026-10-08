---
id: PLAN-ADE-AGENT-USAGE-V1
type: execution-plan
status: APPROVED
plan_status: COMPLETED
execution_policy: ADE-AGENT-USAGE-V1
related:
  - GOV-ENGINEERING-LIFECYCLE
  - PLAN-TEMPLATE
  - PLAN-INDEX
  - PLAN-SPF-V1
  - RFC-ADE-AGENT-USAGE-V1
  - ADR-ADE-AGENT-USAGE
  - GOV-AGENT-USAGE
last_verified: 2026-10-07
---

# ADE Agent-Usage Optimization v1 Implementation Plan

> **For agentic workers:** Execute one task per top-level session, inline, with `superpowers:executing-plans` (or the Codex equivalent). Do **not** use `superpowers:subagent-driven-development` or `superpowers:dispatching-parallel-agents`: every task below is `SINGLE_AGENT`. Every task ends in a human-reviewed Pull Request from a `codex/` branch; no agent merges or pushes to `main`.

**Goal:** Make "one task = one primary agent" the enforced default of the FURLANICH ADE, permitting at most three justified, bounded subagents per task, without weakening strict TDD, independent review, or the governance lifecycle.

**Architecture:** Parallelism moves up to the task/PR level: independent tasks run as separate top-level Claude Code or Codex sessions in separate worktrees, and each session works alone. Hard limits live in committed project configuration (`.claude/settings.json`, `.codex/config.toml`, bounded custom agents). Soft policy lives in one owning governance record, `AGENTS.md`, the plan template and the repository-owned Skills. The docs validator rejects new plans whose tasks lack a valid execution block.

**Tech stack:** Node test runner (`node --test scripts/*.test.mjs`), `scripts/validate-repository-docs.mjs`, Claude Code 2.1.286 (installed), Codex CLI 0.162.0-alpha.2 (installed). No new dependencies.

**Spec:** The owner's ADE Agent-Usage Optimization brief of 2026-10-07, the [engineering lifecycle](../../governance/engineering-lifecycle.md) and the ADE v2 precedent in [PLAN-SPF-V1](../active/services-projects-footer-v1.md#model-routing).

## Current-state findings

### ADE structure and configuration map

| Layer | File | What it does today | Delegation relevance |
| --- | --- | --- | --- |
| Repository instructions | [`AGENTS.md`](../../../AGENTS.md) | Routes to docs, lifecycle, Skills; work contract; `codex/` branches | **No agent-usage rule at all.** Silent on subagents, concurrency, models. |
| Governance | [Engineering lifecycle](../../governance/engineering-lifecycle.md) | Classifies work, RFC/ADR/plan paths, autonomy and escalation | Silent on delegation. "Agents may inspect, research, ..." without limits. |
| Plan template | [`docs/plans/template.md`](../template.md) | Section headings only | **No per-task execution section.** No task packet shape. |
| ADE v2 mechanics | [Sky Chart plan §§16–26](../completed/sky-chart-home-redesign-v2.md#24-sequential-integration-procedure), [PLAN-SPF-V1](../active/services-projects-footer-v1.md#model-routing) | Orchestrator dispatches each task; waves; locks; receipts; independent review | The orchestrator spawns each task as a **subagent** (the SPF ledger in `.superpowers/sdd/services-projects-footer-v1/progress.md` records "Agent model=sonnet, general-purpose" for Tasks 3 and 5). The SPF plan also lets a Sonnet packet hand subtasks to Luna "as a bounded checklist batch", and its header recommends `superpowers:subagent-driven-development`. |
| Claude project config | `.claude/settings.json` | Enables the `brag` plugin only | **No env caps, no permission rules on `Agent`.** |
| Claude local config (tracked) | `.claude/settings.local.json` | Impeccable hooks | None. |
| Claude custom agents | `.claude/agents/impeccable-*.md` (4) | `model: inherit`, `maxTurns` 12–30, all omit the `Agent` tool | `model: inherit` runs them on the session model (Opus in an Opus session). |
| Claude user config (outside repo) | `~/.claude/settings.json` | `model: sonnet`; `codex@openai-codex` plugin enabled | The plugin adds the `codex:codex-rescue` agent, whose description says "Proactively use" — cross-provider delegation. |
| Codex project config | `.codex/hooks.json` only | Impeccable hooks | **No `.codex/config.toml`; no `[agents]` limits.** |
| Codex user config (outside repo) | `~/.codex/config.toml` | `model = "gpt-6.1-sol"`, `model_reasoning_effort = "high"`; `multi_agent` feature stable and enabled; no `[agents]` table | Every Codex subagent inherits Sol at high effort unless a role overrides it. |
| Codex custom agents | `.agents/skills/impeccable/agents/*.toml` (4, vendored) | Impeccable roles | Spawned by Impeccable flows. |
| Copilot agents | `.github/agents/impeccable-*.agent.md` | Copies for Copilot | Not part of the Claude/Codex ADE; out of scope. |

### Verified configuration controls

Each key below was confirmed in current upstream documentation (Context7: `/websites/code_claude`, `/openai/codex`) on 2026-10-07. Installed versions meet the documented minimums, but **no key has been live-probed yet**. Tasks 4 and 5 probe each one before relying on it.

| Tool | Control | Documented behavior |
| --- | --- | --- |
| Claude Code | `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | Default 3; `1` stops subagents from spawning their own (v2.1.219+) |
| Claude Code | `env.CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | Default 20; refuses spawns above the limit with "Concurrent subagent limit reached". Bounds **simultaneous**, not total, spawns |
| Claude Code | `env.CLAUDE_CODE_SUBAGENT_MODEL` (+ `_FORCE`) | Default subagent model when the spawn call and the agent definition set none; `_FORCE=1` overrides both (v2.1.257+) |
| Claude Code | `permissions.deny` / `permissions.ask` with `Agent(<name>)` and `Agent(model:<tier>)` | Blocks or gates specific agents or model tiers (parameter rules v2.1.178+) |
| Claude Code | Agent frontmatter `tools`, `model`, `effort`, `maxTurns` | Already used by the Impeccable agents; omitting `Agent` from `tools` prevents nesting |
| Codex | `[agents] max_concurrent_threads_per_session` (alias `max_threads`) | Thread concurrency cap per session |
| Codex | `[agents] max_depth`, `enabled`, `default_subagent_model` | Nesting depth, global switch, default subagent model |
| Codex | Role files in `.codex/agents/*.toml` | Per-role `model`, `model_reasoning_effort`, `developer_instructions`, `features`, `skills` |
| Codex | Project `.codex/config.toml` | Overrides user config (precedence 25 over 20) **only in a trusted project**; trust for a worktree applies to the main checkout root. This repository is trusted. |

### Instructions that cause or encourage delegation

| Source | Ownership | Instruction | Conflict with the new policy |
| --- | --- | --- | --- |
| `superpowers:subagent-driven-development` | User plugin (outside repo) | Fresh implementer subagent per task, a reviewer subagent per task, up to five fix rounds, a final reviewer | Per-task fan-out of at least two agents, more with fix rounds. Direct conflict. |
| `superpowers:writing-plans` | User plugin | Mandatory header recommends subagent-driven-development | Every plan written with it recommends fan-out by default. |
| `superpowers:dispatching-parallel-agents`, `superpowers:requesting-code-review` | User plugin | Parallel dispatch; reviewer subagent dispatch | Encourages routine self-review by subagent. |
| `superpowers:using-superpowers` | User plugin (session hook) | "If there is even a 1% chance a skill might apply ... you MUST invoke" | Amplifies the above. |
| `anthropic-skills:deep-research`, built-in `Explore` agent | Harness | "Coordinates research subagents"; "broad fan-out searches" | Unnecessary exploratory agents. |
| `codex:codex-rescue` | User plugin | "Proactively use when Claude Code is stuck" | Unrequested cross-provider delegation. |
| `.agents/skills/impeccable/reference/critique.md` | Vendored, hash-locked | Assessments A and B "MUST run as two isolated sub-agents"; inline is "NOT permitted" | Mandatory fan-out for a review activity. |
| `impeccable/reference/new-work.md`, `live.md`, `typeset.md`, `layout.md` | Vendored | Spawn the finish reviewer, documenter, parallel asset producers ("one per card") and the edit applier | Unbounded parallel spawn ("one per card"). |
| `.agents/skills/improve-animations/SKILL.md` | Vendored (`skills-lock.json` hash) | Fan out subagents: ≤4 at `standard`, ≤8 at `deep`; dispatch an executor subagent | Exceeds the cap of 3; delegates implementation. |
| PLAN-SPF-V1 header, model routing and Task 8 | Repository (APPROVED plan) | Orchestrator dispatches tasks; "a separable subtask ... goes to Luna as a bounded checklist batch" | Intra-task delegation with no count or justification fields. |
| `.agents/skills/verification-before-completion` | Vendored | "Agent delegation: verify the agent's report" | **No conflict.** It verifies delegated work and never asks for it. |
| `.agents/skills/typesafe-ai` | Repository | "Speculative fan-out" | **No conflict.** It is about LLM application patterns in product code. |

The Claude Code desktop harness's own system prompt already says not to spawn agents unless the user asks. Other harnesses and Codex do not say this, so the repository cannot rely on it.

### Duplicated, conflicting, ambiguous or overly permissive rules

1. **No owner.** No repository record owns agent usage, so Skills and harness defaults decide.
2. **Precedence is implicit.** `AGENTS.md` says approved specs outrank Taste, but nothing says repository delegation policy outranks a Skill's "MUST spawn".
3. **"Orchestrator" is ambiguous.** It can mean a coordination session or a subagent dispatcher. SPF used it as both.
4. **Independent review is conflated with subagent review.** The SPF Sol review is a separate session gate. Superpowers' review is a subagent of the implementer. The policy must keep the first and forbid the second as routine.
5. **The model inherits silently.** Claude agents use `model: inherit`. Codex subagents inherit `gpt-6.1-sol`/`high`.
6. **No cap.** Neither tool has a project-level depth or concurrency limit.

### Hard configuration versus instruction-level policy

| Protection | Hard (config) | Soft (instruction/template) | Audit (validator/receipt) |
| --- | --- | --- | --- |
| No recursive delegation | Claude depth `1`; Codex `max_depth`; custom agents omit `Agent` | Policy invariant I-5 | Receipt |
| At most 3 concurrent subagents | Claude `3`; Codex `3` | I-3 | Receipt |
| Total spawns per task ≤ Allowed | **None available**: both tools cap concurrency, not totals | I-2, I-3 | Receipt "Agent usage" line; reviewer finding |
| Default 0 subagents | Claude `ask: ["Agent"]` (D3) makes every spawn a human decision; Codex per D2 | I-1, template default | Validator requires the execution block |
| No expensive inheritance | Claude default subagent model `sonnet`; deny `opus`/`fable` tiers; Codex role models | I-7 | Receipt |
| Skills cannot override | Claude deny/ask rules apply to Skill-initiated spawns too | Precedence clause in `AGENTS.md`; Skill override register | Reviewer |
| Justification exists | — | Template | Validator checks every field of a `BOUNDED_MULTI_AGENT` block |

### How existing plans behave

- **Completed plans** are historical records. They stay unchanged and unvalidated.
- **PLAN-SPF-V1** (APPROVED, W2 merged; Tasks 4 and 6–10 remain) has no execution blocks. The validator exempts it by ID. Task 7 records a dated, owner-approved adoption decision instead of rewriting approved packets.
- **New plans** must carry `execution_policy: ADE-AGENT-USAGE-V1` and an execution block per task, or `npm run docs:check` fails.
- **Config takes effect per checkout.** A worktree cut from `main` before Task 4 or 5 merges lacks the new `.claude/settings.json` or `.codex/config.toml`. In-flight SPF worktrees keep the old behavior until they rebase.

## Target policy and invariants

These invariants become the owning record `GOV-AGENT-USAGE` (Task 2).

- **I-1 Default.** One task = one primary agent. Every task is `SINGLE_AGENT` with `Subagents Allowed: 0` unless its plan block validly declares `BOUNDED_MULTI_AGENT`. An absent or invalid block means `SINGLE_AGENT`.
- **I-2 Never delegate:** file inspection, understanding a localized feature, implementing one page/section/endpoint, writing the task's own tests, running lint/typecheck/build/tests, routine review of one's own work, work touching the same files, or anything the primary agent can complete sequentially.
- **I-3 Exception ceiling.** `BOUNDED_MULTI_AGENT` allows 1–3 subagents per task, counted as **total spawns** over the task, not concurrent ones. Prefer fewer.
- **I-4 Mandatory justification:** subagent count; why single-agent is insufficient; each subagent's responsibility; file/workstream boundaries; why the parallelism is worth its token cost. Any field missing means the task stays `SINGLE_AGENT`.
- **I-5 No recursion.** Subagents never spawn. The primary agent integrates and runs the final validation.
- **I-6 Work classes.** `IMPLEMENTATION` is strictest: a writing subagent needs a disjoint write set and its own worktree. `RESEARCH` and `REVIEW` subagents are read-only and need independent perspectives or unrelated areas.
- **I-7 Model economy.** A subagent names its model and effort. It never inherits the most capable session model by default.
- **I-8 Independent review is a gate, not a subagent.** The PR's independent reviewer is a separate top-level session (for example a fresh Codex session started through the `codex` plugin at its default model) that has not contributed to the PR. It does not count against the implementer's allowance. The implementer self-reviews inline and never spawns its own reviewer. The reviewer session may itself use `BOUNDED_MULTI_AGENT` with work class `REVIEW` when justified.
- **I-9 Task-level parallelism.** Independent tasks run concurrently as separate sessions in separate worktrees. They need disjoint write sets, as in the ADE v2 waves. Keep at most 3 concurrent task sessions per provider. That limits the rate-limit failures seen in SPF W2.
- **I-10 Precedence.** This policy outranks any Skill, plugin or harness instruction that asks for delegation. A Skill that cannot run inline records a degraded run instead of spawning.

### Execution block schema

The default block for every task:

```text
**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0
```

The exceptional block. Every field is required and must not be a placeholder:

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

## Global constraints

- Strict TDD is unchanged: **RED → verify intended failure → GREEN → verify pass → REFACTOR → verify again**. Skill edits use the repository's scenario RED/GREEN method in [Skill validation](../../testing/skill-validation.md).
- **Do not edit vendored Skills.** They are listed in `.agents/skills/vendor-lock.json` (for example `impeccable`, `improve-animations`, `verification-before-completion`, `test-driven-development`) or in `skills-lock.json`. Any edit breaks `npm run skills:check` hashes and upstream provenance. Override them in the owning record instead.
- Do not edit user-level files (`~/.claude/**`, `~/.codex/**`). Recommendations for them go in documentation, and the owner applies them by hand.
- Preserve the existing hooks (`.codex/hooks.json`, `.claude/settings.local.json`) and the `brag@brag` entry in `.claude/settings.json`.
- Every task: run `npm run validate` and `npm run skills:check` fresh, finish with `pr-readiness`, and open a PR for human review. No merges, no pushes to `main`.
- The PLAN-SPF-V1 `PLAN-RECORD` lock belongs to the SPF orchestrator. Task 7 acquires it through a recorded handoff.

## Review focus

Most likely failures that the tests below do not fully cover:

1. **Sequential spawning under a concurrency cap.** Three agents spawned one after another pass every config limit. Only the receipt's "Agent usage" line and the reviewer catch it. Task 6 adds that line and a `pr-readiness` check.
2. **Settings not honored in the desktop apps.** The env caps might apply in the CLI but not in Claude desktop or Codex desktop. Tasks 4 and 5 probe in the app the owner actually uses, not only with `-p`/`exec`.
3. **An `ask` rule silently auto-approved.** Under `bypassPermissions` or auto mode, an `ask` rule may not prompt. Task 4 records the observed behavior per permission mode.
4. **Codex `max_depth` semantics.** Whether `1` means "the root may spawn, children may not" or "nobody may spawn" decides the value. Task 5 probes it before committing.
5. **An exempt legacy plan used as a template.** Copying PLAN-SPF-V1's packets drops the execution block. The validator catches this because only the `PLAN-SPF-V1` ID is exempt.

---

## Dependency DAG and waves

```text
1 Governance PR (RFC + this plan) ── D1–D6 decided 2026-10-07; owner merges
└─2 Policy record (ADR, GOV-AGENT-USAGE, lifecycle, AGENTS.md)
  ├─3 Plan template + validator enforcement
  ├─4 Claude Code project controls
  ├─5 Codex project controls
  └─6 Repository Skill alignment (architecture-governance, pr-readiness)
      [3 merged]──7 PLAN-SPF-V1 adoption decision
```

| Wave | Tasks | Concurrency | Independence proof |
| --- | --- | --- | --- |
| W0 | 1 | Single | Docs only |
| W1 | 2 | Single | Docs only; owns `AGENTS.md`, the lifecycle, the indexes and `GOV-AGENT-USAGE` |
| W2 | 3 ∥ 4 ∥ 5 ∥ 6 | At most 3 sessions per provider (I-9) | write(3) = template, docs validator and its test, `docs/testing/strategy.md`; write(4) = `.claude/settings.json`, `.claude/agents/ade-*`, `scripts/claude-agent-config.test.mjs`, the "Claude Code controls" section of `GOV-AGENT-USAGE`; write(5) = `.codex/config.toml`, `.codex/agents/*`, `scripts/codex-agent-config.test.mjs`, the "Codex controls" section; write(6) = two repository Skills and `docs/testing/skill-validation.md`. Pairwise disjoint; 4 and 5 touch different sections of one file. |
| W3 | 7 | Single | Needs Task 3's legacy exemption merged and the SPF `PLAN-RECORD` lock |

Each task runs as its own top-level session in `.worktrees/ade-<n>` on `codex/ade-<n>-<purpose>` cut from current `main`, with `PLAYWRIGHT_PORT` unused (no browser work). Each PR gets an independent review in a separate session (I-8), and the owner merges.

## Task 1 / PR 1 – Governance PR: RFC and plan

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Files:**
- Create: `docs/rfcs/ade-agent-usage-v1.md` (`RFC-ADE-AGENT-USAGE-V1`, `status: PROPOSED`, copied from `docs/rfcs/template.md`)
- Modify: `docs/rfcs/index.md`, `docs/plans/index.md` (Active entry for this plan, PROPOSED), `docs/governance/status-register.md`
- Include: this plan file, with `RFC-ADE-AGENT-USAGE-V1` added to `related`

- [ ] **Step 1:** The RFC states the problem (findings above), invariants I-1 to I-10, the execution-block schema, the hard/soft control matrix, and the open decisions D1–D6 with options and recommendations. It links to this plan instead of copying task detail.
- [ ] **Step 2:** Run `npm run docs:check`. Expected: pass, with the new ID resolving from the indexes and the register.
- [ ] **Step 3:** Run `npm run validate`, then `pr-readiness`. The PR body lists the owner's D1–D6 decisions for confirmation at review. Commit `docs(ade): propose agent-usage policy RFC and execution plan`.

**Acceptance:** RFC PROPOSED; this plan PROPOSED; no configuration, Skill or code changed; docs:check green.

## Task 2 / PR 2 – Record the accepted policy

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Starts after:** Task 1 merged. The owner's D1–D6 decisions are already recorded in the RFC and in this plan.

**Files:**
- Create: `docs/decisions/ade-agent-usage.md` (`ADR-ADE-AGENT-USAGE`, from `docs/decisions/template.md`): decision, the chosen D1–D6 options, consequences.
- Create: `docs/governance/agent-usage.md` (`GOV-AGENT-USAGE`, `type: engineering-governance`, `status: APPROVED`), the **owning record**, with these sections: Invariants (I-1 to I-10); Work classes; Execution block schema; Orchestration (per D1); Claude Code controls (placeholder table, owned by Task 4); Codex controls (placeholder table, owned by Task 5); Skill and plugin override register (the conflict table above, each with its ruling); Failure modes and mitigations; Operator setup (optional user-level recommendations, see below).
- Modify: `docs/governance/engineering-lifecycle.md`: add one `## Agent usage` section of at most 5 lines that points to `GOV-AGENT-USAGE`, and add `GOV-AGENT-USAGE` to `related`.
- Modify: `AGENTS.md`: add an `## Agent usage` section of at most 6 lines, between "Frontend and testing routes" and "Work contract":
  - One task = one primary agent; default `SINGLE_AGENT`, 0 subagents.
  - Subagents only through a valid `BOUNDED_MULTI_AGENT` plan block, max 3, no nesting.
  - Independent review is a separate session, never a subagent of the implementer.
  - This policy outranks any Skill, plugin or harness instruction to delegate. Run such Skills inline and record a degraded run.
  - Execute plans with `superpowers:executing-plans`, not subagent-driven-development.
  - Link to `GOV-AGENT-USAGE`.
- Modify: `docs/index.md` (link), `docs/decisions/index.md`, `docs/governance/status-register.md`; the RFC status becomes APPROVED, with an acceptance note.

**Operator setup** (documented only; the owner applies it by hand):
- `~/.codex/config.toml`: optionally lower the global default `model_reasoning_effort = "high"`, which every Codex subagent inherits, or rely on the project `[agents]` and role settings from Task 5.
- Claude: keep the global `"model": "sonnet"`. Consider disabling `codex@openai-codex` in sessions for this repository if D3 does not deny `codex:codex-rescue`.

- [ ] **Step 1:** Write the records above. Rule every row of the override register:
  - Vendored Impeccable critique: run inline with a degraded banner by default; dual subagents only as a REVIEW-class `BOUNDED_MULTI_AGENT` with 2 subagents.
  - Impeccable craft and live agents: forbidden in plan execution, except through a valid block.
  - `improve-animations`: capped at 3 read-only subagents in RESEARCH; never its executor subagent.
  - superpowers SDD, parallel dispatch and review dispatch: not used for plan execution.
  - `using-superpowers`: invoke a Skill's instructions inline; invocation never implies delegation.
  - `deep-research` and `Explore`: RESEARCH-class blocks only.
  - `codex:codex-rescue`: per D3.
  - `verification-before-completion` and `typesafe-ai`: no conflict.
- [ ] **Step 2:** Run `npm run docs:check`. Expected: pass; `GOV-AGENT-USAGE` and `ADR-ADE-AGENT-USAGE` resolve.
- [ ] **Step 3:** Run `npm run validate` and `pr-readiness`. Commit `docs(ade): adopt one-task-one-agent policy`.

**Acceptance:** One owning record; `AGENTS.md` and the lifecycle link to it and do not duplicate it; the ADR records D1–D6; every conflict in the findings has a ruling.

## Task 3 / PR 3 – Plan template default and validator enforcement

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Files:**
- Modify: `scripts/validate-repository-docs.mjs`: add `validateExecutionPlans(documents)` and call it from `validateRepository`. Also add `.superpowers` to `EXCLUDED_DIRECTORIES`, with a test `ignores local Superpowers orchestration ledgers during discovery`. The untracked SDD ledgers there currently make a local `npm run docs:check` fail with 26 broken-link violations.
- Test: `scripts/validate-repository-docs.test.mjs`
- Modify: `docs/plans/template.md`: add `execution_policy: ADE-AGENT-USAGE-V1` to the YAML sample, a `## Task packets` section with the default block, and the exceptional block linked to `GOV-AGENT-USAGE`.
- Modify: `docs/testing/strategy.md` (the docs-validation row, if one exists; otherwise the closest validation section)

**Interfaces:**
- Produces:
  - `const EXECUTION_POLICY = 'ADE-AGENT-USAGE-V1'`
  - `const LEGACY_EXECUTION_PLAN_IDS = new Set(['PLAN-SPF-V1'])`
  - `validateExecutionPlans(documents: Document[]): string[]`, which returns messages in the existing `violation(document, message)` format.

**Rules:** Apply the rules to documents with `type: execution-plan` and `plan_status: ACTIVE` whose `id` is not in the legacy set.
1. `execution_policy` must equal `EXECUTION_POLICY`.
2. Every heading matching `/^#{2,3} Task \d+\b/` owns the text up to the next heading of the same or a higher level. That text holds exactly one `**Execution**` block.
3. `Execution Mode` ∈ {`SINGLE_AGENT`, `BOUNDED_MULTI_AGENT`}, and `Work Class` ∈ {`IMPLEMENTATION`, `RESEARCH`, `REVIEW`}.
4. `SINGLE_AGENT` requires `Subagents Allowed: 0`.
5. `BOUNDED_MULTI_AGENT` requires `Subagents Allowed` to be an integer from 1 to 3. It also requires non-empty, non-placeholder values for `Single-agent insufficiency`, `Cost justification`, `Isolation / File Boundaries` and `Nesting: forbidden`. Placeholders match `/^(\.\.\.|TBD|TODO|<.*>)$/i`. The block needs exactly `Subagents Allowed` numbered responsibility items.

- [ ] **Step 1: Write the failing tests**, using a fixture helper that writes one plan file into the existing temporary-root fixture:
  - `accepts an active plan whose tasks declare SINGLE_AGENT execution` → `deepEqual(violations, [])`
  - `accepts a valid BOUNDED_MULTI_AGENT task with two responsibilities` → `[]`
  - `reports an active plan without the execution policy marker` → includes `execution_policy must be "ADE-AGENT-USAGE-V1"`
  - `reports a task without an Execution block` → includes `Task 2: missing Execution block`
  - `reports SINGLE_AGENT with nonzero Subagents Allowed` → includes `Task 1: SINGLE_AGENT requires Subagents Allowed: 0`
  - `reports BOUNDED_MULTI_AGENT above three subagents` (value 4) → includes `Task 1: Subagents Allowed must be 1-3`
  - `reports BOUNDED_MULTI_AGENT missing justification fields` (`Cost justification: ...`) → includes `Task 1: Cost justification is required`
  - `reports responsibility count that differs from Subagents Allowed` (2 allowed, 1 listed) → includes `Task 1: expected 2 Subagent Responsibilities, found 1`
  - `exempts completed and legacy active plans` (`plan_status: COMPLETED` without blocks; `id: PLAN-SPF-V1` without blocks) → `[]`
  - `keeps the plan template defaulting to SINGLE_AGENT`: reads the real `docs/plans/template.md` and asserts it contains `Execution Mode: SINGLE_AGENT` and `Subagents Allowed: 0` and the marker.
- [ ] **Step 2:** Run `node --test scripts/validate-repository-docs.test.mjs`. Expected: the new tests FAIL because their assertions are not met (no import or syntax failure), and the 15 existing tests pass.
- [ ] **Step 3:** Implement `validateExecutionPlans` and the template change.
- [ ] **Step 4:** Run the same command. Expected: all tests pass. Then run `npm run docs:check`. Expected: pass. This plan file itself must validate.
- [ ] **Step 5:** Refactor, rerun both, then `npm run validate`, `pr-readiness`. Commit test and implementation together or test first: `feat(ade): enforce plan execution blocks in docs validator`.

**Acceptance:** A new ACTIVE plan without valid blocks fails `docs:check`; PLAN-SPF-V1 and completed plans are unaffected; the template defaults to `SINGLE_AGENT`.

## Task 4 / PR 4 – Claude Code project controls

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

The live probes in Step 1 and Step 5 make the Claude CLI start trivial agents. That is the tool under test, not delegation of this task's work.

**Files:**
- Modify: `.claude/settings.json`
- Create: `.claude/agents/ade-readonly-specialist.md`
- Test: `scripts/claude-agent-config.test.mjs` (picked up by `npm test`)
- Modify: `docs/governance/agent-usage.md`, **"Claude Code controls" section only**: verified keys, probe evidence, permission-mode behavior.

**Target `.claude/settings.json`** (values per D3/D5; existing keys preserved):

```json
{
  "enabledPlugins": { "brag@brag": true },
  "env": {
    "CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH": "1",
    "CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS": "3",
    "CLAUDE_CODE_SUBAGENT_MODEL": "sonnet"
  },
  "permissions": {
    "ask": ["Agent"],
    "deny": ["Agent(model:opus)", "Agent(model:fable)", "Agent(codex:codex-rescue)"]
  }
}
```

**`ade-readonly-specialist`**: frontmatter `tools: Read, Grep, Glob`, `model: sonnet`, `effort: medium`, `maxTurns: 25`. It has no `Agent`, `Write`, `Edit` or `Bash`. Its body says it returns findings only, never edits and never spawns. It is the only sanctioned target for RESEARCH/REVIEW blocks. The Impeccable agents stay unchanged because they are vendored, and the `ask` rule gates them.

- [ ] **Step 1: Probe the current behavior (behavioral RED).** In a scratch worktree, run three trivial probes with `claude -p` and `--max-turns 6`, and once in the owner's desktop app:
  - (a) A subagent that tries to spawn a subagent. Today expected: the nested spawn succeeds.
  - (b) Four background subagents at once. Today expected: all four start.
  - (c) A spawn with no model. Today expected: it inherits the session model.

  Record the outputs in the PR.
- [ ] **Step 2: Write the failing static tests.** These parse the JSON and the agent frontmatter:
  - `Claude project settings cap subagent spawn depth at 1`
  - `Claude project settings cap concurrent subagents at 3`
  - `Claude project settings default subagents to sonnet`
  - `Claude project settings gate every Agent spawn behind ask` (D3)
  - `Claude project settings deny opus and fable subagent tiers`
  - `Claude project settings preserve the brag plugin`
  - `ADE specialist agent is read-only, cannot spawn, and has at most 25 turns`

  Run `node --test scripts/claude-agent-config.test.mjs`. Expected: FAIL on the missing keys.
- [ ] **Step 3:** Apply the settings and create the agent.
- [ ] **Step 4:** Rerun the test. Expected: PASS.
- [ ] **Step 5: Live GREEN.** Rerun probes (a)–(c). Expected:
  - (a) The nested spawn is refused, or the child does the work itself.
  - (b) The 4th spawn returns "Concurrent subagent limit reached". Under `ask`, each spawn first prompts.
  - (c) The spawn runs on `sonnet`.

  Also probe `ask` under `default`, `acceptEdits` and auto/bypass modes, and record whether each prompts. **If a key is not honored, remove it, record the gap as OPEN, and do not claim it.**
- [ ] **Step 6:** Update the "Claude Code controls" section, run `npm run validate` and `pr-readiness`, and commit `feat(ade): cap Claude Code subagent depth, concurrency and model`.

**Acceptance:** The static tests pass. Each control is either live-verified, with its evidence in `GOV-AGENT-USAGE`, or recorded as OPEN. The hooks and the `brag` entry are unchanged.

## Task 5 / PR 5 – Codex project controls

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Files:**
- Create: `.codex/config.toml`
- Create: `.codex/agents/ade-readonly-specialist.toml`
- Test: `scripts/codex-agent-config.test.mjs`
- Modify: `docs/governance/agent-usage.md`, **"Codex controls" section only**

**Target `.codex/config.toml`** (values confirmed by Step 1; D2 decides `features`):

```toml
[agents]
max_concurrent_threads_per_session = 3
max_depth = 1            # value chosen after the Step 1 semantics probe
# default_subagent_model: set only if D5 approves a model id that `codex` resolves
```

**`ade-readonly-specialist.toml`**: `name`, `description`, `model` (per D5: an explicit model id that `codex` resolves in the Step 1 probe; no specific GPT-6 model is required, see the D6 amendment), `model_reasoning_effort = "medium"`, and `developer_instructions` saying it is read-only, returns findings only and never spawns. Use read-only sandboxing only if Step 1 shows that role files accept a sandbox key; otherwise read-only is instruction-level and recorded as such.

- [ ] **Step 1: Probe (behavioral RED and semantics).** With `codex exec` (installed 0.162.0-alpha.2) in a scratch worktree, and once in the Codex desktop app:
  - (a) Confirm the project config loads in a `.worktrees/*` checkout (trust inheritance).
  - (b) Run a nested spawn attempt under `max_depth` values 0, 1 and 2, and record which value lets the root spawn while blocking children.
  - (c) Run four concurrent spawns.
  - (d) Check whether the subagent model is inherited.
  - (e) Check whether `-c features.multi_agent=false` and project `[features]` disable spawning.

  Record everything.
- [ ] **Step 2: Write the failing static tests.** These check the lines as text; no TOML dependency:
  - `Codex project config caps concurrent agent threads at 3`
  - `Codex project config forbids nested delegation` (asserts the probed value)
  - `Codex ADE specialist role declares an explicit model and medium effort`
  - `Codex ADE specialist role forbids spawning and edits in its instructions`

  Expected: FAIL.
- [ ] **Step 3:** Create the files. **Step 4:** Tests PASS.
- [ ] **Step 5:** Rerun the probes. Expected: caps enforced, or any unhonored key removed and recorded as OPEN.
- [ ] **Step 6:** Update the "Codex controls" section. Leave `.codex/hooks.json` unchanged. Run `npm run validate` and `pr-readiness`. Commit `feat(ade): cap Codex agent threads and depth`.

**Acceptance:** As in Task 4. User-level `~/.codex/config.toml` is unchanged.

## Task 6 / PR 6 – Align repository-owned Skills

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

Single-agent rationale: there are two small Skill edits and their scenario evidence. The scenarios run inline, as the repository already does in [Skill validation](../../testing/skill-validation.md#method-and-limitation).

**Files:**
- Modify: `.agents/skills/architecture-governance/SKILL.md`: classification also selects Work Class and Execution Mode; the default is `SINGLE_AGENT`; `BOUNDED_MULTI_AGENT` needs every I-4 field.
- Modify: `.agents/skills/pr-readiness/SKILL.md`: the readiness report and PR body gain the line `Agent usage: primary <model>; subagents <n>/<allowed> (<ids, model, purpose>)`. Report FAIL when n exceeds the task's allowance, when any subagent nested, or when the implementer spawned its own reviewer.
- Modify: `docs/testing/skill-validation.md`: add an "ADE agent-usage alignment" RED/GREEN section.

- [ ] **Step 1: RED scenarios.** Run each against the current Skills and record the observed outputs:
  - (S1) "Classify: implement one Services subsection." The current Skill output has no execution mode.
  - (S2) A PR readiness check on a branch whose receipt lists 4 subagents for a task allowed 0. The current Skill does not report FAIL.
- [ ] **Step 2:** Make the minimal Skill edits. Descriptions keep beginning with "Use when", which `docs:check` enforces.
- [ ] **Step 3: GREEN.** Rerun S1 and S2. Expected: S1 yields `SINGLE_AGENT / IMPLEMENTATION / 0`; S2 reports FAIL with the count. Record the results.
- [ ] **Step 4:** Run `npm run docs:check`, `npm run skills:check` (vendored hashes unchanged), `npm run validate`, then `pr-readiness`. Commit `docs(skills): select execution mode and audit agent usage at PR readiness`.

**Acceptance:** There are no vendored Skill edits. Both scenarios are RED before the edits and GREEN after.

## Task 7 / PR 7 – PLAN-SPF-V1 adoption decision

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Starts after:** Task 3 merged; the SPF orchestrator hands over `PLAN-RECORD` (recorded in SPF Progress); the owner approves the adoption text (D1, D4).

**Files:** `docs/plans/active/services-projects-footer-v1.md` (only the **Important implementation decisions** section, plus one Progress line), `docs/plans/index.md` (SPF entry note).

- [ ] **Step 1:** Add a dated decision `ADE-AGENT-USAGE adoption`. Do not rewrite approved packets.
  - Tasks 4 and 6–10 run as `SINGLE_AGENT`.
  - Orchestration follows D1.
  - Task 8's serial cheaper-model handoff follows D4. The Task 7 session names the helper model from models the runtime can call; Luna is not required (D6 amendment).
  - The header's subagent-driven-development recommendation is superseded by `AGENTS.md`.
  - The "separable subtask to Luna" clause requires a recorded per-use owner approval.
  - Independent review and every gate are unchanged. The reviewer model follows the D6 amendment: a fresh session through the `codex` plugin at its default model.
- [ ] **Step 2:** `npm run docs:check` (PLAN-SPF-V1 stays in the legacy exemption), then `npm run validate` and `pr-readiness`. Commit `docs(spf): adopt ADE agent-usage policy for remaining tasks`.

**Acceptance:** Approved history is untouched; remaining SPF tasks have an unambiguous execution mode; routing, TDD, locks and review gates are unchanged.

---

## Acceptance criteria for the whole plan

1. `GOV-AGENT-USAGE` is the single owning record. `AGENTS.md` and the lifecycle link to it. `ADR-ADE-AGENT-USAGE` records D1–D6.
2. `npm run docs:check` rejects any new ACTIVE plan whose tasks lack a valid execution block. The template defaults to `SINGLE_AGENT` with 0 subagents.
3. Claude Code in this repository has depth 1, concurrency 3 and default subagent model `sonnet`, gates or denies spawns per D3, and runs no Opus/Fable subagents. Each control is live-verified or recorded OPEN.
4. Codex in this repository has concurrency 3 and no nested delegation. Each control is live-verified or recorded OPEN.
5. Every delegation-encouraging Skill or plugin in the findings has a recorded ruling. No vendored Skill changed (`npm run skills:check` green).
6. `pr-readiness` reports agent usage and FAILs over-allowance, nested or self-review spawns.
7. TDD, independent review, RFC/ADR/plan governance, validation gates and human merges are unchanged. `npm run validate` is green on `main` after each merge.
8. Every task of this plan was executed as `SINGLE_AGENT`, and its receipt shows `subagents 0/0`.

## Owner decisions D1–D6

The owner accepted every recommendation below on 2026-10-07; see [Important implementation decisions](#important-implementation-decisions). The options stay listed as the decision record.

| ID | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| D1 | **Orchestration model.** How tasks start. | (A) The orchestrator is a coordination-only session: it runs checkpoints and keeps the ledger, and each task starts as its own top-level session. (B) The orchestrator spawns one implementer subagent per task, and that implementer counts as the task's primary agent. | **A.** It matches the target architecture and keeps depth 1 meaningful. Under B, depth must be 2 or `BOUNDED` tasks become impossible, and the orchestrator's context grows with every task. Cost: the owner, or a launcher, starts each task session. |
| D2 | **Codex default.** | (A) Caps only (concurrency 3, depth 1). (B) Project `features.multi_agent = false`, with an opt-in profile or `-c` flag for justified work. | **A** unless Task 5 proves that profile/`-c` opt-in works in the Codex desktop app. B is stronger, but it may leave no opt-in path in the desktop app. |
| D3 | **Claude spawn gate.** | (A) `ask: ["Agent"]` plus the tier/rescue denies. (B) Deny list only. | **A.** Every spawn becomes an explicit human decision. Risk: the `ask` rule might not prompt in auto/bypass modes; Task 4 measures this. |
| D4 | **SPF Task 8 Sonnet→Luna handoff.** | (A) Keep it as Task 8's recorded `BOUNDED_MULTI_AGENT` exception (1 serial helper, cheaper model). (B) Collapse it into one Sonnet session. (C) Split it into two tasks/PRs. | **A.** It is serial, file-disjoint and cost-*reducing*, so it meets the exception criteria. |
| D5 | **Subagent models.** | Claude default `sonnet` with or without `_FORCE`; Codex `default_subagent_model` unset or `gpt-6-luna`. | Claude `sonnet` without `_FORCE`, so plan-named models still win. Codex: unset, with models set per role file. |
| D6 | **This plan's own routing.** | The implementing and reviewing model per task. | Original: docs Tasks 1, 2 and 7 GPT-6 Luna or Sonnet; Tasks 3–6 Sonnet; reviewer a fresh GPT-6.1 Sol session. **Amended 2026-10-07 (owner):** Tasks 2–7 Claude Sonnet; reviewer a fresh session that did not contribute to the PR, started through the `codex` plugin at its default model. Luna and Sol are not required, because the plugin cannot call them. |

## Risks

- **No total-spawn cap exists in either tool.** Sequential fan-out is caught only by the receipt and the reviewer. Treat a receipt with an over-allowance count as a review finding, never a note.
- **Config keys are version-sensitive.** Codex is an alpha build (0.162.0-alpha.2), and the Claude env vars need ≥ 2.1.219 or 2.1.257. Upgrades may rename keys, so the static tests catch removal but not semantic drift. Re-probe after major upgrades.
- **Desktop apps versus the CLI.** Settings honored by `claude -p` or `codex exec` may differ in the desktop apps the owner uses. Tasks 4 and 5 must probe both.
- **User-level plugins stay active.** Superpowers and `codex@openai-codex` live outside the repository. Repository precedence and the `ask`/deny rules mitigate them but do not remove their prompts.
- **In-flight SPF work.** Worktrees cut before Tasks 4 and 5 merge keep the old behavior. Task 7 must not land mid-wave without the orchestrator's `PLAN-RECORD` handoff.
- **An overly strict `ask` gate** may stall unattended or background runs. That is acceptable by design; record a blocked spawn as OPEN instead of bypassing it.

## Progress

- 2026-10-07: Plan authored (PROPOSED) from a read-only ADE inspection by Claude Opus 5.5 in a single session with zero subagents. Configuration keys were checked against current documentation and installed versions, but not live-probed. No ADE files changed.
- 2026-10-07: The owner accepted D1–D6 as recommended. Task 1 started from `main` at `1514860` in `.worktrees/ade-1` on `codex/ade-1-governance`. It adds [`RFC-ADE-AGENT-USAGE-V1`](../../rfcs/ade-agent-usage-v1.md) (PROPOSED), the plan index entry and the status-register entry. Independent review, the owner's merge and Tasks 2–7 are pending.
- 2026-10-07: The owner merged the Task 1 Governance PR (#111) at `86a5fa4`, then amended D6: GPT-6 Luna and GPT-6.1 Sol are no longer required. The plan and RFC are APPROVED. Task 2 started from `86a5fa4` in `.worktrees/ade-2` on `codex/ade-2-policy-record`. It adds `GOV-AGENT-USAGE`, `ADR-ADE-AGENT-USAGE` and the `AGENTS.md` and lifecycle pointers. Independent review, the owner's merge and Tasks 3–7 are pending.
- 2026-10-07: The owner merged Task 2 (#112) at `804567f`. Task 3 started from it in `.worktrees/ade-3` on `codex/ade-3-plan-template-validator`, run `SINGLE_AGENT` with 0 subagents by Claude Sonnet 5.5. It adds `validateExecutionPlans` to the docs validator (11 new tests, 414/414 pass), excludes `.superpowers` from document discovery, gives the plan template its `SINGLE_AGENT` default, and adds a documentation-validation row to the testing strategy. This plan validates under its own rule. Independent review, the owner's merge and Tasks 4–7 are pending.
- 2026-10-07: The owner merged Task 3 (#113) at `d6fbbe2`. Task 4 started from it in `.worktrees/ade-4` on `codex/ade-4-claude-controls` (the worktree was pre-created by a deleted background session and verified clean), run `SINGLE_AGENT` with 0 subagents by Claude Sonnet 5.5. It adds the Claude Code project controls, the read-only specialist agent and `scripts/claude-agent-config.test.mjs` (7 tests). The CLI probes verified depth 1, concurrency 3, the `sonnet` default, the `ask` gate (refused headless in every mode except `dontAsk`, which denies), and the opus, fable and `codex:codex-rescue` denies. The desktop app and the interactive `ask` prompt stay OPEN in `GOV-AGENT-USAGE`. Independent review, the owner's merge and Tasks 5–7 are pending.
- 2026-10-07: The owner merged Task 4 (#114) at `70e324c`. Task 5 started from it in `.worktrees/ade-5` on `codex/ade-5-codex-controls` (the worktree was pre-created by a deleted background session; its untracked probe files were discarded and the probes redone), run `SINGLE_AGENT` with 0 subagents by Claude Sonnet 5.5. It adds `.codex/config.toml` (concurrency 3), the read-only specialist role and `scripts/codex-agent-config.test.mjs` (4 tests). Probing found that `agents.max_depth` is not honored by the multi-agent v2 backend, so no depth key is set and nested delegation stays OPEN in `GOV-AGENT-USAGE`; the desktop app and bundled CLI 0.147.0 could not be probed. Independent review, the owner's merge and Tasks 6–7 are pending.
- 2026-10-07: The owner merged Task 5 (#115) at `75d55b14`. Task 6 started from it in `.worktrees/ade-6` on `codex/ade-6-skill-alignment` (pre-created by a deleted background session; its uncommitted RED write-up was verified against the unchanged Skills and kept), run `SINGLE_AGENT` with 0 subagents by Claude Sonnet 5.5. `architecture-governance` now selects the Work Class and Execution Mode (default `SINGLE_AGENT`, 0 subagents), and `pr-readiness` audits the receipt's `Agent usage` line and FAILs on an over-allowance count, nesting or an implementer-spawned reviewer. S1 and S2 are recorded RED then GREEN in `docs/testing/skill-validation.md`. No vendored Skill changed. Independent review, the owner's merge and Task 7 are pending.
- 2026-10-07: The owner merged Task 6 (#116) at `79d47442`. Task 7 started from it in `.worktrees/ade-7` on `codex/ade-7-spf-adoption`, run `SINGLE_AGENT` with 0 subagents by Claude Sonnet 5.5. It records the dated ADE-AGENT-USAGE adoption decision in PLAN-SPF-V1's Important implementation decisions, one SPF Progress line and the SPF note in the plan index. The SPF orchestrator's `PLAN-RECORD` handoff was not recorded in SPF Progress when the PR was drafted, so the PR waits for that handoff and the owner's approval of the adoption text before merge. Independent review and the owner's merge are pending. Closing this plan (moving it to `completed/`) is a separate step.
- 2026-10-07: **COMPLETED.** The owner merged Task 7 (#117) at `8b593db7` and marked the plan completed. The plan moved from `active/` to `completed/` with its history intact. Delivered, each as a single-agent PR the owner merged: Task 1 #111, Task 2 #112, Task 3 #113, Task 4 #114, Task 5 #115, Task 6 #116, Task 7 #117. Against the acceptance criteria: 1, 2, 5, 6 and 7 are met; 3 and 4 are met on the plan's terms (each control live-verified or recorded OPEN), with the open items below; 8 holds because each PR reports `subagents 0/0` (the probe subagents in Tasks 4 and 5 are the tool under test, as the plan allows). **Open items** (all in [GOV-AGENT-USAGE](../../governance/agent-usage.md)): the Claude and Codex desktop apps were not probed; the interactive Claude `ask` prompt was not observed; nested Codex delegation has no honored configuration (`agents.max_depth` is V1-only); the Codex type deny for `codex:codex-rescue` takes effect only after an `ask` is approved. Re-probe after major Claude Code or Codex upgrades.

## Important implementation decisions

- 2026-10-07, owner: **D1–D6 accept the recommendations.**
  - D1: (A) the orchestrator is a coordination-only session, and each task starts as its own top-level session.
  - D2: (A) Codex uses caps only (concurrency 3, no nested delegation). Revisit (B) if Task 5 proves a desktop opt-in path.
  - D3: (A) Claude uses `ask: ["Agent"]`, plus denies for the `opus` and `fable` tiers and for `codex:codex-rescue`.
  - D4: (A) SPF Task 8's Sonnet→Luna serial handoff is kept as a recorded `BOUNDED_MULTI_AGENT` exception.
  - D5: Claude subagents default to `sonnet` without `_FORCE`. Codex `default_subagent_model` stays unset, and role files set models.
  - D6: Docs Tasks 1, 2 and 7 are implemented by GPT-6 Luna or Claude Sonnet, and Tasks 3–6 by Claude Sonnet. A fresh GPT-6.1 Sol session that did not contribute reviews every PR. **Amended below.**
- 2026-10-07, owner: **D6 amendment.** The Claude-to-Codex plugin cannot call GPT-6 Luna or GPT-6.1 Sol, so both requirements are removed. Claude Sonnet implements Tasks 2–7. Each PR is reviewed by a fresh independent session that did not contribute to it, started through the `codex` plugin at its default model. The reviewer is still a separate session (I-8), never a subagent of the implementer. Other plans keep their own routing until they adopt this policy (PLAN-SPF-V1 through Task 7).

## Deviations discovered during execution

- 2026-10-07: Task 2 is implemented by Claude Sonnet 5.5 (`claude-sonnet-5-5`) in one top-level session with zero subagents, in `.worktrees/ade-2` on `codex/ade-2-policy-record`. The owner amended D6 first (see Important implementation decisions). Besides the listed files, Task 2 also edits this plan (D6 amendment, status APPROVED), the RFC (status APPROVED, D6 row), `docs/rfcs/index.md` and `docs/plans/index.md`, so that no active record still demands Luna or Sol.

- 2026-10-07: Task 1 was implemented by Claude Opus 5.5 (`claude-opus-5-5`, firstParty) in the plan-authoring session, at the owner's direct request. D6 assigns docs tasks to Luna or Sonnet. The change is documentation only, ran `SINGLE_AGENT` with 0 subagents, and still requires independent GPT-6.1 Sol review and the owner's merge.
- 2026-10-07: Codex CLI 0.160.1 (npm) and 0.147.0 (desktop-bundled) were installed, not the 0.162.0-alpha.2 this plan names. Task 5 probed 0.160.1.
- 2026-10-07: Task 5's test "forbids nested delegation (asserts the probed value)" became a test that the config does not claim `max_depth`, because no depth key is honored (the plan says to remove an unhonored key and record it OPEN).
- 2026-10-07: Tasks 4 to 6 were first launched as background sessions that were deleted, leaving pre-created worktrees `ade-4`, `ade-5` and `ade-6`. Task 4's was clean and reused. Task 5's untracked probe files were discarded and the probes redone. Task 6's uncommitted RED write-up was verified against the unchanged Skills and kept.
- 2026-10-07: Each task also edited this plan's Progress, and Task 2 edited the RFC, indexes and register beyond its listed files. Task 2 amended D6 to drop the GPT-6 Luna and GPT-6.1 Sol requirements, because the Claude-to-Codex plugin cannot call them.
