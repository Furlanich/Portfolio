---
id: REVIEW-SPF-W6-2026-10-13
type: checkpoint-receipt
status: PROPOSED
related:
  - PLAN-SPF-V1
  - REVIEW-SPF-ACCEPTANCE-V1
  - REVIEW-SPF-W5-2026-10-11
  - DESIGN-SPF-V1
  - GOV-AGENT-USAGE
last_verified: 2026-10-13
---

# W6 checkpoint — 2026-10-13

**Checkpoint result: PASS on `4d8d726d`.** Every command exited 0, the full browser matrix has no failure and no flaky case, the Home measurement is unchanged from the W5 rerun, and the posters are within their byte ceilings at both base paths. W7 (Task 9) is unlocked, subject to the open items under [Acceptance](#acceptance).

## Source and execution

Source: merged `main` / `origin/main` at `4d8d726d694ab942b88728b007f7427d72e7a44f`, fetched before and after the run (unchanged). It contains [Task 8 PR #132](https://github.com/Furlanich/Portfolio/pull/132), the independent review and corrections ([#133](https://github.com/Furlanich/Portfolio/pull/133)), the CI limit ([#130](https://github.com/Furlanich/Portfolio/pull/130)), the W5 rerun record ([#131](https://github.com/Furlanich/Portfolio/pull/131)) and the CI-failure fixes that carry the Linux baselines ([#135](https://github.com/Furlanich/Portfolio/pull/135)).

A new clean detached worktree was created from that commit at `.worktrees/spf-w6-checkpoint`, followed by a fresh locked `npm ci`. Conditions: Windows, root base path for everything except the `/Portfolio` export, `PLAYWRIGHT_PORT=3308`, no external server, no export-serving override and no CI retry setting. After the matrix the only tracked change was `next-env.d.ts`, which `next dev` rewrites.

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`); subagents 0/0. `SINGLE_AGENT`, run with `superpowers:executing-plans`. This session implemented Task 8 and the CI fixes; the owner asked it to run the checkpoint, as for W4 and W5. It did not review any PR it gates.

## Fresh checkpoint commands

Logs stay under the ignored `.superpowers/` workspace.

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0 |
| `npm run validate` | Exit 0: docs 314 Markdown files / 108 IDs / 38 Skills; 497/497 Node tests; lint 0 errors / 282 existing warnings; typecheck and clean root build PASS |
| `node --test scripts/connected-studio-media.test.mjs` (the W6 poster byte check) | Exit 0; 10/10, including the wide (150 KiB) and compact (80 KiB) ceilings, URLs at the root and `/Portfolio`, both live tiers off and no poster preload |
| Root `npm run verify:static-export` | Exit 0; 14 routes at `/` |
| `npm run test:a11y` | Exit 0; 24 passed in 1.6 minutes (W5: 24) |
| `npm run test:e2e -- --project=immersive-chromium --workers=1` | Exit 0; 236 passed in 16.3 minutes (W5: 225; the difference is the Task 8 and CI-fix runtime coverage) |
| `npm run measure:immersive` | Exit 0; "Immersive production gates passed" |
| Clean `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` | Exit 0 after removing only this worktree's `.next` and `out` |
| `/Portfolio` `npm run verify:static-export` | Exit 0; 14 routes at `/Portfolio` |
| `npm run test:e2e -- --workers=1` | Exit 0: **2548 passed / 130 skipped / 0 failed**, no flaky case (1.3 hours; 2678 cases scheduled) |

Pass condition from the plan: "Posters within byte ceilings at both base paths." The poster files are identical at both paths (wide 87164 B, compact 50434 B, ceilings 153600 and 81920), the media test passes, and the browser evidence covers both: the full matrix above ran at the root path, and the browser job of [PR #135's CI](https://github.com/Furlanich/Portfolio/actions/runs/38399744536) (head `bd9f3983`, the code of this commit plus the merge) passed at `/Portfolio` in 51 minutes 46 seconds, including the static poster cases and the eleven Linux baselines. The W5 conditions also hold: the connected runtime spec is green in `immersive-chromium`, and the Home measurement is unchanged.

## Home measurement

Unchanged from the accepted W5 rerun: lazy runtime 112.1 KiB Brotli in two chunks (2.4 + 109.7; gate 120 KiB), headroom 7.9 KiB (the owner accepted this on 2026-10-11, with a floor of 6 KiB), listeners 529 and 529 in the two sampled states. Task 8 does not touch Home.

## Findings

None new. Notices, distinct from failures: existing vendored-script lint warnings, the module-type warning, a stale Browserslist notice, reduced-motion and software-renderer console notices. No load-sensitive failure occurred in this run, unlike the W5 rerun; the cases that did fail on CI earlier were fixed by [PR #135](https://github.com/Furlanich/Portfolio/pull/135) (see its [diagnosis](task-8-ci-failures.md)).

## Serial lock ledger

Task 8 is merged, so its locks are released: MEDIA, CONNECTED-GROUND, VISUAL-BASELINES (the Services/Projects subtree and the poster subtree), the `media-manifest`, Ground and `ProjectDossier` transfers, and the CONNECTED-ENGINE and CONNECTED-HOST transfers the owner gave Task 8 on 2026-10-12 (the node look and the start pose). Task 9 acquires what it needs by explicit serial transfer. No lock is held.

## Acceptance

The checkpoint is accepted as a record of what ran; it is not owner acceptance of Task 8's design. Still OPEN: the owner's look at the live nodes, the start pose and the bead (no motion recording exists, and the owner approved the four posters and the eleven Windows baselines only); a fresh independent separate-session re-review of the [Task 8 corrections](task-8-review-corrections.md), whose implementer was the original reviewer; the screen-reader, real-zoom and physical-device checks the owner performs under OD-4; the Task 9 hardware evidence; and final SPF acceptance. Both live tiers stay false. Publish as draft until human merge.
