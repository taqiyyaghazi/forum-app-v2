import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import api from '~/lib/api';
import { ThreadDetailSkeleton } from '~/components/thread/thread-detail-skeleton';

import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import {
  fetchThreadDetail,
  clearThreadDetail,
} from '~/stores/threadDetailSlice';
import { Button } from '~/components/ui/button';
import { ThreadItemDetail } from '~/components/thread/thread-item-detail';
import { ThreadComments } from '~/components/thread/thread-comments';
import type { Route } from './+types/thread-detail';

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const res = await api.get(`/threads/${params.id}`);
    return {
      threadTitle: res.data.data.detailThread.title,
    };
  } catch (error) {
    return {
      threadTitle: 'Terjadi Kesalahan',
    };
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.threadTitle
        ? `${loaderData.threadTitle} - Forum App`
        : 'Detail Diskusi - Forum App',
    },
    { name: 'description', content: 'Lihat detail diskusi' },
  ];
}

export default function ThreadDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { detailThread, isLoading, error } = useAppSelector(
    (state) => state.threadDetail,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadDetail(id));
    }
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full shadow-sm"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm font-medium text-slate-500">Kembali</span>
        </div>

        {isLoading && <ThreadDetailSkeleton />}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm w-full mx-auto mt-20">
            <p className="font-semibold text-red-600 mb-4">{error}</p>
            <Button asChild variant="outline">
              <Link to="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        )}

        {!isLoading && !error && detailThread && (
          <>
            <ThreadItemDetail detailThread={detailThread} />

            <ThreadComments
              threadId={detailThread.id}
              comments={detailThread.comments}
            />
          </>
        )}
      </div>
    </div>
  );
}
