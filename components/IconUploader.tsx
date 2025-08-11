"use client";
import { useCallback, useRef, useState } from "react";

type Props = {
  label?: string;
  value?: string;
  onChange: (val: string) => void;
  accept?: string;
  maxSize?: number; // bytes
  className?: string;
  previewClassName?: string;
  compact?: boolean; // smaller UI for table rows
};

export default function IconUploader({
  label = "Icon",
  value,
  onChange,
  accept = "image/*,.svg,.svgz",
  maxSize = 1024 * 1024, // 1MB
  className,
  previewClassName,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const readFile = useCallback(
    (file: File) =>
      new Promise<string>((resolve, reject) => {
        if (file.size > maxSize) return reject(new Error(`File terlalu besar (> ${(maxSize / 1024).toFixed(0)}KB)`));
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Gagal membaca file"));
        reader.readAsDataURL(file);
      }),
    [maxSize]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = (files as FileList)[0] || (files as File[])[0];
      if (!file) return;
      try {
        const dataUrl = await readFile(file);
        onChange(dataUrl);
      } catch (e: any) {
        alert(e?.message || "Upload gagal");
      }
    },
    [onChange, readFile]
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const dt = e.dataTransfer;
      if (!dt) return;
      if (dt.files && dt.files.length) {
        return handleFiles(dt.files);
      }
      // If a URL was dropped
      for (const item of Array.from(dt.items)) {
        if (item.kind === "string" && item.type === "text/uri-list") {
          item.getAsString((s) => onChange(s.trim()));
          return;
        }
      }
    },
    [handleFiles, onChange]
  );

  const triggerPick = useCallback(() => inputRef.current?.click(), []);

  return (
    <div className={className}>
      {label && <label className="text-sm mb-1 block">{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={"relative border rounded-xl bg-white/50 dark:bg-gray-900/50 flex items-center justify-center text-center " + (compact ? "h-12 w-20" : "h-28 w-full") + (" " + (dragOver ? "border-blue-500 ring-2 ring-blue-400" : "border-dashed"))}
      >
        {value ? (
          <>
            <img src={value} alt="icon" className={"object-contain " + (compact ? "h-10 w-16" : "h-24 w-auto") + (previewClassName ? " " + previewClassName : "")} />
            <div className="absolute top-1 right-1 flex gap-1">
              <button onClick={() => onChange("")} className="px-2 py-0.5 text-xs rounded-lg border bg-white/80 backdrop-blur">
                Hapus
              </button>
              <button onClick={triggerPick} className="px-2 py-0.5 text-xs rounded-lg border bg-white/80 backdrop-blur">
                Ganti
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={triggerPick} className="text-xs text-gray-600">
            <div className="font-medium">Drag & drop icon di sini</div>
            <div>atau klik untuk pilih file (SVG/PNG/JPG)</div>
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>
    </div>
  );
}
