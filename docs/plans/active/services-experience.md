---
id: PLAN-SERVICES-EXPERIENCE
type: execution-plan
status: APPROVED
plan_status: ACTIVE
related:
  - ADR-STATIC-LOCALIZED-ROUTING
  - PAGE-SERVICES
  - AUDIENCES-SERVICES
  - SERVICE-WEB
  - SERVICE-WHATSAPP
  - SERVICE-CONSULTING
  - PAGE-CONTACT
  - PROJECT-EVIDENCE
  - CONTENT-LOCALIZATION
  - DELIVERY-BOUNDARIES
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
last_verified: 2026-09-05
---

# Services Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task by task. Use the repository `visual-qa` Skill for the rendered integration task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete approved commercial Services experience at `/servicios/` and `/en/services/` with truthful evidence, stable service anchors, explicit boundaries, and accessible responsive behavior.

**Architecture:** Extend the accepted localized static foundation without changing it. Each route-owned locale module supplies exact typed content to shared locale-agnostic semantic Server Components; the existing route helper resolves localized page and fragment destinations; static export remains the delivery model.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Node 24 contract tests, static export, and GitHub Pages with optional build-time `basePath`.

**Spec:** [`PAGE-SERVICES`](../../product/pages/services.md), [`AUDIENCES-SERVICES`](../../product/audiences-and-services.md), [`PROJECT-EVIDENCE`](../../product/project-evidence.md), [`DESIGN-VISUAL`](../../design/visual-language.md#services-page-visual-baseline-approved), [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#services-page-interaction-and-responsive-baseline-approved), and [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md).

## Global constraints

- Copy exact approved Spanish and professionally adapted English public content from `PAGE-SERVICES`; components and this plan do not become copy owners.
- Preserve the six-part hierarchy: introduction, Web, WhatsApp, Consulting, shared principles and boundaries, final Contact CTA. The compact service index belongs inside the introduction and does not become a seventh narrative section.
- Preserve the three launch services. AI remains an optional capability within a suitable engagement, never a fourth service or default inclusion.
- Preserve explicit Spanish-root and English-`/en/` route trees, Server Components by default, static export, trailing slashes, optional `NEXT_PUBLIC_BASE_PATH`, and current GitHub Pages delivery.
- Do not add a route, dependency, CMS, backend, runtime locale state, client-side fragment router, provider integration, contact form, or new design-system architecture.
- Route-owned localized modules own public prose. Shared components receive typed data and resolved destinations, with no locale branching or invented public copy.
- Implement stable semantic service fragments exactly as approved: Spanish `#web`, `#whatsapp`, `#consultoria`; English `#web`, `#whatsapp`, `#consulting`.
- Keep the current page-root language-switch fallback. URL fragments are not server-visible in this static Server Component architecture; fragment preservation is optional in `DESIGN-IX-A11Y` and must not justify client runtime state.
- Reuse the approved palette, typography, container, gutters, buttons, focus treatment, surfaces, and homepage presentation patterns. Promote a homepage primitive only when Services establishes genuine cross-page reuse and the rendered homepage remains unchanged.
- Render one `main`, one H1, service/principle/final sections with visible H2s, internal groups with H3s, peer collections as semantic lists, and ordinary links as the only interactive card-area elements.
- Keep dependencies, limitations, non-fit guidance, and commercial boundaries visible in the normal reading flow. Do not hide essential caveats in accordions, tooltips, hover states, or tabs.
- Evidence fails closed. Web may contain only the approved restrained General Reservation System text acknowledgement. WhatsApp and Consulting must state that no public evidence is currently approved. Add no project card, project link, logo, image, metric, testimonial, certification, maturity badge, or simulated case study.
- Do not imply a free diagnosis, guaranteed acceptance, fixed price, fixed timeline, outcome guarantee, maintenance inclusion, provider independence, or support SLA.
- Every implementation PR requires focused tests, documentation validation, TypeScript checking, diff review, and human review before merge. The rendered integration additionally requires the complete deterministic and visual/accessibility gates below.

---

## Objective

Replace the current minimum Services destinations with the approved bilingual commercial journey. A visitor should recognize an operational problem, understand the relevant service and likely outcome, see representative examples, understand scope and dependencies, decide fit, encounter only truthful evidence, and reach the localized Contact route without the page becoming a technical catalogue.

## Requirements implemented

| Authority | Implementation responsibility |
| --- | --- |
| [`PAGE-SERVICES`](../../product/pages/services.md) | Exact hierarchy, bilingual public content, service levels, contextual CTAs, boundaries, AI posture, anchors, conversion journey, and readiness criteria |
| [`AUDIENCES-SERVICES`](../../product/audiences-and-services.md) | Approved definitions and boundaries for `SERVICE-WEB`, `SERVICE-WHATSAPP`, and `SERVICE-CONSULTING` |
| [`CONTENT-LOCALIZATION`](../../product/content-and-localization.md) | Route-owned `es-AR` and natural English content without runtime locale state |
| [`PROJECT-EVIDENCE`](../../product/project-evidence.md) | Limited Web acknowledgement and explicit evidence absence for WhatsApp and Consulting |
| [`PAGE-CONTACT`](../../product/pages/contact-and-privacy.md) | Existing useful localized inquiry destinations; no structured form or privacy workflow |
| [`DELIVERY-BOUNDARIES`](../../product/delivery-and-commercial-boundaries.md) | Bounded informational wording for price, timing, providers, fees, client responsibilities, maintenance, and support |
| [`DESIGN-VISUAL`](../../design/visual-language.md#services-page-visual-baseline-approved) | Surface rhythm, service composition, level/use-case patterns, paired panels, evidence treatment, principles, and final CTA |
| [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#services-page-interaction-and-responsive-baseline-approved) | Responsive reflow, semantics, anchors, targets, focus, keyboard, source order, no-JavaScript, reduced-motion, and visual QA matrix |

## Governance classification

**Route:** Versioned execution plan.

This is substantial approved work: it changes two public routes, introduces typed bilingual content and shared presentation, and requires staged deterministic and visual verification. Lightweight in-task planning is insufficient.

No unresolved consequential product or architecture decision remains within the approved scope. `PAGE-SERVICES` closes the content, evidence, anchor, CTA, visual, responsive, accessibility, and commercial-boundary decisions. `ADR-STATIC-LOCALIZED-ROUTING` already accepts locale-owned content, shared locale-agnostic components, typed destination resolution, static export, trailing slashes, and optional base-path deployment. The Services work uses those same seams.

The initiative therefore does not require an RFC or new ADR. The visible AI-note headings synchronized with `PAGE-SERVICES` while this plan was authored clarify an already-approved design requirement and do not change the product model.

## Affected architecture

The current `/servicios/` and `/en/services/` route entries compose the existing header, a shared `MinimumDestination`, and the existing footer. Their locale modules expose a small `ServicesContent` summary. The plan expands those accepted boundaries:

- each existing Services content module exposes one complete typed locale-owned page model;
- a narrow `components/services/` boundary owns the shared semantic page composition and service-specific layouts;
- the existing `lib/site-routes.ts` adapter owns semantic service IDs and localized fragment strings without adding page routes;
- the two route entries replace `MinimumDestination` with the shared Services composition while keeping their existing locale layouts, header, footer, and navigation adapter;
- two presentation primitives currently scoped to `components/homepage/` move to a neutral `components/commercial/` boundary only after a behavior-neutral cross-page reuse PR;
- the static artifact verifier gains Services-specific assertions for both locales and optional base paths.

There is no change to the route tree, rendering mode, localization strategy, dependency graph, data source, hosting, deployment, or accepted foundation ownership model.

## Relevant ADRs

- [`ADR-STATIC-LOCALIZED-ROUTING`](../../decisions/static-localized-routing.md) remains the sole architectural authority for this work.
- No amendment is required. Static fragments are document identifiers, not new routes or runtime routing state.
- If implementation discovers a need for runtime locale state, a new route family, a CMS, a backend, a dependency, or a materially broader design-system API, stop and route that proposal through governance rather than expanding this plan silently.

## Scope

- Complete typed content contracts for the page introduction, three services, shared principles/boundaries/AI note, and final CTA.
- Exact approved Spanish and English content in the two existing route-owned Services modules.
- Localized service fragment lookup and same-page index destinations.
- Shared semantic Server Components for the introduction/index, repeated service sections, principles/boundaries, final CTA, and full page composition.
- Three approved Web engagement-level cards and four approved WhatsApp capability-level cards, presented as distinctions rather than packages.
- Visible scope, exclusions, dependencies, fit/non-fit, evidence status, and contextual inquiry action for each service.
- Restrained evidence-safe presentation: one Web text note and explicit absence statements for the other services.
- Approved service surfaces, responsive reflow, heading/list/nav semantics, focus, target, keyboard, anchor, no-JavaScript, and reduced-motion behavior.
- Deterministic content, route, source-structure, and static-artifact verification in both locales and both static-export modes.
- Browser QA at the approved viewport matrix and synchronized current-system documentation after rendered integration.

## Non-goals

- New product, service, package, tier, price, estimate, guarantee, SLA, or contractual term.
- Service-detail routes, Projects routes, project-detail routes, or changes to homepage Services linking.
- A structured inquiry form, privacy flow, provider integration, CRM, email sending, analytics, or lead storage.
- Broader evidence, client identities, confidential work, public project URLs, screenshots, demos, logos, metrics, testimonials, certifications, or fabricated case studies.
- A fourth AI service, AI-first marketing section, or implication that every project uses AI.
- Provider selection or commitments for Meta/WhatsApp, payments, hosting, APIs, messaging, or other subscriptions.
- New imagery, icons, illustration system, animation, carousel, tabs, essential accordions, sticky anchor rail, dark theme, or extended token family.
- Client-side hash tracking or guaranteed fragment-preserving language switching. The approved route-root fallback remains valid.
- Canonical-origin selection, sitemap changes, long-term hosting changes, performance budgets, or unsupported whole-site accessibility conformance claims.

## File responsibility map

| Area | Planned responsibility |
| --- | --- |
| `components/services/content-types.ts` | Complete section-specific content model and semantic `ServiceSectionId` references |
| `app/(es)/_content/services.ts` | Exact approved Argentine Spanish Services content |
| `app/(en)/en/_content/services.ts` | Exact approved natural-English Services content |
| `lib/site-routes.ts` | Semantic service IDs, localized fragments, and fragment href lookup; existing page route IDs remain unchanged |
| `components/commercial/CommercialSectionHeading.tsx` | Cross-page visible section-heading primitive, preserving current homepage output |
| `components/commercial/CommercialContentCard.tsx` | Cross-page non-interactive title/description surface, preserving current homepage output |
| `components/homepage/*` | Import the promoted primitives without rendered or behavioral change |
| `components/services/ServicesPage.tsx` | One-main composition in the exact approved narrative order |
| `components/services/ServicesIntroduction.tsx` | H1, introduction, fit statement, non-sticky semantic service index |
| `components/services/ServiceSection.tsx` | Repeated service narrative, semantic groups, levels/use cases, evidence, and contextual CTA |
| `components/services/ServicesPrinciples.tsx` | Six working principles, commercial boundaries, and visible AI note |
| `components/services/ServicesFinalCta.tsx` | General inquiry CTA and response statement |
| `components/services/ServicesActionLink.tsx` | Narrow repeated primary-action rendering, only if four equivalent CTA call sites justify it |
| `app/(es)/servicios/page.tsx`, `app/(en)/en/services/page.tsx` | Supply one locale's content to the shared Services composition |
| `scripts/services-content.test.mjs` | Bilingual content shape, exact decision invariants, evidence exclusions, and CTA contracts |
| `scripts/services-route.test.mjs` | Route integration and shared-composition source contract |
| `scripts/site-routes.test.mjs` | Localized service fragment/href contract and unchanged foundation page routes |
| `scripts/verify-static-export.mjs` | Rendered hierarchy, IDs, links, evidence boundaries, locale, and base-path verification |
| `ARCHITECTURE.md`, `docs/architecture/*.md`, `docs/plans/**` | Demonstrated current facts and execution history after integration |

## Public interfaces

The implementation should prefer section-specific types over a generic CMS schema. Exact field names may be refined within PR 1 if the same semantics and testability are preserved:

```ts
export type ServiceSectionId = 'web' | 'whatsapp' | 'consulting';

export type ServicesTextItem = {
  title: string;
  description: string;
};

export type ServicesSectionContent = {
  id: ServiceSectionId;
  eyebrow: string;
  heading: string;
  situationHeading: string;
  situations: string[];
  outcomeHeading: string;
  outcome: string;
  examplesHeading: string;
  examples: ServicesTextItem[];
  engagementHeading: string;
  engagement: string[];
  boundariesHeading: string;
  boundaries: string[];
  dependenciesHeading: string;
  dependencies: string[];
  fitHeading: string;
  fit: string[];
  nonFitHeading: string;
  nonFit: string[];
  evidenceHeading: string;
  evidence: string;
  action: ActionLink;
};
```

`ServicesPageContent` adds the approved introduction/index labels, the ordered `services` tuple, six principles, commercial-boundary content, visible AI-note heading/body, and final CTA. Model the Web and WhatsApp level distinctions explicitly when that prevents a component from inferring presentation from array position; do not introduce package prices or generic block-builder abstractions.

Add localized fragments without changing `foundationRouteIds`:

```ts
export const serviceSectionIds = ['web', 'whatsapp', 'consulting'] as const;

export const serviceSectionAnchors = {
  web: { es: 'web', en: 'web' },
  whatsapp: { es: 'whatsapp', en: 'whatsapp' },
  consulting: { es: 'consultoria', en: 'consulting' },
} as const satisfies Record<ServiceSectionId, Record<Locale, string>>;

export function getServiceSectionHref(
  locale: Locale,
  serviceId: ServiceSectionId,
): string {
  return `${getFoundationPath('services', locale)}#${serviceSectionAnchors[serviceId][locale]}`;
}
```

For same-page index links, components may render `#${anchor}` after receiving the resolved fragment or href. They must not duplicate locale-to-fragment mappings. Contact actions remain semantic `ActionLink` values resolved through the existing route adapter.

## Pull Request sequence

| PR | Objective | Depends on | Public behavior |
| --- | --- | --- | --- |
| **1. Add complete Services content and anchor contracts — the single first implementation PR** | Materialize all approved bilingual content behind typed contracts and add tested localized service fragments | This planning PR merged | None; current Services routes remain visually and behaviorally unchanged |
| 2. Promote shared commercial presentation primitives | Move the two now-cross-page homepage primitives to a neutral boundary with byte-equivalent markup/classes | PR 1 merged | None; homepage and minimum Services destinations remain unchanged |
| 3. Integrate and verify the complete Services experience | Render both complete routes atomically, extend static verification, perform full visual/accessibility QA, and close the plan | PR 2 merged | Publishes the approved bilingual Services experience |

PR 1 is the only authorized first implementation PR. PR 2 and PR 3 must not begin as alternative first slices; each starts from the preceding merged result so review and rollback boundaries remain unambiguous.

## Implementation phases

### Task 1 / PR 1: Add complete Services content and anchor contracts

**Objective:** Make every approved bilingual content, evidence, CTA, and fragment decision executable and testable without changing rendered routes.

**Requirements implemented:** Content and hierarchy from `PAGE-SERVICES`; service meaning from `AUDIENCES-SERVICES`; evidence restrictions from `PROJECT-EVIDENCE`; fragment policy from `PAGE-SERVICES` and `DESIGN-IX-A11Y`.

**Dependencies:** This plan is merged. No evidence, content, design, or architecture decision remains outstanding for the approved text-led version.

**Files:**

- Create: `components/services/content-types.ts`
- Create: `scripts/services-content.test.mjs`
- Modify: `app/(es)/_content/services.ts`
- Modify: `app/(en)/en/_content/services.ts`
- Modify: `lib/site-routes.ts`
- Modify: `scripts/site-routes.test.mjs`
- Modify: `docs/plans/active/services-experience.md`

- [ ] **Step 1: Write failing bilingual content contracts**

  Create `scripts/services-content.test.mjs` with `node:test` and `node:assert/strict`. Import both route-owned Services modules and assert these runtime invariants:

  - introduction, ordered services, principles, commercial boundaries, AI note, and final CTA exist;
  - services occur exactly once and in Web, WhatsApp, Consulting order;
  - every service supplies client situations, intended outcome, representative examples, possible engagement scope, boundaries, dependencies, fit, non-fit, evidence text, and one action;
  - Spanish and English expose the approved exact H1, H2, index labels, contextual CTA labels, final CTA labels, visible AI-note headings, and response statements;
  - the Web section contains exactly the three approved levels without price, package, or tier fields;
  - the WhatsApp section distinguishes basic contact, automated workflows, bot assistance, and official provider/API integration, and names the approved policy/template/provider/fee/client-system/feasibility constraints;
  - Consulting describes an identifiable existing system and covers diagnosis, defect investigation, stabilization, maintenance, integrations, dependency/framework updates, performance, technical debt, modernization planning, architecture review, and ongoing support only by agreement;
  - all four internal actions are semantic `ActionLink` values targeting `contact`; no content module handwrites localized Contact hrefs;
  - the Web evidence value contains only the approved General Reservation System acknowledgement and no public URL, client identity, metric, screenshot, logo, testimonial, certification, maturity badge, or project-card data;
  - WhatsApp and Consulting contain the approved evidence-absence wording and no evidence-item array or placeholder project;
  - AI exists only once in shared principles/boundaries and no service has `id: 'ai'`;
  - peer counts match the owner: three services and six cross-service principles; all required strings are non-empty.

  Extend `scripts/site-routes.test.mjs` to require `serviceSectionIds`, `serviceSectionAnchors`, and `getServiceSectionHref`, while asserting `foundationRouteIds` remains exactly the existing four page routes.

- [ ] **Step 2: Run the focused tests and observe RED**

  Run:

  ```powershell
  node --test scripts/services-content.test.mjs scripts/site-routes.test.mjs
  ```

  Expected: failures because the complete Services model/content and fragment map do not yet exist. Record the failing assertions in this plan before implementation.

- [ ] **Step 3: Add the minimum typed Services model**

  Create `components/services/content-types.ts`. Reuse `ActionLink` and existing route semantics. Use named page/service structures that make omissions visible at the content-module boundary; avoid a generic page-builder schema, runtime validation dependency, or empty optional evidence collection.

  Keep the current minimal `servicesContent` export source-compatible for the still-rendered `MinimumDestination`. Add the complete model as a separate `servicesPageContent` export in this PR so behavior remains unchanged.

- [ ] **Step 4: Materialize the approved Spanish content**

  Populate `servicesPageContent` in `app/(es)/_content/services.ts` with the exact Spanish copy from `PAGE-SERVICES`, preserving Argentine voseo and punctuation. Represent examples as examples, not product packages. Preserve all exclusions, third-party dependencies, fit/non-fit wording, the limited Web evidence note, the two evidence-absence statements, and the visible `IA solo cuando aporta valor` note.

  Review every public string side by side with the owner. Do not copy the page prose into component files or create a third translation source.

- [ ] **Step 5: Materialize the approved English content**

  Populate `servicesPageContent` in `app/(en)/en/_content/services.ts` from the approved English section in `PAGE-SERVICES`. Preserve product meaning rather than mirroring Spanish sentence structure. Confirm provider caveats, non-fit guidance, evidence asymmetry, and the visible `AI only where it adds value` note remain equivalent.

- [ ] **Step 6: Add semantic localized service fragments**

  Add the exact `serviceSectionIds`, `serviceSectionAnchors`, and `getServiceSectionHref` contract defined above to `lib/site-routes.ts`. Use the existing base-path-neutral route values; the helper returns logical application hrefs and build-time base-path handling remains owned by Next.js output/link behavior.

  Do not add fragments to `foundationRoutes`, change route pairs, add navigation state, or modify the current language switch. Verify exact hrefs:

  - ES: `/servicios/#web`, `/servicios/#whatsapp`, `/servicios/#consultoria`
  - EN: `/en/services/#web`, `/en/services/#whatsapp`, `/en/services/#consulting`

- [ ] **Step 7: Run focused GREEN and deterministic gates**

  Run:

  ```powershell
  node --test scripts/services-content.test.mjs scripts/site-routes.test.mjs
  npm run docs:check
  npm run lint
  npm run typecheck
  npm run build
  ```

  Expected: all pass. Confirm both current Services output artifacts remain the minimum destinations and no source route/component was changed.

- [ ] **Step 8: Review, record, and open PR 1**

  Inspect the diff for exact copy ownership, accidental implementation behavior, evidence leakage, secrets, generated output, and unrelated files. Update this plan's Progress with the branch, PR, focused RED/GREEN result, and full validation result. Use the PR title `feat: add Services content and anchor contracts`. Human review and merge are required before Task 2.

### Task 2 / PR 2: Promote shared commercial presentation primitives

**Objective:** Establish the smallest justified cross-page presentation boundary while preserving rendered homepage and Services behavior exactly.

**Requirements implemented:** `DESIGN-VISUAL` requires Services to reuse the homepage section-heading and non-interactive card language instead of creating a separate visual system.

**Dependencies:** Task 1 / PR 1 is merged.

**Files:**

- Create: `components/commercial/CommercialSectionHeading.tsx`
- Create: `components/commercial/CommercialContentCard.tsx`
- Modify: homepage section components that import the two current primitives
- Delete: `components/homepage/HomepageSectionHeading.tsx`
- Delete: `components/homepage/HomepageContentCard.tsx`
- Modify: `docs/plans/active/services-experience.md`

- [ ] **Step 1: Capture the behavior-neutral contract**

  Record the current public props, rendered elements, heading levels, class names, and call sites for `HomepageSectionHeading` and `HomepageContentCard`. Confirm neither contains homepage-specific public prose, state, route behavior, or section identity.

- [ ] **Step 2: Move and rename the two primitives**

  Create the neutral `components/commercial/` modules with equivalent props, markup, and classes. Update homepage imports and component names. Delete the old modules only after `rg` confirms there are no remaining imports.

  Do not introduce an index barrel, polymorphic `as` API, variant engine, class-merging dependency, or general card system. This PR proves reuse through one narrow move; Services begins consuming the primitives only in Task 3.

- [ ] **Step 3: Verify no public behavior changed**

  Run:

  ```powershell
  npm run validate
  ```

  Build both normal and base-path exports. Perform a focused browser smoke check on `/` and `/en/` at one narrow and one wide viewport, checking section headings, cards, overflow, focus styling on adjacent links, and console/runtime errors. Record only observations actually made.

- [ ] **Step 4: Review, record, and open PR 2**

  Confirm the diff contains only the two moves, import updates, and plan progress. Compare generated homepage HTML or DOM structure before/after where practical. Update Progress, then open a human-reviewed PR titled `refactor: share commercial presentation primitives`. Do not merge automatically.

### Task 3 / PR 3: Integrate and verify the complete Services experience

**Objective:** Publish the full approved experience atomically in both locales, with deterministic artifact verification and the complete visual/accessibility matrix.

**Requirements implemented:** All page, service, localization, evidence, visual, interaction, responsive, accessibility, and delivery requirements listed above.

**Dependencies:** Task 2 / PR 2 is merged. The existing localized Contact routes remain usable; the deferred structured form and legal/privacy decisions do not block direct-channel inquiry.

**Files:**

- Create: `components/services/ServicesPage.tsx`
- Create: `components/services/ServicesIntroduction.tsx`
- Create: `components/services/ServiceSection.tsx`
- Create: `components/services/ServicesPrinciples.tsx`
- Create: `components/services/ServicesFinalCta.tsx`
- Create only if repeated markup justifies it: `components/services/ServicesActionLink.tsx`
- Create: `scripts/services-route.test.mjs`
- Modify: `app/(es)/servicios/page.tsx`
- Modify: `app/(en)/en/services/page.tsx`
- Modify: `app/(es)/_content/services.ts`
- Modify: `app/(en)/en/_content/services.ts`
- Modify: `scripts/foundation-content.test.mjs`
- Modify: `scripts/verify-static-export.mjs`
- Modify after facts are demonstrated: `ARCHITECTURE.md`, `docs/architecture/current-system.md`, `docs/architecture/current-quality-findings.md`, `docs/plans/active/services-experience.md`

- [ ] **Step 1: Write failing route and static-artifact contracts**

  Create `scripts/services-route.test.mjs` to assert both route entries import the shared `ServicesPage`, pass only their locale-owned `servicesPageContent`, and no longer render `MinimumDestination`.

  Extend `scripts/verify-static-export.mjs` so both Services artifacts must contain:

  - the correct `lang`, localized route, and base-path-safe internal destinations;
  - exactly one approved H1;
  - the compact index as a labelled `nav` containing a semantic list and the three exact fragment links;
  - Web, WhatsApp, Consulting sections in order with the exact localized IDs and visible H2s;
  - internal H3 groups for situations/outcomes, examples, engagement, boundaries/dependencies, fit/non-fit, and evidence where the approved composition uses them;
  - the shared principles/boundaries section and final CTA after the three services;
  - all three contextual Contact actions plus the general final Contact action with exact labels;
  - the approved Web evidence acknowledgement and the exact WhatsApp/Consulting evidence-absence statements;
  - no service subroute, Projects action, public General Reservation System URL, Busesfy, ChronoApp, MPC, Documancer, client logo, case-study image, metric, testimonial, certification, or evidence card.

  Run the focused test and artifact verifier against the current build and record RED: routes still use `MinimumDestination`, and complete rendered sections do not exist.

- [ ] **Step 2: Implement the shared semantic composition**

  Build `ServicesPage` as a Server Component that returns one `main` in the exact approved order. Resolve every `ActionLink` through the existing route adapter before rendering. Components must not branch on locale, look up translations, inspect `window.location`, or require hydration.

  `ServicesIntroduction` renders the H1, supporting copy, audience-fit statement, and a non-sticky `<nav aria-label={content.indexLabel}>` with a `<ul>` of ordinary same-document links. It is not a tablist, menu, carousel, or mobile drawer.

  `ServiceSection` receives content plus its resolved localized anchor. Its section ID is exact and unique, its H2 remains visible when navigating by fragment, and `scroll-margin` prevents the existing header from obscuring it. Use semantic lists for peers. Cards and panels are non-interactive; the contextual CTA is the only service action.

  `ServicesPrinciples` renders six principles, bounded commercial copy, and one visible AI-note heading/body. `ServicesFinalCta` renders the general inquiry action and approved response statement. If `ServicesActionLink` does not remove genuine repeated markup without hiding styling semantics, render the four links directly and omit the file.

- [ ] **Step 3: Apply the approved visual composition**

  Reuse the Canvas, Surface, Ink, Muted, Action, and Border tokens; Inter typography; 1200 px container; existing gutters; button patterns; and established compact/medium/wide section rhythm.

  Implement only these page-specific extensions from `DESIGN-VISUAL`:

  - introduction on Canvas with a bounded, non-sticky service-index panel;
  - alternating page rhythm: Web on Surface, WhatsApp on Canvas, Consulting on Surface, principles on Canvas, final CTA on the approved tint;
  - Web levels as one column compact, two columns medium where space permits, and three columns wide;
  - WhatsApp levels as one column compact and two columns medium/wide;
  - scope/exclusion and fit/non-fit as paired panels only when their reading order remains linear and clear;
  - dependencies as normal visible content with restrained emphasis;
  - Web evidence as a compact text note, not a case card; absence statements use the same restrained evidence treatment;
  - six principles as one column compact and two columns medium/wide;
  - final CTA with one primary action and no form or secondary WhatsApp action.

  Use responsive CSS reflow, not JavaScript viewport branching. Avoid fixed content heights, line clamping, horizontal card scrolling, decorative motion, or controls that imply unavailable interaction.

- [ ] **Step 4: Replace both minimum destinations atomically**

  Update `/servicios/` and `/en/services/` route entries in the same PR to render `ServicesPage` between the existing header and footer. Remove the compatibility-only minimal `servicesContent` export once all consumers have moved; retain no duplicated summary copy. Update `scripts/foundation-content.test.mjs` to test the new owner rather than an obsolete minimum-destination shape.

  Confirm the route modules remain Server Components, metadata and localized alternates remain unchanged, and the existing page-root language switch still reaches the equivalent Services page. Do not add client logic to preserve fragments.

- [ ] **Step 5: Run focused GREEN and static-export verification**

  Run:

  ```powershell
  node --test scripts/services-content.test.mjs scripts/services-route.test.mjs scripts/site-routes.test.mjs
  npm run validate
  ```

  Then produce and verify both export modes:

  ```powershell
  npm run build
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  ```

  Use the repository static verifier after each build if `npm run build` does not already invoke it. Confirm the normal artifacts are `/servicios/index.html` and `/en/services/index.html`, and the base-path-served links target `/Portfolio/...` as expected. Restore a normal build if later browser QA requires it. Do not commit `.next`, `out`, screenshots, or generated declarations changed only by the build.

- [ ] **Step 6: Perform the approved visual and accessibility QA matrix**

  Follow the repository `visual-qa` Skill. Start the existing supported server/preview and verify the actual served paths, including the base path rather than assuming `/`.

  Check both `/servicios/` and `/en/services/` at:

  - 320 × 800;
  - 375 × 812;
  - 768 × 1024;
  - 1024 × 768;
  - 1440 × 900.

  Repeat the relevant route checks under `/Portfolio`. For each actually checked route/viewport, record:

  - no horizontal page scroll, clipping, overlap, truncation, or fixed-height content loss;
  - the intended content hierarchy and one continuous mobile reading order;
  - index wrapping and ordinary-link behavior without becoming sticky or obscuring content;
  - exact anchor landing, unique IDs, visible target headings, back/forward behavior, and direct fragment loading;
  - keyboard traversal through header, service index, four CTAs, footer, and language switch in logical source order;
  - visible focus not clipped by panels or viewport edges;
  - 44 px minimum index/link targets and 48 px CTA targets where specified by the owner;
  - readable long Web/WhatsApp/Consulting content and sensible card/panel reflow at breakpoint boundaries;
  - dependencies, exclusions, non-fit guidance, evidence status, commercial boundaries, and AI note remain visible without interaction;
  - no-JavaScript access to content, anchors, navigation, and inquiry links;
  - no unexpected motion under normal or reduced-motion settings;
  - no console/runtime errors exposed by the tool.

  Run the repository's available automated accessibility scan on both locale routes and both export modes where the environment supports it. Record zero findings only when the tool actually reports zero; otherwise record exact findings or an explicit unverified limitation. Automated scanning supplements rather than proves the project's WCAG 2.2 AA target.

- [ ] **Step 7: Perform conversion, evidence, and source audits**

  Read each rendered locale from H1 to final CTA and confirm the journey remains: problem recognition → service understanding → likely outcome → examples → boundaries/dependencies → fit → truthful evidence → inquiry.

  Search source and generated HTML for generic agency language, unsupported metrics/guarantees, technical catalogue copy, duplicated homepage Process narrative, hidden caveats, named restricted projects, project URLs, client identities, certification claims, and placeholder evidence. Confirm the evidence asymmetry is visually honest rather than compensated for with empty cards or decorative proof UI.

  Verify all external/provider language remains conditional and no wording implies Meta/WhatsApp, payment, hosting, API, or other provider commitments.

- [ ] **Step 8: Synchronize demonstrated implementation facts**

  Update `ARCHITECTURE.md`, `docs/architecture/current-system.md`, and `docs/architecture/current-quality-findings.md` only with facts demonstrated by the completed implementation and verification. Update this plan's checkboxes and Progress with PR links and actual results. Do not change deferred evidence, contact-form, commercial/legal, hosting, or whole-site accessibility statuses.

  When all three implementation PRs are merged by a human and no plan task remains, set `plan_status: COMPLETED`, move this file to `docs/plans/completed/services-experience.md`, update `docs/plans/index.md` and all links, and retain the complete execution history.

- [ ] **Step 9: Final review and open PR 3**

  Run the full completion gate below, inspect the complete diff, and confirm generated output and unrelated files are absent. Open a human-reviewed PR titled `feat: publish complete Services experience`. Do not merge automatically.

## Expected affected areas

- Two route-owned localized Services content modules.
- Two existing localized Services route entries.
- New narrow `components/services/` composition boundary.
- Two presentation primitives moved from homepage-only to cross-page commercial ownership.
- Existing semantic route adapter extended with service fragments.
- Focused content, route, and static-output tests.
- Current architecture/finding records and this active plan after implementation facts exist.

No package manifest, Next.js configuration, Tailwind token configuration, route tree, locale layout, deployment workflow, backend, or provider integration should change.

## Validation

### Per-PR deterministic baseline

Each implementation PR runs the focused RED/GREEN tests named in its task plus:

```powershell
npm run docs:check
npm test
npm run lint
npm run typecheck
npm run build
```

`npm run validate` may compose these gates when the repository script remains equivalent. A production build must complete for all eight existing static routes. Build-time module-type warnings already recorded by the repository do not become failures unless behavior changes or a new warning appears.

### Rendered integration gate

Task 3 additionally requires:

- normal and `NEXT_PUBLIC_BASE_PATH=/Portfolio` production exports;
- static-artifact assertions for both Services routes in both modes;
- the ten locale/viewport combinations in the approved base visual matrix plus relevant `/Portfolio` repetitions;
- keyboard, focus, target, direct-fragment, back/forward, no-JavaScript, and reduced-motion checks;
- automated accessibility scanning where available, with exact results recorded;
- a source/generated-output evidence and unsupported-claim audit;
- a clean worktree after generated output cleanup;
- final diff review against `PAGE-SERVICES`, `PROJECT-EVIDENCE`, `DESIGN-VISUAL`, and `DESIGN-IX-A11Y`.

### PR acceptance record

Every PR description records:

- its plan task and approved requirements;
- focused tests and full checks actually run;
- public behavior changed or explicitly unchanged;
- visual routes/viewports/interactions actually checked, when applicable;
- limitations or unverified checks;
- documentation updated;
- risk and rollback boundary;
- human merge requirement.

## Risks

- The volume of approved copy can create an exhausting page. Preserve the owner’s hierarchy, selective cards/panels, surface rhythm, and concise labels; do not add explanatory prose.
- A single generic service schema could flatten meaningful differences. Keep explicit Web/WhatsApp level structures where needed and use a repeated component only for genuinely shared narrative groups.
- Evidence styling can overstate maturity even when text is accurate. Use restrained notes and absence statements, never equalized project-card UI.
- Provider boundaries can become visually subordinate. Keep dependencies in normal source order and visible without disclosure interaction.
- Long translations can break cards and CTA rows. Use intrinsic sizing, one-column compact layouts, and the full bilingual viewport matrix.
- Fragment helpers can accidentally be treated as routes or coupled to locale state. Keep route IDs unchanged and fragment resolution static in `lib/site-routes.ts`.
- Fragment-preserving language switching would require client-visible location state. The approved page-root fallback avoids that architectural expansion.
- Promoting homepage primitives may introduce visual drift. Isolate the move in PR 2 and require equivalent markup/classes plus homepage smoke verification.
- An atomic rendered integration is large. Behavior-neutral content and primitive PRs reduce the final diff while keeping both locales published together.
- Static assertions can pass while focus, overflow, or anchor landing is poor. Browser QA is a completion gate and cannot be replaced by screenshots or automated scans alone.

## Deferred OPEN decisions

- Structured Contact form provider, privacy notice, consent, retention, and data-processing details. Existing direct contact channels remain the approved inquiry path.
- Broader project evidence, publication permission, public project titles, screenshots, demos, client identities, metrics, testimonials, certifications, and Projects routes.
- Final contractual payment, acceptance, ownership, warranty, liability, maintenance, on-call, priority, and service-level terms. Bounded informational copy remains approved meanwhile.
- Specific Meta/WhatsApp BSP, payment gateway, hosting provider, API vendor, licence, subscription, and third-party fee arrangements for an individual engagement.
- Guaranteed fragment preservation during language switching; route-root context preservation remains the accepted fallback.
- Custom imagery, icons, dark theme, broader design system, canonical production origin, sitemap language alternates, long-term hosting, analytics, and performance budgets.
- Whole-site accessibility conformance claims.

These decisions do not block the approved static text-led Services experience and must not be silently resolved during implementation.

## Progress

- 2026-09-05: Initiative 3 product/content, service, evidence, design, responsive, accessibility, anchor, CTA, and commercial-boundary decisions are approved in their authoritative owners. Web has one limited text-only evidence acknowledgement; WhatsApp and Consulting have no approved public evidence items.
- 2026-09-05: Governance review classified implementation as a versioned plan under `ADR-STATIC-LOCALIZED-ROUTING`. No consequential unresolved product or architecture decision, RFC, ADR amendment, dependency decision, provider decision, or release-only concern blocks implementation.
- 2026-09-05: `PLAN-SERVICES-EXPERIENCE` created as ACTIVE with three serial, reviewable implementation PRs. Task 1 is the single first implementation PR and changes no rendered behavior.

## Important implementation decisions

- Use three serial PRs: behavior-neutral content/anchor contracts, behavior-neutral primitive promotion, then one atomic bilingual rendered integration.
- Name exactly one first implementation PR: Task 1, `feat: add Services content and anchor contracts`.
- Keep the current minimum `servicesContent` compatible through PR 1, then remove it during the atomic integration so no duplicate public-copy owner survives.
- Model semantic service identity as `web | whatsapp | consulting`; map `consulting` to localized `consultoria`/`consulting` fragments in the existing route adapter.
- Keep `foundationRouteIds` unchanged because service fragments are document positions, not pages.
- Keep page-root language-switch fallback and avoid client hash state.
- Promote only the existing section-heading and content-card primitives to neutral commercial ownership, in an isolated no-behavior-change PR.
- Use one service section component for the shared commercial narrative while allowing explicit Web and WhatsApp level data to preserve their meaningful distinctions.
- Keep all evidence text-led and asymmetric; do not model empty public project collections.
- Treat the Contact form/privacy flow, richer evidence, provider selection, and final contractual terms as deferred work rather than blockers.

## Deviations discovered during execution

None at plan creation. While authoring the plan, `PAGE-SERVICES` gained the visible localized AI-note headings already required by `DESIGN-VISUAL`; this was a synchronization clarification, not a new service, section, architecture decision, or public claim.
