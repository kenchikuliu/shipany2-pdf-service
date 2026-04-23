import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Script from 'next/script';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { getGlobalStructuredData } from '@/features/world-models/structured-data';
import { ThemeProvider } from '@/core/theme/provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppContextProvider } from '@/shared/contexts/app';
import { getMetadata } from '@/shared/lib/seo';
import { getPublicConfigs } from '@/shared/models/config';
import { getAnalyticsManagerWithConfigs } from '@/shared/services/analytics';

export const generateMetadata = getMetadata();

function setNestedValue(target: Record<string, any>, path: string[], value: unknown) {
  let current = target;

  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[path[path.length - 1]] = value;
}

function getNestedValue(source: Record<string, any>, path: string[]) {
  return path.reduce<any>((current, key) => current?.[key], source);
}

function normalizePathname(pathname: string, locale: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  if (pathname === `/${locale}`) {
    return '/';
  }

  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1) || '/';
  }

  return pathname;
}

function pickClientMessageNamespaces(
  messages: Record<string, any>,
  pathname: string,
  locale: string
) {
  const normalizedPath = normalizePathname(pathname, locale);
  const namespaces = new Set<string>(['common']);

  if (
    normalizedPath === '/' ||
    normalizedPath.startsWith('/submit') ||
    normalizedPath.startsWith('/category') ||
    normalizedPath.startsWith('/item')
  ) {
    namespaces.add('directory');
  }

  if (normalizedPath === '/about') namespaces.add('pages.about');
  if (normalizedPath === '/papers') namespaces.add('pages.papers');
  if (normalizedPath.startsWith('/papers/')) namespaces.add('pages.paper_detail');
  if (normalizedPath === '/projects') namespaces.add('pages.projects');
  if (normalizedPath.startsWith('/projects/')) namespaces.add('pages.project_detail');
  if (normalizedPath === '/updates') namespaces.add('pages.updates');
  if (normalizedPath.startsWith('/updates/')) namespaces.add('pages.update_detail');
  if (normalizedPath === '/timeline') namespaces.add('pages.timeline');
  if (normalizedPath.startsWith('/topics/')) namespaces.add('pages.topics');

  const pickedMessages: Record<string, any> = {};

  for (const namespace of namespaces) {
    const path = namespace.split('.');
    const value = getNestedValue(messages, path);

    if (value) {
      setNestedValue(pickedMessages, path, value);
    }
  }

  return pickedMessages;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const publicConfigs = await getPublicConfigs();
  const analytics = getAnalyticsManagerWithConfigs(publicConfigs);
  const globalStructuredData = getGlobalStructuredData(locale);
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-pathname') || '/';
  const messages = await getMessages();
  const clientMessages = pickClientMessageNamespaces(messages, pathname, locale);

  return (
    <NextIntlClientProvider messages={clientMessages}>
      <ThemeProvider>
        <AppContextProvider initialConfigs={publicConfigs}>
          {analytics.getHeadScripts()}
          <Script
            id={`global-structured-data-${locale}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(globalStructuredData),
            }}
          />
          {children}
          <Toaster position="top-center" richColors />
          {analytics.getBodyScripts()}
        </AppContextProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
