/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'finance-blue': '#1E40AF',
        'finance-blue-dark': '#1E3A8A',
        'finance-purple': '#7C3AED',
        'finance-gray-light': '#F3F4F6',
        'finance-gray-dark': '#4B5563',
        'finance-red': '#DC2626',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

