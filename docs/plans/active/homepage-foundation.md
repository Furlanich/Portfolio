---
id: PLAN-HOMEPAGE-FOUNDATION
type: execution-plan
status: APPROVED
plan_status: ACTIVE
related:
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
  - RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING
  - ADR-STATIC-LOCALIZED-ROUTING
  - IA-SITE
  - CONTENT-LOCALIZATION
  - PORTFOLIO-MIGRATION
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - PAGE-FOUNDER
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-04
---

# Homepage Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first coherent bilingual FURLANICH business-homepage foundation without losing the founder material preserved by the current portfolio.

**Architecture:** Implement the accepted explicit Spanish-root and English-`/en/` static route trees with locale-specific root layouts. Localized Server Component routes own content and pass typed view models and resolved links to shared semantic components; the route-tree cutover remains atomic across all eight minimum routes.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Node 24 tests, static export, and GitHub Pages with an optional build-time `basePath`.

**Spec:** [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](../../rfcs/homepage-hero-implementation-boundary.md), [`RFC-HOMEPAGE-FOUNDATION-STATIC-ROUTING`](../../rfcs/homepage-foundation-static-localized-routing.md), and [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md).

## Global Constraints

- Public routes and navigation names remain owned by [`IA-SITE`](../../product/information-architecture.md); this plan implements only the eight approved foundation routes.
- Spanish is `es-AR` at root routes and English is under `/en/`; there is no automatic locale redirect or client-only locale selection.
- Preserve `output: 'export'`, `trailingSlash: true`, optional `NEXT_PUBLIC_BASE_PATH`, and the current GitHub Pages deployment for this migration.
- Route entry points are Server Components by default and import one locale's route-owned content.
- Shared components receive typed content and resolved links; they do not infer locale or own public route strings.
- The current personal homepage remains primary until the atomic cutover contains both locale layouts, all eight minimum routes, usable Services and Contact destinations, and both verified Founder destinations.
- The business hero uses only the approved Spanish and English copy from [`PAGE-HOME`](../../product/pages/home.md#home-hero).
- The foundation uses only the approved visual tokens and behavior in [`DESIGN-VISUAL`](../../design/visual-language.md#homepage-foundation-visual-baseline-approved) and [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#homepage-foundation-interaction-and-responsive-baseline-approved).
- Do not enable a contact form until provider, privacy, consent, retention, and disclosure decisions are approved.
- Do not emit placeholder absolute canonical, `hreflang`, Open Graph URL, or sitemap-alternate values before the production origin is approved.
- Do not delete legacy founder/project source material during this plan unless its approved replacement is present and verified.
- Add no dependency unless the same PR demonstrates why existing Next.js, React, TypeScript, Tailwind, and Node 24 facilities are insufficient.

---

## Objective

Move from the legacy single-page personal portfolio to the smallest usable business foundation that satisfies the approved localized routes, destination content, founder-preservation gate, hero design, and static-deployment constraints.

## Requirements implemented

| Authority | Foundation responsibility |
| --- | --- |
| [`IA-SITE`](../../product/information-architecture.md) | Spanish root routes, English `/en/` equivalents, trailing slashes, page-context language switching, and no automatic redirect |
| [`CONTENT-LOCALIZATION`](../../product/content-and-localization.md) | `es-AR` priority, approved minimum English scope, natural adaptations, and canonical-domain release separation |
| [`PAGE-HOME`](../../product/pages/home.md#home-hero) | Approved `HOME-HERO` content, hierarchy, trust statements, and real Contact/Services CTA destinations |
| [`PAGE-SERVICES`](../../product/pages/services.md#homepage-foundation-minimum-destination-approved) | Useful minimum Spanish and English Services destinations |
| [`PAGE-CONTACT`](../../product/pages/contact-and-privacy.md#homepage-foundation-minimum-destination-approved) | Working direct-channel Contact destinations without an unapproved form |
| [`PAGE-FOUNDER`](../../product/pages/studio-and-founder.md#homepage-foundation-minimum-founder-destination-approved) | Coherent bilingual Founder profiles with biography, experience, education, capabilities, CV, professional links, and Contact path |
| [`PORTFOLIO-MIGRATION`](../../product/personal-portfolio-migration.md#homepage-foundation-migration-gate-approved) | Preserve and verify founder history before replacing the personal homepage |
| [`DESIGN-VISUAL`](../../design/visual-language.md#homepage-foundation-visual-baseline-approved) | Wordmark, palette, typography, grid, spacing, actions, surfaces, and typography-led hero |
| [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#homepage-foundation-interaction-and-responsive-baseline-approved) | Responsive ranges, one-source-order reflow, keyboard/focus behavior, target sizes, and no entrance motion |

## Affected architecture

The pre-cutover implementation was one client-rendered `/` route with page-wide locale state, both message bundles, anchor navigation, personal metadata, and no localized destination routes. The accepted target is [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md); Task 3 implements that target atomically while retaining legacy source material.

Preparatory PRs may add tested contracts and content without changing public routes. The integration PR then removes `app/layout.tsx` and `app/page.tsx` while adding both locale root layouts and all eight minimum routes in one change. Legacy source data remains available for later migration even when obsolete runtime components are retired.

## Relevant ADRs

- [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md) is the sole new architectural authority for this plan.
- No separate ADR is required for [`RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`](../../rfcs/homepage-hero-implementation-boundary.md). That record defines delivery scope, sequencing, and integration gates rather than an additional durable technical architecture.

## Scope

- A typed locale and semantic route-equivalence contract for Home, Services, Contact, and Founder.
- Route-private Spanish and English content modules for the approved foundation slice.
- Two static locale root layouts and the eight approved public routes.
- Shared semantic header, footer, language switch, minimum destination layouts, Founder profile, and `HOME-HERO` components.
- Foundation visual tokens and responsive/accessibility behavior.
- Removal of the legacy homepage locale state and personal-homepage route during atomic cutover.
- Static artifact verification for normal and GitHub Pages base-path builds.
- Documentation and active-plan progress updates in every implementation PR.

## Non-goals

- Full homepage sections below `HOME-HERO`.
- Projects, project-detail, Studio landing, Privacy, or localized Not Found routes.
- Service-specific fragment identifiers or individual service routes.
- A functional inquiry form, form provider, privacy policy, consent flow, or retention policy.
- Complete site navigation to routes that do not yet exist.
- Project-evidence classification or publication decisions.
- Custom logo symbol, founder photograph, redesigned CV, dark theme, complete design system, or motion beyond control-state transitions.
- Canonical-domain selection, absolute locale alternates, sitemap language alternates, or whole-site metadata redesign.
- CMS, backend, authentication, runtime locale negotiation, or long-term hosting migration.

## File responsibility map

| Area | Planned responsibility |
| --- | --- |
| `lib/locales.ts` | Existing locale type retained for migration compatibility |
| `lib/site-routes.ts` | Foundation route IDs, locale-to-path map, and route lookup |
| `lib/foundation-navigation.ts` | Route-boundary adapter from locale/current route to resolved foundation links and equivalent-language destination |
| `app/(es)/_content/*.ts` | Spanish route-owned Home, Services, Contact, and Founder content |
| `app/(en)/en/_content/*.ts` | English route-owned Home, Services, Contact, and Founder content |
| `components/foundation/content-types.ts` | Typed view models consumed by route content and shared components |
| `components/foundation/SiteHeader.tsx` | Semantic working-route navigation and language-switch placement |
| `components/foundation/SiteFooter.tsx` | Minimal approved Founder/contact reachability without final footer design |
| `components/foundation/LanguageSwitch.tsx` | Link-based equivalent-route navigation; no locale state |
| `components/foundation/HomeHero.tsx` | Shared semantic hero markup and approved action hierarchy |
| `components/foundation/MinimumDestination.tsx` | Shared accessible structure for minimum Services and Contact content |
| `components/foundation/FounderProfile.tsx` | Shared localized Founder content structure |
| `app/(es)/**/page.tsx`, `app/(en)/en/**/page.tsx` | Server Component route ownership and semantic route identity |
| `app/(es)/layout.tsx`, `app/(en)/layout.tsx` | Locale document language, shared font/global styles, and approved-safe metadata defaults |
| `scripts/site-routes.test.mjs` | Route-contract completeness and equivalence tests |
| `scripts/foundation-content.test.mjs` | Content-contract and founder-migration invariant tests |
| `scripts/verify-static-export.mjs` | Eight-route artifact, language, and base-path verification after build |
| `tailwind.config.ts`, `app/globals.css` | Approved foundation tokens, reflow, focus, and reduced-motion behavior |

## Pull Request sequence

| PR | Objective | Depends on | Public behavior |
| --- | --- | --- | --- |
| 1. Typed route and navigation contract | Establish accepted route equivalence and consume it through a tested route-boundary link adapter | This ADR/plan PR merged | None |
| 2. Foundation content and migration inputs | Materialize approved localized content and verified founder facts/assets behind typed contracts | PR 1 | None |
| 3. Atomic localized foundation cutover | Publish both locale trees, all minimum destinations, Founder profiles, shared navigation, and `HOME-HERO`; retire the legacy homepage locale behavior | PRs 1–2 | Replaces the public homepage atomically |
| 4. Post-cutover cleanup and completion | Remove only proven-unused localization/runtime code, complete final regression/visual checks, and close the plan | PR 3 | No intended behavior change |

## Implementation phases

### Task 1 / PR 1: Add the typed foundation route and navigation contract

**Objective:** Make the four approved page-equivalence pairs executable and consume them through the narrow route-boundary link adapter required by later localized pages, without exposing routes or changing the current homepage.

**Requirements implemented:** `IA-SITE` localization behavior and the route-equivalence portion of `ADR-STATIC-LOCALIZED-ROUTING`.

**Dependencies:** This ADR/plan PR is merged; no implementation PR or unresolved product decision is required.

**Files:**

- Create: `lib/site-routes.ts`
- Create: `lib/foundation-navigation.ts`
- Create: `scripts/site-routes.test.mjs`
- Modify: `docs/plans/active/homepage-foundation.md`

**Interfaces:**

- Consumes: `Locale` from `lib/locales.ts`.
- Produces: `foundationRouteIds`, `FoundationRouteId`, `foundationRoutes`, and `getFoundationPath(routeId, locale)`.
- Produces: `FoundationNavigationPaths` and `getFoundationNavigationPaths(locale, currentRouteId)`, which consume the route map and return resolved Home, Services, Contact, Founder, and equivalent-language hrefs.
- Produces exact pairs for `home`, `services`, `contact`, and `founder`; later route boundaries consume the adapter and pass its resolved hrefs to shared navigation components.

- [x] **Step 1: Write the failing route-contract test**

  Add `scripts/site-routes.test.mjs` using `node:test` and `node:assert/strict`. Dynamically import `../lib/site-routes.ts` for the route contract and `../lib/foundation-navigation.ts` for the adapter, then assert:

  - route IDs are exactly `home`, `services`, `contact`, and `founder`;
  - every ID has exactly one `es` and one `en` path;
  - paths equal the eight public routes in `IA-SITE`;
  - all eight public paths are unique;
  - every non-root path ends in `/`;
  - `getFoundationPath` returns the paired destination for both locales;
  - `getFoundationNavigationPaths` returns the active locale's four working hrefs and the opposite locale's equivalent href for every current route ID.

- [x] **Step 2: Run the focused test and observe RED**

  Run `node --test scripts/site-routes.test.mjs`.

  Expected: failure because `lib/site-routes.ts` does not exist.

- [x] **Step 3: Implement the minimal typed route map**

  Create `lib/site-routes.ts` with this public shape:

  ```ts
  import type { Locale } from './locales';

  export const foundationRouteIds = [
    'home',
    'services',
    'contact',
    'founder'
  ] as const;

  export type FoundationRouteId = (typeof foundationRouteIds)[number];

  export const foundationRoutes = {
    home: { es: '/', en: '/en/' },
    services: { es: '/servicios/', en: '/en/services/' },
    contact: { es: '/contacto/', en: '/en/contact/' },
    founder: {
      es: '/estudio/samuel-furlanich/',
      en: '/en/about/samuel-furlanich/'
    }
  } as const satisfies Record<FoundationRouteId, Record<Locale, string>>;

  export function getFoundationPath(
    routeId: FoundationRouteId,
    locale: Locale
  ): string {
    return foundationRoutes[routeId][locale];
  }
  ```

- [x] **Step 4: Add and exercise the route-boundary consumer**

  Create `lib/foundation-navigation.ts`. Its `FoundationNavigationPaths` type contains `home`, `services`, `contact`, `founder`, `alternateLocale`, and `alternateHref`. Implement `getFoundationNavigationPaths(locale, currentRouteId)` exclusively through `getFoundationPath`; it must not parse pathnames or duplicate public route strings.

  Extend the focused test across both locales and all four current route IDs. This adapter is the immediate non-public application consumer of the route map and the exact seam that PR 3 route entry points will use. Do not add a generic route builder, arbitrary locale registry, or future-page support.

- [x] **Step 5: Verify the contract**

  Run:

  ```powershell
  node --test scripts/site-routes.test.mjs
  npm run typecheck
  npm run docs:check
  ```

  Expected: the focused route test, TypeScript, and documentation checks pass. A Node module-type notice is acceptable only if it is identified as a notice rather than hidden; do not add a dependency or change the package module type solely to silence it.

- [x] **Step 6: Update plan progress and commit**

  Record the PR number, validation evidence, and any deviation in this plan, then commit only the four scoped files with `feat: add localized route contract`.

**Validation:** Focused route test, `npm test`, `npm run typecheck`, `npm run docs:check`, and `git diff --check`.

**Rollout/migration:** No public route or bundle changes. Revert by removing the contract and test.

**Non-goals:** Public route files, rendered components, localized page content, styling, metadata, or deletion of legacy localization.

### Task 2 / PR 2: Materialize route-owned content and founder migration inputs

**Objective:** Turn the already-approved minimum copy and founder facts into typed locale-specific modules, verify migration-critical assets/links, and keep them non-public until atomic cutover.

**Requirements implemented:** `PAGE-HOME`, the minimum destinations in `PAGE-SERVICES`, `PAGE-CONTACT`, and `PAGE-FOUNDER`, plus the `PORTFOLIO-MIGRATION` integration gate.

**Dependencies:** Task 1 / PR 1 is merged so content actions can reference the accepted typed route contract.

**Files:**

- Create: `components/foundation/content-types.ts`
- Create: `app/(es)/_content/home.ts`
- Create: `app/(es)/_content/services.ts`
- Create: `app/(es)/_content/contact.ts`
- Create: `app/(es)/_content/founder.ts`
- Create: `app/(en)/en/_content/home.ts`
- Create: `app/(en)/en/_content/services.ts`
- Create: `app/(en)/en/_content/contact.ts`
- Create: `app/(en)/en/_content/founder.ts`
- Create: `scripts/foundation-content.test.mjs`
- Modify: `docs/plans/active/homepage-foundation.md`

**Interfaces:**

- Consumes: `FoundationRouteId` and `getFoundationPath` from PR 1.
- Produces: `HomeHeroContent`, `ServicesContent`, `ContactContent`, `FounderContent`, and shared `ActionLink` view-model types.
- Produces one typed content export per route and locale; PR 3 route entry points import exactly one matching export.

- [x] **Step 1: Write failing content-contract tests**

  Assert that every locale module exports the required view-model shape, every internal action references a semantic foundation route ID, Contact modules expose only the approved working WhatsApp/email/phone actions, and Founder modules include biography, concise experience, education, capabilities, CV path, LinkedIn, GitHub, and Contact route ID. Assert that no string contains `coming soon` or an absolute canonical URL.

- [x] **Step 2: Run the focused content test and observe RED**

  Run `node --test scripts/foundation-content.test.mjs`.

  Expected: failure because the typed content modules do not exist.

- [x] **Step 3: Define narrow view-model contracts**

  Define only fields consumed by the approved foundation components. Keep external URLs and the raw CV path distinct from internal semantic route IDs. Do not add project-card, form, image, CMS, or full-site navigation models.

- [x] **Step 4: Add route-owned Spanish and English modules**

  Copy exact public copy from the owning page-spec sections linked in this plan; do not restate or reinterpret it in the plan. Keep Clever Soft SA inside the approved biographies only. Correct the current portfolio's freelance/education facts in the new Founder modules without modifying legacy JSON yet.

- [x] **Step 5: Verify migration-critical assets and destinations**

  Confirm `public/Samuel-Furlanich-CV.pdf` exists and opens as a PDF. Exercise the configured LinkedIn and GitHub URLs in a browser and record whether each resolves to the intended public profile. Verify the approved `mailto:`, `tel:+5491150117565`, and `https://wa.me/5491150117565` values exactly against `PAGE-CONTACT`.

  A missing CV or professional profile is an integration blocker for PR 3. Record the failure; do not replace or invent a URL.

- [x] **Step 6: Verify content and commit**

  Run:

  ```powershell
  node --test scripts/foundation-content.test.mjs
  npm test
  npm run typecheck
  npm run docs:check
  git diff --check
  ```

  Update plan progress with verification evidence and commit the scoped modules/tests with `feat: add homepage foundation content`.

**Validation:** Content-contract tests, full Node tests, typecheck, documentation check, local CV inspection, and browser verification of professional links.

**Rollout/migration:** Route-private files without `page.tsx` do not publish new URLs. Revert without affecting the current homepage.

**Non-goals:** Rendering pages, changing legacy JSON, enabling the contact form, publishing project evidence, or adding metadata.

### Task 3 / PR 3: Perform the atomic localized foundation cutover

**Objective:** Publish a coherent, usable bilingual foundation and replace the personal homepage only after every destination and preservation gate passes.

**Requirements implemented:** All authorities in the requirements table, `RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY`, and the complete cutover portion of `ADR-STATIC-LOCALIZED-ROUTING`.

**Dependencies:** Tasks 1–2 are merged; the CV and professional-profile checks pass; both locale content sets satisfy their contracts.

**Files:**

- Create: `app/(es)/layout.tsx`
- Create: `app/(es)/page.tsx`
- Create: `app/(es)/servicios/page.tsx`
- Create: `app/(es)/contacto/page.tsx`
- Create: `app/(es)/estudio/samuel-furlanich/page.tsx`
- Create: `app/(en)/layout.tsx`
- Create: `app/(en)/en/page.tsx`
- Create: `app/(en)/en/services/page.tsx`
- Create: `app/(en)/en/contact/page.tsx`
- Create: `app/(en)/en/about/samuel-furlanich/page.tsx`
- Create: `components/foundation/SiteHeader.tsx`
- Create: `components/foundation/SiteFooter.tsx`
- Create: `components/foundation/LanguageSwitch.tsx`
- Create: `components/foundation/HomeHero.tsx`
- Create: `components/foundation/MinimumDestination.tsx`
- Create: `components/foundation/FounderProfile.tsx`
- Create: `scripts/verify-static-export.mjs`
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Delete: `app/layout.tsx`
- Delete: `app/page.tsx`
- Modify: `ARCHITECTURE.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Modify: `docs/plans/active/homepage-foundation.md`

**Interfaces:**

- Consumes: route/navigation contract from PR 1 and route-owned content from PR 2.
- Produces: the eight static public routes, correct initial document languages, working equivalent-language links, shared semantic components, and a post-build artifact verifier.
- Route entry points call `getFoundationNavigationPaths`; `SiteHeader`, `SiteFooter`, and `LanguageSwitch` receive localized labels and resolved paths and never parse `window.location`.
- Each page route supplies its own semantic route ID and one locale's content to shared components.

- [ ] **Step 1: Extend tests for component and artifact contracts**

  Add source-level assertions that each of the eight route entry files supplies the correct semantic route ID and imports only its own locale content. Create `scripts/verify-static-export.mjs` to fail unless the eight expected `out/**/index.html` files exist and contain the correct `<html lang>`. When `NEXT_PUBLIC_BASE_PATH` is set, also fail on duplicated base-path prefixes in internal asset/link output.

- [ ] **Step 2: Run focused checks and observe RED**

  Run the route/content tests and `node scripts/verify-static-export.mjs`.

  Expected: route-entry and artifact checks fail because the localized routes have not been created.

- [ ] **Step 3: Build shared semantic components**

  Implement semantic landmarks and links using typed props. The header exposes only working foundation navigation plus the exact `FURLANICH` wordmark and language switch. The minimal footer provides the approved Founder and contact/professional reachability without claiming to finalize future footer grouping. Use `next/link` for internal links and `withBasePath` only for the raw CV/favicon assets.

  `HomeHero` renders one H1, approved eyebrow/description/trust/availability copy, and Contact then Services actions in source order. `MinimumDestination` renders useful Services/Contact content rather than placeholders. `FounderProfile` renders every item in the minimum preservation gate and keeps detailed technology secondary.

- [ ] **Step 4: Create both locale layouts and all eight route entries**

  Move the shared Inter/global-style setup into both root layouts, with `lang="es-AR"` and `lang="en"` respectively. Use only approved-safe metadata such as the FURLANICH brand name; remove legacy personal-portfolio metadata and defer unapproved absolute metadata.

  Add every route in one commit-ready diff. Do not expose only one locale, a biography-only Founder page, or a Contact/Services placeholder.

- [ ] **Step 5: Apply the approved visual and responsive baseline**

  Replace legacy token use on foundation components with the exact Canvas, Surface, Ink, Muted ink, Action blue, Action blue strong, Action tint, and Border values from `DESIGN-VISUAL`. Implement the approved container, gutters, hero measures/padding, CTA sizing/order, focus ring, compact/medium/wide typography, `480px` CTA stacking rule, and `320px` no-overflow requirement.

  Add no entrance reveal, parallax, hidden initial content, or control translation/scale. Restrict optional color/background/border transitions to `160ms ease-out` and remove nonessential transitions under reduced motion.

- [ ] **Step 6: Remove the legacy route behavior atomically**

  Delete the top-level legacy `app/layout.tsx` and `app/page.tsx` only after both locale trees compile. Confirm no active route imports both message bundles, holds locale in React state, mutates `document.documentElement.lang`, or wraps the page in the legacy provider.

  Keep legacy data/assets needed for later project-history work. Do not delete unclassified project records as part of the foundation cutover.

- [ ] **Step 7: Verify both static-export modes**

  Run:

  ```powershell
  npm run validate
  node scripts/verify-static-export.mjs
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  node scripts/verify-static-export.mjs
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  ```

  Expected: all deterministic checks pass; all eight artifacts exist in both builds; each document language is correct; internal links/assets have zero missing or double base-path prefixes.

- [ ] **Step 8: Perform visual and interaction QA**

  Use the repository `visual-qa` Skill. Inspect `/`, `/en/`, both Services, both Contact, and both Founder routes at `320×800`, `375×812`, `768×1024`, `1024×768`, and `1440×900` where relevant.

  Verify hierarchy, wrapping, overflow, CTA order, target sizes, visible focus, keyboard traversal, language switching on all four semantic route pairs, CV and professional/contact actions, JavaScript-disabled hero completeness, reduced-motion behavior, and browser-console errors. Repeat the matrix under the served `/Portfolio` base path. Capture evidence supported by the tool and record any unavailable checks honestly.

- [ ] **Step 9: Confirm migration and rollback gates**

  Compare every minimum Founder item with `PAGE-FOUNDER` and `PORTFOLIO-MIGRATION`. Confirm current CV and professional links still work, legacy source material remains in Git, both CTA destinations are useful, and reverting this single PR returns the prior personal homepage.

- [ ] **Step 10: Synchronize current-system records and commit**

  Update current architecture facts only after the rendered cutover exists. Record exact validation and visual evidence in this plan. Commit the coherent integration with `feat: launch localized homepage foundation`.

**Validation:** Full `npm run validate`, normal/base-path artifact verification, route/link checks, all required visual-QA viewports and states, founder preservation audit, and complete diff review.

**Rollout/migration:** This is the only behavior-changing cutover. Merge only after every integration gate passes; the PR is the rollback unit.

**Non-goals:** Remaining homepage sections, Projects/Studio/Privacy/Not Found routes, form submission, final footer/navigation breadth, canonicals, or long-term hosting.

### Task 4 / PR 4: Remove proven-unused legacy localization and complete the plan

**Objective:** Finish the migration without bundling speculative cleanup into the cutover.

**Requirements implemented:** Legacy-localization retirement from `ADR-STATIC-LOCALIZED-ROUTING` and final verification of all foundation acceptance criteria.

**Dependencies:** Task 3 / PR 3 is merged and the public foundation is stable enough to prove which legacy consumers are dead.

**Files:**

- Delete or modify only files proven unreachable by repository search after PR 3, potentially including `components/layout/LanguageSwitch.tsx`, legacy locale-dependent section components, `lib/i18n.ts`, and `locales/**`
- Modify: `package.json` and `package-lock.json` only if `next-intl` has no remaining consumer
- Modify: `ARCHITECTURE.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Move: `docs/plans/active/homepage-foundation.md` to `docs/plans/completed/homepage-foundation.md`
- Modify: `docs/plans/index.md`

**Interfaces:**

- Consumes: the deployed source state from PR 3.
- Produces: no intended UI behavior change; removes only dead locale/runtime paths and records completed execution history.

- [ ] **Step 1: Prove each cleanup target is unused**

  Run `rg -n "next-intl|NextIntlClientProvider|useTranslations|onLocaleChange|document\.documentElement\.lang|messagesByLocale|getLocalizedString" app components lib locales` and trace every result. Delete a file or dependency only when no active route or retained component needs it.

- [ ] **Step 2: Remove obsolete runtime localization**

  Remove the old stateful language switch, combined message catalogs, and `next-intl` dependency only when the search proves the last consumer is gone. Preserve legacy content JSON, project assets, and any component still required for later founder/project migration.

- [ ] **Step 3: Rerun the complete deterministic and visual regression gates**

  Run normal and `/Portfolio` builds, the static-export verifier, route/content tests, full `npm run validate`, and a focused browser regression of every language pair, CTA, Founder link, CV, keyboard path, and `320px` layout.

- [ ] **Step 4: Perform final plan self-review**

  Map each authority in the requirements table to implemented files and evidence. Search for placeholders, stale legacy localization, broken internal links, accidental canonicals, deleted founder/project material, unnecessary dependencies, and OPEN decisions treated as resolved.

- [ ] **Step 5: Complete the plan and commit**

  Record PR numbers, exact validation results, warnings, visual evidence, deviations, and residual release blockers. Set `plan_status: COMPLETED`, move the file to `completed/`, update the plan index, and commit with `docs: complete homepage foundation plan`.

**Validation:** Search-based dead-code proof, full deterministic gates in both path modes, focused visual regression, documentation integrity, and final `main...HEAD` review.

**Rollout/migration:** Cleanup is independently revertible after the cutover. If removing a dependency changes behavior, return it to PR 3 validation rather than treating it as cleanup.

**Non-goals:** Deleting preserved project/founder source data, implementing deferred routes/features, or resolving release blockers.

## Expected affected areas

- App Router files under `app/`.
- New foundation components and typed route/content modules.
- Existing global/Tailwind styling.
- Static-export verification and Node tests.
- Legacy localization components, messages, and dependencies only after replacement.
- Architecture/current-system records and this execution plan.

## Validation

Every implementation PR runs its focused tests, `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` as applicable. PR 3 and final completion additionally require:

- ordinary and `NEXT_PUBLIC_BASE_PATH=/Portfolio` static builds;
- eight exported route artifacts with correct document languages;
- exact semantic language-route equivalence and working CTA links;
- browser QA at the specified compact, medium, and wide viewports;
- keyboard, visible-focus, no-JavaScript, and reduced-motion checks;
- CV, LinkedIn, GitHub, WhatsApp, email, and phone verification;
- a migration audit showing no required founder content was lost.

Visual QA is evidence, not product approval, and never substitutes for deterministic checks.

## Risks

- The atomic cutover PR is larger than the preparatory PRs because separate locale-root layouts cannot be safely published piecemeal.
- Route-private content may drift before integration; typed tests and immediate consumption in the next PR constrain that window.
- A full-document language switch resets client state. The approved foundation routes contain no state that must survive it.
- Manual raw-asset prefixing can duplicate `basePath`; artifact verification must cover both build modes.
- Legacy `next-intl` code can become permanent unless Task 4 proves and removes its final consumers.
- Founder links or the current CV may fail external verification and block the cutover without reopening the routing decision.
- The minimum header/footer intentionally omits unavailable full-site destinations; later route expansion must follow `IA-SITE` without converting this slice into the complete site.

## Deferred release and future concerns

- Production canonical origin and absolute metadata alternates.
- Contact-form provider, privacy notice, consent, retention, and data-processing disclosures.
- Long-term hosting.
- Complete site page set, full homepage, project evidence, service fragments, and localized 404.
- Extended design system, imagery, photography, dark theme, and broader motion.
- Whole-site accessibility conformance claims and performance budgets.

These remain OPEN in their owning records and do not block implementation of this plan.

## First implementation task

After this ADR/plan PR is merged, execute exactly **Task 1 / PR 1: Add the typed foundation route and navigation contract**.

Acceptance criteria:

- `lib/site-routes.ts` exports the four semantic route IDs, eight exact approved paths, and typed lookup function;
- `lib/foundation-navigation.ts` consumes that map and returns the complete resolved link set plus the current page's equivalent-language destination;
- `scripts/site-routes.test.mjs` proves completeness, uniqueness, trailing slashes, Spanish/English equivalence, and adapter output for every locale/route combination;
- the current `/` output and client locale behavior are unchanged;
- no component, route, content, styling, metadata, dependency, build, or deployment change is included;
- focused tests, full Node tests, typecheck, documentation validation, and diff checks pass.

This task has complete authority from `IA-SITE` and `ADR-STATIC-LOCALIZED-ROUTING`, occupies the earliest dependency position, and is independently reviewable and revertible. The map is not a speculative standalone abstraction: the same PR adds and tests its narrowly scoped route-boundary consumer, and PR 3 uses that consumer unchanged.

## Progress

- 2026-09-04: Governance PR #6 merged; static localized routing received human approval.
- 2026-09-04: `ADR-STATIC-LOCALIZED-ROUTING` and this execution plan created on `codex/homepage-foundation-execution-plan`.
- 2026-09-04: Task 1 / PR 1 implemented on `codex/homepage-foundation-execution-plan`; `node --test scripts/site-routes.test.mjs` passed (3/3), `npm test` passed (14/14), `npm run typecheck` passed, `npm run docs:check` passed, and `git diff --check` passed. Node emitted the allowed `MODULE_TYPELESS_PACKAGE_JSON` notice; no module-type change was made. PR #8 is open against `main` and remains pending human review; merge authority is intentionally retained by the project owner.
- 2026-09-04: Task 2 / PR 2 content modules and contracts implemented on `codex/homepage-foundation-content`; focused content tests passed (5/5), CV verification passed via PDF signature and `pdfinfo`, GitHub returned HTTP 200, and LinkedIn verification was blocked by HTTP 403/999 plus browser cache misses. LinkedIn remains an integration blocker for PR 3; the configured URL was not changed or replaced.
- 2026-09-04: Project owner supplied the verifiable LinkedIn destination https://www.linkedin.com/in/samuel-furlanich/; both Task 2 Founder modules, the retained legacy about record, and the content contract were synchronized. The desktop browser helper remains unavailable, so interactive browser verification is still unverified pending environment recovery.

- 2026-09-04: Task 3 / PR 3 cutover implemented on codex/homepage-foundation-cutover; normal and /Portfolio static builds and artifact verification passed, the eight-route five-viewport matrix passed with no horizontal overflow, language switching and keyboard focus passed, JavaScript-disabled and reduced-motion checks passed, and axe-core reported zero violations on all eight routes. The supplied LinkedIn URL reached LinkedIn authwall in agent-browser for anonymous sessions; the owner-provided verifiable destination is preserved unchanged. Commit b858d25 is pushed and PR #10 is open against main for human review.

## Important implementation decisions

- Use one ADR for the durable localized-routing architecture; keep the homepage boundary as delivery authority rather than manufacture a second ADR.
- Use two behavior-neutral preparatory PRs followed by one atomic route cutover and one evidence-driven cleanup PR.
- Keep direct-channel Contact pages functional without enabling an unapproved form.
- Preserve legacy project/founder source material through the foundation migration.
- Treat canonical-domain and form/privacy work as release concerns rather than implementation blockers.

## Deviations discovered during execution

The adapter's runtime import uses the explicit `.ts` extension so Node 24 can execute the focused TypeScript contract test; a local `@ts-expect-error` documents the bundler/typecheck incompatibility without changing compiler configuration or package metadata.
