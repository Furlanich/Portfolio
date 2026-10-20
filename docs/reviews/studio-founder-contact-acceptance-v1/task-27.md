# Task 27 / PR 27 — Manual acceptance round: protocol and automatable evidence

**Status: the operator protocol and its result sheets are written and the automatable functional evidence is collected. Every check that needs a person with a screen reader, Safari, Narrator or a physical phone is OPEN: none of them was performed, simulated or inferred.** The wide-tier owner acceptance, the compact tier and every other state recorded in [Task 19](task-19.md) are unchanged. Reviewer R and the human merge of this PR are OPEN.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Code desktop session; the session does not expose reasoning effort. Subagents 0/0 (none, `SINGLE_AGENT`). `superpowers:executing-plans` ran inline; its ledger and review-package scripts parse subagent-style task briefs and this packet is a checklist, so they were not used (the same ruling as Task 19). Self-review only; Reviewer R remains a separate session.

Branch: `codex/sfc-27-manual-acceptance`, cut from `main` at `4a47ba95`. Targets `main`. **Evidence only:** no product code, test, workflow or fixture changed. The files changed are this receipt, [manual-acceptance-protocol.md](manual-acceptance-protocol.md), a one-sentence fact correction in [docs/testing/playwright.md](../../testing/playwright.md) and the entries in the acceptance [index](index.md). The master plan and the Task 19 receipt were not touched.

## Where each item stands

| # | Item (from the Task 19 follow-up list) | State | Evidence, or the exact missing precondition |
| --- | --- | --- | --- |
| 1 | Operator protocol and fill-in checklist | **DONE** | [manual-acceptance-protocol.md](manual-acceptance-protocol.md): deployed URLs for 14 pages, the items to listen for, six session sheets, a phone pass, a Firefox/Safari timing sheet, and an answer key read from the deployed DOM. All sheet cells are blank (NOT RUN) |
| 2 | Functional activation of the live wide tier in Firefox and WebKit, five routes, both locales | **DONE (software/headless, functional only)** | [Probe results](#functional-activation-on-the-deployed-site): Firefox 155.0 and WebKit 26.6 go live on 10 of 10 pairs with one canvas, a 44 px Pause control, and a working Pause/Resume. Their WebGL renderer strings are masked, so this is **not** hardware evidence |
| 3 | Repository production specs in Firefox and WebKit | **DONE** | `sfc-production-firefox` and `-webkit` on a clean local export of `4a47ba95`: **16 passed, 12 skipped, 0 failed**. The 12 skipped are the live-activation cases, which the repository runs in Chromium only, so these specs do not themselves prove activation |
| 4 | Firefox and WebKit **timing** of the live wide tier | **OPEN** | A headless, scripted-scroll, loaded-machine run exists ([below](#headless-frame-intervals-not-a-hardware-measurement)) and is labelled as such. It is not a measurement of Firefox or Safari on hardware and has no verdict. Missing: a physical desktop with Firefox, and a Mac with Safari, a quiet machine and an operator to run section 7 of the protocol; and a threshold, because the plan sets no Firefox or WebKit budget |
| 5 | NVDA with Firefox | **OPEN** | Missing: a Windows machine with NVDA and Firefox and a person who listens and fills session A1. NVDA is not installed here, and no speech can be heard or recorded from this environment |
| 6 | NVDA with Chromium (Chrome or Edge) | **OPEN** | Missing: the same, session A2 |
| 7 | Narrator with Edge | **OPEN** | Missing: a person to run Narrator and listen (session A3). Windows ships Narrator, but its speech cannot be observed from an automated session, and a Narrator pass done by an agent would be inferred, not heard |
| 8 | VoiceOver with Safari (macOS) | **OPEN** | Missing: a Mac, Safari and an operator (session A4). Playwright's WebKit build is not Safari and has no VoiceOver |
| 9 | Physical phone pass: VoiceOver on a physical iPhone, TalkBack on an Android phone, and the static page checks F1 to F8 | **OPEN** | Missing: a physical iPhone and, optionally, an Android phone, and an operator (sessions A5, A6 and protocol section 6). No phone is attached, and an emulated viewport is not a phone |
| 10 | Pause control and legal-contents semantics as a screen reader announces them | **OPEN** | They are items **P** and **C** in A1 to A6. The DOM facts they test are in [Observations](#observations-for-the-people-who-will-listen); axe is not a substitute and is not offered as one |
| 11 | "No form or busy announcement" | **OPEN as a listening result; DONE as a DOM fact** | The DOM has zero form controls and zero `aria-live`, `role=status`, `role=alert` and `aria-busy` elements on all 14 pages in all three engines. Whether anything is *announced* is item **N** and still needs a person |

Nothing above was upgraded because a nearby automatic check passed. The automated rows say what they cover and stop there.

## Functional activation on the deployed site

Method: a read-only Playwright script (kept outside Git with its raw reports; hashes below) opened the public site <https://furlanich.github.io/Portfolio/> headless at 1440×900, default settings, one engine at a time, 14 pages (the five connected routes, Privacy and Terms, both locales). For each connected page it waited up to 8 seconds for exactly one canvas and the Pause control, then focused the control, pressed `Enter`, then `Space`, and read the control after each. It also recorded the structure listed in Appendix A of the protocol, console and page errors, and every request origin. Run on 2026-10-20 from the machine in the [machine record](#machine-record).

| Engine | Pairs live (of 10) | Canvas | Pause | Pause then Resume | Console or page errors | Cross-origin requests |
| --- | --- | --- | --- | --- | --- | --- |
| Chromium 153.0.8010.12, headless | **0** | 0 | absent | not applicable | 0 | 0 |
| Firefox 155.0, headless | **10** | 1 each, `aria-hidden="true"`, `tabindex="-1"` | 44 px high, 125 px (es) or 160 px (en) wide | name `Pausar fondo`→`Reanudar fondo`→`Pausar fondo`, `aria-pressed` `false`→`true`→`false`, `data-state` `playing`→`paused`→`playing`; focus stays on the button | 0 | 0 |
| WebKit 26.6, headless | **10** | 1 each, `aria-hidden="true"`, `tabindex="-1"` | the same | the same, in both locales | 0 | 0 |

- **Chromium headless is static on every page by design.** It reports a SwiftShader software renderer and the capability gate refuses it, so it is a check of the fail-closed gate, not of activation. Hardware Chromium activation on the same site was recorded in [Task 18](task-18.md#deployed-smoke-read-only-2026-10-19-after-the-merge).
- **Firefox and WebKit are not rejected by the gate.** Firefox reports `ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0), or similar`, which is a masked string (this machine's GPU is an RTX 2060); WebKit reports `Apple GPU` on Windows. Neither string identifies the real renderer, so whether the scene ran on a GPU or in software in these two runs is **not known**. They are functional evidence of activation and of the Pause semantics, not hardware evidence.
- All 14 pages, in all three engines, have exactly one H1 and no `form`, `input`, `textarea` or `select`.
- The Home page also gets one canvas in headless Firefox and WebKit and none in headless Chromium on the deployed site. That corrected a sentence in `docs/testing/playwright.md` ("Firefox and WebKit never activate the runtime in headless automation"), which is now wrong and was rewritten; no other fact there changed.
- The Tab order was additionally confirmed by pressing Tab in headless Firefox on Studio (both locales), Founder EN, Contact (both locales): Pause sits after the intro links on Studio and Founder and first in the content on Contact, as Appendix A lists.

### Repository production specs

`npm run build` of this branch (root export, clean `out/`), then `PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=sfc-production-firefox --project=sfc-production-webkit --workers=1`: **16 passed, 12 skipped, 0 failed** in 3.7 minutes. The skipped cases are "the shipped policy takes an eligible wide visitor live and keeps compact and ineligible visitors static", which the spec runs in Chromium only (it needs the controlled hook there). The passed cases are the static-poster, no-engine-request, failed-poster and host-seam cases.

### Headless frame intervals, not a hardware measurement

This is the only timing in the packet and it is **not** timing evidence for Firefox or Safari. The input was a script of 121 `scrollTo` jumps down and 121 back at about 16 ms each (not a smooth scroll gesture; [Task 15](task-15.md#update-after-task-20-2026-10-19-candidate-at-ab177ea2) found that jump input under-draws on Contact), the engines were headless, their renderer strings are masked, and the machine was busy with other sessions (CPU 100 % before the runs and 52 % after, where the Task 15 rule allows 30 %). By the Task 15 rules this run would be INVALID. It is recorded only so the next person knows what a bad run looks like.

| Engine | Page | Interval p50 ms | p95 ms | max ms |
| --- | --- | --- | --- | --- |
| Firefox 155.0 | blank-page control | 16.7 | 16.7 | 28.7 |
| | ten connected pages | 16.7 to 33.3 | 50.0 to 82.7 | 83.3 to 369.0 |
| WebKit 26.6 | blank-page control | 16.0 | 18.0 | 27.0 |
| | ten connected pages | 74.0 to 126.0 | 117.0 to 302.0 | 168.0 to 732.0 |

The intervals are far above the control, which is what a loaded machine plus a software or masked renderer produces; they say nothing about Firefox or Safari on a real GPU. No row is judged. **Firefox/WebKit timing remains OPEN** and the plan sets no threshold for either engine.

### Machine record

Owner desktop (the same named machine as Tasks 3, 9, 15 and 18): Intel Core i3-8100, NVIDIA GeForce RTX 2060 (driver 32.0.16.1088), Windows 11 Pro 10.0.26300. Playwright 1.63.0 on Node v24.14.0 with its bundled Chromium 153.0.8010.12, Firefox 155.0 and WebKit 26.6. Two other Claude sessions were running (sfc-25 and sfc-26 work), which is the likely reason the CPU was busy.

### Raw reports

Kept outside Git (the same convention as Tasks 3, 14, 15 and 18), in the shared notes folder of this session group (`task-27-evidence/`): `func-chromium.json` `93b8b303d568e2ea`, `func-firefox.json` `faaf02e2b16a17df`, `func-webkit.json` `2d0cda2ffe898687`, `timing-firefox.json` `c36b9bf248f415ac`, `timing-webkit.json` `050a5d7fe4e303ca`, and the scripts `probe.mjs` `c776e2452a194a88`, `tab.mjs`, `gl.mjs`, `navvis.mjs` (SHA-256, first 16). The probe is a throwaway analysis script, not a test, and is not committed.

## Observations for the people who will listen

These are facts found while writing the protocol. None is a verdict, and none was fixed here.

- **The deployed page titles are mostly the bare brand.** `<title>` is `FURLANICH` on Founder, Contact, Services, Projects and Privacy in both languages; Studio is `El estudio | FURLANICH` / `About | FURLANICH` and Terms is `Términos y condiciones | FURLANICH` / `Terms and Conditions | FURLANICH`. A screen reader announces the title on load, so five of seven routes announce identically. Item **T** records what was heard so the planning authority can judge it.
- **The Pause control sets both its name and `aria-pressed`.** The name flips between `Pause background` and `Resume background` and `aria-pressed` flips `false`→`true` at the same time (the component documents this: the name states the next action and `aria-pressed` the current one, as on Home). A screen reader may say a phrase such as "Resume background, toggle button, pressed". Whether that is clear or contradictory is a listening result; item **P** asks for the exact words.
- **The Services index cards have long compound names** (number, title, tagline and `Explore the service` in one link). Item **K** asks how they sound.
- **The Spanish pages are `lang="es-AR"`.** Item **T** asks whether the voice switches.
- **Static state differs by page.** Studio, Founder and Contact show `Static background` / `Fondo estático` as plain text where the control would be; Services and Projects show nothing there. The static rows of the protocol account for that.
- **At 1440 px there is one visible `Primary navigation`**; a second sits in a closed disclosure and is `display: none` (verified at 1440 and 390 px).
- **The graph words are `aria-hidden`.** The labels (`Context`, `Inquiry`, `Conversation` on Contact, and the other pages' words) live in an `aria-hidden` ground layer. Item **D** checks that no reader exposes them.

## Rulings

- Ruling: **Chromium is not run for activation, and no headed browser was opened.** Why: the packet says to run Firefox and WebKit headlessly and label them; headless Chromium is correctly static, and a headed Chromium on hardware was already recorded in Task 18. Cost if wrong: a headed run adds a row; it needs the owner's desktop window.
- Ruling: **the timing run is reported even though it is invalid by the Task 15 rules.** Why: hiding a bad run would be worse than labelling it, and the protocol needs the next operator to know what to expect. Cost if wrong: delete one table.
- Ruling: **the protocol accepts a stated sampler (Appendix B, a page-side `requestAnimationFrame` interval counter) in place of the Task 15 collector for Firefox and Safari.** Why: the collector drives Chromium over CDP and `--browser=firefox` only checks that the page goes live, so no instrument for these engines exists. The sampler measures presentation cadence only and the protocol says so. Cost if wrong: a better instrument replaces Appendix B.
- Ruling: **the protocol asks for three loads per page pair in the timing sheet and calls fewer a smoke run.** Why: the Task 15 rule for a counted pair, the nearest existing standard. The plan sets no Firefox or WebKit rule. Cost if wrong: a different count.
- Ruling: **the manual item set (T, L, H, K, P, N, D, C) and the acceptance wording are mine.** Why: the task named headings, landmarks, link order, Pause semantics, legal contents navigation and no form/busy announcements; T and D were added from the DOM findings above. Cost if wrong: the planning authority edits the item table; no result depends on it yet.
- Ruling: **the PASS conditions in the protocol are my reading of DESIGN-IX-A11Y and DESIGN-SFC-V1, not new requirements.** Where a condition is not stated in an approved record (the page titles, the double signal on Pause), the protocol asks the operator to record, not to pass or fail. Cost if wrong: an item is tightened.
- Ruling: **`docs/testing/playwright.md` was edited for one stale sentence only.** The statement that Firefox and WebKit never activate the runtime in headless automation is false for the deployed Home and connected pages, so it was rewritten with the observed renderer behavior. `docs/index.md` was not edited. Cost if wrong: revert one bullet.
- Ruling: **the acceptance index gained entries for the two new files and the Task 27 state, not a rewrite of any closed item.** Cost if wrong: remove the lines.
- Ruling: **a stray background `npm ci` collided with a foreground one in this worktree and was cleared with a fresh install.** No file in the repository was affected; `node_modules/` and `out/` are ignored. Cost if wrong: none.

## Which checks need a human operator

1. **Screen readers on Windows:** NVDA with Firefox (A1), NVDA with Chromium (A2) and Narrator with Edge (A3) on the 14 pages and two static states, with the items T, L, H, K, P, N, D and C of the protocol.
2. **VoiceOver with Safari on a Mac (A4).**
3. **A physical iPhone with VoiceOver (A5)** and, optionally, **a physical Android phone with TalkBack (A6)**, plus the static-page checks F1 to F8.
4. **Firefox and Safari timing on a quiet physical desktop and Mac** (protocol section 7), and the planning authority's threshold for what those numbers mean.

## Verification

Run on this branch after the last edit, 2026-10-20:

- `npm run docs:check`: **passed**, 365 Markdown files, 123 document IDs, 38 Skills.
- `npm test`: **982 pass, 0 fail, 0 skipped, 0 todo**, the same count the Task 19 receipt records for `main`.
- The functional probe and the production specs are described above with their results. No application source, test, workflow or fixture changed, so `lint`, `typecheck` and `build` were not re-run beyond the export build used for the production specs (it built).

## Self-review

I checked every deployed claim against the probe output (the per-engine totals were recomputed from the JSON after the run: pages, live count, errors, cross-origin origins, forms, controls and live regions), the capability rules against `lib/connected-studio/capability.ts` and `getTierForWidth`, the Pause semantics against `ConnectedPauseControl.tsx`, the static-state differences by loading all ten connected pages in Chromium, and the graph words by reading them from the live Firefox DOM. I did not check anything a person would hear, and the receipt says so. One unverified instrument was removed before it reached the protocol: a page-side counter of `requestAnimationFrame` calls at rest gave results I could not interpret (0 calls at rest and 187 after a Pause click on Services in Firefox), so it is not offered.
