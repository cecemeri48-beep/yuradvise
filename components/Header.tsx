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
                
                {/* Logo SVG - Full image */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full p-1">
                    <defs>
                      <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9"/>
                        <stop offset="100%" stopColor="#0369a1"/>
                      </linearGradient>
                      <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fcd34d"/>
                        <stop offset="30%" stopColor="#fbbf24"/>
                        <stop offset="70%" stopColor="#d97706"/>
                        <stop offset="100%" stopColor="#b45309"/>
                      </linearGradient>
                      <linearGradient id="goldDark2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706"/>
                        <stop offset="100%" stopColor="#78350f"/>
                      </linearGradient>
                      <linearGradient id="blueGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7dd3fc"/>
                        <stop offset="50%" stopColor="#38bdf8"/>
                        <stop offset="100%" stopColor="#0284c7"/>
                      </linearGradient>
                      <filter id="shadow3D2" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="4" dy="6" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
                      </filter>
                    </defs>
                    
                    {/* Background */}
                    <circle cx="256" cy="256" r="240" fill="url(#bgGrad2)"/>
                    
                    {/* Sword body */}
                    <path d="M 120 100 Q 120 280 140 380 L 200 420 L 180 440 L 100 390 Q 80 280 90 100 Z" 
                          fill="url(#goldGrad2)" filter="url(#shadow3D2)"/>
                    
                    {/* Handle */}
                    <path d="M 200 380 L 340 380 Q 360 380 360 400 L 360 460 Q 360 480 340 480 L 200 480 Z" 
                          fill="url(#goldDark2)" filter="url(#shadow3D2)"/>
                    
                    {/* Blue band */}
                    <rect x="200" y="420" width="160" height="25" rx="5" fill="url(#blueGrad2)" filter="url(#shadow3D2)"/>
                    
                    {/* Pommel */}
                    <path d="M 180 460 L 380 460 Q 390 460 390 470 L 390 480 Q 390 490 380 490 L 180 490 Q 170 490 170 480 L 170 470 Q 170 460 180 460 Z" 
                          fill="url(#goldGrad2)" filter="url(#shadow3D2)"/>
                    
                    {/* Center decoration */}
                    <circle cx="280" cy="475" r="12" fill="url(#blueGrad2)"/>
                    
                    {/* TOP GUARD */}
                    <path d="M 180 360 L 380 360 Q 390 360 390 370 L 390 385 Q 390 395 380 395 L 180 395 Q 170 395 170 385 L 170 370 Q 170 360 180 360 Z" 
                          fill="url(#goldGrad2)" filter="url(#shadow3D2)"/>
                    
                    {/* BADIK text */}
                    <text x="256" y="270" text-anchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize="64" fontWeight="900" fill="#ffffff">
                      BADIK
                    </text>
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
