---
id: ARCHITECTURE-MAP
type: architecture-map
status: APPROVED
related:
  - ARCH-CURRENT
  - ARCH-FINDINGS
  - ARCH-STAGE-B-HARNESS-DESIGN
last_verified: 2026-09-02
---

# FURLANICH architecture map

## CURRENT

The application is a Next.js 16 App Router site with one client-rendered `/` page. `app/page.tsx` composes a scrolling personal-portfolio experience from `components/core`, `components/layout`, and `components/sections`. Content is JSON under `data/`; interface messages are English and Spanish JSON under `locales/`; `lib/` supplies typed data access.

Tailwind CSS provides utility styling and the small component primitives. `next/font` loads Inter; `public/` holds static images, including legacy project previews. The site is statically exported with trailing slashes, optional GitHub Pages base path/asset prefix, and unoptimized images. The deployment workflow builds `main` with Node 24 and publishes `out/` to GitHub Pages.

The dependency boundary is Next.js, React, TypeScript, Tailwind, `next-intl`, Framer Motion, React Hook Form, and Lucide React. Repository checks are documentation integrity, Node-based validator tests, ESLint, TypeScript no-emit checking, and the production static build. See [current system](docs/architecture/current-system.md) and [quality findings](docs/architecture/current-quality-findings.md) for evidence and limits.

## APPROVED product constraints

The intended product is a bilingual, commercial-first FURLANICH site with Spanish root routes and English `/en/` routes, as defined by the [information architecture](docs/product/information-architecture.md). The current single-page/client-state localization model is not approval to retain that implementation. Product and design requirements remain authoritative in [project knowledge](docs/index.md).

## PROPOSED architecture

The preserved recommendation is incremental, static-first modernization: reduce unnecessary client boundaries and evolve the existing repository rather than perform a greenfield rebuild. It is a recommendation, not implementation authority. See the [architecture index](docs/architecture/index.md).

## OPEN questions

Target routing and localization implementation, long-term hosting, final form/provider integration, design-system direction, accessibility conformance level, performance budgets, canonical domain, and target imagery strategy need the governance path before they become architecture decisions.

## Engineering records

Use the [engineering lifecycle](docs/governance/engineering-lifecycle.md) to classify change. Accepted consequential decisions belong in [ADRs](docs/decisions/index.md); active and completed substantial work belongs in [execution plans](docs/plans/index.md).
