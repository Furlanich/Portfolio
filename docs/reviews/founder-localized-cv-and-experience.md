# PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE Task 1 — implementation receipt

Evidence record, not a requirements owner: [PAGE-FOUNDER](../product/pages/studio-and-founder.md#founder-cv-experience-amendment-approved-2026-10-20) owns the contract and the [plan](../plans/active/founder-localized-cv-and-experience.md) owns the sequence.

## Status

Implementation and local verification are complete on branch `codex/founder-localized-cv-experience`. The owner dispositioned the PDF input gates on 2026-10-20 (below) and decided OD-5 (independent work starts in 2023). **Open before merge:** owner approval and adoption of the four Founder visual baselines, the independent Codex review and the CI run. Merging publishes both PDFs.

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

The owner has not separately confirmed the language of each file; the text extraction in this session shows Spanish for ES and English for EN.

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
| `npm run test:e2e -- tests/e2e/visual/founder.visual.spec.ts --project=visual-chromium` | **4 failed, as expected**: the added entry changes page height. Baselines were not updated. |

The export and production-browser evidence is local only; CI runs neither `verify:static-export` nor the production family.

## Rulings

- **PDFs and legacy deletion arrived on `main` first.** The plan said to delete the legacy file in the same PR as the additions. The owner's commits `93ec6d72` and `1bcc1748` already did both, so the PR does not contain those binary changes. The plan's intent (no legacy file, no references, both localized files present) is asserted by tests and by the verifier. Cost if wrong: none for the end state; the interim `main` served a dead CV link between that commit and this PR.
- **No pre-change `/Portfolio` production run.** One pre-change RED run at the root base was enough to witness the failures; the base path adds no distinct code path to the Founder anchor. The `/Portfolio` base is covered by the fixture tests (accepted profile and doubled prefix at `/Portfolio`) and by the post-change run. Cost if wrong: a base-specific RED not witnessed.
- **Plan not moved to `completed/`.** Step 8 asked for this in the same PR. Gates G1, G2 and G4, the visual approval and the independent review are open, so the plan stays `active` and claims nothing. Cost if wrong: one follow-up documentation change after the owner's merge.
- **Legacy and distinct-hash verifier checks report under the first Founder file.** They are once-per-export checks with no natural page; the prefix keeps them observable by the existing fixture filter, as the plan required.
- **Verifier keeps the page-level `href` substring check beside the new pairing check.** Removing it would change error text other consumers may match; the pairing check is the stricter addition.

## Not done, and why

- **Visual baselines (plan step 6).** Replacement Windows baselines need owner approval of the new renderings, and Linux files need a same-head CI run. Neither exists, so the eight Founder PNGs are untouched and the visual gate stays OPEN.
- **Broad `npm run test:e2e` (full default matrix).** Started locally and stopped after about 80 of 3195 cases (no failures observed in those) because it ran far too slowly to finish. The default matrix is left to the four-shard CI run; only the focused Founder, responsive, accessibility and visual gates above ran here.
- **Manual rendered inspection at 320, 390, 768, 1024 and 1440px.** The automated responsive and axe gates pass; a human visual review of the added entry has not been recorded.
- **Plan closeout (step 8).** The plan stays in `active/`. Moving it to `completed/` before the gates above close would claim completion that has not happened.
- **Independent Codex review and CI.** Not run.
