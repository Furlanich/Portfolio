---
id: ADR-STATIC-LOCALIZED-ROUTING
type: architecture-decision-record
status: APPROVED
date: 2026-09-04
related:
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - IA-SITE
  - CONTENT-LOCALIZATION
  - PORTFOLIO-MIGRATION
last_verified: 2026-09-04
---

# Static localized routing

## Context

FURLANICH must serve Spanish at root routes and equivalent English pages below `/en/`, preserve page context when a visitor changes language, and emit static trailing-slash URLs. The current application instead serves one client-rendered page at `/`, defaults to English in React state, ships both message sets, and changes the document language after hydration.

The migration remains on the current Next.js static-export and GitHub Pages deployment model. Runtime locale negotiation, Proxy, rewrites, redirects, and request-dependent rendering are therefore unavailable for this slice. The accepted delivery boundary also requires the localized Founder replacement and real Services and Contact destinations before the business homepage becomes primary.

## Decision

Use two explicit App Router route trees separated by locale-specific route groups:

- Spanish pages are static routes at `/`, `/servicios/`, `/contacto/`, and `/estudio/samuel-furlanich/`.
- English equivalents are static routes at `/en/`, `/en/services/`, `/en/contact/`, and `/en/about/samuel-furlanich/`.
- Each locale group owns a root layout. The Spanish layout emits `<html lang="es-AR">`; the English layout emits `<html lang="en">`.
- Route entry points are Server Components by default and import only their locale's route-owned content.
- Shared components remain locale-agnostic. They receive typed content, the active semantic route identifier, and already-resolved links instead of selecting a locale or parsing a pathname.
- One typed semantic route-equivalence map owns the Spanish and English path for each foundation page: Home, Services, Contact, and Founder. Language switching uses that map and navigates to the equivalent page.
- Internal application links use Next.js navigation with application-relative paths so the configured `basePath` is applied once. The explicit base-path helper remains limited to raw public-asset URLs.
- The target architecture has no runtime locale negotiation, automatic locale redirect, query-string locale, or client-only locale state. The legacy homepage-level `NextIntlClientProvider`, combined message bundle, stateful locale switch, and post-hydration document-language mutation are removed at cutover.
- `next-intl` may coexist temporarily only while a remaining legacy consumer requires it. Removing the dependency after its final consumer disappears is routine cleanup.
- Preserve `output: 'export'`, `trailingSlash: true`, the optional build-time `NEXT_PUBLIC_BASE_PATH`, and the current GitHub Pages workflow for this migration.
- The locale-root cutover is atomic: both locale layouts and all eight minimum routes land together. The business homepage does not become primary until both localized Founder routes satisfy `PORTFOLIO-MIGRATION` and the localized Services and Contact destinations are usable.
- Correct initial document language and removal of personal-portfolio metadata are implementation concerns. Absolute canonical URLs, `hreflang` alternates, `og:url`, and sitemap language alternates remain release concerns until a production origin is approved.

## Rationale

Explicit route files use supported static App Router behavior and produce inspectable HTML for every approved public URL. Separate locale root layouts provide correct initial document semantics without JavaScript. The design keeps the current deployment available while constraining localization, navigation, and shared-component responsibilities enough for later implementation PRs to be bounded and testable.

The route-equivalence map centralizes cross-language navigation without creating a runtime routing layer. Route-owned content prevents both languages from being coupled into one client bundle, while typed shared-component inputs preserve markup and interaction reuse.

## Consequences

- Locale route entry points and small layout wrappers are duplicated deliberately.
- Explicit route pairs make a missing translation visible during implementation and review.
- Changing language crosses root layouts and performs a full document navigation. Foundation routes contain no state that must survive that action.
- Shared fonts, global styles, metadata defaults, and shell behavior must be applied consistently in both root layouts.
- The implementation must validate the ordinary static export and the GitHub Pages `/Portfolio` base-path build, including all eight expected `out/**/index.html` artifacts and their document languages.
- Legacy localization and the accepted target may coexist during preparatory PRs, but incomplete public route trees must not be exposed.
- A future hosting migration or materially different locale-routing layer requires new architecture governance and may supersede this ADR.
- The canonical-domain release blocker remains OPEN and does not block route, component, or integration work.

## Alternatives rejected

### Dynamic `[locale]` routes with next-intl routing

Rejected for this migration because hiding the Spanish prefix and translating public path segments depend on runtime Proxy rewrites or redirects that the current static export cannot provide. Adopting this option would also force an unapproved hosting migration.

### Post-process exported locale routes

Rejected because copying or rewriting generated HTML, assets, navigation, metadata, and React Server Component payload references would couple the project to build output and create disproportionate failure modes for two locales and four foundation pages.

### Client-only locale state

Rejected because one hydrated document cannot provide the approved route set, correct language-specific initial HTML, or page-equivalent URLs, and it fails the no-JavaScript localization requirement.

## Related RFC

The decision was proposed in [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](../rfcs/homepage-foundation-static-localized-routing.md) and accepted when [Governance PR #6](https://github.com/Furlanich/Portfolio/pull/6) was merged by the repository owner on 2026-09-04.

[`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](../rfcs/homepage-hero-implementation-boundary.md) remains the approved delivery and migration boundary. It does not need a separate ADR because it sequences approved work and integration gates rather than establishing an additional durable technical architecture.

## Related product requirements

- [`IA-SITE`](../product/information-architecture.md) owns public routes, route equivalence, Spanish priority, trailing slashes, and the absence of automatic locale redirection.
- [`CONTENT-LOCALIZATION`](../product/content-and-localization.md) owns locale priority, approved minimum English scope, and the canonical-domain release blocker.
- [`PORTFOLIO-MIGRATION`](../product/personal-portfolio-migration.md) owns founder-content preservation and the homepage cutover gate.
- [`PAGE-HOME`](../product/pages/home.md), [`PAGE-SERVICES`](../product/pages/services.md), [`PAGE-CONTACT`](../product/pages/contact-and-privacy.md), and [`PAGE-FOUNDER`](../product/pages/studio-and-founder.md) own the approved content and destination acceptance criteria.
- [`DESIGN-VISUAL`](../design/visual-language.md) and [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md) own the homepage-foundation visual, responsive, interaction, and accessibility requirements.

## Date and status

**APPROVED — 2026-09-04.** Recorded after the repository owner merged Governance PR #6. This ADR is the durable architecture authority for the homepage-foundation localized-routing migration.
