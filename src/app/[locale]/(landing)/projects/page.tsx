import { getTranslations, setRequestLocale } from 'next-intl/server';

import { localizeText } from '@/features/world-models/content/localize';
import {
  getAllTopics,
  getProjectsIndexData,
} from '@/features/world-models/content/queries';
import { WorldModelsPageHeader } from '@/features/world-models/components/world-models-page-header';
import { WorldModelsFaqSection } from '@/features/world-models/components/world-models-faq-section';
import { WorldModelsProjectGrid } from '@/features/world-models/components/world-models-project-grid';
import { WorldModelsTopicFilter } from '@/features/world-models/components/world-models-topic-filter';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;
export const generateMetadata = getMetadata({
  metadataKey: 'pages.projects.metadata',
  canonicalUrl: '/projects',
});

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { locale } = await params;
  const { topic } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('pages.projects');
  const [projects, topics] = await Promise.all([
    getProjectsIndexData(topic),
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
        basePath="/projects"
        allLabel={t('all_topics')}
        activeSlug={topic}
        items={topics.map((item) => ({
          slug: item.slug,
          label: localizeText(item, locale, 'name_zh', 'name_en'),
        }))}
      />
      <WorldModelsProjectGrid
        title={t('section_title')}
        locale={locale}
        ctaLabel={t('cta')}
        items={projects.map((project) => ({
          slug: project.slug,
          name: project.name,
          organization: project.organization,
          summary: localizeText(
            project,
            locale,
            'editorial_summary_zh',
            'editorial_summary_en'
          ),
          href: `/projects/${project.slug}`,
          meta: project.type.replace('-', ' '),
        }))}
      />
      <WorldModelsFaqSection
        title={t('faq.title')}
        items={faqItems}
        scriptId={`projects-faq-${locale}`}
      />
    </div>
  );
}
