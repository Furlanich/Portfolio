---
name: architecture-governance
description: Use when a proposed repository change must be classified before implementation, especially when routing, hosting, dependencies, styling, security, product structure, or architecture may be consequential.
---

# Architecture governance

## Trigger

Use this procedure before implementing a requested change when its scope, risk, or architectural impact is unclear. It is also appropriate when a change may affect routing, deployment, major dependencies, styling architecture, CMS or backend boundaries, authentication, security, information architecture, or an accepted decision.

## Purpose

Route work through the smallest appropriate repository record while preserving human authority over consequential product and architectural decisions. This skill classifies work; it does not approve a proposal, invent a product requirement, or replace human review at the Pull Request boundary.

## Inputs

Collect:

- the requested intent and acceptance criteria;
- relevant product and design requirements, including stable IDs;
- [the architecture map](../../../ARCHITECTURE.md), accepted ADRs, active RFCs, and active plans;
- the affected source, configuration, tests, deployment files, and existing validation commands;
- known security, privacy, data, migration, rollback, and user-impact constraints.

If repository truth conflicts with chat context, use the repository and record the discrepancy for human review.

## Procedure

1. Identify the requested outcome, affected surfaces, stable requirement IDs, and whether the change is reversible.
2. Check accepted ADRs and active RFCs before proposing a new decision. Do not silently rewrite or supersede them.
3. Classify the work using the first applicable route:

   | Route | Use when | Required handoff |
   | --- | --- | --- |
   | **Direct implementation** | Routine, bounded, reversible work within accepted product and architecture; no consequential boundary or decision changes. | Implement, validate, synchronize owning docs, self-review, and open an implementation PR. |
   | **Versioned execution plan** | Multi-file, multi-phase, risky, difficult to reverse, or substantial work whose architecture is already accepted. | Create or update an active plan before implementation; record scope, non-goals, phases, validation, risks, progress, and deviations. |
   | **Governance RFC** | A consequential change is proposed and requires agreement before implementation: routing/hosting/deployment architecture, major UI framework or styling architecture, CMS, authentication, server-side backend, major information architecture/design-system architecture, or security-sensitive structural work. | Draft an RFC with context, problem, requirements, approach, alternatives, tradeoffs, impact, risks, unresolved questions, recommendation, and status; open a governance PR. Do not implement the consequential change in that PR. |
   | **ADR** | A consequential architectural decision has already been accepted through the appropriate human-reviewed path and needs a durable historical record. | Add an immutable ADR recording context, decision, rationale, consequences, rejected alternatives, related RFC/requirements, date, and status; link implementation work to it. |

4. Apply precedence deliberately. If an RFC is required, it comes before implementation. An ADR records an accepted decision after approval; it is not a substitute for an RFC or approval. A plan may accompany either route when execution is substantial, but a plan cannot authorize an unresolved consequential decision.
5. Produce the route as a deterministic handoff. Include the classification, evidence, affected requirement/architecture IDs, required artifact, implementation boundary, validation commands, unresolved questions, and approval needed.
6. Re-check classification if scope changes during execution. Pause implementation and route the new decision through an RFC/governance PR when a previously routine change becomes consequential.

## Decision heuristics

- A new page within the existing App Router, using established components and static-export constraints, is usually direct implementation; use a plan if it is broad or multi-phase.
- Replacing the routing model, adding a CMS/authentication/backend, changing hosting/static export, or introducing a major UI/styling framework normally requires an RFC before implementation.
- A security-sensitive change is governance work even if the code diff is small. Escalate authentication, privacy/data handling, secret management, or publication-permission boundaries when the accepted records do not settle them.
- A proposed decision that has not been accepted is not an ADR. An implementation that depends on an open product choice is not ready for autonomous coding.

## Expected outputs

Return a concise classification packet:

```text
Route: DIRECT | PLAN | RFC | ADR (or a justified combination)
Evidence: repository records and files inspected
Requirements: stable product/design IDs
Affected architecture: current/accepted/proposed/open records
Required artifact: path and status, or "none"
Implementation boundary: what may and may not be changed now
Validation: exact commands and expected gates
Unresolved questions: OPEN items preserved verbatim
Approval: whether human review is required before implementation
```

For a governance route, leave the proposed change unimplemented and hand off the RFC PR. For an accepted decision, link the ADR and any execution plan from the implementation PR.

## Validation

- Confirm every referenced file and stable ID exists and every internal link resolves.
- Confirm the selected route matches the lifecycle guide and does not silently alter an approved requirement or ADR.
- Confirm RFCs are marked as proposals and have not been treated as approval.
- Confirm ADRs are only created for accepted decisions and that supersession creates a new record rather than rewriting history.
- Run the repository's deterministic checks appropriate to the scope; at minimum use `npm run docs:check` for documentation changes and the relevant lint/typecheck/test/build commands before the PR.
- Self-review the diff for accidental application changes, secrets, unrelated scaffolding, or unresolved questions that were incorrectly decided.

## Failure and escalation

Escalate through a governance PR when repository records disagree, the requested change crosses a consequential boundary, required approval is absent, or security/privacy/publication impact is not settled. Keep the item **OPEN** and name the exact question. Do not resolve ambiguity by inventing a requirement, approving an RFC, superseding an ADR, weakening validation, or modifying `main` directly.
