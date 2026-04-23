import { z } from 'zod';

export const TopicValues = [
  'world-models',
  'video-world-models',
  'embodied-world-models',
  'robotics-world-models',
  'driving-world-models',
  'game-environment-world-models',
  'agentic-planning',
] as const;

export const CapabilityValues = [
  'prediction',
  'simulation',
  'planning',
  'action-conditioned-generation',
  'long-horizon-reasoning',
  'controllable-environment-generation',
] as const;

export const ScenarioValues = [
  'robotics',
  'autonomous-driving',
  'gaming',
  'video-generation',
  'agents',
  'research-platforms',
] as const;

export const ImportanceValues = ['high', 'medium', 'low'] as const;
export const ProjectTypeValues = [
  'open-source',
  'product',
  'demo',
  'benchmark',
  'dataset',
  'framework',
] as const;
export const UpdateTypeValues = [
  'paper',
  'model-release',
  'product-release',
  'benchmark',
  'funding',
  'interview',
  'company-blog',
  'survey',
] as const;
export const TimelineEventTypeValues = [
  'paper',
  'model-release',
  'company-launch',
  'benchmark',
  'survey',
  'milestone',
] as const;
export const ProjectMaturityValues = ['emerging', 'active', 'established'] as const;

const NonEmptyString = z.string().trim().min(1);
const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const UrlString = z.url();

const BilingualBaseSchema = z.object({
  slug: NonEmptyString,
});

export const TopicSchema = BilingualBaseSchema.extend({
  slug: z.enum(TopicValues),
  name_en: NonEmptyString,
  name_zh: NonEmptyString,
  description_en: NonEmptyString,
  description_zh: NonEmptyString,
  hero_en: NonEmptyString,
  hero_zh: NonEmptyString,
  featured: z.boolean().default(false),
});

export const PaperSchema = BilingualBaseSchema.extend({
  title_en: NonEmptyString,
  title_zh: NonEmptyString,
  abstract_en: NonEmptyString,
  abstract_zh: NonEmptyString,
  authors: z.array(NonEmptyString).min(1),
  affiliations: z.array(NonEmptyString).min(1),
  source_url: UrlString,
  paper_venue: NonEmptyString,
  publication_date: DateString,
  year: z.number().int().min(2000).max(2100),
  code_url: UrlString.optional(),
  project_url: UrlString.optional(),
  topics: z.array(z.enum(TopicValues)).min(1),
  capabilities: z.array(z.enum(CapabilityValues)).min(1),
  scenarios: z.array(z.enum(ScenarioValues)).min(1),
  importance_level: z.enum(ImportanceValues),
  editorial_summary_zh: NonEmptyString,
  editorial_summary_en: NonEmptyString,
  why_it_matters: NonEmptyString,
  related_project_slugs: z.array(NonEmptyString).default([]),
  related_update_slugs: z.array(NonEmptyString).default([]),
  related_timeline_event_slugs: z.array(NonEmptyString).default([]),
  featured: z.boolean().default(false),
});

export const ProjectSchema = BilingualBaseSchema.extend({
  name: NonEmptyString,
  description_en: NonEmptyString,
  description_zh: NonEmptyString,
  type: z.enum(ProjectTypeValues),
  organization: NonEmptyString,
  source_url: UrlString,
  demo_url: UrlString.optional(),
  repo_url: UrlString.optional(),
  release_date: DateString,
  topics: z.array(z.enum(TopicValues)).min(1),
  capabilities: z.array(z.enum(CapabilityValues)).min(1),
  scenarios: z.array(z.enum(ScenarioValues)).min(1),
  maturity: z.enum(ProjectMaturityValues),
  related_paper_slugs: z.array(NonEmptyString).default([]),
  related_update_slugs: z.array(NonEmptyString).default([]),
  editorial_summary_zh: NonEmptyString,
  editorial_summary_en: NonEmptyString,
  featured: z.boolean().default(false),
});

export const UpdateSchema = BilingualBaseSchema.extend({
  title_en: NonEmptyString,
  title_zh: NonEmptyString,
  date: DateString,
  source_name: NonEmptyString,
  source_url: UrlString,
  update_type: z.enum(UpdateTypeValues),
  summary_en: NonEmptyString,
  summary_zh: NonEmptyString,
  importance_level: z.enum(ImportanceValues),
  topics: z.array(z.enum(TopicValues)).min(1),
  related_paper_slugs: z.array(NonEmptyString).default([]),
  related_project_slugs: z.array(NonEmptyString).default([]),
  related_company_names: z.array(NonEmptyString).default([]),
  published: z.boolean().default(true),
});

export const TimelineEventSchema = BilingualBaseSchema.extend({
  title_en: NonEmptyString,
  title_zh: NonEmptyString,
  date: DateString,
  description_en: NonEmptyString,
  description_zh: NonEmptyString,
  event_type: z.enum(TimelineEventTypeValues),
  related_paper_slugs: z.array(NonEmptyString).default([]),
  related_project_slugs: z.array(NonEmptyString).default([]),
  related_org_names: z.array(NonEmptyString).default([]),
  why_it_matters: NonEmptyString,
  featured: z.boolean().default(false),
});

export type TopicRecord = z.infer<typeof TopicSchema>;
export type PaperRecord = z.infer<typeof PaperSchema>;
export type ProjectRecord = z.infer<typeof ProjectSchema>;
export type UpdateRecord = z.infer<typeof UpdateSchema>;
export type TimelineEventRecord = z.infer<typeof TimelineEventSchema>;

export function validateUniqueSlugs(
  collectionName: string,
  records: Array<{ slug: string }>
) {
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.slug)) {
      throw new Error(`Duplicate slug "${record.slug}" found in ${collectionName}`);
    }
    seen.add(record.slug);
  }
}
