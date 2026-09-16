---
id: REVIEW-MARKETING-DECISIONS
type: governance-review
status: PROPOSED
related:
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - REVIEW-MARKETING-PRESENTATION
last_verified: 2026-09-16
---

# Marketing decision review package — revision 1

## Review outcome requested

Choose and explicitly record APPROVED, REJECTED or OPEN for the seven decision groups below. This packet is complete for human review; its decisions are **not closed or approved**. No application code, provider, evidence strength, release/legal/SEO scope or 3D change is included.

Recommendation: operations-focused studio positioning; truthful global demo context; GRS-led source evidence, secondary Lab, MPC discovered through Founder; shorter Home/Services narrative; restrained editorial composition. The [RFC](../../rfcs/marketing-narrative-closure.md) records alternatives, trade-offs, risks and migration boundaries. The [audit](../marketing-presentation-2026-09-15/index.md) is the baseline evidence, not a new requirement.

## Decision register

| Decision | Recommendation | Authoritative owner / acceptance unit | Human disposition |
| --- | --- | --- | --- |
| D01 | Territory B; familiar custom-software category, fragmented operations as priority problem | [Positioning](../../product/vision-and-positioning.md#mkt-d01-durable-category-and-buying-problem-proposed-revision-1), [audience emphasis](../../product/audiences-and-services.md#mkt-d01-audience-emphasis-proposed-revision-1) | OPEN |
| D02 | Concise bilingual hero; stable navigation action to Contact | [Home D02](../../product/pages/home.md#mkt-d02-hero-and-actions-proposed-revision-1) | OPEN |
| D03 | Route-wide demo notice; local-only data/response contract; commercial response copy dormant | [Contact D03](../../product/pages/contact-and-privacy.md#mkt-d03-demonstration-presentation-contract-proposed-revision-1) | OPEN |
| D04 | GRS lead, secondary Lab, MPC Founder-led discovery; generic Home index link only | [Evidence owner](../../product/project-evidence.md#mkt-d04-homepage-bridge-and-selection-boundary-proposed-revision-1), [inventory](../../product/projects/index.md#mkt-d04-evidence-placement-proposed-revision-1), item deltas linked below | OPEN |
| D05 | Merge audience context into Home relevance; Services scan layer with visible bounds | [Home D05](../../product/pages/home.md#mkt-d05-home-consolidated-narrative-proposed-revision-1), [Services D05](../../product/pages/services.md#mkt-d05-services-buyer-scan-layer-proposed-revision-1) | OPEN |
| D06 | Focus Studio; preserve Founder facts; secondary CV; stable navigation/footer; US English | [Studio/Founder](../../product/pages/studio-and-founder.md#mkt-d06-studio-founder-emphasis-and-copy-proposed-revision-1), [IA/CTA map](../../product/information-architecture.md#mkt-d06-ia-navigation-and-action-contract-proposed-revision-1), [language](../../product/content-and-localization.md#mkt-d06-language-editorial-conventions-proposed-revision-1) | OPEN |
| D07 | Keep design tokens; fewer cards, grouped content, shorter hero padding and deliberate menu dismissal | [VIS-R1](../../design/visual-language.md#mkt-d07-vis-r1-restrained-marketing-composition-proposed), [IX-R1](../../design/interaction-responsive-accessibility.md#mkt-d07-ix-r1-marketing-navigation-and-demo-interactions-proposed) | OPEN |

Every owner records candidate PROPOSED and human disposition OPEN, with reviewer/date/reference OPEN. The existing baseline remains effective. If a decision is rejected, retain the baseline; if OPEN, do not implement dependent work. No decision is approved by the act of preparing this packet.

## Current-versus-proposed bilingual copy

Exact candidate copy is stored once in its owning record; this index is a review map, not a second source of public strings.

| Review surface | Comparison / change boundary |
| --- | --- |
| Brand category and priority situation | [D01 table](../../product/vision-and-positioning.md#mkt-d01-durable-category-and-buying-problem-proposed-revision-1); two territories and wording status |
| Hero and complete Home narrative changes | [Home proposals](../../product/pages/home.md#mkt-d02-hero-and-actions-proposed-revision-1); all replacements, retired Audiences location and retained service summaries |
| Services scan and boundaries | [Services proposal](../../product/pages/services.md#mkt-d05-services-buyer-scan-layer-proposed-revision-1); scope coverage and no-package/non-guarantee constraints |
| Global notice, Contact and states | [D03 exact copy](../../product/pages/contact-and-privacy.md#d03-current-versus-proposed-bilingual-copy); all mode-specific strings, retained field/errors and dormant response wording |
| Projects index/system wording | [Projects proposal](../../product/pages/projects.md#mkt-d04-projects-narrative-and-detail-outline-proposed-revision-1) |
| GRS | [GRS item delta](../../product/projects/general-reservation-system.md#mkt-d04-grs-editorial-candidate-proposed-revision-1); summary, relationship, limitations |
| The-System | [Lab item delta](../../product/projects/the-system.md#mkt-d04-lab-editorial-candidate-proposed-revision-1); same limitations, no working-billing implication |
| MPC | [MPC item delta](../../product/projects/mpc-administracion.md#mkt-d04-mpc-editorial-candidate-proposed-revision-1); group/educational/fictional context |
| Studio and Founder | [D06 changes](../../product/pages/studio-and-founder.md#mkt-d06-studio-founder-emphasis-and-copy-proposed-revision-1); complete history remains |
| Header/footer/actions | [IA labels and complete destination table](../../product/information-architecture.md#mkt-d06-ia-navigation-and-action-contract-proposed-revision-1) |

Current columns sometimes summarize long passages; exact full current text remains in the preceding owner sections and the [audit copy register](../marketing-presentation-2026-09-15/copy-review.md). Quotation marks are not used for summarized passages. Candidate paragraphs are actual proposed copy; labels such as Heading/Body or slash separators describe structure and are not rendered strings.

## Evidence eligibility and permissions

The [inventory table](../../product/projects/index.md#mkt-d04-evidence-placement-proposed-revision-1) records current and proposed placement for all inventoried items. No project becomes functional-demonstration, production evidence or Home-card eligible. GRS/Lab/MPC selection is editorial, not a new verification result. The-System remains RPG Lab; no entertainment work is relabeled as a real commercial deployment.

The narrow generic Home index link requires explicit PROJECT-EVIDENCE acceptance. MPC retains existing URLs and public status; Founder-led discovery does not make its detail private. Revised item wording requires item-owner acceptance even where underlying facts remain the same. No blocked/private/retired candidate is revived.

## Outlines and five-width layouts

[Page outlines and low-fidelity review](layouts.md) covers Home, Services, Projects, GRS, Lab, MPC, Studio, Founder and Contact, shared header/footer and Contact feedback. Widths: 320, 390, 768, 1024 and 1440; both locale structures. The standalone HTML study is a documentation artifact, not a Next.js prototype or approved UI. It uses annotated content roles, not a second canonical copy source.

## Candidate implementation PR groups — not an execution plan

These are independent reviewable scope groups with explicit dependencies. They are not scheduled tasks, executable steps or authorization. Create a versioned plan only after human decision closure.

| Group | Scope | Depends on | Verification focus |
| --- | --- | --- | --- |
| C0 — existing correctness | Correct mislabeled Contact header action using current approved label; restore localized publication-scope text; repair Founder IDs and existing sticky-anchor offset contract | Existing approved owners; separate implementation review | Exact destinations, localized disclosure, resolved IDs and unobscured anchors |
| C1 — demo presentation | Global notice, Contact helpers/states, removal of real-response promises from current-mode endings | D03, relevant D02/D06 labels and D07 placement | No-send behavior, all entry routes, exact mode copy, form states and no-JS fallback |
| C2 — Home narrative | Hero, audience consolidation, founder/process proof and proposed index bridge | D01/D02/D05-HOME/D07; D04 for bridge | Five-width ES/EN narrative, anchors, no unauthorized Home evidence |
| C3 — Services presentation | Scan layer, visible service boundaries, shared-boundary fragments, GRS detail pointer | D05-SERVICES/D07; D04 for pointer; C1 labels/mode coherent | Scope coverage, headings/links, provider limits, no new packages |
| C4 — evidence selection/story | GRS/Lab emphasis, consolidated details, MPC Founder discovery and preserved routes | D04 and all item subdecisions; D06 Founder placement; D07 | Fail-closed permissions, exact links/labels, no visual/runtime upgrade |
| C5 — Studio/Founder and utilities | Model copy, preserved biography/history, CV hierarchy, navigation/footer/language conventions | D06/D07; C4 for MPC; C1 for current-mode CTA contract | Fact preservation, source order, accessibility, CV/source/profile destinations |
| C6 — optional new evidence | Future runtime verification or permitted new media | Separate evidence task and publication approval | Reproducible behavior and asset provenance; not part of this initiative |

Keep each group atomic across locales. Shared changes must be coordinated so no intermediate release exposes commercial promises with a simulated form. If a group cannot stand alone without another, combine or sequence it explicitly in the later plan; do not create a mixed-mode interim deployment.

## Decision recording and acceptance

For each D01–D07 and item subdecision, the human supplies a disposition and any exact exceptions. Record it in the named owner, with reviewer, date and durable PR/comment reference. Then synchronize this register, RFC status and GOV-STATUS. Do not mark the whole RFC APPROVED while a required dependency remains OPEN; document partial acceptance explicitly.

A useful review response identifies the IDs, for example: D01 B; D02 revised headline; D03 accepted; D04 Home bridge OPEN and MPC accepted. This is an example of decision format, not an approval record. No response or elapsed time means no approval.

Before the later plan, reconcile accepted additions with superseded baseline clauses, preserve immutable ADRs and untouched OPEN items, and review exact copy/layout dependencies. Current boundaries explicitly exclude application edits, provider activation, legal/SEO/release expansion and immersive work.

## Review readiness — verified 2026-09-16

| Acceptance criterion | Status | Evidence / remaining human action |
| --- | --- | --- |
| Two territories and recommendation | PASS for review | D01 compares A/B and recommends B; selection remains OPEN |
| Bilingual current/candidate copy with rationale and permission | PASS for review | Tables in the authoritative owners; full current passages remain above them and in the audit |
| Demonstration contract across entry points and Contact | PASS for review | D03, IA destination table and mode-specific page endings; adapter/ADR unchanged |
| Evidence eligibility and no upgraded claims | PASS for review | Inventory plus item deltas; Home-card, runtime, media and client restrictions preserved |
| Page outlines and all five widths | PASS for review | Nine templates, 90 renderer combinations, corrected screenshots and standalone local HTML study |
| Owner synchronization and preserved decisions | PASS | Twenty existing Markdown files retain their entire prior body; only metadata and proposal additions changed |
| Candidate implementation PR grouping | PASS for review | C0–C6 backlog with dependencies; no versioned execution plan created |
| Explicit human approval/rejection | OPEN | Reviewer must record D01–D07 and item dispositions in owners; no approval inferred |
| Production implementation / activation / merge | NOT PERFORMED | Documentation-only task and human review boundary |

Validation: npm run validate exited 0 (107 Markdown files, 73 document IDs, 10 Skills; 99/99 tests; lint; typecheck; static build). Existing Node MODULE_TYPELESS_PACKAGE_JSON warnings appeared in tests; no configuration/dependency change was made. The build-added next-env.d.ts root-params reference was restored to baseline, then docs:check and typecheck passed again. Final whitespace and file-scope review accompanies the commit.

Self-review distinguished proposed requirements from facts, confirmed all seven dispositions remain OPEN, checked no approved body/ADR history was overwritten, retained full commercial-term text, examined copy and evidence scope for unsupported claims, inspected corrected visual studies, and checked that only docs files enter the PR. The technical study uses no production components or live external actions. It cannot certify final text zoom, assistive-technology behavior, real-device layout or performance.
