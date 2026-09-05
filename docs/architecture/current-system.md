---
id: ARCH-CURRENT
type: existing-system
status: APPROVED
related:
  - ARCH-FINDINGS
  - IA-SITE
  - PAGE-SERVICES
last_verified: 2026-09-05
---

# Current system

## Scope

This record includes the retained pre-cutover personal-portfolio implementation and the current Task 2 commercial homepage state. The eight approved foundation routes implement the documented Spanish-root and English-/en/ route pairs; retained source data and legacy components remain in Git for later migration and cleanup.

## Application stack

- Next.js `^16.3.2` using the App Router.
- React and React DOM `18.2.0`.
- TypeScript `5.5.4` with strict checking and no emit.
- Tailwind CSS `3.4.7`.
- Framer Motion for retained legacy reveal and hover primitives.
- React Hook Form remains in the dependency baseline for deferred form work; the approved foundation does not expose a form.
- Lucide React plus repository SVG assets for icons.

The dependency baseline was patched in commit `f68a022` before Stage A.

## Pre-cutover routes and rendering

- One App Router route: `/`.
- `app/page.tsx` is a Client Component.
- The whole page is composed as a single scrolling portfolio with anchor sections.
- English and Spanish messages are imported into the same client bundle.
- The initial locale is English and is changed with local React state.
- The document language is updated after client render.

This conflicts with the approved route-based localization target in `IA-SITE`.

## Pre-cutover page composition

Current order:

1. fixed navigation;
2. personal landing/about section;
3. skills;
4. experience;
5. education;
6. projects;
7. contact and form.

Content is oriented toward personal credentials and recruiters rather than the approved commercial hierarchy.

## Pre-cutover component structure

- `components/core/` contains Badge, Card, Container, IconButton, MotionReveal, Section, and TimelineItem primitives.
- `components/layout/` contains the navigation and language switch.
- `components/sections/` contains portfolio-specific page sections.
- Components use Tailwind utility classes; there is no separate component library.

## Content

- Personal data, skills, education, experience, and projects are JSON files under `data/`.
- Foundation content is route-private and typed under the Spanish and English App Router trees; the former legacy message catalogs were retired in Task 4.
- Data types are defined in `lib/types.ts` and JSON is cast to those types in `lib/data.ts`.
- Project records currently contain localized title/description, technology tags, preview image, and optional external links.
- Records do not contain maturity, disclosure permission, evidence source, business problem, result, or publication state.

## Pre-cutover styling and assets

- Tailwind theme defines blue `brand`, dark `ink`, and light `paper` colors.
- Inter is loaded with `next/font`.
- Global styling is light-only with a vertical neutral gradient.
- Static images are served from `public/` using raw `<img>` elements.
- Next image optimization is disabled to support static export.
- Project previews are SVG files, several containing large embedded raster payloads.

## Pre-cutover contact form

- Form fields: name, email, and message.
- The approved optional business field is absent.
- Submission posts JSON to `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- Success and error states are announced in an `aria-live` region.
- The current source references Formspree, but the target provider remains OPEN.

## Pre-cutover metadata

- Root metadata identifies “Samuel Furlanich - Developer” and a generic developer portfolio.
- Basic Open Graph title/description and robots indexing are configured.
- No route-specific localized metadata exists because there is one route.

## Build and deployment

- Next.js is configured with `output: 'export'`, trailing slashes, unoptimized images, and an optional base path/asset prefix.
- GitHub Actions builds pushes to `main` with Node 24.
- `NEXT_PUBLIC_BASE_PATH` is set to the repository name for GitHub Pages.
- The workflow deploys `out/` with `peaceiris/actions-gh-pages` using content-write permission.
- Current live location was previously verified as `https://furlanich.github.io/Portfolio/`.

## Pre-cutover validation and documentation

- Package scripts include documentation validation, Node-based validator tests, explicit TypeScript checking, lint, build, and a composed validation command.
- The repository now has a root agent router, an architecture map, and governance indexes/templates. These documents do not approve a target migration.
- No formatter configuration or browser-test suite exists.
- The deployment workflow remains push-to-`main` only and is unchanged; Pull Request quality gates run through the separate Quality workflow documented below.
- Stage A added product documentation and a context glossary; the prior README was a two-line personal-portfolio description.

## Current foundation implementation — Task 3

- Eight static foundation routes are rendered by locale-specific Server Component trees: Spanish at the root routes with document language es-AR, and English below /en/ with document language en.
- Shared foundation components provide the semantic header, footer, language switch, typography-led hero, useful Services and Contact destinations, and the minimum Founder profile.
- The public foundation has no `next-intl` dependency, legacy client provider, locale React state, `window.location` parsing, or document-language mutation.
- Foundation styling uses the approved light Canvas, Surface, Ink, Muted ink, Action blue, Action blue strong, Action tint, and Border values, with responsive CTA stacking below 480px and no horizontal overflow at 320px.
- Retained personal data JSON, project assets, and core primitives remain in Git and are outside this cleanup; the obsolete localization shell, sections, helper, and message catalogs are retired.
- Both normal and /Portfolio static-export modes are verified by the repository artifact checker. Task 4 browser QA repeated all eight routes at 320x800, 375x812, 768x1024, 1024x768, and 1440x900; language switching, keyboard focus, JavaScript-disabled rendering, reduced motion, contact links, Founder links, and CV routing were checked.

## Current commercial homepage implementation — Task 2

- Both localized home routes render one shared `CommercialHomepage` Server Component with the existing hero followed by Problems, Services, Audiences, Proof fallback, Process, Founder, and final CTA in the approved order.
- The seven later sections use route-owned typed content from the Spanish and English home modules. Shared components contain no public copy or client-side locale state.
- `HOME-PROOF` is the approved single-panel credibility fallback with direct-responsibility, verifiable-claims, and confidentiality commitments; no project cards, project links, metrics, or client claims were added.
- The existing header and footer expose the localized in-page Process destination (`/#proceso` and `/en/#process`) on all eight foundation routes without adding a route ID.
- The static artifact verifier checks both homepage narratives, stable labelled sections, visible headings, required internal actions, the confirmed WhatsApp action, document languages, route references, and optional base-path integrity.
- The implementation uses the existing foundation palette, typography, spacing, borders, responsive grid rules, target sizing, focus treatment, and reduced-motion behavior. No dependencies, routes, hosting settings, metadata architecture, form, imagery, or project evidence changed.

## Current complete Services implementation — Task 3

- `/servicios/` and `/en/services/` render one shared locale-agnostic `ServicesPage` Server Component between the existing localized header and footer.
- Locale-owned typed content supplies the complete introduction, three services, cross-service principles, commercial boundaries, AI note, and final CTA; the composition contains no public locale copy or client-side locale state.
- The page exposes stable localized service fragments (`#web`, `#whatsapp`, `#consultoria`, and `#consulting`), semantic index navigation, contextual Contact actions, and the approved text-led evidence treatment.
- Service levels use the shared commercial content-card primitive; scope, dependencies, fit/non-fit, evidence, and commercial boundaries remain visible without disclosure interaction.
- Normal and `/Portfolio` static artifact verification passed for the complete Services requirements. The complete implementation remains within the existing route tree, static export, and base-path architecture.

## Environment

Local `.env` files exist and are intentionally not documented or read into the knowledge base. Public documentation must never reproduce secrets.

## Stage B quality gate update

Pull Requests targeting `main` now run the repository `validate` command through `.github/workflows/ci.yml`. The gate covers documentation validation, Node tests, lint, explicit TypeScript checking, and the production static build with the repository base path. The existing deployment workflow remains push-to-`main` only and is unchanged.
