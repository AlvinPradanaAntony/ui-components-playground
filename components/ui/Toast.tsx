"use client";
import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms; 0 = persistent
};

export type ToastItem = ToastOptions & { id: number };

type ToastContextType = {
  show: (opts: ToastOptions) => number;
  success: (message: string, opts?: Omit<ToastOptions, "variant" | "description"> & { description?: string; title?: string }) => number;
  error: (message: string, opts?: Omit<ToastOptions, "variant" | "description"> & { description?: string; title?: string }) => number;
  info: (message: string, opts?: Omit<ToastOptions, "variant" | "description"> & { description?: string; title?: string }) => number;
  warning: (message: string, opts?: Omit<ToastOptions, "variant" | "description"> & { description?: string; title?: string }) => number;
  dismiss: (id: number) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((opts: ToastOptions) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const item: ToastItem = { id, ...opts };
    setToasts((prev) => [...prev, item]);
    const dur = opts.duration ?? 2600;
    if (dur > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, dur);
    }
    return id;
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const clear = useCallback(() => setToasts([]), []);

  const api = useMemo<ToastContextType>(
    () => ({
      show,
      success: (message, opts) => show({ ...opts, variant: "success", description: message }),
      error: (message, opts) => show({ ...opts, variant: "error", description: message }),
      info: (message, opts) => show({ ...opts, variant: "info", description: message }),
      warning: (message, opts) => show({ ...opts, variant: "warning", description: message }),
      dismiss,
      clear,
    }),
    [show, dismiss, clear]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const container = mounted ? document.body : null;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {container &&
        createPortal(
          <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] w-[min(92vw,360px)] space-y-3">
            <AnimatePresence initial={false}>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-elevated p-3 pr-10 text-sm"
                  role="status"
                  aria-live="polite"
                >
                  <div className="absolute left-0 top-0 h-full w-1" style={{ background: colorForVariant(t.variant) }} />
                  {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
                  {t.description && <div className="text-gray-600 dark:text-gray-300">{t.description}</div>}
                  <button
                    onClick={() => dismiss(t.id)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 transition"
                    aria-label="Tutup notifikasi"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" fill="none" strokeWidth={2}>
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          container
        )}
    </ToastContext.Provider>
  );
}

function colorForVariant(variant?: ToastVariant) {
  const hsl = (name: string) => `hsl(var(--${name}))`;
  switch (variant) {
    case "success":
      return hsl("success");
    case "error":
      return hsl("danger");
    case "warning":
      return hsl("warning");
    case "info":
      return hsl("info");
    default:
      return hsl("brand-500");
  }
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}