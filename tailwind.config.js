/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        accent: '#6D28D9',
        background: '#F5F3FF',
        dark: '#4C1D95',
      },
    },
  },
  plugins: [],
}

