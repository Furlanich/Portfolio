---
id: PLAN-INDEX
type: execution-plan-index
status: APPROVED
related:
  - PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1
  - REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - GOV-ENGINEERING-LIFECYCLE
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-STUDIO-FOUNDER-COMPLETION
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
last_verified: 2026-09-24
---

# Execution plans

Use lightweight in-task planning for small, bounded, reversible work. Use a versioned plan for substantial, multi-file, risky, or multi-phase work. Versioned plans live in `active/` while executing and move to `completed/` with their implementation history intact.

- [Plan template](template.md)
- [Completed Stage B harness plan](completed/stage-b-agent-engineering-harness.md)

## Active

- [PLAN-SKY-CHART-HOME-REDESIGN-V2](active/sky-chart-home-redesign-v2.md): **APPROVED**. Sky Chart Home and App Bar redesign in twelve task/PR packets across five waves. Gate G1 passed when the owner approved and merged [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../rfcs/sky-chart-visual-system-v2.md) as Governance PR #77 (`70168e9`); Task 2 / PR 2 recorded [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../decisions/sky-chart-homepage-runtime.md) and the approved design/product sections. Implementation Wave 1 unlocks once checkpoint W0 passes. Direction evidence: [REVIEW-SKY-CHART-DIRECTION-2026-09-23](../reviews/sky-chart-direction-2026-09-23/index.md).

## Completed

- [PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1](completed/visual-identity-adaptive-immersive-v1.md): APPROVED / COMPLETED identity, static C2 homepage and direct Three.js enhancement through PRs #65–#69 and #71–#73; PR7 omitted. Constrained Android evidence, a real screen-reader spot check and the compact Pause-control placement are deferred to a follow-up execution plan.
- [PLAN-MARKETING-PRESENTATION-EXCELLENCE](completed/marketing-presentation-excellence-v1.md): APPROVED / COMPLETED Route B plan for D01, D02, D04, D05, D06 and applicable D07; D03 remains REJECTED. Six sequential bilingual implementation PRs were completed through human merges of PRs #55–#59.
- [`PLAN-CONTACT-INQUIRY-PIPELINE`](completed/contact-inquiry-pipeline.md): completed the bilingual demonstration Privacy and Contact experience, deployed zero-transmission proof, and preserved future commercial activation gates.
- [`PLAN-STUDIO-FOUNDER-COMPLETION`](completed/studio-founder-completion.md): completed the four-PR bilingual Studio experience, Founder profile, cross-page integration, evidence links, and verification sequence.
- [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](completed/projects-evidence-experience.md): completed the fail-closed public content boundary, bilingual Projects index, approved paired detail routes, legacy project-path cleanup, and evidence-boundary verification.

- [`PLAN-HOMEPAGE-FOUNDATION`](completed/homepage-foundation.md): delivered the accepted localized route foundation, minimum destinations, Founder migration, business hero, atomic cutover, and evidence-driven legacy-localization cleanup in four reviewable implementation PRs.
- [`PLAN-HOMEPAGE-COMPLETION`](completed/homepage-completion.md): delivered the approved bilingual commercial homepage sections below `HOME-HERO`, the evidence-safe `HOME-PROOF` fallback, and localized Process navigation in one atomic rendered integration.
- [`PLAN-SERVICES-EXPERIENCE`](completed/services-experience.md): delivered the complete approved bilingual Services experience, stable service anchors, honest evidence treatment, and accessible responsive behavior in three reviewable implementation PRs.
