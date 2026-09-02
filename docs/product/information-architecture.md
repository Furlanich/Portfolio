---
id: IA-SITE
type: information-architecture
status: APPROVED
related:
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-CONTACT
last_verified: 2026-09-01
---

# Information architecture

## Sitemap

Spanish is primary:

```text
/
├── servicios/
├── proyectos/
│   └── [project-slug]/
├── estudio/
│   └── samuel-furlanich/
├── contacto/
├── privacidad/
└── 404/
```

English is secondary:

```text
/en/
├── services/
├── work/
│   └── [project-slug]/
├── about/
│   └── samuel-furlanich/
├── contact/
├── privacy/
└── 404/
```

Project detail pages exist only when the disclosure level supports meaningful content. Restricted production summaries do not require a detail route.

## Primary navigation

### Spanish

- Brand → `/`
- Servicios → `/servicios/`
- Proyectos → `/proyectos/`
- Cómo trabajamos → `/#proceso`
- El estudio → `/estudio/`
- Primary CTA: `Contanos sobre tu proyecto` → `/contacto/`
- Language: `ES | EN`

### English

- Brand → `/en/`
- Services → `/en/services/`
- Work → `/en/work/`
- How we work → `/en/#process`
- About → `/en/about/`
- Primary CTA: `Tell us about your project` → `/en/contact/`
- Language: `ES | EN`

There is no separate Home item. The founder profile is reached through Studio/About and the footer, not the primary navigation.

## Footer

The footer provides:

- service, project, process, and studio navigation;
- email, WhatsApp, and phone;
- Buenos Aires, Argentina;
- founder profile, LinkedIn, and GitHub;
- privacy;
- language switching;
- copyright identity.

Exact footer grouping and visual layout remain part of future design work.

## Page responsibilities

- **PAGE-HOME:** Communicate value, relevance, selected services, evidence, process, founder accountability, and a clear path to inquiry.
- **PAGE-SERVICES:** Explain outcomes, examples, fit, boundaries, and dependencies for the three launch services.
- **PAGE-PROJECTS:** Present evidence with truthful maturity and disclosure labels.
- **PAGE-PROJECT-DETAIL:** Explain context, problem, delivered scope, demonstrated result, limitations, and relevance when disclosure permits.
- **PAGE-STUDIO:** Explain the founder-led operating model, principles, location, and direct responsibility.
- **PAGE-FOUNDER:** Preserve Samuel's biography, experience, skills, education, selected work, CV, and professional links.
- **PAGE-CONTACT:** Collect the structured inquiry and provide secondary contact channels and response expectations.
- **PAGE-PRIVACY:** Explain collected data, purpose, providers, retention, and applicable user rights in plain language.
- **PAGE-NOT-FOUND:** Restore navigation to Home, Services, Projects, or Contact in the active language.

## Launch exclusions

No top-level launch routes for Technology, Solutions, AI, Team, Blog, Pricing, Careers, or Portfolio. There are no individual service subpages initially. These exclusions reduce duplication and avoid unsupported breadth.

## Relationships

```text
PAGE-HOME
  -> PAGE-SERVICES
  -> PAGE-PROJECTS
  -> PAGE-STUDIO
  -> PAGE-CONTACT

PAGE-PROJECTS
  -> PAGE-PROJECT-DETAIL (only where disclosure permits)
  -> PAGE-CONTACT

PAGE-STUDIO
  -> PAGE-FOUNDER
  -> PAGE-CONTACT

PAGE-FOUNDER
  -> CV / LinkedIn / GitHub
  -> PAGE-CONTACT
```

## Localization behavior

- Equivalent routes switch context, for example `/servicios/` ↔ `/en/services/`.
- Project slugs remain stable between languages when they are project names.
- Root is the Spanish and `x-default` experience.
- No automatic locale redirect.
- URLs use trailing slashes to remain compatible with static export.
