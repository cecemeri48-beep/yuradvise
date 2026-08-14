# YurAdvise Audit Report
**Date:** 2026-08-14
**Deployment:** https://yuradvise.vercel.app

## Bugs Found and Fixed

### 1. CRITICAL: Advice API Returns Wrong Data Type
**File:** `app/api/advice/route.ts:46`
**Problem:** Returns entire advice row object `{ advice: adviceData }` instead of just the text string
**Fix:** Changed to `{ advice: adviceData.advice_text }`
**Test:** ✅ POST /api/advice returns string advice correctly

### 2. CRITICAL: Search API References Non-Existent Column
**File:** `app/api/search/route.ts:24`
**Problem:** Query used `.eq('category', category)` on a column that doesn't exist in the jurisprudence table
**Fix:** Removed direct column filter; implemented client-side keyword matching against category keyword mapping
**Test:** ✅ Category filters work (pidana: 10 results, perdata: 10 results, keluarga: 6 results)

### 3. HIGH: Missing Supabase Environment Variables
**File:** `.env.local`
**Problem:** Only had VERCEL_OIDC_TOKEN, missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY
**Fix:** Pulled production env vars using `vercel env pull`
**Status:** Environment variables now present for local testing

### 4. MEDIUM: Viewport Warning in All Pages
**File:** `app/layout.tsx`
**Problem:** Viewport configured inside metadata export causes Next.js warnings on all pages
**Fix:** Moved viewport to separate `export const viewport` alongside metadata
**Test:** ✅ No more viewport warnings in build output

## Test Results

| Endpoint | Method | Status | Result |
|----------|--------|--------|--------|
| /api/jurisprudence | GET | ✅ 200 | Returns 10 cases from Supabase |
| /api/search | GET | ✅ 200 | Returns filtered results |
| /api/search?q=penganiayaan | GET | ✅ 200 | Returns 4 matching cases |
| /api/search?category=pidana | GET | ✅ 200 | Returns 10 criminal cases |
| /api/search?category=perdata | GET | ✅ 200 | Returns 10 civil cases |
| /api/search?category=keluarga | GET | ✅ 200 | Returns 6 family cases |
| /api/advice | POST | ✅ 200 | Returns advice text string |
| /api/cases | POST | ✅ 200 | Returns caseId and queryId UUIDs |
| / (homepage) | GET | ✅ 200 | Static page renders |
| /mulai | GET | ✅ 200 | Consultation form page |
| /yurisprudensi | GET | ✅ 200 | Jurisprudence search page |
| /tentang | GET | ✅ 200 | About page |
| /kontak | GET | ✅ 200 | Contact page |

## Database Notes

The Supabase database has RLS enabled with permissive policies allowing all operations. The jurisprudence table contains 20 records seeded from MIGRATION.sql. The advice, cases, and queries tables are empty (RLS policies were blocking inserts previously).

### SQL to Run in Supabase Dashboard (if needed):
```sql
-- Disable RLS temporarily
ALTER TABLE advice DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE queries DISABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "allow_all_advice" ON advice FOR ALL USING (true);
CREATE POLICY "allow_all_cases" ON cases FOR ALL USING (true);
CREATE POLICY "allow_all_queries" ON queries FOR ALL USING (true);

-- Re-enable RLS
ALTER TABLE advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
```

## Deployment
- **Production URL:** https://yuradvise.vercel.app
- **Latest Deployment:** https://yuradvise-1el18x1zm-nietche.vercel.app
- **Build Status:** ✅ Clean (no errors)
- **TypeScript:** ✅ Passes
- **Pages Generated:** 9 static + 4 dynamic API routes

## Files Modified
1. `app/api/advice/route.ts` - Fixed return type, added error handling
2. `app/api/search/route.ts` - Rewrote category filtering logic
3. `app/layout.tsx` - Moved viewport to separate export
4. `.env.local` - Pulled production environment variables
