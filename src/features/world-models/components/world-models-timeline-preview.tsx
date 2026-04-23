import { Link } from '@/core/i18n/navigation';

type TimelineItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  href: string;
};

export function WorldModelsTimelinePreview({
  locale,
  title,
  ctaLabel,
  items,
}: {
  locale: string;
  title: string;
  ctaLabel: string;
  items: TimelineItem[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            locale={locale}
            className="group grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900 md:grid-cols-[140px_minmax(0,1fr)] md:items-start"
          >
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span>{item.date}</span>
              <span className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 md:block" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
              <div className="mt-4 text-sm font-medium text-sky-700 dark:text-sky-300">
                {ctaLabel}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
