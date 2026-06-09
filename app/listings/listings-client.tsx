'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from 'lucide-react';
import SceneBackdrop from '@/components/scene-backdrop';

interface Rental {
  _id: string;
  title: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  photos?: string[];
  category: string;
  description?: string;
  offerTitle?: string;
  installationIncluded?: boolean;
  deliveryIncluded?: boolean;
}

const categories = ['all', 'cars', 'tools', 'furniture', 'electronics'];

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category')?.toLowerCase() || 'all'
  );
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const locationTerm = searchParams.get('location')?.toLowerCase() || '';
  const queryCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const activeCategory = selectedCategory || queryCategory;

  const filteredRentals = useMemo(
    () =>
      rentals.filter((rental) => {
        const matchesSearch = !searchTerm || rental.title.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationTerm || rental.location.toLowerCase().includes(locationTerm);
        const matchesCategory =
          !activeCategory || activeCategory === 'all' || rental.category.toLowerCase() === activeCategory;
        const matchesPrice = rental.price >= priceRange[0] && rental.price <= priceRange[1];
        return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
      }),
    [rentals, searchTerm, locationTerm, activeCategory, priceRange]
  );

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rentals');
        if (!response.ok) {
          throw new Error('Failed to fetch rentals');
        }
        const data = await response.json();
        setRentals(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'An error occurred');
        console.error('Error fetching rentals:', fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handlePriceChange = (max: number) => {
    setPriceRange([0, max]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneBackdrop />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/20 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-950">RentalHub</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/upload" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Upload item
              </Link>
              <Link href="/profile" className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
                My profile
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="hero-surface rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="rental-chip">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified listings with delivery and installation
                </span>
                <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Browse rental options that already show the details renters care about.
                </h1>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                  Search by category, price, and location. Open a listing to see photos, installation
                  steps, and offer notes before you book.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: 'Delivery', icon: Truck },
                  { label: 'Installation', icon: Wrench },
                  { label: 'Support', icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/40 bg-white/70 p-4">
                    <item.icon className="h-5 w-5 text-blue-700" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
            <aside className="space-y-6">
              <div className="glass-panel rounded-[2rem] p-6">
                <h3 className="text-lg font-bold text-slate-950">Filters</h3>

                <div className="mt-6 space-y-3">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Search context</label>
                    <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        readOnly
                        value={searchParams.get('search') || 'No keyword search applied'}
                        className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                            selectedCategory === category
                              ? 'bg-slate-900 text-white'
                              : 'bg-white/70 text-slate-700 hover:bg-white'
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">Price range</h4>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                      <span>${priceRange[0]}/day</span>
                      <span>${priceRange[1]}/day</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quick view</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>{filteredRentals.length} items currently match your filters.</p>
                  <p>Open any card to see photos, offer details, and checkout options.</p>
                </div>
              </div>
            </aside>

            <main>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-950">
                  {loading ? 'Loading...' : `${filteredRentals.length} rentals available`}
                </h2>
              </div>

              {error && (
                <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                  <p>Error loading rentals: {error}</p>
                </div>
              )}

              {loading ? (
                <div className="hero-surface rounded-[2rem] p-12 text-center text-slate-600">
                  Loading rentals...
                </div>
              ) : filteredRentals.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRentals.map((rental) => (
                    <Link key={rental._id} href={`/listings/${rental._id}`} className="group block">
                      <article className="hero-surface h-full overflow-hidden rounded-[2rem] transition hover:-translate-y-1 hover:shadow-2xl">
                        <div className="relative h-56 overflow-hidden bg-slate-950">
                          {rental.photos?.[0] ? (
                            <div className="relative h-full w-full">
                              <Image
                                src={rental.photos[0]}
                                alt={rental.title}
                                fill
                                sizes="(max-width: 1280px) 100vw, 33vw"
                                className="object-cover transition duration-500 group-hover:scale-105"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-5xl text-white transition duration-500 group-hover:scale-105">
                              {rental.image}
                            </div>
                          )}
                          <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 shadow-lg">
                            <Heart className="h-4 w-4" />
                          </button>
                          <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">
                            {rental.category}
                          </div>
                        </div>

                        <div className="space-y-4 p-5">
                          <div>
                            <h3 className="line-clamp-2 text-lg font-bold text-slate-950">{rental.title}</h3>
                            {rental.offerTitle ? (
                              <p className="mt-2 text-sm font-semibold text-blue-700">{rental.offerTitle}</p>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4" />
                            <span>{rental.location}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-slate-700">{rental.rating.toFixed(1)}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {rental.deliveryIncluded ? (
                              <span className="rental-chip">Delivery</span>
                            ) : null}
                            {rental.installationIncluded ? (
                              <span className="rental-chip">Installation</span>
                            ) : null}
                          </div>

                          <div className="border-t border-white/60 pt-4">
                            <p className="text-2xl font-black text-slate-950">
                              ${rental.price}
                              <span className="ml-1 text-sm font-medium text-slate-500">/day</span>
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="hero-surface rounded-[2rem] p-12 text-center">
                  <p className="text-lg text-slate-600">No rentals found. Try adjusting the filters.</p>
                </div>
              )}
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
