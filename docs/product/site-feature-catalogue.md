---
id: FEATURE-CATALOGUE
type: product-catalogue
status: PROPOSED
related:
  - IA-SITE
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - PAGE-LEGAL
  - PAGE-SERVICES
  - PROJECT-EVIDENCE
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - LEGAL-PROTOTYPE-POSTURE
  - RELEASE-READINESS
last_verified: 2026-09-14
---

# Site feature catalogue

This concise catalogue traces visitor-facing capabilities to their authoritative requirements. It is not an implementation backlog and does not redefine navigation, contact, evidence, or launch exclusions.

## APPROVED launch capabilities

| Capability area | Authoritative requirements |
| --- | --- |
| Navigation and localization | [`IA-SITE`](information-architecture.md) |
| Business communication | [`PAGE-HOME`](pages/home.md), [`PAGE-SERVICES`](pages/services.md), [`PAGE-CONTACT`](pages/contact-and-privacy.md) |
| Project evidence | [`PROJECT-EVIDENCE`](project-evidence.md), [`PAGE-PROJECTS`](pages/projects.md) |
| Founder profile | [`PAGE-FOUNDER`](pages/studio-and-founder.md) |
| Inquiry demonstration | [`PAGE-CONTACT`](pages/contact-and-privacy.md) and [`ADR-CONTACT-INQUIRY-DEMO-MODE`](../decisions/contact-inquiry-demonstration-mode.md): four fields, validation, loading, simulated success/failure, failure preservation, retry, and fallbacks with zero submission transmission |
| Prototype Privacy and Legal Notice | [`PAGE-PRIVACY`](pages/contact-and-privacy.md#exact-public-demonstration-privacy-copy-approved) and [`PAGE-LEGAL`](pages/legal-notice.md): exact bilingual, versioned, factual public copy with footer access and no commercial/legal approval claim |
| Services in-page navigation | Stable localized fragments and non-sticky service index in [`PAGE-SERVICES`](pages/services.md#stable-service-anchors-approved) |

## PROPOSED launch capabilities

- Project-card capability filters if the inventory becomes large enough; no filter is needed for a small launch set. See [`PAGE-PROJECTS`](pages/projects.md).
- Explicit evidence/disclosure labels on project cards. See [`PROJECT-EVIDENCE`](project-evidence.md).
- Localized canonical, `hreflang`, sitemap, Open Graph, and structured-data metadata. See [`CONTENT-LOCALIZATION`](content-and-localization.md).
- A conceptual-image disclosure where generated imagery is used. See [`PROJECT-EVIDENCE`](project-evidence.md).

## OPEN capabilities and dependencies

- Commercial Contact delivery: [`ADR-CONTACT-INQUIRY-PIPELINE`](../decisions/contact-inquiry-pipeline.md) retains Formspree behind `submitInquiry()` for a later activation. Provider configuration/retention, processor/transfer facts, professionally reviewed notice/consent wording, and live delivery/deletion evidence remain OPEN. They do not block the completed zero-transmission demonstration recorded by [`PLAN-CONTACT-INQUIRY-PIPELINE`](../plans/completed/contact-inquiry-pipeline.md).
- Commercial Privacy and Terms: responsible identity, tax/domicile facts, registration applicability, processors/subprocessors, retention/deletion, transfers, rights handling, contracts, and professional review remain OPEN in [`LEGAL-PROTOTYPE-POSTURE`](../legal/prototype-legal-posture.md).
- Final project search/filter behavior and public project demos or video walkthroughs. See [`PROJECT-EVIDENCE`](project-evidence.md).
- Analytics and conversion measurement.
- Blog or resources after launch. They are excluded from the initial sitemap by [`IA-SITE`](information-architecture.md#launch-exclusions).

## Explicit non-features at launch

Catalogue-owned launch non-features are user accounts; client portal; CMS unless later content-maintenance needs justify one; pricing calculator; automated project quotation; and a public team directory.

Automatic locale redirect and a standalone AI marketing page are excluded by [`IA-SITE`](information-architecture.md#launch-exclusions) and its [localization behavior](information-architecture.md#localization-behavior).
