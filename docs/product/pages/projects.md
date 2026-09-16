---
id: PAGE-PROJECTS
type: page-spec
status: APPROVED
related:
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - PAGE-PROJECT-DETAIL
  - PROJECT-EVIDENCE
  - PROJECTS-EXPERIENCE-CLOSURE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PAGE-CONTACT
  - PAGE-FOUNDER
last_verified: 2026-09-16
---

# Projects and project-detail pages

## PAGE-PROJECTS responsibility — APPROVED

Present selected evidence for prospective clients. The page must make maturity and disclosure boundaries understandable and must not behave like a recruiter-oriented technology portfolio.

Preferred page language is `Proyectos seleccionados`, not `Casos de éxito`, until verified outcomes support the stronger claim.

## Approved inventory-sensitive hierarchy

The page uses the hybrid structure specified in [Projects and evidence experience](../projects/experience.md):

1. Introduction explaining evidence transparency.
2. Selected evidence ordered by buyer relevance.
3. Maturity groups only when at least four public records span at least two populated groups.
4. Confidentiality/publication note when any displayed record is restricted.
5. Inquiry CTA.

One public record becomes one substantial evidence story. Two or three use one ungrouped editorial grid with maturity on each card. Empty groups never render. With zero public records, do not launch an empty route or expose blocked candidates; keep the homepage fallback and direct visitors through Services and Contact.

The approved conditional labels are `Soluciones en producción / Production solutions`, `Laboratorio FURLANICH / FURLANICH Lab`, and `Prototipos funcionales / Functional prototypes`. The prototype label requires verified functional behavior.

Filters are rejected for launch. Reconsider only at eight or more public records with buyer-useful population across service, industry, or maturity.

## Card requirements

- one restrained maturity/context/evidence meta row;
- operating context or sector;
- outcome-oriented title;
- two-to-four concise lines covering the business situation and delivered value;
- two or three descriptive business-capability tags;
- one plain-language evidence signal;
- one destination-appropriate CTA.

Cards use the approved Surface, 1px Border, 16px-radius, no-shadow language. Substantial cards use two columns at wide/1024px sizes, two at medium only where bilingual content remains readable, and one at compact sizes. Height is content-driven; translated copy is not clamped. Images are optional and follow the provenance rules in the experience record.

Cards with no permitted detail content link to an explicitly approved evidence destination, `PAGE-CONTACT`, or the related Services anchor, not an empty project page. The whole card is not one competing interactive target.

## PAGE-PROJECT-DETAIL responsibility — APPROVED

Explain a real project or demonstration deeply enough to establish relevance without exceeding permission.

## Detail-page eligibility — APPROVED

A detail page requires meaningful information beyond the card, at least one permitted evidence asset or evidence link, and enough approved content to cover at least five of context, problem, delivered scope, capabilities/workflows, demonstrated or verified result, evidence, limitations, links, and visual material. A `summary-only` item without this depth receives no detail route.

## Detail content and composition — APPROVED

1. Header with public title, concise context, maturity/evidence language, sector, related service, and optional approved visual.
2. Visible maturity/evidence/disclosure statement.
3. Business context.
4. Problem or opportunity.
5. Delivered scope.
6. Capabilities and workflows.
7. Result labeled precisely as verified business result, production usage, demonstrated functional behavior, or implementation evidence.
8. Evidence gallery or links with explicit evidence-type labels.
9. Visible limitations/confidentiality panel.
10. Technical notes where useful and permitted.
11. Restrained related-service link.
12. Existing Action-tint inquiry CTA.

The wide header uses approximately 7/12 text and 5/12 visual; without a visual, text stays near an eight-column reading measure. Context/problem uses Surface, delivered scope uses Canvas, evidence uses Surface, limitations use a neutral border, and compact layouts stack in reading order. Do not use technology badge clusters.

## Visual requirements

- Client UI is shown only with explicit permission.
- Restricted projects use neutral branded visuals rather than fabricated UI.
- Laboratory and prototype imagery states whether it is real, conceptual, or generated.
- Logos require permission and placeholders never ship.
- Historical legacy project SVGs were not approved evidence because capture date, represented version, sensitive-data review, and publication permission were unknown; Task 4 retired the unused files.
- Evidence screenshots use a 16:9 contained frame so meaningful interface content is not cropped.

`HOME-PROOF` does not depend on this page for its approved launch fallback. No Projects-route CTA may appear on the homepage until both localized Projects destinations are implemented with useful, publication-ready evidence.

## Acceptance criteria

- No project can be mistaken for a more mature or public engagement than it is.
- Every metric has a source and permission.
- Every public link is verified before release.
- Technology is secondary to the business story.
- Confidential projects reveal no forbidden identity, UI, workflow, data, or implementation detail.
- Both locales pass the viewport, keyboard, zoom, reduced-motion, image, base-path, and static-export checks in `PROJECTS-EXPERIENCE-CLOSURE`.
- No empty group, empty detail page, broken evidence link, nested card interaction, or horizontal overflow ships.

## Current readiness

The product, bilingual system language, layout, card, detail, accessibility, and performance decisions are approved. [The item inventory](../projects/index.md) now contains three `READY` records with complete bilingual card/detail copy, approved public-source destinations, and labeled conceptual detail visuals. Task 2 / PR 2, Task 3 / PR 3, and Task 4 / PR 4 are merged; the verified-unused legacy project paths have been retired after consumer verification. No item is homepage-eligible, and the launch cards remain image-free.


## Founder-context link — APPROVED

The Projects index does not add a general Founder CTA. A project detail may include one subdued internal text link in technical notes or evidence context only when the published evidence explicitly depends on founder-published source or Samuel's professional context:

- Spanish: “Conocer la trayectoria de Samuel” → /estudio/samuel-furlanich/
- English: “View Samuel's background” → /en/about/samuel-furlanich/

The link never replaces the related-service link or final inquiry CTA and does not imply that founder authorship proves production use, client permission, outcomes, or sole authorship.

## MKT-D04 — Projects narrative and detail outline — APPROVED revision 1

**Revision 1: APPROVED under D04.** Human reviewer: project owner (user). Date: 2026-09-16. Source: explicit disposition in the decision-review task. The user supplied “D04 - APPROVED”. Existing item permissions and evidence-strength classifications remain operative; no item is upgraded.

Accepted index outline under D04: global demo notice → short introduction → GRS lead → compact The-System Lab entry → disclosure note → demo-aware Contact action. The [inventory](../projects/index.md#mkt-d04-evidence-placement-approved-revision-1) owns selection and unchanged evidence states. Detail outline is owned by the [experience delta](../projects/experience.md#mkt-d04-experience-delta-approved-revision-1). Existing detail URLs and language switching stay intact, including MPC.

| Field / current ES and EN | Accepted Spanish | Accepted English | Reason / permission |
| --- | --- | --- | --- |
| Intro: Cada proyecto distingue qué está en producción… / what is in production… | Proyectos para explorar cómo se aborda un problema en el código. Incluyen su contexto y sus límites; no se presentan como casos de clientes ni como sistemas verificados en producción. | Projects that show how a problem is approached in code. Each includes its context and limitations; these are not client case studies or verified production systems. | Describe actual selection; no implication of a hidden production portfolio |
| Evidence action: Repositorio público aprobado / Approved public repository | Ver código fuente | View source code | Plain action; same approved public repository URLs |
| Index disclosure: confidentiality/publication-policy lead | La selección reúne código de repositorios públicos publicados por Samuel. Su ejecución actual no está verificada. | This selection contains code from public repositories published by Samuel. Current execution has not been verified. | Does not imply exclusive authorship; item relationships remain adjacent |
| GRS and Lab final Contact invitation | Ver contacto | Contact options | Stable route action under D03 notice |
| Detail final copy: Need to solve something similar? | Explorá las opciones de contacto y la demostración del formulario. | Explore the contact options and the form demonstration. | Avoids real-inquiry promise during demo |

Do not use a capability heading to relabel RPG work as a real business deployment. Keep proper project names and exact source relationships. The literal internal token limited is a separate correctness repair: render the already approved localized publication-scope text until and unless revised wording is approved. It is not public copy to retain.
