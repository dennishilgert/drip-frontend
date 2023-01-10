/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#47A6FF',
          400: '#1F93FF',
          DEFAULT: '#007cf0',
          600: '#0069CC',
          700: '#0054A3'
        },
        light: {
          DEFAULT: '#f8f9fa',
          600: '#E7EBEE',
          700: '#CFD7DD'
        },
        basic: {
          300: '#767C93',
          400: '#63687E',
          DEFAULT: '#505565'
        },
        dark: {
          300: '#30343F',
          400: '#262A35',
          DEFAULT: '#191A1F'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
