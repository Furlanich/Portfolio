# Task 16 / PR 16 — Release the coherent redesign and direct-contact legal pages

**Status: the Terms pair, the Footer link, the reciprocal Privacy/Terms navigation and the host-import fix are implemented and verified on the release candidate. The static-release startup-CPU gate is fixed for every code-attributable cost (desktop 6 of 6 paired PASS, no host code on any Atlas page) but is not fully PASS on mobile: the remaining +15 to +48 ms is the owner-approved poster, shown by experiment (below).** The ten visual baselines were approved by the owner on 2026-10-18 and the Windows images are adopted; the Linux images follow from matching CI actuals. Nothing was deployed; no account, provider or live service was touched.

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

- `npm run validate` (clean `.next`/`out`, run again on the final head `e4ab2bef` plus this receipt) exit 0: docs:check 352 Markdown files, 121 document IDs, 38 Skills; Node 949 tests, 948 pass, 1 `todo`, 0 fail (828 at Task 13, 857 at Task 14); lint 0 errors and the 282-warning baseline (an extra warning in the first run came from a git-ignored scratch script of mine, since deleted, and one earlier in a new test, fixed); typecheck; production build of 16 static routes. `npm run verify:static-export` on that build: 16 routes.
- `npm run verify:static-export`: 16 routes at the root and 16 at `/Portfolio` (base-path build done in PowerShell; Git Bash rewrites `/Portfolio` into a Windows path, which a first attempt exposed).
- Browser, served `/Portfolio` export, ten default projects (Chromium, Firefox, WebKit, mobile Chromium/WebKit, tablet, wide, 320, tablet-portrait, accessibility) on the legal, privacy, Footer-host, accessibility, navigation and smoke specs: **719 passed, 64 skipped, 0 failed** (783 cases). After the Footer grouping change, the root export for the Footer, legal, accessibility and privacy specs: 468 passed, 3 failed under three parallel workers (two Firefox and one WebKit Footer case), all three passing in isolation (8/8, one worker). Cause: load-related navigation timeouts under parallel workers, the same pattern earlier receipts record for cold servers; no assertion was changed. A first run against `next dev` also showed one cold-compile `net::ERR_ABORTED`, which is why the matrix runs on the served export.
- Accessibility: axe finds no serious or critical violation on all sixteen pages; each page keeps one banner, one main and one Footer, an ordered outline and a keyboard-ordered Footer (now including Terms). Contrast and screen-reader behavior beyond axe were not checked manually in this task.
- Direct contact is unchanged by this task and still covered by the Task 13 specs: no form control, provider request or stale simulation wording appears in the emitted HTML (the verifier rejects them on Terms and Contact).
- Controlled runtime candidate (`SFC_TEST_MODE=candidate`, the updated `live-policy.patch` applied in a disposable checkout at `e4ab2bef`, `sfc-runtime-chromium`, one worker, 22.4 minutes): **63 passed, 3 skipped, 5 failed**, the same counts and the same five cases Task 14 recorded on the untouched integration head (three `contact form signal` cases and two direct-Contact cases that Task 13 and 14 name as carried findings). So the seam attaches the host to Atlas pages when a tier is enabled and nothing regressed; the checkout was restored and removed.
- `git diff --check` clean.

## Static release gate: the host import is fixed

**Owner direction, 2026-10-18.** After the first version of this receipt reported the gate FAIL on Task 14's finding, the owner approved the ten baselines and directed this task to fix the startup-CPU gate before the PR is opened. That is the "packet 20 or later" Task 14 named but the plan never defined; it was done here on the owner's instruction (ledger ruling), not by editing plan substance, and Contact's 0.35 scene opacity, the other Task 14 finding, is not part of it.

**Root cause (Task 14, confirmed again by RED).** Next ships a client component's chunk with every page whose server module graph can reach it, rendered or not. `ConnectedStudioGround` imported `ConnectedStudioEnhancement` (the host, 13.7 KiB Brotli) for Services and Projects, so Studio, Founder and Contact loaded it in a policy-disabled build. A policy branch cannot help; the import has to be unreachable. `next/dynamic` does not help either (the Next guide says a Server Component's dynamic import of a Client Component is not code-split).

**Fix.** The Ground is split in three: `ConnectedStudioGroundLayer` (the shared static ground, no host import), `ConnectedStudioGround` (Services and Projects only, still mounting the host) and `ConnectedStudioAtlasGround` (Studio, Founder, Contact), whose only live seam is the empty `atlas-live-host.tsx`. `StudioPage`, `FounderPage` and `ContactPage` use the Atlas Ground. The type contract, the host and media source tests, and `live-policy.patch` were updated: the runtime candidate now flips the policy flags and fills the seam, so a qualified enablement (Task 18) is a two-file change, flags plus `atlas-live-host.tsx`. A flag alone no longer mounts the host on an Atlas page; that is intended (a flag cannot make a bundler drop an import) and is written in the seam file and in ARCHITECTURE.md.

- RED then GREEN: the new import-graph contract (`scripts/sfc-contracts.test.mjs`) failed on "Studio, Founder and Contact cannot reach the connected host" and passed after the split; its companion proves Services and Projects still reach it. The held production case `a policy-disabled Atlas page references no connected host code` (Task 14's RED) had its `fixme` removed and passes: `sfc-production-{chromium,firefox,webkit}` 24 of 24. Node 949 tests, 948 pass, 1 `todo`; typecheck clean.
- Production collector, root export: **gates passed** (no optional code in any referenced script of the six Atlas pages; closure still 119.5 KiB on Services and Projects, 0.5 KiB headroom, unchanged).
- Startup judgement against the committed Task 3 baseline (`--startup-baseline --compare`): **13 PASS, 3 OPEN, 0 FAIL**, from 8 / 5 / 3 before the fix. Critical JavaScript is within 5 bytes of the pre-Atlas baseline on every Atlas page.
- Paired, interleaved adjudication against `7fc2a6c6` (the Task 3 head, in a disposable checkout, both heads on this machine): batch one, order base, current, current, base, both profiles, ten journeys per side: **desktop 6 of 6 PASS** (medians -5 to -60 ms; Task 14 had 6 of 6 FAIL at +30 to +49 ms); **mobile 2 PASS, 2 OPEN, 2 FAIL** (Studio en +41 ms median and +66 p95, Founder es +35 and +26, OPEN Studio es and Founder en; Contact PASS). Batch two, mobile only, order reversed (current, base, base, current): 4 PASS, 1 OPEN, 1 FAIL (Studio en +42 and +46). Task 14 had mobile +85 to +107 ms on all six.

**What the remaining mobile cost is.** It is not shipped code. Compared with the baseline the Studio page references the same script set with the same sizes (the only difference is a 40-byte chunk), the same three client components (`NavigationDisclosure`, `LanguageSwitch`, `AppBarBehavior`), a smaller document (63.9 to 57.9 KB; 187 to 174 elements; 37.6 to 34.3 thousand flight characters), and lower layout and style time in the traces. An experiment isolated the poster: the same export with the poster custom properties removed from the Studio pages against the unmodified one, mobile, interleaved, two rounds: the poster costs about **+32 ms (Studio en, OPEN) and +37 ms median, +50 p95 (Studio es, FAIL)**. The posters are the owner-approved Task 14 deliverable, so the residual is a design cost, not a defect, and I did not change them.

**So the gate command still exits 1** on the unresolved mobile rows (an OPEN or FAIL row never satisfies it, by Reviewer R's Task 14 finding), and I did not weaken that rule.

**Owner decision, 2026-10-18: ACCEPTED.** Given the choice between accepting the poster's mobile cost and lightening the compact poster (900 by 1600 px), the owner wrote: "Accept the poster's mobile startup cost." The posters, their captured frames and their baselines are therefore unchanged, and the mobile startup-CPU rows that remain OPEN or FAIL on that account (Studio, Founder and Contact at the 4x throttle, +15 to +48 ms median against the 25 ms allowance) are recorded as an accepted design cost, not as PASS. The allowance itself was set before the posters existed and is not amended here; only the planning authority may change it. The code-attributable cost, the host chunk, is gone, and desktop is 6 of 6 PASS.


Terms against its Privacy comparator (the collectors do not know Terms, and those scripts are Task 14's): each Terms page references exactly the same scripts as its Privacy page (0 B added JavaScript) and its HTML is 77 B (es) and 101 B (en) larger Brotli, inside the 2 KiB legal budget. No paired startup-CPU measurement of Terms exists; its scripts are identical to Privacy's, so that row stays OPEN.

## Visual review and baselines

Reduced-motion Windows Chromium captures were inspected: Terms and Privacy at 1440x1000 and 390x844 in both languages, and the Footer at 1440, 390 and 320 px. The Azure ground, one opaque Deep reading plate, Bone headings, update line, two-column contents, section rhythm and chart-glow links match the approved Privacy treatment; no clipping or overflow; the Footer shows the copyright, the Privacy and Terms group and the language control at the far edge (a first version spread the four utility items evenly and a second left the control orphaned when wrapped; both were seen and corrected).

**Owner approval, 2026-10-18** ("I approve the visual baselines", after review images of the ten cases were presented): four Privacy Windows cases (`privacy-{es,en}-{wide,compact}`, new update line and Terms link), two Footer Windows cases (`footer-{wide,compact}`, new Terms link) and four new Terms Windows cases (`terms-{es,en}-{wide,compact}`). All ten Windows files are adopted. Each one is byte-identical to the reviewed image (the Terms files are the parked reviewed captures; the six regenerated ones match the reviewed actuals' SHA-256), and the whole visual project then passed in compare mode with no update flag: 93 of 93.

| Windows baseline | SHA-256 (first 16) |
| --- | --- |
| `privacy-en-compact` | `FFC2C0CE36705477` |
| `privacy-en-wide` | `F7366C08C69013E9` |
| `privacy-es-compact` | `6EC0A3270A896EDD` |
| `privacy-es-wide` | `57D7471D9D94C0DE` |
| `footer-compact` | `65FA456D1E538D2F` |
| `footer-wide` | `CEE3ED07871A5E69` |
| `terms-*` (four) | the reviewed captures, unchanged |

**Linux images (adopted 2026-10-19).** The first CI run on the PR head `cbaf5d14` ([Quality run 39190888204](https://github.com/Furlanich/Portfolio/actions/runs/39190888204)) passed `validate` and browser shards 1 to 3; shard 4 reported **10 failed, 744 passed**, exactly the ten changed or new visual cases and nothing else (the host-code production case and every other case passed). The Linux sources are the `*-actual.png` files of that run's `playwright-report-shard-4-39190888204-1` artifact (artifact ID 12160224074), downloaded into a new empty directory. Each retried case produced byte-identical images in both attempts, every image has the same pixel size as its approved Windows counterpart (the new Footer compact image is 28 px taller than the old Linux one, the wrapped Terms link), and all ten were inspected against the approved rendering. They were committed under their exact Linux snapshot names without update mode or renaming a Windows image.

| Linux baseline | SHA-256 (first 16) |
| --- | --- |
| `privacy-en-compact` | `940AAA62A7CEECBB` |
| `privacy-en-wide` | `FFF59B04386BBF45` |
| `privacy-es-compact` | `A4D0EB31EA860629` |
| `privacy-es-wide` | `23B637B606C20B32` |
| `terms-en-compact` | `AAB26ABEE9ECCD71` |
| `terms-en-wide` | `D62FB1BFCE80DD10` |
| `terms-es-compact` | `84186619EBDB52BD` |
| `terms-es-wide` | `E449C41AE01A72D5` |
| `footer-compact` | `C96E49E8908681F1` |
| `footer-wide` | `86E0ACE2A151E7C0` |

The CI run at the head that carries them is the clean no-update comparison; its result is recorded in the PR.

## Rollback

Prior public state: `main` at `cd8c0d45` (PR #142), deployed by [run 38728080880](https://github.com/Furlanich/Portfolio/actions/runs/38728080880) on 2026-10-15, the latest deploy at the time of this task. Deployment is the `push` to `main` workflow, so the whole-release rollback is a human action: `gh run rerun 38728080880` rebuilds and republishes `cd8c0d45`, or revert the PR 16 merge commit on `main` (the revert push redeploys). Samuel controls both. Nothing in this branch changes hosting or the workflow.

## Rulings

- Plan source: read from `origin/codex/sfc-integration`. Cost if wrong: none.
- Update date: both Terms and Privacy show 18 de octubre de 2026 / October 18, 2026, the date the owner-approved text was finalized; "last updated" is a content revision date and the merge date cannot be known now. Cost if wrong: four string literals and their tests; the owner should confirm at release.
- Privacy keeps its approved introduction and GitHub link; sections, heading, update label and Terms link come from the canonical commercial module. The canonical copy has no introduction or link, and the verifier requires both.
- Unlisted but necessary paths: `components/privacy/PrivacyPage.tsx`, `components/foundation/content-types.ts` (the `PrivacyContent` type), `tests/e2e/support/paths.ts`, `scripts/legal-content.test.mjs`, the Footer CSS, and the documentation synchronization AGENTS.md requires. Each is the smallest wiring for the listed work; the alternative for Privacy (bypassing `PrivacyPage`) would leave dead code. Cost if wrong: Reviewer R may ask to split them.
- The Terms verifier requirements live inline in `verify-static-export.mjs`; a new `export-requirements/terms.mjs` is not a listed path.
- The Terms Footer label comes from `footer-content.ts` rather than from each page's `labels`, so no page file outside the owned list changes.
- Owner-directed fix of the Task 14 host-import finding, done in this task: the owner instructed it in chat on 2026-10-18, so it needed no plan edit; the plan text and its numbering are untouched. Cost if wrong: the planning authority may prefer a separate packet and PR; the fix is three isolated commits and can be split out.
- The seam design (empty `atlas-live-host.tsx` filled together with the policy flags) instead of a flag-only enablement: the only way a policy-disabled build ships no host chunk, because the build cannot fold a flag across modules and Next ships a client chunk by reachability. Cost if wrong: the Task 18 enablement carries one more file.
- Open the PR as a draft although two mobile rows stay OPEN or FAIL: the owner asked for the PR once the gate was fixed; the code-attributable cost is gone and the rest is documented here. A draft cannot merge or deploy. Cost if wrong: close the draft.

## Open items and deferred minors

- **Mobile startup CPU.** Not PASS on the unresolved rows; the poster costs about 30 to 40 ms at the 4x throttle and the owner accepted that cost on 2026-10-18 (above). Desktop is 6 of 6 PASS. A future change of the 25 ms allowance belongs to the planning authority.
- **Update date.** Confirm 18 de octubre de 2026 / October 18, 2026 (see Rulings). The Linux baselines are adopted (above).
- **Contact's 0.35 scene opacity** (the other Task 14 finding) is not implemented and is not part of this task.
- **Reviewer R and human merge** are separate and OPEN. The plan's own status text still says "execution NOT AUTHORIZED"; only the planning authority may change plan substance.
- Deferred minor: Contact links to Privacy only. DESIGN-SFC-V1 gives Contact's quiet legal links to PAGE-CONTACT; a Terms link there would be a Task 13 page change. Terms is reachable from every Footer.
- Deferred minor: no manual screen-reader pass and no paired CPU measurement of Terms were done.
- Not done by design: no deployment, no live graph flag, no Task 17 deployed check, no hardware work.
