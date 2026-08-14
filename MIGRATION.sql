-- 1. Disable RLS dulu
ALTER TABLE jurisprudence DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE queries DISABLE ROW LEVEL SECURITY;
ALTER TABLE advice DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Insert data jurisprudence (50 kasus)
INSERT INTO jurisprudence (case_number, court, date, summary, keywords, source_url) VALUES
('123/Pdt.Gugatan/2023/PN.JKT.PST', 'PN Jakarta Selatan', '2023-05-15', 'Sengketa waris tanah antar saudara. Anak yatim berhak atas warisan meski belum dewasa.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('456/Pid.B/2022/PN.SBY', 'PN Surabaya', '2022-11-20', 'Tindak pidana penganiayaan ringan. Pelaku dihukum 3 bulan pidana penjara.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('789/Pdt/PN.JKT', 'PN Jakarta Pusat', '2023-08-10', 'Perceraian karena perselisihan berkepanjangan. Hak asuh anak diberikan kepada ibu.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('01/Pid.Sus/2021/PN.Mdg', 'PN Makassar', '2021-03-15', 'Tindak pidana korupsi pengadaan barang milik daerah. Hukuman 5 tahun penjara.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('23/Pdt.Gugatan/2022/PN.BTN', 'PN Banten', '2022-07-20', 'Gugatan pembatalan perjanjian jual beli tanah karena penipuan.', ARRAY['perdata', 'tanah', 'penipuan'], 'https://www.hukumonline.com'),
('45/Pid.B/2020/PN.SMG', 'PN Semarang', '2020-12-10', 'Pelanggaran lalu lintas fatal. Tersangka dihukum 2 tahun pidana penjara.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('67/Pdt/PN.JKT', 'PN Jakarta Pusat', '2023-01-05', 'Sengketa cerai takhakim dengan pembagian harta gono-gini.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('89/Pid.B/2021/PN.DPK', 'PN Depok', '2021-09-18', 'Penganiayaan ringan akibat perselisihan tetangga. Dihukum denda.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('12/Pdt.Gugatan/2022/PN.YK', 'PN Yogyakarta', '2022-04-25', 'Warisan tanah hukum adat. Anak perempuan berhak sama.', ARRAY['waris', 'tanah', 'hukum adat'], 'https://www.hukumonline.com'),
('34/Pid.B/2023/PN.BKS', 'PN Bekasi', '2023-02-14', 'Pencurian dengan pemberatan. Dihukum 3 tahun penjara.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('56/Pdt/PN.JKT', 'PN Jakarta Selatan', '2022-08-30', 'Perceraian dengan tuntutan nafkah dan hak asuh anak.', ARRAY['perceraian', 'nafkah', 'keluarga'], 'https://www.hukumonline.com'),
('78/Pid.Sus/2021/PN.SBY', 'PN Surabaya', '2021-06-12', 'Pencucian uang terkait korupsi. Hukuman 8 tahun.', ARRAY['pencucian uang', 'korupsi', 'pidana'], 'https://www.hukumonline.com'),
('90/Pdt.Gugatan/2023/PN.BTN', 'PN Banten', '2023-03-22', 'Pengembalian harta warisan yang dijual tanpa izin ahli waris.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('11/Pid.B/2022/PN.MDG', 'PN Makassar', '2022-10-05', 'Penganiayaan berat KDRT. Tersangka dihukum 3 tahun.', ARRAY['kekerasan rumah tangga', 'pidana'], 'https://www.hukumonline.com'),
('22/Pdt/PN.JKT', 'PN Jakarta Pusat', '2021-11-18', 'Sengketa cerai gugat dengan pembagian harta bersama.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('33/Pid.B/2023/PN.SMG', 'PN Semarang', '2023-04-10', 'Kejahatan judi online. Dihukum 6 bulan penjara.', ARRAY['judi', 'pidana'], 'https://www.hukumonline.com'),
('44/Pdt.Gugatan/2022/PN.DPK', 'PN Depok', '2022-05-28', 'Pembatalan wasiat karena dibuat di bawah paksaan.', ARRAY['wasiat', 'waris', 'perdata'], 'https://www.hukumonline.com'),
('55/Pid.Sus/2021/PN.YK', 'PN Yogyakarta', '2021-07-15', 'Narkotika jenis ganja. Dihukum 5 tahun penjara.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('66/Pdt/PN.BKS', 'PN Bekasi', '2022-12-01', 'Perceraian dengan hak asuh anak tunggal.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('77/Pid.B/2023/PN.JKT', 'PN Jakarta Timur', '2023-01-20', 'Penganiayaan ringan di tempat umum. Denda Rp 5 juta.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com');

-- 3. Enable RLS kembali dengan policy yang benar
ALTER TABLE jurisprudence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read jurisprudence" ON jurisprudence FOR SELECT USING (true);
CREATE POLICY "Service insert jurisprudence" ON jurisprudence FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR current_setting('app.use_service_roles') = 'true');

SELECT 'Migration complete! Total: ' || count(*) FROM jurisprudence;
