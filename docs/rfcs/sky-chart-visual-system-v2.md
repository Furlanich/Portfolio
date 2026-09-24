---
id: RFC-SKY-CHART-VISUAL-SYSTEM-V2
type: request-for-comments
status: PROPOSED
related:
  - REVIEW-SKY-CHART-DIRECTION-2026-09-23
  - PLAN-SKY-CHART-HOME-REDESIGN-V2
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE
  - RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1
  - PAGE-HOME
  - PROJECT-EVIDENCE
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-23
---

# Sky Chart visual system, v2 — Home and App Bar redesign

## Context

[`GOV-ENGINEERING-LIFECYCLE`](../governance/engineering-lifecycle.md) classes a major UI/styling system and design-system architecture as a consequential change that requires a Governance PR before implementation. The current Home and global App Bar are governed by the approved [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](adaptive-immersive-homepage-production-v1.md), its [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../decisions/adaptive-immersive-homepage.md), and the applicable sections of [`DESIGN-VISUAL`](../design/visual-language.md) and [`DESIGN-IX-A11Y`](../design/interaction-responsive-accessibility.md).

On 2026-09-23 the repository owner reviewed three prototyped directions — A Sky Chart, B Line Map, C Deployable Sheet — recorded in [`REVIEW-SKY-CHART-DIRECTION-2026-09-23`](../reviews/sky-chart-direction-2026-09-23/index.md), and chose Direction A · Sky Chart, with C · Deployable Sheet's personalization technique applied to specific sections, and a preference for semi-transparent cards wherever they stay legible and original. The owner also confirmed that implementation opens with this Governance PR, followed by a superseding ADR where runtime changes are recorded, and authorized use of Figma before implementation.

[`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) (`PLAN-SKY-CHART-HOME-REDESIGN-V2`) carries the resolved direction into a twelve task/PR execution plan. That plan's `status` stays `PROPOSED` and no implementation task may start until this RFC receives the owner's gate G1 approval and Task 2 records the superseding ADR and approved design sections. This RFC implements nothing; it is the governance step the plan and the lifecycle require.

## Proposal

The resolved world is a navigator's star atlas, detailed in [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) section 2 ("Approved design direction") and normatively specified in that plan's section 6 design decisions D-01 through D-27. This RFC references those sections by link rather than restating them, so the plan stays the single normative source of the numeric specification.

In summary:

- A full-viewport celestial sphere sits behind Home's content through the hero and the four chapters. Its named stars are FURLANICH's approved process vocabulary, revealed and joined into constellations as the visitor scrolls, then receding to a dim ground after the chapters.
- Two translucent materials carry content: an **atlas plate** (dark, registration corner ticks, plate number) for chapters, Services, Proof, Process and Founder; and a **plotting sheet** (translucent bone vellum, plotting grid, bearing label, corner crease) for Problems and the new illustrative Position fix section. Problems uses a stepped three-sheet cascade with a "cocked hat" glyph, translating Direction C's vellum gesture into navigation vocabulary.
- The final CTA band moves from night to Bone, the brand's canonical ground.
- The global App Bar becomes a floating "chart header" in atlas-plate material on every route; on Home it starts transparent and prints the current section as a mono readout.

The normative visual reference is the self-contained prototype at `docs/reviews/sky-chart-direction-2026-09-23/reference/sky-chart-reference.html`, together with the plan's numeric specification. Where the reference prototype and the plan's section 6 differ, the plan wins.

Implementation follows the plan's task/PR packets 1–12 across five execution waves (plan section 17), each independently reviewable and revertible, gated by the plan's canonical validation command and Playwright/accessibility/performance suites (plan sections 14 and 15).

## Supersession list

Approval of this RFC proposes to supersede the following nine approved-record boundaries. Each retains the stated boundary; nothing outside it changes.

1. **[`DESIGN-VISUAL`](../design/visual-language.md) "UI gradients, neon and glass remain excluded"** (Precision Assembly identity principles, "Bone and azure are the recognizable pair" paragraph). Retained boundary: superseded for Home and the global App Bar only, where the two translucent chart materials (atlas plate, plotting sheet) and their `backdrop-filter` treatment are introduced. Neon remains excluded everywhere, including Home and the App Bar.
2. **Light-only foundation / no dark theme** (`DESIGN-VISUAL` "Alternatives and trade-offs" Theme row, and `DESIGN-IX-A11Y` "Global app-bar behavior" introduction: "The first implementation is light-only. A dark theme is not required for implementation or release of the homepage foundation."). Retained boundary: superseded for the Home environment only (the fixed celestial-sphere ground, scrim and the App Bar's docked/undocked chart-header material). It is not a site theme: Services, Projects, Studio, Founder, Contact and Privacy stay on the approved light foundation, and no theme switcher is introduced.
3. **`IMMERSIVE-HOME-V1.1` C2 composition** — the two-zone editorial-anchor/instrument-viewport composition, the four static chapter posters and the phase spine, approved by [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](adaptive-immersive-homepage-production-v1.md) and recorded in [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../decisions/adaptive-immersive-homepage.md). Retained boundary: the four chapters, their approved heading IDs and copy stay; the framed instrument viewport, the four poster images and `PhaseSpine` are replaced by the full-viewport environment and atlas-plate chapters (plan D-01, D-12, section 19 file matrix). The ADR's retained runtime boundaries (gates, budgets, direct Three.js, the Framer Motion progress boundary, demand rendering, one-shot initialization, session context-loss handling) are not superseded by this RFC; see "Runtime changes" below.
4. **`DESIGN-VISUAL` "Global app bar — APPROVED" and `DESIGN-IX-A11Y` "Global app-bar behavior — APPROVED" Surface/Border treatment** (`DESIGN-VISUAL`: "The shared header is a sticky app bar with `top: 0`, Surface background, and a `1px` Border separator"; `DESIGN-IX-A11Y`: "uses the approved Surface and Border treatment, and does not hide or translate on scroll"). Retained boundary: the Surface/Border fill and colors are superseded by the atlas-plate chart-header material (plan D-22); sticky positioning at `top: 0`, normal document flow, and the rule that the bar never hides, translates or auto-collapses on scroll are retained unchanged.
5. **`DESIGN-VISUAL` "Do not force a viewport-height hero."** (Homepage foundation visual baseline, Spacing and grid). Retained boundary: superseded for Home only, where the hero uses `min-height: 100svh` under the App Bar (plan D-11). No other page adopts a viewport-height hero, and Home's content growth is never clipped even where it exceeds the viewport.
6. **`DESIGN-VISUAL` Home Canvas/Surface section alternation** (Commercial homepage section baseline, "Alternate only the approved Canvas and Surface backgrounds ... Problems uses Surface; Services uses Canvas; Audiences uses Surface; Proof uses Canvas; Process uses Surface; Founder uses Canvas; and the final CTA uses Action tint."). Retained boundary: superseded for Home, where the alternating Canvas/Surface backgrounds are replaced by transparent sections over the fixed environment, carried by atlas plates and plotting sheets (plan D-01, D-13 to D-19); the final CTA's move to opaque Bone (plan D-19) preserves the approved Action-tint-band role at the boundary between the environment and the footer.
7. **`DESIGN-VISUAL` Home card radius and shadow rules** (Commercial homepage section baseline, "Shared surface patterns": "Surface background, `1px` Border, `16px` radius, no shadow"). Retained boundary: superseded for Home's card-equivalent surfaces, which adopt the atlas plate (18px radius, layered inset/drop shadow, D-05) and plotting sheet (6px radius, drop shadow, D-06) treatments instead. Non-Home cards (Problems/Services/Audiences elsewhere, Projects, Services page level cards) keep the existing `16px`-radius, no-shadow rule.
8. **`DESIGN-VISUAL` exclusion of "floating telemetry, particle fields"** (System Instrument scene description: "Generic dashboard cards, floating telemetry, particle fields, neon, continuous rotation, elastic motion and ornamental glass are excluded."). Retained boundary: superseded to the extent that the new environment renders named, textual process-vocabulary stars (Appendix B of the plan) joined by constellation link segments, and up to 520 dim, unlabeled field stars (plan T-07) as atmospheric texture. Continuous rotation, elastic motion and ornamental glass remain excluded; the scene is demand-rendered from scroll position only (plan T-06).
9. **The new `HOME-IMPACT` section and its bilingual strings.** This is an addition rather than a supersession: `PAGE-HOME` gains a new "Position fix" section, `impact`, between Services and Proof, with the honest illustrative business-impact visualization specified in plan section 12 and the new bilingual strings in plan Appendix A. It adds no invented evidence, percentage, duration or currency figure.

## Runtime changes

This RFC proposes no runtime or dependency change; it authorizes only the design direction and this supersession list. The plan (section 8, "Architecture impact") records that Task 2, after this RFC's approval, creates a new ADR (working id `ADR-SKY-CHART-HOMEPAGE-RUNTIME`) superseding [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../decisions/adaptive-immersive-homepage.md). That superseding ADR:

- **Keeps** the current ADR's gates (reduced motion, Save-Data, WebGL2, session context-loss flag, near-viewport, `load`), production budgets, direct Three.js (no React Three Fiber), the existing Framer Motion progress boundary, demand-driven rendering with no idle loop, one-shot initialization, and session-scoped context-loss handling.
- **Adds** the full-viewport fixed canvas portaled to `document.body`, `THREE.CanvasTexture` sprite labels in place of the previous scene's label approach, a recede/suspend behavior once the visitor scrolls past the chapters, and a locale-neutral static poster pair (`environment-wide.webp`, `environment-compact.webp`) in place of the four chapter posters.

The production budgets in [`ADR-ADAPTIVE-IMMERSIVE-HOMEPAGE`](../decisions/adaptive-immersive-homepage.md) and [`RFC-ADAPTIVE-IMMERSIVE-HOMEPAGE-PRODUCTION-V1`](adaptive-immersive-homepage-production-v1.md) are unchanged by this RFC; the plan's section 14 performance strategy restates them as the gate for the sky-chart runtime (≤120 KiB Brotli incremental JavaScript, DPR caps, scroll-frame and Core Web Vitals budgets). No new npm dependency is proposed (plan T-01); `package.json` and `package-lock.json` stay locked.

The superseding ADR is out of scope for this Governance PR and is not created here. It is Task 2's deliverable, gated on this RFC's approval (gate G1).

## New copy

The only new bilingual copy this direction requires is listed in [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) Appendix A ("New bilingual strings"), referenced here rather than duplicated. It covers: the decorative instrument coordinate line, plate-label and status-label templates; the four chapter kickers; the Services, Proof and Process section kickers; the App Bar readout labels; the Proof accountability log; and the complete `HOME-IMPACT` (Position fix) content — heading, introduction, illustrative-scenario tag, toggle labels, figure titles and descriptions, the five source/note pairs, and the impact-counts labels and caption. Every other Home and App Bar string is existing approved content; no approved copy is changed by this RFC.

## Alternatives

The full Stage 1 prototype comparison (screenshots, skill log and measured contrast for all three directions) was published separately to the owner; only its resolution is recorded in the repository, in [`REVIEW-SKY-CHART-DIRECTION-2026-09-23`](../reviews/sky-chart-direction-2026-09-23/index.md#owner-disposition-2026-09-23). This RFC records that resolution honestly rather than reconstructing evidence that is not in the repository.

- **Direction B · Line Map.** Prototyped alongside A and C. **Verdict: not chosen.** The owner's recorded disposition names Direction A as the selection and does not carry any Line Map element into the resolved world; no Line Map material or personalization technique appears in the plan's design decisions.
- **Direction C · Deployable Sheet.** Prototyped alongside A and B, built around a vellum surface and a stepped-cascade gesture. **Verdict: not chosen as the primary direction, but its personalization technique is adopted inside Direction A.** The owner's recorded disposition: "Direction A · Sky Chart, with more personalization on sections like 'When work is spread across tools', where a style similar to C · Deployable Sheet is better. Semi-transparent cards are always preferable as long as the result is astonishing and original."
- **The owner's hybrid choice.** Direction A · Sky Chart is the resolved environment and App Bar direction. Direction C's vellum plotting-sheet material and stepped-cascade gesture are translated into navigation vocabulary and applied specifically to Problems (three cascading plotting sheets, each with a "cocked hat" glyph) and to the new Position fix section, per plan D-06 and D-13. No other section adopts Direction C material; Services, Proof, Process and Founder stay in the Direction A atlas-plate material (plan D-05, D-14, D-16 to D-18).

## Risks

- **Real-device thermal behavior** of a full-viewport canvas combined with `backdrop-filter` surfaces on low-end Android is unproven; the plan mitigates with DPR caps, star-count limits, a blur budget of at most three intersecting `backdrop-filter` surfaces per viewport (App Bar excluded), and recede-triggered render suspension (plan section 30, D-08, D-24).
- **Contrast and legibility on translucent surfaces.** The direction review already found that Azure fails as text on the dark ground (1.99:1) and that Mist falls to 3.86:1 on translucent surfaces in the worst composite; the plan's D-04 token table and `scripts/design-tokens.test.mjs` are the mitigation, asserting every pairing including worst-case composites.
- **Scope creep beyond Home and the App Bar.** The plan's non-goals (section 5) and file/ownership matrix (section 19) bound every task to Home and the global App Bar; Services, Projects, Studio, Founder, Contact and Privacy content is explicitly excluded from restyling.
- **Governance drift between the Figma mirror and this record.** The Figma mirror at Gate F (below) can fall out of sync with an approved deviation; the plan treats Figma as non-normative and requires either a batched Figma update or a recorded drift note in the acceptance review (plan section 30).
- **Spanish content expansion** (approximately 30% longer strings) can break the new plotting-sheet and atlas-plate layouts; the plan requires both-locale testing at every width and forbids shrinking type below the D-09 minimums as a fix (plan section 30).
- **Budget regression.** If the sky-chart runtime exceeds the unchanged 120 KiB Brotli ceiling, the plan requires stopping and returning to governance rather than raising the budget inside an implementation PR (plan section 28).

The Figma mirror for this direction (Gate F) exists at `https://www.figma.com/design/V6FD6Sq3gqqxeMw5Si7Dnx` and is non-normative: if it disagrees with the plan, the plan wins, and implementation never waits on it.

## Decision requested

The repository owner's gate G1 approval is requested for:

1. The Sky Chart · Direction A environment, atlas-plate and plotting-sheet material system, and floating chart-header App Bar described above and normatively specified in [`PLAN-SKY-CHART-HOME-REDESIGN-V2`](../plans/active/sky-chart-home-redesign-v2.md) section 6 (D-01 to D-27).
2. The nine supersessions listed above, each bounded as stated.
3. The runtime-change summary above, authorizing Task 2 to draft the superseding `ADR-SKY-CHART-HOMEPAGE-RUNTIME` for separate review; this RFC does not itself accept that ADR.
4. The new copy referenced from plan Appendix A.

Approval unlocks Task 2 (decision closure: the superseding ADR, the approved `DESIGN-VISUAL`/`DESIGN-IX-A11Y`/`PAGE-HOME` sections, and this plan's status change to `APPROVED`) and, after Task 2 merges, Wave 1 of the implementation plan. Approval does not itself authorize any implementation PR, dependency change, or release step. Rejection or requested changes keep the plan `PROPOSED` and keep every approved record above unchanged; no code task starts.

## Status

**PROPOSED — awaiting the owner's gate G1 decision.** Record the outcome here and link the resulting ADR (`ADR-SKY-CHART-HOMEPAGE-RUNTIME`, created by Task 2) once approved.
