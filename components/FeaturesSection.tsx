const features = [
  {
    icon: '⚖️',
    title: 'Yurisprudensi Indonesia',
    description: 'Database 100+ kasus yurisprudensi MA dan MK terkait penangkapan, kekerasan, dan HAM.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Advice',
    description: 'Dapatkan saran hukum berbasis AI yang direkomendasikan oleh yurisprudensi relevan.',
  },
  {
    icon: '🎤',
    title: 'Input Suara',
    description: 'Ceritakan masalah hukum Anda melalui suara, kami bantu proseskan.',
  },
  {
    icon: '📢',
    title: 'Output Audio',
    description: 'Hasil advice bisa dibaca dengan audio untuk mudah didengarkan.',
  },
  {
    icon: '🔒',
    title: 'Privasi Terjaga',
    description: 'Tidak perlu login. Data Anda aman dan tidak disimpan permanen.',
  },
  {
    icon: '🆓',
    title: '100% Gratis',
    description: 'Akses bantuan hukum dasar tanpa biaya untuk semua warga Indonesia.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Fitur YurAdvise
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Dirancang khusus untuk memudahkan warga Indonesia mengakses informasi hukum dasar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
