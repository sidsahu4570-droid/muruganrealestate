import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider';

  const variants = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-gray-200',
    secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    accent: 'bg-accent/15 text-accent border border-accent/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10',
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};
