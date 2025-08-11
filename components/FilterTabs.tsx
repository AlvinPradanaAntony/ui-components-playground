'use client';
import clsx from "clsx";
import { usePlayground } from "@/store/usePlayground";

const tabs = [
  { key: "all", label: "All" },
  { key: "native", label: "Native CSS" },
  { key: "bootstrap", label: "Bootstrap 5" },
  { key: "tailwind", label: "Tailwind CSS" },
] as const;

export default function FilterTabs() {
  const { styleFilter, setStyleFilter } = usePlayground();
  return (
    <div
      role="tablist"
      aria-label="Filter style"
      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur px-1 py-1 shadow-soft"
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={styleFilter === t.key}
          className={clsx(
            "relative px-3.5 py-1.5 text-sm rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
            styleFilter === t.key
              ? "bg-brand-50 text-brand-700 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
          )}
          onClick={() => setStyleFilter(t.key as any)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
