-- Import jurisprudence data to Supabase
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily (run as service role)
-- ALTER TABLE jurisprudence DISABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO jurisprudence (case_number, court, date, summary, keywords, source_url, scraped_at)
VALUES
  ('35/Pid.Sus/2023/PN.JKT.PUS', 'Pengadilan Negeri Jakarta Pusat', '2023-08-15', 'Terdakwa dinyatakan bersalah melakukan tindak pidana pencurian dengan pemberatan sebagaimana diatur dalam Pasal 363 KUHP. Pengadilan mempertimbangkan bahwa terdakwa merupakan pengulang kejahatan dan menggunakan alat untuk membuka kunci mobil korban. Terdakwa dihukum penjara 3 tahun dan denda Rp 5.000.000 subsider 3 bulan kurungan.', ARRAY['pencurian', 'mobil', 'KUHP Pasal 363', 'pemberatan'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('12/Pdt.Gugatan/2023/PN.SMG', 'Pengadilan Negeri Semarang', '2023-06-20', 'Gugatan wanprestasi terhadap perjanjian kredit mobil. Pengadilan memvonis tergugatan (perusahaan leasing) kalah dan wajib mengembalikan uang muka yang sudah dibayar sebesar Rp 25.000.000. Pengadilan menyatakan bahwa tergugatan telah melakukan wanprestasi dengan menyita kendaraan tanpa prosedur yang sah sesuai Pasal 1243 KUHPerdata.', ARRAY['wanprestasi', 'kredit mobil', 'leasing', 'KUHPerdata Pasal 1243', 'sita kendaraan'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('01/Penung/2023/PA.JKT', 'Pengadilan Agama Jakarta', '2023-07-10', 'Pengadilan mengabulkan gugatan cerai talak yang diajukan oleh suami. Putusan menyatakan bahwa hubungan suami istri sudah tidak dapat dipertahankan lagi berdasarkan Pasal 39 UU No. 1/1974. Hak asuh anak ditetapkan kepada ibu karena anak masih di bawah 5 tahun sesuai Pasal 93 KHI. Suami diwajibkan membayar nafkah anak Rp 2.000.000 per bulan.', ARRAY['cerai talak', 'hak asuh anak', 'KHI Pasal 93', 'UU Perkawinan', 'nafkah anak'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('1/P.Nispi/2023/PHI.JKT', 'Pengadilan Hubungan Industrial Jakarta', '2023-09-05', 'Pengadilan mengabulkan gugatan pekerja atas pemutusan hubungan kerja yang tidak sah. Pengadilan memvonis perusahaan membayar pesangon sebesar Rp 45.000.000, uang penghargaan masa kerja Rp 12.000.000, dan uang penggantian hak Rp 5.000.000 sesuai PP No. 35/2021. PHK dinyatakan batal demi hukum.', ARRAY['PHK', 'pesangon', 'PHI', 'PP No. 35/2021', 'pekerja', 'buruh'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('98/Pid.B/2023/PN.SBY', 'Pengadilan Negeri Surabaya', '2023-05-18', 'Terdakwa terbukti secara sah dan meyakinkan melakukan tindak pidana penipuan berupa pemalsuan dokumen sertifikat tanah. Terdakwa ditangkap dengan barang bukti uang Rp 500.000.000 hasil penipuan. Vonis penjara 4 tahun dan denda Rp 10.000.000 subsider 4 bulan kurungan sesuai Pasal 378 KUHP.', ARRAY['penipuan', 'pemalsuan sertifikat', 'UU ITE', 'Pasal 378 KUHP'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('56/Pdt/Pemela/2023/PN.JKT', 'Pengadilan Negeri Jakarta Pusat', '2023-04-22', 'Sengketa waris antara ahli waris terkait pembagian harta peninggalan. Pengadilan menetapkan pembagian warisan sesuai KUHPerdata Pasal 823-1084. Ahli waris anak sah mendapat bagian 1/2, anak luar kawin mendapat 1/3, dan istri mendapat hak pakai. Sengketa diselesaikan melalui mediasi.', ARRAY['waris', 'warisan', 'KUHPerdata Pasal 823', 'ahli waris', 'pembagian harta'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('20/Pid.B/2023/PN.BTN', 'Pengadilan Negeri Banten', '2023-03-30', 'Terdakwa dihukum 2 tahun penjara karena melakukan penganiayaan ringan sebagaimana diatur dalam Pasal 351 ayat (2) KUHP. Tersangka mengakui perbuatannya dan telah dimaafkan oleh korban. Vonis ringan diterapkan karena adanya unsur pengurangan hukuman.', ARRAY['penganiayaan', 'Pasal 351 KUHP', 'delik aduan', 'corporal injury'], 'https://putusan3.mahkamahagung.go.id/', NOW()),
  ('88/Pdt/Gugatan/2023/PN.Mdg', 'Pengadilan Negeri Magelang', '2023-02-14', 'Gugatan sengketa tanah antara dua pihak terkait batas wilayah dan sertifikat. Pengadilan memerintahkan survei ulang oleh tim ahli tanah. Gugatan sebagian dikabulkan, putusan menyatakan sertifikat tergugat batal demi hukum karena diterbitkan tanpa prosedur yang sah.', ARRAY['sengketa tanah', 'sertifikat', 'UUPA', 'survei tanah', 'batas wilayah'], 'https://putusan3.mahkamahagung.go.id/', NOW());

-- Re-enable RLS after import (run as service role)
-- ALTER TABLE jurisprudence ENABLE ROW LEVEL SECURITY;

-- Verify import
SELECT count(*) as total_records FROM jurisprudence;
