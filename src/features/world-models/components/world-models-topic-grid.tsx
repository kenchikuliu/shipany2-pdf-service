import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type TopicItem = {
  slug: string;
  name: string;
  description: string;
  countLabel?: string;
};

export function WorldModelsTopicGrid({
  title,
  items,
  locale,
}: {
  title: string;
  items: TopicItem[];
  locale: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/topics/${item.slug}`}
            locale={locale}
            className="group rounded-[28px] border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                /{item.slug}
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              {item.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
            {item.countLabel ? (
              <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {item.countLabel}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
