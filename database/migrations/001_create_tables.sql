-- =============================================
-- YurAdvise — Database Schema Migration
-- Database: PostgreSQL 16
-- Created: 2026-08-14
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Warga/Pengguna yang menggunakan YurAdvise. Email opsional (anonymous di MVP).';

-- =============================================
-- 2. cases (Kasus Saya)
-- =============================================
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN (
        'penangkapan', 'kekerasan', 'pelanggaran_ham',
        'kekerasan_dalam_tangga', 'pelecehan_seksual',
        'diskriminasi', 'lainnya'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cases IS 'Kasus hukum yang dihadapi warga. Satu user bisa punya banyak kasus.';

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_category ON cases(category);

-- =============================================
-- 3. queries (Pertanyaan)
-- =============================================
CREATE TABLE IF NOT EXISTS queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_audio_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE queries IS 'Setiap pertanyaan warga terkait kasusnya.';

CREATE INDEX idx_queries_case_id ON queries(case_id);

-- =============================================
-- 4. advice (Jawaban AI)
-- =============================================
CREATE TABLE IF NOT EXISTS advice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
    advice_text TEXT NOT NULL,
    sources_json JSONB DEFAULT '[]'::jsonb,
    audio_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE advice IS 'Jawaban advice hukum dari AI + kutipan sumber yurisprudensi/berita.';

CREATE INDEX idx_advice_query_id ON advice(query_id);
CREATE INDEX idx_advice_sources ON advice USING GIN (sources_json);

-- =============================================
-- 5. jurisprudence (Database Yurisprudensi)
-- =============================================
CREATE TABLE IF NOT EXISTS jurisprudence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(100) NOT NULL,
    court VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    summary TEXT NOT NULL,
    keywords VARCHAR(100)[],
    source_url VARCHAR(512),
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536)  -- untuk RAG semantic search (pgvector)
);

COMMENT ON TABLE jurisprudence IS 'Database yurisprudensi Indonesia (MA & MK). Dipakai untuk RAG pipeline.';

CREATE INDEX idx_jurisprudence_case_number ON jurisprudence(case_number);
CREATE INDEX idx_jurisprudence_court ON jurisprudence(court);
CREATE INDEX idx_jurisprudence_keywords ON jurisprudence USING GIN (keywords);
CREATE INDEX idx_jurisprudence_embedding ON jurisprudence USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- =============================================
-- 6. news_articles (Berita Hukum — Fase 2)
-- =============================================
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(512) NOT NULL,
    content TEXT,
    source VARCHAR(255),
    url VARCHAR(512),
    published_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536)
);

COMMENT ON TABLE news_articles IS 'Berita hukum dari portal seperti HukumOnline, Kompas, dll (Fase 2).';

CREATE INDEX idx_news_articles_source ON news_articles(source);
CREATE INDEX idx_news_articles_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_embedding ON news_articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- =============================================
-- 7. sessions (Anonymous session tracking — MVP)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

COMMENT ON TABLE sessions IS 'Session anonymous untuk warga yang belum login. Token disimpan di localStorage client.';

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- =============================================
-- 8. audit_log (Logging aktivitas — penting untuk compliance)
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_log IS 'Log aktivitas untuk audit trail dan debugging.';

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- =============================================
-- Trigger: updated_at auto-update
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at
    BEFORE UPDATE ON cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Views (untuk reporting & monitoring)
-- =============================================
CREATE OR REPLACE VIEW vw_latest_advice AS
SELECT
    a.id AS advice_id,
    a.advice_text,
    a.sources_json,
    a.created_at,
    q.question_text,
    c.title AS case_title,
    c.category
FROM advice a
JOIN queries q ON a.query_id = q.id
JOIN cases c ON q.case_id = c.id
ORDER BY a.created_at DESC
LIMIT 100;

CREATE OR REPLACE VIEW vw_user_statistics AS
SELECT
    u.id AS user_id,
    u.email,
    COUNT(DISTINCT c.id) AS total_cases,
    COUNT(DISTINCT q.id) AS total_queries,
    COUNT(DISTINCT a.id) AS total_advice,
    MAX(q.created_at) AS last_query_at
FROM users u
LEFT JOIN cases c ON c.user_id = u.id
LEFT JOIN queries q ON q.case_id = c.id
LEFT JOIN advice a ON a.query_id = q.id
GROUP BY u.id, u.email;
