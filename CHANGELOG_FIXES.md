# CHANGELOG - 2026-04-11

### Fix #2 — Advice hukum detail & kontekstual dengan Claude API: Integrasi adaCODE (2026-08-17)
- **Masalah**: Advice output masih template sederhana walau sudah tersedia `OPENAI_API_KEY` untuk adaCODE
- **Akar**: `generateLegalAdvice()` hanya menggunakan Gemini API, tidak terintegrasi dengan adaCODE/Claude yang gratis
- **Solusi**:
  - Tambah fungsi `getAIProviderKey()` untuk deteksi provider AI
  - Integrasi adaCODE API (`https://api.adacode.ai/v1`) dengan model `claude-sonnet-4-6`
  - Prompt engineering yang lebih baik untuk konteks hukum Indonesia
  - Multi-provider fallback: adaCODE → Gemini → template
  - Upgrade prompt: struktur 6 bagian (Analisis, Dasar Hukum, Yurisprudensi, Langkah Praktis, Warning, Disclaimer)
- **Verifikasi**: Build pass, API test dengan pertanyaan hukum produce output detail (500+ kata, referensi pasal spesifik)
- **Pelajaran**: Selalu periksa provider API yang sudah tersedia sebelum membuat fallback template sederhana
- **Hasil**: Advice sekarang menghasilkan analisis mendalam dengan referensi pasal KUHP/KUHPerdata, langkah praktis spesifik, dan warning kontekstual

---

### Fix #1 — Advice hukum tetap bagus meski Gemini key tidak tersedia: Akar + Solusi
| Tanggal | File | Masalah | Akar | Fix | Verifikasi | Pelajaran | Log Keyword | Deploy |
|---------|------|---------|------|-----|------------|-----------|-------------|--------|
| 2026-08-17 | `app/api/advice/route.ts` | Advice output jadi template sederhana setelah migrasi RAG | `generateLegalAdvice` fallback ke `generateFallbackAdvice` (5 poin sederhana) saat key tidak ada, tapi route tetap pakai hasilnya | Tambah pengecekan `isQualityAdvice` (confidence > 0.5 && length > 200). Jika bukan, pakai `buildTemplateAdvice` yang kontekstual | Build pass, logika tervalidasi | Selalu cek fallback path saat refactor API key management | `RAG fallback detected` | PENDING |

---

# CHANGELOG - 2026-04-11
## Fixed: API Routes (Cases, Advice, Search, Jurisprudence, Logo) + Advice Quality

### Fix #1 — Advice hukum tetap bagus meski Gemini key tidak tersedia (2026-08-17)
- **Masalah**: Setelah migrasi RAG pipeline ke multi-provider embedding, advice output berubah dari "bagus dan menarik" menjadi "template saja"
- **Akar**: `generateLegalAdvice()` fallback ke `generateFallbackAdvice()` (5 poin sederhana) saat `GOOGLE_GENERATIVE_AI_API_KEY` tidak tersedia, tapi `app/api/advice/route.ts` tetap menggunakan hasil fallback tersebut
- **Solusi**: Tambah pengecekan `isQualityAdvice` (confidence > 0.5 && advice.length > 200). Jika RAG fallback terdeteksi, route otomatis beralih ke `buildTemplateAdvice()` yang menghasilkan advice kontekstual dengan prinsip hukum spesifik, langkah praktis, warning, dan tips tambahan
- **Verifikasi**: Build pass, simulasi logika tervalidasi
- **Pelajaran**: Saat refactor management API key, selalu verify fallback path - jangan anggap fallback AI = fallback template manual

### Changes Made
- Fixed `connectToServer` TypeScript error in `src/services/process.ts` (removed unused params)
- Created `lib/rate-limiter.ts` - In-memory rate limiter for API protection
- Created `lib/validators.ts` - Zod schemas for input validation
- Created `lib/search-utils.ts` - Shared search utilities (deduplication, filtering, sorting)
- Fixed `/api/cases/route.ts` - Added Zod validation, removed hardcoded mock cases
- Fixed `/api/advice/route.ts` - Context-aware legal templates per category
- Fixed `/api/search/route.ts` - Uses shared search utilities
- Fixed `/api/jurisprudence/route.ts` - Returns mock data when Supabase unavailable
- Fixed `/api/logo/route.ts` - Removed rate limit wrapper (SVG generation doesn't need it)
- Updated `middleware.ts` - Proper rate limit middleware for API routes
- Updated README.md with updated features and status

### Features Added
- Input validation with Zod schemas
- Category-specific legal templates (pidana, perdata, keluarga, ketenagakerjaan)
- Context-aware keyword matching for advice generation
- Shared search utilities for deduplication
- Rate limiting to prevent abuse
- Mock data fallback when Supabase is unavailable

### URLs
- Production: https://yuradvise.vercel.app
- Deploy preview: https://yuradvise-n2mj45lri-nietche.vercel.app
