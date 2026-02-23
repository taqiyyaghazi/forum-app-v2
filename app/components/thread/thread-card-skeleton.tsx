import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ThreadCardSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((n) => (
        <Card key={n} className="shadow-sm border-slate-200 overflow-hidden">
          <div className="block space-y-4 p-6">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-7 w-3/4 mb-4" />
            <div className="border-l-2 border-primary/20 pl-3 space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
            <div className="flex items-center gap-4 text-sm pt-4 border-t border-slate-100 mt-6">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-24 ml-auto" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
