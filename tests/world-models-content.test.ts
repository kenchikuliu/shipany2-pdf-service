import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CapabilityValues,
  PaperSchema,
  ScenarioValues,
  TopicValues,
  validateUniqueSlugs,
} from '../src/features/world-models/content/schema';
import { loadWorldModelsContent } from '../src/features/world-models/content/loaders';

const basePaper = {
  slug: 'genie-2',
  title_en: 'Genie 2',
  title_zh: 'Genie 2',
  abstract_en: 'A world model for interactive environments.',
  abstract_zh: '一个用于交互环境的世界模型。',
  authors: ['Researcher A'],
  affiliations: ['DeepMind'],
  source_url: 'https://example.com/papers/genie-2',
  paper_venue: 'arXiv',
  publication_date: '2024-12-04',
  year: 2024,
  code_url: 'https://github.com/example/genie-2',
  project_url: 'https://example.com/genie-2',
  topics: ['world-models'],
  capabilities: ['simulation'],
  scenarios: ['research-platforms'],
  importance_level: 'high',
  editorial_summary_zh: '重要世界模型进展。',
  editorial_summary_en: 'A notable world-model release.',
  why_it_matters: 'Shows interactive environment generation.',
  related_project_slugs: ['genie-2-project'],
  related_update_slugs: ['genie-2-release'],
  related_timeline_event_slugs: ['genie-2-milestone'],
  featured: true,
};

test('PaperSchema accepts a valid bilingual paper record', () => {
  const parsed = PaperSchema.parse(basePaper);
  assert.equal(parsed.slug, 'genie-2');
});

test('PaperSchema rejects missing bilingual summary fields', () => {
  assert.throws(
    () =>
      PaperSchema.parse({
        ...basePaper,
        title_zh: '',
      }),
    /title_zh/
  );
});

test('PaperSchema rejects invalid taxonomy values', () => {
  assert.throws(
    () =>
      PaperSchema.parse({
        ...basePaper,
        topics: ['bad-topic'],
      }),
    /Invalid option/
  );
});

test('taxonomy value sets expose the expected world-model categories', () => {
  assert.ok(TopicValues.includes('video-world-models'));
  assert.ok(CapabilityValues.includes('planning'));
  assert.ok(ScenarioValues.includes('robotics'));
});

test('validateUniqueSlugs rejects duplicate records', () => {
  assert.throws(
    () =>
      validateUniqueSlugs('papers', [
        { slug: 'same' },
        { slug: 'same' },
      ]),
    /Duplicate slug/
  );
});

test('loadWorldModelsContent loads and validates starter content', async () => {
  const content = await loadWorldModelsContent();

  assert.ok(content.topics.length >= 6);
  assert.ok(content.papers.length >= 10);
  assert.ok(content.projects.length >= 5);
  assert.ok(content.updates.length >= 8);
  assert.ok(content.timeline.length >= 6);

  for (const paper of content.papers) {
    for (const slug of paper.related_project_slugs) {
      assert.ok(content.projects.some((project) => project.slug === slug));
    }
  }
});
