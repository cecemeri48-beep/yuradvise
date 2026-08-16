'use client'

import { useState, useEffect } from 'react'
import LogoIcon from './LogoIcon'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl animate-pulse" />
              <div>
                <div className="w-28 h-6 bg-slate-700 rounded" />
                <div className="w-36 h-3 bg-slate-800 rounded mt-1" />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-b border-amber-500/20'
            : 'bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <a href="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                {/* Glow ring on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Logo Graphic */}
                <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 shadow-xl border border-amber-400/40">
                  <LogoIcon className="w-10 h-10" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                    BADIK
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
                    OFFICIAL
                  </span>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                  RCS.CBS — Reformasi Kebijakan dan Sistem
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
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
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-amber-300 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl text-amber-300 hover:bg-white/10 border border-amber-500/20 transition-all ml-2"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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

              {/* Start CTA */}
              <a
                href="/mulai"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 border border-amber-300/40"
              >
                <span>Mulai Konsultasi</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-amber-400 hover:bg-white/10 border border-amber-500/20 transition-all"
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

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-2xl border-t border-amber-500/20 shadow-2xl">
            <div className="px-4 py-5 space-y-2">
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
                  className="block px-4 py-3 text-slate-200 hover:text-amber-300 hover:bg-white/5 rounded-xl font-medium transition-all"
                >
                  {item.label}
                </a>
              ))}

              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
                <span className="text-slate-200 font-medium text-sm">Mode Tampilan</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <a
                href="/mulai"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg mt-2"
              >
                Mulai Konsultasi Gratis
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
