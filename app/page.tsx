'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BadgePercent,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import SceneBackdrop from '@/components/scene-backdrop';

const featuredCategories = [
  { title: 'Cars', icon: '🚗', count: '2,453', hint: 'Weekend drives and luxury rides' },
  { title: 'Tools', icon: '🛠️', count: '1,892', hint: 'Project-ready tools and kits' },
  { title: 'Furniture', icon: '🛋️', count: '3,124', hint: 'Move-in ready rooms and setups' },
  { title: 'Electronics', icon: '💻', count: '1,054', hint: 'Laptops, displays, and gear' },
];

const offerCards = [
  {
    title: 'Daily and longer plans',
    description: 'Flexible pricing for one day, one week, or a full month without the clutter.',
    icon: BadgePercent,
  },
  {
    title: 'Delivery plus installation',
    description: 'We bring it over, install it, and leave the space ready to use.',
    icon: Truck,
  },
  {
    title: 'Verified items and photos',
    description: 'Listings can include multiple photos, accessories, and service notes.',
    icon: Camera,
  },
];

const installationSteps = [
  'Confirm the item and date in one tap.',
  'Share your location so the crew can route fast.',
  'Track delivery, installation, and setup progress.',
  'Enjoy the rental with support already included.',
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    window.location.href = `/listings?${params.toString()}`;
  };

  const useLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Live location is not supported in this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationStatus('Requesting location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setLocationStatus('Location permission approved.');
        setLocationLoading(false);
      },
      () => {
        setLocationStatus('Location permission was blocked or denied.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop dense />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/20 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">RENTALHUB</p>
                <p className="text-lg font-bold text-slate-900">Rent smart. Live lighter.</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/listings" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Browse
              </Link>
              <Link href="/upload" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                List an item
              </Link>
              <Link href="/profile" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create account
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <div className="flex flex-wrap gap-3">
                <span className="rental-chip">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Verified owners and clear pricing
                </span>
                <span className="rental-chip">
                  <Clock3 className="h-4 w-4 text-violet-600" />
                  Fast delivery and installation
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  A rental marketplace that feels alive, local, and ready to move.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Search by item, location, or offer. Add live location, upload multiple photos, and
                  connect your account to bookings, profiles, and real database-backed listings.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Browse rentals
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  List your item
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: '12k+', label: 'items listed', icon: Camera },
                  { value: '4.8/5', label: 'average rating', icon: ShieldCheck },
                  { value: '24h', label: 'delivery window', icon: Truck },
                ].map((stat) => (
                  <div key={stat.label} className="hero-surface rounded-3xl p-5">
                    <stat.icon className="mb-3 h-5 w-5 text-blue-600" />
                    <p className="text-3xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl float-slow" />
              <div className="absolute -right-6 bottom-12 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl float-fast" />

              <div className="hero-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Search live now
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Find the right rental in seconds</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Live
                  </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">What do you need?</span>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cars, tools, furniture, electronics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Your location</span>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Add city or coordinates"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-32 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                      <button
                        type="button"
                        onClick={useLiveLocation}
                        disabled={locationLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {locationLoading ? 'Locating...' : 'Use live'}
                      </button>
                    </div>
                    {locationStatus ? <p className="mt-2 text-xs text-slate-500">{locationStatus}</p> : null}
                  </label>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                  >
                    Search rentals
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-slate-900">Offer details</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Add discounts, accessories, and service notes when you list an item.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-slate-900">Installation flow</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Delivery, installation, and setup are shown before checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.title}
                href={`/listings?category=${category.title.toLowerCase()}`}
                className="group hero-surface rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-4xl">{category.icon}</div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{category.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{category.hint}</p>
                <p className="mt-4 text-sm font-semibold text-blue-700">{category.count} listings</p>
              </Link>
            ))}
          </section>

          <section className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Why it feels different
                  </p>
                  <h2 className="text-2xl font-bold text-slate-950">Built for a premium rental journey</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {offerCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/40 bg-white/70 p-5">
                    <card.icon className="h-5 w-5 text-blue-700" />
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-violet-600/10 p-3 text-violet-700">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Installation process
                  </p>
                  <h2 className="text-2xl font-bold text-slate-950">Clear steps before the rental starts</h2>
                </div>
              </div>

              <div className="space-y-4">
                {installationSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl bg-white/70 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Create your account
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Sign up, share your live location, and start listing.</h2>
              <p className="mt-3 text-slate-600">
                Profiles store your contact details, live coordinates, rental preferences, and offer highlights so your account feels real from day one.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Profile creation with real MongoDB-backed user data',
                'Multi-photo item uploads with delivery and install options',
                'Booking history linked directly to your account',
                'Favorites, offers, and listing analytics in one place',
              ].map((item) => (
                <div key={item} className="glass-panel flex items-start gap-3 rounded-[1.5rem] p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
