---
id: PROJECT-EVIDENCE
type: product-spec
status: APPROVED
related:
  - PAGE-PROJECTS
  - PAGE-PROJECT-DETAIL
  - HOME-PROOF
  - SERVICE-WEB
  - SERVICE-WHATSAPP
  - SERVICE-CONSULTING
  - PLAN-PROJECTS-EVIDENCE-EXPERIENCE
last_verified: 2026-09-06
---

# Project evidence inventory

## Purpose

Project evidence exists to help prospective clients evaluate relevance, credibility, and fit. It is not a recruiter-oriented list of technologies or a comprehensive archive of everything Samuel has built.

The evidence model and publication guardrails below are **APPROVED**. Item-level facts retain their own statuses; adopting the model does not make any provisional project public.

## Approved foundations

- The project set is conceptually divided into production work, laboratory work, and prototypes.
- Restricted client work exposes only an approved solution type and brief description.
- Forbidden UI and inner workings stay private.
- Client logos require permission.
- Placeholder identities and logos are restricted to development/testing and cannot be deployed publicly.

## Approved three-axis model

Project maturity, disclosure, and evidence strength are separate dimensions.

### Maturity

- `production` → approved public group label: `Soluciones en producción / Production solutions`
- `lab` → approved public group label: `Laboratorio FURLANICH / FURLANICH Lab`
- `prototype` → approved public group label: `Prototipos funcionales / Functional prototypes`

These are public group labels, not quality scores. They render only for populated groups under the inventory thresholds in `PROJECT-INVENTORY`; the prototype label requires verified functional behavior.

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

## Approved internal record

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

## Approved public card hierarchy

1. Maturity/disclosure and industry.
2. Outcome-oriented title.
3. Short business problem or delivered value.
4. Two or three business capability tags.
5. Evidence signal such as `Sitio público` or `Descripción autorizada`.
6. CTA: `Ver solución` or `Consultar por una solución similar`.

Technology badges and GitHub links do not lead the card. They answer recruiter or implementation questions, not the prospective client's first questions.

## Approved detail-page hierarchy

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

## Historical item-level evidence audit — 2026-09-04

The retained application contains five legacy records. A fact marked **APPROVED** below is approved only as an inventory or verification fact. It does not authorize broader publication. Missing permission or maturity evidence fails closed.

This audit reviewed the retained `data/projects.json` records and `public/projects/` assets, the public repository metadata, trees, and README files linked by those records, and link reachability on 2026-09-04. It did not treat a reachable URL as permission, run remote code, infer client relationships, or accept legacy descriptions as verified outcomes.

### Busesfy

| Required field | Status | Finding |
| --- | --- | --- |
| Project identity | **APPROVED** as a recorded identity | The legacy inventory names `Busesfy` and records `https://busesfy.com/`. |
| Ownership or client relationship | **OPEN** | The repository does not establish whether this was FURLANICH-owned work, independent work for a client, employment work, or another relationship. |
| Maturity | **OPEN** | A public website does not establish that the recorded implementation is a production solution delivered by FURLANICH. |
| Current status | **APPROVED** only for URL availability | The recorded URL returned HTTP 200 on 2026-09-04. Current business operation, authorship, and deployed-version relationship remain **OPEN**. |
| Production, Laboratory, or prototype | **OPEN** | No safe classification is established. |
| Disclosure permission | **OPEN** | No permission grant, date, grantor, or permitted fields are recorded. |
| Public description | **OPEN** | The legacy description exists but is not an approved client-facing description. |
| Screenshots or assets | **OPEN** | Historical `public/projects/Busesfy.svg` was retired in Task 4; provenance and permission to publish the captured UI were never recorded. |
| Metrics | **OPEN** | No metric, source, or permission exists. |
| Links | **APPROVED** as technically reachable; publication permission **OPEN** | Reachability does not authorize using the URL as commercial evidence. |
| Technologies | **OPEN** for commercial publication | Legacy technology tags exist but are unverified and not necessary to the homepage story. |
| Client identity permission | **OPEN** | Do not infer permission from the public website or legacy portfolio entry. |
| Business-homepage eligibility | **REJECTED** for the current initiative | Relationship, maturity, description, imagery, and identity permission are unresolved. |

### MPC Administración

| Required field | Status | Finding |
| --- | --- | --- |
| Project identity | **APPROVED** as a recorded identity | The legacy inventory and public repository identify `MilkyPantsCheese-Administracion-`. |
| Ownership or client relationship | **APPROVED** as non-client source material | The public repository describes it as a 2021 INET/ETP National Olympics assignment for a fictional cheese factory. It must not be presented as client work. |
| Maturity | **APPROVED** as non-production | The repository's own description rules out client production status. |
| Current status | **APPROVED** only for repository availability | The public repository resolved on 2026-09-04 and contains implementation files. Runtime behavior was not reproduced. |
| Production, Laboratory, or prototype | **PROPOSED** functional prototype | It has implementation evidence, but functional behavior and public limitations have not been verified. |
| Disclosure permission | **APPROVED** only for the public source already exposed; broader reuse **OPEN** | A public repository is available under Samuel's GitHub account. Reusing captured UI or third-party competition material still needs review. |
| Public description | **PROPOSED** | A truthful description may identify it as a 2021 educational prototype for fictional production and stock workflows. |
| Screenshots or assets | **OPEN** | Historical `public/projects/MPC-Administracion.svg` was retired in Task 4; its source and suitability for republication were never reviewed. |
| Metrics | **OPEN** | No metric or reproducible result is recorded. |
| Links | **APPROVED** as a reachable public source repository | The repository resolved on 2026-09-04. |
| Technologies | **APPROVED** as legacy implementation metadata; homepage relevance **REJECTED** | Technology may support a future technical note, not the commercial card hierarchy. |
| Client identity permission | Not applicable | The named organization is fictional according to the repository. |
| Business-homepage eligibility | **REJECTED** | It is educational work from 2021 and is weaker commercial proof than the launch narrative requires. It may remain secondary Founder material after verification. |

### General Reservation System

| Required field | Status | Finding |
| --- | --- | --- |
| Project identity | **APPROVED** as a recorded identity | The legacy inventory and public repository identify `GeneralReservationSystem`. |
| Ownership or client relationship | **APPROVED** only as founder-published source | The repository is public under Samuel's GitHub account. No client relationship is claimed or evidenced. |
| Maturity | **OPEN** | Production use is not evidenced. |
| Current status | **APPROVED** for repository availability; demo unavailable | The repository resolved and contains source, tests, and Docker configuration on 2026-09-04. Its README demo URL returned HTTP 404. |
| Production, Laboratory, or prototype | **PROPOSED** functional prototype | The repository provides `implementation-evidence`; reproducible behavior is still required for `functional-demonstration`. |
| Disclosure permission | **APPROVED** for linking to the founder-published public source; other fields remain item-specific | Public source availability does not approve unreviewed screenshots or broader outcome claims. |
| Public description | **PROPOSED** | `Motor de reservas adaptable para negocios de servicios` is a candidate title; implemented scope and limitations require verification. |
| Screenshots or assets | **OPEN** | Historical `public/projects/GRS.svg` was retired in Task 4; the represented build, date, and suitability were never verified. |
| Metrics | **OPEN** | No public business outcome metric exists. Test presence is not a business result. |
| Links | Repository **APPROVED** as reachable; demo **REJECTED** while unavailable | Do not publish the broken demo link. |
| Technologies | **APPROVED** as repository-backed implementation context; secondary only | The stack may appear only where commercially useful and after content review. |
| Client identity permission | Not applicable on current evidence | No client identity is claimed. |
| Business-homepage eligibility | **OPEN**, not currently eligible | It is the strongest future prototype candidate but must demonstrate reproducible behavior, accurate scope, limitations, and a usable visual or working demo first. |

### Appointment & Operations SaaS / ChronoApp

| Required field | Status | Finding |
| --- | --- | --- |
| Project identity | **APPROVED** only as a legacy record | The retained inventory names the concept and records a ChronoApp repository URL. |
| Ownership or client relationship | **OPEN** | No item-level ownership record or client relationship is established. |
| Maturity | **OPEN** | The legacy description is conceptual copy, not evidence of a working system. |
| Current status | **REJECTED** as a usable public repository link | The recorded GitHub repository returned 404 again on 2026-09-04. |
| Production, Laboratory, or prototype | **OPEN** | Laboratory is plausible but unverified. |
| Disclosure permission | **OPEN** | No permission record exists. |
| Public description | **OPEN** | Separate implemented behavior from aspirational AI and operations claims before publication. |
| Screenshots or assets | **OPEN** | Historical `public/projects/AI-Scheduler.svg` was retired in Task 4; it did not prove implementation or permission. |
| Metrics | **OPEN** | No metric or source exists. |
| Links | **REJECTED** until repaired or replaced with verified evidence | Do not publish the recorded 404 repository. |
| Technologies | **OPEN** | Legacy tags are not sufficient evidence of implemented scope. |
| Client identity permission | Not applicable on current evidence | No client identity is established. |
| Business-homepage eligibility | **REJECTED** | The primary repository evidence is unavailable and functional scope is unverified. |

### Documancer

| Required field | Status | Finding |
| --- | --- | --- |
| Project identity | **APPROVED** as a recorded identity | The legacy inventory and public repository identify `Documancer`. |
| Ownership or client relationship | **APPROVED** only as founder-published source | The repository is public under Samuel's GitHub account. No client relationship is claimed. |
| Maturity | **APPROVED** as early-stage, non-production evidence | The public README explicitly calls the application early-stage and describes planned scope. |
| Current status | **APPROVED** only for repository availability | The public repository resolved on 2026-09-04 and contains implementation files; runnable behavior was not reproduced. |
| Production, Laboratory, or prototype | **PROPOSED** Laboratory or prototype | The exact maturity label remains open pending functional verification. |
| Disclosure permission | **APPROVED** for linking to founder-published public source; other fields remain item-specific | The public Apache-2.0 repository does not automatically approve every screenshot or claim. |
| Public description | **PROPOSED** | Any description must preserve the early-stage limitation and avoid implying a completed commercial AI product. |
| Screenshots or assets | **OPEN** | Historical `public/projects/Documancer.svg` was retired in Task 4; its represented state and suitability were never verified. |
| Metrics | **OPEN** | No result metric or source exists. |
| Links | **APPROVED** as a reachable public source repository | The repository resolved on 2026-09-04. |
| Technologies | **APPROVED** as repository-backed implementation context; secondary only | Technology remains supporting detail. |
| Client identity permission | Not applicable on current evidence | No client identity is claimed. |
| Business-homepage eligibility | **REJECTED** | It is early-stage entertainment/experimental work and does not support the launch service narrative strongly enough. It may remain secondary Founder or Laboratory material. |

## Historical proposed public titles — superseded

- General Reservation System → `Motor de reservas adaptable para negocios de servicios`
- Appointment & Operations SaaS → `Gestión de turnos y operaciones para empresas de servicios`
- MPC Administración → `Prototipo educativo para gestionar producción y stock de una organización ficticia`
- Busesfy, if identity is approved → `Presencia web comercial para una empresa de transporte`
- Documancer → `Exploración de generación y gestión de contenido asistido`

These titles are not approved claims.

## Homepage eligibility decision

### Current project-card selection — APPROVED

No current record is approved for a business-homepage project card:

- Busesfy fails relationship, maturity, description, screenshot, and client-permission gates.
- MPC Administración is confirmed as educational work for a fictional organization and is not strong enough for the commercial homepage.
- General Reservation System has public implementation evidence but an unavailable demo and no verified functional demonstration or publication-ready story.
- Appointment & Operations / ChronoApp has an unavailable repository and unverified functionality.
- Documancer is explicitly early-stage and weakly aligned with the launch services.

The repository therefore does not support a truthful project-card version of `HOME-PROOF` in Initiative 2. This is an evidence finding, not permission to soften the gates.

### Approved honest fallback

`PAGE-HOME` owns a compact credibility section based on approved founder accountability, verifiable-claims discipline, and confidentiality. It contains no project cards, client identities, logos, screenshots, metrics, testimonials, or Projects-route CTA. This fallback is implementation-ready and may remain until stronger evidence exists.

### Future project-card selection — OPEN

When evidence becomes available, select at most three items:

1. one production solution relevant to a target client;
2. one Laboratory solution demonstrating a launch service;
3. one functional prototype with verifiable public evidence.

Editorial relevance controls order, not chronology. At least one item must reach the `ready` publication state before any homepage project-card variant is planned. Each selected item still requires complete item-level permission and an accurate Spanish and English public story.

### Prototype homepage eligibility gate — APPROVED

A functional prototype may appear on the business homepage only when all of the following are recorded:

1. identity and founder/FURLANICH ownership;
2. explicit `prototype` maturity and current lifecycle status;
3. reproducible working behavior or a working public demo, not source presence alone;
4. implemented scope and material limitations;
5. approved natural Spanish and English public descriptions;
6. verified link destinations and a review date;
7. screenshot or video provenance plus permission for every visible asset;
8. commercial relevance to at least one approved launch service or audience;
9. no client, production, outcome, testimonial, or metric implication without its own evidence and permission.

Meeting this gate makes the item eligible for editorial selection; it does not guarantee homepage inclusion.

## Evidence gaps

| Launch service | Current provisional evidence | Gap |
|---|---|---|
| Commercial websites | General Reservation System implementation evidence plus an unresolved Busesfy record | Functional verification and publication-ready limitations for the reservation work; relationship, authorship, and permissions for Busesfy. |
| WhatsApp automation | No clearly inventoried public example | A truthful Laboratory demonstration or approved client summary. |
| Maintenance and consulting | Experience description only | An approved anonymized real intervention story, or process-only explanation until one exists. |

## Services-page evidence eligibility — APPROVED 2026-09-05

This matrix closes Initiative 3 publication use without changing any item's underlying maturity or permission status. `Suitable for Services` means the item may support the service page now in the exact form stated; it does not make the item a client case, a production solution, or `ready` for a project card.

| Evidence item | Service relevance | Maturity and origin | Restricted/confidential | Publication permission | Suitable for Services page | Suitable for Projects page | Public-use decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Busesfy | `SERVICE-WEB` | Production/Laboratory/prototype **OPEN**; ownership or client relationship **OPEN** | Treat as restricted while relationship and permissions are unknown | URL reachability only; identity, description, UI, and commercial-use permission **OPEN** | **No.** Do not name, describe, or link it in public Services content | **No, currently unsuitable.** Reassess only after relationship, maturity, authorship, and item permissions are recorded | Unsuitable for public evidence now |
| MPC Administración | Weak `SERVICE-WEB`/internal-system relevance | Confirmed 2021 educational founder work for a fictional organization; non-production; functional prototype **PROPOSED**, not verified | Not client-confidential; screenshot and third-party competition-material reuse remain unresolved | Public founder repository may be linked; broader description and visual reuse remain item-specific | **No.** Age, educational context, and unverified behavior make it poor service proof | **Secondary candidate only**, after behavior, limitations, description, and visuals are reviewed | Suitable only for a possible future Founder/Projects context, not Services |
| General Reservation System | Strongest current `SERVICE-WEB` candidate for bookings | Founder-published source; production use not evidenced; functional prototype **PROPOSED** with implementation evidence only | No client identity; screenshots and represented build remain unresolved | Public source link is permitted; working-demo, visual, and outcome publication are not | **Limited text-only use approved.** Services may acknowledge the repository and its unresolved demonstration/limitations; no card, screenshot, demo link, production label, or outcome | **Deferred.** Eligible for future Projects consideration only after reproducible behavior, limitations, accurate bilingual story, and visuals are ready | Limited Services disclosure; richer public use not ready |
| Appointment & Operations SaaS / ChronoApp | Possible web/operations and AI relevance | Maturity and ownership **OPEN**; legacy concept text; recorded repository unavailable | No client identity established; other permissions **OPEN** | No usable repository evidence or item-level permission | **No** | **No, currently unsuitable** | Unsuitable for public use until evidence is located or the item is retired |
| Documancer | Optional tailored AI capability; weak launch-service relevance | Founder-published early-stage non-production work; Laboratory or prototype **PROPOSED** | No client identity; screenshot state and suitability unresolved | Public Apache-2.0 source may be linked; other claims and visuals remain item-specific | **No.** It must not be used to imply a standalone AI service or mature commercial capability | **Secondary Laboratory/Founder candidate only**, after functional verification and an accurate limited story | Suitable only for possible future Projects/Founder context, not Services |

No inventoried item is confirmed production evidence suitable for the Services page. No item supports `SERVICE-WHATSAPP`, and no item documents a maintenance/consulting intervention. Personal or founder work is identified as such; none may be reframed as client work.

### SERVICE-WEB evidence closure

The Services page may use the General Reservation System only as an explicit evidence-status note: a public founder repository supplies implementation evidence, while current working behavior and imagery remain unverified. Its limitations and Projects-card presentation are now approved, but the Services section remains text-only. This is useful because it demonstrates that the offer is not supported by an invented client claim while preserving the strongest truthful repository signal. It does not link to the broken demo.

### SERVICE-WHATSAPP evidence closure

No suitable public evidence exists. The Services page must say this plainly and rely on scoped offer language, provider boundaries, and direct accountability rather than a fabricated case, certification, screenshot, metric, or testimonial. A future Laboratory demonstration or approved anonymized client summary must enter the normal publication lifecycle before it can replace this status.

### SERVICE-CONSULTING evidence closure

No suitable public intervention record exists. General experience, source-code maintenance activity, or confidential work is not enough to claim a public outcome. The Services page may explain the diagnostic method and confidentiality posture, but it must not style those statements as project evidence. A future anonymized intervention requires authorized scope, action, result, and disclosure terms.

### Services-page presentation rule

Evidence status appears as concise text within each service section, not as three equal cards. Logos, screenshots, metrics, maturity badges, unavailable links, and project-card affordances are excluded. This honest asymmetry is implementation-ready; richer evidence remains **DEFERRED**, not a blocker for the page.

## Approved editorial rules

- Use `Proyectos seleccionados`, not `Casos de éxito`, until outcomes are verified.
- Do not publish a metric without an internal source and permission.
- Do not publish an unavailable demo or broken repository link.
- Use tags such as `Reservas`, `Pedidos`, or `Integraciones` before technology tags.
- Label generated or conceptual visuals.
- End relevant entries with `¿Necesitás resolver algo parecido?`
- Review links, claims, and permissions periodically.
- Prefer a small set of strong, relevant evidence over a large gallery.

## Initiative 4 decision closure — 2026-09-06

The current item-level authority is the [project evidence inventory](projects/index.md) and its linked records. Those records supersede the historical candidate findings and proposed titles above where they differ. The [Projects and evidence experience](projects/experience.md) owns the accepted page, card, detail, imagery, content, accessibility, and performance decisions.

### Publication closure

- Busesfy is `BLOCKED-PERMISSION`.
- General Reservation System is `READY` for its approved source-backed card and remains `implementation-evidence`; historical CI and repository structure do not upgrade it to `functional-demonstration`.
- MPC Administración is `READY` for its approved educational source-backed card and must remain explicitly group work for a fictional organization.
- ChronoApp is `RETIRED` because the repository remains unavailable and no functionality can be established.
- Documancer is `PRIVATE`; its early-stage characterization is preserved and sensitive-looking development configuration must be remediated before the repository is promoted.
- The-System is `READY` for its approved Laboratory source-backed card; its substantial source and tests are implementation evidence, not proof of current runnable behavior.
- The three READY decisions authorize the exact image-free bilingual card content, the paired summary-only detail content, one labeled conceptual WebP visual per item, the public repository destination, limitations, relationship non-claims, and `SERVICE-WEB` relationship in each item record. These visuals are conceptual illustrations, not screenshots or functional evidence. No record is homepage-eligible.

### Public taxonomy

| Internal maturity | Spanish | English |
| --- | --- | --- |
| `production` | Soluciones en producción | Production solutions |
| `lab` | Laboratorio FURLANICH | FURLANICH Lab |
| `prototype` | Prototipos funcionales | Functional prototypes |

These labels are rendered only when a populated public group exists. `Functional prototype` is not applied to a record until functional behavior has actually been verified. Internal disclosure and evidence-strength values remain in the evidence record; the public UI uses restrained plain-language evidence and limitation statements.

Alternatives rejected for the canonical taxonomy were `Trabajo en producción / Production work` plus `Exploraciones aplicadas / Applied explorations`, which obscure the solution and maturity distinction, and `Sistemas en uso / Systems in use` plus `Prototipos verificados / Verified prototypes`, which overstate usage or verification.

### Experience closure

- The approved index strategy is hybrid: strongest selected evidence first, then maturity groups only when inventory size justifies them. Do not render empty groups.
- Filters are rejected for launch and may be reconsidered only under the threshold recorded in the inventory.
- Ordering is editorial using commercial relevance, evidence strength, service coverage, disclosure completeness, visual quality, and capability diversity.
- A typed static localized content model is sufficient. No CMS, database, project API, admin surface, search system, or filtering framework is approved.
- `HOME-PROOF` keeps its approved fallback because no project passes the homepage evidence gate.
- General Reservation System, The-System, and MPC Administración form the approved launch order for one ungrouped editorial grid and the corresponding detail-route order. Task 2 / PR 2 is merged; Task 3 / PR 3 may publish paired summary-only detail routes using the existing fail-closed manifest, approved repository links, and the three labeled conceptual WebP visuals.

### Permission policy

Every candidate now has an explicit permission matrix. Unknown permission continues to fail closed. Public availability, repository ownership, a legacy portfolio entry, and an existing asset do not independently grant permission. On 2026-09-06 the initiative owner explicitly approved limited publication of the three READY records: their exact bilingual card/detail fields, source-backed capability statements, generic context, public-source label, limitations, public repository link, and one generated conceptual visual per record. Screenshots, videos, metrics, testimonials, production claims, client/employment claims, sole-authorship claims, and homepage use remain unapproved unless an item record says otherwise. The generated visuals are labeled as conceptual and are not evidence of runtime behavior.
