---
id: PAGE-PROJECTS
type: page-spec
status: APPROVED
related:
  - DESIGN-SPF-V1
  - RFC-SPF-REDESIGN-V1
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - PAGE-PROJECT-DETAIL
  - PROJECT-EVIDENCE
  - PROJECTS-EXPERIENCE-CLOSURE
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
  - PAGE-CONTACT
  - PAGE-FOUNDER
last_verified: 2026-09-30
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
| GRS and Lab final Contact invitation | Ver contacto | Contact options | Stable route action; D03 proposed notice is not adopted |
| Detail final copy: Need to solve something similar? | Explorá las opciones de contacto y la demostración del formulario. | Explore the contact options and the form demonstration. | Avoids real-inquiry promise during demo |

Do not use a capability heading to relabel RPG work as a real business deployment. Keep proper project names and exact source relationships. The literal internal token limited is a separate correctness repair: render the already approved localized publication-scope text until and unless revised wording is approved. It is not public copy to retain.

## SPF-V1 proposed Projects copy and inline presentation

**APPROVED by the owner — 2026-09-30, Revision 5 written specification and copy.** The owner selected Dossier presentation and explicitly requested all project information on the index, retirement of all six old localized detail URLs without compatibility routes, and MPC on Founder. Deployment and cleanup are not implemented. The [approved connected-studio specification](../../design/services-projects-footer-v1.md) governs the precise visual/motion/accessibility treatment.

The new target uses two complete articles: GRS first, then The-System explicitly labeled Lab. There is no per-project page or concealed detail accordion. Existing item records still govern evidence strength and all unmodified permissions. The exact GRS/The-System conceptual assets are proposed for relocation from detail-only use into their complete index dossiers, with the original visible captions and approved descriptions. No new screenshot, demo, client identity, technology stack, payment operation, production result or metric is approved.

| Field | Spanish | English |
| --- | --- | --- |
| H1 | Trabajo que podés examinar. | Work you can examine. |
| Introduction | Código e implementación con su contexto y sus límites. Cada proyecto declara qué se hizo y qué evidencia está disponible. | Code and implementation, with context and limits. Each project states what was built and which evidence is available. |
| GRS: public title | Gestión de reservas para transporte de pasajeros | Passenger transport reservation management |
| GRS: maturity | Prototipo de reservas | Reservation prototype |
| GRS: summary | Coordinar recorridos, estaciones, asientos y autogestión de pasajeros. | Coordinate routes, stations, seats and passenger self-service. |
| GRS: relationship | Repositorio publicado por el fundador con otro colaborador. No se presenta como trabajo para un cliente. | Founder-published repository with another contributor. It is not presented as client work. |
| GRS: image caption | Ilustración conceptual · no es una captura del producto | Conceptual illustration · not a product screenshot |
| GRS: image alt | Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros. | Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service. |
| GRS: section 1 heading | La oportunidad modelada | The modeled opportunity |
| GRS: section 1 content | El alcance modela una oportunidad de coordinación en transporte de pasajeros; no es un problema confirmado de un cliente. | The scope models a coordination opportunity in passenger transport; it is not a confirmed client problem. |
| GRS: section 2 heading | Alcance implementado | Implemented scope |
| GRS: section 2 content | Acceso de cuentas y administración; Recorridos, estaciones y disponibilidad de asientos; Creación y cancelación de reservas; Autogestión de pasajeros e intercambio de estaciones mediante CSV | Account access and administration; Routes, stations and seat availability; Reservation creation and cancellation; Passenger self-service and station exchange through CSV |
| GRS: section 3 heading | Qué podés comprobar | What you can examine |
| GRS: section 3 content | El resultado público es evidencia de implementación: código, proyectos de pruebas, configuración Docker e historial técnico disponible. Un historial exitoso de CI no demuestra operación actual. | The public result is implementation evidence: code, test projects, Docker configuration and available technical history. Historical successful CI does not establish current operation. |
| GRS: section 4 heading | Límites de la evidencia | Evidence limits |
| GRS: section 4 content | La demo documentada no está disponible y la ejecución actual no fue revalidada. No se afirma uso en producción, pagos implementados, adopción, uptime ni un resultado comercial medido. | The documented demo is unavailable and current execution has not been revalidated. Production use, implemented payments, adoption, uptime and measured business outcomes are not claimed. |
| GRS: jump link | Reservas de transporte | Transport reservations |
| The-System: public title | Gestión multiusuario de campañas de rol | Multi-user role-playing campaign management |
| The-System: maturity | Laboratorio FURLANICH | FURLANICH Lab |
| The-System: summary | Organizar campañas de rol con identidad, membresías e invitaciones. | Organize role-playing campaigns with identity, memberships and invitations. |
| The-System: relationship | Exploración de laboratorio publicada por el fundador. El dominio es la gestión de campañas de rol. | Founder-published laboratory exploration. Its domain is role-playing campaign management. |
| The-System: image caption | Ilustración conceptual · no es una captura del producto | Conceptual illustration · not a product screenshot |
| The-System: image alt | Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción. | Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries. |
| The-System: section 1 heading | La oportunidad modelada | The modeled opportunity |
| The-System: section 1 content | El laboratorio explora límites de acceso y organización multiusuario. No se presenta como una necesidad confirmada de un cliente. | The laboratory explores access boundaries and multi-user organization. It is not presented as a confirmed client need. |
| The-System: section 2 heading | Alcance implementado | Implemented scope |
| The-System: section 2 content | Identidad, autenticación y recuperación de cuentas; Campañas, membresías e invitaciones; Permisos multiusuario; Abstracciones de suscripción/facturación y base de cliente web | Identity, authentication and account recovery; Campaigns, memberships and invitations; Multi-user permissions; Subscription/billing abstractions and a web-client foundation |
| The-System: section 3 heading | Qué podés comprobar | What you can examine |
| The-System: section 3 content | El resultado público es evidencia de implementación: repositorio, pruebas en capas de backend y frontend y configuración de desarrollo. | The public result is implementation evidence: repository, backend/frontend test source and development configuration. |
| The-System: section 4 heading | Límites de la evidencia | Evidence limits |
| The-System: section 4 content | No hay demo pública ni verificación de ejecución actual. La suscripción está modelada en el código; no se presenta como facturación operativa. Escenas, activos, notas y colaboración completa no se presentan como entregados. No se afirma uso en producción. | No public demo or current runtime verification. Subscription boundaries are modeled in code, not presented as operational billing. Scenes, assets, notes and complete collaboration are not presented as delivered. Production use is not claimed. |
| The-System: jump link | Campañas multiusuario | Multi-user campaigns |
| Source action | Ver código fuente | View source code |
| Related service action | Sitios y aplicaciones web | Websites and web applications |
| Founder context action | Conocer a Samuel | Meet Samuel |
| Disclosure heading | El contexto importa. | Context matters. |
| Disclosure copy | Cada dossier mantiene su madurez, relación y límites de publicación. Las ilustraciones explican el alcance; no son capturas del producto ni pruebas de operación. | Each dossier retains its maturity, relationship and publication limits. Illustrations explain the scope; they are not product screenshots or evidence of operation. |
| Scene caption | Capacidades conectadas · modelo ilustrativo | Connected capabilities · illustrative model |

Preserve the existing approved public-source destinations in the item records. The related-service destination is the localized Services `web` fragment; founder context uses the existing internal Founder route. The old route/detail requirements are superseded as target requirements by this dated approval; their delivered baseline and immutable history remain intact. MPC retains its educational/group evidence record and moves no evidence maturity state; its text context stays on Founder with the approved external source link.

**Revision 5 — APPROVED, 2026-09-30:** the background is a full-viewport capability network with slow idle rotation, rapid fluid movement from the first scroll and plentiful connections building until the Footer. It uses the [exact localized capability words and semantic legend](services.md#revision-5-capability-words-proposed-exact-localized-copy). These words are illustrative studio capabilities, not claims that either dossier implements every labeled capability or shares a deployed architecture. The complete story, source/maturity/relationship limits and conceptual captions remain unchanged. Production implementation remains pending.
