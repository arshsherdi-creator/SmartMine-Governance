import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertOctagon;
          borderClass = 'border-rose-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
          iconColor = 'text-rose-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
          iconColor = 'text-blue-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border-l-4 rounded-md shadow-lg p-3.5 flex items-start justify-between gap-3 border ${borderClass} transition-all duration-200`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div>
                <div className="text-sm font-semibold">{toast.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
