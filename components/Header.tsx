'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    
    // Check for saved dark mode preference
    const saved = localStorage.getItem('badik_dark_mode')
    if (saved === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('badik_dark_mode', (!darkMode).toString())
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
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
                      <linearGradient id="bladeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fcd34d"/>
                        <stop offset="25%" stopColor="#fbbf24"/>
                        <stop offset="50%" stopColor="#f59e0b"/>
                        <stop offset="75%" stopColor="#d97706"/>
                        <stop offset="100%" stopColor="#b45309"/>
                      </linearGradient>
                      <linearGradient id="handleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706"/>
                        <stop offset="100%" stopColor="#92400e"/>
                      </linearGradient>
                      <linearGradient id="bandGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7dd3fc"/>
                        <stop offset="50%" stopColor="#38bdf8"/>
                        <stop offset="100%" stopColor="#0284c7"/>
                      </linearGradient>
                      <filter id="shadow3D2" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="6" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
                      </filter>
                    </defs>

                    <circle cx="256" cy="256" r="248" fill="url(#bgGrad2)"/>

                    {/* Blade */}
                    <path d="M 256 60 Q 320 60 340 120 Q 360 180 340 250 Q 320 320 280 380 L 260 400 L 252 420 L 240 400 L 232 380 Q 192 320 172 250 Q 152 180 172 120 Q 192 60 256 60 Z"
                          fill="url(#bladeGrad2)" stroke="#92400e" stroke-width="2"/>

                    {/* Blade highlight */}
                    <path d="M 256 75 Q 305 75 325 125 Q 340 180 325 245 Q 310 310 270 370 L 256 390 L 242 370 Q 202 310 187 245 Q 172 180 187 125 Q 207 75 256 75 Z"
                          fill="rgba(255,255,255,0.25)"/>

                    {/* Handle */}
                    <path d="M 220 400 L 292 400 Q 310 400 310 415 L 310 470 Q 310 485 292 485 L 220 485 Q 202 485 202 470 L 202 415 Q 202 400 220 400 Z"
                          fill="url(#handleGrad2)" stroke="#78350f" stroke-width="2"/>

                    {/* Grip lines */}
                    <line x1="215" y1="415" x2="297" y2="415" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
                    <line x1="212" y1="435" x2="300" y2="435" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
                    <line x1="210" y1="455" x2="302" y2="455" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
                    <line x1="208" y1="470" x2="304" y2="470" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>

                    {/* Blue band */}
                    <rect x="210" y="438" width="92" height="22" rx="4" fill="url(#bandGrad2)" filter="url(#shadow3D2)"/>

                    {/* Pommel */}
                    <path d="M 215 485 L 297 485 Q 315 485 315 500 L 315 515 Q 315 530 297 530 L 215 530 Q 197 530 197 515 L 197 500 Q 197 485 215 485 Z"
                          fill="url(#bladeGrad2)" stroke="#92400e" stroke-width="2"/>

                    {/* Center gem */}
                    <circle cx="256" cy="507" r="14" fill="url(#bandGrad2)"/>
                    <circle cx="256" cy="507" r="8" fill="#0ea5e9"/>

                    {/* Guard */}
                    <path d="M 190 385 L 322 385 Q 335 385 335 395 L 335 410 Q 335 420 322 420 L 190 420 Q 177 420 177 410 L 177 395 Q 177 385 190 385 Z"
                          fill="url(#bladeGrad2)" stroke="#92400e" stroke-width="2" filter="url(#shadow3D2)"/>

                    {/* Rivets */}
                    <circle cx="195" cy="405" r="6" fill="#92400e"/>
                    <circle cx="195" cy="405" r="3" fill="#fbbf24"/>
                    <circle cx="317" cy="405" r="6" fill="#92400e"/>
                    <circle cx="317" cy="405" r="3" fill="#fbbf24"/>

                    {/* Text */}
                    <text x="256" y="590" text-anchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize="48" fontWeight="900" fill="#ffffff">BADIK</text>
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                  BADIK
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:block">Bantuan Akses Digital untuk Informasi Keadilan</p>
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
                title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

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
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
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
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}

              {/* Dark Mode Toggle Mobile */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Mode Gelap</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

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
