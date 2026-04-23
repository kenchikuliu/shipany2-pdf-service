import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

export function formatPageTitle(pageTitle: string | undefined, appName: string) {
  const normalizedAppName = appName.trim();
  const normalizedPageTitle = pageTitle?.trim();

  if (!normalizedAppName) {
    return normalizedPageTitle || '';
  }

  if (!normalizedPageTitle || normalizedPageTitle === normalizedAppName) {
    return normalizedAppName;
  }

  return `${normalizedPageTitle} | ${normalizedAppName}`;
}

// get metadata for page component
export function getMetadata(
  options: {
    title?: string;
    description?: string;
    keywords?: string;
    metadataKey?: string;
    canonicalUrl?: string; // relative path or full url
    imageUrl?: string;
    appName?: string;
    noIndex?: boolean;
  } = {}
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const appUrl = envConfigs.app_url;

    // passed metadata
    const passedMetadata = {
      title: options.title,
      description: options.description,
      keywords: options.keywords,
    };

    // default metadata
    const defaultMetadata = await getTranslatedMetadata(
      defaultMetadataKey,
      locale
    );

    // translated metadata
    let translatedMetadata: any = {};
    if (options.metadataKey) {
      translatedMetadata = await getTranslatedMetadata(
        options.metadataKey,
        locale
      );
    }

    // canonical url
    const canonicalUrl = await getCanonicalUrl(
      options.canonicalUrl || '',
      locale || '',
      appUrl
    );
    const alternateLanguages = getAlternateLanguageUrls(
      options.canonicalUrl || '',
      appUrl
    );

    const pageTitle =
      passedMetadata.title || translatedMetadata.title || defaultMetadata.title;
    const description =
      passedMetadata.description ||
      translatedMetadata.description ||
      defaultMetadata.description;

    // image url
    let imageUrl =
      options.imageUrl ||
      envConfigs.app_preview_image;
    if (imageUrl.startsWith('http')) {
      imageUrl = imageUrl;
    } else {
      imageUrl = `${appUrl}${imageUrl}`;
    }

    // app name
    const appName = options.appName || envConfigs.app_name || '';
    const title = options.metadataKey || options.title
      ? formatPageTitle(pageTitle, appName)
      : appName;

    return {
      title,
      description:
        passedMetadata.description ||
        translatedMetadata.description ||
        defaultMetadata.description,
      keywords:
        passedMetadata.keywords ||
        translatedMetadata.keywords ||
        defaultMetadata.keywords,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateLanguages,
      },

      openGraph: {
        type: 'website',
        locale: locale,
        url: canonicalUrl,
        title,
        description,
        siteName: appName,
        images: [imageUrl.toString()],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl.toString()],
        site: appUrl,
      },

      robots: {
        index: options.noIndex ? false : true,
        follow: options.noIndex ? false : true,
      },
    };
  };
}

const defaultMetadataKey = 'common.metadata';

async function getTranslatedMetadata(metadataKey: string, locale: string) {
  setRequestLocale(locale);
  const t = await getTranslations(metadataKey);

  return {
    title: t.has('title') ? t('title') : '',
    description: t.has('description') ? t('description') : '',
    keywords: t.has('keywords') ? t('keywords') : '',
  };
}

async function getCanonicalUrl(
  canonicalUrl: string,
  locale: string,
  appUrl: string
) {
  if (!canonicalUrl) {
    canonicalUrl = '/';
  }

  if (canonicalUrl.startsWith('http')) {
    // full url
    canonicalUrl = canonicalUrl;
  } else {
    // relative path
    if (!canonicalUrl.startsWith('/')) {
      canonicalUrl = `/${canonicalUrl}`;
    }

    canonicalUrl = `${appUrl}${
      !locale || locale === defaultLocale ? '' : `/${locale}`
    }${canonicalUrl}`;

    if (locale !== defaultLocale && canonicalUrl.endsWith('/')) {
      canonicalUrl = canonicalUrl.slice(0, -1);
    }
  }

  return canonicalUrl;
}

function getAlternateLanguageUrls(canonicalPath: string, appUrl: string) {
  let normalizedPath = '/';

  if (canonicalPath) {
    if (canonicalPath.startsWith('http')) {
      try {
        const parsed = new URL(canonicalPath);
        normalizedPath = parsed.pathname || '/';
      } catch {
        normalizedPath = '/';
      }
    } else {
      normalizedPath = canonicalPath.startsWith('/')
        ? canonicalPath
        : `/${canonicalPath}`;
    }
  }

  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      `${appUrl}${
        locale === defaultLocale ? '' : `/${locale}`
      }${normalizedPath === '/' ? '' : normalizedPath}`,
    ])
  );

  return {
    ...languages,
    'x-default': `${appUrl}${normalizedPath === '/' ? '' : normalizedPath}`,
  };
}
