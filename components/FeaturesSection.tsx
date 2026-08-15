const features = [
  {
    icon: '⚖️',
    title: 'Yurisprudensi Indonesia',
    description: 'Database 100+ kasus yurisprudensi MA dan MK terkait penangkapan, kekerasan, dan HAM.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Advice',
    description: 'Dapatkan saran hukum berbasis AI yang direkomendasikan oleh yurisprudensi relevan.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    icon: '🎤',
    title: 'Input Suara',
    description: 'Ceritakan masalah hukum Anda melalui suara, kami bantu proseskan dengan teknologi speech-to-text.',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
  },
  {
    icon: '🔊',
    title: 'Output Audio',
    description: 'Hasil advice bisa dibaca dengan audio untuk mudah didengarkan kapan saja.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
  },
  {
    icon: '🔒',
    title: 'Privasi Terjaga',
    description: 'Tidak perlu login. Data Anda aman dan tidak disimpan permanen di server kami.',
    color: 'from-slate-500 to-gray-500',
    bg: 'bg-slate-50',
  },
  {
    icon: '🆓',
    title: '100% Gratis',
    description: 'Akses bantuan hukum dasar tanpa biaya untuk semua warga Indonesia.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-50',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih BADIK?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dirancang khusus untuk memudahkan warga Indonesia mengakses informasi hukum dasar dengan mudah dan gratis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
