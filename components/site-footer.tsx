import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Browse rentals', href: '/listings' },
      { label: 'List an item', href: '/upload' },
      { label: 'Create account', href: '/signup' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Sign in', href: '/signin' },
      { label: 'My profile', href: '/profile' },
      { label: 'Upload item', href: '/upload' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-white/20 bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(124,58,237,0.22),_transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-slate-400">RENTALHUB</p>
                <p className="text-lg font-bold text-white">A better rental experience</p>
              </div>
            </Link>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              RentHub is built for people who want clear pricing, live location support, delivery,
              installation, and a profile-first marketplace that feels like a real product.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rental-chip border-white/10 bg-white/5 text-white">
                <MapPin className="h-4 w-4 text-blue-300" />
                Live location ready
              </span>
              <span className="rental-chip border-white/10 bg-white/5 text-white">
                <Phone className="h-4 w-4 text-blue-300" />
                Support on demand
              </span>
              <span className="rental-chip border-white/10 bg-white/5 text-white">
                <Mail className="h-4 w-4 text-blue-300" />
                Account based access
              </span>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                {group.title}
              </p>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                    >
                      <ArrowRight className="h-4 w-4 text-blue-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RentalHub. All rights reserved.</p>
          <p>Delivery, installation, and booking flow designed for a polished marketplace feel.</p>
        </div>
      </div>
    </footer>
  );
}
