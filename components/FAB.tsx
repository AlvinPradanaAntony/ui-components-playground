"use client";
import { useRouter } from "next/navigation";

export default function FAB() {
  const router = useRouter();
  return (
    <button
      type="button"
      title="Buat Komponen Baru"
      aria-label="Buat Komponen Baru"
      onClick={() => router.push("/new")}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-brand-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 grid place-items-center shadow-elevated hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 transition"
    >
      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}
