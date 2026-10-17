# Task 10 / PR 10 — Integrate native, accessible real-flow Contact behavior

**Status:** The owner accepted the Task 10 presentation and directed removal of the form-panel demonstration notice in both locales on 2026-10-17. The revised implementation is complete, and PR #151 is open for Reviewer R. Task acceptance remains **OPEN** for the same-head candidate matrix, Linux visual baseline, manual screen-reader checks, independent reviews, the stale shared-footer assertion below, and the candidate-CI ownership conflict. The public `main` release and its approved demonstration disclosure remain unchanged.

**Implementer:** Codex desktop, one primary agent and zero subagents under `GOV-AGENT-USAGE`.

**Branch/worktree:** `codex/sfc-10-contact-ui`, `D:/Projects/NextJS/Portfolio/.worktrees/sfc-10-contact-ui`.

**Base:** `5f57ad7063221c5288bc24a5a79bde8c15e6c523`, the PR #150 merge on `codex/sfc-integration`.

**Current PR:** [#151](https://github.com/Furlanich/Portfolio/pull/151), open against `codex/sfc-integration` at head `fbee939dcaa1cbf1a85df2f00c59ce2123007702`. Reviewer R is requested in the PR description. The demo release mode remains selected locally; no Formspree endpoint is activated in the public release, and no workflow file was changed.

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
- Contact visual spec: updated Windows captures after the notice removal passed update mode (**4/4**) and a separate normal comparison (**4/4**). All four images were inspected; the new images are included below. A same-head Linux capture remains pending.
- The candidate browser matrix above ran before the final `useSyncExternalStore` hydration refactor in `ContactForm`; the public Contact matrix and normal visual comparison were rerun after that refactor. The candidate browser matrix still needs a same-head rerun.
- Root static export: `npm run verify:static-export` passed for **14 routes at `/`**. The `/Portfolio` build/verifier remains pending.
- Full Playwright suite is running at 2 workers (2,996 discovered). The first unrelated failure is `connected-studio-footer.spec.ts`'s global-disclosure test, which still expects the Contact-panel heading intentionally removed by this request. That spec is outside Task 10's owned paths; it is recorded for planning-authority routing rather than silently edited here. Contact-specific checks pass.
- `node scripts/prepare-sfc-candidate.mjs verify-clean`: confirmed no candidate patch or marker remains. `git diff --check` passed.

## Rendered-design review and baselines

The approved Contact anatomy and palette govern the implementation; the owner-requested change removes the demonstration notice panel. The updated Windows captures were inspected and passed normal comparison. The dark connected ground, opaque Bone intake surface, localized content and direct-channel panel remain the approved composition.

Linux captures are not present; they must come from a same-head CI run and be checked without update mode.

| Capture | SHA-256 |
| --- | --- |
| Spanish wide, 1440×1000 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-es-wide-visual-chromium-win32.png`) | `7D91AC7988E41E6EBAF32D9CF291BF030024E7F88F4DA73818AF8FE4F48DE3CC` |
| Spanish compact, 390×844 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-es-compact-visual-chromium-win32.png`) | `C14ACFC7609D29AC3CD9A6133898EC8FDB9BE7C03BC30D6F024B0BD7F6F40E36` |
| English wide, 1440×1000 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-en-wide-visual-chromium-win32.png`) | `827B8A5451F870CBAEABECFCCA26EC85336F44B5FCF8438712660921D1968A22` |
| English compact, 390×844 (`tests/e2e/visual/contact.visual.spec.ts-snapshots/contact-en-compact-visual-chromium-win32.png`) | `90F9500A8C9D2C88DD2110182F27846360A6DE1DEA9FA10A1CDD03868D43A30B` |

The missing-baseline bootstrap run failed only because the four expected files were absent; Playwright wrote the local actuals. The images were inspected, then the unchanged normal-comparison run passed 4/4. This does not substitute for owner approval or Linux capture provenance.

## Open acceptance gates

- Same-head candidate browser matrix, plus Linux baseline capture and a clean no-update rerun. The general candidate section of PLAN-SFC-V1 calls for a dedicated candidate CI job beginning in Task 10, but Task 10's explicit owned paths omit `.github/workflows/ci.yml` and forbid workflow changes. Local candidate verification is complete; the CI-job ownership conflict remains open for the planning authority.
- A cross-platform assertion in `tests/e2e/connected-studio-footer.spec.ts` still expects the removed Spanish and English Contact form-panel headings. The file is outside Task 10's owned write paths; a planning-authority-owned follow-up or explicit ownership transfer is needed before the full suite is green.
- Manual NVDA with Firefox/Chromium and VoiceOver with Safari checks by a named operator. Axe is not a substitute.
- Independent Reviewer R review and the separately routed Sonnet 5.5 High supplemental inquiry review.
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

The local lockfile install reported 16 npm audit findings (1 low, 2 moderate, 12 high and 1 critical); no dependency update or audit fix was applied. Generated `next-env.d.ts` changes from Next dev were restored. No live provider probe, account change, deployment, or external message was performed.
