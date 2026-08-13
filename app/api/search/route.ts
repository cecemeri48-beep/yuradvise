import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')
  const category = searchParams.get('category')

  try {
    let query = supabaseAdmin
      .from('jurisprudence')
      .select('case_number, court, date, summary, keywords, source_url, relevance_score')

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      // Simple keyword search (full-text search can be added later)
      query = query.or(`keywords.cs.${search},summary.ilike.%${search}%`)
    }

    const { data, error } = await query.limit(20)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mencari data' }, { status: 500 })
  }
}
