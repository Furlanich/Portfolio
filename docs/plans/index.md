---
id: PLAN-INDEX
type: execution-plan-index
status: APPROVED
related:
  - GOV-ENGINEERING-LIFECYCLE
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
last_verified: 2026-09-04
---

# Execution plans

Use lightweight in-task planning for small, bounded, reversible work. Use a versioned plan for substantial, multi-file, risky, or multi-phase work. Versioned plans live in `active/` while executing and move to `completed/` with their implementation history intact.

- [Plan template](template.md)
- [Completed Stage B harness plan](completed/stage-b-agent-engineering-harness.md)

## Active

- [`PLAN-HOMEPAGE-COMPLETION`](active/homepage-completion.md): governs the two-PR delivery of the approved bilingual homepage sections below `HOME-HERO`, using the evidence-safe `HOME-PROOF` fallback within the accepted localized-static architecture.

## Completed

- [`PLAN-HOMEPAGE-FOUNDATION`](completed/homepage-foundation.md): delivered the accepted localized route foundation, minimum destinations, Founder migration, business hero, atomic cutover, and evidence-driven legacy-localization cleanup in four reviewable implementation PRs.
