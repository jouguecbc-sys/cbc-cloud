/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cbc: {
          green: '#2E8B57', // SeaGreen
          lightGreen: '#3CB371', // MediumSeaGreen
          orange: '#FF8C00', // DarkOrange
          lightOrange: '#FFA500', // Orange
          bg: '#F0FDF4' // Verde Clarinho (Sistema)
        }
      }
    },
  },
  plugins: [],
}