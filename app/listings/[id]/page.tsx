'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Home,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
} from 'lucide-react';
import SceneBackdrop from '@/components/scene-backdrop';

interface Rental {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  photos?: string[];
  category: string;
  availability?: string;
  offerTitle?: string;
  offerDetails?: string;
  features?: string[];
  installationSteps?: string[];
  accessories?: string[];
  deliveryIncluded?: boolean;
  installationIncluded?: boolean;
}

const periods = ['daily', 'weekly', 'monthly', 'yearly'] as const;

export default function ListingDetailPage() {
  const params = useParams();
  const rentalId = params.id as string;
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentalDuration, setRentalDuration] = useState<(typeof periods)[number]>('daily');
  const [rentalDays, setRentalDays] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rentals/${rentalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rental');
        }
        setRental(await response.json());
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'An error occurred');
        console.error('Error fetching rental:', fetchError);
      } finally {
        setLoading(false);
      }
    };

    if (rentalId) {
      fetchRental();
    }
  }, [rentalId]);

  const gallery = useMemo(() => {
    if (!rental) {
      return [];
    }

    return rental.photos && rental.photos.length > 0 ? rental.photos : [rental.image];
  }, [rental]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface rounded-[2rem] px-8 py-6 text-slate-900">Loading listing...</div>
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface max-w-md rounded-[2rem] p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Rental not found</h1>
            <p className="mt-2 text-slate-600">{error}</p>
            <Link href="/listings" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getPriceMultiplier = () => {
    const multipliers = {
      daily: 1,
      weekly: 0.75,
      monthly: 0.5,
      yearly: 0.3,
    };
    return multipliers[rentalDuration];
  };

  const calculateTotal = () => {
    const multiplier = getPriceMultiplier();
    let days = rentalDays;

    if (rentalDuration === 'weekly') days = rentalDays * 7;
    if (rentalDuration === 'monthly') days = rentalDays * 30;
    if (rentalDuration === 'yearly') days = rentalDays * 365;

    return (rental.price * multiplier * days).toFixed(2);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop dense />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/20 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/listings" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              ← Back to listings
            </Link>
            <Link href="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              My profile
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <div className="hero-surface overflow-hidden rounded-[2rem]">
                <div className="grid gap-4 p-4 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="overflow-hidden rounded-[1.75rem] bg-slate-950">
                    {gallery[activePhoto] ? (
                      <div className="relative h-[28rem] w-full">
                        <Image
                          src={gallery[activePhoto]}
                          alt={rental.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 65vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-[28rem] items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-7xl text-white">
                        {rental.image}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {gallery.slice(0, 4).map((photo, index) => (
                      <button
                        key={`${photo}-${index}`}
                        onClick={() => setActivePhoto(index)}
                        className={`overflow-hidden rounded-[1.5rem] border transition ${
                          activePhoto === index ? 'border-slate-900 ring-4 ring-slate-900/10' : 'border-white/40'
                        }`}
                      >
                        <div className="relative h-32 w-full">
                          <Image
                            src={photo}
                            alt={`${rental.title} preview ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Offer details</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">{rental.offerTitle || 'Premium delivery and installation'}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {rental.offerDetails ||
                      'Every rental includes clear setup notes, useful accessories, and a smooth handoff so the item feels ready on arrival.'}
                  </p>
                </div>

                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Availability</p>
                  <div className="mt-3 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <p className="text-lg font-bold text-slate-950">
                      {rental.availability?.charAt(0).toUpperCase() + (rental.availability?.slice(1) || 'available')}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {rental.deliveryIncluded ? 'Delivery is included.' : 'Delivery can be arranged separately.'}{' '}
                    {rental.installationIncluded ? 'Installation is included.' : 'Installation is optional.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <Wrench className="h-4 w-4 text-blue-700" />
                    Installation steps
                  </p>
                  <div className="mt-4 space-y-3">
                    {(rental.installationSteps && rental.installationSteps.length > 0
                      ? rental.installationSteps
                      : ['Confirm booking', 'Route delivery', 'Install and test']).map((step, index) => (
                      <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel rounded-[2rem] p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Accessories and features
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(rental.accessories && rental.accessories.length > 0
                      ? rental.accessories
                      : rental.features || ['Delivery', 'Installation', 'Support']).map((item) => (
                      <span key={item} className="rental-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    The listing page can now carry accessory details, service notes, and the full booking story in one place.
                  </p>
                </div>
              </div>
            </section>

            <aside>
              <div className="hero-surface sticky top-24 rounded-[2rem] p-6 sm:p-8">
                <h1 className="text-3xl font-black text-slate-950">{rental.title}</h1>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rental.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {rental.rating.toFixed(1)} rating • {rental.reviews} reviews
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2 text-slate-600">
                  <MapPin className="h-5 w-5" />
                  <span>{rental.location}</span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">{rental.description}</p>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Delivery</p>
                    <div className="mt-2 flex items-center gap-2 text-slate-900">
                      <Truck className="h-4 w-4 text-blue-700" />
                      <span className="font-semibold">{rental.deliveryIncluded ? 'Included' : 'Optional'}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Install</p>
                    <div className="mt-2 flex items-center gap-2 text-slate-900">
                      <Home className="h-4 w-4 text-blue-700" />
                      <span className="font-semibold">{rental.installationIncluded ? 'Included' : 'Optional'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Rental period</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => setRentalDuration(period)}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          rentalDuration === period
                            ? 'bg-slate-900 text-white'
                            : 'bg-white/70 text-slate-700 hover:bg-white'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Number of {rentalDuration}s
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>

                <div className="mt-6 rounded-[1.75rem] bg-slate-950 p-5 text-white">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Base rate</span>
                    <span>
                      ${rental.price}
                      /{rentalDuration}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-slate-300">
                    <span>Delivery</span>
                    <span>{rental.deliveryIncluded ? 'Free' : 'Optional'}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-slate-300">
                    <span>Installation</span>
                    <span>{rental.installationIncluded ? 'Free' : 'Optional'}</span>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">Estimated total</span>
                      <span className="text-3xl font-black text-white">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/checkout/${rental._id}?duration=${rentalDuration}&days=${rentalDays}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                >
                  Continue to booking
                </Link>

                <button className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-white">
                  Save to favorites
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
