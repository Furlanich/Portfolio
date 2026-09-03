---
id: PORTFOLIO-MIGRATION
type: content-migration
status: APPROVED
related:
  - IA-SITE
  - PAGE-FOUNDER
  - PROJECT-EVIDENCE
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-09-03
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

## Facts requiring correction in the current implementation

- Current metadata and hero still describe a personal developer portfolio.
- Current experience data ends independent work at 2026. The target biography must state independent work since 2024 and include the approved Clever Soft SA narrative without adding it to the experience timeline.
- Current education wording should reflect that UBA studies were completed.
- The stored phone lacks the confirmed international mobile `9` used by the intended public contact format.
- Existing project records do not contain maturity or disclosure classification.

These are migration findings, not standalone authorization to modify application data. Implementation still requires the approved architecture and execution path.
