# Task 9 / PR 9 – Build the quiet legal template and canonical draft contracts

**Status:** Reviewer R completed independent review on 2026-10-16. All three findings were valid and are corrected. The owner amended the legal palette to the Studio connected Azure ground and opaque Deep reading plate, approved the corrected four Windows captures, and the four matching Linux actuals were adopted from same-head CI. Final no-update CI acceptance remains; Task 9 is open. No legal terms route or commercial publication is enabled.

**Implementer:** Codex desktop, one primary agent and zero subagents under `GOV-AGENT-USAGE`. The task packet assigns GPT-6 Luna High; the runtime did not expose a model/effort identity, so that assignment is not attested. **Reviewer R:** completed independent review in a separate top-level session; findings and dispositions are recorded below.

**Branch/worktree:** `codex/sfc-09-legal`, `D:/Projects/NextJS/Portfolio/.worktrees/sfc-09-legal`. **Base:** `2cc22b06f782619b40cd29472d72b6df5f1969f5`, the Task 8 merge containing PR #149 on `codex/sfc-integration`.

**Owned paths touched:** shared `components/legal` template/types/styles; static `components/connected-studio/ConnectedStudioBackdrop.tsx`; `components/privacy/PrivacyPage.tsx`; four private bilingual commercial legal draft modules; exact canonical-copy fences in the two page-owner documents; legal/copy/privacy tests and export requirements; legal/privacy browser and visual specs with four Windows and four Linux snapshots; the connected-canvas assertion in `tests/e2e/immersive-home-static.spec.ts`; this receipt. `scripts/brand-assets.test.mjs` also changed because its existing font-character inventory assumed the locale content folders had no nested directories; it now walks nested TypeScript content files so the new `commercial/` folders remain covered.

**Not changed:** public Terms routes, the route registry, Footer, mode, current demo Privacy copy, architecture, dependency manifest, or deployment configuration. The draft modules are not imported by public routes and carry `nonpublishable` plus `professional-review-and-factual-gates-open` metadata.

## RED / GREEN

- Node content and copy-contract suites were run before the new modules existed and failed with the expected missing-module errors.
- The browser spec was authored after the first template implementation. To verify the intended regression, I temporarily restored the pre-task Privacy component, ran the new Chromium navigation case, observed the expected failure (0 of 6 contents entries), then restored the implementation. This proves the behavior fails without the change, but the browser test source did not precede the first implementation edit; that TDD sequencing deviation is recorded rather than presented as test-first.
- The implementation gives current Privacy a server-rendered localized table of contents, ordered unique section anchors, complete no-JavaScript reading content, semantic metadata, and App Bar-aware anchor offsets. It retains the existing demo copy and GitHub link, and does not expose commercial drafts.
- Canonical-copy contracts compare all four complete bilingual typed exports to bounded owner-document JSON fences, preserving array order and exact strings. Mutation coverage rejects changed fields/text, links, order, and missing fences.

## Reviewer R findings and dispositions — 2026-10-16

- **[P3] GitHub privacy link opened an unannounced new tab — valid, corrected.** `PrivacyPage` no longer marks the existing GitHub link external, retaining same-tab navigation. The privacy browser cases assert the link is not `_blank` in both locales.
- **[P2] Legal H1 clipped at 320px with 200% text size — valid, corrected.** Compact legal titles now cap responsively at the viewport-derived width when root text size is enlarged. A browser case applies a 32px root font size, then checks the title's scroll and text-line bounds for Spanish and English.
- **[P2] Legal type scale diverged from DESIGN-SFC-V1 — valid, corrected.** All legal headings use weight 600; the introduction uses 20px / 1.5; legal H2 uses 24/26/28px at compact/tablet/wide breakpoints. The prior baseline approval did not amend the numeric design requirements.
- The four corrected Windows visual captures (Spanish/English, wide/compact) show the owner-approved Studio Azure ground and Deep reading plate, with all text inside the reading surface. The owner approved these captures after directing the palette correction; the four Windows snapshots were replaced and pass in normal comparison mode. Matching Linux actuals have since been inspected and adopted from same-head CI run `38995832148`, shard-4 artifact `playwright-report-shard-4-38995832148-1` (artifact ID `12086494371`), source head `15ff74b4527b70a0a940cdbf64a3c0d6493de614`.

## Validation

- Quality run `38984605105` at head `e2933ecdc625bf53b93df81c31c5f4533eaf537e` passed `validate` and browser shards 1–4. Its documentation check reported 341 Markdown files, 120 document IDs, and 38 Skills. `npm run validate`: passed (785 tests, lint 0 errors and 282 existing warnings in the vendored Impeccable bundle, typecheck, Turbopack build with 16 static routes).
- `npm run verify:static-export`: passed for the root export and `/Portfolio` export, 14 checked routes each. A production build under `/Portfolio` also passed.
- Legal/privacy browser matrix: 99/99 across Chromium, Firefox, WebKit, mobile, tablet, wide, and compact projects; focused Chromium checks: 11/11. Coverage includes no-JavaScript content, localized navigation, keyboard activation, App Bar offset, six viewport widths, Terms 404s, and axe checks with no serious/critical violations.
- The original four Windows Chromium captures were inspected and approved by the owner on 2026-10-16. The initial PR CI run intentionally failed only because the four Linux goldens did not yet exist. I downloaded only the four legal `*-actual.png` files from shard 4, inspected them against the approved rendering, and adopted them without renaming Windows captures. Provenance: Quality run `38982467548`, shard-4 artifact `playwright-report-shard-4-38982467548-1` (artifact ID `12081749722`), source head `11c7abb6faa1ccc059220efa096ad33dcbf55c78`. The artifact contained exactly the four legal actuals used there; the missing-baseline failure was expected and not acceptance. Those original captures represent pre-correction CSS; their historical hashes are retained below.
- After adopting the original Linux snapshots, the Windows `visual-chromium` legal spec passed 4/4 in normal comparison mode.
- Historical pre-correction snapshot SHA-256 (Windows / Linux; superseded by the owner-approved palette/type corrections):
  - Spanish wide: `05F85FE2E3C307E1751726E55189102FE1BC4AF53E1EE907E9A6B2F756296DF2` / `0902B3526D50ED5ACCF7575C0CBC59937ADC852081FC6A6CD590218015199D00`
  - Spanish compact: `FB19D9B14B5813A0EBFABDFB54CD5D5A0C2A7DE5532450AB216DA7ACFC848E56` / `380D66985050FA755A2084AA695DAEBCFF418B98C4ABF1EFA2B24368D9713D7D`
  - English wide: `9704096E17CCE6A1D821C085EBED89257EEF844E5C0049C0CA14409A177B701C` / `A5CEED75F620AE21E9A548A78CB23F2DD9E699551C9B21AC572024882265DA91`
  - English compact: `0AB5B744D2AB6552A55B031D871E474E1349FAB10AA550F8EAD09A766FF450A9` / `FD411DE5D1F9DB2CA0DA07E67E96380D6DBAFE05F1A95D0EB605427FF53931FF`
- `git diff --check` passed. The generated `next-env.d.ts` is clean. Production builds needed write access to generated `.next` output; the initial sandboxed build stalled, and the repository build passed when run with that access.

### Post-review correction verification — 2026-10-16

- `npm run validate`: passed with 785/785 Node tests, 0 lint errors (282 existing warnings in the vendored Impeccable bundle), typecheck, and production build. `docs:check` reported 341 Markdown files, 120 document IDs, and 38 Skills.
- Legal/privacy Playwright matrix: 108/108 passed across Chromium, Firefox, WebKit, mobile, tablet, wide, compact-320, and tablet-portrait projects. The matrix covers same-tab external link behavior in both locales and 200% text-size H1 bounds in both locales.
- `npm run verify:static-export`: passed for root and `/Portfolio` exports, 14 routes each; both root and base-path production builds passed.
- The corrected Windows `visual-chromium` run detected the expected differences in all four cases. After the owner's Azure palette direction and approval, only the four Windows legal snapshots were updated. The no-update `visual-chromium` rerun passed 4/4. The initial same-head CI bootstrap run's shard-4 rerun produced the same four viewport captures byte-for-byte; its only failures were the four expected pre-correction Linux snapshot comparisons. The four Linux snapshots were adopted from that exact shard artifact; a no-update run at the new head is pending.

### Owner palette correction — 2026-10-16

- The owner identified the white/Bone page background as incorrect and directed Privacy/Terms to use the Azure background used by Studio. DESIGN-SFC-V1 records this approved amendment: the shared static connected ground, one opaque Deep reading plate, Bone headings, secondary body text, chart-glow underlined links, and chart-border rules. Contact's Bone intake and all legal publication gates are unchanged.
- The owner approved the corrected capture set with the palette direction “the background shouldn't be white; it should be the Azure background used in the other pages such as Studio.” The four captures were visually inspected, then only the Windows legal snapshots were replaced. The previous Linux goldens showed the pre-correction layout; they were replaced only with matching actuals from the same-head Linux CI run listed below.
- The visual spec now captures the viewport rather than the complete main element. The connected ground is fixed to the viewport, so full-element screenshots tiled it and produced a false seam below the viewport. The new captures are 1440×1000 (wide) and 390×844 (compact), in both locales.
- The shared-ground/opaque-plate assertion's initial RED run was blocked by an existing Next dev-server listener on port 3100. To complete browser verification without disturbing that unresponsive process, the final static export was served on a separate test port. The legal/Privacy suite passed **117/117** across Chromium, Firefox, WebKit, mobile, 320px, tablet, and wide profiles, including both locales, the new structural assertion, the 200% text-size case and axe checks.
- Final `npm run validate` passed. Root export verification passed for 14 routes at `/`; a separate base-path build and `npm run verify:static-export` passed for 14 routes at `/Portfolio`.
- Approved Windows snapshot SHA-256 (wide 1440×1000; compact 390×844):
  - Spanish wide `tests/e2e/visual/legal.visual.spec.ts-snapshots/privacy-es-wide-visual-chromium-win32.png` — `8BCE9956E60A578D224917E0475F245A7FB037F8FD7A489D3C53F7FA9AE96C85`.
  - Spanish compact `tests/e2e/visual/legal.visual.spec.ts-snapshots/privacy-es-compact-visual-chromium-win32.png` — `2FC9D459BA1F9C93149CF2E840C6AED10BD9A5532929E874CED4F7F45B73872B`.
  - English wide `tests/e2e/visual/legal.visual.spec.ts-snapshots/privacy-en-wide-visual-chromium-win32.png` — `33CB1547DE1AB6F0B672EDCAA8434792FDFB8423E47A0D199D26CEB36B3030F0`.
  - English compact `tests/e2e/visual/legal.visual.spec.ts-snapshots/privacy-en-compact-visual-chromium-win32.png` — `0515DC1226C4156040FB20E5EA13C59E3DA58A902F807109BB812E95DD639C11`.
- These actuals match their snapshots byte-for-byte:
  - Spanish wide `test-results/visual-legal.visual-Spanish-Privacy-wide-reading-surface-visual-chromium/privacy-es-wide-actual.png` — SHA-256 `8BCE9956E60A578D224917E0475F245A7FB037F8FD7A489D3C53F7FA9AE96C85`.
  - Spanish compact `test-results/visual-legal.visual-Spanish-Privacy-compact-reading-surface-visual-chromium/privacy-es-compact-actual.png` — SHA-256 `2FC9D459BA1F9C93149CF2E840C6AED10BD9A5532929E874CED4F7F45B73872B`.
  - English wide `test-results/visual-legal.visual-English-Privacy-wide-reading-surface-visual-chromium/privacy-en-wide-actual.png` — SHA-256 `33CB1547DE1AB6F0B672EDCAA8434792FDFB8423E47A0D199D26CEB36B3030F0`.
  - English compact `test-results/visual-legal.visual-English-Privacy-compact-reading-surface-visual-chromium/privacy-en-compact-actual.png` — SHA-256 `0515DC1226C4156040FB20E5EA13C59E3DA58A902F807109BB812E95DD639C11`.
- Linux snapshots were adopted from `playwright-report-shard-4-38995832148-1` (artifact ID `12086494371`, Quality run `38995832148`, source head `15ff74b4527b70a0a940cdbf64a3c0d6493de614`). All four initial captures were visually inspected and matched their retry captures byte-for-byte:
  - Spanish wide — SHA-256 `0101138EA2EDF2A5C198B4CDF0F21706069D3F200E78F79AAC677D5AB6D675C6`.
  - Spanish compact — SHA-256 `9EC0716D121208FD9F3DEED32154D4E3BF1C99CF6E21E0130A3B52868BD93596`.
  - English wide — SHA-256 `56FA689C981D82A97072B967F35421AD9F472F9B4C50F5BA4DF00570DADE231E`.
  - English compact — SHA-256 `E8BC75B3436FFEE48C64C9819ABBA7157E17161623200F2E4C14DBE4DAA7A952`.

### Connected-canvas regression correction — 2026-10-16

- Same-head Quality run `38996816033` at `b98a6a6d460cf1e9b6644b556ea0582a2f701faf` passed `validate` but its first browser shard caught an outdated assertion in `tests/e2e/immersive-home-static.spec.ts`: it still expected Privacy's document canvas to remain Bone, although the owner-approved Azure ground correctly pins Abyss on `html`.
- Updated the shared canvas assertion to cover both Spanish and English Privacy routes, require exactly one connected ground, and assert the Abyss canvas color. The focused Chromium check passed 2/2 against the static export. The Task 9 plan's write paths now include this shared connected-canvas assertion.
- Run `38996816033` was already executing before this correction and is not final acceptance. A fresh same-head CI run after committing this assertion and the corrected Linux visual baselines remains required.

## Open items

- Clean no-update visual rerun and full CI pass at a commit containing both platform baseline sets and the corrected connected-canvas assertion.
- Professional review and account-specific factual gates for commercial Privacy/Terms remain open for the later Task 13 release gate. The staged drafts are not legal advice or publishable copy.
