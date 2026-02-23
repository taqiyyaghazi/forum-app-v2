import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import type { LeaderboardEntry } from '~/stores/leaderboardsSlice';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  index: number;
}

export function LeaderboardItem({ entry, index }: LeaderboardItemProps) {
  const getRankColor = (rankIndex: number) => {
    switch (rankIndex) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-slate-400';
      case 2:
        return 'text-amber-600';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <span
          className={`text-lg font-bold w-6 text-center ${getRankColor(index)}`}
        >
          {index + 1}
        </span>
        <Avatar className="h-10 w-10 ring-2 ring-transparent">
          <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {entry.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">
            {entry.user.name}
          </span>
          <span className="text-xs text-slate-500">{entry.user.email}</span>
        </div>
      </div>
      <div className="font-bold text-lg text-slate-700">{entry.score}</div>
    </div>
  );
}
