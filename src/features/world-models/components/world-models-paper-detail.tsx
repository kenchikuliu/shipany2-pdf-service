import { WorldModelsRelatedContent } from './world-models-related-content';

type RelatedItem = {
  slug: string;
  title: string;
  href?: string;
  external?: boolean;
  meta?: string;
};

type WorldModelsPaperDetailProps = {
  locale: string;
  title: string;
  summary: string;
  whyItMattersTitle: string;
  whyItMatters: string;
  authorsLabel: string;
  authors: string;
  affiliationsLabel: string;
  affiliations: string;
  venueLabel: string;
  venue: string;
  relatedProjectsTitle: string;
  relatedProjects: RelatedItem[];
  relatedUpdatesTitle: string;
  relatedUpdates: RelatedItem[];
  relatedTimelineTitle: string;
  relatedTimeline: RelatedItem[];
};

export function WorldModelsPaperDetail({
  locale,
  title,
  summary,
  whyItMattersTitle,
  whyItMatters,
  authorsLabel,
  authors,
  affiliationsLabel,
  affiliations,
  venueLabel,
  venue,
  relatedProjectsTitle,
  relatedProjects,
  relatedUpdatesTitle,
  relatedUpdates,
  relatedTimelineTitle,
  relatedTimeline,
}: WorldModelsPaperDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
          {summary}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {authorsLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {authors}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {affiliationsLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {affiliations}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {venueLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {venue}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] bg-slate-50 p-5 dark:bg-slate-900/70">
          <div className="text-sm font-semibold text-slate-950 dark:text-white">
            {whyItMattersTitle}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {whyItMatters}
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <WorldModelsRelatedContent
          locale={locale}
          title={relatedProjectsTitle}
          items={relatedProjects}
        />
        <WorldModelsRelatedContent
          locale={locale}
          title={relatedUpdatesTitle}
          items={relatedUpdates}
        />
        <WorldModelsRelatedContent
          locale={locale}
          title={relatedTimelineTitle}
          items={relatedTimeline}
        />
      </div>
    </div>
  );
}
