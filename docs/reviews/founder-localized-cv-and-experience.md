# PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE Task 1 — implementation receipt

Evidence record, not a requirements owner: [PAGE-FOUNDER](../product/pages/studio-and-founder.md#founder-cv-experience-amendment-approved-2026-10-20) owns the contract and the [plan](../plans/completed/founder-localized-cv-and-experience.md) owns the sequence.

## Status

Complete. The owner dispositioned the PDF input gates on 2026-10-20 (below), decided OD-5 (independent work starts in 2023), confirmed each PDF is in its intended language and approved the new Founder renderings and visual baselines. The independent Codex review ([PR #178 review](https://github.com/Furlanich/Portfolio/pull/178#pullrequestreview-5592924475)) found three issues, all fixed. Quality run [39517613495](https://github.com/Furlanich/Portfolio/actions/runs/39517613495) passed on the final head `1c28eeb7` and the owner merged [PR #178](https://github.com/Furlanich/Portfolio/pull/178) as `1863e92a` on 2026-10-21. See Merge, deployment and closeout.

## Identity

| Item | Value |
| --- | --- |
| Primary agent | Anthropic Claude Code, Claude Sonnet 5.5 (`claude-sonnet-5-5`), single session, no subagents (0/0). The effort level was not selectable from inside the session and is not asserted here. |
| Independent reviewer | Not yet run. Required: a fresh top-level OpenAI Codex review through the `codex` plugin; record its resolved model here. |
| Frozen base | `main` at `1bcc1748` ("Updated CVs", the owner's replacement PDFs, after `93ec6d72` and PR #177). The branch was rebased onto it before the final verification. |
| Checkout | `D:/Projects/NextJS/Portfolio/.worktrees/founder-cv`, branch `codex/founder-localized-cv-experience`. |
| Commits | Documentation amendment; failing-first tests; implementation; implementation receipt; removal of generated files; the 2023 start-year change (tests first, then content and documentation). `git log 1bcc1748..HEAD` lists them. |

## PDF provenance

The owner committed the final localized PDFs to `main` in `1bcc1748`, replacing the drafts of `93ec6d72` that the plan recorded. This session did not edit, regenerate, translate or redact any PDF byte. The legacy `public/Samuel-Furlanich-CV.pdf` was already deleted on `main` by `93ec6d72`.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `public/Samuel-Furlanich-CV-ES.pdf` | 567,743 | `03cba5de1384a196a3f963e3fec4b531c45aa4685ab8576815ef439944278308` |
| `public/Samuel-Furlanich-CV-EN.pdf` | 88,517 | `25e62e977c770baf5df6233cbb7ac24692e76d0ab92493236728b5258d064aee` |

The exported copies in both the root and `/Portfolio` builds hash identically to these files, and the export contains no legacy CV. Extracted text confirms a Spanish ES file and an English EN file, each one page, with the CleverSoft S.A. role, FURLANICH from 2023 and the University of Buenos Aires degree.

## Input gate dispositions

Owner dispositions, given in chat on 2026-10-20 after the first implementation pass.

| ID | Finding | Disposition |
| --- | --- | --- |
| G1 | The first ES draft addressed one employer. | **Addressed by the owner**: the replacement ES file's profile no longer names an employer (re-read in this session). |
| G2 | The ES file embeds a "Content Credentials" attachment. | **Dismissed by the owner** as not relevant. The marker is still present in the ES bytes. |
| G3 | The ES file declares `/Lang(en-US)`. | **Dismissed by the owner** as not relevant. The declaration is still present. |
| G4 | The CVs start FURLANICH in 2023; the site said 2024. | **Resolved by changing the site** (OD-5): the biographies and the independent-work entry now start in 2023. The CVs are unchanged. |
| G5 | The CVs say `Graduado` / `Bachelor Degree`; the site says `Estudios completados` / `Studies completed`. | **Dismissed by the owner** as not relevant. The site wording is unchanged. |
| G6 | The EN CV spelled the employer `CleverSoft SA`. | **Addressed by the owner**: both replacement files print `CleverSoft S.A.`. |
| G7 | Both files publish email and phone. | **Addressed by the owner.** The replacement files still print an email address and a phone number. |

The owner confirmed in chat on 2026-10-20 that each PDF is in the intended language (ES is Spanish, EN is English); the text extraction in this session agrees.

## OD-5: independent work starts in 2023

Owner instruction of 2026-10-20: change the biography paragraph and the professional experience to start FURLANICH / independent work in 2023. Test expectations changed first (`founder-content.test.mjs` failed 1 of 4 against the old content, then passed), then `Trabaja de forma independiente desde 2023`, `He has worked independently since 2023`, `Desde 2023` and `Since 2023` replaced the 2024 values. PAGE-FOUNDER, PORTFOLIO-MIGRATION and the status register mark the 2024 statements as superseded. No other text changed.

## RED to GREEN

All commands ran in the checkout above on Windows. Where a build used `/Portfolio` the command ran in PowerShell, because Git Bash rewrites `/Portfolio` into a filesystem path.

| Coverage row | RED (intended failure, before source or assets) | GREEN |
| --- | --- | --- |
| 1 to 3, 7, 8 content | `node --test scripts/founder-content.test.mjs`: the Founder profile test failed (legacy path and download name, two entries, `Clever Soft SA`); the legacy-references test failed on the legacy path in `app/`, `components/`. 2 failed, 2 passed. | 4/4 pass. |
| 5, 6 asset and legacy | The localized-assets test and the legacy-file-absent assertion already passed because the owner's commit precedes this work. They are characterization, not feature RED. | pass |
| 3, 5, 6, 7, 8, 10 verifier | `node --test scripts/founder-export.test.mjs`: 30 of 39 failed (accept profile, base-path accept, wrong or missing `download`, `download` on another element, missing and non-PDF CV, identical bytes, legacy file and path, spelling, entry count, employer placement and heading, requirement map). The doubled-prefix, order, portrait, sequence and server tests passed before and after: they characterize existing verifier checks. | 39/39 pass; with `founder-content` and `verify-static-export` the three files give 61/61. |
| 1 to 4, 7, 11 browser | `founder.spec.ts` on `chromium-desktop`: 10 failed, 4 passed. The failures expected the localized `download` name and href, three entries and the new copy; they received `Samuel-Furlanich-CV.pdf` and two entries. | 14/14 pass. |
| Production, root | Pre-change clean root export: `verify:static-export` passed (the old verifier accepts it); the 15 production cases ran on three engines and the 12 Founder cases failed on the legacy `href` or on two entries, as intended. | 15/15 pass, root and `/Portfolio`. |
| 9 preservation | Reversible mutations in the isolated checkout, restored afterwards: changing the ES GitHub URL and removing the English 2021 entry each failed `founder-content.test.mjs` (1 failed, 3 passed); both files restored and the test returned to 4/4. | n/a |

The pre-change `/Portfolio` production run was not repeated: the base-path logic is identical code, and the fixture tests plus the post-change run at both bases cover it. See Rulings.

## Verification (post-change)

| Gate | Result |
| --- | --- |
| `node --test scripts/founder-content.test.mjs scripts/founder-export.test.mjs scripts/verify-static-export.test.mjs` | 61/61 pass. |
| `npm run test:e2e -- tests/e2e/founder.spec.ts --project=chromium-desktop --workers=1` | 14/14 pass. |
| Responsive (`compact-320-chromium`, `mobile-chromium`, `mobile-webkit`, `tablet-portrait-chromium`, `tablet-chromium`, `wide-chromium`, 1 worker) | 48/48 pass. |
| `npm run test:a11y -- --grep Founder` | 4/4 pass. |
| `npm run validate` (docs:check, npm test, lint, typecheck, build) | exit 0. |
| `npm run skills:check` | pass (30 Skills, 97 files). |
| `git diff --check` | exit 0. |
| Root clean build, `verify:static-export`, production Founder cases (chromium, firefox, webkit) | verifier passed, 15/15. |
| `/Portfolio` clean build, same | verifier passed ("base path /Portfolio"), 15/15. |
| Default case count | 3195 before and after (envelope 3200, unchanged). No net new default cases. |

The table above was re-run in full after the rebase onto `1bcc1748` and the OD-5 change (Node 61/61, Founder browser 14/14, responsive 48/48, axe 4/4, both exports and 15/15 production cases each, `validate`, `skills:check`, `diff --check`, visual 4 failed), with the same results.
| `npm run test:e2e -- tests/e2e/visual/founder.visual.spec.ts --project=visual-chromium` | Before adoption: 4 failed, as expected (the added entry changes page height). After owner-approved Windows regeneration: 4/4 pass in normal comparison mode. Linux: see Visual baselines. |

The export and production-browser evidence is local only; CI runs neither `verify:static-export` nor the production family.

## Rulings

- **PDFs and legacy deletion arrived on `main` first.** The plan said to delete the legacy file in the same PR as the additions. The owner's commits `93ec6d72` and `1bcc1748` already did both, so the PR does not contain those binary changes. The plan's intent (no legacy file, no references, both localized files present) is asserted by tests and by the verifier. Cost if wrong: none for the end state; the interim `main` served a dead CV link between that commit and this PR.
- **No pre-change `/Portfolio` production run.** One pre-change RED run at the root base was enough to witness the failures; the base path adds no distinct code path to the Founder anchor. The `/Portfolio` base is covered by the fixture tests (accepted profile and doubled prefix at `/Portfolio`) and by the post-change run. Cost if wrong: a base-specific RED not witnessed.
- **Plan not moved to `completed/`.** Step 8 asked for this in the same PR. Gates G1, G2 and G4, the visual approval and the independent review are open, so the plan stays `active` and claims nothing. Cost if wrong: one follow-up documentation change after the owner's merge.
- **Legacy and distinct-hash verifier checks report under the first Founder file.** They are once-per-export checks with no natural page; the prefix keeps them observable by the existing fixture filter, as the plan required.
- **Verifier keeps the page-level `href` substring check beside the new pairing check.** Removing it would change error text other consumers may match; the pairing check is the stricter addition.

## Independent review response

The Codex review of head `b86ed380` (PR #178, review 5592924475) raised three findings. Each was validated against the code and fixed in `cb874fe0` and `b27eeb71`.

| Finding | Validation | Fix |
| --- | --- | --- |
| [P2] Rollback ignored that the owner removed the legacy PDF before this PR. | Confirmed: the PR has no `public/` changes, so a revert alone restores anchors without their file. | Rollback section below, plan step 8 and the PR body now require restoring the legacy file. |
| [P3] Current PAGE-FOUNDER and plan text still said 2024. | Confirmed in the amendment's OD-1 paragraph and entry ordering, and in plan chronology, Non-goals and risks. | Current text says 2023 (OD-5); 2024 remains only as labeled history. |
| [P2] No independent check that each locale ships its own PDF. | Confirmed: the production cases and the verifier read expected bytes from `out/`; exchanging the two valid PDFs in a copy of the export passed the real verifier. | Fixtures use the real `public/` files; new negatives for exchanged and tampered PDFs failed against the old verifier (4 failed of 43), then passed (65/65 across the three Node files). The verifier and the production cases compare each exported CV with its `public/` source, including the JavaScript-disabled case. On a real root build, exchanging the two PDFs in `out/` made the verifier name both files and failed 5 of 5 production cases on Chromium; the restored export passed. |

The review's other points (visual gate, five-width inspection, language confirmation, closeout) are recorded in this receipt. The source `public/` files themselves being exchanged is not detectable by content here; the owner's language confirmation above covers it.

## Visual baselines

The owner approved the new Founder renderings and visual baselines in chat on 2026-10-20. Only the four Founder images per platform changed.

- **Windows:** regenerated locally with `--update-snapshots` on `founder.visual.spec.ts` only, inspected, then 4/4 in normal comparison mode.
- **Linux:** adopted byte for byte from the `*-actual.png` files of the failed browser shard 4 in Quality run [39514217770](https://github.com/Furlanich/Portfolio/actions/runs/39514217770) at head `b27eeb71` (artifact `playwright-report-shard-4-39514217770-1`). The first run and its retry produced identical images, and the image sizes match the Windows captures at wide width. No other job failed (validate, candidate and browser shards 1 to 3 passed).

| Image | Platform | SHA-256 |
| --- | --- | --- |
| `founder-spanish-wide-visual-chromium` | win32 | `4163211a57cfcc034f32c502277762c46d11baa908af4b7c655e659c5298de70` |
| `founder-spanish-compact-visual-chromium` | win32 | `ab123966d59551bc62ab08f0f4d5aea36c4519c2f7103d9e2e8343b0af53fc00` |
| `founder-english-wide-visual-chromium` | win32 | `fba9a94faf6f846f6e088485f6ea3fd2d4ea6d6c4f50e1496e761e3f1b2fc7fe` |
| `founder-english-compact-visual-chromium` | win32 | `1f23419046a8ace29181a0a4ea3714d95ebac91c7e34c79956e3015306f1997d` |
| `founder-spanish-wide-visual-chromium` | linux | `6620fa75b418b098cb268832a698ab735d4404abe71e837dff44218731dc51aa` |
| `founder-spanish-compact-visual-chromium` | linux | `bcae43976f58484f167c99d75de7f12bfb1e82973a1a883fb40efc5a3263e35c` |
| `founder-english-wide-visual-chromium` | linux | `efd7b785745d0ea7608661f57396c386e1cdea7cc2de931a56c04889774eb504` |
| `founder-english-compact-visual-chromium` | linux | `8bbb18d6352470aecd3fedb006d7309087440600504990ddc61446167f6c674f` |

The adoption commit changes only these four files, so the rendered pages at the adoption head are the pages the run at `b27eeb71` captured. The normal-comparison CI result at the adoption head is recorded by that run, not here.

## Merge, deployment and closeout

| Item | Result |
| --- | --- |
| Final head | `1c28eeb7` (the four Linux baselines adopted on `b27eeb71`'s actuals). |
| CI at the final head | Quality run [39517613495](https://github.com/Furlanich/Portfolio/actions/runs/39517613495): success, which includes the Founder visual specs in normal comparison mode. The earlier runs at `b86ed380` and `b27eeb71` failed only on the four Founder baseline comparisons, as recorded above. |
| Merge | Owner, 2026-10-21, merge commit `1863e92a`. |
| Deployment | The GitHub Pages deploy of `1863e92a` (run 39520989812) completed successfully. |
| Deployed-site check (read-only, by the implementer, 2026-10-21) | Both `/Portfolio/Samuel-Furlanich-CV-ES.pdf` and `/Portfolio/Samuel-Furlanich-CV-EN.pdf` return 200 `application/pdf` with 567,743 and 88,517 bytes, the sizes of the committed files. `/Portfolio/Samuel-Furlanich-CV.pdf` returns 404. The Spanish Founder page links `/Portfolio/Samuel-Furlanich-CV-ES.pdf` with `download="Samuel-Furlanich-CV-ES.pdf"` and the English page the EN equivalents; both pages contain `CleverSoft S.A.` and the 2023 start year and none contain the legacy spelling. This used HEAD requests and page reads; no file was downloaded. The owner's own browser download of each CV remains the owner's check. |
| Closeout | PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE moved to `completed/` with `plan_status: COMPLETED`; the plan index and links were updated in a follow-up documentation PR. |

## Rollback

The plan's rollback assumed the legacy PDF would be deleted by this PR. It was deleted by the owner's commits before it (`93ec6d72`; the localized files were replaced in `1bcc1748`), so reverting only this PR's merge restores the legacy anchors without their file and leaves both CV actions at 404. The correct rollback is a human-reviewed PR that (1) reverts the merge commit and (2) restores `public/Samuel-Furlanich-CV.pdf` from its last tracked revision (`git show 93ec6d72^:public/Samuel-Furlanich-CV.pdf`: blob `de15b7ff`, 194,201 bytes, SHA-256 `adcb9accf74f55b02c77894a2fcd4f5c7c3fc69cc6290f007daad2700312cff9`). It must not revert `93ec6d72` or `1bcc1748`, and the recovered download must be validated at root and `/Portfolio`. The blob and hash above were read from the repository on 2026-10-20.

## Not done, and why

- **Visual baselines (plan step 6).** Adopted; see the Visual baselines section.
- **Broad `npm run test:e2e` (full default matrix).** Started locally and stopped after about 80 of 3195 cases (no failures observed in those) because it ran far too slowly to finish. The default matrix is left to the four-shard CI run; only the focused Founder, responsive, accessibility and visual gates above ran here.
- **Implementer manual inspection at 320, 390, 768, 1024 and 1440px.** Not performed as a separate pass. The automated responsive and axe gates pass at those widths, and the owner approved the new renderings on 2026-10-20.
- **Plan closeout (step 8).** Applied in a follow-up documentation PR, because the owner merged PR #178 before it was added.
- **CI on the final head.** Passed: see Merge, deployment and closeout.
