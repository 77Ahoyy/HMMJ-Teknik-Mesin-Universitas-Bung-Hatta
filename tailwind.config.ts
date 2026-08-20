import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070f1e',
          800: '#0c1524',
          700: '#132238',
          600: '#1e3250',
          500: '#2b446a',
        },
        gold: {
          300: '#e8c97e',
          400: '#d4af37',
          500: '#c9a84c',
          600: '#b08d32',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
