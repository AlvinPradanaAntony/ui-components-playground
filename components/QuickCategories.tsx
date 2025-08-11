"use client";
import clsx from "clsx";
import { usePlayground } from "@/store/usePlayground";

export default function QuickCategories() {
  const { categories, activeCategoryId, setActiveCategory } = usePlayground();

  if (!categories.length) {
    return (
      <div className="-mx-4 px-4 md:hidden">
        <div className="flex gap-2 overflow-x-auto py-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-4 px-4 md:hidden">
      <div className="flex gap-2 overflow-x-auto py-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={clsx(
            "inline-flex items-center h-8 px-3 rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 text-sm whitespace-nowrap transition-colors",
            activeCategoryId === "all"
              ? "bg-brand-50 text-brand-700 dark:text-white border-brand-200 dark:border-brand-600"
              : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={clsx(
              "inline-flex items-center h-8 px-3 rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 text-sm whitespace-nowrap transition-colors",
              activeCategoryId === c.id
                ? "bg-brand-50 text-brand-700 dark:text-white border-brand-200 dark:border-brand-600"
                : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}