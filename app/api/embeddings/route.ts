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
    
    console.log('DEBUG: Supabase URL present:', !!supabaseUrl)
    console.log('DEBUG: Service key present:', !!supabaseServiceKey)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // First, check total count
    const { count: totalCount, error: countError } = await supabase
      .from('jurisprudence')
      .select('*', { count: 'exact', head: true })
    
    console.log('DEBUG: Total count:', totalCount, 'Error:', countError)
    
    if (countError) {
      return NextResponse.json({ error: 'Failed to get total count', details: countError.message }, { status: 500 })
    }
    
    // Check how many have embeddings
    const { count: withEmbedding, error: embedError } = await supabase
      .from('jurisprudence')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)
    
    console.log('DEBUG: With embedding count:', withEmbedding, 'Error:', embedError)
    
    if (embedError) {
      return NextResponse.json({ error: 'Failed to get embedding count', details: embedError.message }, { status: 500 })
    }
    
    const total = Number(totalCount || 0)
    const withCount = Number(withEmbedding || 0)
    
    console.log('DEBUG: Final stats - total:', total, 'withEmbeddings:', withCount)
    
    return NextResponse.json({
      total,
      withEmbeddings: withCount,
      withoutEmbeddings: total - withCount,
    })
  } catch (error) {
    console.error('Embeddings stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get stats', details: String(error) },
      { status: 500 }
    )
  }
}
