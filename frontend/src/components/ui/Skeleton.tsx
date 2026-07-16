import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-slate-200 dark:bg-slate-800/80';

  const variants = {
    text: 'h-4 w-full rounded-md',
    rect: 'rounded-xl h-24 w-full',
    circle: 'rounded-full h-10 w-10',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};
