---
id: ARCH-CURRENT
type: existing-system
status: APPROVED
related:
  - ARCH-FINDINGS
  - IA-SITE
last_verified: 2026-09-01
---

# Current system

## Scope

This is the existing personal portfolio implementation before the business-site migration. It does not yet implement the documented sitemap or business content model.

## Application stack

- Next.js `^16.3.2` using the App Router.
- React and React DOM `18.2.0`.
- TypeScript `5.5.4` with strict checking and no emit.
- Tailwind CSS `3.4.7`.
- `next-intl` for messages, currently provided entirely on the client.
- Framer Motion for reveal and hover animation.
- React Hook Form for the contact form.
- Lucide React plus repository SVG assets for icons.

The dependency baseline was patched in commit `f68a022` before Stage A.

## Routes and rendering

- One App Router route: `/`.
- `app/page.tsx` is a Client Component.
- The whole page is composed as a single scrolling portfolio with anchor sections.
- English and Spanish messages are imported into the same client bundle.
- The initial locale is English and is changed with local React state.
- The document language is updated after client render.

This conflicts with the approved route-based localization target in `IA-SITE`.

## Page composition

Current order:

1. fixed navigation;
2. personal landing/about section;
3. skills;
4. experience;
5. education;
6. projects;
7. contact and form.

Content is oriented toward personal credentials and recruiters rather than the approved commercial hierarchy.

## Component structure

- `components/core/` contains Badge, Card, Container, IconButton, MotionReveal, Section, and TimelineItem primitives.
- `components/layout/` contains the navigation and language switch.
- `components/sections/` contains portfolio-specific page sections.
- Components use Tailwind utility classes; there is no separate component library.

## Content

- Personal data, skills, education, experience, and projects are JSON files under `data/`.
- Interface messages are stored under `locales/en/` and `locales/es/`.
- Data types are defined in `lib/types.ts` and JSON is cast to those types in `lib/data.ts`.
- Project records currently contain localized title/description, technology tags, preview image, and optional external links.
- Records do not contain maturity, disclosure permission, evidence source, business problem, result, or publication state.

## Styling and assets

- Tailwind theme defines blue `brand`, dark `ink`, and light `paper` colors.
- Inter is loaded with `next/font`.
- Global styling is light-only with a vertical neutral gradient.
- Static images are served from `public/` using raw `<img>` elements.
- Next image optimization is disabled to support static export.
- Project previews are SVG files, several containing large embedded raster payloads.

## Contact form

- Form fields: name, email, and message.
- The approved optional business field is absent.
- Submission posts JSON to `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- Success and error states are announced in an `aria-live` region.
- The current source references Formspree, but the target provider remains OPEN.

## Metadata

- Root metadata identifies “Samuel Furlanich - Developer” and a generic developer portfolio.
- Basic Open Graph title/description and robots indexing are configured.
- No route-specific localized metadata exists because there is one route.

## Build and deployment

- Next.js is configured with `output: 'export'`, trailing slashes, unoptimized images, and an optional base path/asset prefix.
- GitHub Actions builds pushes to `main` with Node 24.
- `NEXT_PUBLIC_BASE_PATH` is set to the repository name for GitHub Pages.
- The workflow deploys `out/` with `peaceiris/actions-gh-pages` using content-write permission.
- Current live location was previously verified as `https://furlanich.github.io/Portfolio/`.

## Validation and documentation before Stage A

- Package scripts include dev, build, start, lint, and deploy.
- No dedicated type-check script, formatter, test suite, or browser-test suite exists.
- CI runs install and build but not explicit lint, type check, tests, accessibility, or link validation.
- The previous README contained only a two-line personal-portfolio description.
- No product documentation, `AGENTS.md`, or context glossary existed.

## Environment

Local `.env` files exist and are intentionally not documented or read into the knowledge base. Public documentation must never reproduce secrets.
