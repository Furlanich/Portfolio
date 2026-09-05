---
id: PLAN-HOMEPAGE-COMPLETION
type: execution-plan
status: APPROVED
plan_status: COMPLETED
related:
  - ADR-STATIC-LOCALIZED-ROUTING
  - PLAN-HOMEPAGE-FOUNDATION
  - IA-SITE
  - CONTENT-LOCALIZATION
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-CONTACT
  - PAGE-FOUNDER
  - PROJECT-EVIDENCE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-05
---

# Homepage Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Use the repository `visual-qa` Skill for the rendered integration task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the bilingual commercial FURLANICH homepage below `HOME-HERO` with all seven approved sections and the evidence-safe launch version of `HOME-PROOF`.

**Architecture:** Extend the accepted localized static foundation without changing its architecture. Spanish and English route-owned content satisfy a shared typed homepage model; shared locale-agnostic Server Components render one semantic narrative; the existing route adapter owns internal page destinations and the localized Process anchor.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Node 24 contract tests, static export, and GitHub Pages with optional build-time `basePath`.

**Spec:** [`PAGE-HOME`](../../product/pages/home.md), [`PROJECT-EVIDENCE`](../../product/project-evidence.md), [`DESIGN-VISUAL`](../../design/visual-language.md#commercial-homepage-section-baseline-approved), [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#commercial-homepage-section-baseline-approved), and [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md).

## Global Constraints

- Preserve the exact narrative order: `HOME-HERO`, `HOME-PROBLEMS`, `HOME-SERVICES`, `HOME-AUDIENCES`, `HOME-PROOF`, `HOME-PROCESS`, `HOME-FOUNDER`, `HOME-CTA`.
- Copy the exact approved Spanish and English public copy from [`PAGE-HOME`](../../product/pages/home.md); do not create a third copy owner in this plan or in components.
- Implement only the approved credibility-fallback version of `HOME-PROOF`. Do not add project cards, client names, screenshots, metrics, testimonials, maturity badges, or Projects links.
- Preserve explicit Spanish-root and English-`/en/` routing, Server Components by default, static export, trailing slashes, optional `NEXT_PUBLIC_BASE_PATH`, and the current GitHub Pages deployment.
- Route-owned localized modules own public copy. Shared components receive typed content and resolved destinations and contain no locale branching or public prose.
- Add the Process anchor to the existing navigation adapter as an in-page destination, not as a new `FoundationRouteId` or public route.
- Reuse the approved foundation palette, typography, container, gutters, action styles, focus treatment, and reduced-motion behavior. Add no dependency, token family, full design system, client runtime, or animation library usage.
- Use one `main`, preserve the existing H1, render each new section with one visible H2 and stable labelled-section semantics, use list semantics for peer cards, and use an ordered list for Process.
- Do not turn informational cards into links or focus targets. Only actual actions receive hover, focus, and keyboard behavior.
- Do not enable a contact form, privacy flow, new imagery, new metadata origin, new hosting, service fragments, or unimplemented Projects/Studio routes.
- Every implementation PR requires focused tests, documentation validation, TypeScript checking, diff review, and human review before merge. The rendered integration additionally requires the full deterministic and visual/accessibility gates below.

---

## Objective

Publish the approved commercial narrative below the existing hero in both languages, including problem recognition, services, audience fit, honest credibility, process, founder accountability, and a final inquiry path. The work must remain truthful when no project currently passes the publication gates.

## Requirements implemented

| Authority | Implementation responsibility |
| --- | --- |
| [`PAGE-HOME`](../../product/pages/home.md) | Exact section order, bilingual copy, CTA hierarchy, evidence boundaries, conversion narrative, and page-level acceptance criteria |
| [`IA-SITE`](../../product/information-architecture.md) | Localized Process anchors and working navigation to `/#proceso` and `/en/#process` |
| [`CONTENT-LOCALIZATION`](../../product/content-and-localization.md) | Route-owned `es-AR` and natural English content without runtime locale state |
| [`PAGE-SERVICES`](../../product/pages/services.md) | Existing useful localized Services destinations for Problems and Services actions |
| [`PAGE-CONTACT`](../../product/pages/contact-and-privacy.md) | Existing localized Contact destinations and confirmed WhatsApp action without an unapproved form |
| [`PAGE-FOUNDER`](../../product/pages/studio-and-founder.md) | Existing localized Founder destinations and approved founder facts |
| [`PROJECT-EVIDENCE`](../../product/project-evidence.md#homepage-eligibility-decision) | Fail-closed proof boundary and approved credibility fallback; zero project cards |
| [`DESIGN-VISUAL`](../../design/visual-language.md#commercial-homepage-section-baseline-approved) | Section rhythm, surfaces, hierarchy, card pattern, layouts, and text-led treatments |
| [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#commercial-homepage-section-baseline-approved) | Responsive reflow, semantics, anchors, target sizes, focus, keyboard, no-JavaScript, and reduced-motion behavior |

## Governance classification

**Route:** Versioned execution plan.

The initiative is substantial, multi-file, and requires staged verification, so lightweight in-task planning is insufficient. It does not require a new RFC or ADR: [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md) already accepts locale-owned content, shared locale-agnostic components, typed route resolution, static export, trailing slashes, and optional base-path deployment. The new sections fit those boundaries.

No unresolved consequential architecture remains for this scope. The following are presentation or implementation details within approved owners rather than new architecture: a typed aggregate homepage model, shared section-heading and content-card primitives, one component per semantic section, and a localized in-page anchor helper.

## Affected architecture

The current Spanish and English homepage routes render the shared `HomeHero` from route-owned `homeContent` and receive resolved navigation paths from `getFoundationNavigationPaths`. This plan expands those existing seams:

- each locale's `homeContent` grows from `HomeHeroContent` to a typed aggregate that retains the hero fields and adds seven named section models;
- a narrow `components/homepage/` boundary owns shared semantic section components and two reused presentation primitives;
- `lib/site-routes.ts` owns the two localized Process anchor IDs and their locale-specific homepage hrefs;
- `lib/foundation-navigation.ts` exposes the resolved Process href to the existing header and footer;
- each localized homepage route swaps direct `HomeHero` rendering for one shared `CommercialHomepage` composition while retaining its existing header, footer, locale, and navigation adapter.

There is no change to route trees, locale layouts, rendering mode, dependencies, data source, hosting, deployment, or the accepted component/content ownership model.

## Relevant ADRs

- [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md) remains the sole architectural authority.
- No amendment is required. The plan does not add routes, runtime localization, a CMS, a backend, client-wide state, or a new deployment target.

## Scope

- Typed content contracts for the seven approved later sections and the complete homepage aggregate.
- Exact approved Spanish and English content in the two existing route-owned home modules.
- Localized Process anchor lookup and resolved navigation href.
- Shared semantic components for Problems, Services, Audiences, Proof fallback, Process, Founder, final CTA, and the complete homepage composition.
- Two small reused presentation primitives: a section heading block and a non-interactive content card.
- Existing header and footer access to the now-available Process section.
- Approved responsive, visual, focus, keyboard, semantic, no-JavaScript, and reduced-motion behavior.
- Content, route, static-artifact, and visual/accessibility verification in both languages and both static-export modes.
- Current-system and plan records synchronized after implementation.

## Non-goals

- Project cards or any change to project maturity, disclosure, evidence, or permission state.
- Projects, project-detail, Studio landing, Privacy, or localized Not Found routes.
- A structured inquiry form, provider integration, privacy notice, consent, retention, or data-processing flow.
- Service fragments or individual service routes.
- Founder photography, service illustrations, icons, client logos, decorative motion, dark theme, or a broader design system.
- New tokens, dependencies, CMS, backend, authentication, analytics, or runtime localization.
- Canonical-domain selection, absolute locale alternates, sitemap work, long-term hosting, whole-site accessibility claims, or performance budgets.
- Editing `HOME-HERO` copy or redesigning the approved homepage foundation.

## File responsibility map

| Area | Planned responsibility |
| --- | --- |
| `components/homepage/content-types.ts` | Later-section models and complete `HomePageContent` aggregate |
| `app/(es)/_content/home.ts` | Exact approved Spanish hero and later-section content |
| `app/(en)/en/_content/home.ts` | Exact approved natural-English hero and later-section content |
| `lib/site-routes.ts` | Localized Process anchor IDs and homepage anchor href lookup |
| `lib/foundation-navigation.ts` | Resolved `process` navigation destination alongside existing foundation paths |
| `components/homepage/HomepageSectionHeading.tsx` | Reused visible H2 and optional introduction block |
| `components/homepage/HomepageContentCard.tsx` | Reused non-interactive title/description surface for peer lists |
| `components/homepage/HomeProblems.tsx` | Four problem situations and Services action |
| `components/homepage/HomeServices.tsx` | Three informational service cards and one section action |
| `components/homepage/HomeAudiences.tsx` | Four relevance cards, closing statement, and Contact action |
| `components/homepage/HomeProof.tsx` | One restrained proof-fallback panel, three commitments, and Founder action |
| `components/homepage/HomeProcess.tsx` | Localized anchor, four-step ordered list, quality statement, and Contact action |
| `components/homepage/HomeFounder.tsx` | Text-led founder accountability summary and two actions |
| `components/homepage/HomeCta.tsx` | Final inquiry band, response statement, Contact action, and WhatsApp action |
| `components/homepage/CommercialHomepage.tsx` | Exact eight-section composition, beginning with existing `HomeHero` |
| `components/foundation/SiteHeader.tsx` | Add Process to working primary navigation without exposing unavailable routes |
| `components/foundation/SiteFooter.tsx` | Add Process to the current minimal working-route footer |
| `app/(es)/page.tsx`, `app/(en)/en/page.tsx` | Supply one locale's complete content to the shared homepage composition |
| All eight foundation `page.tsx` route entries | Supply the localized Process label required by the shared header/footer contract |
| `scripts/homepage-content.test.mjs` | Complete bilingual content shape, copy ownership, counts, CTA, and proof-fallback invariants |
| `scripts/site-routes.test.mjs` | Localized Process anchor/href and navigation-adapter contracts |
| `scripts/verify-static-export.mjs` | Rendered section order, anchor, destination, language, and base-path verification |
| `ARCHITECTURE.md`, `docs/architecture/*.md`, `docs/plans/**` | Current implementation facts and completed execution history after integration |

## Public interfaces

Create `components/homepage/content-types.ts` with this public shape. Names are intentionally section-specific so content mistakes fail at the route-owned module boundary:

```ts
import type {
  ActionLink,
  ContactAction,
  HomeHeroContent,
} from '@/components/foundation/content-types';

export type HomepageItem = {
  title: string;
  description: string;
};

export type HomeProblemsContent = {
  heading: string;
  introduction: string;
  situations: HomepageItem[];
  action: ActionLink;
};

export type HomeServicesSectionContent = {
  heading: string;
  introduction: string;
  services: HomepageItem[];
  action: ActionLink;
};

export type HomeAudiencesContent = {
  heading: string;
  audiences: HomepageItem[];
  closing: string;
  action: ActionLink;
};

export type HomeProofContent = {
  heading: string;
  introduction: string;
  commitments: HomepageItem[];
  action: ActionLink;
};

export type HomeProcessContent = {
  heading: string;
  steps: HomepageItem[];
  qualityStatement: string;
  action: ActionLink;
};

export type HomeFounderSectionContent = {
  heading: string;
  biography: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
};

export type HomeCtaContent = {
  heading: string;
  description: string;
  responseStatement: string;
  primaryAction: ActionLink;
  secondaryAction: ContactAction;
};

export type HomePageContent = HomeHeroContent & {
  problems: HomeProblemsContent;
  servicesSection: HomeServicesSectionContent;
  audiences: HomeAudiencesContent;
  proof: HomeProofContent;
  process: HomeProcessContent;
  founderSection: HomeFounderSectionContent;
  cta: HomeCtaContent;
};
```

Extend the route helper without adding an addressable page route:

```ts
export const homeProcessAnchors = {
  es: 'proceso',
  en: 'process',
} as const satisfies Record<Locale, string>;

export function getHomeProcessHref(locale: Locale): string {
  return `${getFoundationPath('home', locale)}#${homeProcessAnchors[locale]}`;
}
```

`FoundationNavigationPaths` adds one field, `process: string`, resolved exclusively through `getHomeProcessHref(locale)`. Existing route IDs and route pairs remain unchanged.

The two route-owned content modules keep the existing hero fields at the top level and change their type assertion to `satisfies HomePageContent`. Components read content through typed props; they do not reproduce approved copy.

## Pull Request sequence

| PR | Objective | Depends on | Public behavior |
| --- | --- | --- | --- |
| 1. Complete homepage content and anchor contracts | Materialize all approved bilingual content behind typed contracts and add a tested localized Process destination | This plan merged | None; current routes still render only the existing hero |
| 2. Integrate the complete commercial homepage | Render all seven sections atomically, expose Process navigation, verify both languages/export modes, and complete this plan | PR 1 | Publishes the complete approved homepage |

## Implementation phases

### Task 1 / PR 1: Add complete homepage content and anchor contracts

**Objective:** Make every approved later-section decision executable and testable without changing the rendered homepage.

**Requirements implemented:** Bilingual content and CTA decisions from `PAGE-HOME`; proof-fallback boundary from `PROJECT-EVIDENCE`; Process anchors from `IA-SITE` and `DESIGN-IX-A11Y`.

**Dependencies:** This plan is merged. No evidence, design, or architecture decision remains outstanding for the approved fallback.

**Files:**

- Create: `components/homepage/content-types.ts`
- Create: `scripts/homepage-content.test.mjs`
- Modify: `app/(es)/_content/home.ts`
- Modify: `app/(en)/en/_content/home.ts`
- Modify: `lib/site-routes.ts`
- Modify: `lib/foundation-navigation.ts`
- Modify: `scripts/site-routes.test.mjs`
- Modify: `docs/plans/active/homepage-completion.md`

**Interfaces:** The public shapes and Process helper are defined above. Existing consumers of `HomeHeroContent` and `FoundationNavigationPaths` remain source-compatible; no component reads the added section data in this PR.

- [x] **Step 1: Write failing complete-content contracts**

  Create `scripts/homepage-content.test.mjs` with `node:test` and `node:assert/strict`. Import both route-owned home modules and assert that each satisfies these runtime invariants:

  - the seven named section objects exist in addition to every existing hero field;
  - item counts are exactly Problems 4, Services 3, Audiences 4, Proof commitments 3, and Process steps 4;
  - every peer item contains non-empty `title` and `description` strings;
  - CTA route IDs match `PAGE-HOME`: Problems/Services to Services, Audiences/Process/final primary to Contact, Proof to Founder, and Founder primary/secondary to Contact/Founder;
  - the final secondary action is the approved `whatsapp` action and exact confirmed destination;
  - section headings and CTA labels match their owning `PAGE-HOME` sections, including voseo and approved natural adaptations;
  - Services exposes one section action and no per-card action;
  - Proof exposes commitments only and contains no project/card collection, client identity, metric, screenshot, logo, testimonial, maturity badge, or Projects action;
  - no internal action contains a handwritten `href`.

  Extend `scripts/site-routes.test.mjs` to require `homeProcessAnchors`, `getHomeProcessHref`, and `FoundationNavigationPaths.process`, while asserting `foundationRouteIds` remains exactly the existing four page routes.

- [x] **Step 2: Run the focused tests and observe RED**

  Run:

  ```powershell
  node --test scripts/homepage-content.test.mjs scripts/site-routes.test.mjs
  ```

  Expected: failures because the later-section model/content, Process anchor map, and `process` navigation path do not yet exist. Record the failing assertions in this plan before implementation.

- [x] **Step 3: Add the minimum typed content model**

  Create `components/homepage/content-types.ts` with the exact public interfaces above. Reuse `ActionLink`, `ContactAction`, and `HomeHeroContent`; do not create another route type or generic CMS schema.

  Run `npm run typecheck`. Expected: the new type module passes, while the focused content test remains RED because the route-owned modules are incomplete.

- [x] **Step 4: Materialize the approved bilingual content**

  Expand the Spanish and English home content modules with the exact approved copy from their respective `PAGE-HOME` sections and assert each object `satisfies HomePageContent`. Preserve current hero fields byte-for-byte unless the owning page spec has changed through governance. Perform a side-by-side review against the owner for every public field; do not duplicate every paragraph into the test fixture.

  Represent every internal CTA as an `ActionLink` semantic route ID. Represent the final WhatsApp action as a `ContactAction` with `kind: 'whatsapp'`. Do not add optional project data or empty placeholder arrays.

- [x] **Step 5: Add the localized Process destination**

  Add `homeProcessAnchors` and `getHomeProcessHref(locale)` to `lib/site-routes.ts`. Add `process` to `FoundationNavigationPaths` and resolve it in `getFoundationNavigationPaths`.

  Keep `foundationRouteIds` and `foundationRoutes` unchanged because Process is a homepage section, not a page route. Components and route entries must not concatenate these anchor strings themselves.

- [x] **Step 6: Make focused and repository contracts GREEN**

  Run:

  ```powershell
  node --test scripts/homepage-content.test.mjs scripts/site-routes.test.mjs scripts/foundation-content.test.mjs
  npm test
  npm run typecheck
  npm run docs:check
  git diff --check
  ```

  Expected: all commands pass. Confirm the existing homepage HTML remains unchanged by reviewing the diff: no `page.tsx`, component, global style, Tailwind, dependency, build, or deployment file belongs in PR 1.

- [x] **Step 7: Review and commit PR 1**

  Update this plan's Progress section with exact test counts and warnings. Review `main...HEAD` for unapproved claims, duplicated public copy outside route-owned modules, raw internal paths, and accidental rendering changes. Commit the scoped change with `feat: add complete homepage content contracts`, push the branch, and open a human-reviewed PR without merging it.

**Validation:** Focused content/route/foundation tests, complete Node suite, typecheck, documentation check, diff check, and behavior-neutral diff inspection.

**Rollout/migration:** No public behavior changes. Revert the PR to remove only unused preparatory contracts/content.

### Task 2 / PR 2: Integrate and verify the complete commercial homepage

**Objective:** Publish all seven approved later sections in both languages as one coherent narrative and close the execution plan.

**Requirements implemented:** Complete `PAGE-HOME` acceptance criteria, commercial homepage design/accessibility baselines, working Process navigation, and the approved `PROJECT-EVIDENCE` fallback.

**Dependencies:** Task 1 is merged and its bilingual content/anchor contracts remain GREEN.

**Files:**

- Create: `components/homepage/HomepageSectionHeading.tsx`
- Create: `components/homepage/HomepageContentCard.tsx`
- Create: `components/homepage/HomeProblems.tsx`
- Create: `components/homepage/HomeServices.tsx`
- Create: `components/homepage/HomeAudiences.tsx`
- Create: `components/homepage/HomeProof.tsx`
- Create: `components/homepage/HomeProcess.tsx`
- Create: `components/homepage/HomeFounder.tsx`
- Create: `components/homepage/HomeCta.tsx`
- Create: `components/homepage/CommercialHomepage.tsx`
- Modify: `components/foundation/SiteHeader.tsx`
- Modify: `components/foundation/SiteFooter.tsx`
- Modify: `app/(es)/page.tsx`
- Modify: `app/(es)/servicios/page.tsx`
- Modify: `app/(es)/contacto/page.tsx`
- Modify: `app/(es)/estudio/samuel-furlanich/page.tsx`
- Modify: `app/(en)/en/page.tsx`
- Modify: `app/(en)/en/services/page.tsx`
- Modify: `app/(en)/en/contact/page.tsx`
- Modify: `app/(en)/en/about/samuel-furlanich/page.tsx`
- Modify: `scripts/verify-static-export.mjs`
- Modify only if implementation evidence requires it: `scripts/homepage-content.test.mjs`, `scripts/site-routes.test.mjs`
- Modify: `ARCHITECTURE.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Move: `docs/plans/active/homepage-completion.md` to `docs/plans/completed/homepage-completion.md`
- Modify: `docs/plans/index.md`
- Modify: `docs/index.md`
- Modify: `docs/governance/status-register.md`

**Interfaces:**

- `CommercialHomepage` accepts `content: HomePageContent` and `paths: FoundationNavigationPaths` and renders the existing `HomeHero` followed by the seven new sections in the exact approved order.
- Each section accepts only its section-specific content, plus a resolved Process anchor or action path where required.
- `HomepageSectionHeading` accepts a stable `headingId`, visible heading, and optional introduction; it emits no section wrapper or locale logic.
- `HomepageContentCard` accepts a title and description, renders an H3 and paragraph, and has no interactive semantics.
- `SiteHeader` and `SiteFooter` add a localized `process` label and use `paths.process`. They do not expose unavailable Projects, Studio landing, or Privacy routes.

- [x] **Step 1: Extend rendered-artifact verification and observe RED**

  Extend `scripts/verify-static-export.mjs` so `out/index.html` and `out/en/index.html` must contain the visible headings and stable labelled-section IDs for all seven later sections in the approved source order. Require the localized Process section IDs `proceso` and `process`, and require internal links for Services, Contact, Founder, Process, and WhatsApp without duplicated or missing base paths.

  Run:

  ```powershell
  npm run build
  node scripts/verify-static-export.mjs
  ```

  Expected: the build passes but artifact verification fails on the first missing later section. Record that failure in this plan.

- [x] **Step 2: Build the two justified shared presentation primitives**

  Implement `HomepageSectionHeading` and `HomepageContentCard` with the exact visual/semantic contracts above. The card uses Surface, Border, `16px` radius, no shadow, `24px` compact/`32px` medium padding, top-aligned content, H3 title, and body copy. It has no link wrapper, pointer cursor, hover elevation, transform, or focus behavior.

  Do not introduce a general component library, variant engine, design-token file, or client component.

- [x] **Step 3: Implement the seven semantic sections**

  Create one Server Component per section and resolve its actions with the existing typed action-link mechanism. Use the approved section surfaces and spacing: `64px` compact, `80px` medium, `96px` wide; existing `1200px` container and gutters; H2/H3/body measures from `DESIGN-VISUAL`.

  Implement these exact structural rules:

  - Problems: labelled section, four-item `ul`, one/two-column grid, Services action.
  - Services: labelled section, three-item `ul`, one column through medium and three wide, one section Services action, zero card actions.
  - Audiences: labelled section, four-item `ul`, one/two-column grid, closing paragraph, Contact action.
  - Proof: labelled Canvas section with one Surface panel, three-item commitments `ul`, Founder action, and no project-like visual or data structure.
  - Process: section `id` from the `anchorId` supplied by `CommercialHomepage` through `homeProcessAnchors[content.locale]`, labelled H2, four-item `ol`, one/two/four-column grid, visible numerals, quality paragraph, Contact action.
  - Founder: labelled text-led section, source order heading/biography/primary/secondary, stacked compact/medium and split wide; no portrait placeholder or résumé elements.
  - Final CTA: labelled Action-tint section, narrow text measure, response statement, Contact primary action, external WhatsApp secondary action.

  Reuse existing primary/secondary action classes. Action groups stack full-width below `480px` and wrap inline above it. Add no icons, entrance motion, connector required for understanding, or hidden initial content.

- [x] **Step 4: Compose the page atomically**

  Implement `CommercialHomepage` with the existing hero first and all seven sections in the approved order. Update both localized home routes to render this component within their existing single `main` landmark.

  Add localized Process labels to the header/footer label objects in all eight foundation route entries and render `paths.process` in both shared navigation components. Keep the foundation's working-route posture; do not add unavailable navigation destinations.

- [x] **Step 5: Verify semantics and responsive behavior in source**

  Review the rendered composition before browser QA:

  - one `main`, one H1, seven new visible H2 elements, and H3 only for item titles;
  - all peer groups use `ul`; Process uses `ol` and meaningful source order;
  - no non-interactive card is focusable or clickable;
  - all CTA destinations and order match `PAGE-HOME`;
  - both language modules render independently with no locale state or client directive;
  - no content is truncated, CSS-reordered, or motion-dependent;
  - no project evidence, portfolio résumé language, or unsupported claim was introduced.

- [x] **Step 6: Run complete deterministic verification in both export modes**

  Run:

  ```powershell
  npm run validate
  node scripts/verify-static-export.mjs
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  node scripts/verify-static-export.mjs
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  git diff --check
  ```

  Expected: documentation, all Node tests, lint, typecheck, normal build, base-path build, both artifact checks, and diff check pass. Both home artifacts contain the eight-section narrative in order, correct document language, correct localized Process anchor, and no missing/doubled base-path references.

- [x] **Step 7: Perform bilingual visual and accessibility QA**

  Use the repository `visual-qa` Skill against `/` and `/en/` at `320×800`, `375×812`, `768×1024`, `1024×768`, and `1440×900`, then repeat the relevant route/link checks under `/Portfolio`.

  Verify no horizontal scrolling; approved column transitions; long-copy wrapping; section rhythm/surface alternation; visible section boundaries; source/reading order; CTA hierarchy and stacking; minimum `44px` targets and `48px` CTA height; full keyboard traversal; unclipped visible focus on every background; working header/footer Process anchors with visible headings; touch behavior; JavaScript-disabled content; reduced motion; and zero automated accessibility-scan violations on both home routes. Record screenshots/check output supported by the tool and label unavailable evidence honestly.

- [x] **Step 8: Audit commercial narrative and evidence safety**

  Read each rendered locale from hero to final CTA. Confirm there is no duplicated section message, excessive technical vocabulary, competing action inside cards, unsupported result/client/sector claim, project-card affordance, skills grid, employment timeline, recruiter wording, or GitHub-first portfolio framing.

  Compare `HOME-PROOF` to `PROJECT-EVIDENCE` after implementation. If no candidate has newly reached `ready` through explicit evidence and permission, the fallback remains mandatory; implementation work must not reclassify a project.

- [x] **Step 9: Synchronize current facts and complete the plan**

  Update `ARCHITECTURE.md` and the current-system/quality records only with facts demonstrated by the merged-ready implementation. Record exact PR numbers, validation results, warnings, visual evidence, and any approved deviations in this plan. Preserve all deferred items as OPEN in their current owners.

  Set `plan_status: COMPLETED`, move this file to `docs/plans/completed/homepage-completion.md`, update the plan/index/status references, and rerun `npm run docs:check` plus `git diff --check`.

- [x] **Step 10: Review and commit PR 2**

  Review `main...HEAD` against every authority in the requirements table and every non-goal. Confirm no dependency, route tree, runtime localization, hosting, form, project evidence, imagery, or metadata architecture slipped into the diff. Commit with `feat: complete commercial homepage`, push the branch, and open a human-reviewed PR without merging it.

**Validation:** Full `npm run validate`, normal and `/Portfolio` static builds, extended artifact verification, all specified viewport checks, keyboard/focus/target/anchor checks, no-JavaScript and reduced-motion checks, automated accessibility scan, evidence audit, narrative review, and final diff review.

**Rollout/migration:** PR 2 is the single behavior-changing rollback unit. It publishes both languages and all seven sections together. Reverting it returns both routes to the existing hero-only homepage while leaving the behavior-neutral typed content contracts available.

## Expected affected areas

- Two existing localized home content modules and route entries.
- Shared homepage section components under a dedicated narrow directory.
- Existing route/navigation helpers and minimal header/footer.
- Node content/route tests and the static-export artifact verifier.
- Current-system, status, index, and execution-plan documentation.
- No package, deployment, route-tree, locale-layout, metadata, or backend changes.

## Validation

Every PR runs its focused tests, `npm test`, `npm run typecheck`, `npm run docs:check`, and `git diff --check`. PR 2 additionally runs lint, both static build modes, rendered-artifact verification, and the complete bilingual visual/accessibility matrix.

Passing automated checks supports review but does not establish whole-site WCAG conformance. The completion record must distinguish verified evidence from unperformed or environment-blocked checks.

## Risks

- Long Spanish and English copy can create different card heights and wrapping; content-growth layouts and the specified viewports are required.
- A Process anchor can accidentally be modeled as a new route or receive an incorrect base path; the route helper and both export-mode checks prevent that drift.
- Publishing sections piecemeal would break the approved conversion narrative; all rendered sections are one integration PR.
- Reusable primitives can grow into an unapproved design-system layer; this plan permits only the heading and non-interactive card patterns shared by multiple sections.
- Proof-like visuals can imply case-study evidence even without explicit claims; the fallback's single restrained panel and contract tests prohibit that presentation.
- Repeated Contact actions can become visually competitive; source order, section-level action rules, and narrative review preserve the approved hierarchy.
- Static HTML assertions can pass while focus, overflow, or anchor landing remains poor; browser QA is a completion gate.

## Deferred OPEN decisions

- Future project-card `HOME-PROOF`, public project titles, evidence completion, and Projects routes.
- Contact-form provider, privacy, consent, retention, and data-processing decisions.
- Service fragment identifiers and individual service destinations.
- Studio landing, Privacy, localized Not Found, and the remaining full-site route set.
- Founder photography, other imagery, custom logo symbol, dark theme, and extended design system.
- Canonical production origin, absolute metadata alternates, sitemap language alternates, long-term hosting, analytics, and performance budgets.
- Whole-site accessibility conformance claims.

These items do not block the approved text-led homepage and must not be silently resolved during implementation.

## Completion record

Task 1 materialized the approved bilingual content and Process-anchor contracts without changing the rendered homepage. Task 2 then published the seven approved later sections atomically through the shared `CommercialHomepage` Server Component composition, with the evidence-safe `HOME-PROOF` fallback preserved.

The implementation is review-ready on `codex/homepage-completion-integration` in [PR #16](https://github.com/Furlanich/Portfolio/pull/16), targeting `main`. Merge authority remains with the human reviewer.

## Progress

- 2026-09-04: Initiative 2 product/content, evidence, design, responsive, accessibility, and narrative decisions closed in their authoritative owners. All seven later sections are ready; `HOME-PROOF` is ready only as the approved evidence-safe fallback.
- 2026-09-04: Governance review classified implementation as a versioned plan under `ADR-STATIC-LOCALIZED-ROUTING`. No unresolved consequential architecture, RFC, ADR amendment, dependency decision, or release-only concern blocks implementation.
- 2026-09-05: Task 1 / PR 1 is implemented on `codex/homepage-completion-content-contracts`; the complete typed bilingual content contract, localized Process anchors, focused tests, and behavior-neutral scope review are complete. Full validation passed: documentation check, 26 Node tests, lint, typecheck, and production build. The initial CI run exposed and the branch corrected one structural-equality test assertion. Its review remains human-controlled and unmerged.
- 2026-09-05: Task 2 / PR 2 is implemented on `codex/homepage-completion-integration` in [PR #16](https://github.com/Furlanich/Portfolio/pull/16); both localized homepages now render the exact eight-section narrative, shared Process navigation is available on all eight foundation routes, and the static verifier covers headings, IDs, actions, WhatsApp, and base-path integrity. Normal and `/Portfolio` browser checks passed at the required homepages/viewports; axe-core reported zero violations on both home routes. The normal and base-path production builds, full validation, and artifact checks passed. Browser screenshots were captured under the visual QA workspace; no screenshot was committed. The PR remains open and unmerged for human review.

## Important implementation decisions

- Use two PRs: a behavior-neutral typed content/anchor contract, followed by one atomic bilingual rendered integration.
- Keep existing hero fields at the top level of each `homeContent` object so the current `HomeHero` remains compatible during PR 1.
- Model Process as a localized homepage anchor, not a fifth foundation route.
- Permit two reused homepage presentation primitives but no generalized design-system architecture.
- Keep `HOME-PROOF` as a single credibility panel until repository evidence explicitly makes a project `ready`.
- Add only the now-working Process destination to the existing minimal header/footer; unavailable full-site destinations remain excluded.

## Deviations discovered during execution

None. The approved localized Process IDs (`proceso`/`process`) and localized later-section IDs are implementation details within the existing route and accessibility contracts; no product, design, architecture, or evidence decision was changed.
