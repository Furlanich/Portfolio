# Task 15 / PR 15 — Qualify graph tiers on actual hardware independently

**Status: wide tier PASS by owner acceptance on 2026-10-19 (the hardware collection was waived; not a measured qualification, see [the record](#owner-acceptance-of-the-wide-tier-2026-10-19)); compact OPEN.** *Original status: the qualification tooling is implemented and tested; no tier has been qualified. Wide and compact are both OPEN.* *Update 2026-10-19 ([wide-tier preparation](#wide-tier-preparation-on-released-main-2026-10-19)): the hidden checkpoint is now measured automatically on a desktop, the collector accepts the released runtime candidate, and `--batch` collects the wide tier unattended. The Contact layout shift it found was repaired by Task 20, and traversals now use a smooth scroll gesture. Decorative labels overlapping reading masks during scroll were repaired by Task 21.* The collector now drives all five connected route pairs in both locales and writes one run report per route, locale and tier; a pure judge decides whether a run counts and what each row says; `--qualify` adds the runs up and exits 0 only for a PASS tier; a protocol document says how an operator collects the evidence. No qualifying run was collected in this session: the owner's desktop was running a game (V Rising and its server, CPU 68 to 87 % busy and the GPU 41 to 52 % in use by something else), and there is no Android phone attached. The seven smoke runs that were made are INVALID by the collector's rules, so there is no PASS, no FAIL and no figure to report for either tier. Nothing was deployed, no flag or policy changed (`CONNECTED_LIVE_POLICY` stays `{ wide: false, compact: false }`), and no product code was touched.

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

*2026-10-19: the wide tier is PASS by owner acceptance with the collection waived ([record](#owner-acceptance-of-the-wide-tier-2026-10-19)). The table above is the measured state and is unchanged: 0 valid runs.*

Why OPEN, in order: a quiet machine is a precondition and the desktop was running a game (stopping the owner's game was not mine to do); no Android phone was available; and the hidden-tab row cannot be reached by automation (below), so even a quiet desktop run leaves `hiddenDraws` OPEN until a real hidden window is measured by a human with DevTools, as the protocol says. Task 18's gate (a qualified tier) is therefore unmet, and Task 16 is unaffected: it never depends on this verdict.

## Systematic debugging

No valid run exists, so there is no failure to attribute and nothing was repaired. The checkbox is met by the machinery, not by a finding: `lateFrames` attributes each late interval to render CPU, GPU, or neither; `pageOnlyControl` separates the page's own cost; `--frames-out` and `--trace-pipeline` keep the frames and a Chromium trace; the protocol's section 8 routes a real failure through the [Task 3 method](risk-baseline.md) (H1 to H7). The smoke runs' late frames were all in the third class (scheduler or presentation: 47 of 47 in the first Studio run, 8 of 8 in the second), the same class Task 3 left open; that observation is from invalid runs and proves nothing beyond consistency.

## Rulings

- Ruling: the plan's "form focus/busy" step is recorded as **not applicable**, listed in every run's judgement and in the dossier, and no row stands in for it. Task 13 (owner decision of 2026-10-18, ADR-CONTACT-DIRECT-CHANNELS) removed the form; there is nothing to focus or submit. Cost if wrong: a form returns and a row must be added.
- Ruling: "measurement fixtures only" is read as the collector's own test file `scripts/measure-connected-studio-hardware.test.mjs`, whose builders are the fixtures. The script had to become importable to be tested; the pure layer lives in the script because `lib/connected-studio/measurement.ts` belongs to Task 14. Cost if wrong: move the pure layer and its test to a shared module in a packet that owns one.
- Ruling: a run counts only if it meets the protocol minima, the machine was quiet before and after (CPU ≤ 30 %, GPU ≤ 30 % when `nvidia-smi` answers), and the other validity rules hold; a smaller run is a recorded smoke run. A pair needs three valid runs, any valid FAIL fails the pair, and a valid OPEN row keeps it OPEN. The plan says "at least three valid active runs" and "all other heavy work stopped"; the 30 % threshold and the all-valid-runs-must-pass reading are mine, following Task 9's "two of four passing is not a pass". Cost if wrong: one constant or one aggregation rule and its tests.
- Ruling (superseded on 2026-10-19, see [the wide-tier preparation](#wide-tier-preparation-on-released-main-2026-10-19)): the hidden checkpoint stays OPEN. Playwright-driven Chromium kept `document.visibilityState` visible under five launch styles (default, backgrounding switches removed, focus emulation off, all default arguments dropped, a plain process attached over CDP), so no run can measure hidden draws automatically; Task 9 reached the same dead end and used an owner attestation, which this packet does not invent. Cost if wrong: a way to hide a page that I missed, or an owner attestation recorded later.
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
- **`hiddenDraws` needs a human measurement** (DevTools Performance on a normally launched browser, tab hidden for 10 s) recorded by the owner; until then no tier can reach PASS. *Superseded on 2026-10-19: the desktop checkpoint is now measured automatically (below).*
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

## Wide-tier preparation on released main (2026-10-19)

Owner directive (2026-10-19, in chat): pursue the wide tier first and prepare a separate `codex/` branch that resolves the Task 15 issues blocking a wide qualification, to be merged by PR once they are solved. Task 18 had stopped on its dependency: no tier had a Task 15 PASS.

Implementer: Claude Opus 5.5 (`claude-opus-5-5`; the session began on Sonnet 5.5 and the owner switched the model before this work), Claude Code desktop session, single primary agent, 0 subagents. Branch `codex/sfc-15-wide-qualification` at `.worktrees/sfc-15w`, from released `main` at `84c5c98a` (the merge of PR #158, which contains Tasks 1 to 17). Disposable runtime candidate `.worktrees/sfc-15w-candidate` detached at the same head with `prepare-sfc-candidate.mjs apply --kind=runtime` (patch SHA-256 `336853b2950a8e9223b8dff8e40d8950883cab77ba91729c0c8d1c86d621db33`), root export. The collector runs from the branch checkout with the candidate as its working directory, so the cohort head is the released build itself and this branch changes tooling and documents only.

### What was blocking a wide PASS, and what changed

1. **The hidden rows could never be measured (cause found and repaired).** Playwright sends `Emulation.setFocusEmulationEnabled` to every page it creates, which holds the tab visible; it skips this only for the default context of a browser attached with `noDefaults`. A focused prototype on the owner's desktop showed it: under Playwright's launch a minimized page logged no `visibilitychange` and ran 242 animation frames in 4 s; the same executable started plainly and attached with `noDefaults` reported `hidden` when minimized (1 frame) and behind a second tab (0 frames). Task 15's attempts failed because the plain process was attached without `noDefaults`, and disabling the emulation from a second CDP session does not release the first session's hold. The automatic checkpoint now runs after the measurement browser closes, in that plain browser, behind a real second tab for 10 s (`plainChromiumArguments`, `measureHiddenWindow`, `hiddenRows`). The rows count only over a window of at least 4 s on a scene that drew in the second before it hid, so an already-still Atlas scene cannot supply a zero. In `--hidden=manual` the collector now keeps the scene moving until the operator hides it.
2. **The collector refused every run at released main (found and repaired).** Task 16 (`1190a0b0`) made the live-policy patch also attach the live host through `atlas-live-host.tsx`, so a runtime candidate changes two files; the collector still demanded exactly `capability.ts`. It now accepts exactly the files named by the patch the candidate applied, read back from `tests/fixtures/sfc/` and matched to the SHA-256 recorded at apply time (`patchedFiles`, `candidateDiffProblem`).
3. **Thirty twelve-minute runs needed an attended operator.** `--batch=<runs-dir>` collects the wide tier one run at a time at the protocol minima, waits for a quiet machine before each run (stopping without spending an attempt if it stays busy), never recollects a pair with a valid failure, retries invalid runs up to a bound, resumes from the directory, and ends with the cohort's dossier (`planBatch` counts through `buildDossier`, so the batch and `--qualify` cannot disagree). See [protocol section 5a](hardware-protocol.md#5a-collecting-the-wide-tier-unattended).
4. **A quiet desktop remains the owner's precondition.** During this session the desktop ran AnyDesk, VS Code, ChatGPT, Discord, Edge and this session (CPU 31 to 36 %, GPU 30 %), so no run here can be valid.

TDD: the new pure layer started from compiling stubs; 11 of 83 cases failed on their stated assertions, then GREEN 83/83. The candidate-diff rule followed the same way (1 failing case, then 85/85). Mutation spot-check, the file restored after each: the drawing-before-hidden rule, the 4 s window, the failed-pair stop, the fewest-first ordering and the 100 ms in-flight grace were all caught. `used.length + 1` for the next run id first survived, so a gap case was added and it is now caught. A runtime self-check of the plain arguments survived because it was dead code, and was removed (the test pins the arguments).

### Smoke runs at released main (evidence of the tooling, not of a tier)

Device record: owner desktop, Intel Core i3-8100 (4 cores), 24 GB, NVIDIA GeForce RTX 2060 driver 32.0.16.1088 (NVIDIA 610.88), Windows 11 Pro 10.0.26300, 60 Hz, Chromium 153.0.8010.12, ANGLE Direct3D 11 (hardware). Reduced windows (idle 10 s, one traversal, sustained 10 s, one route cycle). Raw reports are kept outside Git in `.worktrees/sfc-15w-evidence/` (git-ignored), as in the first Task 15 smoke runs.

| Run | Route / locale | SHA-256 (first 16) | Result |
| --- | --- | --- | --- |
| `smoke-contact-en-1` | contact / en | `0db5bf7b12cc1ba7…` | INVALID (short windows; CPU 31 % before, 88 % after). The hidden phase ran, but removing its profile threw `EPERM` inside `finally` and replaced the result; repaired (cleanup waits for the browser to exit and never throws). |
| `smoke-contact-en-2` | contact / en | `7482b49a049ed32d…` | INVALID (short windows; CPU 36 % before, 40 % after). **Hidden measured:** a 9.99 s hidden window, 54 draws in the second before it, **0 draws and 0 animation-frame callbacks while hidden**. |

`--batch` start-up was exercised on the same busy machine with `--quiet-wait-minutes=0.2`: it accepted the two-file candidate, planned `wide-studio-es-1`, waited, and stopped without writing a run.

### Finding outside this packet: Contact's Pause control shifts on activation (blocks a wide PASS)

Both smoke runs read `clsEnhancement` 0.0007882 on Contact/en, the same value twice. A diagnostic load of all ten pairs at 1440×900 and 1280×720 from the candidate export attributed it. On **Contact, in both locales and at both sizes**, there is a single shift about 585 ms after load (just after activation) whose only source is `button[data-connected-pause]` in `#connected-pause-contact`, moving left by 95 px (es) or 118 px (en) at the same height: 0.00050 and 0.00080 (es), 0.00079 and 0.00125 (en). Studio, Founder, Services and Projects showed no enhancement shift (one Studio/es load showed an app-bar shift before activation, which the collector's attribution does not count).

Cause, by reading: Studio and Founder hide their static label when the control mounts (`.pauseSlot:has([data-connected-pause]) .staticLabel { display: none; }` in `studio.module.css` and `founder.module.css`); `components/contact/contact.module.css` has no such rule, so the button mounts beside the label and jumps by the label's width when the label goes. The shift exists only where the host is attached, which is exactly what enabling the wide tier ships. With a zero limit every valid Contact run fails, so the wide tier cannot pass until it is repaired. The repair is product CSS outside this write set: it needs its own numbered packet (20 or later) with a failing case first, then a recollection at its head, as protocol section 8 requires.

### Wide-tier preparation rulings

- Ruling: this work is Task 15's own unfinished objective (the wide tier's qualification) on its declared released-main base, so it edits only Task 15's write set: the collector, its test file and the two Task 15 documents. The batch is a mode of the collector, not a new script, for that reason. Cost if wrong: the planning authority renumbers it as a packet 20+ with the same diff.
- Ruling: the hidden checkpoint is a separate page load of the same build in a plain browser, not the measured page. The protocol's "one page load" holds for every other row; this one cannot be taken in a focus-emulated tab, and the drawing-before-hidden requirement keeps it from passing on a still scene. Cost if wrong: an operator-measured hidden window on the measured page with `--hidden=manual`.
- Ruling: the collector at this branch's head measures a candidate at `84c5c98a`, so the cohort is the product build. Run reports name the build head, not the collector revision; this receipt names the collector branch. Cost if wrong: a collector-revision field in the report.
- Ruling: the Contact layout shift is recorded as a finding with its attribution and is not repaired here (forbidden path; the plan forbids silent widening). Cost if wrong: one CSS rule lands a packet later.
- Ruling: the batch waits for quiet using the validity limits themselves (CPU ≤ 30 %, GPU ≤ 30 %), twice, ten seconds apart. Load that starts mid-run can still invalidate a run, which is then kept and retried. Cost if wrong: a stricter pre-run margin.

### Next steps (as first written; see the update below)

1. Repair the Contact Pause-slot shift in its own packet and merge it to `main`. *Done: Task 20, [PR #159](https://github.com/Furlanich/Portfolio/pull/159), merged at `ab177ea2`.*
2. Build a fresh runtime candidate at that `main` head (protocol section 1) and confirm a smoke run reads `clsEnhancement` 0 on Contact. *Done, below.*
3. Owner: restart and quiet the desktop, then run `--batch` (about six hours) and keep the runs directory and dossier. *Held for the label finding, then waived by the owner: see [the owner acceptance](#owner-acceptance-of-the-wide-tier-2026-10-19).*
4. A PASS dossier is Task 15's wide PASS for Reviewer R and the owner; Task 18 may then enable `wide` only. Compact stays OPEN until a constrained Android phone and operator are available.

### Update after Task 20 (2026-10-19, candidate at `ab177ea2`)

The branch was rebased onto `ab177ea2` (Task 20 merged) and a fresh runtime candidate was built there (same patch SHA-256 `336853b2…`).

- **Layout shift:** a load of all ten pairs at 1440×900 and 1280×720 now shows no layout shift at all, and every page goes live.
- **A third tooling defect, the scroll input.** A smoke run of Contact/es on a moderately quiet machine (CPU 23 % / 22 %, GPU 0 % / 17 %) still failed the active frame interval (p95 83.2 ms, sustained 100.3 ms) while its pointer frames (17.1 ms) and the page-only control (16.8 ms) were smooth; Contact had read 83 to 84 ms on every run so far, on any machine. Cause: Playwright's `mouse.wheel` jumps the page instantly, once per call (one scroll event per 80 ms step), and Contact's scene draws only when the page moves (its nodes never move), so it drew once per jump: 21 renders against Studio's 365 over the same traversal. Under Chromium's smooth scroll gesture (`Input.synthesizeScrollGesture`, mouse source) the same build drew on 56 of 58 scroll events at a 16.8 ms median. The traversals, the page-only control and sustained use now scroll with that gesture (`scrollGestureParameters`, cases S1; RED 2 failing, then 87/87).
- **Smoke runs with the gesture** (still INVALID by their short windows; CPU 18 to 21 %, GPU 0 to 25 %): Contact/es `6cfb6fbb…` every row PASS (active p95 17.2 ms, 146 scroll renders, CLS 0, hidden 10 s with 0 draws and 0 callbacks); Services/en `9701df82…` every row PASS; Studio/en `90e43592…` every row PASS but `labelViolations` 1. Raw reports are in `.worktrees/sfc-15w-evidence/smoke-ab177ea2-gesture/`.

### Finding outside this packet: decorative labels overlap reading masks while the page scrolls

To see whether Studio's one label violation was chance, every animation frame was sampled during a full traversal down and back on the same candidate, applying the collector's own rule (a label with opacity above 0.01 whose box overlaps a `[data-connected-reading-mask]` or the App Bar):

| Pair | Frames sampled (gesture / wheel) | Violating label-frames (gesture / wheel) | What overlaps |
| --- | --- | --- | --- |
| Studio/en | 582 / 532 | 55 / 59 | three labels into a reading mask by 5 to 24 px, opacity 0.01 to 0.59 (mid-fade, 0.16 s transition) |
| Studio/es | 585 / – | 53 / – | the same three labels |
| Services/en | 1071 / 970 | 414 / 421 | all eight capability labels, 4 to 24 px into reading masks, **opacity up to 1.0** |
| Projects/en | 629 / 578 | 228 / 248 | all eight capability labels, the same pattern, opacity up to 1.0 |
| Founder/en, Contact/en | 760, 352 / 678, 309 | 0 / 0 | none |

The figures are the same under the old wheel input, so this is the label layer's behavior during scroll, not an effect of the new input. The collector samples labels only a few times per traversal, so a run catches it by chance, and with three traversals per run a 30-run wide collection would almost certainly fail Studio, Services and Projects pairs on `labelViolations`. DESIGN-SPF-V1 requires labels "occluded behind reading" surfaces to be suppressed and lists "upright/occlusion-safe labels" in its motion acceptance; it says nothing about the fade while a label crosses a mask. Whether this is a product defect (Services and Projects show fully opaque labels inside masks, which reads as one) or a fade the protocol should tolerate is a design and planning decision, not a measurement one; no fidelity, cap or rule was changed. The repair, or a clarified rule, needs its own packet; the six-hour collection should wait for it.

*Resolved by Task 21 ([PR #160](https://github.com/Furlanich/Portfolio/pull/160), merged at `26c4653e`); see below.*

## Owner acceptance of the wide tier (2026-10-19)

**Wide tier: PASS by owner acceptance; the 30-run hardware collection was waived. This is not a measured qualification.** No run in this packet is valid under the protocol (all were reduced-window smoke runs, most on a busy machine), and no dossier exists. **Compact: OPEN.**

- **Decision.** The owner, Samuel Furlanich, after Task 21 merged, in chat on 2026-10-19, said of the six-hour quiet-desktop collection: "There is no need for that," and: "Just mark it as passed so that be can complete Task 15 and move on with Task 18." I declined to record it as a measured PASS and proposed this wording (a PASS by owner acceptance, with the collection waived and compact left OPEN); the owner then said to continue.
- **Reviewer R's position, recorded and overridden.** In the [PR #160 review](https://github.com/Furlanich/Portfolio/pull/160) Reviewer R wrote that Task 15 cannot yet be closed: the Task 21 probes are not qualifying runs, fresh wide-tier evidence must be collected from the merged candidate on a quiet desktop, and compact remains OPEN. The owner's decision overrides the first two points for the wide tier only.
- **What the owner accepted, at `26c4653e`** (Tasks 1 to 21 merged; runtime candidate patch SHA-256 `336853b2…`; the collector at this branch's head; the owner desktop of the device record above):
  - All ten route and locale pairs go live by themselves on hardware WebGL2, with **no layout shift** in 20 loads at 1440×900 and 1280×720.
  - **No label over a reading mask or the App Bar** in any sampled frame of a full traversal down and back, on all ten pairs, under both the smooth scroll gesture and wheel steps (528 to 981 frames per pair).
  - Smoke runs, one per route (reduced windows, so INVALID; raw reports in `.worktrees/sfc-15w-evidence/smoke-26c4653e/`): Studio/es `d5553014…`, Founder/en `f89fc0cd…` and its rerun `8a52610b…`, Contact/es `9da3e54c…`, Services/en `55ac221f…`, Projects/es `54e820a9…`. Every non-timing row passed in every run: enhancement CLS 0, label violations 0, draw calls 6 to 7, canvas ratio within cap, optional closure 119.49 KiB Brotli, LCP 424 to 816 ms, INP 24 to 48 ms, paused, Footer, rest, settled-tail, route-cycle and resume rows clean. The hidden checkpoint measured 0 draws and 0 callbacks over a 9.9 to 10.0 s hidden window with the scene drawing beforehand in 6 of 7 attempts; Founder/en's first attempt never reported a complete hidden window (OPEN), and its rerun measured 0 and 0.
  - **Timing on this candidate is unproven.** These runs overlapped another session's browser tests (CPU 42 to 100 % before or after, GPU up to 38 %), and the frame-interval rows read 17.4 to 32.6 ms (active) and 17.7 to 31.9 ms (sustained); only Services/en and the Founder rerun passed every timing row. The best timing evidence is the moderately quiet run set at `ab177ea2` with the same scroll input (CPU 18 to 21 %): Contact/es, Studio/en and Services/en active p95 17.0 to 17.2 ms and sustained 16.9 to 17.2 ms. Task 21 then changed only label visibility and when labels refresh; its receipt reports frame cost unchanged (p50 16.7 ms, p95 16.8 ms).
- **Still open after this acceptance:**
  - The compact tier (no constrained Android phone or operator).
  - Reviewer R's P2 on Task 21: a label hidden while its projection leaves view can still fade at its retained position under a mask. PR #160 merged at the reviewed head, before the fix; the Task 21 session was asked to deliver it in a new PR.
  - The Services/es card hover-lift exception that Task 21 reported (one wheel frame; not seen in this packet's runs at `26c4653e`), which awaits a design or planning disposition.
  - Reviewer R's review of this branch.
- **For Task 18.** Enable `wide` only; `compact` stays `false`. Task 18's own requalification of the final code, and its actual hardware, vitals and rendered acceptance, remain Task 18's to perform and record.

### Validation (this branch)

Fresh, 2026-10-19, `.worktrees/sfc-15w` after `npm ci`:

- `npm run validate`: exit 0. docs:check 355 Markdown files, 121 document IDs, 38 Skills; `npm test` 967 tests, 966 pass, 1 `todo` (the Task 14 Contact-opacity placeholder), 0 fail; lint 0 errors, 282 warnings (the baseline); typecheck pass; build pass.
- `node --test scripts/measure-connected-studio-hardware.test.mjs`: 85/85 (72 before this work); ESLint on the collector and its test: no problems.
- After the rebase onto `ab177ea2` and the scroll-gesture change: `npm run validate` exit 0 (docs:check 356 Markdown files, 121 document IDs, 38 Skills; 969 tests, 968 pass, 1 `todo`, 0 fail; lint 0 errors, 282 warnings; typecheck pass; build pass); the collector's own suite 87/87.
- After the rebase onto `26c4653e` (Task 21 merged): `npm run validate` exit 0 (docs:check 357 Markdown files, 121 document IDs, 38 Skills; 971 tests, 970 pass, 1 `todo`, 0 fail; lint 0 errors, 282 warnings; typecheck pass; build pass); the collector suite 87/87.
- Candidates at `ab177ea2` and `26c4653e`: `npm ci`, the runtime patch and the root build passed; the smoke runs and probes above.
- Candidate at `84c5c98a`: `npm ci`, the runtime patch and the root build passed; the two smoke runs and the `--batch` start-up above. Not run: a full-length run, the `/Portfolio` subpath, Firefox, the Android path.
- No product, browser spec, visual baseline or export file changed.
