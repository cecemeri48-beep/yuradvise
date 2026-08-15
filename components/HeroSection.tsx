import LogoIcon from './LogoIcon'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Premium dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"></div>
      
      {/* Premium decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft glow orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm text-gray-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Layanan Hukum Premium untuk Warga Indonesia
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
              Solusi Hukum{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                Cerdas
              </span>
              <br />
              <span className="text-gray-300 text-3xl md:text-4xl lg:text-5xl">
                Untuk Rakyat Kecil
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              BADIK membantu Anda memahami hak-hak hukum, menemukan yurisprudensi terkait, 
              dan mendapatkan saran hukum berbasis AI secara <span className="text-amber-400 font-semibold">gratis selamanya</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/mulai"
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  Mulai Konsultasi Gratis
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/tentang"
                className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm">
              {[
                { text: '100+ Kasus Yurisprudensi', color: 'text-emerald-400' },
                { text: 'AI-Powered Advice', color: 'text-blue-400' },
                { text: '100% Gratis', color: 'text-amber-400' },
              ].map((item, i) => (
                <span key={i} className={`flex items-center gap-2 ${item.color}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Premium Visual Element */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              {/* Main premium card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Gold accent border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/10 via-transparent to-blue-500/10 pointer-events-none"></div>
                
                <div className="relative">
                  {/* Header with Logo */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <LogoIcon className="w-14 h-14" />
                    <div>
                      <p className="text-white font-bold text-lg">BADIK</p>
                      <p className="text-gray-400 text-sm">Bantuan Akses Digital untuk Informasi Keadilan</p>
                    </div>
                  </div>
                  
                  {/* Stats - Clean grid inside card */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl p-5 border border-amber-500/20">
                      <p className="text-4xl font-bold text-amber-400">100+</p>
                      <p className="text-gray-300 text-sm mt-2 font-medium">Kasus Yurisprudensi</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-5 border border-emerald-500/20">
                      <p className="text-4xl font-bold text-emerald-400">100%</p>
                      <p className="text-gray-300 text-sm mt-2 font-medium">Gratis Selamanya</p>
                    </div>
                  </div>
                  
                  {/* AI Analysis Cards */}
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-sm flex-shrink-0">📋</div>
                        <div>
                          <p className="text-gray-300 text-sm">Sengketa waris tanah antar saudara...</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                        <div>
                          <p className="text-amber-200 text-sm font-medium">Menganalisis yurisprudensi terkait...</p>
                          <div className="flex gap-1 mt-2">
                            <div className="h-1 w-1 bg-amber-400 rounded-full animate-bounce"></div>
                            <div className="h-1 w-1 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="h-1 w-1 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-sm flex-shrink-0">✓</div>
                        <div>
                          <p className="text-emerald-200 text-sm font-medium">3 kasus relevan ditemukan</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
