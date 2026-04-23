import {
  DirectoryGridSkeleton,
  DirectoryHeroSkeleton,
} from './_components/loading-skeletons';

export default function DirectoryLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <DirectoryHeroSkeleton />
      <div className="mb-8">
        <div className="mb-3">
          <div className="h-7 w-32 rounded-lg bg-accent animate-pulse" />
        </div>
        <DirectoryGridSkeleton count={4} featured />
      </div>
      <div>
        <div className="mb-3">
          <div className="h-7 w-40 rounded-lg bg-accent animate-pulse" />
        </div>
        <DirectoryGridSkeleton count={8} />
      </div>
    </div>
  );
}
