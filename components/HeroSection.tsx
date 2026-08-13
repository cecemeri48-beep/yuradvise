import HeroButton from '@/components/HeroButton'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🆓 Gratis untuk Semua Warga Indonesia
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Bantuan Hukum Gratis<br />
          <span className="text-primary-600">Untuk Rakyat Kecil</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          YurAdvise membantu Anda memahami hak-hak hukum, menemukan yurisprudensi terkait,
          dan mendapatkan saran hukum dasar secara gratis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <HeroButton 
            href="/mulai" 
            label="Mulai Konsultasi Gratis"
            primary={true}
          />
          <HeroButton 
            href="/tentang" 
            label="Pelajari Lebih Lanjut"
            primary={false}
          />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">✓ 100+ Kasus Yurisprudensi</span>
          <span className="flex items-center gap-2">✓ AI-Powered Advice</span>
          <span className="flex items-center gap-2">✓ 100% Gratis</span>
        </div>
      </div>
    </section>
  )
}
