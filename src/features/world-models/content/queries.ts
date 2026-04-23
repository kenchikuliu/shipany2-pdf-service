import { loadWorldModelsContent } from './loaders';

export async function getWorldModelsHomepageData() {
  const content = await loadWorldModelsContent();

  return {
    topicGrid: content.topics.filter((topic) => topic.featured).slice(0, 6),
    weeklyUpdates: content.updates.filter((update) => update.published).slice(0, 5),
    timelinePreview: content.timeline.filter((event) => event.featured).slice(0, 6),
    featuredPapers: content.papers.filter((paper) => paper.featured).slice(0, 6),
    featuredProjects: content.projects
      .filter((project) => project.featured)
      .slice(0, 6),
  };
}

export async function getTopicBySlug(slug: string) {
  const content = await loadWorldModelsContent();
  return content.topics.find((topic) => topic.slug === slug) ?? null;
}

export async function getUpdatesIndexData() {
  const content = await loadWorldModelsContent();
  return content.updates.filter((update) => update.published);
}

export async function getPapersIndexData(topic?: string) {
  const content = await loadWorldModelsContent();
  if (!topic) {
    return content.papers;
  }
  return content.papers.filter((paper) => paper.topics.includes(topic as any));
}

export async function getProjectsIndexData(topic?: string) {
  const content = await loadWorldModelsContent();
  if (!topic) {
    return content.projects;
  }
  return content.projects.filter((project) =>
    project.topics.includes(topic as any)
  );
}

export async function getTimelineIndexData(topic?: string) {
  const content = await loadWorldModelsContent();
  if (!topic) {
    return content.timeline;
  }
  const relatedPapers = content.papers
    .filter((paper) => paper.topics.includes(topic as any))
    .map((paper) => paper.slug);
  const relatedProjects = content.projects
    .filter((project) => project.topics.includes(topic as any))
    .map((project) => project.slug);
  return content.timeline.filter(
    (event) =>
      event.related_paper_slugs.some((slug) => relatedPapers.includes(slug)) ||
      event.related_project_slugs.some((slug) => relatedProjects.includes(slug))
  );
}

export async function getAllTopics() {
  const content = await loadWorldModelsContent();
  return content.topics;
}

export async function getTopicPageData(slug: string) {
  const content = await loadWorldModelsContent();
  const topic = content.topics.find((item) => item.slug === slug);
  if (!topic) {
    return null;
  }

  const topicSlug = topic.slug;

  return {
    topic,
    papers: content.papers.filter((paper) => paper.topics.includes(topicSlug)),
    projects: content.projects.filter((project) =>
      project.topics.includes(topicSlug)
    ),
    updates: content.updates.filter((update) => update.topics.includes(topicSlug)),
    timeline: content.timeline.filter(
      (event) =>
        event.related_paper_slugs.some((paperSlug) =>
          content.papers.some(
            (paper) =>
              paper.slug === paperSlug && paper.topics.includes(topicSlug)
          )
        ) ||
        event.related_project_slugs.some((projectSlug) =>
          content.projects.some(
            (project) =>
              project.slug === projectSlug &&
              project.topics.includes(topicSlug)
          )
        )
    ),
  };
}

export async function getOtherTopics(slug: string) {
  const content = await loadWorldModelsContent();
  return content.topics.filter((topic) => topic.slug !== slug).slice(0, 4);
}

export async function getPaperBySlug(slug: string) {
  const content = await loadWorldModelsContent();
  const paper = content.papers.find((item) => item.slug === slug);
  if (!paper) {
    return null;
  }

  return {
    ...paper,
    relatedProjects: content.projects.filter((project) =>
      paper.related_project_slugs.includes(project.slug)
    ),
    relatedUpdates: content.updates.filter((update) =>
      paper.related_update_slugs.includes(update.slug)
    ),
    relatedTimeline: content.timeline.filter((event) =>
      paper.related_timeline_event_slugs.includes(event.slug)
    ),
    relatedTopics: content.topics.filter((topic) =>
      paper.topics.includes(topic.slug)
    ),
  };
}

export async function getProjectBySlug(slug: string) {
  const content = await loadWorldModelsContent();
  const project = content.projects.find((item) => item.slug === slug);
  if (!project) {
    return null;
  }

  return {
    ...project,
    relatedPapers: content.papers.filter((paper) =>
      project.related_paper_slugs.includes(paper.slug)
    ),
    relatedUpdates: content.updates.filter((update) =>
      project.related_update_slugs.includes(update.slug)
    ),
    relatedTopics: content.topics.filter((topic) =>
      project.topics.includes(topic.slug)
    ),
  };
}

export async function getUpdateBySlug(slug: string) {
  const content = await loadWorldModelsContent();
  const update = content.updates.find((item) => item.slug === slug);
  if (!update) {
    return null;
  }

  return {
    ...update,
    relatedPapers: content.papers.filter((paper) =>
      update.related_paper_slugs.includes(paper.slug)
    ),
    relatedProjects: content.projects.filter((project) =>
      update.related_project_slugs.includes(project.slug)
    ),
    relatedTopics: content.topics.filter((topic) =>
      update.topics.includes(topic.slug)
    ),
  };
}
