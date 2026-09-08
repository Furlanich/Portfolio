---
id: PLAN-FRONTEND-TESTING-CAPABILITY-HARDENING
type: execution-plan
status: APPROVED
plan_status: ACTIVE
related:
  - SPEC-FRONTEND-TESTING-CAPABILITY-HARDENING
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ADR-STATIC-LOCALIZED-ROUTING
  - GOV-ENGINEERING-LIFECYCLE
last_verified: 2026-09-08
---

# Frontend and Testing Capability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reproducible, repository-owned frontend engineering and browser-testing workflow without changing Studio, Founder, or other public product behavior.

**Architecture:** Preserve the existing Node contract-test and static-export layers, add Playwright as a separate browser layer, and keep human visual judgment distinct from automated behavior and accessibility checks. Vendor only pinned process Skills that establish the required workflow, then route FURLANICH-specific UI work through concise project Skills and documentation.

**Tech Stack:** Next.js 16 static export, React 18, TypeScript, Node test runner, Playwright Test 1.62.1, `@axe-core/playwright` 4.13.0, GitHub Actions, repository-local Agent Skills.

**Spec:** `docs/superpowers/specs/2026-09-08-frontend-testing-capability-hardening-design.md`

## Global Constraints

- Continue from `main` commit `31a88ddd7e9ea7830ee594d200d1bf434a4d8cfa` on `codex/frontend-testing-capability-hardening`.
- Do not implement or redesign Studio, Founder, or any public application route/component/content.
- Preserve `ADR-STATIC-LOCALIZED-ROUTING`, static export, trailing slashes, Spanish-root routes, English `/en/` routes, and `NEXT_PUBLIC_BASE_PATH`.
- Keep `npm test`, Playwright E2E, accessibility scans, and static-export verification distinguishable.
- Use RED-GREEN-REFACTOR for executable behavior; record observed RED and GREEN commands.
- Treat pure documentation, unavoidable configuration, generated lockfile data, and unchanged upstream vendoring as explicit TDD exceptions while still validating them.
- Keep `AGENTS.md` a router; keep detailed procedures in Skills and `docs/testing/`.
- Never update visual snapshots automatically or merely to make CI green.
- Use stable GitHub Actions only; do not use GitHub Agentic Workflows.
- Stop at an open human-review Pull Request; do not merge.

---

### Task 1: Add pinned vendored-Skill integrity validation

**Files:**

- Create: `scripts/validate-vendored-skills.mjs`
- Create: `scripts/validate-vendored-skills.test.mjs`
- Create: `.agents/skills/vendor-lock.json`
- Modify: `package.json`

**Interfaces:**

- Consumes: repository root and `.agents/skills/vendor-lock.json` entries containing `name`, `source`, `revision`, `license`, `path`, and `sha256`.
- Produces: `validateVendoredSkills(rootDir): Promise<string[]>` and the `npm run skills:check` command.

- [x] **Step 1: Write the failing validator tests**

Create temporary fixtures with Node built-ins. Import the not-yet-created validator and assert that a matching file passes while missing files, malformed SHA-256 values, content drift, non-commit revisions, and non-project-local paths fail:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateVendoredSkills } from './validate-vendored-skills.mjs';

test('accepts pinned project-local vendored skills with matching hashes', async () => {
  const root = await createFixture();
  assert.deepEqual(await validateVendoredSkills(root), []);
});

test('reports missing files and provenance or integrity drift', async () => {
  const root = await createBrokenFixture();
  const failures = await validateVendoredSkills(root);
  assert.match(failures.join('\n'), /missing vendored file/i);
  assert.match(failures.join('\n'), /revision/i);
  assert.match(failures.join('\n'), /sha-256|hash mismatch/i);
  assert.match(failures.join('\n'), /project-local/i);
});
```

- [x] **Step 2: Verify RED**

Run `node --test scripts/validate-vendored-skills.test.mjs` and require failure with `ERR_MODULE_NOT_FOUND` for `validate-vendored-skills.mjs`.

- [x] **Step 3: Implement the minimum validator**

Use `node:fs/promises`, `node:path`, and `node:crypto`. Read the lock, validate required fields, require a 40-character lowercase Git commit, require `.agents/skills/` paths, hash each declared file, and return sorted human-readable failures. When invoked directly, print the number of verified files and exit nonzero on any failure.

- [x] **Step 4: Verify GREEN**

Run `node --test scripts/validate-vendored-skills.test.mjs` and require all focused tests to pass.

- [x] **Step 5: Add the package command**

Add `"skills:check": "node scripts/validate-vendored-skills.mjs"` without changing `npm test`.

- [x] **Step 6: Commit the validator cycle**

Run `npm test`, `npm run docs:check`, and `git diff --check`; record RED/GREEN evidence in this plan and commit as `test: add vendored skill integrity check`.

### Task 2: Install and pin Taste and minimal Superpowers Skills

**Files:**

- Create: `.agents/skills/design-taste-frontend-v1/SKILL.md`
- Create: `.agents/skills/test-driven-development/SKILL.md`
- Create: `.agents/skills/test-driven-development/writing-good-tests.md`
- Create: `.agents/skills/systematic-debugging/SKILL.md`
- Create: `.agents/skills/systematic-debugging/root-cause-tracing.md`
- Create: `.agents/skills/systematic-debugging/defense-in-depth.md`
- Create: `.agents/skills/systematic-debugging/condition-based-waiting.md`
- Create: `.agents/skills/verification-before-completion/SKILL.md`
- Modify: `.agents/skills/vendor-lock.json`

**Interfaces:**

- Consumes: Taste commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37` and Superpowers v6.3.0 peeled content commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (annotated tag object `86babb696875227929e85420f287d6309374b93f`).
- Produces: unchanged repository-local Skill sources plus deterministic provenance/hashes.

- [x] **Step 1: Verify source and installer behavior**

Confirm Taste's authoritative v1 path and MIT license at the pinned revision. Inspect `npx skills add --help` and use its documented repository-local destination when it can install the pinned v1 into `.agents/skills`; otherwise mechanically copy the exact pinned file and record why.

- [x] **Step 2: Install Taste v1 project-locally**

Install only `design-taste-frontend-v1`. Verify the installed frontmatter name and compare the complete file with `skills/taste-skill-v1/SKILL.md` at the pinned revision. Do not install or alias experimental v2.

- [x] **Step 3: Export the minimum Superpowers set**

Mechanically copy the three upstream v6.3.0 Skills and only their directly referenced guidance files from the installed OpenAI Superpowers source. Do not alter upstream wording.

- [x] **Step 4: Lock provenance and file hashes**

Populate `vendor-lock.json` with exact repositories, commits, MIT license, local paths, and SHA-256 values for every vendored file.

- [x] **Step 5: Validate unchanged vendoring**

Run `npm run skills:check`, the bundled `quick_validate.py` against each Skill folder, `npm run docs:check`, and `git diff --check`.

- [x] **Step 6: Commit vendored Skills**

Commit as `docs: vendor pinned frontend process skills`.

### Task 3: Add and validate the frontend implementation Skill

**Files:**

- Create: `.agents/skills/frontend-implementation/SKILL.md`
- Create: `docs/testing/skill-validation.md`
- Modify: `docs/testing/skill-validation.md` during RED/GREEN recording

**Interfaces:**

- Consumes: approved product requirements, `DESIGN-VISUAL`, `DESIGN-IX-A11Y`, applicable architecture/ADR, Taste, TDD, Playwright QA, visual QA, and `pr-readiness`.
- Produces: one concise public-UI implementation router with an explicit authority boundary.

- [ ] **Step 1: Record RED from the pre-Skill capability audit**

Document a scenario requesting a substantial public homepage change. Record that existing Skills separately cover governance, visual QA, and PR readiness but do not require the complete design-authority → Taste preflight → test-first → browser/a11y → Taste post-audit workflow. This is the observable baseline failure; independent subagent pressure testing is unavailable in the current execution environment and must not be fabricated.

- [ ] **Step 2: Write the minimal Skill**

Use this discovery boundary:

```yaml
---
name: frontend-implementation
description: Use when implementing or substantially modifying public FURLANICH user interface routes, components, responsive behavior, or visual presentation.
---
```

Require the 14 approved workflow stages, but reference `design-taste-frontend-v1`, `test-driven-development`, `playwright-qa`, `visual-qa`, `verification-before-completion`, and `pr-readiness` instead of duplicating their procedures. State the repository authority precedence exactly.

- [ ] **Step 3: Review discovery and overlap scenarios**

Record expected discovery for a new public route, substantial component redesign, and responsive navigation behavior. Record non-triggers for pure product documentation, Node-only utilities, dependency maintenance with no public UI, and visual audit without implementation. Confirm boundaries against `architecture-governance`, `project-knowledge-maintenance`, `playwright-qa`, `visual-qa`, and `pr-readiness`.

- [ ] **Step 4: Validate GREEN**

Run the bundled `quick_validate.py`, `npm run docs:check`, and `git diff --check`. Manually follow the Skill against the original scenario and record that it discovers both approved design documents, invokes Taste within the authority boundary, selects tests before code, and ends at `pr-readiness`.

- [ ] **Step 5: Commit before modifying another Skill**

Commit as `docs: add frontend implementation skill`.

### Task 4: Add Playwright configuration and browser baselines test-first

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/support/paths.ts`
- Create: `tests/e2e/support/console-errors.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

**Interfaces:**

- Consumes: `NEXT_PUBLIC_BASE_PATH`, optional `PLAYWRIGHT_BASE_URL`, existing `npm run dev`, and current stable routes only.
- Produces: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:a11y`, and `test:frontend` commands plus named Playwright projects.

- [ ] **Step 1: Establish RED for the absent harness**

Run `npm run test:e2e` before adding dependencies or scripts. Require the expected missing-script failure and record it.

- [ ] **Step 2: Add pinned dependencies and scripts**

Install exact dev dependencies `@playwright/test@1.62.1` and `@axe-core/playwright@4.13.0`. Add:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:a11y": "playwright test --project=accessibility-chromium",
  "test:frontend": "npm test && npm run test:e2e && npm run build && npm run verify:static-export"
}
```

- [ ] **Step 3: Write focused browser tests before configuration**

Write tests that describe current approved behavior:

- Spanish and English homepages load with one visible H1;
- Services, Projects, and nested Founder routes load in both languages;
- the language switch preserves equivalent route context;
- visible primary-navigation destinations resolve and emit no console errors;
- the mobile native disclosure opens and closes with Enter and its links are reachable;
- 390px, Mobile Safari, 1024px, and 1440px projects have no horizontal document overflow;
- representative routes have no critical/serious axe violations;
- homepage focus advances through wordmark, language switch, and primary navigation/menu controls.

Run `npx playwright test` before creating the configuration and require failure because no supported web server/project setup exists.

- [ ] **Step 4: Implement the minimum Playwright configuration**

Configure a local origin, normalized base path, `webServer` command on a fixed overridable port, HTML reporter, failure artifacts, CI-only retries, CI `forbidOnly`, and conservative workers. Define:

- `chromium-desktop`, `firefox-desktop`, `webkit-desktop` for `smoke.spec.ts` at 1440px;
- `mobile-chromium` at 390px, `mobile-webkit` using an iPhone/Safari profile, `tablet-chromium` at 1024px, and `wide-chromium` at 1440px for `responsive.spec.ts`;
- `accessibility-chromium` for `accessibility.spec.ts`.

- [ ] **Step 5: Ignore generated evidence**

Ignore `playwright-report/`, `test-results/`, `.playwright/`, and local screenshot/trace output without ignoring committed test sources or future intentional snapshot baselines.

- [ ] **Step 6: Install browsers and verify GREEN**

Install Chromium, Firefox, and WebKit. Run focused smoke, responsive, and accessibility projects, then `npm run test:e2e`. If any test fails, apply `systematic-debugging` and change only infrastructure/test assumptions unless the user explicitly expands product scope.

- [ ] **Step 7: Re-run deterministic layers and commit**

Run `npm test`, `npm run lint`, `npm run typecheck`, and `git diff --check`. Commit as `test: add Playwright and accessibility baselines`.

### Task 5: Add Playwright QA and upgrade visual QA

**Files:**

- Create: `.agents/skills/playwright-qa/SKILL.md`
- Modify: `.agents/skills/visual-qa/SKILL.md`
- Modify: `docs/testing/skill-validation.md`

**Interfaces:**

- Consumes: repository Playwright scripts, changed routes, approved requirements, base-path context, and available browser evidence.
- Produces: repeatable browser QA instructions and a separate evidence-based visual judgment procedure.

- [ ] **Step 1: Record RED scenarios**

For `playwright-qa`, record that no project Skill currently routes server startup, browser matrix, base paths, axe, trace, and cleanup. For `visual-qa`, record that the current generic browser step does not prefer Playwright or explicitly divide automated behavior from visual judgment.

- [ ] **Step 2: Create `playwright-qa` minimally**

Use a trigger-only description for frontend changes needing browser-level validation. Reference package scripts and testing docs. Cover route selection, base path, named projects, keyboard and console checks, responsive checks, axe policy, failure evidence, trace inspection, and cleanup without copying API documentation.

- [ ] **Step 3: Upgrade `visual-qa` minimally**

Prefer the repository Playwright harness for repeatable setup and state reproduction where available. Keep visual comparison against approved design, typography/layout inspection, screenshot evidence, honest tool limitations, and the explicit statement that neither Skill replaces the other.

- [ ] **Step 4: Validate each Skill separately**

After `playwright-qa`, run quick validation, docs validation, and its forward scenario before touching `visual-qa`. Then repeat for `visual-qa`. Record trigger, non-trigger, and overlap outcomes in `docs/testing/skill-validation.md`.

- [ ] **Step 5: Commit**

Commit as `docs: add Playwright and visual QA skills`.

### Task 6: Document testing, provenance, and Taste authority

**Files:**

- Create: `docs/testing/strategy.md`
- Create: `docs/testing/playwright.md`
- Create: `docs/testing/visual-regression.md`
- Create: `docs/testing/taste-audit.md`
- Create: `docs/superpowers/README.md`
- Modify: `docs/index.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Modify: `ARCHITECTURE.md`
- Modify: `AGENTS.md`

**Interfaces:**

- Consumes: the implemented scripts/configuration, pinned Skill lock, authoritative design records, and current architecture.
- Produces: concise human testing guidance, provenance, current-system synchronization, and a short root router.

- [ ] **Step 1: Write the concise testing documents**

Document layer selection, RED-GREEN-REFACTOR policy and exceptions, commands, CI projects, artifacts, base-path usage, accessibility limits, keyboard/manual review, and intentional snapshot policy. Do not repeat the Playwright API.

- [ ] **Step 2: Document Superpowers and provenance**

List local paths, repositories, exact revisions, licenses, purposes, unchanged-content policy, and the decision not to vendor generic review Skills. Explain that actual Superpowers specs and plans live under `docs/superpowers/specs/` and `docs/superpowers/plans/`.

- [ ] **Step 3: Exercise Taste as an audit only**

Start the current site and inspect the existing Spanish homepage at 390px, 1024px, and 1440px. Read `DESIGN-VISUAL` and `DESIGN-IX-A11Y`, then apply Taste v1 as critique. Record useful observations and every conflict where repository design overrides Taste defaults, including v1's high variance/motion defaults. Do not edit UI code.

- [ ] **Step 4: Synchronize current architecture and indexes**

Record Playwright/axe dependencies, test layers, browser CI, and Skill inventory as current facts. Remove only findings that the new harness actually resolves; retain whole-site accessibility, manual testing, and nondeterministic visual limits.

- [ ] **Step 5: Update `AGENTS.md` only as a router**

Add short links to `frontend-implementation`, TDD, `playwright-qa`, `visual-qa`, testing docs, design authority, verification, and `pr-readiness`. Do not embed procedures.

- [ ] **Step 6: Validate documentation and commit**

Run `npm run docs:check`, `npm run skills:check`, quick validation for every new/modified project Skill, and `git diff --check`. Commit as `docs: document frontend testing workflow`.

### Task 7: Add a dedicated browser CI job

**Files:**

- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: locked dependencies, named Playwright projects, `NEXT_PUBLIC_BASE_PATH`, and generated failure artifacts.
- Produces: separate `Quality / browser` Pull Request status while preserving `Quality / validate`.

- [ ] **Step 1: Record RED against current CI**

Inspect the current workflow and record that it has only the deterministic `validate` job, installs no browser engines, runs no E2E/a11y tests, and uploads no failure evidence.

- [ ] **Step 2: Add the browser job**

Use Node 24, `npm ci`, `npx playwright install --with-deps chromium firefox webkit`, and `npm run test:e2e` with `NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}`. Upload `playwright-report/` and `test-results/` using `actions/upload-artifact@v4` only on failure, with short retention and read-only permissions.

- [ ] **Step 3: Validate workflow and base-path behavior**

Run the browser suite locally with `NEXT_PUBLIC_BASE_PATH=/Portfolio`, run `npm run docs:check`, inspect the YAML for automatic snapshot updates or write permissions, and run `git diff --check`.

- [ ] **Step 4: Commit**

Commit as `ci: add browser quality checks`.

### Task 8: Complete verification, readiness review, and Pull Request

**Files:**

- Modify: `docs/superpowers/plans/2026-09-08-frontend-testing-capability-hardening.md`
- Modify: documentation or tests only when fresh evidence exposes an in-scope defect

**Interfaces:**

- Consumes: the complete branch diff, all acceptance criteria, deterministic and browser command results, and Taste audit evidence.
- Produces: completed plan history, review-ready commits, and an open Pull Request targeting `main`.

- [ ] **Step 1: Run fresh full verification**

Run and record exact results for:

```powershell
npm test
npm run skills:check
npm run test:e2e
npm run test:a11y
npm run lint
npm run typecheck
npm run build
npm run verify:static-export
$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'; npm run build; npm run verify:static-export; Remove-Item Env:NEXT_PUBLIC_BASE_PATH
npm run docs:check
git diff --check origin/main...HEAD
```

Use `verification-before-completion`: read full output and do not infer one gate from another.

- [ ] **Step 2: Run `pr-readiness`**

Inspect `origin/main...HEAD` for scope, traceability, generated artifacts, secrets, accidental UI changes, unrelated formatting, missing tests/docs, and unresolved issues. Confirm the branch is not `main` and Studio/Founder implementation is absent.

- [ ] **Step 3: Complete the plan record**

Mark verified tasks complete, set `plan_status: COMPLETED`, update `last_verified`, and record RED/GREEN evidence, exact verification summaries, warnings, Taste audit result, deviations, and remaining manual limitations.

- [ ] **Step 4: Commit final documentation**

Re-run affected checks and commit as `docs: complete frontend testing hardening plan`.

- [ ] **Step 5: Push and open the Pull Request**

Push `codex/frontend-testing-capability-hardening` and open a PR targeting `main`. Include Objective, Skills added/updated with source/version, Taste pin and authority boundary, TDD enforcement, Playwright matrix/scripts, accessibility automation/manual boundary, CI checks, documentation, exact verification, and deliberate exclusions. Verify the PR remains open and do not merge.

## Execution evidence

- Baseline: `npm test` passed 50/50 on `31a88dd`; existing Node emitted only known `MODULE_TYPELESS_PACKAGE_JSON` warnings.
- Baseline: `npm run docs:check` passed with 56 Markdown files, 50 document IDs, and 4 Skills.
- Design: approved in chat and committed as `469bcff`.
- Task 1 RED: `node --test scripts/validate-vendored-skills.test.mjs` failed with `ERR_MODULE_NOT_FOUND` for the not-yet-created validator.
- Task 1 GREEN: the focused validator suite passed 2/2; the complete Node suite passed 52/52; `docs:check`, `skills:check`, and `git diff --check` passed.
- Task 2 provenance: Taste was installed with `skills@1.5.24` from exact commit `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`; Superpowers `v6.3.0` resolves from annotated tag object `86babb696875227929e85420f287d6309374b93f` to source commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
- Task 2 integration RED: repository docs validation rejected an intentional duplicate heading in an integrity-locked upstream reference file. GREEN: locked vendor files are excluded only from repository-authored Markdown conventions; unlocked malformed Skill metadata and duplicate headings remain rejected.
- Task 2 validation: `skills:check` passed for 4 Skills and 8 files; all four folders passed `quick_validate.py` in UTF-8 mode; `docs:check` passed with 66 Markdown files, 52 document IDs, and 8 Skills.

## Deviations

None at plan creation.
