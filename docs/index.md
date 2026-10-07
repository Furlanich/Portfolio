---
id: DOCS-INDEX
type: documentation-index
status: APPROVED
related:
  - GOV-AGENT-USAGE
  - PLAN-SPF-V1
  - REVIEW-SPF-PLAN-2026-09-30
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
  - REVIEW-SPF-DESIGN-2026-09-30
  - REVIEW-ADAPTIVE-IMMERSIVE-HOMEPAGE-ACCEPTANCE-V1
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - REVIEW-VISUAL-IDENTITY-G0-G1-2026-09-20
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - REF-CONTACT-DEMO-KIT
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-STUDIO-FOUNDER-COMPLETION
  - RFC-SKY-CHART-VISUAL-SYSTEM-V2
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
  - REVIEW-SKY-CHART-ACCEPTANCE-V2
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PROJECT-EVIDENCE
  - TEST-STRATEGY
  - SUPERPOWERS-README
last_verified: 2026-10-05
---

# FURLANICH project knowledge

This directory is the authoritative source for durable FURLANICH product, content, design, and known-system knowledge. It is written to remain useful independently of any chat, coding agent, or vendor.

When documentation and conversation history disagree, this documentation wins. When approved documentation and the current application disagree, the documentation describes the intended product and the application describes the current implementation.

## Status vocabulary

- **APPROVED** — explicitly agreed or clearly established as the current direction.
- **PROPOSED** — a serious candidate that has not received definitive approval.
- **OPEN** — requires a future decision or missing evidence.
- **REJECTED** — considered and intentionally not selected.

Front matter records the overall governance status of a document. In mixed-status documents, explicit item-level **APPROVED**, **PROPOSED**, **OPEN**, and **REJECTED** markers are authoritative.

## Start here

- [Knowledge management](governance/knowledge-management.md): authority, status, maintenance, and update rules.
- [Status register](governance/status-register.md): approved, proposed, open, and rejected decisions in one place.
- [Product index](product/index.md): business purpose, audiences, services, information architecture, page specifications, and migration requirements.
- [Design index](design/index.md): approved homepage-foundation visual/interaction baseline, existing-system context, and broader unsettled design areas.
- [Architecture index](architecture/index.md): current implementation facts and known quality findings; it is not a target-architecture decision.
- [Architecture map](../ARCHITECTURE.md): concise current-system entry point, approved product constraints, and proposed/open architecture context.
- [Engineering lifecycle](governance/engineering-lifecycle.md): change classification, autonomy boundaries, traceability, and PR rules.
- [Agent usage](governance/agent-usage.md): one task = one primary agent, bounded subagents, Claude Code and Codex controls, and Skill overrides.
- [RFCs](rfcs/index.md), [ADRs](decisions/index.md), and [execution plans](plans/index.md): consequential proposals, accepted architecture history, and substantial-work records.
- [Testing strategy](testing/strategy.md): TDD, deterministic, browser, accessibility, visual, and static-export verification layers.
- [Project-local process Skills](superpowers/README.md): pinned Taste/Superpowers provenance and methodology artifact locations.
- [Marketing and presentation audit](reviews/marketing-presentation-2026-09-15/index.md): deployed bilingual review, evidence, scores and proposed corrections; no new copy/design approval. [T6 comparison](reviews/marketing-presentation-excellence-v1/index.md) records the post-T1–T5 status without replacing the original review.
- [Research references](references/market-and-design-references.md): external sources that informed earlier positioning and evidence discussions.
- [Domain glossary](../CONTEXT.md): canonical project-specific terminology.

## Current documentation stage

The [Services/Projects/Footer design](design/services-projects-footer-v1.md) follows the merged Sky Chart Home/App Bar and the [Aureon comparison](reviews/aureon-comparison-2026-09-29.md). Its [review package](reviews/services-projects-footer-design-2026-09-30/index.md) contains three alternatives and the approved Revision 5 field: localized capability words, slow idle rotation and rapid fluid connections from the first scroll. On 2026-09-30 the owner approved the written specification and linked ES/EN copy, then authorized ADE v2 planning and independent review. [RFC-SPF-REDESIGN-V1](rfcs/services-projects-footer-redesign-v1.md) records the accepted narrow runtime/IA supersessions. Production remains unchanged; human plan approval and PR merges remain mandatory. Historical implementation descriptions below remain records of delivered baselines; they do not assert that route retirement is deployed.

[PLAN-SPF-V1](plans/active/services-projects-footer-v1.md) is **APPROVED 2026-10-05** ([owner authorization](reviews/services-projects-footer-plan-review-2026-09-30.md#owner-approval-2026-10-05)). Fresh independent GPT-6.1 Sol round 6 and correction verification returned zero unresolved findings. Revision 5 closes the Services evidence-test ownership, premature live enablement, current-status synchronization and Home Founder architecture-summary findings; [Sonnet/Luna/Sol routing](plans/active/services-projects-footer-v1.md#model-routing) remains owner-approved. Historical review rounds are preserved. Task 1 packages its acceptance scaffold/receipt in a new Governance PR; PR #104 merged on 2026-10-05 and passed CI. W1 starts only after the Task 1 Governance PR is human-merged and W0 passes. Physical-device and production acceptance remain implementation gates; production is unchanged.

Stage A preserves product and design knowledge, and Stage B adds the lightweight engineering harness. Stage C accepted the homepage-foundation localized-routing architecture in [`ADR-STATIC-LOCALIZED-ROUTING`](decisions/static-localized-routing.md); [`PLAN-HOMEPAGE-FOUNDATION`](plans/completed/homepage-foundation.md) records its completed four-PR delivery.

Initiative 2 closes the commercial homepage sections below `HOME-HERO` in [`PAGE-HOME`](product/pages/home.md), including complete Spanish/English copy, minimum later-section design rules, a readiness matrix, and an approved evidence-safe `HOME-PROOF` fallback. [`PROJECT-EVIDENCE`](product/project-evidence.md) records that no current project is eligible for a homepage card. [`PLAN-HOMEPAGE-COMPLETION`](plans/completed/homepage-completion.md) records the completed behavior-neutral content/anchor contract and atomic bilingual rendered integration; project cards and other release/full-site concerns remain OPEN in their owners.

Initiative 3 delivered the complete Services experience specified by [`PAGE-SERVICES`](product/pages/services.md): the retained hierarchy, full Spanish and English content, stable service anchors, contextual inquiry paths, provider and commercial boundaries, AI posture, honest asymmetric evidence treatment, and page-specific visual/accessibility extensions. [`AUDIENCES-SERVICES`](product/audiences-and-services.md) owns the service definitions and [`PROJECT-EVIDENCE`](product/project-evidence.md) owns the item-level publication limits. The implementation fits the accepted localized architecture and is recorded by [`PLAN-SERVICES-EXPERIENCE`](plans/completed/services-experience.md); richer evidence and final contractual/legal terms remain deferred in their owners.

Initiative 4 closes the Projects/Evidence product and design decisions in [`PAGE-PROJECTS`](product/pages/projects.md), [`PROJECT-EVIDENCE`](product/project-evidence.md), the [item-level inventory](product/projects/index.md), and the [experience specification](product/projects/experience.md). It approves the public taxonomy, hybrid inventory-sensitive IA, card/detail/imagery rules, bilingual system language, confidentiality treatment, accessibility, performance, and visual-QA criteria. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](plans/completed/projects-evidence-experience.md) records the completed work within the accepted static localized architecture: Task 2 publishes the index, Task 3 publishes exactly three paired summary-only detail pages with labeled conceptual visuals, and Task 4 retires the verified-unused legacy project paths. Homepage eligibility remains deferred; launch filters and empty groups remain rejected, and the approved homepage proof fallback is unchanged.


Initiative 5 closes the distinct Studio and Founder experiences in [PAGE-STUDIO / PAGE-FOUNDER](product/pages/studio-and-founder.md): exact Spanish and English content, route/navigation responsibilities, direct-accountability and collaborator language, operating principles, location/availability, professional history, education, grouped capabilities, Projects and Contact bridges, CV/professional-link treatment, portrait deferral, duplication boundaries, visual compositions, responsive behavior, accessibility, and implementation readiness. The corresponding page extensions are approved in [DESIGN-VISUAL](design/visual-language.md#studio-and-founder-visual-baseline-approved) and [DESIGN-IX-A11Y](design/interaction-responsive-accessibility.md#studio-and-founder-interaction-and-responsive-baseline-approved). Implementation is classified as substantial approved work and is recorded by [`PLAN-STUDIO-FOUNDER-COMPLETION`](plans/completed/studio-founder-completion.md), a completed four-PR, test-first sequence within ADR-STATIC-LOCALIZED-ROUTING. No RFC or new ADR is required.

## Initiative 6 — Contact and inquiry decision closure

[`PAGE-CONTACT / PAGE-PRIVACY`](product/pages/contact-and-privacy.md) owns the four-field experience, bilingual demonstration and dormant commercial copy, state model, fallbacks, factual privacy scope, and verification boundaries. [`DESIGN-VISUAL`](design/visual-language.md) and [`DESIGN-IX-A11Y`](design/interaction-responsive-accessibility.md) own the Contact-specific visual, responsive, semantic, focus, status, and zero-transmission behavior.

[`RFC-CONTACT-INQUIRY-PIPELINE`](rfcs/contact-inquiry-pipeline.md) and [`ADR-CONTACT-INQUIRY-PIPELINE`](decisions/contact-inquiry-pipeline.md) preserve Formspree behind `submitInquiry()` for a future commercial activation. The provider-neutral types, validator, and adapter are merged but dormant.

[`ADR-CONTACT-INQUIRY-DEMO-MODE`](decisions/contact-inquiry-demonstration-mode.md) records the current deployment decision: `https://furlanich.github.io/Portfolio/` remains a non-commercial portfolio/technical demonstration, and its public form simulates outcomes locally without sending or storing values. [`REF-CONTACT-DEMO-KIT`](references/contact-inquiry-demonstration/index.md) provides the approved synthetic resources. [`PLAN-CONTACT-INQUIRY-PIPELINE`](plans/completed/contact-inquiry-pipeline.md) records the completed demonstration Privacy/Contact implementation and deployed zero-transmission proof. Real processor/legal/inbox/deletion gates remain OPEN for a separately reviewed commercial activation.

## Marketing narrative decision review — PROPOSED

[The review package](reviews/marketing-decision-closure-2026-09-15/index.md) provides owner-level bilingual copy comparisons, evidence/CTA tables, nine page outlines and five-width low-fidelity studies. [RFC-MARKETING-NARRATIVE-CLOSURE](rfcs/marketing-narrative-closure.md) covers the proposed narrative and evidence-discovery changes. D01, D02, D04, D05, D06 and D07 were explicitly APPROVED on 2026-09-16; D03 was REJECTED. The D03 baseline remains effective, and no unaccepted item-level exception or commercial activation is inferred. Other existing approvals, the demonstration ADR and evidence restrictions remain operative. The original decision review contained no application change or execution plan. The subsequently authorized [completed PLAN-MARKETING-PRESENTATION-EXCELLENCE](plans/completed/marketing-presentation-excellence-v1.md) is APPROVED / COMPLETED under Route B after human merges of PRs #55–#59, with D03 preserved and no further implementation PR authorized by this plan.

## Visual identity and immersive experience v1 — IMPLEMENTED

[`RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1`](rfcs/visual-identity-immersive-experience-v1.md) established the identity and prototype boundary. The approved [throwaway prototype review](reviews/immersive-homepage-prototype-2026-09-19/index.md) records the bilingual five-width matrix, failure behavior, direct Three.js feasibility, React Three Fiber 8 incompatibility and payload evidence. [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](rfcs/adaptive-immersive-homepage-production-v1.md) approves C2 Adaptive System Instrument, the governed hybrid-media boundary, responsive choreography and production gates. [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](decisions/adaptive-immersive-homepage.md) supersedes the earlier prototype ADR. The [G0/G1 review](reviews/contained-master-optical-closure-2026-09-20/index.md) approves Balanced Contained as the exact protected geometry and Operational Clarity as the exact bilingual chapter voice. The completed [`PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1`](plans/completed/visual-identity-adaptive-immersive-v1.md) delivered the identity, static C2 homepage and direct Three.js enhancement through PRs #65–#69 and #71–#73; the optional Connection film (PR7) is omitted. The [acceptance record](reviews/adaptive-immersive-homepage-acceptance-v1/index.md) records passing automated evidence and defers constrained Android evidence, a real screen-reader spot check and the compact Pause-control placement to a follow-up execution plan.

## Sky Chart Home and App Bar v2 — IMPLEMENTED, manual QA DEFERRED

[`RFC-SKY-CHART-VISUAL-SYSTEM-V2`](rfcs/sky-chart-visual-system-v2.md) (Governance PR #77) accepted the owner's Direction A · Sky Chart, recorded in the [direction review](reviews/sky-chart-direction-2026-09-23/index.md). [`ADR-SKY-CHART-HOMEPAGE-RUNTIME`](decisions/sky-chart-homepage-runtime.md) supersedes the C2 instrument runtime for Home: a full-viewport star-atlas environment behind atlas-plate and plotting-sheet content, with a floating chart-header App Bar on every route. The approved `SKY-CHART-V2` sections of [DESIGN-VISUAL](design/visual-language.md#sky-chart-v2-sky-chart-home-and-app-bar-approved) and [DESIGN-IX-A11Y](design/interaction-responsive-accessibility.md#sky-chart-v2-sky-chart-home-and-app-bar-approved) and the `HOME-IMPACT` section of [PAGE-HOME](product/pages/home.md#home-impact) remain APPROVED. The completed [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](plans/completed/sky-chart-home-redesign-v2.md) delivered them through twelve task/PR packets, with checkpoints W0–W3 recorded in its Progress. [ARCHITECTURE](../ARCHITECTURE.md) and the [current system](architecture/current-system.md) describe the shipped implementation.

The [acceptance record](reviews/sky-chart-acceptance-v2/index.md) records the passing automated evidence and every section 14 gate that automation can measure. It records the section 26 manual protocol (real devices including constrained Android, NVDA and VoiceOver, other browsers, user preferences, content truth and the side-by-side design check) and the two hardware-GPU gates as **DEFERRED**: none has been performed, so none is reported as PASS. The record is **APPROVED** (owner decision, 2026-10-05, effective when the follow-up PR merges): that accepts the record with its deferrals, not a manual pass. The same decision put Founder on an atlas plate.
