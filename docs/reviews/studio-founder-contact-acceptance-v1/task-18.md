# Task 18 / PR 18 — Enable the qualified wide graph tier and verify final behavior

**Status: MERGED and DEPLOYED. The wide tier is live on the public site; compact stays static and OPEN.** [PR #164](https://github.com/Furlanich/Portfolio/pull/164) merged at `317467b2` on 2026-10-19, after [Task 22's PR #165](https://github.com/Furlanich/Portfolio/pull/165) (`ed57bc06`) so the live Contact page ships without its two known defects. The owner accepted the host's startup cost as an exception to the plan's 25 ms allowance (+80 to +93 ms median on desktop, +68 to +147 ms on the mobile profile; see "The static cost of the host"). `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: false }`. The read-only deployed smoke passed (below). Reviewer R's review and the owner's rendered and hardware acceptance are PENDING; the planning authority records closure in Task 19.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`, the model the plan assigns; the session does not expose reasoning effort, so "High" is not attested); subagents 0/0 (none). The executing-plans whole-branch reviewer subagent was not used (AGENTS.md and GOV-AGENT-USAGE outrank it); the self-review below is the author's own, and Reviewer R remains a separate session.

Branch/worktree: `codex/sfc-18-enable-wide` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-18`, cut from `origin/main` at `0d01fa52` (the merge of PR #163), which contains Tasks 1 to 17, 20 and 21 and the Task 15 wide-tier record. Targets `main`. PR: [#164](https://github.com/Furlanich/Portfolio/pull/164), merged. Master plan, indexes and status were not edited (not transferred to this packet).

## Gate

| Condition (plan Task 18 dependencies) | State |
| --- | --- |
| Task 15 PASS for the proposed tier | **Wide: PASS by owner acceptance on 2026-10-19, the 30-run hardware collection waived. This is not a measured qualification** ([record](task-15.md#owner-acceptance-of-the-wide-tier-2026-10-19), merged in [PR #162](https://github.com/Furlanich/Portfolio/pull/162)); Reviewer R's objection is recorded there. **Compact: OPEN**, so it is not enabled and stays static. |
| Task 16 PASS | Released ([PR #157](https://github.com/Furlanich/Portfolio/pull/157)); the mobile poster startup cost was accepted by the owner. |
| Task 17 PASS | Deployed direct contact verified ([PR #158](https://github.com/Furlanich/Portfolio/pull/158)). |
| Owner decisions in chat, 2026-10-19 | Run Task 18 on Sonnet 5.5 as the plan says; accept the Services/es catalogue-card hover lift as it is (the one open exception in [Task 21](task-21.md)). |

The plan's RED asks for "named all-five-route final evidence" before the flag is flipped. No measured evidence of that kind exists, by the owner's decision above. The RED below states the policy the owner accepted; the tests fail against the old one.

## What changed

- `lib/connected-studio/capability.ts`: `CONNECTED_LIVE_POLICY` is `{ wide: true, compact: false }`.
- `components/connected-studio/atlas-live-host.tsx`: the seam renders `ConnectedStudioEnhancement`, so Studio, Founder and Contact carry the host. This is the two-file enablement named in [Task 16's receipt](task-16.md) and in the seam's own comment; see Ruling 1.
- Policy is per tier, not per page, so **Services and Projects also go live for a wide visitor** (they always mounted the host). Studio, Founder, Contact, Services and Projects were the five route pairs Task 15 covered.
- The runtime-candidate fixture `tests/fixtures/sfc/live-policy.patch` now flips only the compact tier (the host is already attached), for a future compact qualification.
- Tests, scripts and records that asserted the old policy were restated first: see Rulings 2 to 6.

## RED then GREEN

1. `scripts/connected-studio-capability.test.mjs`, `connected-studio-media.test.mjs`, `sfc-contracts.test.mjs` were changed first. Against the old code four cases failed on their stated assertions: the shipped policy `{ wide: true, compact: false }` (was `{ false, false }`), the seam importing and mounting the host, Atlas pages reaching the host only through the seam, and the media case's policy line. A fifth guard (every failed gate keeps the qualified tiers static) passed trivially, as expected.
2. GREEN: the two-file change. One more case then failed (`the committed fixtures apply to the real live-policy target`, because the runtime patch no longer applied); the fixture was regenerated against the new baseline. Node suite: 975 tests, 974 pass, 1 `todo` (the Task 14 Contact-opacity placeholder), 0 fail.
3. Served-export family: after the change, 4 cases failed on their stated assertions (the in-flight-import case left for a page that is connected now, two "shipped policy keeps a wide page static" cases, and "a policy-disabled Atlas page references no connected host code"); they now state what the shipped policy does, and the production measurement's Atlas gate required "no host" and now requires the host.
4. CI on the draft PR failed 89 cases of `connected-studio-static.spec.ts` (Firefox and WebKit on the Linux runner do not reveal a software renderer, so a wide page goes live there), two cases in `connected-studio-runtime.spec.ts`, and one Firefox navigation case. The static cases now close both tiers through the test hook, because they prove the static page; the shipped policy is owned by the served-export family. See Ruling 4.

## Evidence at the committed head

All on `codex/sfc-18-enable-wide`, the owner's desktop (Intel Core i3-8100, 4 cores, 24 GB; NVIDIA GeForce RTX 2060, driver 32.0.16.1088; Windows 11 Pro 10.0.26300; 60 Hz), Chromium 153.0.8010.12 unless stated. Raw reports are kept outside Git in `.worktrees/sfc-18-evidence/` (git-ignored), as in Tasks 3, 14 and 15.

| What | Method | Result |
| --- | --- | --- |
| Tiers on hardware, no hook, no candidate | Headed Chromium on the committed root export; ten connected pages at 1440, 820, 767, 390 and 320 px | **Wide and tablet go live by themselves with one canvas on all ten pages; 767, 390 and 320 px stay static** (no canvas, no live flag), no horizontal scroll. |
| Layout shift | The same loads at 1440×900 and 1280×720 | 20 of 20 live, **zero layout shift**. |
| Labels over reading masks | Every animation frame of a full smooth-scroll traversal down and back, ten pages | **0 violating label-frames** on all ten (348 to 1080 frames each). |
| Pause and the live state, desktop profile | `measure:connected-studio-vitals --hardware --expect-mode=live`, five routes, five journeys per locale | 50 of 50 journeys live, each with Pause, Resume, keyboard focus, scroll and a route link done; **lab LCP p75 460 to 784 ms** (Projects 772 ms is its illustration), **INP p75 24 to 48 ms**, **enhancement CLS 0**. Gates passed. |
| Functional activation in Firefox 155 and WebKit 26.6 | Headless, shipped policy, no hook, five routes in both locales | Wide: live with one canvas and one Pause control, no page error, on all ten pairs in both engines; compact: static. WebKit reports a masked renderer ("Apple GPU"), so a software renderer is not detectable there. No timing is taken in these engines; every performance row stays OPEN for them. |
| Optional closure | `measure:connected-studio` on the root and `/Portfolio` exports | **119.5 KiB Brotli on all four connected destinations, unchanged** (headroom 0.5 KiB, limit 120). Each Atlas page's closure is 119.5 KiB too. The six Atlas pages reference exactly one host chunk (`chunks/10sejnzxmhqjx.js`) and no engine-only code; a static visitor (reduced motion, Save-Data, forced colors, stored context loss) requests no closure chunk and draws no canvas. Gates passed. |
| Export contract | `verify:static-export` | Root: 16 routes, base path "/". `/Portfolio`: 16 routes. |
| Served-export browser family, root | `connected-production-chromium`, `sfc-production-{chromium,firefox,webkit}` | 82 passed, 12 skipped (the live cases run in Chromium only), 0 failed. |
| Served-export browser family, `/Portfolio` | The same four projects | 82 passed, 12 skipped (the live cases run in Chromium only), 0 failed. |
| New-route runtime family (candidate mode) | `sfc-runtime-chromium`, SwiftShader, Chromium only | Final full run at one worker: **67 passed, 3 skipped (the three Task 12 `fixme` cases for the Contact defects), 1 failed**. The failure is `contact compact: no visible label overlaps reading text, a control or the App Bar`: label "Contexto" (n0) over the link "Conocer la trayectoria de Samuel" at scroll 1080 on the compact profile, which is not enabled. It is **intermittent and pre-existing**: 2 of 24 repeats fail on `main` with the runtime candidate applied, 3 of 24 and 2 of 8 on this head. Earlier full runs at two workers failed 11 cases (three removed, two repaired, six cadence, caps and label-clearance cases) under three concurrent heavy jobs and then 2 cases on a quiet machine; every one of those passed in isolation (30 of 30 for the first group, 2 of 2 for the second), so the two-worker SwiftShader timeouts are load, as Task 21 also found. |

### The static cost of the host (blocks the PR: owner decision)

Task 14 found that carrying the host on the Atlas pages cost startup CPU, and Task 16 removed that cost by keeping the host off them. Enabling the wide tier brings it back, and it is paid by **every** visitor to Studio, Founder and Contact, including the compact visitors who stay static and get nothing for it, because Next ships a client chunk with every page that can reach it.

- **First-load JavaScript, Brotli, from the emitted export:** the six Atlas pages go from 151.97 KiB (nine chunks) to 160.90 KiB (ten chunks), **+8.93 KiB**. The plan's budget is +12 KiB for Studio and Founder and +16 KiB for Contact: **within it.**
- **Startup CPU, paired and interleaved against `0d01fa52`** (the Task 14 method: base, current, current, base per profile, ten journeys per side, lab throttling, one machine, not field data; the plan's allowance is +25 ms added p95, median and p95 both over it is FAIL):

| Profile | Route/locale | Added median (ms) | Added p95 (ms) | Verdict |
| --- | --- | --- | --- | --- |
| Desktop, 1x CPU | studio es / en | +91.0 / +89.0 | +50.1 / +35.9 | FAIL / FAIL |
| | founder es / en | +89.4 / +93.1 | +33.6 / +24.2 | FAIL / OPEN |
| | contact es / en | +79.9 / +26.2 | +36.5 / +22.7 | FAIL / OPEN |
| Mobile, 4x CPU, Slow 4G | studio es / en | +68.5 / +89.9 | +68.2 / +49.3 | FAIL / FAIL |
| | founder es / en | +146.7 / +98.7 | +93.2 / +68.0 | FAIL / FAIL |
| | contact es / en | +96.5 / +92.9 | +81.8 / +101.8 | FAIL / FAIL |

Totals: desktop 0 PASS, 2 OPEN, 4 FAIL; mobile 0 PASS, 0 OPEN, 6 FAIL. Raw reports (SHA-256, first 12): `base-desktop-1` `8b3863a694a9`, `base-desktop-2` `b38c6b954fad`, `cur-desktop-1` `f0042c406288`, `cur-desktop-2` `4febdd43b734`, `base-mobile-1` `1b1413b5b8a6`, `base-mobile-2` `d5c7aef4db23`, `cur-mobile-1` `37469d9350ad`, `cur-mobile-2` `1371506ee6bb`. The machine was also running other sessions' work, which the interleaving is meant to absorb but cannot remove.

The plan's budget row reads "No host hydration in policy-disabled builds"; for an enabled wide tier the host is expected, so this is reported as a cost against the plan's own allowance, not hidden as an expected pass. **Options for the owner** (a budget decision reopens owner approval per the plan):

1. **Accept the cost** as the price of the live scene on the five pages, and record the exception (this PR then needs only that approval).
2. **Make the host load only for eligible visitors**: a tiny client gate (a few hundred bytes) that checks the cheap conditions (viewport tier, reduced motion, Save-Data) and dynamically imports the host, so a compact, reduced-motion or Save-Data visitor pays nothing and a wide visitor pays the live scene's cost. It touches the seam and the host's mount timing, so it needs its own packet (23 or later), its own RED, and a recollection of the shift, label and vitals rows. The added cost for wide visitors would remain.
3. **Hold the flag** until one of the above is decided.

**Owner decision, 2026-10-19: option 1, ACCEPTED.** The owner wrote: "Accept the host's startup cost as the price of the live scene and record it as an owner-approved exception in task-18.md." The exception is therefore: Studio, Founder and Contact carry the host for every visitor, adding the first-load JavaScript and the paired startup CPU measured above (desktop +80 to +93 ms median, mobile profile +68 to +147 ms, against the plan's +25 ms p95 allowance), including compact, reduced-motion and Save-Data visitors who stay static. The host, the budgets and the measurement thresholds are unchanged; the lazy-gate option (a packet 23 or later) stays available if the owner reopens this. Cost if wrong: a later packet moves the host behind a gate.

### Two Contact defects become public (owner decision, Task 22 proposed)

Reviewing the live pages on hardware at 1440×900 (Studio, Founder, Contact, Services, Projects; Taste audit below) found two defects that Task 12 recorded in [its receipt](task-12.md) as "OPEN, packet 20+ proposed" and carried as `test.fixme` cases, never fixed:

- **The Contact Pause control's top border is painted over** by the introduction scrim's 32 px backing (the control is 16 px below the scrim; the backing is decorative with pointer events off, so `elementFromPoint` still returns the button, but the border is not visible and the focus ring is clipped when focused). The control is identifiable by its text, reachable and 44 px high.
- **Contact shows no decorative labels**: its three words are bound to `n0, n5, n10` where the design and profile say `n0, n4, n8`, so one label exists and it is hidden under the scrim.

Studio, Founder, Services and Projects show neither. Both are product CSS and content outside this packet's write set, and the plan says a failure in another owner's path creates a new numbered packet. A fix packet, **Task 22**, was proposed as a session card with both failing cases already named (`sfc-runtime.spec.ts`, the two `fixme` markers). **Owner decision, 2026-10-19:** "Start Task 22 for the Contact defects." Task 22 ran and opened [PR #165](https://github.com/Furlanich/Portfolio/pull/165) (both defects fixed failing-first and rendered on hardware, per its receipt); it is not merged, and its CI fails on the two Contact compact visual baselines, which need the owner's approval of the new images. **This PR should merge after #165**, so the live Contact page ships without the two defects.

## Audits (inline, degraded run: no subagent producers)

- **Taste v1** (rendered, hardware, 1440×900, committed build, es/en for Contact and en for the rest; screenshots in the evidence directory): Studio, Founder, Services and Projects hold hierarchy, material and spacing under the approved tokens: the graph sits behind the plates, labels are upright, 11 px or more and clear of text, plates keep their opaque reading surface. **Findings:** Contact Pause border covered (severity medium: the control is identifiable and operable, its boundary and focus ring are not intact), Contact labels absent (low to medium: decorative). Proposed correction: Task 22. Accepted: everything else.
- **Emil/review-animations**: rest, Pause, Footer and hidden behavior come from the collector's smoke rows (Task 15 record) and the runtime family: zero draws and zero animation-frame callbacks at rest, in the settled tail after input, while paused, in the Footer and while hidden (a 10 s hidden window with 0 draws), and Resume draws again. Interruption, pointer exclusion over plates and scrims, and the stationary tail are covered by the runtime cases that passed. **Not done:** a wide recording and a 120 Hz pointer check (the desktop is 60 Hz); the owner's rendered acceptance covers feel. Verdict on the evidence: no correction needed; feel is the owner's.
- **Impeccable optimize**: the cost that prevents the target is the host's startup cost on pages that stay static (table above); per-frame cost did not change and fidelity is preserved (no cap, token or budget touched). Fix owner if the owner chooses option 2: a new packet (23 or later).

## Deployed smoke (read-only, 2026-10-19, after the merge)

Public site `https://furlanich.github.io/Portfolio/`. Nothing was sent, no form exists, no call or message probe was made, and no account was touched.

| Check | Method | Result |
| --- | --- | --- |
| The deployed build is the reviewed build | `gh-pages` head `42041841` is `deploy: 317467b2…`; the Deploy run on `317467b2` succeeded; eight pages (Studio, Contact and Services in both locales, Founder in Spanish and Projects in Spanish) fetched with `curl` and compared with `cmp` to that `gh-pages` tree | **Identical**, eight of eight. |
| Wide visitors get the live graph | Headed Chromium on the owner's RTX 2060, no test hook, 1440×900, ten pages (five routes, both locales) | **10 of 10 live** with exactly one canvas, one H1 and one Pause control; 2 to 6 labels visible at rest; Pause and Resume each toggle the control's state and restore it. |
| Compact visitors, reduced motion and Save-Data stay static | The same ten pages at 390×844, with `prefers-reduced-motion`, and with `navigator.connection.saveData` | **Static on all ten in all three conditions**: no canvas, no live flag, one H1; the engine chunks are requested only by the live wide loads. |
| Requests stay on the site | Every request of the 40 loads | Same origin only (the router's `HEAD` link prefetches are the only non-GET requests); no page error. |
| Task 22 on the live Contact page | Screenshot of `/en/contact/` at 1440×900 | The Pause control has its full border and the words "Inquiry" and "Conversation" show. |
| Fresh-browser activation | Four fresh headed browsers on `/estudio/` | Live in 0.83 to 1.14 s each. |

**A disclosed first-pass anomaly.** The first full pass, run within minutes of the deployment, read Studio (both locales) as static at 1440 px, with no Pause control, while the other eight pages were live. The same pages read live on every later load (the corrected full pass, a re-check of three Studio loads, and four fresh browsers), and the files are byte-identical to the deployed tree. The likeliest cause is the CDN still serving the previous Studio files for a few minutes after the publish; I did not prove that. If a visitor does see the static Studio, they get the complete static page. The same first pass also flagged same-origin `HEAD` prefetches as foreign requests, a defect of the probe's own check that was corrected.

Not done: no deployed run of the Task 15 collector (the owner waived the collection), no mobile device or screen reader, and Firefox and WebKit were checked against the local export, not the deployed site.

## Rulings

- Ruling 1: `atlas-live-host.tsx` is part of this change although the plan's owned-path list names only `capability.ts`. The seam is the only place the host attaches to an Atlas page, and Task 16's receipt and the seam's own comment say the enablement is these two files; flag-only enablement leaves the pages static. Cost if wrong: split the seam fill into its own commit.
- Ruling 2: paths outside the plan's Task 18 list were edited because the suites are meaningless or red without them: `tests/fixtures/sfc/live-policy.patch` (it no longer applied), `scripts/sfc-contracts.test.mjs` and `connected-studio-media.test.mjs` (policy pins), `tests/e2e/connected-studio-static.spec.ts` and `connected-studio-runtime.spec.ts` (CI cases for the old policy), `scripts/measure-connected-studio-production.mjs` and `measure-connected-studio-vitals.mjs` (their Atlas "no host" gates), the Atlas Ground comment, and three current-state records (`ARCHITECTURE.md`, `docs/architecture/current-system.md`, `docs/testing/playwright.md`). Cost if wrong: Reviewer R may ask to split.
- Ruling 3: Services and Projects going live with the wide flag is a consequence, not a choice; the policy is per tier.
- Ruling 4: the static-poster cases close both tiers through the test hook instead of relying on the machine's renderer string, because Firefox and WebKit on a Linux runner report a masked renderer and the shipped policy then takes them live. The served-export family and the runtime cases now own the shipped policy. Cost if wrong: the default CI family no longer observes the shipped policy on its own.
- Ruling 5: the three `contact form signal` cases were removed, not rewritten: Task 13 removed the form, the host's suspension logic stays covered by the Node host suite, and the two Task 13 direct-Contact cases were repaired by opening the software gate like every other live case. Cost if wrong: a form returns and three cases are rewritten.
- Ruling 6: the runtime fixture now flips the compact tier only; a future compact packet applies it. Cost if wrong: regenerate it.
- Ruling 7: the paired startup result is reported as FAIL against the plan's 25 ms allowance even though the budget was written for the static release; I did not reinterpret it as an expected cost. The owner then accepted it as an exception (above).
- Ruling 8: the PR stays a draft until Task 22 merges, so the live Contact page does not ship with its two known defects. Task 22 merged first and then this PR, as written.
- Ruling 9: the stray `docs/testing/playwright.md` mention of `sfc-accessibility.spec.ts` was left; no such file exists and the new-route axe cases live in `sfc-runtime.spec.ts`, which ran. Cost if wrong: one sentence.

## Not done, by design or by limit

- **No measured hardware qualification** (owner acceptance, Task 15), no 120 Hz check, no wide recording, no Android phone, no iPhone, no screen reader (NVDA, VoiceOver, Narrator): human items in the plan's matrix.
- **Deployed smoke**: done after the merge (section above).
- **Firefox and WebKit timing**: functional activation only; the wide tier was accepted on Chromium hardware evidence, and Firefox and Safari visitors on a wide screen will get the live scene.
- **An intermittent Contact compact label overlap** (the runtime case above) is carried, not fixed: it reproduces on `main` with the runtime candidate (2 of 24) and on this head (5 of 32), only on the compact profile that is not enabled, and it concerns the same Contact labels that Task 22 binds correctly. It belongs to that packet or to the compact qualification.
- **The compact tier** stays OPEN and static. Task 19 evidence handoff: this receipt, the Task 15 record, and the evidence listed above.

## Validation

Fresh, 2026-10-19, `.worktrees/sfc-18` after `npm ci`, at head `0b470b48` plus this receipt:

- `npm run validate`: exit 0. docs:check 358 Markdown files, 121 document IDs, 38 Skills; `npm test` 975 tests, 974 pass, 1 `todo`, 0 fail; lint 0 errors, 282 warnings (the baseline); typecheck pass; build pass (root export).
- CI on [PR #164](https://github.com/Furlanich/Portfolio/pull/164) at `0b470b48`: `validate` and all four `browser` shards pass. The first draft head (`e45fd8f5`) failed all four shards on the cases described under RED then GREEN, item 4.
- Served-export family, root and `/Portfolio`: 82 passed, 12 skipped, 0 failed each. `measure:connected-studio`: gates passed on both. `verify:static-export`: 16 routes on both.
- Hardware and paired measurements: the tables above.
- Not run: the full Playwright default family locally (CI ran it), the visual-baseline projects (no baseline or page rendering changed for a static visitor; CI's `visual-chromium` passed), `/Portfolio` hardware vitals, Safari and Firefox timing.
