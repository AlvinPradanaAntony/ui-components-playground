"use client";
import { useEffect, useState } from "react";
import { usePlayground } from "@/store/usePlayground";
import type { Category } from "@/types";
import IconUploader from "@/components/IconUploader";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useValidation } from "@/components/ui/ValidationModal";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const { categories, loadAll, upsertCategory, deleteCategory } = usePlayground();
  const toast = useToast();
  const confirm = useConfirm();
  const validation = useValidation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editedCategories, setEditedCategories] = useState<{[key: string]: Category}>({});
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!categories.length) loadAll();
  }, []);

  function validateForm() {
    const errors = [];

    if (!name.trim()) {
      errors.push({ field: "Nama", message: "Nama kategori wajib diisi" });
    } else if (name.trim().length < 2) {
      errors.push({ field: "Nama", message: "Nama kategori minimal 2 karakter" });
    }

    if (slug && slug.trim()) {
      if (!/^[a-z0-9-]+$/.test(slug.trim())) {
        errors.push({ field: "Slug/ID", message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung" });
      }
      if (slug.trim().length < 2) {
        errors.push({ field: "Slug/ID", message: "Slug minimal 2 karakter" });
      }
    }


    if (!thumbUrl || !thumbUrl.trim()) {
      errors.push({ field: "Icon", message: "Icon kategori wajib diisi" });
    } else {
      // Validate if it's a valid URL or data URL
      const isValidUrl = /^https?:\/\/.+/.test(thumbUrl.trim());
      const isValidDataUrl = /^data:image\/.+/.test(thumbUrl.trim());
      const isValidPath = /^\/thumbs\/.+\.(svg|png|jpg|jpeg|gif)$/i.test(thumbUrl.trim());
      
      if (!isValidUrl && !isValidDataUrl && !isValidPath) {
        errors.push({ field: "Icon", message: "Icon harus berupa URL valid, data URL, atau path ke file gambar" });
      }
    }

    // Check for duplicate names and slugs
    const finalSlug = slug.trim() || name.toLowerCase().replace(/\s+/g, "-");
    const existingCategory = categories.find(cat =>
      cat.name.toLowerCase() === name.trim().toLowerCase() ||
      cat.slug === finalSlug
    );
    
    if (existingCategory) {
      if (existingCategory.name.toLowerCase() === name.trim().toLowerCase()) {
        errors.push({ field: "Nama", message: "Nama kategori sudah ada" });
      }
      if (existingCategory.slug === finalSlug) {
        errors.push({ field: "Slug/ID", message: "Slug kategori sudah ada" });
      }
    }

    return errors;
  }

  async function add() {
    const errors = validateForm();
    
    if (errors.length > 0) {
      validation.showValidationErrors({
        title: "Form Tidak Valid",
        errors
      });
      return;
    }

    setIsLoading(true);
    try {
      const id = slug.trim() || name.toLowerCase().replace(/\s+/g, "-") || `cat-${Date.now()}`;
      const now = Date.now();
      const cat: Category = {
        id,
        name: name.trim(),
        slug: slug.trim() || id,
        thumbUrl,
        createdAt: now,
        updatedAt: now
      };
      await upsertCategory(cat);
      toast.success("Kategori ditambahkan", { title: "Sukses" });
      setName("");
      setSlug("");
      setThumbUrl("");
    } catch {
      toast.error("Gagal menambah kategori");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCategoryChange(categoryId: string, field: keyof Category, value: any) {
    setEditedCategories(prev => ({
      ...prev,
      [categoryId]: {
        ...categories.find(cat => cat.id === categoryId)!,
        ...prev[categoryId],
        [field]: value
      }
    }));
  }

  async function saveChanges() {
    setIsSaving(true);
    try {
      const promises = Object.entries(editedCategories).map(([id, category]) =>
        upsertCategory({ ...category, updatedAt: Date.now() })
      );
      await Promise.all(promises);
      setEditedCategories({});
      toast.success("Perubahan disimpan", { title: "Sukses" });
    } catch {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges = Object.keys(editedCategories).length > 0;

  return (
    <main id="content" role="main" className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Kelola Kategori</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        >
          Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm">Nama</label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kategori"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Slug / ID</label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-kategori"
          />
        </div>
        <IconUploader label="Icon" value={thumbUrl} onChange={setThumbUrl} />
      </div>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
        onClick={add}
        disabled={isLoading}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m15.84 12.16a4 4 0 1 1-7.68 0"></path>
          </svg>
        )}
        {isLoading ? "Menambahkan..." : "Tambah Kategori"}
      </button>

      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="font-semibold">Daftar Kategori</h2>
        {hasChanges && (
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
            onClick={saveChanges}
            disabled={isSaving}
          >
            {isSaving && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m15.84 12.16a4 4 0 1 1-7.68 0"></path>
              </svg>
            )}
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        )}
      </div>
      {/* Header labels */}
      <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
        <div className="w-12">Icon</div>
        <div className="flex-1">Nama</div>
        <div className="w-40">Slug/ID</div>
        <div className="w-20">Aksi</div>
      </div>
      
      <div className="space-y-3 mt-3">
        {categories.map((cat) => {
          const editedCat = editedCategories[cat.id] || cat;
          return (
            <div key={cat.id} className="flex items-center gap-3 p-3 card">
              <IconUploader
                compact
                label=""
                value={editedCat.thumbUrl || ""}
                onChange={(v) => handleCategoryChange(cat.id, 'thumbUrl', v)}
              />
              <input
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-1"
                value={editedCat.name}
                onChange={(e) => handleCategoryChange(cat.id, 'name', e.target.value)}
                placeholder="Nama kategori"
              />
              <input
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 w-40"
                value={editedCat.slug}
                onChange={(e) => handleCategoryChange(cat.id, 'slug', e.target.value)}
                placeholder="slug-kategori"
              />
              <button
                className="px-3 py-1.5 rounded-lg border border-red-300/50 text-red-600 hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                onClick={async () => {
                  const confirmed = await confirm.confirm({
                    title: "Hapus Kategori",
                    message: `Apakah Anda yakin ingin menghapus kategori "${cat.name}"? Semua komponen dalam kategori ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan.`,
                    confirmText: "Hapus",
                    cancelText: "Batal",
                    variant: "danger"
                  });
                  
                  if (confirmed) {
                    // Remove from edited categories if exists
                    setEditedCategories(prev => {
                      const newState = { ...prev };
                      delete newState[cat.id];
                      return newState;
                    });
                    await deleteCategory(cat.id);
                    toast.success("Kategori dihapus");
                  }
                }}
              >
                Hapus
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
