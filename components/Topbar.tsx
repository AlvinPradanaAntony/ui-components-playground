"use client";
import Link from "next/link";
import { usePlayground } from "@/store/usePlayground";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCallback } from "react";

export default function Topbar() {
  const { query, setQuery } = usePlayground();
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), [setQuery]);

  return (
    <header role="banner" aria-label="Top bar" className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex items-center gap-3 justify-between h-14">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-500">
              UI Playground
            </span>
          </Link>
          <span className="hidden md:inline text-xs px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
            2025
          </span>
        </div>

        <div className="flex-1 max-w-xl hidden md:flex">
          <label className="relative w-full">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={onChange}
              placeholder="Cari komponen, tag..."
              aria-label="Cari komponen"
              className="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* removed navbar "+ Baru" button */}
        </div>
      </div>
    </header>
  );
}