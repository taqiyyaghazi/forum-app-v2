import { startTransition, useOptimistic } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import { CreateCommentForm } from '~/components/comment/create-comment-form';
import { optimisticVoteReducer } from '~/lib/optimisticVote';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import {
  downVoteComment,
  neutralVoteComment,
  upVoteComment,
} from '~/stores/threadDetailSlice';
import type { ThreadComment } from '~/stores/threadDetailSlice';
import { toast } from 'sonner';
import { cn } from '~/lib/utils';

interface ThreadCommentsProps {
  threadId: string;
  comments: ThreadComment[];
}

function CommentItem({
  comment,
  threadId,
}: {
  comment: ThreadComment;
  threadId: string;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [optimisticVotes, addOptimisticVote] = useOptimistic(
    {
      upVotes: comment.upVotesBy,
      downVotes: comment.downVotesBy,
    },
    optimisticVoteReducer,
  );

  const isUpVoted = user ? optimisticVotes.upVotes.includes(user.id) : false;
  const isDownVoted = user
    ? optimisticVotes.downVotes.includes(user.id)
    : false;

  const handleUpVote = () => {
    if (!user) {
      toast.error('Gagal menyukai komentar');
      return;
    }

    startTransition(async () => {
      addOptimisticVote({
        type: isUpVoted ? 'NEUTRAL_VOTE' : 'UP_VOTE',
        userId: user.id,
      });

      try {
        if (isUpVoted) {
          await dispatch(
            neutralVoteComment({ threadId, commentId: comment.id }),
          ).unwrap();
        } else {
          await dispatch(
            upVoteComment({ threadId, commentId: comment.id }),
          ).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  const handleDownVote = () => {
    if (!user) {
      toast.error('Gagal tidak menyukai komentar');
      return;
    }

    startTransition(async () => {
      addOptimisticVote({
        type: isDownVoted ? 'NEUTRAL_VOTE' : 'DOWN_VOTE',
        userId: user.id,
      });

      try {
        if (isDownVoted) {
          await dispatch(
            neutralVoteComment({ threadId, commentId: comment.id }),
          ).unwrap();
        } else {
          await dispatch(
            downVoteComment({ threadId, commentId: comment.id }),
          ).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.owner.avatar} alt={comment.owner.name} />
            <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
              {comment.owner.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {comment.owner.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: localeId,
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-slate-700 pb-3">
        <div
          className="prose prose-sm max-w-none [word-break:break-word]"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(comment.content),
          }}
        />
      </CardContent>
      <CardFooter className="pt-0 flex gap-4 text-slate-400">
        <button
          type="button"
          onClick={handleUpVote}
          className={cn(
            'flex items-center gap-1.5 text-xs cursor-pointer transition-colors',
            isUpVoted ? 'text-green-600' : 'hover:text-green-600',
          )}
        >
          <ThumbsUp
            className={cn('h-3.5 w-3.5', isUpVoted && 'fill-current')}
          />
          <span>{optimisticVotes.upVotes.length}</span>
        </button>
        <button
          type="button"
          onClick={handleDownVote}
          className={cn(
            'flex items-center gap-1.5 text-xs cursor-pointer transition-colors',
            isDownVoted ? 'text-red-500' : 'hover:text-red-500',
          )}
        >
          <ThumbsDown
            className={cn('h-3.5 w-3.5', isDownVoted && 'fill-current')}
          />
          <span>{optimisticVotes.downVotes.length}</span>
        </button>
      </CardFooter>
    </Card>
  );
}

export function ThreadComments({ threadId, comments }: ThreadCommentsProps) {
  return (
    <div data-testid="comments-section" className="space-y-4 pt-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        Komentar{' '}
        <Badge variant="secondary" className="rounded-full px-2">
          {comments.length}
        </Badge>
      </h3>

      <CreateCommentForm threadId={threadId} />

      {comments.length === 0 ? (
        <div
          data-testid="empty-comments"
          className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300"
        >
          <p className="text-slate-500 text-sm">
            Belum ada komentar. Jadilah yang pertama membalas!
          </p>
        </div>
      ) : (
        <div data-testid="comments-list" className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              threadId={threadId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
