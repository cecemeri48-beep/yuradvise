import { NextResponse } from 'next/server'
import { generateAllEmbeddings } from '@/lib/rag-pipeline'

/**
 * POST /api/embeddings
 * Generate and store embeddings for all jurisprudence records using Google Gemini (FREE)
 */
export async function POST() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  
  if (!apiKey || apiKey === 'your-gemini-key-here') {
    return NextResponse.json(
      { error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured. Please set it in your .env.local file.' },
      { status: 500 }
    )
  }

  try {
    const result = await generateAllEmbeddings()
    
    return NextResponse.json({
      message: 'Embedding generation completed',
      result,
    })
  } catch (error) {
    console.error('Embedding generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate embeddings', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/embeddings/stats
 * Check embedding statistics
 */
export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: total } = await supabase
      .from('jurisprudence')
      .select('id', { count: 'exact', head: true })
    
    const { data: withEmbedding } = await supabase
      .from('jurisprudence')
      .select('id', { count: 'exact', head: true })
      .not('embedding', 'is', null)
    
    const totalCount = Number(total || 0)
    const withCount = Number(withEmbedding || 0)
    
    return NextResponse.json({
      total: totalCount,
      withEmbeddings: withCount,
      withoutEmbeddings: totalCount - withCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get stats', details: String(error) },
      { status: 500 }
    )
  }
}
