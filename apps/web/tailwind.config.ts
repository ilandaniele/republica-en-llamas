import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#1e3a5f',
          600: '#162d4a',
          700: '#0f2035',
          800: '#091525',
          900: '#040c17',
        },
        crimson: {
          50: '#fff0f0',
          100: '#ffdddd',
          400: '#e05555',
          500: '#cc2222',
          600: '#b01d1d',
          700: '#8f1616',
          800: '#700f0f',
        },
        gold: {
          100: '#fef9e7',
          200: '#fdf3cf',
          300: '#fbe98e',
          400: '#f5d020',
          500: '#d4af37',
          600: '#b8960a',
        },
        smoke: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          400: '#a0a0a0',
          600: '#606060',
          800: '#202020',
          900: '#111111',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fire-flicker': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.8' },
          '25%': { transform: 'scaleY(1.1) scaleX(0.95)', opacity: '1' },
          '50%': { transform: 'scaleY(0.9) scaleX(1.05)', opacity: '0.7' },
          '75%': { transform: 'scaleY(1.05) scaleX(0.98)', opacity: '0.9' },
        },
        'smoke-rise': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-60px) scale(1.5)', opacity: '0' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(204, 34, 34, 0)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(204, 34, 34, 0.4)' },
        },
        'number-flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'bar-flash-up': {
          '0%, 100%': { filter: 'brightness(1)' },
          '30%': { filter: 'brightness(1.8) saturate(1.5)', backgroundColor: '#4ade80' },
        },
        'bar-flash-down': {
          '0%, 100%': { filter: 'brightness(1)' },
          '30%': { filter: 'brightness(1.8) saturate(1.5)', backgroundColor: '#ef4444' },
        },
      },
      animation: {
        'fire-flicker': 'fire-flicker 0.8s ease-in-out infinite',
        'smoke-rise': 'smoke-rise 3s ease-out infinite',
        'screen-shake': 'shake 0.5s ease-in-out',
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
        'number-flash': 'number-flash 0.5s ease-in-out',
        'ripple': 'ripple 0.4s ease-out',
        'bar-flash-up': 'bar-flash-up 0.6s ease-out',
        'bar-flash-down': 'bar-flash-down 0.6s ease-out',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
