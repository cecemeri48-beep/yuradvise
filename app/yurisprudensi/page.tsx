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
  { value: '', label: 'Semua Pengadilan' },
  { value: 'Mahkamah Agung', label: 'Mahkamah Agung' },
  { value: 'Mahkamah Konstitusi', label: 'Mahkamah Konstitusi' },
]

const categories = [
  { value: '', label: 'Semua Kategori' },
  { value: 'pidana', label: 'Pidana' },
  { value: 'perdata', label: 'Perdata' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'ketenagakerjaan', label: 'Ketenagakerjaan' },
]

const categoryColors: Record<string, string> = {
  pidana: 'bg-red-100 text-red-700',
  perdata: 'bg-blue-100 text-blue-700',
  keluarga: 'bg-purple-100 text-purple-700',
  ketenagakerjaan: 'bg-green-100 text-green-700',
}

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📚 Yurisprudensi Indonesia
          </h1>
          <p className="text-gray-600 text-lg">
            Cari dan pelajari kasus-kasus yurisprudensi dari Mahkamah Agung dan Mahkamah Konstitusi
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan keyword atau ringkasan..."
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <select
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {courts.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 shadow-lg transition-all"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Memuat data yurisprudensi...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">Tidak ada hasil ditemukan</p>
            <p className="text-gray-400">Coba kata kunci lain atau ubah filter</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              Ditemukan <span className="font-semibold text-primary-600">{items.length}</span> kasus yurisprudensi
            </div>
            
            <div className="space-y-4">
              {displayedItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                        {item.court}
                      </span>
                      <span className="text-sm text-gray-500">• {item.date}</span>
                      {item.relevance_score && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Relevansi {(item.relevance_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg mb-3">
                    {item.case_number}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium group"
                    >
                      Lihat sumber asli
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {displayCount < items.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount(prev => prev + 10)}
                  className="px-8 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  Muat Lebih Banyak ({items.length - displayCount} sisa)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
