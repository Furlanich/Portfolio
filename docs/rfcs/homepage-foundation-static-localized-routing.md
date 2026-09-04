---
id: RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
type: request-for-comments
status: PROPOSED
related:
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - IA-SITE
  - CONTENT-LOCALIZATION
  - PORTFOLIO-MIGRATION
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - PAGE-FOUNDER
  - ARCHITECTURE-MAP
last_verified: 2026-09-04
---

# Static localized routing for the homepage foundation

## Context

The approved [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](homepage-hero-implementation-boundary.md) records one remaining implementation blocker after product/design decision closure: the App Router and localization structure that serves Spanish at root routes and English below `/en/` while preserving the current static export.

The current application has one Client Component page at `/`. It imports both message sets, defaults to English in React state, changes `document.documentElement.lang` after hydration, and uses in-page anchors instead of the page-equivalent routes approved by [`IA-SITE`](../product/information-architecture.md). The current build uses `output: 'export'`, `trailingSlash: true`, and a build-time `/Portfolio` base path for GitHub Pages.

The relevant platform constraints are:

- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports) emits an HTML file per route but does not support rewrites, redirects, headers, or Proxy;
- [Next.js root layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) may be separated with route groups and can own distinct `<html>` attributes, with a full page load when navigating between root layouts;
- [`basePath`](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath) is fixed at build time and is automatically applied by `next/link` and Next.js navigation;
- the standard [`next-intl` locale-routing setup](https://next-intl.dev/docs/routing/setup) uses a top-level `[locale]` segment and Proxy, while localized public pathnames use rewrites. That runtime routing layer is not available in the current export mode.

## Problem

`IA-SITE` remains authoritative for public route names. The architecture must directly implement this minimum mapping rather than redefine it:

```text
Spanish: /, /servicios/, /contacto/, /estudio/samuel-furlanich/
English: /en/, /en/services/, /en/contact/, /en/about/samuel-furlanich/
```

Each route must emit usable localized HTML at build time, including the correct document language, without waiting for JavaScript. Language switching must navigate to the page-equivalent route and must not use query parameters, cookies, automatic detection, or browser-only locale state.

A uniform internal `[locale]` tree would normally centralize this concern, but hiding the Spanish prefix and translating route segments requires runtime rewrite/redirect behavior. Changing hosting to enable that behavior would expand the homepage foundation into a separate deployment decision.

## Requirements

The selected architecture must:

- implement the Spanish root and English `/en/` routes exactly as approved by `IA-SITE`;
- remain compatible with `output: 'export'`, trailing-slash URLs, the current GitHub Pages deployment, and an optional build-time `basePath`;
- render `lang="es-AR"` or `lang="en"` in the initial HTML without client mutation;
- keep page copy owned by the localized route and keep shared presentation components independent of routing and locale state;
- provide one typed source of page-equivalent route pairs for navigation and language switching;
- eliminate the current homepage-level locale state and the combined Spanish/English client message bundle when the business homepage replaces it;
- preserve the personal portfolio until both localized Founder destinations pass the `PORTFOLIO-MIGRATION` integration gate;
- avoid a hosting migration, runtime Proxy, rewrites, automatic locale detection, or a custom post-build HTML routing transform;
- keep canonical-domain selection as a release concern without inventing a production origin during implementation;
- add no application, dependency, build, or deployment changes in this Governance PR.

## Proposed approach

Use explicit static route trees separated by locale-specific root layouts.

### Route and document structure

Remove the single top-level `app/layout.tsx` as part of the later implementation and place the localized routes under two route groups:

```text
app/
├── (es)/
│   ├── layout.tsx                         # <html lang="es-AR">
│   ├── page.tsx                           # /
│   ├── servicios/page.tsx                 # /servicios/
│   ├── contacto/page.tsx                  # /contacto/
│   └── estudio/samuel-furlanich/page.tsx  # /estudio/samuel-furlanich/
└── (en)/
    ├── layout.tsx                         # <html lang="en">
    └── en/
        ├── page.tsx                       # /en/
        ├── services/page.tsx              # /en/services/
        ├── contact/page.tsx               # /en/contact/
        └── about/samuel-furlanich/page.tsx # /en/about/samuel-furlanich/
```

Route groups do not change public URLs. Each root layout owns the correct `<html lang>` and shared font/global-style setup for its locale. Navigation within one locale can remain client-side; changing language crosses root layouts and performs a full document navigation. That reload is an accepted trade-off for correct static document semantics and affects only explicit language switches.

Do not introduce a `[locale]` dynamic segment for this slice. There are only two fixed locale trees, the Spanish tree intentionally has no public prefix, and the approved Spanish and English path segments differ.

### Route-owned content and shared components

Keep localized content in page-scoped modules, grouped by page and locale, with TypeScript types for each shared view model. Each Server Component route imports exactly one locale's content and passes it to shared semantic components as data.

Shared components may own markup, responsive layout, and accessible interaction behavior. They must not choose a locale, inspect the pathname to infer one, import both locale variants, or own public route strings. Shared navigation receives the active locale, semantic route identifier, localized labels, and resolved hrefs from the route boundary.

Create one typed route-equivalence map for the approved foundation routes. It maps a semantic route identifier such as `home`, `services`, `contact`, or `founder` to its Spanish and English pathname. Route entry points supply their semantic identifier; the language switch looks up the equivalent target directly instead of parsing or rewriting the current pathname.

Use `next/link` with application-relative pathnames for internal links so Next.js applies the configured base path exactly once. Keep the existing explicit base-path helper only where raw public-asset URLs require it.

### Legacy localization transition

Foundation route entry points are Server Components. They do not use the current `useState<Locale>`, `useEffect` document-language mutation, or a page-wide `NextIntlClientProvider` containing both message sets.

The existing `next-intl` dependency may remain temporarily while legacy components still consume it during the migration. New foundation routes do not adopt `next-intl` Proxy routing. Client Components that genuinely need localized interactive messages receive only the active route's messages or typed labels from their Server Component boundary. Removing `next-intl` after its final consumer disappears is a routine plan-level cleanup, not part of this architecture decision.

The current personal homepage remains available until the implementation release contains both localized Founder routes and their verified CV/professional links. The execution plan must make the route cutover atomic from a user perspective and retain a rollback point before replacing `/`. Preparatory shared modules may land separately only when they do not expose incomplete public routes; removing the top-level root layout and publishing the locale-specific route trees must occur in one integration change containing all eight minimum routes.

### Static export, GitHub Pages, and hosting

Preserve `output: 'export'`, `trailingSlash: true`, the build-time `NEXT_PUBLIC_BASE_PATH`, and the current GitHub Pages workflow for this migration. The implementation must verify both the normal build and the `/Portfolio` build and confirm the expected localized `out/**/index.html` files exist.

No Proxy, rewrite, redirect, cookie, request-header locale negotiation, or server runtime is introduced. Long-term hosting remains outside this RFC. If a later hosting decision enables runtime routing and creates enough value to revisit this structure, that change requires its own architecture governance rather than being anticipated here.

### Metadata and canonical domain

Correct document language is an implementation requirement. Locale-specific layouts/pages can emit static titles and descriptions through the Metadata API, but they may use only copy approved in the owning product/content record; this RFC does not promote the broader proposed metadata wording in `CONTENT-LOCALIZATION`.

Self-referencing canonical URLs, absolute `hreflang` alternates, `og:url`, and sitemap language alternates depend on an approved production origin. They remain release concerns owned by `CONTENT-LOCALIZATION`. The implementation must not invent a domain or publish placeholder absolute URLs. The typed route-equivalence map should be reusable by later metadata generation after the canonical origin is approved.

## Alternatives considered

### Use `[locale]` with `next-intl` locale routing

Place pages under `app/[locale]/` and configure `localePrefix: 'as-needed'` plus localized pathnames. This provides one internal route tree and mature locale-aware navigation. However, the unprefixed default locale and translated pathnames rely on Proxy rewrites and redirects, which `output: 'export'` does not support. Adopting it now would require a hosting/runtime migration that the approved foundation explicitly defers.

### Generate prefixed routes and rewrite exported files

Generate `/es/...` and `/en/...` from one dynamic route tree, then copy or move Spanish HTML into root paths and rewrite asset, navigation, metadata, and RSC payload references after `next build`. This preserves static hosting and centralizes route source files, but introduces a custom artifact transformation coupled to undocumented build output. The failure modes are difficult to validate and provide no proportional value for two locales and four foundation pages.

### Keep client-only locale state

Continue serving one `/` document and switch messages after hydration. This minimizes file movement, but it does not create the approved routes, ships both languages together, cannot provide correct language-specific initial HTML or metadata, and fails when JavaScript is unavailable. It is incompatible with `IA-SITE` and the approved interaction baseline.

## Trade-offs

- Route entry files and minimal root-layout wrappers are duplicated between languages; shared components, content types, and route equivalence remain centralized.
- Language switching causes a full document load because it crosses root layouts. The destination remains exact, accessible, and static.
- Explicit public route files require adding both language variants deliberately. This is more verbose than a runtime rewrite table but makes missing translations visible at build and review time.
- The architecture favors the current two-locale, static commercial site over theoretical runtime locale growth. A future server-hosting migration may justify a different routing layer.
- Retaining `next-intl` temporarily avoids unrelated cleanup, but both old and new localization approaches may coexist until the atomic homepage/founder cutover is complete.

## Migration and implementation impact

This Governance PR changes documentation only.

If approved, create an ADR recording the explicit dual static route-tree decision and a versioned execution plan. The plan should sequence:

1. typed route equivalence, localized content contracts, and locale-specific root layouts;
2. minimum Spanish and English Services, Contact, and Founder destinations;
3. verification of CV and professional links required by `PORTFOLIO-MIGRATION`;
4. localized homepage routes and hero integration, followed by removal of the legacy homepage locale state;
5. static-export/base-path artifact checks, responsive and keyboard QA, rollback verification, and documentation synchronization.

The implementation plan may divide preparatory shared modules into earlier Implementation PRs only when they expose no incomplete routes. The locale-root cutover and all eight minimum routes must land together, and no PR may make the business hero primary before the Founder migration gate and both CTA destinations are satisfied.

## Risks

- Duplicate route entry points can drift if semantic route IDs, content types, and page-pair tests are omitted.
- Removing the top-level root layout requires deliberate sharing of fonts, global styles, and shell behavior between both locale layouts.
- Language switches are full page loads; unsaved client state would be lost. The approved foundation routes do not contain state that must survive a locale change.
- A raw asset URL or manual base-path prefix can break GitHub Pages if it bypasses or duplicates Next.js base-path handling.
- Coexistence with legacy `next-intl` consumers can become permanent unless the execution plan tracks their retirement.
- Adding canonical metadata before the production origin is approved can publish incorrect absolute URLs.

## Unresolved questions

- Does human review approve explicit locale route trees and the full-document language switch as the foundation architecture?
- After approval, which ADR number records the decision and which execution plan owns delivery? These are record identifiers, not additional product or architecture choices.

Localized 404 behavior, project-detail routing, service fragments, runtime locale growth, a hosting migration, and whole-site metadata generation are outside this RFC unless they become necessary to deliver the approved foundation routes.

## Recommendation

Approve the explicit dual static route-tree architecture. It satisfies the approved public URLs and no-JavaScript language behavior using supported App Router primitives, preserves GitHub Pages and static export, constrains shared components to presentation, and leaves canonical metadata and future hosting at their correct release/governance boundaries.

## Status

**PROPOSED.** This RFC requests human approval for the homepage-foundation routing/localization architecture. It does not authorize application changes, create an ADR, or resolve the deferred release and future-site questions.
