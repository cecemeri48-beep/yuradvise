# YurAdvise — Asisten Hukum Gratis untuk Warga Kecil

> Aplikasi web hukum AI-powered untuk membantu warga Indonesia mengakses bantuan hukum dasar secara gratis.

## 🚀 Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | Free, Vercel hosting gratis, SSR/CSR |
| **Backend** | Next.js API Routes + LangChain | Tanpa server tambahan, gratis di Vercel |
| **Database** | Supabase (PostgreSQL) | Free tier 500MB, built-in auth, real-time |
| **AI/RAG** | OpenAI API (embedding) + pgvector | Semantic search yurisprudensi |
| **Hosting** | Vercel | Free tier generous, auto HTTPS |
| **Auth** | Supabase Auth | Free, email/password + social login |

## 📦 Setup Lokal

### 1. Clone & Install
```bash
git clone https://github.com/username/yuradvise.git
cd yuradvise
npm install
```

### 2. Supabase Setup
1. Buat project di [supabase.com](https://supabase.com)
2. Copy **Project URL** dan **anon key**
3. Jalankan migration SQL:
```bash
psql <DATABASE_URL> -f database/migrations/001_create_tables.sql
```
4. Insert seed data:
```bash
python backend/seed_loader.py
```

### 3. Environment Variables
```bash
cp .env.example .env.local
# Isi dengan kredensial dari Supabase & OpenAI
```

### 4. Run Development
```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Struktur Project

```
yuradvise/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── case/              # Halaman kasus
│   ├── advice/            # Halaman advice
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities & clients
│   ├── supabase/
│   └── rag/
├── backend/               # Python scripts (scraper, seed)
├── database/              # SQL migrations
├── seed_data/             # JSON seed data
└── scraper/               # Web scraper
```

## 🛠️ Milestones

| # | Task | Status |
|---|------|--------|
| 1 | GitHub + Vercel deploy | ✅ Done |
| 2 | Supabase schema & seed data | ✅ Done |
| 3 | Next.js frontend + Tailwind | 🔄 In Progress |
| 4 | API routes (create case, query, advice) | ⏳ Pending |
| 5 | RAG pipeline (semantic search) | ⏳ Pending |
| 6 | Voice input (Web Speech API) | ⏳ Pending |
| 7 | TTS output (browser native) | ⏳ Pending |
| 8 | Deploy to Vercel | ⏳ Pending |

## 📝 Disclaimer

Aplikasi ini adalah **prototype/seed data** untuk edukasi. Output AI berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional.

---
*Dibuat dengan ❤️ untuk rakyat kecil Indonesia*
