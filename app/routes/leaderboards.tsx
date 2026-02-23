import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import { fetchLeaderboards } from '~/stores/leaderboardsSlice';
import { Trophy } from 'lucide-react';
import { LeaderboardItem } from '~/components/leaderboard/leaderboard-item';
import { LeaderboardSkeleton } from '~/components/leaderboard/leaderboard-skeleton';
import type { Route } from './+types/leaderboards';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Leaderboards - Vokraf Forum' },
    {
      name: 'description',
      content: 'Lihat peringkat pengguna teraktif di Vokraf Forum',
    },
  ];
}

export default function LeaderboardsPage() {
  const dispatch = useAppDispatch();
  const { leaderboards, isLoading, error } = useAppSelector(
    (state) => state.leaderboards,
  );

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Klasemen Pengguna Aktif
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {isLoading
              ? 'Memuat peringkat...'
              : 'Peringkat pengguna paling aktif berdasarkan total poin.'}
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center justify-center min-h-[20vh] font-medium border border-destructive/20 shadow-sm">
          {error}
        </div>
      ) : (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Pengguna
            </CardTitle>
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Skor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {isLoading && <LeaderboardSkeleton />}

              {!isLoading &&
                leaderboards.map((entry, index) => (
                  <LeaderboardItem
                    key={entry.user.id}
                    entry={entry}
                    index={index}
                  />
                ))}

              {leaderboards.length === 0 && !isLoading && (
                <div className="py-12 text-center text-slate-500">
                  Belum ada data pada papan peringkat.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
