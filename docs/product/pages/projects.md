---
id: PAGE-PROJECTS
type: page-spec
status: PROPOSED
related:
  - PAGE-PROJECT-DETAIL
  - PROJECT-EVIDENCE
  - PAGE-CONTACT
last_verified: 2026-09-04
---

# Projects and project-detail pages

## PAGE-PROJECTS responsibility — APPROVED

Present selected evidence for prospective clients. The page must make maturity and disclosure boundaries understandable and must not behave like a recruiter-oriented technology portfolio.

Preferred page language is `Proyectos seleccionados`, not `Casos de éxito`, until verified outcomes support the stronger claim.

## Proposed hierarchy

1. Introduction explaining evidence transparency.
2. Selected production solutions.
3. FURLANICH Laboratory work.
4. Functional prototypes.
5. Confidentiality and publication note.
6. Inquiry CTA.

The evidence model, publication lifecycle, card hierarchy, and editorial integrity rules are approved in `PROJECT-EVIDENCE`. Public category labels, exact grouping, item-level permissions, and project selection remain unresolved.

## Card requirements

- maturity/disclosure signal;
- operating context or sector;
- outcome-oriented title;
- short problem or delivered-value summary;
- business capability tags before technology tags;
- evidence signal;
- relevant CTA.

Cards with no permitted detail content should link to `PAGE-CONTACT`, not an empty project page.

## PAGE-PROJECT-DETAIL responsibility — APPROVED

Explain a real project or demonstration deeply enough to establish relevance without exceeding permission.

## Detail content — PROPOSED

- evidence type and status;
- context and intended users;
- business problem;
- Samuel/FURLANICH role;
- delivered scope;
- approach and meaningful trade-offs;
- demonstrated or verified result;
- current status and limitations;
- technology only where permitted and useful;
- live, repository, or demo links where valid;
- disclosure note;
- `¿Necesitás resolver algo parecido?` CTA.

## Visual requirements

- Client UI is shown only with explicit permission.
- Restricted projects use neutral branded visuals rather than fabricated UI.
- Laboratory and prototype imagery states whether it is real, conceptual, or generated.
- Logos require permission and placeholders never ship.

## Open decisions

- Item-level classifications and permissions.
- Whether filters are useful at launch; omit them if the inventory remains small.
- Exact homepage/project-index selection.
- Which records deserve detail pages.

`HOME-PROOF` does not depend on this page for its approved launch fallback. No Projects-route CTA may appear on the homepage until both localized Projects destinations are implemented with useful, publication-ready evidence.

## Acceptance criteria

- No project can be mistaken for a more mature or public engagement than it is.
- Every metric has a source and permission.
- Every public link is verified before release.
- Technology is secondary to the business story.
- Confidential projects reveal no forbidden identity, UI, workflow, data, or implementation detail.
