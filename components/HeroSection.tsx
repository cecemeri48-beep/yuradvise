import LogoIcon from './LogoIcon'

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-navy-900 to-slate-900 text-white transition-colors duration-300">
      {/* Premium ambient decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft glowing ambient light orbs */}
        <div className="absolute top-12 right-12 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px]" />
        
        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)',
            backgroundSize: '70px 70px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Hero Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Top Official Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-full text-xs sm:text-sm text-slate-200 shadow-xl">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-amber-300">BADIK</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Reformasi Kebijakan & Sistem Law Assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
              Solusi Hukum{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                Cerdas & Precise
              </span>
              <br />
              <span className="text-slate-200 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Untuk Keadilan Warga
              </span>
            </h1>

            {/* Subheading / Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Platform BADIK hadir membantu Anda memahami hak-hak hukum, menjelajah yurisprudensi Mahkamah Agung & MK, 
              serta memperoleh rekomendasi hukum berbasis AI secara <span className="text-amber-400 font-bold underline decoration-amber-400/50 underline-offset-4">gratis selamanya</span>.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/mulai"
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 rounded-2xl font-extrabold text-lg shadow-2xl hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border border-amber-300/40"
              >
                <span className="relative flex items-center gap-2">
                  Mulai Konsultasi Gratis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/yurisprudensi"
                className="px-8 py-4 bg-slate-900/80 border border-slate-700 hover:border-amber-400/50 text-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-800/90 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Cari Yurisprudensi</span>
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </a>
            </div>

            {/* Key Value Propositions */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm">
              {[
                { text: '100+ Yurisprudensi MA & MK', color: 'text-emerald-400', icon: '⚖️' },
                { text: 'AI Legal Advice', color: 'text-amber-300', icon: '🤖' },
                { text: 'Privasi 100% Terjaga', color: 'text-cyan-300', icon: '🔒' },
              ].map((item, i) => (
                <span key={i} className={`flex items-center gap-2 font-semibold ${item.color}`}>
                  <span className="text-base">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Premium Visual Emblem Card */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-3xl blur-xl opacity-30 animate-pulse-glow" />

              {/* Main Card Shell */}
              <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                {/* Background Grid accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative space-y-6">
                  {/* Top Branding Section with RCS.CBS Emblem */}
                  <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-amber-400/40 shadow-lg">
                      <LogoIcon className="w-full h-full" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 tracking-wider">
                        BADIK
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Reformasi Kebijakan dan Sistem</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[11px] text-emerald-400 font-medium">Sistem Legal AI Aktif</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-500/20">
                      <p className="text-3xl font-extrabold text-amber-400">100+</p>
                      <p className="text-slate-300 text-xs mt-1 font-medium">Putusan Yurisprudensi</p>
                    </div>
                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-emerald-500/20">
                      <p className="text-3xl font-extrabold text-emerald-400">100%</p>
                      <p className="text-slate-300 text-xs mt-1 font-medium">Bantuan Gratis</p>
                    </div>
                  </div>

                  {/* Dynamic Interactive Flow Cards */}
                  <div className="space-y-3 pt-2">
                    <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex items-start gap-3">
                      <span className="text-xl">⚖️</span>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Input Permasalahan Hukum:</p>
                        <p className="text-sm text-slate-200 font-semibold">"Sengketa waris tanah sertifikat ganda..."</p>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 rounded-xl p-3.5 border border-amber-500/30 flex items-start gap-3">
                      <span className="text-xl">🤖</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-amber-300 font-semibold">Proses Pencocokan Yurisprudensi</p>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">MA & MK</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <div className="h-1.5 w-6 bg-amber-400 rounded-full animate-pulse" />
                          <div className="h-1.5 w-12 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="h-1.5 w-8 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 rounded-xl p-3.5 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
                        <span className="text-xs text-emerald-300 font-semibold">Rekomendasi Legal Dihasilkan</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">Relevansi 98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center gap-1.5 text-slate-400">
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400/80">Jelajahi Fitur</span>
          <svg className="w-5 h-5 animate-bounce text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
