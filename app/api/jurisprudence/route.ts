import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('jurisprudence')
      .select('case_number, court, date, summary, keywords, source_url')
      .limit(10)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching jurisprudence:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}
