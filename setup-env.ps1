# Script to add Supabase env vars to Vercel
$project = "nietche/yuradvise"
$url = "https://htkstoigqkmzwxlrypef.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3N0b2lncWttend4bHJ5cGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NDA5MDUsImV4cCI6MjEwMjIxNjkwNX0.HFyUtW8hTldiGsS9oQv4nXFU1n_0SJmqJQXhXvJh2Pk"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3N0b2lncWttend4bHJ5cGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY0MDkwNSwiZXhwIjoyMTAyMjE2OTA1fQ.ksZwtB6cS5y2dCAeZHbWAtb5NCTqw2g5aLUzfarI1sU"

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Cyan

# Add NEXT_PUBLIC_SUPABASE_URL
Write-Host "Adding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
echo $url | vercel env add NEXT_PUBLIC_SUPABASE_URL production --project $project 2>&1

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY
Write-Host "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
echo $anonKey | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --project $project 2>&1

# Add SUPABASE_SERVICE_ROLE_KEY
Write-Host "Adding SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
echo $serviceKey | vercel env add SUPABASE_SERVICE_ROLE_KEY production --project $project 2>&1

Write-Host "`nAll environment variables added!" -ForegroundColor Green
Write-Host "Listing current env vars..." -ForegroundColor Cyan
vercel env ls --project $project 2>&1

Write-Host "`nRunning final deployment..." -ForegroundColor Cyan
vercel --prod --yes --project $project 2>&1
