import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type PaperItem = {
  slug: string;
  title: string;
  summary: string;
  venue: string;
  year: number;
  href: string;
};

export function WorldModelsPaperGrid({
  title,
  locale,
  items,
  ctaLabel = 'Paper brief',
}: {
  title: string;
  locale: string;
  items: PaperItem[];
  ctaLabel?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            locale={locale}
            className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.45)] transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                {item.venue} · {item.year}
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.summary}
            </p>
            <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {ctaLabel}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
