import {
  PaperSchema,
  ProjectSchema,
  TimelineEventSchema,
  TopicSchema,
  UpdateSchema,
  validateUniqueSlugs,
  type PaperRecord,
  type ProjectRecord,
  type TimelineEventRecord,
  type TopicRecord,
  type UpdateRecord,
} from './schema';
import { worldModelsContent } from './generated';

export type WorldModelsContent = {
  topics: TopicRecord[];
  papers: PaperRecord[];
  projects: ProjectRecord[];
  updates: UpdateRecord[];
  timeline: TimelineEventRecord[];
};

function loadCollection<T extends { slug: string }>(
  records: readonly unknown[],
  directoryName: string,
  parser: { parse: (input: unknown) => T },
  sortByDateField?: keyof T
): T[] {
  const parsedRecords = records.map((record) => parser.parse(record));
  const withSlugs = parsedRecords as Array<{ slug: string }>;
  validateUniqueSlugs(directoryName, withSlugs);

  if (!sortByDateField) {
    return parsedRecords.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return parsedRecords.sort((a, b) => {
    const aValue = String(a[sortByDateField]);
    const bValue = String(b[sortByDateField]);
    return bValue.localeCompare(aValue);
  });
}

let cachedContent: WorldModelsContent | null = null;

export async function loadWorldModelsContent(): Promise<WorldModelsContent> {
  if (cachedContent) {
    return cachedContent;
  }

  const topics = loadCollection(worldModelsContent.topics, 'topics', TopicSchema);
  const papers = loadCollection(
    worldModelsContent.papers,
    'papers',
    PaperSchema,
    'publication_date'
  );
  const projects = loadCollection(
    worldModelsContent.projects,
    'projects',
    ProjectSchema,
    'release_date'
  );
  const updates = loadCollection(
    worldModelsContent.updates,
    'updates',
    UpdateSchema,
    'date'
  );
  const timeline = loadCollection(
    worldModelsContent.timeline,
    'timeline',
    TimelineEventSchema,
    'date'
  );

  cachedContent = {
    topics,
    papers,
    projects,
    updates,
    timeline,
  };

  return cachedContent;
}

export function resetWorldModelsContentCache() {
  cachedContent = null;
}
