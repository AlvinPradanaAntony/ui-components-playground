"use client";
import clsx from "clsx";
import { usePlayground } from "@/store/usePlayground";

export default function QuickCategories() {
  const { categories, activeCategoryId, setActiveCategory } = usePlayground();

  if (!categories.length) {
    return (
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 sm:h-8 w-16 sm:w-20 rounded-full skeleton shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={clsx(
            "inline-flex items-center h-7 sm:h-8 px-2.5 sm:px-3 rounded-full border transition-colors shrink-0 text-xs sm:text-sm whitespace-nowrap",
            activeCategoryId === "all"
              ? "bg-brand-500 text-white border-brand-500 shadow-sm"
              : "border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={clsx(
              "inline-flex items-center h-7 sm:h-8 px-2.5 sm:px-3 rounded-full border transition-colors shrink-0 text-xs sm:text-sm whitespace-nowrap",
              activeCategoryId === c.id
                ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                : "border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}