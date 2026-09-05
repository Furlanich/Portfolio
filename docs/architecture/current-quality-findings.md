---
id: ARCH-FINDINGS
type: existing-system-assessment
status: APPROVED
related:
  - ARCH-CURRENT
  - DESIGN-IX-A11Y
  - PORTFOLIO-MIGRATION
last_verified: 2026-09-05
---

# Current quality findings

The findings below are retained pre-cutover evidence. The current foundation and Task 4 cleanup verification is recorded first; the historical findings remain useful for later migration and are not authorization for work outside approved plans.

## Current foundation and cleanup verification — 2026-09-04

- The eight approved static foundation routes render through locale-specific Server Component trees: Spanish at the root and English under /en/.
- Normal and /Portfolio base-path production builds passed the static artifact verifier.
- Agent-browser verification covered all eight routes at 320x800, 375x812, 768x1024, 1024x768, and 1440x900 with no horizontal overflow, one H1 per route, and correct document languages.
- Language switching, keyboard focus, JavaScript-disabled rendering, reduced-motion behavior, CV routing, direct contact links, and Founder professional destinations passed. Anonymous LinkedIn navigation reached LinkedIn's auth wall; the owner-supplied destination remains unchanged.
- axe-core reported zero violations and zero incomplete checks on all eight routes. The active-source cleanup contract passed, no legacy localization references remain in `app/`, `components/`, `lib/`, or `locales/`, and lint reports zero errors and zero warnings.

## Current commercial homepage verification — 2026-09-05

- The Spanish and English homepages render the approved eight-section narrative with one `main`, one H1, labelled H2 sections, semantic peer lists, and an ordered Process list.
- Browser checks covered `/` and `/en/` at `320x800`, `375x812`, `768x1024`, `1024x768`, and `1440x900`; no horizontal overflow was observed, and the expected Problems/Audiences, Services, Process, Founder, and CTA responsive transitions were confirmed.
- Homepage Problems, Services, and Audiences card groups use equal content-driven grid rows with full-height card surfaces. Browser measurements at `320x800` and `1440x900` in both locales confirmed equal card heights, no card clipping, and no normal-scale horizontal overflow; card-scoped `200%` root-text probes also retained equal heights without clipping.
- `/Portfolio/` and `/Portfolio/en/` were reached in a base-path development preview at `375x812`; localized Process anchors and internal Services paths retained the base path with no overflow. Normal and `/Portfolio` static artifact checks also passed.
- Keyboard focus exposed the approved 3px visible outline, reduced-motion mode changed smooth scrolling to `auto` and transitions to `0s`, and Process navigation landed on the localized hash. Spanish and English axe-core scans each reported zero violations, zero incomplete checks, and 35 passes; no page errors or console output were observed after clearing the browser logs.
- Screenshots were captured for the required home-route viewport matrix in the non-repository visual QA workspace and were intentionally not committed. JavaScript-disabled rendering was not separately exercised in this phase; the homepage remains server-rendered and static-exported, while a whole-site accessibility claim remains OPEN.

## Current Services verification — 2026-09-05

- `/servicios/` and `/en/services/` were checked at `320x800`, `375x812`, `768x1024`, `1024x768`, and `1440x900`; both locales rendered one `main`, one H1, the approved H2 sequence, unique service IDs, wrapped index links, and no horizontal overflow.
- Direct Spanish `#whatsapp` and base-path `#consultoria` loads landed with the target section below the header; in-page index navigation reached `#whatsapp`; language switching from an anchored Spanish Services route safely fell back to `/en/services/` without a broken fragment.
- Compact index links measured at least 44px high and the four primary Services CTAs measured 48px high in both locales. Keyboard focus exposed the approved 3px outline with a 2px offset.
- The browser's axe-core 4.12.1 scan reported zero violations and zero incomplete checks with 35 passes for each locale at the wide viewport. Reduced-motion emulation remained content-complete, and aborting Next static script requests left server-rendered content and anchors available.
- `/Portfolio/servicios/` at `375x812` and `/Portfolio/en/services/` at `1440x900` retained the base path, localized index links, complete content, and no overflow. Screenshots were captured outside the repository and were not committed. Whole-site accessibility conformance remains OPEN.
- Repeated Web-level, WhatsApp-scope, and cross-service-principle card groups use equal content-driven grid rows with full-height cards. Browser measurements at `320x800` and `1440x900` in both locales confirmed equal card heights, no card clipping, and no normal-scale horizontal overflow; a card-specific `200%` root-text probe at `320x800` also retained equal heights without clipping.

## Current shared header verification — 2026-09-05

- Browser checks on `/`, `/servicios/`, and `/en/services/` confirmed the shared header uses `position: sticky` with `top: 0`, remains visible after scrolling, and introduces no normal-scale horizontal overflow at compact and wide viewports.
- At `375x812`, the native hamburger disclosure opened from keyboard focus, exposed the localized navigation panel, preserved the existing route links and CTA, and kept the document free of a Next.js error overlay. At `1440x900`, the inline navigation rendered without the compact trigger.
- The implementation remains server-rendered and static-export compatible; the disclosure uses native HTML rather than client-side state. Whole-site accessibility conformance remains OPEN.

## Pre-cutover findings

## Architecture and localization

- The entire page is a Client Component because locale is held in browser state.
- Both locale message sets are shipped together.
- There are no localized routes, canonicals, or page-equivalent language links.
- Static export is current fact; whether it remains the final platform is OPEN.

## Content and product mismatch

- Metadata, navigation, hero, skills, experience, and contact language still describe a personal developer portfolio.
- The current contact copy mentions leadership roles and product collaborations, which conflicts with the client-first positioning.
- The current form lacks the approved optional business-name field.
- Experience and education data need factual migration described in `PORTFOLIO-MIGRATION`.
- Project data cannot express the approved confidentiality rules or proposed evidence model.

## Accessibility and interaction

- Form labels have no `htmlFor`/field ID association.
- Project cards are focusable even though the card container is not itself an interactive control.
- Project links are visually hidden until hover or focus-within.
- Essential sections begin at opacity zero in reveal animation, creating a fail-closed rendering risk.
- Reduced motion is partially handled by MotionReveal, but the overall target behavior is not defined.
- `text-ink-400` and `text-ink-600` are used while the Tailwind theme defines only ink 500, 700, and 900.

## Performance and assets

- The eight files under `public/projects/` total 19,932,539 bytes as of 2026-09-01.
- Five legacy project previews account for nearly all of that size and include large embedded raster payloads inside SVG containers.
- The source uses raw `<img>` elements and does not set an explicit lazy-loading strategy.
- Image optimization is disabled for static export.

## SEO and discovery

- Metadata is generic and personal rather than commercial.
- No confirmed `metadataBase` or canonical production domain.
- No sitemap, dedicated robots file, JSON-LD, or localized alternate routes.
- No dedicated social image strategy.

## Project evidence integrity

- Technology tags dominate project cards.
- Project records do not distinguish production, Laboratory, or prototype work.
- No permission or evidence-source data exists.
- The ChronoApp repository URL returned 404 during both the 2026-08-22 and 2026-09-04 assessments and must not be published.
- Busesfy still requires relationship, maturity, and item-level publication-permission review.
- The public MPC repository identifies it as a 2021 educational assignment for a fictional organization. It is not client production evidence and is rejected for the business homepage; see `PROJECT-EVIDENCE`.

## Validation and maintenance

- Documentation integrity is checked by a repository-native Node validator, with Node-based validator tests and an explicit TypeScript check available through package scripts.
- No formatter configuration or browser-test suite exists.
- CI now runs documentation validation, Node tests, lint, explicit TypeScript checking, and the production static build on Pull Requests through the stable Quality workflow. There is still no app/browser accessibility automation, SEO audit, or dedicated browser-test suite; the existing six `@next/next/no-img-element` lint warnings remain visible. Deployment behavior is unchanged.
- The deployment action and permissions were identified for later review; no Stage A change is authorized.
- Stage A verification on 2026-09-01 completed against the patched dependency baseline: TypeScript and the production build passed; lint completed with zero errors and six existing `@next/next/no-img-element` warnings.

## Previous browser assessment

As of 2026-08-22:

- desktop and 375px layouts showed no horizontal overflow;
- the mobile menu worked;
- no console warning was observed in the inspected session;
- visible form labels did not expose accessible textbox names in the browser accessibility lookup.

These results are dated evidence, not a future acceptance test.
