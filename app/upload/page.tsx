'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SceneBackdrop from '@/components/scene-backdrop';
import {
  AlertCircle,
  Camera,
  FileText,
  ImagePlus,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Wrench,
} from 'lucide-react';

const categoryEmojis: Record<string, string> = {
  cars: '🚗',
  tools: '🛠️',
  furniture: '🛋️',
  electronics: '💻',
  other: '📦',
};

const accessoryOptions = ['Free delivery', 'Installation included', 'Care kit', 'Spare accessories', 'Warranty support'];

const uploadTips = [
  'Add at least 3 photos so renters can judge quality quickly.',
  'Include installation notes or accessory details for a smoother handoff.',
  'The first uploaded image becomes the cover image on listings.',
];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    itemTitle: '',
    category: 'tools',
    description: '',
    dailyPrice: '',
    location: '',
    phone: '',
    availability: 'available',
    offerTitle: '',
    offerDetails: '',
    installationSteps: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['Free delivery', 'Installation included']);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const coverImage = useMemo(() => photos[0] || categoryEmojis[formData.category] || '📦', [photos, formData.category]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    try {
      const uploads = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setPhotos((prev) => [...prev, ...uploads].slice(0, 8));
    } finally {
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, photoIndex) => photoIndex !== index));
  };

  const toggleAccessory = (accessory: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accessory) ? prev.filter((item) => item !== accessory) : [...prev, accessory]
    );
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
        setFormData((prev) => ({ ...prev, location: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}` }));
        setLocationStatus('Location captured for your item.');
        setLocationLoading(false);
      },
      () => {
        setLocationStatus('Location permission was denied. You can type the city manually.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in before uploading a rental item.');
      router.push('/signin');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.itemTitle,
          description: formData.description,
          price: Number(formData.dailyPrice),
          location: formData.location,
          category: formData.category,
          image: photos[0] || categoryEmojis[formData.category] || '📦',
          photos,
          offerTitle: formData.offerTitle,
          offerDetails: formData.offerDetails,
          features: selectedAccessories,
          installationSteps: formData.installationSteps
            .split('\n')
            .map((step) => step.trim())
            .filter(Boolean),
          accessories: selectedAccessories,
          availability: formData.availability,
          deliveryIncluded: selectedAccessories.includes('Free delivery'),
          installationIncluded: selectedAccessories.includes('Installation included'),
          ownerId: user._id,
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        throw new Error(responseBody?.error || 'Failed to upload item');
      }

      setUploadSuccess(true);
      setPhotos([]);
      setSelectedAccessories(['Free delivery', 'Installation included']);
      setFormData({
        itemTitle: '',
        category: 'tools',
        description: '',
        dailyPrice: '',
        location: '',
        phone: '',
        availability: 'available',
        offerTitle: '',
        offerDetails: '',
        installationSteps: '',
      });

      setTimeout(() => {
        setUploadSuccess(false);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error uploading item:', err);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <SceneBackdrop />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="hero-surface rounded-[2rem] px-8 py-6 text-center text-slate-900">
            Loading account...
          </div>
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
            <Sparkles className="mx-auto h-10 w-10 text-blue-700" />
            <h1 className="mt-4 text-3xl font-bold text-slate-950">Sign in to list an item</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We need a live account so the listing can be connected to your profile and bookings.
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
              <Link href="/listings" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Browse rentals
              </Link>
              <Link href="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                My profile
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <span className="rental-chip">
                <ImagePlus className="h-4 w-4 text-blue-600" />
                Multi-photo listing with offer details
              </span>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Upload a rental that looks polished from the first photo.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Add photos, highlight installation, and include accessories or special offers so
                renters understand exactly what they are getting.
              </p>
            </div>

            <div className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Cover preview
                  </p>
                  <div className="mt-3 flex h-40 items-center justify-center rounded-[1.75rem] bg-slate-950 text-6xl text-white">
                    {coverImage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <form onSubmit={handleSubmit} className="hero-surface rounded-[2rem] p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Item title</span>
                  <input
                    type="text"
                    name="itemTitle"
                    placeholder="e.g., Premium sofa set with delivery and install"
                    value={formData.itemTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  >
                    <option value="cars">Cars & Vehicles</option>
                    <option value="tools">Tools & Equipment</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Availability</span>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  >
                    <option value="available">Available now</option>
                    <option value="soon">Available soon</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
                  <textarea
                    name="description"
                    placeholder="Describe the condition, style, and what makes this rental worth booking."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Daily price</span>
                  <input
                    type="number"
                    name="dailyPrice"
                    placeholder="50"
                    value={formData.dailyPrice}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Phone number</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="City or live coordinates"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-12 pr-40 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                    <button
                      type="button"
                      onClick={useLiveLocation}
                      disabled={locationLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {locationLoading ? 'Locating...' : 'Use live location'}
                    </button>
                  </div>
                  {locationStatus ? <p className="mt-2 text-xs text-slate-500">{locationStatus}</p> : null}
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Offer title</span>
                  <input
                    type="text"
                    name="offerTitle"
                    placeholder="Free delivery with installation"
                    value={formData.offerTitle}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Offer details</span>
                  <textarea
                    name="offerDetails"
                    placeholder="Explain discounts, bundle items, or special benefits renters will receive."
                    value={formData.offerDetails}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Installation steps</span>
                  <textarea
                    name="installationSteps"
                    placeholder="Step 1 - Confirm booking&#10;Step 2 - Route delivery&#10;Step 3 - Install and test"
                    value={formData.installationSteps}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  />
                </label>

                <div className="md:col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-700">Included accessories</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {accessoryOptions.map((accessory) => (
                      <button
                        key={accessory}
                        type="button"
                        onClick={() => toggleAccessory(accessory)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedAccessories.includes(accessory)
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        {accessory}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-700">Upload photos</span>
                  </div>
                  <label className="flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/60">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-blue-700" />
                      <p className="text-sm font-semibold text-slate-900">Click to add multiple item photos</p>
                      <p className="text-xs text-slate-500">PNG, JPG, or WEBP images are fine.</p>
                    </div>
                  </label>
                  {photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {photos.map((photo, index) => (
                        <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <div className="relative h-32 w-full">
                            <Image
                              src={photo}
                              alt={`Upload preview ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-2 text-white opacity-0 transition group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    Your item is now live and connected to your account.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
                >
                  <Plus className="h-4 w-4" />
                  {uploading ? 'Publishing...' : 'Publish listing'}
                </button>
              </div>
            </form>

            <aside className="space-y-6">
              <div className="glass-panel rounded-[2rem] p-6">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <FileText className="h-4 w-4 text-blue-700" />
                  Success tips
                </p>
                <div className="mt-4 space-y-3">
                  {uploadTips.map((tip) => (
                    <div key={tip} className="rounded-2xl bg-white/60 p-4 text-sm leading-6 text-slate-700">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Listing summary
                </p>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Owner account</span>
                    <span className="font-semibold text-slate-900">{user.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Photos uploaded</span>
                    <span className="font-semibold text-slate-900">{photos.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accessories</span>
                    <span className="font-semibold text-slate-900">{selectedAccessories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cover image</span>
                    <span className="font-semibold text-slate-900">{coverImage === '📦' ? 'Emoji fallback' : 'Uploaded photo'}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
