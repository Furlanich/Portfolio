---
id: RFC-SFC-COMMERCIAL-ATLAS-V1
type: request-for-comments
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - DESIGN-SFC-V1
  - SPEC-SFC-V1
  - REVIEW-STUDIO-FOUNDER-CONTACT-2026-10-14
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-TERMS
  - IA-SITE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
  - PLAN-SFC-V1
  - REVIEW-SFC-ACCEPTANCE-V1
last_verified: 2026-10-18
---

# Commercial inquiry and Atlas Studio, Founder, Contact and legal

## Current scope supersession — 2026-10-18

[ADR-CONTACT-DIRECT-CHANNELS](../decisions/contact-direct-channels.md) records the owner-approved replacement of the form with direct WhatsApp/email/phone links. Formspree/counsel/probe/deletion activation prerequisites below are historical and do not apply to this release. The original alternatives and acceptance history are retained.

## Context and problem

Main at the discovery base uses the accepted Home and Services/Projects visual systems while Studio, Founder and Contact retain older presentation. Contact is deliberately a local simulation under ADR-CONTACT-INQUIRY-DEMO-MODE. Its Formspree pipeline exists but is dormant. Both Services/Projects live tiers are disabled because the existing hardware frame gate did not reliably pass; compact hardware evidence is absent.

The owner requests a major redesign and authorizes reconsidering demo-only restrictions through normal governance. The owner retained GitHub Pages `/Portfolio`, distinct Studio/Founder responsibilities, text-led Founder, four-field initial inquiry, the existing Formspree Free form/recipient, and website-use/inquiry Terms. Three inspectable directions were compared. Direction A and A.2 strings/page-specific graph meanings were selected for the written design, not blanket implementation or live activation.

## Requirements and proposed approach

[DESIGN-SFC-V1](../design/studio-founder-contact-v1.md) specifies the full page compositions, responsive dimensions, graph topology/input/physics/lifecycle, Contact state behavior, legal boundaries, architecture and verification gates. Exact copy and confirmed facts remain in the owning page records. [SPEC-SFC-V1](../superpowers/specs/2026-10-14-studio-founder-contact-design.md) is the written-review entry point.

Extend the existing pure connected model/controller and single host/engine with immutable page profiles and bounded screen-space node/string response. Keep Home separate and preserve Services/Projects content/choreography. Use complete static posters and semantic server HTML before optional graphics. New pages sleep after interaction; existing SPF ambient behavior remains bounded. No new runtime library or hosting/backend migration is proposed.

Activate the retained provider-neutral inquiry/Formspree architecture only after the accepted supersession, matching legal disclosure and processor/account/operations receipts. Account facts and exact owner setup steps are owned by [Contact/Privacy](../product/pages/contact-and-privacy.md#formspree-free-readiness-checklist-proposed-operational-requirements). Do not change an account or publish a processor/legal assertion merely because the endpoint is known.

## Bounded supersessions proposed

Accepted 2026-10-15 (see [Recommendation and status](#recommendation-and-status)). These target changes take effect only through the subsequent reviewed implementation and activation checkpoints of [PLAN-SFC-V1](../plans/active/studio-founder-contact-v1.md); acceptance alone changes no current behavior. Existing ADR files remain immutable. The design branch does not apply them to production.

| Existing requirement / owner | Proposed bounded replacement | Preserved boundary |
| --- | --- | --- |
| DESIGN-VISUAL / DESIGN-IX-A11Y: older light Studio/Founder and Contact composition | Dark Atlas Studio/Founder; quiet dark Contact introduction and opaque Bone intake; complete quiet legal reading surfaces | Palette, fonts, protected mark, shared App Bar/Footer, meaningful reading/interaction and all other named surfaces |
| PAGE-STUDIO / PAGE-FOUNDER: later marketing editorial source order | Owner-confirmed target order, exact retained facts and field-level copy selection from the page owner | Both distinct pages, full professional depth, narrative-only employment, evidence limitations and portrait deferral |
| ADR-CONTACT-INQUIRY-DEMO-MODE: only local simulation and no real public inquiry | Separately gated commercial mode using the already accepted inquiry pipeline; no public mode switch or environment-only activation | History, testable demo adapter, no secret in the client, strict validation/state/accessibility and explicit release decision |
| PAGE-CONTACT: demo notice, reserved failure email and simulated states | Matching real-submission disclosure, classified success/error/retry/unavailable behavior and actual hidden trap | Four public fields, independent alternatives, no marketing/files/CRM, accepted-only reset and no autosend |
| PAGE-PRIVACY: current zero-transmission/provider-free explanation | Original professionally reviewed ES/EN disclosure of the actual release, including providers/transfers/retention and existing motion-preference storage | No invented legal identity, location, registration, consent mechanism or deletion guarantee |
| ADR-CONNECTED-STUDIO-PAGE-RUNTIME: connected WebGL limited to Services/Projects | Extend the same controlled runtime to Studio/Founder/Contact with page profiles | Home's runtime, semantic HTML, gates, one renderer, pointer-transparent canvas and static fallback |
| DESIGN-SPF-V1: passive proximity and existing straight/rigid paths | Local yielding nodes and pinned flexible strings; Contact fixed nodes; projected words follow nodes but keep wording/orientation | Current graph topology/composition, scroll progress/growth/tracers, content, ambient ring policy and performance ceilings |
| Existing connected ambient contract | Retain ambient mode for Services/Projects; new pages are input-driven and stop at rest | Zero frames when paused/hidden/offscreen/Footer-dominated; no idle positional wander |
| IA-SITE / PAGE-TERMS: no Terms route pair | `/terminos/`, `/en/terms/`, route ID `terms`, Footer/legal cross-links and locale equivalence | Static routing/trailing slash/base path, Founder outside primary navigation and retired project-detail 404s |
| PAGE-HOME / PAGE-SERVICES: demo-only final CTA sentence | Exact commercial-inquiry consistency replacement only at activation | All other copy, hierarchy, Home scene/Founder plate, catalogue/evidence and commercial boundaries |

These are narrow supersessions. This RFC does not make blanket commercial contract terms, standard pricing, a support SLA, a new company, new evidence claims or a site-wide runtime rewrite. Route addition raises the foundation export count from fourteen to sixteen; project-detail retirement is unaffected.

## Alternatives considered

| Alternative | Decision / reason |
| --- | --- |
| Keep local-only demo indefinitely | Rejected as the initiative's target; it does not satisfy genuine public submission. It remains the deployed state until activation gates pass. |
| Use mailto as the form | Rejected by the accepted inquiry architecture and this brief; retain email only as an explicit alternative. |
| Migrate hosting/add a custom backend | Rejected for this initiative; the owner retained GitHub Pages and the existing Formspree architecture. |
| New universal Home/connected runtime or physics library | Rejected; broad refactor and payload risk without evidence of necessity. Extend measured existing seams instead. |
| Static-only permanent redesign | Valid fallback and a possible separately assessed release, but not completion of the requested interactive graph objective. Measured failure returns to the owner. |
| Notebook split pane / alternating open signal | Considered in real prototypes; A selected, quieter Contact adapted from C. The discovery preserves evidence and trade-offs. |

## Migration and release impact

Separate knowledge approval, implementation and activation. On accepted governance, record a new ADR that explicitly supersedes the named portions of the demo/runtime decisions, links their immutable history and retains release gates. Update current-requirement owners and architecture facts only as the accepted target is implemented; do not rewrite historical delivery receipts as if they had used Formspree.

Migrate demo-specific expectations into explicit mode tests and add failing commercial-mode tests before production behavior. A mode-specific zero-transmission test is retained; do not delete all privacy tests to obtain green. Future ordinary CI mocks the provider and never sends real inquiries. The account checklist, professional review and owner-run live provider probe precede deployment. Q15 authorizes immediate actual deployed ES/EN delivery/deletion checks after the coordinated deployment, with rollback on failure; the predeployment probe is not a deployed-form receipt.

Coordinate real Contact, final Privacy/Terms, Home/Services consistency wording and deployment configuration as one checkpoint. A missing endpoint fails the commercial release check; a runtime failure exposes unavailable recovery, not a simulation. Do not publish the new real-intake policy over an unchanged demo or send real values under the old zero-transmission notice.

**Q17 release-strategy approval:** implementation PRs target a nondeployed `codex/sfc-integration` after the Governance PR; one final main PR publishes complete page/poster/legal/intake and all Studio/Founder/Home/Services demo-dependent copy together. Quality checks must cover integration PRs. This changes release sequencing, not hosting or main merge authority. Independent graph qualification is not a prerequisite of safely static commercial release. Q16 authorizes exact Sonnet 5.5 High/GPT-6 Luna High implementation targets; inquiry risk packets additionally receive the plan's fresh cross-provider review under GOV-AGENT-USAGE I-8, no reviewer subagent.

Live graph policy remains false until applicable production metrics pass for all five routes in a tier and the bounded enablement checkpoint is reviewed. No approval of this RFC or the prototype itself enables a tier. Candidate builds/policy edits stay isolated from deployable artifacts. A performance blocker is recorded and returned with measured alternatives; gates are not weakened to fit the effect.

## Risks and external gates

- The remaining connected presentation tail is unidentified, and the historic 114.4KiB engine leaves limited headroom under 120KiB. Existing frames/metrics must be diagnosed, not extrapolated from the software prototype.
- Formspree Free has finite account-wide capacity and may retain over-limit submissions without notification. The owner checklist defines monitoring/recovery; no static-client promise of confirmed inbox delivery is added.
- Authenticated domain/recipient/Workflow/challenge/storage settings, actual delivery and deletion remain unverified. There is no authenticated Formspree connector in this session.
- Professional Argentine review must settle identity/address sufficiency, providers/countries/transfers, notice/consent, retention/exceptions and rights/Terms wording. The original drafts are not publishable yet.
- Screen-reader/touch/device/hardware acceptance cannot be supplied by a Chromium screenshot, previous owner attestation or axe alone. New behavior requires new evidence.

These facts are release gates, not open design choices delegated to an implementer. A result requiring a material consent, processor, interaction, fidelity or budget change returns for specification review.

## Recommendation and status

**APPROVED — 2026-10-15, effective on human merge of Governance PR 1 (PLAN-SFC-V1 Task 1).** The owner approved the bounded scope in Q14 and the controlled release order in Q15. On 2026-10-14 the owner also authorized `claude-sonnet-5-5` High and `gpt-6-luna` High (Q16), the nondeployed `codex/sfc-integration` branch with one coordinated main release (Q17), and the corrected Studio H1 and acceptance-only Contact success text (Q18). On 2026-10-15 the owner authorized execution of [PLAN-SFC-V1](../plans/active/studio-founder-contact-v1.md) revision 2 in the Claude Code session. That authorization explicitly waives the independent re-review gate of revision 2 and the Luna assignment of Task 1, which Claude Sonnet 5.5 performed. The waiver is recorded in the [Task 1 receipt](../reviews/studio-founder-contact-acceptance-v1/task-01.md); it changes neither the other packets nor any later gate.

The bounded supersessions above are accepted as target requirements. They take effect only as each reviewed implementation or activation checkpoint lands. Existing ADRs stay immutable and effective until the Task 2 record `ADR-SFC-COMMERCIAL-ATLAS-V1` supersedes the named portions. The independent Opus 5.5 High review of plan revision 1 required revision; its [dispositions](../reviews/studio-founder-contact-plan-review-2026-10-14.md) are preserved, and revision 2 has had no independent re-review. Account mutation, deployment, the live provider probe, legal publication and tier enablement remain separate later gates owned by Tasks 13, 15, 16, 17 and 18.
