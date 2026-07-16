import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no items to display at this moment.',
  icon = <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-primary-dark/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-sm font-semibold text-primary dark:text-gray-100">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>
    </div>
  );
};
