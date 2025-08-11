import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] grid place-items-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow grid place-items-center">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </div>
        <div className="text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">404</span>
        </div>
        <h1 className="mt-2 text-xl md:text-2xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali ke Beranda
          </Link>
          <a
            href="/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Komponen
          </a>
        </div>
      </div>
    </main>
  );
}