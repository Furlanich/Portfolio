---
id: ARCH-FINDINGS
type: existing-system-assessment
status: APPROVED
related:
  - ARCH-CURRENT
  - DESIGN-IX-A11Y
  - PORTFOLIO-MIGRATION
last_verified: 2026-09-02
---

# Current quality findings

These findings describe the existing implementation and do not authorize remediation during Stage A.

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
- The ChronoApp repository URL returned 404 during the 2026-08-22 assessment and must be reverified before publication.
- Busesfy and MPC require classification and confidentiality review before migration.

## Validation and maintenance

- Documentation integrity is checked by a repository-native Node validator, with Node-based validator tests and an explicit TypeScript check available through package scripts.
- No formatter configuration or browser-test suite exists.
- CI still deploys after build without Pull Request lint, type-check, test, accessibility, SEO, or broken-link gates; a future Stage B task evaluates stable Pull Request checks without changing deployment behavior.
- The deployment action and permissions were identified for later review; no Stage A change is authorized.
- Stage A verification on 2026-09-01 completed against the patched dependency baseline: TypeScript and the production build passed; lint completed with zero errors and six existing `@next/next/no-img-element` warnings.

## Previous browser assessment

As of 2026-08-22:

- desktop and 375px layouts showed no horizontal overflow;
- the mobile menu worked;
- no console warning was observed in the inspected session;
- visible form labels did not expose accessible textbox names in the browser accessibility lookup.

These results are dated evidence, not a future acceptance test.
