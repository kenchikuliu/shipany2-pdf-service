import type { Metadata } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

export function buildWorldModelsMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description: string;
  locale: string;
  path: string;
}): Metadata {
  const appUrl = envConfigs.app_url;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonical =
    locale === defaultLocale
      ? `${appUrl}${normalizedPath}`
      : `${appUrl}/${locale}${normalizedPath}`;

  const languages = Object.fromEntries(
    locales.map((item) => [
      item,
      item === defaultLocale
        ? `${appUrl}${normalizedPath}`
        : `${appUrl}/${item}${normalizedPath}`,
    ])
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': `${appUrl}${normalizedPath}`,
      },
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: envConfigs.app_name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
