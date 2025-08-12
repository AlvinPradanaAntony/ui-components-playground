"use client";
import { usePlayground } from "@/store/usePlayground";
import { useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
export default function LeftSidebar() {
  const { categories, activeCategoryId, setActiveCategory, loadAll } = usePlayground();
  useEffect(() => {
    if (!categories.length) loadAll();
  }, []);
  return (
    <aside aria-label="Daftar kategori" className="h-[calc(100vh-3.5rem)] sticky top-14 w-[var(--sidebar-width)] shrink-0 overflow-y-auto p-2 lg:p-3 border-r border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 hidden lg:block">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-sm lg:text-base">Komponen</h2>
        <div className="flex items-center gap-1 lg:gap-2">
          <Link href="/categories" className="text-xs px-1.5 lg:px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5">
            Kelola
          </Link>
          <button
            className={clsx(
              "text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-md border border-gray-200 dark:border-gray-800",
              activeCategoryId === "all" && "bg-brand-500 text-white"
            )}
            onClick={() => setActiveCategory("all")}
          >
            Semua
          </button>
        </div>
      </div>
      <div className="space-y-2 lg:space-y-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={clsx(
              "w-full card p-2 flex gap-2 lg:gap-3 items-center text-left group transition-all hover:-translate-y-0.5",
              activeCategoryId === cat.id && "card-active bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-white"
            )}
            onClick={() => setActiveCategory(cat.id)}
          >
            <img src={cat.thumbUrl || "/thumbs/buttons.svg"} alt={cat.name} className="h-10 w-12 lg:h-12 lg:w-16 rounded-lg object-cover ring-1 ring-gray-200/70 dark:ring-gray-800/80 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm lg:text-base truncate">{cat.name}</div>
              <div className="text-xs text-gray-500 hidden lg:block">Klik untuk filter</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
