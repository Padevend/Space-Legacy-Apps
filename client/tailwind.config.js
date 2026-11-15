/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nasa: {
          blue: '#2E3192',
          red: '#C82027',
        },
        space: {
          950: '#030611',
          900: '#050816',
          850: '#0A0F1E',
          800: '#0F172A',
          700: '#141B2D',
          600: '#1F2A44',
          500: '#334066',
          400: '#475774',
          light: '#F8FAFC',
          card: '#111827',
          surface: '#1E293B',
        },
        signal: {
          cyan: '#38BDF8',
          amber: '#F97316',
          emerald: '#10B981',
          yellow: '#FBBF24',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Space Grotesk', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Syne Mono', 'IBM Plex Mono', 'monospace'],
        tech: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 35px rgba(46, 49, 146, 0.35)',
        'glow-red': '0 0 25px rgba(200, 32, 39, 0.30)',
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.25)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.30)',
      }
    },
  },
  plugins: [],
};
