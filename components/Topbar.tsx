"use client";
import Link from "next/link";
import { usePlayground } from "@/store/usePlayground";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCallback } from "react";

export default function Topbar() {
  const { query, setQuery } = usePlayground();
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), [setQuery]);

  return (
    <header role="banner" aria-label="Top bar" className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex items-center gap-2 sm:gap-3 justify-between h-14 px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow" />
            <span className="font-semibold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-500 truncate">
              UI Playground
            </span>
          </Link>
          <span className="hidden lg:inline text-xs px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
            2025
          </span>
        </div>

        <div className="flex-1 max-w-xl hidden sm:flex mx-3">
          <label className="relative w-full">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={onChange}
              placeholder="Cari komponen..."
              aria-label="Cari komponen"
              className="w-full pl-8 pr-3 h-8 sm:h-9 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            />
          </label>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}