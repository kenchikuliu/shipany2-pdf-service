import { getTranslations, setRequestLocale } from 'next-intl/server';

import { localizeText } from '@/features/world-models/content/localize';
import {
  getAllTopics,
  getUpdatesIndexData,
} from '@/features/world-models/content/queries';
import { WorldModelsPageHeader } from '@/features/world-models/components/world-models-page-header';
import { WorldModelsFaqSection } from '@/features/world-models/components/world-models-faq-section';
import { WorldModelsTopicFilter } from '@/features/world-models/components/world-models-topic-filter';
import { WorldModelsUpdateList } from '@/features/world-models/components/world-models-update-list';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.updates.metadata',
  canonicalUrl: '/updates',
});

export default async function UpdatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { locale } = await params;
  const { topic } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('pages.updates');
  const [updates, topics] = await Promise.all([
    getUpdatesIndexData(),
    getAllTopics(),
  ]);
  const faqItems = [
    {
      question: t('faq.items.0.question'),
      answer: t('faq.items.0.answer'),
    },
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer'),
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer'),
    },
  ];
  const filteredUpdates = topic
    ? updates.filter((update) => update.topics.includes(topic as any))
    : updates;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <WorldModelsPageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          {t('guide_title')}
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {t('guide_description')}
        </p>
      </section>
      <WorldModelsTopicFilter
        locale={locale}
        basePath="/updates"
        allLabel={t('all_topics')}
        activeSlug={topic}
        items={topics.map((item) => ({
          slug: item.slug,
          label: localizeText(item, locale, 'name_zh', 'name_en'),
        }))}
      />
      <WorldModelsUpdateList
        locale={locale}
        ctaLabel={t('cta')}
        items={filteredUpdates.map((update) => ({
          slug: update.slug,
          title: localizeText(update, locale, 'title_zh', 'title_en'),
          summary: localizeText(update, locale, 'summary_zh', 'summary_en'),
          date: update.date,
          sourceName: update.source_name,
          href: `/updates/${update.slug}`,
        }))}
      />
      <WorldModelsFaqSection
        title={t('faq.title')}
        items={faqItems}
        scriptId={`updates-faq-${locale}`}
      />
    </div>
  );
}
