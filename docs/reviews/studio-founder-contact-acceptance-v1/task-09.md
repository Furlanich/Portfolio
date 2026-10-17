# Task 9 / PR 9 – Build the quiet legal template and canonical draft contracts

**Status:** implementation and deterministic validation complete. The owner approved all four Windows visual baselines on 2026-10-16, and the matching Linux baselines were adopted from the same-head CI artifact after inspection. The no-update Windows visual rerun passed 4/4; the post-baseline CI rerun and independent review are pending. No legal terms route or commercial publication is enabled.

**Implementer:** Codex desktop, one primary agent and zero subagents under `GOV-AGENT-USAGE`. The task packet assigns GPT-6 Luna High; the runtime did not expose a model/effort identity, so that assignment is not attested. **Reviewer R:** pending in a separate top-level session.

**Branch/worktree:** `codex/sfc-09-legal`, `D:/Projects/NextJS/Portfolio/.worktrees/sfc-09-legal`. **Base:** `2cc22b06f782619b40cd29472d72b6df5f1969f5`, the Task 8 merge containing PR #149 on `codex/sfc-integration`.

**Owned paths touched:** shared `components/legal` template/types/styles; `components/privacy/PrivacyPage.tsx`; four private bilingual commercial legal draft modules; exact canonical-copy fences in the two page-owner documents; legal/copy/privacy tests and export requirements; legal/privacy browser and visual specs with four Windows snapshots; this receipt. `scripts/brand-assets.test.mjs` also changed because its existing font-character inventory assumed the locale content folders had no nested directories; it now walks nested TypeScript content files so the new `commercial/` folders remain covered.

**Not changed:** public Terms routes, the route registry, Footer, mode, current demo Privacy copy, architecture, dependency manifest, or deployment configuration. The draft modules are not imported by public routes and carry `nonpublishable` plus `professional-review-and-factual-gates-open` metadata.

## RED / GREEN

- Node content and copy-contract suites were run before the new modules existed and failed with the expected missing-module errors.
- The browser spec was authored after the first template implementation. To verify the intended regression, I temporarily restored the pre-task Privacy component, ran the new Chromium navigation case, observed the expected failure (0 of 6 contents entries), then restored the implementation. This proves the behavior fails without the change, but the browser test source did not precede the first implementation edit; that TDD sequencing deviation is recorded rather than presented as test-first.
- The implementation gives current Privacy a server-rendered localized table of contents, ordered unique section anchors, complete no-JavaScript reading content, semantic metadata, and App Bar-aware anchor offsets. It retains the existing demo copy and GitHub link, and does not expose commercial drafts.
- Canonical-copy contracts compare all four complete bilingual typed exports to bounded owner-document JSON fences, preserving array order and exact strings. Mutation coverage rejects changed fields/text, links, order, and missing fences.

## Validation

- `npm run validate`: passed. Its documentation check reported 342 Markdown files, 120 document IDs, and 38 Skills; the post-receipt `npm run docs:check` rerun passed at 343 Markdown files. `npm test`: 785/785; lint: 0 errors and 282 existing warnings in the vendored Impeccable bundle; typecheck passed; Turbopack build passed and generated 16 static routes.
- `npm run verify:static-export`: passed for the root export and `/Portfolio` export, 14 checked routes each. A production build under `/Portfolio` also passed.
- Legal/privacy browser matrix: 99/99 across Chromium, Firefox, WebKit, mobile, tablet, wide, and compact projects; focused Chromium checks: 11/11. Coverage includes no-JavaScript content, localized navigation, keyboard activation, App Bar offset, six viewport widths, Terms 404s, and axe checks with no serious/critical violations.
- All four Windows Chromium visual captures were inspected against the approved design and approved by the owner on 2026-10-16. The initial PR CI run intentionally failed only because the four Linux goldens did not yet exist. I downloaded only the four legal `*-actual.png` files from shard 4, inspected them against the approved rendering, and adopted them without renaming Windows captures. Provenance: Quality run `38982467548`, shard-4 artifact `playwright-report-shard-4-38982467548-1` (artifact ID `12081749722`), source head `11c7abb6faa1ccc059220efa096ad33dcbf55c78`. The artifact contained exactly the four legal actuals used here; the missing-baseline failure was expected and is not acceptance. The owner approved this baseline set on 2026-10-16.
- After adopting the Linux snapshots, the Windows `visual-chromium` legal spec passed 4/4 in normal comparison mode.
- Snapshot SHA-256 (Windows / Linux):
  - Spanish wide: `05F85FE2E3C307E1751726E55189102FE1BC4AF53E1EE907E9A6B2F756296DF2` / `0902B3526D50ED5ACCF7575C0CBC59937ADC852081FC6A6CD590218015199D00`
  - Spanish compact: `FB19D9B14B5813A0EBFABDFB54CD5D5A0C2A7DE5532450AB216DA7ACFC848E56` / `380D66985050FA755A2084AA695DAEBCFF418B98C4ABF1EFA2B24368D9713D7D`
  - English wide: `9704096E17CCE6A1D821C085EBED89257EEF844E5C0049C0CA14409A177B701C` / `A5CEED75F620AE21E9A548A78CB23F2DD9E699551C9B21AC572024882265DA91`
  - English compact: `0AB5B744D2AB6552A55B031D871E474E1349FAB10AA550F8EAD09A766FF450A9` / `FD411DE5D1F9DB2CA0DA07E67E96380D6DBAFE05F1A95D0EB605427FF53931FF`
- `git diff --check` passed. The generated `next-env.d.ts` is clean. Production builds needed write access to generated `.next` output; the initial sandboxed build stalled, and the repository build passed when run with that access.

## Open items

- The clean post-baseline CI run and Reviewer R's independent review remain pending.
- Professional review and account-specific factual gates for commercial Privacy/Terms remain open for the later Task 13 release gate. The staged drafts are not legal advice or publishable copy.
