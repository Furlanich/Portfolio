---
id: REVIEW-MARKETING-PRESENTATION-COMPARISON
type: marketing-review-comparison
status: PROPOSED
related:
  - REVIEW-MARKETING-PRESENTATION
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - REVIEW-MARKETING-DECISIONS
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PROJECT-EVIDENCE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-19
---

# Marketing and presentation excellence — T6 comparison

## Purpose and method

This record compares the original [marketing presentation audit](../marketing-presentation-2026-09-15/index.md) with the current implementation after T1–T5. The original report and its finding statuses are preserved; this is an auditable execution record, not a replacement review or a new approval.

- Original baseline: 5af49a6196a564dbd9aee648454e74df2613fe32, reviewed 2026-09-15, initial holistic score 5.8/10.
- T6 base: origin/main at d2fccf16146dbdef7c6ad8a318a31980545d790d, after the human merge of PR #58/T5.
- Route scope: the same 20 localized route entries in the plan: Home, Services, Projects, three project details, Studio, Founder, Contact and Privacy in ES/EN.
- Runtime matrix: root and /Portfolio, sequentially, with 653 Playwright test entries per context. The configured profiles cover Chromium, Firefox, WebKit, compact, mobile, tablet, wide, accessibility and visual checks. The six Founder/Studio visual baselines passed in both contexts.
- Original visual method: 20 routes × five widths, 320×900, 390×844, 768×1024, 1024×768 and 1440×900. The current automated profiles are not a claim of real-device or production certification.
- Evidence rule: source availability, test coverage and rendered content do not become current runtime behavior, client work, business results or conversion evidence. D03 remains REJECTED and the Contact demonstration contract remains authoritative.

The statuses below use only four outcomes:

- **Resuelto:** the approved requirement is observable in the current route/content contract.
- **Parcialmente resuelto:** the approved presentation correction is visible, but an evidence, editorial or visual gap remains.
- **Pendiente por decisión:** the item is blocked by a preserved open/rejected decision and must not be relabeled as fixed.
- **Diferido:** the approved scope intentionally did not add the evidence, asset or behavior required to close the finding.

## Current scorecard

The scores are expert heuristics comparable to the original scorecard, not conversion measurements, user research or a mechanically averaged quality gate. The increase reflects only observable T1–T5 presentation changes; open Contact, evidence and identity boundaries cap the result.

| Area | Original | T6 heuristic | Change | Observable reason |
| --- | ---: | ---: | ---: | --- |
| Positioning | 6 | 6.5 | +0.5 | Home and service language is sharper, but durable differentiation remains proposed. |
| Homepage | 6 | 7 | +1 | Narrative, proof-to-Projects bridge and repeated sections are more deliberate; proof is still policy-led. |
| Services | 5 | 7 | +2 | Buyer-scan structure, explicit fit/boundaries and contextual GRS evidence link are now readable. |
| Projects / evidence | 4.5 | 6 | +1.5 | Selection and disclosure are clearer; no current runtime or business result was added. |
| Studio | 7 | 8 | +1 | Responsibility, collaboration conditions, location and Founder bridge are explicit. |
| Founder | 6.5 | 8 | +1.5 | Opening, factual sequence, capabilities, professional links and Projects bridge now follow the approved order. |
| Contact | 5 | 5 | 0 | The local-only demonstration is explicit, but the D03-related copy decision remains open. |
| Navigation | 6 | 8 | +2 | Stable labels/destinations, mobile dismissal and footer utility are covered by runtime contracts. |
| Copy ES | 6 | 7 | +1 | Approved bilingual revisions reduce procedural repetition; a full editorial pass remains open. |
| Copy EN | 5.5 | 6.5 | +1 | Semantic parity and route copy improved; native editorial polish remains incomplete. |
| Visual quality | 6 | 6.5 | +0.5 | Rhythm and grouping improved and visual baselines pass; identity assets and broad hierarchy remain open. |
| Mobile | 6 | 7 | +1 | Responsive source order, disclosure behavior and Contact states are repeatably covered. |
| Trust | 5.5 | 5.5 | 0 | Integrity is clearer, but no new authorized runtime, client or outcome evidence exists. |
| Conversion | 4.5 | 6 | +1.5 | Proof reaches Projects and service evidence reaches GRS; Contact context transport is intentionally deferred. |
| **Overall** | **5.8** | **6.8** | **+1.0** | A more coherent demonstration-stage presentation with explicit remaining limits. |

## Finding-by-finding comparison

The original wording, severity and recommendations remain in [findings.md](../marketing-presentation-2026-09-15/findings.md). PR links identify implementation evidence; current suite links identify repeatable browser evidence, not commercial proof.

| Finding | T6 status | Observable current evidence | Residual / owner |
| --- | --- | --- | --- |
| MKT-POS-001 | Parcialmente resuelto | T3/PR #56 sharpens the Home proposition and service framing. | Durable category differentiation is still a proposed positioning decision; BRAND-POSITIONING / Home owners. |
| MKT-POS-002 | Pendiente por decisión | The site consistently identifies a technical demonstration in Contact, Privacy and form states. | Remaining response/data wording requires the rejected/open D03 decision; Contact, Privacy and demo-mode owners. |
| MKT-HOME-001 | Parcialmente resuelto | T3/PR #56 reduces the hero to a clearer lead, support and action pair in ES/EN. | Broad service usefulness and availability still compete with differentiation at narrow widths; Home owner. |
| MKT-HOME-002 | Parcialmente resuelto | Proof now frames accountability and validation positively and offers a truthful Projects bridge. | No current runtime, client result or new eligible homepage project was authorized; PROJECT-EVIDENCE. |
| MKT-HOME-003 | Parcialmente resuelto | T3 consolidates the middle narrative and preserves distinct service, proof, process and action roles. | Repetition across long bilingual pages remains editorial/visual follow-up; Home owner. |
| MKT-SVC-001 | Resuelto | T4/PR #57 implements a buyer-scan sequence: lead, work, starting point, fit, boundaries, evidence and action. | Keep the compressed scan layer synchronized with PAGE-SERVICES. |
| MKT-SVC-002 | Resuelto | Shared boundaries and provider restrictions remain visible while duplicate service-level defenses are consolidated in T4. | No further scope or guarantee may be inferred; Services owner. |
| MKT-SVC-003 | Resuelto | Services links the Web evidence section to the localized General Reservation System detail with an implementation-only label. | Preserve current evidence wording; C-SERVICES / GRS owner. |
| MKT-SVC-004 | Resuelto | Services distinguishes assessment, development and ongoing support without inventing packages, prices or durations. | Operational decisions remain outside this plan. |
| MKT-PROOF-001 | Resuelto | T2/PR #55 removes MPC from the commercial index and keeps it in Founder education context with group/fictional/educational limits. | Keep educational placement and permissions synchronized; C-ITEMS / Founder owner. |
| MKT-PROOF-002 | Parcialmente resuelto | The-System remains a secondary Lab signal and its detail leads with permitted workflow/access capability. | The source is not a current verified runtime or business result; item owner / evidence lifecycle. |
| MKT-PROOF-003 | Parcialmente resuelto | GRS detail has a clearer implementation/evidence story and visible limits. | Current execution was not re-certified and no new media or functional claim was added; GRS owner. |
| MKT-PROOF-004 | Parcialmente resuelto | T2 groups project-detail reading and keeps limitations adjacent to claims instead of hiding permissions. | Necessary caveats still make pages evidence records; future tightening requires owner approval. |
| MKT-PROOF-005 | Resuelto | Projects describes the published selection and authorization boundary instead of implying an undisclosed mature portfolio. | Do not broaden visible inventory without evidence/permission. |
| MKT-TRUST-001 | Diferido | T2–T5 make limitations and accountability legible without adding testimonials, metrics or unverified claims. | Current runtime, WhatsApp and maintenance proof remain unavailable and outside this sequence; PROJECT-EVIDENCE. |
| MKT-STUDIO-001 | Resuelto | T5/PR #58 explains practical continuity, decision ownership and conditional collaboration without defensive team-size framing. | No permanent team or employer endorsement is implied. |
| MKT-STUDIO-002 | Resuelto | T5/PR #58 states location, availability and communication capability without claiming an established geographic client footprint. | Preserve availability-only wording; Studio owner. |
| MKT-FOUNDER-001 | Resuelto | T5/PR #58 adds a concise opening and separates experience, biography, education and capabilities while retaining approved facts. | Employment remains narrative-only; Founder owner. |
| MKT-FOUNDER-002 | Resuelto | T5 makes professional links secondary verification and closes with Founder-to-Projects and commercial bridges. | Keep CV, LinkedIn and GitHub destinations factual. |
| MKT-CONTACT-001 | Pendiente por decisión | Contact identifies local simulation, no transmission and no inbox creation; automated states verify success, failure, retry and no request. | D03 baseline still contains unresolved response/data wording; no processor activation is authorized. |
| MKT-CONTACT-002 | Pendiente por decisión | Contact mobile states and ordered alternatives are covered at compact and tablet profiles. | Channel placement/copy changes remain a D03/page-owner decision; preserve four fields and disclosure. |
| MKT-CONTACT-003 | Pendiente por decisión | Success/failure states preserve values, explain no transmission and permit retry/reset behavior. | Removing repeated feedback wording is a future copy decision; behavior is unchanged. |
| MKT-NAV-001 | Resuelto | T1/PR #55 restores one stable Contact action and matching destination across the 20-route chrome matrix. | Actual WhatsApp activation remains out of scope. |
| MKT-NAV-002 | Resuelto | T1/PR #55 covers same-page selection, cross-page selection, Escape focus return and no-JS disclosure fallback. | Keep native fallback and focus behavior intact. |
| MKT-NAV-003 | Resuelto | Shared header/footer labels, language equivalence and one predictable Contact action are covered by marketing-navigation.spec.ts. | No additional navigation subject is authorized. |
| MKT-VIS-001 | Parcialmente resuelto | T3–T5 use clearer section roles, grouping and closure hierarchy; all six current visual baselines pass. | Repeated bands and cross-page hierarchy still need human visual judgment; DESIGN-VISUAL. |
| MKT-VIS-002 | Diferido | Existing conceptual diagrams remain labeled as conceptual and pass current visual baselines. | No portrait, branded 2D identity asset or new project media was authorized; identity work remains OPEN. |
| MKT-VIS-003 | Resuelto | T2/PR #55 renders localized publication-scope prose while retaining the internal fail-closed permission enum. | Keep ES/EN scope text adjacent to claims. |
| MKT-VIS-004 | Parcialmente resuelto | T3–T5 tighten related sections and align approved page endings without adding motion or effects. | Further rhythm/identity treatment is deferred pending human visual acceptance. |
| MKT-COPY-001 | Parcialmente resuelto | Approved ES Home, Services, Projects, Studio and Founder revisions reduce governance framing and preserve voseo/factual limits. | A complete Argentine editorial pass is not approved by this audit. |
| MKT-COPY-002 | Parcialmente resuelto | Approved EN content follows the same narrative and evidence boundaries as ES across T3–T5. | Native polish and terminology consistency remain editorial follow-up. |
| MKT-CONV-001 | Diferido | Service/project CTAs retain stable Contact destinations and do not transport form values or hidden context. | Query parameters, prefilled fields and context persistence remain out of scope. |
| MKT-CONV-002 | Resuelto | T3/PR #56 adds a truthful Home proof-to-Projects bridge without implying a case study or current client result. | Future proof expansion requires evidence/permission. |
| MKT-FOOTER-001 | Resuelto | T1/PR #55 provides grouped navigation, locale switching, copyright/location and direct/professional links with Founder secondary. | Preserve compact utility grouping and localized equivalence. |
| MKT-DOC-001 | Resuelto | T0 synchronized Architecture, product owners and IA with implemented Studio, authorized detail visuals and historical Founder separation; T6 rechecked owners. | Historical records remain intact; this comparison is the new auditable handoff. |
| MKT-A11Y-001 | Resuelto | T5 gives all four Founder capability groups stable IDs and aria-labelledby references; axe/focus suites pass in both base-path contexts. | Automated axe is not a screen-reader or manual focus certification. |

## Verification record and limitations

| Check | Root | /Portfolio | Interpretation |
| --- | --- | --- | --- |
| npm test | 107 passed before audit edits | Same dependency baseline | Content/unit baseline is green. |
| npm run test:e2e | 572 passed, 1 flaky recovered by retry, 80 skipped | 572 passed, 1 flaky recovered by retry, 80 skipped | 653 entries; skips are configured mobile navigation exclusions. |
| Visual project | 6 passed | 6 passed | Founder wide/compact ES/EN and Studio wide/compact baselines pass. |
| Accessibility project | 16 passed in matrix and dedicated suite | 16 passed in matrix and dedicated suite on a fresh port | No critical/serious axe violations in configured routes. |
| Contact behavior | Zero-request, validation, focus, success, failure, retry and reset scenarios passed | Same | This verifies the local demonstration contract, not a real inbox. |
| Project evidence | Six localized details, links and disclosure boundaries passed | Same | This verifies published route/content contracts, not current execution of source projects. |

The full matrix surfaced one transient failure in each context, both recovered by the configured retry: one Chromium navigation load on /en/work/the-system/ at root and one compact Contact validation load under /Portfolio. They are recorded as flaky observations rather than silently counted as first-pass green. The first dedicated /Portfolio accessibility run also exposed an environment-only Next 16/Turbopack internal panic in aggregation_update; after the dev-server cache self-reset, English Founder passed in isolation and a fresh-port dedicated suite passed 16/16. Existing warnings for NO_COLOR/FORCE_COLOR, Browserslist age, LCP hints, smooth scrolling, MODULE_TYPELESS_PACKAGE_JSON and local dependency advisories were not changed because they are outside T6 scope.

Automated visual evidence is available from the Playwright visual project. Human visual/manual review of hierarchy, wrapping, focus, contrast, 200% text, reduced motion, real-device behavior and screen-reader output was not completed because the image/CUA helper previously failed with helper_unknown_error: setup refresh had errors. This record therefore does not declare a manual visual PASS; the limitation remains OPEN for future visual QA and is not converted into a product claim by PR #59's merge.

No application, route, asset, dependency, Contact processor, source-project runtime or product decision was added by T6. The original review remains PROPOSED; D03 remains REJECTED; the plan is COMPLETED after human acceptance and merge of PR #59 into main at `ef00d7a`.
