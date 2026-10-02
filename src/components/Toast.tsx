import React from 'react';
import { Check, Copy } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  colorHex?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-[#1e1c19] text-[#fbfaf8] dark:bg-[#2c2925] dark:text-[#f8f5ee] px-4 py-3 rounded-lg shadow-xl border border-[#3e3a34] animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.colorHex ? (
            <div
              className="w-5 h-5 rounded border border-white/20 shadow-sm shrink-0"
              style={{ backgroundColor: toast.colorHex }}
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="text-xs">
            <p className="font-medium font-sans">{toast.title}</p>
            {toast.subtitle && (
              <p className="text-[#a49d91] font-mono text-[11px] mt-0.5">{toast.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
