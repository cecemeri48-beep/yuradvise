import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        navy: {
          800: '#1c2541',
          900: '#0b132b',
          950: '#090d16',
        },
        gold: {
          300: '#fef08a',
          400: '#facc15',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
        'sapphire-gradient': 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #090d16 100%)',
      },
    },
  },
  plugins: [],
}
export default config
