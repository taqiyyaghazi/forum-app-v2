import { startTransition, useOptimistic } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { optimisticVoteReducer } from '~/lib/optimisticVote';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import {
  downVoteThreadDetail,
  neutralVoteThreadDetail,
  upVoteThreadDetail,
} from '~/stores/threadDetailSlice';
import type { ThreadDetail } from '~/stores/threadDetailSlice';
import { toast } from 'sonner';

interface ThreadItemDetailProps {
  detailThread: ThreadDetail;
}

export function ThreadItemDetail({ detailThread }: ThreadItemDetailProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [optimisticVotes, addOptimisticVote] = useOptimistic(
    {
      upVotes: detailThread.upVotesBy,
      downVotes: detailThread.downVotesBy,
    },
    optimisticVoteReducer,
  );

  const isUpVoted = user ? optimisticVotes.upVotes.includes(user.id) : false;
  const isDownVoted = user
    ? optimisticVotes.downVotes.includes(user.id)
    : false;

  const handleUpVote = () => {
    if (!user) {
      toast.error('Gagal menyukai diskusi');
      return;
    }

    startTransition(async () => {
      addOptimisticVote({
        type: isUpVoted ? 'NEUTRAL_VOTE' : 'UP_VOTE',
        userId: user.id,
      });

      try {
        if (isUpVoted) {
          await dispatch(neutralVoteThreadDetail(detailThread.id)).unwrap();
        } else {
          await dispatch(upVoteThreadDetail(detailThread.id)).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  const handleDownVote = () => {
    if (!user) {
      toast.error('Gagal tidak menyukai diskusi');
      return;
    }

    startTransition(async () => {
      addOptimisticVote({
        type: isDownVoted ? 'NEUTRAL_VOTE' : 'DOWN_VOTE',
        userId: user.id,
      });

      try {
        if (isDownVoted) {
          await dispatch(neutralVoteThreadDetail(detailThread.id)).unwrap();
        } else {
          await dispatch(downVoteThreadDetail(detailThread.id)).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  // eslint-disable-next-line react/no-danger
  const sanitizedContent = { __html: DOMPurify.sanitize(detailThread.body) };

  return (
    <Card
      data-testid="thread-detail-card"
      className="shadow-sm border-slate-200 overflow-hidden"
    >
      <CardHeader className="bg-white border-b border-slate-100 pb-6">
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            #{detailThread.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(detailThread.createdAt), {
              addSuffix: true,
              locale: localeId,
            })}
          </span>
        </div>

        <CardTitle
          data-testid="thread-detail-title"
          className="text-2xl sm:text-3xl font-bold leading-tight text-slate-900 mb-6"
        >
          {detailThread.title}
        </CardTitle>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage
              src={detailThread.owner.avatar}
              alt={detailThread.owner.name}
            />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {detailThread.owner.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {detailThread.owner.name}
            </span>
            <span className="text-xs text-slate-500">Pembuat Diskusi</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-white pt-6 text-slate-700 leading-relaxed">
        <div
          data-testid="thread-detail-body"
          className="prose prose-slate max-w-none text-sm sm:text-base [word-break:break-word]"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={sanitizedContent}
        />
      </CardContent>

      <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleUpVote}
            className={cn(
              'flex items-center gap-2 cursor-pointer transition-colors',
              isUpVoted
                ? 'text-green-600'
                : 'text-slate-500 hover:text-green-600',
            )}
          >
            <ThumbsUp className={cn('h-5 w-5', isUpVoted && 'fill-current')} />
            <span className="text-sm font-medium">
              {optimisticVotes.upVotes.length}
            </span>
          </button>
          <button
            type="button"
            onClick={handleDownVote}
            className={cn(
              'flex items-center gap-2 cursor-pointer transition-colors',
              isDownVoted
                ? 'text-red-500'
                : 'text-slate-500 hover:text-red-500',
            )}
          >
            <ThumbsDown
              className={cn('h-5 w-5', isDownVoted && 'fill-current')}
            />
            <span className="text-sm font-medium">
              {optimisticVotes.downVotes.length}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">
            {detailThread.comments.length} Balasan
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
