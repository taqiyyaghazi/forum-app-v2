import { Link } from 'react-router';
import { RegisterForm } from '~/components/auth/register-form';
import type { Route } from './+types/register';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daftar' },
    { name: 'description', content: 'Daftar akun baru' },
  ];
}

export default function Register() {
  return (
    <div
      data-testid="register-page"
      className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4"
    >
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="space-y-2 text-center">
          <h1
            data-testid="register-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Buat akun baru
          </h1>
          <p data-testid="register-subtitle" className="text-sm text-gray-500">
            Masukkan detail Anda di bawah ini untuk membuat akun
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            data-testid="login-link"
            className="font-semibold text-primary hover:underline hover:text-primary/80"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
