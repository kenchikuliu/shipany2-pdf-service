import { Link } from '@/core/i18n/navigation';

type TopicFilterItem = {
  slug: string;
  label: string;
};

export function WorldModelsTopicFilter({
  locale,
  basePath,
  allLabel,
  items,
  activeSlug,
}: {
  locale: string;
  basePath: string;
  allLabel: string;
  items: TopicFilterItem[];
  activeSlug?: string;
}) {
  const getHref = (topic?: string) =>
    topic ? `${basePath}?topic=${topic}` : basePath;

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-wrap gap-2">
        <Link
          href={getHref()}
          locale={locale}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            !activeSlug
              ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          {allLabel}
        </Link>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={getHref(item.slug)}
            locale={locale}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              activeSlug === item.slug
                ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
