import { Link } from 'react-router';
import { LoginForm } from '~/components/auth/login-form';
import type { Route } from './+types/login';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Masuk' },
    { name: 'description', content: 'Masuk ke akun Anda' },
  ];
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-gray-500">
            Masukkan kredensial Anda untuk mengakses akun
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline hover:text-primary/80"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
