---
name: visual-qa
description: Use when a frontend change needs visual verification in a running FURLANICH site, including responsive, interaction, or rendered-content checks.
---

# Visual QA

## Purpose

Provide a repeatable, evidence-based visual check for the FURLANICH Next.js site. Verify intended UI behavior at relevant viewports without treating a screenshot or browser session as proof of product approval.

## Inputs

- The implementation branch and changed routes/components.
- Relevant product and design requirements, including stable IDs and acceptance criteria.
- The expected URL, viewport sizes, states, interactions, and any known limitations.
- A reliable browser or visual inspection tool available in the current environment.

## Procedure

1. Read `AGENTS.md`, the relevant product/design records, and `ARCHITECTURE.md`. Identify the requirement IDs and route(s) under review; preserve any OPEN requirement as OPEN.
2. Inspect the changed files and determine the smallest useful visual test matrix: affected route, normal and boundary content states, keyboard/focus behavior where applicable, and at least one narrow and one wide viewport.
3. Start the existing development server or use an existing preview only when the repository commands and environment support it. For this static-export Next.js application, account for `NEXT_PUBLIC_BASE_PATH` and verify the served path rather than assuming `/`.
4. Use the reliably available browser/visual tool to load the intended route. Exercise only the interactions in scope: navigation, form fields, validation, menus, responsive transitions, and links as applicable.
5. Inspect each selected viewport for layout integrity, readable hierarchy, clipping/overflow, image and asset loading, visible focus, contrast-impacting states, and console/runtime errors that the tool exposes.
6. Compare observations with the authoritative requirements and design guidance. Record deviations as findings; do not silently reinterpret product decisions or invent missing design behavior.
7. Capture screenshots or other evidence only when the tool actually provides it. Never claim that a screenshot, viewport, browser, or interaction was checked if it was unavailable or failed.
8. Stop the local server or clean up temporary resources when the environment requires it. Do not commit generated output, screenshots, secrets, or local environment files unless the task explicitly scopes them.

## Expected outputs

Return a concise QA record containing:

- routes, viewport dimensions, states, and interactions actually checked;
- tool/environment and base-path limitations;
- evidence paths or links only for evidence that exists;
- pass/fail findings tied to requirement or design IDs where available;
- unresolved questions kept explicitly OPEN;
- a recommendation: ready for PR, needs fixes, or blocked by environment/missing authority.

## Validation

- Confirm the browser reached the intended route and that each claimed interaction produced an observable result.
- Recheck any failure once after distinguishing an application defect from a startup, routing, or tool limitation.
- Run the repository's relevant deterministic checks separately; visual QA does not replace `npm run docs:check`, `npm test`, lint, typecheck, or build.
- Ensure no generated or unrelated files are left in the worktree.

## Failure and escalation

- If the browser or visual tool is unavailable, cannot reach the server, or cannot provide the requested viewport/evidence, report that limitation and mark the relevant check unverified; do not fabricate results.
- If a failure is reproducible and within the approved scope, report the exact route, viewport, state, reproduction steps, and evidence. Do not implement a fix unless the task authorizes implementation.
- Escalate missing or contradictory product/design decisions through the repository governance path, preserving them as OPEN. Escalate security, privacy, accessibility, or release-blocking findings to the human reviewer.
