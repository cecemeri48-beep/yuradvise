# CHANGELOG - 2026-04-11
## Fixed: API Routes (Cases, Advice, Search, Jurisprudence, Logo)

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
