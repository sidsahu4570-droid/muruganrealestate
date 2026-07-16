import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-accent/15 text-accent flex items-center justify-center rounded-2xl shadow-goldGlow mb-6 border border-accent/25">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2 font-serif">Listing Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The destination URL does not exist in our systems. It may have sold off-market or shifted directories.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-primary text-white hover:bg-primary-light transition-colors rounded-xl text-sm font-semibold shadow-md border border-slate-800"
      >
        Return Home
      </Link>
    </div>
  );
};
