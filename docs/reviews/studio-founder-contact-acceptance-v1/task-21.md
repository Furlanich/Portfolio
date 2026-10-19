# Task 21 / PR 21 — Keep decorative labels out of reading masks while the page scrolls

**Status: repaired on the runtime candidate, with one disclosed exception OPEN for a planning/design decision.** The fade and ordering defects are fixed, and so is Reviewer R's retained-position finding. In the evidence collected, the unchanged Task 15 gesture probe reads 0 violating label-frames on all ten route/locale pairs, the unchanged wheel probe reads 0 on nine of them in every run and on Services/es in 6 of 7 runs, and the SwiftShader browser cases pass. That evidence is one traversal down and back per pair and per probe at 1440×900 on the implementer's desktop GPU (not a quiet hardware run), plus the browser cases.

The exception is Services/es under the wheel probe. A catalogue card's approved 3 px hover lift can put a label up to 3 px into the lifted card for one frame, in 1 of 7 runs at the head. **Whether the zero-violation gate is met therefore depends on the decision in "Open decision: the catalogue-card hover lift" below, and this receipt does not claim it.** Labels at rest and frame cost were unchanged at `0dada242`. The planning authority's acceptance of this packet number, Reviewer R's re-review of the follow-up and its human merge are OPEN.

Agent usage: primary Claude Opus 5.5 (`claude-opus-5-5`), Claude Code desktop session started by the Task 15 wide-tier session; subagents 0/0 (none). Independent review stays a separate session.

Branch/worktree: `codex/sfc-21-label-occlusion` in a Claude Code worktree (`.claude/worktrees/pensive-hawking-5733e1`), cut from `origin/main` at `ab177ea2`, the merge of PR #159 (Task 20). Targets `main`.

Pull requests:
- [#160](https://github.com/Furlanich/Portfolio/pull/160) carried repairs 1 and 2. A human merged it at `26c4653e` (2026-10-19 17:39 UTC) with head `747a270d`, before Reviewer R's finding was addressed.
- [#161](https://github.com/Furlanich/Portfolio/pull/161) carries the review follow-up on the same branch: repair 3 (`e0ec2208` RED, `734607e8` fix) and this revised receipt. It is open for human review.

## Packet

The owner ruled the finding below a product defect and asked for its own remediation packet before the wide hardware collection. The plan's lock and remediation protocol numbers such packets from 20; Task 20 took 20, so this receipt **assumes 21**. The planning authority must accept that number or renumber the packet with the same diff; until then the numbering is **OPEN**.

| Field | Value |
| --- | --- |
| Finding | [Task 15](task-15.md), "Finding outside this packet: decorative labels overlap reading masks while the page scrolls", on `codex/sfc-15-wide-qualification`: during a traversal, labels stay visible over reading masks on Studio, Services and Projects, so a 30-run wide collection would fail those pairs on `labelViolations` |
| Base / dependencies | `main` at `ab177ea2`; blocks Task 15's wide collection and therefore Task 18 |
| Owned paths | `lib/connected-studio/labels.ts`, `lib/connected-studio/types.ts` (`LabelVisibility`), `components/connected-studio/ConnectedStudioEnhancement.tsx` (label layer and scroll path), `components/connected-studio/connected-studio.module.css` (one rule), `scripts/connected-studio-labels.test.mjs`, `scripts/connected-studio-host.test.mjs`, `tests/e2e/support/connected-studio.ts`, `tests/e2e/connected-studio-runtime.spec.ts`, `tests/e2e/sfc-runtime.spec.ts`, `docs/testing/playwright.md` (one sentence), this receipt |
| Locks | Local browser/GPU on the implementer's desktop for candidate browser runs and the probes; no deploy, no measurement lease (the probes are diagnostic, not hardware runs) |
| Not touched | The master plan, the hardware collector (`scripts/measure-connected-studio-hardware.mjs`, owned by the Task 15 branch), design tokens (`--dur-2` stays 160 ms), fidelity, caps, every page component |

## Finding and cause

The labels live in the connected ground, a `position: fixed` layer, so they stay put while the page's reading masks scroll over them. The host re-resolves label visibility from cached document boxes on every scroll frame (`labelLayer.update`, `resolveLabelVisibility`).

The diagnosis used the Task 15 probe extended to read each frame twice: inside an animation-frame callback, and in a task right after the frame's callbacks, which is what the frame paints. It also recorded the label's `data-visible`. On the `ab177ea2` candidate, every violating label-frame in the painted state already had `data-visible="false"`. The host had hidden the label on time, against the right boxes. Two mechanisms kept it showing:

1. **The fade outlived the crossing (main cause).** `.label` has `transition: opacity var(--dur-2)` (160 ms) for every show and hide. At the probe's 800 px/s a mask moves about 128 px in 160 ms, so a correctly hidden label kept showing inside the mask while it faded.
   - Services and Projects masks are legacy masks with no clearance. A label is hidden only once it touches the mask, so its first hidden frames inside the mask are still at full opacity: the "opacity up to 1.0" figures.
   - Studio's scrims add a 24 px clearance, so the hide starts earlier and only the tail of the fade shows: "opacity 0.01 to 0.59".
2. **One frame of ordering (secondary).** On a frame without a scene draw, the scroll path refreshed the labels in a coalesced `requestAnimationFrame` queued during the scroll event. Any animation-frame callback queued earlier, such as a per-frame probe, ran after the scroll had moved the masks but before that refresh. It saw a label the host was about to hide, 1 to 15 px into a legacy mask. The painted frame was already correct. The collector reads labels through `page.evaluate`, after the frame's callbacks, so this alone would not have failed a run.

Candidate causes from the packet brief, tested and ruled out:

- **Stale boxes or `scrollY` at resolution:** the cached mask boxes match the live ones. Document tops were identical at the host's measure, before and after a traversal.
- **Resolution only on draws:** the scroll path refreshes even when the controller draws nothing. That is mechanism 2, a one-frame ordering, not a missed refresh.
- **Masks missing from the occluder set:** every probe hit was a `[data-connected-reading-mask]` the host caches.

## Repair

1. `resolveLabelVisibility` now reports why a label is hidden: `occluded: true` when its clamped box intersects an occluder (reading mask, plate or App Bar), and `false` for a label hidden by fit, view or overlap. The host writes `data-occluded` on the label, and one CSS rule, `.label[data-occluded='true'] { transition: none; }`, removes that label at once. Every other show and hide keeps the `--dur-2` fade, and the token is unchanged. Removing `transition-property` also cancels a fade already running, so a label fading out for another reason goes at once when a mask reaches it.
2. The scroll event refreshes the labels itself instead of queueing an animation frame. A scroll event runs before every animation-frame callback of its frame, so nothing in that frame sees stale labels. Each scroll frame still gets one refresh, and pointer and visibility input still coalesce into one animation frame.
3. **Reviewer R, PR #160 (P2).** A hidden label keeps its last transform while it fades, but occlusion was checked only at its new projection. A label whose projection leaves the view (`inView: false`, so it is not a resolver candidate), or that a nearer label hides, could therefore fade for 160 ms under a mask that had just covered the spot where it still painted. The host now also checks a hidden label's last painted rectangle against the same cached occluders, so any hidden label under a mask goes at once, whatever hid it. The resolver and the host share one intersection rule, `isOccludedAt` in `lib/connected-studio/labels.ts`. That is one rectangle test per hidden label per update against the cached boxes, with no layout read.

DESIGN-SPF-V1 asks to "suppress labels occluded by foreground copy/plates" and lists "upright/occlusion-safe labels" in its motion acceptance. Neither spec times a label fade. The 160 ms comes from the implementation's `--dur-2` token. Removing the fade only for occlusion carries out that rule without a timing decision. If the owner wants a visible exit for occluded labels too, the alternative is a scroll-speed look-ahead (grow occluders in the scroll direction by velocity × fade length). That needs a design ruling and is not done here.

## RED → GREEN

| Commit | Case | Result |
| --- | --- | --- |
| `77573f75` (tests only) | `scripts/connected-studio-labels.test.mjs`: "a label hidden by an occluder says so; a label hidden for any other reason does not", plus `occluded: false` in the existing exact-shape cases | RED: 3 failed (`occluded` undefined) |
| | `scripts/connected-studio-host.test.mjs`: "an occluded label is removed without its fade, which still applies to every other show and hide" | RED (no `data-occluded`, no rule) |
| | `connected-studio-runtime.spec.ts` (`immersive-chromium`, SwiftShader, `next dev`): Services en and Projects en, "no label shows inside a reading mask or the App Bar on any frame of a smooth scroll down and back" | RED: Services 111, Projects 80 violating label-frames |
| | `sfc-runtime.spec.ts` (`sfc-runtime-chromium`, `SFC_TEST_MODE=candidate`, runtime candidate): the same case on Studio en | RED: 14 violating label-frames |
| `525b9d42` (repair 1) | all of the above | GREEN: unit and host 75/75; Services, Projects and Studio browser cases passed |
| `0aee10e7` (tests only) | The shared browser helper also reads each frame inside an animation-frame callback queued the frame before | RED: Services 21, Projects 29 label-frames, all in the animation-frame phase, none painted |
| `0dada242` (repair 2) | Services and Projects browser cases | GREEN: 2 passed |
| `c33e25cf` (tests only) | The existing host contract "a controller that drew nothing still refreshes the labels once" matched the old coalesced line. It now states the scroll-event refresh and the coalesced path for other input | Host 58/58 |
| `e0ec2208` (tests only) | Reviewer R's reproduction as two host cases on the real `createLabelLayer`, transpiled and run on a DOM double, following the file's existing extracted-effect harness. First: viewport 1000×600, label 100×20 shown at (900,100); the cached mask (880,150,120,50) scrolls to top 90 while the next projection is `inView: false`. Second: a label hidden by a nearer label while a mask scrolls over its painted spot. Plus a unit case for `isOccludedAt` | RED: 3 failed. Both host cases kept the label at its painted spot, hidden, with no `data-occluded`; `isOccludedAt` did not exist |
| `734607e8` (repair 3) | all of the above | GREEN: labels and host 78/78. With the fix stashed and the harness kept, the same 3 fail |

The browser helper is `scrollGestureLabelViolations` in `tests/e2e/support/connected-studio.ts`. It drives Chromium's own smooth scroll gesture, as the collector does, applies the collector's rule (opacity above 0.01 and overlap beyond 0.5 px with a reading mask or the App Bar), and asserts that labels showed on some frames, so the check is not vacuous.

## Probe on the real GPU (production export of the candidate)

These are root exports of the runtime candidate (`live-policy.patch`), served by `scripts/serve-static-export.mjs`, in headed Chromium (Playwright) on the implementer's desktop GPU at 1440×900. The probes are the Task 15 diagnostic scripts in `.worktrees/sfc-15w-evidence`, unchanged: `label-probe.mjs` (smooth gesture, 800 px/s) and `label-probe-wheel.mjs` (100 px wheel steps). They sample inside an animation-frame callback, and each figure counts violating label-frames over one traversal down and back. "Before" is the Task 15 candidate at `ab177ea2`. "After" is a fresh candidate built at the review fix, `734607e8`. A candidate at `0dada242`, before the review fix, gave the same zeros except for one Services/es wheel frame. The desktop was not quiet, so these figures are diagnostic evidence, not a Task 15 run.

| Pair | Before, gesture | Before, wheel | After, gesture | After, wheel |
| --- | --- | --- | --- | --- |
| Studio/en | 55 of 580 | 59 of 538 | **0** of 582 | **0** of 529 |
| Studio/es | 57 of 585 | 58 of 552 | **0** of 586 | **0** of 550 |
| Services/en | 411 of 1071 | 420 of 984 | **0** of 1071 | **0** of 972 |
| Services/es | 368 of 1079 | 385 of 1005 | **0** of 1079 | **0** of 1037; 1 frame in 1 of 7 runs (see below) |
| Projects/en | 231 of 628 | 246 of 589 | **0** of 631 | **0** of 589 |
| Projects/es | 228 of 633 | 213 of 590 | **0** of 633 | **0** of 586 |
| Founder/en | 0 of 758 | 0 of 685 | 0 of 759 | 0 of 696 |
| Founder/es | 0 of 769 | 0 of 703 | 0 of 768 | 0 of 691 |
| Contact/en | 0 of 351 | 0 of 311 | 0 of 352 | 0 of 313 |
| Contact/es | 0 of 347 | 0 of 310 | 0 of 348 | 0 of 311 |

The "before" figures match the Task 15 finding within run-to-run noise. Its Studio/en 55/59, Services/en 414/421 and Projects/en 228/248 are on the same candidate.

Intermediate state, after repair 1 only (`525b9d42`), read by the extended two-phase probe:

- **Painted state:** 0 on every page.
- **Inside an animation-frame callback:** Services 74 (en) and 65 (es), Projects 37 (en) and 36 (es), Studio 0. Every one had `data-visible="true"`: the one-frame ordering that repair 2 removes.

### Open decision: the catalogue-card hover lift

**Disposition: OPEN for the planning authority and the owner. This packet does not decide it.**

**What happens.** On Services/es under the wheel probe, Modernización is fading in (opacity 0.38) at scroll offset 116. It is 0.7 to 1.5 px into the "web" catalogue card for one frame.
- The card is a reading mask (`data-connected-reading-mask` on the catalogue `Link`) with the approved hover lift, `translateY(-3px)` over 180 ms.
- The probe parks its pointer at the viewport center. As the wheel scrolls the card under the pointer and away, the card lifts and settles. The host's cached box is the card at rest, so a label resolved just above the card can overlap the lifted card by up to 3 px. At the hit, the card's computed transform was `translateY(-1.89px)`.
- It is not a fade, and Reviewer R's retained-position fix does not reach it: the label is showing, not hidden.
- It is bounded by the 3 px lift. The label paints beneath the card's opaque `--plate-fill` (`--sky-deep`), so the overlapping strip is covered on screen. The collector's rule counts box overlap, so it would count the frame.

**How often.**
- At `0dada242`, the unchanged wheel probe hit it in its one full run. Instrumented reruns hit it in 11 of 17 runs, always at the same place.
- At `734607e8`, the unchanged wheel probe hit it in 1 of 7 Services/es runs.
- With the pointer parked outside every card (x = 1430), 4 of 4 runs read 0. That only shows the narrower interaction; it is not a fix.
- The gesture probe has not hit it. The collector parks its pointer by its own script, so whether a wide run can meet it depends on where that is.

**Options, for the owner to choose:**

| Option | What changes | Consequence |
| --- | --- | --- |
| A. Grow the hover-lifting cards' label occluder by the lift (3 px upward) | The host, plus a per-mask marker on the catalogue cards | Closes it in code. Changes the Task 11 contract that legacy masks are "used as measured", and labels near a card's top edge hide 3 px earlier at rest. Needs a design/planning acceptance of that contract change |
| B. Move the lift off the masked box | The card markup or CSS: the lift applies to an inner element and the masked box stays put, or the lift is dropped | Closes it at the source. Touches the approved Services card hover (DESIGN-SPF-V1 "bounded hover"), so it is a design decision |
| C. Make the collector's rule tolerate a hovered card's lift (overlap ≤ 3 px with a mask in its hover transition) | The Task 15 collector and protocol only | No product change. Needs the planning authority to amend the Task 15 rule, on the Task 15 branch |
| D. Accept it as a documented exception for the wide collection | Nothing | The gate is not literally met. The planning authority records the exception, and Task 15 handles any `labelViolations` hit from this source by that record |

## Labels at rest and frame cost

These figures are from `0dada242`, before the review fix, which adds only one rectangle test per hidden label per update; they were not re-collected at `734607e8`. A third diagnostic script ran one gesture traversal per page, with the pointer outside every card. It recorded animation-frame intervals, long tasks and labels shown at rest (at the top, and again after returning to it). Two runs each, on Studio, Services, Projects, Founder and Contact (en), before (`ab177ea2`) and after (`0dada242`):

- **Intervals:** p50 16.7 ms, p95 16.8 ms, p99 16.8 to 16.9 ms on every page, before and after.
- **Long tasks:** 0 ms everywhere.
- **Frames over 20 ms:** none before, one isolated frame in two of the ten runs after, out of about 960 per Services run. That is noise level, not a pattern.
- **Labels shown at rest:** identical before and after, and identical after returning to the top: Studio 3, Services 6, Projects 5, Founder 4, Contact 0. Contact's 0 is the pre-existing word-binding finding held by Task 12's `test.fixme`, unchanged here.

## Validation

Fresh, 2026-10-19, this worktree after `npm ci`.

After Reviewer R's finding, at `734607e8`:

- Labels and host Node suites: 78/78.
- Services and Projects label browser cases (`immersive-chromium`, one worker): 7/7. These are the two per-frame cases and the five widths of "no label overlaps another label, a reading mask or the App Bar".
- Fresh runtime candidate (`apply --kind=runtime --expect-head=734607e8`): the twelve label cases of `sfc-runtime-chromium`, 12/12. These are the per-frame Studio case, "a script or restored scroll over a sleeping scene refreshes label occlusion…", and "labels stay clear of text and controls on the five pages" at wide and compact.
- The unchanged probes on that candidate's export, in the table above. The candidate was then restored, and `verify-clean` passed.
- `npm run validate` with this revised receipt in place: **exit 0**. docs:check passed on 357 Markdown files, 121 document IDs and 38 Skills. `npm test` ran 959 tests: 958 pass, 0 fail, 1 `todo`. Lint reported 0 errors and 282 warnings (the baseline). Typecheck and build passed.

Before the finding:

- **Candidate browser family**, runtime candidate at `0dada242`, full `sfc-runtime-chromium` list (two workers, 21.7 min): 66 passed, 3 skipped, 5 failed. The five failures are the pre-existing ones that [Task 20](task-20.md) and [Task 14](task-14.md) recorded: the three `contact form signal` cases (the form they wait for was removed by ADR-CONTACT-DIRECT-CHANNELS) and the two `direct Contact with the live graph (Task 13)` cases (`openActualContact` never enables the live hook). The new Studio case and the existing label cases ("a script or restored scroll over a sleeping scene refreshes label occlusion…") passed.
- **Services and Projects runtime family** (`immersive-chromium`, full `connected-studio-runtime.spec.ts`, two workers, 16.1 min): 55 passed, 9 failed. Eight failures were "Tearing down context exceeded the test timeout". The ninth was the first-scroll impulse case, at 0.005 against more than 0.02, because SwiftShader drew too few frames. A rerun of exactly those nine at one worker (`--last-failed`, 2.5 min) passed 9/9, including the two new cases and the first-scroll impulse case. Under two SwiftShader workers on a loaded desktop the family is load-bound. No failure reproduced alone.
- `prepare-sfc-candidate.mjs restore --kind=runtime`, then `verify-clean`: "No QA candidate is applied and no QA marker is in application source."
- `npm run validate` with this receipt in place: **exit 0**.
  - docs:check: 357 Markdown files, 121 document IDs, 38 Skills.
  - `npm test`: 956 tests, 955 pass, 0 fail, 1 `todo` (the Task 14 Contact-opacity placeholder).
  - Lint: 0 errors, 282 warnings (the baseline).
  - Typecheck and build: pass.
- **History note.** Before the push, the branch was rewritten to drop two dev-server artifacts (`next-env.d.ts`, `tsconfig.tsbuildinfo`) that the first commit had picked up, and to rewrap one doc comment in `labels.ts`. The candidate builds, probes and browser runs above ran at the pre-rewrite heads `28c0f049` and `8e47ae17`. Their product code is identical to `525b9d42` and `0dada242` except for that comment, as `git diff 8e47ae17 0dada242 -- components lib` shows.
- **The commit after the probes is test-only.** `c33e25cf` updates the host's source contract for the new scroll path; the earlier Node suite run flagged the old text. The probes and browser runs used the product code at `0dada242`, and `c33e25cf` adds no product change.

## Not done, by design or by limit

- **No Task 15 hardware run.** Next, a fresh runtime candidate is built at the `main` head that contains this repair, a smoke run confirms `labelViolations` 0, and the owner runs the wide `--batch` on a quiet desktop.
- **The catalogue-card hover lift** is OPEN for the decision above. Until it is made, this packet does not claim the zero-violation gate.
- **Compositor-thread scrolling is outside what a DOM probe can see.** If the main thread falls behind a threaded scroll, the compositor can move masks before the next label update commits. That is inherent to DOM labels over native scrolling. On the legacy masks with no clearance it would show as a sliver of label at a mask edge for one frame. No probe here can measure it, and nothing here changes it.
- **No visual baseline changes.** The static pages are unchanged; the rule matches only live labels.
