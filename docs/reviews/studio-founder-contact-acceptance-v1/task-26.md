# Task 26 / PR 26 — Dedicated candidate CI job

**Status: READY FOR HUMAN REVIEW ([PR #173](https://github.com/Furlanich/Portfolio/pull/173), open, not merged).** The `candidate` job exists and is green on a real CI run: 90 of 90 cases passed on the first attempt in 7m21s ([run 39426095562](https://github.com/Furlanich/Portfolio/actions/runs/39426095562)). The job closes the "dedicated candidate CI job" item that the [Task 19 closeout](task-19.md) carried as OPEN. It does not accept the compact tier (Task 25) or the manual round (Task 27).

Agent usage: primary Claude Sonnet 5.5 (`claude-sonnet-5-5`; the session does not expose reasoning effort); `SINGLE_AGENT`, subagents 0/0. Self-review only; no independent reviewer has read this PR.

Branch/worktree: `codex/sfc-26-candidate-ci` in the `sfc-26-candidate-ci` worktree. It is **stacked on [PR #172](https://github.com/Furlanich/Portfolio/pull/172)** (`codex/sfc-19-closeout`, not merged when this was written), because the `docs/testing/playwright.md` bullets this task rewrites exist only there. The PR targets `main`, so until #172 merges it also shows #172's two commits; review the commits after `4a47ba95`.

## What changed

- `.github/workflows/ci.yml`: a new `candidate` job (the file Task 10's owned paths forbade it to touch). It runs on every pull request to `main` or `codex/sfc-integration`, as the workflow already did.
  - **Same container as `browser`:** `mcr.microsoft.com/playwright:v1.63.0-noble` with `--user 1001 --init --ipc=host`. A test pins the tag to the locked `@playwright/test` version.
  - **Provider traffic blocked:** the container also gets `--add-host formspree.io:127.0.0.1` and `www.formspree.io`, so an unmocked request to the inquiry provider cannot leave the container. A step resolves both names with `getent ahosts` (the way the browser resolves them) and fails unless they are exactly `127.0.0.1`, before any case runs.
  - **Steps, in order:** `npm ci`; the provider guard; `verify-clean`; `apply --kind=combined --expect-head=${{ github.sha }}` (commercial and live-policy patches); `npx playwright test --workers=2` under `SFC_TEST_MODE=candidate`; then, under `if: always()`, a cleanup that restores the candidate only when one is still applied and ends with `verify-clean`; then an `if: always()` upload of `playwright-report/` and `test-results/` as `playwright-report-candidate-<run>-<attempt>`, kept 7 days.
  - **Never deployable:** no build, no publish step, no secret, the workflow's existing read-only `contents: read` token, and `--expect-head` binds the patches to the checked-out commit. The `validate` job still rejects any QA marker or unrestored candidate.
  - **Budget:** `timeout-minutes: 30` (target 20). No timeout, case or assertion was changed.
- `scripts/sfc-ci-budget.test.mjs`: seven new tests of the workflow structure and of the patch deletion (below). The file's `read` helper now normalizes CRLF so the new regexes behave the same in a Windows checkout; the `browser` job test slices only the `browser` job, since a job now follows it.
- `tests/fixtures/sfc/runtime-closure.patch`: **deleted.** `git apply --check` failed on `components/connected-studio/ConnectedStudioEnhancement.tsx` (`patch failed: ...:628`) at the start of this task, as Task 19 reported; `git grep` found no script, test or workflow that uses it (only the historical mentions in the Task 8 receipt, the completed plan, the Task 19 receipt and the review index, none of which I edited). The two live patches stay.
- `docs/testing/playwright.md`: the two bullets that said the patch was stale and the job was never added now say the patch was deleted and describe the job and its budget. Nothing else in that file changed.

## RED then GREEN

`scripts/sfc-ci-budget.test.mjs`, before the workflow and the deletion existed: **7 of 16 failed on their stated assertions** ("ci.yml defines a candidate job", "the stale Task 8 fixture is deleted", and so on), while the 9 existing cases passed. After the change: **16 of 16 pass.** The tests cover: the job and its 30-minute limit, the pinned image, `SFC_TEST_MODE: candidate` and no sharding; apply of the combined kind before the run, bound to `github.sha`; the `--add-host` entries and the guard step before the run; an `if: always()` restore after the run that ends in `verify-clean`; the always-upload with a unique name and 7-day retention; no `secrets.`, no deploy or Pages step, no build; and the deleted patch with the two live patches still present. They read the YAML as text, like the existing CI-shape tests, and do not execute it, so the real run below is the proof that the job works.

## Real CI results

| Run | Head | Candidate job | Evidence |
| --- | --- | --- | --- |
| [39422491566](https://github.com/Furlanich/Portfolio/actions/runs/39422491566) | `82d427dd` | **FAILED in 1m02s, as designed, on my bug** | The guard step printed `formspree.io does not resolve to loopback`. The container was created with both `--add-host` entries (visible in the `docker create` line), so the block was real; my check was wrong. `getent hosts` returns the IPv4-mapped form (`::ffff:127.0.0.1`), which my pattern `^127\.0\.0\.1 ` did not match. No case ran. The cleanup step ran after the failed step (so `if: always()` worked), found the tree clean and exited 0. |
| [39426095562](https://github.com/Furlanich/Portfolio/actions/runs/39426095562) | `b430cdf1` | **PASSED in 7m21s** | The guard now uses `getent ahosts` and `sort -u`. `Running 90 tests using 2 workers` then `90 passed (6.2m)`: no failures, no flaky retries, no skipped. The cleanup log read `A QA candidate (combined) is still applied: restore it first.`, then `Restored the combined candidate.`, then `No QA candidate is applied and no QA marker is in application source.` The artifact `playwright-report-candidate-39426095562-1` (3.4 MB) was uploaded, expiring after 7 days. |

Timings of the passing job from GitHub's step timestamps: container start 37 s, checkout and setup-node 14 s, `npm ci` 10 s, patches 1 s, **Playwright 6m12s**, cleanup and upload 2 s. The job finished well inside the 20-minute target. It runs alongside the four `browser` shards, so it adds no wall-clock time to the Quality check: the slowest shard of the first run took 20m23s.

The four `browser` shards were unaffected by the new job. In the first run (`82d427dd`, all four green) they took 11m57s, 20m23s, 10m32s and 20m08s from GitHub's started and completed timestamps, against a 35-minute limit; the second run's shards are on the PR's checks. The candidate job's wall time is shorter than the slowest shard, so the Quality check finishes when the shards do.

## What this does and does not prove

- It proves the 90 candidate cases run in CI against the real combined patches on the Linux Playwright image, restore afterwards, and keep their evidence. The count is the one `playwright test --list` reports under `SFC_TEST_MODE=candidate` (90 in 2 files: `contact-commercial.spec.ts` and `sfc-runtime.spec.ts`), re-measured at the start of this task.
- **The Contact compact label overlap** ([Task 18](task-18.md), owned by Task 25) did **not** flake this job in its one passing run. One run cannot show that it never will. If it flakes the job later, that is a Task 25 finding: do not weaken the test, and do not raise the retry count here.
- **The negative path of the block is evidenced by the guard, not by a request.** The guard proves the provider names resolve to loopback inside the container the cases run in. No case sends an unmocked provider request today, because the commercial form is gone (ADR-CONTACT-DIRECT-CHANNELS); the existing case that routes `formspree.io` and asserts no request still does so. I did not add a case that makes a real provider call fail.
- The workflow is YAML read as text by the unit tests. Only a real run proves it; the table above is that run. Branch protection was not changed. Whether the `candidate` check is required to merge is a repository setting the owner controls, outside this packet.

## Validation

Fresh, 2026-10-20, in this worktree after `npm ci` (Windows):

- `npm run validate`: **passed.** Docs check (364 Markdown files, 123 document IDs, 38 Skills), `npm test` **989 pass, 0 fail**, lint, typecheck and the production build all exited 0.
- A first `npm test` in this worktree before `npm ci` showed 2 failures in `connected-studio-harness.test.mjs` ("Cannot find module ... node_modules/@playwright/test/cli.js"). The worktree had no `node_modules`; the failures disappeared after `npm ci` and are unrelated to this change.
- Locally, `apply --kind=combined --expect-head=<HEAD>`, `verify-clean` (reports the applied candidate), `restore --kind=combined` and `verify-clean` again were run once as a smoke test of the job's commands; the tree was clean afterwards.

## Rulings

- Ruling: **the job applies `--kind=combined`.** Why: the task names the commercial and live-policy patches, and `combined` applies both, the only kind that exercises `contact-commercial-*` against the commercial release id and `sfc-runtime-chromium` against the compact tier together. Cost if wrong: a one-word change per step, and a test.
- Ruling: **the provider is blocked with `--add-host` to loopback, not with a proxy or a firewall rule.** Why: the container runs as user 1001 without root, so it cannot edit `/etc/hosts` or iptables, and `--add-host` is an ordinary `docker create` option GitHub accepts. It blocks the one provider the product ever called (Formspree). It does not block arbitrary hosts, and `wa.me`, `github.com` and the other external links are never fetched by the cases. Cost if wrong: add the new provider to the options and to the guard.
- Ruling: **no extra case or timeout was added to prove the block, and no retry setting was changed.** The suite's existing `retries: 1` under `CI` stays; no flaky retry occurred. Cost if wrong: a stricter `--retries=0` job would turn a flake into a failure, which the Task 25 owner may prefer.
- Ruling: **this PR is stacked on #172 instead of branching from `main`.** Why: the two doc bullets I had to rewrite are #172's text. Cost if wrong: rebase onto `main` after #172 merges; the conflict is limited to `docs/testing/playwright.md`.
- Ruling: **`.github/workflows/ci.yml` and `docs/testing/playwright.md` are CRLF in a Windows checkout and LF in git, and I kept that.** Cost if wrong: none; git normalizes.
- Ruling: **a stray scratch script (`e.cjs`) was committed by mistake in `6d8253af` and removed in the next commit.** It never ran in CI and the tree has no trace of it; I did not rewrite pushed history. Cost if wrong: one noisy commit pair.

## Not done, on purpose

- No product code, master plan or Task 19 receipt was touched.
- No change to branch protection or required checks.
- No hardware or manual evidence (Tasks 25 and 27).
