-- =============================================
-- FIX RLS POLICIES FOR ALL TABLES
-- =============================================

-- Disable RLS first
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE queries DISABLE ROW LEVEL SECURITY;
ALTER TABLE advice DISABLE ROW LEVEL SECURITY;
ALTER TABLE jurisprudence DISABLE ROW LEVEL SECURITY;

-- Enable RLS with proper policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurisprudence ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read users" ON users;
DROP POLICY IF EXISTS "Public read cases" ON cases;
DROP POLICY IF EXISTS "Public read queries" ON queries;
DROP POLICY IF EXISTS "Public read advice" ON advice;
DROP POLICY IF EXISTS "Public read jurisprudence" ON jurisprudence;
DROP POLICY IF EXISTS "Allow service role advice" ON advice;

-- Create new policies (allow all for MVP)
CREATE POLICY "allow_all_users" ON users FOR ALL USING (true);
CREATE POLICY "allow_all_cases" ON cases FOR ALL USING (true);
CREATE POLICY "allow_all_queries" ON queries FOR ALL USING (true);
CREATE POLICY "allow_all_advice" ON advice FOR ALL USING (true);
CREATE POLICY "allow_all_jurisprudence" ON jurisprudence FOR ALL USING (true);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert sample cases (correct columns: id, user_id, title, category, created_at)
INSERT INTO cases (title, category) 
VALUES 
('Sengketa Waris Tanah Antar Saudara', 'lainnya'),
('Penganiayaan Ringan di Tempat Umum', 'kekerasan'),
('Permohonan Perceraian', 'lainnya')
ON CONFLICT DO NOTHING;

-- Insert sample queries
INSERT INTO queries (case_id, question_text)
SELECT c.id, 'Bagaimana prosedur pembagian waris?'
FROM cases c WHERE c.title = 'Sengketa Waris Tanah Antar Saudara'
ON CONFLICT DO NOTHING;

INSERT INTO queries (case_id, question_text)
SELECT c.id, 'Apa hak tersangka penganiayaan?'
FROM cases c WHERE c.title = 'Penganiayaan Ringan di Tempat Umum'
ON CONFLICT DO NOTHING;

-- =============================================
-- VERIFY
-- =============================================
SELECT 'RLS Fixed!' as status,
       (SELECT count(*) FROM cases) as cases_count,
       (SELECT count(*) FROM queries) as queries_count,
       (SELECT count(*) FROM advice) as advice_count,
       (SELECT count(*) FROM jurisprudence) as jurisprudence_count;
