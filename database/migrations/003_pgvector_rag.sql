-- Migration: Enable pgvector extension and add embeddings
-- Run this in Supabase SQL Editor BEFORE seeding data

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding column to jurisprudence table
ALTER TABLE jurisprudence ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create index for fast vector similarity search
CREATE INDEX IF NOT EXISTS jurisprudence_embedding_idx ON jurisprudence 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 4. Create function for semantic search
CREATE OR REPLACE FUNCTION match_jurisprudence(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id bigint,
  case_number text,
  court text,
  date date,
  summary text,
  keywords text[],
  source_url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.case_number,
    j.court,
    j.date,
    j.summary,
    j.keywords,
    j.source_url,
    1 - (j.embedding <=> query_embedding) AS similarity
  FROM jurisprudence j
  WHERE 
    (filter_category IS NULL OR j.category = filter_category)
    AND (1 - (j.embedding <=> query_embedding)) > match_threshold
  ORDER BY j.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Stats check
DO $$
DECLARE
  count_before int;
BEGIN
  SELECT COUNT(*) INTO count_before FROM jurisprudence;
  RAISE NOTICE 'Current jurisprudence records: %', count_before;
  RAISE NOTICE 'Migration complete. Run POST /api/embeddings to generate vectors.';
END $$;
