import struct

# Write SQL with explicit bytes to avoid any transformation
path = r'C:\Users\MSI Modern\Downloads\yuradvise\schema.sql'

# Build content with explicit unicode code points
# u=U+0075, u=U+0075 -> "uu" 
# We want: uuid_generate_v4 (with two u's)
sql = (
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\r\n'
    'CREATE TABLE users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email VARCHAR(255) UNIQUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);\r\n'
    'CREATE TABLE cases (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, category VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);\r\n'
    'CREATE TABLE queries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), case_id UUID REFERENCES cases(id) ON DELETE CASCADE, question_text TEXT NOT NULL, question_audio_url VARCHAR(512), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);\r\n'
    "CREATE TABLE advice (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), query_id UUID REFERENCES queries(id) ON DELETE CASCADE, advice_text TEXT NOT NULL, sources_json JSONB DEFAULT '[]'::jsonb, audio_url VARCHAR(512), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);\r\n"
    'CREATE TABLE jurisprudence (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), case_number VARCHAR(100) NOT NULL, court VARCHAR(255) NOT NULL, date DATE NOT NULL, summary TEXT NOT NULL, keywords VARCHAR(100)[], source_url VARCHAR(512), scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);\r\n'
    'CREATE INDEX idx_cases_user_id ON cases(user_id);\r\n'
    'CREATE INDEX idx_queries_case_id ON queries(case_id);\r\n'
    'CREATE INDEX idx_advice_query_id ON advice(query_id);\r\n'
    'CREATE INDEX idx_advice_sources ON advice USING GIN (sources_json);\r\n'
    'CREATE INDEX idx_jurisprudence_case_number ON jurisprudence(case_number);\r\n'
    'CREATE INDEX idx_jurisprudence_court ON jurisprudence(court);\r\n'
    'CREATE INDEX idx_jurisprudence_keywords ON jurisprudence USING GIN (keywords);\r\n'
)

# Verify BEFORE writing
wrong = sql.count('uid_generate_v4')
correct = sql.count('uuid_generate_v4')
print(f"Before write - wrong: {wrong}, correct: {correct}")

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(sql)

# Verify AFTER writing
with open(path, 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8')
wrong2 = text.count('uid_generate_v4')
correct2 = text.count('uuid_generate_v4')
print(f"After write - wrong: {wrong2}, correct: {correct2}")
print(f"File size: {len(raw)} bytes")
print(f"First 100 bytes hex: {raw[:100].hex()}")
