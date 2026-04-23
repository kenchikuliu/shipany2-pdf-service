# World Models Navigation Site Design

Date: 2026-04-16
Project: `shipany-2-navigation`
Status: Approved in conversation, pending written spec review

## 1. Goal

Build a bilingual Chinese and English navigation site focused on world models.

The site should combine:

- research papers
- related projects and demos
- weekly progress updates
- a milestone timeline

This is not a generic AI directory. It is a topic-specific site for tracking the world model field across research and industry.

## 2. Target Users

Primary users:

- AI practitioners
- investors and operators following AI infrastructure and product trends

Secondary users:

- general readers and creators who need readable summaries instead of raw papers

The product should therefore lead with clear summaries and trend signals, then offer deeper paper and project detail pages.

## 3. Product Positioning

Recommended positioning:

- outward form: topic navigation site
- internal structure: knowledge base
- update mechanism: intelligence feed with editorial review

This avoids three common failures:

- becoming a shallow directory with no point of view
- becoming a paper dump that is hard to browse
- becoming a noisy news stream with no durable value

## 4. Version 1 Scope

Version 1 includes four core content types:

- papers
- projects
- updates
- timeline events

Version 1 excludes:

- user accounts
- community submissions workflow
- newsletters
- saved lists
- advanced personalization
- auto-publishing without review

## 5. Site Structure

Top-level routes for version 1:

- `/`
- `/updates`
- `/papers`
- `/projects`
- `/timeline`
- `/topics/[slug]`
- `/paper/[slug]`
- `/about`

Future routes that are intentionally deferred:

- `/project/[slug]`
- `/submit`
- `/newsletter`
- `/compare`

## 6. Homepage Structure

The homepage should not mimic a generic resource directory with a flat card wall. It should tell a story about the field.

Recommended section order:

1. Hero
2. This Week
3. Topic Grid
4. Timeline Preview
5. Must-Read Papers
6. Notable Projects
7. Submission and subscription CTA

Hero should clearly answer:

- what world models are
- why this site exists
- who it is for

`This Week` should show the 5 highest-signal developments from the latest editorial cycle.

`Topic Grid` should link to the main topic clusters:

- video world models
- embodied and robotics world models
- autonomous driving world models
- game and environment simulators
- agentic planning and long-horizon reasoning

`Timeline Preview` should highlight milestone papers, systems, and releases that help users understand the field quickly.

## 7. Content Model

### 7.1 Paper

Required fields:

- slug
- title_en
- title_zh
- abstract_en
- abstract_zh
- authors
- affiliations
- source_url
- paper_venue
- publication_date
- year
- code_url
- project_url
- topics
- capabilities
- scenarios
- importance_level
- editorial_summary_zh
- editorial_summary_en
- why_it_matters
- related_project_slugs
- related_update_slugs
- related_timeline_event_slugs
- featured

### 7.2 Project

Required fields:

- slug
- name
- description_en
- description_zh
- type
- organization
- source_url
- demo_url
- repo_url
- release_date
- topics
- capabilities
- scenarios
- maturity
- related_paper_slugs
- related_update_slugs
- editorial_summary_zh
- editorial_summary_en
- featured

Project `type` should initially support:

- open-source
- product
- demo
- benchmark
- dataset
- framework

### 7.3 Update

Required fields:

- slug
- title_en
- title_zh
- date
- source_name
- source_url
- update_type
- summary_en
- summary_zh
- importance_level
- topics
- related_paper_slugs
- related_project_slugs
- related_company_names
- published

`update_type` should initially support:

- paper
- model release
- product release
- benchmark
- funding
- interview
- company blog
- survey

### 7.4 Timeline Event

Required fields:

- slug
- title_en
- title_zh
- date
- description_en
- description_zh
- event_type
- related_paper_slugs
- related_project_slugs
- related_org_names
- why_it_matters
- featured

## 8. Taxonomy

The taxonomy must stay small and useful. Version 1 should use only three classification dimensions.

### 8.1 Topics

Initial topic set:

- world-models
- video-world-models
- embodied-world-models
- robotics-world-models
- driving-world-models
- game-environment-world-models
- agentic-planning

### 8.2 Capabilities

Initial capability set:

- prediction
- simulation
- planning
- action-conditioned-generation
- long-horizon-reasoning
- controllable-environment-generation

### 8.3 Scenarios

Initial scenario set:

- robotics
- autonomous-driving
- gaming
- video-generation
- agents
- research-platforms

Filter priority should be:

- time
- topic
- scenario
- importance

## 9. Editorial Model

The product uses a semi-automatic intake pipeline and manual publishing review.

Workflow:

1. Collect candidates from external sources
2. Normalize into internal draft records
3. Review and tag manually
4. Publish approved items
5. Generate weekly update collection

This workflow is necessary because fully automatic publishing will produce too much noise in a fast-moving topic like world models.

## 10. Source Strategy

Version 1 sources should be limited to five buckets:

- arXiv
- GitHub
- official blogs
- Hugging Face
- manually added news and commentary

Suggested source list:

- arXiv queries around world models, embodied world models, video world models, generative simulators
- GitHub repositories linked from papers and major demos
- DeepMind
- Google Research
- NVIDIA
- Meta
- Wayve
- Figure
- Physical Intelligence
- Hugging Face model cards and Spaces

## 11. Bilingual Strategy

The site should be Chinese and English from the beginning, but not every sentence needs fully independent editorial treatment in version 1.

Recommended rule:

- canonical records store both Chinese and English display fields
- Chinese can be slightly more editorial and explanatory
- English can initially be cleaner and shorter

This keeps the bilingual promise while controlling the editorial burden.

## 12. Template Choice

Recommended base template:

- `shipany-2-navigation`

Rationale:

- closer to a discovery product than a SaaS dashboard
- better fit for a content-first topic site
- less structural rework than the generic SaaS template
- newer than the older ShipAny v1 template

Rejected alternatives:

- `shipany-2`: too SaaS-oriented
- `mkdirs`: strong directory DNA, but weaker fit for updates plus timeline plus topic storytelling

## 13. Technical Direction

Version 1 should favor simple maintainable content storage over premature automation complexity.

Recommended implementation direction:

- use local structured content files for papers, projects, updates, and timeline items
- keep schemas explicit and validated
- generate index pages and topic pages from content collections
- add editorial scripts later for import and review

This allows fast launch, easy review, and Git-based editing history.

Phase 2 can add a proper ingestion database and moderation panel if the editorial volume increases.

## 14. Page-Level Behavior

### 14.1 Updates Page

Purpose:

- weekly and monthly browsing
- fast awareness of recent movement

Needs:

- date filters
- topic filters
- source filters
- importance badges

### 14.2 Papers Page

Purpose:

- durable research discovery

Needs:

- year filter
- topic filter
- scenario filter
- featured papers lane

### 14.3 Projects Page

Purpose:

- connect research to implementations and products

Needs:

- project type filter
- scenario filter
- related paper references

### 14.4 Timeline Page

Purpose:

- explain the evolution of the field to non-experts quickly

Needs:

- chronological grouping
- visual emphasis on milestone events
- direct jumps to related papers and projects

### 14.5 Topic Page

Purpose:

- become the highest-value SEO and navigation page type

Each topic page should combine:

- topic definition
- latest updates
- core papers
- notable projects
- timeline highlights

## 15. Success Criteria

Version 1 is successful if it achieves:

- users can understand the world model field in under 5 minutes from the homepage and timeline
- users can find major papers by topic and year without external search
- users can track weekly movement without reading raw source feeds
- the editorial workflow is sustainable on a weekly cadence

## 16. Risks

Key product risks:

- taxonomy becomes too broad too early
- source automation creates too much low-value content
- bilingual maintenance slows publishing
- homepage becomes cluttered and loses editorial hierarchy

Mitigations:

- keep taxonomy intentionally small
- require review before publishing
- write short summaries first, expand later
- enforce homepage section priority

## 17. Implementation Phases

### Phase 1

- adapt `shipany-2-navigation` branding and IA
- add content schemas
- build homepage
- build updates, papers, projects, timeline, topic pages
- seed with curated starter content

### Phase 2

- add import scripts for candidate collection
- build draft review workflow
- produce weekly digest pages

### Phase 3

- add newsletter or subscription
- add submission flow
- add richer project detail pages

## 18. Current Recommendation

Proceed with:

- `shipany-2-navigation` as the base
- version 1 focused on papers, projects, updates, and timeline
- bilingual Chinese and English content
- weekly update cadence
- semi-automatic intake with manual editorial review
