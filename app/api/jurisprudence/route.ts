import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Fetch from Supabase
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('jurisprudence')
        .select('case_number, court, date, summary, keywords, source_url')
        .order('id', { ascending: false })
        .limit(10)

      if (error) throw error

      // Add relevance_score for frontend compatibility
      const dataWithScore = data?.map((item: any) => ({
        ...item,
        relevance_score: 0.85 + Math.random() * 0.14
      }))
      return NextResponse.json(dataWithScore)
    }

    // If Supabase not available, return empty (no mock data)
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}
