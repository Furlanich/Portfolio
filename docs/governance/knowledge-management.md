---
id: GOV-KNOWLEDGE
type: governance
status: APPROVED
related:
  - DOCS-INDEX
  - GOV-STATUS
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-02
---

# Knowledge-management policy

## Authority

Repository documentation is the source of truth for approved product requirements, design requirements, business positioning, information architecture, constraints, and unresolved decisions.

Conversation is a working medium for exploration and decision formation. A material decision is not complete until the relevant authoritative document is updated.

The working loop is:

```text
Discuss -> Decide -> Persist -> Continue
```

## Classification rule

All material knowledge must use the four statuses defined in [the documentation index](../index.md). Front matter records the overall governance status of a document; in mixed-status documents, explicit item-level **APPROVED**, **PROPOSED**, **OPEN**, and **REJECTED** markers are authoritative. Polished wording does not imply approval. Existing code does not imply product intent. Research does not imply a requirement.

When a later explicit decision supersedes an earlier one, the current requirement remains in its owning document and a meaningful rejected alternative may be retained in the [status register](status-register.md).

## Ownership and duplication

- Business identity and positioning are owned by `docs/product/vision-and-positioning.md`.
- Audience and service definitions are owned by `docs/product/audiences-and-services.md`.
- Routes and navigation are owned by `docs/product/information-architecture.md`.
- Each page specification owns its section order, content, evidence, CTA, and acceptance criteria.
- Target visual rules are owned by `docs/design/`.
- Current implementation facts are owned by `docs/architecture/`.
- Engineering change classification, RFC/ADR/plan rules, and Pull Request boundaries are owned by `engineering-lifecycle.md`.
- Decision status is summarized, not redefined, in `status-register.md`.

Documents should link to an owning requirement rather than copy it. Exact public copy may be repeated only in the page specification that owns it.

## Change protocol

When discussion materially changes product requirements, page structure, positioning, visual language, interactions, or architectural constraints:

1. Identify the owning document.
2. Record the new status and decision.
3. Preserve a superseded alternative only when it prevents likely future confusion.
4. Update `last_verified`.
5. Check linked page specifications for contradictions.

## Stage boundaries

Stage A established product and design knowledge. Stage B adds a lightweight repository engineering harness while preserving product documentation as an independent source of truth. See the [engineering lifecycle](engineering-lifecycle.md) for implementation governance; it does not redefine product decisions.

## Review standard

Before a knowledge update is considered complete, check:

- a new engineer can understand it without chat history;
- statuses match the evidence of approval;
- documents do not contradict one another;
- stable page and section IDs remain traceable;
- implementation facts are not presented as approved target design;
- unresolved questions remain visible;
- confidential or private material is not copied into public-content specifications.
