import type { Metadata } from 'next';

import '@/config/style/global.css';

import { envConfigs } from '@/config';

export const metadata: Metadata = {
  metadataBase: new URL(envConfigs.app_url),
  applicationName: envConfigs.app_name,
  icons: {
    icon: envConfigs.app_favicon,
    shortcut: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={envConfigs.locale || 'en'} suppressHydrationWarning>
      <head>
        <link rel="icon" href={envConfigs.app_favicon} />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {envConfigs.google_site_verification ? (
          <meta
            name="google-site-verification"
            content={envConfigs.google_site_verification}
          />
        ) : null}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
