import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';

import { envConfigs } from '@/config';
import { getRecommendedHubs } from '@/features/world-models/content/detail-hubs';
import { localizeText } from '@/features/world-models/content/localize';
import { getUpdateBySlug } from '@/features/world-models/content/queries';
import { WorldModelsNextReads } from '@/features/world-models/components/world-models-next-reads';
import { WorldModelsUpdateDetail } from '@/features/world-models/components/world-models-update-detail';
import { buildWorldModelsMetadata } from '@/features/world-models/seo';

export const revalidate = 3600;

function formatToken(token: string) {
  return token
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const update = await getUpdateBySlug(slug);
  if (!update) {
    return {};
  }

  return buildWorldModelsMetadata({
    title: localizeText(update, locale, 'title_zh', 'title_en'),
    description: localizeText(update, locale, 'summary_zh', 'summary_en'),
    locale,
    path: `/updates/${slug}`,
  });
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.update_detail');
  const update = await getUpdateBySlug(slug);
  if (!update) {
    notFound();
  }
  const pageUrl =
    locale === 'en'
      ? `${envConfigs.app_url}/updates/${update.slug}`
      : `${envConfigs.app_url}/${locale}/updates/${update.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: localizeText(update, locale, 'title_zh', 'title_en'),
    description: localizeText(update, locale, 'summary_zh', 'summary_en'),
    datePublished: update.date,
    dateModified: update.date,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: update.source_name,
    },
    mainEntityOfPage: pageUrl,
    sameAs: update.source_url,
  };
  const recommendedHubs = getRecommendedHubs(update.topics);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <Script
        id={`update-jsonld-${update.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsUpdateDetail
        locale={locale}
        title={localizeText(update, locale, 'title_zh', 'title_en')}
        summary={localizeText(update, locale, 'summary_zh', 'summary_en')}
        dateLabel={t('date')}
        date={update.date}
        sourceLabel={t('source')}
        source={update.source_name}
        typeLabel={t('type')}
        type={formatToken(update.update_type)}
        importanceLabel={t('importance')}
        importance={formatToken(update.importance_level)}
        topicsTitle={t('topics')}
        topics={update.relatedTopics.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'name_zh', 'name_en'),
          href: `/topics/${item.slug}`,
        }))}
        actions={[{ label: t('source_link'), href: update.source_url }]}
        relatedPapersTitle={t('related_papers')}
        relatedPapers={update.relatedPapers.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          href: `/papers/${item.slug}`,
          meta: `${item.paper_venue} · ${item.year}`,
        }))}
        relatedProjectsTitle={t('related_projects')}
        relatedProjects={update.relatedProjects.map((item) => ({
          slug: item.slug,
          title: item.name,
          href: `/projects/${item.slug}`,
          meta: item.organization,
        }))}
      />
      <WorldModelsNextReads
        locale={locale}
        title={t('next_reads')}
        items={[
          ...recommendedHubs.slice(0, 2).map((item) => ({
            slug: `hub-${item.slug}`,
            title: locale === 'zh' ? item.titleZh : item.titleEn,
            summary: locale === 'zh' ? item.summaryZh : item.summaryEn,
            meta: t('next_hub'),
            href: item.href,
          })),
          ...update.relatedTopics.map((item) => ({
            slug: `topic-${item.slug}`,
            title: localizeText(item, locale, 'name_zh', 'name_en'),
            summary: localizeText(item, locale, 'description_zh', 'description_en'),
            meta: t('next_topic'),
            href: `/topics/${item.slug}`,
          })),
          ...update.relatedPapers.slice(0, 2).map((item) => ({
            slug: `paper-${item.slug}`,
            title: localizeText(item, locale, 'title_zh', 'title_en'),
            summary: localizeText(
              item,
              locale,
              'editorial_summary_zh',
              'editorial_summary_en'
            ),
            meta: t('next_paper'),
            href: `/papers/${item.slug}`,
          })),
        ].slice(0, 4)}
      />
    </div>
  );
}
