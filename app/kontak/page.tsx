'use client'

import { useState } from 'react'

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-widest">
            Dukungan & Komunikasi
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Hubungi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              BADIK
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Tim kami siap menerima masukan, kerjasama pertukaran data yurisprudensi, dan kendala penggunaan platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-amber-500/20 p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center text-xl border border-amber-500/20">✉️</span>
              Kirim Pesan Langsung
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-amber-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-300 mb-2">Alamat Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-300 mb-2">Isi Pesan / Pertanyaan</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-slate-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-4 rounded-2xl font-extrabold text-base hover:shadow-amber-500/20 transition-all shadow-xl"
              >
                Kirim Pesan
              </button>
            </form>

            {submitted && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-sm">Pesan Berhasil Terkirim!</p>
                  <p className="text-xs text-emerald-400">Tim BADIK akan merespons melalui email Anda.</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info Side Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center text-xl border border-indigo-500/20">📞</span>
                Informasi Kontak Official
              </h2>

              <div className="space-y-4">
                {[
                  { icon: '📧', label: 'Email Resmi', value: 'contact@rcs-cbs.id' },
                  { icon: '🌐', label: 'Website Domain', value: 'https://rcs-cbs.id' },
                  { icon: '📍', label: 'Cakupan Layanan', value: 'Seluruh Wilayah Republik Indonesia' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">{item.label}</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-amber-500/20 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-amber-300">Layanan AI 24 Jam</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Fitur konsultasi AI BADIK beroperasi secara otomatis tanpa henti selama 24 jam sehari, 7 hari seminggu. 
                Tim teknis kami memantau stabilitas server secara kontinyu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
