'use client';

import { Menu, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname as useNextPathname } from 'next/navigation';

import { Link } from '@/core/i18n/navigation';
import { LocaleSelector } from '@/shared/blocks/common';
import { ThemeToggler } from '@/shared/blocks/common/theme-toggler';
import { SignUser } from '@/shared/blocks/sign/sign-user';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { cn } from '@/shared/lib/utils';

export function NavDirectoryHeader({
  app_logo,
  app_name,
}: {
  app_logo?: string;
  app_name?: string;
}) {
  const t = useTranslations('directory.layout.sidebar.quick_links');
  const pathname = useNextPathname();
  const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';
  const currentPath = normalizePath(pathname);

  const headerLinks: {
    id: string;
    name: string;
    href: string;
    target?: string;
    rel?: string;
  }[] = [
    {
      id: 'search',
      name: t('search'),
      href: '/search',
    },
    {
      id: 'explore',
      name: t('explore'),
      href: '/explore',
    },
    {
      id: 'submit',
      name: t('submit'),
      href: '/submit',
    },
  ];

  return (
    <header className="bg-background/95 sticky top-0 z-30 shrink-0 border-b px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/75 transition-[width] duration-300 sm:px-4 lg:h-16 lg:px-3 lg:py-0">
      <div className="flex items-center justify-between gap-3 lg:h-full">
        <div className="hidden min-w-0 items-center gap-2 lg:flex">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <div className="ml-2 min-w-0 items-center gap-4 lg:flex lg:gap-6">
            {headerLinks.map((link) => {
              const targetPath = normalizePath(link.href);
              const isActive =
                currentPath === targetPath ||
                (targetPath !== '/' &&
                  currentPath.startsWith(`${targetPath}/`));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  title={link.name}
                  prefetch={
                    link.target && link.target === '_blank' ? false : true
                  }
                  target={link.target || '_self'}
                  rel={link.rel || undefined}
                  className={cn(
                    'inline-flex items-center gap-x-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between lg:hidden">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {app_logo ? (
              <img
                src={app_logo}
                alt={app_name || ''}
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
            )}
            <span className="truncate text-xl font-extrabold tracking-tight text-foreground">
              {app_name || ''}
            </span>
          </Link>
          <SidebarTrigger className="size-10 rounded-full">
            <Menu className="size-6" />
          </SidebarTrigger>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:gap-2.5 md:gap-3 lg:flex">
          <LocaleSelector />
          <ThemeToggler
            type="icon"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-primary/10"
          />
          <div className="ml-1 sm:ml-2">
            <SignUser
              userNav={{
                show_name: true,
                show_sign_out: true,
                items: [],
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
