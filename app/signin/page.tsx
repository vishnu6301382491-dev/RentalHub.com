'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SceneBackdrop from '@/components/scene-backdrop';
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';

const signInNotes = [
  'Pick up where you left off with saved bookings and listings.',
  'Your account is linked to MongoDB, so the session feels persistent.',
  'Check booking status, photos, and upload history after sign-in.',
];

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop />

      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8 text-slate-950">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">RENTALHUB</p>
                <p className="text-lg font-bold">Welcome back</p>
              </div>
            </Link>

            <div className="space-y-5">
              <span className="rental-chip">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Secure account access
              </span>
              <h1 className="max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">
                Sign in and continue your rentals without losing momentum.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Your session is tied to the database, so profile details, bookings, and uploaded
                listings can stay in sync across the app.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Fast login', icon: KeyRound },
                { label: 'Saved bookings', icon: Lock },
                { label: 'Live account data', icon: ShieldCheck },
              ].map((item) => (
                <div key={item.label} className="hero-surface rounded-3xl p-5">
                  <item.icon className="h-5 w-5 text-blue-700" />
                  <p className="mt-4 text-sm font-semibold text-slate-800">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What you get</p>
              <div className="mt-4 space-y-3">
                {signInNotes.map((note) => (
                  <div key={note} className="flex items-start gap-3 rounded-2xl bg-white/60 p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Sign in</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Good to see you again</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your email and password to open your account dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign in to your account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Need an account?{' '}
                <Link href="/signup" className="font-semibold text-blue-700 hover:text-blue-800">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
