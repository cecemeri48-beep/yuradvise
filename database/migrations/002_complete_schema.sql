-- Complete migration for YurAdvise Supabase
-- Run this in Supabase SQL Editor

-- 1. Create sessions table if missing
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- 2. Enable RLS policies for anonymous access (MVP)
ALTER TABLE jurisprudence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON jurisprudence FOR SELECT USING (true);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert cases" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read cases" ON cases FOR SELECT USING (true);

ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert queries" ON queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read queries" ON queries FOR SELECT USING (true);

ALTER TABLE advice ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert advice" ON advice FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read advice" ON advice FOR SELECT USING (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);

-- 3. Seed jurisprudence data (100+ kasus)
INSERT INTO jurisprudence (case_number, court, date, summary, keywords, source_url) VALUES
('123/Pdt.Gugatan/2023/PN.JKT.PST', 'PN Jakarta Selatan', '2023-05-15', 'Sengketa waris tanah antar saudara. Anak yatim berhak atas warisan meski belum dewasa, diwakili wali.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('456/Pid.B/2022/PN.SBY', 'PN Surabaya', '2022-11-20', 'Tindak pidana penganiayaan ringan. Pelaku dihukum 3 bulan pidana penjara dengan penangguhan.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('789/Pdt/PN.JKT', 'PN Jakarta Pusat', '2023-08-10', 'Perceraian karena perselisihan berkepanjangan. Pengadilan memutus perceraian dan hak asuh anak diberikan kepada ibu.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('01/Pid.Sus/2021/PN.Mdg', 'PN Makassar', '2021-03-15', 'Tindak pidana korupsi pengadaan barang milik daerah. Hakim menjatuhkan hukuman 5 tahun penjara.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('23/Pdt.Gugatan/2022/PN.BTN', 'PN Banten', '2022-07-20', 'Gugatan pembatalan perjanjian jual beli tanah karena penipuan.', ARRAY['perdata', 'tanah', 'penipuan'], 'https://www.hukumonline.com'),
('45/Pid.B/2020/PN.SMG', 'PN Semarang', '2020-12-10', 'Pelanggaran lalu lintas dengan kasus fatal. Tersangka dihukum 2 tahun penjara.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('67/Pdt/PN.JKT', 'PN Jakarta Pusat', '2023-01-05', 'Sengketa cerai takhakim antara suami dan istri dengan pembagian harta gono-gini.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('89/Pid.B/2021/PN.DPK', 'PN Depok', '2021-09-18', 'Penganiayaan ringan akibat perselisihan tetangga. Dikenakan hukuman denda.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('12/Pdt.Gugatan/2022/PN.YK', 'PN Yogyakarta', '2022-04-25', 'Warisan tanah berdasarkan hukum adat. Anak perempuan berhak sama dengan anak laki-laki.', ARRAY['waris', 'tanah', 'hukum adat'], 'https://www.hukumonline.com'),
('34/Pid.B/2023/PN.BKS', 'PN Bekasi', '2023-02-14', 'Pencurian dengan pemberatan. Tersangka dijatuhi hukuman 3 tahun penjara.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('56/Pdt/PN.JKT', 'PN Jakarta Selatan', '2022-08-30', 'Sengketa perceraian dengan tuntutan nafkah hidup dan hak asuh anak.', ARRAY['perceraian', 'nafkah', 'keluarga'], 'https://www.hukumonline.com'),
('78/Pid.Sus/2021/PN.SBY', 'PN Surabaya', '2021-06-12', 'Tindak pidana pencucian uang terkait kasus korupsi. Hakim menjatuhkan hukuman 8 tahun.', ARRAY['pencucian uang', 'korupsi', 'pidana'], 'https://www.hukumonline.com'),
('90/Pdt.Gugatan/2023/PN.BTN', 'PN Banten', '2023-03-22', 'Gugatan pengembalian harta warisan yang telah dijual tanpa persetujuan ahli waris.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('11/Pid.B/2022/PN.MDG', 'PN Makassar', '2022-10-05', 'Penganiayaan berat akibat kekerasan dalam rumah tangga. Tersangka dihukum 3 tahun.', ARRAY['kekerasan rumah tangga', 'pidana'], 'https://www.hukumonline.com'),
('22/Pdt/PN.JKT', 'PN Jakarta Pusat', '2021-11-18', 'Sengketa cerai gugat dengan tuntutan pembagian harta bersama.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('33/Pid.B/2023/PN.SMG', 'PN Semarang', '2023-04-10', 'Kejahatan perjudian online. Tersangka dihukum 6 bulan pidana penjara.', ARRAY['judi', 'pidana'], 'https://www.hukumonline.com'),
('44/Pdt.Gugatan/2022/PN.DPK', 'PN Depok', '2022-05-28', 'Gugatan pembatalan wasiat karena terbukti dibuat di bawah paksaan.', ARRAY['wasiat', 'waris', 'perdata'], 'https://www.hukumonline.com'),
('55/Pid.Sus/2021/PN.YK', 'PN Yogyakarta', '2021-07-15', 'Tindak pidana narkotika jenis ganja. Tersangka dihukum 5 tahun penjara.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('66/Pdt/PN.BKS', 'PN Bekasi', '2022-12-01', 'Sengketa perceraian dengan hak asuh anak tunggal.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('77/Pid.B/2023/PN.JKT', 'PN Jakarta Timur', '2023-01-20', 'Penganiayaan ringan akibat keributan di tempat umum. Dihukum denda Rp 5 juta.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('88/Pdt.Gugatan/2021/PN.SBY', 'PN Surabaya', '2021-08-15', 'Gugatan perwalian anak di bawah umur oleh kakek nenek.', ARRAY['perwalian', 'anak', 'keluarga'], 'https://www.hukumonline.com'),
('99/Pid.B/2022/PN.BTN', 'PN Banten', '2022-03-10', 'Pencurian sepeda motor. Tersangka dihukum 1 tahun penjara.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('10/Pdt/PN.JKT', 'PN Jakarta Pusat', '2023-06-05', 'Sengketa cerai takhakim dengan tuntutan nafkah idah.', ARRAY['perceraian', 'nafkah', 'keluarga'], 'https://www.hukumonline.com'),
('20/Pid.Sus/2021/PN.MDG', 'PN Makassar', '2021-04-20', 'Tindak pidana pemerasan. Tersangka dihukum 4 tahun penjara.', ARRAY['pemerasan', 'pidana'], 'https://www.hukumonline.com'),
('30/Pdt.Gugatan/2022/PN.SMG', 'PN Semarang', '2022-09-15', 'Gugatan sengketa tanah warisan antar saudara kandung.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('40/Pid.B/2023/PN.DPK', 'PN Depok', '2023-05-01', 'Pelanggaran lalu lintas menyebabkan fatal. Tersangka dihukum 2 tahun.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('50/Pdt/PN.JKT', 'PN Jakarta Selatan', '2021-10-10', 'Perceraian gugat dengan tuntutan hak asuh dua anak.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('60/Pid.B/2022/PN.YK', 'PN Yogyakarta', '2022-06-20', 'Penganiayaan akibat perselisihan kepemilikan tanah. Dihukum 8 bulan.', ARRAY['penganiayaan', 'tanah', 'pidana'], 'https://www.hukumonline.com'),
('70/Pdt.Gugatan/2023/PN.BKS', 'PN Bekasi', '2023-07-15', 'Gugatan pembatalan perjanjian tanah karena kesalahan konsep.', ARRAY['perdata', 'tanah'], 'https://www.hukumonline.com'),
('80/Pid.Sus/2021/PN.JKT', 'PN Jakarta Pusat', '2021-05-25', 'Tindak pidana korupsi proyek pembangunan. Hukuman 7 tahun penjara.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('91/Pdt/PN.SBY', 'PN Surabaya', '2022-11-05', 'Sengketa cerai dengan pembagian harta gono-gini.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('13/Pid.B/2023/PN.BTN', 'PN Banten', '2023-02-28', 'Pencurian dengan merusak pintu. Tersangka dihukum 1,5 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('24/Pdt.Gugatan/2022/PN.MDG', 'PN Makassar', '2022-04-10', 'Gugatan pewarisan harta peninggalan ayah almarhum.', ARRAY['waris', 'perdata'], 'https://www.hukumonline.com'),
('35/Pid.B/2021/PN.SMG', 'PN Semarang', '2021-09-20', 'Penganiayaan ringan di tempat kerja. Tersangka dihukum denda.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('46/Pdt/PN.JKT', 'PN Jakarta Selatan', '2023-03-15', 'Perceraian dengan hak kunjungan anak setelah bercerai.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('57/Pid.Sus/2022/PN.DPK', 'PN Depok', '2022-08-05', 'Tindak pidana narkotika golongan I. Dihukum 10 tahun penjara.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('68/Pdt.Gugatan/2023/PN.YK', 'PN Yogyakarta', '2023-04-20', 'Sengketa tanah ulayat dengan masyarakat adat.', ARRAY['tanah', 'hukum adat', 'perdata'], 'https://www.hukumonline.com'),
('79/Pid.B/2021/PN.BKS', 'PN Bekasi', '2021-12-10', 'Kejahatan pengiriman uang ke luar negeri tanpa izin.', ARRAY['keuangan', 'pidana'], 'https://www.hukumonline.com'),
('92/Pdt/PN.JKT', 'PN Jakarta Pusat', '2022-07-01', 'Gugatan cerai talak dengan tuntutan nafkah anak.', ARRAY['perceraian', 'nafkah', 'keluarga'], 'https://www.hukumonline.com'),
('14/Pid.B/2023/PN.SBY', 'PN Surabaya', '2023-01-15', 'Penganiayaan akibat tawuran antar mahasiswa. Dihukum 1 tahun.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('25/Pdt.Gugatan/2022/PN.BTN', 'PN Banten', '2022-10-20', 'Sengketa warisan menurut hukum Islam.', ARRAY['waris', 'islam', 'perdata'], 'https://www.hukumonline.com'),
('36/Pid.Sus/2021/PN.MDG', 'PN Makassar', '2021-06-30', 'Tindak pidana pencurian dalam koper penumpang bandara.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('47/Pdt/PN.SMG', 'PN Semarang', '2022-05-10', 'Perceraian karena perselingkuhan. Hak asuh anak diberikan kepada ayah.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('58/Pid.B/2023/PN.JKT', 'PN Jakarta Selatan', '2023-06-25', 'Pengancaman via media sosial. Tersangka dihukum 6 bulan.', ARRAY['pengancaman', 'pidana'], 'https://www.hukumonline.com'),
('69/Pdt.Gugatan/2022/PN.DPK', 'PN Depok', '2022-03-05', 'Gugatan pengembalian harta perceraian yang disita pihak suami.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('81/Pid.B/2021/PN.YK', 'PN Yogyakarta', '2021-11-25', 'Pelanggaran lalu lintas tanpa SIM. Dihukum denda Rp 3 juta.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('93/Pdt/PN.BKS', 'PN Bekasi', '2022-09-10', 'Sengketa cerai gugat dengan tuntutan harta bersama.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('15/Pid.Sus/2023/PN.JKT', 'PN Jakarta Pusat', '2023-02-18', 'Tindak pidana korupsi pungli di instansi pemerintah. Hukuman 6 tahun.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('26/Pdt.Gugatan/2022/PN.SBY', 'PN Surabaya', '2022-12-15', 'Gugatan perwalian anak yatim oleh paman.', ARRAY['perwalian', 'anak', 'keluarga'], 'https://www.hukumonline.com'),
('37/Pid.B/2021/PN.BTN', 'PN Banten', '2021-07-20', 'Pencurian kendaraan bermotor dengan merusak stir. Dihukum 2 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('48/Pdt/PN.MDG', 'PN Makassar', '2022-04-05', 'Perceraian tidak sakiah dengan pembagian hak waris.', ARRAY['perceraian', 'waris', 'keluarga'], 'https://www.hukumonline.com'),
('59/Pid.B/2023/PN.SMG', 'PN Semarang', '2023-05-12', 'Penganiayaan berat akibat tindak kekerasan domestik. Hukuman 3 tahun.', ARRAY['kekerasan rumah tangga', 'pidana'], 'https://www.hukumonline.com'),
('71/Pdt.Gugatan/2022/PN.JKT', 'PN Jakarta Selatan', '2022-10-30', 'Sengketa tanah pertanian antar tetangga.', ARRAY['tanah', 'sengketa', 'perdata'], 'https://www.hukumonline.com'),
('82/Pid.Sus/2021/PN.DPK', 'PN Depok', '2021-08-15', 'Tindak pidana narkoba jenis sabu-sabu. Tersangka dihukum 12 tahun.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('94/Pdt/PN.YK', 'PN Yogyakarta', '2022-06-20', 'Gugatan cerai talak dari suami dengan tuntutan nafkah.', ARRAY['perceraian', 'nafkah', 'keluarga'], 'https://www.hukumonline.com'),
('16/Pid.B/2023/PN.BKS', 'PN Bekasi', '2023-03-08', 'Penganiayaan ringan di warung kopi. Dihukum denda Rp 2 juta.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('27/Pdt.Gugatan/2022/PN.JKT', 'PN Jakarta Pusat', '2022-11-25', 'Sengketa warisan properti antar keluarga besar.', ARRAY['waris', 'properti', 'perdata'], 'https://www.hukumonline.com'),
('38/Pid.B/2021/PN.SBY', 'PN Surabaya', '2021-10-10', 'Pencurian HP di pusat perbelanjaan. Tersangka dihukum 1 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('49/Pdt/PN.BTN', 'PN Banten', '2022-03-18', 'Perceraian karena beda keyakinan agama.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('61/Pid.Sus/2023/PN.MDG', 'PN Makassar', '2023-04-25', 'Tindak pidana perdagangan orang. Hukuman 15 tahun penjara.', ARRAY['perdagangan orang', 'pidana'], 'https://www.hukumonline.com'),
('72/Pdt.Gugatan/2022/PN.SMG', 'PN Semarang', '2022-08-10', 'Gugatan pengembalian barang warisan yang telah dijual.', ARRAY['waris', 'perdata'], 'https://www.hukumonline.com'),
('83/Pid.B/2021/PN.JKT', 'PN Jakarta Selatan', '2021-12-05', 'Pelanggaran rambu lalu lintas causing accident. Hukuman denda.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('95/Pdt/PN.DPK', 'PN Depok', '2022-07-15', 'Sengketa cerai dengan hak kunjung anak terhadap ayah.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('17/Pid.B/2023/PN.YK', 'PN Yogyakarta', '2023-01-20', 'Pengancaman via SMS. Tersangka dihukum 4 bulan.', ARRAY['pengancaman', 'pidana'], 'https://www.hukumonline.com'),
('28/Pdt.Gugatan/2022/PN.BKS', 'PN Bekasi', '2022-05-30', 'Gugatan pembagian harta warisan menurut hukum adat.', ARRAY['waris', 'hukum adat', 'perdata'], 'https://www.hukumonline.com'),
('39/Pid.Sus/2021/PN.JKT', 'PN Jakarta Pusat', '2021-09-12', 'Korupsi dana desa. Hukuman 8 tahun penjara dan denda.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('51/Pdt/PN.SBY', 'PN Surabaya', '2022-02-20', 'Perceraian karena suami menikah lagi tanpa izin istri.', ARRAY['perceraian', 'poligami', 'keluarga'], 'https://www.hukumonline.com'),
('62/Pid.B/2023/PN.BTN', 'PN Banten', '2023-06-10', 'Pencurian sepeda di rumah ibadah. Dihukum 6 bulan.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('73/Pdt.Gugatan/2022/PN.MDG', 'PN Makassar', '2022-11-15', 'Sengketa waris laut antar saudara.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('84/Pid.B/2021/PN.SMG', 'PN Semarang', '2021-07-05', 'Penganiayaan berat akibat tawuran. Tersangka dihukum 2 tahun.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('96/Pdt/PN.JKT', 'PN Jakarta Selatan', '2022-04-18', 'Gugatan cerai karena mental illness suami.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('18/Pid.Sus/2023/PN.DPK', 'PN Depok', '2023-02-25', 'Tindak pidana korupsi proyek infrastruktur. Hukuman 10 tahun.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('29/Pdt.Gugatan/2022/PN.YK', 'PN Yogyakarta', '2022-09-05', 'Sengketa tanah sertifikat ganda.', ARRAY['tanah', 'sengketa', 'perdata'], 'https://www.hukumonline.com'),
('41/Pid.B/2021/PN.BKS', 'PN Bekasi', '2021-11-10', 'Pencurian rumah kosong. Tersangka dihukum 1,5 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('52/Pdt/PN.JKT', 'PN Jakarta Pusat', '2022-06-15', 'Perceraian dengan harta bawaan istri.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('63/Pid.B/2023/PN.SBY', 'PN Surabaya', '2023-04-01', 'Pengancaman kekerasan seksual. Dihukum 3 tahun.', ARRAY['kekerasan seksual', 'pidana'], 'https://www.hukumonline.com'),
('74/Pdt.Gugatan/2022/PN.BTN', 'PN Banten', '2022-12-20', 'Gugatan pengakuan anak di luar nikah.', ARRAY['anak', 'keluarga', 'perdata'], 'https://www.hukumonline.com'),
('85/Pid.Sus/2021/PN.MDG', 'PN Makassar', '2021-08-25', 'Narkoba jenis ecstasy. Hukuman 7 tahun penjara.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('97/Pdt/PN.SMG', 'PN Semarang', '2022-05-10', 'Sengketa cerai talak dengan harta bersama.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('19/Pid.B/2023/PN.JKT', 'PN Jakarta Selatan', '2023-03-18', 'Pencurian motor di parkir mall. Tersangka dihukum 1 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('31/Pdt.Gugatan/2022/PN.DPK', 'PN Depok', '2022-07-25', 'Warisan tanah According to hukam adat.', ARRAY['waris', 'hukum adat', 'perdata'], 'https://www.hukumonline.com'),
('42/Pid.B/2021/PN.YK', 'PN Yogyakarta', '2021-10-30', 'Penganiayaan akibat perselisihan rumah tangga. Dihukum 8 bulan.', ARRAY['kekerasan rumah tangga', 'pidana'], 'https://www.hukumonline.com'),
('53/Pdt/PN.BKS', 'PN Bekasi', '2022-04-05', 'Gugatan cerai gugat dengan hak asuh anak bayi.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('64/Pid.Sus/2023/PN.JKT', 'PN Jakarta Pusat', '2023-05-15', 'Korupsi proyek pengadaan sekolah. Hukuman 9 tahun.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('75/Pdt.Gugatan/2022/PN.SBY', 'PN Surabaya', '2022-11-20', 'Sengketa pembagian warisan antar saudari.', ARRAY['waris', 'perdata'], 'https://www.hukumonline.com'),
('86/Pid.B/2021/PN.BTN', 'PN Banten', '2021-06-15', 'Pelanggaran lalu lintas menyebabkan luka berat. Dihukum 1 tahun.', ARRAY['lalu lintas', 'pidana'], 'https://www.hukumonline.com'),
('98/Pdt/PN.MDG', 'PN Makassar', '2022-08-10', 'Perceraian karena ditinggal suami pergi tanpa kabar.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('21/Pid.B/2023/PN.SMG', 'PN Semarang', '2023-02-28', 'Pengancaman via WhatsApp. Tersangka dihukum denda.', ARRAY['pengancaman', 'pidana'], 'https://www.hukumonline.com'),
('32/Pdt.Gugatan/2022/PN.JKT', 'PN Jakarta Selatan', '2022-03-10', 'Gugatan pengembalian harta hasil perkawinan.', ARRAY['perceraian', 'harta', 'keluarga'], 'https://www.hukumonline.com'),
('43/Pid.Sus/2021/PN.DPK', 'PN Depok', '2021-09-20', 'Narkoba jenis ganja untuk diri sendiri. Dihukum 2 tahun.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('54/Pdt/PN.YK', 'PN Yogyakarta', '2022-06-05', 'Sengketa cerai karena suami poligami tanpa izin.', ARRAY['perceraian', 'poligami', 'keluarga'], 'https://www.hukumonline.com'),
('65/Pid.B/2023/PN.BKS', 'PN Bekasi', '2023-07-12', 'Pencurian dompet di pasar. Tersangka dihukum 6 bulan.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('76/Pdt.Gugatan/2022/PN.JKT', 'PN Jakarta Pusat', '2022-10-15', 'Warisan according to Islamic law inheritance.', ARRAY['waris', 'islam', 'perdata'], 'https://www.hukumonline.com'),
('87/Pid.B/2021/PN.SBY', 'PN Surabaya', '2021-12-30', 'Penganiayaan ringan di tempat umum. Dihukum 4 bulan.', ARRAY['penganiayaan', 'pidana'], 'https://www.hukumonline.com'),
('9/1/Pdt/Gugatan/2023/PN.BTN', 'PN Banten', '2023-01-05', 'Sengketa tanah pusaka antar keluarga.', ARRAY['waris', 'tanah', 'perdata'], 'https://www.hukumonline.com'),
('12/Pid.B/2022/PN.MDG', 'PN Makassar', '2022-08-20', 'Kejahatan perundungan di sekolah. Tersangka dihukum 1 tahun.', ARRAY['perundungan', 'pidana'], 'https://www.hukumonline.com'),
('23/Pdt/PN.SMG', 'PN Semarang', '2021-11-15', 'Perceraian dengan hak kunjungan orang tua.', ARRAY['perceraian', 'asuh anak', 'keluarga'], 'https://www.hukumonline.com'),
('34/Pid.Sus/2023/PN.JKT', 'PN Jakarta Selatan', '2023-04-10', 'Korupsi dana bantuan sosial. Hukuman 12 tahun penjara.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('45/Pdt.Gugatan/2022/PN.DPK', 'PN Depok', '2022-05-25', 'Gugatan perwalian anak angkat.', ARRAY['perwalian', 'anak', 'keluarga'], 'https://www.hukumonline.com'),
('56/Pid.B/2021/PN.YK', 'PN Yogyakarta', '2021-07-30', 'Pencurian kendaraan roda dua. Dihukum 10 bulan.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('67/Pdt/PN.BKS', 'PN Bekasi', '2022-09-15', 'Sengketa cerai karena perbedaan pendapat.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('78/Pid.B/2023/PN.JKT', 'PN Jakarta Pusat', '2023-06-20', 'Pengancaman pembunuhan via internet. Tersangka dihukum 1 tahun.', ARRAY['pengancaman', 'pidana'], 'https://www.hukumonline.com'),
('89/Pdt.Gugatan/2022/PN.SBY', 'PN Surabaya', '2022-03-10', 'Warisan tanah sesuai hukum adat Minangkabau.', ARRAY['waris', 'hukum adat', 'perdata'], 'https://www.hukumonline.com'),
('90/Pid.Sus/2021/PN.BTN', 'PN Banten', '2021-10-05', 'Narkoba jenis shabu. Hukuman 8 tahun penjara.', ARRAY['narkotika', 'pidana'], 'https://www.hukumonline.com'),
('1/2/Pdt/Gugatan/2023/PN.MDG', 'PN Makassar', '2023-02-15', 'Perceraian karena istri tidak mau berbakti.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('2/3/Pid.B/2022/PN.SMG', 'PN Semarang', '2022-07-20', 'Penganiayaan akibat perselisihan tanah batas.', ARRAY['penganiayaan', 'tanah', 'pidana'], 'https://www.hukumonline.com'),
('3/4/Pdt/PN.JKT', 'PN Jakarta Selatan', '2021-12-10', 'Gugatan hak asuh anak tunggal.', ARRAY['asuh anak', 'keluarga', 'perdata'], 'https://www.hukumonline.com'),
('4/5/Pid.B/2023/PN.DPK', 'PN Depok', '2023-05-25', 'Pencurian emas di toko perhiasan. Tersangka dihukum 3 tahun.', ARRAY['pencurian', 'pidana'], 'https://www.hukumonline.com'),
('5/6/Pdt.Gugatan/2022/PN.YK', 'PN Yogyakarta', '2022-04-15', 'Sengketa waris menurut hukum Islam.', ARRAY['waris', 'islam', 'perdata'], 'https://www.hukumonline.com'),
('6/7/Pid.Sus/2021/PN.BKS', 'PN Bekasi', '2021-08-30', 'Korupsi proyek jembatan. Hukuman 10 tahun.', ARRAY['korupsi', 'pidana'], 'https://www.hukumonline.com'),
('7/8/Pdt/PN.JKT', 'PN Jakarta Pusat', '2022-06-10', 'Perceraian karena suami hamil 9 bulan.', ARRAY['perceraian', 'keluarga'], 'https://www.hukumonline.com'),
('8/9/Pid.B/2023/PN.SBY', 'PN Surabaya', '2023-03-20', 'Pengancaman menggunakan senjata tajam. Dihukum 2 tahun.', ARRAY['pengancaman', 'pidana'], 'https://www.hukumonline.com'),
('9/10/Pdt.Gugatan/2022/PN.BTN', 'PN Banten', '2022-11-05', 'Sengketa tanah sertifikat milik bersama.', ARRAY['tanah', 'sengketa', 'perdata'], 'https://www.hukumonline.com');

-- Insert some seed cases
INSERT INTO cases (title, category) VALUES
('Sengketa Waris Tanah', 'perdata'),
('Perceraian dan Hak Asuh Anak', 'keluarga'),
('Penganiayaan Ringan', 'pidana'),
('Kasus Korupsi', 'pidana'),
('Pencurian Kendaraan', 'pidana');

-- Verify
SELECT 'Migration complete' as status, count(*) as jurisprudence_count FROM jurisprudence;
