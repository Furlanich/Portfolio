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
last_verified: 2026-09-03
---

# Homepage hero implementation boundary

## Context

[`HOME-HERO`](../product/pages/home.md#home-hero) has approved Spanish copy, CTA labels, trust statements, and a business-first responsibility. The current `/` route instead renders a personal portfolio, starts in English, switches locale through client state, and links to anchor sections rather than the approved page routes described by [`IA-SITE`](../product/information-architecture.md).

The requested hero is therefore not an isolated copy replacement. Removing the current personal hero also intersects the approved [`PORTFOLIO-MIGRATION`](../product/personal-portfolio-migration.md) rule that preserves founder material and migrates the founder profile in the same release that makes the business homepage primary.

## Problem

Implementing the approved Spanish hero now would silently decide or bypass unresolved consequential boundaries:

- target routing and localization implementation is **OPEN**, while the approved CTAs require `/contacto/` and `/servicios/`, which do not exist;
- final English copy is **OPEN**, while the current application defaults to English and ships both languages through client state;
- the logo/wordmark and final visual direction are **OPEN**, and the existing portfolio styling is explicitly current evidence rather than target approval;
- replacing the personal hero without a founder-profile destination would remove or strand content contrary to the approved migration sequence.

Using legacy anchors, inventing an English translation, adopting the current visual system as the target, or expanding a hero change into several undocumented pages would each contradict repository truth.

## Requirements

Any implementation path must:

- preserve the approved `HOME-HERO` Spanish copy, hierarchy, trust statements, and primary/secondary CTA relationship without introducing claims beyond approved evidence;
- render Spanish at `/` and an approved English adaptation at `/en/`, without client-only locale state or automatic redirection;
- link the primary and secondary CTAs to real, usable localized Contact and Services routes;
- expose one meaningful H1, keep the page understandable without motion or JavaScript-dependent reveals, and let keyboard and narrow-screen users reach all navigation and CTA destinations;
- preserve the founder's useful professional history and make the founder profile available before the current personal hero is removed;
- use the approved canonical domain and remain compatible with the current static-export constraint unless a separately approved hosting decision changes it;
- avoid treating current styling, an invented translation, or an unavailable route as approved product behavior.

This Governance PR must not implement the hero or any routing, visual-system, localization, or founder-profile change.

## Proposed approach

Adopt a governance-first homepage-foundation boundary:

1. Resolve the minimum prerequisites before application code begins:
   - approve the static localized-routing implementation for `/` and `/en/` and their page-equivalent destinations;
   - approve the English `HOME-HERO` adaptation;
   - record the minimum launch visual decisions needed for the hero in `DESIGN-VISUAL`, without requiring the entire site design system to be finalized;
   - approve the canonical domain and confirm the hosting and base-path assumptions used by localized URLs and metadata;
   - define an implementation release slice that creates usable Services, Contact, and Founder destinations before switching the homepage hero.
2. Record accepted consequential architecture in an ADR and create a versioned execution plan for the multi-route migration slice.
3. Implement the hero as a shared semantic component with route-owned localized content only after those records authorize it. The component should not own routing or locale state.
4. Integrate the hero when its CTAs resolve to working pages and the personal-founder content has a verified replacement. Validate Spanish and English routes, narrow and wide layouts, keyboard order, focus visibility, motion-independent rendering, static export, and route integrity.

This proposal defines a delivery boundary for review; it does not select a specific routing library, visual aesthetic, English translation, or complete business-site redesign.

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

If accepted, follow-up work will need a routing/localization architecture decision, approved content/design updates, an ADR for the accepted consequential architecture, and a versioned execution plan. The plan should define ordering, rollback, redirect/link behavior, static-export validation, and the release point at which the business homepage becomes primary.

## Risks

- The prerequisite set may grow into a broader migration program if its phases are not kept explicit.
- Approving only the hero while deferring real CTA destinations would create a conversion regression.
- Reusing legacy styling without an explicit transitional decision could make temporary choices difficult to unwind.
- Founder content can become inaccessible if the release order does not enforce the migration rule.
- A routing decision may affect static export, language switching, metadata, and deployment paths beyond the hero.

## Unresolved questions

- Which static-compatible App Router structure owns Spanish root routes and English `/en/` routes?
- What exact English adaptation of `HOME-HERO` is approved?
- What minimum logo/wordmark, palette, typography, spacing, button, and motion decisions are required before visual implementation?
- Which Services, Contact, and Founder page scope must land before the hero can be integrated without broken or missing destinations?
- How will the founder's current introduction, CV access, and professional links remain discoverable when the personal hero is removed?
- Does GitHub Pages remain the target for this migration slice, or is hosting resolved separately before implementation?

These questions remain **OPEN** until human review accepts corresponding repository records.

## Recommendation

Approve the governance-first homepage-foundation boundary and do not implement the hero as an isolated change. Resolve the listed routing, content, visual, and migration prerequisites through their owning records; then record the accepted architecture and execute a versioned, multi-route plan with the hero as a bounded phase.

## Status

**APPROVED.** The homepage-foundation delivery boundary was approved for final merge in [PR #4](https://github.com/Furlanich/Portfolio/pull/4) on 2026-09-03.

This approval does not resolve the routing architecture, English copy, visual direction, canonical domain, hosting assumptions, destination-page scope, or founder-content migration details listed above. Those items remain **OPEN** and require their owning records, a resulting ADR where architecture is accepted, and a versioned execution plan before application implementation begins.
