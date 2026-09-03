---
id: ARCHITECTURE-MAP
type: architecture-map
status: APPROVED
related:
  - ARCH-CURRENT
  - ARCH-FINDINGS
  - ARCH-STAGE-B-HARNESS-DESIGN
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
---

# FURLANICH architecture map

## CURRENT

The application is a Next.js 16 App Router site with one client-rendered `/` page. `app/page.tsx` composes a scrolling personal-portfolio experience from `components/core`, `components/layout`, and `components/sections`. Content is JSON under `data/`; interface messages are English and Spanish JSON under `locales/`; `lib/` supplies typed data access.

Tailwind CSS provides utility styling and the small component primitives. `next/font` loads Inter; `public/` holds static images, including legacy project previews. The site is statically exported with trailing slashes, optional GitHub Pages base path/asset prefix, and unoptimized images. The deployment workflow builds `main` with Node 24 and publishes `out/` to GitHub Pages.

The dependency boundary is Next.js, React, TypeScript, Tailwind, `next-intl`, Framer Motion, React Hook Form, and Lucide React. Repository checks are documentation integrity, Node-based validator tests, ESLint, TypeScript no-emit checking, and the production static build. See [current system](docs/architecture/current-system.md) and [quality findings](docs/architecture/current-quality-findings.md) for evidence and limits.

## APPROVED product constraints

The intended product is a bilingual, commercial-first FURLANICH site with Spanish root routes and English `/en/` routes, as defined by the [information architecture](docs/product/information-architecture.md). The current single-page/client-state localization model is not approval to retain that implementation. Product and design requirements remain authoritative in [project knowledge](docs/index.md).

The approved [homepage hero implementation boundary](docs/rfcs/homepage-hero-implementation-boundary.md) governs the first business-homepage slice. Its English copy, minimum visual direction, responsive/motion behavior, CTA destinations, and founder-content preservation scope are now approved in their owning product/design records.

Application implementation remains blocked by one consequential architecture decision: the static-compatible App Router and localization structure for Spanish root routes and English `/en/` routes. Architecture governance must accept that decision, record it in an ADR, and create the required versioned execution plan. Canonical-domain selection is a release blocker rather than an implementation blocker. Long-term hosting may be deferred while the current static-export and base-path compatibility constraints are preserved.

## PROPOSED architecture

The preserved recommendation is incremental, static-first modernization: reduce unnecessary client boundaries and evolve the existing repository rather than perform a greenfield rebuild. It is a recommendation, not implementation authority. See the [architecture index](docs/architecture/index.md).

## OPEN questions

The localized routing implementation remains OPEN and blocks homepage-foundation implementation. Long-term hosting, final form/provider integration, the extended design system, whole-site accessibility claims, performance budgets, canonical domain, and imagery outside the typography-led hero remain OPEN with the blocker levels recorded in the RFC decision closure map and their owning documents.

## Engineering records

Use the [engineering lifecycle](docs/governance/engineering-lifecycle.md) to classify change. Accepted consequential decisions belong in [ADRs](docs/decisions/index.md); active and completed substantial work belongs in [execution plans](docs/plans/index.md).
