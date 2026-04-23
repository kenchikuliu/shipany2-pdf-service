import { Skeleton } from '@/shared/components/ui/skeleton';

export function DirectoryHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-3">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <Skeleton className="h-4 w-2/3 max-w-xl" />
    </div>
  );
}

export function DirectoryHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-8 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.1),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.1),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_320px] lg:items-end">
        <div className="max-w-4xl space-y-5">
          <Skeleton className="h-8 w-36 rounded-full bg-white/85 dark:bg-white/10" />
          <Skeleton className="h-11 w-full max-w-2xl rounded-2xl bg-white/90 dark:bg-white/10 md:h-14" />
          <Skeleton className="h-5 w-full max-w-3xl bg-white/80 dark:bg-white/10" />
          <Skeleton className="h-5 w-4/5 max-w-2xl bg-white/80 dark:bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:max-w-sm lg:ml-auto lg:w-full">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
            <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-white/10" />
            <Skeleton className="mt-4 h-8 w-14 bg-slate-100 dark:bg-white/10" />
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
            <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-white/10" />
            <Skeleton className="mt-4 h-8 w-14 bg-slate-100 dark:bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DirectoryFiltersSkeleton() {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function DirectoryItemCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 flex-1 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-3 w-10 rounded" />
      </div>
    </div>
  );
}

export function DirectoryFeaturedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-4 pt-0">
        <div className="-mt-6 mb-3 flex items-start gap-4">
          <Skeleton className="h-[60px] w-[60px] rounded-xl" />
          <div className="flex-1 space-y-2 pt-7">
            <Skeleton className="h-6 w-2/3 rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DirectoryGridSkeleton({
  count = 8,
  featured = false,
}: {
  count?: number;
  featured?: boolean;
}) {
  const Card = featured
    ? DirectoryFeaturedCardSkeleton
    : DirectoryItemCardSkeleton;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
}

export function DirectoryDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Skeleton className="h-10 w-full rounded-xl sm:w-32" />
              <Skeleton className="h-10 w-full rounded-xl sm:w-24" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="space-y-3 border-t border-border/60 pt-8">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <Skeleton className="mb-5 h-6 w-40 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border/60 pb-3"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <DirectoryFeaturedCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DirectorySubmitSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8 md:space-y-12">
        <div className="mb-8 space-y-4 text-center md:mb-16 md:space-y-6">
          <Skeleton className="mx-auto h-7 w-28 rounded-full" />
          <Skeleton className="mx-auto h-12 w-full max-w-xl rounded-2xl" />
          <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
          <Skeleton className="mx-auto h-5 w-4/5 max-w-xl" />
        </div>
        <div className="rounded-[2rem] border border-border/70 bg-card p-4 shadow-sm sm:p-8">
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 rounded-2xl border border-border/60 p-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-5 md:mt-16">
            <div className="grid gap-5 md:grid-cols-2">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="flex justify-end">
              <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
