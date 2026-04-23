import { Link } from '@/core/i18n/navigation';

type RelatedItem = {
  slug: string;
  title: string;
  href?: string;
  external?: boolean;
  meta?: string;
};

export function WorldModelsRelatedContent({
  locale,
  title,
  items,
}: {
  locale: string;
  title: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.slug}>
            {item.href ? (
              item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-2xl bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-900"
                >
                  {item.meta ? (
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.meta}
                    </div>
                  ) : null}
                  <div className="mt-1 text-sm font-medium text-slate-700 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-300">
                    {item.title}
                  </div>
                </a>
              ) : (
                <Link
                  href={item.href}
                  locale={locale}
                  className="group block rounded-2xl bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-900"
                >
                  {item.meta ? (
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.meta}
                    </div>
                  ) : null}
                  <div className="mt-1 text-sm font-medium text-slate-700 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-300">
                    {item.title}
                  </div>
                </Link>
              )
            ) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                {item.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
