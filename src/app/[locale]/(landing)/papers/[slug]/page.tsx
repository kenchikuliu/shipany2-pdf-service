import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';

import { envConfigs } from '@/config';
import { getRecommendedHubs } from '@/features/world-models/content/detail-hubs';
import { localizeText } from '@/features/world-models/content/localize';
import { getPaperBySlug } from '@/features/world-models/content/queries';
import { WorldModelsPaperDetail } from '@/features/world-models/components/world-models-paper-detail';
import { WorldModelsNextReads } from '@/features/world-models/components/world-models-next-reads';
import { buildWorldModelsMetadata } from '@/features/world-models/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) {
    return {};
  }

  return buildWorldModelsMetadata({
    title: localizeText(paper, locale, 'title_zh', 'title_en'),
    description: localizeText(
      paper,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    locale,
    path: `/papers/${slug}`,
  });
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.paper_detail');
  const paper = await getPaperBySlug(slug);
  if (!paper) {
    notFound();
  }

  const pageUrl =
    locale === 'en'
      ? `${envConfigs.app_url}/papers/${paper.slug}`
      : `${envConfigs.app_url}/${locale}/papers/${paper.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: localizeText(paper, locale, 'title_zh', 'title_en'),
    description: localizeText(
      paper,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    author: paper.authors.map((name) => ({ '@type': 'Person', name })),
    datePublished: paper.publication_date,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: envConfigs.app_name,
      url: envConfigs.app_url,
    },
    sameAs: paper.source_url,
  };
  const recommendedHubs = getRecommendedHubs(paper.topics);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <Script
        id={`paper-jsonld-${paper.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsPaperDetail
        locale={locale}
        title={localizeText(paper, locale, 'title_zh', 'title_en')}
        summary={localizeText(
          paper,
          locale,
          'editorial_summary_zh',
          'editorial_summary_en'
        )}
        whyItMattersTitle={t('why_it_matters')}
        whyItMatters={paper.why_it_matters}
        authorsLabel={t('authors')}
        authors={paper.authors.join(', ')}
        affiliationsLabel={t('affiliations')}
        affiliations={paper.affiliations.join(', ')}
        venueLabel={t('venue')}
        venue={`${paper.paper_venue} · ${paper.year}`}
        relatedProjectsTitle={t('related_projects')}
        relatedProjects={paper.relatedProjects.map((item) => ({
          slug: item.slug,
          title: item.name,
          href: `/projects/${item.slug}`,
          meta: item.organization,
        }))}
        relatedUpdatesTitle={t('related_updates')}
        relatedUpdates={paper.relatedUpdates.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          href: `/updates/${item.slug}`,
          meta: `${item.date} · ${item.source_name}`,
        }))}
        relatedTimelineTitle={t('related_timeline')}
        relatedTimeline={paper.relatedTimeline.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          href: `/timeline?topic=${paper.topics[0]}`,
          meta: item.date,
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
          ...paper.relatedTopics.map((item) => ({
            slug: `topic-${item.slug}`,
            title: localizeText(item, locale, 'name_zh', 'name_en'),
            summary: localizeText(item, locale, 'description_zh', 'description_en'),
            meta: t('next_topic'),
            href: `/topics/${item.slug}`,
          })),
          ...paper.relatedProjects.slice(0, 2).map((item) => ({
            slug: `project-${item.slug}`,
            title: item.name,
            summary: localizeText(
              item,
              locale,
              'editorial_summary_zh',
              'editorial_summary_en'
            ),
            meta: t('next_project'),
            href: `/projects/${item.slug}`,
          })),
        ].slice(0, 4)}
      />
    </div>
  );
}
