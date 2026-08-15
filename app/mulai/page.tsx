'use client'

import { useState, useRef, useEffect } from 'react'

interface AdviceResult {
  advice?: string
  note?: string
  error?: string
}

export default function MulaiPage() {
  const [step, setStep] = useState(1)
  const [caseTitle, setCaseTitle] = useState('')
  const [category, setCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AdviceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [question])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const categories = [
    { value: 'pidana', label: 'Pidana', icon: '⚖️', desc: 'Kejahatan & Pelanggaran Hukum Pidana' },
    { value: 'perdata', label: 'Perdata', icon: '📋', desc: 'Sengketa Perdata & Perjanjian' },
    { value: 'keluarga', label: 'Keluarga', icon: '👨‍👩‍👧‍👦', desc: 'Hukum Keluarga & Perkawinan' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan', icon: '💼', desc: 'Hubungan Kerja & PHK' },
    { value: 'tatausaha', label: 'Tata Usaha Negara', icon: '🏛️', desc: 'Sengketa dengan Pemerintah' },
  ]

  // Voice Input using Web Speech API
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setToast({ message: 'Browser tidak mendukung input suara. Gunakan Chrome.', type: 'error' })
      return
    }
    
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'id-ID'
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onstart = () => setIsListening(true)
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuestion(prev => prev + (prev ? ' ' : '') + transcript)
      setIsListening(false)
    }
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setToast({ message: 'Gagal mendeteksi suara. Coba lagi.', type: 'error' })
    }
    recognitionRef.current.onend = () => setIsListening(false)
    
    recognitionRef.current.start()
    setToast({ message: '🎤 Mulailah berbicara...', type: 'success' })
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleNext = () => {
    if (step === 1 && !caseTitle) {
      setToast({ message: 'Mohon isi judul kasus terlebih dahulu', type: 'error' })
      return
    }
    if (step === 2 && !category) {
      setToast({ message: 'Mohon pilih kategori hukum', type: 'error' })
      return
    }
    setStep(step + 1)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseTitle || !category || !question) {
      setToast({ message: 'Mohon lengkapi semua field', type: 'error' })
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setStep(3) // Show result step

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
          query_id: caseData.queryId,
          question_text: question,
          category: category,
        }),
      })

      const adviceData = await adviceRes.json()
      
      if (adviceData.error) {
        throw new Error(adviceData.error)
      }

      setResult(adviceData)
      setToast({ message: '✅ Saran hukum berhasil dihasilkan!', type: 'success' })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(errorMsg)
      setToast({ message: `❌ ${errorMsg}`, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCaseTitle('')
    setCategory('')
    setQuestion('')
    setResult(null)
    setError(null)
    setStep(1)
  }

  const copyToClipboard = () => {
    if (result?.advice) {
      navigator.clipboard.writeText(result.advice)
      setToast({ message: '📋 Hasil disalin ke clipboard!', type: 'success' })
    }
  }

  const shareToWhatsApp = () => {
    if (result?.advice) {
      const text = encodeURIComponent(`*BADIK - Saran Hukum*\n\n${result.advice}\n\n_Dapatkan konsultasi hukum gratis di badik.vercel.app_`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  const selectedCategory = categories.find(c => c.value === category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}

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
          {[
            { num: 1, label: 'Judul' },
            { num: 2, label: 'Detail' },
            { num: 3, label: 'Hasil' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div 
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
                  step >= s.num ? 'opacity-100' : 'opacity-50'
                }`}
                onClick={() => step > s.num && setStep(s.num)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step > s.num 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : step === s.num
                    ? 'bg-primary-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs font-medium ${
                  step >= s.num ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`w-16 md:w-24 h-1 rounded mx-2 transition-all duration-300 ${
                  step > s.num ? 'bg-green-500' : 'bg-gray-200'
                }`} />
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

          {/* Step 1: Case Title & Category */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
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
                  2. Pilih Kategori Hukum
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

              <button
                type="button"
                onClick={handleNext}
                disabled={!caseTitle || !category}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Lanjut ke Detail →
              </button>
            </div>
          )}

          {/* Step 2: Question Description */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Judul: <span className="font-semibold text-gray-900">{caseTitle}</span></p>
                  <p className="text-sm text-gray-500">Kategori: <span className="font-semibold text-gray-900">{selectedCategory?.label}</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => isListening ? stopListening() : startListening()}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? '⏹️ Berhenti' : '🎤 Input Suara'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. Deskripsi Masalah
                </label>
                <textarea
                  ref={textareaRef}
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

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!question}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Lanjut ke Hasil →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Submit & Result */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {!result ? (
                <>
                  <div className="bg-primary-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Konsultasi</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-medium">Judul:</span> {caseTitle}</p>
                      <p><span className="font-medium">Kategori:</span> {selectedCategory?.label}</p>
                      <p><span className="font-medium">Deskripsi:</span> {question.substring(0, 100)}{question.length > 100 ? '...' : ''}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      ← Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-3">
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
                  </div>
                </>
              ) : (
                <>
                  {/* Result Display */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      📋 Salin
                    </button>
                    <button
                      onClick={shareToWhatsApp}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      📱 WhatsApp
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      🔄 Konsultasi Baru
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          BADIK © 2026 — Bantuan Akses Digital untuk Informasi Keadilan
        </p>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
