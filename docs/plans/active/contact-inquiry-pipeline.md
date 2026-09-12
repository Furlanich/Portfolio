---
id: PLAN-CONTACT-INQUIRY-PIPELINE
type: execution-plan
title: Contact + Inquiry Pipeline implementation plan
status: APPROVED
plan_status: ACTIVE
owners:
  - product
  - privacy
  - operations
  - frontend
  - qa
created: 2026-09-11
last_verified: 2026-09-12
related:
  - GOV-ENGINEERING-LIFECYCLE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-STATIC-LOCALIZED-ROUTING
  - REF-CONTACT-DEMO-KIT
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
---

# Contact + Inquiry Pipeline implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the complete bilingual Contact and Privacy experience as an explicitly labeled, local-only demonstration on the default GitHub Pages project site while preserving the tested Formspree boundary for a separately gated commercial activation.

**Architecture:** Locale-owned Spanish and English content feeds shared locale-agnostic components. The public demonstration form uses the existing pure validator and state contract with a new `createDemoSubmitInquiry()` adapter that simulates bounded success or failure entirely in browser memory and performs no network, mail, storage, logging, or analytics operation. The existing Formspree adapter remains dormant and tested; a later commercial activation requires a new plan and the real legal, processor, inbox, deletion, and domain-restriction evidence recorded by the earlier ADR.

**Tech Stack:** Next.js 16 App Router static export, React 18, TypeScript 5.5, existing React Hook Form 7.51, a pure reducer for submission phases, Tailwind CSS 3.4, Node test runner, Playwright 1.63, axe-core, GitHub Pages, and the provider-neutral inquiry boundary merged in PR #45.

**Spec:** [`PAGE-CONTACT` and `PAGE-PRIVACY`](../../product/pages/contact-and-privacy.md), constrained by [`ADR-CONTACT-INQUIRY-DEMO-MODE`](../../decisions/contact-inquiry-demonstration-mode.md), the retained [`ADR-CONTACT-INQUIRY-PIPELINE`](../../decisions/contact-inquiry-pipeline.md), [`DESIGN-VISUAL`](../../design/visual-language.md#contact-visual-baseline-approved), [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#contact-interaction-responsive-and-accessibility-baseline-approved), and [`REF-CONTACT-DEMO-KIT`](../../references/contact-inquiry-demonstration/index.md).

## Global constraints

- Deploy at `https://furlanich.github.io/Portfolio/`; retain `/Portfolio` as the GitHub Pages base path and preserve normal root builds for local verification.
- Keep Spanish at `/contacto/` and `/privacidad/`, English at `/en/contact/` and `/en/privacy/`, with trailing slashes and page-equivalent language switching.
- The deployed site is a portfolio and technical demonstration. It does not accept or process commercial inquiries through the form.
- Keep exactly four visible fields: required name, required email, optional company, and required problem/message. Do not add phone, budget, deadline, service selection, marketing consent, or file upload.
- Keep the full `IDLE -> VALIDATING -> SUBMITTING -> SUCCESS | ERROR` behavior, accessible validation, duplicate prevention, failure preservation, success reset, retry, and WhatsApp/email/phone fallback order.
- Demo success means only that the local scenario completed. Success and failure copy must state that no data was sent and no inquiry was created.
- The demonstration route imports `createDemoSubmitInquiry()` and never imports or calls `createFormspreeSubmitInquiry()`.
- Remove `NEXT_PUBLIC_FORMSPREE_ENDPOINT` from the GitHub Pages deployment environment. Local values must not change demonstration behavior.
- Do not add a backend, API route, Server Action, provider SDK, runtime localization library, CMS, CRM, analytics event, browser persistence, generic integration framework, CAPTCHA, or hosting migration.
- Tests and fixtures use `.invalid` addresses and synthetic prose. Never commit a real inquiry, provider endpoint/form ID, inbox evidence, cookie, credential, or private legal material.
- The dormant Formspree adapter stays provider-isolated. Automated tests never contact Formspree.
- Treat real processor facts, professional legal review, operational retention, inbox delivery, deletion, and Formspree domain restriction as future commercial-activation gates. Demonstration QA never marks them PASS.

## Classification and implementation boundary

Route: **ADR plus updated PLAN**. On 2026-09-12 the owner accepted a consequential deployment-mode change: the public site remains a non-commercial demonstration and may ship synthetic Contact resources only while the form transmits nothing. `ADR-CONTACT-INQUIRY-DEMO-MODE` records that decision without rewriting `ADR-CONTACT-INQUIRY-PIPELINE`.

Implementation may publish the demonstration Privacy disclosure and local-only form on `main`. It may reuse the accepted field/state/accessibility design and provider-neutral port. Reclassify and stop if work proposes real provider traffic, storage, inbox delivery, user tracking, a commercial-intake claim, a different host, private browser credentials, or copy that implies professional legal approval.

## Authoritative inputs

- `PAGE-CONTACT` owns the field contract, exact Spanish/English Contact copy for demonstration and dormant commercial modes, state behavior, fallback order, and acceptance criteria.
- `PAGE-PRIVACY` owns the exact deployed demonstration disclosure and the still-OPEN commercial disclosure requirements.
- `ADR-CONTACT-INQUIRY-DEMO-MODE` owns the local-only data flow, canonical GitHub Pages host, demonstration outcome semantics, and commercial reactivation boundary.
- `ADR-CONTACT-INQUIRY-PIPELINE` remains the accepted future Formspree transport architecture; it is not deployed by this plan.
- `REF-CONTACT-DEMO-KIT` owns the synthetic provider profile, safe QA controls, mock review record, and evidence sheets.
- `DESIGN-VISUAL` owns Contact composition and state surfaces. `DESIGN-IX-A11Y` owns semantics, focus, announcements, keyboard behavior, reflow, zoom, and the viewport matrix.
- `CONTENT-LOCALIZATION` owns Spanish `es-AR`, natural English adaptation, and the approved GitHub Pages canonical deployment URL.
- `TEST-STRATEGY` and `TEST-PLAYWRIGHT` own deterministic, browser, accessibility, visual, failure-artifact, and base-path procedures.

If this plan conflicts with an owner, the owner wins and this plan must be synchronized before implementation continues.

## Current-main baseline

Current `main` at `335822f` contains the provider-neutral inquiry types, pure validator, and direct-fetch Formspree adapter merged through [PR #45](https://github.com/Furlanich/Portfolio/pull/45). Focused adapter and validator tests pass without live network access. No public route imports this boundary.

`/contacto/` and `/en/contact/` still render the direct-channel `MinimumDestination`; Privacy routes and footer links do not exist. The deployment workflow passes `NEXT_PUBLIC_FORMSPREE_ENDPOINT`, but no current route consumes it. The application exports with `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`, producing `https://furlanich.github.io/Portfolio/`.

## Reviewable Pull Request sequence

| Order | Pull Request | Public behavior | Merge gate |
| --- | --- | --- | --- |
| Governance | `docs: approve Contact demonstration deployment` | None | New ADR, mock kit, exact bilingual demonstration copy, synchronized plan/status/indexes, docs-only diff |
| 2 — complete | [PR #45](https://github.com/Furlanich/Portfolio/pull/45), `feat: add the inquiry submission boundary` | None | Provider-neutral types/validator/Formspree adapter and deterministic tests merged into `main` |
| 3 | `feat: publish the demonstration Privacy experience` | Adds paired, accurately labeled demonstration Privacy routes and footer links | Exact owner copy, locale/route/static/base-path tests, browser/axe/manual/visual QA |
| 4 | `feat: publish the accessible Contact demonstration` | Replaces both minimum Contact pages with the four-field local simulation and retains fallbacks | Demo adapter/state/UI RED-GREEN evidence, success/failure Playwright, zero-transmission proof, accessibility/visual QA, endpoint removed from deploy workflow |
| 5 | `docs: record deployed Contact demonstration` | None | Live GitHub Pages verification, zero-transmission evidence, architecture synchronization, completed-plan move |

No Pull Request combines two rows. No implementation PR is stacked on an unmerged predecessor. Human review and merge remain mandatory.

## Exactly one next implementation task

After the governance amendment containing this plan is reviewed and merged, the **only authorized next implementation task** is **Task 3 / PR 3: publish the paired bilingual demonstration Privacy experience and footer links using the exact `PAGE-PRIVACY` copy**.

Task 4 must not begin until Task 3 is human-merged. Task 5 must not begin until Task 4 is human-merged and GitHub Pages finishes deploying it.

## Preserved commercial activation gates — not part of this delivery

The original commercial objective is deferred, not weakened. Before the form sends a real inquiry, a new or reactivated versioned plan must:

1. recheck current Formspree API, plan, schema, spam, limit, privacy, security, DPA, subprocessor, retention, and status materials;
2. configure Samuel's form, recipient, subject, `Reply-To`, schema, honeypot, filtering, and restriction to `furlanich.github.io`;
3. obtain complete processor, storage, log/backup, deletion, location, and international-transfer facts;
4. obtain professional Argentine privacy/legal review and exact bilingual commercial Privacy copy;
5. restore the endpoint only in approved deployment configuration and inject `createFormspreeSubmitInquiry()` only into the commercial mode;
6. run deterministic/rendered regression plus labeled staging acceptance, inbox, `Reply-To`, spam, and deletion proof before release;
7. run a production smoke/deletion check after human-reviewed cutover; and
8. remove every demonstration claim from the live form while retaining honest fallback/failure behavior.

Demonstration evidence marks these items **NOT APPLICABLE**, never PASS.

## Mandatory execution skills

| Skill | Required use |
| --- | --- |
| `architecture-governance` | Reconfirm demonstration scope and stop real-processing expansion. |
| `project-knowledge-maintenance` | Keep dual demonstration/commercial statuses and owners synchronized. |
| `frontend-implementation` | Govern public Privacy and Contact route work. |
| `test-driven-development` | Require observed RED before every testable change. |
| `design-taste-frontend-v1` | Apply repository-constrained preflight and critique. |
| `playwright-qa` | Supply repeatable route, keyboard, state, responsive, base-path, and axe evidence. |
| `visual-qa` | Judge every Contact state and both Privacy routes at required viewports. |
| `verification-before-completion` | Re-run fresh commands before commits and PR claims. |
| `pr-readiness` | Review `main...HEAD`, traceability, evidence, scope, secrets, and handoff. |

Use `systematic-debugging` only for unexpected behavior or failing tests, not intended TDD RED.

## Shared interfaces

The merged provider-neutral boundary remains:

```ts
export type InquiryField = 'name' | 'email' | 'company' | 'message';
export type InquiryValues = Record<InquiryField, string>;

export type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  locale: 'es-AR' | 'en';
  source: '/contacto/' | '/en/contact/';
};

export type InquirySubmissionResult =
  | { status: 'accepted' }
  | { status: 'invalid'; fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>> }
  | { status: 'failed'; reason: 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown' };

export type SubmitInquiry = (payload: InquiryPayload) => Promise<InquirySubmissionResult>;
```

Task 4 adds:

```ts
export type DemoSubmissionOptions = {
  delayMs?: number;
  wait?: (milliseconds: number) => Promise<void>;
};

export function createDemoSubmitInquiry(
  options?: DemoSubmissionOptions,
): SubmitInquiry;
```

The default delay is `650` ms. `failure@example.invalid` returns `failed/unavailable`; any other validated payload returns `accepted`. `ContactForm` receives `mode="demonstration"`, so `accepted` produces only simulated-success copy.

---

### Task 2 / PR 2: Provider-neutral boundary — COMPLETE

**Files delivered:** `lib/inquiry/contracts.ts`, `lib/inquiry/validation.ts`, `lib/inquiry/formspree.ts`, `scripts/inquiry-validation.test.mjs`, and `scripts/formspree-adapter.test.mjs`.

- [x] **Step 1: Observe literal validator and adapter RED assertions**
- [x] **Step 2: Implement the minimal contracts, pure validation, and direct-fetch adapter**
- [x] **Step 3: Pass focused tests, repository validation, and static export without a live request**
- [x] **Step 4: Human-review and merge PR #45 into `main`**

Evidence recorded 2026-09-12: focused suites passed 19/19; repository validation passed 78 tests, lint, typecheck, and build; static export passed for 18 routes at base path `/`; no live provider request occurred.

### Task 3 / PR 3: Publish the bilingual demonstration Privacy experience

**Files:**

- Create: `components/privacy/content-types.ts`
- Create: `components/privacy/PrivacyPage.tsx`
- Create: `app/(es)/_content/privacy.ts`
- Create: `app/(en)/en/_content/privacy.ts`
- Create: `app/(es)/privacidad/page.tsx`
- Create: `app/(en)/en/privacy/page.tsx`
- Create: `scripts/privacy-content.test.mjs`
- Create: `scripts/privacy-route.test.mjs`
- Create: `tests/e2e/privacy.spec.ts`
- Modify: `lib/site-routes.ts`
- Modify: `lib/foundation-navigation.ts`
- Modify: `components/foundation/SiteFooter.tsx`
- Modify: `app/(es)/page.tsx`, `app/(es)/servicios/page.tsx`, `app/(es)/proyectos/page.tsx`, `app/(es)/proyectos/[projectSlug]/page.tsx`, `app/(es)/estudio/page.tsx`, `app/(es)/estudio/samuel-furlanich/page.tsx`, `app/(es)/contacto/page.tsx`, `app/(en)/en/page.tsx`, `app/(en)/en/services/page.tsx`, `app/(en)/en/work/page.tsx`, `app/(en)/en/work/[projectSlug]/page.tsx`, `app/(en)/en/about/page.tsx`, `app/(en)/en/about/samuel-furlanich/page.tsx`, and `app/(en)/en/contact/page.tsx`
- Modify: `scripts/verify-static-export.mjs`
- Modify: this plan only for actual evidence

**Interfaces:**

- Consumes: exact demonstration Privacy copy in `PAGE-PRIVACY`, `REF-CONTACT-DEMO-PROVIDER`, and existing localized route/footer conventions.
- Produces: `privacy` route equivalence, shared semantic `PrivacyPage`, paired static routes, and footer destinations. It creates no form, provider call, client state, or commercial legal claim.

- [ ] **Step 1: Read Next.js 16 references and required Skills**

  Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `frontend-implementation`, `test-driven-development`, `playwright-qa`, and the owning product/design/testing records.

- [ ] **Step 2: Write literal Privacy content and route RED tests**

  Assert one locale per module; exact demonstration heading/lead and required facts; no Formspree, inbox-delivery, DPA, legal-approval, consent-sufficiency, or commercial-processing claim; `/privacidad/` ↔ `/en/privacy/`; correct language switching; one H1/main; ordered headings; footer links on every route; and root/base-path-safe links.

- [ ] **Step 3: Run focused RED**

  Run `node --test scripts/privacy-content.test.mjs scripts/privacy-route.test.mjs scripts/site-routes.test.mjs`. Expected: explicit missing route/content assertions. Import, syntax, or harness errors do not count as RED.

- [ ] **Step 4: Implement locale-owned content and shared composition**

  Use only exact `PAGE-PRIVACY` text. Render semantic headings, paragraphs, and lists with readable measure. Identify GitHub Pages hosting metadata, local-only form memory, no submission/inbox/storage, external fallback boundaries, absence of inquiry analytics, value lifetime, questions route, and future commercial re-review. Add no fake lawyer, controller address, DPA, safeguard, provider chain, or legal conclusion.

- [ ] **Step 5: Add paired routes, equivalence, and footer destinations**

  Add `privacy` to the typed route/equivalence maps. Render existing localized shells without changing primary navigation. Add localized footer links across every current route shell, preserving trailing slashes and base-path resolution.

- [ ] **Step 6: Reach deterministic GREEN and verify both exports**

  Run the focused Node suite, `npm run validate`, and `npm run verify:static-export`, then rebuild with `$env:NEXT_PUBLIC_BASE_PATH='/Portfolio'` and repeat static verification before removing the environment variable.

- [ ] **Step 7: Run Playwright, accessibility, and visual QA**

  Run the focused Privacy spec under existing projects and representative axe coverage. Manually inspect both locales at `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900`, plus 200% zoom, keyboard focus, reduced motion, wrapping, and JavaScript-disabled semantics.

- [ ] **Step 8: Review and open PR 3**

  Inspect `main...HEAD` for invented facts, commercial claims, duplicate public copy, unrelated shell changes, generated artifacts, secrets, or form behavior. Commit `feat: publish the demonstration Privacy experience`, open the evidence-backed PR, and stop before merge.

### Task 4 / PR 4: Publish the accessible Contact demonstration

**Files:**

- Create: `lib/inquiry/demo.ts`
- Create: `scripts/demo-inquiry-adapter.test.mjs`
- Create: `components/contact/state.ts`
- Create: `scripts/contact-state.test.mjs`
- Create: `components/contact/content-types.ts`
- Create: `components/contact/ContactForm.tsx`
- Create: `components/contact/ContactPage.tsx`
- Create: `app/(es)/_content/contact.ts`
- Create: `app/(en)/en/_content/contact.ts`
- Create: `scripts/contact-content.test.mjs`
- Create: `scripts/contact-route.test.mjs`
- Create: `tests/e2e/contact.spec.ts`
- Modify: `app/(es)/contacto/page.tsx`
- Modify: `app/(en)/en/contact/page.tsx`
- Modify: `.github/workflows/deploy.yml`
- Modify: `playwright.config.ts` only if focused project selection changes
- Modify: `scripts/verify-static-export.mjs`
- Modify: this plan only for actual evidence

**Interfaces:**

- Consumes: merged `validateInquiry()` and contracts, exact `PAGE-CONTACT` demonstration copy, `REF-CONTACT-DEMO-PROVIDER`, Task 3 Privacy routes, and current fallback facts.
- Produces: complete paired Contact routes with local-only simulation. It does not import the Formspree adapter or receive an endpoint.

- [ ] **Step 1: Read Next.js form/client/environment references and required Skills**

  Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`, `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, plus `frontend-implementation`, `test-driven-development`, `playwright-qa`, and owning records.

- [ ] **Step 2: Write adapter RED, implement, and reach GREEN**

  Assert default/injected delay, accepted path, case-insensitive reserved failure, no mutation, one wait, no retry, no global `fetch`, no endpoint, and no storage/logging dependency. Run `node --test scripts/demo-inquiry-adapter.test.mjs`; require the explicit missing-export RED, implement the exact factory, and rerun GREEN.

- [ ] **Step 3: Write state RED, implement, and reach GREEN**

  Assert legal transitions, every invalid field, first-invalid focus, one active submission, ignored duplicate, failure preservation, success reset, retry, stale-result protection, and safe reason handling. Keep strings, DOM refs, React Hook Form, timers, and adapters outside the reducer.

- [ ] **Step 4: Write content, route, and rendered RED tests**

  Assert field order/limits, required/optional labels, demo notice, submit/progress/success/failure text, fallback note/order, Privacy/Founder links, both locale/source values, no delivery wording, missing Formspree route import, and the full association/focus/status contract. Playwright covers `success@example.invalid`, `failure@example.invalid`, multi-field validation, duplicate activation, retry, preservation/reset, JavaScript fallback, and a network guard that fails on XHR, fetch, beacon, navigation, or requests containing values.

- [ ] **Step 5: Implement the shared page and small Client form**

  Keep route shells/page composition as Server Components. `ContactForm` is the smallest Client Component and receives locale, exact content, `mode="demonstration"`, and the demo `SubmitInquiry`. Use React Hook Form for values/errors and the pure reducer for phase. Never read an endpoint, use Formspree copy, write storage, log values, or auto-retry.

- [ ] **Step 6: Remove the endpoint from deployment**

  Delete only `NEXT_PUBLIC_FORMSPREE_ENDPOINT` from `.github/workflows/deploy.yml`. Add a deterministic assertion that deployed Contact imports `lib/inquiry/demo.ts`, not `lib/inquiry/formspree.ts`, and the deploy workflow supplies no endpoint.

- [ ] **Step 7: Reach deterministic and browser GREEN**

  Run all inquiry/demo/state/content/route Node suites, the focused Contact Playwright spec, `npm run validate`, root static verification, and `/Portfolio` build/static verification. Confirm no provider request and that dormant Formspree tests remain green.

- [ ] **Step 8: Complete accessibility and visual QA**

  Exercise idle, validation, submitting, simulated success, and simulated failure in both locales at every approved viewport. Verify keyboard-only completion/retry, focus and live announcements, 200% zoom, textarea resize, targets, reduced motion, no overflow, fallback hierarchy, axe, and zero inquiry-value network traffic.

- [ ] **Step 9: Review and open PR 4**

  Inspect `main...HEAD` for endpoint leakage, Formspree route imports, inquiry data, storage/logging, false delivery copy, unguarded network behavior, new dependencies, unrelated refactors, or generated QA artifacts. Commit `feat: publish the accessible Contact demonstration`, open the PR, and stop before merge.

### Task 5 / PR 5: Verify the deployed demonstration and close the plan

**Files:**

- Modify: `ARCHITECTURE.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/index.md`
- Modify: `docs/governance/status-register.md`
- Modify: `docs/index.md`
- Modify: `docs/product/site-feature-catalogue.md`
- Move: this plan to `docs/plans/completed/contact-inquiry-pipeline.md`
- Modify: `docs/plans/index.md`

- [ ] **Step 1: Verify the final GitHub Pages routes**

  Verify `/Portfolio/contacto/`, `/Portfolio/en/contact/`, `/Portfolio/privacidad/`, and `/Portfolio/en/privacy/`; switching, assets, footer, fallbacks, and console health at `https://furlanich.github.io/Portfolio/`.

- [ ] **Step 2: Prove deployed success, failure, and zero transmission**

  Submit labeled `.invalid` values in both locales. Confirm loading, duplicate prevention, focused status/alert, failure preservation, retry, success reset, exact no-send copy, and no form value, Formspree request, mail action, beacon, navigation, or storage write during submission.

- [ ] **Step 3: Repeat deployed accessibility and visual checks**

  Run the proportionate browser, viewport, keyboard, zoom, reduced-motion, axe, and manual matrix against the deployed site. Record evidence using `REF-CONTACT-DEMO-REVIEW`; do not claim whole-site WCAG conformance.

- [ ] **Step 4: Synchronize current state and close the plan**

  Record only observed facts. Mark demonstration Contact/Privacy complete; keep commercial Formspree activation, legal review, processor facts, inbox delivery, deletion, and restriction OPEN. Run docs validation, move this plan to `completed/`, open `docs: record deployed Contact demonstration`, and stop before merge.

## Verification contract

Every implementation PR runs fresh `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run verify:static-export`, and `git diff --check`. Tasks 3 and 4 also run focused Node/Playwright suites, both export modes, representative axe coverage, and manual/visual checks.

Automated checks do not replace manual semantics, announcement, contrast, reading order, zoom, keyboard, reduced motion, and rendered hierarchy review. Screenshots remain ignored transient evidence unless a separate human-approved baseline change authorizes them.

Every PR body records upstream IDs, scope/non-goals, RED/GREEN evidence, commands, browser/axe/manual/visual results, base-path evidence, mock usage, zero-transmission proof, OPEN commercial gates, rollback, and human merge authority.

## Rollback

If Task 3 fails, revert it and retain the site without Privacy routes. If Task 4 fails, restore the direct-channel `MinimumDestination`; do not switch to Formspree. The dormant adapter may remain because no public route imports it. A human-reviewed revert and redeploy restores the previous static site.

## Out of scope

- Real inquiry processing, email notification, inbox delivery, provider acceptance/storage, or deletion operations.
- Claims that the site accepts clients, quotes work, forms a commercial relationship, or has professional legal approval.
- Another provider, backend, hosting migration, SDK, generic integration, CRM, marketing, analytics, file upload, or extra intake fields.
- CAPTCHA, browser persistence, offline queue, automatic retry, exactly-once claims, or synthetic data resembling a real person.
- Whole-site conformance, broader metadata work beyond the approved GitHub Pages URL, or redesign of unrelated showcase pages.

## Progress

- 2026-09-10: Governance PR #43 accepted Formspree behind the narrow provider-neutral boundary for a future commercial release.
- 2026-09-11: Planning PR #44 recorded the original commercial delivery sequence.
- 2026-09-12: Sanitized provider probes were reported, but processor/transfer facts and professional legal review remained unavailable.
- 2026-09-12: PR #45 merged the provider-neutral contracts, validator, and Formspree adapter. No public route or live request was added.
- 2026-09-12: The owner selected `https://furlanich.github.io/Portfolio/` as the lasting host, classified the site as a non-commercial showcase, authorized mock resources on `main`, and approved a local-only Contact simulation. `ADR-CONTACT-INQUIRY-DEMO-MODE` records the decision.
- 2026-09-12: The active sequence now targets demonstrative Privacy and Contact publication followed by live zero-transmission verification. Commercial activation is a separately gated later initiative.

## Important implementation decisions

- Keep every four-field UI, accessibility, and state feature; change only submission meaning/transport in the deployed demonstration.
- Use a local adapter behind the merged port so a later reviewed Formspree activation changes injection/copy rather than rebuilding the form.
- Publish truthful demonstration Privacy copy instead of invented controller, DPA, subprocessor, retention, transfer, or lawyer facts.
- Remove the endpoint from deployment and prove zero transmission at unit, browser, static, and deployed layers.
- Keep real fallback links for behavioral demonstration but state that they invoke external services and do not constitute form delivery or accepted commercial intake.
- Treat the default GitHub Pages project URL as final; no custom domain is required.

## Deviations discovered during execution

- 2026-09-12 owner-approved scope change: the project remains a non-commercial demonstration on the default GitHub Pages URL. Tasks 3–5 no longer wait for commercial legal/provider evidence because they deploy a zero-transmission simulation and truthful disclosure. The earlier Formspree ADR remains dormant future architecture; none of its commercial gates are recorded as passed.
