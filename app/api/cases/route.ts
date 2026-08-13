import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, question } = body

    // Create case
    const { data: caseData, error: caseError } = await supabaseAdmin
      .from('cases')
      .insert({ title, category })
      .select()
      .single()

    if (caseError) throw caseError

    // Create query
    const { data: queryData, error: queryError } = await supabaseAdmin
      .from('queries')
      .insert({ case_id: caseData.id, question_text: question })
      .select()
      .single()

    if (queryError) throw queryError

    return NextResponse.json({ caseId: caseData.id, queryId: queryData.id })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json({ error: 'Gagal membuat kasus' }, { status: 500 })
  }
}
