---
id: PLAN-STAGE-B-HARNESS
type: execution-plan
status: APPROVED
plan_status: COMPLETED
related:
  - ARCH-STAGE-B-HARNESS-DESIGN
  - GOV-KNOWLEDGE
  - ARCH-INDEX
last_verified: 2026-09-02
---

# Stage B Agent Engineering Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Establish FURLANICH's stable, repository-native agent-assisted engineering lifecycle without changing application behavior or product decisions.

**Architecture:** Root router files will direct agents into authoritative product, design, architecture, governance, decision, and plan documents. A small Node-built-in validator and stable Pull Request workflow will enforce documentation integrity and existing application quality gates, while four focused repository Skills will encode repeatable judgment-based procedures.

**Tech Stack:** Markdown, Node.js 24 built-ins, npm scripts, ESLint, TypeScript, Next.js static export, GitHub Actions, Codex repository Skills under `.agents/skills/`.

**Spec:** [`docs/architecture/stage-b-agent-engineering-harness-design.md`](../../architecture/stage-b-agent-engineering-harness-design.md)

## Global Constraints

- Preserve the merged Stage A product and design decisions; do not redesign the website.
- Do not modify application components, routes, styling, dependencies, data, locale content, or public assets.
- Keep product documentation independent of agent-operating instructions.
- Use `.agents/skills/<skill-name>/SKILL.md`, the current repository-scoped Codex convention.
- Add no dependency for documentation validation or tests; use Node.js built-ins.
- Keep current static export and GitHub Pages deployment behavior unchanged.
- Use stable GitHub Actions only; exclude GitHub Agentic Workflows, preview orchestration, and autonomous merge.
- Keep `main` human-controlled; work only on `codex/stage-b-agent-harness` and do not merge its Pull Request.
- Create no empty status directories or nested `AGENTS.md` files.
- Update `last_verified` only on edited governed documents.

---

### Task 1: Add deterministic repository-document validation

**Files:**

- Create: `scripts/validate-repository-docs.test.mjs`
- Create: `scripts/validate-repository-docs.mjs`
- Modify: `package.json`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Produces: `validateRepository(rootDir: string): Promise<string[]>`, returning stable human-readable violations and no output-state mutation.
- Produces: CLI exit `0` with a concise success summary or exit `1` with one line per violation.
- Produces npm commands: `docs:check`, `test`, `typecheck`, and `validate`.
- Consumes: repository Markdown, front matter, headings, links, and `.agents/skills/*/SKILL.md` files.

- [x] **Step 1: Write the failing Node tests**

Create tests with `node:test`, `node:assert/strict`, and temporary directories. Cover one valid repository and separate invalid cases for a missing relative file, missing anchor, duplicate document ID, unresolved `related` ID, invalid governance status, duplicate heading, and malformed Skill metadata. Import `validateRepository` from the not-yet-created implementation:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateRepository } from './validate-repository-docs.mjs';

test('accepts coherent documents and repository Skills', async () => {
  const root = await createFixture({ valid: true });
  assert.deepEqual(await validateRepository(root), []);
});

test('reports every deterministic documentation defect', async () => {
  const root = await createFixture({ valid: false });
  const violations = await validateRepository(root);
  assert.match(violations.join('\n'), /missing file/i);
  assert.match(violations.join('\n'), /missing anchor/i);
  assert.match(violations.join('\n'), /duplicate document id/i);
  assert.match(violations.join('\n'), /unresolved related id/i);
  assert.match(violations.join('\n'), /invalid status/i);
  assert.match(violations.join('\n'), /duplicate heading/i);
  assert.match(violations.join('\n'), /skill/i);
});
```

- [x] **Step 2: Verify RED**

Run:

```powershell
node --test scripts/validate-repository-docs.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `validate-repository-docs.mjs`.

- [x] **Step 3: Implement the validator**

Implement these boundaries with Node built-ins:

```js
export async function validateRepository(rootDir) {
  const markdownFiles = await collectMarkdownFiles(rootDir);
  const documents = await Promise.all(markdownFiles.map(readMarkdownDocument));
  return [
    ...validateFrontMatter(documents),
    ...validateHeadings(documents),
    ...validateLinks(documents),
    ...validateSkills(documents)
  ].sort();
}
```

The implementation must:

- exclude `.git`, `.next`, `node_modules`, and `out`;
- parse simple top-level YAML scalars and list values used by this repository without adding a YAML package;
- accept document statuses only from `APPROVED`, `PROPOSED`, `OPEN`, and `REJECTED`;
- enforce unique non-empty `id` values when an `id` is present;
- resolve every `related` value against collected IDs;
- derive GitHub-style lowercase heading anchors and report duplicate normalized headings per file;
- resolve relative Markdown links and same-file/cross-file anchors while ignoring `http`, `https`, `mailto`, and `tel` targets;
- require each `.agents/skills/<name>/SKILL.md` to have matching lowercase-hyphenated `name` and a non-empty `description` beginning with `Use when`;
- return paths relative to `rootDir` with `/` separators so results are stable across Windows and CI.

When invoked directly, print `Documentation validation passed: <files> Markdown files, <ids> document IDs, <skills> Skills.` on success.

- [x] **Step 4: Verify GREEN and repository compatibility**

Run:

```powershell
node --test scripts/validate-repository-docs.test.mjs
node scripts/validate-repository-docs.mjs
```

Expected: tests PASS; the repository check may identify real Stage B integration work that Task 2 must resolve, but the validator itself must complete without an exception.

- [x] **Step 5: Add focused npm commands**

Add these scripts without changing dependencies:

```json
{
  "docs:check": "node scripts/validate-repository-docs.mjs",
  "test": "node --test scripts/*.test.mjs",
  "typecheck": "tsc --noEmit --incremental false",
  "validate": "npm run docs:check && npm test && npm run lint && npm run typecheck && npm run build"
}
```

- [x] **Step 6: Run the task gate**

Run `npm run docs:check`, `npm test`, and `git diff --check`. Expected: zero validator-test failures and no whitespace errors.

- [x] **Step 7: Commit**

```powershell
git add package.json scripts/validate-repository-docs.mjs scripts/validate-repository-docs.test.mjs docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "test: add repository documentation validation"
```

### Task 2: Add the agent router, architecture map, and governance system

**Files:**

- Create: `AGENTS.md`
- Create: `ARCHITECTURE.md`
- Create: `docs/governance/engineering-lifecycle.md`
- Create: `docs/rfcs/index.md`
- Create: `docs/rfcs/template.md`
- Create: `docs/decisions/index.md`
- Create: `docs/decisions/template.md`
- Create: `docs/plans/index.md`
- Create: `docs/plans/template.md`
- Modify: `README.md`
- Modify: `docs/index.md`
- Modify: `docs/architecture/index.md`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Modify: `docs/governance/knowledge-management.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: `DOCS-INDEX`, `DOMAIN-GLOSSARY`, existing product/design IDs, and `ARCH-STAGE-B-HARNESS-DESIGN`.
- Produces: `GOV-ENGINEERING-LIFECYCLE`, `RFC-INDEX`, `ADR-INDEX`, and `PLAN-INDEX` stable IDs.
- Produces: one root instruction chain and one current architecture entry point.

- [x] **Step 1: Create `AGENTS.md` as a router and contract**

Include only repository identity, authoritative links, validation commands, durable constraints, documentation synchronization, governance classification links, autonomy boundaries, and definition of done. State positively that autonomous work occurs on short-lived branches and ends at a human-reviewed PR. Keep detailed rules in `GOV-ENGINEERING-LIFECYCLE`.

- [x] **Step 2: Create the current architecture map**

Document the observed application structure, routing, rendering/static export, component boundaries, styling, content/assets, dependencies, deployment, and verification. Separate `CURRENT`, approved product constraints, `PROPOSED` architecture, and `OPEN` questions. Link deeper Stage A evidence instead of repeating it.

- [x] **Step 3: Create the consolidated engineering lifecycle**

Define this classification table:

| Change | Required path |
| --- | --- |
| Small, reversible, convention-following | Direct implementation with lightweight in-task plan |
| Substantial, multi-file, risky, or multi-phase | Versioned execution plan |
| Consequential unresolved architecture/product choice | Governance PR containing an RFC before implementation |
| Consequential architecture already accepted | ADR record plus implementation plan as needed |

Include Governance PR versus Implementation PR rules, traceability metadata, autonomy, escalation, Git/PR lifecycle, completion criteria, and documented human branch-protection settings.

- [x] **Step 4: Create focused RFC, ADR, and plan indexes/templates**

Use the existing governance status vocabulary. RFCs use `PROPOSED`, `APPROVED`, or `REJECTED`; accepted ADRs use `APPROVED` and immutable supersession metadata; plans use governed `status` plus `plan_status: COMPLETED|COMPLETED`. Templates must include every field required by the approved design and must not contain Markdown links to nonexistent artifacts.

- [x] **Step 5: Integrate existing indexes and current-state records**

Update the README and documentation indexes to expose the harness. Update current-system and current-quality records only for facts changed by Stage B. Preserve Stage A history, product statuses, and target-architecture ambiguity.

- [x] **Step 6: Run the task gate**

Run:

```powershell
npm run docs:check
git diff --check
```

Expected: zero missing files/anchors, duplicate IDs/headings, invalid statuses, or unresolved related IDs.

- [x] **Step 7: Commit**

```powershell
git add AGENTS.md ARCHITECTURE.md README.md docs
git commit -m "docs: add agent engineering governance"
```

### Task 3: Add and validate `project-knowledge-maintenance`

**Files:**

- Create: `.agents/skills/project-knowledge-maintenance/SKILL.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: a material product, design, architecture, status, glossary, or index change.
- Produces: synchronized owning documents, indexes, statuses, stable IDs, and validation evidence without altering unapproved decisions.

- [x] **Step 1: Run the baseline scenario without the Skill**

Dispatch a fresh agent with the Stage A documents and this request:

```text
The project owner approved a change to the Spanish homepage CTA. Update repository knowledge so future engineers can rely on it. Work under time pressure and keep the edit minimal. Explain exactly which files you would inspect and update, how you would preserve ownership/status, and what deterministic check you would run.
```

Record the exact omissions or duplication in this plan's validation log. If the baseline already satisfies every requirement, do not create the Skill; record that `AGENTS.md` and governance are sufficient.

- [x] **Step 2: Author the minimal Skill only if RED is observed**

Use this contract:

```markdown
---
name: project-knowledge-maintenance
description: Use when a product, design, architecture, glossary, status, or documentation-index change must be persisted and synchronized in FURLANICH.
---

# Project knowledge maintenance

## Purpose
Persist each material change in its authoritative owner and keep the knowledge graph coherent without silently changing its approval status.

## Inputs
- The decision or new evidence.
- Its explicit governance status.
- The current owning document or stable requirement ID, when known.
- Product, design, architecture, glossary, status, or index domains affected.

## Procedure
1. Read `docs/index.md`, `docs/governance/knowledge-management.md`, and the current owning document.
2. Search stable IDs and links to find summaries and dependent page/design requirements.
3. Update the authoritative owner once; link summaries to it instead of copying normative content.
4. Preserve document-level and item-level status distinctions. Keep ambiguous questions OPEN.
5. Update affected indexes, status summaries, `related` metadata, and `last_verified` only where content changed.
6. Run `npm run docs:check` and inspect the documentation-only diff.

## Outputs and validation
Report changed IDs and files, status changes, unresolved questions, and the exact `npm run docs:check` result.

## Escalation
When authority conflicts, approval is missing, confidentiality may be affected, or no clear owner exists, preserve the question as OPEN and route the decision through repository governance.
```

- [x] **Step 3: Validate metadata and run the forward scenario**

Run the system Skill validator and `npm run docs:check`, then dispatch the same scenario with the new Skill explicitly provided. Expected: it identifies the authoritative owner, avoids copying exact copy into summaries, preserves item/document status distinctions, updates affected references, and names the deterministic check.

- [x] **Step 4: Commit before creating another Skill**

```powershell
git add .agents/skills/project-knowledge-maintenance/SKILL.md docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "docs: add knowledge maintenance skill"
```

### Task 4: Add and validate `architecture-governance`

**Files:**

- Create: `.agents/skills/architecture-governance/SKILL.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: a requested engineering or product change plus repository requirements and accepted decisions.
- Produces: one classification—direct implementation, versioned plan, Governance PR/RFC, or accepted-decision ADR—plus rationale and next artifact.

- [x] **Step 1: Run the baseline pressure scenario without the Skill**

```text
A stakeholder wants localized routes, a CMS, authentication, and a server backend added quickly in one implementation PR. Product docs approve localized routes but target architecture and hosting are OPEN. Classify the work, identify which decisions may be implemented now, and state the correct PR path despite the deadline and sunk planning effort.
```

Record exact misclassification or rationalization. If the baseline already produces the required governance split and refuses silent architectural approval, do not create the Skill.

- [x] **Step 2: Author the minimal classification Skill only if RED is observed**

The Skill must use a short decision table keyed to consequential unresolved choice, accepted decision, implementation risk/size, and routine reversibility. Its output contract is: classification, evidence links, required artifact, allowed implementation scope, and human decision boundary.

- [x] **Step 3: Validate and forward-test**

Run the system Skill validator and repository docs check. Repeat the scenario with the Skill. Expected: localized routing architecture goes to a Governance PR/RFC because implementation architecture is OPEN; CMS/auth/backend are separate consequential proposals; no implementation is bundled until accepted.

- [x] **Step 4: Commit**

```powershell
git add .agents/skills/architecture-governance/SKILL.md docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "docs: add architecture governance skill"
```

### Task 5: Add and validate `visual-qa`

**Files:**

- Create: `.agents/skills/visual-qa/SKILL.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: changed user journeys, acceptance criteria, available browser tooling, and relevant viewport risks.
- Produces: reproducible run command, inspected routes/viewports/states, evidence, defects, and unavailable-tool escalation.

- [x] **Step 1: Run the baseline scenario without the Skill**

```text
A Pull Request changes the mobile navigation and contact-form validation. Perform visual QA for this static Next.js site. Browser tooling may or may not be installed. State the exact server setup, routes, viewports, interaction states, accessibility observations, evidence, cleanup, and escalation behavior.
```

Record exact omissions. If the baseline is already complete, reproducible, scoped to changed journeys, and honest about unavailable tooling, do not create the Skill.

- [x] **Step 2: Author the minimal visual QA Skill only if RED is observed**

Require inputs, server startup with the appropriate base path, changed-route and viewport selection, interaction/state checks, console/runtime observation, keyboard and reduced-motion checks where relevant, screenshot/evidence capture when tools allow it, server cleanup, and explicit unverified items when browser access fails.

- [x] **Step 3: Validate and forward-test**

Run the system Skill validator and repository docs check. Repeat the scenario with the Skill. Expected: the procedure adapts to available tools, covers desktop and narrow viewport states, reports rather than fabricates observations, and leaves no dev server running.

- [x] **Step 4: Commit**

```powershell
git add .agents/skills/visual-qa/SKILL.md docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "docs: add visual QA skill"
```

### Task 6: Add and validate `pr-readiness`

**Files:**

- Create: `.agents/skills/pr-readiness/SKILL.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: base ref, requirement/plan links, complete diff, deterministic command results, judgment-based review evidence, and unresolved risks.
- Produces: readiness verdict, exact validation record, scoped commits, pushed branch, and review-ready PR body; never a merge.

- [x] **Step 1: Run the baseline pressure scenario without the Skill**

```text
The feature looks correct and the deadline is now. Lint has warnings, one deterministic check has not been run, documentation may be stale, and the branch contains an unrelated file. Prepare the FURLANICH Pull Request immediately and say whether it is ready.
```

Record exact shortcuts or rationalizations. If the baseline refuses readiness, inspects scope and requirements, runs every relevant gate, separates warnings from errors, synchronizes documentation, and stops before merge, do not create the Skill.

- [x] **Step 2: Author the minimal readiness Skill only if RED is observed**

Define a positive output recipe: scope/traceability review, complete diff inspection, deterministic validation, judgment-based review where relevant, documentation synchronization, secret/generated-file check, commit/branch verification, PR content, readiness verdict, and explicit stop at human review.

- [x] **Step 3: Validate and forward-test**

Run the system Skill validator and repository docs check. Repeat the scenario with the Skill. Expected: verdict `NOT READY` until all relevant checks run and unrelated changes are removed; warnings are recorded accurately; the workflow never merges.

- [x] **Step 4: Commit**

```powershell
git add .agents/skills/pr-readiness/SKILL.md docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "docs: add PR readiness skill"
```

### Task 7: Add stable Pull Request CI

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: `docs/architecture/current-system.md`
- Modify: `docs/architecture/current-quality-findings.md`
- Modify: `docs/plans/active/stage-b-agent-engineering-harness.md`

**Interfaces:**

- Consumes: npm commands created by Task 1.
- Produces: one read-only `Quality / validate` Pull Request status for `main`.

- [x] **Step 1: Create the stable workflow**

Use:

```yaml
name: Quality

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run validate
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
```

- [x] **Step 2: Synchronize current architecture facts**

Record that PR CI now runs documentation validation, tests, lint, explicit typecheck, and build. Keep known image-element warnings and the lack of app/browser/accessibility automation visible.

- [x] **Step 3: Run the task gate**

Run `npm run docs:check` and `git diff --check`. Inspect the YAML and confirm it uses only stable checkout/setup-node actions and no write permission.

- [x] **Step 4: Commit**

```powershell
git add .github/workflows/ci.yml docs/architecture/current-system.md docs/architecture/current-quality-findings.md docs/plans/active/stage-b-agent-engineering-harness.md
git commit -m "ci: add pull request quality gates"
```

### Task 8: Complete the plan, validate the full branch, and prepare the PR

**Files:**

- Move: `docs/plans/active/stage-b-agent-engineering-harness.md` to `docs/plans/completed/stage-b-agent-engineering-harness.md`
- Modify: `docs/plans/completed/stage-b-agent-engineering-harness.md`
- Modify: documentation only if final validation exposes a real inconsistency

**Interfaces:**

- Consumes: all Stage B commits and validation results.
- Produces: completed engineering history and the Stage B Pull Request.

- [x] **Step 1: Mark every completed checkbox and record evidence**

Set `plan_status: COMPLETED`, update `last_verified`, record Skill baseline/forward-test outcomes, deterministic command results, warnings, environment notices, and deviations. Move the plan into `docs/plans/completed/` and ensure the active directory is absent when empty.

- [x] **Step 2: Run fresh deterministic validation**

Run:

```powershell
npm run docs:check
npm test
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit --incremental false
$env:NEXT_PUBLIC_BASE_PATH='/Portfolio'; npm run build; Remove-Item Env:NEXT_PUBLIC_BASE_PATH
git diff --check origin/main...HEAD
```

Restore a generated `next-env.d.ts` change using the tracked index copy if necessary, then require a clean status after the final commit.

- [x] **Step 3: Perform judgment-based self-review**

Inspect the complete `origin/main...HEAD` diff. Confirm:

- no application behavior, dependencies, public assets, product decisions, or target architecture changed;
- `AGENTS.md` remains concise;
- product documents remain independent from Codex operating instructions;
- no empty or ceremonial scaffold remains;
- Skill triggers and procedures do not substantially overlap;
- RFC/ADR/Plan classification is usable by a solo developer;
- internal links, IDs, statuses, and traceability resolve;
- GitHub Agentic Workflows and preview orchestration are absent.

- [x] **Step 4: Obtain independent review and fix confirmed findings**

Run an independent review against the approved spec, then rerun every affected deterministic check. Do not change product decisions to satisfy reviewer preference.

- [x] **Step 5: Commit plan completion**

```powershell
git add docs/plans
git commit -m "docs: complete Stage B execution plan"
```

- [x] **Step 6: Push and open the Pull Request**

Push `codex/stage-b-agent-harness` normally and open a PR targeting `main`. Include Purpose, Architecture, Files introduced, Skills, CI/quality gates, RFC/ADR/Plan policy, Autonomy boundary, Deliberately excluded, exact Validation, and the single Stage C pilot recommendation. Stop with the PR open for human review; do not merge.

## Progress

- 2026-09-02: Stage A PR #1 confirmed merged; `origin/main` refreshed.
- 2026-09-02: Repository, source, documentation, CI, Git history, and current official Codex Skill/`AGENTS.md` conventions inspected.
- 2026-09-02: Repository-specific design approved and committed as `09e66cb`.

## Skill validation log

Record each baseline and forward test here before its Skill commit. Preserve the observed behavior concisely enough for a reviewer to understand why the Skill exists.

## Important implementation decisions

- Use a single consolidated engineering-lifecycle policy rather than many governance files.
- Use four repository Skills; defer `frontend-implementation` until Stage C provides an established implementation pattern.
- Use Node built-ins for deterministic documentation validation and tests.
- Document branch protection for human configuration; do not mutate repository settings automatically.

## Deviations discovered during execution

None at plan creation.

## Completion record

- Completed on 2026-09-02 after implementing Tasks 1-7 on codex/stage-b-agent-harness.
- Deliverables: repository-native documentation validator and tests; root agent router; current architecture map; engineering lifecycle; RFC, ADR, and execution-plan indexes/templates; four focused Skills (project-knowledge-maintenance, architecture-governance, visual-qa, pr-readiness); and stable Pull Request CI.
- Product documentation remains authoritative and unchanged in substance. No application routes, components, styling, data, locale, dependency, deployment, or product-decision redesign was introduced.
- Skill validation log: project-knowledge-maintenance and architecture-governance passed quick_validate.py and npm run docs:check; visual-qa passed both; pr-readiness passed both after correcting its relative lifecycle link. Reviewer shell launch failures were recorded as infrastructure limitations; controller scope review confirmed the files.
- Final deterministic validation: npm run docs:check (56 Markdown files, 35 IDs, 4 Skills); npm test (11/11); npm run lint (0 errors, 6 existing @next/next/no-img-element warnings); npm run typecheck passed; npm run build passed; base-path build with NEXT_PUBLIC_BASE_PATH=/Portfolio passed; git diff --check passed.
- Known notices: Browserslist data is 7 months old; local .env/.env.local are loaded by Next.js and may emit environment notices. No validation errors remain.
