---
id: PLAN-PROJECTS-EVIDENCE-EXPERIENCE
type: execution-plan
status: APPROVED
plan_status: COMPLETED
related:
  - ADR-STATIC-LOCALIZED-ROUTING
  - PROJECT-EVIDENCE
  - PROJECT-INVENTORY
  - PROJECTS-EXPERIENCE-CLOSURE
  - PAGE-PROJECTS
  - PAGE-PROJECT-DETAIL
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-06
---

# Projects / Evidence Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Use the repository visual-qa Skill for every rendered Projects task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Use the established fail-closed public project-content boundary to publish the complete bilingual Projects index and three paired summary-only project-detail routes for the READY records, without exposing internal permission or audit data.

**Architecture:** Extend the accepted explicit Spanish-root and English-/en/ static App Router trees. Internal evidence and permission records remain Markdown under docs/product/projects/. Application routes consume only an explicit public publication manifest plus route-owned localized public copy; shared locale-agnostic Server Components receive resolved public view models. No runtime data source, locale negotiation, filter state, or backend is introduced.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Node 24 contract tests, static export, and GitHub Pages with optional build-time basePath.

**Spec:** PROJECT-EVIDENCE, PROJECT-INVENTORY, PROJECTS-EXPERIENCE-CLOSURE, PAGE-PROJECTS, PAGE-PROJECT-DETAIL, CONTENT-LOCALIZATION, DESIGN-VISUAL, DESIGN-IX-A11Y, IA-SITE, PAGE-SERVICES, PAGE-HOME, PAGE-CONTACT, and ADR-STATIC-LOCALIZED-ROUTING.

## Global constraints

- Repository evidence records, not legacy application JSON, decide whether a project may be public.
- Publication fails closed. The application publication manifest starts empty and only an item explicitly recorded as READY or READY-SUMMARY-ONLY may enter it.
- No Projects index route, navigation link, public card, detail route, project image, or project evidence link ships while the manifest is empty.
- Internal permission matrices, grantors, audit dates, private notes, blocked states, evidence-strength values, and homepage eligibility remain in documentation. Do not mirror or parse them into application data.
- Public application source contains intentionally public metadata and localized copy only. Presence in the publication manifest is the build-time whitelist; there is no permissive default lifecycle value.
- Preserve the independent maturity, disclosure, and evidence axes in documentation. Public components receive only approved plain-language maturity, evidence, and limitation text and must not derive a score or stronger claim.
- Preserve explicit locale route trees, Server Components by default, static export, trailing slashes, optional NEXT_PUBLIC_BASE_PATH, and the current GitHub Pages workflow.
- Use /proyectos/ and /en/work/ for the index. Use /proyectos/[project-slug]/ and /en/work/[project-slug]/ only for detail-eligible manifest entries. Equivalent detail routes use the same stable slug and are generated as a complete pair.
- Do not add a CMS, database, backend, runtime project API, admin panel, search engine, filter framework, runtime translation, client-side locale state, image/media service, dependency, or deployment change.
- Filters, query parameters, and client-side filtering are prohibited for this inventory. Reconsideration remains governed by the approved eight-record threshold.
- Do not import data/projects.json, projectsData, the legacy Project type, or internal Markdown from public Projects routes or components.
- Route-owned Spanish and English modules own public prose. Shared components contain no localized public copy and do not infer locale, permission, disclosure, evidence strength, or destination.
- Cards use an explicit CTA and are not whole-card links. Do not nest interactive elements or render multiple competing card actions.
- Reuse the approved Canvas, Surface, Border, Action blue, Inter, spacing, focus, and Action-tint CTA patterns. No shadow, gradient, glass, scaling hover, tilt, 3D, carousel, entrance reveal, or new visual system is approved.
- Project imagery is optional and may enter the manifest only after its item record documents provenance, represented version, permission, sensitive-data review, stable path, dimensions, and public alt-text intent.
- Do not create an empty detail section for consistency. Optional detail sections render only when approved content exists.
- HOME-PROOF remains unchanged. Any future homepage evidence upgrade is a separate bounded plan/PR after its own eligibility decision.
- Each implementation PR requires focused tests, npm run validate, both static-export modes when routes or assets change, diff review, documentation synchronization, and human review before merge.

---

## Objective

Turn the approved Projects product/design decisions into a staged implementation path. Task 1 created a typed, testable publication boundary without changing the site. Task 2 published the exact approved bilingual index content, and Task 3 now publishes only the three records that passed the separate detail evidence, permission, content, asset, and eligibility gates.

## Governance classification

**Route B — versioned execution plan (repository route: PLAN).**

The initiative is substantial approved work: it eventually adds two localized index routes, conditional static detail routes, typed public content, shared presentation, navigation integration, asset migration, deterministic publication tests, static-export assertions, and visual/accessibility QA. It therefore needs a versioned active plan rather than lightweight in-task planning.

**Route C — Governance RFC is not required.** No consequential architecture remains unresolved. ADR-STATIC-LOCALIZED-ROUTING already accepts explicit locale trees, route-owned localized content, shared locale-agnostic Server Components, semantic route equivalence, static export, trailing slashes, and base-path deployment. The approved product records explicitly select typed static content and reject a CMS, backend, API, search/filter subsystem, media service, and deployment change.

Reclassify and stop if implementation proposes any rejected infrastructure, changes the route/localization/hosting model, introduces a broad content or design-system platform, or weakens the publication boundary.

## Classification packet

| Field | Decision |
| --- | --- |
| Route | PLAN; no RFC or new ADR |
| Evidence | PROJECT-EVIDENCE, PROJECT-INVENTORY and its six item records, PROJECTS-EXPERIENCE-CLOSURE, current legacy data/assets, current route/component/test/export architecture |
| Requirements | PAGE-PROJECTS, PAGE-PROJECT-DETAIL, CONTENT-LOCALIZATION, DESIGN-VISUAL, DESIGN-IX-A11Y, IA-SITE, PAGE-SERVICES, PAGE-HOME, PAGE-CONTACT |
| Affected architecture | Existing ADR-STATIC-LOCALIZED-ROUTING; no accepted boundary changes |
| Required artifact | This completed plan at docs/plans/completed/projects-evidence-experience.md |
| Current implementation boundary | Tasks 2, 3, and 4 are implemented. The public projection contains exactly the three approved paired summary-only detail routes and their conceptual visuals; obsolete project sources/assets are retired, while homepage integration and functional-evidence upgrades remain blocked. |
| Validation | npm run docs:check for this plan; npm run validate and PR-specific root/base-path checks during implementation |
| Unresolved questions | Functional verification and homepage eligibility beyond the three records' summary-only scope; remaining candidate permissions; canonical origin and broader release concerns remain OPEN |
| Approval | Human review of this planning PR and every implementation PR; merge remains human-controlled |

## Requirements implemented

| Authority | Implementation responsibility |
| --- | --- |
| PROJECT-EVIDENCE | Three-axis evidence discipline, fail-closed lifecycle, internal/public separation, truthful result language |
| PROJECT-INVENTORY and item records | Sole authority for which IDs may enter the public manifest, asset permission, detail eligibility, and forward requirements |
| PROJECTS-EXPERIENCE-CLOSURE | Index thresholds, taxonomy, ordering, card anatomy, imagery, confidentiality, detail composition, filters, QA, and performance |
| PAGE-PROJECTS / PAGE-PROJECT-DETAIL | Public responsibilities, no-empty-route rule, eligibility gate, hierarchy, destinations, and acceptance criteria |
| CONTENT-LOCALIZATION / IA-SITE | Spanish-root and English-/en/ ownership, route pairs, stable slugs, natural bilingual copy, and context-preserving language switching |
| PAGE-SERVICES / PAGE-CONTACT | Resolved related-service anchors and restrained inquiry destinations |
| PAGE-HOME | Unchanged HOME-PROOF fallback and separate homepage-upgrade boundary |
| DESIGN-VISUAL / DESIGN-IX-A11Y | Existing presentation language, responsive composition, semantics, focus, zoom, reduced motion, and QA matrix |
| ADR-STATIC-LOCALIZED-ROUTING | Static App Router, locale-owned content, shared components, trailing slash, static export, and base-path architecture |

## Current public evidence inventory

| Count | Current result |
| --- | ---: |
| READY public cards | 3 |
| READY-SUMMARY-ONLY public cards | 0 |
| Detail-page-ready projects | 3 |
| Blocked, private, or retired records | 3 |

General Reservation System, The-System, and MPC Administración are READY for limited, image-free, source-backed cards and paired summary-only detail pages in that editorial order. Their evidence strength remains `implementation-evidence`; the approved conceptual visuals are not screenshots or functional proof, and none is homepage-eligible. Busesfy is BLOCKED-PERMISSION, ChronoApp is RETIRED, and Documancer is PRIVATE; none may enter application public content.

## Affected architecture

The current application has sixteen static artifacts (ten foundation/index routes plus six paired detail routes), four semantic foundation route IDs, route-private Spanish and English content modules, shared semantic Server Components, static route/equivalence helpers, and a static artifact verifier. The obsolete project JSON, project-only type/export, animated Card primitive, and eight legacy SVG assets have been removed after consumer verification; the three approved conceptual WebPs are the only project assets under public/projects/.

The accepted extension is:

- docs/product/projects/*.md remains the complete internal audit and permission system;
- lib/projects/publication.ts becomes a narrow public build-time whitelist containing no private records or permission fields;
- components/projects/content-types.ts owns only public page/card/detail view contracts;
- app/(es)/_content/projects.ts and app/(en)/en/_content/projects.ts own public Spanish and English copy;
- future index routes consume only resolved entries returned in manifest order;
- future detail routes generate params only from manifest entries whose destination is detail;
- lib/site-routes.ts owns index/detail paths and service anchors; lib/foundation-navigation.ts receives a narrow project-detail helper for equivalent-language switching;
- shared components under components/projects/ remain Server Components and accept resolved public data;
- scripts verify source contracts, publication invariants, assets, and exported routes.

This is an extension of the accepted architecture, not a new data or routing architecture.

## Content and publication model

### Internal evidence metadata

Keep stable ID, internal/original name, relationship, maturity, disclosure, evidence strength, lifecycle, permission matrix, grantor/date/restrictions, evidence audit, and homepage eligibility exclusively in PROJECT-EVIDENCE and docs/product/projects/*.md. Application code does not parse these files and does not contain blocked/private records.

### Public manifest

Use one explicit manifest containing only facts needed to make a public route deterministic:

~~~ts
export type PublicProjectManifestEntry = {
  id: string;
  slug: string;
  maturity: 'production' | 'lab' | 'prototype';
  services: readonly [ServiceSectionId, ...ServiceSectionId[]];
  publicationScope: 'open' | 'limited';
  destination:
    | { kind: 'detail' }
    | { kind: 'contact' }
    | { kind: 'service'; serviceId: ServiceSectionId }
    | { kind: 'external'; href: string };
  visual?: {
    kind: 'screenshot' | 'diagram' | 'illustration';
    src: string;
    width: number;
    height: number;
  };
};

export const publishedProjectManifest = [] as const
  satisfies readonly PublicProjectManifestEntry[];
~~~

The initial empty array is intentional. There is no status field whose default could publish an item. A future manifest addition must cite a READY or READY-SUMMARY-ONLY item record in its PR.

### Public localized card content

Each locale module keys approved content by manifest ID. Components receive a resolved view model, not raw manifest or internal evidence:

~~~ts
export type PublicProjectCardContent = {
  title: string;
  context: string;
  maturityLabel: string;
  summary: string;
  capabilities: readonly [string, string] | readonly [string, string, string];
  evidenceSignal: string;
  actionLabel: string;
  visualAlt?: string;
};

export type ResolvedProjectCard = PublicProjectCardContent & {
  id: string;
  slug: string;
  maturity: PublicProjectManifestEntry['maturity'];
  serviceIds: PublicProjectManifestEntry['services'];
  action: {
    href: string;
    external: boolean;
  };
  visual?: PublicProjectManifestEntry['visual'];
};
~~~

The resolver iterates the whitelist, requires a matching locale entry, resolves detail/Contact/Services/external destinations, and never discovers records by enumerating localized content. Extra content not named by the manifest remains unreachable and causes a contract-test failure.

### Public localized detail content

Add detail types and content only when a manifest entry has destination kind detail. The following is the approved maximum boundary for Task 3; PR 1 must not encode it while no approved project uses it. At Task 3, retain the required header/evidence/action fields and only the optional section fields populated by the eligible item, so absent approved content does not create an empty heading or unused schema:

~~~ts
export type PublicProjectDetailContent = {
  header: {
    title: string;
    summary: string;
    maturityLabel: string;
    evidenceLabel: string;
    context: string;
    relatedServiceLabel: string;
    visualAlt?: string;
  };
  evidenceStatement: { heading: string; description: string };
  businessContext?: { heading: string; body: readonly string[] };
  problem?: { heading: string; body: readonly string[] };
  deliveredScope?: { heading: string; items: readonly string[] };
  capabilities?: {
    heading: string;
    items: readonly { title: string; description?: string }[];
  };
  result?: {
    heading: string;
    kind:
      | 'verified-business-result'
      | 'production-usage'
      | 'functional-demonstration'
      | 'implementation-evidence';
    publicLabel: string;
    description: string;
  };
  evidence?: {
    heading: string;
    items: readonly {
      kind: 'live-site' | 'demo' | 'repository' | 'screenshot' | 'authorized-summary';
      label: string;
      description: string;
      href?: string;
    }[];
  };
  limitations?: { heading: string; items: readonly string[] };
  technicalNotes?: { heading: string; body: readonly string[] };
  publicationScope?: { heading: string; description: string };
  relatedServiceAction: { label: string; serviceId: ServiceSectionId };
  finalCta: {
    heading: string;
    description: string;
    action: ActionLink;
  };
};
~~~

At least five approved information categories plus one permitted evidence asset/link remain a documentation gate before this type is populated. Internal evidence-strength names are permitted only as the non-rendered result-kind discriminator; the visible publicLabel controls public language.

## Public interfaces and route ownership

- Add projects to the semantic page route map only in the same PR that publishes both useful index routes.
- getProjectDetailPath(locale, slug) returns the Spanish or English trailing-slash detail path and does not apply basePath.
- getProjectDetailNavigationPaths(locale, slug) reuses the normal navigation paths but overrides only alternateHref with the same slug in the other locale.
- No missing-locale fallback exists: publication tests require complete bilingual card content and complete bilingual detail content before a detail slug is generated.
- getPublishedProjectCards(localeContent, locale) iterates the manifest in editorial order and throws during build/test when approved content is missing.
- getPublishedProjectDetail(localeContent, slug, locale) returns only a detail-destination manifest entry and its localized content; unknown or ineligible slugs are not generated.
- Service links use getServiceSectionHref. Contact links use getFoundationPath after projects joins the semantic route map.
- ProjectCard accepts one ResolvedProjectCard. It does not import locale modules, the manifest, evidence records, or route helpers.
- ProjectsPage accepts a resolved localized page view model. It does not own copy or inspect internal states.
- ProjectDetailPage accepts one resolved localized detail view model and renders only populated sections.

## Index structure and visual implementation

The index uses the approved inventory-sensitive hierarchy:

1. Canvas introduction with one H1 and the exact localized transparency copy.
2. Selected evidence in manifest/editorial order.
3. For one item, one substantial evidence story; for two or three, one ungrouped grid; for four or more across two populated maturity groups, selected evidence followed by populated maturity groups.
4. A visible Publication scope note only when a manifest entry is limited.
5. Existing Action-tint final inquiry CTA.

The renderer never shows an empty maturity group. The taxonomy labels come from localized page content and are used only at the four-record threshold. Do not add filter controls, filter state, query parameters, search, sorting controls, or technology facets.

ProjectCard renders an article within list semantics when cards are peers. Its order is one restrained meta row, heading, two-to-four-line natural summary, two or three non-interactive capability tags, evidence text, and one explicit CTA. The article uses Surface, 1px Border, 16px radius, 24px compact/32px medium padding, no shadow, and content-driven height. The grid is one column through tablet and two columns from 1024px; a shorter three-column variant is not implemented for the initial inventory.

An approved visual, when present, uses a 16:9 bordered neutral frame above card content on compact layouts and remains contained so critical UI is not cropped. Do not create ProjectVisual until at least one public entry has a visual; an image-free card is the baseline.

## Detail structure and visual implementation

ProjectDetailPage follows the approved source order: header; visible evidence/disclosure context; business context; problem; delivered scope; capabilities; result/demonstration; evidence/media; limitations; technical notes; related service; final inquiry CTA. Optional sections are omitted, never rendered empty.

With an approved visual, the wide header uses an approximately 7/12 text and 5/12 visual split. Without one, the text remains constrained to an approximately eight-column readable measure. Context/problem and evidence use Surface sections; scope uses Canvas; capabilities use a one/two/three-column content-growth grid when useful; limitations use a neutral bordered panel; the final CTA reuses Action tint.

Evidence items render as a simple semantic list/grid. One screenshot or link does not create a gallery abstraction or carousel. External live/demo/repository links identify their destination and external behavior. Results visibly distinguish verified business result, production usage, functional behavior, and implementation evidence; no functional demonstration is written as a measured outcome.

## Asset plan

- No legacy public/projects asset is approved for reuse.
- PR 1 references no project asset.
- The current three-card index remains image-free. Each READY item now approves one labeled conceptual detail visual under public/projects/[stable-slug]/ with a descriptive stable name; no legacy asset is reused.
- Screenshots start from a documented source capture, normally 1600x900, and provide 800, 1200, and 1600px WebP/AVIF derivatives where the static exporter/browser support permits.
- Keep the 1600px derivative near 250KB when legibility permits; do not make interface evidence unreadable to hit the target.
- Eager-load only a verified above-the-fold/LCP image. All below-fold evidence is lazy.
- Legacy Busesfy.svg, MPC-Administracion.svg, AI-Scheduler.svg, GRS.svg, Documancer.svg, atlas.svg, pulse.svg, and vertex.svg are removed only in the cleanup PR after repository search proves no valid consumer remains.
- Do not retain unapproved placeholders under a newly public route or copy originals into a public project directory.

## Pull Request sequence

| PR | Objective | Hard gate | Public behavior |
| --- | --- | --- | --- |
| **1. Add the fail-closed public Projects contract — the single first implementation task** | Add public types, an empty whitelist, approved localized page-shell copy, resolvers, and publication contract tests | This planning PR is merged | None; no route, navigation item, card, detail, or asset |
| 2. Publish the bilingual Projects index | Add the three READY manifest/content entries, both index routes, shared card/page composition, navigation, export checks, and index QA | **SATISFIED 2026-09-06:** three READY item records have complete ES/EN card copy and approved repository links; no assets are referenced | Publishes useful /proyectos/ and /en/work/ routes atomically |
| 3. Publish eligible project details | Add the three paired static detail routes, adaptive detail composition, approved conceptual visuals, evidence blocks, equivalent-language links, and detail QA | **SATISFIED 2026-09-06:** all three READY items have complete bilingual detail content, an approved repository evidence link, and one approved labeled conceptual visual | Publishes exactly three eligible paired detail routes; no empty or unsupported route |
| 4. Retire legacy project delivery paths and close the plan | Remove proven-unused legacy JSON/types/assets/components, run complete regression/export/privacy checks, synchronize current-system docs, and complete the plan | Index is merged and every eligible detail PR is merged or explicitly omitted | No intended presentation change; removes accidental-publication paths and obsolete weight |

Task 1 / PR 1 and Task 2 / PR 2 are complete. Task 3 / PR 3 is now the single authorized next implementation task and must publish exactly the three approved paired summary-only detail routes. The optional homepage evidence upgrade is not part of this sequence.

## Implementation phases

### Task 1 / PR 1: Add the fail-closed public Projects contract

**Objective:** Establish a useful, independently reviewable publication boundary that cannot expose any current candidate and does not change rendered application behavior.

**Authority:** Complete. The public page shell, taxonomy, model boundary, static architecture, service anchors, Contact route, and zero-item state are approved. No unresolved item permission is needed because the manifest remains empty.

**Files:**

- Create: components/projects/content-types.ts
- Create: lib/projects/publication.ts
- Create: app/(es)/_content/projects.ts
- Create: app/(en)/en/_content/projects.ts
- Create: scripts/projects-publication.test.mjs
- Modify: docs/plans/active/projects-evidence-experience.md

- [x] **Step 1: Write the failing publication contract tests**

  Add Node tests that import the manifest, resolver, and both locale modules. Assert the manifest initially contains zero records; IDs and slugs are unique; maturity, service, publication-scope, destination, visual, and external-link values belong to the allowed sets; every manifest ID exists exactly once in both locale card maps; every detail destination has exactly one Spanish and English detail entry; extra localized entries outside the manifest fail; every card has non-empty title/context/maturity label/summary/evidence/action and exactly two or three non-empty capability labels; every visual path exists with positive dimensions and matching localized alt intent; every CTA resolves to a known detail, Contact, Services anchor, or explicit external URL.

  Exercise the resolver with a synthetic unlisted record and assert it returns no public card. Scan the new application project sources and assert they do not contain permissionMatrix, grantor, permissionDate, restrictions, homepageEligible, BLOCKED-, PRIVATE, FOUNDER-ONLY, RETIRED, or imports from data/projects.json, lib/data, docs/product/projects, or Markdown.

  Run:

  ~~~powershell
  node --test scripts/projects-publication.test.mjs
  ~~~

  Expected: RED because the public contract modules do not exist.

- [x] **Step 2: Define the minimal public types**

  Create components/projects/content-types.ts with PublicProjectManifestEntry, PublicProjectCardContent, ResolvedProjectCard, the localized page-shell type, and optional visual metadata. Reuse Locale, ServiceSectionId, and ActionLink rather than duplicating route/service vocabularies. Do not add detail types in PR 1 because no approved project uses them.

  Keep permission, internal disclosure, evidence strength, lifecycle, grantor/date/restrictions, and homepage eligibility out of these types. Do not create a generic CMS block schema, filter model, query state, client component, or all-purpose card variant API.

  Run npm run typecheck. Expected: RED until the manifest and localized modules satisfy the new contracts.

- [x] **Step 3: Add the empty whitelist and resolvers**

  Create lib/projects/publication.ts with the explicit empty publishedProjectManifest and pure resolver functions. Resolve only entries enumerated by the manifest, preserve manifest order, reject missing localized content, reject an external destination without an https URL, and expose detail params only for detail destinations.

  Do not read files at runtime, import JSON, parse Markdown, glob project assets, or infer readiness from the existence of content.

- [x] **Step 4: Materialize only approved page-shell language**

  Add app/(es)/_content/projects.ts and app/(en)/en/_content/projects.ts with the exact H1, introduction, taxonomy labels, confidentiality system language, final CTA copy, and Contact semantic action approved by PROJECTS-EXPERIENCE-CLOSURE. Export empty card and detail maps.

  These modules are intentionally not imported by a route in PR 1. Do not add a Projects page directory, navigation label, image, candidate name, repository URL, demo URL, or public service claim.

- [x] **Step 5: Make the focused and repository contracts GREEN**

  Run:

  ~~~powershell
  node --test scripts/projects-publication.test.mjs
  npm test
  npm run typecheck
  npm run docs:check
  git diff --check
  ~~~

  Expected: all pass. Inspect the diff and a production build manifest to confirm no route file, generated route, navigation change, public project asset, dependency, configuration, or public page behavior was added.

- [x] **Step 6: Review and commit PR 1**

  Update this plan's Progress section with exact checks and warnings. Review main...HEAD for candidate names, private notes, permission data, legacy imports, broad abstractions, and accidental route exposure. Commit with feat: add fail-closed project publication contract, push the task branch, and open a human-reviewed implementation PR without merging it.

**Acceptance criteria:**

- The public manifest is empty and is the only enumeration source.
- A synthetic non-whitelisted record cannot be returned by the resolver.
- Spanish and English approved page-shell content is typed but unreachable from public routes.
- Internal evidence/permission fields and current candidate content do not enter application project source.
- Existing eight static routes, header/footer, Services, HOME-PROOF, dependencies, assets, and deployment configuration are unchanged.
- Focused tests, full tests, typecheck, docs check, diff check, and behavior-neutral review pass.

### Evidence readiness gate before PR 2

**Status: SATISFIED on 2026-09-06 for card-only publication.** PROJECT-INVENTORY and the three item records approve General Reservation System, The-System, and MPC Administración in that order. Each record supplies relationship boundaries, maturity, lifecycle, service relevance, field-level permission, exact Spanish and English card copy, an approved HTTPS repository destination, an explicit no-image decision, and No decisions for detail-page and homepage eligibility. This gate does not approve functional-demonstration language, production/client claims, imagery, details, or homepage integration.

Before PR 2 begins, update the owning item record and PROJECT-INVENTORY through human review. At least one item must be READY or READY-SUMMARY-ONLY and must have:

- confirmed relationship, maturity, lifecycle/publication state, service relevance, and permitted public disclosure;
- explicit field-level permission for every public claim, identity, link, logo, workflow, metric, testimonial, and asset used;
- approved Spanish and natural-English title, context, summary, two or three capabilities, maturity label, evidence signal, CTA, and limitations/confidentiality language;
- verified destinations and documented asset provenance/sensitive-data review where applicable;
- an explicit card order position using the approved editorial policy;
- an explicit detail-page Yes/No decision and homepage eligibility decision.

The count is three, so Task 2 may proceed. Any implementation field beyond the exact item-approved scope fails closed and must stop for owner review.

### Task 2 / PR 2: Publish the bilingual Projects index

**Objective:** Publish a useful Projects index in both languages with General Reservation System, The-System, and MPC Administración, in that editorial order and within their exact limited card scope.

**Dependencies:** SATISFIED. Task 1 is merged and all three READY item records passed the card-publication gate on 2026-09-06.

**Files:**

- Create: components/projects/ProjectCard.tsx
- Create: components/projects/ProjectsPage.tsx
- Do not create for the current image-free inventory: components/projects/ProjectVisual.tsx
- Create: app/(es)/proyectos/page.tsx
- Create: app/(en)/en/work/page.tsx
- Create: scripts/projects-route.test.mjs
- Modify: lib/projects/publication.ts
- Modify: components/projects/content-types.ts
- Modify: app/(es)/_content/projects.ts
- Modify: app/(en)/en/_content/projects.ts
- Modify: app/(es)/_content/services.ts
- Modify: app/(en)/en/_content/services.ts
- Modify: lib/site-routes.ts
- Modify: lib/foundation-navigation.ts
- Modify: components/foundation/SiteHeader.tsx
- Modify: components/foundation/SiteFooter.tsx
- Modify: every existing localized route entry that supplies SiteHeader/SiteFooter labels
- Modify: scripts/projects-publication.test.mjs
- Modify: scripts/site-routes.test.mjs
- Modify: scripts/site-header.test.mjs
- Modify: relevant Services content test(s) for the approved evidence-status wording
- Modify: scripts/verify-static-export.mjs
- Modify: ARCHITECTURE.md
- Modify: docs/architecture/current-system.md
- Modify: docs/plans/active/projects-evidence-experience.md
- Modify: docs/governance/status-register.md

- [x] **Step 1: Update evidence authority before application content**

  Confirm the merged PROJECT-INVENTORY and item records still expose `PROJECT-GRS`, `PROJECT-THE-SYSTEM`, and `PROJECT-MPC-ADMIN` as READY in that editorial order with the exact permission boundary recorded on 2026-09-06. If any application field exceeds an item record, stop; the application PR does not approve evidence.

- [x] **Step 2: Extend tests and observe RED**

  Add the approved manifest entries and exact bilingual card content, then extend publication tests for equality between the manifest and both locale maps, route destinations, service relationships, optional publication note, approved visuals, and absence of internal fields. Add route-source tests requiring both index routes to use the shared ProjectsPage and prohibiting legacy imports.

  Extend route tests for projects as the fifth semantic page route and for the /proyectos/ ↔ /en/work/ alternate pair. Extend static-artifact verification to require both index HTML artifacts, correct document language, one H1, approved intro/final CTA, exact manifest card order, no empty group headings, valid links, and base-path correctness.

  Run npm test. Expected: RED because routes, composition, navigation, and resolver output are incomplete.

- [x] **Step 3: Publish the manifest and localized public content**

  Add exactly `PROJECT-GRS`, `PROJECT-THE-SYSTEM`, and `PROJECT-MPC-ADMIN` to the manifest in that order. Populate both locale maps from the item-approved copy. Use no legacy descriptions and omit visual metadata for all three.

  Resolve every card action before rendering. All three current cards use their item-approved external public-repository URL and `Ver código fuente / View source` treatment. A detail action points to the paired static path only when a future manifest entry marks detail. Contact, Services, demo, and other external destinations remain available only when an item record approves them.

  Synchronize the implemented Services evidence-status sentence with the newly approved wording in PAGE-SERVICES; it must still describe General Reservation System as implementation evidence without current functional verification, client work, production use, or verified outcome.

- [x] **Step 4: Add index route and navigation ownership**

  Add projects to foundationRouteIds/foundationRoutes with /proyectos/ and /en/work/, and extend FoundationNavigationPaths. Add localized Projects/Work labels to SiteHeader and SiteFooter inputs and to every route entry that currently supplies their labels. Insert the destination in the approved navigation order without exposing Studio or Privacy work outside scope.

  Add both route files atomically. Each route imports only its own locale content, resolves public cards through the whitelist, computes localized navigation paths, and composes the existing header/footer around ProjectsPage. Do not add metadata origin/canonical work or runtime locale logic.

- [x] **Step 5: Implement the semantic index and card**

  Build ProjectsPage and ProjectCard as Server Components. Reuse CommercialSectionHeading where its existing API fits without changing homepage/Services output. Render one main and H1, selected evidence, inventory-sensitive grouping, optional publication note, and final Action-tint CTA.

  ProjectCard renders an article/list item, concise text meta, H2 or H3 chosen by its parent section contract, natural summary, semantic non-interactive tags, evidence text, and one destination-specific link. Only the link is interactive. Use one column below 1024px and two at/above 1024px. Do not clamp text, fix card height, or add motion/shadow.

- [x] **Step 6: Add only approved assets**

  Confirm that all three manifest entries omit visual metadata and that no legacy or new project asset is added. If an asset appears necessary, stop and obtain item-level approval rather than expanding this PR.

- [x] **Step 7: Verify deterministic and static behavior**

  Run:

  ~~~powershell
  npm run validate
  npm run verify:static-export
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  npm run verify:static-export
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  git diff --check
  ~~~

  Expected: all gates pass and the exported route count increases from eight to ten. Both index routes contain only whitelisted public content and every internal URL has exactly one configured base path.

- [x] **Step 8: Perform bilingual visual/accessibility QA**

  Use visual-qa on /proyectos/ and /en/work/ at 320x800, 375x812, 768x1024, 1024x768, and 1440x900, then verify the relevant /Portfolio routes. Check no horizontal overflow, natural card growth, translation expansion, tag wrapping, CTA/evidence order, image containment/legibility, clear interaction affordance, keyboard order, visible focus, 44px targets, heading/list semantics, 200% text zoom, reduced motion, JavaScript-disabled content, console errors, page errors, and automated accessibility results.

- [x] **Step 9: Synchronize and commit**

  Update current-system and status owners with demonstrated merged-ready facts, and record exact validation/visual evidence in this plan. Review the complete diff for over-disclosure, unsupported claims, unintended homepage changes, client code, dependencies, or empty routes. Commit, push, and open a human-reviewed PR without merging.

### Task 3 / PR 3: Publish eligible static project details

**Objective:** Publish every and only manifest item whose item record approves a meaningful detail page.

**Dependencies:** SATISFIED on 2026-09-06. PR 2 is merged. `PROJECT-GRS`, `PROJECT-THE-SYSTEM`, and `PROJECT-MPC-ADMIN` each have complete bilingual detail content, an approved public repository evidence link, and one approved labeled conceptual visual. Their result state remains `implementation-evidence`; no functional-demonstration or production claim is introduced.

**Files:**

- Create: components/projects/ProjectDetailPage.tsx
- Create only when multiple evidence items justify it: components/projects/ProjectEvidenceList.tsx
- Create: app/(es)/proyectos/[projectSlug]/page.tsx
- Create: app/(en)/en/work/[projectSlug]/page.tsx
- Create: scripts/project-details.test.mjs
- Modify: components/projects/content-types.ts
- Modify: lib/projects/publication.ts
- Modify: lib/site-routes.ts
- Modify: lib/foundation-navigation.ts
- Modify: app/(es)/_content/projects.ts
- Modify: app/(en)/en/_content/projects.ts
- Add: public/projects/general-reservation-system/conceptual-workflow.webp
- Add: public/projects/the-system/conceptual-access-model.webp
- Add: public/projects/mpc-administracion/conceptual-operations-model.webp
- Modify: scripts/projects-publication.test.mjs
- Modify: scripts/site-routes.test.mjs
- Modify: scripts/verify-static-export.mjs
- Modify: ARCHITECTURE.md
- Modify: docs/architecture/current-system.md
- Modify: docs/plans/active/projects-evidence-experience.md
- Modify: docs/governance/status-register.md

- [x] **Step 1: Assert detail eligibility and route pairs**

  **Gate status: SATISFIED.** The three item records meet the approved detail rule through context, problem/opportunity, delivered scope, capabilities, implementation-evidence result, evidence links, limitations, and conceptual visual material. The implementation must still enforce the contract and generate only these three paired slugs.

  Add the minimal detail types needed by the eligible item, following the approved maximum boundary above. Then add tests that every detail destination exists in both locale detail maps, covers at least five approved information categories, contains at least one permitted evidence item/link, has a visible limitation or publication-scope statement when restricted, and has one related service plus Contact CTA. Assert non-detail and unknown slugs cannot enter generateStaticParams or resolve a page.

  Run node --test scripts/project-details.test.mjs. Expected: RED until the route/resolver/composition exists.

- [x] **Step 2: Add exact path and language-equivalence helpers**

  Add getProjectDetailPath and getProjectDetailNavigationPaths. The latter preserves the stable slug across locales and changes only the alternate-language destination. Do not add a missing-locale fallback; the publication contract prevents incomplete pairs.

- [x] **Step 3: Add statically generated paired routes**

  Add generateStaticParams to each locale route from the detail-only manifest projection and set dynamicParams to false. Each route imports only its own locale detail content. Do not generate pages for Contact-only, Services-only, external-demo, summary-only, blocked, private, founder-only, or retired records.

- [x] **Step 4: Implement the adaptive editorial composition**

  Render the approved section order and omit absent optional sections. Use the text-only header when no visual exists. Render evidence as an ordinary semantic list/grid; do not build a carousel for one or several static items. Keep limitations visible in normal reading flow and technical notes subordinate.

- [x] **Step 5: Extend artifacts and verify both export modes**

  Require every detail pair in scripts/verify-static-export.mjs with correct lang, H1, ordered populated sections, evidence labels/links, limitations, service destination, Contact CTA, language-equivalent href, asset/base-path integrity, and no unsupported empty page. Run the full validation and root/base-path commands from PR 2.

- [ ] **Step 6: Perform detail visual/accessibility QA**

  Check every detail route at 320x800 and 1440x900, plus 375x812, 768x1024, and 1024x768 when content or media reveals breakpoint risk. Verify header composition, source order, readable measures, media containment, evidence/limitation visibility, external-link clarity, related-service/final CTA hierarchy, keyboard/focus, target sizes, 200% zoom, reduced motion, no-JavaScript content, console/page errors, and automated accessibility results in both locales and relevant base-path mode.

- [x] **Step 7: Synchronize and commit**

  Record exact published slugs and evidence in the plan and current-system/status owners. Review every rendered claim and public asset against its item permission matrix. Commit, push, and open a human-reviewed PR without merging.

The three current items are detail-eligible for summary-only pages. If a later review removes an item's approved detail content or asset before implementation, remove that slug from the manifest and record the changed gate before continuing; do not create an empty route.

### Task 4 / PR 4: Retire legacy project paths and close the plan

**Objective:** Remove obsolete project sources/assets that could be mistaken for publication authority, prove the new public boundary is the only application path, and complete documentation.

**Dependencies:** PR 2 is merged; PR 3 is merged or explicitly deferred after the three currently authorized detail routes are reviewed.

**Files:**

- Delete after consumer verification: data/projects.json
- Modify: lib/data.ts
- Modify: lib/types.ts
- Delete after consumer verification: components/core/Card.tsx
- Delete after consumer verification: public/projects/Busesfy.svg
- Delete after consumer verification: public/projects/MPC-Administracion.svg
- Delete after consumer verification: public/projects/AI-Scheduler.svg
- Delete after consumer verification: public/projects/GRS.svg
- Delete after consumer verification: public/projects/Documancer.svg
- Delete after consumer verification: public/projects/atlas.svg
- Delete after consumer verification: public/projects/pulse.svg
- Delete after consumer verification: public/projects/vertex.svg
- Modify: scripts/projects-publication.test.mjs
- Modify: scripts/verify-static-export.mjs
- Modify: ARCHITECTURE.md
- Modify: docs/architecture/current-system.md
- Modify: docs/architecture/current-quality-findings.md
- Move: docs/plans/active/projects-evidence-experience.md to docs/plans/completed/projects-evidence-experience.md
- Modify: docs/plans/index.md
- Modify: docs/index.md
- Modify: docs/governance/status-register.md

- [x] **Step 1: Prove every legacy target is unused**

  Search application, tests, scripts, styles, and documentation references for projectsData, data/projects.json, the legacy Project type, components/core/Card, and every legacy asset path. Resolve legitimate documentation references by preserving historical filenames in prose where necessary; delete only targets with no valid runtime/import use.

- [x] **Step 2: Remove the obsolete publication paths**

  Remove the legacy JSON import/export/type and the unused animated Card primitive only when repository search proves no other feature uses them. Remove all unapproved legacy project assets after confirming approved public replacements live under stable slug directories. Do not delete unrelated founder data or shared primitives.

- [x] **Step 3: Strengthen privacy and regression tests**

  Assert there is no runtime import path to legacy project data, internal docs, or removed assets; every remaining public project asset belongs to a manifest entry; generated HTML and source bundles contain none of the current blocked/private record names unless a later approved item record explicitly authorizes that exact public identity.

- [x] **Step 4: Run final deterministic and visual regression**

  Run npm run validate, root and /Portfolio static builds plus static verification, git diff --check, and repository searches. Repeat compact/wide smoke checks for both index routes and every detail pair; confirm Services and HOME-PROOF remain unchanged except for the approved Projects navigation link added in PR 2.

- [x] **Step 5: Complete repository knowledge**

  Update current architecture and quality owners with demonstrated facts. Preserve item evidence records and historical ADRs. Set plan_status to COMPLETED, move this file to completed/, update indexes/status, and record PR links, exact checks, warnings, omitted phases, and deviations.

- [x] **Step 6: Review and commit**

  Inspect main...HEAD for over-broad deletion, missing assets, broken CV/icons/routes, generated output, secrets, and unrelated formatting. Commit, push, and open a human-reviewed PR without merging.

## Testing strategy

### Publication contract

- Manifest IDs and slugs are unique and non-empty.
- Allowed maturity, service, public-scope, destination, visual, and evidence-link values are exhaustive.
- Both locale card maps exactly equal manifest IDs.
- Both locale detail maps exactly equal detail-destination IDs.
- A content record outside the manifest is never returned.
- A manifest item missing either locale fails.
- A detail record missing its counterpart fails.
- Every action resolves to a generated detail route, Contact, an approved Services anchor, or a valid approved external URL.
- Every public image exists, declares dimensions, has appropriate localized alt intent, and belongs to a manifest entry.
- Internal audit/permission fields and imports are absent from application project sources.

### Content constraints

- Required public strings are non-empty.
- Capabilities contain exactly two or three non-empty business labels.
- No duplicate IDs/slugs, unsupported maturity labels, unsupported result kinds, empty detail sections, or unsupported detail routes exist.
- Tests assert structural/editorial invariants and a small number of canonical labels; they do not duplicate every paragraph or encode subjective writing quality.

### Static export

- Before PR 2, the expected artifact list remains exactly the current eight routes.
- PR 2 adds /proyectos/ and /en/work/ and verifies route equivalence.
- PR 3 adds exactly two artifacts per detail slug, for six detail artifacts across the three approved slugs.
- Both root and /Portfolio modes verify language, trailing-slash references, single base-path application, card/detail destinations, evidence links, and images.

## Visual, accessibility, performance, and privacy gates

- Viewports: 320x800, 375x812, 768x1024, 1024x768, 1440x900.
- Index: no overflow; correct one/two-column transition; natural heights; readable meta/evidence; wrapping tags/copy; clear CTA; accurate image containment; no misleading whole-card interaction.
- Details: header/text measure; media; section rhythm; long copy; capability grids; evidence; limitations; related service; final CTA.
- Accessibility: one H1; logical H2/H3 order; semantic list/card structure; descriptive links; no nested controls; status in text; workflow-specific alt; decorative empty alt; visible focus; logical mobile reading order; 44/48px targets; 200% zoom; reduced motion; JavaScript-independent content.
- Performance: inspect derivative dimensions/bytes, static page weight, below-fold lazy loading, LCP choice, unnecessary client JavaScript, and duplicate public data. Projects remain Server Component/static content.
- Privacy: inspect public source, generated HTML, RSC/static payloads, source maps where produced, and public assets for internal notes, client-sensitive data, permission matrices, secrets, and blocked identities.

## Documentation synchronization

- PROJECT-EVIDENCE remains the governing model/index and records taxonomy/publication-boundary clarifications.
- PROJECT-INVENTORY and each item file remain the sole authority for publication state, permission, evidence, assets, detail eligibility, and homepage eligibility.
- PAGE-PROJECTS / PAGE-PROJECT-DETAIL remain the public experience owners; update them only if human-reviewed product requirements change.
- CONTENT-LOCALIZATION owns shared system language; item-specific bilingual copy remains in the item record before entering route-owned application modules.
- DESIGN-VISUAL and DESIGN-IX-A11Y remain design owners; implementation records evidence and deviations here rather than rewriting their rules.
- ARCHITECTURE.md and docs/architecture/current-system.md change only after behavior or source boundaries become current facts.
- This plan records progress, exact validations, PR links, gate results, omissions, and deviations.
- docs/plans/index.md, docs/index.md, and GOV-STATUS track active/completed state without duplicating item-level claims.
- Accepted ADR history is immutable. A consequential scope change creates a new governance record instead of rewriting ADR-STATIC-LOCALIZED-ROUTING.

## Expected affected areas

- One narrow public project contract and manifest.
- Two route-owned localized public-content modules.
- Two future localized index routes and optional paired dynamic detail route files.
- Shared Projects Server Components and existing commercial primitives.
- Existing semantic route/navigation helpers and header/footer labels.
- Focused Node contract tests and static artifact verification.
- Approved public assets under stable slug directories.
- Current-system, status, index, and plan documentation.
- No dependencies, backend, CMS, database, API, filter state, hosting, deployment, runtime localization, or homepage proof changes.

## Risks

- An apparently public repository, reachable URL, or legacy image can be mistaken for publication permission. The manifest gate and item-record citation prevent that inference.
- Combining internal audit metadata with public content can leak private facts into static bundles. Keeping internal records in docs and testing forbidden fields/imports contains the risk.
- A content map can accidentally become an implicit publication list. Resolvers iterate only the manifest and tests reject extra locale records.
- One locale can lag the other. Exact map equality and paired detail generation fail the build.
- Dynamic routes can accidentally generate summary-only or missing pages. Detail params derive only from detail destinations and dynamicParams is false.
- Long bilingual copy can break cards or evidence panels. Content-growth layouts, 320px/200% zoom checks, and no line clamp are mandatory.
- Evidence images can become unreadable or excessively heavy. Responsive derivative and legibility checks are release gates.
- Adding Projects navigation before useful evidence would expose an empty route. Navigation and both index routes land atomically only after the readiness gate.
- Legacy JSON/assets can remain an attractive accidental source. The final cleanup removes them after consumer verification, not before rollback safety is established.
- The local planning base may diverge from origin/main. The planning PR must not be opened until the decision-closure commit is present in remote main or the human reviewer explicitly selects another safe base.

## Deferred concerns

- Busesfy, ChronoApp, and Documancer retain their item-level blocked/private/retired decisions and forward requirements.
- General Reservation System, The-System, and MPC Administración have approved card/detail titles, summaries, capabilities, evidence links, limitations, and labeled conceptual visuals. Runtime verification, richer results, and homepage eligibility remain deferred.
- Project detail PR 3 is merged for exactly the three current eligible slugs; no additional item may enter without the same gate.
- Filters remain rejected until the approved inventory threshold is met.
- HOME-PROOF integration remains a separate optional later initiative even if an item becomes homepage-eligible.
- Canonical production origin, absolute canonical/hreflang/sitemap metadata, broader site navigation destinations, and long-term hosting remain outside this implementation plan.
- Whole-site accessibility conformance claims and global performance budgets remain OPEN; this plan owns only the Projects verification boundary.

## Progress

- 2026-09-06: Initiative 4 product, evidence, disclosure, localization, card/detail, imagery, accessibility, performance, and ordering decisions were closed in PROJECT-EVIDENCE, PROJECT-INVENTORY, PROJECTS-EXPERIENCE-CLOSURE, PAGE-PROJECTS, DESIGN-VISUAL, and DESIGN-IX-A11Y.
- 2026-09-06: Architecture classification selected Route B / PLAN. ADR-STATIC-LOCALIZED-ROUTING is sufficient; no RFC or new ADR is required.
- 2026-09-06: At planning approval, the inventory contained zero READY, zero READY-SUMMARY-ONLY, and zero detail-eligible items. Public index/detail implementation was therefore gated, while the behavior-neutral fail-closed contract was fully authorized as PR 1.
- 2026-09-06: Repository inspection confirmed legacy data/projects.json, lib/data.ts, lib/types.ts, components/core/Card.tsx, and eight unapproved public/projects assets remain unused by the current public route tree.
- 2026-09-06: Local repository state differs from the task premise: origin/main remains at 6417634 while the decision-closure commit 14ad8e8 exists only on the local base. This branch is based on 14ad8e8. Do not publish a planning PR that combines both initiatives; first ensure decision closure is present on remote main or obtain an explicit human-approved base.
- 2026-09-06: Planning-branch validation passed: documentation validation covered 71 Markdown files, 50 document IDs, and 4 repository Skills; all 34 Node tests passed; lint, TypeScript no-emit checking, and the production static build passed. Existing Node module-type warnings were informational and unchanged.
- 2026-09-06: PR 1 implementation added only the typed public contract, empty manifest, pure manifest-driven resolvers/validator, bilingual approved page-shell modules, and focused publication tests. The required RED run failed on the missing publication module; the GREEN run passed 5/5 focused tests. `npm test` passed 39/39, `npm run lint`, `npm run typecheck`, and `git diff --check` passed. Node's existing `MODULE_TYPELESS_PACKAGE_JSON` warning remained informational; no route, navigation, asset, dependency, configuration, candidate, or internal evidence data changed.
- 2026-09-06: PR 1 final gates passed: `npm run docs:check`, `npm run validate` (39/39 tests, lint, typecheck, and static build), `npm run verify:static-export` in root mode, and the `/Portfolio` base-path build plus verifier (8 routes in both modes). The build emitted only the existing Browserslist freshness notice and Node tests emitted the existing module-type warning; both were informational and unchanged. Playwright was not available locally and no rendered surface changed, so visual/accessibility QA was not applicable to this behavior-neutral contract PR. Evidence-boundary review confirmed the manifest is empty, no candidate/internal audit data is present, and the existing eight-route public artifact remains unchanged.
- 2026-09-06: The initiative owner promoted General Reservation System, The-System, and MPC Administración to READY for exact, image-free, source-backed bilingual cards. Evidence strength remains `implementation-evidence`; no detail page or homepage eligibility was approved. PROJECT-INVENTORY records the launch order as GRS, The-System, then MPC. Task 2 / PR 2 is unblocked.
- 2026-09-06: The documentation-only READY promotion synchronized the three item records, evidence and experience owners, PAGE-PROJECTS, PAGE-SERVICES, migration/index summaries, architecture map, status register, and this plan. `npm run docs:check` passed for 71 Markdown files, 50 document IDs, and 4 repository Skills; `npm run validate` passed all 39 tests, lint, typecheck, and the production static build. Existing Node module-type warnings and the Browserslist freshness notice remained informational. No application implementation file or public asset changed, so visual QA was not applicable.
- 2026-09-06: Task 2 implementation published exactly `PROJECT-GRS`, `PROJECT-THE-SYSTEM`, and `PROJECT-MPC-ADMIN` as limited, image-free, external-source cards in the approved order at `/proyectos/` and `/en/work/`. The shared header/footer now exposes localized Projects/Work navigation, and the Services evidence sentence uses the approved current-verification limitation. No detail route, visual, homepage card, filter, dependency, or legacy-source import was added; blocked, private, retired, and unresolved records remain outside the manifest.
- 2026-09-06: Task 2 deterministic RED was observed against the stale empty-manifest and four-route contracts before the GREEN implementation. Afterward `npm test` passed 41/41, `npm run lint`, `npm run typecheck`, and `npm run docs:check` passed. Root static export and `/Portfolio` base-path export both built successfully; `npm run verify:static-export` verified 10 routes in each mode, including exact card order, source links, single H1/main semantics, no images/empty taxonomy headings/nested cards, language, and base-path integrity. `git diff --check` remains required before commit.
- 2026-09-06: Playwright visual QA was attempted with `npx --no-install playwright --version` and the available browser surface was attempted twice; no local Playwright package or browser surface could start in this environment. No visual result is claimed. The deterministic source and generated-HTML checks cover server rendering, semantic cards/lists, keyboard-sized links/focus classes, natural-height/no-clamp/no-shadow structure, JavaScript-independent static content, and external-link treatment; the missing viewport/console/automated-a11y evidence is an explicit PR review limitation.
- 2026-09-06: Task 2 was committed as `e1a0caa` (`feat: publish bilingual projects index`), pushed to `codex/projects-ready-promotion`, and opened as [PR #28](https://github.com/Furlanich/Portfolio/pull/28) against `main`. The PR is open for human review and has not been merged.
- 2026-09-06: Initial post-merge gate audit after PR #28 found zero detail-eligible items: all three published records then remained `summary-only`, explicitly marked `Detail page: No`, and lacked approved detail content plus a permitted detail evidence asset or evidence link. At that point PR 3 was recorded as **OMITTED** and Task 4 was next; the subsequent owner-approved conceptual assets and detail content below supersede that interim gate state without changing the plan sequence.
- 2026-09-06: The initiative owner approved one labeled conceptual WebP detail visual and complete bilingual summary-only detail content for each of the three READY records. The visual assets contain no product UI, client identity, customer data, metrics, or functional claim; each is explicitly labeled as conceptual in the detail copy and alt intent. The Task 3 / PR 3 gate is reopened and satisfied for exactly the three paired slugs; the existing index remains image-free.
- 2026-09-06: Task 3 deterministic RED was observed before implementation: the focused detail contract failed on the stale external destinations, missing detail content, and missing paired route sources. The GREEN focused route/publication/detail suite then passed, including exact three-slug membership, complete bilingual content, approved conceptual assets, same-slug language switching, unknown-slug rejection, static closed routes, and Server Component accessibility boundaries.
- 2026-09-06: Task 3 implementation adds exactly six static detail artifacts for `general-reservation-system`, `the-system`, and `mpc-administracion`. Root and `/Portfolio` static builds plus `npm run verify:static-export` passed with 16 artifacts in each mode; the verifier checks ordered headings, bilingual language, evidence links, visible limitations, related-service/contact actions, conceptual image labels/alt text, and single base-path application. No blocked, private, retired, unresolved, production-claim, or homepage record is published.
- 2026-09-06: Playwright and browser-based visual/accessibility QA were attempted with the available local package/browser surfaces, but no Playwright package or browser surface could start in this environment. No viewport, console, or automated-a11y pass is claimed. Deterministic source and exported-HTML checks cover semantic structure, server rendering, focus/target-size classes, natural-height/no-clamp structure, JavaScript-independent content, external-link treatment, and base-path integrity; human review should complete the required viewport/browser matrix.
- 2026-09-06: Task 3 was committed as `dcdc863` (`feat: publish approved project detail pages`), pushed with the approved visual-assets commit, and opened as [PR #31](https://github.com/Furlanich/Portfolio/pull/31) against `main`. The PR is open for human review and has not been merged.
- 2026-09-06: PR #31 was subsequently merged by the human reviewer, satisfying the Task 4 dependency. Consumer verification on the merged baseline found no active application, test, script, style, route, or configuration consumer for `data/projects.json`, the project-only `Project` type/export, `components/core/Card.tsx`, or the eight legacy project SVGs. The approved detail WebPs were present under stable slug paths before cleanup.
- 2026-09-06: Task 4 deterministic RED was observed before deletion: the cleanup contract failed because the legacy JSON, Card primitive, and SVG assets existed and `lib/data.ts` still imported/exported the project dataset. After minimal cleanup, the GREEN cleanup contract passed; `npm test` passed 50/50, lint and typecheck passed, and the strengthened export verifier passed in root and `/Portfolio` modes with 16 routes each and no retired/private/internal project payload matches.
- 2026-09-06: Task 4 removed `data/projects.json`, the project-only `Project` type/export, `components/core/Card.tsx`, and the eight unapproved legacy SVGs. No unrelated founder data or shared primitives were removed. The remaining public project asset set is exactly the three approved conceptual WebPs; statuses and unresolved evidence questions remain unchanged.
- 2026-09-06: Task 4 browser/Playwright visual regression was attempted but unavailable because no local Playwright package or browser surface could start. No viewport, console, or automated-a11y pass is claimed. The no-render-change cleanup was covered by deterministic source/export checks, and the existing whole-site accessibility and release questions remain OPEN.

## Important implementation decisions

- Use documentation as the internal evidence system and application source as an intentionally public projection; do not create a second permission database in TypeScript.
- Make manifest membership the only publication whitelist and give it no permissive lifecycle default.
- The empty, behavior-neutral contract was established before any project became public.
- Publish the index with exactly the three approved useful cards; do not infer additional records or fields.
- Add Projects navigation only with both useful localized index routes.
- Require complete locale pairs instead of inventing a language-switch fallback.
- Generate detail params only from explicit detail destinations.
- Keep conceptual visuals visibly labeled and separate from implementation-evidence claims; do not treat generated media as runtime verification.
- Implement no filters, carousel, image requirement, client runtime, or generalized content/design framework.
- Remove legacy project data/assets only after the new public route path is merged and consumer search proves deletion safe. This Task 4 cleanup gate is now satisfied; future records still require their own evidence and permission review.
- Keep HOME-PROOF unchanged and treat any upgrade as separate work.

## Deviations discovered during execution

The initiative owner explicitly promoted three items to `READY` for limited source-backed cards without upgrading evidence strength, then approved one labeled conceptual detail visual and summary-only bilingual detail content per item. The change satisfies the existing Task 3 gate without changing architecture or adding a new evidence axis; runtime gaps, non-claims, and homepage ineligibility remain visible. Generated visuals are not functional evidence.

## Historical planning PR review contract

The merged planning PR contained documentation only and recorded the then-current zero/zero/zero/six public inventory, Route B / PLAN classification, existing static localized architecture, four-PR sequence, and PR 1 first task. That historical review state is preserved here; the current inventory and next-task authority are recorded above and in Progress.
