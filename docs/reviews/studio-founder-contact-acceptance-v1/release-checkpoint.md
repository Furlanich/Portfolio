# Release checkpoint — Task 17

**Verdict: PASS (read-only), 2026-10-19.** The coherent Task 16 release is live and matches its reviewed build. This checkpoint does not decide anything for Task 18 beyond recording that its "17 PASS" dependency is met; the interactive graph objective stays OPEN.

## Deployed identity

| Item | Value |
| --- | --- |
| Public site | `https://furlanich.github.io/Portfolio/` (default GitHub Pages project URL; no custom domain) |
| Source | `main` at `5d8055a31102eb2f193f7c06b879502562b7437b`, merge of [PR #157](https://github.com/Furlanich/Portfolio/pull/157), merged 2026-10-19 04:50:53 UTC |
| Deploy run | [39201533556](https://github.com/Furlanich/Portfolio/actions/runs/39201533556), `deploy` job success, completed 04:51:48 UTC |
| Published tree | `gh-pages` at `da2f6a5821cf437cacfd8073a0f48b529b1c5525`, "deploy: 5d8055a3…", 04:51:45 UTC |
| Prior public state | `main` `cd8c0d45` (PR #142), [run 38728080880](https://github.com/Furlanich/Portfolio/actions/runs/38728080880), 2026-10-15 |
| Observed | 2026-10-19, after the deploy; live `Last-Modified` for `/terminos/` is 04:52:04 GMT |

## Evidence summary

Full table and method in [task-17.md](task-17.md). In short: six live routes are byte-identical to the `gh-pages` tree; the repository verifier accepts that tree (16 routes at `/Portfolio`); both Contact locales have one H1, one main, no form control, the three exact native destinations and only same-host requests; Privacy and Terms are published with their reciprocal links, Footer links and no draft, simulation or processor wording; retired project and process routes return 404.

## Gate status

| Gate | State |
| --- | --- |
| Coordinated release deployed | DONE: run above |
| Read-only deployed routes, links and disclosures (Task 17) | PASS |
| Formspree account, provider probe, delivery and deletion receipts | NOT APPLICABLE by [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md); not PASS, never inferred |
| Counsel disposition | NOT APPLICABLE as a repository gate; no legal sufficiency is certified here |
| Reviewer R on this documentation PR; human merge | OPEN |
| Physical hardware qualification (Task 15), live graph tiers (Task 18) | OPEN, independent of this checkpoint |
| Manual screen-reader pass | OPEN, human operator |
| Rollback | Not triggered; no contradicting public failure found. Procedure in [operations.md](operations.md) |

## Carried from the release

The Task 16 receipt records mobile startup CPU rows that are OPEN or FAIL against the 25 ms allowance, accepted by the owner on 2026-10-18 as the poster's design cost, and Contact's 0.35 scene opacity as unimplemented. Neither is a Task 17 finding and neither changes here.
