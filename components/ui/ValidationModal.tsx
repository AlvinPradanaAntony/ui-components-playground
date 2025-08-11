"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ValidationError = {
  field: string;
  message: string;
};

type ValidationModalOptions = {
  title?: string;
  errors: ValidationError[];
};

type ValidationContextType = {
  showValidationErrors: (options: ValidationModalOptions) => void;
};

const ValidationContext = createContext<ValidationContextType | null>(null);

export function ValidationProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ValidationModalOptions | null>(null);

  const showValidationErrors = useCallback((options: ValidationModalOptions) => {
    setModal(options);
  }, []);

  const handleClose = useCallback(() => {
    setModal(null);
  }, []);

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  const container = mounted ? document.body : null;

  return (
    <ValidationContext.Provider value={{ showValidationErrors }}>
      {children}
      {container &&
        createPortal(
          <AnimatePresence>
            {modal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="validation-title"
                aria-describedby="validation-errors"
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={handleClose}
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
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/50 grid place-items-center">
                    <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 id="validation-title" className="text-lg font-semibold mb-2">
                      {modal.title || "Validasi Form"}
                    </h3>
                    <div id="validation-errors" className="text-left mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Mohon perbaiki kesalahan berikut:
                      </p>
                      <ul className="space-y-2">
                        {modal.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                {error.field}:
                              </span>{" "}
                              <span className="text-gray-700 dark:text-gray-300">
                                {error.message}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 transition"
                      autoFocus
                    >
                      Mengerti
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          container
        )}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
}