"use client";
import { useCallback, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";

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
  const toast = useToast();
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
      toast.error((error as Error).message || "Upload gagal");
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
                {
                  label: "Hapus",
                  onClick: () => onChange(""),
                  icon: (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )
                },
                {
                  label: "Ganti",
                  onClick: triggerPick,
                  icon: (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )
                }
              ].map(({ label, onClick, icon }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={`px-2 py-0.5 text-xs rounded-lg border backdrop-blur transition-colors ${
                    label === "Hapus"
                      ? "bg-red-50/90 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100/90 dark:hover:bg-red-900/70"
                      : "bg-blue-50/90 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100/90 dark:hover:bg-blue-900/70"
                  }`}
                  title={label}
                >
                  {compact ? icon : label}
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
