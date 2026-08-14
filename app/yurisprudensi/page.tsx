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

export default function YurisprudensiPage() {
  const [items, setItems] = useState<Jurisprudence[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchJurisprudence()
  }, [])

  const fetchJurisprudence = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (category) params.append('category', category)
      
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
    fetchJurisprudence()
  }

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'pidana', label: 'Pidana' },
    { value: 'perdata', label: 'Perdata' },
    { value: 'keluarga', label: 'Keluarga' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Yurisprudensi Indonesia</h1>
      <p className="text-gray-600 mb-8">
        Cari dan pelajari kasus-kasus yurisprudensi dari Mahkamah Agung dan Mahkamah Konstitusi.
      </p>

      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan keyword atau ringkasan..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Cari
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 mt-4">Memuat data yurisprudensi...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Tidak ada hasil ditemukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {item.court}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{item.date}</span>
                </div>
                {item.relevance_score && (
                  <span className="text-sm font-medium text-gray-600">
                    Relevansi: {(item.relevance_score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.case_number}</h3>
              <p className="text-gray-700 mb-3">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                {item.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
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
                  className="text-sm text-primary-600 hover:underline mt-3 inline-block"
                >
                  Lihat sumber →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
