import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type WeeklyItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  sourceName: string;
  href: string;
};

export function WorldModelsThisWeek({
  locale,
  title,
  ctaLabel,
  items,
}: {
  locale: string;
  title: string;
  ctaLabel: string;
  items: WeeklyItem[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={item.href}
            locale={locale}
            className={`group rounded-[28px] border border-slate-200 bg-white p-5 transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900 ${
              index === 0 ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{item.date}</span>
              <span>{item.sourceName}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.summary}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>#{index + 1}</span>
              <span>{ctaLabel}</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
