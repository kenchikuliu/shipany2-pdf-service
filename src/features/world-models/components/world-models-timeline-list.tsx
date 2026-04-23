type TimelineItem = {
  slug: string;
  title: string;
  description: string;
  whyItMatters: string;
  date: string;
};

export function WorldModelsTimelineList({
  items,
}: {
  items: TimelineItem[];
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.slug}
          className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[160px_minmax(0,1fr)]"
        >
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>{item.date}</span>
            <span className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 md:block" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
            <p className="mt-4 rounded-[18px] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
              {item.whyItMatters}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
