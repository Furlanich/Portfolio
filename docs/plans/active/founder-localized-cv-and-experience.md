---
id: PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE
type: execution-plan
status: PROPOSED
plan_status: ACTIVE
execution_policy: ADE-AGENT-USAGE-V1
related:
  - PAGE-FOUNDER
  - PORTFOLIO-MIGRATION
  - DESIGN-SFC-V1
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-AGENT-USAGE
  - GOV-ENGINEERING-LIFECYCLE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - TEST-VISUAL-REGRESSION
last_verified: 2026-10-20
---

# Founder localized CV and professional experience implementation plan

> Execute with `superpowers:executing-plans`, inline in one isolated implementation session. Use checkbox steps and retain RED/GREEN evidence. [GOV-AGENT-USAGE](../../governance/agent-usage.md) overrides Skill delegation: zero subagents; independent review is a separate top-level session. This is a planning deliverable; no product implementation or merge is authorized in this planning session. `ACTIVE` describes the plan directory/schema, not implementation progress.

**Goal:** give each Founder locale its own genuine CV download, retire the single legacy CV, and add Samuel's factual CleverSoft S.A. experience entry while preserving the rest of the approved professional profile.

**Architecture:** keep explicit Spanish-root and English-`/en/` routes, locale-owned typed content, the shared Founder Server Components and native anchors. Apply the existing base-path helper once to each document path; keep static export and trailing-slash page routes.

**Stack:** the repository's locked Next.js 16 / React 18 / TypeScript setup, Node 24 contract tests, Playwright 1.63 and axe. No dependency, workflow or hosting change.

**Spec:** [PAGE-FOUNDER](../../product/pages/studio-and-founder.md), [DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md), [DESIGN-VISUAL](../../design/visual-language.md), [DESIGN-IX-A11Y](../../design/interaction-responsive-accessibility.md), and the owner request and decisions of 2026-10-20 recorded below. PAGE-FOUNDER remains the content/download authority; Task 1 step 2 writes the amendment there before any product change.

## Revision history

| Revision | Date | Author / session | Change |
| --- | --- | --- | --- |
| 1 | 2026-10-20 | OpenAI Codex, GPT-6.1 Sol High (`gpt-6.1-sol`, `high`) | Initial proposed plan ([PR #177](https://github.com/Furlanich/Portfolio/pull/177), commits `2ab47bf1`, `ca81a0ce`). |
| 2 | 2026-10-20 | Anthropic Claude Code, Claude Opus 5.5 (`claude-opus-5-5`), separate owner-directed plan-review session | Verified every revision 1 claim against `main` `550c953b`; corrected the owned-file set and stale contracts; recorded the owner's four decisions and the received PDF inputs with their gate findings; added the verifier PDF and legacy-absence contracts, the Playwright case budget, CI coverage limits, publication/rollback/closeout, Non-goals and the decision ledger. This session contributed to the plan, so it is not the plan's independent reviewer. |

## Owner request and decisions (2026-10-20)

**Request (revision 1):** each Founder locale downloads its own CV, `Samuel-Furlanich-CV-ES.pdf` for Spanish and `Samuel-Furlanich-CV-EN.pdf` for English; the experience section adds Samuel's CleverSoft S.A. employment, in which he joined as a Support Analyst, moved into the Software Developer role and works on ERP and payment-resolution software. The request explicitly supersedes the biography-only employer rule, the two-entry experience contract and the single-CV contract.

**Decisions recorded in plan review (owner answers, 2026-10-20):**

| ID | Decision | Effect |
| --- | --- | --- |
| OD-1 | **June 2026 is the date Samuel joined CleverSoft S.A.** The transition date from Support Analyst to Software Developer is not stated. | Corrects the recorded PAGE-FOUNDER fact "began work as a Software Developer at Clever Soft SA in June 2026". The entry period is `Desde junio de 2026` / `Since June 2026`; no month is given for the role change. |
| OD-2 | **Remove `public/Samuel-Furlanich-CV.pdf`** once the two localized files are in the repository. | The legacy URL becomes a 404 on GitHub Pages (static export cannot redirect). Supersedes revision 1's "keep the legacy PDF unchanged". |
| OD-3 | **The new summary matches the voice of the existing entries** (impersonal, noun-phrase Spanish; subjectless English). | Replaces revision 1's third-person narrative copy. |
| OD-4 | Revise this plan and push it to PR #177. | Authorizes this documentation revision only; implementation still awaits plan acceptance. |
| OD-5 | **Independent work and FURLANICH start in 2023** (owner, 2026-10-20, during implementation). | Supersedes the 2024 start year in the biography paragraph and the independent-work entry (`Desde 2023` / `Since 2023`); resolves G4. Supersedes the Non-goal that kept the 2024 fact. |

## Current-state findings

Discovery inspected `main` at **`550c953b6d0ef9580d2e1b5605684c9611559af4`** (merge of PR #176); `git fetch` confirmed `origin/main` at the same SHA on 2026-10-20 during plan review.

| Area | Repository evidence and implication |
| --- | --- |
| Routes | `lib/site-routes.ts`, `app/(es)/estudio/samuel-furlanich/page.tsx` and `app/(en)/en/about/samuel-furlanich/page.tsx` serve `/estudio/samuel-furlanich/` and `/en/about/samuel-furlanich/`. Both render `components/founder/FounderPage.tsx`. |
| Content ownership | `app/(es)/_content/founder.ts` and `app/(en)/en/_content/founder.ts` satisfy `FounderPageContent` (`components/founder/content-types.ts`). Experience entries have `period`, `role`, `context`, `summary`; `FounderProfessionalHistory.tsx` renders them in an `<ol>` with `data-founder-experience-entry` / `data-founder-period` hooks and the React key `period-role`. |
| Current download | Both locales point to `/Samuel-Furlanich-CV.pdf`. `FounderProfessionalLinks.tsx` renders a native anchor with `withBasePath(content.cv.path)` and a hard-coded `download="Samuel-Furlanich-CV.pdf"`. Shared `DocumentLink` (`components/foundation/content-types.ts`) has only `label` and `path`; Founder is its only consumer. |
| Legacy asset | `public/Samuel-Furlanich-CV.pdf` (194,201 bytes) is tracked on `main`. It is an English CV with no CleverSoft entry. Nothing outside the two Founder content files and `FounderProfessionalLinks.tsx` references it in `app/`, `components/` or `lib/`. Retained `data/about.json` (read by `lib/data.ts`) is migration input, not current public copy. |
| Current experience (at discovery; the independent-work year is now 2023 by OD-5) | Two entries: independent practice since 2024, then the 2021 IT Technician internship. Biography paragraph 3 names `Software Developer at Clever Soft SA`. |
| Superseded rules | PAGE-FOUNDER (lines on biography-only employer, "two source-backed experience entries", preserved CV asset/download name), PORTFOLIO-MIGRATION, DESIGN-SFC-V1 ("Preserve `/Samuel-Furlanich-CV.pdf`, its download filename") and the status register's Founder facts encode the old contract. These are contract changes, not copy edits. |
| Verifier contract | `scripts/verify-static-export.mjs` `assertFounderArtifact` requires exactly two entries and the literal `Clever Soft SA` outside headings (line 385), and checks the CV only as an `href` substring through `expectedPageLinkHref` (no trailing slash for files). **It never checks that a referenced PDF exists in `out/`, never reads the `download` attribute, and its text scan skips `.pdf` files.** New contracts must be added, not assumed. |
| Fixture tests | `scripts/founder-export.test.mjs` builds two-entry fixtures with `Clever Soft SA` and filters verifier output to lines that start with `- <Founder HTML file>:` and match `/Founder\|portrait\|main landmark\|approved visible H1/`; new verifier messages must follow that format to be observable. Its HTTP test serves a temporary `Samuel-Furlanich-CV.pdf` fixture. |
| Stale browser/Node assumptions | `scripts/founder-content.test.mjs` lines 23/28 (exact biography with `Clever Soft SA`), 54 (legacy path), 58 (two entries), 65 (checks only `role` for `/Clever Soft/`, which a correct new entry also passes). `tests/e2e/founder.spec.ts` lines 21/45 (exact biography), 162–174 ("unchanged CV" case, legacy path/name), 181 and 287 (two entries/periods). **`tests/e2e/founder-responsive.spec.ts` line 112 expects two entries**; its no-JS case counts six links in `main` (unchanged by this plan). |
| Export/harness | `next.config.js`: `output: 'export'`, `trailingSlash: true`, build-time `NEXT_PUBLIC_BASE_PATH`. `lib/paths.ts` prefixes native links. `scripts/serve-static-export.mjs` serves `.pdf` as `application/pdf`. `founder.spec.ts` runs only in `chromium-desktop`; `founder-responsive.spec.ts` matches `compact-320-chromium`, `tablet-portrait-chromium` and, through the unanchored `/responsive\.spec\.ts/`, `mobile-chromium`, `mobile-webkit`, `tablet-chromium` and `wide-chromium`. `sfc-production.spec.ts` runs only with `PLAYWRIGHT_SERVE_EXPORT=1` on three engines and has an `assetPath()` helper for file URLs. |
| Case budget | [TEST-PLAYWRIGHT](../../testing/playwright.md) sets a planning envelope of at most **3200 default cases**; at the PLAN-SFC-V1 closeout (`971f9594`) the default list was **3195**. Each new per-locale `founder.spec.ts` case adds two; each new per-locale responsive case adds twelve. |
| CI coverage | `.github/workflows/ci.yml` runs `npm run validate` and the four-shard default Playwright set with `NEXT_PUBLIC_BASE_PATH=/Portfolio`. It runs **neither** `npm run verify:static-export` **nor** the production (`PLAYWRIGHT_SERVE_EXPORT=1`) family. `deploy.yml` builds and publishes `main` to GitHub Pages with no verifier step. Export-artifact and three-engine download evidence is therefore local only, and **merging publishes the PDFs**. |
| Visual baselines | `tests/e2e/visual/founder.visual.spec.ts-snapshots/` holds eight files: `founder-{spanish,english}-{wide,compact}-visual-chromium-{win32,linux}.png`, capturing `main` under `next dev`. Linux files are adopted only from same-head CI actuals after owner approval ([TEST-VISUAL-REGRESSION](../../testing/visual-regression.md)). |

**Discovery evidence, not implementation acceptance (revision 1):** `node --test scripts/founder-content.test.mjs scripts/founder-export.test.mjs` passed 11/11 with localhost access (the first restricted run failed only its HTTP fixture with `connect EACCES`, an environment failure). `npm run docs:check` and `npm run skills:check` passed. No behavior test, browser check or build has been run for this plan.

## PDF inputs received (2026-10-20)

During plan review the owner's main checkout (`D:/Projects/NextJS/Portfolio`, branch `main`) held these **uncommitted** inputs: `public/Samuel-Furlanich-CV.pdf` deleted (OD-2) and two untracked files. They are recorded here as received drafts; Task 1 imports them only after the gate below.

| File | Bytes | SHA-256 | Observed language and content | Metadata / structure |
| --- | --- | --- | --- | --- |
| `public/Samuel-Furlanich-CV-ES.pdf` | 195,961 | `a9a6611486af5311b59557785d0c56ff328ac3c94e4d239efbe24e584b250120` | Spanish, one page. CleverSoft S.A. "Desarrollador de Software y Analista de Soporte, 2026 - Actualidad"; FURLANICH "2023 - Actualidad"; UBA "Graduado · 2022 - 2025". | `%PDF-1.7`; document `/Lang(en-US)`; **one embedded file named "Content Credentials"** (a C2PA provenance manifest); no local paths found. |
| `public/Samuel-Furlanich-CV-EN.pdf` | 194,212 | `02f5b438d3e28f6f164856da90ac12aa281c780e9a3d8afdc77be518c3565625` | English, one page. CleverSoft SA "Software Developer, 2026 - Today" and "Support Analyst, 2026 - Today"; FURLANICH "2023 – Today"; UBA "Bachelor Degree 2022 – 2025". | `%PDF-1.5`; pdfTeX/hyperref; empty Author/Title; no embedded files, JavaScript, forms or local paths found. |

**Input gate findings. The owner disposes of each before Task 1 can be declared ready.** *Dispositions given 2026-10-20 (history; see the [receipt](../../reviews/founder-localized-cv-and-experience.md)): G1, G6 and G7 addressed by replacement files; G2, G3 and G5 dismissed as not relevant; G4 resolved by OD-5 (the site now says 2023). The files in the table below are the superseded drafts; the final hashes are in the receipt.*

| ID | Finding | Required disposition |
| --- | --- | --- |
| G1 | **The ES profile is targeted at one employer:** it says Samuel seeks to contribute to "Grupo Andreoli" in the agricultural sector. Publishing it presents a job application as the public Founder CV. | **BLOCKER.** Supply a general ES CV, or explicitly approve publishing this wording. |
| G2 | The ES file embeds a "Content Credentials" attachment that may carry tool, identity or timestamp assertions. | **BLOCKER.** Inspect it and either re-export without it or approve it in writing. |
| G3 | The ES file declares `/Lang(en-US)`. | SHOULD: re-export with Spanish (`es`/`es-AR`) language metadata; otherwise record acceptance. |
| G4 | Both CVs start FURLANICH/independent work in **2023**; the approved site says **2024** (`Desde 2024` / `Since 2024`, biography paragraph 1). | **BLOCKER.** Correct the PDFs, or amend PAGE-FOUNDER through a separate owner decision. This plan does not change the 2024 site fact. |
| G5 | The CVs say `Graduado` / `Bachelor Degree`; the site deliberately says `Estudios completados` / `Studies completed`. | Owner confirms the CV wording; the site wording is unchanged here. |
| G6 | The EN CV spells the employer `CleverSoft SA`; the site will use `CleverSoft S.A.`. | Cosmetic; owner choice, recorded in the receipt. |
| G7 | Both files publish Samuel's email and phone number. The Contact page already publishes direct email and phone channels. | Owner confirms the PDFs may be public on merge. |

The implementation session **never edits, regenerates, translates or redacts PDF bytes**. It imports the owner's final files, re-hashes them, and records the final hashes, the disposition of each finding and the owner's language confirmation in the receipt. A replaced file must be re-hashed; the table above then becomes history.

## Classification, scope and execution routing

**Route: PLAN supporting one bounded Implementation PR.** The owner's request supersedes the biography-only/two-entry and single-CV contracts only; OD-1 corrects one recorded fact. Persist both as a dated amendment in their owners. There is no unresolved consequential architecture decision and no new RFC or ADR: [ADR-STATIC-LOCALIZED-ROUTING](../../decisions/static-localized-routing.md) remains valid. Preserve accepted ADRs, completed plans, earlier reviews and historical receipts.

**Concurrency: serial.** One task and one PR. Source, locale content, export contracts, assets and tests share files; do not split them into parallel sessions or separate preparatory PRs.

| Responsibility | Provider / model / review boundary |
| --- | --- |
| Planning | Revision 1: OpenAI Codex, GPT-6.1 Sol High. Revision 2: Claude Opus 5.5 plan-review session (see Revision history). Neither dispatches an implementer. |
| Plan independent review | A fresh top-level session that contributed to neither revision, before the owner accepts the plan ([I-8](../../governance/agent-usage.md#invariants)). |
| Task 1 implementation and self-review | Anthropic Claude Code, **Claude Sonnet 5.5 High** (`claude-sonnet-5-5`, effort `high`), the [ADE implementation default](../../governance/agent-usage.md#models). One primary session owns the entire write set. Record the resolved ID and effort; an unavailable target requires explicit resolution, not silent substitution. |
| Implementation PR independent review | Fresh top-level **OpenAI Codex review through the `codex` plugin at its resolved default model**; record the exact model in the receipt. Read-only, no contribution to the PR, never spawned by the implementer. |
| Human owner/reviewer | Samuel Furlanich disposes of G1–G7, confirms PDF language/content, approves changed Founder renderings/baselines, and reviews and merges the PR. Employer experience conveys employment, not endorsement or client evidence. |

Applied Skills: `writing-plans`, `architecture-governance`, `project-knowledge-maintenance`, and, for Task 1, the repository's `test-driven-development`, `frontend-implementation`, `playwright-qa`, `visual-qa` (one added entry changes page height and snapshots), `verification-before-completion` and `pr-readiness`; `using-git-worktrees` supplies isolation. Run any Skill-requested review inline as self-review and record the delegation override. No Figma, animation, Three.js or design-tool work.

## Scope

- Two localized, owner-supplied CV files and their locale-specific native downloads at root and `/Portfolio`.
- Removal of the legacy `public/Samuel-Furlanich-CV.pdf` (OD-2) and contracts that keep it removed.
- One new CleverSoft S.A. experience entry per locale, the biography employer-spelling normalization, and the matching type, verifier, test and documentation contracts.

## Non-goals

- Authoring, editing, translating, redesigning, compressing, tagging or redacting CV contents (the owner supplies final bytes).
- A redirect, compatibility page or `Content-Disposition` header for the removed legacy URL (static export on GitHub Pages cannot provide one).
- Changing the independent-work start year beyond OD-5 (2023), the education wording, capabilities, MPC, Projects/Contact bridges, LinkedIn/GitHub URLs, layout, typography, styling or motion.
- Employer technology stack, seniority, customers, metrics, logos, links or any FURLANICH delivery claim drawn from CleverSoft work.
- CI or deploy workflow changes (the CI coverage gap is recorded under Risks as follow-up input).
- Editing retained `data/`, immutable ADR history, completed plans/reviews or Skill files.
- Portrait photography or other deferred PAGE-FOUNDER scope.

## Implementation approach and constraints

### Locale-owned CV contract

Narrow only `FounderPageContent.professionalLinks.cv` to **`DocumentLink & { downloadName: string }`** in `components/founder/content-types.ts`. Leave the general `DocumentLink` unchanged. Each content object supplies its own root-relative path and basename; the shared component uses `download={content.cv.downloadName}` and its existing `withBasePath(content.cv.path)`.

| Locale / route | Repository asset | Content path | Download name | Root URL | Project-site URL |
| --- | --- | --- | --- | --- | --- |
| ES `/estudio/samuel-furlanich/` | `public/Samuel-Furlanich-CV-ES.pdf` | `/Samuel-Furlanich-CV-ES.pdf` | `Samuel-Furlanich-CV-ES.pdf` | `/Samuel-Furlanich-CV-ES.pdf` | `/Portfolio/Samuel-Furlanich-CV-ES.pdf` |
| EN `/en/about/samuel-furlanich/` | `public/Samuel-Furlanich-CV-EN.pdf` | `/Samuel-Furlanich-CV-EN.pdf` | `Samuel-Furlanich-CV-EN.pdf` | `/Samuel-Furlanich-CV-EN.pdf` | `/Portfolio/Samuel-Furlanich-CV-EN.pdf` |

Only the URL gains `/Portfolio`, exactly once; the asset location and download basename never do. Document URLs have no trailing slash, locale directory, fragment or query. Preserve the native same-origin anchor, the localized labels (`Descargar CV` / `Download CV`), focus appearance and the CV → LinkedIn → GitHub order. No click handler, blob fetch, API route, runtime locale detection or duplicate Founder renderer.

### Legacy CV removal (OD-2)

Delete `public/Samuel-Furlanich-CV.pdf` in the same PR that adds both localized files, never before. After the change, no current source, test expectation, export artifact or current-requirement document references `/Samuel-Furlanich-CV.pdf` (the substring `Samuel-Furlanich-CV.pdf` does not match the localized names). Historical records keep their wording. Previously shared links return GitHub Pages' 404; this is the owner's accepted outcome, not a defect. Rollback needs more than a revert of the merge commit: the owner removed the legacy file before this PR, so the rollback PR must also restore it (see step 8).

### Professional experience amendment

Add **one entry first**, followed by the two existing entries unchanged and in their existing order. With OD-1 the list is ordered by start date, newest first: June 2026, 2023 (independent work, OD-5), 2021. Reuse the existing schema and renderer.

| Field | Spanish | English |
| --- | --- | --- |
| Section heading | `Experiencia profesional` (unchanged) | `Professional experience` (unchanged) |
| Period | `Desde junio de 2026` | `Since June 2026` |
| Role | `Software Developer` | `Software Developer` |
| Context | `CleverSoft S.A.` | `CleverSoft S.A.` |
| Summary | `Ingreso como analista de soporte (Support Analyst) y posterior paso a Software Developer. Mantenimiento y desarrollo de soluciones ERP y de software para la resolución de pagos.` | `Joined as a Support Analyst and later moved into the Software Developer role. Maintenance and development of ERP and payment-resolution software.` |

The period remains short mono metadata (19 and 15 characters, inside the 64-character `expectShortMonoOnly` limit). The summary gives no date for the role change (OD-1). Normalize the employer to `CleverSoft S.A.` in biography paragraph 3 only (`…como Software Developer en CleverSoft S.A., experiencia que…` / `…as a Software Developer at CleverSoft S.A., experience that…`); keep every other biography sentence and verified fact. Keep `Software Developer` as the exact employer title, distinct from the general `Ingeniero de software` / `Software Engineer` descriptor. Add nothing from the CVs that the site does not already approve (Non-goals).

## Review focus

Each condition below has a Task 1 test or an explicit gate:

- **Locale switch, then download:** the new page supplies its own PDF and filename, with no stale state from the other locale.
- **Same file behind two names:** literal locale URLs plus distinct source and download bytes catch accidental remapping; the owner confirms the actual language.
- **Subpath handling:** exactly one `/Portfolio` prefix and no trailing slash on PDFs; the build and the browser server use the same base path.
- **Legacy removal:** no file, link or payload reference survives, and nothing silently re-adds it.
- **Corrected chronology:** June 2026 is the CleverSoft joining date; no role-change date is invented; independent work starts in 2023 (OD-5), matching both CVs.
- **Longer list:** every previous fact and link survives; 320px reflow, 200% text growth, keyboard reachability and controlled Founder image diffs cover the added height.
- **Publication:** the PDFs go public on merge. G1–G7 are closed before readiness.

## Task 1 / PR 1 – Localize Founder CV downloads and add CleverSoft experience

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Provider / reviewer:** Claude Code / `claude-sonnet-5-5`, effort `high`; independent Codex plugin reviewer at the recorded resolved default, then Samuel's human review. No concurrent implementation task.

**Requirement:** deliver both localized assets/downloads, the legacy removal and the bilingual entry atomically; preserve the existing verified profile facts and professional destinations under root and `/Portfolio` export.

**Exclusive ownership / expected files** (relative to the implementation checkout):

| Area | Exact files and responsibility |
| --- | --- |
| Production content | `app/(es)/_content/founder.ts`, `app/(en)/en/_content/founder.ts`: locale CV path/name, biography employer spelling, new first experience entry. |
| Shared download contract | `components/founder/content-types.ts`, `components/founder/FounderProfessionalLinks.tsx`: required Founder-only `downloadName`, native anchor binding. |
| Production assets | Add `public/Samuel-Furlanich-CV-ES.pdf` and `public/Samuel-Furlanich-CV-EN.pdf` (owner's final files, hashes recorded). Delete `public/Samuel-Furlanich-CV.pdf`. |
| Node / artifact contracts | `scripts/founder-content.test.mjs`, `scripts/founder-export.test.mjs`, `scripts/export-requirements/founder.mjs`, and the Founder-owned assertions in `scripts/verify-static-export.mjs`. Run `scripts/verify-static-export.test.mjs` as shared regression; edit its fixtures only if the new Founder contract requires it. |
| Browser behavior | `tests/e2e/founder.spec.ts` (locale download, entry and preservation checks; replaces the two-entry, legacy-name and "unchanged CV" assumptions), **`tests/e2e/founder-responsive.spec.ts` (entry count at line 112 only)**, and `tests/e2e/sfc-production.spec.ts` (a new `Founder localized profile` describe for exported pages and downloads on three engines, using the existing `assetPath()` helper and project registration). |
| Existing checks reused unchanged | `tests/e2e/accessibility.spec.ts`, `tests/e2e/visual/founder.visual.spec.ts`. Change only a stale contract proven by this scope. |
| Intentional baseline changes | Only `tests/e2e/visual/founder.visual.spec.ts-snapshots/founder-{spanish,english}-{wide,compact}-visual-chromium-{win32,linux}.png` (four per platform), after owner approval. No other snapshot. |
| Documentation | The owners and dependents in Documentation synchronization, this plan's Progress/decisions/deviations, the plan index, and one receipt at `docs/reviews/founder-localized-cv-and-experience.md`. |

Read-only references: route shells, `FounderPage.tsx`, `FounderProfessionalHistory.tsx`, `components/foundation/content-types.ts`, `lib/paths.ts`, `lib/site-routes.ts`, `next.config.js`, `playwright.config.ts`, `tests/e2e/support/*`, `scripts/export-test-support.mjs`, `scripts/serve-static-export.mjs`, `.github/workflows/*`, retained `data/`. No change to routing, hosting, workflows, runtime graph, styling, global components, dependencies or Skill files.

**Interfaces:** consumes `FounderPageContent`, `DocumentLink`, `withBasePath(path: string)` and the four-field experience entry. Produces a required `professionalLinks.cv.downloadName`, a localized unprefixed `.path`, and three complete entries per locale. In `founderRequirements`, keep `cv` as the unprefixed path and add `cvDownloadName` and `employer: 'CleverSoft S.A.'`. The page-owned map encodes the three-entry and employer-in-experience expectations; the shared verifier keeps the logic and the other pages' contracts.

**Verifier contract (GREEN target).** For each Founder artifact, `assertFounderArtifact` must:

1. find one `<a>` start tag whose `href` equals `expectedHref(cv)` **and** whose `download` equals `cvDownloadName` (the same element; a separate matching link is insufficient);
2. require `out/<cv basename>` to exist and begin with `%PDF-`, and require the ES and EN files to have different SHA-256 values;
3. require exactly **three** `data-founder-experience-entry` items, with `employer` inside the **first** entry and nowhere in a heading;
4. reject the legacy spelling `Clever Soft SA` anywhere in the Founder HTML.

Once per export, the verifier also fails if `out/Samuel-Furlanich-CV.pdf` exists or any scanned text file references `/Samuel-Furlanich-CV.pdf`. Prefix every new Founder message with the Founder HTML file (`- estudio/samuel-furlanich/index.html: Founder …`) so that `founder-export.test.mjs`'s existing filter observes it. Keep every other protection.

### Playwright case budget

Measure `npx playwright test --list` (default set) at the base before any test edit and record the count. Prefer folding new assertions into existing per-locale cases; the target is **zero net new default cases**:

- the "downloads the unchanged CV" case becomes the localized download case (click, `suggestedFilename()`, saved bytes equal to the source file, `download.failure()` null, then a locale switch followed by the other locale's download);
- the professional keyboard-order case adds Enter activation of the CV and its download event;
- the compact-period case and the editorial heading/period case move from two to three entries;
- production cases live only in `sfc-production.spec.ts`, outside the default list.

Re-measure after GREEN. Any default count above 3200 requires the owner's recorded approval in [TEST-PLAYWRIGHT](../../testing/playwright.md) before readiness; never delete unique coverage to fit.

### Serial steps and strict TDD

- [ ] **1. Isolate and rebase the evidence.** Recheck remote `main`, local status, `git-dir`/`git-common-dir` and submodule status. Inspect attached worktrees; reuse one only if it is clean and on this task's branch, otherwise create a managed worktree at the verified `main` SHA. Use branch `codex/founder-localized-cv-experience` and record the absolute checkout path and base SHA. Never reset, stash or commit the owner's work in other checkouts. Carry in this plan revision from PR #177 if it is not yet on `main`, and the owner's **final** PDFs from the location the owner names; verify their SHA-256 against the receipt and the dispositions of G1–G7. If `main` advanced, reconcile this plan against it. Run `npm ci` if needed. Before source edits, read `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `01-app/03-api-reference/03-file-conventions/public-folder.md` and `01-app/03-api-reference/05-config/01-next-config-js/basePath.md`. Run the focused Node baseline and record the default `playwright test --list` count. **Expected:** the known baseline passes with localhost access; any unresolved baseline failure is recorded and investigated, never called feature RED.

- [ ] **2. Persist the scoped requirement amendment.** Apply Documentation synchronization with a dated 2026-10-20 owner amendment: the request, OD-1's fact correction, OD-2's removal and the exact entry/download tables. Preserve historical wording and identify each superseded rule explicitly. This documentation step is exempt from code TDD; no product source or asset changes yet. **Expected:** `npm run docs:check` passes; no new RFC/ADR or unapproved scope.

- [ ] **3. RED: write the focused contract and browser tests before source or assets.** Use literal ES/EN paths, basenames and entry copy, independent of production content and route helpers. Add the cases in the RED/GREEN table. Run the narrow Node tests and the changed Founder browser cases against unchanged behavior, and the named production cases against a clean pre-change export at both bases. **Expected:** each intended assertion fails for the stated reason (legacy URL/name, missing localized assets, missing entry, legacy file still present, old verifier acceptance). A crash, missing browser, localhost denial, build failure or unselected test is not RED. Record the test name, assertion, command and exit result of every intended failure.

- [ ] **4. GREEN: minimum source, content and assets.** Add the Founder-only `downloadName`, the literal locale values and the native anchor binding. Add the entry and normalize the biography spelling. Add both final PDFs and delete the legacy file. Update the page-owned requirements and implement the verifier contract above, replacing only the superseded two-entry and narrative-only checks. **Expected:** focused tests pass with the real assets; any unclosed G1–G7 blocker stays an explicit blocker, never a fixture substitution.

- [ ] **5. REFACTOR, then verify again.** Remove obsolete hard-coded expectations and local duplication only where useful. Keep one Founder renderer, one locale-independent download component, the existing history schema and exactly one base-path application. No new utility layer for a two-field binding. Rerun the focused Node and browser cases and the complete export fixture tests. **Expected:** the same behavioral assertions stay green; no Tailwind/class-name assertions are added.

- [ ] **6. Rendered acceptance.** Run the responsive and Founder axe checks; inspect ES/EN at 320, 390, 768, 1024 and 1440px, including visible CV focus and the added entry. Confirm the period/role association, natural height, no clipping and the CV/LinkedIn/GitHub keyboard order. Run the controlled Founder visual spec; collect expected/actual/diff images for its four cases per platform and obtain owner approval before adopting replacements, following the [baseline adoption procedure](../../testing/visual-regression.md): controlled Windows captures, Linux actuals only from a same-head CI run, then normal comparison without update mode. The content request does not by itself approve image goldens. **Expected:** approved Founder-only baseline changes and no unrelated visual delta. Missing approval stays OPEN; never weaken thresholds or update snapshots in bulk.

- [ ] **7. Regression and PR readiness.** Run the verification matrix from focused to broad, including clean root and `/Portfolio` builds, the artifact verifier and real exported browser downloads. Re-measure the case budget. Record fresh commands, results, warnings, SHA/base/environment, the final PDF hashes, the G1–G7 dispositions and the owner approvals in the receipt; state explicitly that the export and production-browser evidence is local only (CI does not run it). Self-review the whole diff from the frozen base with `pr-readiness`, then obtain the independent review and the human PR review. Focused commits; one Implementation PR to `main`; never merge or push to `main`. **Expected:** every acceptance criterion has evidence and every blocker is closed. The receipt and PR body include `Agent usage: primary claude-sonnet-5-5 (high); subagents 0/0; independent reviewer <actual resolved model, separate session>`.

- [ ] **8. Publication, closeout and rollback.** In the same PR, following the PLAN-SPF-V1 Task 10 precedent, move this plan to `completed/` with `plan_status: COMPLETED` and wording that it **completes on the owner's merge of this PR**, and update the plan index and links. The PR body lists the owner's post-merge check: after the GitHub Pages deployment, open both Founder routes on the deployed site, download each CV, and confirm the locale, filename and file, and that `/Portfolio/Samuel-Furlanich-CV.pdf` returns 404. **Rollback:** if the deployed check fails, revert the merge commit **and restore `public/Samuel-Furlanich-CV.pdf` from its last tracked revision** (`git show 93ec6d72^:public/Samuel-Furlanich-CV.pdf`: blob `de15b7ff`, 194,201 bytes, SHA-256 `adcb9accf74f55b02c77894a2fcd4f5c7c3fc69cc6290f007daad2700312cff9`) in the same human-reviewed rollback PR. The owner's commits `93ec6d72` and `1bcc1748` already removed that file and supplied the localized PDFs before this PR, so this PR's revert alone restores the legacy anchors without their file and leaves the CV actions at 404. Do not revert those owner commits, and validate the recovered download at root and `/Portfolio` (the revert alone restores the old contracts, not the legacy file) and reopen the work through a new bounded PR; never hot-fix `main` directly. **Expected:** the closeout claims nothing about the deployment that has not happened; any failure is recorded by the follow-up PR.

### RED/GREEN behavior table

| Coverage | RED test and intended failure | Minimum GREEN / post-refactor assertion |
| --- | --- | --- |
| 1. Spanish CV | Imported ES content and the ES page CV anchor expect `/Samuel-Furlanich-CV-ES.pdf`; today they give the legacy PDF. The asset assertion expects the named file in `public/`. | ES content, the emitted anchor and the browser request all select the ES asset: HTTP 200, `application/pdf`, `%PDF-`, a saved download. |
| 2. English CV | The equivalent literal EN expectations fail against the legacy PDF. | EN selects `/Samuel-Furlanich-CV-EN.pdf`, with the same response and download checks. |
| 3. Filename and URL | Both locales expect their exact `download` attribute and `suggestedFilename()`; today both are `Samuel-Furlanich-CV.pdf`. Verifier fixtures with a wrong or missing `download`, or a `download` on a different element than the matching `href`, must fail; the current verifier accepts all three. | The anchor, response URL, downloaded basename and downloaded bytes agree with the locale's source file. No document URL has a trailing slash. |
| 4. Locale separation | Assert distinct literal paths and distinct source SHA-256 values; today the paths coincide. The browser case downloads, switches locale, then downloads again. | Saved and requested bytes match the corresponding source and not the other locale. A swapped-locale fixture serving a valid PDF fails. The owner confirms both languages. |
| 5. PDF presence in export | Verifier fixtures that omit one CV file, ship one without `%PDF-`, or ship identical ES/EN bytes must fail; the current verifier never looks at `out/` PDFs. | Clean builds emit both files at the `out/` root; the verifier accepts them and rejects each negative fixture with a `Founder` message prefixed by the artifact file. |
| 6. Legacy removal | Assert `public/Samuel-Furlanich-CV.pdf` is absent and no current source or export references `/Samuel-Furlanich-CV.pdf`; today it exists and both locales link to it. A verifier fixture that still contains `out/Samuel-Furlanich-CV.pdf` must fail. | The file is gone from `public/` and `out/`; no exported text file names it; production cases see 404 for the legacy URL at both bases. |
| 7. Experience | Node content and experience-region browser assertions require three entries; the first has the literal period, role, context `CleverSoft S.A.` and summary above in each locale. The content test checks `context`, not only `role`. A three-entry fixture fails the old verifier. | The new first entry carries the approved copy; the existing entries follow unchanged; the employer is found inside the first experience entry, not inferred from the biography. |
| 8. Biography spelling | Exact biography expectations use `CleverSoft S.A.`; today paragraph 3 says `Clever Soft SA`. A verifier fixture containing `Clever Soft SA` must fail. | Only the employer spelling changes; every other biography sentence is identical in both locales. |
| 9. Preservation | Characterize both existing entries, the biography facts, education, the complete MPC qualification/source, the four capability groups, the word bindings, the Projects/Contact paths and the exact LinkedIn/GitHub hrefs. These initially pass. Prove a guard by temporarily removing the 2021 entry or changing a professional href in the isolated checkout: the targeted assertion fails; restore; rerun green. Do not report unchanged behavior as missing-feature RED. | Old entries keep their four fields and relative order; exact professional URLs and the complete profile remain; the hierarchy and language-switch tests stay; no fragile CSS assertions. |
| 10. Root, base and static | At each base, the pre-change export's CV expectations fail against the legacy asset. Add fixture negatives for swapped PDFs, a wrong filename and a missing or doubled `/Portfolio` prefix; run the real verifier, not a grep of its source. | Served CV URLs are `/Samuel-Furlanich-CV-{ES,EN}.pdf` or `/Portfolio/Samuel-Furlanich-CV-{ES,EN}.pdf`, prefixed exactly once; the suggested names stay unprefixed. |
| 11. Native, keyboard, no-JS | Extend the keyboard case to Enter-activate the CV and inspect the download event. Run the locale expectations in a JavaScript-disabled production context; they fail before the feature exists. Existing focus/order characterizations may already pass. | Tab/Shift+Tab follow native order; focus stays visible; Enter starts the matching download without navigating away. The native download and the complete experience content work without JavaScript; no interception. |

Where a protection already exists, characterize it honestly and use a reversible mutation to witness its failure. New behavior still follows **RED → verify intended failure → minimum GREEN → REFACTOR → verify again**. Never commit mutation changes, and never implement first and backfill tests.

## Verification matrix

Run from the recorded implementation checkout, serially, stopping on a nonzero result. Commands use PowerShell environment syntax. Playwright owns server startup and cleanup; stop any stray `next dev` on port 3100 first (the default set reuses an existing server outside CI). Keep `PLAYWRIGHT_BASE_URL` unset. `PLAYWRIGHT_SERVE_EXPORT=1` is required for production cases; `founder.spec.ts` selects no tests in production mode, so such a run is not evidence.

| Gate | Command / scope | Acceptance evidence |
| --- | --- | --- |
| Focused Node | `node --test scripts/founder-content.test.mjs scripts/founder-export.test.mjs scripts/verify-static-export.test.mjs` | Observed feature RED then GREEN; both locale contracts; every negative fixture; the preservation guards. |
| Focused Founder browser | `npm run test:e2e -- tests/e2e/founder.spec.ts --project=chromium-desktop --workers=1` | ES/EN content, links, locale switch, filenames, actual download bytes, keyboard behavior. |
| Responsive | `npm run test:e2e -- tests/e2e/founder-responsive.spec.ts --project=compact-320-chromium --project=mobile-chromium --project=mobile-webkit --project=tablet-portrait-chromium --project=tablet-chromium --project=wide-chromium --workers=1` | Reflow, no-JS content, 200% zoom and text-spacing growth at every profile; three entries, no clipping. |
| Focused accessibility | `npm run test:a11y -- --grep Founder` | No critical or serious axe findings in either locale; the manual CV focus/Enter/order review is recorded separately. |
| Focused visual | `npm run test:e2e -- tests/e2e/visual/founder.visual.spec.ts --project=visual-chromium` | Four cases per platform pass normal comparison after controlled, owner-approved adoption. |
| Case budget | `npx playwright test --list` (default set, no export variables), before and after | Recorded counts; at most 3200 or the owner's recorded approval. |
| Broad deterministic | `npm run validate` | `docs:check`, `npm test`, `lint`, `typecheck`, `build` all exit zero after the final edits. Run at root locally; CI repeats it at `/Portfolio`. |
| Skill integrity | `npm run skills:check` | Unchanged Skill integrity passes. |
| Broad browser | `npm run test:e2e` (default/root) | The full default matrix passes, including Founder, navigation, accessibility and visual regressions. |
| Root static | Clean root build, `npm run verify:static-export`, then the production command below | Both Founder artifacts, both PDFs, no legacy file, CV anchor/`download` pairing, three-engine exported behavior. |
| `/Portfolio` static | A separate clean `/Portfolio` build, the same verifier and production command | The same behavior under the project-site prefix, plus exact-once URL prefixing. |
| Diff / final readiness | `git diff --check`; inspect frozen-base-to-HEAD and every staged, unstaged and untracked file; apply `verification-before-completion` and `pr-readiness` | No whitespace errors, unreviewed assets, secrets, generated output, unrelated changes or unverified claims; binary diffs limited to the two added PDFs, one deleted PDF and the approved snapshots. |

For **each** export mode, first stop any owned dev/export server. Confirm that the resolved `.next/` and `out/` targets are inside this checkout, then remove only those generated directories with native PowerShell `Remove-Item -LiteralPath` (no cross-shell deletion). Use `''` for root and `'/Portfolio'` for the second run:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '' # use '/Portfolio' for the second independent build
Remove-Item Env:PLAYWRIGHT_SERVE_EXPORT -ErrorAction SilentlyContinue
Remove-Item Env:PLAYWRIGHT_BASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:SFC_TEST_MODE -ErrorAction SilentlyContinue
# Clean the verified checkout-local generated directories as described above.
npm run build
npm run verify:static-export
$env:PLAYWRIGHT_SERVE_EXPORT = '1'
npm run test:e2e -- tests/e2e/sfc-production.spec.ts --project=sfc-production-chromium --project=sfc-production-firefox --project=sfc-production-webkit --grep 'Founder localized profile'
Remove-Item Env:PLAYWRIGHT_SERVE_EXPORT
```

The production cases cover **both routes**: valid, matching and distinct PDFs; click and keyboard downloads; the legacy URL's 404; the preserved profile; locale switching; representative no-JS contexts. Use `assetPath()` for file URLs, not `appPathname()`, which appends `/`. Inspect `download.failure()` and saved bytes as well as the suggested filename. Restore the environment afterwards. Build evidence is valid only for the source SHA and base path actually served; never reuse one `out/` for both modes. Localhost or browser restrictions are environment blockers, not product failures or passes.

**Task acceptance:** every RED/GREEN row is evidenced; G1–G7 are disposed and the two final genuine files are the actual downloads; the legacy file and references are gone; every prior verified fact and link survives; both export modes and the planned regression gates pass; the case budget holds; documentation is synchronized; Founder-only visual updates are approved; independent and human reviews remain the merge boundary. One passing focused suite does not complete the packet.

## Documentation synchronization

| Owner / dependent record | Required update in this same PR |
| --- | --- |
| `docs/product/pages/studio-and-founder.md` (PAGE-FOUNDER) | Own the dated 2026-10-20 amendment: the request; OD-1's correction of the CleverSoft fact (joined June 2026 as Support Analyst, later Software Developer, no role-change date); the exact ES/EN entry; the employer spelling; the localized PDF path/name table; OD-2's legacy removal. Explicitly supersede the biography-only employer rule, "two source-backed experience entries" and the preserved-asset/download-name rule, keeping them as labeled history. Preserve every other approved fact, the deferred portrait scope and the deferred CV-redesign scope (the owner supplies the new files; this is not a redesign). |
| `docs/product/personal-portfolio-migration.md` (PORTFOLIO-MIGRATION) | Point current mapping/closure guidance at the new PAGE-FOUNDER contract; label the narrative-only and "public/Samuel-Furlanich-CV.pdf remains the preserved asset" rules as superseded. Keep dated findings and retained datasets historical. Do not copy exact public wording. |
| `docs/design/studio-founder-contact-v1.md` (DESIGN-SFC-V1) | Add a bounded current amendment for three experience entries and localized CV destinations/names; supersede "Clever Soft SA remains narrative-only" and "Preserve `/Samuel-Furlanich-CV.pdf`, its download filename". Preserve layout, typography, native link treatment, runtime decisions and historical approvals. |
| `ARCHITECTURE.md` | Update the current Founder summary's employer spelling (`CleverSoft S.A.`) and link PAGE-FOUNDER. Preserve dated history. No architecture decision changes. |
| `docs/architecture/current-system.md` | Inspect only: it states no current CV path or employer fact. Change it only if a current statement becomes false. |
| `docs/governance/status-register.md` | Summarize the amendment and link PAGE-FOUNDER; mark the "narrative biography only" and "began working at Clever Soft SA as a Software Developer in June 2026" lines as superseded by the corrected fact. Keep G1–G7, implementation and visual acceptance OPEN until evidenced. Do not repeat exact copy or promote unrelated OPEN items. |
| `docs/plans/index.md` | Revision 1 adds the PROPOSED entry; Task 1 step 8 moves it to Completed, conditioned on the owner's merge. |
| `docs/testing/playwright.md` | Record the new production Founder download coverage, the measured default case count and any approved envelope change. |
| `docs/testing/visual-regression.md` | Update the Founder baseline row with the replacement provenance (platform, exact head and run, hashes, owner approval). Preserve older receipts and approval history. |
| `docs/reviews/founder-localized-cv-and-experience.md` and this plan's Progress | One concise receipt: PDF provenance, final hashes, G1–G7 dispositions and language confirmation; actual provider/reviewer IDs; frozen base and head; RED/GREEN assertions; commands and exit results; base paths; case counts; visual approval; the local-only scope of export evidence; warnings and unresolved checks. Evidence, not a second requirements owner. |

Inspect `docs/index.md`, `docs/design/visual-language.md`, `docs/design/interaction-responsive-accessibility.md`, `CONTEXT.md` and every other hit of `Clever Soft` or `Samuel-Furlanich-CV` for newly stale current statements. Their generic hierarchy, native-download, accessibility and glossary rules need no change unless this implementation makes a current statement false. Update `related`/`last_verified` only for changed records. Never edit immutable ADR history, completed plans or reviews (for example `docs/reviews/studio-founder-contact-acceptance-v1/task-07.md`), Skill locks or retained `data/about.json`. No new standalone asset-contract document: PAGE-FOUNDER owns the contract.

## Risks and edge cases

- **Inputs not yet publishable (history; dispositioned 2026-10-20, see the receipt):** G1 (employer-targeted ES profile), G2 (embedded Content Credentials) and G4 (2023 vs 2024) blocked readiness. Never edit the PDFs, map both locales to one file or ship a draft to unblock.
- **Merge is publication:** GitHub Pages deploys `main` with no verifier, so a wrong file or broken link is public at once. Local root and `/Portfolio` export evidence, the owner's post-merge check and the revert-plus-restore path in step 8 are the controls.
- **CI does not cover the export:** neither `verify:static-export` nor the production family runs in CI, so a later regression in PDF emission or download pairing would not be caught there. Recorded as follow-up input; adding a CI step is outside this plan.
- **Case budget:** the default list sits five cases under its 3200 envelope. Fold assertions into existing cases; an increase needs recorded owner approval.
- **Legacy link breakage:** external links to `/Portfolio/Samuel-Furlanich-CV.pdf` 404 after merge (OD-2, accepted). No redirect is possible.
- **Chronology:** June 2026 is now the joining date (OD-1). No role-change month is invented; independent work starts in 2023 (OD-5), which resolves G4 and matches both CVs.
- **Stale contract enforcement:** content alone would fail the old count and spelling checks, while the old `role`-only employer test would wrongly pass. Update the owning requirements and their consumers together, keeping the other protections.
- **Native download variance:** response bytes, suggested filename and Enter activation across three engines are the evidence; an `href` check is insufficient, and a PDF signature never proves content or language.
- **Build contamination and URL normalization:** separate clean builds are required; route helpers append `/` to paths. Never double the base prefix or make assets relative to the nested route.
- **Snapshot approval:** one more entry changes full-page geometry. Only the named Founder baselines are in scope; an unapproved or unavailable platform capture stays OPEN.
- **Employment framing:** factual depth without customer or technology detail and without implying company endorsement.

## Progress

Implementation of Task 1 ran on 2026-10-20 (OD-5 and the owner's gate dispositions applied the same day) in an isolated worktree on `codex/founder-localized-cv-experience` (Claude Sonnet 5.5, 0 subagents) and is recorded in the [receipt](../../reviews/founder-localized-cv-and-experience.md): documentation amendment, failing-first tests, implementation, and local root and `/Portfolio` verification. **Not complete.** Owner approval of the four Founder visual baselines, the independent Codex review and CI remain open, and the plan stays `active`. Revision 2 recorded OD-1 to OD-4 and the received PDF drafts (G1–G7).

**Authorized first implementation task (after plan acceptance): Task 1 / PR 1 – Localize Founder CV downloads and add CleverSoft experience.** This is the only implementation handoff: Claude Sonnet 5.5 High in one isolated worktree on a `codex/` branch, starting at step 1 and following the TDD sequence. There is no Task 2, parallel packet, delegated work, separate governance PR or merge authority. G1–G7 and the baseline approval are completion gates, not permission to substitute content.

## Important implementation decisions

| Date | Decision | Source |
| --- | --- | --- |
| 2026-10-20 | OD-1 to OD-4 (joining date, legacy removal, entry voice, plan revision). | Owner, plan review |
| 2026-10-20 | The owner committed both localized PDFs and the legacy deletion to `main` (`93ec6d72`) before implementation; the plan's input gates were not dispositioned by that commit. | Owner commit, observed at implementation start |

## Deviations discovered during execution

- The legacy PDF deletion and the two PDF additions were already on `main` (`93ec6d72`), so Task 1 step 1 imported nothing and the PR carries no binary changes; the legacy-absence contract is asserted by tests instead.
- No pre-change `/Portfolio` production RED run; see the receipt's Rulings.
- The plan was not moved to `completed/` (step 8) because completion gates are open.
- OD-5 changed the 2024 independent-work fact during execution; the Non-goal that kept it is superseded.
