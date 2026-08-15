import LogoIcon from './LogoIcon'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-primary-100 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Layanan Hukum Gratis 24/7 untuk Warga Indonesia
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Solusi Hukum{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300">
                Cerdas
              </span>
              <br />
              Untuk Rakyat Kecil
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              BADIK membantu Anda memahami hak-hak hukum, menemukan yurisprudensi terkait, 
              dan mendapatkan saran hukum berbasis AI secara gratis.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/mulai"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Konsultasi Sekarang
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/tentang"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
              {[
                { icon: '✓', text: '100+ Kasus Yurisprudensi' },
                { icon: '✓', text: 'AI-Powered Advice' },
                { icon: '✓', text: '100% Gratis' },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-green-400">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Visual Element */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Main card */}
              <div className="w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <LogoIcon className="w-12 h-12" />
                  <div>
                    <p className="text-white font-semibold">BADIK</p>
                    <p className="text-gray-400 text-sm">Bantuan Akses Digital untuk Informasi Keadilan</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-300 text-sm">Sengketa waris tanah antar saudara...</p>
                  </div>
                  <div className="bg-primary-500/20 rounded-xl p-3 border border-primary-400/30">
                    <p className="text-primary-200 text-sm">🤖 Menganalisis yurisprudensi terkait...</p>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
                    <p className="text-green-200 text-sm">✓ 3 kasus relevan ditemukan</p>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <p className="text-3xl font-bold text-primary-600">100+</p>
                <p className="text-gray-600 text-sm">Kasus Yurisprudensi</p>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <p className="text-3xl font-bold text-green-600">100%</p>
                <p className="text-gray-600 text-sm">Gratis Selamanya</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
