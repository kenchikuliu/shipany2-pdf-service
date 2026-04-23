import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type UpdateItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  sourceName: string;
  href: string;
};

export function WorldModelsUpdateList({
  locale,
  items,
  ctaLabel = 'Read brief',
}: {
  locale: string;
  items: UpdateItem[];
  ctaLabel?: string;
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          locale={locale}
          className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.45)] transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <span>{item.date}</span>
              <span>{item.sourceName}</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {item.summary}
          </p>
          <div className="mt-4 text-sm font-medium text-sky-700 dark:text-sky-300">
            {ctaLabel}
          </div>
        </Link>
      ))}
    </div>
  );
}
