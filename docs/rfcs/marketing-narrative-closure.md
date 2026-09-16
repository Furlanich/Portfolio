---
id: RFC-MARKETING-NARRATIVE-CLOSURE
type: request-for-comments
status: PROPOSED
related:
  - REVIEW-MARKETING-PRESENTATION
  - BRAND-POSITIONING
  - IA-SITE
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
last_verified: 2026-09-16
---

# Marketing narrative, evidence hierarchy and demonstration presentation

## Context

The [marketing audit](../reviews/marketing-presentation-2026-09-15/index.md), merged in [PR #51](https://github.com/Furlanich/Portfolio/pull/51), rated the current commercial presentation 5.8/10. It found a mismatch between intended commercial language and actual local-only demonstration behavior, weak proof framing, repeated scope/caution prose, and presentation that gives educational evidence and CV links too much commercial prominence.

Baseline: main commit 2be0286d549761ce044189e8a2f9e1ff71125803, containing audit commit 941d011. No production application change is part of this RFC. The approved static localized architecture and demonstration ADR remain intact.

## Problem

A buyer must work through too much explanation before understanding the relevant service, why to believe it, and what Contact actually does. A better story must not imply clients, runtime verification, corporate identity, team size, delivery history or commercial activation that the repository does not support.

## Requirements

1. One familiar durable category and one priority buying situation, evaluated against two territories.
2. A concise bilingual hero and predictable Contact/Services/evidence actions.
3. A truthful demonstration contract on every direct entry, with no response promise for unsent form values.
4. A selective evidence hierarchy preserving item-level maturity, authorship, permissions and unverified runtime.
5. Less duplication in Home/Services without concealing material dependencies or exclusions.
6. Clear Studio/Founder roles, secondary CV links, sensible navigation/footer and natural locale conventions.
7. Restrained visual changes against named owner revisions, reviewed at 320, 390, 768, 1024 and 1440px.
8. Human acceptance explicitly recorded in authoritative owners before any execution plan or implementation.

## Proposed approach

Recommend territory B: an operations-focused custom software studio, using a familiar category and leading with fragmented orders, bookings and daily coordination. The proposed global notice makes the inactive commercial status visible while pages demonstrate the intended offer.

Home merges audience relevance into Problems, keeps three service summaries, and replaces defensive proof language with concise founder/process accountability. A generic Projects link is separately proposed; no project gains Home-card eligibility. Projects leads with GRS, treats The-System as secondary Lab material, and moves MPC discovery to Founder education while preserving the existing paired detail URLs.

Services gains a buyer scan layer, with explicit service-specific boundaries and one shared working-agreement block. Studio explains direct responsibility once. Founder preserves all factual history and biography while moving CV/professional links below the substantive background.

The exact copy and normative candidate decisions live in their [owning records](../reviews/marketing-decision-closure-2026-09-15/index.md#decision-register). The review package links current-versus-proposed bilingual tables, evidence eligibility, CTA destinations, outlines and low-fidelity layouts. Do not treat this RFC summary or rendered sketches as replacement copy authority.

## Alternatives considered

| Alternative | Benefit | Trade-off | Recommendation |
| --- | --- | --- | --- |
| A: general custom-software positioning, equal service weight | Broad familiar category; little reorganization | Leaves the buying trigger and differentiation vague | Not preferred; still OPEN for human choice |
| B: operational buying situation with familiar studio category | Connects web, integration and existing-system work through a recognizable need | Needs clear simple-website visibility on Services | Recommended; PROPOSED |
| Correctness repairs only | Lowest scope; resolves wrong labels/raw tokens/accessible references | Does not address persuasion, length or evidence selection | May proceed later as separate approved-scope work; insufficient as full response |
| Hide demonstration and keep strong commercial CTAs | Superficially cleaner funnel | Misrepresents current operation and conflicts with the ADR | Incompatible with approved boundary; not a candidate |
| Decorative redesign/3D before narrative closure | Could create visual novelty | Does not repair proof or mode truth; additional risk | Deferred and out of scope |
| Delete weak project routes | Removes commercial prominence | Breaks reachable approved evidence and conflates placement with permission | Not recommended; preserve MPC URLs and reduce discovery prominence |

## Trade-offs

- The demo notice and neutral Contact label may reduce apparent sales urgency; current operational truth takes precedence over simulated conversion.
- Fewer repeated sections improve scanability but reduce explicit repetition of sector names and caveats. Preserve relevant context once and attach every material limitation to its claim.
- GRS is the strongest available relevant implementation story, not strong production proof. Editorial prominence cannot substitute for fresh verification.
- Founder-first MPC discovery is still public, not private. No security/privacy guarantee follows from removing an index card.
- The proposed generic Home-to-Projects bridge is a narrow placement change needing explicit permission; it is not automatic under existing fallback rules.
- US English is proposed for consistency, not because existing British English is incorrect. Approval is needed before changing the prior convention.

## Migration and implementation impact

This is a governance PR because it changes Home section structure, evidence discovery and cross-page composition. No new routing, hosting, dependencies, backend, localization mechanism, data handling or design-system architecture is proposed. No new ADR is created before acceptance; the existing demonstration and routing ADRs remain immutable.

On acceptance, update item-level dispositions in each owner, mark exactly which preceding clauses are superseded, and synchronize indexes. Only then create a versioned implementation plan. The [candidate PR grouping](../reviews/marketing-decision-closure-2026-09-15/index.md#candidate-implementation-pr-groups-not-an-execution-plan) is backlog organization, not an executable plan or authorization.

Preserve all current URL pairs and fragments. New shared-boundary fragments are additive. No portfolio asset, provider endpoint or blocked project enters production through this RFC.

## Risks

| Risk | Control |
| --- | --- |
| Proposal mistaken for approval because text is polished | Every owner section has PROPOSED candidate and OPEN human disposition; no overwrite of approved baseline |
| New copy broadens evidence or ownership | Item-specific deltas; explicit no current verification/client/production claims; item permissions remain unchanged |
| Shorter Services conceals provider restrictions | Coverage table and visible boundaries before CTA; no hidden critical disclosure |
| Demo copy promises actual inquiry response | Route-wide notice and D03 replacement inventory; response expectation dormant |
| 1024px navigation or translated copy fails | Five-width bilingual low-fidelity study now; actual text/browser validation required for implementation |
| Founder simplification conceals experience | All approved history and biography remain visible; dates and employment narrative unchanged |
| Owner additions produce competing directives | Approved rules continue until named revision accepted; approval must identify superseded clauses |

## Unresolved questions

All human dispositions D01–D07 remain OPEN. The human must choose territory, accept/revise exact bilingual copy, approve the narrow Home evidence-link permission, approve Founder-led MPC discovery, accept the visual/interaction revisions and record any exceptions. No current task text supplies those specific approvals.

Broader OPEN items remain outside this RFC: commercial activation, legal/privacy provider facts, new project runtime evidence/media permissions, portrait/logo/2D motif, immersive design, new metrics and SEO/release work. No review item silently closes them.

## Recommendation

Review D01 and D03 first because they govern the meaning of the rest. Then review D02/D05, D04, D06 and D07. Accept or reject subparts explicitly where dependencies differ. Do not approve the whole packet through an ambiguous general acknowledgment.

## Status

**PROPOSED. Human decision: OPEN.** Authoring this packet is authorized; changing product requirements is not automatically approved. Human reviewer/date/reference: OPEN. Acceptance means recording APPROVED, REJECTED or OPEN against each owner revision, with any wording exceptions. An unqualified merge records document publication, not adoption of every proposal. Stop at this governance PR; no merge, execution plan or implementation in this task.
