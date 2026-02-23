import { Skeleton } from '~/components/ui/skeleton';

export function LeaderboardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={`skeleton-${n}`}
          className="flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </>
  );
}
