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
last_verified: 2026-09-11
related:
  - GOV-ENGINEERING-LIFECYCLE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-STATIC-LOCALIZED-ROUTING
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
---

# Contact + Inquiry Pipeline implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the complete bilingual Contact and Privacy experience, including a four-field in-site inquiry form that uses the approved Formspree boundary, reaches Samuel's configured inbox, fails accessibly and recoverably, and remains compatible with the static GitHub Pages deployment.

**Architecture:** Locale-owned Spanish and English content feeds shared locale-agnostic Server Components. A deliberately small Client Component owns the approved form state and calls a provider-neutral `SubmitInquiry` port; a single direct-`fetch` Formspree adapter owns the public endpoint and provider response mapping. Provider configuration, privacy/legal closure, staged inbox proof, and post-deploy verification are hard gates around the code sequence.

**Tech Stack:** Next.js 16 App Router static export, React 18, TypeScript 5.5, existing React Hook Form 7.51 for field registration/values/errors, a pure reducer for submission phases, Tailwind CSS 3.4, Node test runner, Playwright 1.63, axe-core, Formspree, GitHub Pages.

**Spec:** [`PAGE-CONTACT` and `PAGE-PRIVACY`](../../product/pages/contact-and-privacy.md), constrained by [`ADR-CONTACT-INQUIRY-PIPELINE`](../../decisions/contact-inquiry-pipeline.md), [`DESIGN-VISUAL`](../../design/visual-language.md#contact-visual-baseline-approved), and [`DESIGN-IX-A11Y`](../../design/interaction-responsive-accessibility.md#contact-interaction-responsive-and-accessibility-baseline-approved).

## Global constraints

- Keep Spanish at `/contacto/` and `/privacidad/`, English at `/en/contact/` and `/en/privacy/`, with trailing slashes and page-equivalent language switching.
- Preserve `output: 'export'`, GitHub Pages, the optional `/Portfolio` base path, and Server Components outside the narrow interactive form island.
- Use Formspree only through `submitInquiry()`; do not add a provider SDK, backend, API route, Server Action, CMS, CRM, analytics event, generic integration framework, or hosting migration.
- Ship only name, email, optional company, message, `es-AR | en`, canonical localized source, and the empty provider honeypot. Do not ship recipient routing, mail headers, private credentials, files, sensitive-data helpers, analytics IDs, referrer chains, or client timestamps.
- Normalize surrounding whitespace only in the validated payload. Preserve the visitor's entered form values through validation and every non-acceptance result.
- Maximums are name 100, email 254, company 120, and message 4,000 characters; the serialized UTF-8 request must remain at or below 24 KiB.
- `SUCCESS` means documented provider acceptance, not inbox receipt or reading. Only the labeled live smoke proves delivery.
- Do not automatically retry. Prevent clicks, Enter, or programmatic submission from creating a second request while one is active.
- Keep WhatsApp, email, and phone available in that order. Missing or invalid public endpoint configuration fails closed to the working direct-channel experience.
- Keep interactive CAPTCHA disabled. Any later challenge requires separate privacy, accessibility, localization, and governance review.
- Never place inquiry content, raw provider responses, real prospect data, the production form ID when a placeholder suffices, or private configuration in tests, logs, screenshots, URLs, analytics, commits, or Pull Request text.
- Treat professional Argentine legal review, exact processor/subprocessor facts, transfer treatment, final production hostname, domain restriction, retention/deletion evidence, and live inbox delivery as release gates. Do not infer legal conclusions.
- Every implementation PR starts from current `main` after its predecessor is human-merged, uses a short-lived `codex/` branch, records meaningful RED/GREEN evidence, runs the applicable deterministic and rendered gates, opens for human review, and stops before merge.

---

## Classification and implementation boundary

Route: **PLAN plus ADR**. The architecture was accepted in Governance PR #43 and is recorded by `ADR-CONTACT-INQUIRY-PIPELINE`; the remaining delivery is substantial, multi-phase, privacy-sensitive work requiring this active versioned plan.

This planning PR may create the ADR, mark the accepted RFC, synchronize status/index summaries, and add this plan. It must not change `app/`, `components/`, `lib/`, `scripts/`, `tests/`, package manifests, build configuration, workflows, provider accounts, deployment variables, or public behavior.

Implementation may use the accepted public Formspree endpoint, static localized routes, existing React/React Hook Form/Tailwind stack, and existing test harness. Reclassify and stop if execution proposes a different processor, backend, route/hosting model, private browser credential, interactive challenge, analytics/CRM use, new runtime dependency, materially different retention, or any unresolved legal/product/design decision.

## Authoritative inputs

- `PAGE-CONTACT` owns exact Spanish and English labels, helper text, validation messages, loading, success, failure, retry, response expectation, fallback order, contact facts, and Founder-context links.
- `PAGE-PRIVACY` owns the factual notice scope and receives professionally reviewed exact bilingual wording based on verified deployment facts.
- `CONTENT-LOCALIZATION` owns Spanish `es-AR`, natural English adaptation, and the prohibition on guessed processor/legal wording.
- `DESIGN-VISUAL` owns the source/visual hierarchy, 8/4 wide split, single-column fields, control dimensions, colors, status surfaces, and no-CAPTCHA composition.
- `DESIGN-IX-A11Y` owns form semantics, associated descriptions/errors, busy state, focus, live announcements, keyboard behavior, progressive availability, and the exact viewport/base-path/manual review matrix.
- `ADR-CONTACT-INQUIRY-PIPELINE` owns Formspree, the typed boundary, public configuration posture, security/abuse model, acceptance semantics, operations, and migration boundary.
- `ADR-STATIC-LOCALIZED-ROUTING` owns locale route trees, locale-owned content, shared locale-agnostic components, static export, trailing slashes, and base-path compatibility.
- `TEST-STRATEGY`, `TEST-PLAYWRIGHT`, and `TEST-VISUAL-REGRESSION` own deterministic, browser, axe, manual, snapshot, and static-artifact evidence.

If this plan conflicts with an owner, the owner wins and this plan must be synchronized before production work continues.

## Current-main baseline

At plan creation, `/contacto/` and `/en/contact/` render `MinimumDestination` with response copy plus working WhatsApp, email, and phone links. They have no form. `contactContent` is also the shared owner for direct-channel facts used by other pages and the footer. Privacy routes do not exist, Privacy is absent from the semantic route map and footer, and the deployed workflow already passes `NEXT_PUBLIC_FORMSPREE_ENDPOINT` as a public build-time value without a current consumer. `react-hook-form` is installed but unused. The Node, Playwright, axe, visual, and static-export harnesses are present.

## Reviewable Pull Request sequence

| Order | Pull Request | Public behavior | Merge gate |
| --- | --- | --- | --- |
| Planning | `docs: plan Contact inquiry delivery` | None | ADR/RFC/status synchronization, active plan, docs check, complete docs-only diff review |
| 1 | `docs: close Contact provider and privacy gates` | None | Verified Formspree configuration facts, final hostname, professional legal review, exact bilingual Privacy copy, sanitized staging/deletion evidence |
| 2 | `feat: add the inquiry submission boundary` | None | Provider-neutral contract, pure validation, Formspree adapter, fail-closed configuration, deterministic RED/GREEN tests, no live network |
| 3 | `feat: publish the bilingual Privacy experience` | Adds accurate Privacy routes/footer links; Contact remains direct-channel only | Exact Task 1 facts/copy, paired routes, footer coverage, static/base-path/browser/axe validation |
| 4 | `feat: launch the accessible Contact inquiry form` | Atomically replaces both minimum Contact routes with the complete form | Unit/state/adapter tests, Playwright success/failure, accessibility and visual QA, normal/base-path exports, real staged inbox/Reply-To/deletion proof before merge |
| 5 | `docs: record Contact inquiry release verification` | None | Production-host smoke, final domain restriction, cleanup/deletion evidence, architecture synchronization, completed-plan move |

No Pull Request combines two rows. No implementation PR is stacked on an unmerged predecessor. PR 4 is the only release cutover; its branch may exercise a real staging submission, but automated CI remains provider-isolated.

## Exactly one first implementation task

After the planning PR is human-reviewed and merged, the **only authorized first implementation task** is **Task 1 / PR 1: provision and verify the dedicated Formspree form, complete professional privacy/legal review, and record the exact non-secret deployment facts and bilingual Privacy copy in a docs-only PR**.

Do not begin the adapter, Privacy route, or Contact UI tasks until Task 1 is reviewed and merged. If the final hostname, processor chain, retention/deletion behavior, or legally sufficient notice remains unresolved, keep Task 1 open and stop; architecture approval is not permission to guess those release facts.

## Mandatory execution skills

| Skill | Required use |
| --- | --- |
| `architecture-governance` | Reconfirm accepted scope at every PR boundary and route any newly consequential decision before implementation expands. |
| `project-knowledge-maintenance` | Update the authoritative owner once, preserve item statuses, and keep plan/status/index summaries coherent. |
| `frontend-implementation` | Govern public Privacy and Contact routes in PRs 3 and 4. |
| `test-driven-development` | Require observed RED before every testable behavior change in PRs 2–4. |
| `design-taste-frontend-v1` | Constrained preflight and post-implementation critique for PRs 3 and 4; repository design remains authoritative. |
| `playwright-qa` | Repeatable route, interaction, keyboard, browser, responsive, base-path, and axe evidence in PRs 3 and 4. |
| `visual-qa` | Human/agent rendered judgment for all approved Contact states and both Privacy routes in PRs 3 and 4. |
| `verification-before-completion` | Fresh command and evidence review before commits, PR claims, and task transitions. |
| `pr-readiness` | Full `main...HEAD` review, traceability, validation report, and human-review handoff for every PR. |

Use `systematic-debugging` only for an unexpected failure or defect, not for an intended TDD RED.

## File structure and interfaces

### Provider-neutral inquiry boundary

| File | Responsibility |
| --- | --- |
| `lib/inquiry/contracts.ts` | Raw values, approved fields, normalized payload, internal validation codes, provider-neutral result, and `SubmitInquiry` type. |
| `lib/inquiry/validation.ts` | Pure trimming, required/email/length validation, locale/source binding, and 24 KiB ceiling with no browser or provider dependency. |
| `lib/inquiry/formspree.ts` | One direct-`fetch` adapter, endpoint validation, exact request serialization, timeout/abort, and documented response mapping. |
| `scripts/inquiry-validation.test.mjs` | Literal table-driven validation and payload tests. |
| `scripts/formspree-adapter.test.mjs` | Injected-fetch contract tests for request shape and every accepted failure category without network access. |

The shared interface is:

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

export type InquiryValidationCode =
  | 'required'
  | 'invalid-email'
  | 'max-length'
  | 'request-too-large';

export type InquirySubmissionResult =
  | { status: 'accepted' }
  | {
      status: 'invalid';
      fieldErrors: Partial<Record<InquiryField, InquiryValidationCode>>;
    }
  | {
      status: 'failed';
      reason: 'rate-limited' | 'misconfigured' | 'unavailable' | 'unknown';
    };

export type SubmitInquiry = (
  payload: InquiryPayload,
) => Promise<InquirySubmissionResult>;
```

`createFormspreeSubmitInquiry({ endpoint, fetchImpl, timeoutMs })` produces `SubmitInquiry`. Its default timeout is 10,000 ms. Tests inject `fetchImpl`; production uses browser `fetch`. The adapter sends `POST` JSON with `Accept: application/json` and `Content-Type: application/json`, the six allowlisted payload properties, and `_gotcha: ''`. It requires a recognized JSON object with `ok: true` on a 2xx response for `accepted`; allowlisted Formspree field errors map to internal validation codes, never provider prose. HTTP 429 maps to `rate-limited`; missing/malformed endpoint and documented inactive/missing-form conditions map to `misconfigured`; abort, network, and 5xx map to `unavailable`; every other status, malformed JSON, unknown field error, and unexpected shape maps to `unknown`.

### Contact presentation boundary

| File | Responsibility |
| --- | --- |
| `components/contact/content-types.ts` | Complete localized Contact content model, including field/state/accessibility copy and direct alternatives. |
| `components/contact/state.ts` | Pure form-state reducer and synchronous in-flight guard transitions independent of React rendering and provider transport. |
| `components/contact/ContactPage.tsx` | Locale-agnostic Server Component for intro, response expectation, form/supporting grid, alternatives/location, and Founder context. |
| `components/contact/ContactForm.tsx` | Narrow Client Component for form values, validation, `IDLE/VALIDATING/SUBMITTING/SUCCESS/ERROR`, focus, announcements, retry, and `SubmitInquiry`. |
| `app/(es)/_content/contact.ts` | Exact `PAGE-CONTACT` Spanish content plus the existing shared direct-channel facts. |
| `app/(en)/en/_content/contact.ts` | Exact `PAGE-CONTACT` English content plus the existing shared direct-channel facts. |

The route entry passes locale, localized content, resolved Privacy/Founder links, and the build-time public endpoint. When the endpoint is absent or invalid, it retains the current usable direct-channel destination and does not render a submit control that cannot work. When configured, both localized routes render the same shared form behavior with locale-owned copy and payload source.

### Privacy presentation boundary

| File | Responsibility |
| --- | --- |
| `components/privacy/content-types.ts` | Typed, locale-owned Privacy sections without provider lookup or runtime translation. |
| `components/privacy/PrivacyPage.tsx` | Shared locale-agnostic semantic Privacy composition. |
| `app/(es)/_content/privacy.ts` | Professionally reviewed Spanish disclosure from Task 1. |
| `app/(en)/en/_content/privacy.ts` | Professionally reviewed English disclosure from Task 1. |
| `app/(es)/privacidad/page.tsx` | Spanish route shell using the existing header/footer. |
| `app/(en)/en/privacy/page.tsx` | English route shell using the existing header/footer. |

`privacy` becomes a semantic route ID in `lib/site-routes.ts`, a page-equivalent route in `lib/foundation-navigation.ts`, and a visible footer destination on every current public route. Privacy content names verified facts; it does not parse the endpoint or infer the Formspree plan at runtime.

---

### Task 1 / PR 1: Close provider, privacy, and legal gates

**Files:**

- Modify: `docs/product/pages/contact-and-privacy.md`
- Modify: `docs/product/content-and-localization.md`
- Modify: `docs/governance/status-register.md`
- Modify: `docs/plans/active/contact-inquiry-pipeline.md`
- No application, test, dependency, workflow, environment, or provider identifier file is committed.

**Interfaces:**

- Consumes: `ADR-CONTACT-INQUIRY-PIPELINE`, the provisioned Samuel-controlled Formspree account, final production hostname, provider agreements/materials, and professional Argentine legal review.
- Produces: exact approved Spanish and English Privacy copy; verified processor/subprocessor, storage, metadata, transfer, retention, request, quota, delivery, domain, schema, and deletion facts that Tasks 2–5 may implement and test.

- [ ] **Step 1: Re-verify current first-party provider facts**

  Recheck the official Formspree AJAX, Workflow validation, allowed-field schema, `Reply-To`, subject, honeypot, spam, domain restriction, system/account limits, privacy, terms, security, DPA, subprocessor, and status materials already linked by the RFC. Record the check date and any change against the ADR in the PR body. If a change invalidates the accepted architecture, stop and open governance work rather than editing the ADR.

- [ ] **Step 2: Provision the dedicated form and account controls**

  Samuel provisions or verifies a Samuel-controlled account with MFA and a dedicated FURLANICH form. Configure the exact six business fields, required/type/max-length rules, undeclared-field and file rejection, `_gotcha`, Formshield, CAPTCHA-off posture, final hostname restriction, verified recipient, fixed `[FURLANICH] Website inquiry` subject, visitor `email` as `Reply-To`, labeled body, provider receipt time, and quota notifications. Recipient and mail credentials remain provider-side; the public endpoint is stored only in approved deployment/staging configuration.

- [ ] **Step 3: Exercise provider controls with labeled synthetic probes**

  From an approved staging origin, submit synthetic boundary cases for missing required fields, malformed email, every maximum plus one, undeclared field, file content, filled honeypot, allowed origin, disallowed origin, and quota/rate behavior that can be tested without abuse. Verify the provider result against the accepted mapping. Record sanitized PASS/FAIL facts and timestamps; do not commit response bodies, real addresses beyond the already-public business contact, cookies, account screenshots, form IDs, or submission content.

- [ ] **Step 4: Verify storage, deletion, delivery-chain, and transfer facts**

  Confirm the applicable plan, stored-history duration, deletion procedure, backup/log exceptions, DPA, current material infrastructure and email-delivery subprocessors, processing locations, safeguards, account access, Gmail copy, request-handling procedure, and quota owner. Perform and delete a labeled synthetic submission to prove the procedure. If provider content cannot be demonstrably removed within the approved target or accurately disclosed, stop this plan and escalate.

- [ ] **Step 5: Complete professional privacy/legal review**

  Obtain review of the responsible identity, Ley 25.326 Article 6 notice, lawful basis/consent presentation, database obligations, processor agreement, Article 12/international-transfer safeguards, access/correction/deletion handling, and retention wording. Record only the approved outcome and public wording. Keep any unresolved legal issue `OPEN`; do not let implementation copy make the legal conclusion.

- [ ] **Step 6: Write the exact bilingual Privacy owner text**

  Update `PAGE-PRIVACY` with final Spanish and natural English public copy that names the verified responsible party, GitHub Pages/GitHub, Formspree, confirmed material subprocessors, Google/Gmail, submitted fields, ordinary metadata, purpose, no-marketing boundary, international processing/safeguards, provider and mailbox retention, sensitive-data warning, and access/correction/deletion request route. Update statuses only to the level actually supported by provider evidence and professional review.

- [ ] **Step 7: Validate and open PR 1**

  Run `npm run docs:check`, inspect `main...HEAD` for documentation-only scope, secrets, provider IDs, prospect data, screenshots, and accidental status upgrades, then open `docs: close Contact provider and privacy gates`. Stop before merge.

### Task 2 / PR 2: Add the provider-neutral contract and Formspree adapter

**Files:**

- Create: `lib/inquiry/contracts.ts`
- Create: `lib/inquiry/validation.ts`
- Create: `lib/inquiry/formspree.ts`
- Create: `scripts/inquiry-validation.test.mjs`
- Create: `scripts/formspree-adapter.test.mjs`
- Modify: `docs/plans/active/contact-inquiry-pipeline.md` only for actual evidence/progress

**Interfaces:**

- Consumes: the `InquiryValues`, `InquiryPayload`, `InquirySubmissionResult`, and `SubmitInquiry` signatures defined above plus Task 1's verified Formspree response/control facts.
- Produces: `validateInquiry(values, locale)` and `createFormspreeSubmitInquiry(options): SubmitInquiry` for the future form. No route imports them yet.

- [ ] **Step 1: Write literal validation RED tests**

  Add table-driven tests for surrounding trim, required name/email/message, email syntax, all exact maximums and maximum-plus-one cases, optional company omission, `es-AR`/`/contacto/` and `en`/`/en/contact/` binding, unsupported field exclusion, Unicode byte counting, and the 24 KiB ceiling. Hand-derive expectations; do not call production helpers to build them.

- [ ] **Step 2: Run the focused validation RED**

  Run `node --test scripts/inquiry-validation.test.mjs`. The test uses a guarded dynamic import that converts the absent implementation into an explicit assertion failure. Expected: FAIL with `validateInquiry has not been implemented`, while existing tests remain untouched; do not accept a syntax, resolution, or harness error as RED.

- [ ] **Step 3: Implement the minimal pure contract and validator**

  Add only the types and pure behavior required by the tests. Return every field error at once, preserve raw `InquiryValues` outside the function, and create the normalized payload only when valid. Do not add localized prose, browser state, Formspree fields, logging, retries, or a general schema framework.

- [ ] **Step 4: Run validation GREEN and refactor while green**

  Run `node --test scripts/inquiry-validation.test.mjs`, confirm all cases pass, then remove duplication without changing the public signatures and rerun the same command.

- [ ] **Step 5: Write adapter RED tests with an injected fetch double**

  Prove the exact method, headers, allowlisted JSON, empty-company omission, `_gotcha`, locale/source, request ceiling, one request, 10-second abort, and zero automatic retry. Add provider fixtures for recognized `{ ok: true }` acceptance; approved field errors; unknown/provider-only fields; 400/403/404/422; 429; 5xx; inactive/missing form; network rejection; abort; malformed JSON; empty body; and unexpected JSON. Assert only provider-neutral results and ensure raw messages never appear.

- [ ] **Step 6: Run the adapter RED**

  Run `node --test scripts/formspree-adapter.test.mjs`. The guarded dynamic import converts the absent export into an explicit assertion failure. Expected: FAIL with `createFormspreeSubmitInquiry has not been implemented` while validation tests remain green; fix any syntax, resolution, or harness error before proceeding.

- [ ] **Step 7: Implement the minimal Formspree adapter**

  Validate an HTTPS `formspree.io` form endpoint, serialize the exact transport, call injected/browser fetch once with an `AbortController`, clear its timer, and map only the verified response shapes to the accepted union. Do not import React, read DOM state, translate messages, log payloads, contact the real provider, or add a dependency.

- [ ] **Step 8: Run focused and complete GREEN**

  Run:

  ```powershell
  node --test scripts/inquiry-validation.test.mjs scripts/formspree-adapter.test.mjs
  npm run validate
  npm run verify:static-export
  ```

  `verify:static-export` uses the build produced by `npm run validate`. Confirm Contact artifacts remain the existing direct-channel pages and no live request occurred.

- [ ] **Step 9: Review and open PR 2**

  Inspect `main...HEAD` for route/UI changes, inquiry data, provider IDs, network-capable tests, new dependencies, logging, or generalized abstractions. Open `feat: add the inquiry submission boundary` with RED/GREEN evidence and stop before merge.

### Task 3 / PR 3: Publish the bilingual Privacy experience

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
- Modify: `app/(es)/page.tsx`
- Modify: `app/(es)/servicios/page.tsx`
- Modify: `app/(es)/proyectos/page.tsx`
- Modify: `app/(es)/proyectos/[projectSlug]/page.tsx`
- Modify: `app/(es)/estudio/page.tsx`
- Modify: `app/(es)/estudio/samuel-furlanich/page.tsx`
- Modify: `app/(es)/contacto/page.tsx`
- Modify: `app/(en)/en/page.tsx`
- Modify: `app/(en)/en/services/page.tsx`
- Modify: `app/(en)/en/work/page.tsx`
- Modify: `app/(en)/en/work/[projectSlug]/page.tsx`
- Modify: `app/(en)/en/about/page.tsx`
- Modify: `app/(en)/en/about/samuel-furlanich/page.tsx`
- Modify: `app/(en)/en/contact/page.tsx`
- Modify: `scripts/site-routes.test.mjs`
- Modify: `scripts/verify-static-export.mjs`
- Modify: `tests/e2e/support/paths.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `playwright.config.ts` only to route the focused Privacy specification through the existing appropriate projects
- Modify: current architecture and active-plan records only after behavior is demonstrated

**Interfaces:**

- Consumes: Task 1's exact bilingual public copy and Task 2-independent semantic route conventions.
- Produces: `privacy` route equivalence, shared semantic `PrivacyPage`, both static Privacy routes, and base-path-safe Privacy links from the site footer and Contact context.

- [ ] **Step 1: Write content, route, navigation, footer, and artifact RED tests**

  Assert one locale per module, all required verified disclosure sections, no guessed/placeholder copy, `/privacidad/` ↔ `/en/privacy/`, page-equivalent language switching, exactly one H1/main, ordered headings, request email, and Privacy footer links across every exported route. Extend the static verifier to require both new artifacts and base-path-safe internal references.

- [ ] **Step 2: Run focused RED**

  Run `node --test scripts/privacy-content.test.mjs scripts/privacy-route.test.mjs scripts/site-routes.test.mjs`. Tests inspect the current typed route/content boundary through guarded imports and explicit existence/behavior assertions. Expected: FAIL assertions for the absent Privacy route/content behavior, not import or syntax errors. Run the current built static verifier and record the missing Privacy artifacts separately.

- [ ] **Step 3: Implement the typed content and shared Server Component**

  Add exact Task 1 copy in locale-owned modules and one locale-agnostic semantic composition. Use headings, paragraphs, and lists appropriate to meaning; keep policy prose readable and avoid cards that make legal sections look like products. Do not parse provider configuration, duplicate the ADR, add acceptance checkboxes, or add client code.

- [ ] **Step 4: Add paired routes and semantic route equivalence**

  Add `privacy` to the typed route map/navigation path, create both route shells with the existing header/footer, and preserve correct root-layout language, trailing slashes, and language switching. Do not change primary navigation.

- [ ] **Step 5: Add Privacy to every footer**

  Extend the existing footer labels and path contract, then update every current Spanish and English route entry atomically. Privacy is a normal site-navigation link with at least the existing 44 px target treatment; it does not displace Contact or appear as a primary action.

- [ ] **Step 6: Run focused GREEN and export gates**

  Run:

  ```powershell
  node --test scripts/privacy-content.test.mjs scripts/privacy-route.test.mjs scripts/site-routes.test.mjs
  npm run validate
  npm run verify:static-export
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  npm run verify:static-export
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  ```

  Confirm 20 static routes after adding the paired Privacy routes, correct `lang`, trailing-slash links, and no duplicated/missing base path. Restore a normal build before ordinary browser QA if needed.

- [ ] **Step 7: Run Playwright, axe, manual accessibility, and visual QA**

  Use the Playwright-owned server. Exercise both routes in desktop Chromium, Firefox, and WebKit; run the approved representative axe scan; verify keyboard order, headings, landmarks, equivalent-language links, footer links, 200% zoom, long-copy reflow, no horizontal overflow, visible focus, and no console/page errors. Visually inspect `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900` in both locales plus root/base-path spot checks. Record actual evidence and limitations; no snapshot baseline is required unless human visual review approves one.

- [ ] **Step 8: Review and open PR 3**

  Run PR-readiness, inspect the complete diff for invented legal claims, duplicated normative text, locale drift, unrelated shell changes, or generated artifacts, and open `feat: publish the bilingual Privacy experience`. Stop before merge.

### Task 4 / PR 4: Launch the accessible Contact inquiry form

**Files:**

- Create: `components/contact/content-types.ts`
- Create: `components/contact/state.ts`
- Create: `components/contact/ContactPage.tsx`
- Create: `components/contact/ContactForm.tsx`
- Create: `scripts/contact-content.test.mjs`
- Create: `scripts/contact-state.test.mjs`
- Create: `scripts/contact-route.test.mjs`
- Create: `tests/e2e/contact.spec.ts`
- Create: `tests/e2e/contact-responsive.spec.ts`
- Modify: `app/(es)/_content/contact.ts`
- Modify: `app/(en)/en/_content/contact.ts`
- Modify: `app/(es)/contacto/page.tsx`
- Modify: `app/(en)/en/contact/page.tsx`
- Modify: `components/foundation/content-types.ts` only to retire Contact-specific types after every existing consumer is migrated safely
- Modify: `components/foundation/MinimumDestination.tsx` only if Contact-only compatibility props become unused; preserve Services or other remaining consumers
- Modify: `scripts/foundation-content.test.mjs`
- Modify: `scripts/verify-static-export.mjs`
- Modify: `tests/e2e/support/paths.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `playwright.config.ts` to inject the fixed synthetic Formspree endpoint into the Playwright-owned server when no explicit endpoint is supplied and to route focused Contact coverage through the existing projects
- Modify: current architecture, quality findings, and active-plan progress only after verification demonstrates facts

**Interfaces:**

- Consumes: Task 2's validator and `SubmitInquiry`, Task 3's Privacy route, exact `PAGE-CONTACT` copy, existing direct-channel facts, and build-time `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- Produces: complete paired Contact routes and the approved `IDLE -> VALIDATING -> SUBMITTING -> SUCCESS | ERROR` user experience. No other route knows Formspree response details.

- [ ] **Step 1: Run the constrained design preflight**

  Apply `frontend-implementation` and `design-taste-frontend-v1` beneath repository authority. Record the approved hierarchy, 8/4 wide split, below-1024 source order, single-column fields, persistent labels, status surfaces, fallback hierarchy, and explicit exclusions. Resolve no new aesthetic or content decision.

- [ ] **Step 2: Write content, route, state, and Playwright RED tests before form code**

  Assert exact localized content and limits, route ownership, configured-versus-missing endpoint behavior, state transitions, all-field validation, first-invalid focus, error associations, busy state, visible values/labels, duplicate click/Enter/programmatic prevention, success focus/reset, failure focus/preservation/retry, direct-channel order, Privacy/Founder links, no raw provider response, and no page navigation or mail-client launch. Use Playwright route interception for provider acceptance, field errors, 429, 5xx, delayed response/timeout, malformed JSON, and lost response. No test contacts the real endpoint.

- [ ] **Step 3: Run the narrow RED commands**

  Run the new Node files directly and run `tests/e2e/contact.spec.ts` under `chromium-desktop` with a synthetic `https://formspree.io/f/test-contact` endpoint. Guard new-module imports so the Node tests report explicit missing-behavior assertion failures. Expected: Node FAIL assertions for absent content/state behavior and a Playwright assertion that the current `MinimumDestination` has no named form; do not accept import, syntax, server-start, or browser-launch errors as RED. Preserve the RED output in the PR evidence.

- [ ] **Step 4: Implement locale-owned Contact content and shared semantic structure**

  Expand both Contact content owners with exact `PAGE-CONTACT` copy while preserving the existing direct-channel data consumed elsewhere. Build `ContactPage` as the single main landmark in approved source order. Resolve Privacy and Founder links through the typed route map. At 1024 px and above, use the existing 12-column container with the form at approximately eight columns and support at four; below it, reflow without CSS/source-order divergence.

- [ ] **Step 5: Implement the minimal accessible Client Component**

  Use one named semantic form and persistent visible labels. Apply native `required`, `type="email"`, `inputMode="email"`, `autocomplete="name|email|organization"`, stable IDs, helper plus error `aria-describedby`, and `aria-invalid` only when invalid. The honeypot is non-focusable and absent from the accessibility tree. The message textarea is at least 180 px and vertically resizable.

  On submit, prevent reentry synchronously, validate all fields, focus the first invalid control, then set `aria-busy`, disable the fieldset and submit control, preserve visible labels/values, and announce the localized progress text. On `accepted`, reset only after acceptance and focus the `role="status" tabindex="-1"` success surface. On every other result, restore controls, preserve all values, focus an alert/error surface, keep retry and alternatives reachable, and never show raw provider data. Editing a field clears only that field's stale validation error; no automatic retry runs.

- [ ] **Step 6: Replace both Contact minimum routes atomically**

  Pass locale, content, resolved links, and the build-time endpoint into the shared composition. A missing or invalid endpoint keeps the current direct-channel route usable and omits the nonfunctional primary form. A configured endpoint renders the complete form in both locales. Do not alter other pages' shared contact facts or make direct email the form action.

- [ ] **Step 7: Run focused GREEN and provider-isolated browser coverage**

  Run the new Node tests, then the Contact Playwright tests with the fixed synthetic endpoint. `playwright.config.ts` supplies `https://formspree.io/f/test-contact` only to its owned local server when the caller has not provided an endpoint; every Contact test installs a route interception or an explicit fail-on-network guard before submission. Chromium covers all success/failure/state details. Desktop Firefox and WebKit cover the configured happy path and critical fallback. Compact Chromium/WebKit and tablet/wide Chromium cover responsive behavior. Confirm provider interception received exactly one allowed request with correct locale/source and that no unmocked Formspree request occurred.

- [ ] **Step 8: Run the full deterministic/static matrix**

  Run:

  ```powershell
  npm run validate
  npm run verify:static-export
  $env:NEXT_PUBLIC_FORMSPREE_ENDPOINT = 'https://formspree.io/f/test-contact'
  npm run build
  npm run verify:static-export
  $env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'
  npm run build
  npm run verify:static-export
  Remove-Item Env:NEXT_PUBLIC_BASE_PATH
  Remove-Item Env:NEXT_PUBLIC_FORMSPREE_ENDPOINT
  npm run test:e2e
  npm run test:a11y
  ```

  The default no-endpoint build proves fail-closed direct alternatives. The configured normal and `/Portfolio` builds prove the form, both Privacy routes, exact internal links, and no server-only feature. Generated output remains uncommitted.

- [ ] **Step 9: Perform the exact accessibility and visual QA matrix**

  Verify `/contacto/` and `/en/contact/` at `320x800`, `390x844`, `768x1024`, `1024x768`, and `1440x900` with root and relevant `/Portfolio` repetitions. Exercise idle, every validation error, submitting, success, generic failure, timeout, and retry; keyboard-only completion; Enter and textarea newline behavior; first-invalid and status focus; visible focus; error association; duplicate prevention; preserved values; reset only after acceptance; translated expansion; textarea resize; 200% zoom; reduced motion; direct-channel and Founder order; no raw provider response; no horizontal overflow; and no console/page errors.

  Run representative axe scans for both Contact and Privacy locales. Manually review semantics, landmark/heading/source order, required indication, focus visibility, target sizes, contrast for `#B42318` and `#067647` on actual surfaces, error identification, reflow, and at least one available assistive-technology announcement pass. Automated checks do not establish WCAG conformance. This plan requires recorded visual QA but no new pixel baseline; any future baseline needs a separately inspected and human-approved image under `TEST-VISUAL-REGRESSION`.

- [ ] **Step 10: Perform the real pre-release staging smoke**

  Before PR 4 may be approved or merged, build/serve the branch with the real public endpoint from approved local or staging configuration and an allowed staging origin. Submit one clearly labeled synthetic inquiry in each locale, including one optional-company omission and one supplied-company case. Confirm Formspree acceptance, target-inbox arrival, fixed subject, authenticated sender, intact labeled fields, provider receipt time, correct `Reply-To`, locale/source, no unexpected payload, spam/honeypot behavior, and deletion from provider history and Gmail under the approved procedure. Record date, environment, PASS/FAIL checklist, and deletion completion in the PR and plan without copying inquiry content or the endpoint.

- [ ] **Step 11: Final review and open PR 4**

  Re-run fresh applicable gates after the live smoke, inspect `main...HEAD`, confirm the production deployment variable is provisioned and domain restriction includes the final host, and verify no IDs, secrets, real data, reports, traces, videos, or screenshots are committed. Open `feat: launch the accessible Contact inquiry form` with the staging evidence and explicit human merge authority. Stop before merge.

### Task 5 / PR 5: Verify production and close the plan

**Files:**

- Move after all implementation PRs are human-merged: `docs/plans/active/contact-inquiry-pipeline.md` -> `docs/plans/completed/contact-inquiry-pipeline.md`
- Modify: `docs/plans/index.md`
- Modify: `docs/index.md`
- Modify: `ARCHITECTURE.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Modify: `docs/governance/status-register.md`
- Modify: `docs/product/site-feature-catalogue.md`

**Interfaces:**

- Consumes: human-merged PRs 1–4, successful GitHub Pages deployment, final production hostname, and retained sanitized evidence.
- Produces: verified production behavior, completed plan history, and synchronized current-system/status records.

- [ ] **Step 1: Verify the deployed final host without changing it**

  Confirm both locale Contact and Privacy routes, static assets/base path, form presence, language switching, direct fallbacks, and browser console health on the deployed hostname. Verify the provider's exact-domain restriction accepts the final host and rejects a controlled disallowed origin.

- [ ] **Step 2: Submit and delete one labeled production smoke**

  Use synthetic non-prospect data. Confirm provider acceptance, inbox arrival, fixed subject, authenticated sender, intact fields, `Reply-To`, locale/source, and the approved deletion procedure. Delete the provider and Gmail copies after evidence is recorded. If delivery or deletion fails, disable submission by removing the public deployment endpoint and redeploy the fallback-only experience; keep the plan ACTIVE.

- [ ] **Step 3: Synchronize demonstrated implementation facts**

  Update architecture, quality, catalogue, and status records with only observed facts. Do not claim whole-site WCAG conformance, guaranteed delivery, legal advice, exactly-once submission, zero spam, or provider permanence.

- [ ] **Step 4: Complete and move the plan**

  Record every PR URL, RED/GREEN command, deterministic result, browser/axe/visual/manual scope, staging and production smoke date/result, deletion result, limitation, and deviation. Check every task, set `plan_status: COMPLETED`, move the file to `docs/plans/completed/`, and update every link/index atomically.

- [ ] **Step 5: Validate and open PR 5**

  Run `npm run docs:check` and the production-relevant smoke/static checks, inspect the docs-only diff, and open `docs: record Contact inquiry release verification`. Stop before merge.

## Deterministic testing contract

### Node/unit/contract

- Exact validation boundaries, trim/omission, locale/source binding, UTF-8 size, and unsupported-field exclusion.
- Adapter request method/headers/body, one-call behavior, abort cleanup, accepted response, provider field errors, rate/quota/misconfiguration, 5xx, timeout/network, malformed JSON, unexpected fields/shapes, and no raw error leakage.
- Pure reducer transitions: `IDLE -> VALIDATING -> SUBMITTING -> SUCCESS | ERROR`, validation fallback, retry, duplicate prevention, value preservation, and reset only after acceptance.
- Content and route contracts for both Contact and Privacy locales.
- Static artifacts for normal, missing-endpoint, configured-endpoint, and `/Portfolio` builds.

### Playwright

- Success and failure coverage uses request interception; public CI never sends real email.
- Both locales cover exact labels/helpers/errors/statuses, source/locale payloads, Privacy/Founder links, fallback order, value preservation, reset, retry, and no navigation away.
- Chromium covers all state and failure branches; Firefox/WebKit cover critical configured submission; compact/mobile/tablet/wide projects cover approved reflow.
- Axe covers both Contact and Privacy locale routes; console/page-error gating remains active.

### Manual accessibility and visual review

- Exact Contact viewport matrix in both languages and representative Privacy checks.
- Keyboard-only flow, Enter/newline behavior, focus order/movement/visibility, announcement behavior, associated help/errors, 200% zoom, resize, contrast, target size, reduced motion, source order, and no overflow.
- Visual judgment compares hierarchy, typography, spacing, field/status surfaces, alternative emphasis, and long-copy growth with `DESIGN-VISUAL`; snapshots are change detection, not approval.

### Live evidence boundary

- Live staging and production smoke tests are named manual actions, never CI.
- Use only labeled synthetic non-prospect data and delete all copies after verification.
- `accepted` proves the provider response; inbox inspection proves delivery; deletion inspection proves the configured removal procedure. Do not collapse these into one claim.

## Per-PR validation baseline

Every implementation PR runs its focused RED/GREEN commands plus, when applicable:

```powershell
npm run docs:check
npm test
npm run lint
npm run typecheck
npm run build
npm run verify:static-export
```

`npm run validate` may compose the first five gates when its script remains equivalent. UI PRs additionally run the focused Playwright projects, `npm run test:e2e`, `npm run test:a11y`, configured normal/base-path exports, and the recorded manual matrix. A live smoke never substitutes for deterministic tests, and automated tests never substitute for inbox or deletion inspection.

## Pull Request evidence contract

Every PR description records:

- plan task, upstream requirements, ADR, and predecessor PR;
- behavior changed or explicitly unchanged;
- exact RED failure and GREEN/full commands with counts and exit status;
- routes, browsers, viewports, states, keyboard interactions, axe scope, and visual/manual checks actually exercised;
- provider/legal/manual evidence only when actually obtained and sanitized;
- privacy/documentation synchronization;
- risks, rollback, OPEN items, and unverified limitations; and
- explicit human merge authority.

## Risks and mitigations

- **Provider documentation or configuration drift:** re-verify first-party sources in Task 1 and at release; stop if the accepted response, storage, deletion, or processor facts change materially.
- **An HTTP success is mistaken for delivery:** keep UI copy at provider acceptance and require separate staged and production inbox proof.
- **Ambiguous timeout creates a duplicate after manual retry:** no automatic retry, preserve values, use non-committal failure copy, and deduplicate during Samuel's triage.
- **Public endpoint abuse consumes quota:** exact provider schema, no files, domain restriction, honeypot, Formshield, one active request, 24 KiB ceiling, provider rate limit, and quota monitoring.
- **Domain restriction blocks privacy-hardened clients:** treat referer-based restriction as defense in depth, test allowed/disallowed origins, keep direct fallbacks visible, and do not describe it as authentication.
- **Public deployment happens immediately after merge to `main`:** PR 4 cannot merge until real staging delivery/deletion proof passes and the deployment endpoint/final domain are configured. Missing endpoint remains fail-closed.
- **Privacy copy outruns deployed reality:** Task 1 owns verified facts and legal review; Privacy code consumes exact approved content and never guesses from an endpoint or plan name.
- **Long Spanish/English states break layout:** intrinsic sizing, no fixed content height or line clamp, exact viewport/zoom matrix, and visual review in every state.
- **Client state harms static/no-JavaScript access:** keep the interactive island limited to the form; intro, response expectation, fallbacks, Privacy, and Founder context remain server-rendered links/content.
- **Tests accidentally email Samuel:** all deterministic tests inject fetch or intercept browser requests; a real endpoint is permitted only in explicitly labeled manual staging/production steps.
- **Sensitive evidence leaks into git:** record sanitized outcomes and dates, never provider dashboards, response bodies, form IDs, prospect content, cookies, or credentials.

## Rollback

If the pre-release smoke fails, do not merge PR 4. If the deployed form fails after release, remove or invalidate the approved `NEXT_PUBLIC_FORMSPREE_ENDPOINT` deployment value and redeploy the same commit so the route fails closed to WhatsApp, email, and phone. If that path is unavailable, revert PR 4 through a human-reviewed PR. Preserve the Privacy page while its facts remain accurate; update it before any processor change. Never roll back to `mailto:` as the primary form or expose mail credentials.

## Deferred and OPEN items

- A processor other than Formspree, serverless backend, hosting migration, provider SDK, generic integration layer, CRM, marketing subscription, analytics event, file upload, service/budget/deadline fields, or automatic retry.
- Interactive CAPTCHA/Turnstile unless observed abuse and a separate governance/privacy/accessibility review approve it.
- Whole-site accessibility conformance, a broader form system, a new design system, canonical metadata beyond the final-host gate, or provider-independent delivery guarantees.
- Any legal/privacy issue left unresolved by professional review. Such an item remains release-blocking and cannot be closed by code or agent judgment.

## Progress

- 2026-09-10: the repository owner merged Governance PR #43, accepting Formspree behind the narrow provider-neutral inquiry boundary for the current static release.
- 2026-09-11: `ADR-CONTACT-INQUIRY-PIPELINE` and this ACTIVE five-PR execution plan were prepared on `codex/contact-inquiry-execution-plan`. The planning PR changes documentation only.
- First implementation task selected: Task 1 / PR 1, `docs: close Contact provider and privacy gates`. No application implementation is authorized before that task is human-reviewed and merged.

## Important implementation decisions

- Use five serial review boundaries after the planning PR: operational/privacy closure; deterministic adapter; Privacy publication; atomic Contact launch; production evidence/plan closure.
- Keep the current Contact destination public until the complete form is ready; do not publish a nonfunctional intermediate form.
- Use direct `fetch` and the accepted `SubmitInquiry` interface; do not add the newly documented Formspree AJAX/React SDK without new evidence and review.
- Treat the existing deployment variable as public build-time configuration and validate it before rendering the form. The target inbox stays exclusively in provider configuration.
- Publish Privacy before the form so the release cutover can link to an already reviewed, accurate notice.
- Make PR 4 atomic across both locales and all automated/manual evidence because partial locale or state publication would create a misleading conversion path.
- Require real staged inbox/`Reply-To`/deletion proof before PR 4 merge and a production-host verification before plan completion.

## Deviations discovered during execution

None at plan creation. Record a deviation here before implementing any change to the accepted processor, data contract, state model, route/hosting model, privacy facts, release sequence, or evidence boundary.
