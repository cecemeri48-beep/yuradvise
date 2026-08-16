import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Mock jurisprudence data for when Supabase is not available
const mockJurisprudence = [
  { case_number: '123/Pdt.Gugatan/2023/PN.JKT.PST', court: 'PN Jakarta Selatan', date: '2023-05-15', summary: 'Sengketa waris tanah antar saudara', keywords: ['waris', 'tanah', 'perdata'], source_url: 'https://www.hukumonline.com', relevance_score: 0.95 },
  { case_number: '456/Pid.B/2022/PN.SBY', court: 'PN Surabaya', date: '2022-11-20', summary: 'Tindak pidana penganiayaan ringan', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.88 },
  { case_number: '789/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-08-10', summary: 'Perceraian karena perselisihan berkepanjangan', keywords: ['perceraian', 'keluarga'], source_url: 'https://www.hukumonline.com', relevance_score: 0.92 },
  { case_number: '01/Pid.Sus/2021/PN.Mdg', court: 'PN Makassar', date: '2021-03-15', summary: 'Tindak pidana korupsi pengadaan barang milik daerah. Hukuman 5 tahun penjara.', keywords: ['korupsi', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.90 },
  { case_number: '23/Pdt.Gugatan/2022/PN.BTN', court: 'PN Banten', date: '2022-07-20', summary: 'Gugatan pembatalan perjanjian jual beli tanah karena penipuan.', keywords: ['perdata', 'tanah', 'penipuan'], source_url: 'https://www.hukumonline.com', relevance_score: 0.87 },
]

export async function GET() {
  try {
    // If Supabase is available, use it
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

    // Fallback: return mock data sorted by relevance
    const sorted = [...mockJurisprudence].sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))
    return NextResponse.json(sorted)
  } catch (error) {
    console.error('Error fetching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}
