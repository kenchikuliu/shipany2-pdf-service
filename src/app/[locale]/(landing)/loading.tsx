import { Skeleton } from '@/shared/components/ui/skeleton';

export default function LandingLoading() {
  return (
    <div className="pb-24 pt-28 md:pt-36">
      <section className="mx-auto max-w-5xl px-4 text-center">
        <Skeleton className="mx-auto mb-8 h-10 w-40 rounded-full" />
        <Skeleton className="mx-auto h-14 w-full max-w-3xl rounded-2xl" />
        <Skeleton className="mx-auto mt-4 h-14 w-5/6 max-w-2xl rounded-2xl" />
        <Skeleton className="mx-auto mt-8 h-5 w-full max-w-2xl" />
        <Skeleton className="mx-auto mt-3 h-5 w-3/4 max-w-xl" />
        <div className="mt-8 flex justify-center gap-4">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="mb-8 space-y-3 text-center">
          <Skeleton className="mx-auto h-9 w-48 rounded-xl" />
          <Skeleton className="mx-auto h-4 w-full max-w-2xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-border/60 bg-card/50 p-6"
            >
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
