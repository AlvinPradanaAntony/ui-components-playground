"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, StyleKind, UIComponentItem } from "@/types";

const defaultByStyle: Record<StyleKind, ComponentCode> = {
  native: { html: '<button class="btn">New Element</button>', css: ".btn{background:#16a34a;color:white;padding:.6rem 1rem;border-radius:.75rem;border:none}", js: "" },
  bootstrap: { html: '<button class="btn btn-success">New Element</button>', css: "", js: "" },
  tailwind: { html: '<button class="px-4 py-2 rounded-xl bg-green-600 text-white">New Element</button>', css: "", js: "" },
};

export default function NewComponentPage() {
  const router = useRouter();
  const { categories, loadAll, upsertComponent } = usePlayground();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("buttons");
  const [style, setStyle] = useState<StyleKind>("native");
  const [code, setCode] = useState<ComponentCode>(defaultByStyle["native"]);
  const [previewThumbUrl, setPreviewThumbUrl] = useState<string>("");

  useEffect(() => {
    if (!categories.length) loadAll();
  }, [categories.length, loadAll]);
  // code will be updated synchronously in the style dropdown onChange

  const selectedStyle = style;

  async function save() {
    const id = slug || `comp-${Date.now()}`;
    const item: UIComponentItem = { id, name: name || "Untitled", slug: slug || id, categoryId, style, tags: [], code, props: {}, previewThumbUrl: previewThumbUrl || undefined, createdAt: Date.now(), updatedAt: Date.now() };
    await upsertComponent(item);
    alert("Tersimpan!");
    router.push(`/component/${item.id}`);
  }

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <a href="/" className="px-3 py-1.5 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900">
              Kembali
            </a>
            <div>
              <h1 className="text-xl font-semibold">Buat Komponen Baru</h1>
              <div className="text-xs text-gray-500">Style: {selectedStyle}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-xl border" onClick={save}>
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input className="px-3 py-2 rounded-xl border" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" placeholder="Slug / ID" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <select className="px-3 py-2 rounded-xl border" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded-xl border"
            value={style}
            onChange={(e) => {
              const next = e.target.value as StyleKind;
              setStyle(next);
              setCode(defaultByStyle[next]);
            }}
          >
            <option value="native">Native CSS</option>
            <option value="bootstrap">Bootstrap 5</option>
            <option value="tailwind">Tailwind CSS</option>
          </select>
        </div>

        <div className="h-[70vh]">
          <PreviewIframe styleKind={style} code={code} />
        </div>
      </main>
      <RightSidebar initialCode={code} onCodeChange={setCode} styleKind={style} baselineKey={`new-${style}`} iconUrl={previewThumbUrl} onIconChange={setPreviewThumbUrl} iconLabel="Icon/Thumbnail" />
    </div>
  );
}
