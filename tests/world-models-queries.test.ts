import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPaperBySlug,
  getProjectBySlug,
  getTopicBySlug,
  getTopicPageData,
  getUpdateBySlug,
  getWorldModelsHomepageData,
} from '../src/features/world-models/content/queries';

test('getWorldModelsHomepageData assembles homepage sections', async () => {
  const data = await getWorldModelsHomepageData();

  assert.equal(data.weeklyUpdates.length, 5);
  assert.ok(data.topicGrid.length >= 5);
  assert.ok(data.timelinePreview.length >= 5);
  assert.ok(data.featuredPapers.length >= 4);
  assert.ok(data.featuredProjects.length >= 4);
});

test('getTopicPageData resolves a topic with related content', async () => {
  const topic = await getTopicBySlug('video-world-models');
  assert.ok(topic);

  const pageData = await getTopicPageData('video-world-models');
  assert.ok(pageData);
  assert.ok(pageData?.papers.length > 0);
  assert.ok(pageData?.updates.length > 0);
});

test('getPaperBySlug resolves related content', async () => {
  const paper = await getPaperBySlug('genie-2');
  assert.ok(paper);
  assert.ok(paper?.relatedProjects.length > 0);
  assert.ok(paper?.relatedUpdates.length > 0);
  assert.ok(paper?.relatedTimeline.length > 0);
});

test('getProjectBySlug resolves related content', async () => {
  const project = await getProjectBySlug('genie-2-project');
  assert.ok(project);
  assert.ok(project?.relatedPapers.length > 0);
  assert.ok(project?.relatedUpdates.length > 0);
  assert.ok(project?.relatedTopics.length > 0);
});

test('getUpdateBySlug resolves related content', async () => {
  const update = await getUpdateBySlug('genie-2-release');
  assert.ok(update);
  assert.ok(update?.relatedPapers.length > 0);
  assert.ok(update?.relatedProjects.length > 0);
  assert.ok(update?.relatedTopics.length > 0);
});

test('missing slugs return null', async () => {
  assert.equal(await getTopicBySlug('missing-topic'), null);
  assert.equal(await getPaperBySlug('missing-paper'), null);
  assert.equal(await getProjectBySlug('missing-project'), null);
  assert.equal(await getUpdateBySlug('missing-update'), null);
});
