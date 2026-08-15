import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

// Advice templates based on category
const ADVICE_TEMPLATES = {
  pidana: {
    principles: [
      'Presumsi Tak Bersalah - Tersangka dianggap tidak bersalah hingga putusan pengadilan berkekuatan hukum tetap (Pasal 8 KUHAP)',
      'Hak atas Advokat - Tersangka berhak mendapat bantuan hukum sejak tahap penyidikan (Pasal 54 KUHAP)',
      'Penangkapan Prosedural - Penangkapan harus disertai Surat Perintah Penangkapan sesuai Pasal 17 KUHAP',
    ],
    steps: [
      'Segera konsultasi dengan advokat yang berpengalaman di bidang pidana',
      'Kumpulkan semua bukti dan dokumen terkait kasus',
      'Jangan menandatangani pernyataan apapun tanpa memahami isinya',
      'Catat kronologi lengkap dengan waktu dan saksi jika ada',
    ],
    disclaimer: 'Saran ini berdasarkan yurisprudensi pidana yang relevan, bukan pengganti konsultasi advokat profesional.',
  },
  perdata: {
    principles: [
      'Beban Pembuktian - Pihak yang mengajukan gugatan wajib membuktikan klaimnya (Pasal 157 HIR)',
      'Asas Kepastian Hukum - Perjanjian sah berlaku sebagai undang-undang bagi para pihak (Pasal 1338 KUHPer)',
      'Daluwarsa - Hak gugat dapat gugur jika terlambat memperkarakan (berbagai pasal KUHPerdata)',
    ],
    steps: [
      'Kumpulkan seluruh dokumen perjanjian, korespondensi, dan bukti kerugian',
      'Kirim surat teguran (somasi) secara tertulis sebelum Gugatan',
      'Pertimbangkan mediasi atau arbitrase sebagai alternatif penyelesaian',
      'Konsultasikan batas daluwarsa agar gugatan tidak batal',
    ],
    disclaimer: 'Saran ini berdasarkan yurisprudensi perdata yang relevan, bukan pengganti konsultasi advokat profesional.',
  },
  keluarga: {
    principles: [
      'Kepentingan Terbaik Anak - Hak asuh ditetapkan berdasarkan kepentingan anak (UU No. 35/2014)',
      'Hak Asuh Ibu - Anak di bawah 5 tahun berhak diasuh oleh ibu sebagai hak mutlak (Pasal 93 KHI)',
      'Pembagian Harta Bersama - Harta gono-gini dibagi setara kecuali ada perjanjian lain (Pasal 85 KHI)',
    ],
    steps: [
      'Prioritaskan musyawarah keluarga atau mediasi sebelum ke pengadilan',
      'Kumpulkan bukti penghidupan dan kemampuan merawat anak',
      'Untuk perceraian via PN, siapkan alasan sah sesuai Pasal 39 KHI',
      'Konsultasi hak nafkah, hak asuh, dan pembagian harta dengan konsultan',
    ],
    disclaimer: 'Saran ini berdasarkan yurisprudensi keluarga yang relevan, bukan pengganti konsultasi advokat profesional.',
  },
  ketenagakerjaan: {
    principles: [
      'PHK Harus Dengan Alasan Sah - Pemutusan hubungan kerja harus berdasarkan alasan yang sah sesuai UU Ketenagakerjaan',
      'Pesangon & Hak Lainnya - Pekerja yang dirumahkan berhak atas pesangon, uang penghargaan masa kerja, dan uang penggantian hak',
      'Bagi Hasil - Jika perusahaan rugi, PHK dapat dilakukan dengan kesepakatan bagi hasil',
    ],
    steps: [
      'Kumpulkan bukti hubungan kerja (kontrak, slip gaji, surat tugas)',
      'Hitung hak-hak Anda: pesangon, uang penghargaan masa kerja, uang penggantian hak',
      ' ajukan gugatan ke PH (Pengadilan Hubungan Industrial) jika tidak puas dengan pesangon',
      'Konsultasikan dengan serikat pekerja atau konsultan ketenagakerjaan',
    ],
    disclaimer: 'Saran ini berdasarkan yurisprudensi ketenagakerjaan yang relevan, bukan pengganti konsultasi advokat profesional.',
  },
  default: {
    principles: [
      'Prinsip Presumsi Tak Bersalah - Setiap orang dianggap tidak bersalah hingga terbukti menurut hukum',
      'Hak atas Bantuan Hukum - Tersangka berhak didampingi advokat sejak penyidikan (Pasal 54 KUHAP)',
      'Asas Legalitas - Tindak pidana hanya dapat dipidana jika diatur dalam undang-undang',
    ],
    steps: [
      'Konsultasikan dengan advokat atau LBH setempat',
      'Kumpulkan semua dokumen terkait kasus',
      'Jangan menandatangani dokumen tanpa memahami isinya',
      'Catat seluruh kronologi kejadian',
    ],
    disclaimer: 'Saran ini berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional.',
  },
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { question_text, category, case_id, query_id } = body

    // Determine which template to use based on category
    let templateKey = 'default' as keyof typeof ADVICE_TEMPLATES
    if (category === 'pidana') templateKey = 'pidana'
    else if (category === 'perdata') templateKey = 'perdata'
    else if (category === 'keluarga') templateKey = 'keluarga'
    else if (category === 'ketenagakerjaan') templateKey = 'ketenagakerjaan'

    const template = ADVICE_TEMPLATES[templateKey]

    // Build dynamic advice based on category and question
    const adviceText = `Saran Hukum untuk Kasus ${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Hukum'}\n\n` +
      `Berdasarkan analisis terhadap "${question_text}", berikut saran hukum yang relevan:\n\n` +
      `**Prinsip Hukum yang Berlaku:**\n` +
      template.principles.map((p, i) => `${i + 1}. ${p}`).join('\n') +
      `\n\n**Langkah Hukum yang Disarankan:**\n` +
      template.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\n*Disclaimer: ${template.disclaimer}*`

    // Try to save to Supabase if available
    if (supabaseAdmin && question_text) {
      try {
        // Create or use query_id
        const finalQueryId = query_id || randomUUID()
        
        // Insert advice record
        const { error: adviceError } = await supabaseAdmin
          .from('advice')
          .insert({
            query_id: finalQueryId,
            advice_text: adviceText,
            sources_json: JSON.stringify([
              { type: 'prinsip', title: template.principles[0] },
              { type: 'prinsip', title: template.principles[1] },
              { type: 'prinsip', title: template.principles[2] },
            ]),
          })

        if (adviceError) {
          console.error('Failed to save advice:', adviceError)
        }
      } catch (dbError) {
        console.log('DB insert skipped:', String(dbError))
      }
    }

    return NextResponse.json({ advice: adviceText })
  } catch (error) {
    console.error('Error generating advice:', error)
    return NextResponse.json(
      { advice: 'Mohon maaf, terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
