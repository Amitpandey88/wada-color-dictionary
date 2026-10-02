/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Shippori Mincho"', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        japanese: ['"Shippori Mincho"', '"Noto Serif JP"', 'serif'],
      },
      colors: {
        washi: {
          50: '#fdfcf9',
          100: '#f9f6ef',
          200: '#f3eedf',
          300: '#e8dfc8',
          800: '#22201b',
          900: '#171513',
          950: '#0f0e0c',
        }
      },
      boxShadow: {
        'swatch': '0 4px 20px -2px rgba(28, 25, 23, 0.08), 0 2px 6px -1px rgba(28, 25, 23, 0.04)',
        'plate': '0 12px 36px -4px rgba(28, 25, 23, 0.12), 0 4px 12px -2px rgba(28, 25, 23, 0.06)',
        'modal': '0 25px 50px -12px rgba(15, 14, 12, 0.25)',
      }
    },
  },
  plugins: [],
}
