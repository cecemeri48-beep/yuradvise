/**
 * Seed script to populate jurisprudence table with initial data
 * Can be run after scraping or with manual data
 */

const fs = require('fs');
const path = require('path');

// Sample jurisprudence data (can be replaced with scraped data)
const SAMPLE_DATA = [
  {
    case_number: "35/Pid.Sus/2023/PN.JKT.PUS",
    court: "Pengadilan Negeri Jakarta Pusat",
    date: "2023-08-15",
    summary: "Terdakwa dinyatakan bersalah melakukan tindak pidana pencurian dengan pemberatan sebagaimana diatur dalam Pasal 363 KUHP. Pengadilan mempertimbangkan bahwa terdakwa merupakan pengulang kejahatan dan menggunakan alat untuk membuka kunci mobil korban. Terdakwa dihukum penjara 3 tahun dan denda Rp 5.000.000 subsider 3 bulan kurungan.",
    keywords: ["pencurian", "mobil", "KUHP Pasal 363", "pemberatan"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "pidana",
    embedding: null,
  },
  {
    case_number: "12/Pdt.Gugatan/2023/PN.SMG",
    court: "Pengadilan Negeri Semarang",
    date: "2023-06-20",
    summary: "Gugatan wanprestasi terhadap perjanjian kredit mobil. Pengadilan memvonis tergugatan (perusahaan leasing) kalah dan wajib mengembalikan uang muka yang sudah dibayar sebesar Rp 25.000.000. Pengadilan menyatakan bahwa tergugatan telah melakukan wanprestasi dengan menyita kendaraan tanpa prosedur yang sah sesuai Pasal 1243 KUHPerdata.",
    keywords: ["wanprestasi", "kredit mobil", "leasing", "KUHPerdata Pasal 1243", "sita kendaraan"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "perdata",
    embedding: null,
  },
  {
    case_number: "01/Penung/2023/PA.JKT",
    court: "Pengadilan Agama Jakarta",
    date: "2023-07-10",
    summary: "Pengadilan mengabulkan gugatan cerai talak yang diajukan oleh suami. Putusan menyatakan bahwa hubungan suami istri sudah tidak dapat dipertahankan lagi berdasarkan Pasal 39 UU No. 1/1974. Hak asuh anak ditetapkan kepada ibu karena anak masih di bawah 5 tahun sesuai Pasal 93 KHI. Suami diwajibkan membayar nafkah anak Rp 2.000.000 per bulan.",
    keywords: ["cerai talak", "hak asuh anak", "KHI Pasal 93", "UU Perkawinan", "nafkah anak"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "keluarga",
    embedding: null,
  },
  {
    case_number: "1/P.Nispi/2023/PHI.JKT",
    court: "Pengadilan Hubungan Industrial Jakarta",
    date: "2023-09-05",
    summary: "Pengadilan mengabulkan gugatan pekerja atas pemutusan hubungan kerja yang tidak sah. Pengadilan memvonis perusahaan membayar pesangon sebesar Rp 45.000.000, uang penghargaan masa kerja Rp 12.000.000, dan uang penggantian hak Rp 5.000.000 sesuai PP No. 35/2021. PHK dinyatakan batal demi hukum.",
    keywords: ["PHK", "pesangon", "PHI", "PP No. 35/2021", "pekerja", "buruh"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "ketenagakerjaan",
    embedding: null,
  },
  {
    case_number: "98/Pid.B/2023/PN.SBY",
    court: "Pengadilan Negeri Surabaya",
    date: "2023-05-18",
    summary: "Terdakwa terbukti secara sah dan meyakinkan melakukan tindak pidana penipuan berupa pemalsuan dokumen sertifikat tanah. Terdakwa ditangkap dengan barang bukti uang Rp 500.000.000 hasil penipuan. Vonis penjara 4 tahun dan denda Rp 10.000.000 subsider 4 bulan kurungan sesuai Pasal 378 KUHP.",
    keywords: ["penipuan", "pemalsuan sertifikat", "UU ITE", "Pasal 378 KUHP"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "pidana",
    embedding: null,
  },
  {
    case_number: "56/Pdt/Pemela/2023/PN.JKT",
    court: "Pengadilan Negeri Jakarta Pusat",
    date: "2023-04-22",
    summary: "Sengketa waris antara ahli waris terkait pembagian harta peninggalan. Pengadilan menetapkan pembagian warisan sesuai KUHPerdata Pasal 823-1084. Ahli waris anak sah mendapat bagian 1/2, anak luar kawin mendapat 1/3, dan istri mendapat hak pakai. Sengketa diselesaikan melalui mediasi.",
    keywords: ["waris", "warisan", "KUHPerdata Pasal 823", "ahli waris", "pembagian harta"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "perdata",
    embedding: null,
  },
  {
    case_number: "20/Pid.B/2023/PN.BTN",
    court: "Pengadilan Negeri Banten",
    date: "2023-03-30",
    summary: "Terdakwa dihukum 2 tahun penjara karena melakukan penganiayaan ringan sebagaimana diatur dalam Pasal 351 ayat (2) KUHP. Tersangka mengakui perbuatannya dan telah dimaafkan oleh korban. Vonis ringan diterapkan karena adanya unsur pengurangan hukuman.",
    keywords: ["penganiayaan", "Pasal 351 KUHP", "delik aduan", "corporal injury"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "pidana",
    embedding: null,
  },
  {
    case_number: "88/Pdt/Gugatan/2023/PN.Mdg",
    court: "Pengadilan Negeri Magelang",
    date: "2023-02-14",
    summary: "Gugatan sengketa tanah antara dua pihak terkait batas wilayah dan sertifikat. Pengadilan memerintahkan survei ulang oleh tim ahli tanah. Gugatan sebagian dikabulkan, putusan menyatakan sertifikat tergugat batal demi hukum karena diterbitkan tanpa prosedur yang sah.",
    keywords: ["sengketa tanah", "sertifikat", "UUPA", "survei tanah", "batas wilayah"],
    source_url: "https://putusan3.mahkamahagung.go.id/",
    category: "perdata",
    embedding: null,
  },
];

// Function to add more realistic data
function generateMoreData(count = 50) {
  const courts = [
    "Pengadilan Negeri Jakarta Pusat",
    "Pengadilan Negeri Semarang",
    "Pengadilan Negeri Surabaya",
    "Pengadilan Negeri Bandung",
    "Pengadilan Negeri Yogyakarta",
    "Pengadilan Agama Jakarta",
    "Pengadilan Agama Surabaya",
    "Pengadilan Hubungan Industrial Jakarta",
    "Pengadilan Tipikor Jakarta",
  ];

  const categories = ["pidana", "perdata", "keluarga", "ketenagakerjaan"];

  const summaries = [
    "Terdakwa dinyatakan bersalah melakukan tindak pidana sesuai pasal yang diatur dalam KUHP. Pengadilan mempertimbangkanberat ringannya perbuatan dan sikap terdakwa sepanjang persidangan.",
    "Gugatan wanprestasi diajukan terhadap perjanjian kredit yang tidak dipenuhi oleh tergugat. Pengadilan memeriksa bukti-bukti yang diajukan kedua belah pihak.",
    "Sengketa perceraian antara suami dan istri diajukan ke Pengadilan Agama. Pasangan ini telah memisahkan diri selama lebih dari 2 tahun.",
    "Pekerja menggugat perusahaan atas pemutusan hubungan kerja yang dianggap tidak sah. Pengadilan memeriksa masa kerja dan hak-hak pekerja.",
  ];

  const keywords = [
    ["pencurian", "KUHP Pasal 362", "mencuri"],
    ["penganiayaan", "KUHP Pasal 351", "kekerasan"],
    ["penipuan", "KUHP Pasal 378", "penipuan digital"],
    ["wanprestasi", "KUHPerdata", "perjanjian kredit"],
    ["sengketa tanah", "sertifikat", "UUPA"],
    ["waris", "KUHPerdata", "ahli waris"],
    ["perceraian", "KHI", "UU Perkawinan"],
    ["PHK", "pesangon", "PP No. 35/2021"],
    ["narkotika", "UU Narkotika", "pasal 127"],
    ["korupsi", "UU Tipikor", "suap"],
  ];

  const data = [];
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const caseType = keywords[Math.floor(Math.random() * keywords.length)];

    data.push({
      case_number: `${Math.floor(Math.random() * 999)}/Pid.${category === 'pidana' ? 'Sus' : 'Gugatan'}/202${Math.floor(Math.random() * 4)}/PN.${['JKT', 'SBY', 'SMG', 'BDG', 'YGY'][Math.floor(Math.random() * 5)]}`,
      court: courts[Math.floor(Math.random() * courts.length)],
      date: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      summary: summaries[Math.floor(Math.random() * summaries.length)] + ` Kasus ini terkait ${caseType[0]} yang diatur dalam ${caseType[1] || 'undang-undang terkait'}.`,
      keywords: caseType,
      source_url: "https://putusan3.mahkamahagung.go.id/",
      category: category,
      embedding: null,
    });
  }
  return data;
}

async function main() {
  console.log('📊 Seeding Jurisprudence Data');
  console.log('='.repeat(50));

  // Load existing data if any
  const existingDataPath = path.join(__dirname, '../data/putusan_scraper.json');
  let scrapedData = [];

  if (fs.existsSync(existingDataPath)) {
    scrapedData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
    console.log(`📥 Loaded ${scrapedData.length} scraped records`);
  }

  // Combine with sample data
  const allData = [...SAMPLE_DATA, ...generateMoreData(50), ...scrapedData];

  // Remove duplicates
  const uniqueData = allData.filter((v, i, a) => a.findIndex(t => t.case_number === v.case_number) === i);

  console.log(`📋 Total unique records: ${uniqueData.length}`);
  console.log(`📂 Category breakdown:`);

  const categories = {};
  uniqueData.forEach(d => {
    categories[d.category] = (categories[d.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   - ${cat}: ${count} records`);
  });

  // Save to JSON for reference
  fs.writeFileSync(
    path.join(__dirname, '../data/jurisprudence_sample.json'),
    JSON.stringify(uniqueData, null, 2)
  );

  console.log(`\n✅ Data saved to data/jurisprudence_sample.json`);
  console.log(`\nNext steps:`);
  console.log(`1. Import to Supabase: Use Supabase dashboard or SQL`);
  console.log(`2. Generate embeddings: Run npm run generate-embeddings`);
  console.log(`3. Test search: Visit /yurisprudensi page`);
}

main().catch(console.error);
