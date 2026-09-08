---
id: PLAN-STUDIO-FOUNDER-COMPLETION
title: Studio + Founder Completion implementation plan
status: ACTIVE
owners:
  - product
  - design
  - frontend
  - qa
created: 2026-09-08
last_verified: 2026-09-08
related:
  - PAGE-STUDIO
  - PAGE-FOUNDER
  - PORTFOLIO-MIGRATION
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - PAGE-PROJECTS
  - PROJECT-EVIDENCE
  - ADR-STATIC-LOCALIZED-ROUTING
---

# Studio + Founder Completion implementation plan

> Execution contract: complete this plan as four independently reviewable Pull Requests. Each implementation PR begins with an observed RED test where the task changes behavior, stays inside the accepted architecture, and stops for human review. Do not merge autonomously.

## Goal

Add the approved bilingual Studio experience and complete the existing Founder profile without collapsing their responsibilities:

- Studio explains how FURLANICH is structured, operates, and remains accountable.
- Founder explains Samuel Furlanich's professional depth and provides evidence, CV, and professional identity links.
- Navigation, footer, Contact, and approved project-detail contexts lead to the correct destination.
- Both experiences remain static, localized, accessible, responsive, and compatible with GitHub Pages base paths.

## Classification

This initiative is **substantial approved work requiring a versioned execution plan**.

No consequential architecture question remains. The approved work fits the current static localized App Router architecture and ADR-STATIC-LOCALIZED-ROUTING:

- explicit Spanish and English routes;
- route-owned localized content;
- shared locale-agnostic components;
- Server Components by default;
- typed route and content contracts;
- static export;
- GitHub Pages and basePath compatibility.

Do not create an RFC or ADR for this work. Escalate only if implementation discovers a genuinely consequential choice that changes routing, hosting, dependencies, content ownership, security, or the design system. A proposed CMS, backend, runtime profile API, client-side localization system, global state layer, or new design framework is out of scope and requires separate governance.

## Authoritative inputs

Implementation must use the current approved records rather than reconstructing copy or design from this plan:

- PAGE-STUDIO and PAGE-FOUNDER own hierarchy, exact Spanish and English copy, facts, portrait state, CV/link state, and duplication boundaries.
- CONTENT-LOCALIZATION owns localization quality and route-owned content rules.
- DESIGN-VISUAL owns visual composition and tokens.
- DESIGN-IX-A11Y owns responsive, interaction, focus, link, motion, and accessibility behavior.
- PAGE-PROJECTS and PROJECT-EVIDENCE own public-project eligibility and relationship claims.
- PORTFOLIO-MIGRATION owns retained professional-history facts and legacy-content migration boundaries.
- ARCHITECTURE.md and ADR-STATIC-LOCALIZED-ROUTING own technical constraints.
- docs/testing/* owns TDD, browser, accessibility, visual-regression, and Taste verification policy.

If this plan and an owning record disagree, the owning record wins and the plan must be synchronized before production changes continue.

## Approved routes and equivalent-page mapping

| Semantic route | Spanish | English |
| --- | --- | --- |
| Studio | /estudio/ | /en/about/ |
| Founder | /estudio/samuel-furlanich/ | /en/about/samuel-furlanich/ |

The primary navigation label El estudio / About resolves to Studio. Founder remains a distinct nested route. Language switching preserves the current semantic page. The existing semantic route map must gain Studio without replacing Founder.

## Approved rendered hierarchy

### Studio

1. Studio intro on Canvas: 7/12 narrative and 5/12 factual operating-model panel from 1024px upward.
2. Direct accountability and collaborator model on Surface.
3. Four unnumbered working principles on Canvas; two columns from 768px and one column below.
4. Location and availability on a restrained Surface band.
5. Founder bridge on Canvas.
6. Established final Contact CTA on Action tint.

The operating-model panel is informational, not statistical. No image, stock team treatment, team-member grid, fake metric, gradient, glass card, dark dramatic section, decorative icon set, or agency animation is allowed.

### Founder

1. Text-led Founder header and approved professional narrative.
2. Professional links: CV primary, LinkedIn and GitHub secondary.
3. Editorial experience history with a narrow period column at wide widths.
4. Restrained factual education.
5. Four capability groups, with technologies subordinate to capability.
6. One Projects bridge, not a duplicate project index.
7. Established commercial Contact CTA.

No approved portrait exists. Do not render a media column, placeholder, generated portrait, or decorative silhouette. Clever Soft SA remains narrative biography context and must not become a timeline entry, logo, or FURLANICH endorsement. Do not add a second technology wall.

## Shared implementation rules

- Use existing Canvas, Surface, Action tint, Ink, Muted, Inter, 1200px container, gutters, section rhythm, button, card, and focus primitives.
- Use semantic sections and one H1 per page. Preserve H2/H3 hierarchy, logical source order, and text-zoom resilience.
- Prefer Server Components. Introduce client code only for already-approved interactive behavior that cannot remain native.
- Extract a component only when it owns coherent layout/behavior or meaningful reuse. Do not create one component per heading.
- Use semantic internal route identifiers in route-owned content and resolve them through the route map.
- Use a narrow public-asset helper only for the CV path if the current helper cannot be safely tested or reused. Do not create a general asset abstraction.
- External professional links use a consistent accessible policy. The preferred implementation is same-tab navigation, avoiding an unannounced new browsing context. If a new tab remains necessary, add localized assistive context and rel=noopener noreferrer.
- No content may depend on hover. No state is communicated only through color.
- Preserve reduced-motion behavior; add no entrance, scroll-reveal, parallax, marquee, timeline-drawing, scrambling, or floating-icon motion.
- Do not rewrite the CV or approved facts.

## Mandatory implementation Skills

| Skill | Required use |
| --- | --- |
| frontend-implementation | Own the authority check and full frontend delivery path for every implementation PR. |
| test-driven-development | Enforce observed RED before behavior-changing production code in PRs 1–4. |
| design-taste-frontend-v1 | Run documented preflight and post-implementation audits for rendered UI in PRs 2–4; repository design remains authoritative. |
| playwright-qa | Design and run route, interaction, browser, basePath, and axe coverage in PRs 2–4. |
| visual-qa | Inspect both locales and the exact viewport matrix in PRs 2–4. |
| architecture-governance | Confirm plan-class scope at each PR boundary and classify any consequential discovery before work expands. |
| pr-readiness | Perform traceability, complete-diff review, focused validation, and human-review handoff for every PR. |
| verification-before-completion | Require fresh command output and rendered evidence before any passing or complete claim. |

Use systematic-debugging only when a test, build, route, browser behavior, or rendered result is unexpectedly defective. Do not invoke it as ceremony for ordinary RED tests.

## Testing and review contract

### TDD

For every behavior-changing task:

1. Add the smallest test that names the missing public behavior.
2. Run it and record the expected failure.
3. Add the minimum production change.
4. Run the focused test and record the pass.
5. Refactor only while focused tests remain green.

Tests assert route resolution, rendered semantics, link behavior, content completeness, generated artifacts, and browser outcomes. They must not assert Tailwind class strings, private component structure, or source-code text as a proxy for user behavior.

Documentation-only synchronization steps do not require artificial failing tests.

### Playwright

Use the existing Playwright web-server and basePath-aware helpers.

- Three desktop engines cover route loading and critical navigation.
- Chromium covers the full exact responsive matrix.
- The accessibility project runs axe against both locales of both pages.
- Normal-root and /Portfolio basePath runs cover route, CV, and internal-link behavior.
- Preserve console-error gating.

Add Studio to the shared path helpers. Add a focused Studio/Founder specification rather than overloading unrelated homepage tests.

### Accessibility

Automated axe coverage is required for:

- /estudio/
- /en/about/
- /estudio/samuel-furlanich/
- /en/about/samuel-furlanich/

Manual or behavioral checks must cover heading hierarchy, landmark structure, keyboard order, visible focus, portrait absence/alt policy, mobile navigation, external-link behavior, CTA order, 200% text zoom, and reduced motion. Axe passing is evidence, not a WCAG-conformance claim.

### Visual QA

Inspect Spanish and English at:

| Class | Viewport |
| --- | --- |
| Minimum compact | 320x800 |
| Common compact | 390x844 |
| Tablet portrait | 768x1024 |
| Tablet/compact desktop | 1024x768 |
| Wide desktop | 1440x900 |

Check text measure, wrapping, section rhythm, surface alternation, operating-model panel, principle reflow, experience date association, capability wrapping, professional actions, CTA order, and horizontal overflow.

The existing visual-regression policy is stable enough for four approved key baselines:

- Studio wide;
- Studio compact;
- Founder wide;
- Founder compact.

Use deterministic Chromium and capture the page main region so development-only browser chrome does not enter the baseline. Create Studio baselines in PR 2 and Founder baselines in PR 3. Never update baselines automatically; the image changes are human-reviewed.

### Taste

Before each public UI PR, run the repository Taste preflight against approved requirements, the proposed composition, and the current site. Explicitly inspect risks of generic agency structure, card overuse, weak hierarchy, poor whitespace, and visual repetition.

After implementation, run the Taste audit against the rendered page and screenshots. Taste is advisory. Repository-approved Inter, restrained flat surfaces, no gradients, minimal motion, approved 1200px container, and exact content hierarchy override generic Taste suggestions.

### PR readiness

Before opening each implementation PR:

- inspect the full diff against current main;
- map every requirement to code, tests, or authoritative documentation;
- run the focused RED/GREEN evidence and the required deterministic validation;
- inspect generated screenshots and traces when applicable;
- run a self-review for accidental architecture, copy, or design expansion;
- stop at human review without merging.

## PR sequence

Implementation must proceed in order. Each PR branches from current main after its predecessor is merged.

### PR 1 — Studio route and content contracts

**Exact first implementation PR:** <code>feat: add Studio route and content contracts</code>

This PR has complete authority, does not depend on imagery, begins with failing contract tests, is behaviorally narrow, and materially establishes the Studio/Founder distinction. It intentionally does not publish the Studio route or change visible navigation.

#### Files

Modify:

- lib/site-routes.ts
- lib/foundation-navigation.ts
- components/foundation/content-types.ts only where shared semantic action types require Studio
- scripts/site-routes.test.mjs
- scripts/foundation-content.test.mjs

Create:

- components/studio/content-types.ts
- app/(es)/_content/studio.ts
- app/(en)/en/_content/studio.ts
- scripts/studio-content.test.mjs

Do not create Studio page route files in this PR.

#### RED

1. Extend the route contract test to require semantic route id studio, the exact pair /estudio/ and /en/about/, and independent Studio and Founder alternates.
2. Extend the foundation-navigation contract to expose both paths.studio and paths.founder.
3. Add a Studio content-contract test that imports both route-owned modules and verifies:
   - one complete localized content object per locale;
   - intro, operating model, accountability, collaborator model, four principles, location, Founder bridge, and final CTA;
   - Studio primary action targets Contact and secondary/bridge actions target Founder;
   - route identifiers are semantic, not raw localized URLs;
   - the panel contains factual labels and no metrics fields;
   - all required collections are non-empty and the four-principle tuple is exact in length.
4. Run:
   - node --test scripts/site-routes.test.mjs
   - node --test scripts/studio-content.test.mjs
5. Record failures caused by the missing Studio route and content.

#### GREEN

1. Add studio to the semantic bilingual route map without changing the existing Founder pair.
2. Extend foundation navigation paths with studio while retaining founder.
3. Define a narrow StudioPageContent contract shaped for the approved page, not a generic CMS schema.
4. Add exact approved Spanish and English copy by importing it from PAGE-STUDIO decisions into the route-owned modules without paraphrase.
5. Keep action destinations semantic and typed.
6. Run the focused tests, then npm test, npm run typecheck, npm run lint, npm run docs:check, and npm run build.

#### Acceptance

- Studio and Founder resolve as separate semantic route pairs.
- Both localized Studio content modules satisfy one typed public contract.
- No visible route or navigation change has shipped.
- No application imagery, CMS abstraction, client localization, or product redesign is introduced.
- The PR is independently reviewable and leaves main deployable.

### PR 2 — Studio experience and navigation integration

**Title:** <code>feat: publish the bilingual Studio experience</code>

#### Files

Create:

- components/studio/StudioPage.tsx
- components/studio/StudioIntroduction.tsx
- components/studio/StudioAccountability.tsx
- components/studio/StudioPrinciples.tsx
- components/studio/StudioFounderBridge.tsx
- components/studio/StudioFinalCta.tsx
- app/(es)/estudio/page.tsx
- app/(en)/en/about/page.tsx
- tests/e2e/studio-founder.spec.ts
- tests/e2e/visual/studio.visual.spec.ts
- reviewed Studio snapshot files generated by Playwright

Modify:

- components/foundation/SiteHeader.tsx
- components/foundation/SiteFooter.tsx
- tests/e2e/support/paths.ts
- tests/e2e/smoke.spec.ts
- tests/e2e/responsive.spec.ts or playwright.config.ts only as needed to run exact 320 and 768 states once in Chromium
- tests/e2e/accessibility.spec.ts
- scripts/verify-static-export.mjs
- all existing Spanish and English route entry files that supply renamed header/footer labels:
  - app/(es)/page.tsx
  - app/(es)/servicios/page.tsx
  - app/(es)/proyectos/page.tsx
  - app/(es)/proyectos/[projectSlug]/page.tsx
  - app/(es)/contacto/page.tsx
  - app/(es)/estudio/samuel-furlanich/page.tsx
  - app/(en)/en/page.tsx
  - app/(en)/en/services/page.tsx
  - app/(en)/en/work/page.tsx
  - app/(en)/en/work/[projectSlug]/page.tsx
  - app/(en)/en/contact/page.tsx
  - app/(en)/en/about/samuel-furlanich/page.tsx

Do not create a shared route-shell abstraction merely to reduce this explicit prop update.

#### Taste preflight

Record a short preflight in the PR description before production code:

- the 7/12 plus 5/12 intro remains editorial and factual;
- section surfaces provide rhythm without identical card stacking;
- the accountability section makes founder-led responsibility feel capable, not small;
- principle blocks do not repeat the Services process timeline;
- no generic agency hero, fake team, or decorative media is introduced.

#### RED

Add browser and artifact tests first:

1. Both Studio URLs load, have exactly one H1, and render the approved localized heading.
2. Language switching maps Studio to Studio in the other locale.
3. Studio Contact and Founder actions resolve to their equivalent localized routes.
4. The desktop and mobile primary navigation label El estudio / About resolves to Studio rather than Founder.
5. The footer professional context still exposes Founder as a distinct internal destination beside LinkedIn and GitHub.
6. The static verifier expects both new HTML artifacts, their internal references, and the updated total route inventory.
7. The exact responsive matrix has no horizontal document overflow and preserves narrative-before-panel source order.
8. Axe has no critical or serious findings on both Studio routes.
9. Record expected missing-route/navigation/artifact failures.

#### GREEN

1. Build StudioPage as a Server Component using the route-owned content.
2. Compose coherent sections. Keep Location/Availability within StudioPage unless extraction adds actual layout responsibility; do not create a component merely for its heading.
3. Implement the wide 7/12 plus 5/12 intro at 1024px and above; stack text then panel below.
4. Render accountability and collaborator copy together on Surface.
5. Render principles as restrained editorial blocks: one column below 768px, two columns at and above 768px.
6. Render the location band, Founder bridge, and established final CTA in approved sequence.
7. Point header/footer commercial navigation at Studio. Add the internal Founder profile link only in the footer professional group.
8. Prefer same-tab LinkedIn/GitHub footer links, or provide localized new-tab context if preserving new-tab behavior.
9. Add both explicit route pages and metadata consistent with existing route patterns.
10. Update static-export artifact verification for 18 generated pages.
11. Add reviewed Studio wide and compact snapshots.

#### Verification

Focused:

- npm test
- npx playwright test tests/e2e/smoke.spec.ts --project=chromium-desktop
- npx playwright test tests/e2e/studio-founder.spec.ts
- npm run test:a11y
- npm run build
- npm run verify:static-export

Cross-browser and basePath:

- npx playwright test tests/e2e/smoke.spec.ts --project=chromium-desktop --project=firefox-desktop --project=webkit-desktop
- npm run test:e2e
- PowerShell: run <code>$env:NEXT_PUBLIC_BASE_PATH = '/Portfolio'; npm run build; npm run verify:static-export</code>
- Run the basePath-aware Studio browser cases with NEXT_PUBLIC_BASE_PATH=/Portfolio

Manual:

- Spanish and English at all five required widths;
- 200% text zoom;
- keyboard and visible-focus order;
- reduced-motion setting;
- screenshots compared with PAGE-STUDIO and DESIGN records;
- Taste audit.

#### Acceptance

- Studio is public in both locales and is the primary About navigation target.
- Founder remains reachable and semantically distinct.
- Layout, copy, surfaces, responsive behavior, axe, and visual baselines match the approved records.
- No placeholder portrait, stock image, statistics panel, new client runtime, or architecture expansion exists.

### PR 3 — Founder completion

**Title:** <code>feat: complete the bilingual Founder profile</code>

#### Files

Create:

- components/founder/content-types.ts
- components/founder/FounderPage.tsx
- components/founder/FounderHeader.tsx
- components/founder/FounderProfessionalHistory.tsx
- components/founder/FounderCapabilities.tsx
- components/founder/FounderProjectsBridge.tsx
- components/founder/FounderProfessionalLinks.tsx
- components/founder/FounderFinalCta.tsx
- tests/e2e/visual/founder.visual.spec.ts
- reviewed Founder snapshot files generated by Playwright

Modify:

- app/(es)/_content/founder.ts
- app/(en)/en/_content/founder.ts
- app/(es)/estudio/samuel-furlanich/page.tsx
- app/(en)/en/about/samuel-furlanich/page.tsx
- components/foundation/FounderProfile.tsx, removing it after callers move to FounderPage
- components/foundation/content-types.ts, removing Founder-only contracts after migration
- scripts/foundation-content.test.mjs
- scripts/verify-static-export.mjs
- tests/e2e/studio-founder.spec.ts
- tests/e2e/accessibility.spec.ts
- playwright.config.ts only if required for the two Founder visual states

Retain the existing public CV file unchanged.

#### Taste preflight

Record risks before code:

- recruiter-style resume homepage;
- biography duplication with Studio;
- card stack monotony;
- ornate timeline treatment;
- capability logo wall;
- GitHub ending the page as the dominant action.

#### RED

1. Extend content tests to require:
   - approved detailed localized biography;
   - exactly two authorized experience entries with period, role/context, and concise summary;
   - exactly two factual education entries;
   - exactly four capability groups;
   - one Projects bridge;
   - CV, LinkedIn, GitHub, and commercial Contact actions;
   - no timeline entry or endorsement field for Clever Soft SA;
   - no portrait field while the portrait decision is deferred.
2. Add browser tests for:
   - both Founder routes and equivalent language switching;
   - one H1 and correct section hierarchy;
   - Projects bridge and final Contact CTA;
   - CV link path at normal root and /Portfolio;
   - LinkedIn and GitHub exact URLs;
   - logical keyboard order across professional actions;
   - dates remaining associated with the correct experience at compact widths.
3. Extend axe coverage to both Founder locales.
4. Record expected failures against the current minimum profile.

#### GREEN

1. Replace the minimum foundation Founder model with a dedicated narrow FounderPageContent contract.
2. Preserve the approved biography verbatim and keep Clever Soft SA only in that narrative.
3. Render a text-led header; do not allocate an empty media column.
4. Place Professional Links directly after the header: CV primary, LinkedIn and GitHub secondary.
5. Render experience editorially with a narrow period column at wide widths and period-before-role source order on compact layouts.
6. Render education factually and with lower visual weight than professional work.
7. Render four semantic capability groups without scores, logo wall, marquee, or redundant technology section.
8. Add the single Projects bridge and established final Contact CTA.
9. Keep CV content unchanged. Preserve the approved exact professional URLs.
10. Add Founder wide and compact reviewed snapshots.

#### Verification

- npm test
- npx playwright test tests/e2e/studio-founder.spec.ts
- npm run test:a11y
- npm run test:e2e
- npm run build
- npm run verify:static-export
- repeat build, static verification, and the CV browser case with NEXT_PUBLIC_BASE_PATH=/Portfolio
- validate the public file begins with a PDF signature and remains parseable using the repository's documented CV check
- interactively confirm the LinkedIn URL targets the intended profile when the environment permits; an authentication wall is not evidence of a wrong owner-approved URL
- manually inspect both locales at all five viewports, 200% text zoom, keyboard focus, and reduced motion
- run Taste audit and inspect both new visual baselines

#### Acceptance

- Founder has the approved professional depth without becoming a legacy portfolio homepage.
- Portrait absence is intentional and produces no empty layout.
- Experience, education, capabilities, Projects, CV, professional links, and Contact hierarchy are complete.
- Normal-root and basePath CV behavior pass.
- No facts, endorsements, or unsupported project claims were invented.

### PR 4 — Cross-page integration, evidence links, and completion verification

**Title:** <code>feat: integrate Studio and Founder journeys</code>

#### Files

Modify as needed and only with the exact approved copy:

- components/foundation/MinimumDestination.tsx or a more specific existing Contact composition if repository state has changed
- app/(es)/_content/contact.ts
- app/(en)/en/_content/contact.ts
- components/projects/content-types.ts
- components/projects/ProjectDetailPage.tsx
- lib/projects/publication.ts
- app/(es)/_content/projects.ts
- app/(en)/en/_content/projects.ts
- scripts/foundation-content.test.mjs
- scripts/projects-publication.test.mjs
- tests/e2e/smoke.spec.ts
- tests/e2e/studio-founder.spec.ts
- tests/e2e/accessibility.spec.ts
- docs/product/status.md
- ARCHITECTURE.md
- docs/index.md
- docs/plans/index.md
- this plan, moving it to docs/plans/completed/studio-founder-completion.md only when all acceptance evidence is present
- docs/superpowers/plans/2026-09-08-studio-founder-completion.md, updating its pointer to the completed path

Audit, but do not delete without verified zero consumers:

- data/about.json
- data/experience.json
- data/education.json
- data/skills.json
- lib/data.ts
- lib/types.ts

#### RED

1. Add a Contact behavior test requiring the subdued localized Founder context link after direct contact choices and response expectations.
2. Add publication-contract tests requiring the approved Founder context action only for GRS and The-System in both locales.
3. Assert MPC and every other public project have no Founder relationship action unless their evidence owner is separately updated first.
4. Add browser tests for the Contact and eligible-project Founder journeys in both locales.
5. Record expected missing-link failures.

#### GREEN

1. Add the Contact Founder context action after the direct contact content without competing with the commercial actions.
2. Extend the public project-detail content with one optional semantic Founder action.
3. Populate it only for GRS and The-System, whose authoritative records identify founder-published work.
4. Do not infer sole authorship for MPC or expose any private/blocked project.
5. Render the optional link as restrained context; do not add a Founder card to every project.
6. Audit cross-page links and localization across Homepage, Services, Projects, Studio, Founder, Contact, header, footer, and language switch.
7. Remove legacy Founder data only when repository search and tests prove no runtime, build, documentation, or migration consumer remains. Otherwise leave it and record the reason in the PR.
8. Do not alter CV content.

#### Full verification

Fresh evidence is mandatory immediately before the PR is declared ready:

- npm run docs:check
- npm run skills:check
- npm test
- npm run lint
- npm run typecheck
- npm run build
- npm run verify:static-export
- npm run test:a11y
- npm run test:e2e
- npm run test:frontend
- npm run validate

Repeat the build, static-export verification, and relevant browser tests with NEXT_PUBLIC_BASE_PATH=/Portfolio.

Review:

- Chromium route and responsive matrix at 320, 390, 768, 1024, and 1440;
- Firefox and WebKit critical routes and navigation;
- all four axe targets;
- manual headings, keyboard order, visible focus, mobile navigation, external links, CTA order, 200% zoom, and reduced motion;
- all four visual baselines without automatic updates;
- Taste audit against repository authority;
- full diff against main;
- requirement traceability to PAGE-STUDIO, PAGE-FOUNDER, DESIGN, localization, project evidence, architecture, and tests.

Move the plan to completed and synchronize the indexes/status only after all preceding PRs are merged and this final branch contains the full evidence. Open the PR and stop at human review.

#### Acceptance

- Studio, Founder, Projects, Contact, navigation, footer, and language switching form one coherent bilingual journey.
- Only evidence-authorized project records gain Founder context.
- Root and /Portfolio static exports have no broken internal links or CV path.
- Required deterministic, browser, accessibility, visual, and manual evidence is recorded.
- No consequential architecture blocker remains.
- Documentation reflects the final implemented state without duplicating owning copy.

## Deferred items

- **Founder portrait — DEFERRED.** No approved asset exists. This initiative ships text-led. A future portrait requires an approved real image, content-owner approval, alt-text decision, optimization, and a separately reviewed design change.
- **CV content redesign/update — DEFERRED.** This initiative verifies and exposes the existing PDF but does not rewrite it.
- **Additional Founder project selections — DEFERRED.** The approved design uses one Projects bridge. Contextual project-detail links are limited to GRS and The-System by current evidence.
- **International-client claims, team size, client counts, satisfaction, years, or logo credibility strips — OUT OF SCOPE.** No current evidence authorizes them.
- **New motion/theme/framework/architecture — OUT OF SCOPE.**

## Architecture stop conditions

Pause implementation and open a governance question only if one of these becomes necessary:

- a route cannot be expressed in the current static localized map;
- basePath-compatible CV delivery requires a hosting change;
- approved content cannot remain route-owned without runtime data;
- a new dependency or client runtime is required;
- project evidence requires a new public/private trust model;
- a design requirement conflicts materially with accepted design primitives.

Ordinary component boundaries, narrow content interfaces, responsive CSS, test organization, and use of the existing route resolver are implementation decisions within this plan.

## Completion checklist

- [ ] PR 1 merged: Studio route and content contracts.
- [ ] PR 2 merged: bilingual Studio experience and navigation integration.
- [ ] PR 3 merged: bilingual Founder completion.
- [ ] PR 4 ready for human review: integration, evidence links, full verification, and documentation synchronization.
- [ ] Studio and Founder equivalent-route switching verified.
- [ ] Exact approved ES/EN copy rendered.
- [ ] Visual matrix and four reviewed baselines complete.
- [ ] Axe and manual accessibility evidence complete.
- [ ] CV normal-root and /Portfolio behavior verified.
- [ ] LinkedIn and GitHub targets verified.
- [ ] Portrait and CV-content deferrals remain explicit.
- [ ] No RFC/ADR or architecture blocker was introduced.
- [ ] Plan moved to completed only with fresh passing evidence.

## First implementation task

After this planning PR is approved and merged, create exactly one branch from the then-current main and execute:

**PR 1 — Studio route and content contracts**

Start by changing <code>scripts/site-routes.test.mjs</code> and creating <code>scripts/studio-content.test.mjs</code>. Run them and retain the expected RED output before changing <code>lib/site-routes.ts</code>, navigation contracts, or localized Studio content. Do not create the public Studio route, touch navigation UI, or begin Founder layout work in that PR.
