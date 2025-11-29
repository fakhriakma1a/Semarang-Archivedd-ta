# 🗺️ Semarang Archived

> Progressive Web App untuk mengarsipkan dan menemukan tempat-tempat menarik di Kota Semarang

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

![Semarang Archived Banner](public/BANNERSA.png)

---

## ✨ Features

### 📍 Place Management
- **Add & Edit** tempat favorit dengan detail lengkap
- **Categorize** tempat: Cafe, Restaurant, Mall, Historical Place
- **Search & Filter** cepat berdasarkan nama, alamat, atau kategori
- **Image Upload** untuk setiap tempat

### ⭐ Smart Features
- **Favorite System** - Tandai tempat favorit Anda
- **Visit Tracker** - Catat tempat yang sudah dikunjungi
- **Randomizer** - Bingung mau kemana? Biar kami pilihkan!
- **Statistics Dashboard** - Lihat summary aktivitas Anda

### 🎨 Modern UI/UX
- **Responsive Design** - Sempurna di mobile & desktop
- **Dark/Light Mode** - Sesuaikan dengan preferensi Anda
- **Smooth Animations** - Pengalaman yang menyenangkan
- **PWA Ready** - Install di home screen seperti native app

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/semarang-archived.git
cd semarang-archived

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan Supabase credentials Anda

# Run development server
npm run dev
```

Buka [http://localhost:8080](http://localhost:8080) di browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library

### State Management
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Storage for images
  - Row Level Security

### Architecture
- **Clean Architecture** - Separation of concerns
- **Service Layer** - Business logic
- **Custom Hooks** - Reusable logic
- **Type-safe API** - Auto-generated types

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # App layout
│   ├── NavLink.tsx     # Navigation component
│   └── PlaceCard.tsx   # Place card component
│
├── pages/              # Page components
│   ├── Home.tsx        # Dashboard & featured places
│   ├── Places.tsx      # All places with search/filter
│   ├── PlaceDetail.tsx # Place details & actions
│   ├── CreatePlace.tsx # Add new place form
│   ├── EditPlace.tsx   # Edit place form
│   ├── Randomizer.tsx  # Random place picker
│   └── Profile.tsx     # User statistics & settings
│
├── hooks/              # Custom React hooks
│   └── usePlaces.ts    # Place data management
│
├── services/           # Business logic layer
│   └── placeService.ts # Place CRUD operations
│
├── integrations/       # External services
│   └── supabase/       # Supabase client & types
│
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
│
└── types/              # TypeScript types
    └── place.ts        # Place type definitions
```

---

## 🎯 Core Features Explained

### 1. Place Management
Kelola tempat favorit dengan mudah:
- Tambah tempat baru dengan form lengkap
- Edit informasi kapan saja
- Hapus tempat yang tidak relevan
- Upload gambar untuk setiap tempat

### 2. Smart Search & Filter
Temukan tempat dengan cepat:
- Search by nama, alamat, atau deskripsi
- Filter by kategori (Cafe, Restaurant, Mall, Historical)
- Sort by rating, nama, atau status kunjungan

### 3. Randomizer
Tidak bisa memutuskan mau kemana?
- Pilih kategori yang Anda inginkan
- Klik "Randomize" untuk rekomendasi acak
- Lihat history random sebelumnya

### 4. Statistics Dashboard
Pantau aktivitas Anda:
- Total tempat tersimpan
- Jumlah tempat dikunjungi
- Tempat favorit
- Kategori terpopuler

---

## 🧩 Architecture

Project ini menggunakan **Clean Architecture** dengan 4 layer:

```
┌─────────────────────────────────────┐
│         UI Layer (Pages)            │
│     React Components & Routing      │
└──────────────┬──────────────────────┘
               │ uses
               ↓
┌─────────────────────────────────────┐
│     Hooks Layer (React Query)       │
│   Custom hooks + Cache management   │
└──────────────┬──────────────────────┘
               │ calls
               ↓
┌─────────────────────────────────────┐
│    Services Layer (Business Logic)  │
│   Pure functions + Error handling   │
└──────────────┬──────────────────────┘
               │ talks to
               ↓
┌─────────────────────────────────────┐
│       API Layer (Supabase)          │
│    Database + Storage + Auth        │
└─────────────────────────────────────┘
```

### Benefits
✅ **Separation of Concerns** - Setiap layer punya tanggung jawab jelas  
✅ **Testable** - Services dan hooks mudah di-test  
✅ **Maintainable** - Mudah untuk modify dan extend  
✅ **Type-safe** - TypeScript di semua layer  
✅ **Reusable** - Hooks bisa dipakai di berbagai komponen  

---

## 🎨 Screenshots

### Home Dashboard
Dashboard dengan featured places dan quick stats.

### Places List
Browse semua tempat dengan search dan filter.

### Place Detail
Lihat detail lengkap, tandai favorit, atau tandai sudah dikunjungi.

### Randomizer
Bingung mau kemana? Biar kami pilihkan secara random!

### Profile
Lihat statistik dan manage data Anda.

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

```sql
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC,
  image TEXT,
  opening_hours TEXT,
  ticket_price TEXT,
  facilities TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  visited BOOLEAN DEFAULT FALSE,
  visited_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📱 PWA Features

Project ini adalah **Progressive Web App** dengan fitur:

✅ **Installable** - Install di home screen HP/desktop  
✅ **Offline Ready** - Bekerja tanpa internet (cached assets)  
✅ **Auto Update** - Service worker otomatis update  
✅ **Fast Loading** - Cache strategy untuk performa optimal  
✅ **Responsive** - Perfect di semua device sizes  

### Install PWA

1. Buka app di Chrome/Edge
2. Klik icon install di address bar
3. Atau menu → "Install Semarang Archived"
4. App akan muncul di home screen

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Quality

- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting (via ESLint)
- **Clean Architecture** - Structured codebase

---


## 👨‍💻 Author

**Your Name**
- GitHub: [@fakhriakma1a](https://github.com/fakhriakma1a)
- Email: fakhriakmla@gmail.com

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.com/) - Backend platform
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

---

## 📚 Documentation

Dokumentasi lengkap tersedia di:
- [Architecture Guide](ARCHITECTURE_DIAGRAM.md) - Penjelasan arsitektur
- [Hooks Usage Guide](HOOKS_USAGE_GUIDE.md) - Cara menggunakan custom hooks
- [Refactoring Summary](REFACTORING_SUMMARY.md) - Detail refactoring ke Clean Architecture
- [Clean Architecture Principles](CLEAN_ARCHITECTURE_README.md) - Prinsip dan best practices

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made for Tugas Akhir Praktikum Pemrograman Perangkat Bergerak 2025

[Report Bug](https://github.com/yourusername/semarang-archived/issues) · [Request Feature](https://github.com/yourusername/semarang-archived/issues)

</div>
