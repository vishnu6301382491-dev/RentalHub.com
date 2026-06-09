'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Phone, ShieldCheck, Sparkles, Truck, Wrench } from 'lucide-react';
import SceneBackdrop from '@/components/scene-backdrop';
import { useAuth } from '@/lib/auth-context';

interface Rental {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  photos?: string[];
  category: string;
  offerTitle?: string;
  deliveryIncluded?: boolean;
  installationIncluded?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const rentalId = params.id as string;
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const duration = (searchParams.get('duration') as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'daily';
  const days = Number(searchParams.get('days')) || 1;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    instructions: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!rental) {
      return '0.00';
    }

    const multipliers = { daily: 1, weekly: 0.75, monthly: 0.5, yearly: 0.3 };
    const multiplier = multipliers[duration] || 1;

    let periodDays = days;
    if (duration === 'weekly') periodDays = days * 7;
    if (duration === 'monthly') periodDays = days * 30;
    if (duration === 'yearly') periodDays = days * 365;

    return (rental.price * multiplier * periodDays).toFixed(2);
  };

  const startDate = useMemo(() => new Date().toISOString(), []);
  const endDate = useMemo(() => {
    const date = new Date();
    const offset = duration === 'daily' ? days : duration === 'weekly' ? days * 7 : duration === 'monthly' ? days * 30 : days * 365;
    date.setDate(date.getDate() + offset);
    return date.toISOString();
  }, [days, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in before booking a rental.');
      router.push('/signin');
      return;
    }

    if (!rental) {
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: rental._id,
          userId: user._id,
          duration,
          days,
          totalPrice: Number(calculateTotal()),
          startDate,
          endDate,
          deliveryAddress: `${formData.address}, ${formData.city} ${formData.zipCode}`.trim(),
          status: 'active',
          paymentInfo: { status: 'pending' },
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        throw new Error(responseBody?.error || 'Booking failed');
      }

      setBookingComplete(true);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface rounded-[2rem] px-8 py-6 text-slate-900">Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (error && !rental) {
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

  if (!rental) {
    return null;
  }

  if (bookingComplete) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="hero-surface w-full max-w-md rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✓
            </div>
            <h1 className="mt-5 text-3xl font-black text-slate-950">Booking confirmed</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your rental of <strong>{rental.title}</strong> is now connected to your account and profile.
            </p>
            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-left text-white">
              <p className="text-sm text-slate-300">Duration</p>
              <p className="mt-1 font-semibold">
                {days} {duration}(s)
              </p>
              <p className="mt-4 text-sm text-slate-300">Total amount</p>
              <p className="mt-1 text-3xl font-black">${calculateTotal()}</p>
              <p className="mt-4 text-sm text-slate-300">Delivery address</p>
              <p className="mt-1 text-sm leading-6">{`${formData.address}, ${formData.city} ${formData.zipCode}`}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white"
              >
                View my profile
              </Link>
              <Link href="/listings" className="inline-flex justify-center text-sm font-semibold text-blue-700 hover:text-blue-800">
                Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop dense />

      <div className="relative z-10">
        <header className="border-b border-white/20 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/listings" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              ← Continue shopping
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Sparkles className="h-4 w-4 text-blue-700" />
              Secure booking checkout
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 hero-surface rounded-[2rem] p-6 sm:p-8">
            <h1 className="text-4xl font-black text-slate-950">Checkout and confirm your booking</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              We’ve already connected the rental details. Fill in delivery information and confirm the
              handoff so your booking is stored in the database.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-950">Delivery information</h2>
                  <div className="mt-6 grid gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName || user?.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email || user?.email || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone || user?.phone || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <textarea
                        name="address"
                        placeholder="Street Address"
                        value={formData.address || user?.location || ''}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city || user?.location || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                    </div>
                    <textarea
                      name="instructions"
                      placeholder="Delivery instructions or notes"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </div>

                <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-950">Payment and confirmation</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Payment fields are kept simple for now, but the booking itself is stored in MongoDB.
                  </p>
                  <div className="mt-6 grid gap-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={16}
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {bookingLoading ? 'Confirming booking...' : `Complete booking - $${calculateTotal()}`}
                </button>
              </form>
            </div>

            <aside className="space-y-6">
              <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-950">Order summary</h3>

                <div className="mt-4 rounded-[1.75rem] bg-slate-950 p-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/10 text-4xl">
                      {rental.photos?.[0] || rental.image}
                    </div>
                    <div>
                      <p className="font-bold">{rental.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{rental.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-b border-slate-200 pb-5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Rental duration</span>
                    <span className="font-semibold text-slate-900">
                      {days} {duration}(s)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Rate</span>
                    <span className="font-semibold text-slate-900">
                      ${rental.price}/{duration}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-emerald-600">
                      {rental.deliveryIncluded ? 'FREE' : 'Optional'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Installation</span>
                    <span className="font-semibold text-emerald-600">
                      {rental.installationIncluded ? 'FREE' : 'Optional'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex justify-between text-xl font-black text-slate-950">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-blue-50 p-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-700" />
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900">Included in this rental</p>
                      <p>Delivery and installation are already part of the flow.</p>
                      <p>Booking data is saved to your account profile after confirmation.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-[1.5rem] bg-white/70 p-4 text-sm text-slate-600">
                  <Truck className="mt-0.5 h-5 w-5 text-blue-700" />
                  <p>Expected delivery is routed from the address you provide during checkout.</p>
                </div>

                <div className="mt-3 flex items-start gap-3 rounded-[1.5rem] bg-white/70 p-4 text-sm text-slate-600">
                  <Wrench className="mt-0.5 h-5 w-5 text-blue-700" />
                  <p>Installation notes are carried forward for the setup crew.</p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
