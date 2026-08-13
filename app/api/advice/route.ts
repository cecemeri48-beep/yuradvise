import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { case_id, question_text } = body

    // Simulate AI advice generation
    // In production, this would call OpenAI API with RAG context
    const mockAdvice = `Berdasarkan yurisprudensi yang tersedia, kasus Anda terkait "${question_text}". 

Saya menemukan beberapa referensi yurisprudensi yang relevan:

1. **Prinsip Presumsi Tak Bersalah** - Tersangka dianggap tidak bersalah hingga putusan pengadilan berkekuatan hukum tetap.

2. **Hak atas Bantuan Hukum** - Tersangka berhak didampingi advokat sejak tahap penyidikan sesuai Pasal 54 KUHAP.

3. **Penangkapan Prosedural** - Penangkapan harus disertai Surat Perintah Penangkapan (SPP) sesuai Pasal 17 KUHAP.

Untuk langkah hukum selanjutnya, saya sarankan:
- Konsultasikan dengan advokat atau LBH setempat
- Kumpulkan semua dokumen terkait kasus
- Jangan menandatangani dokumen tanpa memahami isinya

*Disclaimer: Ini adalah saran hukum berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional.*`

    const { data: adviceData, error: adviceError } = await supabaseAdmin
      .from('advice')
      .insert({ 
        query_id: case_id, 
        advice_text: mockAdvice,
        sources_json: JSON.stringify([
          { type: 'yurisprudensi', title: 'Prinsip Presumsi Tak Bersalah' },
          { type: 'regulasi', title: 'Pasal 54 KUHAP' },
        ])
      })
      .select()
      .single()

    if (adviceError) throw adviceError

    return NextResponse.json({ advice: adviceData })
  } catch (error) {
    console.error('Error generating advice:', error)
    return NextResponse.json({ error: 'Gagal menghasilkan advice' }, { status: 500 })
  }
}
