import LogoIcon from '@/components/LogoIcon'

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-900 border border-amber-400/40 rounded-3xl shadow-2xl p-2 mb-2">
            <LogoIcon className="w-full h-full" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Tentang{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              BADIK
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Reformasi Kebijakan dan Sistem — Inisiatif kecerdasan buatan untuk keterbukaan akses bantuan keadilan dan edukasi hukum warga Indonesia.
          </p>
        </div>

        {/* Informational Cards */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-3">
              <span>🎯</span> Apa Itu BADIK?
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              BADIK (RCS.CBS - Reformasi Kebijakan dan Sistem) adalah platform asisten hukum digital berbasis AI yang dirancang untuk mempermudah 
              masyarakat dalam memahami hak-hak hukum dasar, menelusuri rujukan yurisprudensi Mahkamah Agung & Mahkamah Konstitusi, serta 
              memperoleh rekomendasi langkah penanganan hukum.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
              <span>🌟</span> Visi Utama
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              Mewujudkan kesetaraan akses informasi keadilan bagi seluruh rakyat Indonesia, terutama masyarakat yang memiliki keterbatasan 
              akses ke perpustakaan hukum atau konsultasi advokat berbayar. BADIK percaya bahwa pemahaman hukum dasar adalah hak mutlak setiap warga negara.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-3">
              <span>✨</span> Fitur & Layanan Unggulan
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
              {[
                'Database 100+ Yurisprudensi Resmi MA & MK',
                'Analisis Hukum Berbasis Kecerdasan Buatan (AI)',
                'Input Dikte Suara (Speech-to-Text)',
                'Output Narasi Suara (Text-to-Speech)',
                'Export Dokumen PDF & WhatsApp Sharing',
                'Tanpa Login & Kerahasiaan 100% Terjaga',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-8 space-y-3">
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-3">
              <span>⚠️</span> Disclaimer Penggunaan
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Seluruh rekomendasi dan teks yang dihasilkan oleh BADIK (RCS.CBS) merupakan sarana edukasi awal. BADIK bukan merupakan badan hukum advokat formal. 
              Untuk pendampingan di persidangan atau kasus pidana/perdata yang kompleks, kami sangat menyarankan Anda menghubungi advokat resmi atau Lembaga Bantuan Hukum (LBH) terdekat.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <a
            href="/mulai"
            className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl font-extrabold text-lg shadow-xl hover:shadow-amber-500/20 transition-all"
          >
            <span>Mulai Konsultasi Hukum Gratis</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
