---
id: PLAN-TEMPLATE
type: execution-plan-template
status: APPROVED
plan_status: ACTIVE
related:
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-02
---

# Execution plan template

Copy this file into `docs/plans/active/` for substantial work. Use `plan_status: ACTIVE` while executing and `plan_status: COMPLETED` when moving it to `completed/`.

```yaml
id: PLAN-<stable-topic-id>
type: execution-plan
status: APPROVED
plan_status: ACTIVE # ACTIVE or COMPLETED
execution_policy: ADE-AGENT-USAGE-V1
related:
  - <requirement-or-rfc-id>
  - <adr-id-when-applicable>
last_verified: YYYY-MM-DD
```

## Objective

## Requirements implemented

## Affected architecture

## Relevant ADRs

## Scope

## Non-goals

## Implementation phases

## Task packets

Give every task heading (`## Task <n> / PR <n> – <purpose>`) exactly one `**Execution**` block, written as consecutive lines with no blank line inside. The block defaults to one primary agent and no subagents. `npm run docs:check` rejects an active plan with a missing or invalid block. The policy, work classes and override rules are owned by [GOV-AGENT-USAGE](../governance/agent-usage.md).

```text
**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0
```

Use the exceptional form only when sequential work by the primary agent is materially worse. Every field is required and must not be a placeholder. `Subagents Allowed` is 1–3 and must equal the number of numbered responsibilities.

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

## Expected affected areas

## Validation

## Risks

## Progress

## Important implementation decisions

## Deviations discovered during execution
