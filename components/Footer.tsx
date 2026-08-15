export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-xl shadow-lg">
                ⚖️
              </div>
              <div>
                <h3 className="text-xl font-bold">BADIK</h3>
                <p className="text-xs text-gray-400">Bantuan Akses Digital untuk Informasi Keadilan</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Membantu warga Indonesia mengakses informasi hukum dasar secara gratis dan mudah.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Menu Cepat</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/mulai', label: 'Konsultasi' },
                { href: '/yurisprudensi', label: 'Yurisprudensi' },
                { href: '/tentang', label: 'Tentang Kami' },
                { href: '/kontak', label: 'Kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Disclaimer</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Output AI adalah referensi pendidikan, bukan pengganti konsultasi hukum profesional. 
              Untuk masalah serius, konsultasikan dengan advokat.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 BADIK — Dibuat dengan ❤️ untuk rakyat kecil Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
