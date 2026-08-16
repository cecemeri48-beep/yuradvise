/**
 * Reusable search & filter utilities for jurisprudence data
 */

interface JurisprudenceItem {
  case_number?: string
  court?: string
  date?: string
  summary?: string
  keywords?: string[]
  source_url?: string
  relevance_score?: number
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  pidana: ['pidana', 'korupsi', 'penganiayaan', 'pencurian', 'narkotika', 'pencucian uang', 'kekerasan rumah tangga', 'judi', 'pembunuhan', 'penipuan', 'pemalsuan'],
  perdata: ['perdata', 'waris', 'tanah', 'gugatan', 'harta', 'perceraian', 'wasiat', 'penipuan', 'utang', 'piutang', 'kontrak', 'leasing'],
  keluarga: ['keluarga', 'perceraian', 'asuh anak', 'nafkah', 'wasiat', 'hak asuh', 'custody', 'talak', 'rujuk'],
  ketenagakerjaan: ['ketenagakerjaan', 'pekerja', 'upah', 'phk', 'pesangon', 'pekerjaan', 'upah minimum', 'slip gaji', 'kontrak kerja'],
  tatausaha: ['tata usaha', 'pemerintah', 'pnun', 'permohonan', 'administrasi', 'izin', 'retribusi'],
}

export function filterByCourt(results: JurisprudenceItem[], court?: string): JurisprudenceItem[] {
  if (!court || !court.trim()) return results
  const courtLower = court.toLowerCase()
  return results.filter((item) =>
    item.court?.toLowerCase().includes(courtLower)
  )
}

export function filterByCategory(results: JurisprudenceItem[], category?: string): JurisprudenceItem[] {
  if (!category || !CATEGORY_KEYWORDS[category]) return results
  const catKeywords = CATEGORY_KEYWORDS[category]
  return results.filter((item) =>
    item.keywords?.some((k) => catKeywords.some((ck) => k.toLowerCase() === ck.toLowerCase()))
  )
}

export function searchByText(results: JurisprudenceItem[], search?: string): JurisprudenceItem[] {
  if (!search) return results
  const searchLower = search.toLowerCase()
  return results.filter(
    (item) =>
      item.summary?.toLowerCase().includes(searchLower) ||
      item.case_number?.toLowerCase().includes(searchLower) ||
      item.court?.toLowerCase().includes(searchLower) ||
      item.keywords?.some((k) => k.toLowerCase().includes(searchLower))
  )
}

export function sortRelevance(results: JurisprudenceItem[]): JurisprudenceItem[] {
  return [...results].sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))
}

/**
 * Extract keywords from question text for contextual advice
 */
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'yang', 'dan', 'untuk', 'dengan', 'ini', 'itu', 'ini', 'adalah', 'adalah',
    'saya', 'kami', 'kita', 'anda', 'andapun', 'dia', 'mereka', 'pada', 'di',
    'ke', 'dari', 'dalam', 'tersebut', 'atau', 'jika', 'maka', 'akan', 'telah',
    'tidak', 'belum', 'sudah', 'bisa', 'dapat', 'harus', 'oleh', 'turut', 'bersama',
  ])
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 10)
}

/**
 * Match jurisprudence against user question using keyword scoring
 */
export interface MatchedJurisprudence {
  case_number: string
  court: string
  date: string
  summary: string
  keywords: string[]
  source_url: string
  relevance_score: number
  match_score: number
  matched_keywords: string[]
}

export function matchJurisprudence(
  jurisprudence: JurisprudenceItem[],
  question: string,
  category?: string
): MatchedJurisprudence[] {
  if (!question || jurisprudence.length === 0) return []
  
  const questionLower = question.toLowerCase()
  const extractedKeywords = extractKeywords(question)
  
  // Build a scoring map for question keywords
  const keywordScoreMap = new Map<string, number>()
  extractedKeywords.forEach(kw => keywordScoreMap.set(kw, 1))
  
  // Also add category keywords
  if (category && CATEGORY_KEYWORDS[category]) {
    CATEGORY_KEYWORDS[category].forEach(kw => {
      if (!keywordScoreMap.has(kw)) {
        keywordScoreMap.set(kw, 0.5)
      }
    })
  }
  
  const results: MatchedJurisprudence[] = []
  
  for (const item of jurisprudence) {
    let matchScore = 0
    const matchedKeywords: string[] = []
    
    // Check each jurisprudence keyword against question
    for (const jkw of item.keywords || []) {
      const jkwLower = jkw.toLowerCase()
      
      // Direct match with extracted question keywords
      if (keywordScoreMap.has(jkwLower)) {
        matchScore += keywordScoreMap.get(jkwLower) || 1
        matchedKeywords.push(jkw)
        continue
      }
      
      // Check if keyword appears in question text
      if (questionLower.includes(jkwLower)) {
        matchScore += 2 // Stronger match for full text inclusion
        matchedKeywords.push(jkw)
        continue
      }
      
      // Check for partial matches (e.g., "waris" matches "warisan")
      for (const qkw of extractedKeywords) {
        if (jkwLower.includes(qkw) || qkw.includes(jkwLower)) {
          matchScore += 1
          if (!matchedKeywords.includes(jkw)) {
            matchedKeywords.push(jkw)
          }
          break
        }
      }
    }
    
    // Check summary for question keywords
    const summaryLower = (item.summary || '').toLowerCase()
    for (const kw of extractedKeywords) {
      if (summaryLower.includes(kw)) {
        matchScore += 1.5
      }
    }
    
    // Only include if there's at least some match
    if (matchScore > 0) {
      results.push({
        case_number: item.case_number || '',
        court: item.court || '',
        date: item.date || '',
        summary: item.summary || '',
        keywords: item.keywords || [],
        source_url: item.source_url || '',
        relevance_score: item.relevance_score || 0.5,
        match_score: matchScore,
        matched_keywords: matchedKeywords,
      })
    }
  }
  
  // Sort by match score descending
  return results.sort((a, b) => b.match_score - a.match_score).slice(0, 5)
}

/**
 * Generate advice based on matched jurisprudence
 */
export function generateAdviceFromJurisprudence(
  matchedCases: MatchedJurisprudence[],
  category: string,
  question: string
): { advice: string; note: string; sources: string[] } {
  if (matchedCases.length === 0) {
    return {
      advice: generateGenericAdvice(category, question),
      note: 'Tidak ada yurisprudensi yang cocok ditemukan. Rekomendasi ini berdasarkan prinsip hukum umum.',
      sources: [],
    }
  }
  
  const topCase = matchedCases[0]
  const allKeywords = Array.from(new Set(matchedCases.flatMap(c => c.matched_keywords)))
  
  let advice = `Berdasarkan analisis yurisprudensi terkait "${question}", berikut rekomendasi hukum:\n\n`
  
  // Add primary case reference
  advice += `📌 **Putusan Referensi Utama:**\n`
  advice += `*${topCase.case_number}* - ${topCase.court}, ${topCase.date}\n\n`
  advice += `${topCase.summary}\n\n`
  
  // Add secondary cases if available
  if (matchedCases.length > 1) {
    advice += `📚 **Putusan Pendukung:**\n`
    for (let i = 1; i < Math.min(matchedCases.length, 3); i++) {
      const caseItem = matchedCases[i]
      advice += `- *${caseItem.case_number}* (${caseItem.court}): ${caseItem.matched_keywords.join(', ')}\n`
    }
    advice += '\n'
  }
  
  // Add legal analysis based on category
  advice += getLegalAnalysis(category, allKeywords, question)
  
  const sources = matchedCases.map(c => c.source_url).filter(Boolean)
  
  return {
    advice,
    note: `Yurisprudensi ini didasarkan pada ${matchedCases.length} putusan pengadilan. Setiap perkara memiliki fakta unik yang dapat mempengaruhi outcome.`,
    sources,
  }
}

function generateGenericAdvice(category: string, question: string): string {
  const baseAdvice = `Berdasarkan kategori ${category} terkait "${question}":\n\n`
  
  switch (category) {
    case 'pidana':
      return baseAdvice + `1. Segera laporkan ke polisi jika belum dilaporkan\n2. Mintalah pendampingan advokat/hakim pembela\n3. Kumpulkan semua bukti dan dokumen terkait\n4. Pahami hak-hak Anda sesuai KUHAP (Pasal 54-60)\n5. Pertimbangkan upaya penyelesaian di luar pengadilan\n\n⚠️ Konsultasikan dengan advokat untuk strategi hukum yang tepat.`
    case 'perdata':
      return baseAdvice + `1. Kumpulkan semua dokumen perjanjian dan bukti transaksi\n2. Kirim somasi tertulis sebagai upaya damai\n3. Hitung nilai gugatan dan siapkan perhitungan kerugian\n4. Pahami batas daluwarsa sesuai KUHPerdata\n5. Pertimbangkan mediasi sebelum ke pengadilan\n\n⚠️ Setiap sengketa perdata memerlukan analisis dokumentasi yang teliti.`
    case 'keluarga':
      return baseAdvice + `1.Utamakan musyawarah untuk menyelesaikan perbedaan\n2. Pahami ketentuan KHI (untuk muslim) atau KUHPerdata (untuk non-muslim)\n3. Siapkan dokumen pernikahan dan akta kelahiran anak\n4. Pertimbangkan hak asuh anak berdasarkan kepentingan terbaik anak\n5. Dapatkan pendampingan konselor keluarga jika diperlukan\n\n⚠️ Masalah keluarga memerlukan pendekatan yang sensitif dan humanis.`
    default:
      return baseAdvice + `Segera konsultasikan dengan advokat untuk mendapatkan pendampingan hukum yang tepat sesuai kasus Anda.`
  }
}

function getLegalAnalysis(category: string, keywords: string[], question: string): string {
  let analysis = `\n🔍 **Analisis Hukum:**\n\n`
  
  const qLower = question.toLowerCase()
  
  if (keywords.includes('waris') || keywords.includes('tanah')) {
    analysis += `- Pasal 176-181 KUHPerdata mengatur mengenai pewarisan\n`
    if (qLower.includes('sengketa') || qLower.includes('perselisihan')) {
      analysis += `- Sengketa waris dapat diselesaikan melalui mediasi atau gugatan perdata\n`
    }
  }
  
  if (keywords.includes('perceraian') || keywords.includes('keluarga')) {
    analysis += `- Perceraian diatur dalam UU No. 1/1974 tentang Perkawinan\n`
    if (qLower.includes('hak asuh') || qLower.includes('asuh anak')) {
      analysis += `- Hak asuh anak diatur dalam Pasal 41 UU Perkawinan dan Putusan MA\n`
    }
  }
  
  if (keywords.includes('penganiayaan')) {
    analysis += `- Penganiayaan diatur dalam Pasal 352 KUHPidana\n`
    if (qLower.includes('ringan')) {
      analysis += `- Penganiayaan ringan (Pasal 352 ayat 1) diancam penjara maks  3 bulan\n`
    }
  }
  
  if (keywords.includes('korupsi')) {
    analysis += `- Tindak pidana korupsi diatur dalam UU No. 31/1999 jo UU No. 20/2001\n`
    analysis += `- Sanksi dapat berupa pidana penjara hingga seumur hidup dan denda\n`
  }
  
  if (keywords.includes('pencurian')) {
    analysis += `- Pencurian diatur dalam Pasal 362 KUHPidana\n`
    analysis += `- Ancaman pidana penjara maks 5 tahun\n`
  }
  
  analysis += `\n⚖️ *Rekomendasi ini bersifat informatif dan bukan pengganti nasihat hukum profesional.*`
  
  return analysis
}
