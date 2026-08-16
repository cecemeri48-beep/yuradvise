/**
 * RAG Pipeline - Advanced Semantic Search for Legal Documents
 * Uses Nomic/HuggingFace embeddings + pgvector for semantic jurisprudence search
 * Fallback: Keyword-based search if no embedding API available
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

// Embedding API configuration - try multiple free providers
function getEmbeddingApiKey() {
  // Priority: Nomic > HuggingFace > Gemini
  return process.env.NOMIC_API_KEY ||
         process.env.HUGGINGFACE_API_KEY ||
         process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
}

// AI model configuration for advice generation
function getAIProviderKey() {
  // Priority: adaCODE (OpenAI-compatible) > Gemini
  return process.env.OPENAI_API_KEY ||
         process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
}

const AI_MODEL = 'claude-sonnet-4-6' // Default free model via adaCODE
const AI_BASE_URL = process.env.OPENAI_API_KEY
  ? 'https://api.adacode.ai/v1' // adaCODE uses OpenAI-compatible endpoint
  : ''

const _supabase = getSupabase()
const _embeddingApiKey = getEmbeddingApiKey()

// Configuration
const EMBEDDING_PROVIDER = process.env.NOMIC_API_KEY ? 'nomic' : 
                          process.env.HUGGINGFACE_API_KEY ? 'huggingface' : 'gemini'
const EMBEDDING_MODEL = 'nomic-embed-text-v1' // Free, 768 dims
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
  const apiKey = getEmbeddingApiKey()
  if (!apiKey) {
    return { total: 0, success: 0, failed: 0, errors: ['No embedding API key configured. Using keyword fallback.'] }
  }
  
  const supabase = getSupabase()
  if (!supabase) {
    return { total: 0, success: 0, failed: 1, errors: ['Supabase not configured'] }
  }

  // Fetch all jurisprudence without embeddings
  const { data: records, error } = await supabase
    .from('jurisprudence')
    .select('id, case_number, court, date, summary, keywords, source_url')
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
        ].join('. ')

        const embedding = await generateEmbedding(textToEmbed, apiKey)
        
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
 * Generate embedding using various free APIs with fallback
 */
async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  // Try Nomic API first
  if (EMBEDDING_PROVIDER === 'nomic' || process.env.NOMIC_API_KEY) {
    try {
      const response = await fetch('https://api.nomic.ai/v1/embeddings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'nomic-embed-text-v1',
          input: text
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.data?.[0]?.embedding || null
      }
    } catch (e) {
      console.log('Nomic failed, trying next provider...')
    }
  }
  
  // Try HuggingFace Inference API
  if (EMBEDDING_PROVIDER === 'huggingface' || process.env.HUGGINGFACE_API_KEY) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ inputs: text })
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        // HuggingFace returns array of arrays
        return Array.isArray(data) ? data[0] : null
      }
    } catch (e) {
      console.log('HuggingFace failed, trying next provider...')
    }
  }
  
  // Fallback to Gemini (last resort)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: {
              parts: [{ text }],
            },
            taskType: 'RETRIEVAL_DOCUMENT',
          }),
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        return data.embedding?.values || null
      }
    } catch (e) {
      console.log('Gemini failed as well')
    }
  }
  
  return null
}

/**
 * Semantic search for jurisprudence using vector similarity
 * This is the core RAG retrieval function
 */
export async function semanticSearch(
  query: string,
  category?: string
): Promise<MatchedJurisprudence[]> {
  const apiKey = getEmbeddingApiKey()
  if (!apiKey) {
    return keywordSearch(query, category)
  }
  
  const supabase = getSupabase()
  if (!supabase) {
    return keywordSearch(query, category)
  }

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, apiKey)
    
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
  const embeddingKey = getEmbeddingApiKey()
  const aiKey = getAIProviderKey()

  // Require both embedding API (for search) and AI provider (for advice generation)
  if ((!embeddingKey && !aiKey) || matchedCases.length === 0) {
    return {
      advice: generateFallbackAdvice(category, question),
      note: 'AI services unavailable. Using generic legal principles.',
      sources: [],
      confidence: 0.3,
    }
  }

  // Build context from matched cases
  const context = matchedCases.map((c, i) =>
    `${i + 1}. ${c.case_number} (${c.court}, ${c.date})\n   ${c.summary}\n   Keywords: ${c.matched_keywords.join(', ')}`
  ).join('\n\n')

  const prompt = `Anda adalah asisten hukum Indonesia yang berpengalaman. Berikan saran hukum yang detail, kontekstual, dan dapat ditindaklanjuti berdasarkan kasus yurisprudensi berikut dan pertanyaan pengguna.

PERTANYAAN PENGGUNA: ${question}
KATEGORI: ${category}

YURISPRUDENSI RELEVAN:
${context}

Format respons Anda dalam bahasa Indonesia yang formal namun mudah dipahami, dengan struktur:
1. **Analisis Situasi** — ringkasan masalah hukum pengguna
2. **Dasar Hukum** — sebutkan pasal/undang-undang yang relevan
3. **Yurisprudensi Pendukung** — referensikan kasus pengadilan yang mirip
4. **Langkah Praktis** — rekomendasi konkret yang bisa dilakukan (minimal 5 langkah)
5. **⚠️ Perhatian** — warning penting yang perlu diwaspadai
6. **Disclaimer** — pernyataan bahwa ini informasi hukum, bukan pengganti konsultasi advokat

Pastikan saran bersifat spesifik untuk kasus ini, bukan template umum. Sertakan nomor pasal dan undang-undang yang tepat. Maksimal 600 kata.`

  if (aiKey) {
    try {
      let advice = ''

      // Try adaCODE (OpenAI-compatible) first
      if (process.env.OPENAI_API_KEY) {
        const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiKey}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          advice = data.choices?.[0]?.message?.content || ''
        }
      }

      // Fallback to Gemini if adaCODE fails
      if (!advice && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
            }),
          }
        )
        if (response.ok) {
          const data = await response.json()
          advice = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        }
      }

      if (advice && advice.trim().length > 100) {
        const avgSimilarity = matchedCases.reduce((sum, c) => sum + c.similarity, 0) / matchedCases.length
        const confidence = Math.round(avgSimilarity * 100)

        return {
          advice,
          note: `Diasaskan pada ${matchedCases.length} putusan pengadilan relevan dengan tingkat kecocokan ${confidence}%`,
          sources: matchedCases.map(c => c.source_url).filter(Boolean),
          confidence,
        }
      }
    } catch (error) {
      console.error('AI advice generation failed:', error)
    }
  }

  // Final fallback: template-based advice
  return {
    advice: generateFallbackAdvice(category, question),
    note: 'AI services unavailable. Using generic legal principles.',
    sources: [],
    confidence: 0.3,
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
