"use client";
import Link from "next/link";
import { useMemo } from "react";
import { usePlayground } from "@/store/usePlayground";

export default function FeaturedRail() {
  const { components } = usePlayground();
  const featured = useMemo(() => components.filter((c) => c.isFeatured), [components]);

  if (!featured.length) return null;

  return (
    <section aria-label="Trending components" className="mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Trending</h2>
        <span className="text-xs text-gray-500">{featured.length} item</span>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <div className="flex gap-3 px-2 pb-1">
          {featured.slice(0, 12).map((item) => (
            <Link
              key={item.id}
              href={`/component/${item.id}`}
              className="min-w-[220px] max-w-[220px] card p-3 transition-all duration-200 ease-soft-spring hover:shadow-elevated hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="mt-1 text-[11px] text-gray-500 truncate">{item.style}</div>
                </div>
                <img
                  src={item.previewThumbUrl || "/thumbs/buttons.svg"}
                  alt=""
                  className="h-10 w-16 rounded-md object-cover ring-1 ring-gray-200/70 dark:ring-gray-800/80"
                />
              </div>
              {item.tags?.length ? (
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}