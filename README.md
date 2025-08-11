# UI Components Playground (with Firestore Seeder)

Playground UI components untuk **Native CSS**, **Bootstrap 5**, dan **Tailwind CSS** — Next.js 14 + TS + Tailwind + Zustand + Monaco. **Tanpa Firebase Storage**.

## Jalankan Cepat (tanpa Firestore)
```
npm install
npm run dev
# http://localhost:3000
```

## Pakai Firestore + Seed
1) Buat Web App di Firebase → isi `.env.local` dari `.env.example`.
2) Buat Service Account (Admin SDK) → download JSON → simpan ke `scripts/serviceAccountKey.json`.
3) Seed Firestore:
```
npm run seed:firestore
```
Ini mengisi koleksi `categories` & `components` dengan data contoh.
4) Jalankan app:
```
npm run dev
```

> Semua thumbnail ada di `public/thumbs`. **Jangan gunakan Firebase Storage**.

Rute: `/` (grid + filter + sidebar + FAB), `/component/[id]` (preview + editor), `/new` (buat komponen).
