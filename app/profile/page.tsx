'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SceneBackdrop from '@/components/scene-backdrop';
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  User,
  Wallet,
} from 'lucide-react';

type Booking = {
  _id: string;
  rentalId: {
    _id: string;
    title: string;
    image?: string;
    category?: string;
    location?: string;
  };
  duration: 'daily' | 'weekly' | 'monthly' | 'yearly';
  days: number;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
};

type Rental = {
  _id: string;
  title: string;
  price: number;
  image: string;
  photos?: string[];
  location: string;
  category: string;
  bookings?: string[];
  availability?: string;
};

const emptyOffers = [
  {
    title: 'Delivery included',
    description: 'Shown as a clear benefit on every listing.',
  },
  {
    title: 'Installation support',
    description: 'Add steps and notes so the renter knows what happens next.',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings' | 'favorites'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Rental[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoadingData(true);
        setError(null);

        const [bookingResponse, listingsResponse] = await Promise.all([
          fetch(`/api/bookings?userId=${user._id}`),
          fetch(`/api/rentals?ownerId=${user._id}`),
        ]);

        if (bookingResponse.ok) {
          setBookings(await bookingResponse.json());
        }

        if (listingsResponse.ok) {
          setListings(await listingsResponse.json());
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load profile data');
      } finally {
        setLoadingData(false);
      }
    };

    loadProfileData();
  }, [user]);

  const favorites = useMemo(() => user?.favoriteCategories ?? [], [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || loadingData) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface rounded-[2rem] px-8 py-6 text-slate-900">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface w-full max-w-md rounded-[2rem] p-8 text-center">
            <User className="mx-auto h-10 w-10 text-blue-700" />
            <h1 className="mt-4 text-3xl font-bold text-slate-950">Sign in to see your profile</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your bookings, listings, favorites, and offers are all tied to your account.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalEarnings = listings.reduce((sum, listing) => sum + listing.price * (listing.bookings?.length || 0), 0);
  const activeBookings = bookings.filter((booking) => booking.status === 'active').length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop dense />

      <div className="relative z-10">
        <header className="border-b border-white/20 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">
              RentalHub
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/upload" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Upload item
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-4xl font-black text-white shadow-xl shadow-blue-500/20">
                    {user.avatarUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <span className="rental-chip">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      Member since {new Date(user.joinDate).getFullYear()}
                    </span>
                    <h1 className="mt-3 text-4xl font-black text-slate-950">{user.name}</h1>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Rating</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-black">{user.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Bookings', value: bookings.length, icon: Package },
                  { label: 'Listings', value: listings.length, icon: Upload },
                  { label: 'Active', value: activeBookings, icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel rounded-3xl p-5">
                    <stat.icon className="h-5 w-5 text-blue-700" />
                    <p className="mt-4 text-3xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white/70 p-5">
                  <p className="text-sm font-semibold text-slate-500">Contact</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-700" />
                      {user.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-700" />
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/70 p-5">
                  <p className="text-sm font-semibold text-slate-500">Live location</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      {typeof user.latitude === 'number' && typeof user.longitude === 'number'
                        ? `${user.latitude.toFixed(3)}, ${user.longitude.toFixed(3)}`
                        : 'No live coordinates saved yet'}
                    </p>
                    <p>{user.bio || 'Add a short bio so people know what you rent or love.'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/70 p-5">
                <p className="text-sm font-semibold text-slate-500">Favorite categories</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(favorites.length > 0 ? favorites : ['tools', 'furniture']).map((favorite) => (
                    <span key={favorite} className="rental-chip">
                      {favorite}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="hero-surface rounded-[1.75rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Total earnings</p>
                  <div className="mt-3 flex items-end gap-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    <p className="text-4xl font-black text-slate-950">${totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
                <div className="hero-surface rounded-[1.75rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Support</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Booking support, delivery details, and installation notes are all shown in the profile.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-[2rem]">
                <div className="flex border-b border-white/30">
                  {[
                    { id: 'bookings', label: 'My bookings' },
                    { id: 'listings', label: 'My listings' },
                    { id: 'favorites', label: 'Offers' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 px-4 py-4 text-sm font-semibold transition ${
                        activeTab === tab.id ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  {activeTab === 'bookings' && (
                    <div className="space-y-4">
                      {bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <div
                            key={booking._id}
                            className="rounded-3xl border border-white/40 bg-white/70 p-4 transition hover:bg-white"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white">
                                  {booking.rentalId?.image || '📦'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-950">{booking.rentalId?.title || 'Rental item'}</p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {booking.startDate.slice(0, 10)} to {booking.endDate.slice(0, 10)}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {booking.duration} plan • {booking.days} day(s)
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-slate-950">${booking.totalPrice.toFixed(2)}</p>
                                <p className="text-sm text-slate-500">{booking.status}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl bg-white/70 p-8 text-center text-slate-600">
                          No bookings yet. Your first rental will appear here.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'listings' && (
                    <div className="space-y-4">
                      {listings.length > 0 ? (
                        listings.map((listing) => (
                          <div key={listing._id} className="rounded-3xl border border-white/40 bg-white/70 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white">
                                  {listing.photos?.[0] || listing.image || '📦'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-950">{listing.title}</p>
                                  <p className="mt-1 text-sm text-slate-600">{listing.location}</p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {listing.category} • {listing.availability || 'available'}
                                  </p>
                                </div>
                              </div>
                              <p className="text-lg font-black text-slate-950">${listing.price}/day</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl bg-white/70 p-8 text-center text-slate-600">
                          You have not published any listings yet.
                        </div>
                      )}
                      <Link
                        href="/upload"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        <Upload className="h-4 w-4" />
                        Add a new item
                      </Link>
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div className="space-y-4">
                      {emptyOffers.map((offer) => (
                        <div key={offer.title} className="rounded-3xl bg-white/70 p-5">
                          <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-rose-600" />
                            <p className="font-bold text-slate-950">{offer.title}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{offer.description}</p>
                        </div>
                      ))}
                      <Link href="/listings" className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
                        Browse rentals to save favorites
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
