import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { envConfigs } from '@/config';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const proto = requestHeaders.get('x-forwarded-proto') || 'https';
  const appUrl = host ? `${proto}://${host}` : envConfigs.app_url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*?*q=',
        '/privacy-policy',
        '/terms-of-service',
        '/settings/*',
        '/activity/*',
        '/admin/*',
        '/api/*',
      ],
    },
    host: appUrl,
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
