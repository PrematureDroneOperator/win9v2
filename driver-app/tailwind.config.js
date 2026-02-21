/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2A2A2A',
        },
        primary: '#3B82F6',
        success: '#10B981',
        danger: '#EF4444',
      }
    },
  },
  plugins: [],
}
