# Task 23 / PR 23 — Dispose the live scene when Save-Data changes at runtime

**Status: implemented and verified; Reviewer R's finding SFC-18-22-02 is repaired.** Independent review and the human merge are OPEN. The packet number 23 is assumed (the owner told me to proceed on Reviewer R's findings in [PR #167](https://github.com/Furlanich/Portfolio/pull/167)); the planning authority may renumber it. The other finding of that review, SFC-18-22-01 (Contact's 0.35 opacity), is **not** part of this packet: it needs the owner's design decision and poster recapture and is proposed separately as Task 24.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`; the session does not expose reasoning effort); subagents 0/0 (none). Self-review only; Reviewer R remains a separate session.

Branch/worktree: `codex/sfc-23-save-data-runtime` at `D:/Projects/NextJS/Portfolio/.worktrees/sfc-23`, cut from `origin/main` at `e1de0c45` (the merge of PR #166, after Tasks 18 and 22). Targets `main`.

## The finding, verified before acting

[DESIGN-SFC-V1](../../design/studio-founder-contact-v1.md), "Touch, rest, masks and lifecycle": "A runtime preference change cancels and disposes live resources." Reviewer R reported that a visitor who turns Save-Data on while a scene is live keeps the renderer, labels and Pause control, because the host listens to reduced-motion and forced-colors changes only.

I confirmed it by reading the code (`ConnectedStudioEnhancement.tsx` subscribes to two `matchMedia` queries and nowhere to the connection's `change` event) and by reproducing it in a test that first failed (below). Since Task 18 every wide visitor on all five connected pages meets it, and the host serves all five routes, so one repair covers them.

## What changed

- `components/connected-studio/ConnectedStudioEnhancement.tsx`: the host subscribes to `navigator.connection`'s `change` event; when `saveData` is true it takes the same path as reduced motion (`fallBack('static')`: dispose the scene, keep a focused Pause control as the inactive "Static background" control, restore the poster). Turning Save-Data off again restarts nothing, a pending import is cancelled by the same path (the engine cannot attach afterwards), a later route reads the preference at its own activation, and the listener is removed on cleanup. Nothing else in the host, the engine or any token changed.
- `scripts/connected-studio-host.test.mjs` and `tests/e2e/connected-studio-runtime.spec.ts`: the failing-first cases below.
- `docs/architecture/current-system.md`: one sentence for the runtime Save-Data rule.

## RED then GREEN

1. Node host suite (executes the real React effect with a deferred import), legacy and profile hosts: a harness connection became a real change-event target first. **6 of 66 cases failed on their stated assertions** (the live scene is disposed when Save-Data turns on and nothing restarts it; a pending import is cancelled by the change event itself; the listener is removed on cleanup). GREEN: **66 of 66**.
2. Browser, `connected-studio-runtime.spec.ts`, `immersive-chromium`, shipped policy with only the software gate open, on Services and on Studio: the page gets a connection that fires `change`. Against the unmodified host both cases **failed with "the live canvas is disposed: expected 0, received 1"**, which is the reviewer's reproduction. With the repair both pass: the canvas goes, the mode reads static, no Pause control remains, turning Save-Data off restarts nothing, and the next route (reached by an App Bar link) stays static with no canvas.
3. Hardware (headed Chromium, the owner's RTX 2060, committed export, no hook, a connection that fires `change`): **all ten route and locale pairs go from one canvas to zero within 1.2 s** of the Save-Data event. This is the reviewer's ten-page reproduction, now passing.

## Validation

Fresh, 2026-10-19, `.worktrees/sfc-23` after `npm ci`:

- `npm run validate`: exit 0. docs:check 360 Markdown files, 121 document IDs, 38 Skills; `npm test` 983 tests, 982 pass, 1 `todo` (the Task 14 Contact-opacity placeholder, which is Task 24's), 0 fail (977 at the base, plus this packet's 6); lint 0 errors, 282 warnings (the baseline); typecheck pass; build pass.
- `connected-studio-runtime.spec.ts`, `immersive-chromium`, full file at two workers: 64 passed, 3 failed with "browserContext.close: Test ended" (SwiftShader timeouts under load); those three pass in isolation at one worker, 3 of 3. The two new cases are among the 64.
- `sfc-runtime.spec.ts`, candidate mode, `sfc-runtime-chromium`, one worker: **71 passed, 0 failed, 0 skipped** (the Task 12 `fixme` cases were removed by Task 22).
- Hardware: all ten pages go from one canvas to zero on the Save-Data event (above).
- Not run: the visual projects (no rendering changed for any visitor), the served-export family (no emitted-file change beyond the host chunk's bytes), Firefox and WebKit.

## Rulings

- Ruling: the repair uses the existing `fallBack('static')` path rather than a new one, so Save-Data and reduced motion cannot drift apart. Cost if wrong: a Save-Data-specific fallback copy.
- Ruling: the listener is guarded by `saveData === true`, so a change event that reports Save-Data off does nothing, which is the "never restarts" rule the design states for the other preferences. Cost if wrong: none observed; a restart rule would need its own design.
- Ruling: the browser cases run in `immersive-chromium` (the default CI family) rather than the candidate-only family, because the shipped wide policy now makes the pages live there under the software gate. Cost if wrong: move them to the candidate project.
- Ruling: the numbering (23, and 24 for the opacity finding) is mine; the plan says the planning authority assigns numbers. Cost if wrong: renumber.

## Not done

- SFC-18-22-01 (Contact's 0.35 scene and label opacity): Task 24, pending the owner's decision between applying the specified multiplier (which also means recapturing both Contact posters and approving changed visual baselines) and recording full brightness as the intended design.
- No physical-phone, screen-reader or Firefox/WebKit check of the change event: Chromium only. To my knowledge Firefox and Safari do not expose `navigator.connection`, so the event matters for Chromium-based browsers; that was not re-checked here.
