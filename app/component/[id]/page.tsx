"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, UIComponentItem } from "@/types";
import IconUploader from "@/components/IconUploader";
export default function ComponentDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { components, categories, loadAll, upsertComponent, deleteComponent } = usePlayground();
  const [code, setCode] = useState<ComponentCode | null>(null);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [previewThumbUrl, setPreviewThumbUrl] = useState<string>("");
  const item = useMemo(() => components.find((c) => c.id === id), [components, id]);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useEffect(() => {
    if (item) {
      setCode(item.code);
      setName(item.name);
      setCategoryId(item.categoryId);
      setPreviewThumbUrl(item.previewThumbUrl || "");
    }
  }, [item]);
  if (!item || !code) return <div className="p-6">Memuat...</div>;
  async function save() {
    const next: UIComponentItem = { ...item, name, categoryId, code, previewThumbUrl: previewThumbUrl || undefined, updatedAt: Date.now() };
    await upsertComponent(next);
    alert("Tersimpan!");
  }
  async function remove() {
    if (confirm("Hapus komponen ini?")) {
      await deleteComponent(item.id);
      alert("Dihapus");
      router.push("/");
    }
  }
  return (
    <div className="flex">
      <main className="flex-1 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <button className="px-3 py-1.5 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900" onClick={() => router.back()}>
              Kembali
            </button>
            <div>
              <input className="text-xl font-semibold bg-transparent border-b focus:outline-none" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="text-xs text-gray-500">Style: {item.style}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 rounded-xl border" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="px-3 py-1.5 rounded-xl border" onClick={save}>
              Save
            </button>
            <button className="px-3 py-1.5 rounded-xl border text-red-600" onClick={remove}>
              Delete
            </button>
          </div>
        </div>
        <div className="h-[70vh]">
          <PreviewIframe styleKind={item.style} code={code} />
        </div>
      </main>
      <RightSidebar initialCode={code} onCodeChange={setCode} styleKind={item.style} baselineKey={item.id} iconUrl={previewThumbUrl} onIconChange={setPreviewThumbUrl} iconLabel="Icon/Thumbnail" />
    </div>
  );
}
