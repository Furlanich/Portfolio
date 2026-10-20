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

**Goal:** give each Founder locale its own genuine CV download and add Samuel's factual CleverSoft S.A. progression while preserving the existing professional profile.

**Architecture:** keep explicit Spanish-root and English-`/en/` routes, locale-owned typed content, the shared Founder Server Components and native anchors. Apply the existing base-path helper once to each document path; keep static export and trailing-slash page routes.

**Stack:** the repository's locked Next.js 16 / React 18 / TypeScript setup, Node 24 contract tests, Playwright 1.63 and axe. No dependency or hosting change.

**Spec:** [PAGE-FOUNDER](../../product/pages/studio-and-founder.md), [DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md), [DESIGN-VISUAL](../../design/visual-language.md), [DESIGN-IX-A11Y](../../design/interaction-responsive-accessibility.md), and the owner's bounded request of 2026-10-20, captured below. The page specification remains the content/download authority; implementation synchronizes it before treating the new copy as published requirements.

## Current-state findings

Discovery inspected clean local `main` at **`550c953b6d0ef9580d2e1b5605684c9611559af4`**, merge PR #176. The GitHub connector independently resolved remote `main` to the same SHA on 2026-10-20. Shell `git ls-remote` failed in the restricted environment; the connector supplied remote evidence instead.

| Area | Repository evidence and implication |
| --- | --- |
| Actual routes | `lib/site-routes.ts` and `app/(es)/estudio/samuel-furlanich/page.tsx` / `app/(en)/en/about/samuel-furlanich/page.tsx` confirm `/estudio/samuel-furlanich/` and `/en/about/samuel-furlanich/`. Both shells render `components/founder/FounderPage.tsx`. |
| Content ownership | `app/(es)/_content/founder.ts` and `app/(en)/en/_content/founder.ts` satisfy `FounderPageContent` in `components/founder/content-types.ts`. Experience entries already have `period`, `role`, `context`, `summary`; the shared history renderer maps the list. No separate locale page implementation is needed. |
| Current download | Both content objects point to `/Samuel-Furlanich-CV.pdf`. `FounderProfessionalLinks.tsx` already uses a native anchor and `withBasePath(content.cv.path)`, but hardcodes `download="Samuel-Furlanich-CV.pdf"`. Shared `DocumentLink` currently has only `label` and `path`; its sole current consumer is Founder. |
| Assets | Only `public/Samuel-Furlanich-CV.pdf` exists (194,201 bytes). **Neither required localized PDF exists.** Their addition is a delivery dependency, not permission to generate CV contents or rename the same document twice. |
| Current experience | Two entries: independent practice since 2024, then the 2021 IT Technician internship. Education, MPC's educational/group/fictional-business qualifications and source link, four capability groups, Projects and Contact bridges are present in both locales. `data/experience.json` is retained migration input, not current public copy. |
| Employer/date evidence | The biography currently says `Software Developer at Clever Soft SA`. PAGE-FOUNDER explicitly records **June 2026 as the Software Developer role start**. The new owner facts add the preceding Support Analyst role and ERP/payment-resolution work. No Support Analyst start or overall employment start date is established. |
| Superseded rules | PAGE-FOUNDER, `personal-portfolio-migration.md` and DESIGN-SFC-V1 require biography-only employer treatment and the single legacy CV. `scripts/verify-static-export.mjs` enforces two entries and biography-only `Clever Soft SA`; tests also assume the old CV and two entries. These are real contract changes, not just copy edits. |
| Export/harness | `next.config.js` sets `output: 'export'`, `trailingSlash: true`, and build-time `NEXT_PUBLIC_BASE_PATH` for basePath/assetPrefix. `lib/paths.ts` prefixes native asset links. `scripts/serve-static-export.mjs` already serves PDFs as `application/pdf`. Ordinary `founder.spec.ts` runs in `chromium-desktop`; production mode registers only production specs, including `sfc-production.spec.ts` in Chromium, Firefox and WebKit. |

**Discovery evidence, not implementation acceptance:** `node --test scripts/founder-content.test.mjs scripts/founder-export.test.mjs` passed **11/11** after granting localhost access. The first restricted run passed 10/11 and failed its HTTP fixture with `connect EACCES`; it was an environment failure, not feature RED. Node emitted the existing `MODULE_TYPELESS_PACKAGE_JSON` warning. `npm run docs:check` passed (367 Markdown files before this plan); `npm run skills:check` passed (30 Skills / 97 files); `git diff --check` passed on the initial clean checkout. No new behavior tests, browser checks or builds have been run in this planning session.

## Classification, scope and execution routing

**Route: PLAN supporting one bounded Implementation PR.** The owner's request explicitly supersedes the biography-only/two-entry restriction and single-file CV contract only. Persist that dated amendment in their existing owners. There is no unresolved consequential architecture decision and no new RFC or ADR: [ADR-STATIC-LOCALIZED-ROUTING](../../decisions/static-localized-routing.md) remains valid. Preserve accepted ADRs, completed plans, earlier reviews and historical receipts.

**Concurrency: serial.** There is one task and one PR; source, locale content, export contracts and tests share files. Do not split them into parallel sessions or separate preparatory governance/testing PRs.

| Responsibility | Provider / model / review boundary |
| --- | --- |
| Planning authority | OpenAI / Codex, GPT-6.1 Sol High (`gpt-6.1-sol`, reasoning `high`), as requested. This plan does not dispatch an implementer. |
| Task 1 implementation and self-review | Anthropic / Claude Code, **Claude Sonnet 5.5 High** (`claude-sonnet-5-5`, effort `high`). One primary session owns the entire write set. A single Sonnet session suits the coupled content/type/verifier/browser work and follows the current ADE Sonnet default; do not copy the completed SFC plan's Luna split. Record the resolved ID and effort; an unavailable target requires explicit resolution, not silent substitution. |
| Independent PR reviewer | Fresh top-level **OpenAI Codex review through the `codex` plugin, at its configured/resolved default model**; record the exact resolved model in the receipt. This is the current ADE D6 amendment, which deliberately does not require a selectable Sol/Luna review model. Read-only, no contribution to this PR, no implementer-spawned reviewer. |
| Human owner/reviewer | Samuel Furlanich verifies PDF locale/content, approves changed Founder renderings/baselines and reviews/merges the PR. Employer experience conveys employment, not endorsement or client evidence. |

Applied planning Skills: `using-superpowers`, `writing-plans`, `architecture-governance`, `project-knowledge-maintenance`, and the repository's `test-driven-development`, `frontend-implementation`, `playwright-qa`, `verification-before-completion`, `pr-readiness`; `using-git-worktrees` supplies the eventual isolation steps. `visual-qa` is proportionate because one added entry changes page height and existing snapshots. Run any Skill-requested review inline as self-review and record the delegation override; retain the separate independent PR review. No Figma, animation, Three.js or broad design-tool work is included.

## Implementation approach and constraints

### Locale-owned CV contract

Narrow only `FounderPageContent.professionalLinks.cv` to **`DocumentLink & { downloadName: string }`** in `components/founder/content-types.ts`. Leave the general `DocumentLink` unchanged. Each content object supplies its own basename and root-relative asset path; the shared component uses `download={content.cv.downloadName}` and its existing `withBasePath(content.cv.path)`.

| Locale / route | Repository asset to add | Content path | Download name |
| --- | --- | --- | --- |
| ES `/estudio/samuel-furlanich/` | `public/Samuel-Furlanich-CV-ES.pdf` | `/Samuel-Furlanich-CV-ES.pdf` | `Samuel-Furlanich-CV-ES.pdf` |
| EN `/en/about/samuel-furlanich/` | `public/Samuel-Furlanich-CV-EN.pdf` | `/Samuel-Furlanich-CV-EN.pdf` | `Samuel-Furlanich-CV-EN.pdf` |

At `/Portfolio`, only each **URL** gains `/Portfolio`; neither the repository asset location nor downloadable basename gains it. Document URLs have no trailing slash, locale directory, fragment or query. Preserve the native, same-origin anchor, localized label, focus appearance and CV → LinkedIn → GitHub order. Keep the existing legacy PDF unchanged for previously shared direct URLs; deletion/redirect policy is outside this request. No click handler, blob fetching, API route, runtime locale detection or duplicate Founder renderer.

**PDF input gate:** add the two genuine, owner-supplied/approved localized PDFs. Check that each opens, contains its stated language, is public-safe, has a PDF signature and differs in bytes/hash from the other. A hash difference alone does not prove language. Do not synthesize, translate, redesign or rewrite CV contents under this task. Missing files keep asset/download acceptance **OPEN**; tests and the factual page work can proceed, but the PR cannot be declared ready or merged with missing assets. Synthetic PDF fixtures are test-only and must never be published as CVs.

### Professional experience amendment

Add **one employer entry first**, followed by the two existing entries in their existing relative order. This is current-role-first presentation, not a claim that independent work stopped or that employment began in 2026. Reuse the existing list schema/renderer.

Proposed exact new entry for PAGE-FOUNDER and locale content:

| Field | Spanish | English |
| --- | --- | --- |
| Section heading | Keep `Experiencia profesional` | Keep current `Professional experience` |
| Period | `Actualidad` | `Present` |
| Role | `Software Developer` | `Software Developer` |
| Context | `CleverSoft S.A.` | `CleverSoft S.A.` |
| Summary | `Ingresó a CleverSoft S.A. como analista de soporte (Support Analyst) y pasó al puesto de Software Developer en junio de 2026. Trabaja en el mantenimiento y desarrollo de soluciones ERP y de software para la resolución de pagos.` | `He joined CleverSoft S.A. as a Support Analyst and moved into a Software Developer role in June 2026. He works on the maintenance and development of ERP and payment-resolution software solutions.` |

June is retained solely from the existing approved developer-role fact; it is **not** inferred for joining CleverSoft or starting support. If the owner corrects that recorded month, persist the correction before changing this wording. Normalize the employer spelling in the third biography paragraph to `CleverSoft S.A.` only; retain its other sentences and all other verified biography facts. Keep the exact employer title `Software Developer`, distinct from Samuel's general `Ingeniero de software` / `Software Engineer` descriptor. Add no employer technology stack, seniority, named customers, metrics, achievements, logos, links or FURLANICH delivery claim.

## Review focus

Each condition below has a Task 1 test or explicit review gate:

- Locale switch followed immediately by download: new page supplies its own PDF and filename, without stale ES/EN state.
- Same file behind two names: literal locale URLs plus distinct source/download bytes catch accidental remapping; the owner verifies actual language.
- Subpath handling: one `/Portfolio` prefix, no trailing PDF slash; build and browser server must use the same base path.
- Unknown employment tenure: current-period wording and developer-only June date preserve supported chronology without inventing support/employment dates.
- Longer experience list: all previous facts and links survive; 320px reflow, enlarged text, keyboard reachability and controlled Founder image diffs cover the added height.

## Task 1 / PR 1 – Localize Founder CV downloads and add CleverSoft experience

**Execution**
- Execution Mode: SINGLE_AGENT
- Work Class: IMPLEMENTATION
- Subagents Allowed: 0

**Provider / reviewer:** Claude Code / `claude-sonnet-5-5`, effort `high`; independent Codex plugin reviewer at recorded resolved default, followed by Samuel's human review. No concurrent implementation task.

**Requirement:** deliver both localized assets/downloads and the bilingual progression atomically; preserve existing verified profile facts and professional destinations under root and `/Portfolio` export.

**Exclusive ownership / expected files** (paths below are relative to this checkout):

| Area | Exact files and responsibility |
| --- | --- |
| Production content | `app/(es)/_content/founder.ts`, `app/(en)/en/_content/founder.ts`: locale CV data, employer spelling, new first experience entry. |
| Shared download contract | `components/founder/content-types.ts`, `components/founder/FounderProfessionalLinks.tsx`: required Founder-only `downloadName` and native anchor binding. |
| Production assets | Add `public/Samuel-Furlanich-CV-ES.pdf`, `public/Samuel-Furlanich-CV-EN.pdf` from approved inputs. Preserve `public/Samuel-Furlanich-CV.pdf`. |
| Node / artifact contracts | `scripts/founder-content.test.mjs`, `scripts/founder-export.test.mjs`, `scripts/export-requirements/founder.mjs`, and the Founder-owned assertions in `scripts/verify-static-export.mjs`. Run `scripts/verify-static-export.test.mjs` as shared regression; edit its fixtures only if the new explicit Founder contract requires it. |
| Browser behavior | `tests/e2e/founder.spec.ts`: locale download and progression/preservation checks; update its two-entry/period assumptions. `tests/e2e/sfc-production.spec.ts`: narrowly named `Founder localized profile` cases for real exported pages/downloads across three engines. Reuse existing production project registration. |
| Existing checks reused | `tests/e2e/founder-responsive.spec.ts`, `tests/e2e/accessibility.spec.ts`, `tests/e2e/visual/founder.visual.spec.ts` need no expected source changes; run them. Change only a stale contract proven by the scoped requirements. |
| Intentional baseline changes | Only `tests/e2e/visual/founder.visual.spec.ts-snapshots/founder-{spanish,english}-{wide,compact}-visual-chromium-{win32,linux}.png`: four per platform, after approval. No unrelated snapshots. |
| Documentation | The exact owning/dependent files in Documentation synchronization below, this plan's progress, and one bounded receipt at `docs/reviews/founder-localized-cv-and-experience.md`. |

Read-only references include route shells, `FounderPage.tsx`, `FounderProfessionalHistory.tsx`, shared `DocumentLink`, `lib/paths.ts`, `lib/site-routes.ts`, `next.config.js`, Playwright config and retained `data/`. No changes to routing, hosting, runtime graph, styling, global components, dependencies or Skill files are expected.

**Interfaces:** consumes `FounderPageContent`, `DocumentLink`, `withBasePath(path: string)` and the existing four-field experience entry. Produces required `professionalLinks.cv.downloadName`, localized unprefixed `.path`, and three complete entries per locale. In `founderRequirements`, retain `cv` as the unprefixed path and add `cvDownloadName`; encode the new three-entry/employer-presence expectations in that page-owned contract. Keep the shared verifier's other page contracts intact.

### Serial steps and strict TDD

- [ ] **1. Isolate and rebase the evidence.** Recheck current remote `main`, local status, `git-dir`/`git-common-dir` and submodule status. Inspect attached worktrees; reuse only a suitable worktree for this task, otherwise use the native managed worktree tool at the verified main SHA. Use branch `codex/founder-localized-cv-experience` and record the absolute checkout path/base SHA. Do not reset user work. Carry this reviewed documentation-only plan/index draft into that checkout explicitly; an uncommitted draft is not copied by worktree creation. If main advanced, reconcile the plan against it. Install locked dependencies with `npm ci` if needed. Before source edits, read `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, `01-app/03-api-reference/03-file-conventions/public-folder.md` and `01-app/03-api-reference/05-config/01-next-config-js/basePath.md` under the same installed docs root. Run the existing focused Node baseline. **Expected:** known baseline passes in an environment with localhost access; unresolved baseline failures are recorded and investigated, never called feature RED.

- [ ] **2. Persist the scoped requirement amendment.** Apply the documentation synchronization below with a dated owner-request amendment. Preserve historical wording and explicitly identify the two superseded restrictions. Add exact current copy/download requirements to PAGE-FOUNDER once. This documentation step is exempt from code TDD; no product source/assets change yet. **Expected:** `npm run docs:check` passes, no new RFC/ADR or unapproved scope expansion.

- [ ] **3. RED — write focused contract and browser tests before source/assets.** Use literal ES/EN expected paths and basenames independent of production content/route helpers. Add the cases in the RED/GREEN table below. Run the narrow Node tests and the changed Founder browser cases against unchanged application behavior. Add named production cases and run them against a clean pre-change export at both bases before changing the feature. **Expected:** the assertions fail for the shared legacy URL/name, absent localized assets, absent support-to-developer entry or old verifier acceptance, as specified below. A crash, missing browser, localhost denial, build failure or unselected test is not RED. Read and retain test name, assertion, command and exit result for each intended failure.

- [ ] **4. GREEN — minimum source/content/assets.** Add `downloadName` to the Founder-only CV type, supply literal locale values, and bind the shared native anchor. Add the single employer entry and normalize biography employer spelling. Add the two approved PDFs when available. Update page-owned export requirements; replace only the verifier's superseded two-entry/narrative-only checks with checks for the complete three-entry profile and the employer within the experience list. Verify the CV anchor's locale path and matching `download` attribute on the same element; a matching footer link or unrelated text is insufficient. Keep the remaining export protections. **Expected:** focused tests pass with real assets; absent inputs remain explicit blockers, never fixture substitutions.

- [ ] **5. REFACTOR → verify again.** Remove obsolete hardcoded expectations and local test duplication only where useful. Preserve one Founder renderer, one locale-independent download component, the existing history schema and exactly one base-path application. Do not introduce a new utility layer for a two-field binding. Rerun the focused Node/browser cases and the complete relevant export fixture tests after cleanup. **Expected:** same behavioral assertions stay green, with no Tailwind/class-name assertions added.

- [ ] **6. Rendered acceptance.** Run responsive and Founder axe checks; inspect ES/EN at 320px, 390px and 1440px, including visible CV focus and the added entry. Confirm period/role association, natural height, no clipping, and CV/LinkedIn/GitHub keyboard order. Run the existing controlled Founder visual spec. Collect expected/actual/diff images for its four cases per platform and obtain human approval before adopting replacements; [TEST-VISUAL-REGRESSION](../../testing/visual-regression.md) says “Establish or replace a baseline only after human design approval.” The requested text update authorizes content, not automatic acceptance of image goldens. Use controlled Windows captures and same-head Linux CI actuals; rerun normal comparison without update mode. **Expected:** approved Founder-only baseline changes and no unrelated visual delta. Missing approval stays OPEN; do not weaken thresholds or update snapshots in bulk.

- [ ] **7. Regression and PR readiness.** Run the matrix below from focused to broad, including clean root and `/Portfolio` builds, real exported browser downloads and full deterministic gates. Record fresh commands, results, warnings, SHA/base/environment and human input approvals in the receipt. Self-review the entire diff from the frozen base with `pr-readiness`, then obtain separate independent review and human PR review. Focused commits and one Implementation PR target `main`; never merge or push to main. **Expected:** all acceptance criteria have evidence; blockers are closed before readiness. Receipt/PR body includes `Agent usage: primary claude-sonnet-5-5 (high); subagents 0/0; independent reviewer <actual resolved model, separate session>`.

### RED/GREEN behavior table

| Coverage | RED test and intended failure | Minimum GREEN / post-refactor assertion |
| --- | --- | --- |
| 1. Spanish CV | Imported ES content and ES page CV link expect `/Samuel-Furlanich-CV-ES.pdf`; current result is the generic PDF. Asset assertion expects the named genuine file to exist; currently absent. | ES content, emitted anchor and browser request all select the ES asset. HTTP 200, `application/pdf`, `%PDF-`, successful saved download. |
| 2. English CV | Equivalent literal EN expectations fail against the same generic current PDF and missing EN file. | EN selects `/Samuel-Furlanich-CV-EN.pdf`; same response/download checks. |
| 3. Filename/URL | Both locale tests expect their exact `download` attribute and Playwright `suggestedFilename()`; current value is `Samuel-Furlanich-CV.pdf`. Add fixture rejection tests for wrong/missing `download`; the current verifier does not enforce it. | Anchor, response URL, downloaded basename and downloaded bytes agree with the locale's approved source file. No document URL has a trailing slash. |
| 4. Locale separation | Assert literal distinct paths and distinct source PDF SHA-256 values; current paths coincide/files are missing. Browser locale-switch-then-download starts with each locale and verifies the newly selected file. | Both assets differ in bytes; saved/requested bytes match the corresponding source and not the opposite locale. Owner confirms languages. Test rejects a swapped locale URL even when it serves a valid PDF. |
| 5. Experience | Node content and experience-region browser assertions require CleverSoft context, Support Analyst preceding Software Developer progression, developer timing in 2026 and ERP/payment-resolution work in each locale; the current two-entry list lacks it. Positive three-entry fixture fails the old verifier. | New first entry carries the approved localized facts; existing entries follow unchanged. The employer is found within experience, not inferred from biography. |
| 6. Preservation | Add baseline characterization for both existing entries, biography facts, education, complete MPC qualification/source, four capability groups, word bindings, Projects/Contact paths and exact LinkedIn/GitHub hrefs. These should initially pass. Prove the regression guards by temporarily removing the 2021 entry/changing a professional href in the isolated checkout: observe the targeted assertion fail, restore, then rerun green. Do not report unchanged behavior as missing-feature RED. | Old entries retain their four fields and relative order; only the employer spelling changes in the biography. Exact professional URLs and complete profile remain. Retain existing hierarchy/language-switch tests; no fragile CSS assertions. |
| 7. Root/base/static | At each base, pre-change exported CV expectations fail against the generic asset. Add export-fixture negatives for swapped PDFs, wrong filename and a missing/doubled `/Portfolio` prefix; run the real verifier, not a grep of its source. | Clean builds emit both PDF files at `out/` root and both correct Founder HTML artifacts. Served CV URLs are `/Samuel-…-{ES,EN}.pdf` or `/Portfolio/Samuel-…-{ES,EN}.pdf`, exactly once prefixed, while suggested names stay unchanged. |
| Native/keyboard/no-JS | Extend the existing keyboard case to Enter-activate CV and inspect the download event. Run the new locale expectations in a JavaScript-disabled production context; they fail before the localized feature exists. Existing focus/order characterizations may already pass. | Tab/Shift+Tab follow native order, focus remains visible, Enter starts the matching download without navigating away. Native download and complete experience content work without JavaScript; no interception. |

Where a protection already exists, characterize it honestly and use a reversible mutation to witness its intended failure. New behavior must still follow **RED → verify intended failure → minimum GREEN → REFACTOR → verify again**. Do not commit mutation changes or implement first and backfill tests.

## Verification matrix

Run from the recorded implementation checkout. Use PowerShell environment syntax below; run commands serially and stop on nonzero results. Playwright owns server startup/cleanup. Keep `PLAYWRIGHT_BASE_URL` unset for these local runs. `PLAYWRIGHT_SERVE_EXPORT=1` is essential for the production cases; passing `founder.spec.ts` in production mode would select no tests and is not evidence.

| Gate | Command / scope | Acceptance evidence |
| --- | --- | --- |
| Focused Node | `node --test scripts/founder-content.test.mjs scripts/founder-export.test.mjs scripts/verify-static-export.test.mjs` | Observed feature RED and later GREEN, both locale contracts, negative fixtures and preservation guards. |
| Focused Founder browser | `npm run test:e2e -- tests/e2e/founder.spec.ts --project=chromium-desktop` | ES/EN content, links, locale switch, filenames, actual download and keyboard behavior. |
| Responsive | `npm run test:e2e -- tests/e2e/founder-responsive.spec.ts --project=compact-320-chromium --project=mobile-chromium --project=mobile-webkit --project=tablet-portrait-chromium --project=tablet-chromium --project=wide-chromium` | Reflow, no-JS content, 200% text growth and spacing at compact/tablet/wide profiles; no clipping of the third entry. |
| Focused accessibility | `npm run test:a11y -- tests/e2e/accessibility.spec.ts --grep Founder` | Both locales have no critical/serious axe findings; manual CV focus/Enter/order review is separate. |
| Focused visual | `npm run test:e2e -- tests/e2e/visual/founder.visual.spec.ts --project=visual-chromium` | Four cases per platform pass normal comparison after controlled, human-approved baseline adoption. |
| Broad deterministic | `npm run validate` | Runs `docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`; all exit zero. Run after final source/docs edits, with root base selected. |
| Skill integrity | `npm run skills:check` | Unchanged vendored/project Skill integrity passes. |
| Broad browser | `npm run test:e2e` in default/root mode | Existing full regression matrix passes, including Founder, navigation, accessibility and visual regressions. No candidate patches or runtime work needed. |
| Root static | Clean build with root environment, then `npm run verify:static-export`, then the production command below. | Both Founder artifacts, PDFs, CV anchor/download attributes and three-engine exported behavior. |
| `/Portfolio` static | Separate clean build with `/Portfolio`, same artifact verifier and production command. | Same behavior under project-site prefix, plus exact URL/base-path checks. |
| Diff / final readiness | `git diff --check`; inspect frozen-base-to-HEAD and all staged/unstaged/untracked files; apply `verification-before-completion` and `pr-readiness`. | No whitespace errors, unreviewed assets, secrets, generated output, unrelated changes or unverified success claims. |

For **each** export mode, first stop any owned dev/export server. Verify that the resolved `.next/` and `out/` targets are inside this isolated checkout, then remove only those generated directories with native PowerShell `Remove-Item -LiteralPath` (no cross-shell deletion). Use `''` for root and `'/Portfolio'` for the second run:

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

New production cases must cover **both routes**, valid/matching/distinct PDFs, click and keyboard downloads, preserved profile and locale switching, with representative no-JS contexts. Use the existing asset-path convention in this spec rather than its route helper that appends `/`. Inspect `download.failure()` and saved bytes as well as the suggested filename. Restore environment values after validation. Build evidence is valid only for the source SHA and base path actually served; never reuse one `out/` as evidence for both modes. Localhost/browser restrictions are environment blockers, not product failures or passing checks.

**Task acceptance:** every RED/GREEN row is evidenced; two genuine localized files exist and are the actual downloads; all prior verified facts/links survive; both export modes and planned regression gates pass; documentation is synchronized; Founder-only visual updates have approval; independent and human reviews remain the merge boundary. Do not mark the packet complete because one focused suite passed.

## Documentation synchronization

| Owner / dependent record | Required update in this same PR |
| --- | --- |
| `docs/product/pages/studio-and-founder.md` — PAGE-FOUNDER | Own the dated 2026-10-20 amendment: new facts/progression, preserve developer-only June 2026 timing, exact new ES/EN entry, employer spelling and localized PDF path/name table. Explicitly supersede current biography-only/two-entry and single-CV instructions, retaining earlier decisions as labeled history. Preserve every other approved fact and deferred portrait/CV-redesign scope. |
| `docs/product/personal-portfolio-migration.md` — PORTFOLIO-MIGRATION | Update current mapping/closure guidance to reference the new PAGE-FOUNDER contract; label the old narrative-only and legacy-asset-only rules as superseded. Keep dated migration findings and retained datasets historical. Do not copy exact public wording. |
| `docs/design/studio-founder-contact-v1.md` — DESIGN-SFC-V1 | Add a bounded current amendment/link for three experience entries and localized CV destinations/names; supersede the old Founder count/narrative-only/file restriction. Preserve layout, typography, native link treatment, runtime decisions and historical approvals. |
| `ARCHITECTURE.md` and `docs/architecture/current-system.md` | After implementation, synchronize current Founder content/download facts and employer spelling where current summaries require it, linking PAGE-FOUNDER. Preserve dated architecture history. No architecture decision changes. |
| `docs/governance/status-register.md` | Summarize the scoped owner amendment and link PAGE-FOUNDER; keep asset provision/implementation/visual acceptance OPEN until evidenced. Do not promote unrelated OPEN items or repeat exact copy. |
| `docs/plans/index.md` | Discover this proposed plan and later update its delivery status. Move to `completed/` and fix links only after the human-reviewed PR and actual completion; never predeclare a merge. |
| `docs/testing/playwright.md`, `docs/testing/visual-regression.md` | Record the new production Founder download coverage and approved replacement-baseline provenance (platform, exact head/run, hashes, human approval). Preserve older receipts/approval history. |
| `docs/reviews/founder-localized-cv-and-experience.md` and this plan's Progress | One concise acceptance receipt: input provenance/language confirmation, actual provider/reviewer IDs, frozen base/head, RED/GREEN assertions, command/exit results, base paths, visual approval, warnings and unresolved checks. This is evidence, not a second requirements owner. |

Inspect `docs/index.md`, `docs/design/visual-language.md`, `docs/design/interaction-responsive-accessibility.md`, `CONTEXT.md` and other search hits for newly stale summaries. Their generic hierarchy, native-download, accessibility and glossary rules need no change unless this implementation actually makes a current statement false. Update `related`/`last_verified` only for changed records. No edits to immutable ADR history, completed plans/reviews, Skill locks, or retained `data/` to propagate current public copy. No new standalone asset-contract document: PAGE-FOUNDER owns that contract.

## Risks and edge cases

- **Missing genuine PDF inputs:** both localized files are absent today. This blocks final GREEN/readiness; do not invent their contents or map both locales to the legacy file.
- **Date ambiguity:** June 2026 is supported for the developer role only. Unknown support/employment dates remain unknown; `Actualidad` / `Present` prevents a false tenure range. Preserve independent work since 2024.
- **Stale contract enforcement:** updating only content would fail the old count/narrative-only verifier and hardcoded filename tests. Update the owning requirements and their consumers together, keeping the other protections.
- **Native download variance:** actual response/bytes, suggested filename and Enter activation across the three production engines are evidence; checking only an `href` is insufficient. A PDF signature cannot establish content/language approval.
- **Build contamination and URL normalization:** separate clean builds are required; existing route helpers add a trailing slash to file paths. Do not introduce a duplicate base prefix or make assets relative to the nested Founder route.
- **Snapshot approval:** one more entry changes complete-page geometry. Keep only named Founder baselines in scope; unapproved or unavailable platform captures remain OPEN, not a reason to weaken CI.
- **Employment framing:** preserve factual professional depth without disclosing customer/technology details or suggesting company endorsement. No role/date for an unspecified support period is manufactured.

## Progress and first implementation authorization

Planning/discovery only. Product source, assets and implementation commits remain untouched; no implementation test result is claimed.

**Authorized first implementation task: Task 1 / PR 1 — Localize Founder CV downloads and add CleverSoft experience.** This is the sole implementation handoff, assigned to Claude Sonnet 5.5 High in one isolated `codex/` worktree/branch, for a later implementation session after plan acceptance. Start with step 1, then follow the documented TDD sequence. This planning session starts no implementation. There is no Task 2, parallel packet, delegated work, separate governance PR or authorization to merge. Missing PDF inputs and required baseline approval remain explicit completion gates rather than permission to substitute content.

## Deviations discovered during execution

None recorded; execution has not begun.

