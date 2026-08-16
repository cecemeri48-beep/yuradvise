-- Delete old hukumonline data
-- Run this in Supabase SQL Editor with service role permissions

-- Step 1: Disable RLS temporarily (run as service role)
ALTER TABLE jurisprudence DISABLE ROW LEVEL SECURITY;

-- Step 2: Delete all records from hukumonline
DELETE FROM jurisprudence
WHERE source_url = 'https://www.hukumonline.com';

-- Step 3: Re-enable RLS
ALTER TABLE jurisprudence ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify
SELECT
  source_url,
  count(*) as record_count
FROM jurisprudence
GROUP BY source_url
ORDER BY record_count DESC;

-- Expected result:
-- source_url                              | record_count
-- ---------------------------------------|-------------
-- https://putusan3.mahkamahagung.go.id/  | 240
