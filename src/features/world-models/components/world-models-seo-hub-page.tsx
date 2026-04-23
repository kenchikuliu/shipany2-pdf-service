import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { WorldModelsFaqSection } from '@/features/world-models/components/world-models-faq-section';
import { WorldModelsPageHeader } from '@/features/world-models/components/world-models-page-header';
import { WorldModelsPaperGrid } from '@/features/world-models/components/world-models-paper-grid';
import { WorldModelsProjectGrid } from '@/features/world-models/components/world-models-project-grid';
import { WorldModelsUpdateList } from '@/features/world-models/components/world-models-update-list';
import { getSeoHubData } from '@/features/world-models/seo-hubs';

export async function WorldModelsSeoHubPage({
  hubKey,
  locale,
}: {
  hubKey:
    | 'latest-world-model-papers'
    | 'world-model-projects'
    | 'physical-ai-world-models'
    | 'embodied-ai-papers';
  locale: string;
}) {
  const data = await getSeoHubData(hubKey, locale);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <WorldModelsPageHeader
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_320px]">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {locale === 'zh' ? '页面说明' : 'What this page is for'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {data.intro}
            </p>
          </div>
          <div className="grid gap-3">
            {data.relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className="group rounded-[20px] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-sky-300 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
                      {item.label}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {data.sections.map((section) => {
        if (section.type === 'papers') {
          return (
            <WorldModelsPaperGrid
              key={section.title}
              title={section.title}
              locale={locale}
              items={section.items.map((item) => ({
                slug: item.slug,
                title: item.title,
                summary: item.summary,
                venue: item.meta.split(' · ')[0] ?? item.meta,
                year: Number(item.meta.split(' · ')[1] ?? 0),
                href: item.href,
              }))}
            />
          );
        }

        if (section.type === 'projects') {
          return (
            <WorldModelsProjectGrid
              key={section.title}
              title={section.title}
              locale={locale}
              items={section.items.map((item) => ({
                slug: item.slug,
                name: item.title,
                organization: item.meta.split(' · ')[0] ?? item.meta,
                summary: item.summary,
                href: item.href,
                meta: item.meta.split(' · ').slice(1).join(' · '),
              }))}
            />
          );
        }

        return (
          <section key={section.title} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {section.title}
            </h2>
            <WorldModelsUpdateList
              locale={locale}
              items={section.items.map((item) => {
                const [date, ...rest] = item.meta.split(' · ');
                return {
                  slug: item.slug,
                  title: item.title,
                  summary: item.summary,
                  date,
                  sourceName: rest.join(' · '),
                  href: item.href,
                };
              })}
            />
          </section>
        );
      })}

      <WorldModelsFaqSection
        title={locale === 'zh' ? '常见问题' : 'FAQ'}
        items={data.faq}
        scriptId={`seo-hub-faq-${hubKey}-${locale}`}
      />
    </div>
  );
}
