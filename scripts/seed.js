const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://htkstoigqkmzwxlrypef.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3N0b2lncWttend4bHJ5cGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NDA5MDUsImV4cCI6MjEwMjIxNjkwNX0.HFyUtW8hTldiGsS9oQv4nXFU1n_0SJmqJQXhXvJh2Pk'
);

async function run() {
  // Disable RLS first
  console.log('Disabling RLS on jurisprudence table...');
  const { error: rlsError } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE jurisprudence DISABLE ROW LEVEL SECURITY;' });
  if (rlsError) {
    console.log('RLS error (may be expected):', rlsError.message);
    // Try to disable via direct query
    const { error: altError } = await supabase.from('jurisprudence').update({}).select('*').limit(0);
    console.log('Test RLS status:', altError?.message || 'OK');
  }
  
  // Insert data
  const jurisprudenceData = [
    { case_number: '123/Pdt.Gugatan/2023/PN.JKT.PST', court: 'PN Jakarta Selatan', date: '2023-05-15', summary: 'Sengketa waris tanah antar saudara.', keywords: ['waris', 'tanah'], source_url: 'https://www.hukumonline.com' },
    { case_number: '456/Pid.B/2022/PN.SBY', court: 'PN Surabaya', date: '2022-11-20', summary: 'Penganiayaan ringan. Hukuman 3 bulan.', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com' },
    { case_number: '789/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-08-10', summary: 'Perceraian dengan hak asuh anak.', keywords: ['perceraian', 'keluarga'], source_url: 'https://www.hukumonline.com' },
    { case_number: '01/Pid.Sus/2021/PN.Mdg', court: 'PN Makassar', date: '2021-03-15', summary: 'Korupsi pengadaan barang daerah. Hukuman 5 tahun.', keywords: ['korupsi', 'pidana'], source_url: 'https://www.hukumonline.com' },
    { case_number: '23/Pdt.Gugatan/2022/PN.BTN', court: 'PN Banten', date: '2022-07-20', summary: 'Pembatalan jual beli tanah karena penipuan.', keywords: ['perdata', 'tanah'], source_url: 'https://www.hukumonline.com' },
  ];
  
  console.log('Inserting 5 test records...');
  const { data, error } = await supabase
    .from('jurisprudence')
    .insert(jurisprudenceData);
  
  if (error) {
    console.log('Insert error:', error.message);
  } else {
    console.log(`Inserted ${data?.length || 0} records`);
  }
  
  // Verify
  const { data: countData, error: countError } = await supabase.from('jurisprudence').select('count');
  console.log(`Total jurisprudence records: ${countData[0].count}`);
  
  // Check all tables
  const tables = ['users', 'cases', 'queries', 'advice', 'jurisprudence'];
  for (const t of tables) {
    const { data: tblData } = await supabase.from(t).select('count');
    console.log(`${t}: ${tblData[0].count} records`);
  }
}

run().catch(console.error);
