/**
 * Import jurisprudence data to Supabase
 * Run: npm run import-jurisprudence
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log('📥 Importing Jurisprudence Data to Supabase');
  console.log('='.repeat(50));

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.log('Add these to .env.local:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL=your-url');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=your-key');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Load data
  const dataPath = path.join(__dirname, '../data/jurisprudence_sample.json');
  let data = [];

  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📊 Loaded ${data.length} records from ${dataPath}`);
  } else {
    console.error('❌ Data file not found:', dataPath);
    process.exit(1);
  }

  // Check existing records
  const { data: existing, error: checkError } = await supabase
    .from('jurisprudence')
    .select('case_number');

  if (checkError) {
    console.error('❌ Error checking existing data:', checkError.message);
    process.exit(1);
  }

  const existingCases = new Set(existing.map(r => r.case_number));
  const newRecords = data.filter(r => !existingCases.has(r.case_number));

  console.log(`📋 Existing in DB: ${existing.length}`);
  console.log(`📝 New records to import: ${newRecords.length}`);

  if (newRecords.length === 0) {
    console.log('✅ All records already exist. Nothing to import.');
    return;
  }

  // Import in batches
  const batchSize = 10;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);

    const { data: inserted, error } = await supabase
      .from('jurisprudence')
      .insert(batch.map(r => ({
        case_number: r.case_number,
        court: r.court,
        date: r.date,
        summary: r.summary,
        keywords: r.keywords,
        source_url: r.source_url,
        category: r.category,
      })));

    if (error) {
      console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      errors += batch.length;
    } else {
      imported += batch.length;
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(newRecords.length/batchSize)} imported (${imported}/${newRecords.length})`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total in DB: ${existing.length + imported}`);

  // Check if we need to regenerate embeddings
  const { count } = await supabase
    .from('jurisprudence')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Total jurisprudence records: ${count}`);

  if (count > 0) {
    console.log('\n🔄 Next: Run embeddings generation');
    console.log('   npm run generate-embeddings');
  }
}

main().catch(console.error);
