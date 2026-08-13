import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Mock jurisprudence data for when Supabase is not available
const mockJurisprudence = [
  { case_number: '123/Pdt.Gugatan/2023/PN.JKT.PST', court: 'PN Jakarta Selatan', date: '2023-05-15', summary: 'Sengketa waris tanah antar saudara', keywords: ['waris', 'tanah', 'perdata'], source_url: 'https://www.hukumonline.com', relevance_score: 0.95 },
  { case_number: '456/Pid.B/2022/PN.SBY', court: 'PN Surabaya', date: '2022-11-20', summary: 'Tindak pidana penganiayaan ringan', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.88 },
  { case_number: '789/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-08-10', summary: 'Perceraian karena perselisihan berkepanjangan', keywords: ['perceraian', 'keluarga'], source_url: 'https://www.hukumonline.com', relevance_score: 0.92 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')
  const category = searchParams.get('category')

  try {
    // If Supabase is available, use it
    if (supabaseAdmin) {
      let query = supabaseAdmin
        .from('jurisprudence')
        .select('case_number, court, date, summary, keywords, source_url, relevance_score')

      if (category) {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.or(`keywords.cs.${search},summary.ilike.%${search}%`)
      }

      const { data, error } = await query.limit(20)

      if (error) throw error
      return NextResponse.json(data)
    }

    // Fallback: filter mock data
    let results = mockJurisprudence

    if (category) {
      results = results.filter(item => item.keywords.some((k: string) => k.includes(category.toLowerCase())))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      results = results.filter(item => 
        item.summary.toLowerCase().includes(searchLower) ||
        item.keywords.some((k: string) => k.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mencari data' }, { status: 500 })
  }
}
