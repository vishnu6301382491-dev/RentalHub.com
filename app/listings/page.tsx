import { Suspense } from 'react';
import ListingsClient from './listings-client';

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="hero-surface rounded-[2rem] px-8 py-6 text-slate-900">Loading rentals...</div>
        </div>
      }
    >
      <ListingsClient />
    </Suspense>
  );
}
