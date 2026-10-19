# Task 16 / PR 16 — Release the coherent redesign and direct-contact legal pages

**Status: the Terms pair, Footer link and reciprocal Privacy/Terms navigation are implemented and verified on the release candidate; the release is NOT ready.** Two things stand between this branch and a human merge to `main`: the static-release startup-CPU gate that Task 14 left FAIL (its receipt says Task 16 is blocked on a packet 20 that does not yet exist), and owner approval of ten changed or new visual baselines. Nothing was pushed, merged, deployed or sent; no account, provider or live service was touched.

Implementer: Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session; the reasoning-effort level is not exposed to the session, so "High" is not attested. Single primary agent, 0 subagents (SINGLE_AGENT). The executing-plans whole-branch reviewer subagent was not used (AGENTS.md and GOV-AGENT-USAGE outrank it); the self-review below is the author's own, and Reviewer R remains a separate session.

Branch/worktree: `codex/sfc-16-release` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-16` (the plan's verified fallback). Base: `647444ae`, `origin/codex/sfc-integration` at the merge of PR #156 (contains Tasks 1 to 15). The plan was read from that head, not from the older local `main` copy, which predates the 2026-10-18 direct-contact amendment. PR 16 targets `main`, so its diff is the whole integration branch plus this task; that is what Reviewer R must read. Commits: `30772fec` (routes, Footer, pages, Privacy wiring, verifier), `a87de56e` (browser specs, docs), `8ed0b05d` (Footer grouping), and the receipt commit.

## What now exists

- **Route registry.** `terms` (`/terminos/`, `/en/terms/`) in `lib/site-routes.ts`; `terms` in `FoundationNavigationPaths`; semantic locale equivalence and trailing-slash safety are covered by `scripts/site-routes.test.mjs`. Sixteen foundation routes.
- **Terms pages.** `app/(es)/terminos/page.tsx` and `app/(en)/en/terms/page.tsx` are Server Components rendering the canonical typed copy (`_content/commercial/terms.ts`) through the shared `LegalPage` template, with the title and description from the canonical `metadata`, App Bar, Footer, the contents navigation, all seven sections, the update date and the reciprocal Privacy link (`withBasePath`, so it is correct at `/Portfolio`). No client boundary, form, provider or gate wording.
- **Privacy wiring.** Both Privacy modules now take heading, sections, update label and the Terms link from `_content/commercial/privacy.ts` (one source of section copy; a test asserts deep equality) and keep their approved introduction and GitHub privacy-statement link. `PrivacyPage` renders the update date and the localized Terms link.
- **Footer.** A `Términos y condiciones` / `Terms and Conditions` link sits beside Privacy in one legal group in the utility row (IA-approved wording, `footer-content.ts`), so the existing route pages that already pass Footer labels needed no change. Link boxes measure 44 px high at 1440, 390 and 320 px.
- **Export verifier.** `scripts/verify-static-export.mjs` requires all sixteen documents. For Terms it compares the emitted H1, contents label, every section heading, anchor and paragraph with the canonical typed copy, the metadata, a genuine update date, the reciprocal Privacy link (with the base path), the localized Footer label, and rejects form controls, Formspree, simulation and unpublished-gate wording. For Privacy it requires the update date and the Terms link.
- **Tests.** Node: route registry, Footer, Terms route files, Privacy/Terms canonical equivalence, verifier fixtures (root and `/Portfolio`, with mutations). Browser: Terms published, one H1, date, sections, no-JavaScript completeness and reciprocal navigation, Footer reachability, language pairing, Terms in the axe, landmark/outline/keyboard-Footer, smoke, navigation and Footer-host matrices, and four bounded Terms visual cases.
- **Docs.** `ARCHITECTURE.md`, `docs/architecture/current-system.md`, the IA record and the Terms and Contact/Privacy page owners now say sixteen routes and describe the Terms template; the old "Terms unpublished until Task 16" statements are replaced. Deployed state is not claimed.

## RED and GREEN

- Node: against the old registry, five route-registry cases, three Footer cases, the Terms route and canonical-equivalence cases, and eight verifier cases failed on their intended assertion (missing `terms` route, Footer copy, missing files, an unrequired document); each then passed. A sabotage check (the Terms reciprocal-link message renamed) failed both Privacy verifier cases and was restored.
- Browser specs were authored after the implementation, so they have no RED of their own. The "Terms routes remain unpublished" case they replace is the evidence that the previous state was 404, and the Node RED above proves the route did not exist.
- Two authoring defects were found by the harness and fixed, not hidden: a duplicate Playwright test title (Terms and Privacy shared a contents label) and shell-escaped regexes in my own tests; the regexes were rewritten and re-verified.

## Verification

- `npm run validate` (clean `.next`/`out`) exit 0: docs:check 352 Markdown files, 121 document IDs, 38 Skills; Node 947 tests, 946 pass, 1 `todo`, 0 fail (828 at Task 13, 857 at Task 14); lint 0 errors and 282 warnings after removing one warning I introduced (283 before the fix); typecheck; production build of 16 static routes. Re-run after the last source change: Node 947/946/1, eslint clean.
- `npm run verify:static-export`: 16 routes at the root and 16 at `/Portfolio` (base-path build done in PowerShell; Git Bash rewrites `/Portfolio` into a Windows path, which a first attempt exposed).
- Browser, served `/Portfolio` export, ten default projects (Chromium, Firefox, WebKit, mobile Chromium/WebKit, tablet, wide, 320, tablet-portrait, accessibility) on the legal, privacy, Footer-host, accessibility, navigation and smoke specs: **719 passed, 64 skipped, 0 failed** (783 cases). After the Footer grouping change, the root export for the Footer, legal, accessibility and privacy specs: 468 passed, 3 failed under three parallel workers (two Firefox and one WebKit Footer case), all three passing in isolation (8/8, one worker). Cause: load-related navigation timeouts under parallel workers, the same pattern earlier receipts record for cold servers; no assertion was changed. A first run against `next dev` also showed one cold-compile `net::ERR_ABORTED`, which is why the matrix runs on the served export.
- Accessibility: axe finds no serious or critical violation on all sixteen pages; each page keeps one banner, one main and one Footer, an ordered outline and a keyboard-ordered Footer (now including Terms). Contrast and screen-reader behavior beyond axe were not checked manually in this task.
- Direct contact is unchanged by this task and still covered by the Task 13 specs: no form control, provider request or stale simulation wording appears in the emitted HTML (the verifier rejects them on Terms and Contact).
- `git diff --check` clean.

## Static release gate: FAIL, unchanged cause

Re-measured on this head with the Task 14 collectors (`measure-connected-studio-production.mjs`, `measure-connected-studio-vitals.mjs --startup-baseline --compare` against the committed Task 3 artifacts, root export, Chromium on this machine). Both exit 1 for the reason Task 14 recorded: `chunks/2ebgc9eysqgkr.js` (the connected host) is loaded by every Studio, Founder and Contact page in a policy-disabled build, so the check "no optional code in the critical chunks" fails on twelve of twelve profile/route rows. The startup comparison reports 8 PASS, 5 OPEN, 3 FAIL. Task 14's paired measurement attributed +27 to +144 ms of startup CPU and about 13.7 KiB Brotli to it. This task cannot fix it: the host and policy are forbidden here, and the fix belongs to the packet 20 or later that Task 14 assigned to the planning authority and that does not exist in the plan.

Terms against its Privacy comparator (the collectors do not know Terms, and those scripts are Task 14's): each Terms page references exactly the same scripts as its Privacy page (0 B added JavaScript) and its HTML is 77 B (es) and 101 B (en) larger Brotli, inside the 2 KiB legal budget. No paired startup-CPU measurement of Terms exists; because its scripts are identical to Privacy's, its CPU comparator is expected, not proven, to match. That row stays OPEN.

## Visual review and baselines (owner approval required)

Reduced-motion Windows Chromium captures were inspected: Terms and Privacy at 1440×1000 and 390×844 in both languages, and the Footer at 1440, 390 and 320 px. The Azure ground, one opaque Deep reading plate, Bone headings, update line, two-column contents, section rhythm and chart-glow links match the approved Privacy treatment; no clipping or overflow; the Footer shows `© FURLANICH`, the Privacy and Terms group, and the language control at the far edge (a first version spread the four utility items evenly and a second left the control orphaned when wrapped; both were seen and corrected). This is the author's judgment, not approval.

Changed or new baselines, none committed. Review images are in the git-ignored `.superpowers/reports/sfc-16/review/`:

- Privacy, four Windows cases (`privacy-{es,en}-{wide,compact}`): fail on the new update line and Terms link (intended).
- Footer, two Windows cases (`footer-{wide,compact}`): fail on the new Terms link (intended).
- Terms, four new Windows cases (`terms-{es,en}-{wide,compact}`), parked in `review/pending-baselines/`; the committed spec therefore fails locally and in CI on a missing baseline until the owner approves. The Linux images for all ten cases must then come from matching CI actuals, per the visual regression policy.

Every other existing visual case passed: 83 of the 89 that existed before this task (the run reports 87 of 93 only because the first run had written the four Terms files, which are now parked and unapproved).

## Rollback

Prior public state: `main` at `cd8c0d45` (PR #142), deployed by [run 38728080880](https://github.com/Furlanich/Portfolio/actions/runs/38728080880) on 2026-10-15, the latest deploy at the time of this task. Deployment is the `push` to `main` workflow, so the whole-release rollback is a human action: `gh run rerun 38728080880` rebuilds and republishes `cd8c0d45`, or revert the PR 16 merge commit on `main` (the revert push redeploys). Samuel controls both. Nothing in this branch changes hosting or the workflow.

## Rulings

- Plan source: read from `origin/codex/sfc-integration`. Cost if wrong: none.
- Update date: both Terms and Privacy show 18 de octubre de 2026 / October 18, 2026, the date the owner-approved text was finalized; "last updated" is a content revision date and the merge date cannot be known now. Cost if wrong: four string literals and their tests; the owner should confirm at release.
- Privacy keeps its approved introduction and GitHub link; sections, heading, update label and Terms link come from the canonical commercial module. The canonical copy has no introduction or link, and the verifier requires both.
- Unlisted but necessary paths: `components/privacy/PrivacyPage.tsx`, `components/foundation/content-types.ts` (the `PrivacyContent` type), `tests/e2e/support/paths.ts`, `scripts/legal-content.test.mjs`, the Footer CSS, and the documentation synchronization AGENTS.md requires. Each is the smallest wiring for the listed work; the alternative for Privacy (bypassing `PrivacyPage`) would leave dead code. Cost if wrong: Reviewer R may ask to split them.
- The Terms verifier requirements live inline in `verify-static-export.mjs`; a new `export-requirements/terms.mjs` is not a listed path.
- The Terms Footer label comes from `footer-content.ts` rather than from each page's `labels`, so no page file outside the owned list changes.
- Continue and report: the unresolved Task 14 gate did not stop the in-scope work, but the release is reported as not ready. Cost if wrong: the owner may prefer the PR is not opened at all until the host split lands.

## Open items and deferred minors

- **Blocker.** Static-release startup-CPU gate: FAIL, owner a packet 20 or later that the planning authority has not defined (Task 14 findings, host import split and Contact's 0.35 scene opacity). The sfc-production host-code case stays held with `test.fixme`.
- **Owner.** Approve or reject the ten baselines above; confirm the update date.
- **Reviewer R and human merge** are separate and OPEN. The plan's own status text still says "execution NOT AUTHORIZED"; only the planning authority may change plan substance.
- Deferred minor: Contact links to Privacy only. DESIGN-SFC-V1 gives Contact's quiet legal links to PAGE-CONTACT; a Terms link there would be a Task 13 page change. Terms is reachable from every Footer.
- Deferred minor: no manual screen-reader pass and no paired CPU measurement of Terms were done.
- Not done by design: no deployment, no live graph flag, no Task 17 deployed check, no hardware work.
