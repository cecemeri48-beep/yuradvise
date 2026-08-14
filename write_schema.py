# Write SQL file with correct uuid_generate_v4 everywhere
lines = [
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    'CREATE TABLE users (id UUID PRIMARY KEY DEFAULT uid_generate_v4(), email VARCHAR(255) UNIQUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);',
    'CREATE TABLE cases (id UUID PRIMARY KEY DEFAULT uid_generate_v4(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, category VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);',
    'CREATE TABLE queries (id UUID PRIMARY KEY DEFAULT uid_generate_v4(), case_id UUID REFERENCES cases(id) ON DELETE CASCADE, question_text TEXT NOT NULL, question_audio_url VARCHAR(512), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);',
    "CREATE TABLE advice (id UUID PRIMARY KEY DEFAULT uid_generate_v4(), query_id UUID REFERENCES queries(id) ON DELETE CASCADE, advice_text TEXT NOT NULL, sources_json JSONB DEFAULT '[]'::jsonb, audio_url VARCHAR(512), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);",
    'CREATE TABLE jurisprudence (id UUID PRIMARY KEY DEFAULT uid_generate_v4(), case_number VARCHAR(100) NOT NULL, court VARCHAR(255) NOT NULL, date DATE NOT NULL, summary TEXT NOT NULL, keywords VARCHAR(100)[], source_url VARCHAR(512), scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);',
    'CREATE INDEX idx_cases_user_id ON cases(user_id);',
    'CREATE INDEX idx_queries_case_id ON queries(case_id);',
    'CREATE INDEX idx_advice_query_id ON advice(query_id);',
    'CREATE INDEX idx_advice_sources ON advice USING GIN (sources_json);',
    'CREATE INDEX idx_jurisprudence_case_number ON jurisprudence(case_number);',
    'CREATE INDEX idx_jurisprudence_court ON jurisprudence(court);',
    'CREATE INDEX idx_jurisprudence_keywords ON jurisprudence USING GIN (keywords);',
]

with open(r'C:\Users\MSI Modern\Downloads\yuradvise\schema.sql', 'w', encoding='utf-8', newline='') as f:
    for line in lines:
        f.write(line + '\r\n')

# Verify
with open(r'C:\Users\MSI Modern\Downloads\yuradvise\schema.sql', 'rb') as f:
    content = f.read()

text = content.decode('utf-8')
wrong_count = text.count('uid_generate_v4')
correct_count = text.count('uuid_generate_v4')

print(f"Written file: {len(content)} bytes")
print(f"Wrong uid_generate_v4: {wrong_count}")
print(f"Correct uuid_generate_v4: {correct_count}")

if wrong_count == 0 and correct_count == 5:
    print("SUCCESS! File is correct.")
else:
    print("ERROR! File still has issues.")
