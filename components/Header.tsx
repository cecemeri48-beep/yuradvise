export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">YurAdvise</h1>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href="/" className="text-gray-600 hover:text-primary-600">Beranda</a>
          <a href="/mulai" className="text-gray-600 hover:text-primary-600">Konsultasi</a>
          <a href="/yurisprudensi" className="text-gray-600 hover:text-primary-600">Yurisprudensi</a>
          <a href="/tentang" className="text-gray-600 hover:text-primary-600">Tentang</a>
          <a href="/kontak" className="text-gray-600 hover:text-primary-600">Kontak</a>
        </nav>
      </div>
    </header>
  )
}
