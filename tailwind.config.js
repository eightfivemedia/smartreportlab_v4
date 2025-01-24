/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2E64A0',    // Blue
          'primary-dark': '#1E4270',  // Darker blue for better contrast
          secondary: '#FBDC9D',  // Light yellow
          light: '#E0E9F6',      // Light blue
          dark: '#181410',       // Dark gray/black
        },
      },
    },
  },
  plugins: [],
};