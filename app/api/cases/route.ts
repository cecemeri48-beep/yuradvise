import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CaseSchema } from '@/lib/validators'
import { randomUUID } from 'crypto'

// Mock data for when Supabase is not available
const mockCases = [
  { id: 1, title: 'Sengketa Waris Tanah', category: 'perdata' },
  { id: 2, title: 'Penganiayaan Ringan', category: 'pidana' },
  { id: 3, title: 'Permohonan Perceraian', category: 'keluarga' },
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validation = CaseSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validasi gagal' },
        { status: 400 }
      )
    }
    
    const { title, category, question } = validation.data

    // If Supabase is available, use it
    if (supabaseAdmin) {
      const { data: caseData, error: caseError } = await supabaseAdmin
        .from('cases')
        .insert({ title, category })
        .select()
        .single()

      if (caseError) throw caseError

      const { data: queryData, error: queryError } = await supabaseAdmin
        .from('queries')
        .insert({ case_id: caseData.id, question_text: question })
        .select()
        .single()

      if (queryError) throw queryError

      return NextResponse.json({ 
        caseId: caseData.id, 
        queryId: queryData.id 
      })
    }

    // Fallback: return mock IDs
    return NextResponse.json({ 
      caseId: Date.now(), 
      queryId: randomUUID()
    })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json({ error: 'Gagal membuat kasus' }, { status: 500 })
  }
}
