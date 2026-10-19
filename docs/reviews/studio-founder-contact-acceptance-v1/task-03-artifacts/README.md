# Task 3 measurement artifacts

The machine-readable reports behind [risk-baseline.md](../risk-baseline.md) and the [Task 3 receipt](../task-03.md). They are the exact files the scripts wrote on 2026-10-15 at head `7fc2a6c6` plus the Task 3 collectors; none was edited. Later tasks compare against them with the same method.

| File | Written by | Content |
| --- | --- | --- |
| `startup-root.json`, `startup-base.json` | `measure-connected-studio-vitals.mjs --startup-baseline` (root, then `NEXT_PUBLIC_BASE_PATH=/Portfolio`) | Per route, locale and profile: critical and first-load JS, startup, evaluation and task CPU of five cold journeys, the longest task, the script list, and each journey's trace SHA-256. |
| `production-root.json`, `production-base.json` | `measure-connected-studio-production.mjs --skip-build` | Optional closure per destination with headroom, static first-load JS of the reading routes, posters. |
| `hardware-wide-run{1,2,3}.json`, `hardware-wide-headed-run{1,2,3}.json` | `measure-connected-studio-hardware.mjs --tier=wide` (non-headed, then `--headed`) | The full protocol runs on the named desktop. |
| `diag{1,2,3}-report.json`, `diag{1,2,3}-frames.json` | the same script with `--idle-seconds=10 --frames-out` (diagnostic 1 also `--trace-pipeline`) | Diagnostic runs and every traversal frame (timestamp, CPU submit, GPU time, draw calls) for the late-frame attribution. |

## Raw traces (not committed)

The 160 per-journey startup traces (80 at root, 80 at `/Portfolio`) and the 408,632,652-byte pipeline trace are about 1.2 GB, and one file exceeds GitHub's 100 MB limit, so they are not in Git. They are archived in the git-ignored `.superpowers/reports/sfc-03/` of the main checkout (`D:/Projects/NextJS/Portfolio/`), outside every worktree, so removing `.worktrees/sfc-03` does not delete them:

- `traces/root/<route>-<locale>-<profile>-<n>.json` and `traces/Portfolio/<route>-<locale>-<profile>-<n>.json`, `n` from 1 to 5, in the order of `journeysDetail` in the matching startup report.
- `diag1-pipeline.json`, SHA-256 `7531732a4b6fc04420d8d9b5c918407a5446ba0d7523e8ab38998391f97fa9aa`.
- The `tracePaths` and `traceDir` inside the startup reports still name the worktree path the traces were first written to. Map them by file name to the folders above. All 160 hashes in `journeysDetail[].traceSha256` and the pipeline hash were re-verified after the move: no mismatch.

The folder is local to this computer and is not backed up by the repository. A trace needed beyond this machine goes to a release asset or storage the owner chooses; the hashes above identify it.
