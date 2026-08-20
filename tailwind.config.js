/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Kantumruy Pro"', '"Battambang"', 'sans-serif'],
        moul: ['"Moul"', 'cursive', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec0ff',
          400: '#589eff',
          500: '#317cf7',
          600: '#1b5ee9',
          700: '#1449cb',
          800: '#163ea4',
          900: '#173782',
        },
      }
    },
  },
  plugins: [],
}
