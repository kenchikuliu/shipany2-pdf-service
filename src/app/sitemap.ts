import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import {
  getAllTopics,
  getPapersIndexData,
  getProjectsIndexData,
  getUpdatesIndexData,
} from '@/features/world-models/content/queries';
import { loadWorldModelsContent } from '@/features/world-models/content/loaders';
import { seoHubPaths } from '@/features/world-models/seo-hubs';

export const dynamic = 'force-dynamic';

function localizeUrl(path: string, locale: string, appUrl: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale
    ? `${appUrl}${normalizedPath}`
    : `${appUrl}/${locale}${normalizedPath}`;
}

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const proto = requestHeaders.get('x-forwarded-proto') || 'https';
  const appUrl = host ? `${proto}://${host}` : envConfigs.app_url;
  const [topics, papers, projects, updates, content] = await Promise.all([
    getAllTopics(),
    getPapersIndexData(),
    getProjectsIndexData(),
    getUpdatesIndexData(),
    loadWorldModelsContent(),
  ]);

  const staticRoutes = [
    '/',
    '/about',
    '/papers',
    '/projects',
    '/updates',
    '/timeline',
    ...seoHubPaths,
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: localizeUrl(route, locale, appUrl),
        lastModified: new Date(),
        changeFrequency: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 1 : 0.8,
      });
    }

    for (const topic of topics) {
      entries.push({
        url: localizeUrl(`/topics/${topic.slug}`, locale, appUrl),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const paper of papers) {
      entries.push({
        url: localizeUrl(`/papers/${paper.slug}`, locale, appUrl),
        lastModified: toDate(paper.publication_date) ?? new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    for (const project of projects) {
      entries.push({
        url: localizeUrl(`/projects/${project.slug}`, locale, appUrl),
        lastModified: toDate(project.release_date) ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const update of updates) {
      entries.push({
        url: localizeUrl(`/updates/${update.slug}`, locale, appUrl),
        lastModified: toDate(update.date) ?? new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    const timelineLatest =
      content.timeline
        .map((item) => toDate(item.date))
        .filter((item): item is Date => Boolean(item))
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();

    entries.push({
      url: localizeUrl('/timeline', locale, appUrl),
      lastModified: timelineLatest,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}
