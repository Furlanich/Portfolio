---
id: LEGAL-PROTOTYPE-POSTURE
type: legal-readiness-record
status: APPROVED
related:
  - PAGE-LEGAL
  - PAGE-PRIVACY
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - CONTENT-LOCALIZATION
  - RELEASE-READINESS
last_verified: 2026-09-14
---

# Prototype legal posture

## Purpose and limitation

This record makes polished legal-style copy traceable. It distinguishes observed facts, approved explanatory product copy, future production placeholders, and matters that require professional review. No wording in this repository is evidence of certification, regulatory approval, or legal advice.

## Readiness states — APPROVED

- `PROTOTYPE_COPY_APPROVED`: exact bilingual copy is approved as product content for the observed public demonstration. It is not professional legal approval.
- `DEMO_READY`: every demonstration gate in `RELEASE-READINESS` has fresh evidence for the exact release candidate.
- `COMMERCIAL_BLOCKED`: the site must not present itself as an operational intake or contracting system because one or more commercial facts or controls are missing.
- `LEGAL_REVIEW_REQUIRED`: qualified Argentine legal/privacy review has not approved the commercial identity, processing, disclosures, rights handling, and contract terms.

Current decision status is `PROTOTYPE_COPY_APPROVED`, `COMMERCIAL_BLOCKED`, and `LEGAL_REVIEW_REQUIRED`. `DEMO_READY` is assigned only after the approved copy is implemented and the complete demonstration checklist passes; this documentation change does not assign it.

Avoid the unqualified statuses `production-ready`, `compliant`, `legally approved`, and `launch-ready`.

## Public verified facts

| Datum | Classification | Evidence boundary | Public treatment |
| --- | --- | --- | --- |
| FURLANICH | VERIFIED FACT | Approved brand/product records and deployed site | May be stated as the public studio name. |
| Samuel Furlanich | VERIFIED FACT | Approved founder records and deployed site | May be identified as founder and directly accountable technical lead. |
| Buenos Aires, Argentina | VERIFIED FACT | Approved Contact/Studio records and deployed footer | May be stated as location. |
| `samuelfurlanich@gmail.com` | VERIFIED FACT | `PAGE-CONTACT`, source, and deployed links | May be published as the current contact channel. |
| `+54 9 11 5011-7565` / WhatsApp | VERIFIED FACT | `PAGE-CONTACT`, source, and deployed links | May be published as a direct external channel. |
| `https://furlanich.github.io/Portfolio/` | VERIFIED FACT | `gh-pages` deployment and accepted hosting record | May be identified as the GitHub Pages project deployment. |
| Contact form is a local simulation | VERIFIED FACT | Deployed HTML and application chunk; `ADR-CONTACT-INQUIRY-DEMO-MODE` | Must say no form values are sent or stored and no inbox receives them. |
| Direct-channel links do not copy form values | VERIFIED FACT | Deployed link targets and Contact source | Must say the visitor chooses what to communicate after opening the external service. |
| No intentional application cookies, browser storage, analytics, advertising identifiers, or inquiry analytics | VERIFIED FACT for the audited release | Source and shipped-chunk audit on 2026-09-14 | Use application-scoped wording; do not make a universal claim about GitHub or external destinations. |
| GitHub Pages processes ordinary hosting metadata, including visitor IP addresses for security | VERIFIED FACT about the host | Current GitHub Pages documentation | Attribute the processing to GitHub and link its current privacy information. |

## Generated explanatory copy

The exact Privacy and Legal Notice wording is `GENERATED EXPLANATORY COPY` with status `PROTOTYPE_COPY_APPROVED`. It translates the facts above into readable public content. It has not been drafted, certified, or approved by a lawyer and must not be reused as commercial policy without fresh fact verification and professional review.

The marker `Seguimos creciendo` / `Building what comes next` is marketing language. `Versión demostrativa` / `Demonstration version` is the factual status label. Neither is a corporate, tax, regulatory, or compliance claim.

## Production placeholders — hidden

Every item below is `OPEN — REQUIRED BEFORE COMMERCIAL RELEASE` and must remain non-public until a real value exists and professional review approves its treatment:

- incorporated or other formal legal/business identity;
- CUIT and tax/invoicing information;
- formal legal domicile;
- controller/responsible-party identity and any required database registration;
- final purposes, legal basis, consent treatment, and rights procedure;
- real inquiry processor and verified material subprocessors;
- mailbox and delivery-provider facts;
- provider, mailbox, log, backup, retention, and deletion evidence;
- international processing and transfer analysis/safeguards;
- commercial proposal and contracting terms;
- consumer-law applicability;
- final jurisdiction and dispute terms;
- insurance, certifications, registrations, or professional reviewer identity;
- production domain and configuration if different from the approved GitHub Pages project site;
- analytics/cookie behavior and consent if later introduced;
- operational security, monitoring, incident, and request-handling ownership.

Do not insert fictional examples into public copy. Internal templates use bracketed requirements rather than plausible-looking names, numbers, addresses, dates, or reviewer details.

## Contact-data conflict resolved

The request to describe a Formspree request, test-inbox delivery, or automatic copying to WhatsApp/email/phone is not adopted as a current fact. The deployed release and completed Contact plan prove the opposite. A value cannot remain only in browser memory if it is also transmitted to Formspree or an inbox.

`ADR-CONTACT-INQUIRY-PIPELINE` preserves a future Formspree transport boundary, but activating it would change the deployed privacy posture and supersede the current demonstration mode through a separately reviewed decision and execution plan. A test inbox would still process personal data and cannot be treated as a zero-transmission or browser-memory-only demonstration.

## Argentine legal research boundary

Research performed on 2026-09-14 used current authoritative Argentine government and AAIP sources only:

- [Law 25.326, updated text](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion): Article 6 requires clear prior information about purpose, recipients, the responsible party where applicable, response consequences, and access/rectification/suppression rights; Articles 9 and 10 address security and confidentiality; Articles 14 and 16 address access and rectification/update/suppression; Article 12 addresses international transfers.
- [Regulatory Decree 1558/2001, updated text](https://www.argentina.gob.ar/normativa/nacional/70368/actualizacion): complements the statutory framework, including transfer and rights procedures.
- [AAIP guidance on personal-data rights](https://www.argentina.gob.ar/aaip/datospersonales/derechos): explains information, access, rectification, update, and suppression rights and clear notice/consent expectations.
- [AAIP recommended security measures](https://www.argentina.gob.ar/node/98347): records the authority's recommended confidentiality and integrity measures across collection through destruction.
- [AAIP personal-database registration process](https://www.argentina.gob.ar/node/165328): registration applicability must be determined for the real responsible party and data operation; this prototype does not decide it.

The repository recognizes these topics as future review inputs; it does not conclude that the prototype or any generated copy is legally compliant. Professional Argentine legal/privacy review remains mandatory before commercial release.

## Decision matrix

| Area | Public prototype | Production fact | Legal review | Status |
| --- | --- | --- | --- | --- |
| Privacy | Exact bilingual factual demonstration policy | Current zero-transmission behavior is verified | Required before real processing | `PROTOTYPE_COPY_APPROVED` |
| Legal Notice | Exact bilingual prototype notice | Identity/location/contact/host facts are verified | Required before commercial use | `PROTOTYPE_COPY_APPROVED` |
| Contact data flow | Local validation and simulation; no submission | Deployed zero-transmission flow is verified | Required before changing the flow | `PROTOTYPE_COPY_APPROVED` |
| Cookies/analytics | Application-scoped no-intent statement | Audited source and shipped chunks show none | Re-review if behavior changes | `PROTOTYPE_COPY_APPROVED` |
| IP notice | Bounded original/third-party wording | Public links and materials remain separately governed | Commercial terms need review | `PROTOTYPE_COPY_APPROVED` |
| External services | GitHub, LinkedIn, WhatsApp, email/phone apps, and project destinations identified | Links are external and independently governed | Processor analysis required only if they later receive data on FURLANICH's behalf | `PROTOTYPE_COPY_APPROVED` |
| Terms | No public commercial Terms | No online transaction or automatic contract exists | Required before commercial contracting | `COMMERCIAL_BLOCKED` |
| Demo release | Legal/privacy gates are fully defined | Current implementation lacks the approved Legal Notice | Copy is not legal approval | `DEMO_READY` not yet assigned |
| Commercial release | Hidden future templates only | Required identity, processing, retention, and contract facts are missing | Mandatory | `COMMERCIAL_BLOCKED` / `LEGAL_REVIEW_REQUIRED` |
