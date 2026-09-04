---
id: RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
type: request-for-comments
status: APPROVED
related:
  - PAGE-HOME
  - IA-SITE
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PORTFOLIO-MIGRATION
  - ARCHITECTURE-MAP
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
last_verified: 2026-09-04
---

# Homepage hero implementation boundary

## Context

[`HOME-HERO`](../product/pages/home.md#home-hero) has approved Spanish copy, CTA labels, trust statements, and a business-first responsibility. The current `/` route instead renders a personal portfolio, starts in English, switches locale through client state, and links to anchor sections rather than the approved page routes described by [`IA-SITE`](../product/information-architecture.md).

The requested hero is therefore not an isolated copy replacement. Removing the current personal hero also intersects the approved [`PORTFOLIO-MIGRATION`](../product/personal-portfolio-migration.md) rule that preserves founder material and migrates the founder profile in the same release that makes the business homepage primary.

## Problem

At the first Stage C pilot, implementing the approved Spanish hero immediately would have silently decided or bypassed unresolved consequential boundaries:

- target routing and localization implementation was **OPEN**, while the approved CTAs required `/contacto/` and `/servicios/`, which did not exist;
- final English copy was **OPEN**, while the current application defaulted to English and shipped both languages through client state;
- the logo/wordmark and minimum visual direction were **OPEN**, while the existing portfolio styling was explicitly current evidence rather than target approval;
- replacing the personal hero without a founder-profile destination would have removed or stranded content contrary to the approved migration sequence.

The decision closure below resolved the product, content, visual, destination, and migration prerequisites in their owning documents. Static-compatible localized routing remained the implementation blocker until Governance PR #6 approved it.

## Requirements

Any implementation path must:

- preserve the approved `HOME-HERO` Spanish copy, hierarchy, trust statements, and primary/secondary CTA relationship without introducing claims beyond approved evidence;
- render Spanish at `/` and an approved English adaptation at `/en/`, without client-only locale state or automatic redirection;
- link the primary and secondary CTAs to real, usable localized Contact and Services routes;
- expose one meaningful H1, keep the page understandable without motion or JavaScript-dependent reveals, and let keyboard and narrow-screen users reach all navigation and CTA destinations;
- preserve the founder's useful professional history and make the founder profile available before the current personal hero is removed;
- remain compatible with the current static-export constraint unless a separately approved hosting decision changes it; canonical-domain selection is required before production metadata and release sign-off, not before implementation;
- avoid treating current styling, an invented translation, or an unavailable route as approved product behavior.

This Governance PR must not implement the hero or any routing, visual-system, localization, or founder-profile change.

## Proposed approach

Adopt a governance-first homepage-foundation boundary:

1. Resolve the minimum prerequisites before application code begins:
   - approve the static localized-routing implementation for `/` and `/en/` and their page-equivalent destinations;
   - approve the English `HOME-HERO` adaptation;
   - record the minimum launch visual decisions needed for the hero in `DESIGN-VISUAL`, without requiring the entire site design system to be finalized;
   - preserve current static-export/base-path compatibility and require the canonical domain when production metadata is finalized;
   - define an implementation release slice that creates usable Services, Contact, and Founder destinations before switching the homepage hero.
2. Record accepted consequential architecture in an ADR and create a versioned execution plan for the multi-route migration slice.
3. Implement the hero as a shared semantic component with route-owned localized content only after those records authorize it. The component should not own routing or locale state.
4. Integrate the hero when its CTAs resolve to working pages and the personal-founder content has a verified replacement. Validate Spanish and English routes, narrow and wide layouts, keyboard order, focus visibility, motion-independent rendering, static export, and route integrity.

The original boundary did not select a routing structure, visual aesthetic, English translation, or complete business-site redesign. The decision closure below records the minimum product and design selections without attempting to settle the complete redesign.

The 2026-09-03 decision closure resolved the referenced product, content, and minimum visual prerequisites in their owning documents. It also refined the original sequence: canonical-domain selection is required for production metadata and release sign-off, not before application code begins; long-term hosting may be deferred while current static-export compatibility is preserved. The localized routing implementation remains subject to architecture governance.

## Alternatives considered

### Replace the current landing section directly

Reuse the current client-locale state, existing Tailwind treatment, and anchor links. This is the smallest code diff, but it would contradict `IA-SITE`, leave the approved CTAs without their destinations, present an unapproved English adaptation, and turn current styling into an implicit target decision.

### Add an unintegrated hero component

Build and test the component without rendering it publicly. This avoids broken routes but produces dead code, cannot complete the requested user outcome, and would still embed unsettled content and visual assumptions.

### Expand the implementation into the complete migration

Add localized routing, Services, Contact, Founder, navigation, design-system changes, and the hero in one implementation PR. This could produce a coherent release, but it would bundle unresolved consequential decisions, exceed the requested scope, and make review and rollback unnecessarily difficult.

## Trade-offs

- The recommended path delays visible hero implementation until prerequisites are approved.
- It increases governance and sequencing work before the first business-homepage change.
- In return, it avoids broken conversion paths, lost founder content, provisional translations, and accidental design-system adoption.
- A coherent multi-route plan costs more than a one-section edit but provides smaller reviewable implementation phases after the architecture and product inputs are settled.

## Migration and implementation impact

No application, dependency, deployment, or runtime behavior changes in this Governance PR.

The routing/localization decision is now approved and recorded in [`ADR-STATIC-LOCALIZED-ROUTING`](../decisions/static-localized-routing.md). [`PLAN-HOMEPAGE-FOUNDATION`](../plans/completed/homepage-foundation.md) defines ordering, rollback, link behavior, static-export validation, and the release point at which the business homepage becomes primary.

## Risks

- The prerequisite set may grow into a broader migration program if its phases are not kept explicit.
- Approving only the hero while deferring real CTA destinations would create a conversion regression.
- Reusing legacy styling without an explicit transitional decision could make temporary choices difficult to unwind.
- Founder content can become inaccessible if the release order does not enforce the migration rule.
- A routing decision may affect static export, language switching, metadata, and deployment paths beyond the hero.

## Decision closure map — 2026-09-03

This table classifies the RFC prerequisites and links to their authoritative owners. It does not duplicate their normative requirements.

| Decision | Classification | Delivery effect | Owner and outcome |
| --- | --- | --- | --- |
| English `HOME-HERO` adaptation | CONTENT DECISION | IMPLEMENTATION BLOCKER — resolved | [`PAGE-HOME`](../product/pages/home.md#approved-english-adaptation), **APPROVED** |
| Minimum wordmark | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | [`DESIGN-VISUAL`](../design/visual-language.md#homepage-foundation-visual-baseline-approved), **APPROVED** |
| Launch colors and contrast pairs | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | `DESIGN-VISUAL`, **APPROVED** |
| Typeface and initial hierarchy | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | `DESIGN-VISUAL`, **APPROVED** |
| Homepage-foundation spacing, layout, and grid | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | `DESIGN-VISUAL`, **APPROVED** |
| Primary/secondary CTA and basic surface treatment | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | `DESIGN-VISUAL`, **APPROVED** |
| Minimum responsive behavior | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved | [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md#homepage-foundation-interaction-and-responsive-baseline-approved), **APPROVED** |
| Hero motion posture | VISUAL/DESIGN DECISION | IMPLEMENTATION BLOCKER — resolved by a no-entrance-motion baseline | `DESIGN-IX-A11Y`, **APPROVED** |
| Hero imagery | VISUAL/DESIGN and CONTENT DECISION | NON-BLOCKING / MAY BE DEFERRED | `DESIGN-VISUAL`, **APPROVED:** no image is required |
| Minimum Services destination | PRODUCT and CONTENT DECISION | INTEGRATION BLOCKER — resolved | [`PAGE-SERVICES`](../product/pages/services.md#homepage-foundation-minimum-destination-approved), **APPROVED** |
| Minimum Contact destination | PRODUCT and CONTENT DECISION | INTEGRATION BLOCKER — resolved | [`PAGE-CONTACT`](../product/pages/contact-and-privacy.md#homepage-foundation-minimum-destination-approved), **APPROVED**; final form/privacy remain release blockers |
| Minimum Founder destination and preservation scope | PRODUCT and CONTENT DECISION | INTEGRATION BLOCKER — resolved; CV/link verification remains an integration check | [`PAGE-FOUNDER`](../product/pages/studio-and-founder.md#homepage-foundation-minimum-founder-destination-approved) and [`PORTFOLIO-MIGRATION`](../product/personal-portfolio-migration.md#homepage-foundation-migration-gate-approved), **APPROVED** |
| Static-compatible localized App Router structure | TECHNICAL ARCHITECTURE DECISION | IMPLEMENTATION BLOCKER — resolved | [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](homepage-foundation-static-localized-routing.md), **APPROVED** in PR #6 and recorded by `ADR-STATIC-LOCALIZED-ROUTING` |
| Canonical production domain | RELEASE/DEPLOYMENT DECISION | RELEASE BLOCKER only | [`CONTENT-LOCALIZATION`](../product/content-and-localization.md#canonical-domain-open-release-blocker), **OPEN** |
| Long-term hosting choice | TECHNICAL ARCHITECTURE and RELEASE/DEPLOYMENT DECISION | NON-BLOCKING / MAY BE DEFERRED while current static-export compatibility is preserved | `ARCHITECTURE-MAP`, **OPEN** |
| English content outside the approved minimum routes | CONTENT DECISION | NON-BLOCKING / MAY BE DEFERRED | `CONTENT-LOCALIZATION`, **OPEN** |
| Custom logo symbol, founder photograph, service fragments, and complete design system | VISUAL/DESIGN or CONTENT DECISION | NON-BLOCKING / MAY BE DEFERRED | Owning product/design records, **OPEN** |

## Remaining unresolved question

- Which canonical production origin is approved before final release metadata is emitted?

Long-term hosting may be reconsidered separately. No hosting migration is required to begin the homepage-foundation implementation while the current static-export constraint is preserved.

## Recommendation

Keep the approved governance-first homepage-foundation boundary and do not implement the hero as an isolated change. Execute the accepted static-compatible localization architecture through its versioned, multi-route plan with the hero as a bounded phase.

## Status

**APPROVED.** The homepage-foundation delivery boundary was approved for final merge in [PR #4](https://github.com/Furlanich/Portfolio/pull/4) on 2026-09-03.

The product, content, minimum visual, responsive, motion, and destination-page questions are resolved through the owning records linked in the decision closure map. Static-compatible localized routing was approved through [PR #6](https://github.com/Furlanich/Portfolio/pull/6) on 2026-09-04 and is recorded in `ADR-STATIC-LOCALIZED-ROUTING`. Canonical-domain selection remains a release blocker; long-term hosting and the broader design system are explicitly deferred.
