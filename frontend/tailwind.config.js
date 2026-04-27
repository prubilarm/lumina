/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
