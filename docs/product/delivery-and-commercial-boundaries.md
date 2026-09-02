---
id: DELIVERY-BOUNDARIES
type: product-operations
status: PROPOSED
related:
  - HOME-PROCESS
  - PAGE-SERVICES
  - PAGE-CONTACT
last_verified: 2026-09-01
---

# Delivery and commercial boundaries

## Public process — APPROVED

The four public phases are:

1. Understand and diagnose.
2. Define scope.
3. Build and validate incrementally.
4. Implement and provide the agreed continuity.

The exact homepage language is owned by [`HOME-PROCESS`](pages/home.md#home-process).

## Engagement model — PROPOSED

### Qualification and discovery

- A brief first conversation determines fit and whether more analysis is required.
- Small, clear requests may proceed directly to a proposal.
- Complex, uncertain, or existing systems may require a separate paid diagnosis before reliable scope or pricing is possible.

### Proposal

A proposal should define objective, scope, deliverables, exclusions, assumptions, dependencies, timeline, price, payment milestones, change handling, acceptance, and continuity.

### Payment

Proposed default for suitable fixed-scope work:

- 40% to begin;
- 30% with the first functional delivery;
- 30% before production deployment or final handoff.

Larger work may use additional milestones. Maintenance/consulting may use prepaid hours or a recurring arrangement. This model is not approved contractual text.

### Change control

- Work outside accepted scope requires written re-estimation and approval.
- Client delays in content, access, decisions, or feedback may affect schedule.
- Hosting, domains, messaging, payment-provider, and other third-party charges remain separate unless explicitly included.

### Acceptance and deployment

- The client validates agreed workflows in a staging or equivalent review environment before production where the project permits it.
- Deployment follows agreed acceptance and critical checks; it does not imply a zero-defect guarantee.
- Client-owned domains, provider accounts, and credentials are preferred where practical.

### Ownership

Proposed rule: custom deliverables transfer after full payment, while pre-existing reusable material and third-party dependencies retain their respective ownership/licences. This requires legal review and project-specific wording.

### Warranty and continuity

- Proposed defect warranty: 30 calendar days for reproducible defects against accepted scope.
- New features, changed requirements, third-party failures, and misuse are excluded from that proposed warranty.
- Ongoing maintenance is a separate service.
- The public inquiry response commitment is not a production-support SLA.

### Confidentiality

- Public disclosure requires permission and remains limited to approved material.
- Project evidence follows `PROJECT-EVIDENCE`.
- Sensitive access should be limited to what delivery requires.

All contractual language, tax/invoicing implications, warranty, ownership, and liability terms remain subject to appropriate Argentine legal/accounting review.

## Quality boundary — PROPOSED operating standard

A production-ready delivery should have, in proportion to risk:

- agreed acceptance criteria satisfied;
- technical review completed;
- relevant build and automated checks passing;
- primary user journeys tested;
- security and privacy considerations reviewed;
- client validation completed where required;
- deployment, backup, or rollback considerations prepared;
- agreed documentation and access handed over;
- no known critical defect left unresolved without explicit acceptance.

Public quality copy should describe concrete controls rather than claim certification, perfect security, or zero defects.

## AI and confidential information — PROPOSED internal boundary

- Credentials, secrets, and production data are not submitted to general AI tools.
- Synthetic or redacted information is preferred.
- Confidential client code or documents require explicit authorization and an appropriate service configuration before third-party AI processing.
- Generated code and content receive human review.
- AI-generated changes are not deployed autonomously.
- Client-facing AI functionality is disclosed and scoped separately, including its limitations and human oversight.

No public certification or compliance claim is implied.

## Open decisions

- Approve or revise the engagement model.
- Define which first consultations are free versus paid discovery.
- Establish proposal validity and cancellation terms.
- Select invoicing/currency options.
- Complete legal/accounting review.
- Define support tiers and incident SLAs only if the service is offered.
