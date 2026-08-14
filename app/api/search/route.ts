import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Mock jurisprudence data for when Supabase is not available
const mockJurisprudence = [
  { case_number: '123/Pdt.Gugatan/2023/PN.JKT.PST', court: 'PN Jakarta Selatan', date: '2023-05-15', summary: 'Sengketa waris tanah antar saudara. Anak yatim berhak atas warisan meski belum dewasa.', keywords: ['waris', 'tanah', 'perdata'], source_url: 'https://www.hukumonline.com', relevance_score: 0.95 },
  { case_number: '456/Pid.B/2022/PN.SBY', court: 'PN Surabaya', date: '2022-11-20', summary: 'Tindak pidana penganiayaan ringan. Pelaku dihukum 3 bulan pidana penjara.', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.88 },
  { case_number: '789/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-08-10', summary: 'Perceraian karena perselisihan berkepanjangan. Hak asuh anak diberikan kepada ibu.', keywords: ['perceraian', 'keluarga'], source_url: 'https://www.hukumonline.com', relevance_score: 0.92 },
  { case_number: '01/Pid.Sus/2021/PN.Mdg', court: 'PN Makassar', date: '2021-03-15', summary: 'Tindak pidana korupsi pengadaan barang milik daerah. Hukuman 5 tahun penjara.', keywords: ['korupsi', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.90 },
  { case_number: '23/Pdt.Gugatan/2022/PN.BTN', court: 'PN Banten', date: '2022-07-20', summary: 'Gugatan pembatalan perjanjian jual beli tanah karena penipuan.', keywords: ['perdata', 'tanah', 'penipuan'], source_url: 'https://www.hukumonline.com', relevance_score: 0.87 },
]

// Category to keyword mapping (no category column in DB)
const categoryKeywords: Record<string, string[]> = {
  pidana: ['pidana', 'korupsi', 'penganiayaan', 'pencurian', 'narkotika', 'pencucian uang', 'kekerasan rumah tangga', 'judi'],
  perdata: ['perdata', 'waris', 'tanah', 'gugatan', 'harta', 'perceraian', 'wasiat', 'penipuan'],
  keluarga: ['keluarga', 'perceraian', 'asuh anak', 'nafkah', 'wasiat'],
  ketenagakerjaan: ['ketenagakerjaan', 'pekerja', 'upah', 'PHK'],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')
  const category = searchParams.get('category')

  try {
    if (supabaseAdmin) {
      // Fetch all records (max 100 - small dataset)
      const { data, error } = await supabaseAdmin
        .from('jurisprudence')
        .select('case_number, court, date, summary, keywords, source_url')
        .limit(100)

      if (error) {
        console.error('Supabase fetch error:', error.message)
        return NextResponse.json([], { status: 500 })
      }

      let results: any[] = data ?? []

      // Filter by category using keyword overlap
      if (category && categoryKeywords[category]) {
        const catKeywords = categoryKeywords[category]
        results = results.filter((item: any) =>
          item.keywords?.some((k: string) =>
            catKeywords.some((ck: string) => k.toLowerCase() === ck.toLowerCase())
          )
        )
      }

      // Text search
      if (search) {
        const searchLower = search.toLowerCase()
        results = results.filter((item: any) =>
          item.summary?.toLowerCase().includes(searchLower) ||
          item.keywords?.some((k: string) => k.toLowerCase().includes(searchLower))
        )
      }

      return NextResponse.json(results)
    }

    // No Supabase — return filtered mock data
    let results = mockJurisprudence

    if (category && categoryKeywords[category]) {
      const catKeywords = categoryKeywords[category]
      results = results.filter((item: any) =>
        item.keywords?.some((k: string) =>
          catKeywords.some((ck: string) => k.toLowerCase() === ck.toLowerCase())
        )
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      results = results.filter((item: any) =>
        item.summary?.toLowerCase().includes(searchLower) ||
        item.keywords?.some((k: string) => k.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mencari data' }, { status: 500 })
  }
}
