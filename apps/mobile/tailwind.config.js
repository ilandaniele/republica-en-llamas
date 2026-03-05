/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#162d4a',
          800: '#091525',
          900: '#040c17',
        },
        crimson: {
          400: '#e05555',
          500: '#cc2222',
          600: '#b01d1d',
        },
        gold: {
          400: '#f5d020',
          500: '#d4af37',
        },
        smoke: {
          100: '#f0f0f0',
          200: '#e0e0e0',
          400: '#a0a0a0',
          500: '#808080',
        },
      },
    },
  },
  plugins: [],
};
