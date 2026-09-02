---
id: PROJECT-EVIDENCE
type: product-spec
status: PROPOSED
related:
  - PAGE-PROJECTS
  - PAGE-PROJECT-DETAIL
  - HOME-PROOF
  - SERVICE-WEB
  - SERVICE-WHATSAPP
  - SERVICE-CONSULTING
last_verified: 2026-09-02
---

# Project evidence inventory

## Purpose

Project evidence exists to help prospective clients evaluate relevance, credibility, and fit. It is not a recruiter-oriented list of technologies or a comprehensive archive of everything Samuel has built.

The inventory design below is **PROPOSED** because the project owner has not adopted it as an **APPROVED** product decision. Approved confidentiality requirements remain binding regardless of whether this model is adopted.

## Approved foundations

- The project set is conceptually divided into production work, laboratory work, and prototypes.
- Restricted client work exposes only an approved solution type and brief description.
- Forbidden UI and inner workings stay private.
- Client logos require permission.
- Placeholder identities and logos are restricted to development/testing and cannot be deployed publicly.

## Proposed three-axis model

Project maturity, disclosure, and evidence strength are separate dimensions.

### Maturity

- `production` → proposed public label `Solución en producción`
- `lab` → proposed public label `Laboratorio FURLANICH`
- `prototype` → proposed public label `Prototipo funcional`

### Disclosure

- `client-approved` — only individually approved identity and evidence may be public.
- `anonymized` — generalized sector and story; identifying details removed.
- `summary-only` — solution type and short approved description only.
- `private` — internal record; never public.

### Evidence strength

Internal classification only:

- `verified-outcome` — documented result or approved testimonial.
- `production-confirmed` — operational use and permitted description confirmed.
- `functional-demonstration` — working demo or reproducible behavior.
- `implementation-evidence` — repository, tests, or another implementation artifact.
- `concept-only` — design or proposal without working implementation.

No public score or star rating is shown.

## Proposed internal record

Each project record should eventually contain:

### Identity

- internal ID and stable slug;
- original/internal name;
- Spanish and English public names;
- maturity and current lifecycle status;
- date or period, kept private unless commercially useful.

### Commercial story

- industry or operating context;
- primary service demonstrated;
- intended decision-maker;
- initial business situation;
- problem or opportunity;
- what FURLANICH delivered;
- permitted result;
- why the work matters to a similar prospective client.

### Evidence

- production confirmation;
- live URL;
- functional demo;
- repository;
- real screenshot or video;
- testimonial;
- metric and its source;
- date each artifact was last verified.

### Permission matrix

Permission must be tracked independently for client name, logo, industry, description, UI screenshots, video, features/workflows, technology stack, metrics, testimonial, public URL, and repository. The record should identify who granted permission, when, and any limitations.

### Publication lifecycle

`draft` → `evidence-review` → `permission-review` → `ready` → `published` → `stale` or `retired`

Publication fails closed: missing evidence or unclear permission prevents release.

## Proposed public card hierarchy

1. Maturity/disclosure and industry.
2. Outcome-oriented title.
3. Short business problem or delivered value.
4. Two or three business capability tags.
5. Evidence signal such as `Sitio público` or `Descripción autorizada`.
6. CTA: `Ver solución` or `Consultar por una solución similar`.

Technology badges and GitHub links do not lead the card. They answer recruiter or implementation questions, not the prospective client's first questions.

## Proposed detail-page hierarchy

1. Outcome-oriented title.
2. Evidence and confidentiality statement.
3. Business situation.
4. Problem.
5. Delivered scope.
6. Relevant user or operational capabilities.
7. Verified result or demonstrated behavior.
8. Explicit limitations or withheld material.
9. Relevant service CTA.
10. Technical notes at the bottom when useful and permitted.

Restricted summaries do not receive a detail page when no additional useful content may be disclosed.

## Provisional records — OPEN

The current application contains five records. Their classifications are not verified.

| Record | Provisional maturity | Client-facing relevance | Known evidence | Missing decision or risk |
|---|---|---|---|---|
| Busesfy | Production candidate | Commercial website for transportation | Public URL is recorded in the current data | Confirm ownership/production status and permission for name, logo, screenshots, description, and URL. |
| MPC Administración | Production or prototype | Internal production and administration system | Preview and public repository are currently referenced | If it is client work, current public UI/repository may conflict with confidentiality. Hold until classification and permission are resolved. |
| General Reservation System | Functional prototype candidate | Booking and reservation workflows | Public repository and preview are recorded | Verify repository, runnable behavior, implemented scope, limitations, and demo suitability. |
| Appointment & Operations SaaS / ChronoApp | Laboratory candidate | Scheduling and operations for service businesses | Preview and repository URL are recorded | Repository link returned 404 during the 2026-08-22 assessment. Verify implementation and separate actual functionality from conceptual copy. |
| Documancer | Laboratory or prototype candidate | Experimental AI-assisted narrative content | Preview and repository URL are recorded | Verify link and function. Weak alignment with launch services; keep off homepage unless positioning changes. |

## Proposed public titles

- General Reservation System → `Motor de reservas adaptable para negocios de servicios`
- Appointment & Operations SaaS → `Gestión de turnos y operaciones para empresas de servicios`
- MPC Administración, if anonymized production → `Sistema interno de gestión para una empresa de producción alimentaria`
- Busesfy, if identity is approved → `Presencia web comercial para una empresa de transporte`
- Documancer → `Exploración de generación y gestión de contenido asistido`

These titles are not approved claims.

## Proposed homepage selection

At most three items:

1. one production solution relevant to a target client;
2. one Laboratory solution demonstrating a launch service;
3. one functional prototype with verifiable public evidence.

Provisional candidates are Busesfy or another approved production summary, Appointment & Operations, and General Reservation System. Editorial relevance should control order, not chronology.

## Evidence gaps

| Launch service | Current provisional evidence | Gap |
|---|---|---|
| Commercial websites | Busesfy and reservation-related work | Permissions and functional verification. |
| WhatsApp automation | No clearly inventoried public example | A truthful Laboratory demonstration or approved client summary. |
| Maintenance and consulting | Experience description only | An approved anonymized real intervention story, or process-only explanation until one exists. |

## Proposed editorial rules

- Use `Proyectos seleccionados`, not `Casos de éxito`, until outcomes are verified.
- Do not publish a metric without an internal source and permission.
- Do not publish an unavailable demo or broken repository link.
- Use tags such as `Reservas`, `Pedidos`, or `Integraciones` before technology tags.
- Label generated or conceptual visuals.
- End relevant entries with `¿Necesitás resolver algo parecido?`
- Review links, claims, and permissions periodically.
- Prefer a small set of strong, relevant evidence over a large gallery.

## Remaining decisions

- Approve or revise the three-axis evidence model.
- Resolve Busesfy and MPC classification first because they affect confidentiality.
- Build the item-level permission matrix.
- Decide whether Laboratory work appears inside Projects or also receives a dedicated secondary view.
- Decide what minimum proof makes a prototype eligible for the homepage.
