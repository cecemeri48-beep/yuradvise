'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RAGDashboard() {
  const router = useRouter()
  const [status, setStatus] = useState<string>('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/embeddings/stats')
      const data = await res.json()
      setStats(data)
      setStatus('Stats loaded successfully')
    } catch (err) {
      setStatus('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const generateEmbeddings = async () => {
    setLoading(true)
    setStatus('Generating embeddings... This may take a few minutes.')
    
    try {
      const res = await fetch('/api/embeddings', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        setStatus(`✅ Success! Generated ${data.result.success}/${data.result.total} embeddings.`)
        await checkStats()
      } else {
        setStatus(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      setStatus(`❌ Failed: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
            BADIK RAG Pipeline Dashboard
          </h1>
          <p className="text-slate-400">Advanced Semantic Search untuk Dokumen Hukum (GRATIS - Google Gemini)</p>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4">📊 Embedding Statistics</h2>
          
          {stats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/80 rounded-xl p-4 text-center">
                <p className="text-3xl font-extrabold text-slate-200">{stats.total}</p>
                <p className="text-sm text-slate-400">Total Records</p>
              </div>
              <div className="bg-emerald-950/50 rounded-xl p-4 text-center border border-emerald-500/30">
                <p className="text-3xl font-extrabold text-emerald-400">{stats.withEmbeddings}</p>
                <p className="text-sm text-emerald-300">With Embeddings</p>
              </div>
              <div className="bg-amber-950/50 rounded-xl p-4 text-center border border-amber-500/30">
                <p className="text-3xl font-extrabold text-amber-400">{stats.withoutEmbeddings}</p>
                <p className="text-sm text-amber-300">Need Embeddings</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Click "Check Stats" to load data</p>
          )}
          
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={checkStats}
              disabled={loading}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : '📋 Check Stats'}
            </button>
            <button
              onClick={generateEmbeddings}
              disabled={loading || !stats || stats.withoutEmbeddings === 0}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : '🚀 Generate Embeddings'}
            </button>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-200 mb-4">⚙️ Setup Instructions</h2>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Run SQL migration in Supabase: <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">database/migrations/003_pgvector_rag.sql</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Pastikan <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">GOOGLE_GENERATIVE_AI_API_KEY</code> sudah ada di Vercel</span>
            </li>
            <li className="pl-9 text-slate-400">
              <p className="text-emerald-400 font-semibold mb-1">✅ API Key sudah ada di project:</p>
              <code className="block bg-slate-950 p-3 rounded-lg font-mono text-sm">
                GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
              </code>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Visit this page and click "Generate Embeddings"</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Start using BADIK with semantic search! 🎉</span>
            </li>
          </ol>
        </div>

        {/* RAG Features */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-200 mb-4">✨ RAG Pipeline Features</h2>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✅</span>
              <span><strong>Semantic Search:</strong> Vector similarity matching menggunakan Google Gemini Embeddings (GRATIS!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✅</span>
              <span><strong>AI Advice:</strong> Generate advice hukum dengan Google Gemini Flash (GRATIS!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✅</span>
              <span><strong>Confidence Scoring:</strong> Setiap hasil termasuk skor kesamaan (0-100%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✅</span>
              <span><strong>Fallback Strategy:</strong> Otomatis fallback ke keyword search jika embeddings belum tersedia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✅</span>
              <span><strong>PostgreSQL pgvector:</strong> Pencarian vektor cepat dengan IVFFlat index</span>
            </li>
          </ul>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`p-4 rounded-xl border ${
            status.includes('✅') ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300' :
            status.includes('❌') ? 'bg-red-950/50 border-red-500/30 text-red-300' :
            'bg-slate-800 border-slate-600 text-slate-300'
          }`}>
            {status}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-semibold transition-colors"
          >
            ← Back to BADIK
          </button>
        </div>
      </div>
    </div>
  )
}
