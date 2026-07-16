import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#070b13] p-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-2xl shadow-lg mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        You do not possess the necessary authorization roles to access this dashboard channel.
      </p>
      <Link
        to="/admin"
        className="px-5 py-2.5 bg-primary text-white hover:bg-primary-light transition-colors rounded-xl text-sm font-semibold shadow-md"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};
