'use client'

import { useState } from 'react'

export default function MulaiPage() {
  const [step, setStep] = useState(1)
  const [caseTitle, setCaseTitle] = useState('')
  const [category, setCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'pidana', label: 'Pidana', icon: '⚖️', desc: 'Kejahatan & Pelanggaran Hukum Pidana' },
    { value: 'perdata', label: 'Perdata', icon: '📋', desc: 'Sengketa Perdata & Perjanjian' },
    { value: 'keluarga', label: 'Keluarga', icon: '👨‍👩‍👧‍👦', desc: 'Hukum Keluarga & Perkawinan' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan', icon: '💼', desc: 'Hubungan Kerja & PHK' },
    { value: 'tatausaha', label: 'Tata Usaha Negara', icon: '🏛️', desc: 'Sengketa dengan Pemerintah' },
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

  const selectedCategory = categories.find(c => c.value === category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Konsultasi Hukum Gratis
          </h1>
          <p className="text-gray-600 text-lg">
            Ceritakan masalah hukum Anda, kami akan membantu mencarikan solusi berdasarkan yurisprudensi.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= s 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`w-16 md:w-24 h-1 rounded ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Case Title */}
            <div className={`space-y-4 ${step > 1 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. Judul Kasus
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Contoh: Sengketa Waris Tanah Antar Saudara"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  2. Pilih Kategori
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        category === cat.value
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{cat.label}</p>
                          <p className="text-sm text-gray-500">{cat.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Question */}
            <div className={`space-y-4 ${step > 2 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. Deskripsi Masalah
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Jelaskan masalah hukum Anda secara detail. Semakin detail, semakin baik saran yang kami berikan..."
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition-colors resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Tips: Sertakan kronologi, pihak yang terlibat, dan dokumen yang dimiliki.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menganalisis Yurisprudensi...
                </span>
              ) : (
                'Dapatkan Saran Hukum'
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saran Hukum</h2>
                  <p className="text-sm text-gray-500">Berdasarkan yurisprudensi terkait</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {result.advice || result.note}
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Disclaimer:</strong> Ini adalah saran hukum berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional. Untuk masalah serius, silakan konsultasikan dengan advokat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
