import { ReactNode } from 'react';

import { Link } from '@/core/i18n/navigation';

const navItems = [
  { href: '/', label: 'Atlas' },
  { href: '/papers', label: 'Papers' },
  { href: '/projects', label: 'Projects' },
  { href: '/updates', label: 'Updates' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/about', label: 'About' },
];

export function WorldModelsSiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const brand = locale === 'zh' ? '世界模型图谱' : 'World Models Atlas';
  const tagline =
    locale === 'zh'
      ? '整理世界模型论文、系统、时间线与最新进展'
      : 'Papers, systems, timeline, and weekly world-model updates';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_40%,#f6f8fb_100%)] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-950"
            >
              {brand}
            </Link>
            <p className="text-sm text-slate-600">{tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-slate-300 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>{brand}</p>
          <p>{tagline}</p>
        </div>
      </footer>
    </div>
  );
}
