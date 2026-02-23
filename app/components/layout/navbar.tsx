import { MessageSquare, LogOut, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { logout } from '~/stores/authSlice';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';

export function Navbar() {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="h-6 w-6" />
          <span>ForumApp</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/leaderboards"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-yellow-600 sm:mr-4"
          >
            <Trophy className="h-5 w-5" />
            <span className="hidden sm:inline-block">Leaderboard</span>
          </Link>
          {!token && (
            <Button asChild variant="default" className="rounded-full px-6">
              <Link to="/login">Masuk</Link>
            </Button>
          )}

          {token && !user && (
            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
          )}

          {token && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground w-[200px] truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
