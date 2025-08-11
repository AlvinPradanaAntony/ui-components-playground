"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, StyleKind, UIComponentItem } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useValidation } from "@/components/ui/ValidationModal";

const defaultByStyle: Record<StyleKind, ComponentCode> = {
  native: { html: "", css: "", js: "" },
  bootstrap: { html: "", css: "", js: "" },
  tailwind: { html: "", css: "", js: "" },
};

export default function NewComponentPage() {
  const router = useRouter();
  const toast = useToast();
  const validation = useValidation();
  const { categories, loadAll, upsertComponent } = usePlayground();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("buttons");
  const [style, setStyle] = useState<StyleKind>("native");
  const [code, setCode] = useState<ComponentCode>(defaultByStyle["native"]);
  const [previewThumbUrl, setPreviewThumbUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categories.length) loadAll();
  }, [categories.length, loadAll]);

  // Set initial category from URL parameter (client-only, compatible with static export)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const categoryFromUrl = sp.get("categoryId");
    if (categoryFromUrl && categories.length > 0) {
      const categoryExists = categories.some((cat) => cat.id === categoryFromUrl);
      if (categoryExists) setCategoryId(categoryFromUrl);
    }
  }, [categories]);

  function validateForm() {
    const errors = [];

    if (!name.trim()) {
      errors.push({ field: "Nama", message: "Nama komponen wajib diisi" });
    } else if (name.trim().length < 3) {
      errors.push({ field: "Nama", message: "Nama komponen minimal 3 karakter" });
    }

    if (slug && slug.trim()) {
      if (!/^[a-z0-9-]+$/.test(slug.trim())) {
        errors.push({ field: "Slug/ID", message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung" });
      }
      if (slug.trim().length < 3) {
        errors.push({ field: "Slug/ID", message: "Slug minimal 3 karakter" });
      }
    }

    if (!categoryId) {
      errors.push({ field: "Kategori", message: "Kategori wajib dipilih" });
    }

    if (!code.html.trim()) {
      errors.push({ field: "HTML", message: "Kode HTML wajib diisi" });
    }

    if (!previewThumbUrl || !previewThumbUrl.trim()) {
      errors.push({ field: "Icon/Thumbnail", message: "Icon atau thumbnail komponen wajib diisi" });
    } else {
      // Validate if it's a valid URL or data URL
      const isValidUrl = /^https?:\/\/.+/.test(previewThumbUrl.trim());
      const isValidDataUrl = /^data:image\/.+/.test(previewThumbUrl.trim());
      const isValidPath = /^\/thumbs\/.+\.(svg|png|jpg|jpeg|gif)$/i.test(previewThumbUrl.trim());

      if (!isValidUrl && !isValidDataUrl && !isValidPath) {
        errors.push({ field: "Icon/Thumbnail", message: "Icon harus berupa URL valid, data URL, atau path ke file gambar" });
      }
    }

    return errors;
  }

  async function save() {
    const errors = validateForm();

    if (errors.length > 0) {
      validation.showValidationErrors({
        title: "Form Tidak Valid",
        errors,
      });
      return;
    }

    setIsLoading(true);
    try {
      const id = slug || `comp-${Date.now()}`;
      const item: UIComponentItem = {
        id,
        name: name.trim(),
        slug: slug.trim() || id,
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex">
      <main id="content" role="main" className="flex-1 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40" onClick={() => router.back()}>
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
              onClick={save}
              disabled={isLoading}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m15.84 12.16a4 4 0 1 1-7.68 0"></path>
                </svg>
              )}
              {isLoading ? "Menyimpan..." : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" placeholder="Slug / ID" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
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
      <RightSidebar initialCode={code} onCodeChange={setCode} styleKind={style} baselineKey={`new-${style}`} iconUrl={previewThumbUrl} onIconChange={setPreviewThumbUrl} iconLabel="Icon/Thumbnail" />
    </div>
  );
}
