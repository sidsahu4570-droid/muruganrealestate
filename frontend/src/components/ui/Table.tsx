import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-primary-dark/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-primary-dark/30">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};
