# World Models Navigation Site Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `shipany-2-navigation` into a bilingual world-models topic site with a new homepage, papers/projects/updates/timeline/topic routes, and a local structured editorial content system for version 1.

**Architecture:** Keep version 1 file-based and schema-validated. Reuse the existing Next.js App Router, locale routing, and translation system, but add a dedicated `world-models` content layer instead of forcing the current navigation-item database model to represent papers and updates. Build pages from local collections first, then leave hooks for later semi-automatic ingestion.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `next-intl`, `zod`, existing `fumadocs-mdx` setup, repo-local content files, existing ESLint/typecheck scripts.

---

## File Structure

New implementation units:

- `src/features/world-models/content/schema.ts`
  Purpose: define the canonical `Paper`, `Project`, `Update`, `TimelineEvent`, and `Topic` schemas with `zod`.
- `src/features/world-models/content/loaders.ts`
  Purpose: load and validate file-based content collections from repo-local data files.
- `src/features/world-models/content/queries.ts`
  Purpose: compute filtered lists, featured sections, topic pages, and related content links.
- `src/features/world-models/types.ts`
  Purpose: shared domain types inferred from the schemas.
- `src/features/world-models/constants.ts`
  Purpose: initial taxonomy, topic metadata, and homepage section limits.
- `src/features/world-models/components/*`
  Purpose: page-level and shared UI blocks for hero, topic grid, timeline list, paper cards, update cards, filters, and detail sections.
- `src/features/world-models/seo.ts`
  Purpose: metadata helpers for the new route family.
- `content/world-models/papers/*.json`
  Purpose: local bilingual paper records.
- `content/world-models/projects/*.json`
  Purpose: local bilingual project records.
- `content/world-models/updates/*.json`
  Purpose: local bilingual update records.
- `content/world-models/timeline/*.json`
  Purpose: local bilingual milestone records.
- `content/world-models/topics/*.json`
  Purpose: local topic metadata and descriptions.
- `content/world-models/README.md`
  Purpose: editorial guide for data entry.
- `src/app/[locale]/(directory)/page.tsx`
  Purpose: replace generic directory homepage with world-models homepage.
- `src/app/[locale]/(landing)/updates/page.tsx`
  Purpose: adapt the current updates page to world-models updates.
- `src/app/[locale]/(landing)/papers/page.tsx`
  Purpose: paper index.
- `src/app/[locale]/(landing)/projects/page.tsx`
  Purpose: project index.
- `src/app/[locale]/(landing)/timeline/page.tsx`
  Purpose: timeline index.
- `src/app/[locale]/(landing)/topics/[slug]/page.tsx`
  Purpose: topic hub page.
- `src/app/[locale]/(landing)/papers/[slug]/page.tsx`
  Purpose: paper detail page.
- `src/app/[locale]/(landing)/about/page.tsx`
  Purpose: site about page.
- `src/config/locale/messages/en/directory.json`
  Purpose: homepage copy.
- `src/config/locale/messages/zh/directory.json`
  Purpose: homepage copy.
- `src/config/locale/messages/en/pages/*.json`
  Purpose: translations for papers, projects, timeline, about, topic pages.
- `src/config/locale/messages/zh/pages/*.json`
  Purpose: translations for papers, projects, timeline, about, topic pages.
- `tests/world-models-content.test.ts`
  Purpose: schema validation and content integrity checks.
- `tests/world-models-queries.test.ts`
  Purpose: coverage for homepage sections, topic filtering, and relation resolution.

Existing files likely to inspect while implementing:

- `source.config.ts`
- `src/config/locale/index.ts`
- `src/core/i18n/request.ts`
- `src/app/[locale]/(directory)/_components/*`
- `src/shared/lib/seo.ts`
- `src/app/[locale]/(landing)/updates/page.tsx`
- `src/shared/models/post.tsx`

## Task 1: Establish the World-Models Domain Layer

**Files:**
- Create: `src/features/world-models/content/schema.ts`
- Create: `src/features/world-models/content/loaders.ts`
- Create: `src/features/world-models/content/queries.ts`
- Create: `src/features/world-models/types.ts`
- Create: `src/features/world-models/constants.ts`
- Test: `tests/world-models-content.test.ts`
- Test: `tests/world-models-queries.test.ts`

- [ ] **Step 1: Write the failing schema test**

Create `tests/world-models-content.test.ts` with coverage for:
- valid bilingual paper record parses successfully
- missing required Chinese or English fields fails
- invalid taxonomy value fails
- duplicate slug detection fails

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/world-models-content.test.ts`

Expected: FAIL because the new schema and loaders do not exist yet.

- [ ] **Step 3: Write the minimal schema implementation**

Implement:
- taxonomy enums for topics, capabilities, scenarios
- `PaperSchema`
- `ProjectSchema`
- `UpdateSchema`
- `TimelineEventSchema`
- `TopicSchema`

Keep version 1 YAGNI:
- no database coupling
- no admin-only draft workflow in this layer
- no remote fetch logic yet

- [ ] **Step 4: Add file-based loaders**

Implement loader helpers that:
- read JSON files under `content/world-models/*`
- validate with `zod`
- produce stable sorted arrays
- expose helpers like `getAllPapers`, `getAllProjects`, `getAllUpdates`, `getAllTimelineEvents`, `getAllTopics`

- [ ] **Step 5: Add query helpers**

Implement query helpers for:
- featured homepage paper list
- weekly update list
- topic-specific paper/project/update/timeline views
- paper detail relation resolution
- timeline preview extraction

- [ ] **Step 6: Run tests to verify they pass**

Run:
- `pnpm test tests/world-models-content.test.ts`
- `pnpm test tests/world-models-queries.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add tests/world-models-content.test.ts tests/world-models-queries.test.ts src/features/world-models
git commit -m "feat: add world models domain layer"
```

## Task 2: Seed Initial Content and Editorial Rules

**Files:**
- Create: `content/world-models/README.md`
- Create: `content/world-models/papers/*.json`
- Create: `content/world-models/projects/*.json`
- Create: `content/world-models/updates/*.json`
- Create: `content/world-models/timeline/*.json`
- Create: `content/world-models/topics/*.json`
- Test: `tests/world-models-content.test.ts`

- [ ] **Step 1: Write a failing fixture-integrity test**

Extend `tests/world-models-content.test.ts` to require:
- at least 6 topic records
- at least 10 paper records
- at least 8 update records
- at least 6 timeline events
- all related slugs resolve

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/world-models-content.test.ts`

Expected: FAIL because the content files do not exist yet.

- [ ] **Step 3: Create the editorial README**

Document:
- file naming convention
- slug rules
- bilingual field expectations
- date formatting
- taxonomy rules
- “featured” usage
- review checklist for weekly additions

- [ ] **Step 4: Add starter topic records**

Seed topics for:
- world-models
- video-world-models
- embodied-world-models
- robotics-world-models
- driving-world-models
- game-environment-world-models
- agentic-planning

- [ ] **Step 5: Add starter papers, projects, updates, and timeline data**

Use the approved spec direction:
- papers around world models and adjacent milestone work
- projects from major organizations
- recent updates relevant to the field
- milestone timeline events

Do not try to import everything. Curate a credible starter set only.

- [ ] **Step 6: Run the content tests**

Run: `pnpm test tests/world-models-content.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add content/world-models tests/world-models-content.test.ts
git commit -m "feat: add world models starter content"
```

## Task 3: Rebuild the Homepage as a World-Models Landing Page

**Files:**
- Modify: `src/app/[locale]/(directory)/page.tsx`
- Create: `src/features/world-models/components/world-models-hero.tsx`
- Create: `src/features/world-models/components/world-models-this-week.tsx`
- Create: `src/features/world-models/components/world-models-topic-grid.tsx`
- Create: `src/features/world-models/components/world-models-timeline-preview.tsx`
- Create: `src/features/world-models/components/world-models-paper-grid.tsx`
- Create: `src/features/world-models/components/world-models-project-grid.tsx`
- Modify: `src/config/locale/messages/en/directory.json`
- Modify: `src/config/locale/messages/zh/directory.json`
- Test: `tests/world-models-queries.test.ts`

- [ ] **Step 1: Write the failing homepage query test**

Add test assertions that the homepage data builder returns:
- one hero payload
- 5 weekly updates
- topic grid items
- timeline preview items
- featured paper list
- featured project list

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/world-models-queries.test.ts`

Expected: FAIL because the homepage assembler does not exist yet.

- [ ] **Step 3: Implement homepage data assembly**

Add a query helper that returns the exact homepage payload needed by the page.

- [ ] **Step 4: Build focused homepage components**

Do not keep generic “submit your product” directory language.
Replace it with world-models-specific sections:
- hero
- this week
- topic grid
- timeline preview
- must-read papers
- notable projects

- [ ] **Step 5: Replace homepage copy**

Update `directory.json` for both `en` and `zh` so the directory homepage becomes the world-models homepage in both languages.

- [ ] **Step 6: Run tests and static verification**

Run:
- `pnpm test tests/world-models-queries.test.ts`
- `pnpm typecheck`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/(directory)/page.tsx src/features/world-models/components src/config/locale/messages/en/directory.json src/config/locale/messages/zh/directory.json tests/world-models-queries.test.ts
git commit -m "feat: build world models homepage"
```

## Task 4: Build the Updates, Papers, Projects, and Timeline Index Pages

**Files:**
- Modify: `src/app/[locale]/(landing)/updates/page.tsx`
- Create: `src/app/[locale]/(landing)/papers/page.tsx`
- Create: `src/app/[locale]/(landing)/projects/page.tsx`
- Create: `src/app/[locale]/(landing)/timeline/page.tsx`
- Create: `src/features/world-models/components/world-models-page-header.tsx`
- Create: `src/features/world-models/components/world-models-filters.tsx`
- Create: `src/features/world-models/components/world-models-update-list.tsx`
- Create: `src/features/world-models/components/world-models-timeline-list.tsx`
- Modify: `src/config/locale/messages/en/pages/updates.json`
- Modify: `src/config/locale/messages/zh/pages/updates.json`
- Create: `src/config/locale/messages/en/pages/papers.json`
- Create: `src/config/locale/messages/zh/pages/papers.json`
- Create: `src/config/locale/messages/en/pages/projects.json`
- Create: `src/config/locale/messages/zh/pages/projects.json`
- Create: `src/config/locale/messages/en/pages/timeline.json`
- Create: `src/config/locale/messages/zh/pages/timeline.json`
- Test: `tests/world-models-queries.test.ts`

- [ ] **Step 1: Write failing route-data tests**

Cover:
- updates page sorts newest-first
- papers page filters by year/topic/scenario
- projects page filters by type/topic/scenario
- timeline page groups chronologically

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/world-models-queries.test.ts`

Expected: FAIL

- [ ] **Step 3: Implement index page queries**

Add route-level helpers for:
- updates listing
- paper listing
- project listing
- timeline listing

Keep version 1 server-rendered and simple. Do not add client-side search before it is needed.

- [ ] **Step 4: Implement the pages and shared list UI**

Keep filtering minimal and useful:
- time
- topic
- scenario
- importance or type where relevant

- [ ] **Step 5: Add bilingual page copy and metadata**

Populate page headings, descriptions, empty states, and filter labels in `en` and `zh`.

- [ ] **Step 6: Run verification**

Run:
- `pnpm test tests/world-models-queries.test.ts`
- `pnpm typecheck`
- `pnpm lint`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/(landing)/updates/page.tsx src/app/[locale]/(landing)/papers/page.tsx src/app/[locale]/(landing)/projects/page.tsx src/app/[locale]/(landing)/timeline/page.tsx src/features/world-models/components src/config/locale/messages/en/pages src/config/locale/messages/zh/pages tests/world-models-queries.test.ts
git commit -m "feat: add world models listing pages"
```

## Task 5: Build Topic and Paper Detail Pages

**Files:**
- Create: `src/app/[locale]/(landing)/topics/[slug]/page.tsx`
- Create: `src/app/[locale]/(landing)/papers/[slug]/page.tsx`
- Create: `src/features/world-models/components/world-models-topic-layout.tsx`
- Create: `src/features/world-models/components/world-models-paper-detail.tsx`
- Create: `src/features/world-models/components/world-models-related-content.tsx`
- Create: `src/features/world-models/seo.ts`
- Create: `src/config/locale/messages/en/pages/topics.json`
- Create: `src/config/locale/messages/zh/pages/topics.json`
- Create: `src/config/locale/messages/en/pages/paper-detail.json`
- Create: `src/config/locale/messages/zh/pages/paper-detail.json`
- Test: `tests/world-models-queries.test.ts`

- [ ] **Step 1: Write failing relation-resolution tests**

Cover:
- topic page only includes matching papers, projects, updates, and timeline events
- paper detail resolves related project/update/timeline records
- missing slugs return null or not-found behavior

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/world-models-queries.test.ts`

Expected: FAIL

- [ ] **Step 3: Implement topic page queries**

Each topic page should assemble:
- definition
- latest updates
- core papers
- notable projects
- timeline highlights

- [ ] **Step 4: Implement paper detail queries and layout**

Each paper detail page should show:
- bilingual title and summary
- authors and affiliations
- links to paper/code/project
- topic/capability/scenario tags
- “why it matters”
- related content

- [ ] **Step 5: Add metadata helpers**

Implement page metadata helpers so topic and paper pages have meaningful titles and descriptions in both languages.

- [ ] **Step 6: Run verification**

Run:
- `pnpm test tests/world-models-queries.test.ts`
- `pnpm typecheck`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/(landing)/topics src/app/[locale]/(landing)/papers/[slug] src/features/world-models src/config/locale/messages/en/pages src/config/locale/messages/zh/pages tests/world-models-queries.test.ts
git commit -m "feat: add world models topic and paper detail pages"
```

## Task 6: Replace Generic Branding and Add the About Page

**Files:**
- Create: `src/app/[locale]/(landing)/about/page.tsx`
- Create: `src/config/locale/messages/en/pages/about.json`
- Create: `src/config/locale/messages/zh/pages/about.json`
- Modify: `src/config/locale/messages/en/landing.json`
- Modify: `src/config/locale/messages/zh/landing.json`
- Modify: any nav config files discovered during implementation
- Test: route smoke checks via typecheck and build

- [ ] **Step 1: Write a failing smoke expectation**

Add a simple test or assertion helper verifying:
- main nav includes the new content routes
- no remaining homepage CTA points to “submit your product” where it should point to world-models sections

- [ ] **Step 2: Run the check to verify it fails**

Run: targeted test or `pnpm typecheck` if nav constants are compile-time driven.

Expected: FAIL or unresolved references.

- [ ] **Step 3: Implement About page and navigation updates**

The About page should explain:
- what the site tracks
- how the weekly editorial cycle works
- what counts as world-models content
- how users can suggest additions later

- [ ] **Step 4: Replace remaining generic navigation copy**

Update site-level nav labels so the experience feels like one coherent product, not a template with a custom homepage.

- [ ] **Step 5: Run verification**

Run:
- `pnpm typecheck`
- `pnpm lint`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/(landing)/about/page.tsx src/config/locale/messages/en src/config/locale/messages/zh
git commit -m "feat: align branding for world models site"
```

## Task 7: Final Verification and Launch Readiness Pass

**Files:**
- Modify: any small fixes found during verification
- Document: optional additions to `docs/superpowers/specs/2026-04-16-world-models-navigation-design.md` if reality diverges

- [ ] **Step 1: Run full project verification**

Run:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Expected: PASS

- [ ] **Step 2: Manually inspect key routes**

Check:
- `/`
- `/updates`
- `/papers`
- `/projects`
- `/timeline`
- `/topics/world-models`
- one paper detail page
- `/about`

- [ ] **Step 3: Fix any last-mile issues**

Limit fixes to launch blockers:
- broken links
- missing translations
- invalid metadata
- rendering issues
- schema/content mismatches

- [ ] **Step 4: Re-run full verification**

Run:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: finalize world models navigation launch"
```

## Notes for Execution

- Prefer local file-based content for version 1. Do not build a database-backed editorial system yet.
- Reuse the existing locale-message pattern in `src/config/locale/messages`.
- Reuse visual primitives from the template where they fit, but remove directory-specific wording and assumptions.
- Keep filters server-side and simple. Do not add client-side full-text search in version 1.
- Do not attempt source ingestion automation in the first implementation pass. Leave clear extension points only.
- Seed content quality matters more than content volume.

## Review Constraint

This environment supports subagents in principle, but current session rules do not authorize spawning them unless explicitly requested by the user. Because of that, the normal subagent review loop for this plan was not run here. If you want, the next step can still execute this plan directly in the current session.
