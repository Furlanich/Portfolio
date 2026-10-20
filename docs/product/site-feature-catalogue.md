---
id: FEATURE-CATALOGUE
type: product-catalogue
status: PROPOSED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - IA-SITE
  - PAGE-CONTACT
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PAGE-PRIVACY
  - PAGE-TERMS
  - DESIGN-SFC-V1
  - PLAN-SFC-V1
  - PAGE-SERVICES
  - PROJECT-EVIDENCE
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-10-20
---

# Site feature catalogue

This concise catalogue traces visitor-facing capabilities to their authoritative requirements. It is not an implementation backlog and does not redefine navigation, contact, evidence, or launch exclusions.

## Direct-contact scope — APPROVED 2026-10-18

[PAGE-CONTACT](pages/contact-and-privacy.md) now uses only native WhatsApp/email/phone links. The prior form/provider/counsel release dependencies and demo-form referral wording are superseded. No embedded intake is needed for this page or the complete redesign.

## APPROVED launch capabilities

| Capability area | Authoritative requirements |
| --- | --- |
| Navigation and localization | [`IA-SITE`](information-architecture.md) |
| Business communication | [`PAGE-HOME`](pages/home.md), [`PAGE-SERVICES`](pages/services.md), [`PAGE-CONTACT`](pages/contact-and-privacy.md) |
| Project evidence | [`PROJECT-EVIDENCE`](project-evidence.md), [`PAGE-PROJECTS`](pages/projects.md) |
| Founder profile | [`PAGE-FOUNDER`](pages/studio-and-founder.md) |
| Direct Contact | [PAGE-CONTACT](pages/contact-and-privacy.md): native WhatsApp, email and phone links with localized Privacy and Founder references. |
| Studio, Founder and legal pages | Delivered by PLAN-SFC-V1 (completed 2026-10-20): Atlas [`PAGE-STUDIO` / `PAGE-FOUNDER`](pages/studio-and-founder.md), Privacy and the new Terms pair (`/terminos/`, `/en/terms/`) in [`PAGE-PRIVACY` / `PAGE-TERMS`](pages/contact-and-privacy.md). |
| Interactive connected graph | Live on both tiers (wide and compact) on Studio, Founder, Contact, Services and Projects ([`DESIGN-SFC-V1`](../design/studio-founder-contact-v1.md)), on the owner's acceptance rather than a measured qualification. Reduced motion, Save-Data, forced colors, denied, software-renderer and context-loss visitors always get the static page. |
| Services in-page navigation | Stable localized fragments and non-sticky service index in [`PAGE-SERVICES`](pages/services.md#stable-service-anchors-approved) |

## PROPOSED launch capabilities

- Project-card capability filters if the inventory becomes large enough; no filter is needed for a small launch set. See [`PAGE-PROJECTS`](pages/projects.md).
- Explicit evidence/disclosure labels on project cards. See [`PROJECT-EVIDENCE`](project-evidence.md).
- Localized canonical, `hreflang`, sitemap, Open Graph, and structured-data metadata. See [`CONTENT-LOCALIZATION`](content-and-localization.md).
- A conceptual-image disclosure where generated imagery is used. See [`PROJECT-EVIDENCE`](project-evidence.md).

## Contact dependency disposition

- Contact is direct communication through native WhatsApp/email/phone links. The prior provider/demo delivery records remain history; no Formspree/counsel readiness or live delivery/deletion gate applies to the current scope.

## Explicit non-features at launch

Catalogue-owned launch non-features are user accounts; client portal; CMS unless later content-maintenance needs justify one; pricing calculator; automated project quotation; and a public team directory.

Automatic locale redirect and a standalone AI marketing page are excluded by [`IA-SITE`](information-architecture.md#launch-exclusions) and its [localization behavior](information-architecture.md#localization-behavior).
