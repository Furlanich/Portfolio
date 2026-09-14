---
id: PLAN-PRIVACY-LEGAL-RELEASE-READINESS
type: execution-plan
status: APPROVED
plan_status: ACTIVE
owners:
  - product
  - privacy
  - legal-review
  - frontend
  - qa
  - release
related:
  - GOV-ENGINEERING-LIFECYCLE
  - ADR-STATIC-LOCALIZED-ROUTING
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-LEGAL
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - IA-SITE
  - LEGAL-PROTOTYPE-POSTURE
  - RELEASE-READINESS
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
last_verified: 2026-09-14
---

# Privacy, Legal, and release-readiness implementation plan

> **Goal:** Publish the exact approved bilingual demonstration Privacy and Legal Notice experiences, then establish evidence-based demonstration-release gates without weakening the independent commercial blockers.
>
> **Architecture:** Keep locale-owned typed content and explicit static routes. Shared locale-agnostic Server Components render restrained editorial pages. Route equivalence, localized footer links, static export, trailing slashes, and the optional `/Portfolio` base path remain the accepted boundaries. No new runtime service or data path is introduced.
>
> **Technology:** Next.js 16 App Router and static export, React Server Components, TypeScript, Tailwind CSS, Node contract checks, Playwright, axe, GitHub Actions, and GitHub Pages.

## Authority and prerequisites

Implementation must begin from current `main` only after this plan is reviewed. The authority order is:

1. `AGENTS.md`, `docs/governance/engineering-lifecycle.md`, and accepted ADRs;
2. `PAGE-CONTACT / PAGE-PRIVACY`, `PAGE-LEGAL`, `CONTENT-LOCALIZATION`, `LEGAL-PROTOTYPE-POSTURE`, and `RELEASE-READINESS`;
3. `DESIGN-VISUAL` and `DESIGN-IX-A11Y`;
4. this execution sequence;
5. current application code as implementation evidence, not product authority.

Implementation uses the project-local `architecture-governance`, `project-knowledge-maintenance`, `frontend-implementation`, `test-driven-development`, `playwright-qa`, `visual-qa`, `verification-before-completion`, and `pr-readiness` Skills. Visual judgment uses the pinned stable `design-taste-frontend-v1` Skill. Each implementation PR starts with RED evidence for its changed behavior and ends with fresh deterministic and rendered verification.

## Classification packet

- **Classification:** Route B — substantial approved work requiring a versioned execution plan.
- **Reason:** Decision closure is complete. The work crosses public route/content contracts, route equivalence, footer discovery, static artifacts, browser/accessibility/visual coverage, release integrity, and deployed proof, but it stays inside accepted static-localized architecture.
- **Requirements:** Publish the exact approved Privacy and Legal Notice copy; preserve the Contact zero-transmission demonstration; prevent internal/future legal material from becoming public; keep demonstration and commercial readiness independent; verify the release at root and `/Portfolio` base paths.
- **Affected architecture:** Locale-owned route content, shared locale-agnostic editorial composition, `lib/site-routes.ts`, foundation footer/navigation contracts, static-export verification, Playwright coverage, and release documentation.
- **Planning artifact:** `docs/plans/active/privacy-legal-release-readiness.md`.
- **Delivery boundary:** Four human-reviewed implementation PRs followed by plan closure. `main` remains human-controlled; no autonomous merge.
- **Decision state:** No consequential unresolved architecture blocks the approved scope. No RFC or ADR is required.

Stop and reclassify before implementation if any proposal introduces analytics, consent-management infrastructure, a real inquiry processor, cookies or browser storage with new runtime behavior, a commercial inquiry flow, backend or legal-data storage, or a hosting change. A new dependency, runtime locale detection, or a public commercial Terms surface also requires explicit scope review rather than quiet inclusion.

## Integrity contract

Every public statement must preserve these distinct classes:

| Class | Public treatment | Owner |
| --- | --- | --- |
| Verified public fact | May be stated only as recorded and reverified against the release | Product/legal posture and release evidence |
| Approved prototype explanatory copy | Published exactly from `PAGE-PRIVACY` or `PAGE-LEGAL`, with its demonstration boundary visible | Page specification |
| Future commercial placeholder | Documentation only; never imported, transformed, or emitted by application code | Future commercial templates |
| Professional legal-review gate | Remains an explicit blocker; presentation quality cannot imply completion | `LEGAL-PROTOTYPE-POSTURE` and `RELEASE-READINESS` |

The implementation must not publish a fictional CUIT, registered address, corporate entity, regulatory registration, lawyer review, certification, privacy/compliance seal, DPA, or commercial terms. It must not describe the dormant Formspree adapter as active. Internal legal-review notes and future commercial templates remain Markdown-only repository records with no application import path.

## Approved public surface

| Route ID | Spanish | English | Discovery | Status after delivery |
| --- | --- | --- | --- | --- |
| `privacy` | `/privacidad/` | `/en/privacy/` | Localized footer and language switch | Exact mature demonstration Privacy copy |
| `legal` | `/aviso-legal/` | `/en/legal/` | Localized footer and language switch | Exact prototype Legal Notice copy |

Legal routes do not enter primary navigation. Static localization, semantic route equivalence, trailing slashes, and optional base-path resolution remain unchanged. There is no public commercial Terms route in this initiative.

## Discovery baseline — 2026-09-14

Source and deployed-current inspection established:

- `origin/main` at `74e37fb` contains the merged Initiative 7 decision closure.
- The GitHub Pages deployment reports source commit `74e37fb770346…`, matching current `main`.
- `/Portfolio/`, `/Portfolio/privacidad/`, and `/Portfolio/en/privacy/` return static 200 responses.
- The deployed Privacy pair still renders the shorter Initiative 6 copy.
- `/Portfolio/aviso-legal/` and `/Portfolio/en/legal/` return 404; route equivalence and the footer contain no Legal Notice destination.
- The deployed missing-route artifact is the generic Next.js 404.
- The current Contact implementation uses the local demonstration adapter, preserves values in page memory while mounted, and has contract/browser coverage against fetch, XHR, beacon, navigation, storage, Formspree, mail, and inbox delivery.
- `scripts/verify-static-export.mjs` checks the known route artifacts and base-path references, but it is not yet a complete generated-public link or filler scanner.
- `.github/workflows/deploy.yml` builds `main` for `/${repo.name}` with no Formspree endpoint and publishes `out/` to GitHub Pages.
- Next.js 16 static export emits `out/404.html`. Because GitHub Pages serves one missing-route artifact without server locale context, the release needs one bounded static bilingual recovery design rather than runtime pathname detection or redirection.

The Not Found content is approved only at responsibility level. PR 3 therefore includes a small owner checkpoint for its exact bilingual recovery wording before code is written. This is bounded content closure inside the accepted static architecture, not an RFC.

## Content and component contract

Privacy and Legal Notice should share an editorial vocabulary capable of paragraphs, inline code, and external or internal links without parsing documentation or raw HTML. One acceptable shape is:

```ts
type EditorialInline =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; value: string; href: string };

type PrototypeLegalDocumentContent<RouteId extends "privacy" | "legal"> = {
  locale: "es" | "en";
  routeId: RouteId;
  pageLabel: string;
  marker: string;
  revision: string;
  heading: string;
  lead: readonly EditorialParagraph[];
  prototypeNotice: readonly EditorialParagraph[];
  sections: readonly EditorialSection[];
};
```

The exact final types may be simpler, but must remain discriminated, typed, locale-owned, and static. The shared component must be locale-agnostic, semantic, and server-rendered. It must not import files from `docs/legal/`, execute Markdown at runtime, or create a client boundary.

## PR 1 — Legal/public content contracts and Privacy revision

**Commit intent:** `feat: define the prototype legal content contracts`

This PR creates the typed public-content boundary, upgrades both existing Privacy routes to the exact approved mature copy, and prepares—but does not yet publish—the Legal Notice content contract.

### PR 1 RED

Modify or add tests before production changes:

- `scripts/site-routes.test.mjs`: require `legal` as the eighth semantic route ID, exact `/aviso-legal/` ↔ `/en/legal/` equivalence, and sixteen foundation route paths while preserving trailing-slash/base-path behavior.
- `scripts/privacy-content.test.mjs`: require the exact `PAGE-PRIVACY` section sequence and approved contractual strings in each locale, including local page-memory lifetime, no inbox delivery, GitHub Pages hosting, GitHub Privacy, direct external services, actual cookie/storage/analytics posture, privacy contact, and future commercial review boundary.
- Add `scripts/legal-content.test.mjs`: require the exact bilingual `PAGE-LEGAL` content model, genuine September 2026 revision, restrained prototype marker, external-service facts, intellectual-property and limitation text, and no assertion of legal review.
- Add source-boundary assertions that public content modules do not import `docs/legal/`, future commercial templates, or provider configuration.

Run the focused tests and record the expected failures before creating production modules.

### PR 1 GREEN

Expected files:

- modify `lib/site-routes.ts`, `lib/foundation-navigation.ts`, `components/foundation/content-types.ts`, and affected contract tests;
- evolve `components/privacy/content-types.ts` and `components/privacy/PrivacyPage.tsx`, or replace them with a clearly named shared editorial composition;
- modify `app/(es)/_content/privacy.ts` and `app/(en)/en/_content/privacy.ts` with the exact approved copy;
- add locale-owned Legal Notice content modules such as `app/(es)/_content/legal.ts` and `app/(en)/en/_content/legal.ts`;
- add shared types/components under `components/legal/` only if that name accurately represents the combined Privacy/Legal editorial role.

Keep the Legal Notice route unpublished in this PR: no page files and no footer link. `site-routes` may establish the behavior-neutral contract only because the complete paired routes publish atomically in PR 2.

### REFACTOR and verification

- Remove duplication only where it does not obscure exact locale ownership.
- Assert exact copy by semantic text units, not whitespace, JSX nesting, CSS classes, or line wrapping.
- Run focused Node tests, `npm test`, lint, typecheck, both static builds, and `verify:static-export`.
- Exercise both Privacy routes with JavaScript disabled, keyboard navigation, text selection/copy, print preview, representative axe scans, 320 px, approximately 390 px, tablet, 1024 px, 1440 px, and 200% zoom where practical.
- Apply the frontend implementation and stable Taste review: readable measure, existing typography, established section rhythm, restrained status notice, no seal/badge theatrics, and no implied government or professional endorsement.

Rollback is the PR revert: the pre-existing short Privacy content remains coherent and no Legal route has been published.

## PR 2 — Publish the bilingual Legal Notice experience

**Commit intent:** `feat: publish the bilingual Legal Notice`

This PR atomically publishes the Legal Notice pair and localized footer discovery after the exact content contract exists.

### PR 2 RED

- Add `scripts/legal-route.test.mjs` for both route files, the shared semantic composition, exact locale content imports, metadata, and language-switch destination.
- Extend `scripts/foundation-route.test.mjs`, `scripts/site-routes.test.mjs`, or the narrow owning tests to require localized Privacy and Legal footer destinations on every foundation route while proving neither enters primary navigation.
- Extend `scripts/verify-static-export.mjs` expectations from twenty to twenty-two public route artifacts and require both legal documents' identifying text.
- Extend `tests/e2e/smoke.spec.ts`, `tests/e2e/privacy.spec.ts` or a new `tests/e2e/legal.spec.ts`, `tests/e2e/responsive.spec.ts`, `tests/e2e/accessibility.spec.ts`, and `tests/e2e/support/paths.ts` for route discovery and equivalence.

Record missing-route, missing-footer, and static-artifact failures before implementation.

### PR 2 GREEN

- add `app/(es)/aviso-legal/page.tsx` and `app/(en)/en/legal/page.tsx`;
- modify the localized foundation/navigation content and `components/foundation/SiteFooter.tsx` as required for two legal destinations;
- render the approved prototype status visibly but professionally inside the semantic editorial layout;
- preserve existing root and `/Portfolio` path helpers for all footer and language-switch links;
- set only basic accurate localized page metadata required for release integrity; leave broad SEO optimization to its later initiative.

### Browser, accessibility, and visual acceptance

Playwright must cover Spanish Privacy, English Privacy, both Legal Notice routes, reciprocal language switching, footer discovery from representative non-legal routes, keyboard activation, no console errors, and no horizontal overflow at 320×800, approximately 390×844, 768×1024, 1024×768, and 1440×900. Test 200% zoom where practical. Run representative axe checks for both document kinds and locales.

Manual visual QA checks long-copy rhythm, heading hierarchy, readable measure, focus visibility, external-link treatment, direct-contact affordances, print readability, and quiet prototype framing. After human design approval, capture the smallest stable regression set: Spanish Privacy compact, English Privacy wide, Spanish Legal wide, and English Legal compact. Do not accept dramatic illustration, faux stamps, seals, certificates, or governmental styling.

Rollback is the PR revert, restoring the prior Privacy-only footer and removing the paired Legal artifacts together.

## PR 3 — Release-readiness gates and public-integrity checks

**Commit intent:** `test: enforce demonstration release integrity`

This PR makes release truthfulness repeatable. It does not turn commercial blockers into demonstration requirements or invent a new secret scanner.

### Bounded Not Found checkpoint

Before writing Not Found code, obtain owner approval for one static bilingual recovery artifact that:

- displays an unmistakable 404/error meaning;
- gives Spanish-root priority while presenting explicit `lang="es"` and `lang="en"` recovery groups;
- links to Home, Services, Projects, and Contact in both languages using existing approved labels;
- resolves correctly at root and `/Portfolio` base paths;
- performs no pathname inspection, client locale inference, automatic redirect, or cookie/storage write.

The likely Next.js mechanism is `app/global-not-found.tsx` with the documented experimental `globalNotFound` flag because the app has multiple root layouts. Confirm against the installed `node_modules/next/dist/docs/` immediately before implementation. If that mechanism cannot satisfy static export deterministically, stop for architecture review rather than adding client routing.

### RED — release integrity

Add `scripts/public-release-integrity.test.mjs` and focused fixtures. The scanner must fail only on generated public output, not on repository documentation or test-only fixtures. Require failures for public occurrences of:

- `[TBD]`, `[TODO]`, unresolved `[REQUIRES …]` markers, `Lorem ipsum`, and `example.com`;
- internal readiness/status tokens or future-template identifiers that are not approved public copy;
- provider endpoint configuration names, real-looking secret markers, or blocked identity/registration placeholders;
- unresolved internal links and missing base-path/trailing-slash artifacts.

Require passes for `.example.invalid` synthetic fixtures and the approved public statement that the current demo does not use Formspree. The scanner must not reject a legitimate explanatory mention merely because a dormant architecture exists in source.

Add browser/static RED coverage for the approved 404 recovery artifact, noindex behavior where supported by the framework, root and `/Portfolio` link resolution, and absence of console errors.

### GREEN — smallest deterministic gate

- add `scripts/public-release-integrity.mjs` and keep its input boundary to `out/**/*.html`, emitted text-bearing assets where relevant, and the generated internal-link graph;
- compose it from `verify:static-export` or a clearly named package script so the CI/release command cannot omit it;
- upgrade `scripts/verify-static-export.mjs` to resolve every generated internal href against the actual root/base-path artifact set, including asset references, without crawling the network;
- add the approved static Not Found implementation and only the Next.js configuration necessary for it;
- update `docs/product/information-architecture.md` and its owning index after the bounded content decision is approved;
- update `docs/release/readiness.md` with the implemented gate names and evidence locations, but leave `DEMO_READY` unassigned until PR 4 verifies the deployed commit.

Do not write a home-grown repository secret scanner. Retain platform/CI secret-safe practices and perform scoped deterministic searches for accidentally committed runtime values. The audit must confirm no production Formspree endpoint, Gmail credential, SMTP password, API secret, private webhook, real inquiry, or private legal document is present in public application source, build configuration, generated HTML, or test fixtures. Only synthetic `.example.invalid` inquiry data is permitted.

### Complete local release matrix

Run and record:

```powershell
npm run docs:check
npm run skills:check
npm test
npm run lint
npm run typecheck
npm run build
npm run verify:static-export
$env:NEXT_PUBLIC_BASE_PATH = "/Portfolio"
npm run build
npm run verify:static-export
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
npm run test:e2e
npm run test:a11y
```

The root and base-path builds must each prove every public route, all twenty-two foundation/project artifacts plus `404.html`, route equivalence, localized footer links, internal links, CV and public assets, basic metadata, no prohibited generated strings, and the Contact zero-transmission invariant. Verify stable external destinations such as GitHub Privacy with a bounded read-only release check; validate `mailto:`, `tel:`, and WhatsApp syntax statically and avoid flaky external-network assertions in ordinary CI.

Visual QA repeats the legal-page responsive matrix and inspects the 404, Contact/Privacy behavioral consistency, focus order, keyboard access, 200% zoom, print readability, and snapshots. Representative axe checks may support only the configured routes; no whole-site WCAG conformance claim is allowed.

Rollback removes the composed integrity step and static Not Found together if the framework mechanism proves unstable; it must not bypass a genuine leaked-placeholder or broken-route failure.

## PR 4 — Deployed demonstration release verification and plan closure

**Commit intent:** `docs: verify the deployed Privacy and Legal release`

This is a documentation/evidence PR after PR 3 is merged and GitHub Pages finishes deploying. It contains no feature code.

### Deployed evidence

- prove the `gh-pages` deployment source SHA matches the reviewed `main` commit;
- request every approved route under `/Portfolio`, including both Privacy and Legal routes, project details, CV/assets, and missing-route behavior;
- verify route equivalence, footer discovery, internal links, trailing slashes, and stable external destinations;
- compare public Privacy and Legal semantic text to the exact approved records;
- run Contact success, synthetic failure, retry, rapid duplicate activation, and fallback-link checks while observing no fetch, XHR, beacon, navigation, storage, Formspree, analytics, log, mail, or inbox transport of form values;
- run representative deployed Chromium keyboard, console, responsive, zoom, print, visual, and axe smoke checks;
- record limitations and rollback to the previously known-good Pages artifact.

No real prospect data or external message may be used. Use only approved `.example.invalid` synthetic values; direct-contact links may be inspected but not activated into an external communication.

### Readiness assignment

Assign `DEMO_READY` only if every demonstration gate in `RELEASE-READINESS` passes against the same deployed commit. If any gate fails, keep `DEMO_READY` unassigned and document the exact owner and remediation.

Regardless of demonstration success, retain:

- `COMMERCIAL_BLOCKED`;
- `LEGAL_REVIEW_REQUIRED`;
- actual processor activation as OPEN;
- retention and deletion operations as OPEN;
- contractual terms as OPEN;
- future analytics/cookie requirements as OPEN;
- real identity, CUIT/tax, domicile, controller/registration, transfer, and professional-review evidence as OPEN where applicable.

Passing the demo release cannot weaken, rename, or visually obscure these blockers.

### Closure

Update `RELEASE-READINESS`, the status register, architecture/current-system facts, relevant indexes, and this plan with reviewed evidence. Move this file from `docs/plans/active/` to `docs/plans/completed/` only after all four PRs, deployment proof, documentation synchronization, validation, and diff review are complete. Open the closure PR for human review; do not merge it autonomously.

## Verification contract across all PRs

Each PR must record fresh commands and results. The minimum deterministic gate is `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`; `npm run validate` may compose those checks. Any PR touching static output also runs `verify:static-export` for root and `/Portfolio`. Any PR touching rendered pages runs the scoped Playwright, representative axe, and manual visual/responsive checks described above.

The final evidence set must cover:

- all public routes and reciprocal route equivalence;
- localized footer legal links and absence from primary navigation;
- broken internal links, trailing slashes, and both static-export modes;
- no secrets, real inquiries, internal review notes, or unapproved public placeholders;
- CV and static assets;
- stable external links where bounded verification is appropriate;
- Contact zero transmission and Privacy behavioral accuracy;
- exact approved legal copy, visible prototype posture, and no false compliance claim;
- localized recovery from 404;
- console health, keyboard behavior, accessibility, visual regression, print, zoom, and responsive behavior.

Full SEO/metadata optimization is intentionally excluded. Only accurate basic localized metadata, favicon, and noindex/error integrity needed for a truthful release are in scope.

## Exact first implementation task

After this planning PR is reviewed and merged, create a fresh short-lived branch from current `main`. Before changing production code:

1. modify `scripts/site-routes.test.mjs` to require `legal`, `/aviso-legal/`, `/en/legal/`, and the expanded foundation path count;
2. modify `scripts/privacy-content.test.mjs` to require the exact mature `PAGE-PRIVACY` semantic content in both locales;
3. add `scripts/legal-content.test.mjs` for the exact `PAGE-LEGAL` model and the docs-only separation rule;
4. run `node --test scripts/site-routes.test.mjs scripts/privacy-content.test.mjs scripts/legal-content.test.mjs`;
5. capture the expected RED failures caused by the missing route/content contracts;
6. only then implement the minimum typed content and shared editorial boundary described in PR 1.

## Progress

- [x] Mandatory repository discovery completed.
- [x] Deployed-current route, footer, Privacy, Legal, Contact, 404, and deployment-source behavior inspected.
- [x] Route B classification recorded; no RFC or new ADR required.
- [x] Four-PR implementation, validation, rollback, and release-evidence sequence defined.
- [ ] PR 1 — content contracts and mature Privacy revision.
- [ ] PR 2 — bilingual Legal Notice publication and footer discovery.
- [ ] PR 3 — release integrity, Not Found, and complete local release matrix.
- [ ] PR 4 — deployed proof, readiness assignment, documentation synchronization, and plan closure.

## Decision log

- 2026-09-14: Use Route B because approved work is substantial but stays within accepted architecture.
- 2026-09-14: Keep exact public copy in locale-owned TypeScript; documentation remains authority but is never parsed or imported at runtime.
- 2026-09-14: Publish Legal Notice only as an atomic bilingual route/footer change in PR 2.
- 2026-09-14: Scope the release-integrity scanner to generated public output so documented future placeholders and `.example.invalid` test fixtures remain valid.
- 2026-09-14: Treat Not Found wording as a bounded owner checkpoint and use one static bilingual artifact unless installed Next.js evidence forces architecture review.
- 2026-09-14: Keep `DEMO_READY` unassigned until deployed proof; keep commercial and legal-review blockers independent even after demonstration success.

## Plan completion checklist

- [ ] Exact approved Privacy and Legal copy is public in both locales.
- [ ] Public/internal legal content separation is deterministic.
- [ ] Legal routes, equivalence, footer discovery, and static artifacts pass at root and `/Portfolio`.
- [ ] Contact zero transmission and Privacy accuracy are re-proven on the release candidate.
- [ ] Integrity, links, assets, 404, console, accessibility, visual, zoom, print, and responsive checks pass.
- [ ] `DEMO_READY` is assigned only from same-commit deployed evidence or remains explicitly unassigned.
- [ ] `COMMERCIAL_BLOCKED` and `LEGAL_REVIEW_REQUIRED` remain truthful until independent evidence closes them.
- [ ] Documentation owners and indexes are synchronized.
- [ ] Final diff is self-reviewed and the closure PR is ready for human review.
- [ ] No implementation or closure PR is merged autonomously.
