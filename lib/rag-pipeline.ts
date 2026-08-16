/**
 * RAG Pipeline - Advanced Semantic Search for Legal Documents
 * Uses Google Gemini embeddings + pgvector for semantic jurisprudence search
 */

import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build errors when env vars are missing
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

function getGeminiApiKey() {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
}

const _supabase = getSupabase()
const _geminiApiKey = getGeminiApiKey()

// Configuration
const EMBEDDING_MODEL = 'text-embedding-004' // Gemini 2.0 Flash Embedding (1536 dims)
const MATCH_THRESHOLD = 0.7 // Minimum cosine similarity
const MAX_RESULTS = 5

export interface JurisprudenceEmbedding {
  id: number
  case_number: string
  court: string
  date: string
  summary: string
  keywords: string[]
  source_url: string
  category?: string
  embedding?: number[]
}

export interface MatchedJurisprudence {
  id: number
  case_number: string
  court: string
  date: string
  summary: string
  keywords: string[]
  source_url: string
  category?: string
  similarity: number
  match_score: number
  matched_keywords: string[]
}

/**
 * Generate embeddings for all jurisprudence records
 * Run this once after migration to populate vector embeddings
 */
export async function generateAllEmbeddings(): Promise<{
  total: number
  success: number
  failed: number
  errors: string[]
}> {
  const geminiKey = getGeminiApiKey()
  if (!geminiKey) {
    return { total: 0, success: 0, failed: 0, errors: ['GOOGLE_GENERATIVE_AI_API_KEY not configured'] }
  }
  
  const supabase = getSupabase()
  if (!supabase) {
    return { total: 0, success: 0, failed: 1, errors: ['Supabase not configured'] }
  }

  // Fetch all jurisprudence without embeddings
  const { data: records, error } = await supabase
    .from('jurisprudence')
    .select('id, case_number, court, date, summary, keywords, source_url, category')
    .is('embedding', null)

  if (error) {
    return { total: 0, success: 0, failed: 1, errors: [error.message] }
  }

  const total = records?.length || 0
  let success = 0
  let failed = 0
  const errors: string[] = []

  // Process in batches of 10
  const batchSize = 10
  for (let i = 0; i < total; i += batchSize) {
    const batch = records?.slice(i, i + batchSize) || []
    
    for (const record of batch) {
      try {
        // Combine text for better embedding quality
        const textToEmbed = [
          record.case_number,
          record.summary,
          ...(record.keywords || []),
          ...(record.category ? [record.category] : [])
        ].join('. ')

        const embedding = await generateEmbedding(textToEmbed, geminiKey)
        
        if (embedding) {
          const { error: updateError } = await supabase
            .from('jurisprudence')
            .update({ embedding })
            .eq('id', record.id)
          
          if (updateError) {
            failed++
            errors.push(`Failed to update record ${record.id}: ${updateError.message}`)
          } else {
            success++
          }
        } else {
          failed++
          errors.push(`Failed to generate embedding for record ${record.id}`)
        }

        // Rate limiting: OpenAI allows 3 RPM for small model
        await sleep(2000)
      } catch (err) {
        failed++
        errors.push(`Error processing record ${record.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  return { total, success, failed, errors }
}

/**
 * Generate embedding using Google Gemini API (FREE)
 */
async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${EMBEDDING_MODEL}`,
          content: {
            parts: [{ text }],
          },
          taskType: 'RETRIEVAL_DOCUMENT',
          outputDimensionality: 1536,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini Embedding Error:', error)
      return null
    }

    const data = await response.json()
    return data.embedding?.values || null
  } catch (error) {
    console.error('Embedding generation failed:', error)
    return null
  }
}

/**
 * Semantic search for jurisprudence using vector similarity
 * This is the core RAG retrieval function
 */
export async function semanticSearch(
  query: string,
  category?: string
): Promise<MatchedJurisprudence[]> {
  const geminiKey = getGeminiApiKey()
  if (!geminiKey) {
    return keywordSearch(query, category)
  }
  
  const supabase = getSupabase()
  if (!supabase) {
    return keywordSearch(query, category)
  }

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, geminiKey)
    
    if (!queryEmbedding) {
      return keywordSearch(query, category)
    }

    // Use PostgreSQL vector similarity search
    const { data: results, error } = await supabase.rpc('match_jurisprudence', {
      query_embedding: queryEmbedding,
      match_threshold: MATCH_THRESHOLD,
      match_count: MAX_RESULTS,
      filter_category: category || null,
    })

    if (error) {
      console.error('Vector search error:', error)
      return keywordSearch(query, category)
    }

    if (!results || results.length === 0) {
      return keywordSearch(query, category)
    }

    // Transform results to our format
    return results.map((r: any) => ({
      id: r.id,
      case_number: r.case_number,
      court: r.court,
      date: r.date?.toString() || '',
      summary: r.summary,
      keywords: r.keywords || [],
      source_url: r.source_url || '',
      category: r.category,
      similarity: parseFloat(r.similarity.toFixed(4)),
      match_score: parseFloat(r.similarity.toFixed(4)),
      matched_keywords: extractMatchedKeywords(query, r.summary, r.keywords),
    }))
  } catch (error) {
    console.error('Semantic search failed:', error)
    return keywordSearch(query, category)
  }
}

/**
 * Fallback keyword-based search
 */
async function keywordSearch(query: string, category?: string): Promise<MatchedJurisprudence[]> {
  let filter: any = {}
  if (category) {
    filter.category = category
  }

  const sb = getSupabase()
  if (!sb) return []

  const { data: records, error } = await sb
    .from('jurisprudence')
    .select('id, case_number, court, date, summary, keywords, source_url, category')
    .filter('case_number', 'ilike', `%${query.split(' ')[0]}%`)
    .limit(MAX_RESULTS)

  if (error || !records) {
    return []
  }

  const questionLower = query.toLowerCase()
  
  return records.map((record: any) => {
    let matchScore = 0
    const matchedKeywords: string[] = []
    
    // Check keywords
    for (const kw of record.keywords || []) {
      if (questionLower.includes(kw.toLowerCase())) {
        matchScore += 2
        matchedKeywords.push(kw)
      }
    }
    
    // Check summary
    const summaryLower = (record.summary || '').toLowerCase()
    if (summaryLower.includes(questionLower)) {
      matchScore += 3
    }
    
    return {
      id: record.id,
      case_number: record.case_number,
      court: record.court,
      date: record.date?.toString() || '',
      summary: record.summary,
      keywords: record.keywords || [],
      source_url: record.source_url || '',
      category: record.category,
      similarity: Math.min(matchScore / 5, 1),
      match_score: matchScore,
      matched_keywords: matchedKeywords,
    }
  }).sort((a: any, b: any) => b.match_score - a.match_score)
}

/**
 * Extract keywords that matched between query and jurisprudence
 */
function extractMatchedKeywords(query: string, summary: string, keywords: string[]): string[] {
  const queryLower = query.toLowerCase()
  const summaryLower = (summary || '').toLowerCase()
  const matched: string[] = []
  
  for (const kw of keywords) {
    const kwLower = kw.toLowerCase()
    if (queryLower.includes(kwLower) || summaryLower.includes(kwLower)) {
      matched.push(kw)
    }
  }
  
  return matched
}

/**
 * Generate AI-powered legal advice based on RAG results
 */
export async function generateLegalAdvice(
  matchedCases: MatchedJurisprudence[],
  category: string,
  question: string
): Promise<{
  advice: string
  note: string
  sources: string[]
  confidence: number
}> {
  const geminiKey = getGeminiApiKey()
  if (!geminiKey || matchedCases.length === 0) {
    return {
      advice: generateFallbackAdvice(category, question),
      note: 'RAG search unavailable. Using generic legal principles.',
      sources: [],
      confidence: 0.3,
    }
  }

  // Build context from matched cases
  const context = matchedCases.map((c, i) => 
    `${i + 1}. ${c.case_number} (${c.court}, ${c.date})\n   ${c.summary}\n   Keywords: ${c.matched_keywords.join(', ')}`
  ).join('\n\n')

  const prompt = `You are a helpful Indonesian legal assistant. Based on the following jurisprudence cases and the user's question, provide practical legal advice in Indonesian.

USER QUESTION: ${question}
CATEGORY: ${category}

RELEVANT JURISPRUDENCE:
${context}

Provide your advice in Indonesian following this structure:
1. Start with a brief analysis of the legal situation
2. Reference the most relevant case(s)
3. Provide actionable recommendations
4. Include relevant legal provisions if applicable
5. Add a disclaimer that this is informational only

Format your response clearly with headings and bullet points where appropriate.`

  try {
    // Use Google Gemini Flash for advice generation (FREE)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Gemini API error')
    }

    const data = await response.json()
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Calculate confidence based on similarity scores
    const avgSimilarity = matchedCases.reduce((sum, c) => sum + c.similarity, 0) / matchedCases.length
    const confidence = Math.round(avgSimilarity * 100)

    return {
      advice,
      note: `Diasaskan pada ${matchedCases.length} putusan pengadilan relevan dengan tingkat kecocokan ${confidence}%`,
      sources: matchedCases.map(c => c.source_url).filter(Boolean),
      confidence,
    }
  } catch (error) {
    console.error('Advice generation failed:', error)
    return {
      advice: generateFallbackAdvice(category, question),
      note: 'Gagal menghasilkan advice AI. Menggunakan template hukum umum.',
      sources: matchedCases.map(c => c.source_url).filter(Boolean),
      confidence: 0.5,
    }
  }
}

function generateFallbackAdvice(category: string, question: string): string {
  const base = `Berdasarkan kategori ${category} terkait "${question}":\n\n`
  
  const adviceMap: Record<string, string> = {
    pidana: `1. Segera buat laporan polisi jika belum dilaporkan
2. Mintalah pendampingan advokat sesuai KUHAP Pasal 54
3. Kumpulkan semua bukti dan dokumen terkait
4. Pahami hak-hak Anda sebagai tersangka/terdakwa
5. Pertimbangkan upaya damai jika memungkinkan`,
    perdata: `1. Kumpulkan semua dokumen perjanjian dan bukti transaksi
2. Kirim somasi tertulis sebagai upaya damai
3. Hitung nilai gugatan dan kerugian yang dialami
4. Pahami batas daluwarsa sesuai KUHPerdata
5. Pertimbangkan mediasi sebelum gugatan`,
    keluarga: `1. Utamakan musyawarah untuk menyelesaikan perbedaan
2. Pahami ketentuan KHI atau KUHPerdata yang berlaku
3. Siapkan dokumen pernikahan dan akta kelahiran
4. Pertimbangkan hak asuh berdasarkan kepentingan anak
5. Dapatkan pendampingan konselor jika diperlukan`,
  }

  return base + (adviceMap[category] || 'Konsultasikan dengan advokat untuk penanganan hukum yang tepat.')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
