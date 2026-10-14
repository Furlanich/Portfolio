---
id: REVIEW-SPF-W7-2026-10-14
type: checkpoint-receipt
status: PROPOSED
related:
  - PLAN-SPF-V1
  - REVIEW-SPF-ACCEPTANCE-V1
  - REVIEW-SPF-W6-2026-10-13
  - DESIGN-SPF-V1
  - GOV-AGENT-USAGE
last_verified: 2026-10-14
---

# W7 checkpoint — 2026-10-14

**Checkpoint result: PASS on `77ccb9f1`, with one disclosed first-attempt failure.** Every command exited 0 except the first accessibility run, which failed two cases on a cold development-server load and passed 39 of 39 on an unchanged rerun. The connected budgets are within their limits and `CONNECTED_LIVE_POLICY` matches the evidence (both tiers off). W8 (Task 10) is unlocked, subject to the open items in the [acceptance record](index.md#open-items-and-owners).

## Source and execution

Source: merged `main` / `origin/main` at `77ccb9f1433a6af6c8d0de5d6c093577b0e7aa2e`. It contains [Task 9, PR #138](https://github.com/Furlanich/Portfolio/pull/138) (`1342232f`) and the [frame-pacing PR #139](https://github.com/Furlanich/Portfolio/pull/139) (`77ccb9f1`), and with them every earlier task. A new clean detached worktree was created from that commit at `.worktrees/spf-w7-checkpoint`, followed by a fresh locked `npm ci` (exit 0). Conditions: Windows, the root base path for everything except the `/Portfolio` export, `PLAYWRIGHT_PORT=3309`, no external server and no CI retry setting. The only tracked change afterwards was `next-env.d.ts`, which `next dev` rewrites.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`); subagents 0/0. `SINGLE_AGENT`. This session implemented Task 9's corrections and the frame-pacing PR; the owner asked it to run the checkpoint, as for W4 to W6. It reviewed no pull request it gates. Logs stay under the ignored `.superpowers/` workspace.

## Fresh checkpoint commands

| Command | Result |
| --- | --- |
| `npx playwright test --list` | Exit 0; 2749 tests in 31 files |
| `npm run validate` | Exit 0: docs 318 Markdown files / 109 IDs / 38 Skills; **519/519** Node tests; lint 0 errors / 282 existing warnings; typecheck and clean root build PASS |
| Root `npm run verify:static-export` | Exit 0; 14 routes at `/` |
| `npm run test:a11y`, first attempt | **Exit 1: 2 failed, 37 passed in 4.0 minutes.** Both failures are `connected-studio-accessibility.spec.ts` › static background › Services es and en: a `page.evaluate` 60-second timeout on the first cold load of a freshly installed worktree's `next dev`. No axe violation was reported |
| `npm run test:a11y`, unchanged rerun on the warm cache | Exit 0; **39 passed** in 1.3 minutes. No source, test, retry or timeout changed (the first-load pattern that earlier checkpoints recorded) |
| `PLAYWRIGHT_SERVE_EXPORT=1 npx playwright test --project=connected-production-chromium --workers=1`, root export | Exit 0; **50 passed** in 1.9 minutes |
| `npm run measure:connected-studio` | Exit 0 (see Connected measurements) |
| `npm run measure:connected-studio-vitals` | Exit 0; ten journeys per locale and profile, 8.9 minutes |
| `npm run measure:immersive` | Exit 0; "Immersive production gates passed" |
| `npm run measure:home-vitals` | Exit 0; "Home web-vitals gates passed" |
| Clean `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` | Exit 0 after removing only this worktree's `.next` and `out` |
| `/Portfolio` `npm run verify:static-export` | Exit 0; 14 routes at `/Portfolio` |
| `/Portfolio` production project | Exit 0; **50 passed** in 2.0 minutes |
| `/Portfolio` `measure:connected-studio --base-path=/Portfolio` | Exit 0 |
| `/Portfolio` `measure:connected-studio-vitals --journeys=3 --base-path=/Portfolio` | Exit 0 (three journeys per locale and profile; it proves path handling, not a different cost) |
| `npm run test:e2e -- --project=immersive-chromium --workers=1` | Exit 0; **236 passed** in 16.7 minutes (W6: 236) |
| `npm run test:e2e -- --workers=1` | Exit 0: **2619 passed / 130 skipped / 0 failed**, no flaky case (1.3 hours; 2749 cases scheduled) |

## Connected measurements

Lab data on one machine, not field data. The shipped policy keeps both tiers off, so every journey is the static page.

| Measure | Root | `/Portfolio` | Limit |
| --- | --- | --- | --- |
| Optional engine closure, every page and locale | 114.4 KiB Brotli, 559.7 KiB raw, two chunks (three 109.7 KiB, scene 4.7 KiB) | the same | 120 KiB |
| Closure fetched by the shipped policy and by each static-preference path (reduced motion, Save-Data, forced colors, a stored context loss) | none, no canvas | none, no canvas | none |
| Posters | 85.1 KiB wide, 49.3 KiB compact | the same | 150 and 80 KiB |
| Services LCP p75 / INP p75, mobile profile | 2248 ms / 72 ms | 2144 ms / 64 ms | 2500 / 200 ms |
| Projects LCP p75 / INP p75, mobile profile | 2200 ms / 64 ms | 2112 ms / 56 ms | 2500 / 200 ms |
| Services LCP p75 / INP p75, desktop profile | 548 ms / 48 ms | 512 ms / 24 ms | 2500 / 200 ms |
| Projects LCP p75 / INP p75, desktop profile | 824 ms / 56 ms | 796 ms / 40 ms | 2500 / 200 ms |
| Layout shift from the enhancement, whole-page shift | 0, 0 | 0, 0 | 0 |

Mobile LCP stays within about 10% of its limit on the throttled profile and should be watched.

## Home regression (read-only)

`measure:immersive` passed on the owner-accepted baseline: lazy runtime 112.1 KiB Brotli in two chunks (2.4 and 109.7), headroom 7.9 KiB, listener count 529 to 529. `measure:home-vitals` passed: mobile LCP p75 2296 ms static and 2312 ms enhanced, INP p75 24 and 64 ms; desktop LCP p75 560 and 556 ms, INP p75 16 and 32 ms; whole-page layout shift at most 0.0437 (limit 0.1) and none from the enhancement. Home's existing accepted exceptions and status are reported independently; the new routes inherit no headroom exception.

## Pass condition

The plan's W7 condition: "Every budget within limits; `CONNECTED_LIVE_POLICY` matches the OD-4 evidence." Every budget this checkpoint measures is within its limit (the closure, the posters, LCP, INP and the enhancement shift). The budget it does not measure, the active-scroll frame interval on hardware, is **not** within its limit on the desktop candidate ([protocol](task-9-hardware-protocol.md), [frame pacing](task-9-frame-pacing.md)), which is why both live tiers are off; the policy `{ wide: false, compact: false }` matches that evidence. Nothing here is a hardware or screen-reader PASS.

## Acceptance

- **At green W7**, Task 9 releases ACCEPTANCE, MEASUREMENT and the SHARED-TESTS blocks it held, and the owner-authorized transfers of `scripts/serve-static-export.mjs` and `scripts/connected-studio-harness.test.mjs` and of the frame-pacing host path `components/connected-studio/ConnectedStudioEnhancement.tsx`. Released paths are not blanket permission for later work.
- W8 (Task 10) has Task 9 merged and a green W7 and may proceed. Its start gate also asks that OD-4 be recorded for every device and screen-reader item: they are recorded OPEN with policy `false` in the [acceptance record](index.md#od-4-sheet), citing the owner's 2026-10-13 statement as the plan directs.
- Still OPEN, unchanged by this checkpoint: the owner's manual production review, Task 3 and Task 5 owner acceptance, the LOW preflight omission, the OD-3 wording difference, every device, screen-reader, real-zoom and hardware item, and the second late-frame cause.
