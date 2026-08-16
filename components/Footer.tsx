import LogoIcon from './LogoIcon'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/40 p-1 shadow-lg">
                <LogoIcon className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 tracking-wider">
                  BADIK
                </h3>
                <p className="text-xs text-slate-400 font-medium">RCS.CBS — Reformasi Kebijakan dan Sistem</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Mewujudkan kesetaraan akses informasi keadilan dan bantuan hukum dasar gratis bagi seluruh warga Indonesia berbasis kecerdasan buatan.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-300 tracking-wide">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/mulai', label: 'Konsultasi Hukum AI' },
                { href: '/yurisprudensi', label: 'Direktori Yurisprudensi' },
                { href: '/tentang', label: 'Tentang BADIK' },
                { href: '/kontak', label: 'Hubungi Kami' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-2">
                    <span className="text-amber-400 text-xs">›</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Column */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>⚠️</span> Disclaimer Resmi
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Analisis dan rekomendasi yang dihasilkan oleh BADIK (RCS.CBS) adalah sarana edukasi awal dan informasi keadilan dasar. 
              Output ini bukan merupakan nasihat advokat formal. Untuk penanganan perkara tingkat pengadilan, harap berkonsultasi dengan advokat resmi atau Lembaga Bantuan Hukum (LBH).
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 BADIK — RCS.CBS Reformasi Kebijakan dan Sistem. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-amber-300 cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-amber-300 cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
