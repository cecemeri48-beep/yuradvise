export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-xl mb-6">
            <span className="text-4xl">⚖️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tentang BADIK</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Platform Bantuan Akses Digital untuk Informasi Keadilan — dikhususkan untuk warga kecil
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">🎯</span>
              Apa itu BADIK?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              BADIK (Bantuan Akses Digital untuk Informasi Keadilan) adalah aplikasi asisten hukum berbasis AI yang dirancang khusus untuk membantu 
              warga Indonesia mengakses informasi hukum dasar secara gratis. Nama BADIK terinspirasi dari senjata tradisional Sulawesi Selatan yang melambangkan keberanian menegakkan kebenaran.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dengan BADIK, Anda dapat mencari yurisprudensi, mengajukan pertanyaan hukum, dan 
              mendapatkan saran awal sebelum memutuskan untuk berkonsultasi dengan advokat profesional.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🌟</span>
              Visi Kami
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Mewujudkan keadilan yang accessible untuk semua warga Indonesia, terutama mereka yang 
              memiliki keterbatasan akses terhadap informasi dan layanan hukum. Kami percaya bahwa 
              pemahaman hukum dasar adalah hak setiap warga negara.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">✨</span>
              Fitur Utama
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Database 100+ kasus yurisprudensi MA dan MK',
                'Saran hukum berbasis AI dengan konteks yurisprudensi',
                'Input suara untuk kemudahan pengguna',
                'Output audio untuk konten yang mudah dicerna',
                'Privasi terjaga - tidak perlu login',
                '100% gratis untuk semua warga Indonesia',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-green-500 font-bold text-lg">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              Disclaimer Penting
            </h2>
            <p className="text-yellow-700 leading-relaxed">
              Output dari BADIK adalah referensi pendidikan dan bukan pengganti konsultasi hukum profesional. 
              Untuk masalah hukum yang serius, silakan konsultasikan dengan advokat atau lembaga bantuan hukum 
              (LBH) yang berwenang.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/mulai"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Mulai Konsultasi Sekarang
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
