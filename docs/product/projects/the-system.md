---
id: PROJECT-THE-SYSTEM
type: project-evidence-record
status: APPROVED
related:
  - PROJECT-EVIDENCE
  - SERVICE-WEB
last_verified: 2026-09-06
---

# The-System

## Identity and decision

| Field | Decision |
| --- | --- |
| Internal ID / slug | `PROJECT-THE-SYSTEM` / `the-system` |
| Internal/original name | The-System |
| Public name ES / EN | `Gestión multiusuario de campañas de rol` / `Multi-user role-playing campaign management` |
| Relationship | Founder-published Laboratory repository; no client, employment, or production-delivery claim |
| Maturity | Lab |
| Lifecycle/publication | `READY` |
| Disclosure / evidence | Summary-only / implementation-evidence |
| Primary service | `SERVICE-WEB` |
| Public card / detail / homepage | Yes / Yes / No |
| Editorial order | 2 |

This repository was created after the original project audit and describes a role-playing operations platform. The current source includes authentication and email verification, password recovery, external-auth boundaries, role-playing campaign CRUD, memberships and invitations, subscription/billing abstractions, a Next.js client foundation, tests across backend layers, frontend unit tests, and Docker development dependencies. Many blueprint areas—scene runtime, assets, notes, collaborative behavior, and full product experience—remain scaffolded or planned.

The repository contains tests, but no repository workflow result, current clean-checkout run, deployed demo, production use, business outcome, screenshot, or video was verified in this audit. `READY` authorizes the limited public card below. It does not upgrade evidence strength or approve a detail page, visual, demo, production claim, or homepage use.

## Approved bilingual public card

| Field | Spanish | English |
| --- | --- | --- |
| Title | Gestión multiusuario de campañas de rol | Multi-user role-playing campaign management |
| Context | Laboratorio FURLANICH · Operaciones para juegos de rol | FURLANICH Lab · Role-playing operations |
| Maturity label | Laboratorio FURLANICH | FURLANICH Lab |
| Summary | Laboratorio de aplicación web con identidad y acceso, campañas, membresías e invitaciones y límites de suscripción modelados en el código. Se publica como evidencia de implementación; las áreas aún planificadas no se presentan como entregadas. | Web-application lab with identity and access, campaigns, memberships and invitations, and subscription boundaries represented in code. It is published as implementation evidence; planned areas are not presented as delivered. |
| Capabilities | Identidad y acceso; Permisos multiusuario; Gestión de campañas | Identity and access; Multi-user permissions; Campaign management |
| Evidence signal | Código fuente público | Public source |
| CTA | Ver código fuente | View source |
| Limitation | Sin demo público ni verificación actual de ejecución; no se afirma uso en producción. | No public demo or current runtime verification; no production use is claimed. |

Approved destination: <https://github.com/Furlanich/The-System>

## Approved conceptual visual asset

| Field | Decision |
| --- | --- |
| Asset | `public/projects/the-system/conceptual-access-model.webp` |
| Type | Conceptual illustration of multi-user campaign operations; not a product screenshot or functional demonstration |
| Dimensions / format | 1599 × 900 WebP (approximately 16:9); 46,816 bytes at review time |
| Provenance | Generated with the repository image-generation workflow on 2026-09-06 from a purpose-written prompt; optimized to WebP with the existing Sharp dependency. No source UI, customer data, client identity, or repository capture is represented. |
| Visible label | `Ilustración conceptual · no es una captura del producto` / `Conceptual illustration · not a product screenshot` |
| Alt text ES / EN | Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción. / Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries. |
| Approved use | Project-detail visual only; keep the launch card image-free. |

The visual explains the modeled implementation boundaries without presenting planned scene, asset, notes, or collaboration features as delivered.

## Approved bilingual detail content for PR 3

| Section | Spanish | English |
| --- | --- | --- |
| Header summary | Laboratorio de aplicación web para organizar campañas de rol con identidad, membresías y permisos multiusuario. La página distingue el código existente de las áreas planificadas. | Web-application laboratory for organizing role-playing campaigns with identity, memberships, and multi-user permissions. This page distinguishes existing code from planned areas. |
| Evidence statement | Evidencia de implementación basada en el repositorio público, sus pruebas y su configuración de desarrollo. No se verificó una ejecución actual. | Implementation evidence based on the public repository, its tests, and development configuration. A current runtime was not verified. |
| Context | El laboratorio explora operaciones de campañas de rol y los límites de acceso necesarios cuando participan varias personas. | The laboratory explores role-playing campaign operations and the access boundaries needed when several people participate. |
| Problem/opportunity | El alcance modela cómo separar identidad, membresías, invitaciones y permisos alrededor de una campaña. Esto describe una exploración de producto, no una necesidad confirmada de un cliente. | The scope models how to separate identity, memberships, invitations, and permissions around a campaign. This describes a product exploration, not a confirmed client need. |
| Delivered scope | Autenticación y verificación de email; recuperación de contraseña; límites de autenticación externa; CRUD de campañas; membresías e invitaciones; abstracciones de suscripción/facturación; base de cliente Next.js; pruebas en capas del backend y frontend. | Authentication and email verification; password recovery; external-auth boundaries; campaign CRUD; memberships and invitations; subscription/billing abstractions; Next.js client foundation; backend-layer and frontend tests. |
| Capabilities | Identidad y acceso; Permisos multiusuario; Gestión de campañas. | Identity and access; Multi-user permissions; Campaign management. |
| Result | Resultado público: evidencia de implementación. No se afirma ejecución actual, uso en producción, colaboración completa, escenas, activos, notas ni resultado comercial. | Public result: implementation evidence. Current execution, production use, full collaboration, scenes, assets, notes, and business outcomes are not claimed. |
| Evidence | Repositorio público aprobado; ilustración conceptual aprobada. | Approved public repository; approved conceptual illustration. |
| Limitations | No hay demo pública ni verificación de ejecución actual; varias áreas del blueprint siguen planificadas o scaffolded. | There is no public demo or current runtime verification; several blueprint areas remain planned or scaffolded. |
| Related service | Sitios y aplicaciones web comerciales | Commercial websites and web applications |
| Publication scope | La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real. | The public description is limited by publication permissions. The image is conceptual and does not show a real interface. |

## Permission matrix

| Publication field | Status | Grantor/date | Restriction |
| --- | --- | --- | --- |
| Approved public title and description | APPROVED | Initiative owner / 2026-09-06 | Exact card scope above; no client, employment, delivery, or production inference. |
| Company/client identity; logo | NOT APPLICABLE | — | Do not imply client work. |
| Generic context | APPROVED | Initiative owner / 2026-09-06 | FURLANICH Laboratory and role-playing operations only. |
| Screenshots; video | NOT APPROVED | — | Fresh verified capture required. |
| Conceptual visual asset | APPROVED | Initiative owner / 2026-09-06 | Use only the exact WebP above with the visible conceptual label; it is not product evidence. |
| Approved workflow/features | APPROVED | Initiative owner / 2026-09-06 | Limited to the source-backed capability labels and summary above; planned areas remain excluded. |
| Architecture details; technology stack | NOT APPROVED | — | Not needed for the card. |
| Metrics; testimonial; production confirmation | NOT AVAILABLE | — | Do not publish. |
| Live URL | NOT AVAILABLE | — | None verified. |
| Repository | APPROVED | Initiative owner / 2026-09-06 | Link to the public repository only; no repository-license or ownership inference. |
| Employee/employer relationship | NOT APPROVED | — | Do not state or imply. |

## Approved READY and detail scope and remaining limitations

Publish the image-free bilingual card above and the paired Spanish/English detail page described here, linking to the public source and showing the labeled conceptual visual. A screenshot, demo, `functional-demonstration` label, and claims about planned scene or collaboration features remain unapproved. Current runtime verification and authorized media would be required before broadening the evidence claim.
