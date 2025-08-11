'use client';
import Link from "next/link";
import { usePlayground } from "@/store/usePlayground";
import { useMemo } from "react";
export default function ComponentGrid(){
  const { components, styleFilter, activeCategoryId } = usePlayground();
  const filtered = useMemo(()=> components.filter(c => (styleFilter==='all'||c.style===styleFilter) && (activeCategoryId==='all'||c.categoryId===activeCategoryId)), [components, styleFilter, activeCategoryId]);
  return (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {filtered.map(item => (<Link href={`/component/${item.id}`} key={item.id} className="card p-4 hover:shadow-lg transition-shadow"><div className="flex items-center justify-between"><div><div className="font-semibold">{item.name}</div><div className="text-xs text-gray-500">{item.style}</div></div><img src={item.previewThumbUrl || "/thumbs/buttons.svg"} alt="" className="h-12 w-20 rounded-md object-cover"/></div><div className="mt-3 text-xs text-gray-500">Klik untuk detail</div></Link>))}
    {filtered.length===0 && (<div className="text-sm text-gray-500">Tidak ada komponen untuk filter ini.</div>)}
  </div>);
}
