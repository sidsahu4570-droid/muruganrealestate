import React from 'react';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { ToastType } from '../types';

const toastStyles: Record<ToastType, { border: string; bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    border: 'border-accent/40 shadow-goldGlow',
    bg: 'bg-white/95 dark:bg-primary-dark/95 backdrop-blur-md',
    text: 'text-primary dark:text-gray-100',
    icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
  },
  error: {
    border: 'border-red-500/30',
    bg: 'bg-white/95 dark:bg-primary-dark/95 backdrop-blur-md',
    text: 'text-primary dark:text-gray-100',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-white/95 dark:bg-primary-dark/95 backdrop-blur-md',
    text: 'text-primary dark:text-gray-100',
    icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
  },
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-white/95 dark:bg-primary-dark/95 backdrop-blur-md',
    text: 'text-primary dark:text-gray-100',
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${style.border} ${style.bg} ${style.text} shadow-luxury`}
            >
              <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
              <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
