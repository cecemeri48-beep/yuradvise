import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { AdviceSchema } from '@/lib/validators'
import { randomUUID } from 'crypto'
import { extractKeywords, matchJurisprudence, generateAdviceFromJurisprudence } from '@/lib/search-utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { semanticSearch, generateLegalAdvice } from '@/lib/rag-pipeline'

// ===== ENHANCED CASE-SPECIFIC ADVICE SYSTEM =====

interface CasePattern {
  keywords: string[]
  weight: number
  principles: string[]
  steps: string[]
  warnings: string[]
  jurisdiction: string
}

// Comprehensive case patterns for Indonesian law
const CASE_PATTERNS: Record<string, CasePattern[]> = {
  pencurian: [{
    keywords: ['pencurian', 'mencuri', 'curi', 'maling', 'mencopet', 'curanmor'],
    weight: 10,
    jurisdiction: 'KUHP Pasal 362, 363, 364',
    principles: [
      'Tindak pidana pencurian diatur dalam Pasal 362 KUHP: "Barangsiapa mengambil barang sesuatu yang seluruhnya atau sebagian milik orang lain, dengan maksud untuk dimiliki secara melawan hukum, diancam karena pencurian paling lama 5 tahun penjara."',
      'Pencurian dengan paksa (Pasal 365 KUHP) memiliki sanksi lebih berat jika menggunakan kekerasan atau mengancam keselamatan orang.',
      'Unsur "dimaksud untuk dimiliki secara melawan hukum" merupakan elemen kunci dalam delik pencurian.',
    ],
    steps: [
      'Segera buat laporan polisi di Polsek/Polres terdekat dan mintalah Surat Tanda Penerimaan Laporan (STPL).',
      'Kumpulkan bukti: CCTV, saksi mata, foto tempat kejadian, laporan kehilangan.',
      'Laporkan ke penyidik police dan ajukan dompet perdata di sidang pidana untuk pemulihan kerugian.',
      'Jika pelaku diketahui identitasnya, bisa diajukan tuntutan perdata untuk ganti rugi.',
    ],
    warnings: [
      '⚠️ Batas daluwarsa pidana pencurian: 9 tahun sejak perbuatan (Pasal 78 KUHP).',
      '⚠️ Jangan menyetujui mediasi sebelum konsultasi advokat — putusan pidana tidak bisa diganggu gugat melalui damai.',
    ],
  }],
  penganiayaan: [{
    keywords: ['penganiayaan', 'memukul', 'memukuli', 'menganiaya', 'tindakan kekerasan'],
    weight: 9,
    jurisdiction: 'KUHP Pasal 351, 352, 353',
    principles: [
      'Penganiayaan biasa diatur Pasal 351 ayat (1) KUHP: ancaman maksimal 2 tahun penjara.',
      'Penganiayaan ringan (ayat 2): hanya bisa dituntut berdasarkan pengaduan korban.',
      'Penganiayaan berat (Pasal 352-353) berlaku jika mengakibatkan luka serius atau kematian.',
    ],
    steps: [
      'Segera periksa ke RS/Dokter untuk mendapatkan Surat Keterangan Cedera (SKC).',
      'Buat laporan polisi dan pastikan SKC menjadi bagian dari berkas perkara.',
      'Jangan menerima uang damai tanpa nasihat advokat — ini bisa memengaruhi tuntutan pidana.',
      'Ajukan dompet perdata dalam sidang pidana untuk menuntut ganti rugi luka fisik & mental.',
    ],
    warnings: [
      '⚠️ Penganiayaan ringan (Pasal 351 ayat 2) bersifat delik aduan — harus ada pengaduan tertulis korban.',
      '⚠️ SKC adalah bukti krusial. Tanpa itu, sulit membuktikan unsur kesalahan.',
    ],
  }],
  penipuan: [{
    keywords: ['penipuan', 'menipu', 'dipalsukan', 'bohong', 'kedaluwarsa', 'scam', 'bodong'],
    weight: 9,
    jurisdiction: 'KUHP Pasal 378, UU ITE Pasal 28-29',
    principles: [
      'Penipuan diatur Pasal 378 KUHP: menggunakan nama palsu/muslihat palsu untuk mendapat keuntungan — sanksi maksimal 4 tahun penjara.',
      'Penipuan digital (UU ITE Pasal 30): pemalsuan elektronik untuk menguntungkan diri sendiri atau orang lain secara melawan hukum.',
      'Unsur penipuan: (1) muslihat/palsu, (2) kekhilafan/ketagihan korban, (3) keuntungan melawan hukum.',
    ],
    steps: [
      'Kumpulkan semua bukti transaksi, chat, email, receipt, dan identifikasi pelaku.',
      'Laporkan ke kepolisian (reskrim) dengan membawa bukti-bukti lengkap.',
      'Untuk penipuan online: laporkan juga ke Kominfo melalui siber.id.',
      'Konsultasikan dengan advokat untuk menggugat perdata sekaligus.',
    ],
    warnings: [
      '⚠️ Penipuan digital termasuk kategori pelanggaran yang bisa ditindak cepat.',
      '⚠️ Simpan semua komunikasi elektronik — bisa jadi bukti kuat di pengadilan.',
    ],
  }],
  'phk': [{
    keywords: ['phk', 'pemutusan', 'dipecat', 'diakhiri', 'rumah tangga', 'pekerja', 'buruh'],
    weight: 10,
    jurisdiction: 'UU Cipta Kerja No. 6/2023, PP No. 35/2021',
    principles: [
      'PHK hanya dapat dilakukan pada keadaan tertentu sesuai PP No. 35/2021 Pasal 3: perusahaan rugi, merger, atau pekerja melakukan pelanggaran berat.',
      'Jika PHK dianggap tidak sah, pekerja berhak memilih: menerima pesangon + pemecatan sah, atau menuntut pemecatan tidak sah + upah masa pemrotesan.',
      'Besaran pesangon diatur dalam PP No. 35/2021 Pasal 5-7 berdasarkan masa kerja.',
    ],
    steps: [
      'Minta surat resmi PHK dari perusahaan dan pastikan menyebutkan alasannya.',
      'Hitung hak-hak Anda: pesangon, uang penghargaan masa kerja (UEMK), uang penggantian hak (UPHK).',
      'Jika tidak puas, ajukan perkara ke Pengadilan Hubungan Industrial (PHI) dalam 3 bulan.',
      'Dapatkan bantuan dari serikat pekerja atau konsultan ketenagakerjaan.',
    ],
    warnings: [
      '⚠️ Batas waktu mengajukan gugatan ke PHI: 3 bulan sejakPHK dilaksanakan.',
      '⚠️ Jangan menandatangani surat kesepakatan PHK tanpa memahami hak Anda.',
    ],
  }],
  'sengketa tanah': [{
    keywords: ['tanah', 'sengketa tanah', 'sertifikat', 'watan', 'memperebutkan tanah'],
    weight: 10,
    jurisdiction: 'UU No. 5/1960 (UUPA), KUHPerdata, Pasal 1976-1981',
    principles: [
      'Hak kepemilikan tanah diatur dalam UU No. 5/1960 tentang Peraturan Dasar Pokok-Pokok Agraria.',
      'Sengketa tanah dapat berupa sengketa status kepemilikan, batas wilayah, atau pewarisan.',
      'Bukti kepemilikan utama: Sertifikat Hak Milik (SHM) atau Surat Ukur (SU) yang sah di BPN.',
    ],
    steps: [
      'Cek status sertifikat di Badan Pertanahan Nasional (BPN) setempat untuk memverifikasi kepemilikan.',
      'Kumpulkan bukti kepemilikan: sertifikat, pajak bumi dan bangunan, surat买卖/hibah.',
      'Coba mediasi dengan pihak yang bersengketa sebelum ke pengadilan.',
      'Jika mediasi gagal, ajukan gugatan perdata di PN wilayah tanah tersebut berada.',
    ],
    warnings: [
      '⚠️ Sengketa tanah sering berlarut-larut. Mulai dokumentasi selagi bukti masih ada.',
      '⚠️ Hati-hati dengan tanah garapan/pemilikan adat — status hukumnya kompleks.',
    ],
  }],
  'waris': [{
    keywords: ['waris', 'wasiat', 'warisan', 'mewarisi', 'pembagian harta waris'],
    weight: 9,
    jurisdiction: 'KUHPerdata Book III, UU No. 1/1974 (PK), Fatwa DSN',
    principles: [
      'Pewarisan diatur dalam KUHPerdata Pasal 823-1084 untuk non-Muslim, dan UU No. 1/1974 + hukum Islam untuk muslim.',
      'Hak waris anak sah dan anak luar kawin memiliki perbedaan status hukum.',
      'Wasiat hanya berlaku untuk bagian tertentu dari harta peninggalan dan harus memenuhi syarat formil.',
    ],
    steps: [
      'Tentukan status pewaris (muslim/non-muslim) karena hukum waris berbeda.',
      'Kumpulkan dokumen: akta kematian, sertifikat tanah, buku nikah, kartu keluarga.',
      'Untuk muslim: lakukan pembagian sesuai hukum waris Islam dengan bantuan KUA/notaris.',
      'Untuk non-muslim: ajukan ceramah pewarisan ke PN jika terjadi sengketa antar ahli waris.',
    ],
    warnings: [
      '⚠️ Sengketa waris seringkali memecah belah keluarga. Prioritaskan musyawarah.',
      '⚠️ Wasiat notili hanya sah jika memenuhi bentuk tertulis di hadapan notaris.',
    ],
  }],
  'perceraian': [{
    keywords: ['perceraian', 'ceraian', 'talak', 'putus rumah tangga', 'pisah'],
    weight: 10,
    jurisdiction: 'UU No. 1/1974, KHI, PASAL 39-43',
    principles: [
      'Perceraian hanya dapat dilakukan di depan sidang pengadilan menurut hukumnya masing-masing (UU No. 1/1974 Pasal 39).',
      'Untuk pasangan muslim: perceraian via Pengadilan Agama. Non-muslim: Pengadilan Negeri.',
      'Dampak perceraian mencakup hak asuh anak, nafkah, dan pembagian harta benda.',
    ],
    steps: [
      'Konsultasikan dengan konsultan perkawinan atau LBH untuk memahami konsekuensi hukum.',
      'Siapkan alasan sah: salah satu pihak berbuat zina, menjadi meringan, ditinggal 2 tahun, kasar, atau cacat.',
      'Urutkan permasalahan hak asuh, nafkah, dan harta bersama terlebih dahulu.',
      'Jika melalui PN/PA, sediakan dokumen: akta nikah, KTP, KK, bukti penghasilan.',
    ],
    warnings: [
      '⚠️ Anak di bawah 5 tahun hak asuhnya secara mutlak di ibu (Pasal 93 KHI).',
      '⚠️ Perceraian Karena kesalahpahaman (pasal 39 UU Perkawinan) memerlukan upaya mediasi terlebih dahulu.',
    ],
  }],
  'honda mobil': [{
    keywords: ['honda', 'mobil', 'kendaraan', 'leasing', 'kredit mobil', 'mobil kredit'],
    weight: 8,
    jurisdiction: 'KUHPerdata, PP No. 60/1999, UU Perlindungan Konsumen',
    principles: [
      'Perjanjian kredit kendaraan merupakan perjanjian wanprestasi jika konsumen lalai membayar.',
      'Leasing berhak menyita kendaraan tetapi harus melalui proses hukum yang sah.',
      'Konsumen berhak mendapatkan penjelasan tertulis sebelum eksekusi sita.',
    ],
    steps: [
      'Baca ulang perjanjian kredit Anda, khususnya klausul wanprestasi dan bunga denda.',
      'Negosialisasi dengan leasing untuk restrukturisasi jika sedang kesulitan finansial.',
      'Jika kendaraan disita secara ilegal, laporkan ke Otoritas Jasa Keuangan (OJK).',
      'Konsultasikan dengan advokat konsumen untuk gugatan pembatalan sita.',
    ],
    warnings: [
      '⚠️ Sita kendaraan tanpa putusan pengadilan bisa digugat perdata.',
      '⚠️ Simpan semua bukti pembayaran cicilan sebagai dasar pembelaan.',
    ],
  }],
}

// Category-specific enhanced templates
const ENHANCED_TEMPLATES = {
  pidana: {
    principles: [
      'Presumsi Tak Bersalah (Pasal 8 KUHAP): Tersangka/terdakwa dianggap tidak bersalah hingga putusan berkekuatan hukum tetap.',
      'Hak Atas Advokat (Pasal 54 KUHAP): Tersangka berhak mendapat bantuan hukum sejak tahap penyidikan.',
      'Penangkapan Prosedural (Pasal 17 KUHAP): Penangkapan harus disertai Surat Perintah Penangkapan dan dibuat dalam bahasa Indonesia.',
    ],
    steps: [
      'Segera konsultasi dengan advokat yang berpengalaman di bidang pidana.',
      'Kumpulkan semua bukti dan dokumen terkait kasus.',
      'Jangan menandatangani pernyataan apapun tanpa pemahaman advokat.',
      'Catat kronologi lengkap dengan waktu, lokasi, dan identitas saksi.',
    ],
  },
  perdata: {
    principles: [
      'Beban Pembuktian (Pasal 157 HIR/RgRB): Pihak yang mengajukan gugatan wajib membuktikan klaimnya.',
      'Asas Kepastian Hukum (Pasal 1338 KUHPerdata): Perjanjian sah berlaku sebagai undang-undang bagi para pihak.',
      'Daluwarsa (Pasal 1990 KUHPerdata): Hak gugat dapat gugur jika terlambat memperkarakan.',
    ],
    steps: [
      'Kumpulkan seluruh dokumen perjanjian, korespondensi, dan bukti kerugian.',
      'Kirim surat teguran (somasi) secara tertulis sebelum Gugatan.',
      'Pertimbangkan mediasi atau arbitrase sebagai alternatif penyelesaian.',
      'Konsultasikan batas daluwarsa agar gugatan tidak batal.',
    ],
  },
  keluarga: {
    principles: [
      'Kepentingan Terbaik Anak (UU No. 35/2014): Hak asuh ditetapkan berdasarkan kepentingan anak.',
      'Hak Asuh Ibu (Pasal 93 KHI): Anak di bawah 5 tahun berhak diasuh oleh ibu sebagai hak mutlak.',
      'Pembagian Harta Bersama (Pasal 85 KHI): Harta gono-gini dibagi setara kecuali ada perjanjian lain.',
    ],
    steps: [
      'Prioritaskan musyawarah keluarga atau mediasi sebelum ke pengadilan.',
      'Kumpulkan bukti penghidupan dan kemampuan merawat anak.',
      'Untuk perceraian via PN, siapkan alasan sah sesuai Pasal 39 KHI.',
      'Konsultasi hak nafkah, hak asuh, dan pembagian harta dengan konsultan.',
    ],
  },
  ketenagakerjaan: {
    principles: [
      'PHK Harus Dengan Alasan Sah (PP No. 35/2021): Pemutusan hubungan kerja harus berdasarkan alasan yang sah.',
      'Pesangon & Hak Lainnya (Pasal 5-7 PP 35/2021): Pekerja berhak atas pesangon, UEMP, dan UPH.',
      'Pengadilan Hubungan Industrial: Sengketa PHK diperiksa oleh PHI.',
    ],
    steps: [
      'Kumpulkan bukti hubungan kerja (kontrak, slip gaji, surat tugas).',
      'Hitung hak-hak Anda: pesangon, uang penghargaan masa kerja, uang penggantian hak.',
      'Ajukan gugatan ke PHI jika tidak puas dengan pesangon dalam 3 bulan.',
      'Konsultasikan dengan serikat pekerja atau konsultan ketenagakerjaan.',
    ],
  },
  default: {
    principles: [
      'Prinsip Presumsi Tak Bersalah (Pasal 8 KUHAP): Tersangka dianggap tidak bersalah hingga terbukti.',
      'Hak Atas Bantuan Hukum: Setiap orang berhak mendapatkan bantuan hukum.',
      'Asas Legalitas: Tindak pidana hanya dapat dipidana jika diatur dalam undang-undang.',
    ],
    steps: [
      'Konsultasikan dengan advokat atau LBH setempat.',
      'Kumpulkan semua dokumen terkait kasus.',
      'Jangan menandatangani dokumen tanpa memahami isinya.',
      'Catat seluruh kronologi kejadian.',
    ],
  },
}

// Context-aware keyword matching to enhance advice
function getContextualAdvice(question: string, category: string) {
  const keywords = extractKeywords(question)
  const questionLower = question.toLowerCase()
  
  let matchedPatterns: CasePattern[] = []
  let totalWeight = 0
  
  // Match case patterns
  for (const patternList of Object.values(CASE_PATTERNS)) {
    for (const pattern of patternList) {
      let score = 0
      for (const kw of pattern.keywords) {
        if (questionLower.includes(kw.toLowerCase())) {
          score += pattern.weight
        }
      }
      if (score > 0) {
        matchedPatterns.push({ ...pattern, weight: score })
        totalWeight += score
      }
    }
  }
  
  // Build tailored advice
  const principles: string[] = []
  const steps: string[] = []
  const warnings: string[] = []
  
  // Add matched case-specific content
  for (const pattern of matchedPatterns.sort((a, b) => b.weight - a.weight).slice(0, 2)) {
    principles.push(...pattern.principles)
    steps.push(...pattern.steps)
    warnings.push(...pattern.warnings)
  }
  
  // Add general category principles if not enough
  const template = ENHANCED_TEMPLATES[category as keyof typeof ENHANCED_TEMPLATES] || ENHANCED_TEMPLATES.default
  if (principles.length < 3) {
    principles.push(...template.principles.filter(p => !principles.includes(p)))
  }
  
  // Add contextual tips
  const contextualTips: string[] = []
  
  if (keywords.some((k: string) => k.includes('warga') || k.includes('miskin') || k.includes('lbh'))) {
    contextualTips.push('🆘 Bantuan Hukum Gratis: Hubungi LBH (Lembaga Bantuan Hukum) terdekat atau hotline 129.')
  }
  
  if (keywords.some((k: string) => k.includes('saksi') || k.includes('bukti') || k.includes('laporan'))) {
    contextualTips.push('📋 Penting: Jaminan keamanan saksi diatur dalam UU Perlindungan Saksi dan Korban.')
  }
  
  if (keywords.some((k: string) => k.includes('waktu') || k.includes('hari') || k.includes('bulan'))) {
    contextualTips.push('⏰ Batas Waktu: Perhatikan tenggat waktu hukum untuk mengajukan gugatan atau banding.')
  }
  
  if (keywords.some((k: string) => k.includes('uang') || k.includes('rugi') || k.includes('kompensasi'))) {
    contextualTips.push('💰 Ganti Rugi: Anda berhak menuntut ganti rugi material maupun immaterial.')
  }
  
  if (keywords.some((k: string) => k.includes('anak') || k.includes('istri') || k.includes('keluarga'))) {
    contextualTips.push('👨‍👩‍👧 Perlindungan Keluarga: Hukum Indonesia memberikan perlindungan khusus bagi anak dan wanita.')
  }
  
  return {
    principles: Array.from(new Set(principles)).slice(0, 5),
    steps: Array.from(new Set(steps)).slice(0, 5),
    warnings: Array.from(new Set(warnings)).slice(0, 3),
    contextualTips,
    detectedKeywords: keywords.slice(0, 8),
    matchedCases: matchedPatterns.map(p => p.keywords[0]),
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const validation = AdviceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validasi gagal' },
        { status: 400 }
      )
    }
    
    const { question_text, category, case_id, query_id } = validation.data

    const contextual = getContextualAdvice(question_text, category || 'default')
    const categoryLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Hukum'

    // ===== RAG PIPELINE: Semantic Search =====
    let ragMatchedCases: any[] = []
    let ragConfidence = 0
    
    try {
      // Try semantic search first (requires embeddings)
      const semanticResults = await semanticSearch(question_text, category)
      
      if (semanticResults.length > 0) {
        ragMatchedCases = semanticResults
        ragConfidence = Math.round(
          semanticResults.reduce((sum, c) => sum + c.similarity, 0) / semanticResults.length * 100
        )
        console.log(`[RAG] Found ${ragMatchedCases.length} cases via semantic search (confidence: ${ragConfidence}%)`)
      }
    } catch (ragErr) {
      console.log('RAG search failed, using keyword fallback:', String(ragErr))
    }
    
    // ===== FALLBACK: Keyword-based matching =====
    let jurisprudenceData: any[] = []
    let keywordMatchedCases: any[] = []
    
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('jurisprudence')
          .select('id, case_number, court, date, summary, keywords, source_url')
          .limit(100)
        
        if (error) {
          console.error('Supabase jurisprudence fetch error:', error.message)
        } else {
          jurisprudenceData = data || []
        }
      }
      
      // Match user question against jurisprudence database
      if (jurisprudenceData.length > 0) {
        keywordMatchedCases = matchJurisprudence(jurisprudenceData, question_text, category)
        console.log(`[Keyword] Matched ${keywordMatchedCases.length} jurisprudence cases`)
      }
    } catch (dbErr) {
      console.log('Jurisprudence fetch skipped:', String(dbErr))
    }
    
    // Combine RAG + Keyword results
    const allMatchedCases = ragMatchedCases.length > 0 
      ? ragMatchedCases 
      : keywordMatchedCases.map(c => ({ ...c, similarity: c.match_score / 10 }))

    // ===== BUILD ADVICE =====
    let adviceText: string
    let noteText: string
    let sources: string[] = []
    let finalConfidence = 0
    
    if (allMatchedCases.length > 0) {
      // Use RAG-enhanced advice generation
      const ragAdvice = await generateLegalAdvice(allMatchedCases, category || 'default', question_text)

      // Only use RAG advice if it's genuinely AI-generated (not just a simple fallback)
      // Fallback advice has low confidence and short text
      const isQualityAdvice = ragAdvice.confidence > 0.5 && ragAdvice.advice.length > 200

      if (isQualityAdvice) {
        adviceText = ragAdvice.advice
        noteText = ragAdvice.note
        sources = ragAdvice.sources
        finalConfidence = ragAdvice.confidence
        console.log(`[Advice] Generated with ${allMatchedCases.length} cases, confidence: ${finalConfidence}%`)
      } else {
        // RAG fallback is just a simple template — use the enhanced contextual advice instead
        adviceText = buildTemplateAdvice(contextual, categoryLabel, question_text)
        noteText = 'Rekomendasi ini berdasarkan prinsip hukum dan yurisprudensi relevan. Tingkat kepercayaan rendah karena tidak ditemukan kasus yang cocok.'
        finalConfidence = Math.max(ragAdvice.confidence, 30)
        console.log(`[Advice] RAG fallback detected, using enhanced template instead`)
      }
    } else {
      // Use template-based advice as fallback
      adviceText = buildTemplateAdvice(contextual, categoryLabel, question_text)
      noteText = 'Rekomendasi ini berdasarkan prinsip hukum umum. Tidak ada yurisprudensi yang cocok ditemukan.'
      finalConfidence = 30
    }
    
    // AI Enhancement (optional - uses Gemini if API key is available)
    let aiEnhanced = false
    const aiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (aiApiKey && aiApiKey !== 'AIzaSyB7K6x7Q8yZ3vF2nJ9wX5tY8hL4mN0pQrS' && (allMatchedCases.length > 0 || contextual.principles.length > 0)) {
      try {
        const genAI = new GoogleGenerativeAI(aiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
        
        const prompt = `Anda adalah asisten hukum Indonesia yang membantu memberikan saran hukum berdasarkan kasus nyata. 
${ragMatchedCases.length > 0 ? `\n**Yurisprudensi dari RAG Search (Semantic):**\n${ragMatchedCases.map((c: any, i: number) => 
  `${i + 1}. ${c.case_number} (${c.court}, ${c.date})\n   Similarity: ${c.similarity}\n   ${c.summary}\n   Keywords: ${c.matched_keywords.join(', ')}`
).join('\n\n')}` : ''}
${keywordMatchedCases.length > 0 ? `\n**Yurisprudensi dari Keyword Matching:**\n${keywordMatchedCases.map((c: any, i: number) => 
  `${i + 1}. ${c.case_number} (${c.court}, ${c.date})\n   ${c.summary}\n   Keywords: ${c.matched_keywords.join(', ')}`
).join('\n\n')}` : ''}
Kategori: ${category || 'default'}
Pertanyaan pengguna: "${question_text}"

Tugasmu:
1. Berikan penjelasan hukum yang lebih kontekstual dan spesifik untuk kasus ini
2. Sertakan pasal/undang-undang yang relevan
3. Berikan langkah praktis yang bisa dilakukan
4. Jika ada warning penting, sertakan
5. Jika ada yurisprudensi yang cocok, sebutkan nomor perkaranya
6. Sebutkan tingkat kepercayaan (confidence) berdasarkan relevansi kasus

Format respons dalam bahasa Indonesia yang formal namun mudah dipahami. Maksimal 400 kata.

Respons:`
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        const aiText = response.text()
        
        if (aiText && aiText.trim().length > 50) {
          const finalAdvice = `${adviceText}\n\n---\n\n*Analisis AI:\n${aiText.trim()}*`
          
          // Update saved advice if DB available
          if (supabaseAdmin && question_text) {
            try {
              const finalQueryId = query_id || randomUUID()
              await supabaseAdmin
                .from('advice')
                .update({ 
                  advice_text: finalAdvice, 
                  sources_json: JSON.stringify([
                    ...allMatchedCases.map(c => ({ type: 'yurisprudensi', title: `${c.case_number} - ${c.court}`, similarity: c.similarity })),
                    ...contextual.detectedKeywords.map((k: string) => ({ type: 'keyword', title: k })),
                  ]),
                  confidence: finalConfidence,
                })
                .eq('query_id', finalQueryId)
            } catch (dbErr) {
              console.log('DB update skipped:', String(dbErr))
            }
          }
          
          return NextResponse.json({ 
            advice: finalAdvice,
            note: noteText,
            context: {
              keywords: contextual.detectedKeywords,
              matchedCases: allMatchedCases.map(c => ({
                case_number: c.case_number,
                court: c.court,
                summary: c.summary,
                matched_keywords: c.matched_keywords,
                similarity: c.similarity,
              })),
              category,
              confidence: finalConfidence,
              aiEnhanced: true,
              searchMethod: ragMatchedCases.length > 0 ? 'rag_semantic' : 'keyword_fallback',
            }
          })
        }
        aiEnhanced = true
      } catch (aiErr) {
        console.log('AI enhancement failed (using template):', String(aiErr))
      }
    }

    // Try to save to Supabase if available
    if (supabaseAdmin && question_text) {
      try {
        const finalQueryId = query_id || randomUUID()
        
        const { error: adviceError } = await supabaseAdmin
          .from('advice')
          .insert({
            query_id: finalQueryId,
            advice_text: adviceText,
            sources_json: JSON.stringify([
              ...allMatchedCases.map(c => ({ type: 'yurisprudensi', title: `${c.case_number} - ${c.court}`, similarity: c.similarity })),
              ...contextual.principles.map(p => ({ type: 'prinsip', title: p })),
              ...contextual.matchedCases.map(c => ({ type: 'pola', title: c })),
            ]),
            confidence: finalConfidence,
          })

        if (adviceError) {
          console.error('Failed to save advice:', adviceError)
        }
      } catch (dbError) {
        console.log('DB insert skipped:', String(dbError))
      }
    }

    return NextResponse.json({ 
      advice: adviceText,
      note: noteText,
      context: {
        keywords: contextual.detectedKeywords,
        matchedCases: allMatchedCases.map(c => ({
          case_number: c.case_number,
          court: c.court,
          summary: c.summary,
          matched_keywords: c.matched_keywords,
          similarity: c.similarity,
        })),
        category,
        confidence: finalConfidence,
        searchMethod: ragMatchedCases.length > 0 ? 'rag_semantic' : 'keyword_fallback',
      }
    })
  } catch (error) {
    console.error('Error generating advice:', error)
    return NextResponse.json(
      { advice: 'Mohon maaf, terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

// Helper function to build template advice when no jurisprudence matches
function buildTemplateAdvice(contextual: any, categoryLabel: string, question: string): string {
  const adviceParts = [`Saran Hukum untuk Kasus ${categoryLabel}`]
  
  // Context-specific opening
  if (contextual.matchedCases.length > 0) {
    adviceParts.push(`\nBerdasarkan analisis terhadap kasus "${question}", terdeteksi pola: ${contextual.matchedCases.join(', ')}.`)
  } else {
    adviceParts.push(`\nBerdasarkan analisis terhadap "${question}", berikut saran hukum yang relevan:`)
  }
  
  // Principles
  if (contextual.principles.length > 0) {
    adviceParts.push('\n**Prinsip Hukum yang Berlaku:**')
    adviceParts.push(...contextual.principles.map((p: string, i: number) => `${i + 1}. ${p}`))
  }
  
  // Steps
  if (contextual.steps.length > 0) {
    adviceParts.push('\n**Langkah Hukum yang Disarankan:**')
    adviceParts.push(...contextual.steps.map((s: string, i: number) => `${i + 1}. ${s}`))
  }
  
  // Warnings
  if (contextual.warnings.length > 0) {
    adviceParts.push('\n**⚠️ Perhatian Penting:**')
    adviceParts.push(...contextual.warnings)
  }
  
  // Contextual tips
  if (contextual.contextualTips.length > 0) {
    adviceParts.push('\n**Saran Tambahan Berdasarkan Konteks:**')
    adviceParts.push(...contextual.contextualTips.map((t: string, i: number) => `${i + 1}. ${t}`))
  }
  
  // Disclaimer
  adviceParts.push('\n*Disclaimer: Saran ini berdasarkan prinsip hukum yang relevan, bukan pengganti konsultasi advokat profesional.*')
  
  return adviceParts.join('\n')
}
