import { getTranslations, setRequestLocale } from 'next-intl/server';

import { WorldModelsPageHeader } from '@/features/world-models/components/world-models-page-header';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;
export const generateMetadata = getMetadata({
  metadataKey: 'pages.about.metadata',
  canonicalUrl: '/about',
});

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.about');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:py-8">
      <WorldModelsPageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {t('sections.scope_title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t('sections.scope_body')}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {t('sections.workflow_title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t('sections.workflow_body')}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {t('sections.editorial_title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t('sections.editorial_body')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
