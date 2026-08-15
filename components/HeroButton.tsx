interface HeroButtonProps {
  href: string
  label: string
  primary?: boolean
}

export default function HeroButton({ href, label, primary = true }: HeroButtonProps) {
  return (
    <a
      href={href}
      className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
        primary
          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1'
          : 'bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20'
      }`}
    >
      {label}
    </a>
  )
}
