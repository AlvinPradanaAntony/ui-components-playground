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

  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > maxSize) {
        reject(new Error(`File terlalu besar (> ${Math.round(maxSize / 1024)}KB)`));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  }, [maxSize]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;
    
    try {
      const dataUrl = await readFile(file);
      onChange(dataUrl);
    } catch (error) {
      alert((error as Error).message || "Upload gagal");
    }
  }, [onChange, readFile]);

  const handleDragEvent = useCallback((e: React.DragEvent, isDragOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(isDragOver);
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    handleDragEvent(e, false);
    
    const { dataTransfer } = e;
    if (!dataTransfer) return;

    // Handle file drops
    if (dataTransfer.files?.length) {
      await handleFiles(dataTransfer.files);
      return;
    }

    // Handle URL drops
    const urlItem = Array.from(dataTransfer.items).find(
      item => item.kind === "string" && item.type === "text/uri-list"
    );
    
    if (urlItem) {
      urlItem.getAsString(url => onChange(url.trim()));
    }
  }, [handleFiles, onChange, handleDragEvent]);

  const triggerPick = useCallback(() => inputRef.current?.click(), []);

  const dropZoneClasses = `relative border rounded-xl bg-white/50 dark:bg-gray-900/50 flex items-center justify-center text-center ${
    compact ? "h-12 w-20" : "h-28 w-full"
  } ${dragOver ? "border-blue-500 ring-2 ring-blue-400" : "border-dashed"}`;

  const imageClasses = `object-contain ${compact ? "h-10 w-16" : "h-24 w-auto"} ${previewClassName || ""}`;

  return (
    <div className={className}>
      {label && <label className="text-sm mb-1 block">{label}</label>}
      <div
        onDragOver={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDrop={onDrop}
        className={dropZoneClasses}
      >
        {value ? (
          <>
            <img src={value} alt="icon" className={imageClasses} />
            <div className="absolute top-1 right-1 flex gap-1">
              {[
                { label: "Hapus", onClick: () => onChange("") },
                { label: "Ganti", onClick: triggerPick }
              ].map(({ label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="px-2 py-0.5 text-xs rounded-lg border bg-white/80 backdrop-blur hover:bg-white/90 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button type="button" onClick={triggerPick} className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
            <div className="font-medium">Drag & drop icon di sini</div>
            <div>atau klik untuk pilih file (SVG/PNG/JPG)</div>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
