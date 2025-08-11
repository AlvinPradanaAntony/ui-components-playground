'use client';
import Link from "next/link";
import { usePlayground } from "@/store/usePlayground";
import { useMemo } from "react";
import clsx from "clsx";

export default function ComponentGrid() {
  const { components, styleFilter, activeCategoryId, query, loading, setActiveCategory, setStyleFilter } = usePlayground();
  const q = (query || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    const base = components.filter(
      (c) =>
        (styleFilter === "all" || c.style === styleFilter) &&
        (activeCategoryId === "all" || c.categoryId === activeCategoryId)
    );
    if (!q) return base;
    return base.filter((c) => {
      const inName = c.name.toLowerCase().includes(q);
      const inTags = (c.tags || []).some((t) => t.toLowerCase().includes(q));
      return inName || inTags;
    });
  }, [components, styleFilter, activeCategoryId, q]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 w-1/2">
                <div className="h-4 w-32 rounded skeleton" />
                <div className="h-3 w-20 rounded skeleton" />
              </div>
              <div className="h-12 w-20 rounded-md skeleton" />
            </div>
            <div className="mt-3 h-3 w-28 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((item) => (
        <Link
          href={`/component/${item.id}`}
          key={item.id}
          aria-label={`Buka ${item.name}`}
          className={clsx(
            "card group p-4 transition-all duration-200 ease-soft-spring hover:shadow-elevated hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:text-white">
                  {item.style}
                </span>
                {(item.tags || []).slice(0, 2).map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <img src={item.previewThumbUrl || "/thumbs/buttons.svg"} alt={`${item.name} preview`} className="h-12 w-20 rounded-md object-cover ring-1 ring-gray-200/70 dark:ring-gray-800/80" />
          </div>
          <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            Klik untuk detail
          </div>
        </Link>
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full">
          <div className="card p-6 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 grid place-items-center">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div className="font-medium">Tidak ada komponen</div>
            <div className="text-sm text-gray-500 mt-1">Coba reset filter atau buat komponen baru.</div>
            <div className="mt-3 flex justify-center gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border"
                onClick={() => {
                  setActiveCategory("all");
                  setStyleFilter("all" as any);
                }}
              >
                Reset filter
              </button>
              <Link href="/new" className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700">Buat baru</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
