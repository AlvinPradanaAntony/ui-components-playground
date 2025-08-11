"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, UIComponentItem } from "@/types";
export default function ComponentDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { components, loadAll, upsertComponent } = usePlayground();
  const [code, setCode] = useState<ComponentCode | null>(null);
  const item = useMemo(() => components.find((c) => c.id === id), [components, id]);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useEffect(() => {
    if (item) setCode(item.code);
  }, [item]);
  if (!item || !code) return <div className="p-6">Memuat...</div>;
  async function save() {
    const next: UIComponentItem = { ...item, code };
    await upsertComponent(next);
    alert("Tersimpan!");
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
              <h1 className="text-xl font-semibold">{item.name}</h1>
              <div className="text-xs text-gray-500">Style: {item.style}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-xl border" onClick={save}>
              Save
            </button>
          </div>
        </div>
        <div className="h-[70vh]">
          <PreviewIframe styleKind={item.style} code={code} />
        </div>
      </main>
      <RightSidebar initialCode={code} onCodeChange={setCode} styleKind={item.style} baselineKey={item.id} />
    </div>
  );
}
