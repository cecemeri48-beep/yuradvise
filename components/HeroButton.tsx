interface HeroButtonProps {
  href: string
  label: string
  primary?: boolean
}

export default function HeroButton({ href, label, primary = true }: HeroButtonProps) {
  return (
    <a
      href={href}
      className={`px-8 py-3 rounded-lg font-medium transition-all ${
        primary
          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
          : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500 hover:text-primary-600'
      }`}
    >
      {label}
    </a>
  )
}
