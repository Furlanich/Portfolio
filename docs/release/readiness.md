---
id: RELEASE-READINESS
type: release-readiness-policy
status: APPROVED
related:
  - LEGAL-PROTOTYPE-POSTURE
  - PAGE-LEGAL
  - PAGE-PRIVACY
  - IA-SITE
  - TEST-STRATEGY
  - TEST-PLAYWRIGHT
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-CONTACT-INQUIRY-PIPELINE
last_verified: 2026-09-14
---

# Privacy, legal, and release readiness

## State model

`DEMO_READY` and `COMMERCIAL_BLOCKED` are deliberately independent. Passing a demonstration gate never supplies a missing legal identity, processor fact, retention operation, contract, or professional opinion.

Current Initiative 7 state:

- `PROTOTYPE_COPY_APPROVED`
- `DEMO_READY` — **not yet assigned; implementation and fresh release evidence remain**
- `COMMERCIAL_BLOCKED`
- `LEGAL_REVIEW_REQUIRED`

## DEMO RELEASE READINESS

Assign `DEMO_READY` only when every required gate below is checked against the same release candidate and evidence is recorded in its versioned execution plan or release PR.

- [ ] Every approved Spanish and English route returns the intended static artifact; no broken internal route exists.
- [ ] `/privacidad/` and `/en/privacy/` render the exact current `PAGE-PRIVACY` copy and describe actual deployed behavior.
- [ ] `/aviso-legal/` and `/en/legal/` render the exact current `PAGE-LEGAL` copy and demonstration limitation.
- [ ] Contact remains the accepted zero-transmission demonstration: no form value reaches fetch, XHR, beacon, navigation, URL, storage, log, analytics, Formspree, Gmail, or an inbox.
- [ ] WhatsApp, email, phone, GitHub, LinkedIn, GitHub Privacy, and approved project/repository destinations are verified; Contact form values are not copied automatically.
- [ ] Project maturity, confidentiality, evidence, ownership, and generated-visual boundaries remain intact.
- [ ] The application sets no intentional cookie, localStorage, sessionStorage, analytics identifier, advertising identifier, or inquiry-analytics event; shipped assets and browser behavior are re-audited.
- [ ] Repository, build configuration, generated static artifacts, and browser traffic contain no secrets or personal inquiry fixture data.
- [ ] Spanish/English route equivalence and language switching work for Privacy and Legal Notice.
- [ ] Footer links to localized Privacy and Legal Notice on every supported page; primary navigation remains uncluttered.
- [ ] Root and `NEXT_PUBLIC_BASE_PATH=/Portfolio` builds and static-artifact verification pass, including trailing slashes and assets.
- [ ] `npm run docs:check`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass freshly; `npm run validate` may compose the deterministic gate.
- [ ] Playwright passes the relevant Chromium, Firefox, WebKit, mobile, tablet, wide, and JavaScript-disabled cases.
- [ ] Representative axe checks report no configured critical or serious violations; no whole-site WCAG conformance claim is made.
- [ ] Manual responsive/visual review covers 320×800, approximately 390×844, 768×1024, 1024×768, and 1440×900, plus 200% zoom, keyboard, focus, text selection/copy, print readability, and no horizontal overflow.
- [ ] No critical page or console error appears on representative routes and interactions.
- [ ] The localized Not Found experience restores useful navigation and works under both root and `/Portfolio` exports.
- [ ] Favicon and basic localized metadata are present; manifest is checked only if it is within the approved implementation scope, and its absence is not disguised.
- [ ] The deployed GitHub Pages release matches the reviewed commit and the canonical project URL is verified.
- [ ] The release PR records `PROTOTYPE_COPY_APPROVED`, the genuine September 2026 revision, known limits, rollback, and human review.

The existing deployed Contact/Privacy implementation supplies useful prior evidence but does not complete this checklist for the later Legal/Privacy release candidate. In particular, the Legal Notice routes/footer links are absent and the currently deployed 404 artifact is the generic Next.js response.

## COMMERCIAL RELEASE READINESS

Every item remains `OPEN — REQUIRED BEFORE COMMERCIAL RELEASE` unless a later evidence record and professional review explicitly close it.

- [ ] Real legal/business identity, CUIT/tax/invoicing facts, and legal domicile are established and approved for publication where required.
- [ ] Consumer-law, registration, responsible-party/controller, and database obligations are determined for the actual operation.
- [ ] The real inquiry processor, account owner, plan, endpoint/domain restrictions, abuse controls, material subprocessors, email provider, and authorized recipients are verified.
- [ ] The complete production data flow, purposes, fields, metadata, recipients, processing locations, international transfers, and safeguards are documented.
- [ ] Provider, mailbox, log, backup, retention, deletion, access, and rights-request operations have named owners and repeatable proof.
- [ ] Staging and production probes prove provider acceptance, field integrity, inbox delivery, sender/Reply-To behavior, failure handling, and deletion without exposing real prospect data.
- [ ] Final bilingual Privacy wording matches the deployed system and receives professional Argentine legal/privacy review.
- [ ] Access, rectification/update, suppression, identity-verification, escalation, and lawful-retention procedures are operational.
- [ ] Security/confidentiality controls, secret handling, provider oversight, incident response, and operational monitoring are implemented and evidenced.
- [ ] Final proposals/contracts or any public commercial Terms are based on real operations and receive legal/accounting review; no placeholder percentages, warranty periods, liability positions, or jurisdiction clauses are promoted as binding.
- [ ] Production domain, hosting, deployment, metadata, monitoring, and rollback are verified if they differ from the demonstration.
- [ ] Any introduced analytics, cookies, advertising, CRM, enrichment, CAPTCHA, or challenge technology receives separate privacy, consent, accessibility, and governance review before activation.
- [ ] The commercial activation has a human-reviewed decision record and versioned execution plan that expressly replaces the demonstration boundary.

Until every applicable gate passes, status remains `COMMERCIAL_BLOCKED` and `LEGAL_REVIEW_REQUIRED`.

## Implementation governance

The approved `/aviso-legal/` ↔ `/en/legal/` route pair, revised Privacy content, footer links, and release validation reuse `ADR-STATIC-LOCALIZED-ROUTING` and the current design/test system. They change no hosting, runtime dependency, backend, processor, authentication, or localization architecture.

Implementation is substantial and cross-cutting, so it requires a versioned execution plan. It does not require a new RFC or ADR. A later activation of Formspree or any other real inquiry processor would change a security/privacy-sensitive accepted boundary and requires separate governance review before its implementation plan.
