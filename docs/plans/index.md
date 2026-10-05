---
id: PLAN-INDEX
type: execution-plan-index
status: APPROVED
related:
  - REVIEW-SPF-PLAN-2026-09-30
  - PLAN-SPF-V1
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
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
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
last_verified: 2026-10-05
---

# Execution plans

Use lightweight in-task planning for small, bounded, reversible work. Use a versioned plan for substantial, multi-file, risky, or multi-phase work. Versioned plans live in `active/` while executing and move to `completed/` with their implementation history intact.

- [Plan template](template.md)
- [Completed Stage B harness plan](completed/stage-b-agent-engineering-harness.md)

## Active

- [PLAN-SPF-V1](active/services-projects-footer-v1.md): **APPROVED (revision 5, 2026-10-05)** under the [owner authorization](../reviews/services-projects-footer-plan-review-2026-09-30.md#owner-approval-2026-10-05), after fresh independent GPT-6.1 Sol round 6 and correction verification returned zero unresolved findings. Ten ADE v2 task/PR packets retain the [approved Sonnet/Luna/Sol routing](active/services-projects-footer-v1.md#model-routing), exclusive ownership, Skills contract, wave checkpoints and strict behavioral TDD. Task 3 now owns the GRS Services test migration before Task 6; both live tiers stay disabled until hardware evidence passes. [Historical review outcomes](../reviews/services-projects-footer-plan-review-2026-09-30.md) are preserved. Task 1 still packages its acceptance scaffold/receipt; W1 starts only after its Governance PR is human-merged and W0 passes. Production remains unchanged.

## Completed

- [PLAN-SKY-CHART-HOME-REDESIGN-V2](completed/sky-chart-home-redesign-v2.md): APPROVED / COMPLETED on 2026-10-05, **with manual QA DEFERRED**. Sky Chart Home and App Bar redesign delivered through twelve task/PR packets across five waves (Governance PRs #77 and #78; implementation PRs #79–#92, with #96 and #97 as supporting fixes). Checkpoints W0–W3 are green and recorded in the plan's Progress; every section 14 gate that automation can measure is within limits. The section 26 manual protocol and the two hardware-GPU gates (scroll frame interval p95 and the interaction task) have not been performed and are recorded as DEFERRED in the [acceptance record](../reviews/sky-chart-acceptance-v2/index.md) (`REVIEW-SKY-CHART-ACCEPTANCE-V2`, APPROVED by the owner on 2026-10-05 with those deferrals). Checkpoint W4 passed on `main` at `e8703ee`; the owner's follow-up decisions (Founder atlas plate, the APPROVED record, two comment fixes) are in the plan's Deviations. Governed by [`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](../rfcs/sky-chart-visual-system-v2.md) and [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](../decisions/sky-chart-homepage-runtime.md); direction evidence: [REVIEW-SKY-CHART-DIRECTION-2026-09-23](../reviews/sky-chart-direction-2026-09-23/index.md).
- [PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1](completed/visual-identity-adaptive-immersive-v1.md): APPROVED / COMPLETED identity, static C2 homepage and direct Three.js enhancement through PRs #65–#69 and #71–#73; PR7 omitted. Constrained Android evidence, a real screen-reader spot check and the compact Pause-control placement are deferred to a follow-up execution plan.
- [PLAN-MARKETING-PRESENTATION-EXCELLENCE](completed/marketing-presentation-excellence-v1.md): APPROVED / COMPLETED Route B plan for D01, D02, D04, D05, D06 and applicable D07; D03 remains REJECTED. Six sequential bilingual implementation PRs were completed through human merges of PRs #55–#59.
- [`PLAN-CONTACT-INQUIRY-PIPELINE`](completed/contact-inquiry-pipeline.md): completed the bilingual demonstration Privacy and Contact experience, deployed zero-transmission proof, and preserved future commercial activation gates.
- [`PLAN-STUDIO-FOUNDER-COMPLETION`](completed/studio-founder-completion.md): completed the four-PR bilingual Studio experience, Founder profile, cross-page integration, evidence links, and verification sequence.
- [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](completed/projects-evidence-experience.md): completed the fail-closed public content boundary, bilingual Projects index, approved paired detail routes, legacy project-path cleanup, and evidence-boundary verification.

- [`PLAN-HOMEPAGE-FOUNDATION`](completed/homepage-foundation.md): delivered the accepted localized route foundation, minimum destinations, Founder migration, business hero, atomic cutover, and evidence-driven legacy-localization cleanup in four reviewable implementation PRs.
- [`PLAN-HOMEPAGE-COMPLETION`](completed/homepage-completion.md): delivered the approved bilingual commercial homepage sections below `HOME-HERO`, the evidence-safe `HOME-PROOF` fallback, and localized Process navigation in one atomic rendered integration.
- [`PLAN-SERVICES-EXPERIENCE`](completed/services-experience.md): delivered the complete approved bilingual Services experience, stable service anchors, honest evidence treatment, and accessible responsive behavior in three reviewable implementation PRs.
