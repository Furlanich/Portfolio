---
id: DESIGN-SFC-V1
type: design-spec
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - REVIEW-STUDIO-FOUNDER-CONTACT-2026-10-14
  - SPEC-SFC-V1
  - RFC-SFC-COMMERCIAL-ATLAS-V1
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-TERMS
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - IA-SITE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - DESIGN-SPF-V1
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONNECTED-STUDIO-PAGE-RUNTIME
  - GOV-AGENT-USAGE
  - TEST-STRATEGY
last_verified: 2026-10-20
---

# Studio, Founder, Contact and legal — Atlas v1

## Direct-contact amendment — APPROVED 2026-10-18

The owner replaced the form with existing WhatsApp/email/phone links and removed mandatory Formspree/counsel gates. [ADR-CONTACT-DIRECT-CHANNELS](../decisions/contact-direct-channels.md) supersedes form-specific requirements below and in historical references. Retain the Atlas visual/runtime scope and static export. There is no form client, provider activation or simulated/commercial result UI.

## Owner Contact-brightness amendment — APPROVED 2026-10-20

The owner decided that the live Contact scene and its labels keep the same opacity as Studio and Founder, and **retired the 0.35 Contact multiplier** that revision 1 specified under "Page-specific graph specification". Contact's posters, which were captured as the scene is drawn, therefore stay as they are and need no recapture. Reviewer R's finding SFC-18-22-01 ([PR #167](https://github.com/Furlanich/Portfolio/pull/167)) is resolved by this decision, not by an implementation change. The owner's words: "Keep Contact at full brightness. Record that as the owner's design decision: update DESIGN-SFC-V1 and the Task 14 todo so the 0.35 requirement is retired, in a docs-only PR." Every other value in this document is unchanged.

## Status and intent

**Implementation status — 2026-10-20.** [PLAN-SFC-V1](../plans/completed/studio-founder-contact-v1.md) is COMPLETED on the owner's acceptance (the [Task 19 receipt](../reviews/studio-founder-contact-acceptance-v1/task-19.md) holds the evidence and the carried OPEN items). Studio, Founder, Contact, Privacy and Terms are released in both locales with direct-channel Contact. The **wide** live graph tier is enabled on the owner's acceptance of 2026-10-19, which waived the 30-run hardware collection; the **compact** tier was enabled later the same day on the owner's manual test of the compact live scene on a phone with screen readers ([Task 25](../reviews/studio-founder-contact-acceptance-v1/task-25.md)). Neither is a measured qualification. The sections below keep the target text as written; where this note and a dated amendment above differ from a later section, the dated amendment governs.

**Written specification revision 1 — APPROVED by the owner on 2026-10-14 (Q14).** Approval covers this complete design, linked copy selections and bounded supersession scope, and authorizes the ADE v2 plan. The owner selected Direction A after three structurally different interactive comparisons, retained A.1 node motion and A.2 flexible strings/compositions. Approval does not authorize implementation, live activation or legal sufficiency. Governance PR acceptance and independent plan review remain separate gates.

**Review amendments, 2026-10-14:** Q16 authorizes `claude-sonnet-5-5` High with `gpt-6-luna` High; Q17 selects a nondeployed integration branch and one coherent release to main; Q18 corrects Studio's software-focused H1 and Contact's acceptance-only success text in their owners. The additional execution-ready clarifications below respond to independent review and are **PROPOSED with plan revision 2** until that revision is accepted. They do not reopen the approved A.2 compositions or certify professional legal/processor facts.

Give prospective clients a coherent next step from Home, Services and Projects: understand the studio and its accountability, examine Samuel's professional depth, and submit a genuine initial inquiry. Studio explains the operating model; Founder supplies professional context; Contact completes a task; legal pages support informed use. Success requires complete readable content and honest intake behavior even when graphics or JavaScript are unavailable.

This document owns approved target visual, responsive, motion and component boundaries. Exact public copy belongs to the page owners linked below. [The discovery record](../reviews/studio-founder-contact-design-2026-10-14/index.md) preserves alternatives, owner decisions, recommendations/dispositions and evidence. [The RFC](../rfcs/studio-founder-contact-commercial-atlas-v1.md) carries the owner-approved bounded supersession scope pending Governance PR acceptance; accepted ADRs are not edited here.

## Scope and fixed boundaries

| Surface | Target |
| --- | --- |
| Studio | `/estudio/`, `/en/about/` |
| Founder | `/estudio/samuel-furlanich/`, `/en/about/samuel-furlanich/` |
| Contact | `/contacto/`, `/en/contact/` |
| Privacy | Replace `/privacidad/`, `/en/privacy/`; do not add duplicate destinations |
| Terms | Add `/terminos/`, `/en/terms/`, route ID `terms`, proposed for approval with this spec |
| Services / Projects | Shared proximity/string response; preserve their existing composition, scroll chapters, complete content and evidence boundaries |
| Home | Only the commercial-inquiry consistency sentence owned by PAGE-HOME; no layout, graph, App Bar or Founder-plate redesign |
| Shared navigation | Existing App Bar, mobile disclosure, protected mark and locale equivalence; Footer adds Terms beside Privacy |

Retain static export, trailing slashes, Spanish-root/English-`/en/` architecture, base-path helpers, self-hosted Instrument Sans/IBM Plex Mono and installed direct Three.js. No runtime localization, backend, database, CRM, analytics, video, photograph, new font, UI framework, physics library or motion dependency is introduced. Founder remains outside primary navigation. Its CV is preserved and reverified, not rewritten. The two public Projects dossiers and MPC's educational/group limitations stay intact.

The future clean export contains sixteen localized foundation routes. Retired project-detail URLs remain absent and return actual 404 responses. Canonical and alternate-language paths never include a navigation-only fragment. Existing service/dossier fragments and browser history behavior remain valid.

## Visual system and dimensions

Continue A's dark field and deliberately placed editorial plates. Contact combines a quiet dark introduction with one opaque Bone intake surface. Legal pages use the shared static connected Azure background with one opaque Deep reading plate. Avoid repeating a card around every paragraph, invented metrics, stock portraits, large gradients in text or obligatory entrance animations.

| Property | Exact target |
| --- | --- |
| Environment | Abyss `#06121F`, Deep `#0A1E33`, Field `#0F2A45`; existing chart vocabulary |
| Main reading plates | Opaque `#0A1E33`, 1px `#36536C` border, 16px radius; no backdrop blur |
| Headings / dark body | Bone `#F9F6EE` / secondary `#B9C3CC`; chart metadata `#9CC4EC` |
| Legal reading | One opaque Deep `#0A1E33` plate over the shared connected Azure background; Bone `#F9F6EE` headings, secondary `#B9C3CC` body, chart-glow `#9CC4EC` underlined links, chart-border `#36536C` rules |
| Bone intake | Bone fill, Ink `#09243D`, secondary `#526473`, Azure `#004589` links/actions; Contact only |
| Container | Inner content at most 1180 CSS px; 32px gutters from 768px, 20px below 768px; centered |
| Breakpoints | Wide ≥1024px; tablet 768–1023px; compact <768px |
| Plate padding | Wide 40px, tablet 32px, compact 24px; Contact intake wide 40px, compact 24px |
| Rhythm | Wide section separation 96px, tablet 72px, compact 56px; subsection separation 48/40/36px |
| Type | Instrument Sans; headings 600, body 400; IBM Plex Mono 400 for restrained chart metadata |
| Studio H1 | 68px wide, 48px tablet, 42px compact; 1.04 line height, −0.035em tracking |
| Founder H1 | 88px wide, 64px tablet, 56px compact; 1.04 line height; name may break between given/family name |
| Contact H1 | 68px wide, 48px tablet, 42px compact; 1.04 line height |
| Section headings | 40px wide, 34px tablet, 30px compact; 1.12 line height; legal H2 28/26/24px |
| Subsection headings | 24px wide, 22px tablet/compact; 1.25 line height |
| Body | 18px / 1.6; introduction 20px / 1.5; supporting text at least 14px / 1.6 |
| Reading measure | Body at most 64ch; Founder plate at most 800px; legal article at most 920px with text at most 68ch |
| Actions | At least 44×44px; 48px preferred; retain existing button radius/brand treatment; underlined text links remain identifiable |
| Focus | Visible 3px outline, offset at least 3px; Azure on Bone, chart glow on dark; never obscured by sticky App Bar |

**Owner palette amendment — APPROVED 2026-10-16:** Privacy and Terms use the same shared static connected Azure background as Studio, with one opaque Deep legal reading plate, Bone headings, secondary body text, chart-glow links and chart-border rules. This supersedes the prior full-Bone legal reading surface; Contact's Bone intake surface is unchanged. All other DESIGN-SFC-V1 values and legal-content release gates remain unchanged.

Use existing approved tokens/material variants where equivalent. If a new route needs an opaque plate, add a scoped variant; do not change Home's translucent AtlasPlate default or shared App Bar measurements. Meaningful approved Founder role context and the Studio category line remain despite Impeccable's generic eyebrow ban. The protected mark is never split, cropped, morphed, recolored or made into 3D art.

### Review clarification: shared primitives and deliberate type variants

The 1180px inner editorial measure and the 600-weight scales above were part of the complete Q14-approved rendering/spec. They intentionally distinguish these reading/profile pages from Services/Projects' 1200px inner catalogue grid, 700-weight headings and longer line-height; Founder remains outside primary navigation, and its larger personal name does not change the studio-first homepage. Preserve those approved values unless the owner approves a change. The repository's current generic Container uses max-w-6xl, not the Services/Projects raw 1264px outer/gutter pattern, so it is not a ready-made matching utility.

One new server `AtlasEditorialContainer` owns outer maximum 1244px/32px gutters (1180px inner); below 768px gutters 20px. Existing AtlasPlate gets an **editorial-opaque** variant owning fill/border/16px radius/padding 40/32/24, without blur/shadow/ticks; default Home markup/material is unchanged. Shared `AtlasScrim` uses Abyss at opacity 1, radius 8px, no border/shadow/feather, with a decorative pseudo-background extending 24px beyond text bounds (Contact introduction 32px). The extension does not change layout or block pointer events; cached reading boxes expose its clearance to input/label exclusion. No page recreates its own material formula.

Studio retains both introduction actions, then a 44px-high Pause slot 12px after that action row. Founder places its slot 16px after professional links within the intro plate. Contact places its slot 16px after the response expectation, inside the introduction scrim so that the scrim's 32px opaque backing sits behind the control and cannot paint over its border or focus ring (PLAN-SFC-V1 Task 22), before the intake surface. Static policy/no-JS state fills the slot with quiet 14px static-background text; eligible live state uses the existing 44px Pause control, without layout shift. Runtime fallback retains a focused button with aria-disabled and the static label, as already required.

Contact uses 32px intake padding at 768–1023px. The tablet grid starts exactly at 820px: `(viewport−64 gutters−64 padding−32 gap)×7/11` gives a 420px form and 240px sidebar. Below 820px it stacks; below 768px padding 24px. From 1024px padding 40px/gap 64px/7-to-4 columns. These are construction decisions, not a new visual direction.

Typography values are defaults for these named surfaces, not brittle pixel-test assertions. At 320px and 200% text zoom, complete words, natural flow and readability outrank a forced line count. No fixed hero height, reserved portrait column, clamped biography, hidden paragraph or horizontal scrolling is permitted. Except the permitted break in Samuel's name, text wraps naturally.

Retain the repository accessibility target: ordinary meaningful text contrast at least 4.5:1, large text at least 3:1, and controls/focus indicators at least 3:1 against adjacent colors. Verify actual rendered states over the poster/live field, not just the uncomposited color tokens. Decorative graph words may be suppressed; no meaningful label/help/status may be hidden to resolve contrast. Focus order follows source order, with visible focus and correct page/document language in both locales.

## Page anatomy

Exact copy selection is owned by [Studio/Founder](../product/pages/studio-and-founder.md#atlas-redesign-copy-selection), [Contact states](../product/pages/contact-and-privacy.md#atlas-commercial-interaction-copy), [Privacy](../product/pages/contact-and-privacy.md#original-commercial-privacy-draft-proposed-professional-review-required) and [Terms](../product/pages/terms-and-conditions.md). Do not replace approved facts with the earlier abbreviated prototype text.

### Studio

| Order | Wide composition | Compact / semantic behavior |
| --- | --- | --- |
| Identity | 7/5 editorial grid, 64px gap; left opaque introduction plate, right open chart caption aligned near the plate's lower edge | One column; caption follows the intro, with at most 120px of natural visual breathing room |
| Accountability/collaborators | Section heading in approximately 5 columns, one 7-column plate with the complete accountability paragraph and collaborator subsection | Heading then plate; no duplicate operating-model checklist |
| Principles | One continuous plate; four complete principles in a two-column list, 32px gap, internal rules | One column; retain all descriptions and the introduction; use a semantic list |
| Location | Heading and full availability paragraph; quiet readable scrim if the graph would cross text | Same order; distinguish availability from a claim of past international delivery |
| Founder bridge | Short reason to inspect Samuel's experience, followed by one secondary Founder link | No biography, education, CV controls or project cards repeated here |
| Contact ending | Existing closing heading and primary localized Contact action, without demo-only description | Ordinary flow before the shared Footer |

The Studio page remains an explanation of FURLANICH. Home owns the delivery process, Services owns the catalogue and Projects owns detailed evidence. Graph branch words are decorative echoes of the accountability argument.

### Founder

| Order | Exact treatment |
| --- | --- |
| Name and biography | Left-aligned opaque plate, at most 800px wide; role context, one H1 and all three approved biography paragraphs. First paragraph 20px, others 18px. Clever Soft SA remains narrative-only. *(Superseded 2026-10-20; see the Founder CV and experience amendment below.)* |
| Professional links | Immediately after the biography, in the same plate: CV, LinkedIn, GitHub. All are ordinary underlined links with accessible download/external behavior and 44px targets. They wrap without overflow. |
| Experience | Complete two-entry semantic list, including the 2021 internship, with period/context, role and full summary. No invented employment, tenure or endorsement. |
| Education | Both factual education entries, followed by complete MPC educational/group/fictional-business context, limitations and the approved source-code link. |
| Capabilities | Four full groups and all approved items. No proficiency scores, tool wall or replacing professional depth with graph labels. |
| Evidence bridge | Concise approved public-evidence description and one Projects-index link; do not duplicate the dossier catalogue or publish a new Founder-only repository. |
| Contact ending | Existing commercial closing heading/description and localized Contact action. |

At wide sizes, sections after the introductory plate share a continuous reading plate of at most 800px, aligned toward the right of the container. Use internal rules and spacing, not nested cards. Below 1024px both plates fill the container and align to the same edge. The complete introductory content may extend beyond the first viewport; do not shorten it to manufacture a hero screenshot. No portrait, silhouette or empty media space is created.

Preserve `/Samuel-Furlanich-CV.pdf`, its download filename *(Superseded 2026-10-20; see the Founder CV and experience amendment below.)* and the existing professional URLs. Verify PDF content type/signature and actual download in root and `/Portfolio` exports. An authentication wall is not authority to change the approved LinkedIn destination. CV content currency/redesign remains separate work.

### Contact

Source order: introduction, usual response expectation, Pause/static slot, direct-channel surface, Privacy reference and Founder bridge. Preserve the H1 and response copy. The opaque Bone surface contains a channel description/location and the three existing native WhatsApp/email/phone links. At 820px and above use a 7/4 description/action grid, gap 32px (64px at desktop); below 820px stack. Padding stays 24/32/40px, target height at least 48px. No form, fields, validation, submit/busy/results, no-JS warning or delivery claim.

Use the [PAGE-CONTACT icon and alignment contract](../product/pages/contact-and-privacy.md#page-contact-responsibility-and-hierarchy): corresponding icons at a shared left inset, centered labels and equal link dimensions across locales and responsive sizes.

Links have no prefilled message and open the visitor's chosen service. The Privacy link explains direct communication and hosting. Keep focus/source order native, visible and unclipped with text expansion or 320px reflow.


### Privacy and Terms

Both languages share a quiet static reading template: shared App Bar → title → scope/update metadata → compact table of contents → all sections → responsible-party/contact and relevant reciprocal legal link → existing Footer. Legal contents use two columns from 768px if all labels fit, one below. They are ordinary anchor links, not sticky tabs or accordions. All sections are visible without JavaScript. Use meaningful headings, a labeled contents navigation and App-Bar-aware scroll margins.

Privacy covers Samuel’s identity/contact, direct communications via Gmail/WhatsApp/phone, GitHub Pages technical data, graphic preference storage, data minimization and requests about messages. Terms covers website use and initial inquiries only; individually agreed engagements own pricing, payment, IP transfer, warranties, support and project obligations.

Do not publish editorial blocks, invented effective dates or professional-review placeholders. The current drafts are visibly marked in the design artifact only. Public wording is owner-approved factual direct-contact copy. A counsel disposition is no longer a release prerequisite; this does not certify legal sufficiency. Do not invent a checkbox, transfer assessment or legal assertion.

## Page-specific graph specification

### Composition data

These are target rest positions in normalized viewport coordinates `(u,v)`, from left/top. Node IDs are stable `n0` to `n15`, or `n0` to `n7` compact. New profiles use the existing fixed production camera (`z=12`, FOV 35°); convert normalized positions through inverse perspective so their projected rest positions match the reference. The prototype's FOV 50° is not a request to change the production camera. New-profile depth is `z_i = 0.85 × sin(1.7 × i)` scene units; tablet multiplies depth by 0.7, compact by 0.45. The camera never follows a pointer.

| Profile | Wide/tablet anchors, in node order |
| --- | --- |
| Studio | `(.06,.18),(.29,.11),(.54,.17),(.79,.13),(.94,.25),(.12,.43),(.58,.40),(.66,.38),(.86,.46),(.06,.70),(.27,.62),(.51,.69),(.73,.65),(.94,.73),(.39,.86),(.83,.85)` |
| Founder | `(.06,.18),(.30,.12),(.55,.18),(.79,.15),(.94,.26),(.12,.43),(.51,.35),(.79,.38),(.94,.47),(.06,.70),(.49,.63),(.79,.61),(.94,.70),(.27,.84),(.56,.85),(.79,.84)` |
| Contact | `(.06,.20),(.28,.12),(.51,.18),(.80,.18),(.94,.26),(.12,.40),(.39,.36),(.83,.40),(.94,.47),(.06,.70),(.27,.63),(.53,.68),(.85,.63),(.94,.74),(.39,.85),(.82,.85)` |

| Profile | Undirected edges, by node index |
| --- | --- |
| Studio, 20 | `0–1,1–6,2–6,3–4,3–6,5–6,6–7,6–8,6–10,6–11,6–12,9–10,10–14,11–14,12–13,12–15,14–15,1–2,7–8,11–12` |
| Founder, 18 | `3–7,7–11,11–15,0–1,1–2,2–3,3–4,5–6,6–7,7–8,9–10,10–11,11–12,13–14,14–15,1–6,6–10,10–14` |
| Contact, 15 | `0–3,1–3,2–3,3–4,3–7,5–7,6–7,7–8,7–12,9–12,10–12,11–12,12–13,12–15,14–15` |

All three new profiles compact to eight anchors `(.09,.16),(.59,.12),(.91,.30),(.24,.39),(.76,.54),(.08,.66),(.39,.86),(.89,.82)` with ten edges `0–1,1–2,1–3,2–4,3–4,3–5,4–6,4–7,5–6,6–7`. The lower-density phone composition retains connection and brand identity without reproducing every desktop branch. Services/Projects keep their existing 16/33 and 8/13 topology and approved vocabulary.

New profiles use flat camera-facing dots, one thin ring and the approved small bead; no sphere, orbit sculpture or bloom. Target ring diameter is 18px wide / 16px tablet / 14px compact, dot diameter 6/5/4px, ring stroke approximately 1px and edge weight approximately 1px. Services/Projects retain their approved larger node/path proportions. New-profile line color is chart lit, opacity up to 0.55, node opacity up to 0.88; Contact uses the same scene and label opacity as Studio and Founder (the 0.35 Contact multiplier of revision 1 was retired by the owner on 2026-10-20; see the Contact-brightness amendment above). Keep fixed positions at rest, no new idle positional wandering or continuous camera animation.

Studio is a central accountability junction with specialty branches. Founder has a right-side spine with branches suggesting professional depth. Contact converges along the outer right edge and stays visually subordinate to intake. These are illustrative compositions, not architecture diagrams, data transmission, team rosters, degree timelines or proof of a client result.

New profiles bind four decorative words to `n0,n4,n8,n12` in the order owned by Studio/Founder. Compact binds only the first two words to `n0,n4`. Contact binds its three words to `n0,n4,n8`, and its first two compact. Do not append these words to an eight-service catalogue. Introduce a route-specific node-ID/word binding for the host; Services/Projects continue to bind their existing capability words. A label is upright, inert, 12px minimum and hidden if clamping/overlap/masking cannot keep it legible. Clamping labels must never drag a node or foreground content.

### Pointer and node behavior

The owner-approved feel is yielding with inertia. Mouse proximity pushes nearby nodes gently away; it does not attract the whole graph, move buttons, drag an edge or control the camera. Listen passively outside interactive controls on the existing pointer-transparent stage's host. Fine mouse/hover is supported; touch and pen use the scroll-only policy. Do not capture a pointer or require a canvas hit target.

| Input/model property | Target |
| --- | --- |
| Influence | 280px radius wide/tablet; squared falloff `(max(0,1−distance/radius))²`; at most five nearest nodes, stable ID tie-break |
| Node displacement cap | 34 CSS px wide, 24px tablet, 14px compact; combined new local pointer/scroll displacement is capped |
| Yield target | Away from pointer, `0.85 × travelCap × weight × pressure`; distance denominator at least 1px |
| Stationary pressure | `0.16 + 0.84 × exp(−age/0.28s)`; a small steady yield may remain while the pointer stays nearby |
| Node spring | Unit mass, stiffness 42, damping 10; preserve velocity on interruption/exit |
| Momentum | Reference impulse `0.038 × clampedPointerVelocity × weight` per 1/60s of pointer travel; integrate by elapsed path/time, not raw event count |
| Input velocity | Clamp each pointer-velocity axis to ±1400 CSS px/s; ignore non-finite samples; first entry does not invent prior velocity |
| Neighbor share | One non-recursive 0.10 share of the original target to connected neighbors |
| Integration | Monotonic time; steps at most 1/120s; integrate at most 50ms after a gap and discard hidden time |
| Emphasis | Excitation decay 0.45s; node intensity decay about 0.50s and edge emphasis about 0.55s; clamp intensity to 0–1 |
| Rest | Position error <0.02px, speed <0.03px/s and intensity <0.002; settle without visible jitter |

Normalize pointer impulse to elapsed movement: equivalent 60Hz/120Hz event streams along the same trajectory must differ by at most 1.5px at sampled checkpoints. At a normalized 60Hz sample the reference impulse matches A.2; it is not applied repeatedly while a cursor is stationary. Coalesce DOM work; cached viewport/occluder measurements and pure projection supply interaction coordinates. No layout query or React render is permitted for every pointer/scroll event.

On pointer exit or entry into a link, button, disclosure, field or form, remove new excitation and let existing motion damp. A full Pause/fallback clears stimulation immediately. Offsets are constrained inside the visible safe region as well as by the travel cap. Current Services/Projects scroll pose remains its base pose; proximity is a bounded additional layer, not a replacement for chapter progress or connection growth.

**Review clarification:** opaque plate bounds expanded 8px and reading-text bounds expanded by their 24/32px scrim clearance plus 8px also exclude new excitation. Use the same cached rectangles as masking/labels; no layout queries per sample. Preserve previous visible motion tails, then sleep; movement hidden over a plate does not supply velocity on re-entry. The form's stronger control focus suspension still clears stimulation. This prevents invisible 60fps work while reading.

### Flexible edges

Each edge remains attached to the current positions of its endpoints. Use five interior transverse samples at `s=1/6…5/6`, with pinned samples at 0 and 1. Each interior sample has displacement and velocity; neighbor tension propagates a small wave. The graph has no gravity sag, slack-rope simulation, elastic length changes, collider system or perpetual oscillation.

Use tension 90, restoring stiffness 32 and damping 7 at unit mass. Apply local squared proximity within `min(influenceRadius,150px)` to the edge interior, with pressure `0.12+0.88×exp(−age/0.35s)`. Endpoint transverse velocity contributes a `−0.06×velocity×sin(πs)` target lag. Interpolate adjacent samples with a smooth cubic curve, at most twelve segments per full edge; clamp the rendered curve as well as samples. Interior displacement cap: 16px wide, 10px tablet, 6px compact, and 4px on Contact at any size. End samples are always zero relative to their actual node endpoints.

The integration and sleep contract is shared with nodes. Interior error <0.015px and speed <0.025px/s permit sleep; a moving interior keeps the controller awake until settled. Direct edge proximity can bend a string without moving the whole field. Contact keeps all node position offsets exactly zero; only its quiet string bend/emphasis responds. No edge is an interactive control.

Update preallocated batched path buffers; do not rebuild tubes, materials, meshes or curves every frame or add one draw call per string. Keep Services/Projects' visible path thickness, growth and tracers; growth follows the flexible path and a tracer does not jump onto the old straight chord. If a different representation is needed to meet the same appearance/budget, document and render its equivalence before acceptance.

### Touch, rest, masks and lifecycle

Touch has no hover field. Use ordinary passive document scrolling only, with no tap/drag response, prevented default, sensor permission or scroll interception. New-profile scroll impulse uses clamped delta ±120px, gain 0.18, compact strength 0.38 and alternating local directions as in A.2. The displacement caps still apply. Navigation/anchor/restore jumps and resize are state updates, not gestures to replay. Ordinary typing, selection and scrolling inside a textarea do not excite the graph.

New Studio/Founder/Contact profiles have no ambient loop: after a pointer/scroll tail settles they hold the last rest pose with zero callbacks/draws until input or layout changes. Services/Projects retain their existing 1.2°/s ring/bead rotation and capped ambient cadence of 30fps wide/tablet / 20fps compact. Their position/string tails settle into that ambient mode. All five routes cap active cadence at 60fps. This distinction explicitly resolves the existing SPF idle contract against A.2's quiet new pages.

Reading plates are opaque. Mask the scene away from unplated headings/paragraphs with at least 24px of visual clearance; Contact's introduction gets 32px and its Bone form blocks the graph completely. Recompute occluder geometry in one batched pass after resize, fonts, content/locale or preference changes. Reuse cached boxes while scrolling; never probe `elementFromPoint` for each node/frame as the prototype does.

Pause uses the existing bilingual control, reserved in the introduction's action area to prevent layout shift, with 44px target and `aria-pressed`. Persist only the existing session preference across the five connected routes and locales. A focused control that falls back remains present with the static-background label and `aria-disabled`; do not remove focus. On Contact, form focus or submission suspends the decorative drawing and clears new excitation; after focus leaves, wait for the next eligible background input before resuming.

Reduced motion at entry, Save-Data, rejected WebGL2/software renderer, denied capability or a session context-loss flag gives the complete static composition without the optional Three.js request. A runtime preference change cancels and disposes live resources. Hidden tab, offscreen stage, full Footer dominance and disposal leave zero pending drawing callbacks. Resume visible eligible state without replaying hidden time. Context loss falls back for the browsing session, including locale changes. Forced colors removes decorative scene/poster and uses system text, borders and focus colors.

Generate one matched label-free wide and compact poster per new page from its actual production rest pose, with zero input offsets/string displacement. Use the existing 1920×1080 wide / 450×800 compact capture dimensions and cover alignment, registered as `studio`, `founder`, `contact` variants in the current poster family. Do not reuse one identical image for all three meanings. Reuse the existing poster-projection handoff: matching capture/crop on the first live paint, the current approximately three-second projection settling, and the existing 160ms opacity crossfade only after a successful draw. That finite loading transition does not add an ambient loop to new pages. A failed image still leaves a CSS ground. No JavaScript leaves complete HTML, static art, navigation and direct contact links. Respect the existing Home-renderer handoff: at most one active renderer, without changing Home's runtime.

## Direct Contact and activation

Contact uses server-rendered native links without an inquiry processor. There is no browser POST, automatic send, editing state, validation, request lock, simulated outcome, retry or provider failure. No public Contact route imports the dormant inquiry port/configuration. A new embedded intake system would need a new explicit architecture/product decision.

Formspree account/counsel evidence, provider probes, inbox and deletion receipts, and readiness manifests are removed from release requirements. Existing direct messages can still contain personal information; Privacy describes that accurately without claiming a legal exemption, fixed unverified retention or provider deletion guarantee. Ordinary human PR/release review remains.


### Review clarification: pure projection authority

`lib/connected-studio/projection.ts` owns the 35°/z12 perspective, legacy spread/depth/fit and poster crop math, independent of DOM/Three. New Atlas anchors are inverse-projected with tier depth applied once; their layout spreadX/spreadY/depthScale are 1. DPR changes backing pixels, never CSS projection/input. Controller resolves the native/poster frame once before interaction; final pose carries that frame, and renderer/labels consume it. Legacy poses without a frame use the same pure fallback. `lib/connected-studio/rest-path.ts` evaluates the current SPF quadratic rest bow (0.16, existing deterministic edge signs) and straight Atlas rest edges for both physics and rendering. Seven final points include that rest path; rendering adds only their bounded cubic residuals to the analytic rest curve, without applying a second bow. This closes the model/runtime unit ambiguity without changing the camera or the existing SPF rest shape.

## Legal and content boundaries

The current requirements and exact bilingual text live in [Contact and Privacy](../product/pages/contact-and-privacy.md) and [Terms](../product/pages/terms-and-conditions.md). Use supplied identity/contact facts and describe direct messages, hosting and session preferences. Formspree provisioning, processor/country verification, managed 30-day/12-month intake schedules and mandatory counsel approval are retired for this scope. Do not infer a corporation, registration, professional qualification, fixed deletion guarantee or legal exemption. No marketing/CRM/enrichment/pixels or content-bearing telemetry is added.

Keep implementation on the nondeployed integration branch and the coordinated human-reviewed release. Hardware qualification remains a separate lane. No form activation is included.

## Architecture decision for this proposal

Extend the existing connected-scene model/controller/host/engine rather than create three runtimes or merge Home into a universal scene. Preserve semantic server components and locale-owned typed content. Small render-nothing leaves or client runtime boundaries own only their necessary behavior.

| Boundary | Responsibility |
| --- | --- |
| `lib/connected-studio/` | Pure route profiles, topology/rest projection, pointer/scroll state, damped node/string integration, gates/session/controller; injectable clock and scheduler, no DOM/Three dependency in the physics model |
| `components/connected-studio/` | One host for visibility/preferences, cached layout/masks, passive input and control hit masking, localized label bindings and Pause; no per-frame React state |
| Connected runtime | Fixed camera, pooled batched geometry/materials, projected labels, bounded dynamic path buffers, matched-poster handoff and full disposal |
| Studio / Founder / Contact components | Page-owned semantic hierarchy and scoped styling; no duplicate Footer or global material retuning |
| Direct contact | Native links and locale-owned server content; dormant inquiry libraries are not in the public import path. |
| Routes/legal/content | Two locale-owned entry trees, existing route helpers and metadata; Terms registered once in route equivalence/navigation/Footer/export validation |
| Testing/measurement | Observable behavior, rendered references, clean-export route/bundle inspection and actual hardware receipts; diagnostics never include inquiry data |

Extend `ConnectedRoute` for the three new pages and introduce an immutable route-scene profile for graph, node-ID/word bindings, proportions, input policy, ambient policy and poster selection. Existing Services/Projects APIs may adapt through defaults, with regression coverage. Do not conflate their eight-word capability tuple with the new illustrative words. Preserve current session pause/context-loss behavior and Home's read-only handoff; no new persistence of inquiry data.

The current host scheduler defect is already fixed; a second scene-related presentation tail remains unexplained. Diagnose it from current evidence before choosing a targeted refactor. The accepted prototype is neither a replacement engine nor proof that extra work fits the budget. Geometry/buffer work must preserve the visible string/node intent; a material change in fidelity, camera, density or performance ceiling returns for design approval.

## Performance and activation gates

Historical current-main evidence: optional connected engine closure 114.4KiB Brotli against 120KiB, two of four desktop active-frame runs failing a 20ms p95 limit, and no compact hardware acceptance. At the time of that evidence both live-policy flags were false; since PLAN-SFC-V1 Task 18 the shipped policy is `{ wide: true, compact: false }`. These are risks and starting evidence, not new results for this spec.

| Gate | Required target for all five connected route pairs |
| --- | --- |
| Optional engine closure | ≤120KiB Brotli per route/locale incremental closure, including transitive chunks; no hiding host/physics bytes in critical code to evade the gate |
| Poster | ≤150KiB wide, ≤80KiB compact; only correct responsive variant requested |
| Draw calls | ≤28 wide/tablet, ≤18 compact; no per-edge draw expansion |
| DPR | ≤1.5 wide/tablet, ≤1.25 compact; lower only while retaining legibility |
| Active frame cadence | Hardware frame-interval p95 ≤20ms, measured separately from CPU callback cost/GPU time; active cadence ≤60fps |
| Ambient / sleep | SPF ≤30/20fps ambient; new pages zero settled frames; all paused/hidden/offscreen/Footer-dominated states zero callbacks/draws |
| Main thread | Scene-related interaction task <50ms; cached layout, no repeated allocation/layout churn |
| Vitals | LCP ≤2.5s, INP ≤200ms, zero enhancement-attributed CLS under the established lab profiles; no unrounded CLS allowance |
| Lifecycle | At most one live renderer; resources/listeners/observers return to baseline after repeated route/locale changes; no retained input or stale label layer |

Run the existing [hardware protocol](../reviews/services-projects-footer-acceptance-v1/task-9-hardware-protocol.md) extended to all five routes: repeated pointer traversals, stationary-cursor tails, scrolling, focus/submission, pause/visibility/Footer, five route/locale cycles and sustained use. Record the actual named physical desktop and constrained Android phone, OS/browser/GPU/refresh, build/commit and method before collection. An absent physical profile, unavailable GPU timer or unmeasured metric remains OPEN; desktop throttling/SwiftShader is not a phone/GPU receipt. Retain all valid runs and report variability; do not cherry-pick the passing two.

Keep shared tier policy false until every route in that tier passes the applicable gates and the bounded enablement checkpoint is human-reviewed. Candidate-only enablement stays in an isolated worktree and its artifacts cannot be deployed accidentally. Wide and compact may qualify independently. The complete inquiry/readability release can be assessed separately, but the interactive redesign objective is not declared complete merely because static fallback works. If the existing presentation tail prevents the requested motion within these budgets, return the measured options to the owner; do not weaken the gate or quietly drop the requirement.

## Behavior verification and design acceptance

For each behavior change: **RED → run and verify the intended failure → minimal GREEN → REFACTOR → rerun**. A missing module/setup failure alone is not a substitute for a behavior RED when the behavior can be exercised. Preserve receipts by behavior and PR. Never write the relevant production behavior before its failing test. Pure visual changes use this approved spec, rendered comparison, Playwright and visual QA rather than CSS/class-string assertions.

| Layer | Required coverage |
| --- | --- |
| Unit/contract | Route/locale equivalence and sixteen exports; page content/evidence preservation; node/string stability and timing invariance; travel/bend caps, pins, decay/rest, non-finite inputs, interrupt/leave/resize/jumps; Contact fixed nodes; session/gates/scheduler/disposal |
| Direct-contact boundary | No form elements or provider traffic; exact native destinations without prefill; links and disclosures work without JavaScript. |
| Browser behavior | Chromium, Firefox, WebKit; ES/EN navigation, Terms/Privacy/Footer/locale, CV/source links, direct-link focus and no-JavaScript behavior, reduced motion and runtime preference changes, touch scroll-only/no-tap, one-renderer navigation and form-focus suspension |
| Responsive | 320, 390, 768, 1024, 1440px; portrait/landscape, 200% zoom, keyboard opening, no overflow/clipping, all biography/evidence/links visible; stable source order |
| Accessibility | Axe plus manual keyboard, headings/landmarks, native disclosure, screen-reader link/Pause behavior, meaningful external/download labels, contrast through all scene states, forced colors and reduced motion; no conformance claim from axe alone |
| Visual | Taste preflight/postflight, Impeccable bounded audit/adapt/harden/optimize as relevant, Emil motion review, comparison with the approved references at wide/compact; human review of intentional static visual baselines only |
| Export/performance | Clean root and `/Portfolio` builds, actual route/artifact/404 verification, optional-chunk request/closure cross-check, responsive posters, hardware and vitals protocols, no live submission in ordinary CI |
| Completion | `npm run validate`, relevant Playwright/axe/export/measurement suites, complete diff/self-review, verification-before-completion and pr-readiness; fresh independent review and human PR merge |

Static screenshot comparisons run in controlled Chromium with reduced motion and stable content after approval; Firefox/WebKit supply behavior/layout smoke, not redundant pixel baselines. Ordinary reports stay out of source. The committed design-reference gallery documents the deliberate alternatives, not automatic golden approval. Do not mask a visual regression or update baselines to make tests green. Any test's zero selected tests or unmeasured mode is a failure/missing evidence, not a pass.

Independent plan review uses Claude Opus 5.5 High in a separate top-level review-only session, with no rewrite by the reviewer. [PLAN-SFC-V1](../plans/completed/studio-founder-contact-v1.md) is authored by this planning authority after Q14 written-spec approval. Revision 1 received REVISION REQUIRED; revision 2 and its [finding dispositions](../reviews/studio-founder-contact-plan-review-2026-10-14.md) await re-review. Q16 authorizes the exact GPT-6 Luna High / Claude Sonnet 5.5 High implementation targets, verified identifiers before dispatch and task-level isolation under GOV-AGENT-USAGE. No unavailable-model substitution or implementation task execution is authorized by this design artifact.

## Current evidence and approval gate

The discovery/gallery contains A/B/C structural comparisons, A.1 inertia and A.2 strings. A full-copy written-design rendering additionally checked all five page types in ES/EN at the five specified widths: 50 views, no overflow/page-script errors, complete three-paragraph biography/internship/MPC checks and no canvas on legal pages. This is a standalone software-rendered HTML reference, not production code, browser-matrix acceptance, hardware performance or a legal/commercial release receipt.

The owner approved written revision 1, linked copy and bounded RFC scope in Q14, the controlled release sequence in Q15, and provider/staging/copy corrections in Q16–18. ADE planning is authorized; additional revision 2 construction/projection/focus clarifications remain proposed pending revised-plan acceptance. The direct-contact amendment retires processor/counsel/probe/deletion gates. Physical runtime qualification and ordinary review/deployment acceptance remain independently owned. They do not license an implementer to invent content or bypass a gate. Independent Opus re-review, owner authorization and governance acceptance precede implementation.

## Commercial Contact and activation

Retired historical anchor. The direct-contact amendment and current Contact section above replace the former processor/counsel activation flow.

## Founder CV and experience amendment (2026-10-20)

Bounded current amendment owned by [PAGE-FOUNDER](../product/pages/studio-and-founder.md#founder-cv-experience-amendment-approved-2026-10-20). The Founder experience list has three entries (CleverSoft S.A. first, then the two existing entries) in the existing four-field schema and layout, and each locale downloads its own native CV (`/Samuel-Furlanich-CV-ES.pdf`, `/Samuel-Furlanich-CV-EN.pdf`) with a matching download filename; the legacy `/Samuel-Furlanich-CV.pdf` is removed. Layout, typography, native link treatment, runtime decisions and historical approvals are unchanged.
