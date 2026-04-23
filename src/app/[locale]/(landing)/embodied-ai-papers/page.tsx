import Script from 'next/script';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { WorldModelsSeoHubPage } from '@/features/world-models/components/world-models-seo-hub-page';
import { getSeoHubData } from '@/features/world-models/seo-hubs';
import { buildWorldModelsMetadata } from '@/features/world-models/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getSeoHubData('embodied-ai-papers', locale);
  return buildWorldModelsMetadata({
    title: data.title,
    description: data.description,
    locale,
    path: data.path,
  });
}

export default async function EmbodiedAiPapersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getSeoHubData('embodied-ai-papers', locale);
  const pageUrl =
    locale === 'en' ? `${envConfigs.app_url}${data.path}` : `${envConfigs.app_url}/${locale}${data.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: pageUrl,
  };

  return (
    <>
      <Script
        id={`seo-hub-jsonld-embodied-ai-papers-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldModelsSeoHubPage hubKey="embodied-ai-papers" locale={locale} />
    </>
  );
}
