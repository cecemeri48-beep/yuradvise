'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                
                {/* Logo SVG */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" className="w-7 h-7">
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    
                    {/* Scale base */}
                    <rect x="86" y="110" width="20" height="50" rx="3" fill="url(#grad2)"/>
                    
                    {/* Scale beam */}
                    <rect x="50" y="65" width="92" height="12" rx="6" fill="url(#grad2)"/>
                    
                    {/* Left pan */}
                    <path d="M 50 77 L 30 105 Q 28 110 35 110 L 65 110 Q 72 110 70 105 L 50 77" fill="url(#grad2)" stroke="#b45309" stroke-width="1.5"/>
                    
                    {/* Right pan */}
                    <path d="M 142 77 L 122 105 Q 120 110 127 110 L 157 110 Q 164 110 162 105 L 142 77" fill="url(#grad2)" stroke="#b45309" stroke-width="1.5"/>
                    
                    {/* Center pillar */}
                    <rect x="88" y="55" width="16" height="18" rx="2" fill="url(#grad2)"/>
                    
                    {/* Blue band (digital access) */}
                    <rect x="42" y="50" width="108" height="8" rx="4" fill="#38bdf8"/>
                    
                    {/* Decorative dots */}
                    <circle cx="35" cy="108" r="4" fill="#fbbf24"/>
                    <circle cx="157" cy="108" r="4" fill="#fbbf24"/>
                  </svg>
                </div>
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                  BADIK
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5 hidden sm:block">Bantuan Akses Digital untuk Informasi Keadilan</p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/mulai', label: 'Konsultasi' },
                { href: '/yurisprudensi', label: 'Yurisprudensi' },
                { href: '/tentang', label: 'Tentang' },
                { href: '/kontak', label: 'Kontak' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/mulai"
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Mulai Konsultasi
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/mulai', label: 'Konsultasi' },
                { href: '/yurisprudensi', label: 'Yurisprudensi' },
                { href: '/tentang', label: 'Tentang' },
                { href: '/kontak', label: 'Kontak' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/mulai"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Mulai Konsultasi Gratis
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
