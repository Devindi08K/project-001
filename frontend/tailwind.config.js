/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F766E",     // Teal-700 - Primary color
        secondary: "#FCD34D",   // Amber-300 - Secondary color
        accent: "#FF6B6B",      // Coral red - Accent color
        light: "#F3F4F6",       // Gray-100 - Light background
        dark: "#1F2937",        // Gray-800 - Dark text
      }
    },
  },
  plugins: [],
}