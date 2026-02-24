import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { ThreadCard } from '~/components/thread/thread-card';
import { ThreadCardSkeleton } from '~/components/thread/thread-card-skeleton';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { fetchThreads, selectFilteredThreads } from '~/stores/threadsSlice';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Forum App' },
    { name: 'description', content: 'Diskusikan apa saja di sini!' },
  ];
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { threads, isLoading, error } = useAppSelector(
    (state) => state.threads,
  );
  const { token } = useAppSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const filteredThreads = useAppSelector((state) =>
    selectFilteredThreads(state, searchQuery),
  );

  const categories = Array.from(
    new Set(threads.map((thread) => thread.category)),
  ).filter(Boolean);

  const handleCategoryClick = (category: string) => {
    setSearchParams(
      (prev) => {
        if (searchQuery === category) {
          prev.delete('q');
        } else {
          prev.set('q', category);
        }
        return prev;
      },
      { replace: true },
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchParams(
      (prev) => {
        if (query) {
          prev.set('q', query);
        } else {
          prev.delete('q');
        }
        return prev;
      },
      { replace: true },
    );
  };

  return (
    <div
      data-testid="home-page"
      className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center flex flex-col items-center">
          <h1
            data-testid="home-title"
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            Tanya <span className="text-primary">Jawab</span>
          </h1>
          <p className="mt-4 mb-6 text-lg text-slate-600">
            Temukan jawaban atau bagikan pengetahuanmu bersama komunitas.
          </p>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              data-testid="search-input"
              type="search"
              placeholder="Cari kategori diskusi..."
              className="pl-12 h-12 w-full rounded-full border-slate-200 shadow-sm focus-visible:ring-primary/20 text-base"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {categories.length > 0 && (
            <div
              data-testid="category-list"
              className="flex flex-wrap items-center justify-center gap-2 mt-6"
            >
              {categories.map((category) => (
                <Badge
                  key={category}
                  data-testid={`category-${category}`}
                  variant={searchQuery === category ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-3 py-1 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => handleCategoryClick(category)}
                >
                  #{category}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <section>
          {isLoading && <ThreadCardSkeleton />}

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-600 border border-red-200">
              <p className="font-medium text-center">{error}</p>
            </div>
          )}

          {!isLoading && !error && threads.length === 0 && (
            <div
              data-testid="empty-state"
              className="text-center py-20 text-slate-500"
            >
              <p>Belum ada diskusi saat ini. Jadilah yang pertama!</p>
            </div>
          )}

          {!isLoading &&
            !error &&
            threads.length > 0 &&
            filteredThreads.length === 0 && (
              <div
                data-testid="no-results"
                className="text-center py-20 text-slate-500"
              >
                <p>Diskusi yang Anda cari tidak ditemukan.</p>
              </div>
            )}

          <div data-testid="thread-list" className="space-y-6">
            {!isLoading &&
              !error &&
              filteredThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
          </div>
        </section>
      </div>

      {token && (
        <Button
          asChild
          size="lg"
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 rounded-full shadow-lg shadow-primary/30 h-14 px-6 text-base z-50 hover:-translate-y-1 transition-all"
        >
          <Link to="/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Buat Diskusi
          </Link>
        </Button>
      )}
    </div>
  );
}
