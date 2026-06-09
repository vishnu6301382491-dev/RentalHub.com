'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SceneBackdrop from '@/components/scene-backdrop';
import {
  Camera,
  Eye,
  EyeOff,
  FileText,
  Globe,
  MapPin,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';

const categoryOptions = ['cars', 'tools', 'furniture', 'electronics'];

const onboardingCards = [
  'Store your profile in MongoDB from the first signup.',
  'Grant live location once and we will save the coordinates for faster booking.',
  'Use the same account to book, upload listings, and track offers.',
];

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [favoriteCategory, setFavoriteCategory] = useState('tools');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    bio: '',
    avatarUrl: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Live location is not supported here.');
      return;
    }

    setLocationLoading(true);
    setLocationStatus('Requesting permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          location: prev.location || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        }));
        setLocationStatus(`Live location saved: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setLocationLoading(false);
      },
      () => {
        setLocationStatus('Location permission was denied. You can type a city instead.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedFavorites = useMemo(() => [favoriteCategory], [favoriteCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        favoriteCategories: selectedFavorites,
      });
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop dense />

      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8 text-slate-950">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">RENTALHUB</p>
                <p className="text-lg font-bold">Create your account</p>
              </div>
            </Link>

            <div className="space-y-5">
              <span className="rental-chip">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Live location and profile ready
              </span>
              <h1 className="max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">
                Sign up once and get a full rental profile from day one.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Add your contact details, a short bio, and live coordinates so rentals, offers,
                and delivery can be connected to your account in MongoDB.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Profile data', icon: User },
                { label: 'Live location', icon: Globe },
                { label: 'Offer details', icon: FileText },
              ].map((item) => (
                <div key={item.label} className="hero-surface rounded-3xl p-5">
                  <item.icon className="h-5 w-5 text-blue-700" />
                  <p className="mt-4 text-sm font-semibold text-slate-800">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Why this matters</p>
              <div className="mt-4 space-y-3">
                {onboardingCards.map((note) => (
                  <div key={note} className="flex items-start gap-3 rounded-2xl bg-white/60 p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Sign up</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Build your profile</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Fill in the essentials and add a live location if you want quicker delivery setup.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </label>

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
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Phone number</span>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Primary rental interest</span>
                  <select
                    value={favoriteCategory}
                    onChange={(e) => setFavoriteCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Your city or live location</span>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Bangalore, India or current coordinates"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-40 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={handleLiveLocation}
                      disabled={locationLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {locationLoading ? 'Locating...' : 'Use live location'}
                    </button>
                  </div>
                  {locationStatus ? <p className="mt-2 text-xs text-slate-500">{locationStatus}</p> : null}
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Short bio</span>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell people what you rent, what you love, or how you like to deliver."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Avatar URL</span>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      placeholder="Optional profile image or avatar link"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-4 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/signin" className="font-semibold text-blue-700 hover:text-blue-800">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
