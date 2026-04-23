import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';

import { envConfigs } from '@/config';
import { getRecommendedHubs } from '@/features/world-models/content/detail-hubs';
import { localizeText } from '@/features/world-models/content/localize';
import { getProjectBySlug } from '@/features/world-models/content/queries';
import { WorldModelsNextReads } from '@/features/world-models/components/world-models-next-reads';
import { WorldModelsProjectDetail } from '@/features/world-models/components/world-models-project-detail';
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
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {};
  }

  return buildWorldModelsMetadata({
    title: project.name,
    description: localizeText(
      project,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    locale,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.project_detail');
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const actions = [
    { label: t('official_link'), href: project.source_url },
    project.demo_url ? { label: t('demo_link'), href: project.demo_url } : null,
    project.repo_url ? { label: t('repo_link'), href: project.repo_url } : null,
  ].filter((item) => item !== null);
  const pageUrl =
    locale === 'en'
      ? `${envConfigs.app_url}/projects/${project.slug}`
      : `${envConfigs.app_url}/${locale}/projects/${project.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: localizeText(
      project,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    codeRepository: project.repo_url || undefined,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: project.organization,
    },
    sameAs: [project.source_url, project.demo_url, project.repo_url].filter(Boolean),
  };
  const recommendedHubs = getRecommendedHubs(project.topics);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <Script
        id={`project-jsonld-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsProjectDetail
        locale={locale}
        title={project.name}
        summary={localizeText(
          project,
          locale,
          'editorial_summary_zh',
          'editorial_summary_en'
        )}
        description={localizeText(
          project,
          locale,
          'description_zh',
          'description_en'
        )}
        overviewTitle={t('overview')}
        organizationLabel={t('organization')}
        organization={project.organization}
        typeLabel={t('type')}
        type={formatToken(project.type)}
        maturityLabel={t('maturity')}
        maturity={formatToken(project.maturity)}
        releaseLabel={t('release_date')}
        release={project.release_date}
        actions={actions}
        topicsTitle={t('topics')}
        topics={project.relatedTopics.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'name_zh', 'name_en'),
          href: `/topics/${item.slug}`,
        }))}
        relatedPapersTitle={t('related_papers')}
        relatedPapers={project.relatedPapers.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          href: `/papers/${item.slug}`,
          meta: `${item.paper_venue} · ${item.year}`,
        }))}
        relatedUpdatesTitle={t('related_updates')}
        relatedUpdates={project.relatedUpdates.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          href: `/updates/${item.slug}`,
          meta: `${item.date} · ${item.source_name}`,
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
          ...project.relatedTopics.map((item) => ({
            slug: `topic-${item.slug}`,
            title: localizeText(item, locale, 'name_zh', 'name_en'),
            summary: localizeText(item, locale, 'description_zh', 'description_en'),
            meta: t('next_topic'),
            href: `/topics/${item.slug}`,
          })),
          ...project.relatedPapers.slice(0, 2).map((item) => ({
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
