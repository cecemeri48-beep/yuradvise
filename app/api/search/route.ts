import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { filterByCategory, searchByText, sortRelevance, filterByCourt } from '@/lib/search-utils'

// Mock jurisprudence data for when Supabase is not available
const mockJurisprudence = [
  { case_number: '123/Pdt.Gugatan/2023/PN.JKT.PST', court: 'PN Jakarta Selatan', date: '2023-05-15', summary: 'Sengketa waris tanah antar saudara. Anak yatim berhak atas warisan meski belum dewasa.', keywords: ['waris', 'tanah', 'perdata'], source_url: 'https://www.hukumonline.com', relevance_score: 0.95 },
  { case_number: '456/Pid.B/2022/PN.SBY', court: 'PN Surabaya', date: '2022-11-20', summary: 'Tindak pidana penganiayaan ringan. Pelaku dihukum 3 bulan pidana penjara.', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.88 },
  { case_number: '789/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-08-10', summary: 'Perceraian karena perselisihan berkepanjangan. Hak asuh anak diberikan kepada ibu.', keywords: ['perceraian', 'keluarga'], source_url: 'https://www.hukumonline.com', relevance_score: 0.92 },
  { case_number: '01/Pid.Sus/2021/PN.Mdg', court: 'PN Makassar', date: '2021-03-15', summary: 'Tindak pidana korupsi pengadaan barang milik daerah. Hukuman 5 tahun penjara.', keywords: ['korupsi', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.90 },
  { case_number: '23/Pdt.Gugatan/2022/PN.BTN', court: 'PN Banten', date: '2022-07-20', summary: 'Gugatan pembatalan perjanjian jual beli tanah karena penipuan.', keywords: ['perdata', 'tanah', 'penipuan'], source_url: 'https://www.hukumonline.com', relevance_score: 0.87 },
  { case_number: '45/Pdt.Gugatan/2023/PN.BDG', court: 'PN Bandung', date: '2023-02-14', summary: 'Sengketa warisan antara anak angkat dan anak kandung. Anak angkat memiliki hak waris jika telah diakui secara sah.', keywords: ['waris', 'perdata', 'keluarga'], source_url: 'https://www.hukumonline.com', relevance_score: 0.91 },
  { case_number: '78/Pid.B/2022/PN.SMG', court: 'PN Semarang', date: '2022-09-05', summary: 'Tindak pidana pencurian dengan pemberatan. Pelakuk dihukum 2 tahun penjara dan denda.', keywords: ['pencurian', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.85 },
  { case_number: '12/Pdt/PN.JKT', court: 'PN Jakarta Pusat', date: '2023-01-20', summary: 'Gugatan perceraian karena KDRT. Hakim mengabulkan gugatan dan menetapkan hak asuh anak pada ibu.', keywords: ['perceraian', 'keluarga', 'kdrt'], source_url: 'https://www.hukumonline.com', relevance_score: 0.93 },
  { case_number: '56/Pdt.S/2022/PN.JKT', court: 'PN Jakarta Selatan', date: '2022-12-10', summary: 'Sengketa tanah warisan antara saudara. Putusan bahwa pembagian harta warisan harus dilakukan secara adil.', keywords: ['waris', 'tanah', 'perdata'], source_url: 'https://www.hukumonline.com', relevance_score: 0.89 },
  { case_number: '90/Pid.B/2023/PN.YOG', court: 'PN Yogyakarta', date: '2023-03-25', summary: 'Tindak pidana penganiayaan berat. Pelaku dikenai hukuman 3 tahun penjara.', keywords: ['penganiayaan', 'pidana'], source_url: 'https://www.hukumonline.com', relevance_score: 0.86 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q') ?? undefined
  const category = searchParams.get('category') ?? undefined
  const court = searchParams.get('court') ?? undefined

  try {
    let results: any[]

    // Fetch from Supabase if available
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('jurisprudence')
        .select('id, case_number, court, date, summary, keywords, source_url')
        .limit(100)

      if (error) {
        console.error('Supabase fetch error:', error.message)
        return NextResponse.json([], { status: 500 })
      }

      results = data ?? []
    } else {
      results = mockJurisprudence
    }

    // Apply filters using shared utilities
    results = filterByCourt(results, court)
    results = filterByCategory(results, category)
    results = searchByText(results, search)
    results = sortRelevance(results)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mencari data' }, { status: 500 })
  }
}
