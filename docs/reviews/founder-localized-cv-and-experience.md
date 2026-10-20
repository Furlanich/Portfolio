# PLAN-FOUNDER-LOCALIZED-CV-EXPERIENCE Task 1 — implementation receipt

Evidence record, not a requirements owner: [PAGE-FOUNDER](../product/pages/studio-and-founder.md#founder-cv-experience-amendment-approved-2026-10-20) owns the contract and the [plan](../plans/active/founder-localized-cv-and-experience.md) owns the sequence.

## Status

Implementation and local verification are complete on branch `codex/founder-localized-cv-experience`. **The branch is not ready to merge**: input gates G1, G2 and G4 are unresolved blockers, visual-baseline approval is open, the independent Codex review has not run and CI has not run. Merging publishes both PDFs.

## Identity

| Item | Value |
| --- | --- |
| Primary agent | Anthropic Claude Code, Claude Sonnet 5.5 (`claude-sonnet-5-5`), single session, no subagents (0/0). The effort level was not selectable from inside the session and is not asserted here. |
| Independent reviewer | Not yet run. Required: a fresh top-level OpenAI Codex review through the `codex` plugin; record its resolved model here. |
| Frozen base | `main` at `93ec6d72` (after PR #177 and the owner's CV commit). |
| Checkout | `D:/Projects/NextJS/Portfolio/.worktrees/founder-cv`, branch `codex/founder-localized-cv-experience`. |
| Commits | `2dd8d309` documentation amendment; `5de64f0b` failing-first tests; `3cef8c7f` implementation; later commits record documentation and this receipt. |

## PDF provenance

The owner committed both files to `main` in `93ec6d72` (which also deleted the legacy PDF) before implementation started. Their hashes equal the drafts recorded in the plan. This session did not edit, regenerate, translate or redact any PDF byte.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `public/Samuel-Furlanich-CV-ES.pdf` | 195,961 | `a9a6611486af5311b59557785d0c56ff328ac3c94e4d239efbe24e584b250120` |
| `public/Samuel-Furlanich-CV-EN.pdf` | 194,212 | `02f5b438d3e28f6f164856da90ac12aa281c780e9a3d8afdc77be518c3565625` |

The exported copies in both the root and `/Portfolio` builds hash identically. The legacy `public/Samuel-Furlanich-CV.pdf` is absent from the repository and from `out/`.

## Input gate dispositions

No owner disposition has been given in this session. Committing the files to `main` is not treated as one.

| ID | Finding | Re-observed in the committed files | Disposition |
| --- | --- | --- | --- |
| G1 | The ES profile addresses one employer. | Yes: the ES summary says Samuel seeks to contribute to "Grupo Andreoli" in the agricultural sector. | **OPEN, BLOCKER.** |
| G2 | The ES file embeds a "Content Credentials" attachment. | Yes: the marker appears twice in the ES bytes. Its content was not inspected. | **OPEN, BLOCKER.** |
| G3 | The ES file declares `/Lang(en-US)`. | Yes (`/Lang(en-US)` in the ES file). | **OPEN** (SHOULD). |
| G4 | Both CVs start FURLANICH in 2023; the site says 2024. | Yes: both PDFs print `2023`. The site fact is unchanged. | **OPEN, BLOCKER.** |
| G5 | CV says `Graduado` / `Bachelor Degree`; the site says `Estudios completados` / `Studies completed`. | Yes. | **OPEN**: owner to confirm. |
| G6 | EN CV spells `CleverSoft SA`; the site uses `CleverSoft S.A.`. | Yes. | **OPEN**: cosmetic, owner choice. |
| G7 | Both files publish email and phone. | Not re-checked; the plan records it. | **OPEN**: owner to confirm. |

The owner's language confirmation (ES file is Spanish, EN file is English) is also still pending; a PDF signature never proves language, and the text extracted in this session shows a Spanish ES file and an English EN file.

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
| `npm run test:e2e -- tests/e2e/visual/founder.visual.spec.ts --project=visual-chromium` | **4 failed, as expected**: the added entry changes page height. Baselines were not updated. |

The export and production-browser evidence is local only; CI runs neither `verify:static-export` nor the production family.

## Rulings

- **PDFs and legacy deletion arrived on `main` first.** The plan said to delete the legacy file in the same PR as the additions. The owner's commit `93ec6d72` already did both, so the PR does not contain those binary changes. The plan's intent (no legacy file, no references, both localized files present) is asserted by tests and by the verifier. Cost if wrong: none for the end state; the interim `main` served a dead CV link between that commit and this PR.
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
