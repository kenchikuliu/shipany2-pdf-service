import Script from 'next/script';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { Link } from '@/core/i18n/navigation';
import { getWorldModelsHomepageData } from '@/features/world-models/content/queries';
import { WorldModelsEditorPicks } from '@/features/world-models/components/world-models-editor-picks';
import { WorldModelsHero } from '@/features/world-models/components/world-models-hero';
import { WorldModelsPaperGrid } from '@/features/world-models/components/world-models-paper-grid';
import { WorldModelsProjectGrid } from '@/features/world-models/components/world-models-project-grid';
import { WorldModelsSignalDeck } from '@/features/world-models/components/world-models-signal-deck';
import { WorldModelsThisWeek } from '@/features/world-models/components/world-models-this-week';
import { WorldModelsTimelinePreview } from '@/features/world-models/components/world-models-timeline-preview';
import { WorldModelsTopicGrid } from '@/features/world-models/components/world-models-topic-grid';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 600;
export const generateMetadata = getMetadata({
  metadataKey: 'directory.home.metadata',
  canonicalUrl: '/',
});

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('directory.home');
  const homepageData = await getWorldModelsHomepageData();
  const isZh = locale === 'zh';
  const leadUpdate = homepageData.weeklyUpdates[0];
  const leadPaper = homepageData.featuredPapers[0];
  const leadProject = homepageData.featuredProjects[0];
  const quickAccessItems = [
    {
      href: '/updates',
      label: t('quick_access.updates.label'),
      description: t('quick_access.updates.description'),
    },
    {
      href: '/timeline',
      label: t('quick_access.timeline.label'),
      description: t('quick_access.timeline.description'),
    },
    {
      href: '/papers',
      label: t('quick_access.papers.label'),
      description: t('quick_access.papers.description'),
    },
    {
      href: '/topics/world-models',
      label: t('quick_access.topics.label'),
      description: t('quick_access.topics.description'),
    },
  ];
  const pageUrl =
    locale === 'en' ? envConfigs.app_url : `${envConfigs.app_url}/${locale}`;
  const imageUrl = envConfigs.app_preview_image.startsWith('http')
    ? envConfigs.app_preview_image
    : `${envConfigs.app_url}${envConfigs.app_preview_image}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${envConfigs.app_url}#website`,
        name: envConfigs.app_name,
        url: envConfigs.app_url,
        inLanguage: locale,
        description: t('metadata.description'),
        publisher: {
          '@id': `${envConfigs.app_url}#organization`,
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection-page`,
        name: t('metadata.title'),
        url: pageUrl,
        description: t('metadata.description'),
        inLanguage: locale,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${envConfigs.app_url}#website`,
        },
        about: {
          '@type': 'Thing',
          name: 'World models',
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: envConfigs.app_name,
              item: pageUrl,
            },
          ],
        },
        hasPart: [
          ...homepageData.weeklyUpdates.slice(0, 3).map((item) => ({
            '@type': 'Article',
            headline: isZh ? item.title_zh : item.title_en,
            url:
              locale === 'en'
                ? `${envConfigs.app_url}/updates/${item.slug}`
                : `${envConfigs.app_url}/${locale}/updates/${item.slug}`,
            isPartOf: {
              '@id': `${pageUrl}#collection-page`,
            },
          })),
          ...homepageData.featuredPapers.slice(0, 3).map((item) => ({
            '@type': 'ScholarlyArticle',
            headline: isZh ? item.title_zh : item.title_en,
            url:
              locale === 'en'
                ? `${envConfigs.app_url}/papers/${item.slug}`
                : `${envConfigs.app_url}/${locale}/papers/${item.slug}`,
            isPartOf: {
              '@id': `${pageUrl}#collection-page`,
            },
          })),
        ],
      },
      {
        '@type': 'ItemList',
        name: isZh ? '编辑部精选' : 'Editor picks',
        itemListElement: [leadUpdate, leadPaper, leadProject]
          .filter(Boolean)
          .map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url:
              'source_name' in item
                ? locale === 'en'
                  ? `${envConfigs.app_url}/updates/${item.slug}`
                  : `${envConfigs.app_url}/${locale}/updates/${item.slug}`
                : 'organization' in item
                  ? locale === 'en'
                    ? `${envConfigs.app_url}/projects/${item.slug}`
                    : `${envConfigs.app_url}/${locale}/projects/${item.slug}`
                  : locale === 'en'
                    ? `${envConfigs.app_url}/papers/${item.slug}`
                    : `${envConfigs.app_url}/${locale}/papers/${item.slug}`,
          })),
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <Script
        id={`home-jsonld-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsHero
        locale={locale}
        badge={t('hero_badge')}
        title={t('title')}
        description={t('description')}
        paperCountLabel={t('hero_papers_label')}
        updateCountLabel={t('hero_updates_label')}
        topicCountLabel={t('hero_topics_label')}
        primaryCta={t('hero_primary_cta')}
        secondaryCta={t('hero_secondary_cta')}
        paperCountHint={t('hero_papers_hint')}
        updateCountHint={t('hero_updates_hint')}
        topicCountHint={t('hero_topics_hint')}
        latestLabel={t('hero_latest_label')}
        latestTitle={
          leadUpdate ? (isZh ? leadUpdate.title_zh : leadUpdate.title_en) : t('title')
        }
        latestSummary={
          leadUpdate
            ? isZh
              ? leadUpdate.summary_zh
              : leadUpdate.summary_en
            : t('description')
        }
        latestDate={leadUpdate?.date ?? ''}
        latestSource={leadUpdate?.source_name ?? 'World Models Atlas'}
        latestHref={leadUpdate ? `/updates/${leadUpdate.slug}` : '/updates'}
        latestCta={t('hero_latest_cta')}
        quickAccessLabel={t('hero_quick_access_label')}
        quickAccessItems={quickAccessItems}
        paperCount={homepageData.featuredPapers.length}
        updateCount={homepageData.weeklyUpdates.length}
        topicCount={homepageData.topicGrid.length}
      />

      <WorldModelsSignalDeck
        locale={locale}
        title={t('signal_deck.title')}
        description={t('signal_deck.description')}
        updatesLabel={t('signal_deck.updates')}
        papersLabel={t('signal_deck.papers')}
        topicsLabel={t('signal_deck.topics')}
        updates={homepageData.weeklyUpdates.slice(0, 3).map((item) => ({
          slug: item.slug,
          title: isZh ? item.title_zh : item.title_en,
          meta: `${item.date} · ${item.source_name}`,
          href: `/updates/${item.slug}`,
        }))}
        papers={homepageData.featuredPapers.slice(0, 3).map((item) => ({
          slug: item.slug,
          title: isZh ? item.title_zh : item.title_en,
          meta: `${item.paper_venue} · ${item.year}`,
          href: `/papers/${item.slug}`,
        }))}
        topics={homepageData.topicGrid.slice(0, 4).map((item) => ({
          slug: item.slug,
          name: isZh ? item.name_zh : item.name_en,
          description: isZh ? item.description_zh : item.description_en,
        }))}
      />

      <WorldModelsEditorPicks
        locale={locale}
        title={t('editor_picks.title')}
        description={t('editor_picks.description')}
        items={[
          leadUpdate
            ? {
                slug: `update-${leadUpdate.slug}`,
                label: t('editor_picks.labels.update'),
                title: isZh ? leadUpdate.title_zh : leadUpdate.title_en,
                summary: isZh ? leadUpdate.summary_zh : leadUpdate.summary_en,
                meta: `${leadUpdate.date} · ${leadUpdate.source_name}`,
                href: `/updates/${leadUpdate.slug}`,
              }
            : null,
          leadPaper
            ? {
                slug: `paper-${leadPaper.slug}`,
                label: t('editor_picks.labels.paper'),
                title: isZh ? leadPaper.title_zh : leadPaper.title_en,
                summary: isZh
                  ? leadPaper.editorial_summary_zh
                  : leadPaper.editorial_summary_en,
                meta: `${leadPaper.paper_venue} · ${leadPaper.year}`,
                href: `/papers/${leadPaper.slug}`,
              }
            : null,
          leadProject
            ? {
                slug: `project-${leadProject.slug}`,
                label: t('editor_picks.labels.project'),
                title: leadProject.name,
                summary: isZh
                  ? leadProject.editorial_summary_zh
                  : leadProject.editorial_summary_en,
                meta: leadProject.organization,
                href: `/projects/${leadProject.slug}`,
              }
            : null,
        ].filter((item) => item !== null)}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          {t('search_paths.title')}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {t('search_paths.description')}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              href: '/latest-world-model-papers',
              label: t('search_paths.links.latest_papers.label'),
              description: t('search_paths.links.latest_papers.description'),
            },
            {
              href: '/world-model-projects',
              label: t('search_paths.links.projects.label'),
              description: t('search_paths.links.projects.description'),
            },
            {
              href: '/physical-ai-world-models',
              label: t('search_paths.links.physical_ai.label'),
              description: t('search_paths.links.physical_ai.description'),
            },
            {
              href: '/embodied-ai-papers',
              label: t('search_paths.links.embodied_papers.label'),
              description: t('search_paths.links.embodied_papers.description'),
            },
          ].map((item) => (
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      <WorldModelsThisWeek
        locale={locale}
        title={t('sections.this_week')}
        ctaLabel={t('update_cta')}
        items={homepageData.weeklyUpdates.map((item) => ({
          slug: item.slug,
          title: isZh ? item.title_zh : item.title_en,
          summary: isZh ? item.summary_zh : item.summary_en,
          date: item.date,
          sourceName: item.source_name,
          href: `/updates/${item.slug}`,
        }))}
      />

      <WorldModelsTopicGrid
        title={t('sections.topics')}
        locale={locale}
        items={homepageData.topicGrid.map((item) => ({
          slug: item.slug,
          name: isZh ? item.name_zh : item.name_en,
          description: isZh ? item.description_zh : item.description_en,
        }))}
      />

      <WorldModelsTimelinePreview
        locale={locale}
        title={t('sections.timeline')}
        ctaLabel={t('timeline_cta')}
        items={homepageData.timelinePreview.map((item) => ({
          slug: item.slug,
          title: isZh ? item.title_zh : item.title_en,
          description: isZh ? item.description_zh : item.description_en,
          date: item.date,
          href: '/timeline',
        }))}
      />

      <WorldModelsPaperGrid
        title={t('sections.must_read_papers')}
        locale={locale}
        items={homepageData.featuredPapers.map((item) => ({
          slug: item.slug,
          title: isZh ? item.title_zh : item.title_en,
          summary: isZh ? item.editorial_summary_zh : item.editorial_summary_en,
          venue: item.paper_venue,
          year: item.year,
          href: `/papers/${item.slug}`,
        }))}
      />

      <WorldModelsProjectGrid
        title={t('sections.notable_projects')}
        locale={locale}
        items={homepageData.featuredProjects.map((item) => ({
          slug: item.slug,
          name: item.name,
          organization: item.organization,
          summary: isZh ? item.editorial_summary_zh : item.editorial_summary_en,
          href: item.source_url,
        }))}
      />
    </div>
  );
}
