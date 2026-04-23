import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type SignalItem = {
  slug: string;
  title: string;
  meta: string;
  href: string;
};

type TopicItem = {
  slug: string;
  name: string;
  description: string;
};

export function WorldModelsSignalDeck({
  locale,
  title,
  description,
  updatesLabel,
  papersLabel,
  topicsLabel,
  updates,
  papers,
  topics,
}: {
  locale: string;
  title: string;
  description: string;
  updatesLabel: string;
  papersLabel: string;
  topicsLabel: string;
  updates: SignalItem[];
  papers: SignalItem[];
  topics: TopicItem[];
}) {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_28px_90px_-70px_rgba(15,23,42,0.42)] dark:border-slate-800 dark:bg-slate-950/80 md:p-6">
      <div className="max-w-3xl">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Signal Deck
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_1.2fr_0.95fr]">
        <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
            {updatesLabel}
          </div>
          <div className="mt-4 space-y-2">
            {updates.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                locale={locale}
                className="group block rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-500/60 dark:hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.meta}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
            {papersLabel}
          </div>
          <div className="mt-4 space-y-2">
            {papers.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                locale={locale}
                className="group block rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 transition-colors hover:border-sky-300 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.meta}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200/80 bg-slate-950 p-4 text-white dark:border-slate-800">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
            {topicsLabel}
          </div>
          <div className="mt-4 space-y-2">
            {topics.map((item) => (
              <Link
                key={item.slug}
                href={`/topics/${item.slug}`}
                locale={locale}
                className="group block rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-300">
                      {item.description}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-violet-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
