const stats = [
  { value: '100+', label: 'Kasus Yurisprudensi' },
  { value: '47+', label: 'Artikel Hukum' },
  { value: '100%', label: 'Gratis' },
  { value: '0', label: 'Biaya Pendaftaran' },
]

export default function StatsSection() {
  return (
    <section className="py-12 bg-primary-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-primary-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
