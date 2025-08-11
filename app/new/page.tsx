'use client';
import { useState } from "react"; import { useRouter } from "next/navigation"; import { usePlayground } from "@/store/usePlayground"; import type { UIComponentItem, StyleKind } from "@/types";
const defaultByStyle: Record<StyleKind,{html:string;css:string;js:string}> = {
  native: { html:'<button class="btn">New Button</button>', css:'.btn{background:#16a34a;color:white;padding:.6rem 1rem;border-radius:.75rem;border:none}', js:'' },
  bootstrap: { html:'<button class="btn btn-success">New Button</button>', css:'', js:'' },
  tailwind: { html:'<button class="px-4 py-2 rounded-xl bg-green-600 text-white">New Button</button>', css:'', js:'' }
};
export default function NewComponentPage(){ const router=useRouter(); const { upsertComponent } = usePlayground(); const [name,setName]=useState(""); const [slug,setSlug]=useState(""); const [categoryId,setCategoryId]=useState("buttons"); const [style,setStyle]=useState<StyleKind>("native");
  async function create(){ const id = slug || `comp-${Date.now()}`; const item: UIComponentItem = { id, name: name||"Untitled", slug: slug||id, categoryId, style, tags: [], code: defaultByStyle[style], props: {}, createdAt: Date.now(), updatedAt: Date.now() }; await upsertComponent(item); router.push(`/component/${item.id}`); }
  return (<div className="p-6 max-w-3xl mx-auto"><h1 className="text-xl font-semibold mb-4">Buat Komponen Baru</h1><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="space-y-2"><label className="text-sm">Nama</label><input className="w-full px-3 py-2 rounded-xl border" value={name} onChange={e=>setName(e.target.value)} /></div>
    <div className="space-y-2"><label className="text-sm">Slug / ID</label><input className="w-full px-3 py-2 rounded-xl border" value={slug} onChange={e=>setSlug(e.target.value)} /></div>
    <div className="space-y-2"><label className="text-sm">Kategori</label><select className="w-full px-3 py-2 rounded-xl border" value={categoryId} onChange={e=>setCategoryId(e.target.value)}><option value="buttons">Buttons</option><option value="cards">Cards</option><option value="inputs">Inputs</option><option value="alerts">Alerts</option></select></div>
    <div className="space-y-2"><label className="text-sm">Style</label><select className="w-full px-3 py-2 rounded-xl border" value={style} onChange={e=>setStyle(e.target.value as StyleKind)}><option value="native">Native CSS</option><option value="bootstrap">Bootstrap 5</option><option value="tailwind">Tailwind CSS</option></select></div>
  </div><div className="mt-6"><button className="px-4 py-2 rounded-xl bg-blue-600 text-white" onClick={create}>Create</button></div></div>);
}
