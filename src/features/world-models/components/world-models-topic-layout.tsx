import { ArrowUpRight, Orbit } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type TopicItem = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  meta?: string;
  external?: boolean;
};

type TimelineItem = {
  slug: string;
  title: string;
  description: string;
  meta?: string;
};

function TopicCard({
  locale,
  item,
}: {
  locale: string;
  item: TopicItem;
}) {
  const content = (
    <>
      {item.meta ? (
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {item.meta}
        </div>
      ) : null}
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
          {item.title}
        </h3>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {item.summary}
      </p>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="group rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      locale={locale}
      className="group rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] transition-colors hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
    >
      {content}
    </Link>
  );
}

export function WorldModelsTopicLayout({
  locale,
  title,
  description,
  intro,
  eyebrow,
  papersTitle,
  papers,
  projectsTitle,
  projects,
  updatesTitle,
  updates,
  timelineTitle,
  timeline,
  paperCountLabel,
  projectCountLabel,
  updateCountLabel,
  timelineCountLabel,
  startHereTitle,
  startHereDescription,
  startHereItems,
  insightTitle,
  insightBody,
  faqTitle,
  faqItems,
}: {
  locale: string;
  title: string;
  description: string;
  intro: string;
  eyebrow: string;
  papersTitle: string;
  papers: TopicItem[];
  projectsTitle: string;
  projects: TopicItem[];
  updatesTitle: string;
  updates: TopicItem[];
  timelineTitle: string;
  timeline: TimelineItem[];
  paperCountLabel: string;
  projectCountLabel: string;
  updateCountLabel: string;
  timelineCountLabel: string;
  startHereTitle: string;
  startHereDescription: string;
  startHereItems: TopicItem[];
  insightTitle?: string;
  insightBody?: string[];
  faqTitle?: string;
  faqItems?: Array<{ question: string; answer: string }>;
}) {
  const stats = [
    { label: paperCountLabel, value: papers.length },
    { label: projectCountLabel, value: projects.length },
    { label: updateCountLabel, value: updates.length },
    { label: timelineCountLabel, value: timeline.length },
  ];

  const sections = [
    { title: papersTitle, items: papers },
    { title: projectsTitle, items: projects },
    { title: updatesTitle, items: updates },
  ];

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.42)] dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_36%),radial-gradient(circle_at_right,rgba(59,130,246,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_36%),radial-gradient(circle_at_right,rgba(59,130,246,0.12),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_320px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
              <Orbit className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200">
              {intro}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6">
          {insightTitle && insightBody?.length ? (
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                {insightTitle}
              </h2>
              <div className="mt-4 grid gap-4">
                {insightBody.map((item) => (
                  <p
                    key={item}
                    className="text-sm leading-7 text-slate-600 dark:text-slate-300"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {startHereTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {startHereDescription}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {startHereItems.map((item) => (
                <TopicCard key={`start-${item.slug}`} locale={locale} item={item} />
              ))}
            </div>
          </section>

          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950"
            >
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <TopicCard key={`${section.title}-${item.slug}`} locale={locale} item={item} />
                ))}
              </div>
            </section>
          ))}

          {faqTitle && faqItems?.length ? (
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                {faqTitle}
              </h2>
              <div className="mt-4 grid gap-4">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950 xl:sticky xl:top-6 xl:h-fit">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            {timelineTitle}
          </h2>
          <div className="mt-5 grid gap-4">
            {timeline.map((item) => (
              <div
                key={item.slug}
                className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-sky-500 after:absolute after:bottom-[-18px] after:left-[3px] after:top-5 after:w-px after:bg-slate-200 last:after:hidden dark:after:bg-slate-800"
              >
                {item.meta ? (
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {item.meta}
                  </div>
                ) : null}
                <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
