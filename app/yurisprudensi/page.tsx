'use client'

import { useEffect, useState } from 'react'

interface Jurisprudence {
  case_number: string
  court: string
  date: string
  summary: string
  keywords: string[]
  source_url: string
  relevance_score?: number
}

const courts = [
  { value: '', label: 'Semua Lembaga Peradilan' },
  { value: 'Mahkamah Agung', label: 'Mahkamah Agung (MA)' },
  { value: 'Mahkamah Konstitusi', label: 'Mahkamah Konstitusi (MK)' },
]

const categories = [
  { value: '', label: 'Semua Kategori' },
  { value: 'pidana', label: 'Hukum Pidana' },
  { value: 'perdata', label: 'Hukum Perdata' },
  { value: 'keluarga', label: 'Hukum Keluarga & Waris' },
  { value: 'ketenagakerjaan', label: 'Hukum Ketenagakerjaan' },
]

export default function YurisprudensiPage() {
  const [items, setItems] = useState<Jurisprudence[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [court, setCourt] = useState('')
  const [displayCount, setDisplayCount] = useState(10)

  useEffect(() => {
    fetchJurisprudence()
  }, [])

  const fetchJurisprudence = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (category) params.append('category', category)
      if (court) params.append('court', court)
      
      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error('Error fetching jurisprudence:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setDisplayCount(10)
    fetchJurisprudence()
  }

  const displayedItems = items.slice(0, displayCount)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-widest">
            Direktori Putusan Terpilih
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Yurisprudensi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              Indonesia
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Database putusan Mahkamah Agung dan Mahkamah Konstitusi sebagai rujukan standar keadilan.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-500/20 p-6 sm:p-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kata kunci, nomor perkara, atau perbuatan hukum..."
                className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-slate-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-slate-300 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-900 text-slate-200">
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-slate-300 font-medium"
            >
              {courts.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-900 text-slate-200">
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl font-extrabold text-sm hover:shadow-amber-500/20 transition-all shadow-xl"
            >
              Cari Putusan
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 mb-4">
              <svg className="animate-spin h-8 w-8 text-amber-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-slate-400 text-base">Memuat direktori yurisprudensi...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="text-5xl mb-2">🔍</div>
            <h3 className="text-lg font-bold text-white">Tidak ada hasil yang sesuai</h3>
            <p className="text-slate-400 text-sm">Gunakan istilah pencarian lain atau sesuaikan filter kategori.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
              <span>Menampilkan {displayedItems.length} dari {items.length} putusan</span>
            </div>

            <div className="space-y-4">
              {displayedItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-amber-400/40 p-6 sm:p-8 transition-all duration-300 space-y-4 shadow-xl group"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                        {item.court}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• {item.date}</span>
                    </div>

                    {item.relevance_score && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono">
                        Skor Relevansi {(item.relevance_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-white text-xl group-hover:text-amber-300 transition-colors">
                    {item.case_number}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    {item.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {item.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1 rounded-full font-medium"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
                      >
                        Lihat Sumber Resmi ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {displayCount < items.length && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setDisplayCount(prev => prev + 10)}
                  className="px-8 py-3.5 bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-200 rounded-2xl text-sm font-bold transition-all shadow-lg"
                >
                  Muat Putusan Lainnya ({items.length - displayCount} tersisa)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
