import { ReactNode } from 'react';

import { WorldModelsSiteShell } from '@/features/world-models/components/world-models-site-shell';

export default async function DirectoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <WorldModelsSiteShell locale={locale}>{children}</WorldModelsSiteShell>;
}
