import { envConfigs } from '@/config';

export function getGlobalStructuredData(locale: string) {
  const appUrl = envConfigs.app_url;
  const orgId = `${appUrl}#organization`;
  const websiteId = `${appUrl}#website`;
  const pageUrl = locale === 'en' ? appUrl : `${appUrl}/${locale}`;
  const imageUrl = envConfigs.app_preview_image.startsWith('http')
    ? envConfigs.app_preview_image
    : `${appUrl}${envConfigs.app_preview_image}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: envConfigs.app_name,
        url: appUrl,
        logo: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: appUrl,
        name: envConfigs.app_name,
        description: envConfigs.app_description || envConfigs.app_name,
        inLanguage: ['en', 'zh'],
        publisher: {
          '@id': orgId,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: envConfigs.app_name,
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': orgId,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        inLanguage: locale,
      },
    ],
  };
}
