"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialog) {
      dialog.resolve(true);
      setDialog(null);
    }
  }, [dialog]);

  const handleCancel = useCallback(() => {
    if (dialog) {
      dialog.resolve(false);
      setDialog(null);
    }
  }, [dialog]);

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  const container = mounted ? document.body : null;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {container &&
        createPortal(
          <AnimatePresence>
            {dialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={handleCancel}
                />
                
                {/* Dialog */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-elevated p-6"
                >
                  {/* Icon */}
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/50 grid place-items-center">
                    {dialog.options.variant === "danger" ? (
                      <svg className="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    {dialog.options.title && (
                      <h3 id="confirm-title" className="text-lg font-semibold mb-2">
                        {dialog.options.title}
                      </h3>
                    )}
                    <p id="confirm-message" className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                      {dialog.options.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 transition"
                    >
                      {dialog.options.cancelText || "Batal"}
                    </button>
                    <button
                      onClick={handleConfirm}
                      className={`px-4 py-2 rounded-lg text-white focus:outline-none focus-visible:ring-2 transition ${
                        dialog.options.variant === "danger"
                          ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/50"
                          : "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/50"
                      }`}
                      autoFocus
                    >
                      {dialog.options.confirmText || "Konfirmasi"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          container
        )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}