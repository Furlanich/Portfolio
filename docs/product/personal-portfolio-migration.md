---
id: PORTFOLIO-MIGRATION
type: content-migration
status: APPROVED
related:
  - IA-SITE
  - PAGE-FOUNDER
  - PROJECT-EVIDENCE
  - PROJECT-INVENTORY
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-07
---

# Personal portfolio migration

## Goal

Preserve useful professional history while making the business site the primary experience. Migration should happen incrementally; existing content is not removed until its replacement exists and has been verified.

## Content mapping

| Current content | Target owner | Treatment |
|---|---|---|
| Personal hero and introduction | `PAGE-FOUNDER` | Rewrite as founder biography and business-relevant professional summary. |
| CV download | `PAGE-FOUNDER` | Preserve after verifying content and filename. |
| Full skills catalogue | `PAGE-FOUNDER` | Preserve technical depth here; use outcome-oriented capabilities on business pages. |
| Experience timeline | `PAGE-FOUNDER` | Fact-check, update, and preserve as secondary content. Clever Soft SA belongs in narrative biography, not in this résumé-style timeline. |
| Education timeline | `PAGE-FOUNDER` | Correctly state completed UBA studies and technical education. |
| Current projects | `PAGE-PROJECTS` or Founder/Laboratory | Reclassify by maturity, relevance, and disclosure permission. |
| Game-development and experimental work | Founder/Laboratory | Keep secondary; do not use as primary commercial proof. |
| Repeated contact information | `PAGE-CONTACT` and footer | Centralize; keep only contextual links elsewhere. |
| Social links | Footer, Studio, Founder | GitHub is supporting technical evidence, not the primary business CTA. |
| Current in-browser locale data | Localized routes | Migrate to page-equivalent Spanish/English content. |

## Migration rules

- Do not delete historical content before a replacement exists.
- Migrate the founder profile in the same release that makes the business homepage primary, preventing useful history from disappearing.
- Maintain one authoritative content record for each fact.
- Verify dates, links, titles, and public permissions before migration.
- Preserve repository history rather than copying old content into an archive page.
- Do not automatically promote every personal project into business evidence.

## Homepage-foundation migration gate — APPROVED

The business `HOME-HERO` may replace the current personal hero only when both localized Founder routes satisfy the [minimum Founder destination](pages/studio-and-founder.md#homepage-foundation-minimum-founder-destination-approved).

For this integration gate:

- the approved biography, concise experience and education, business-relevant capabilities, CV access, LinkedIn, GitHub, and Contact path are required;
- the current CV asset and professional URLs must be verified before the replacement is integrated;
- a founder photograph, redesigned CV, complete project catalogue, and final Founder-page visual treatment are not required;
- legacy content outside this minimum may be migrated in later phases, but it must not be deleted or made unreachable without its documented replacement.

The Founder destination must be available in the same release that makes the business hero primary. A technical execution plan owns route sequencing and rollback; this document owns the preservation requirement.

## Initiative 4 project disposition — APPROVED

The [item-level project inventory](projects/index.md) now governs migration of legacy project records. Three are approved for limited business Projects cards:

- General Reservation System is READY for a source-backed prototype card with explicit lack of current functional verification.
- The-System is READY for a source-backed FURLANICH Laboratory card that excludes planned features.
- MPC Administración is READY for a source-backed educational group-work card and must identify the organization as fictional.
- Busesfy remains blocked on relationship/publication permission.
- ChronoApp is retired from evidence rather than carried forward with a dead repository.
- Documancer remains private until sensitive-looking configuration is remediated and present behavior is verified.

The READY promotion does not authorize legacy screenshots, homepage placement, production/client claims, or sole-authorship claims. The three cards launch without images and the paired detail pages use only their approved public repositories and labeled conceptual visuals.

Legacy `data/projects.json` copy and unapproved `public/projects/` imagery remain historical audit evidence only; the unused paths were retired in Task 4 after approved replacements and intentional exclusions were verified. Future records may be migrated only after reaching `READY` or `READY-SUMMARY-ONLY` with their own evidence and permission gate.

## Current retained-source and completion gaps — VERIFIED 2026-09-07

The business homepage and minimum bilingual Founder destinations are implemented. Retained legacy source still requires deliberate migration treatment rather than automatic deletion:

- data/experience.json still ends independent work at 2026; the completed Founder requirement uses “Desde 2024 / Since 2024.”
- The minimum Founder implementation currently exposes only the independent-work entry. Initiative 5 approves the retained 2021 IT Technician internship as the second editorial experience entry.
- data/education.json uses legacy degree/date wording; public Founder content continues to use the approved factual “studies completed” and technical-education language.
- data/skills.json is a recruiter-oriented icon catalogue. Initiative 5 replaces its presentation with four business-relevant capability groups and rejects a technology-logo wall.
- data/about.json retains the superseded personal introduction and an outdated phone format. It remains historical migration input, not target public copy.
- The shared navigation currently labels and links the Founder route as “El estudio / About.” The approved Studio routes are absent and must be added before navigation can reflect IA-SITE.
- The current Founder page has no Projects bridge or final commercial CTA and places Contact alongside professional links. Initiative 5 separates professional identity actions from the final Contact bridge.

These are migration findings, not authorization to edit application code in the decision-closure task.

## Initiative 5 migration closure — APPROVED

- Studio becomes the primary “El estudio / About” navigation destination. Founder remains a nested professional destination.
- Studio owns the operating model, accountability, collaborator wording, principles, availability, short Founder bridge, and commercial CTA.
- Founder owns the approved detailed biography, the independent-practice and 2021 internship entries, factual education, grouped applied capabilities, CV/LinkedIn/GitHub, one Projects bridge, and the final Contact bridge.
- Clever Soft SA remains in narrative biography only. It is not added to the experience timeline or presented as an endorsement.
- The complete Projects index is not copied into Founder; one localized bridge preserves evidence authority.
- No approved portrait exists. The implementation remains complete without imagery, and photography is deferred.
- public/Samuel-Furlanich-CV.pdf remains the preserved asset. Its technical download path and professional links must be reverified in root and /Portfolio modes during implementation. CV content review/redesign remains separate deferred work and must not be performed silently.
- Legacy source may be removed only after repository search proves that the completed Founder content and any other consumer no longer require it.
