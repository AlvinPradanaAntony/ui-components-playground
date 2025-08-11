"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayground } from "@/store/usePlayground";
import PreviewIframe from "@/components/PreviewIframe";
import RightSidebar from "@/components/RightSidebar";
import type { ComponentCode, UIComponentItem } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useValidation } from "@/components/ui/ValidationModal";

export default function ComponentDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const validation = useValidation();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { components, categories, loadAll, upsertComponent, deleteComponent } = usePlayground();

  const [code, setCode] = useState<ComponentCode | null>(null);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [previewThumbUrl, setPreviewThumbUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  if (!item || !code)
    return (
      <div className="p-6">
        <div className="h-8 w-48 rounded skeleton" />
        <div className="mt-3 h-5 w-32 rounded skeleton" />
        <div className="mt-4 h-[60vh] rounded-xl skeleton" />
      </div>
    );

  function validateForm() {
    const errors = [];

    if (!name.trim()) {
      errors.push({ field: "Nama", message: "Nama komponen wajib diisi" });
    } else if (name.trim().length < 3) {
      errors.push({ field: "Nama", message: "Nama komponen minimal 3 karakter" });
    }

    if (!categoryId) {
      errors.push({ field: "Kategori", message: "Kategori wajib dipilih" });
    }

    if (!code || !code.html.trim()) {
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
      if (!item) {
        toast.error("Komponen tidak ditemukan");
        return;
      }
      const next: UIComponentItem = {
        ...item,
        name: name.trim(),
        categoryId,
        code: code!,
        previewThumbUrl: previewThumbUrl || undefined,
        updatedAt: Date.now(),
      };
      await upsertComponent(next);
      toast.success("Perubahan tersimpan", { title: "Sukses" });
    } catch (e: any) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  }

  async function remove() {
    try {
      if (!item) {
        toast.error("Komponen tidak ditemukan");
        return;
      }
      const current = item;
      const confirmed = await confirm.confirm({
        title: "Hapus Komponen",
        message: `Apakah Anda yakin ingin menghapus komponen "${current.name}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus",
        cancelText: "Batal",
        variant: "danger",
      });

      if (confirmed) {
        await deleteComponent(current.id);
        toast.success("Komponen dihapus");
        router.push("/");
      }
    } catch {
      toast.error("Gagal menghapus komponen");
    }
  }

  return (
    <div className="flex">
      <main id="content" role="main" className="flex-1 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40" onClick={() => router.push("/")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Kembali
            </button>
            <div>
              <input className="text-xl md:text-2xl font-semibold bg-transparent border-b border-transparent focus:border-brand-500/40 focus:outline-none" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="text-xs text-gray-500">Style: {item.style}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
            <button className="px-3 py-1.5 rounded-lg border border-red-300/50 text-red-600 hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50" onClick={remove}>
              Delete
            </button>
          </div>
        </div>
        <div className="h-[70vh]">
          <PreviewIframe styleKind={item.style} code={code!} />
        </div>
      </main>
      <RightSidebar initialCode={code!} onCodeChange={setCode} styleKind={item.style} baselineKey={item.id} iconUrl={previewThumbUrl} onIconChange={setPreviewThumbUrl} iconLabel="Icon/Thumbnail" />
    </div>
  );
}
