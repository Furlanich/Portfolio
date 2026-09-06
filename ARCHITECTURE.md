---
id: ARCHITECTURE-MAP
type: architecture-map
status: APPROVED
related:
  - ARCH-CURRENT
  - ARCH-FINDINGS
  - ARCH-STAGE-B-HARNESS-DESIGN
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PROJECT-EVIDENCE
last_verified: 2026-09-06
---

# FURLANICH architecture map

## CURRENT

The current application is a Next.js 16 App Router site with eight static foundation routes: Spanish at the root and English under `/en/`. Locale-specific Server Component trees compose shared semantic foundation components from route-owned content. Retained founder/project source and legacy primitives remain under `data/`, `public/`, `lib/`, and `components/core` for later migration and cleanup.

Tailwind CSS provides utility styling and the small component primitives. `next/font` loads Inter; `public/` holds static images, including legacy project previews. The site is statically exported with trailing slashes, optional GitHub Pages base path/asset prefix, and unoptimized images. The deployment workflow builds `main` with Node 24 and publishes `out/` to GitHub Pages.

The dependency boundary is Next.js, React, TypeScript, Tailwind, Framer Motion, React Hook Form, and Lucide React. The approved foundation has no runtime localization dependency. Repository checks are documentation integrity, Node-based validator tests, ESLint, TypeScript no-emit checking, and the production static build. See [current system](docs/architecture/current-system.md) and [quality findings](docs/architecture/current-quality-findings.md) for evidence and limits.

Task 2 current state: the complete commercial homepage is merged with eight static Spanish-root and English-/en/ foundation routes, route-owned bilingual content, a shared eight-section Server Component composition, and Process navigation on the existing foundation routes. Task 3 current state: the localized Services routes render one shared locale-agnostic Server Component composition with route-owned typed bilingual content, stable localized service fragments, contextual Contact actions, and the approved evidence-safe text-led hierarchy. The implementation preserves the static-export and optional GitHub Pages base-path constraints while retaining legacy source material for later migration.

## APPROVED product constraints

The intended product is a bilingual, commercial-first FURLANICH site with Spanish root routes and English `/en/` routes, as defined by the [information architecture](docs/product/information-architecture.md). The current single-page/client-state localization model is not approval to retain that implementation. Product and design requirements remain authoritative in [project knowledge](docs/index.md).

The approved [homepage hero implementation boundary](docs/rfcs/homepage-hero-implementation-boundary.md) governs the first business-homepage slice. Its English copy, minimum visual direction, responsive/motion behavior, CTA destinations, and founder-content preservation scope are now approved in their owning product/design records.

Initiative 2 approves the seven commercial homepage sections below `HOME-HERO`, including their bilingual content, evidence-safe `HOME-PROOF` fallback, and minimum section visual/interaction rules. They fit the accepted locale-owned content and shared locale-agnostic component boundary. No new routing, localization, hosting, dependency, CMS, backend, or design-system architecture is required; implementation is recorded by [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/completed/homepage-completion.md).

Initiative 3 delivered the complete bilingual Services page within the same boundary: locale-owned typed content, shared locale-agnostic semantic Server Components, the existing Services routes, static semantic fragments, and extensions of the approved homepage presentation primitives. Stable `#web`, `#whatsapp`, `#consultoria`, and `#consulting` fragments do not create routes or require runtime routing state. No new localization, hosting, dependency, CMS, backend, data, or design-system architecture was required. The implementation history is recorded by [`PLAN-SERVICES-EXPERIENCE`](docs/plans/completed/services-experience.md) under `ADR-STATIC-LOCALIZED-ROUTING`; no RFC or new ADR was required.

Initiative 4's Projects/Evidence decisions also fit the accepted boundary. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](docs/plans/active/projects-evidence-experience.md) selects a typed static public manifest, route-owned localized public copy, shared locale-agnostic Server Components, and conditional static detail generation. Internal permission and evidence audits remain Markdown in `docs/product/projects/` and are never parsed or mirrored into public application data. Task 1 established the empty fail-closed contract without public behavior. Three item records now satisfy the card-only publication gate, so Task 2 may populate that manifest and add the static bilingual index/navigation within the accepted architecture; detail routes and assets remain gated. No CMS, backend, project API, database, filter/search subsystem, media service, hosting change, RFC, or new ADR is required.

The static-compatible App Router and localization structure was accepted through the routing RFC and is recorded in [`ADR-STATIC-LOCALIZED-ROUTING`](docs/decisions/static-localized-routing.md). [`PLAN-HOMEPAGE-FOUNDATION`](docs/plans/completed/homepage-foundation.md) records foundation delivery, and [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/completed/homepage-completion.md) records the completed homepage implementation sequence. Canonical-domain selection is a release blocker rather than an implementation blocker. Long-term hosting may be deferred while the current static-export and base-path compatibility constraints are preserved.

## ACCEPTED target architecture

The homepage foundation uses explicit Spanish root routes and English `/en/` routes under locale-specific root layouts. Localized routes own their content and supply typed view models and resolved links to shared locale-agnostic components. A semantic route-equivalence map owns language-switch destinations. Conditional project-detail routes use the same stable slug in both locale trees and are generated only from an explicit public whitelist. The target has no runtime locale negotiation or client-only locale state and preserves static export, trailing slashes, GitHub Pages, and the build-time base path for this migration.

The accepted route tree, component boundaries, migration rules, trade-offs, and approval provenance are owned by `ADR-STATIC-LOCALIZED-ROUTING`; this map does not duplicate them.

## TEMPORARY migration state — pre-cutover record

Until the atomic locale-root cutover, the current personal homepage and client-only localization remain the public implementation. Behavior-neutral route contracts and route-private localized content may coexist during preparatory PRs, but incomplete public locale trees must not be exposed. `next-intl` may remain temporarily for legacy consumers and is removed only after repository search proves its final consumer is gone. The active execution plan owns this transition and its rollback gates.

## PROPOSED architecture

The preserved recommendation is incremental, static-first modernization: reduce unnecessary client boundaries and evolve the existing repository rather than perform a greenfield rebuild. It is a recommendation, not implementation authority. See the [architecture index](docs/architecture/index.md).

## OPEN questions

Long-term hosting, final form/provider integration, the extended design system beyond the approved homepage, Services, and Projects baselines, whole-site accessibility claims, global performance budgets, canonical domain, and optional imagery outside approved project evidence remain OPEN with the blocker levels recorded in their owning documents. They do not reopen the accepted localized-routing architecture or block the behavior-neutral Projects publication contract.

## Engineering records

Use the [engineering lifecycle](docs/governance/engineering-lifecycle.md) to classify change. Accepted consequential decisions belong in [ADRs](docs/decisions/index.md); active and completed substantial work belongs in [execution plans](docs/plans/index.md).
