/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        'muted': '#7F858D',
      }
    },
  },
  plugins: [],
}
