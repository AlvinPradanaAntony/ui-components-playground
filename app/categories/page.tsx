"use client";
import { useEffect, useState } from "react";
import { usePlayground } from "@/store/usePlayground";
import type { Category } from "@/types";
import IconUploader from "@/components/IconUploader";

export default function CategoriesPage() {
  const { categories, loadAll, upsertCategory, deleteCategory } = usePlayground();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbUrl, setThumbUrl] = useState("/thumbs/cards.svg");
  const [order, setOrder] = useState<number>(categories.length + 1);
  useEffect(() => {
    if (!categories.length) loadAll();
  }, []);

  async function add() {
    const id = slug || name.toLowerCase().replace(/\s+/g, "-") || `cat-${Date.now()}`;
    const now = Date.now();
    const cat: Category = { id, name: name || "Untitled", slug: slug || id, thumbUrl, order, createdAt: now, updatedAt: now };
    await upsertCategory(cat);
    setName("");
    setSlug("");
    setThumbUrl("/thumbs/cards.svg");
    setOrder(categories.length + 1);
  }

  async function save(cat: Category) {
    await upsertCategory({ ...cat, updatedAt: Date.now() });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Kelola Kategori</h1>
        <a href="/" className="text-sm px-3 py-1.5 rounded-xl border">
          Kembali
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm">Nama</label>
          <input className="w-full px-3 py-2 rounded-xl border" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Slug / ID</label>
          <input className="w-full px-3 py-2 rounded-xl border" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <IconUploader label="Icon" value={thumbUrl} onChange={setThumbUrl} />
        <div className="space-y-2">
          <label className="text-sm">Order</label>
          <input type="number" className="w-full px-3 py-2 rounded-xl border" value={order} onChange={(e) => setOrder(parseInt(e.target.value || "0", 10))} />
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-blue-600 text-white" onClick={add}>
        Tambah Kategori
      </button>

      <h2 className="font-semibold mt-8 mb-3">Daftar Kategori</h2>
      <div className="space-y-3">
        {categories
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border">
              <IconUploader compact label="" value={cat.thumbUrl || ""} onChange={(v) => save({ ...cat, thumbUrl: v })} />
              <input className="px-3 py-1.5 rounded-xl border flex-1" value={cat.name} onChange={(e) => save({ ...cat, name: e.target.value })} />
              <input className="px-3 py-1.5 rounded-xl border w-40" value={cat.slug} onChange={(e) => save({ ...cat, slug: e.target.value })} />
              <input type="number" className="px-3 py-1.5 rounded-xl border w-24" value={cat.order || 0} onChange={(e) => save({ ...cat, order: parseInt(e.target.value || "0", 10) })} />
              <button className="px-3 py-1.5 rounded-xl border text-red-600" onClick={() => deleteCategory(cat.id)}>
                Hapus
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
