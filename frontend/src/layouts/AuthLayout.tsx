import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#070b13] p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary dark:bg-primary-light border border-accent/35 flex items-center justify-center rounded-2xl shadow-goldGlow mb-3">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-serif text-slate-900 dark:text-gray-100">
            MURUGAN
          </h2>
          <p className="text-xs tracking-widest uppercase text-accent font-semibold mt-1">
            ESTATE MANAGEMENT
          </p>
        </div>

        <div className="glass-premium rounded-2xl p-8 border border-white/20 dark:border-white/5 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
