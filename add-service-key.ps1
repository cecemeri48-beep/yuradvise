# Script to add Supabase service role key to Vercel
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3N0b2lncWttend4bHJ5cGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY0MDkwNSwiZXhwIjoyMTAyMjE2OTA1fQ.ksZwtB6cS5y2dCAeZHbWAtb5NCTqw2g5aLUzfarI1sU"

Write-Host "Adding SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
echo $serviceKey | vercel env add SUPABASE_SERVICE_ROLE_KEY production 2>&1

Write-Host "`nListing all env vars..." -ForegroundColor Cyan
vercel env ls 2>&1

Write-Host "`nRunning deployment..." -ForegroundColor Cyan
vercel --prod --yes 2>&1
