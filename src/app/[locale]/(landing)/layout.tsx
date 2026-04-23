import { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { WorldModelsSiteShell } from '@/features/world-models/components/world-models-site-shell';

export default async function LandingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WorldModelsSiteShell locale={locale}>{children}</WorldModelsSiteShell>;
}
