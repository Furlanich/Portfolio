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
  - PAGE-HOME
  - PROJECT-EVIDENCE
last_verified: 2026-09-04
---

# FURLANICH architecture map

## CURRENT

The current application is a Next.js 16 App Router site with eight static foundation routes: Spanish at the root and English under `/en/`. Locale-specific Server Component trees compose shared semantic foundation components from route-owned content. Retained founder/project source and legacy primitives remain under `data/`, `public/`, `lib/`, and `components/core` for later migration and cleanup.

Tailwind CSS provides utility styling and the small component primitives. `next/font` loads Inter; `public/` holds static images, including legacy project previews. The site is statically exported with trailing slashes, optional GitHub Pages base path/asset prefix, and unoptimized images. The deployment workflow builds `main` with Node 24 and publishes `out/` to GitHub Pages.

The dependency boundary is Next.js, React, TypeScript, Tailwind, Framer Motion, React Hook Form, and Lucide React. The approved foundation has no runtime localization dependency. Repository checks are documentation integrity, Node-based validator tests, ESLint, TypeScript no-emit checking, and the production static build. See [current system](docs/architecture/current-system.md) and [quality findings](docs/architecture/current-quality-findings.md) for evidence and limits.

Task 3 current state: the atomic cutover is implemented on the task branch with eight static Spanish-root and English-/en/ foundation routes, locale-root layouts, route-owned content, and shared semantic components. The branch preserves the static-export and optional GitHub Pages base-path constraints while retaining legacy source material for the later cleanup phase.

## APPROVED product constraints

The intended product is a bilingual, commercial-first FURLANICH site with Spanish root routes and English `/en/` routes, as defined by the [information architecture](docs/product/information-architecture.md). The current single-page/client-state localization model is not approval to retain that implementation. Product and design requirements remain authoritative in [project knowledge](docs/index.md).

The approved [homepage hero implementation boundary](docs/rfcs/homepage-hero-implementation-boundary.md) governs the first business-homepage slice. Its English copy, minimum visual direction, responsive/motion behavior, CTA destinations, and founder-content preservation scope are now approved in their owning product/design records.

Initiative 2 approves the seven commercial homepage sections below `HOME-HERO`, including their bilingual content, evidence-safe `HOME-PROOF` fallback, and minimum section visual/interaction rules. They fit the accepted locale-owned content and shared locale-agnostic component boundary. No new routing, localization, hosting, dependency, CMS, backend, or design-system architecture is required; implementation is governed by [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/active/homepage-completion.md).

The static-compatible App Router and localization structure was accepted through the routing RFC and is recorded in [`ADR-STATIC-LOCALIZED-ROUTING`](docs/decisions/static-localized-routing.md). [`PLAN-HOMEPAGE-FOUNDATION`](docs/plans/completed/homepage-foundation.md) records foundation delivery, and [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/active/homepage-completion.md) governs the remaining homepage implementation sequence. Canonical-domain selection is a release blocker rather than an implementation blocker. Long-term hosting may be deferred while the current static-export and base-path compatibility constraints are preserved.

## ACCEPTED target architecture

The homepage foundation uses explicit Spanish root routes and English `/en/` routes under locale-specific root layouts. Localized routes own their content and supply typed view models and resolved links to shared locale-agnostic components. A semantic route-equivalence map owns language-switch destinations. The target has no runtime locale negotiation or client-only locale state and preserves static export, trailing slashes, GitHub Pages, and the build-time base path for this migration.

The accepted route tree, component boundaries, migration rules, trade-offs, and approval provenance are owned by `ADR-STATIC-LOCALIZED-ROUTING`; this map does not duplicate them.

## TEMPORARY migration state — pre-cutover record

Until the atomic locale-root cutover, the current personal homepage and client-only localization remain the public implementation. Behavior-neutral route contracts and route-private localized content may coexist during preparatory PRs, but incomplete public locale trees must not be exposed. `next-intl` may remain temporarily for legacy consumers and is removed only after repository search proves its final consumer is gone. The active execution plan owns this transition and its rollback gates.

## PROPOSED architecture

The preserved recommendation is incremental, static-first modernization: reduce unnecessary client boundaries and evolve the existing repository rather than perform a greenfield rebuild. It is a recommendation, not implementation authority. See the [architecture index](docs/architecture/index.md).

## OPEN questions

Long-term hosting, final form/provider integration, the extended design system beyond the commercial homepage, whole-site accessibility claims, performance budgets, canonical domain, and optional imagery remain OPEN with the blocker levels recorded in their owning documents. They do not reopen the accepted homepage-foundation routing architecture or block planning the approved text-led commercial homepage.

## Engineering records

Use the [engineering lifecycle](docs/governance/engineering-lifecycle.md) to classify change. Accepted consequential decisions belong in [ADRs](docs/decisions/index.md); active and completed substantial work belongs in [execution plans](docs/plans/index.md).
