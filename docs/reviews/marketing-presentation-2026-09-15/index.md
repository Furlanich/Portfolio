---
id: REVIEW-MARKETING-PRESENTATION
type: marketing-review
status: PROPOSED
related:
  - BRAND-POSITIONING
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PROJECT-EVIDENCE
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-CONTACT-INQUIRY-DEMO-MODE
last_verified: 2026-09-15
---

# FURLANICH — Marketing and presentation excellence audit

## Executive verdict

**FINDING — 5.8/10 as a commercial presentation.** FURLANICH has a coherent, readable foundation and a credible founder-led premise. It does not yet present with the conviction, proof density, or editorial discipline expected of a strong boutique software studio. The main limitation is the imbalance between what the site explains, what it proves, and how much effort it asks of the buyer.

The initial promise is relevant. Later, the experience increasingly reads like an internal specification made public: publication permissions, verification vocabulary, exclusions, and descriptions of what pages themselves contain. It is more deliberate than a developer portfolio, but its evidence selection and Founder presentation pull the perception back toward an early-career portfolio. This judges presentation, not Samuel's ability, and is no reason to invent seniority.

**FACT — the current deployment is a technical demonstration.** A working inquiry processor is not expected. The defect is contradictory messaging about the demonstration, not the absence of real submission. This audit neither authorizes activation nor recommends hiding that boundary.

**RECOMMENDATION:** close positioning, evidence hierarchy, content compression, and the demonstration contract before a visual correction initiative. New wording, layouts, navigation changes, and evidence placement remain PROPOSED. Preserve approved requirements until a human changes their owners. Do not proceed directly to production edits.

### Five strongest aspects

1. Recognizable buyer problems: scattered bookings, repetitive customer service, outdated websites, and unstable existing systems.
2. Named founder accountability without invented team members, customer logos, awards or testimonials.
3. Restrained visual foundation: navy text, blue actions, consistent gutters and readable typography.
4. Sound visible engineering: 100 page/viewport visits without detected overflow, broken content images or console/page errors; local failure preserves values and success clears them.
5. Honest maturity and conceptual-visual labels that distinguish educational/Lab material from production/client outcomes.

### Ten highest-impact weaknesses

| Rank | Weakness | Commercial effect | Finding |
| --- | --- | --- | --- |
| 1 | Contact says both “no data sent” and “we will use your information” | Contradictory data/response expectations at the decisive step | MKT-CONTACT-001 |
| 2 | “Write on WhatsApp” opens Contact | Promised action and destination disagree | MKT-NAV-001 |
| 3 | Proof explains publication policy instead of demonstrating capability | Buyer learns the rules without receiving much evidence | MKT-HOME-002, MKT-PROOF-004 |
| 4 | Services is a long scope-and-exclusions document | Qualification fatigue before action | MKT-SVC-001/002 |
| 5 | Educational and RPG examples carry prominent commercial weight | Reinforces portfolio rather than studio perception | MKT-PROOF-001/002 |
| 6 | No current runtime demonstration or verified business outcome in the public selection | Nontechnical buyers must infer capability from source | MKT-PROOF-003, MKT-TRUST-001 |
| 7 | Hero explains a category without a memorable reason to choose this studio | Relevance without differentiation | MKT-POS-001, MKT-HOME-001 |
| 8 | Repeated cards, pale bands and spacing | Systematic but weakly distinctive presentation | MKT-VIS-001/002 |
| 9 | Long Founder biography and CV-first bridge | Recruiter framing delays buyer confidence | MKT-FOUNDER-001/002 |
| 10 | Mobile reading and menu friction | Long introductions; open menu covers Process destination | MKT-CONTACT-002, MKT-NAV-002 |

Slash-separated finding suffixes identify separate records with the same prefix.

## Scope, authority, and method

**FACT:** inspected the deployed [Spanish experience](https://furlanich.github.io/Portfolio/) and [English experience](https://furlanich.github.io/Portfolio/en/), Services, Projects/Work, all three paired details, Studio/About, Founder, Contact, Privacy, navigation/footer and cross-links on 2026-09-15.

- Source baseline: `5af49a6196a564dbd9aee648454e74df2613fe32`, matching fetched `origin/main`.
- Observed deployment branch: `eec0f3bc661615ba82139b04b9e9d119f22002ba`, subject `deploy: 5af49a6196a564dbd9aee648454e74df2613fe32`.
- Browser: repository Playwright Chromium on Windows, headless, device scale 1, public HTTPS and `/Portfolio` base path. No local substitute was scored.
- Twenty routes × five widths = **100 initial and 100 full-page captures**. Dimensions: `320×900`, `390×844`, `768×1024`, `1024×768`, `1440×900`. The 320 height differs from the repository's 800px profile; findings use recorded dimensions.
- Desktop full-page boards support narrative/section review. Mobile samples cover first scroll, middle, ending and footer. Stitching of full-page screenshots is not evidence of sticky-header behavior during ordinary scrolling.
- Sources consulted: documentation index, glossary, architecture map, lifecycle and RFC/ADR/plan indexes; positioning, audiences/services, IA, evidence inventory/item records; page-owner specifications; visual/interaction specifications; both locales' major content modules; relevant shared page, header, footer, project-detail and form components.
- Skills used: `visual-qa`, `playwright-qa`, stable `design-taste-frontend-v1`, knowledge-maintenance, verification-before-completion and PR-readiness. Taste is advisory.
- Ordinary local execution/browser tools initially failed before startup. Elevated execution recovered repository reads and Playwright. The web reader could not open the deployment; Chromium did.
- Initial axe harness required an explicit context and was rerun. Initial journey logging used insufficient SPA waits and broad matching; corrected exact-destination/URL-wait evidence supersedes it.

**FACT** = observed runtime/source/document evidence. **FINDING** = auditor interpretation. **RECOMMENDATION** = advice. **PROPOSED CHANGE** = option needing the stated decision. None means APPROVED. This is a documentation-only review, not an approval RFC or implementation plan.

Appendices: [structured findings](findings.md), [line-level copy review](copy-review.md), [browser and CTA evidence](browser-evidence.md). Screenshots are review evidence, not approved design assets.

**Limits:** scores are expert heuristics, not conversion measurements or user research. No prospect interviews, analytics, provider activation, inbox delivery, legal verification, real-device testing, full screen-reader audit or cross-browser certification. Project repositories were checked for availability; their software was not executed or re-certified. Viewport testing does not establish actual iOS/Android behavior. Performance samples are unthrottled observations, not Core Web Vitals or an SLA.

## Commercial scorecard

9–10: exceptional coherent buyer experience; 7–8: credible with visible gaps; 5–6: understandable with material persuasion gaps; 3–4: major trust/action weakness. Severity describes commercial effect. No CRITICAL issue is invented where HIGH is sufficient. Overall is a holistic commercial judgment, not a measured conversion rate or a mechanically averaged quality gate.

| Area | Score / 10 | Severity | Main weakness |
| --- | ---: | --- | --- |
| Positioning | 6 | HIGH | Broad usefulness; little memorable differentiation |
| Homepage | 6 | HIGH | Repetition and policy-led proof |
| Services | 5 | HIGH | Scope/exclusion treatment overwhelms sales narrative |
| Projects | 4.5 | HIGH | Weak buyer relevance and no current functional demonstration |
| Studio | 7 | MEDIUM | Good model, repeated defensively |
| Founder | 6.5 | MEDIUM | Biography wall and CV-first bridge |
| Contact | 5 | HIGH | Simulation conflicts with real-inquiry promises |
| Navigation | 6 | HIGH | WhatsApp mislabel; mobile menu stays open |
| Copy ES | 6 | HIGH | Natural voseo mixed with governance vocabulary |
| Copy EN | 5.5 | HIGH | Literal phrasing and procedural abstractions |
| Visual design | 6 | MEDIUM | Repeated pale bands/cards; little ownable identity |
| Mobile | 6 | HIGH | Safe reflow but excessive reading/scrolling |
| Trust | 5.5 | HIGH | Integrity explained more strongly than capability demonstrated |
| Conversion | 4.5 | HIGH | Mode/label inconsistency and weak proof bridges |
| **Overall** | **5.8** | **HIGH** | Solid foundation; substantial presentation work remains |

### Brand perception

| Dimension | /10 | Exact reason below 9 |
| --- | ---: | --- |
| Professionalism | 7 | `limited`, mislabeled CTA and conflicting Contact statements interrupt otherwise consistent design |
| Perceived technical competence | 7.5 | Code and QA language help; no current runnable public evidence closes the capability claim |
| Commercial credibility | 5.5 | 2021 educational/RPG work and active-service language conflict with a demo-stage business impression |
| Clarity | 6.5 | Services are identifiable; long lists and “concrete needs” obscure the simplest offer |
| Sophistication | 5.5 | Equivalent panels and thin-content sections show little editorial prioritization |
| Modernity | 6.5 | Responsive restrained UI is contemporary; default-looking cards and procedural prose limit product-minded perception |
| Freshness | 4.5 | Few distinctive graphics/voice cues; gray-white cadence dominates |
| Memorability | 4.5 | Broad sell/serve/operate promise and text wordmark offer few specific recall cues |
| Visual confidence | 6 | Strong H1/actions are diluted by cautionary proof and equal-weight surfaces |
| Founder trust | 7 | Named accountable person and history help; concise practical judgment is buried in biography |
| Evidence credibility | 5 | Honest labels, but source existence is not current functionality or delivery success |
| Conversion readiness | 4.5 | Inactive demo processing is expected; conflicting instructions and destinations still make the journey unreliable |
| International readiness | 5.5 | English routes work; awkward language, long titles and unspecified business-day context weaken confidence |

## First impression: 5–10 seconds

Expert simulation, not an actual visitor study:

| Question | Likely answer | Ambiguity |
| --- | --- | --- |
| What is FURLANICH? | Custom-software provider for SMBs | Founder-led studio is not the first-screen organizing idea |
| What does it do? | Web, WhatsApp, integrations, existing-system improvements | Requires the long description; H1 alone names broad benefits |
| Who is it for? | Pymes / small and medium businesses | No priority buying situation distinguishes them |
| Why care? | Sell, serve and operate better | Plausible but applicable to many suppliers |
| Why trust it? | Direct technical contact, Buenos Aires, bilingual access | Access/location do not prove delivery |
| Next step? | Discuss a project or view services | Clear actions; expected commercial inquiry later meets simulation |
| Studio or disguised portfolio? | Studio-like opening; portfolio-like evidence later | More deliberate than a résumé homepage, not yet convincing boutique presentation |
| Immediate trust reducer? | Generic breadth, little tangible proof, uncertain active status | No invented scale visible; Contact contradiction emerges later |

At 1440px the left-aligned H1 dominates cleanly. At 390px observed primary actions start near y=577 ES / y=609 EN: they are not universally below the fold. At 320px, longer English eyebrow/H1/support substantially increase reading effort. The issue is wrapping and hierarchy, not overflow.

## Positioning territories — no approved wording

Specificity is strongest in operational examples, weakest at brand level. “Practical software” is credible but forgettable. Repeated “concrete needs,” “maintainable,” and “direct technical responsibility” become procedural vocabulary. Improving/integrating existing tools is commercially valuable but often introduced negatively.

The durable descriptor remains PROPOSED in [BRAND-POSITIONING](../../product/vision-and-positioning.md); approval of HOME-HERO does not adopt it permanently.

| Territory | Strength | Risk | Advisory use |
| --- | --- | --- | --- |
| Custom software studio | Clear category, honest boutique scale | Commodity without a sharper reason to choose | Useful category anchor, insufficient alone |
| Digital systems for growing businesses | Accessible outcome orientation | Excludes some maintenance buyers; growth framing needs an explicit audience decision | Test only if growth focus is chosen |
| Software engineering for business operations | Links maintenance, integrations and operational problems | Technical tone; may underplay simple websites | Strong candidate strategic territory, subject to buyer-language testing |
| Web, automation and integrations for business processes | Concrete coverage | Long list; maintenance disappears | Service explanation rather than permanent descriptor |

**RECOMMENDATION:** decide category, priority buying situation and practical founder benefit together. Shortlist two territories and test concise bilingual heroes against actual permissible evidence. A clever slogan cannot repair missing proof.

## Homepage narrative and hero

| Section | Visitor question / marketing purpose | Value, repetition, transition, visual treatment and CTA |
| --- | --- | --- |
| Hero | What do you do, for whom, and where do I start? | High value. Eyebrow qualifies; broad H1 and whole-offer description overlap. CTA hierarchy works. Trust/availability repeat access facts; empty right side supplies space but little identity |
| Problems | Is this relevant to me? | Strong recognition: four tangible situations. Good transition from broad promise. Equal cards start a repeated pattern; Services CTA is useful |
| Services | What can I request? | Necessary three-offer explanation, repeating hero/problems. Negative platform framing distracts. Another Services action soon after the previous one |
| Audiences | Do you understand my kind of business? | Sector names qualify but repeat catalogues/orders/bookings/integrations. No claim of sector expertise is justified. Four more cards add length; Contact CTA precedes strong proof |
| Proof | Why believe you? | Weakest transition: publication rules replace expected evidence. Commitments duplicate founder/process facts. Founder CTA does not lead to selected work |
| Process | How would work happen? | Useful ordered sequence and visual variation. Deliverables/risks/validation language is verbose. Quality practices and Contact CTA are relevant |
| Founder | Who is accountable? | Valuable human context, repeated after Proof. Education/collaboration details already belong to Founder. Wide split adds variation; two actions are logical |
| Final CTA | What next? | Visible endpoint. Conditional “whether it makes sense” sounds gatekeeping. Response copy is prominent and needs mode/channel scope. Centered band differs from documented left alignment |

**PROPOSED CHANGE:** compress Audiences into adjacent relevance context; consolidate repeated accountability; give Process concise buyer-useful outputs. The standalone Audiences block and catch-all ending could disappear without losing understanding if priority contexts remain elsewhere. The publication-policy presentation could disappear only while truthful maturity/disclosure restrictions remain appropriately visible. No approved section is removed here.

### Hero element judgments

- **Eyebrow:** useful category/audience; English too long for minor qualification.
- **H1:** tangible verbs outperform innovation slogans, but “practical” and “better” do not differentiate. EN expansion requires sharper thought, not louder type.
- **Support:** too many deliverables in one paragraph; “organizations with concrete needs” adds almost no information.
- **Primary action:** strong, human ES; “project” can imply the visitor already needs a defined scope. Services resolves that anxiety too late.
- **Secondary action:** clear and appropriately subordinate.
- **Trust line:** direct contact helps; location/languages are access facts. “Projects in Spanish and English” may imply history rather than availability.
- **Availability:** overlaps trust line; merge the job subject to approval.
- **Composition/whitespace:** clean but impersonal. A restrained 2D motif or permission-approved representation is an option, not a need to fill every gap.
- **Mobile:** safe natural reflow. Shorten EN and support before shrinking type; multiple small supporting lines add noise.

## Page-by-page commercial judgment

### Services

A buyer can eventually understand the requestable work: sites/catalogues, ordering or booking flows, portals, WhatsApp workflows/integrations and diagnosis/improvement of existing systems. Outputs are realistic and external constraints explicit. This is tailored work after discovery, not fixed packages.

The sales problem is effort. Extracted body text contains approximately 2,153 ES / 2,133 EN whitespace-delimited words including chrome and screen-reader text. At 390px, page height is 20,110 / 19,574px. Situations, levels, examples, possible scope, exclusions, dependencies, fit, non-fit, evidence and principles often restate similar distinctions. Comparison cards have a role; repeated exclusion/fit panels and six principle cards create fatigue. Consulting has the clearest problem-led opening but falls into the same long template.

**PROPOSED CHANGE:** each service should have a scan layer of problem, useful deliverable, suitable example, engagement starting point, essential dependency, honest evidence pointer and CTA. Consolidate repeated cross-service exclusions while keeping material WhatsApp/provider restrictions visible. Do not hide them in inaccessible fine print or assume accordions are approved. Explain the first conversation's purpose/output without inventing free discovery, prices, packages or deadlines. The Web evidence paragraph names the reservation system without a contextual link; connect the approved detail rather than expanding unsupported claims.

### Projects and each public item

| Item | Does it increase hiring confidence? | Proposed direction |
| --- | --- | --- |
| General Reservation System | Moderately for technical buyers: relevant transport reservations and public source. Weakly for business owners: no current verified demo, historical 404 and many non-claims | Lead with permitted reservation/passenger workflow, keeping implementation-only/prototype status. Fresh runtime verification must precede any stronger demonstration or media claim |
| The-System | Access/multiuser modeling helps a technical buyer; RPG domain and subscription abstractions require a business-relevance explanation. Current runtime unverified | Keep visibly secondary as Lab if its learning/capability role is clear; otherwise consider Founder-only. Never imply delivered commercial platform or planned features working |
| MPC Administración | Early technical context, weak hiring proof: educational group work from 2021 for a fictional factory, without current execution or sole-authorship verification | Strongest Founder/education-only candidate. Preserve group/educational/fictional/runtime limits. Repositioning requires inventory and IA approval |

The index's lack of imagery is explicitly approved, not a missing-asset bug. The 2+1 card layout and repeated metadata feel like a catalogue. Details stretch roughly 250–290 body words into 3,750–4,000 desktop pixels. Separate scope, capabilities, result, evidence and limitation bands repeat information. Thin conceptual graphics vary the opening but do not prove functionality and become visually weak at small sizes. Fewer stronger items may improve trust; excluded projects must not be republished to fill space.

### Studio

Samuel's discovery/direction/delivery responsibility and scope-dependent specialists communicate a deliberate founder-led model without implying a large consultancy. The split opening, operating-model list and unboxed principles are strong.

Repeated accountability/collaborator explanations and criticism of sales-management layers sound defensive. State practical benefits—clear decisions, fewer handoffs, a named responsible person—and the collaborator boundary once. “With projects across the country” reads as activity/history; the established fact is availability, not a client footprint. The Founder bridge lists another page's contents rather than giving one reason to meet Samuel.

### Founder

Grouped capabilities are better than a technology-logo cloud. Preserve independent work since 2024, education, .NET/web emphasis and current employment exactly as supported. The first screen is a biography wall; mobile reading continues past the initial viewport. Education/tool names precede a concise explanation of practical responsibility. Solid-blue Download CV above history prioritizes recruiter evaluation.

Current employment appearing only in biography is an explicitly approved choice, not a missing-fact defect. Reconsidering it requires approval; do not silently add a timeline entry. Do not turn “studies completed” into an invented degree title, conceal experience dates, imply seniority or suggest employer endorsement. A shorter opening and more purposeful professional-links hierarchy would improve framing without changing facts.

### Contact and Privacy

Four fields are appropriate: required name/email/problem, optional company. No mandatory phone, budget, account, booking or upload. Labels are clear. Local failure preserves input, retry works, and success clears fields and explicitly says no information was sent.

But the introduction promises personal review/response, the email helper says it will be used to respond, and the form says no inquiry is created. The data-use sentence directly above Simulate submission is the clearest contradiction. The failure-test address assists demo evaluation but adds technical clutter to a buyer-styled experience. Keep demonstration unmistakable and make surrounding copy describe the same mode.

At 390px, the initial viewport is dominated by intro, response expectation and demo notice; fields begin later. ES WhatsApp alternative was measured near y=2215. Equal outlined alternatives establish preference mainly through order. “Determine whether it makes sense” qualifies the visitor before explaining what they gain. Privacy reinforces the local-only mode, but its future-activation discussion exposes the unfinished product more explicitly than the commercial pages. Resolve the mismatch without deleting necessary truthful disclosure.

**Separate future activation copy inventory:** demo title/body/test address; submit/loading/success/failure wording; email/data-use helpers; response-channel scope; alternative-channel explanation; Privacy and whole-site mode references. Change only after existing legal/processor/privacy/delivery/deletion gates pass. Verify actual response commitment then. No provider or copy is approved or enabled here.

### Navigation and footer

Services, Projects/Work and Studio/About earn top-level places. Founder remaining secondary supports the business journey. Brand-to-home and equivalent-language routes work. “Proceso/Process” is less buyer-oriented than the IA's “Cómo trabajamos/How we work.” Contact plus primary Contact action repeats a destination. The language button preceding navigation adds visual weight near 1024px. First stabilize primary-action meaning across routes; major IA changes remain PROPOSED.

Native mobile disclosure opens with Enter. Escape and same-page Process navigation leave it open in both tested locales. This is not automatically a WCAG violation—it is not a modal—but the overlay can obstruct the destination. Any closure refinement must preserve keyboard, focus and no-JS access.

Footer grouping is useful on desktop. On mobile it adds roughly another screen after the final action, repeats navigation/contact and separates location from useful links. Email/phone are not visible as values for scanning, although destinations exist. IA lists footer language switching/copyright identity, neither rendered. Missing copyright alone is not legal noncompliance. Prefer a compact professional ending without inventing a corporate suffix or address.

## Copy, visual hierarchy, and personality

The [copy register](copy-review.md) quotes important current lines, tags problems and gives directions without replacement approval. Good copy should not be rewritten merely for novelty.

**Spanish:** “Contanos,” “Tenés,” “necesitás” are natural Argentine choices. The issue is procedural vocabulary: “alcance,” “explícito,” “evidencia de implementación,” “necesidad concreta” and repeated infinitive-led lists. “Buen encaje” feels translated; “scaffolded” is inappropriate for nontechnical Spanish buyers. Avoid forced slang or voseo in every sentence.

**English:** comprehensible, not consistently original-sounding. “Concrete needs,” “arrive with the solution already defined,” “brought in explicitly,” “separately contracted continuity” and “current runtime” resemble internal translated documents. Inquiry/enquiry and business/commercial websites vary. Choose an editorial convention and natural buyer language without embellishing facts.

The H1/action relationship is stronger than middle-page hierarchy. Equal cards, similar labels and pale alternating bands make too many ideas equally important. Exclusions sometimes receive a panel as prominent as engagement scope. Generous spacing becomes low information density when each band holds only a short status paragraph.

### Taste advisory, separate from requirements

| Taste observation | Useful audit conclusion | Authority boundary |
| --- | --- | --- |
| Anti-card-overuse | Eleven homepage situation/service/audience cards precede proof; Services adds numerous comparison/fit/exclusion/principle panels | Current cards are explicitly approved. Recomposition is a proposal, not automatic nonconformance |
| Layout diversification | Studio split and Process sequence show variation without decoration | Explore more purposeful editorial arrangements through design-owner review |
| Distinctive typography | Composition could become more ownable; font replacement alone changes little | Approved Inter outranks Taste's blanket ban |
| One accent / intentional whitespace | Existing strength; empty space should emphasize a useful idea | Keep palette unless a separate decision supports change |
| Perpetual animation / magnetic controls | Not a default remedy for persuasion gaps | Conflicts with approved restrained motion and stationary controls; not adopted |
| Glass / 3D / scrolling spectacle | Does not address proof/copy problems | Deferred and outside this initiative |

**RECOMMENDATION:** precise, modern, ambitious and approachable technical confidence through concise voice, selective narrative, typographic grouping, purposeful contrast and evidence storytelling. Candidates: restrained 2D flow motif, consistent editorial labels, deliberate desktop asymmetry and source-approved project media. A permitted real portrait may humanize accountability; never use a generated substitute. Micro-interactions should communicate states and preserve reduced-motion parity.

The experience is sterile because abstract text on pale surfaces carries almost every page. Startup-level polish can come from typography, fast rendering, crisp states and a sharply framed real problem. It does not require counters, anonymous logos, fake dashboards, team photographs, offices, venture language or proprietary-platform claims.

## Trust-signal inventory

| Visible signal | Classification | Assessment |
| --- | --- | --- |
| Samuel named as responsible lead | Founder-backed | Strong but repeated |
| Approved history, education and employment biography | Founder-backed | Provenance, not FURLANICH client outcomes or employer endorsement |
| GitHub profile and three repositories | Technical / evidence-backed | URLs reachable; source is not runtime or delivery proof |
| LinkedIn and CV | Founder-backed | Useful secondary verification; LinkedIn profile contents not independently audited |
| Prototype/Lab/educational labels | Evidence-backed limitation | Essential truth; hierarchy can improve without deleting limits |
| Conceptual visual captions | Evidence-backed disclosure | Prevents screenshot inference; illustration is not functional proof |
| Process and QA statement | Process-backed intention | Predicts collaboration, not certification or delivery metric |
| WhatsApp/email/phone | Founder-backed access | Destinations exist; not proof of response performance |
| Buenos Aires / bilingual / international availability | Availability; weak as capability proof | Useful fit context; must not imply existing international clients |
| Publication/permission commitments | Weak / redundant as proof | Valid integrity policy occupying space where a buyer expects evidence |
| Same-business-day response | Operational promise | Helpful with real-channel scope; contradictory beside simulation |
| Local form validation/retry states | Technical / process-backed | Positive product-care signal weakened by surrounding copy |
| Production/private-work framing in Projects introduction | Potentially misleading inference | Current selection has no production-confirmed public project; do not imply unseen client work |

**Missing:** a buyer-understandable relevant workflow demonstration, fresh inspectable evidence, concise first-engagement output, and evidence tied to maintenance/WhatsApp. These are future verification/permission tasks, not opportunities to invent social proof. No testimonials, metrics, clients, awards, certificates, partnerships, offices, corporate/tax identity, revenue or team counts were substantiated by this audit; none should be invented.

## Conversion and marketing funnel

The [CTA inventory](browser-evidence.md) records visible anchors on all 20 routes: navigation/footer, page actions, service anchors, repository/CV links and direct channels. Intended commercial conversion is an inquiry; current primary interaction is a local demonstration. Services, Projects/details and Founder provide secondary evaluation. External channels are alternatives, not evidence of a form inquiry.

| Journey | Result | Friction |
| --- | --- | --- |
| Home → Contact | Reached ES/EN | Commercial invitation ends in simulation with mixed promises |
| Home → Services → Contact | Reached ES/EN | Long scan; specific service CTAs all lose service context |
| Home → Projects → Contact | Reached ES/EN | Main homepage body lacks a Work bridge; menu/footer can reach it; selection may reduce confidence |
| Home → Studio → Founder → Contact | Reached ES/EN | Repeated accountability and a long professional-profile detour |
| Detail → related service → Contact | Reached via `#web` ES/EN | Correct anchor; service proof does not link back to the relevant item; project context is lost |

No inspected route is a navigational dead end. **Persuasion dead ends** remain: the source repository is the end of proof for a nontechnical buyer, and all contextual actions lead to the same four-field prompt. Context preservation is an option requiring product/privacy review, not a reason to add fields or personal-data query parameters by default.

### Funnel weaknesses ranked by likely effect

1. **Trust → evidence:** strongest strategic gap. Integrity is explained, but current functional/production proof does not close the promise.
2. **Evidence → action:** mode/CTA inconsistencies undermine willingness to act; immediate correctness priority.
3. **Understanding:** long Services scope makes the offer expensive to evaluate.
4. **Awareness → relevance:** broad hero is recognizable but weakly differentiating; operational specificity needs greater emphasis.
5. **Action mechanics:** four fields/alternatives are reasonable; improve mode clarity, mobile placement and response framing before new mechanisms.

No uplift percentages are asserted. Actual effect needs separately approved research/measurement compatible with demonstration/privacy status.

### Audience review

| Audience | What works | What limits conviction |
| --- | --- | --- |
| Small-business owner | Familiar bookings/orders/manual work | Long exclusions and evidence jargon; needs a short concrete example |
| Operations manager | Integrations, existing-system improvement, human handoff | No current workflow demonstration; needs concise scope/outcome boundaries |
| Digitally capable SMB buyer | Distinct sites/flows/portals/maintenance | Engagement starting points hard to compare; weak proof |
| International buyer | English equivalents and availability | Awkward phrasing, long titles, ambiguous business-day/time-zone scope |
| Technical stakeholder | Source, testing, permissions, .NET/web context | Runtime unverified; abstractions do not resolve execution risk |
| Accidental recruiter | CV, history, education, professional links | Well served on Founder; do not promote this into commercial navigation |

## Competitor-quality benchmark

Conceptual benchmark, not copied design or verification of comparator claims. First-party sources consulted on 2026-09-15:

- [thoughtbot](https://thoughtbot.com/) places named work and detailed case-study paths close to positioning. **Inference:** promises gain force when quickly followed by inspectable evidence. Adopt narrative discipline, not its team-scale or outcome claims.
- [Puro Software](https://www.puro.software/) connects operational situations, project narratives and engagement explanations. **Inference:** concrete context and an understandable first engagement support SMB qualification. Its tax/customer/commercial claims are not FURLANICH facts.
- Previously named [WAPP](https://www.wapp.com.ar/) returned no usable text in this check. No current visual/copy conclusion about WAPP is asserted.

Against a strong boutique-studio archetype, FURLANICH has clean basics but weaker proof/differentiation. Against a product-development consultancy, it explains procedure more than product judgment. Against a strong founder-led technology business, it names the accountable person but repeats the operating model instead of expressing a concise practical point of view. No comparator conversion performance is known; no trend is recommended merely for popularity.

## Performance and accessibility as marketing quality

**FACT:** 100 visits returned 200 with no recorded overflow, content-image failures or console/page errors. Twenty default-state desktop axe scans found no violations under selected WCAG 2 A/AA and 2.1 A/AA tags. Founder ES/EN had `aria-valid-attr-value` incomplete results; focused DOM/source review found invalid space-containing ID references in capability groups (MKT-A11Y-001). This does not certify WCAG 2.2 or whole-site accessibility.

Keyboard Enter opens the menu; Escape and Process navigation leave it open. Contact empty submission focuses Name; failure and success focus status; failure preserves values, successful retry clears them. No real external channel was activated. Submission-period recorded requests were same-site GET/HEAD route prefetches, not a submission POST. Source uses the local adapter. This is limited observation, not a new comprehensive privacy/storage certification.

Six sampled unthrottled navigations recorded zero layout-shift entries during observation and fast paint in a warmed browser context. This supports stable visible rendering in the sample, not cold mobile speed, field Core Web Vitals, INP or a commercial performance guarantee. The dominant mobile weakness is reading effort, not observed instability. Preserve the engineering foundation while improving presentation.

## Prioritized correction backlog — PROPOSED

Order: credibility damage, clarity, conversion, first impression, trust, visual benefit, then cost. Effort is relative, not a quote. IDs below omit common `MKT-` prefix; full records appear in [findings](findings.md).

| Priority | Work package | IDs | Effort | Decision / acceptance before implementation |
| --- | --- | --- | --- | --- |
| P0 — credibility damage / must fix | Make demo/data/response statements coherent | CONTACT-001, POS-002 | Small–medium | Approve mode-specific bilingual copy; preserve local-only behavior |
| P0 | Correct WhatsApp label/destination | NAV-001 | Small | Preserve approved Contact destination and restore correct label unless a new destination is approved |
| P1 — high commercial impact | Category, priority buying situation, founder differentiation | POS-001, HOME-001, COPY-001/002 | Medium | Choose territory; approve bilingual hero/category |
| P1 | Proof role, selection and verification plan | HOME-002, PROOF-001/002/003/004/005, TRUST-001, CONV-002 | Medium; verification may be larger | Preserve maturity/disclosure and item-level homepage gates |
| P1 | Compress Services and connect approved evidence | SVC-001/002/003/004 | Medium | Buyer scan layer and essential dependencies approved |
| P1 | Replace raw `limited` with approved publication explanation | VIS-003 | Small | Restore existing localized content; no scope expansion |
| P1 | Mobile Contact, menu visibility and Founder accessible labels | CONTACT-002, NAV-002, A11Y-001 | Small–medium | Mode/reading-order and interaction decisions; keyboard/no-JS access retained |
| P2 — meaningful polish | Reduce repeated audiences/accountability/panels | HOME-003, VIS-001/002/004 | Medium | Approve revised section roles and compositions |
| P2 | Tighten Studio and Founder | STUDIO-001/002, FOUNDER-001/002 | Medium | Preserve all biography, collaborator and availability facts |
| P2 | CTA vocabulary, context and footer | NAV-003, CONV-001, FOOTER-001 | Small–medium | Consequential IA uses governance; no extra form fields by default |
| P2 | ES/EN consistency and status wording | COPY-001/002, CONTACT-003 | Medium | Line-level approval and locale parity |
| P2 | Reconcile stale current-state documentation | DOC-001 | Small | Correct owning records; preserve ADR history |
| P3 — optional/future | Restrained motif, real portrait or approved media research | VIS-002/004 | Medium | Permission and comprehension/mobile/accessibility benefit |
| P3 — DEFERRED | Immersive experiments | FUTURE-IMMERSIVE-DESIGN | High–very high | Separate research; no current 3D implementation |

P0 does not authorize production edits in this audit. Corrections stop at human review.

## FUTURE-IMMERSIVE-DESIGN — DEFERRED

No 3D is prescribed or included. Any experiment must outperform a static/2D alternative in comprehension or recall; retain complete semantic content without canvas; respect reduced motion; establish measured mobile/performance budgets before adoption.

| Opportunity | Marketing benefit | Accessibility risk | Performance risk | Mobile risk | Complexity |
| --- | --- | --- | --- | --- | --- |
| Optional WebGL / Three.js / React Three Fiber business-flow model | Make integrations/handoffs tangible and memorable | Canvas meaning, keyboard exclusion, motion; HTML/2D equivalent needed | JavaScript, GPU, startup, memory/battery | Tiny labels, thermal limits, touch ambiguity | High; isolated prototype/fallback |
| User-controlled interactive 3D service map | Explain system boundaries and human handoff | Spatial navigation can exclude keyboard/screen readers | Continuous rendering/assets | Manipulation conflicts with page gestures | Very high; must beat a clear 2D diagram |
| Spatial problem-to-solution transitions | Connect business pain to modeled behavior | Disorientation, focus/context loss | Layer/compositing and transition delays | Relationship may disappear in narrow layout | High; no essential content behind transitions |
| Scroll-linked project scene | Reveal permitted workflow progressively | Motion sensitivity, scroll control, reading order | GPU/main-thread contention | Gesture conflict, excessive scrolling | Very high; no scroll hijacking; static sequence |
| Advanced micro-interactions for actual state feedback | Make controls/status feel deliberate | Preserve labels, contrast and reduced motion | Low for isolated transform/opacity; loops waste resources | Hover-only meaning/tiny targets | Low–medium; useful only for comprehension |
| Richer responsive 2D graphics as control alternative | Identity/workflow clarity without full 3D | Diagram alternatives and reading order | Asset size/responsive rendering | Label density and legibility | Medium; compare first |

## Exact next decision-closure task

**Title:** “FURLANICH — Close marketing narrative, evidence hierarchy and demonstration presentation decisions.”

**Boundary:** documentation-only governance/RFC review; no production code, provider activation, release/legal/SEO expansion or 3D. Preserve the demonstration ADR and evidence permissions.

**Decisions:** (1) choose a durable category and priority buyer problem from two shortlisted territories; (2) approve concise bilingual hero and stable CTA meaning; (3) approve demo/response/data-use contract across entry points and Contact; (4) decide homepage proof role, GRS emphasis, Lab hierarchy and proposed MPC Founder-only treatment without upgrading evidence; (5) approve homepage consolidation and Services scan layer; (6) approve Studio/Founder emphasis, navigation/footer adjustments and ES/EN conventions; (7) select restrained visual changes against named revisions of the visual/interaction owners.

**Review artifacts:** current-versus-proposed bilingual copy with reasons/permissions; page outlines and low-fidelity layouts at all five widths; evidence eligibility table; CTA destination table; owning-document edits with preserved OPEN decisions; backlog grouped into independent implementation PRs. Writing a proposal does not approve it.

**Acceptance:** human explicitly records APPROVED, REJECTED or OPEN choices in authoritative owners. Major IA/design-system changes require an RFC per lifecycle. Only then prepare the versioned implementation plan. Correctness repairs may be separated from editorial work but remain outside this audit. Stop at the documentation review PR; do not merge.



## Audit acceptance and review readiness

| Criterion | Result | Evidence / boundary |
| --- | --- | --- |
| Repository authority and current deployment identified | PASS | Source/deployment SHAs and owning records in method section |
| Real bilingual pages, details and five-width matrix | PASS | 20 routes, 100 viewport visits, initial/full captures and 15 retained screenshot boards |
| Copy, page narrative, brand, visual, trust and conversion review | PASS | 36 structured findings; 41 Spanish and 33 English copy rows; complete visible-link map |
| Taste advisory separated from approved requirements | PASS | Explicit authority comparison; no automatic design adoption |
| Priorities and deferred immersive opportunities | PASS | P0–P3 backlog and FUTURE-IMMERSIVE-DESIGN risk table |
| Product/copy/design changes adopted | OPEN — human decision | Every direction remains PROPOSED; no authoritative requirement rewritten |
| Production application, provider and evidence permissions | PASS | No application change included; no processor activation or evidence upgrade |
| Deterministic repository validation | PASS | `npm run validate` exited 0 on 2026-09-15: docs check, 99/99 tests, lint, typecheck and static build |
| Scope and whitespace review | PASS | Only review documents/evidence plus knowledge-index entry; `git diff --check` |
| Merge / approval | OPEN — human review | Task branch and documentation PR; no merge or production release authorized |

Validation notices: Node emitted `MODULE_TYPELESS_PACKAGE_JSON` warnings during existing tests; Browserslist reported seven-month-old data. Neither failed a gate. No dependency/configuration change was made for those notices. The build generated a `next-env.d.ts` root-params import; it was restored to the baseline to keep this change documentation-only. Final documentation/type checks follow that restoration. Browser results above concern the deployed baseline; passing deterministic checks do not negate the observed marketing or accessibility findings.

Self-review: checked current excerpts against captured public text (state text against interaction captures), score language, source/deployment provenance, evidence captions, all finding dependency/approval fields, distinction between demonstration and commercial activation, absence of invented proof, and the complete file scope. Screenshot files are public-page evidence; form examples use synthetic `.invalid` addresses. Temporary capture scripts, full PNG sets and execution logs remain ignored local QA output rather than application changes.
