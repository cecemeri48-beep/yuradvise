# YurAdvise — Deployment Guide

## 1. GitHub Setup

```bash
# Buat repository baru di GitHub
gh repo create yuradvise --public
cd yuradvise
git remote add origin https://github.com/username/yuradvise.git
git push -u origin master
```

## 2. Supabase Setup

1. Buka [supabase.com](https://supabase.com) → New Project
2. Pilih region **Asia (Jakarta)** untuk latency terbaik
3. Copy **Project URL** dan **API Keys**
4. Jalankan migration:
   - Buka SQL Editor di Supabase Dashboard
   - Copy paste isi `database/migrations/001_create_tables.sql`
   - Run
5. Seed data (opsional, bisa lewat script Python):
   ```bash
   python backend/seed_loader.py
   ```

## 3. Vercel Deployment

1. Buka [vercel.com](https://vercel.com)
2. Import repository GitHub: `yuradvise`
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → dari Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → dari Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` → dari Supabase
   - `OPENAI_API_KEY` → dari OpenAI (untuk embedding)
4. Deploy!

## 4. Custom Domain (Opsional)

Beli domain `.id` atau `.com` dan connect ke Vercel.

---

## Cost Estimate (Free Tier)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | Unlimited requests | 100GB bandwidth |
| Supabase | 500MB DB | 2 concurrent connections |
| OpenAI | $5 credit | 100k tokens embedding |

**Total: ~Rp0/bulan** untuk MVP awal!
