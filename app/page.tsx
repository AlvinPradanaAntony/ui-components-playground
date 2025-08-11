'use client';
import { useEffect, useCallback } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import FilterTabs from "@/components/FilterTabs";
import ComponentGrid from "@/components/ComponentGrid";
import FAB from "@/components/FAB";
import { usePlayground } from "@/store/usePlayground";
import QuickCategories from "@/components/QuickCategories";
import FeaturedRail from "@/components/FeaturedRail";

export default function HomePage() {
  const { loadAll, query, setQuery } = usePlayground();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    [setQuery]
  );

  return (
    <div className="flex">
      <LeftSidebar />
      <main id="content" role="main" className="flex-1 min-h-[calc(100vh-56px)] p-4 md:p-6">
        <section className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-500">
                UI Components Playground
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Eksplor, edit, dan simpan komponen UI lintas style.
              </p>
            </div>
            <FilterTabs />
          </div>

          {/* Mobile search (Topbar has desktop search) */}
          <div className="mt-3 md:hidden">
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
                className="w-full pl-9 pr-3 h-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              />
            </label>
          </div>

          {/* Mobile quick categories */}
          <div className="mt-2 md:hidden">
            <QuickCategories />
          </div>
        </section>

        <FeaturedRail />

        <ComponentGrid />
      </main>
      <FAB />
    </div>
  );
}
