'use client'

import { useState, useRef, useEffect } from 'react'

interface AdviceResult {
  advice?: string
  note?: string
  error?: string
}

interface ConsultationHistory {
  id: string
  title: string
  category: string
  question: string
  result: AdviceResult
  timestamp: number
}

// Save to localStorage
const saveToHistory = (history: ConsultationHistory[]) => {
  try {
    localStorage.setItem('badik_history', JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const loadHistory = (): ConsultationHistory[] => {
  try {
    const data = localStorage.getItem('badik_history')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

// Save current draft
const saveDraft = (draft: Partial<ConsultationHistory>) => {
  try {
    localStorage.setItem('badik_draft', JSON.stringify(draft))
  } catch (e) {
    console.error('Failed to save draft:', e)
  }
}

const loadDraft = () => {
  try {
    const data = localStorage.getItem('badik_draft')
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
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
  
  // Voice states
  const [isListening, setIsListening] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [volume, setVolume] = useState(0)
  
  // TTS states
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechProgress, setSpeechProgress] = useState(0)
  
  // History states
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<ConsultationHistory[]>([])
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const durationRef = useRef<NodeJS.Timeout | null>(null)

  // Load history and draft on mount
  useEffect(() => {
    setHistory(loadHistory())
    const draft = loadDraft()
    if (draft) {
      if (draft.title) setCaseTitle(draft.title)
      if (draft.category) setCategory(draft.category)
      if (draft.question) setQuestion(draft.question)
    }
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (step < 3) {
      saveDraft({ title: caseTitle, category, question })
    }
  }, [caseTitle, category, question, step])

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

  // Recording duration counter
  useEffect(() => {
    if (isListening) {
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
      // Simulate volume changes
      const volumeInterval = setInterval(() => {
        setVolume(Math.random() * 0.8 + 0.2)
      }, 200)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
        clearInterval(volumeInterval)
      }
    } else {
      setRecordingDuration(0)
      setVolume(0)
    }
  }, [isListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timerRef.current) clearInterval(timerRef.current)
      if (durationRef.current) clearInterval(durationRef.current)
    }
  }, [])

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
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setToast({ message: '🎤 Mendengarkan... Mulailah berbicara', type: 'success' })
    }
    
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      
      if (finalTranscript) {
        setQuestion(prev => prev + (prev ? ' ' : '') + finalTranscript)
      }
      // Show interim transcript as preview
    }
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error !== 'aborted') {
        setToast({ message: 'Gagal mendeteksi suara. Coba lagi.', type: 'error' })
      }
    }
    
    recognitionRef.current.onend = () => {
      setIsListening(false)
    }
    
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // Text-to-Speech
  const speakResult = () => {
    if (!result?.advice) return
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(result.advice)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => {
        setIsSpeaking(true)
        setSpeechProgress(0)
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        setSpeechProgress(100)
        setTimeout(() => setSpeechProgress(0), 1000)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
        setToast({ message: 'Gagal membaca teks', type: 'error' })
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      setToast({ message: 'Browser tidak mendukung text-to-speech', type: 'error' })
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setSpeechProgress(0)
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
    setStep(3)

    try {
      const caseRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: caseTitle, category, question }),
      })

      const caseData = await caseRes.json()
      
      if (caseData.error) throw new Error(caseData.error)

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
      
      if (adviceData.error) throw new Error(adviceData.error)

      setResult(adviceData)
      
      // Save to history
      const newHistory: ConsultationHistory = {
        id: Date.now().toString(),
        title: caseTitle,
        category,
        question,
        result: adviceData,
        timestamp: Date.now(),
      }
      
      const updatedHistory = [newHistory, ...history].slice(0, 10) // Keep last 10
      setHistory(updatedHistory)
      saveToHistory(updatedHistory)
      
      // Clear draft
      localStorage.removeItem('badik_draft')
      
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
    localStorage.removeItem('badik_draft')
  }

  const copyToClipboard = () => {
    if (result?.advice) {
      navigator.clipboard.writeText(result.advice)
      setToast({ message: '📋 Hasil disalin ke clipboard!', type: 'success' })
    }
  }

  const shareToWhatsApp = () => {
    if (result?.advice) {
      const text = encodeURIComponent(`*BADIK - Saran Hukum*\n\n${result.advice}\n\n_Dapatkan konsultasi hukum gratis di yuradvise.vercel.app_`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  const exportToPDF = async () => {
    if (!result?.advice) return
    
    try {
      // Create a temporary HTML element for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>BADIK - Saran Hukum</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0284c7; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .content { white-space: pre-wrap; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⚖️ BADIK</h1>
            <p>Bantuan Akses Digital untuk Informasi Keadilan</p>
            <p><small>${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small></p>
          </div>
          <div class="content">${result.advice}</div>
          <div class="footer">
            <p>Dokumen ini dihasilkan oleh BADIK dan bersifat referensi, bukan pengganti konsultasi hukum profesional.</p>
            <p>Badik.vercel.app</p>
          </div>
        </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 250)
      }
      
      setToast({ message: '📄 Membuka dialog cetak PDF...', type: 'success' })
    } catch (err) {
      setToast({ message: 'Gagal mengekspor PDF', type: 'error' })
    }
  }

  const loadFromHistory = (item: ConsultationHistory) => {
    setCaseTitle(item.title)
    setCategory(item.category)
    setQuestion(item.question)
    setResult(item.result)
    setShowHistory(false)
    setStep(3)
    setToast({ message: '📂 Memuat konsultasi sebelumnya', type: 'success' })
  }

  const clearHistory = () => {
    setHistory([])
    saveToHistory([])
    setToast({ message: '🗑️ Riwayat konsultasi dihapus', type: 'success' })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">📚 Riwayat Konsultasi</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Hapus Semua
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-6">
              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>Belum ada riwayat konsultasi</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors border border-gray-200 hover:border-primary-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.question}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          <button
            onClick={() => setShowHistory(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-primary-300 transition-all"
          >
            📚 Riwayat Konsultasi {history.length > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{history.length}</span>
            )}
          </button>
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
                
                {/* Voice Recording Button with Waveform */}
                <div className="flex items-center gap-3">
                  {isListening && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-0.5 h-4">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className="w-0.5 bg-red-500 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 100}%`,
                              animationDelay: `${bar * 0.1}s`,
                              animationDuration: '0.5s'
                            }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs text-red-600 font-mono">{formatDuration(recordingDuration)}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => isListening ? stopListening() : startListening()}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isListening
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className={isListening ? 'animate-pulse' : ''}>🎤</span>
                    {isListening ? '⏹️ Berhenti' : '🎤 Input Suara'}
                  </button>
                </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                        ✅
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Saran Hukum</h2>
                        <p className="text-sm text-gray-500">Berdasarkan yurisprudensi terkait</p>
                      </div>
                    </div>
                    
                    {/* TTS Controls */}
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakResult}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        isSpeaking
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className={isSpeaking ? 'animate-pulse' : ''}>🔊</span>
                      {isSpeaking ? '⏹️ Berhenti' : '🔊 Dengarkan'}
                    </button>
                  </div>
                  
                  {/* Speech Progress Bar */}
                  {isSpeaking && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${speechProgress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {result.advice || result.note}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Disclaimer:</strong> Ini adalah saran hukum berdasarkan yurisprudensi yang ada, bukan pengganti konsultasi hukum profesional. Untuk masalah serius, silakan konsultasikan dengan advokat.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 min-w-[100px] bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      📋 Salin
                    </button>
                    <button
                      onClick={shareToWhatsApp}
                      className="flex-1 min-w-[100px] bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      📱 WhatsApp
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex-1 min-w-[100px] bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 min-w-[100px] bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      🔄 Baru
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
