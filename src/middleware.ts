import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/core/i18n/config';
import { seoHubPaths } from '@/features/world-models/seo-hubs';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  if (hostname === 'www.worldmodelsatlas.site') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = 'worldmodelsatlas.site';
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (
    seoHubPaths.includes(pathname) &&
    routing.defaultLocale &&
    !pathname.startsWith(`/${routing.defaultLocale}/`)
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${routing.defaultLocale}${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  const intlResponse = intlMiddleware(request);

  const locale = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(locale as any);
  const pathWithoutLocale = isValidLocale
    ? pathname.slice(locale.length + 1)
    : pathname;

  intlResponse.headers.set('x-pathname', request.nextUrl.pathname);
  intlResponse.headers.set('x-url', request.url);

  if (
    !pathWithoutLocale.startsWith('/admin') &&
    !pathWithoutLocale.startsWith('/settings') &&
    !pathWithoutLocale.startsWith('/activity') &&
    !pathWithoutLocale.startsWith('/sign-') &&
    !pathWithoutLocale.startsWith('/auth')
  ) {
    intlResponse.headers.delete('Set-Cookie');

    const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=14400';

    intlResponse.headers.set('Cache-Control', cacheControl);
    intlResponse.headers.set('CDN-Cache-Control', cacheControl);
    intlResponse.headers.set('Cloudflare-CDN-Cache-Control', cacheControl);
  }

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
