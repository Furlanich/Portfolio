---
id: IA-SITE
type: information-architecture
status: APPROVED
related:
  - PAGE-HOME
  - PAGE-SERVICES
  - PAGE-PROJECTS
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-LEGAL
  - CONTENT-LOCALIZATION
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - RELEASE-READINESS
last_verified: 2026-09-14
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
├── aviso-legal/
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
├── legal/
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
- legal notice;
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
- **PAGE-LEGAL:** Identify the public site and founder, explain its demonstration/informational scope, and provide bounded intellectual-property, external-link, availability, and change notices without pretending to be commercial Terms.
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

## Deployment host and mode — APPROVED

- Canonical public URL: `https://furlanich.github.io/Portfolio/`.
- Origin: `https://furlanich.github.io`.
- GitHub Pages project base path: `/Portfolio`.
- No custom domain or alternate production host is planned.
- The sitemap remains the bilingual product demonstration IA. Public presence of Home, Services, Projects, Studio, Founder, Contact, and Privacy does not mean their depicted commercial capabilities are operational.
- Contact may publish the full four-field interaction only in the zero-transmission demonstration mode recorded by `ADR-CONTACT-INQUIRY-DEMO-MODE`. A later real-processing activation changes product/deployment state and requires separate review.

## Privacy and Legal Notice route closure — APPROVED

Initiative 7 adds one paired legal destination within the accepted route model:

- `/privacidad/` ↔ `/en/privacy/` remains the factual data-handling page.
- `/aviso-legal/` ↔ `/en/legal/` is the dedicated prototype Legal Notice.
- Both routes use static export, trailing slashes, locale-owned content, shared locale-agnostic composition, and context-preserving language switching.
- Privacy and Legal Notice appear together in the footer on every supported page. Neither enters primary navigation.
- A combined Privacy/Legal page and a footer-only legal paragraph are rejected because they mix distinct responsibilities or make the complete notice difficult to find and link.
- Commercial Terms remain non-public and do not receive a route.

This is a bounded extension of `ADR-STATIC-LOCALIZED-ROUTING`. Implementation requires a versioned execution plan because it affects content, routes, equivalence, footer, static verification, and browser QA; it does not require a new RFC or ADR.


## Studio and Founder route closure — APPROVED

Initiative 5 confirms that the existing sitemap is implementation-ready without changing its architecture:

- /estudio/ ↔ /en/about/ is the Studio/About business page pair and the “El estudio / About” primary-navigation target.
- /estudio/samuel-furlanich/ ↔ /en/about/samuel-furlanich/ is the nested Founder-profile pair.
- The Founder pair remains outside primary navigation and is reached from Studio, the footer professional group, and restrained Contact/project contexts defined by PAGE-STUDIO/PAGE-FOUNDER.
- Language switching preserves Studio-to-Studio and Founder-to-Founder context.
- The footer exposes Studio under site navigation and “Samuel Furlanich” under professional links; LinkedIn and GitHub do not substitute for the internal Founder destination.

The current route contract's use of the Founder pair as the “El estudio / About” link is an implementation gap, not an approved IA change.
