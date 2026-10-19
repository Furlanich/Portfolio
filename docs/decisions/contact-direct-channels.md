---
id: ADR-CONTACT-DIRECT-CHANNELS
type: architecture-decision-record
status: APPROVED
date: 2026-10-18
supersedes:
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - ADR-SFC-COMMERCIAL-ATLAS-V1
related:
  - PLAN-SFC-V1
  - DESIGN-SFC-V1
  - PAGE-CONTACT
  - PAGE-TERMS
last_verified: 2026-10-18
---

# Direct contact channels

## Context and authority

On 2026-10-18 the owner explicitly requested removal of the form from `/contacto/` and `/en/contact/`, retaining email, WhatsApp and the other existing contact options, and updating the plan/documentation so Formspree and counsel decisions are no longer required. This records that accepted scope change; implementation remains subject to ordinary review and human merge.

## Decision

Both Contact pages render native links to the existing WhatsApp, email and phone destinations. They collect no fields, submit no inquiry, simulate no outcomes and require no form client component, endpoint or provider account. Links work without JavaScript and carry no visitor-supplied message or prefill. Opening an external application does not establish delivery.

The existing Atlas introduction, usual response expectation, connected background, opaque Bone contact surface, Privacy reference and Founder bridge remain. Update Privacy to describe direct communications, the actual hosting and graphics preference behavior; remove invitations elsewhere to try a form. Terms continues to cover website use and initial contact, with publication assigned to Task 16.

Task 13 no longer requires authenticated Formspree checks, workflow/domain/spam/quota configuration, provider/subprocessor readiness, live probes, inbox/deletion receipts, a counsel disposition, or a readiness manifest. Mandatory professional legal approval is removed as a repository release gate for this direct-contact scope. This does not decide that receiving personal messages creates no privacy obligations or certify legal sufficiency. Public text must describe facts accurately and preserve a contact route for data questions. Optional professional review remains possible without an agent waiting for it.

## Scope of supersession

- [ADR-CONTACT-INQUIRY-PIPELINE](contact-inquiry-pipeline.md): supersedes the selection of a website inquiry processor and its release dependencies for the current product. Existing pure transport code/tests are dormant historical implementation, outside every public Contact import path. Reintroduction requires a new explicit decision.
- [ADR-CONTACT-INQUIRY-DEMO-MODE](contact-inquiry-demonstration-mode.md): supersedes the requirement to publish a local simulated form and its demonstration-specific disclosures.
- [ADR-SFC-COMMERCIAL-ATLAS-V1](studio-founder-contact-commercial-atlas.md): supersedes form activation, processor/counsel readiness, provider probe and deployed delivery/deletion requirements only. Runtime, static export, Terms routes, nondeployed integration and coordinated release remain governed there and by the amended plan.

Prior ADRs and completed task receipts remain immutable history. Formspree and counsel items are **NOT APPLICABLE**, never fabricated PASS results. Removing the website form changes no existing provider account or received message.

## Consequences and verification

Contact has no form-specific hydration, editing state, submission race or provider failure handling. Direct messages are composed in the chosen external service and handled there. Privacy must not promise that those messages stay only in browser memory or assert an unverified deletion/retention guarantee.

The PR verifies both locales, exact destination links, no form elements or provider traffic, keyboard order/focus, no-JavaScript behavior, narrow/wide reflow, accessibility, root/base-path export, canonical copy equivalence and the full deterministic suite. Task 17 becomes a read-only deployed routes/links/disclosure receipt; it sends no messages or calls. Hardware qualification remains independent.
