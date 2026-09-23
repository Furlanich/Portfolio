---
id: ARCHITECTURE-MAP
type: architecture-map
status: APPROVED
related:
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - REVIEW-IMMERSIVE-HOMEPAGE-PROTOTYPE-2026-09-19
  - RFC-VISUAL-IDENTITY-IMMERSIVE-EXPERIENCE-V1
  - ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE
  - PLAN-MARKETING-PRESENTATION-EXCELLENCE
  - ARCH-CURRENT
  - ARCH-FINDINGS
  - ARCH-STAGE-B-HARNESS-DESIGN
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - PLAN-HOMEPAGE-COMPLETION
  - PLAN-SERVICES-EXPERIENCE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PLAN-STUDIO-FOUNDER-COMPLETION
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PROJECT-EVIDENCE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
last_verified: 2026-09-23
---

# FURLANICH architecture map

## CURRENT

The current application is a Next.js 16 App Router site with fourteen static foundation routes: Spanish at the root and English under `/en/`, plus six paired static project-detail artifacts. Locale-specific Server Component trees compose shared semantic foundation components from route-owned content. The paired Privacy routes use a shared server-rendered composition and exact locale-owned demonstration disclosure. Retained founder source remains under `data/`; the obsolete project JSON, project-only types/exports, animated Card primitive, and unapproved legacy project SVGs were retired after Task 4 consumer verification.

Tailwind CSS provides utility styling and the small component primitives. `app/fonts.ts` self-hosts Instrument Sans and IBM Plex Mono through `next/font/local` for both locale layouts; `tailwind.config.ts` maps the shared `foundation` roles onto the approved identity palette. `public/brand/` holds the protected Contained Master marks and lockups, and `public/` also holds the favicons and other static images, including the three approved conceptual project-detail visuals. The site is statically exported with trailing slashes, optional GitHub Pages base path/asset prefix, and unoptimized images. The deployment workflow builds `main` with Node 24 and publishes `out/` to GitHub Pages.

Studio and Founder are implemented as separate localized route pairs. Studio navigation points to `/estudio/` and `/en/about/`; Founder remains nested and secondary. Founder uses `Ingeniero de software` / `Software Engineer` as Samuel's general professional descriptor while retaining `Software Developer` as the exact Clever Soft SA employment title and factual completed Computer Science studies wording. The earlier Founder-as-Studio/minimum-profile gap was closed by the [completed Studio/Founder plan](docs/plans/completed/studio-founder-completion.md), including integration PR #40 (`cc18f55`). This factual synchronization addresses MKT-DOC-001; the accepted marketing revisions were delivered through T1–T6 under the [completed PLAN-MARKETING-PRESENTATION-EXCELLENCE](docs/plans/completed/marketing-presentation-excellence-v1.md). D03 and the remaining evidence/identity limits stay bounded by their owning records.

The runtime dependency boundary is Next.js, React, TypeScript, Tailwind, Framer Motion, React Hook Form, and Lucide React. The approved foundation has no runtime localization dependency. Development verification adds pinned Playwright Test and axe integration. Repository checks are documentation/Skill integrity, Node contract tests, ESLint, TypeScript no-emit checking, production static build and artifact verification, a three-engine browser smoke suite, responsive profiles, and representative automated accessibility scans. See [current system](docs/architecture/current-system.md), [testing strategy](docs/testing/strategy.md), and [quality findings](docs/architecture/current-quality-findings.md) for evidence and limits.

Task 2 current state: the complete commercial homepage is merged with fourteen static Spanish-root and English-/en/ foundation routes, including the bilingual image-free Projects index, route-owned public project content, the typed fail-closed project manifest, shared Server Component cards, and Projects navigation. Task 3 current state: the paired demonstration Privacy routes, exact locale-owned disclosure, semantic route equivalence, localized footer destinations, and static/base-path/browser/accessibility checks are present on main at commit fd2833d. GitHub reports no Pull Request associated with the commit; PR creation was rejected because there are no commits between main and codex/contact-inquiry-pr3. Task 3/4 project state: the three approved detail-destination entries generate exactly six paired static detail artifacts, and the former legacy project publication paths are removed. The implementation preserves the static-export and optional GitHub Pages base-path constraints while retaining only approved project WebP visuals and unrelated founder source material.

Home now uses the approved D02 bilingual hero/action/accountability/availability copy and the MKT-D05 seven-section consolidation, including a distinct Problems heading/introduction, three situation rows, the technical-accountability Projects bridge and a demo-only final CTA paragraph.

## Current Contact demonstration — Task 4 / PR 4

This section supersedes the older pre-merge baseline wording above: Contact Task 4 is merged in `e17fd1e`, deployed on `gh-pages`, and recorded by the completed Contact + Inquiry plan.

The public Contact pair at /contacto/ and /en/contact/ now renders a shared server-side ContactPage with a narrow client-side ContactForm. The form keeps exactly four validated fields, uses React Hook Form for browser values, and uses a pure reducer for validation, submission, simulated success, failure, retry, duplicate prevention, focus, announcements, preservation, and reset behavior.

The client boundary constructs createDemoSubmitInquiry() with the approved 650 ms local delay. A normalized failure@example.invalid email produces the opaque unavailable scenario; other validated values produce simulated acceptance. No Contact submission calls fetch, XHR, beacon, navigation, storage, logging, analytics, mail, or a provider endpoint. WhatsApp, email, and phone remain explicit external fallback links in that order. The deployment workflow no longer receives NEXT_PUBLIC_FORMSPREE_ENDPOINT; the dormant Formspree adapter remains isolated for a separately reviewed commercial activation.

Task 3 / PR 3 was confirmed merged as PR #47 after the earlier transient branch-state note. Task 4 / PR 4 is merged as `e17fd1e` and deployed. Automated RED/GREEN, static-export, browser, representative axe, and deployed zero-transmission evidence is recorded in the completed Contact + Inquiry implementation plan; no whole-site conformance claim is made.

## APPROVED product constraints

The intended product is a bilingual, commercial-first FURLANICH site with Spanish root routes and English `/en/` routes, as defined by the [information architecture](docs/product/information-architecture.md). The former single-page/client-state localization model is retained only as historical context. Product and design requirements remain authoritative in [project knowledge](docs/index.md).

The approved [homepage hero implementation boundary](docs/rfcs/homepage-hero-implementation-boundary.md) governs the first business-homepage slice. Its English copy, minimum visual direction, responsive/motion behavior, CTA destinations, and founder-content preservation scope are now approved in their owning product/design records.

Initiative 2 approves the seven commercial homepage sections below `HOME-HERO`, including their bilingual content, evidence-safe `HOME-PROOF` fallback, and minimum section visual/interaction rules. They fit the accepted locale-owned content and shared locale-agnostic component boundary. No new routing, localization, hosting, dependency, CMS, backend, or design-system architecture is required; implementation is recorded by [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/completed/homepage-completion.md).

Initiative 3 delivered the complete bilingual Services page within the same boundary: locale-owned typed content, shared locale-agnostic semantic Server Components, the existing Services routes, static semantic fragments, and extensions of the approved homepage presentation primitives. Stable `#web`, `#whatsapp`, `#consultoria`, and `#consulting` fragments do not create routes or require runtime routing state. No new localization, hosting, dependency, CMS, backend, data, or design-system architecture was required. The implementation history is recorded by [`PLAN-SERVICES-EXPERIENCE`](docs/plans/completed/services-experience.md) under `ADR-STATIC-LOCALIZED-ROUTING`; no RFC or new ADR was required.

Initiative 4's Projects/Evidence decisions also fit the accepted boundary. [`PLAN-PROJECTS-EVIDENCE-EXPERIENCE`](docs/plans/completed/projects-evidence-experience.md) selects a typed static public manifest, route-owned localized public copy, shared locale-agnostic Server Components, conditional static detail generation, and post-migration cleanup. Internal permission and evidence audits remain Markdown in `docs/product/projects/` and are never parsed or mirrored into public application data. Task 1 established the empty fail-closed contract without public behavior. Task 2 populates that manifest and adds the static bilingual index/navigation. Task 3 adds only the three item-approved paired summary-only detail routes. Task 4 removes the obsolete project publication paths after consumer verification; no blocked, private, retired, unresolved, production-claim, or homepage record enters the public projection. No CMS, backend, project API, database, filter/search subsystem, media service, hosting change, RFC, or new ADR is required.

Initiative 5 closes Studio and Founder product/design decisions within the same accepted boundary. The approved implementation adds the existing sitemap's /estudio/ and /en/about/ pair as semantic Studio routes, retains the nested Founder pair, routes primary navigation to Studio, and uses route-owned localized content with shared locale-agnostic semantic components. It reuses existing tokens, primitives, static export, trailing slashes, and optional base-path behavior. The completed work is recorded by [`PLAN-STUDIO-FOUNDER-COMPLETION`](docs/plans/completed/studio-founder-completion.md), which sequences route/content contracts, Studio publication, Founder completion, and cross-page verification in four reviewable implementation PRs. It requires no RFC, new ADR, CMS, backend, runtime localization, dependency, hosting change, or new design-system architecture.

Initiative 6 has two accepted modes. [`ADR-CONTACT-INQUIRY-DEMO-MODE`](docs/decisions/contact-inquiry-demonstration-mode.md) governs the current public portfolio/technical demonstration at `https://furlanich.github.io/Portfolio/`: the complete four-field Contact UI uses a local adapter, simulates success/failure, and sends or stores nothing. [`ADR-CONTACT-INQUIRY-PIPELINE`](docs/decisions/contact-inquiry-pipeline.md) retains Formspree behind the same provider-neutral port for a later commercial activation. [`PLAN-CONTACT-INQUIRY-PIPELINE`](docs/plans/completed/contact-inquiry-pipeline.md) records the completed demonstration Privacy/Contact and deployed zero-transmission proof while preserving real privacy/legal/provider/inbox/deletion gates for separate activation.

The static-compatible App Router and localization structure was accepted through the routing RFC and is recorded in [`ADR-STATIC-LOCALIZED-ROUTING`](docs/decisions/static-localized-routing.md). [`PLAN-HOMEPAGE-FOUNDATION`](docs/plans/completed/homepage-foundation.md) records foundation delivery, and [`PLAN-HOMEPAGE-COMPLETION`](docs/plans/completed/homepage-completion.md) records the completed homepage implementation sequence. The default GitHub Pages project URL is the approved canonical deployment URL; no custom domain is planned. Long-term hosting may still be reconsidered only through a future architecture decision while current static-export and `/Portfolio` base-path constraints remain.

## ACCEPTED target architecture

The homepage foundation uses explicit Spanish root routes and English `/en/` routes under locale-specific root layouts. Localized routes own their content and supply typed view models and resolved links to shared locale-agnostic components. A semantic route-equivalence map owns language-switch destinations. Conditional project-detail routes use the same stable slug in both locale trees and are generated only from an explicit public whitelist. The target has no runtime locale negotiation or client-only locale state and preserves static export, trailing slashes, GitHub Pages, and the build-time base path for this migration.

The accepted route tree, component boundaries, migration rules, trade-offs, and approval provenance are owned by `ADR-STATIC-LOCALIZED-ROUTING`; this map does not duplicate them.

## HISTORICAL migration state — pre-cutover record

Before the completed atomic locale-root cutover, the personal homepage and client-only localization remained the public implementation. The following transition rules are historical, not current implementation gaps. Behavior-neutral route contracts and route-private localized content may coexist during preparatory PRs, but incomplete public locale trees must not be exposed. `next-intl` may remain temporarily for legacy consumers and is removed only after repository search proves its final consumer is gone. The active execution plan owns this transition and its rollback gates.

## PROPOSED architecture

The preserved recommendation is incremental, static-first modernization: reduce unnecessary client boundaries and evolve the existing repository rather than perform a greenfield rebuild. It is a recommendation, not implementation authority. See the [architecture index](docs/architecture/index.md).

## APPROVED immersive-homepage architecture

[`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](docs/rfcs/adaptive-immersive-homepage-production-v1.md) approves C2 Adaptive System Instrument: semantic HTML and static chapter posters, direct demand-rendered Three.js, the existing Framer Motion progress boundary and one governed native-video surface in Connection. [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](docs/decisions/adaptive-immersive-homepage.md) records the runtime and supersedes [`ADR-PROGRESSIVE-IMMERSIVE-HOMEPAGE`](docs/decisions/progressive-immersive-homepage.md). The [prototype review](docs/reviews/immersive-homepage-prototype-2026-09-19/index.md) remains the evidence source. [`PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1`](docs/plans/active/visual-identity-adaptive-immersive-v1.md) is APPROVED for sequential implementation through human-reviewed Pull Requests.

## APPROVED contact-demonstration architecture

For the current deployment, [`ADR-CONTACT-INQUIRY-DEMO-MODE`](docs/decisions/contact-inquiry-demonstration-mode.md) accepts `ContactForm -> submitInquiry() -> demo adapter -> local simulated outcome`, with no network, storage, mail, logging, or analytics. The GitHub Pages build must not receive the Formspree endpoint. The existing `ContactForm -> submitInquiry() -> Formspree adapter -> Formspree HTTPS endpoint -> configured inbox` boundary remains dormant under `ADR-CONTACT-INQUIRY-PIPELINE` until a separately reviewed commercial activation passes every real gate.

## OPEN questions

Commercial Contact account/delivery/deletion behavior, complete processor/transfer facts, professional privacy/legal wording, long-term hosting beyond the approved default GitHub Pages site, whole-site accessibility claims, visual-identity prototype thresholds, global performance budgets beyond the accepted homepage gate, and optional imagery outside approved evidence remain OPEN in their owners. These items do not block the zero-transmission demonstration and are not satisfied by mock resources.

## Engineering records

Use the [engineering lifecycle](docs/governance/engineering-lifecycle.md) to classify change. Accepted consequential decisions belong in [ADRs](docs/decisions/index.md); active and completed substantial work belongs in [execution plans](docs/plans/index.md).
