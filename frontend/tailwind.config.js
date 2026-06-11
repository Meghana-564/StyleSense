/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9eb',
          100: '#f4eecc',
          200: '#e9db98',
          300: '#dbbf5d',
          400: '#d0a735',
          500: '#d4af37', // luxury metallic gold
          600: '#a37e20',
          700: '#7c5a19',
          800: '#583e15',
          900: '#3c290f',
          950: '#211505',
        },
        luxury: {
          dark: '#0a0d14',     // Deep obsidian background
          card: '#121722',     // Card slate background
          border: '#1f293d',   // Muted premium border
          goldAccent: '#d4af37',
          roseAccent: '#fda4af',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
