---
id: REVIEW-SPF-RETIREMENT-AUDIT-2026-09-30
type: scope-audit
status: PROPOSED
related:
  - REVIEW-SPF-DESIGN-2026-09-30
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
last_verified: 2026-09-30
---

# Project-detail retirement — read-only scope audit

2026-09-30. Owner decision: remove all six localized project-detail URLs, with no redirect or compatibility page; keep complete GRS/The-System stories on Projects, MPC on Founder. This file is a factual scope audit, not an implementation plan. Production mutations remain subject to the session gate clarification.

## Route surface to retire

Two route entry files generate all six existing destinations:

- `app/(es)/proyectos/[projectSlug]/page.tsx`
- `app/(en)/en/work/[projectSlug]/page.tsx`

Each tree generates `general-reservation-system`, `the-system`, and `mpc-administracion`. None should be emitted after retirement, at root or `/Portfolio`. Ordinary host 404 behavior is accepted; no substitute pages, redirects, rewrites or output postprocessing are proposed.

## Detail-only code candidates

- `components/projects/ProjectDetailPage.tsx`, including its detail labels.
- `getProjectDetailNavigationPaths()` in `lib/foundation-navigation.ts`, used only by the two route files.
- `getProjectDetailPath()` in `lib/site-routes.ts`, after all live consumers migrate.
- Route-resolution roles of `getPublishedProjectDetails()` / `getPublishedProjectDetail()` in `lib/projects/publication.ts`.
- Detail-only Playwright scenarios and approved snapshots that no longer represent an emitted route.

Content types and localized `details` maps contain substantive project evidence. Relocate useful dossier data instead of deleting the information with the route renderer. `ProjectCard.tsx` currently supplies both the index and `ProjectMeta`; it is removable only if both uses are replaced. Shared section/foundation/navigation components remain live elsewhere.

## Content consumers

- Projects actions become in-page dossier anchors or explicit public-source actions.
- Services GRS evidence points to its complete index dossier in the correct locale.
- Founder MPC keeps its title, 2021 educational/group/fictional context, relationship, summary and unverified-runtime limitations. Replace the internal detail action with localized “Ver código fuente” / “View source code” to the already approved repository: https://github.com/Furlanich/MilkyPantsCheese-Administracion- .
- Founder changes affect both `founder.ts` locale modules, founder content types, `FounderPage.tsx`, and `FounderProfessionalHistory.tsx`.
- Locale equivalents point to Services/Projects index routes; the proposed written design preserves matching known dossier anchors on locale changes.
- MPC leaves the Projects public projection but retains its internal evidence record and educational publication permission. Route retirement does not change its maturity to private, blocked or retired.

## Assets

Keep the exact GRS and The-System conceptual WebPs, captions and approved alt text for the inline dossiers. Their project IDs and asset paths are legitimate evidence identifiers, not emitted detail-page URLs.

`public/projects/mpc-administracion/conceptual-operations-model.webp` becomes unused when MPC retains its existing text-only Founder block and detail pages disappear. Retire it only after verifying no remaining consumer. Do not remove the entire `public/projects/` directory or delete useful evidence content merely because a slug appears in a filename.

## Verification consumers identified

`scripts/site-routes.test.mjs`, `projects-publication.test.mjs`, `project-details.test.mjs`, `projects-route.test.mjs`, `foundation-content.test.mjs`, `privacy-route.test.mjs`, and `verify-static-export.mjs`; Playwright navigation, Projects, Services, Founder, accessibility, and `visual/services-projects.visual.spec.ts`, including detail-only snapshots.

The export verifier currently requires the six routes. Replacement checks must establish their absence, no active links to retired detail URLs, complete inline dossiers, the Services GRS anchor, MPC's external source destination, and preserved exclusion of blocked/private records. Testing absence of retired artifacts is useful; deleting behavioral coverage merely to avoid failures is not.

## Current owning records

Current Projects page/experience/inventory/item records, Services evidence-link contract, Founder educational destination, information architecture/localization, project evidence, visual/interaction owners, current architecture records, `ARCHITECTURE.md` and `docs/index.md` require synchronization.

Historical ADRs, completed plans, reviews and prior approval tables are preserved. A dated supersession records the new decision. Repository search should distinguish active URL consumers from historical references, immutable records, negative absence tests, source URLs, legitimate project IDs and image assets.

Facts were independently checked by the content-evidence research agent. No repository files were changed by this audit.
