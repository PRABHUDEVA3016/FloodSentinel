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
        navy: {
          950: '#060B14',
          900: '#0B132B',
          850: '#0E1A38',
          800: '#132247',
          700: '#1C315E',
          600: '#284682',
        },
        sentinel: {
          cyan: '#06B6D4',
          electric: '#0284C7',
          sky: '#38BDF8',
          glow: '#38BDF8',
          accent: '#0EA5E9',
          alert: '#F97316',
          danger: '#EF4444',
          success: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
