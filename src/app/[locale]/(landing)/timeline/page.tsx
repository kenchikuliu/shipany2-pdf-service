import { getTranslations, setRequestLocale } from 'next-intl/server';

import { localizeText } from '@/features/world-models/content/localize';
import {
  getAllTopics,
  getTimelineIndexData,
} from '@/features/world-models/content/queries';
import { WorldModelsPageHeader } from '@/features/world-models/components/world-models-page-header';
import { WorldModelsTopicFilter } from '@/features/world-models/components/world-models-topic-filter';
import { WorldModelsTimelineList } from '@/features/world-models/components/world-models-timeline-list';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;
export const generateMetadata = getMetadata({
  metadataKey: 'pages.timeline.metadata',
  canonicalUrl: '/timeline',
});

export default async function TimelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { locale } = await params;
  const { topic } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('pages.timeline');
  const [timeline, topics] = await Promise.all([
    getTimelineIndexData(topic),
    getAllTopics(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <WorldModelsPageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <WorldModelsTopicFilter
        locale={locale}
        basePath="/timeline"
        allLabel={t('all_topics')}
        activeSlug={topic}
        items={topics.map((item) => ({
          slug: item.slug,
          label: localizeText(item, locale, 'name_zh', 'name_en'),
        }))}
      />
      <WorldModelsTimelineList
        items={timeline.map((event) => ({
          slug: event.slug,
          title: localizeText(event, locale, 'title_zh', 'title_en'),
          description: localizeText(
            event,
            locale,
            'description_zh',
            'description_en'
          ),
          whyItMatters: event.why_it_matters,
          date: event.date,
        }))}
      />
    </div>
  );
}
