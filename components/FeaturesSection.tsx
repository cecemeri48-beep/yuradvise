import LogoIcon from './LogoIcon'

const features = [
  {
    icon: <LogoIcon className="w-9 h-9" showBadge={false} />,
    title: 'Yurisprudensi Indonesia',
    description: 'Akses 100+ putusan terpilih Mahkamah Agung dan Mahkamah Konstitusi terkait hukum perdata, pidana, HAM, dan ketenagakerjaan.',
    badge: 'Database Resmi',
    accentBorder: 'hover:border-amber-400/50',
    iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    gradientBg: 'from-amber-500/10 to-yellow-500/5',
  },
  {
    icon: '🤖',
    title: 'AI Legal Assistant',
    description: 'Sistem rekomendasi cerdas yang memetakan uraian kasus Anda secara presisi dengan dasar hukum dan yurisprudensi relevan.',
    badge: 'AI-Powered',
    accentBorder: 'hover:border-indigo-400/50',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    gradientBg: 'from-indigo-500/10 to-purple-500/5',
  },
  {
    icon: '🎤',
    title: 'Input Suara Interaktif',
    description: 'Kemudahan bercerita masalah hukum langsung melalui rekaman suara dengan teknologi Speech-to-Text otomatis.',
    badge: 'Speech-to-Text',
    accentBorder: 'hover:border-rose-400/50',
    iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    gradientBg: 'from-rose-500/10 to-pink-500/5',
  },
  {
    icon: '🔊',
    title: 'Output Audio Narasi',
    description: 'Dengarkan hasil analisis hukum secara jernih melalui fitur Text-to-Speech kapan pun dan di mana pun.',
    badge: 'Text-to-Speech',
    accentBorder: 'hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    gradientBg: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    icon: '🔒',
    title: 'Kerahasiaan Data Terjamin',
    description: 'Konsultasi aman tanpa kewajiban pendaftaran akun. Privasi dan informasi Anda terlindungi sepenuhnya.',
    badge: 'Anonim & Aman',
    accentBorder: 'hover:border-cyan-400/50',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    gradientBg: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    icon: '🆓',
    title: '100% Gratis Untuk Rakyat',
    description: 'Komitmen BADIK dalam membuka akses keadilan digital secara cuma-cuma bagi seluruh lapisan masyarakat.',
    badge: 'Bantuan Publik',
    accentBorder: 'hover:border-yellow-400/50',
    iconBg: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    gradientBg: 'from-yellow-500/10 to-amber-500/5',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-900 dark:bg-slate-950 text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-widest">
            <span>✦</span> Keunggulan BADIK
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Mengapa Memilih{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              BADIK?
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Perpaduan teknologi AI terkini dan basis data yurisprudensi resmi untuk mempermudah akses keadilan bagi seluruh rakyat Indonesia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-slate-950/80 dark:bg-slate-900/80 rounded-3xl p-8 shadow-2xl border border-slate-800 ${feature.accentBorder} transition-all duration-300 hover:-translate-y-1.5 overflow-hidden`}
            >
              {/* Subtle Card Accent Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              {/* Card Header with Icon & Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {feature.icon}
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 bg-slate-800/90 text-slate-300 border border-slate-700 rounded-full">
                  {feature.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                {feature.description}
              </p>

              {/* Bottom Subtle Arrow Indicator */}
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Pelajari Selengkapnya</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
