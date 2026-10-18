# Task 14 / PR 14 — Publish matched static posters and verify release costs

**Status: the six matched posters are captured, measured against their first live frame and published; the static release gate is FAIL, not PASS.** Bytes, vitals and the closure pass. Startup CPU fails on a demonstrated cause outside this packet's write set: `ConnectedStudioGround` imports the connected host statically, so every Atlas page loads it in a policy-disabled build. Two findings go to the planning authority for packets 20 and later (below). The owner approved the posters and the Windows baselines on 2026-10-18 (below); the Linux images, Reviewer R, CI and the human merge are PENDING. Nothing was deployed and no hardware was used.

Implementer: Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session; the reasoning-effort level is not exposed to the session, so "High" is not attested. Single primary agent, 0 subagents (SINGLE_AGENT). The skill's whole-branch reviewer subagent was not used (AGENTS.md and GOV-AGENT-USAGE outrank it); the self-review below is the author's own.

Branch/worktree: `codex/sfc-14-static-posters` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-14` (the plan's verified fallback; the native tool cannot start at a frozen SHA). Base: `fdde3a48` (`origin/codex/sfc-integration` at the merge of PR #154, which contains Tasks 4 to 13). Disposable checkouts, all removed or restored afterwards: `.worktrees/sfc-14-candidate` (runtime candidate for capture and the runtime spec) and `.worktrees/sfc-14-baseline` (the Task 3 head `7fc2a6c6`, built for the paired measurement). Servers: Playwright's own on 3414 to 3416 and 3514, the capture and measurement scripts on their own ports.

Locks: SFC-POSTERS, SFC-MEASUREMENT and the browser/GPU resource were held by this session (no coordinator lease exists; the requester file is `.worktrees/.sfc-control/requests/task-14.json`, ignored). No measurement overlapped another build or browser run on this machine.

## What now exists

- Six files `public/brand/connected-studio/{studio,founder,contact}-{wide,compact}.webp`, each the live scene's own first frame at zero excitation: wide 1920×1080 at 1×, compact 450×800 at 2× (900×1600 px), label-free, existing cover alignment. The manifest entries are `published`.
- `scripts/capture-connected-studio-posters.mjs`: defaults to the Atlas routes, refuses Services and Projects without `--allow-legacy`, writes to `--out`, stops with the runtime-candidate instruction when the host never mounts, and asserts the pose, the profile, no pointer, no bent string and every node within 0.05 CSS px of its `(u, v)` rest position. `--verify-handoff` compares the drawn first frame with the published poster at six viewports (below).
- `lib/connected-studio/measurement.ts`: `STATIC_ROUTE_BUDGETS`, `judgeStaticRouteCost`, `readBaselineEntry`, `judgePairedStartup`, `findOptionalCodeInCriticalChunks` with engine and host markers, `--routes` validation and a fragment-free journey declaration.
- `scripts/measure-connected-studio-{production,vitals}.mjs`: the Atlas pages in the production and vitals collectors; `--startup-baseline --compare=` against the committed Task 3 report; `--judge-paired=` for interleaved runs; a scan of every requested script for engine or host code.
- Tests: `scripts/connected-studio-media.test.mjs` and `-measurement.test.mjs` (extended), `tests/e2e/connected-studio-static.spec.ts` (18 cases), the new `tests/e2e/sfc-production.spec.ts` and `tests/e2e/visual/sfc-static.visual.spec.ts` with six Windows baselines.

## RED and GREEN

- Media: against no assets and `published: false`, three cases failed for the stated reason (six files missing, flags false) and the capture-script case failed until the script gained its routes. GREEN 16 passed, 1 `todo`.
- Static browser cases: with the manifest temporarily returned to unpublished, all 18 new cases failed (an expected poster request, none received); after publication 18/18 on Chromium and 126/126 on the other seven shared projects. The first multi-engine run hit the default 30 s on a cold Firefox compile with four sequential loads; the two multi-load cases now declare 60 s, nothing else was widened.
- Collectors: ten judge, adapter and option cases failed because the functions did not exist (pure seams, no stub step), then passed. Mutation spot-check of the judge: five mutants (a budget boundary, the spread rule, the new-task boundary, the equal-task case, the static-HTML row), two survived, two boundary cases were added, all five are caught. The paired judge and the host markers were written test-first the same way.
- Production spec: the first run failed 18 cases on `closure.entries` (the shipped host names the engine loader); the cause is the finding below, so that assertion moved to the held case and the rest is GREEN.
- Characterization, no RED: the two poster-handoff projection cases pass because Task 4 built that behavior in; they pin it for the new assets.

## Posters

| File | Bytes | Ceiling | SHA-256 |
| --- | ---: | ---: | --- |
| `studio-wide.webp` | 60,832 | 153,600 | `B725879E19BE7D4E63AB8A326B8485888D51EEBA9FA39F32E239B111D8984D6B` |
| `founder-wide.webp` | 50,886 | 153,600 | `30597FFD921C4E47C0A076BE824DE481D1B08C98768F9E8E25D0F78756C95450` |
| `contact-wide.webp` | 47,038 | 153,600 | `E6842A9BAC2ADA6447A0A94A17CA3FF88A19E34D36F36226DB9ED97F845F7BEC` |
| `studio-compact.webp`, `founder-compact.webp`, `contact-compact.webp` | 39,564 each | 81,920 | `D20C0ED93C684D2FA67BD6282A0385C76DD2441AE7FE7F35F21B33722DEEEC6B` (the same file) |

The three wide images are three different compositions. The three compact images are byte-identical: DESIGN-SFC-V1 gives all three pages one compact composition (eight anchors, ten edges), so a label-free rest scene is the same image (see Rulings). The four legacy posters are unchanged. Services and Projects also share one image pair, which is the existing precedent.

Handoff (`--verify-handoff`, held time on the live first frame, SwiftShader Chromium, DPR 1; the lit pixels of the drawn frame and of the published poster painted by the Ground's own cover crop must lie within 2 CSS px of each other, both directions, at least 90 %): all 18 route and viewport pairs MATCH, 91.3 to 100.0 %; the same poster moved 4 px scores 16.0 to 34.5 %, so the measure sees an offset. Lowest figures: Contact 1024×768 91.3 % and Founder 1024×768 92.6 % (drawn within poster), from downscaling the one-pixel strings; the other direction is 98.4 % or higher everywhere. This is functional evidence from a software renderer, not a hardware frame.

Visual QA by the author (not approval): the Studio and Contact wide posters and the Founder compact poster were viewed; 16/15/8 nodes, the specified edges, Atlas rings and dots, no text, the Abyss ground with the chart points. The Windows ground baselines were generated with `--update-snapshots` once and then passed `--repeat-each=2` unchanged.

| Windows baseline (`sfc-static.visual.spec.ts-snapshots`) | SHA-256 |
| --- | --- |
| `studio-wide-ground-visual-chromium-win32.png` | `D814DAB7B738340DB4E3536C951F4E9ECDBFADC0B1C88F23AFBD462CB5175D2F` |
| `founder-wide-ground-visual-chromium-win32.png` | `1A1083E0D6FE1892E533BA0A3F083E43DFE4C008D53AC01DAB513DCFE6E5ACD2` |
| `contact-wide-ground-visual-chromium-win32.png` | `656A22DE66F0AED02EC204993E3C2D4833A315B07822AF296B2A49F6C69AF445` |
| `studio-compact`, `founder-compact`, `contact-compact` `-ground-visual-chromium-win32.png` | `916220C2D18D517F732758F10F93CD646DC93606536B16270057FC3D364FAF34` (identical) |

Linux images: NOT collected. They must come from the matching CI run's `*-actual.png` at this head after owner approval, as the baseline workflow requires; a missing Linux golden is a baseline-bootstrap failure, not a pass.

## Owner approval and the ten refreshed page baselines (2026-10-18)

The author prepared expected, actual and pixel-diff images of the ten existing page baselines that the posters change, and a contact sheet of the six posters (kept outside Git in the git-ignored `.superpowers/reports/sfc-14/review/`). The owner reviewed them and wrote: "I approve the six posters, the six new Windows ground baselines, and refreshing the ten affected page baselines on Windows. Linux images will come from CI." That approval covers the six poster files, the six Windows ground baselines above and the ten Windows page baselines below, at the implementation head that carries them; it does not cover Linux images, the host finding or the startup-CPU gate.

The ten Windows baselines were regenerated with `node node_modules/@playwright/test/cli.js test studio.visual.spec.ts founder.visual.spec.ts contact.visual.spec.ts --project=visual-chromium --update-snapshots`; the same specs plus `sfc-static.visual.spec.ts` then passed 32/32 with `--repeat-each=2` and no update flag. In every comparison the only difference is the connected-graph poster behind the page; text, plates and layout are unchanged.

| Windows page baseline (owner spec directory) | SHA-256 |
| --- | --- |
| `contact-es-wide` | `8C460F50A32CCAF69E431FD7369CE6D32A0C7E4A17C69078C60AE4463AB607FC` |
| `contact-es-compact` | `7BFA0C32B98359B448C75AEC1F5824171C08464AE7881BDE3ADD725D0C963F2E` |
| `contact-en-wide` | `28B2CCC65D80FE567BD00A19CA5C5A674CEAEC52700612D7D3E2B3A9FDCFAF98` |
| `contact-en-compact` | `C471D9A45934152BBAEDC973197F41985DBE76EA9B4EAE86A7DAB3D6CA399808` |
| `founder-spanish-wide` | `E601319F809A3BE5D0AA05FC7E62870C6558D5ABC05C556A06D093306DBB8BD2` |
| `founder-spanish-compact` | `F7A6F7ABC3F205BA167096021410B1CF140AF0165B5BD49B8B6EC9C817069F8F` |
| `founder-english-wide` | `62CFEBE0779D85AB771D3253F445137A243B401800FE7DE4F411E84BA1BC88F1` |
| `founder-english-compact` | `FB75CC4BF1D430955062578235BF5D56CC0B58B2734FC9AE615AB9007E5629AD` |
| `studio-wide` | `46736C8D3BED6CA194C84FB5C561F436C5815AF2512EC9D313EEA456C8A729B9` |
| `studio-compact` | `A0BA393D06124800CF293E1FA3C7673959AB0A337B8E0EE36A35051049B6E5B9` |

These ten files sit in Task 6, 7 and 10 snapshot directories, outside this packet's list; the Ruling above and the owner's approval authorize exactly these replacements. The matching Linux replacements (ten page images and the six ground images) must come from the CI run at this head: download only the corresponding `*-actual.png`, inspect, commit under the exact Linux name, rerun without update mode.

## Static release cost

Method and environment: Next.js 16.3.2, React 18.2.0, Three.js 0.186.0, Playwright 1.63.0, Chromium 153.0.8010.12 on the named desktop of the Task 3 baseline (i3-8100, RTX 2060, Windows 11); clean root and `/Portfolio` exports; five cold journeys per route, locale and profile; one raw trace per journey (kept in the git-ignored `.superpowers/reports/sfc-14/` of the task checkout, hashes in the report JSON; not committed, as in Task 3). The first-load definition is Task 3's recommendation: Brotli quality 11 of the scripts requested before the load event (critical), plus the scripts the emitted HTML references; the settled figure is reported, not gated (Rulings).

Bytes (PASS): Studio and Founder add **8.8 KiB** of the 12 KiB budget (critical and static HTML, root; 8.9 KiB at `/Portfolio`); Contact adds **−0.3 KiB** of 16 KiB (the Task 13 form chunk is gone); Privacy 0.0 KiB of 2 KiB. Terms does not exist yet, so its comparator is OPEN until Task 16. The optional closure is unchanged at **119.5 KiB** Brotli (0.5 KiB headroom), identical on the four legacy destinations at root and `/Portfolio`; it is a warning, not a failure.

Vitals (PASS, `--routes=studio,founder,contact --journeys=5`, ten journeys per route over both locales, root, static mode): mobile profile LCP p75 2128, 1992 and 1992 ms, INP p75 80, 48 and 72 ms; desktop LCP p75 512, 528 and 528 ms, INP p75 24 ms; layout shift 0.0 whole page and from the enhancement on every route and profile; every journey stayed static with no canvas. Limits 2500 ms, 200 ms and zero.

Startup CPU against the committed Task 3 baseline (root, `--compare`): 2 PASS, 10 OPEN, 4 FAIL of 16 rows (Privacy, unchanged JS, drifted +23 and +43 ms on mobile in the same run, which is why that comparison alone cannot adjudicate; at `/Portfolio` Privacy read −104 ms on mobile). The five-journey p95 against a baseline that varied by up to 178 ms is noise-bound exactly as Task 3 Risk 1 predicted, so the same-session **paired, interleaved** comparison adjudicates (`--judge-paired`, baseline head `7fc2a6c6` against this head, order baseline, current, current, baseline, ten journeys per side, routes Studio, Founder and Contact):

| Profile and route | Median, baseline to current (ms) | p95 added (ms) | Verdict |
| --- | --- | ---: | --- |
| desktop studio es / en | 106.3 to 185.9 / 111.3 to 191.3 | +37.4 / +32.5 | FAIL |
| desktop founder es / en | 104.9 to 190.2 / 114.5 to 187.3 | +49.4 / +30.4 | FAIL |
| desktop contact es / en | 169.5 to 195.7 / 161.2 to 199.9 | +23.4 / +30.2 | OPEN / FAIL |
| mobile studio es / en | 518.0 to 651.8 / 475.4 to 610.0 | +89.2 / +84.9 | FAIL |
| mobile founder es / en | 428.3 to 572.1 / 485.1 to 533.3 | +105.1 / +98.6 | FAIL |
| mobile contact es / en | 520.2 to 619.4 / 526.2 to 622.2 | +107.0 / +85.6 | FAIL |

**11 FAIL, 1 OPEN.** The increase is real and consistent in both rounds. Evaluation CPU (EvaluateScript and compile) is unchanged (about 42 ms desktop, 200 to 225 ms mobile); the growth is in function calls and microtasks, which is hydration and scheduling work. No new task of 50 ms or more appeared on desktop; mobile baselines already had tasks of 430 to 690 ms and the longest tasks did not grow beyond their noise.

### Root cause (systematic debugging, evidence in order)

1. The emitted HTML of Studio, Founder and Contact references `chunks/14b4eqipi2bfn.js` (13.7 KiB Brotli, 42 KB raw) that the baseline pages did not: it is the whole connected host (`ConnectedStudioEnhancement`: session keys `furlanich:connected-studio-*`, the `__FURLANICH_CONNECTED__` diagnostics hook, the controller, the software-renderer test hook). The plan requires "no host hydration in policy-disabled builds; verify emitted requests rather than assume tree shaking".
2. The host is not mounted (the Ground renders it only while a live tier is on), but `ConnectedStudioGround.tsx` imports it statically for its Services and Projects branch, so any page that imports the Ground loads it. Removing only the profile-branch element still left the chunk (10 chunks); removing the import and the legacy use gave 9 chunks and 152 KiB, no host.
3. Paired, interleaved, desktop, current head against that experiment in a disposable checkout (`git checkout` restored, nothing committed): median 195.8 to 102.5, 193.7 to 105.5, 190.8 to 104.3, 182.0 to 101.3, 193.9 to 107.0 and 199.4 to 111.2 ms; six of six PASS, about −90 ms. Confidence high for desktop; mobile was not re-run with the experiment (the desktop result and the mobile baseline gap point the same way).

Assignment: the fix is in `ConnectedStudioGround.tsx` (and a client entry split), outside this packet (host and policy changes are forbidden here); it belongs to a **new packet 20 or later**. RED already exists: `tests/e2e/sfc-production.spec.ts`, case `a policy-disabled Atlas page references no connected host code`, held with `test.fixme`, and the production script fails on it today; the paired judge is its verification. Until it merges, Task 16 must not release these pages, and the static-release gate of this packet stays FAIL.

## Rulings

- Ruling: the compact posters are identical and the plan's "six distinct images" is met only for wide. The binding spec fixes one compact composition for all three pages, so a distinct compact image would be fabricated and would not match the live first frame. The media contract asserts that images are identical exactly when their compositions are. Cost if wrong: the owner wants a visible difference and amends the spec.
- Ruling: Contact is captured as the scene is drawn today. DESIGN-SFC-V1 says Contact multiplies scene and label opacity by 0.35; no host or runtime applies it (checked; Task 8 left it host-owned, Task 11 did not add it). That is a finding for a packet 20 or later; when it lands both Contact posters must be recaptured so the first live paint still matches (a `node:test` `todo` holds it). Cost if wrong: the Contact poster is brighter than the quiet target until recaptured.
- Ruling: publication changes ten existing baselines owned by Tasks 6, 7 and 10 (Studio and Founder compact and wide, Contact both languages and sizes): each failed because it paints the page over the new poster. After the owner's explicit approval they were regenerated here on Windows (section above); the Linux images are still required from CI. Cost if wrong: revert ten files; integration CI stays red on the ten Linux images until they are adopted.
- Ruling: two existing assertions that encoded "not yet published" were edited, one line each, outside the listed paths because publication makes them false: `scripts/sfc-contracts.test.mjs` (the Task 2 entries are now `published`) and `tests/e2e/studio.spec.ts` (exactly the Studio wide poster is requested). Cost if wrong: revert two assertions.
- Ruling: the first-load JS gate is the critical figure and the static-HTML figure, each against its own budget; the settled-window figure moves with timing and is reported only (Task 3 Risk 2, whose definition this packet owns). The CPU gate is the Task 3 comparison with a spread rule (beyond 25 ms but inside the baseline's own journey spread is OPEN, beyond both is FAIL) and, where that is OPEN or FAIL, the paired interleaved comparison with median and p95 both over 25 ms as FAIL and one as OPEN (Risk 1). Cost if wrong: one function and its tests.
- Ruling: a long task counts as added only when the baseline had none of 50 ms or more; against a baseline that already had one a longer task is OPEN. Cost if wrong: the same function.
- Ruling: a script that is not critical may be another route's prefetch; only critical scripts carrying engine or host code fail a page's own load, the rest is a note. Cost if wrong: a prefetched host chunk goes unflagged on a page that links to a connected page.
- Ruling: the paired comparison was run at the root export only; `/Portfolio` has identical emitted JS apart from the prefix, and its Task 3 comparison, production script and spec runs are recorded below. Cost if wrong: a base-path-only difference would be missed.
- Ruling: the host-code case is held with `test.fixme` and a named owner (the Task 12 precedent) rather than failing default CI for a defect outside this packet; the production and vitals scripts fail honestly. Cost if wrong: CI stays green while the release gate is open; Task 16 must read this receipt.
- Ruling: the shared-project static cases are three per page (18 in all) to stay inside the 3200-case envelope; the list is 2917 before this packet and is re-counted below. Per-engine behavior is owned by the served-export family.
- Ruling: no `sfc-accessibility.spec.ts` was created (Task 12's reason: its name matches the unanchored default accessibility pattern); posters are decorative and `aria-hidden`.
- Ruling: raw traces and compact reports stay outside Git (the Task 3 directory needed an explicit owner instruction; Task 14's write set lists no such directory). The figures above are the record. Cost if wrong: the reports are lost with the machine; the commands below reproduce them.
- Ruling: `ARCHITECTURE.md`, the testing guides and the acceptance `index.md` were not edited (not in this write set). Cost if wrong: they do not yet describe the poster handoff check or the paired judge.

## Findings outside this packet (for the planning authority)

- OPEN, packet 20 or later, **the host ships in every Atlas page** (above): about 13.7 KiB Brotli, +27 to +144 ms startup CPU (median, paired). RED held in `sfc-production.spec.ts`.
- OPEN, packet 20 or later, **Contact's 0.35 scene opacity is not implemented**; recapture both Contact posters with it.
- Carried, not mine: five stale candidate-runtime cases (Validation); Task 12's Contact word-binding and Pause-clip findings; `contact.spec.ts` `native direct channels replace form intake` fails on the Windows dev server on the untouched integration head (reproduced in the clean candidate checkout) while Task 13 verified it on the served export; I did not change it.

## Validation (fresh, 2026-10-18, `.worktrees/sfc-14`)

- `npm run validate` on `7175c075` (the later commits change a collector's reporting and one assertion): exit 0; docs:check 348 Markdown files, 121 document IDs, 38 Skills; `npm test` 849 tests, 848 pass, 1 `todo`, 0 fail (828 at the base); lint 0 errors, 282 warnings (the baseline); typecheck pass; build pass.
- Root: `verify:static-export` 14 routes; served export `connected-production-chromium` and `sfc-production-{chromium,firefox,webkit}`: 71 passed, 3 skipped (the held case in three engines). `/Portfolio`: `verify:static-export` 14 routes, the same two families 71 passed, 3 skipped.
- Production script: bytes, closure and posters pass; it FAILS on shipped host code in all six pages at root and `/Portfolio` (the finding).
- Dev server regression after publication: `chromium-desktop` studio, founder, legal, privacy and the static spec 122/122; `compact-320-chromium` and `mobile-chromium` static, studio-responsive and founder-responsive 188 passed, 14 skipped; the only red is the carried Contact case above.
- Candidate runtime spec (`SFC_TEST_MODE=candidate`, runtime patch applied in the disposable checkout at `a764edc4`, `sfc-runtime-chromium`, one worker, 14.5 minutes): 63 passed, 3 skipped (the held cases of Task 12), 5 failed. The same five fail on the untouched integration head `fdde3a48` (run separately in the same checkout), so they are not caused by the posters: three `contact form signal` cases and two `direct Contact with the live graph (Task 13)` cases target the removed form or the removed intake plate; Task 13 noted that the candidate runtime was not rerun after its change. They belong to the owner of `sfc-runtime.spec.ts` (Task 18 in the plan's appendix) or a packet 20 or later, and are carried, not hidden.
- Visual: after the approved refresh, `studio`, `founder`, `contact` and `sfc-static` visual specs 32/32 on `--repeat-each=2` (Windows).
- Case counts (`playwright test --list`): default 3067 tests in 37 files (2917 before this packet; envelope 3200), candidate 90 in 2 files (envelope 180), served export 74 in 2 files.

Reproduce: `node scripts/measure-connected-studio-production.mjs --skip-build`; `node scripts/measure-connected-studio-vitals.mjs --skip-build --startup-baseline --compare=<task-03-artifacts>/startup-root.json --compare-production=<task-03-artifacts>/production-root.json`; paired: run the vitals script with `--startup-baseline --routes=studio,founder,contact --profile=<p> --out=<dir>/{base,cur}-<p>-<round>.json` from each head's own export in the order base, cur, cur, base, then `--judge-paired=<dir>`; capture: apply `prepare-sfc-candidate.mjs apply --kind=runtime` in a disposable checkout and run the capture script with `--out`; handoff: the same with `--verify-handoff`.

## Skills audits (inline, degraded run: no subagent producers)

- Impeccable optimize: the measured cost drove the root-cause work; the fix is named, not guessed (host import split), with a paired before and after from the experiment.
- Systematic debugging: reproduction (paired runs), hypothesis (host chunk), disambiguating trace (chunk list, then the experiment), root cause with confidence, targeted RED (held case) and verification (paired judge).
- Playwright and visual-qa: behavior (requests, fallbacks, no-JS) is separate from rendered judgment (the poster images and baselines); no animated pixel golden.

## Open items

- Owner approval of the posters and the Windows baselines: GIVEN (above). The Linux images of all sixteen baselines from CI at the same head: PENDING.
- Reviewer R (separate session), CI and the human merge: PENDING. Reviewer R should re-run `node scripts/capture-connected-studio-posters.mjs --verify-handoff` in a disposable runtime candidate.
- Packet 20 or later for the host import split and for Contact's opacity; Task 16 is blocked on the first.
- Terms comparator, hardware, screen readers, Safari and Firefox startup timing: OPEN (not measured here).
- Mutation spot-checks were run for the cost judge only, not for the capture script.
