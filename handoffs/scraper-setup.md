# Jurisprudence Scraper Setup
Status: BERJALAN · Service: data/pipeline · Diperbarui: 2026-08-17 02:00

## Sedang dikerjakan
Scraper untuk mengambil data dari putusan3.mahkamahagung.go.id

## Status terakhir
- ✅ Playwright terinstall
- ✅ Scraper script dibuat: `scripts/scraper-putusan.ts`
- ✅ Seed script dibuat: `scripts/seed-jurisprudence.js`
- ✅ 58 sample records dibuat (pidana, perdata, keluarga, ketenagakerjaan)
- ✅ Import script dibuat: `scripts/import-jurisprudence.js`
- ⏳ Belum di-import ke Supabase (butuh credentials)
- ⏳ Belum di-generate embeddings

## Keputusan penting
1. **robots.txt**: Izin hanya untuk `search` dan `use=reference`, TIDAK BOLEH untuk `ai-train`
2. **Solusi**: Gunakan data sebagai fallback keyword search, bukan untuk training AI
3. **Ketersediaan**: scraping manual jika ingin menambah data lebih banyak

## Langkah berikutnya
1. Setup Supabase credentials di `.env.local`
2. Jalankan `npm run import` untuk import data
3. Jalankan `npm run generate-embeddings` untuk buat vector embeddings
4. Jalankan `npm run scraper` untuk tambahan data (butuh browser)

## Jangan lakukan (jebakan)
- JANGAN gunakan data untuk training AI model (melanggar robots.txt)
- JANGAN scrape terlalu sering (respect delay 2 detik)
- Jangan lupa update embeddings setelah menambah data baru

## Related
- [[Fix #2]] - Claude API integration untuk advice generation
- CHANGELOG_FIXES.md - Fix #2 documentation
