import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';

import { envConfigs } from '@/config';
import { localizeText } from '@/features/world-models/content/localize';
import { getTopicOverride } from '@/features/world-models/content/topic-overrides';
import {
  getOtherTopics,
  getTopicPageData,
} from '@/features/world-models/content/queries';
import { WorldModelsNextReads } from '@/features/world-models/components/world-models-next-reads';
import { WorldModelsTopicLayout } from '@/features/world-models/components/world-models-topic-layout';
import { buildWorldModelsMetadata } from '@/features/world-models/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pageData = await getTopicPageData(slug);
  if (!pageData) {
    return {};
  }

  return buildWorldModelsMetadata({
    title:
      locale === 'zh'
        ? `${localizeText(pageData.topic, locale, 'name_zh', 'name_en')}论文、项目与最新进展`
        : `${localizeText(pageData.topic, locale, 'name_zh', 'name_en')} Papers, Projects, and Latest Updates`,
    description:
      locale === 'zh'
        ? `追踪${localizeText(pageData.topic, locale, 'name_zh', 'name_en')}的核心论文、代表项目、近期更新与关键时间线。`
        : `Track the core papers, projects, recent updates, and milestone timeline for ${localizeText(pageData.topic, locale, 'name_zh', 'name_en')}.`,
    locale,
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.topics');
  const [pageData, otherTopics] = await Promise.all([
    getTopicPageData(slug),
    getOtherTopics(slug),
  ]);
  if (!pageData) {
    notFound();
  }
  const pageUrl =
    locale === 'en'
      ? `${envConfigs.app_url}/topics/${slug}`
      : `${envConfigs.app_url}/${locale}/topics/${slug}`;
  const leadPaper = pageData.papers[0];
  const leadProject = pageData.projects[0];
  const leadUpdate = pageData.updates[0];
  const topicOverride = getTopicOverride(slug);
  const faqItems =
    topicOverride?.faq.map((item) => ({
      question: locale === 'zh' ? item.questionZh : item.questionEn,
      answer: locale === 'zh' ? item.answerZh : item.answerEn,
    })) ?? [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: localizeText(pageData.topic, locale, 'name_zh', 'name_en'),
        description: localizeText(
          pageData.topic,
          locale,
          'description_zh',
          'description_en'
        ),
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: envConfigs.app_name,
          url: envConfigs.app_url,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: envConfigs.app_name,
            item: locale === 'en' ? envConfigs.app_url : `${envConfigs.app_url}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale === 'zh' ? '专题' : 'Topics',
            item:
              locale === 'en'
                ? `${envConfigs.app_url}/`
                : `${envConfigs.app_url}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: localizeText(pageData.topic, locale, 'name_zh', 'name_en'),
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: locale === 'zh' ? '开始阅读' : 'Start here',
        itemListElement: [leadPaper, leadProject, leadUpdate]
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
      ...(faqItems.length
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:py-8">
      <Script
        id={`topic-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsTopicLayout
        locale={locale}
        title={localizeText(pageData.topic, locale, 'name_zh', 'name_en')}
        description={localizeText(
          pageData.topic,
          locale,
          'description_zh',
          'description_en'
        )}
        intro={localizeText(pageData.topic, locale, 'hero_zh', 'hero_en')}
        eyebrow={t('eyebrow')}
        papersTitle={t('papers_title')}
        papers={pageData.papers.map((paper) => ({
          slug: paper.slug,
          title: localizeText(paper, locale, 'title_zh', 'title_en'),
          summary: localizeText(
            paper,
            locale,
            'editorial_summary_zh',
            'editorial_summary_en'
          ),
          href: `/papers/${paper.slug}`,
          meta: `${paper.paper_venue} · ${paper.year}`,
        }))}
        projectsTitle={t('projects_title')}
        projects={pageData.projects.map((project) => ({
          slug: project.slug,
          title: project.name,
          summary: localizeText(
            project,
            locale,
            'editorial_summary_zh',
            'editorial_summary_en'
          ),
          href: `/projects/${project.slug}`,
          meta: project.organization,
        }))}
        updatesTitle={t('updates_title')}
        updates={pageData.updates.map((update) => ({
          slug: update.slug,
          title: localizeText(update, locale, 'title_zh', 'title_en'),
          summary: localizeText(update, locale, 'summary_zh', 'summary_en'),
          href: `/updates/${update.slug}`,
          meta: `${update.date} · ${update.source_name}`,
        }))}
        timelineTitle={t('timeline_title')}
        timeline={pageData.timeline.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'title_zh', 'title_en'),
          description: localizeText(item, locale, 'description_zh', 'description_en'),
          meta: item.date,
        }))}
        paperCountLabel={t('paper_count')}
        projectCountLabel={t('project_count')}
        updateCountLabel={t('update_count')}
        timelineCountLabel={t('timeline_count')}
        startHereTitle={t('start_here.title')}
        startHereDescription={t('start_here.description')}
        insightTitle={
          topicOverride
            ? locale === 'zh'
              ? topicOverride.summaryTitleZh
              : topicOverride.summaryTitleEn
            : undefined
        }
        insightBody={
          topicOverride
            ? locale === 'zh'
              ? topicOverride.summaryBodyZh
              : topicOverride.summaryBodyEn
            : undefined
        }
        startHereItems={[
          leadPaper
            ? {
                slug: `paper-${leadPaper.slug}`,
                title: localizeText(leadPaper, locale, 'title_zh', 'title_en'),
                summary: localizeText(
                  leadPaper,
                  locale,
                  'editorial_summary_zh',
                  'editorial_summary_en'
                ),
                href: `/papers/${leadPaper.slug}`,
                meta: `${t('start_here.paper')} · ${leadPaper.paper_venue} · ${leadPaper.year}`,
              }
            : null,
          leadProject
            ? {
                slug: `project-${leadProject.slug}`,
                title: leadProject.name,
                summary: localizeText(
                  leadProject,
                  locale,
                  'editorial_summary_zh',
                  'editorial_summary_en'
                ),
                href: `/projects/${leadProject.slug}`,
                meta: `${t('start_here.project')} · ${leadProject.organization}`,
              }
            : null,
          leadUpdate
            ? {
                slug: `update-${leadUpdate.slug}`,
                title: localizeText(leadUpdate, locale, 'title_zh', 'title_en'),
                summary: localizeText(
                  leadUpdate,
                  locale,
                  'summary_zh',
                  'summary_en'
                ),
                href: `/updates/${leadUpdate.slug}`,
                meta: `${t('start_here.update')} · ${leadUpdate.date}`,
              }
            : null,
        ].filter((item) => item !== null)}
        faqTitle={faqItems.length ? t('faq_title') : undefined}
        faqItems={faqItems}
      />
      <WorldModelsNextReads
        locale={locale}
        title={t('next_reads')}
        items={otherTopics.map((item) => ({
          slug: item.slug,
          title: localizeText(item, locale, 'name_zh', 'name_en'),
          summary: localizeText(item, locale, 'description_zh', 'description_en'),
          meta: t('next_topic'),
          href: `/topics/${item.slug}`,
        }))}
      />
    </div>
  );
}
