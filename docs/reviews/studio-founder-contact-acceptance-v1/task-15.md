# Task 15 / PR 15 — Qualify graph tiers on actual hardware independently

**Status: the qualification tooling is implemented and tested; no tier has been qualified. Wide and compact are both OPEN.** The collector now drives all five connected route pairs in both locales and writes one run report per route, locale and tier; a pure judge decides whether a run counts and what each row says; `--qualify` adds the runs up and exits 0 only for a PASS tier; a protocol document says how an operator collects the evidence. No qualifying run was collected in this session: the owner's desktop was running a game (V Rising and its server, CPU 68 to 87 % busy and the GPU 41 to 52 % in use by something else), and there is no Android phone attached. The seven smoke runs that were made are INVALID by the collector's rules, so there is no PASS, no FAIL and no figure to report for either tier. Nothing was deployed, no flag or policy changed (`CONNECTED_LIVE_POLICY` stays `{ wide: false, compact: false }`), and no product code was touched.

Implementer: Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session; the reasoning-effort level is not exposed to the session, so "High" is not attested. Single primary agent, 0 subagents (SINGLE_AGENT). The skill's whole-branch reviewer subagent was not used (AGENTS.md and GOV-AGENT-USAGE outrank it); the self-review below is the author's own. Reviewer R reviewed `ff800127` on [PR #156](https://github.com/Furlanich/Portfolio/pull/156) and left seven findings (two P2 standards, two P1 and three more spec findings, one more P2), all validated by reproduction and corrected (section below). Reviewer R's re-review of the corrected head, the named device operator and the owner's acceptance are PENDING.

Branch/worktree: `codex/sfc-15-hardware-qualification` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-15` (the plan's verified fallback, 46 characters). Base: `5d0b3a70` (`origin/codex/sfc-integration` at the merge of PR #155, which contains Tasks 4 to 14). Disposable runtime candidate `.worktrees/sfc-15-candidate` at the same head with `prepare-sfc-candidate.mjs apply --kind=runtime` (patch SHA-256 `bf00647e72162c43a79c1bd09ae7816c13797465d50fe669608b3886ef6ab7aa`), root export; restored and removed afterwards.

Locks: SFC-MEASUREMENT and SFC-BROWSER-GPU were held by this session (no coordinator lease exists; the requester file is `.worktrees/.sfc-control/requests/task-15.json`, ignored). The machine was not quiet, which is exactly what the new guard reports.

## What now exists

- `scripts/measure-connected-studio-hardware.mjs`, made importable (the browser protocol runs only when it is the entry point) and extended:
  - **Pure layer** (exported, unit-tested): `HARDWARE_ROUTES` (the five pairs, pathnames taken from `lib/site-routes.ts`, Pause slots `connected-pause-<route>`), `PROTOCOL_MINIMA`, `REQUIRED_VALID_RUNS = 3`, `QUIESCENCE_LIMITS`, `validateDeviceRecord`, `classifyRun`, `judgeRun`, `buildDossier`, and the `--qualify=<dir>` command.
  - **Browser protocol**, one run per route, locale, tier and device: vitals from the first byte (LCP, enhancement-attributed layout shift with the existing `attributeShifts`, event timing), a few real interactions, visible idle (an Atlas page must be asleep: the `restDraws` row), scroll traversals and, on the wide tier, pointer passes with a still tail, the page-only control, Pause and Resume, a hidden attempt, Footer, five route cycles through Footer links plus one locale switch, a sustained window, the optional closure at Brotli quality 11 cross-checked against what the cold load fetched, and a before/after machine-load sample. `--extras` keeps the Task 9 viewport-zoom and accessibility-tree checks. `--connect-cdp` drives an Android Chrome over `adb`.
  - The earlier thirteen-row `judgeHardware` is reused unchanged for the shared rows; `lib/connected-studio/measurement.ts` is not touched.
- `scripts/measure-connected-studio-hardware.test.mjs`: 72 cases (see RED and GREEN).
- `docs/reviews/studio-founder-contact-acceptance-v1/hardware-protocol.md`: the operator protocol, rows and limits, the Android path, what it cannot claim, and the systematic-debugging route.

## RED and GREEN

- First slice: the script was made importable and given compiling stubs, so the RED is a behavior RED. Against the stubs 48 of 49 cases failed on their stated assertion (route table empty, every invalid run reported valid, every row a pass, the dossier always PASS, `--qualify` absent); one characterization case (a clean run is valid) passed trivially and stays as a guard. GREEN 49/49.
- Three more rows (`labelViolations`, `resumeFailures`, `routeCycleFailures`): the test data gained the metrics first; 4 failures (three limit cases and "an unmeasured metric is OPEN" iterating a metric the judge did not know), then GREEN 52/52.
- Quiescence: after a setup error from the missing export (not counted as a RED) the constant was added as a seam; 4 cases then failed on their assertions (busy before, busy after, GPU in use, no load record), and GREEN is 57/57.
- Mutation spot-check of the pure layer (the file restored byte-for-byte each time): seven mutants were all caught. They were: the FAIL clause of the pair rule removed, the three-run threshold lowered to two, the software-renderer test disabled, the observer requirement removed, the Atlas rest row removed, the device-kind rule removed, and the OPEN rule of the pair removed. The browser protocol itself has no unit test; it was exercised by the smoke runs below.

## Reviewer R findings on PR #156 (reviewed `ff800127`; each reproduced against the code before any change, each with failing cases first)

All seven were confirmed by reading the code and by the reviewer's own fixture reproductions. RED: 16 of 72 cases failed on their stated assertion (the three hidden/footer callback cases had already failed when the fixtures gained the new rows); GREEN 72/72. Mutation spot-check of the fixes: eight mutants (post-run GPU, the diagnostic flag, the diagnostic method line, the cohort split, conflicting run ids, the same start time, the Android user agent, the rest-callback rows) are all caught; the first attempt at the method-line mutant did not apply and was redone by line number.

- **R1 [P2] post-run GPU load.** `classifyRun` now rejects a run whose GPU utilization after the run exceeds 30 %, at the boundary (exactly 30 % is quiet enough) and beyond; an unqueryable GPU stays allowed.
- **R2 [P2] diagnostics.** A run records `protocol.diagnostic` and its reasons (`--trace-pipeline`, `--frames-out`, `--no-gpu-timers`, `--diagnostic`, parsed by the pure `diagnosticReasons`); `classifyRun` rejects anything not declared `diagnostic: false`, and also a method line that names one of those options. The report is retained. The CLI-to-report path is covered through the pure parser the collector uses; no browser run is part of the unit suite.
- **R3 [P1] cohorts.** `buildDossier` adds runs only inside one cohort: head, candidate patch SHA-256, base path and device name. Several cohorts without a choice give an OPEN dossier with `needsCohort`, the cohort list and no aggregation; `--head`, `--patch`, `--base-path` and `--device-name` choose one, a single cohort is adopted, and the dossier names the cohort (with the device's OS, GPU and browser) and lists excluded runs. Older failing data no longer poisons a repaired head, and older passing data no longer qualifies a changed one.
- **R4 [P2] duplicates.** A run id is required and valid start time is required; identical copies keep one, reports that share a run id but differ are all rejected, and two runs in a cohort cannot start at the same instant. Copying a file three times through `--qualify` yields one valid run.
- **R5 [P1] Android provenance.** The report keeps the target's user agent, platform and touch points; a compact run is valid only when `--connect-cdp` drove an Android user agent with touch points, and a wide run is invalid for an Android target. `validateCollectionOptions` refuses a compact collection without `--connect-cdp` unless it is a `--diagnostic`, and a wide collection with it. The device record is no longer trusted alone.
- **R6 [P1] reaching the export from the phone.** `--connect-cdp` now requires `--serve-port`; the protocol documents `adb reverse` for that port (and the removal commands), and the first navigation is a reachability check (`reachabilityProblem`: connection error, non-200, or a page without `/_next/`) that stops a run immediately instead of twelve minutes in. Source-path only: no phone was available to exercise it.
- **R7 [P2] callbacks.** New rows: `hiddenRafCalls` and `footerRafCalls` for every page, and for Atlas pages `restRafCalls`, `settledTailDraws` and `settledTailRafCalls` (a 3 s window five seconds after the last input, after the pointer pass or the scroll). The page log now timestamps animation-frame calls so the hidden window can be counted. Absent evidence is OPEN. A loop that schedules without drawing now fails.

Browser regression check of these changes: one short smoke run (Contact/en, wide, headless, 40 s idle) against a rebuilt candidate: the reachability check passed, the remote record was kept, the rest window, the settled tail and the Footer measured zero draws and zero callbacks, hidden stayed OPEN, and no failure or finding appeared; the run is INVALID for its short windows and a busy machine (CPU 40 % before, 62 % after, GPU 39 %), as expected. SHA-256 `2c0d17de…`. The candidate was restored and removed again.

## Smoke runs on the owner's desktop (evidence of the collector, not of a tier)

Machine: Intel Core i3-8100 (4 cores, 3.6 GHz), 24 GB, NVIDIA GeForce RTX 2060 (driver 32.0.16.1088), Windows 11 Pro 10.0.26300, 60 Hz, Chromium 153.0.8010.12 through ANGLE/Direct3D 11 (hardware; `EXT_disjoint_timer_query_webgl2` available, no disjoint rejections). The same named desktop as Tasks 3 and 9. Windows reduced for the smoke runs: idle 10 s, one traversal, sustained 20 s, one route cycle. Raw reports stay in the git-ignored `.superpowers/hardware/smoke/` of the task checkout (not committed: the write set lists no raw-artifact directory; hashes below).

| Run | Route / locale | Mode | SHA-256 (first 16) | Result |
| --- | --- | --- | --- | --- |
| `smoke-studio-es` | studio / es | headed | `37949b11…` | INVALID: windows shorter than the protocol; engine marker matched the host in a critical chunk (collector bug, fixed); `maxContexts` 2 (the probe's own context, fixed) |
| `smoke2-studio-es` | studio / es | headed | `ff31a546…` | INVALID: windows shorter than the protocol |
| `smoke3-services-en`, `-contact-es`, `-founder-en`, `-projects-es` | the other four | headless | `a9c132f4…`, `794ab2df…`, `b803b096…`, `784deaba…` | INVALID: windows shorter than the protocol |
| `smoke4-studio-es` | studio / es | headless | `d37f7da3…` | INVALID: **CPU 79 % busy before and 73 % after, GPU 41 % in use by another program**, plus the short windows |

The first six predate the quiescence guard and would also be invalid under it. What they do show about the collector:

- All five route pairs go live by themselves on hardware, with exactly one canvas, a Pause control found in `connected-pause-<route>` and a client-side route cycle through Footer links and back that returns a live scene (0 hard navigations, 0 listener growth, contexts alive 1). The locale switch comes up live in the other language with one canvas.
- Atlas pages sleep: Studio drew once in a 10 s idle and 0 times in the rest window; paused draws and animation-frame callbacks 0; Footer draws 0; layout shift from the enhancement 0 with the observer running; LCP 740 to 812 ms; the optional closure for Studio is 119.49 KiB Brotli (two chunks), the same 119.5 KiB as the Task 14 report.
- The timing figures are **not evidence** and are not reported as a verdict: on this loaded machine the active frame-interval p95 read 17.7 ms in one Studio run and 31.5 ms in another, 32 to 35 ms on Founder, Services and Projects, and 84 ms on Contact with LCP 3.5 s, while the page-only control stayed at 16.8 ms. That is the pattern the guard exists to refuse, and it matches the sensitivity Task 3 recorded for this tail (isolated skipped refreshes with no render CPU or GPU cause).

## Qualification state

| Tier | Device | Valid runs | Verdict |
| --- | --- | --- | --- |
| Wide (desktop) | owner desktop above | 0 of the 30 needed (five routes, two locales, three each) | **OPEN** |
| Compact (constrained Android) | none attached | 0 | **OPEN** |

Why OPEN, in order: a quiet machine is a precondition and the desktop was running a game (stopping the owner's game was not mine to do); no Android phone was available; and the hidden-tab row cannot be reached by automation (below), so even a quiet desktop run leaves `hiddenDraws` OPEN until a real hidden window is measured by a human with DevTools, as the protocol says. Task 18's gate (a qualified tier) is therefore unmet, and Task 16 is unaffected: it never depends on this verdict.

## Systematic debugging

No valid run exists, so there is no failure to attribute and nothing was repaired. The checkbox is met by the machinery, not by a finding: `lateFrames` attributes each late interval to render CPU, GPU, or neither; `pageOnlyControl` separates the page's own cost; `--frames-out` and `--trace-pipeline` keep the frames and a Chromium trace; the protocol's section 8 routes a real failure through the [Task 3 method](risk-baseline.md) (H1 to H7). The smoke runs' late frames were all in the third class (scheduler or presentation: 47 of 47 in the first Studio run, 8 of 8 in the second), the same class Task 3 left open; that observation is from invalid runs and proves nothing beyond consistency.

## Rulings

- Ruling: the plan's "form focus/busy" step is recorded as **not applicable**, listed in every run's judgement and in the dossier, and no row stands in for it. Task 13 (owner decision of 2026-10-18, ADR-CONTACT-DIRECT-CHANNELS) removed the form; there is nothing to focus or submit. Cost if wrong: a form returns and a row must be added.
- Ruling: "measurement fixtures only" is read as the collector's own test file `scripts/measure-connected-studio-hardware.test.mjs`, whose builders are the fixtures. The script had to become importable to be tested; the pure layer lives in the script because `lib/connected-studio/measurement.ts` belongs to Task 14. Cost if wrong: move the pure layer and its test to a shared module in a packet that owns one.
- Ruling: a run counts only if it meets the protocol minima, the machine was quiet before and after (CPU ≤ 30 %, GPU ≤ 30 % when `nvidia-smi` answers), and the other validity rules hold; a smaller run is a recorded smoke run. A pair needs three valid runs, any valid FAIL fails the pair, and a valid OPEN row keeps it OPEN. The plan says "at least three valid active runs" and "all other heavy work stopped"; the 30 % threshold and the all-valid-runs-must-pass reading are mine, following Task 9's "two of four passing is not a pass". Cost if wrong: one constant or one aggregation rule and its tests.
- Ruling: the hidden checkpoint stays OPEN. Playwright-driven Chromium kept `document.visibilityState` visible under five launch styles (default, backgrounding switches removed, focus emulation off, all default arguments dropped, a plain process attached over CDP), so no run can measure hidden draws automatically; Task 9 reached the same dead end and used an owner attestation, which this packet does not invent. Cost if wrong: a way to hide a page that I missed, or an owner attestation recorded later.
- Ruling: layout shift is read as the first-load enhancement shift (before any route change) and the zero gate compares the unrounded sum, the same attribution as the vitals script; shifts during route cycles are not gated. LCP and the worst interaction come from the same first load. Cost if wrong: one extra row for route-change shift.
- Ruling: `restDraws` (zero draws in the settled window) applies to Atlas pages only; Services and Projects keep their ambient cadence row. For an Atlas page a measured ambient of zero is a measurement because the draw counter ran; it is not OPEN. Cost if wrong: a pair-specific row.
- Ruling: the closure check fails the run only for engine markers in a critical chunk or closure chunks the cold load never fetched. The connected host is expected in a live candidate's critical chunks (it is Task 14's separate finding for policy-disabled builds) and other routes' prefetched scripts are reported, not failed, as in Task 14. Cost if wrong: a prefetched engine chunk goes unflagged.
- Ruling (review): a cohort is the head, patch hash, base path and device name; the browser version, GPU driver and OS are recorded in the dossier but do not split cohorts, so a browser update mid-collection does not silently discard runs (it is visible in the run reports). Cost if wrong: add a field to the cohort key.
- Ruling (review): a run that shares a start time with an earlier run in its cohort is rejected as a duplicate, since one device cannot start two collections at the same instant; fixtures use distinct times. Cost if wrong: one rule.
- Ruling (review): the Android checks require an Android user agent and touch points, not a core count or memory size. "Constrained" is the owner's choice of device, named in the device record, and no measurable definition exists in the plan; inventing a threshold would be a product decision. Cost if wrong: add a threshold once the owner states one.
- Ruling: the raw smoke reports are not committed (the write set has no artifact directory, as in Tasks 3 and 14); their hashes are above. Cost if wrong: the reports are lost with the checkout.
- Ruling: `docs/testing/playwright.md` still describes the hardware script as Services/Projects-only; it is outside this write set and was not edited. Cost if wrong: a stale sentence until Task 19.

## Findings outside this packet

- **The desktop must be quiet for any qualifying run** (a game and its server were running). Collecting is an owner or operator action on a free machine: about six hours for the 30 wide-tier runs, a restarted machine with nothing else open, the charger and a fixed power plan.
- **The Android path has never run on a phone.** `--connect-cdp` is written to the same protocol and is itself unverified; the first real run tests the code. An iPhone and Safari are outside this plan's Task 15 and stay unclaimed.
- **`hiddenDraws` needs a human measurement** (DevTools Performance on a normally launched browser, tab hidden for 10 s) recorded by the owner; until then no tier can reach PASS.
- Carried from earlier receipts, not mine: the host shipped in every Atlas page and Contact's 0.35 scene opacity (Task 14, packet 20 or later), five stale candidate-runtime cases, and the Task 12 Contact word-binding and Pause-clip findings.

## Validation

Fresh, 2026-10-18, `.worktrees/sfc-15` after `npm ci`:

- `npm run validate`: exit 0. docs:check 351 Markdown files, 121 document IDs, 38 Skills; `npm test` 914 tests, 913 pass, 1 `todo` (the Task 14 Contact-opacity placeholder), 0 fail (857 at the base, plus this packet's 57) at the first review head; after the Reviewer R corrections 929 tests, 928 pass, 1 `todo`, 0 fail (this packet's 72), same lint and docs figures, exit 0; lint 0 errors, 282 warnings (the baseline); typecheck pass; build pass. A last two-line change to the collector (long-task zeros only where the API exists, and the tidy of one helper) was followed by the 57 cases (57/57) and ESLint on the file; the full validate was then re-run on the final head and gave the same result (exit 0, 914 tests, 913 pass, 1 todo, 0 fail; lint 0 errors, 282 warnings).
- `node --test scripts/measure-connected-studio-hardware.test.mjs`: 72/72 (57/57 before the review corrections).
- Browser protocol: smoke only (section above). The `/Portfolio` subpath export, Firefox, the Android path and the full-length windows were not run.
- No browser spec, visual baseline, export or product file changed, so the served-export, Playwright and visual families were not re-run; the diff touches the collector, its test and two documents only.

## Skills audits (inline, degraded run: no subagent producers)

- Impeccable optimize: no cost was optimized; the collector attributes cost to render CPU, GPU, or scheduling/presentation and the page itself, which is the question that skill asks, and records `lateFrames`, the page-only control and the closure in Brotli bytes.
- Systematic debugging: see above; no valid failure, so no causal claim.
- Verification before completion: the figures above come from commands run in this session; every claim of a tier's state is OPEN because the evidence does not exist.

## Open items

- Both tiers OPEN. Collection needs a quiet desktop (owner) and a constrained Android phone with its operator. Reviewer R and the named operator's or owner's acceptance are PENDING.
- A first real Android run, a human hidden-tab measurement, and screen-reader checks (NVDA, VoiceOver, Narrator) remain the owner's.
- The mutation spot-check covers the pure layer, not the browser protocol, and the browser protocol was run only in short smoke form.
