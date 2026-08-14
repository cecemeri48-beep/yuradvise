'use client'

import { useState } from 'react'

export default function MulaiPage() {
  const [caseTitle, setCaseTitle] = useState('')
  const [category, setCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'pidana', label: 'Pidana' },
    { value: 'perdata', label: 'Perdata' },
    { value: 'keluarga', label: 'Keluarga' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan' },
    { value: 'tatausaha', label: 'Tata Usaha Negara' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseTitle || !category || !question) {
      setError('Mohon lengkapi semua field')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Create case
      const caseRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: caseTitle, category, question }),
      })

      const caseData = await caseRes.json()
      
      if (caseData.error) {
        throw new Error(caseData.error)
      }

      // Get advice
      const adviceRes = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseData.caseId,
          question_text: question,
          category: category,
        }),
      })

      const adviceData = await adviceRes.json()
      setResult(adviceData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Konsultasi Hukum Gratis</h1>
      <p className="text-gray-600 mb-8">
        Ceritakan masalah hukum Anda, kami akan membantu mencarikan solusi berdasarkan yurisprudensi.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Kasus
          </label>
          <input
            type="text"
            value={caseTitle}
            onChange={(e) => setCaseTitle(e.target.value)}
            placeholder="Contoh: Sengketa Waris Tanah Antar Saudara"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pertanyaan / Deskripsi Masalah
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Jelaskan masalah hukum Anda secara detail..."
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memproses...
            </span>
          ) : (
            'Dapatkan Saran Hukum'
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saran Hukum</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {result.advice || result.note}
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            *Disclaimer: Ini adalah saran hukum berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional.
          </p>
        </div>
      )}
    </div>
  )
}
