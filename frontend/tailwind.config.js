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
        primary: {
          DEFAULT: '#0F172A',
          dark: '#020617',
          light: '#1E293B',
        },
        secondary: {
          DEFAULT: '#1E293B',
          light: '#334155',
        },
        accent: {
          DEFAULT: '#C9A227',
          hover: '#B08C1D',
          light: '#F4E8C1',
        },
        luxuryBg: {
          light: '#F8FAFC',
          dark: '#0B0F19',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -10px rgba(15, 23, 42, 0.1)',
        luxuryHover: '0 20px 40px -15px rgba(201, 162, 39, 0.15)',
        goldGlow: '0 0 15px rgba(201, 162, 39, 0.2)',
      },
      backdropBlur: {
        luxury: '12px',
      }
    },
  },
  plugins: [],
}
