'use client'

import { useState, useRef, useEffect } from 'react'

interface MatchedCase {
  case_number: string
  court: string
  summary: string
  matched_keywords: string[]
}

interface AdviceResult {
  advice?: string
  note?: string
  error?: string
  matchedCases?: MatchedCase[]
}

interface ConsultationHistory {
  id: string
  title: string
  category: string
  question: string
  result: AdviceResult
  timestamp: number
}

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
  const [interimText, setInterimText] = useState('')
  
  // TTS states
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // History states
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<ConsultationHistory[]>([])
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastAddedTextRef = useRef<string>('')
  const isListeningRef = useRef<boolean>(false)

  useEffect(() => {
    setHistory(loadHistory())
    const draft = loadDraft()
    if (draft) {
      if (draft.title) setCaseTitle(draft.title)
      if (draft.category) setCategory(draft.category)
      if (draft.question) setQuestion(draft.question)
    }
  }, [])

  useEffect(() => {
    if (step < 3) {
      saveDraft({ title: caseTitle, category, question })
    }
  }, [caseTitle, category, question, step])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [question])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    if (isListening) {
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    } else {
      setRecordingDuration(0)
    }
  }, [isListening])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const categories = [
    { value: 'pidana', label: 'Pidana', icon: '⚖️', desc: 'Kejahatan & Pelanggaran Hukum Pidana', border: 'hover:border-red-400/60' },
    { value: 'perdata', label: 'Perdata', icon: '📋', desc: 'Sengketa Tanah, Utang & Perjanjian', border: 'hover:border-blue-400/60' },
    { value: 'keluarga', label: 'Keluarga', icon: '👨‍👩‍👧‍👦', desc: 'Waris, Perkawinan & Perceraian', border: 'hover:border-purple-400/60' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan', icon: '💼', desc: 'Hubungan Kerja, Gaji & PHK', border: 'hover:border-emerald-400/60' },
    { value: 'tatausaha', label: 'Tata Usaha Negara', icon: '🏛️', desc: 'Sengketa Keputusan Pejabat Public', border: 'hover:border-amber-400/60' },
  ]

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setToast({ message: 'Browser Anda tidak mendukung input suara. Gunakan Google Chrome.', type: 'error' })
      return
    }
    
    // Stop any existing recognition first
    stopListening()
    
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'id-ID'
    recognitionRef.current.continuous = false  // Single-shot for stability
    recognitionRef.current.interimResults = true
    recognitionRef.current.maxAlternatives = 1

    recognitionRef.current.onstart = () => {
      isListeningRef.current = true
      setIsListening(true)
      setRecordingDuration(0)
      setInterimText('')
      lastAddedTextRef.current = ''
    }
    
    recognitionRef.current.onresult = (event: any) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim()
        if (!transcript) continue
        
        if (event.results[i].isFinal) {
          final += transcript + ' '
        } else {
          interim = transcript
        }
      }
      
      // Update interim display
      if (interim) {
        setInterimText(interim)
      }
      
      // Process final results - ADD IMMEDIATELY without delay
      if (final) {
        const normalized = final.toLowerCase().replace(/\s+/g, ' ').trim()
        
        // Skip very short or empty
        if (normalized.length < 5) {
          setInterimText('')
          return
        }
        
        // Skip exact duplicates of last added
        if (normalized === lastAddedTextRef.current) {
          setInterimText('')
          return
        }
        
        // Skip if contains recent text (avoid repeats)
        const last50 = lastAddedTextRef.current.slice(-50)
        if (last50 && (normalized.includes(last50) || last50.includes(normalized))) {
          setInterimText('')
          return
        }
        
        lastAddedTextRef.current = normalized
        setInterimText('')
        
        // Add to question immediately
        setQuestion((prev: string) => {
          const prevLower = prev.toLowerCase()
          // Skip if already contains similar text
          if (prevLower.includes(normalized.slice(0, 15))) return prev
          return prev + (prev ? ' ' : '') + final.trim()
        })
      }
    }
    
    recognitionRef.current.onerror = (event: any) => {
      console.log('[Voice] error:', event.error)
      
      // Don't restart on these errors
      if (event.error === 'not-allowed') {
        isListeningRef.current = false
        setIsListening(false)
        setInterimText('')
        setToast({ message: 'Izin mikrofon ditolak. Buka Settings > Site Settings > Microphone.', type: 'error' })
        return
      }
      
      if (event.error === 'network') {
        isListeningRef.current = false
        setIsListening(false)
        setInterimText('')
        setToast({ message: 'Koneksi internet diperlukan untuk input suara.', type: 'error' })
        return
      }
      
      // For no-speech and other transient errors, just stop
      if (event.error !== 'aborted') {
        isListeningRef.current = false
        setIsListening(false)
        setInterimText('')
      }
    }
    
    recognitionRef.current.onend = () => {
      // Only update if we haven't already stopped
      if (isListeningRef.current) {
        isListeningRef.current = false
        setIsListening(false)
        setInterimText('')
      }
    }
    
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.log('[Voice] Start error:', e)
      isListeningRef.current = false
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      isListeningRef.current = false
      setIsListening(false)
      setInterimText('')
      lastAddedTextRef.current = ''
    }
  }

  const speakResult = () => {
    if (!result?.advice) return
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(result.advice)
      utterance.lang = 'id-ID'
      utterance.rate = 0.95
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    } else {
      setToast({ message: 'Browser tidak mendukung Text-to-Speech', type: 'error' })
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const handleNext = () => {
    if (step === 1 && !caseTitle) {
      setToast({ message: 'Mohon isi judul kasus terlebih dahulu', type: 'error' })
      return
    }
    if (step === 1 && !category) {
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
    console.log('[Mulai] Submit handler called')
    if (!caseTitle || !category || !question) {
      console.log('[Mulai] Validation failed:', { caseTitle, category, question })
      setToast({ message: 'Mohon lengkapi seluruh kolom konsultasi', type: 'error' })
      return
    }

    console.log('[Mulai] Setting isLoading=true, step=3')
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    // Force step change with small delay for UI update
    await new Promise(resolve => setTimeout(resolve, 50))
    setStep(3)

    try {
      console.log('[Mulai] Calling /api/cases...')
      const caseRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: caseTitle, category, question }),
      })
      console.log('[Mulai] Cases response status:', caseRes.status)
      const caseData = await caseRes.json()
      console.log('[Mulai] Cases response:', caseData)
      if (caseData.error) throw new Error(caseData.error)

      console.log('[Mulai] Calling /api/advice...')
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
      console.log('[Mulai] Advice response status:', adviceRes.status)
      const adviceData = await adviceRes.json()
      console.log('[Mulai] Advice response:', adviceData)
      if (adviceData.error) throw new Error(adviceData.error)

      console.log('[Mulai] Setting result')
      setResult(adviceData)
      
      const newHistory: ConsultationHistory = {
        id: Date.now().toString(),
        title: caseTitle,
        category,
        question,
        result: adviceData,
        timestamp: Date.now(),
      }
      
      const updatedHistory = [newHistory, ...history].slice(0, 10)
      setHistory(updatedHistory)
      saveToHistory(updatedHistory)
      
      localStorage.removeItem('badik_draft')
      setToast({ message: '✅ Analisis hukum BADIK selesai!', type: 'success' })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      setError(errorMsg)
      setToast({ message: `❌ ${errorMsg}`, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Add timeout protection
  const handleSubmitWithTimeout = async (e: React.FormEvent) => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError('Permintaan terlalu lama. Silakan coba lagi.')
        setIsLoading(false)
        setToast({ message: '⏱️ Waktu konsultasi habis', type: 'error' })
      }
    }, 60000) // 60 seconds timeout
    
    try {
      await handleSubmit(e)
    } finally {
      clearTimeout(timeoutId)
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
      setToast({ message: '📋 Hasil analisis disalin ke clipboard!', type: 'success' })
    }
  }

  const shareToWhatsApp = () => {
    if (result?.advice) {
      const text = encodeURIComponent(`*BADIK - Hasil Analisis Hukum*\n\n${result.advice}\n\n_Bantuan hukum digital dari BADIK (RCS.CBS)_`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  const exportToPDF = async () => {
    if (!result?.advice) return
    
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>BADIK - Dokumen Rekomendasi Hukum</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0b132b; margin: 0; font-size: 26px; }
            .header p { color: #d97706; margin: 5px 0; font-weight: bold; }
            .meta { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
            .content { white-space: pre-wrap; line-height: 1.8; font-size: 14px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BADIK — Reformasi Kebijakan dan Sistem</h1>
            <p>DOKUMEN SARAN DAN YURISPRUDENSI HUKUM DIGITAL</p>
            <small>${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
          </div>
          <div class="meta">
            <strong>Judul Perkara:</strong> ${caseTitle}<br/>
            <strong>Kategori Hukum:</strong> ${category.toUpperCase()}<br/>
          </div>
          <div class="content">${result.advice}</div>
          <div class="footer">
            <p>Dokumen ini dihasilkan oleh BADIK (RCS.CBS) berbasis AI sebagai sarana rujukan edukasi hukum dasar.</p>
          </div>
        </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => printWindow.print(), 300)
      }
      setToast({ message: '📄 Membuka dialog cetak PDF...', type: 'success' })
    } catch (err) {
      setToast({ message: 'Gagal mencetak dokumen PDF', type: 'error' })
    }
  }

  const loadFromHistory = (item: ConsultationHistory) => {
    setCaseTitle(item.title)
    setCategory(item.category)
    setQuestion(item.question)
    setResult(item.result)
    setShowHistory(false)
    setStep(3)
    setToast({ message: '📂 Riwayat konsultasi dimuat', type: 'success' })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const selectedCategory = categories.find(c => c.value === category)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
            : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
        }`}>
          <span className="font-semibold text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      {/* History Modal Drawer */}
      {showHistory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <span>📚</span> Riwayat Konsultasi BADIK
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p>Belum ada riwayat konsultasi tersimpan</p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-amber-400/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white group-hover:text-amber-300">{item.title}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.question}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-widest">
            Asisten Legal AI Resmi
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Konsultasi Hukum{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              BADIK
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Uraikan masalah hukum Anda untuk mendapatkan rekomendasi penanganan dan rujukan yurisprudensi.
          </p>
          <button
            onClick={() => setShowHistory(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-amber-400/50 rounded-full text-xs text-slate-300 hover:text-amber-300 transition-all shadow-md"
          >
            <span>📚 Riwayat Konsultasi</span>
            {history.length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px]">{history.length}</span>
            )}
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center">
          {[
            { num: 1, label: 'Kategori & Judul' },
            { num: 2, label: 'Uraian Masalah' },
            { num: 3, label: 'Hasil Analisis' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div 
                className={`flex flex-col items-center gap-2 cursor-pointer ${
                  step >= s.num ? 'opacity-100' : 'opacity-40'
                }`}
                onClick={() => step > s.num && setStep(s.num)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xl ${
                  step > s.num 
                    ? 'bg-emerald-500 text-slate-950' 
                    : step === s.num
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 scale-110 border-2 border-amber-300'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs font-semibold ${
                  step >= s.num ? 'text-amber-300' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`w-16 sm:w-28 h-1 rounded mx-3 transition-all duration-300 ${
                  step > s.num ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Form Container */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-500/20 p-6 sm:p-10">
          {error && (
            <div className="mb-6 bg-rose-950/80 border border-rose-500/40 text-rose-300 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Step 1: Case Title & Category */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-amber-300 mb-2">
                  1. Judul Kasus / Permasalahan
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Contoh: Sengketa Batas Batas Tanah Sertifikat Ganda"
                  className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-300 mb-3">
                  2. Pilih Kategori Hukum
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                        category === cat.value
                          ? 'border-amber-400 bg-amber-500/10 shadow-xl'
                          : `border-slate-800 bg-slate-950/60 ${cat.border} hover:bg-slate-800/40`
                      }`}
                    >
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <p className="font-bold text-white text-base">{cat.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!caseTitle || !category}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 py-4 rounded-2xl font-extrabold text-lg hover:shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl"
              >
                Lanjut ke Uraian Masalah →
              </button>
            </div>
          )}

          {/* Step 2: Question Description & Voice Input */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">Judul Kasus: <span className="font-bold text-white">{caseTitle}</span></p>
                  <p className="text-xs text-slate-400">Kategori: <span className="font-bold text-amber-300 uppercase">{selectedCategory?.label}</span></p>
                </div>
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={() => isListening ? stopListening() : startListening()}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>🎤</span>
                  {isListening ? `Mendengarkan... ${interimText ? '"' + interimText.slice(0, 20) + '…"' : '(' + formatDuration(recordingDuration) + ')'}` : 'Input dengan Suara'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-300 mb-2">
                  3. Jelaskan Detail Peristiwa / Kronologi
                </label>
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ceritakan peristiwa secara kronologis: kapan kejadian, siapa pihak yang terlibat, dokumen hukum yang Anda miliki..."
                  rows={6}
                  className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base text-white placeholder-slate-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={!question}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-4 rounded-2xl font-extrabold text-lg hover:shadow-amber-500/20 disabled:opacity-40 transition-all shadow-xl"
                >
                  Analisis Kasus →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result & Actions */}
          {step === 3 && (
            <div className="space-y-8">
              {isLoading ? (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 shadow-xl shadow-amber-500/20">
                    <svg className="animate-spin h-12 w-12 text-amber-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Menganalisis Perkara dengan Yurisprudensi...</h3>
                    <p className="text-slate-400 text-sm">BADIK sedang memetakan dasar hukum Mahkamah Agung & MK</p>
                    <div className="mt-6 flex justify-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <span className="text-4xl">❌</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Analisis Gagal</h3>
                    <p className="text-rose-400 text-sm mt-2">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/20"
                  >
                    ← Ulangi Analisis
                  </button>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Result Header & Audio button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">
                        ✓ Analisis Legal Selesai
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-2">Rekomendasi Hukum BADIK</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={isSpeaking ? stopSpeaking : speakResult}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          isSpeaking
                            ? 'bg-purple-600 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>🔊</span>
                        {isSpeaking ? 'Berhenti Audio' : 'Dengarkan Audio'}
                      </button>
                    </div>
                  </div>

                  {/* Yurisprudensi yang Cocok */}
                  {result.matchedCases && result.matchedCases.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold">
                          ✓ {result.matchedCases.length} Putusan Ditemukan
                        </span>
                        {result.note && (
                          <span className="text-xs text-slate-400">{result.note}</span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {result.matchedCases.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="font-bold text-white text-sm">{item.case_number}</span>
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-xs font-mono">
                                {item.court}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">{item.summary}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.matched_keywords.slice(0, 5).map((kw, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full"
                                >
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advice Content Card */}
                  <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                    {result.advice}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700"
                      >
                        <span>📋</span> Salin Teks
                      </button>
                      <button
                        onClick={shareToWhatsApp}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                      >
                        <span>💬</span> Bagikan WhatsApp
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-2"
                      >
                        <span>📄</span> Export PDF
                      </button>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold border border-slate-800"
                    >
                      Konsultasi Baru
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
