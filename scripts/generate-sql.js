const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/jurisprudence_sample.json', 'utf8'));

console.log('Total records to import:', data.length);

let sql = '-- Import jurisprudence data to Supabase\n';
sql += '-- Run in Supabase SQL Editor\n\n';
sql += 'INSERT INTO jurisprudence (case_number, court, date, summary, keywords, source_url, scraped_at)\nVALUES\n';

const rows = data.map(r => {
  const caseNum = r.case_number.replace(/'/g, "''");
  const court = r.court.replace(/'/g, "''");
  const summary = r.summary.replace(/'/g, "''");
  const keywords = r.keywords.map(k => `'${k.replace(/'/g, "''")}'`).join(', ');
  const sourceUrl = r.source_url.replace(/'/g, "''");
  return `  ('${caseNum}', '${court}', '${r.date}', '${summary}', ARRAY[${keywords}], '${sourceUrl}', NOW())`;
});

sql += rows.join(',\n');
sql += ';\n\n';
sql += '-- Verify import\n';
sql += 'SELECT count(*) as total_records FROM jurisprudence;';

fs.writeFileSync('scripts/import-full.sql', sql);
console.log('✅ SQL file created: scripts/import-full.sql');
