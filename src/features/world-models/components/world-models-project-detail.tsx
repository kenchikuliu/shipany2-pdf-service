import { Link } from '@/core/i18n/navigation';

import { WorldModelsRelatedContent } from './world-models-related-content';

type ActionItem = {
  label: string;
  href: string;
};

type RelatedItem = {
  slug: string;
  title: string;
  href?: string;
  external?: boolean;
  meta?: string;
};

type TopicItem = {
  slug: string;
  title: string;
  href: string;
};

type WorldModelsProjectDetailProps = {
  locale: string;
  title: string;
  summary: string;
  description: string;
  overviewTitle: string;
  organizationLabel: string;
  organization: string;
  typeLabel: string;
  type: string;
  maturityLabel: string;
  maturity: string;
  releaseLabel: string;
  release: string;
  actions: ActionItem[];
  topicsTitle: string;
  topics: TopicItem[];
  relatedPapersTitle: string;
  relatedPapers: RelatedItem[];
  relatedUpdatesTitle: string;
  relatedUpdates: RelatedItem[];
};

export function WorldModelsProjectDetail({
  locale,
  title,
  summary,
  description,
  overviewTitle,
  organizationLabel,
  organization,
  typeLabel,
  type,
  maturityLabel,
  maturity,
  releaseLabel,
  release,
  actions,
  topicsTitle,
  topics,
  relatedPapersTitle,
  relatedPapers,
  relatedUpdatesTitle,
  relatedUpdates,
}: WorldModelsProjectDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
          {summary}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {organizationLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {organization}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {typeLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {type}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {maturityLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {maturity}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {releaseLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {release}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] bg-slate-50 p-5 dark:bg-slate-900/70">
          <div className="text-sm font-semibold text-slate-950 dark:text-white">
            {topicsTitle}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={topic.href}
                locale={locale}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[24px] bg-slate-50 p-5 dark:bg-slate-900/70">
          <div className="text-sm font-semibold text-slate-950 dark:text-white">
            {overviewTitle}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-300"
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <div className="space-y-6">
        <WorldModelsRelatedContent
          locale={locale}
          title={relatedPapersTitle}
          items={relatedPapers}
        />
        <WorldModelsRelatedContent
          locale={locale}
          title={relatedUpdatesTitle}
          items={relatedUpdates}
        />
      </div>
    </div>
  );
}
