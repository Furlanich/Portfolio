---
id: SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
type: implementation-design
status: APPROVED
related:
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-08
---

# Frontend and testing capability hardening design

## Objective and boundary

Create a professional, reproducible frontend engineering workflow before Studio and Founder implementation begins. The change adds repository-owned design and process guidance, Playwright browser testing, automated accessibility checks, visual-QA evidence practices, and dedicated CI coverage while preserving the existing deterministic Node tests and static-export verification.

This is infrastructure and agent-capability work. It must not implement or redesign Studio, Founder, or any other public product experience. `main` remains human-controlled and the work stops at an open Pull Request.

## Governance classification

Route: **versioned execution plan**.

The requested dependency, testing, documentation, Skill, and CI changes are substantial and multi-file, but they do not change the accepted application architecture. They preserve `ADR-STATIC-LOCALIZED-ROUTING`, static export, Spanish-root and English-`/en/` routes, trailing slashes, and optional `NEXT_PUBLIC_BASE_PATH`. No RFC or new ADR is required.

## Existing capability audit

The repository already provides:

- four project Skills under `.agents/skills/`: `architecture-governance`, `project-knowledge-maintenance`, `visual-qa`, and `pr-readiness`;
- 50 lightweight Node tests for route maps, localized content contracts, public-project invariants, component/source structure, and documentation validation;
- `verify:static-export` for generated route, language, content, asset, and base-path invariants;
- `docs:check`, lint, explicit TypeScript checking, production build, and a composed `validate` command;
- one read-only GitHub Actions Quality job and the separate GitHub Pages deployment workflow;
- authoritative product/design records, including `DESIGN-VISUAL`, `DESIGN-IX-A11Y`, and `ADR-STATIC-LOCALIZED-ROUTING`;
- browser control available to Codex at runtime, but no repository-installed repeatable browser test harness.

The change extends these capabilities. It must not add Cypress, a second unit-test framework, an alternate documentation validator, a runtime localization package, a UI framework, or GitHub Agentic Workflows.

## Repository-owned Skills

All portable executable Skills live at `.agents/skills/<skill-name>/SKILL.md`.

### Taste v1

Vendor `design-taste-frontend-v1` unchanged from `Leonxlnx/taste-skill` at commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`. The source is MIT licensed and upstream preserves v1 under `skills/taste-skill-v1/` while describing v2 as experimental. Project-local installation is required even when a global copy exists.

Taste is critique and implementation guidance, not product authority. Its precedence is:

```text
Approved FURLANICH product requirements
        ↓
Approved FURLANICH design specifications
        ↓
Accepted architecture
        ↓
Taste Skill
        ↓
Agent aesthetic judgment
```

When Taste conflicts with approved palette, typography, spacing, content hierarchy, accessibility, motion, or business positioning, repository design wins. This boundary belongs in project guidance rather than as an edit to the vendored upstream Skill.

### Superpowers process Skills

Vendor the authoritative Superpowers v6.3.0 forms of:

- `test-driven-development`, including its directly referenced test-quality guidance;
- `systematic-debugging`, including its directly referenced investigation techniques;
- `verification-before-completion`.

Source: `obra/superpowers`, annotated tag `v6.3.0` (`86babb696875227929e85420f287d6309374b93f`), peeled content commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`, MIT license. Preserve upstream content and record file hashes so local drift is detectable.

`requesting-code-review` and `receiving-code-review` are evaluated but not vendored in this change. They are useful generic collaboration procedures, but the repository already owns final acceptance, complete-diff review, and human-review boundaries in `pr-readiness`; adding more review Skills is not necessary to establish the requested frontend baseline. Future work may add them if repeated review failures demonstrate a distinct need.

### Project-specific Skills

Create `frontend-implementation` for implementing or substantially modifying public FURLANICH UI. It routes agents through authoritative requirements and design, Taste preflight, test selection, TDD, static/localized architecture preservation, focused validation, Playwright QA, accessibility checks, Taste post-audit, deterministic validation, and `pr-readiness`. It references dedicated Skills instead of duplicating their procedures.

Create `playwright-qa` for browser-level validation. It defines project-specific server startup, base-path handling, route selection, functional and responsive projects, keyboard and console checks, axe policy, screenshot/trace evidence, and cleanup while referencing repository scripts instead of reproducing the Playwright API.

Update `visual-qa` so Playwright is the preferred repeatable browser harness where available. Preserve the distinction:

```text
Playwright QA = repeatable browser behavior and automated checks
Visual QA     = human or agent visual judgment against approved design
```

Neither replaces the other.

## Skill validation

Every new or modified project Skill must have:

- a lowercase hyphenated directory matching its `name`;
- a concise third-person description beginning with `Use when` and describing triggering conditions, not the workflow;
- explicit triggering and non-triggering scenarios;
- an overlap/boundary review against existing Skills;
- repository documentation validation and the bundled Skill quick validator;
- an observable exercise where the task permits it.

Vendored Skill integrity is deterministic: a repository script verifies declared source, revision, license, local path, and SHA-256 hashes. Project-specific discovery and boundary scenarios are documented and manually reviewed because they test agent judgment rather than stable source wording.

Taste must be exercised against the existing Spanish homepage as an audit only. The resulting record must demonstrate discovery of `DESIGN-VISUAL` and `DESIGN-IX-A11Y`, useful critique, and explicit deference wherever Taste defaults conflict with repository authority. No route redesign follows from the audit.

## TDD policy

TDD is the default for behavior-changing implementation when a practical automated test can define the behavior:

```text
RED      write a focused failing test and observe the intended failure
GREEN    implement the minimum behavior and observe the focused test pass
REFACTOR improve structure without adding behavior and rerun tests
```

Implementation Pull Requests record meaningful red/green evidence. Exceptions are explicit and limited to pure documentation, generated files, unavoidable configuration, and purely visual details unsuitable for stable automation. Tests written after practical behavior implementation do not satisfy this policy.

This capability change itself uses TDD for new executable validation and browser behavior. Configuration, documentation, and unchanged upstream vendoring use their applicable deterministic validation instead.

## Test-layer architecture

### Layer 1: Node unit and contract tests

Keep `npm test` fast and deterministic for route maps, static content contracts, project/content invariants, pure utilities, build-time rules, documentation validators, and vendored-Skill integrity.

### Layer 2: Playwright browser tests

Use Playwright for navigation, localized routes, links, responsive behavior, native menu disclosure, CV reachability, visible interactions, keyboard behavior, console errors, and semantic page structure.

The web server uses the existing Next development server for fast local feedback. Playwright receives a repository-local origin and optional `NEXT_PUBLIC_BASE_PATH`; route helpers prevent tests from assuming `/`. Static artifact behavior remains covered separately by production build plus `verify:static-export`.

### Layer 3: automated accessibility

Use `@axe-core/playwright` on representative stable routes. Fail on automatically detectable critical or serious violations and also verify one visible H1 where required, primary navigation and language switch reachability, and logical focus progression through key actions.

Automated scanning does not establish WCAG conformance and does not replace manual semantic, keyboard, reflow, focus, contrast, or assistive-technology review.

### Layer 4: visual verification

Use browser screenshots and manual inspection for layout, typography hierarchy, responsive composition, overflow, clipping, images, and visual states. Screenshot-on-failure evidence is routine; committed visual snapshots are selective and require approved deterministic baselines.

## Playwright configuration

Pin the current stable `@playwright/test` and `@axe-core/playwright` development dependencies through `package-lock.json`. Configure:

- repository-local base URL and reliable `webServer` startup;
- CI-safe timeouts, `forbidOnly`, CI-only retries, and conservative workers;
- trace on first retry, screenshot on failure, video retained on failure, and HTML reporting;
- generated reports, results, traces, videos, and local screenshots excluded from Git;
- functional desktop smoke on Chromium, Firefox, and WebKit;
- responsive coverage at approximately 390px Mobile Chromium, a representative Mobile Safari/WebKit profile, 1024px Chromium, and 1440px Chromium;
- accessibility scans in deterministic Chromium rather than across every engine.

Test files live in `tests/e2e/` and cover only currently implemented, approved behavior: Spanish and English homepages, language equivalence, Services, Projects, Founder, primary navigation destinations, mobile disclosure behavior, and representative accessibility baselines. Studio is excluded because its approved implementation is not yet present.

## Package scripts and static export

Keep `npm test` unchanged as the Node layer. Add clear commands for all browser tests, UI mode, headed mode, accessibility-only checks, Skill validation, and composed frontend verification. Preserve `verify:static-export` as an independent gate and ensure the production build runs before it.

The full repository validation remains deterministic and reviewable. Browser execution may be a separate command and CI job so fast contract failures remain distinguishable from browser/environment failures.

## CI design

Extend the stable Quality workflow with a dedicated browser job that:

1. checks out the repository;
2. installs locked Node dependencies;
3. installs the required Playwright browsers and Linux dependencies;
4. runs the Playwright suite with the repository-name base path;
5. uploads Playwright artifacts only on failure;
6. fails on test failure.

Keep the existing deterministic `validate` job separate. Do not update screenshots automatically, grant write permissions, or introduce GitHub Agentic Workflows.

## Documentation and routing

Create concise documents at:

- `docs/testing/strategy.md` for layer selection and TDD policy;
- `docs/testing/playwright.md` for commands, projects, base paths, CI, and artifacts;
- `docs/testing/visual-regression.md` for intentional snapshot policy;
- `docs/superpowers/README.md` for local Skills, provenance, and artifact locations.

Create `docs/superpowers/specs/` and `docs/superpowers/plans/` only because this change produces actual artifacts there. Keep `AGENTS.md` as a short router to design authority, frontend implementation, TDD, Playwright QA, visual QA, testing docs, and `pr-readiness`.

## Visual-regression policy

Do not snapshot every page. Establish baselines only for stable, important UI after human design approval. Run pixel-sensitive assertions on one deterministic Chromium environment; use Firefox and WebKit for functional and layout smoke. Never update baselines merely to make CI green. Review expected, actual, and diff images in Playwright tooling before accepting a change.

## Verification and completion

Fresh final evidence must cover:

- existing Node tests;
- vendored and project Skill validation;
- Playwright baseline tests;
- accessibility baseline;
- lint;
- typecheck;
- production build;
- static-export verification with ordinary and `/Portfolio` base-path expectations as applicable;
- documentation checks;
- `git diff --check`;
- complete branch diff and `pr-readiness` review.

Generated browser reports and traces remain uncommitted. The Pull Request documents exact dependency and Skill revisions, TDD enforcement, browser matrix, accessibility limits, CI checks, documentation, command results, and explicit exclusion of Studio/Founder implementation and experimental GitHub Agentic Workflows. It remains open for human review and is not merged.
