import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
        let borderColor = 'border-emerald-200 dark:border-emerald-900/60';
        let bgStyle = 'bg-white dark:bg-slate-900';

        if (toast.type === 'error') {
          icon = <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />;
          borderColor = 'border-rose-200 dark:border-rose-900/60';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
          borderColor = 'border-amber-200 dark:border-amber-900/60';
        } else if (toast.type === 'info') {
          icon = <Info className="h-4 w-4 text-sky-500 shrink-0" />;
          borderColor = 'border-sky-200 dark:border-sky-900/60';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${borderColor} ${bgStyle}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
