'use client';
import { usePlayground } from "@/store/usePlayground";
import { useEffect } from "react";
import clsx from "clsx";
export default function LeftSidebar(){
  const { categories, activeCategoryId, setActiveCategory, loadAll } = usePlayground();
  useEffect(()=>{ if(!categories.length) loadAll(); },[]);
  return (<aside className="h-screen sticky top-0 w-[var(--sidebar-width)] shrink-0 overflow-y-auto p-3 border-r border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hidden md:block">
    <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Komponen</h2><button className={clsx("text-sm px-3 py-1 rounded-xl border", activeCategoryId==='all' && "bg-gray-100 dark:bg-gray-800")} onClick={()=>setActiveCategory('all')}>Semua</button></div>
    <div className="space-y-3">{categories.map(cat => (<button key={cat.id} className={clsx("w-full card p-2 flex gap-3 items-center text-left", activeCategoryId===cat.id && "ring-2 ring-blue-500")} onClick={()=>setActiveCategory(cat.id)}><img src={cat.thumbUrl || "/thumbs/buttons.svg"} alt={cat.name} className="h-12 w-16 rounded-lg bg-white object-cover"/><div><div className="font-medium">{cat.name}</div><div className="text-xs text-gray-500">Klik untuk filter</div></div></button>))}</div>
  </aside>);
}
