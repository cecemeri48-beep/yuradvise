'use client'

import { useEffect, useState } from 'react'
import LogoIcon from './LogoIcon'

const stats = [
  { value: 100, suffix: '+', label: 'Putusan Yurisprudensi', icon: 'cases' },
  { value: 47, suffix: '+', label: 'Artikel & Panduan Hukum', icon: 'books' },
  { value: 100, suffix: '%', label: 'Bantuan Hukum Gratis', icon: 'free' },
  { value: 0, suffix: ' Rp', label: 'Biaya Konsultasi', icon: 'money' },
]

export default function StatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const timer = setInterval(() => {
      setCounts(prev => {
        return prev.map((count, i) => {
          const target = stats[i].value
          if (count < target) {
            return count + Math.ceil((target - count) / 10)
          }
          return target
        })
      })
    }, 40)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-r from-slate-950 via-navy-950 to-slate-950 text-white relative overflow-hidden border-t border-b border-amber-500/20">
      {/* Background Orbs */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Icon Container */}
              <div className="mb-4 flex justify-center">
                {stat.icon === 'cases' ? (
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-amber-400/40 p-2 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <LogoIcon className="w-full h-full" />
                  </div>
                ) : (
                  <span className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    {stat.icon === 'books' && '📚'}
                    {stat.icon === 'free' && '🎁'}
                    {stat.icon === 'money' && '💎'}
                  </span>
                )}
              </div>

              {/* Counter Value */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mb-2 tracking-tight">
                {counts[index]}{stat.suffix}
              </div>

              {/* Label */}
              <div className="text-slate-300 text-sm sm:text-base font-semibold tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
