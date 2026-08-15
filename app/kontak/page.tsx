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
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Punya pertanyaan atau saran? Tim kami siap membantu Anda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">✉️</span>
              Kirim Pesan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 shadow-lg transition-all"
              >
                Kirim Pesan
              </button>
            </form>
            {submitted && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold">Pesan berhasil dikirim!</p>
                  <p className="text-sm">Kami akan segera merespons.</p>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📞</span>
                Informasi Kontak
              </h2>
              <div className="space-y-5">
                {[
                  { icon: '📧', label: 'Email', value: 'hello@badik.hukum.id' },
                  { icon: '🌐', label: 'Website', value: 'https://badik.vercel.app' },
                  { icon: '📍', label: 'Lokasi', value: 'Indonesia' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Jam Operasional</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-100">Senin - Jumat</span>
                  <span className="font-semibold">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Sabtu</span>
                  <span className="font-semibold">09:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Minggu</span>
                  <span className="font-semibold">Tutup</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-primary-100 text-sm">
                  BADIK tersedia 24/7 untuk konsultasi online. Tim support kami responsif pada jam kerja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
