import { startTransition, useOptimistic } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { optimisticVoteReducer } from '~/lib/optimisticVote';
import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import {
  downVoteThread,
  neutralVoteThread,
  upVoteThread,
} from '~/stores/threadsSlice';
import type { Thread } from '~/stores/threadsSlice';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [optimisticVotes, addOptimisticVote] = useOptimistic(
    {
      upVotes: thread.upVotesBy,
      downVotes: thread.downVotesBy,
    },
    optimisticVoteReducer,
  );

  const isUpVoted = user ? optimisticVotes.upVotes.includes(user.id) : false;
  const isDownVoted = user
    ? optimisticVotes.downVotes.includes(user.id)
    : false;

  const handleUpVote = (e: React.MouseEvent) => {
    e.preventDefault();
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
          await dispatch(neutralVoteThread(thread.id)).unwrap();
        } else {
          await dispatch(upVoteThread(thread.id)).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  const handleDownVote = (e: React.MouseEvent) => {
    e.preventDefault();
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
          await dispatch(neutralVoteThread(thread.id)).unwrap();
        } else {
          await dispatch(downVoteThread(thread.id)).unwrap();
        }
      } catch {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  const sanitizedContent = { __html: DOMPurify.sanitize(thread.body) };

  return (
    <Card className="hover:bg-slate-50 transition-colors cursor-pointer group">
      <Link to={`/threads/${thread.id}`} className="block space-y-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="mb-2">
              #{thread.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(thread.createdAt), {
                addSuffix: true,
                locale: id,
              })}
            </span>
          </div>
          <CardTitle className="text-xl leading-tight group-hover:underline group-hover:text-primary transition-colors">
            {thread.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="line-clamp-3 text-sm text-slate-600 border-l-2 border-primary/20 pl-3"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={sanitizedContent}
          />
        </CardContent>
        <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={handleUpVote}
            className={cn(
              'flex items-center gap-1 transition-colors relative z-10',
              isUpVoted ? 'text-green-600' : 'hover:text-green-600',
            )}
          >
            <ThumbsUp className={cn('h-4 w-4', isUpVoted && 'fill-current')} />
            <span>{optimisticVotes.upVotes.length}</span>
          </button>
          <button
            type="button"
            onClick={handleDownVote}
            className={cn(
              'flex items-center gap-1 transition-colors relative z-10',
              isDownVoted ? 'text-red-500' : 'hover:text-red-500',
            )}
          >
            <ThumbsDown
              className={cn('h-4 w-4', isDownVoted && 'fill-current')}
            />
            <span>{optimisticVotes.downVotes.length}</span>
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.totalComments} balasan</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
