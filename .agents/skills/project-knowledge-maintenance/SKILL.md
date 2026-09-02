---
name: project-knowledge-maintenance
description: Use when a product, design, architecture, glossary, status, or documentation-index change must be persisted and synchronized in FURLANICH.
---

# Project knowledge maintenance

## Trigger

Use this procedure for a material knowledge change: a changed requirement, decision, status, page or design rule, glossary term, architecture constraint, or documentation index. Routine spelling and formatting fixes do not need this Skill.

## Purpose

Persist the change in its authoritative owner and keep dependent references coherent without silently changing approval status or product intent. The repository is the source of truth; conversation is only the working medium.

## Inputs

- The decision, requirement, or new evidence.
- Its explicit status: `APPROVED`, `PROPOSED`, `OPEN`, or `REJECTED`.
- The owning document or stable requirement ID, when known.
- The product, design, architecture, glossary, status, or index domains affected.

## Procedure

1. Read [`docs/index.md`](../../../docs/index.md), [`docs/governance/knowledge-management.md`](../../../docs/governance/knowledge-management.md), and the current owning document. Use the ownership map there; do not infer product authority from the current application.
2. Search for the stable ID, old wording, and links to locate dependent page specifications, design guidance, indexes, and status summaries. Inspect likely dependencies even when their links still resolve.
3. Edit the authoritative owner once. Update summaries and indexes only when they become stale; link to the owner instead of copying normative requirements or exact public copy.
4. Keep front-matter `status` at document scope. In mixed-status documents, preserve explicit item-level markers. Keep an unresolved choice `OPEN`; do not upgrade or downgrade an item because its wording is polished.
5. Update `related` metadata and `last_verified` only in documents whose content changed. Preserve stable IDs and record meaningful superseded alternatives only when future confusion is likely.
6. Inspect the documentation-only diff for contradictions, duplicated normative content, conversational provenance, confidential material, and accidental implementation edits.

## Expected outputs

Provide a concise change record containing:

- authoritative and dependent files changed, with stable IDs;
- status changes, or an explicit statement that statuses were preserved;
- unresolved questions left `OPEN`;
- the exact validation command and result.

## Validation

Run `npm run docs:check` from the repository root. Resolve structural failures before reporting completion. A passing check does not prove semantic synchronization, so manually confirm that each affected dependency was considered and that the final diff is scoped to knowledge files.

## Failure and escalation

When authority conflicts, approval is missing, confidentiality may be affected, or no owner is clear, preserve the question as `OPEN`, avoid speculative edits, and route a consequential choice through the [engineering lifecycle](../../../docs/governance/engineering-lifecycle.md). Escalate unresolved architectural or product decisions rather than silently creating a new requirement.
