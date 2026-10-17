# Task 10 / PR 10 — Integrate native, accessible real-flow Contact behavior

**Status:** The owner accepted the Task 10 presentation and directed removal of the form-panel demonstration notice in both locales on 2026-10-17. Reviewer R's independent review identified three valid P2 findings; all three are corrected and covered by follow-up regressions. The owner's subsequent browser-CI repair request authorized correction of the stale shared-footer assertion and adoption of the four inspected Linux Contact baselines. PR #151 remains open for review, with its standard Quality checks gating the repair. Task acceptance remains **OPEN** for the remaining candidate matrix, manual screen-reader checks, the supplemental inquiry review, and the candidate-CI ownership conflict. The public `main` release and its approved demonstration disclosure remain unchanged.

**Implementer:** Codex desktop, one primary agent and zero subagents under `GOV-AGENT-USAGE`.

**Agent usage (CI repair):** primary Codex (GPT-6; exact runtime model/effort unavailable); subagents 0/0.

**Branch/worktree:** `codex/sfc-10-contact-ui`, `D:/Projects/NextJS/Portfolio/.worktrees/sfc-10-contact-ui`.

**Base:** `5f57ad7063221c5288bc24a5a79bde8c15e6c523`, the PR #150 merge on `codex/sfc-integration`.

**Current PR:** [#151](https://github.com/Furlanich/Portfolio/pull/151), open against `codex/sfc-integration`; its head is the latest commit on `codex/sfc-10-contact-ui`. Reviewer R is requested in the PR description. The demo release mode remains selected locally; no Formspree endpoint is activated in the public release, and no workflow file was changed.

## Scope delivered

- Added localized commercial Contact content and route selection from the committed `INQUIRY_RELEASE.mode`; the existing demonstration content stays selected by default, and no public mode switch was added.
- Implemented the approved Contact introduction, Pause/static label slot, Bone intake panel, responsive alternatives, location and Founder bridge. The 820px split and source order follow `DESIGN-SFC-V1`.
- Connected the commercial form to Task 5's configured inquiry factory and submission controller, passing the actual hidden `_gotcha` value. Provider requests in candidate browser tests were intercepted and fulfilled locally; no real Formspree submission occurred.
- Preserved code-point validation limits while setting native UTF-16 `maxlength` to 200/508/240/8000. Accepted results reset the form; errors retain values and require an explicit retry. Busy fields disable while the focused submit remains natively enabled with `aria-disabled`; global outcomes focus one persistent nonlive result region.
- Kept the pre-hydration button disabled and direct channels available without JavaScript. The no-JavaScript page has no empty live-status node.
- Removed the demonstration notice panel, including its title, disclosure paragraph, and failure-email helper, from the Spanish and English Task 10 integration preview at the owner's direction. The simulation submit/outcome labels and zero-transmission behavior remain. This exception does not change the public `main` deployment; the product/design records and Task 10 plan record its non-public boundary.
- Added bilingual commercial-content and route assertions, real-verifier export fixtures for root and `/Portfolio`, localized commercial browser cases, responsive/axe checks, and four Contact visual captures.

## RED / GREEN

- Initial REDs covered missing UTF-16 bounds, missing persistent result/focus, the busy submit contract, and candidate routes still showing demo labels.
- Commercial browser tests then caught the empty status node in no-JavaScript mode and corrected test assumptions for server errors and an `aria-disabled` button. The final cross-browser case exercises invalid-field focus, uncertain failure, explicit retry, busy focus, duplicate locking, accepted reset, and no-JavaScript behavior.
- Strict Mode effect replay exposed a disposed submission controller when it was created with `useMemo`; the controller is now created and disposed in its lifecycle effect.
- Repository lint then identified two hook rules in `ContactForm`. Hydration detection now uses `useSyncExternalStore` with separate server and client snapshots, and the submitter memo uses an inline factory. The complete public Contact matrix passed after this change.

## Validation

- Final revised-branch `npm run validate`: **passed** on 2026-10-17. This includes `npm run docs:check` (342 Markdown files, 120 document IDs, 38 Skills), `npm test` (796/796), lint (0 errors; 282 existing warnings), typecheck, and production build.
- Focused Contact Node tests: **13/13 passed**. Focused Chromium Contact browser tests: **20/20 passed**, including both locales, no-JavaScript mode, axe, keyboard behavior, responsive widths and absence of the retired panel copy.
- Public Contact Playwright matrix: **180/180 passed** across Chromium, Firefox, WebKit, mobile, tablet, compact-320 and wide projects. Both locales cover the 320/390/768/819/820/1023/1024/1440px overflow and stack/split checks; axe has no serious or critical violations.
- Commercial candidate Playwright matrix: **18 passed, 2 configuration-only cases skipped** while the approved endpoint was locally intercepted. The separate no-endpoint run passed **2/2** and made zero provider requests. Tagged cross-browser candidate cases passed **6/6** across Chromium, Firefox and WebKit.
- Contact visual spec: updated Windows captures after the notice removal passed update mode (**4/4**) and a separate normal comparison (**4/4**). The four Linux captures were subsequently inspected and adopted from the CI bootstrap run identified below.
- The candidate browser matrix above ran before the final `useSyncExternalStore` hydration refactor in `ContactForm`; the public Contact matrix and normal visual comparison were rerun after that refactor. The candidate browser matrix still needs a same-head rerun.
- `npm run validate` after the three Reviewer R corrections passed: docs check, **796/796** Node tests, lint (**0 errors, 282 existing warnings**), typecheck and production build. The first sandboxed attempt could not create temporary Git fixtures; the run with local filesystem permission completed successfully.
- Focused Chromium Contact regressions after the corrections passed **4/4** across Spanish and English: the repeated-invalid-submit focus case and the opaque intake marker contract assertion.
- The post-correction commercial candidate tagged smoke passed **12/12** across Chromium, Firefox and WebKit. It covers Spanish and English no-JavaScript fallbacks and operational submission/retry flows with the approved endpoint configured at build time and provider requests intercepted locally. Firefox passed **4/4**, including **2/2 Spanish** cases; WebKit passed **4/4**, including **2/2 Spanish** cases. An initial run without the candidate endpoint configured returned the intended unavailable state; the configured, intercepted rerun passed all 12 cases.
- Static export: the earlier root verifier passed for **14 routes at `/`**. During the browser-CI repair, `npm run validate` with `NEXT_PUBLIC_BASE_PATH=/Portfolio` passed all required gates, and `npm run verify:static-export` then verified **14 routes at `/Portfolio`**. This supersedes the earlier interrupted base-path build attempt.
- Earlier Windows full Playwright suite: **2,846 passed, 20 failed, 130 skipped** across 2,996 discovered cases. All four Contact visual checks passed. Five failures were the shared `connected-studio-footer.spec.ts` global-disclosure assertion expecting the intentionally removed Contact-panel heading. Two failures were live-scene axe timeouts, nine were immersive runtime timing/geometry failures, and four were Founder visual baseline mismatches. The later Linux CI run below had only the stale Contact assertion and missing Linux Contact baselines; the other Windows failures did not reproduce there.
- `node scripts/prepare-sfc-candidate.mjs verify-clean`: confirmed no candidate patch or marker remains. `git diff --check` passed.

## Rendered-design review and baselines

The approved Contact anatomy and palette govern the implementation; the owner-requested change removes the demonstration notice panel. The updated Windows captures were inspected and passed normal comparison. The dark connected ground, opaque Bone intake surface, localized content and direct-channel panel remain the approved composition.

The four Linux captures are copied unchanged from [Quality run `39043290991`](https://github.com/Furlanich/Portfolio/actions/runs/39043290991), PR head `2ad2657952f4ab1ffdac0809a9dd6cf675f4b473`, shard-4 artifact `playwright-report-shard-4-39043290991-1` (artifact ID `12104324883`). The controlled image was `mcr.microsoft.com/playwright:v1.63.0-noble`. Each actual was inspected against the owner-approved notice-free presentation before adoption. A normal Linux comparison is required on the repair head through the standard Quality workflow; no update mode or tolerance change is used.

| Capture | SHA-256 |
| --- | --- |
| Spanish wide, 1440×1000 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-es-wide-visual-chromium-win32.png`) | `7D91AC7988E41E6EBAF32D9CF291BF030024E7F88F4DA73818AF8FE4F48DE3CC` |
| Spanish compact, 390×844 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-es-compact-visual-chromium-win32.png`) | `C14ACFC7609D29AC3CD9A6133898EC8FDB9BE7C03BC30D6F024B0BD7F6F40E36` |
| English wide, 1440×1000 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-en-wide-visual-chromium-win32.png`) | `827B8A5451F870CBAEABECFCCA26EC85336F44B5FCF8438712660921D1968A22` |
| English compact, 390×844 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-en-compact-visual-chromium-win32.png`) | `90F9500A8C9D2C88DD2110182F27846360A6DE1DEA9FA10A1CDD03868D43A30B` |
| Spanish wide, Linux (`contact-es-wide-visual-chromium-linux.png`) | `E26D3AFBBFBBC4F20ED369460918AB81D7E4374F71B89EA48D3CE6586F2EED15` |
| Spanish compact, Linux (`contact-es-compact-visual-chromium-linux.png`) | `55E253460CBE4312D802DFA9C1BE1AF50A247BAEE850190C2DEAE56A267065F4` |
| English wide, Linux (`contact-en-wide-visual-chromium-linux.png`) | `9AC0822CD21B8FCEF9A33BC01F6D6ADD24A0934384E15AB209E773C86C0292E2` |
| English compact, Linux (`contact-en-compact-visual-chromium-linux.png`) | `6B6E10AE456903FF2ED6AADD1FD49F9961A55EED445ED1C78FF95DA479696809` |

The initial Windows bootstrap failed because its four expected files were absent; Playwright wrote the local actuals. The images were inspected, then the unchanged normal-comparison run passed 4/4. Linux capture provenance is recorded separately above.

## Browser CI repair — 2026-10-17

- Quality run `39043290991` at `2ad26579` completed with **2,875 passed, 9 failed, 130 skipped** over its four browser shards. Five failures were the same stale Contact-notice assertion in Chromium, Firefox, WebKit, mobile Chromium and compact-320 Chromium. Four were missing Linux Contact baseline files. The validate job passed.
- A focused local Chromium run at `/Portfolio` reproduced the missing `Demostración interactiva` heading failure. The owner had explicitly removed that notice. The shared test now asserts its absence in both locales, retains the Home disclosure assertions, checks the still-simulated submit labels, and preserves the Footer claim assertion.
- The owner's request to fix PR #151 browser CI extends this repair to that shared test assertion. No application source, workflow, timeout, screenshot tolerance or test-selection gate changed.
- The four missing Linux images were adopted using the approved baseline-bootstrap procedure and the exact source artifact/hashes above. The normal Windows comparison and the corrected assertion across all five failing projects passed **9/9** at `/Portfolio`; Linux comparisons run in the PR's full Quality matrix.
- `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run validate` passed: docs check, **796/796** Node tests, lint (**0 errors, 282 existing warnings**), typecheck and production build. The subsequent `npm run verify:static-export` passed for all **14 routes** at that base path.

## Open acceptance gates

- Remaining same-head candidate browser matrix. The tagged commercial smoke now passes across all three engines. The general candidate section of PLAN-SFC-V1 calls for a dedicated candidate CI job beginning in Task 10, but Task 10's explicit owned paths omit `.github/workflows/ci.yml` and forbid workflow changes. The CI-job ownership conflict remains open for the planning authority.
- Manual NVDA with Firefox/Chromium and VoiceOver with Safari checks by a named operator. Axe is not a substitute.
- Reviewer R follow-up review of the three corrections and the separately routed Sonnet 5.5 High supplemental inquiry review.
- Human review/merge of the requested PR to `codex/sfc-integration`.

## Rulings made during execution

| Ruling | Reason | Cost if wrong |
| --- | --- | --- |
| Remove the Contact form demonstration notice and helper from both locales in the Task 10 integration preview; keep demo mode, simulated labels/outcomes, and zero-transmission behavior. | The owner explicitly accepted the Contact presentation and requested this change on 2026-10-17. PAGE-CONTACT and the design/plan records bound it to the non-public integration preview; the deployed `main` disclosure stays intact. | If later operational-form tasks are delayed, restore the approved demo disclosure before any public release. |
| Proceed although the packet's exact GPT-6 Luna High assignment is unattested by the runtime. | The owner directly instructed Task 10 to begin. | The owner may require a rerun or accept the recorded deviation. |
| Replace the managed worktree that was outside writable roots with a repo-local ignored worktree based on PR #150's merge. | The original worktree was not writable and Git could not use it. | Recreate from the verified merge if the local checkout choice is wrong. |
| Create the plan-scoped SDD ledger/marker manually after the Windows helper was blocked; remove its generated ignored `node_modules-partial` tree after lint scanned it. | The helper could not start in the sandbox; the partial tree was generated setup data, not product source. | Recreate scratch from the lockfile if any helper data was needed. |
| Remove the root `node_modules` junction after Next 16 Turbopack rejected its outside-project target, then install the pinned dependencies inside this worktree. | The local Next guide requires dependencies to resolve within the project root. | This worktree retains a separate ignored dependency install. |
| Leave the dedicated candidate CI workflow change to planning authority. | The plan's general candidate requirement conflicts with Task 10's forbidden workflow path. | Candidate CI acceptance remains open until the correct owner resolves the boundary. |
| Repair the shared Footer test's stale Contact assertion and adopt the four inspected Linux Contact baselines in PR #151. | The owner explicitly requested investigation and correction of this PR's failed browser CI on 2026-10-17. The presentation and notice removal were already approved. | Revert an incorrect baseline or assertion if independent review finds a mismatch with PAGE-CONTACT's integration-preview exception. |

## Reviewer R findings and disposition

All three findings from Reviewer R's 2026-10-17 review were valid against Task 10's focus, integration-seam and cross-browser requirements.

1. **Repeated invalid submissions did not refocus the first invalid field.** `ContactForm` now focuses the first invalid field on every failed validation attempt while preserving the existing valid-submit focus and outcome-region behavior. A bilingual browser regression confirms that focus returns to Name after a second unchanged invalid submission.
2. **The opaque intake surface lacked the Task 11 exclusion marker.** The outer intake wrapper now carries `data-connected-opaque-plate`; the rendered bilingual contract test verifies that the marked wrapper contains both the form and direct-channel aside.
3. **Tagged commercial smoke tests covered English only.** Both tagged cases now run for Spanish and English with localized assertions. The candidate smoke passed the Spanish commercial paths in Firefox and WebKit, with provider traffic intercepted locally.

The owner-approved removal of the “Interactive Demonstration” form-panel title and paragraph remains unchanged. Reviewer R's review did not request its reversal.

The local lockfile install reported 16 npm audit findings (1 low, 2 moderate, 12 high and 1 critical); no dependency update or audit fix was applied. Generated `next-env.d.ts` changes from Next dev were restored. No live provider probe, account change, deployment, or external message was performed.
