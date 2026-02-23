import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ThreadDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full ring-2 ring-white shadow-sm" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 font-bold" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <Skeleton className="h-8 w-3/4 mb-4" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>

          <div className="flex gap-2 pt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </CardFooter>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-3 bg-slate-50 p-4 rounded-xl rounded-tl-none border border-slate-100">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
