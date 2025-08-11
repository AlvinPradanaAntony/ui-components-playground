# UI Components Playground (2025 Redesign)

Modern playground untuk **Native CSS**, **Bootstrap 5**, dan **Tailwind CSS** dengan desain profesional 2025 — Next.js 14 + TS + Tailwind + Zustand + Monaco + Framer Motion.

## ✨ Fitur Baru (2025 Redesign)

### 🎨 Design System Modern
- **HSL-based color tokens** dengan dark mode yang smooth
- **Micro-interactions** dan animasi halus menggunakan Framer Motion
- **Glassmorphism effects** dengan backdrop blur
- **Soft shadows** dan border radius yang konsisten
- **Typography scale** dengan Inter font dan font feature settings

### 🚀 UX Improvements
- **Toast notifications** menggantikan alert() native
- **Modal confirmations** untuk delete actions
- **Skeleton loaders** untuk perceived performance
- **Search functionality** dengan real-time filtering
- **Quick category chips** untuk mobile
- **Featured components rail** untuk trending items

### ♿ Accessibility
- **Skip to content** link
- **Focus-visible** rings pada semua interactive elements
- **Semantic HTML** dengan proper landmarks (header, aside, main)
- **ARIA labels** dan roles yang tepat
- **Keyboard navigation** support

### 📱 Responsive Design
- **Mobile-first** approach dengan breakpoint yang optimal
- **Sticky navigation** dengan proper z-index layering
- **Adaptive layouts** untuk desktop, tablet, dan mobile
- **Touch-friendly** interactions

## Jalankan Cepat (tanpa Firestore)
```bash
npm install
npm run dev
# http://localhost:3000
```

## Pakai Firestore + Seed
1) Buat Web App di Firebase → isi `.env.local` dari `.env.example`.
2) Buat Service Account (Admin SDK) → download JSON → simpan ke `scripts/serviceAccountKey.json`.
3) Seed Firestore:
```bash
npm run seed:firestore
```
Ini mengisi koleksi `categories` & `components` dengan data contoh.
4) Jalankan app:
```bash
npm run dev
```

> Semua thumbnail ada di `public/thumbs`. **Jangan gunakan Firebase Storage**.

## 🏗️ Struktur Komponen

### Core UI Components
- `components/ui/Toast.tsx` - Toast notification system
- `components/ui/ThemeToggle.tsx` - Dark/light mode toggle
- `components/ui/ConfirmDialog.tsx` - Modal confirmation dialogs

### Layout Components
- `components/Topbar.tsx` - Global navigation dengan search
- `components/LeftSidebar.tsx` - Category navigation
- `components/RightSidebar.tsx` - Code editor panel

### Feature Components
- `components/ComponentGrid.tsx` - Main component grid dengan search & filters
- `components/FeaturedRail.tsx` - Horizontal scroll untuk trending components
- `components/QuickCategories.tsx` - Mobile category chips
- `components/PreviewIframe.tsx` - Component preview dengan skeleton loading

## 🎯 Rute Aplikasi
- `/` - Landing page dengan grid, filters, search, dan trending rail
- `/component/[id]` - Detail component dengan preview dan editor
- `/new` - Form untuk membuat component baru
- `/categories` - Management halaman untuk categories
- `/404` - Custom 404 page dengan design yang konsisten

## 🎨 Customization

### Design Tokens
Edit `app/globals.css` untuk mengubah:
- Color palette (HSL values)
- Typography scale
- Shadow definitions
- Border radius values

### Tailwind Configuration
Edit `tailwind.config.ts` untuk:
- Extend color palette
- Add custom animations
- Modify breakpoints
- Add utility classes

### Theme System
- Automatic dark mode detection
- Persistent theme preference
- FOUC prevention dengan inline script
- Smooth transitions antar themes

## 🔧 Tech Stack
- **Next.js 14** - App Router dengan Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling dengan custom design system
- **Framer Motion** - Smooth animations dan micro-interactions
- **Zustand** - Lightweight state management
- **Monaco Editor** - Code editing dengan syntax highlighting
- **Firebase Firestore** - Database (optional)

## 📝 Development Notes
- Semua native `alert()` dan `confirm()` telah diganti dengan custom UI
- Focus management untuk accessibility
- Proper error boundaries dan loading states
- Optimized bundle dengan dynamic imports
- SEO-friendly dengan proper meta tags
