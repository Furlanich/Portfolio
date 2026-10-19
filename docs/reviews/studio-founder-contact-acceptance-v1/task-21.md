# Task 21 / PR 21 — Keep decorative labels out of reading masks while the page scrolls

**Status: repaired and verified on the runtime candidate. On every painted frame of a scroll down and back, no label shows inside a reading mask or the App Bar on Studio, Services, Projects, Founder or Contact, in either locale. Labels at rest and frame cost are unchanged.** The planning authority's acceptance of this packet number, independent Reviewer R and the human merge are OPEN.

Agent usage: primary Claude Opus 5.5 (`claude-opus-5-5`), Claude Code desktop session started by the Task 15 wide-tier session; subagents 0/0 (none). Independent review stays a separate session.

Branch/worktree: `codex/sfc-21-label-occlusion` in a Claude Code worktree (`.claude/worktrees/pensive-hawking-5733e1`), cut from `origin/main` at `ab177ea2`, the merge of PR #159 (Task 20). Targets `main`.

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

The browser helper is `scrollGestureLabelViolations` in `tests/e2e/support/connected-studio.ts`. It drives Chromium's own smooth scroll gesture, as the collector does, applies the collector's rule (opacity above 0.01 and overlap beyond 0.5 px with a reading mask or the App Bar), and asserts that labels showed on some frames, so the check is not vacuous.

## Probe on the real GPU (production export of the candidate)

These are root exports of the runtime candidate (`live-policy.patch`), served by `scripts/serve-static-export.mjs`, in headed Chromium (Playwright) on the implementer's desktop GPU at 1440×900. The probes are the Task 15 diagnostic scripts in `.worktrees/sfc-15w-evidence`, unchanged: `label-probe.mjs` (smooth gesture, 800 px/s) and `label-probe-wheel.mjs` (100 px wheel steps). They sample inside an animation-frame callback, and each figure counts violating label-frames over one traversal down and back. "Before" is the Task 15 candidate at `ab177ea2`; "after" is a candidate built at `0dada242`. The desktop was not quiet, so these figures are diagnostic evidence, not a Task 15 run.

| Pair | Before, gesture | Before, wheel | After, gesture | After, wheel |
| --- | --- | --- | --- | --- |
| Studio/en | 55 of 580 | 59 of 538 | **0** of 582 | **0** of 537 |
| Studio/es | 57 of 585 | 58 of 552 | **0** of 586 | **0** of 541 |
| Services/en | 411 of 1071 | 420 of 984 | **0** of 1071 | **0** of 960 |
| Services/es | 368 of 1079 | 385 of 1005 | **0** of 1080 | 1 of 988 (see below) |
| Projects/en | 231 of 628 | 246 of 589 | **0** of 629 | **0** of 576 |
| Projects/es | 228 of 633 | 213 of 590 | **0** of 633 | **0** of 576 |
| Founder/en | 0 of 758 | 0 of 685 | 0 of 758 | 0 of 679 |
| Founder/es | 0 of 769 | 0 of 703 | 0 of 770 | 0 of 704 |
| Contact/en | 0 of 351 | 0 of 311 | 0 of 352 | 0 of 303 |
| Contact/es | 0 of 347 | 0 of 310 | 0 of 349 | 0 of 311 |

The "before" figures match the Task 15 finding within run-to-run noise. Its Studio/en 55/59, Services/en 414/421 and Projects/en 228/248 are on the same candidate.

Intermediate state, after repair 1 only (`525b9d42`), read by the extended two-phase probe:

- **Painted state:** 0 on every page.
- **Inside an animation-frame callback:** Services 74 (en) and 65 (es), Projects 37 (en) and 36 (es), Studio 0. Every one had `data-visible="true"`: the one-frame ordering that repair 2 removes.

### Remaining exception: the Services catalogue card hover lift

The wheel probe recorded one label-frame on Services/es: Modernización, opacity 0.38 while fading in, 0.7 to 1.5 px into the "web" catalogue card. Five reruns reproduced it at the same place (scroll offset 116), and the extended probe traced it:

- The card is a reading mask (`data-connected-reading-mask` on the catalogue `Link`) with the approved hover lift, `translateY(-3px)` over 180 ms.
- The probe parks its pointer at the viewport center. As the wheel scrolls the card under it and away, the card lifts and settles. The host's cached box is the card at rest, so a label just above the card can overlap the lifted card by up to 3 px. At the hit, the card's computed transform was `translateY(-1.89px)`.
- With the pointer parked outside every card (x = 1430), four of four runs recorded 0.

This is not a fade. It is bounded by the 3 px lift, and the label paints beneath the card's opaque `--plate-fill` (`--sky-deep`), so the overlap is covered. It needs a pointer resting on a catalogue card with a label within 3 px above it. Closing it means choosing between:

- growing the catalogue cards' label occluder by the lift, which changes the Task 11 contract that legacy masks are "used as measured";
- moving the lift onto the card's content instead of the masked box;
- letting the collector's rule tolerate a hovered card's lift.

Each is a design or planning choice outside this packet, so it is recorded here, not changed. The collector parks its pointer by its own script, so whether a run can meet this depends on where that is. The gesture probe did not meet it.

## Labels at rest and frame cost

A third diagnostic script ran one gesture traversal per page, with the pointer outside every card. It recorded animation-frame intervals, long tasks and labels shown at rest (at the top, and again after returning to it). Two runs each, on Studio, Services, Projects, Founder and Contact (en), before (`ab177ea2`) and after (`0dada242`):

- **Intervals:** p50 16.7 ms, p95 16.8 ms, p99 16.8 to 16.9 ms on every page, before and after.
- **Long tasks:** 0 ms everywhere.
- **Frames over 20 ms:** none before, one isolated frame in two of the ten runs after, out of about 960 per Services run. That is noise level, not a pattern.
- **Labels shown at rest:** identical before and after, and identical after returning to the top: Studio 3, Services 6, Projects 5, Founder 4, Contact 0. Contact's 0 is the pre-existing word-binding finding held by Task 12's `test.fixme`, unchanged here.

## Validation

Fresh, 2026-10-19, this worktree after `npm ci`:

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
- **The catalogue-card hover lift** above needs its own decision, if the owner wants it closed.
- **Compositor-thread scrolling is outside what a DOM probe can see.** If the main thread falls behind a threaded scroll, the compositor can move masks before the next label update commits. That is inherent to DOM labels over native scrolling. On the legacy masks with no clearance it would show as a sliver of label at a mask edge for one frame. No probe here can measure it, and nothing here changes it.
- **No visual baseline changes.** The static pages are unchanged; the rule matches only live labels.
