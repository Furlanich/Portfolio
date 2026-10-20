# Task 25 / PR 25 — Qualify and enable the compact tier

**Status: the compact tier stays OPEN and static. `CONNECTED_LIVE_POLICY` is unchanged at `{ wide: true, compact: false }`.** Step 1 of the packet, the intermittent Contact compact label overlap, is repaired failing-first. Steps 2 and 3 (the constrained-phone collection and the flag flip) could not be started: the precondition is missing in this environment, and nothing was fabricated, waived or inferred.

> **Update, later on 2026-10-20: the compact tier is now ENABLED on the owner's acceptance.** After this packet merged as an honest OPEN, the owner told the planning session that they had already tested the compact live scene on a real phone, with screen readers, and asked for the plan to be closed with compact enabled. The change is recorded in "Enablement on the owner's acceptance" at the end of this receipt. The status above, the "missing precondition" table and "What was not done" are the state at the time of the first merge and are kept as history.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`; the session does not expose reasoning effort, so "High" is not attested); subagents 0/0 (none, `SINGLE_AGENT` per [GOV-AGENT-USAGE](../../governance/agent-usage.md)). Self-review only; Reviewer R remains a separate session.

Branch/worktree: `codex/sfc-25-compact-tier` in the session worktree `.claude/worktrees/sfc-25-compact-tier-b13a5e`, cut from the head of `codex/sfc-19-closeout` (`4a47ba95`, [PR #172](https://github.com/Furlanich/Portfolio/pull/172), not yet merged), because the Task 19 receipt that defines this packet exists only there. The pull request is stacked on that branch so its diff is this packet alone; retarget it to `main` once #172 is merged. Master plan and the [Task 19 receipt](task-19.md) were not edited; the packet is the one defined under its "Follow-up packets".

## The missing precondition (why compact stays OPEN)

The [hardware protocol](hardware-protocol.md) and the [Task 15](task-15.md) rules need a **physical, constrained Android phone, driven over `--connect-cdp`, with an operator** who locks the screen for the hidden-tab row and fills the operator sheet; a desktop 390 px viewport (`--diagnostic`), an emulator or any software renderer never counts. As of 2026-10-20 this environment has none of it:

| Check (2026-10-20) | Result |
| --- | --- |
| `adb` on `PATH` | Absent. The Android SDK platform-tools exist at `C:\Program Files (x86)\Android\android-sdk\platform-tools` (adb 1.0.41, 36.0.0), so the toolchain is there but unused |
| `adb devices -l` | **Empty list.** No phone is attached; the daemon had to be started to ask, and was stopped again |
| Android Virtual Devices (`~/.android/avd`) | None, and one would not qualify: the protocol rejects an emulated or desktop target |
| Named device, device record JSON, operator | None provided to this session |

Per the packet's hard rule, therefore: no compact run was collected, no figure is reported, the `compact` flag was **not** flipped, and `tests/fixtures/sfc/live-policy.patch` is untouched. Nothing here is a PASS, a FAIL or a waiver. The compact row in [Task 19](task-19.md) stays "OPEN, static".

### What the next session needs (the exact preconditions)

1. A **named physical Android phone** that is constrained on purpose (low-end SoC and memory; Chrome current; USB debugging on, the screen on and unlocked, charger and brightness noted), with an **operator** at the phone for the whole collection (about six hours for 30 runs of about 12 minutes) who will lock the screen for the hidden row.
2. A device record per [protocol section 2](hardware-protocol.md#2-the-device-record) with `"kind": "android"`, written before the first run and kept with the runs outside Git.
3. A runtime-candidate checkout at the head under test (`node scripts/prepare-sfc-candidate.mjs apply --kind=runtime --expect-head=<head>`, `npm ci`, `npm run build`), then per run `adb forward tcp:9222 localabstract:chrome_devtools_remote`, `adb reverse tcp:3515 tcp:3515` and the collector with `--tier=compact --connect-cdp=http://127.0.0.1:9222 --serve-port=3515` ([section 6](hardware-protocol.md#6-what-this-protocol-cannot-claim)). The collector has `--batch` for the wide tier only; the compact tier is collected run by run (five route pairs, two locales, three valid runs each, one cohort), then `--qualify=<runs-dir> --tier=compact`.
4. Only on a genuine PASS of all ten pairs with the human hidden-tab measurement: flip `compact` to `true` in `lib/connected-studio/capability.ts` (the committed `live-policy.patch` is exactly that one-token change), restate the policy cases that assert `compact: false` first (RED), then update them. The cases that name the old policy today: `scripts/connected-studio-capability.test.mjs` (lines 27 and 55 to 57), `scripts/connected-studio-media.test.mjs` (160), `scripts/sfc-contracts.test.mjs` (the patch fixture assertion near 288), `tests/e2e/connected-studio-runtime.spec.ts` (236 to 238 and 708), and the Task 18 policy cases in [task-18.md](task-18.md). That list is a search result at this head, not a plan: re-run the search then.

The Android path of the collector has never run on a phone ([protocol section 6](hardware-protocol.md#6-what-this-protocol-cannot-claim)); the first real run is also its test, and a defect found there gets its own numbered packet.

## Step 1 — the intermittent Contact compact label overlap (repaired)

The case: `contact compact: no visible label overlaps reading text, a control or the App Bar at any scroll position` in `tests/e2e/sfc-runtime.spec.ts` ([Task 18](task-18.md) recorded 2 of 24 failures on `main` with the runtime candidate and 5 of 32 on its head).

### Finding (verified before acting)

Two causes, one of them a product defect:

1. **Product defect, deterministic.** On Contact the Founder link (`.founderBridge`) sits outside every plate and scrim. At the compact profile the "Contexto" label (n0) rests at about (35, 135) in the fixed ground, is clamped to the left edge and is 72 × 24 px. At scroll 1080 the link spans document y 1227 to 1271, the plate above it ends at 1167, and the label is not occluded by anything, so the decorative word was drawn **over the link** (`data-visible="true"`, `data-occluded="false"`, transform `translate3d(0px, 148.04px, 0px)`, same at every run). A visitor on the compact profile would see it; the screenshot of a failed run shows the pill covering "Conocer la trayectoria de Samuel". Because compact is static today, nobody has.
2. **Test timing flaw, which made it intermittent.** The runtime case scrolls with `window.scrollTo({ behavior: 'instant' })` and reads the labels at once. The scroll event, and with it the host's label pass, runs at the next rendering opportunity, so the first read often saw the labels decided for the previous scroll position (n0 was hidden and "occluded" there) and the poll returned `clear` immediately. A frame later the clash was real and stayed on screen for the full 8 s when the read was late enough. The same 1080 geometry was logged in passing and failing runs; only the read timing differed (an instrumented run, since removed, printed `clear` with the label shown and `CLASH` on the next reads).

A first hypothesis (a label still fading in reads as opacity 0) was tested and **refuted**: counting a label as shown from its resolved `data-visible` changed nothing (40 of 40 passed).

### RED

1. Case first, `tests/e2e/sfc-runtime.spec.ts`: after each `scrollInstant` the case now waits two animation frames so the host has handled the scroll. Run `SFC_TEST_MODE=candidate` with the runtime candidate, one worker, compact Contact, 8 repeats: **8 of 8 failed** with `label "Contexto" (n0) overlaps a "Conocer la trayectoria de Samuel" at scroll 1080` (it passed 12 of 16 before). The other nine cases of the label family still passed (18 of 20 over two repeats; the 2 failures are this case).
2. Unit case, `scripts/contact-route.test.mjs`: the Founder bridge wrapper must carry `data-connected-reading-mask`. It **failed on its stated assertion** (actual `<div className={styles.founderBridge}>`).

### GREEN

`components/contact/ContactPage.tsx`: the Founder bridge wrapper gets `data-connected-reading-mask=""`. With no `data-connected-clearance` the host measures it as a *legacy* mask (the rectangle as measured, no backing): the label resolver hides a label that would overlap it, the pointer exclusion applies, and **there is no visual change** (no scrim, no surface, no spacing). The wrapper spans the stack, so the label also stays off the 44 px target's slack.

Results: unit `node --test scripts/contact-route.test.mjs` **3 of 3 pass**; the ten label cases, three repeats, **30 of 30 pass**.

## Validation

Fresh, 2026-10-20, in this worktree after `npm ci`, at the head of the packet:

| Check | Result |
| --- | --- |
| `npm run validate` (docs:check, `npm test`, lint, typecheck, build) | **Passed.** Documentation validation passed; `npm test` **983 pass, 0 fail, 0 todo** (982 at the base plus the new Contact case); lint 0 errors (282 warnings, pre-existing); the static export compiled and generated 18 pages |
| Runtime candidate family, full, one worker (`SFC_TEST_MODE=candidate`, runtime patch applied, head `345ff6dd`) | **88 passed, 2 failed.** Failure 1, `direct Contact with the live graph: the actual intake plate and introduction scrim are the masks the host caches`, is a **consequence of this change** (it counted one reading mask on Contact; there are now two). Failure 2, `studio: an ordinary wheel scroll excites the graph` (peak 0.00016 against a 0.002 floor), is a Studio sampling race under load that this change cannot reach; it passed **4 of 4** alone, and its own comment calls the case marginal on a loaded software renderer |
| The two failing cases after the restatement below, 4 repeats each | **8 of 8 pass** |
| Default-mode Contact and accessibility browser specs (`contact.spec.ts`, `sfc-accessibility.spec.ts`, every project that runs them) | **99 passed** |

I did **not** re-run the whole 90-case candidate family after restating the Task 13 case; the 8 of 8 above is that case and the Studio case alone. The ten label cases passed 30 of 30 (three repeats) on the head that carried the fix.

## Ruling

- **Ruling 1 — restate the Task 13 mask-count case.** That case asserted that `[data-connected-reading-mask]` counts 1 on Contact (the introduction scrim). The Founder bridge is now a second, deliberately backing-free reading mask, so the case selects the scrim by its clearance attribute, asserts the bridge as the one mask without a clearance holding exactly one link, and asserts the total of 2. The alternative, a new keep-out attribute with host code, would add a contract and a change to the hydrated host for one wrapper; I judged the existing legacy-mask kind, which the host already measures and Services and Projects already use, the smaller and more reviewable change. Cost if wrong: one attribute name and a few test lines to move later.

## What was not done and why

- No compact hardware evidence, no hidden-tab measurement, no flag flip (precondition above).
- The wide tier is unchanged and its owner acceptance stands ([Task 15](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19)).
- No visual change was made, so no rendered-design judgment was needed; the label placement against the Founder link is asserted by the runtime case, and the screenshot of the old failure is the only visual evidence.
- The wide case did not need the fix, but the wrapper is a measured occluder for every profile of Contact, which is the intended behavior.

## Self-review

I re-read the diff against the finding: one attribute on one wrapper, a frame wait in one case, one source-level case. I checked the host's own contract (`measure()` reads `[data-connected-opaque-plate],[data-connected-reading-mask]`; a mask without a positive clearance is `kind: 'legacy'`, so no backing is implied) rather than assuming it. The risk I could not close here is on a physical phone: Chromium on SwiftShader proves the label rule, not the compact frame cost, which is what the open qualification is for.

## Enablement on the owner's acceptance (2026-10-20, later)

**Decision.** The owner, in the Claude Code session, said the compact-tier, screen-reader and phone checks "should be already closed" because they had tested them manually, and asked to continue the plan closure. Asked whether to enable compact or keep it static, they chose **enable compact now**. Asked what they tested, they chose **the compact live scene with the flag forced on, on a real phone, with screen readers**. The record below is therefore an **owner attestation**, like the wide tier's ([Task 15](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19)): no tool, version, device, date or per-item result was supplied, none is invented here, and no measured constrained-phone run exists. The collector was never run on a phone. A measured qualification would only strengthen this.

**What changed (branch `codex/sfc-25b-enable-compact`, from `main` at `12f5789d`, Task 25's two commits cherry-picked first because PR #175 merged into the closeout branch after #172 had merged and never reached `main`):**

- `lib/connected-studio/capability.ts`: `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: true }`.
- RED first: `connected-studio-capability.test.mjs` (the shipped policy enables both tiers, every failed gate keeps every tier static including compact) and `connected-studio-media.test.mjs` were restated before the flag moved. Run against the old flag, 2 cases failed on their stated assertion (`compact: false` against the expected `compact: true`); after the flip, 22 of 22 pass. The browser cases were restated in the same edit as the unit cases, so their failure against the old flag was not watched separately.
- Browser specs: `sfc-production.spec.ts` now expects an eligible 390 px visitor to go live (canvas, Pause control, engine requested) and no longer lists compact among the static visitors; `connected-studio-production.spec.ts` and `connected-studio-runtime.spec.ts` replace "the shipped policy keeps compact static" with "takes a compact page live". Reduced-motion, Save-Data and the other failed gates are unchanged.
- **The live-policy candidate is retired.** `tests/fixtures/sfc/live-policy.patch` flipped the compact flag and could not apply once it was on, so it is deleted; `scripts/prepare-sfc-candidate.mjs` has only the `commercial` kind (`runtime` and `combined` are refused), the candidate CI job from [Task 26](task-26.md) applies `--kind=commercial`, and `sfc-contracts.test.mjs` and `sfc-ci-budget.test.mjs` assert exactly that. The new-route runtime family needs no policy patch any more.
- Not changed, on purpose: `measure-connected-studio-hardware.mjs` still refuses to run unless the checkout is a `runtime` candidate. That tool is for a measured collection, which nobody has scheduled; it needs rework (a committed build is now the build under test) before any new collection. Recorded in Task 19's follow-ups.

**Verification (2026-10-20):** `npm test` 990 pass, 0 fail. Production static export: `PLAYWRIGHT_SERVE_EXPORT=1` with `sfc-production-chromium` and `connected-production-chromium`, **66 passed**, including the new compact-goes-live checks on all ten route/locale pairs. The two shipped-policy cases of `connected-studio-runtime.spec.ts` (wide and compact, `immersive-chromium`): **2 passed**. The candidate-mode families (the 90-case list now runs without the policy patch) are exercised by the CI `candidate` job on this PR, not locally; the full default Playwright list (3195 cases) was not re-run locally, so the CI run on the PR is the check for the rest.

**First CI run on the enablement PR (#176): 5 browser cases failed, none in a product file.**

- `connected-studio-responsive.spec.ts`, "keeps the Pause slot reserved, empty and inside the page width", four pages on `mobile-webkit`: the case proves the static page in every engine, but WebKit on a Linux runner reports a masked renderer, so once compact was live a 390 px WebKit page went live. The case now closes both tiers through the test hook, as the static media cases already do after Task 18. Passed locally on `mobile-webkit` and `mobile-chromium` (8 of 8).
- `connected-studio-runtime.spec.ts`, "one live renderer across the whole navigation journey" (`immersive-chromium`): failed on the first try and the retry with `toHaveCount(1)` at the default 5 s after the in-app navigation to Projects, while the failure screenshot shows the scene live. It passed on the previous PRs' runs and 3 of 3 locally on this head, so I could not reproduce it; the assertion now uses the 30 s window the next line (`expectLive`) already uses. **If it fails again in CI that is not a timeout problem and needs a real diagnosis.** The candidate job and the other three browser shards passed.

**What this does not claim.** It is not a frame-rate, battery or Core Web Vitals figure for a constrained phone. Compact visitors now run the live scene and pay its CPU and bytes; their startup cost was already paid at Task 18 (the host chunk shipped to them while static). Firefox and WebKit timing stays OPEN.
