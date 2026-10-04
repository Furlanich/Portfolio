---
id: RFC-SPF-REDESIGN-V1
type: request-for-comments
status: APPROVED
related:
  - DESIGN-SPF-V1
  - REVIEW-SPF-DESIGN-2026-09-30
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-FOUNDER
  - IA-SITE
  - PROJECT-EVIDENCE
  - ADR-SKY-CHART-HOMEPAGE-RUNTIME
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-30
---

# Connected Services, inline Projects and branded Footer

## Context

The owner requested a design-first bilingual redesign using the [Aureon comparison](../reviews/aureon-comparison-2026-09-29.md) and the current Sky Chart Home/App Bar as primary references. The research checkout was `abdfb15`, which includes the report and the merged Home implementation/posters; `main` was `f7a8620` at inspection. The comparison's earlier deployed/local discrepancy is historical. Complete Home manual acceptance remains unestablished here. The proposed specification was saved in `df06ca1`, then refined as Revision 5 in `a64f3c4`. On 2026-09-30 the owner approved that design/copy and authorized ADE v2 planning and independent review.

Three materially different disposable directions were rendered: direct editorial Atlas, sticky spatial Systems in Layers, and image-led Visual Dossier. The owner selected Atlas service hierarchy and Dossier project presentation, then requested moving connected-node backgrounds, logo presence in the Footer, complete project information on the index and stronger motion. The owner explicitly chose definitive retirement of all six localized detail URLs, MPC on Founder, and simplified live 3D on capable phones. Revision 4 explored stronger nodes/paths and depth. The latest Revision 5 request is a field scattered across the visible page, slow node rotation even at rest, rapid fluid motion from the first scroll, enough progressive connections through the page and eight named capability words on the nodes.

## Problem

Current Services/Projects present accurate information but have less personality and visual continuity than the new Home. Project detail navigation adds another reading step. The shared Footer can provide a clearer, more intentional conclusion. Extending WebGL beyond Home and retiring published route pairs are consequential changes to accepted boundaries; they cannot be treated as ordinary styling or silently inherited from an old ADR.

## Requirements

The [proposed design specification](../design/services-projects-footer-v1.md) owns exact composition, responsive behavior, motion, 3D/fallback/loading/performance and acceptance criteria. Proposed bilingual copy is in the owning [Services](../product/pages/services.md#spf-v1-proposed-services-copy), [Projects](../product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation) and [IA](../product/information-architecture.md#spf-v1-proposed-footer-copy-and-route-retirement) blocks. The [review package](../reviews/services-projects-footer-design-2026-09-30/index.md) records exploration and observed checks.

Keep the protected mark/type/palette, evidence permissions, founder-led accountability, real direct channels, current localized static-export architecture and simulated zero-transmission Contact behavior. No production code is implemented in this design/planning session. Written design approval is recorded; human plan approval and the governance PR merge remain prerequisites to implementation.

## Proposed approach

Adopt Atlas service catalogue plus three outcome-led service chapters, two complete inline project dossiers and an Azure Footer with the whole foreground mark and a complete static watermark. Extend direct Three.js to Services/Projects only, behind semantic HTML, with shared chart grammar and a viewport-wide labeled field: 16 nodes/33 connections wide and eight/13 compact. Use native scroll, immediate velocity-responsive motion/connection growth and simplified capable-phone geometry. Visible eligible fields have a low-rate idle rotation loop; this explicitly replaces the earlier demand-only candidate. Pause, hidden tabs, reduced motion, Save-Data, unsupported/software WebGL and failure stop motion or use a complete static alternative. Upright occlusion-safe words plus semantic vocabulary, focus preservation, one renderer, session context-loss suppression and measured route budgets are mandatory. “Agents” retains the scoped human-supervision AI boundary, not a new autonomous-service promise.

Retire all old project-detail pairs without compatibility pages or redirects. Move useful permitted story data/illustrations into the index, map active links to index fragments or MPC's approved external source, delete genuinely unused detail-only files and verify clean export absence. Preserve immutable evidence/history and stable internal project IDs. The design's supersession table defines the precise exception set; accepted requirements outside it remain authoritative.

After approval, record the accepted runtime extension and dated owner-record supersessions through the repository governance workflow. This RFC does not itself alter the historical Home ADR or current route facts.

## Alternatives considered

| Alternative | Assessment |
| --- | --- |
| Editorial Atlas with no live background | Strong buyer hierarchy and lowest cost; selected hierarchy, then owner requested more spatial impact |
| Sticky spatial layers | Distinct interaction philosophy; rejected for final reading flow and owner preference for connected backgrounds |
| Visual Dossier ledger/folios | Strong imagery/story scale; adapted for Projects, not selected as the Services composition |
| Services assembly plates | Initial revised scene; replaced by owner-requested moving nodes/relationships |
| One static node background on every device | Complete fallback retained; owner chose simplified live capability path for phones |
| Retain detail pages or compatibility redirects | Explicitly rejected by owner in favor of complete index dossiers and definitive retirement |
| New 3D/motion framework or Brag video runtime | Unnecessary dependency and loading cost; installed Three and adapted Brag storyboarding are sufficient |

## Trade-offs

Stronger live depth and persistent visible rotation require bundle, GPU, energy/lifecycle and physical-device verification. Batched paths, bounded geometry, capped 30fps wide/20fps compact ambient cadence and static equivalence reduce that cost without making content conditional. Active scroll may draw up to 60fps subject to the same measured gates. Labels add a reading/occlusion constraint and are decorative equivalents of an accessible legend. Complete inline dossiers create a longer index but allow uninterrupted evaluation; jump links and legible article structure support navigation. Definitive route removal sacrifices old deep-link reachability by explicit owner choice. The repeated whole mark adds identity without weakening its protected geometry; opacity/clear-space validation remains required.

## Migration and implementation impact

Active consumers include localized route generation, publication projections, complete project content, service evidence links, Founder MPC actions, locale helpers, navigation tests and export/browser verification. Some card/meta/navigation components remain shared and cannot be blindly deleted. Keep the two approved conceptual illustrations; verify no consumer before removing the unused MPC detail illustration. The [read-only retirement audit](../reviews/services-projects-footer-design-2026-09-30/route-retirement-audit.md) records the discovered file boundaries.

This is a design/governance proposal, not a task/PR breakdown. The later ADE v2 plan must declare exact implementation models, dependencies, ownership/write sets, forbidden/shared areas, locks, genuinely independent concurrency, behavioral TDD and visual/manual/performance acceptance. Human merges remain mandatory.

## Risks and unresolved gates

Written specification/copy approval is complete. Production bundle, hardware performance, physical-phone capability, cross-browser and real screen-reader acceptance are not demonstrated by the disposable prototype. Exact final posters must match the accepted depth/composition and remain within budget. Implementation must fail safely to static if physical-device gates cannot be met.

The owner's cleanup target is explicit, but the original no-production session restriction remains effective without an explicit scope exception. No route removal has been performed here. Planning does not require immediate deletion.

## Recommendation and status

**APPROVED — 2026-09-30.** After reviewing Revision 5 and its linked specification/copy, the owner said: “Perfect, you can now proceed with ADE v2 planning and independent review.” This accepts the bounded design/runtime/route/placement decisions; Codex now authors the plan. An independent GPT-6.1 Sol or GPT-6 Luna reviews findings without rewriting it, and Codex incorporates them before presenting the reviewed plan for human approval. No implementation is authorized by a plan draft. Task 1 of that plan packages the records for a human-merged Governance PR; approval of the design does not bypass that PR boundary.
