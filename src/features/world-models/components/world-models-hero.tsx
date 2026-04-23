import Image from 'next/image';
import {
  ArrowUpRight,
  BrainCircuit,
  CalendarClock,
  FileText,
  Orbit,
  Sparkles,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

type WorldModelsHeroProps = {
  locale: string;
  badge: string;
  title: string;
  description: string;
  paperCountLabel: string;
  updateCountLabel: string;
  topicCountLabel: string;
  primaryCta: string;
  secondaryCta: string;
  paperCountHint: string;
  updateCountHint: string;
  topicCountHint: string;
  latestLabel: string;
  latestTitle: string;
  latestSummary: string;
  latestDate: string;
  latestSource: string;
  latestHref: string;
  latestCta: string;
  quickAccessLabel: string;
  quickAccessItems: Array<{
    href: string;
    label: string;
    description: string;
  }>;
  paperCount: number;
  updateCount: number;
  topicCount: number;
};

export function WorldModelsHero({
  locale,
  badge,
  title,
  description,
  paperCountLabel,
  updateCountLabel,
  topicCountLabel,
  primaryCta,
  secondaryCta,
  paperCountHint,
  updateCountHint,
  topicCountHint,
  latestLabel,
  latestTitle,
  latestSummary,
  latestDate,
  latestSource,
  latestHref,
  latestCta,
  quickAccessLabel,
  quickAccessItems,
  paperCount,
  updateCount,
  topicCount,
}: WorldModelsHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white px-6 py-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 md:px-8 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-sky-700 uppercase dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl md:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/papers"
              locale={locale}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-300"
            >
              {primaryCta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/updates"
              locale={locale}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
            >
              {secondaryCta}
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: '/topics/world-models', label: 'World Models' },
              { href: '/topics/video-world-models', label: 'Video' },
              { href: '/topics/driving-world-models', label: 'Driving' },
              { href: '/topics/embodied-world-models', label: 'Embodied' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={latestHref}
            locale={locale}
            className="group block rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.55)] transition-colors hover:bg-sky-950 dark:border-slate-800"
          >
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.85),rgba(2,6,23,0.95))]">
              <Image
                src="/world-models-hero-physical-ai.svg"
                alt="Physical AI world models visual"
                width={1200}
                height={900}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,28,0.06),rgba(8,15,28,0.28))]" />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                Physical AI
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100 backdrop-blur">
                World Model Layer
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100">
                <CalendarClock className="h-3.5 w-3.5" />
                {latestLabel}
              </div>
              <ArrowUpRight className="mt-4 h-4 w-4 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
              {latestTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {latestSummary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              <span>{latestDate}</span>
              <span>{latestSource}</span>
            </div>
            <div className="mt-4 text-sm font-medium text-sky-200">
              {latestCta}
            </div>
          </Link>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {quickAccessLabel}
            </div>
            <div className="mt-3 grid gap-2">
              {quickAccessItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className="rounded-[20px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 transition-colors hover:border-sky-300 hover:bg-sky-50/70 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
                >
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">
                    {item.label}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                <FileText className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  {paperCountLabel}
                </span>
              </div>
              <div className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                {paperCount}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {paperCountHint}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <BrainCircuit className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  {updateCountLabel}
                </span>
              </div>
              <div className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                {updateCount}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {updateCountHint}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Orbit className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  {topicCountLabel}
                </span>
              </div>
              <div className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                {topicCount}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {topicCountHint}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
