"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, StyleKind, UIComponentItem } from "@/types";
import { useToast } from "@/components/ui/Toast";

const defaultByStyle: Record<StyleKind, ComponentCode> = {
  native: {
    html: '<button class="btn">New Element</button>',
    css: ".btn{background:#16a34a;color:white;padding:.6rem 1rem;border-radius:.75rem;border:none}",
    js: "",
  },
  bootstrap: { html: '<button class="btn btn-success">New Element</button>', css: "", js: "" },
  tailwind: { html: '<button class="px-4 py-2 rounded-xl bg-green-600 text-white">New Element</button>', css: "", js: "" },
};

export default function NewComponentPage() {
  const router = useRouter();
  const toast = useToast();
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

  async function save() {
    try {
      const id = slug || `comp-${Date.now()}`;
      const item: UIComponentItem = {
        id,
        name: name || "Untitled",
        slug: slug || id,
        categoryId,
        style,
        tags: [],
        code,
        props: {},
        previewThumbUrl: previewThumbUrl || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await upsertComponent(item);
      toast.success("Komponen baru tersimpan", { title: "Sukses" });
      router.push(`/component/${item.id}`);
    } catch (e: any) {
      toast.error("Gagal menyimpan komponen");
    }
  }

  return (
    <div className="flex">
      <main id="content" role="main" className="flex-1 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              onClick={() => router.back()}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Kembali
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Buat Komponen Baru</h1>
              <div className="text-xs text-gray-500">Style: {style}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            placeholder="Slug / ID"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
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
      <RightSidebar
        initialCode={code}
        onCodeChange={setCode}
        styleKind={style}
        baselineKey={`new-${style}`}
        iconUrl={previewThumbUrl}
        onIconChange={setPreviewThumbUrl}
        iconLabel="Icon/Thumbnail"
      />
    </div>
  );
}
