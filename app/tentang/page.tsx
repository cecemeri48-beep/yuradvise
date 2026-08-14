export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tentang YurAdvise</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Apa itu YurAdvise?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          YurAdvise adalah aplikasi asisten hukum berbasis AI yang dirancang khusus untuk membantu 
          warga Indonesia mengakses informasi hukum dasar secara gratis. Aplikasi ini menyediakan 
          akses ke database yurisprudensi Indonesia dan memberikan saran hukum berdasarkan kasus-kasus sebelumnya.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Dengan YurAdvise, Anda dapat mencari yurisprudensi, mengajukan pertanyaan hukum, dan 
          mendapatkan saran awal sebelum memutuskan untuk berkonsultasi dengan advokat profesional.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visi Kami</h2>
        <p className="text-gray-700 leading-relaxed">
          Mewujudkan keadilan yang accessible untuk semua warga Indonesia, terutama mereka yang 
          memiliki keterbatasan akses terhadap informasi dan layanan hukum. Kami percaya bahwa 
          pemahaman hukum dasar adalah hak setiap warga negara.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur Utama</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>Database 100+ kasus yurisprudensi MA dan MK</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>Saran hukum berbasis AI dengan konteks yurisprudensi</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>Input suara untuk kemudahan pengguna</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>Output audio untuk konten yang mudah dicerna</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>Privasi terjaga - tidak perlu login</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold">✓</span>
            <span>100% gratis untuk semua warga Indonesia</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Disclaimer Penting</h2>
        <p className="text-yellow-700 leading-relaxed">
          Output dari YurAdvise adalah referensi pendidikan dan bukan pengganti konsultasi hukum profesional. 
          Untuk masalah hukum yang serius, silakan konsultasikan dengan advokat atau lembaga bantuan hukum 
          (LBH) yang berwenang.
        </p>
      </div>
    </div>
  )
}
