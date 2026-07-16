import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-primary-dark/30 backdrop-blur-md shadow-luxury p-5 transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-luxuryHover hover:-translate-y-1 hover:border-accent/30' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
