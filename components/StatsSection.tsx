'use client'

import { useEffect, useState } from 'react'

const stats = [
  { value: 100, suffix: '+', label: 'Kasus Yurisprudensi', icon: '⚖️' },
  { value: 47, suffix: '+', label: 'Artikel Hukum', icon: '📚' },
  { value: 100, suffix: '%', label: 'Gratis Selamanya', icon: '🆓' },
  { value: 0, suffix: '', label: 'Biaya Pendaftaran', icon: '💰' },
]

export default function StatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const timer = setInterval(() => {
      setCounts(prev => {
        const newCounts = prev.map((count, i) => {
          const target = stats[i].value
          if (count < target) {
            return count + Math.ceil((target - count) / 10)
          }
          return target
        })
        return newCounts
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {counts[index]}{stat.suffix}
              </div>
              <div className="text-primary-200 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
