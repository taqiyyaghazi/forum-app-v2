import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

import { CreateThreadForm } from '~/components/thread/create-thread-form';
import { Button } from '~/components/ui/button';
import { useAppSelector } from '~/stores/hooks';
import type { Route } from './+types/new-thread';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Buat Diskusi Baru' },
    { name: 'description', content: 'Mulai diskusi baru dengan komunitas' },
  ];
}

export default function NewThread() {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div
      data-testid="new-thread-page"
      className="flex min-h-screen flex-col items-center bg-slate-50/50 p-4 sm:p-8"
    >
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            data-testid="back-button"
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full"
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1
              data-testid="new-thread-title"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              Buat Diskusi Baru
            </h1>
            <p
              data-testid="new-thread-subtitle"
              className="text-sm text-slate-500"
            >
              Masukkan detail topik yang ingin dibahas.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CreateThreadForm />
        </div>
      </div>
    </div>
  );
}
