/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jamun: {
          DEFAULT: '#231628',
          light: '#36233D',
          dark: '#160D1A',
          surface: '#2C1D32',
        },
        kora: {
          DEFAULT: '#FBF8F4',
          silk: '#F5EFE7',
          dark: '#17111B',
        },
        gulab: {
          DEFAULT: '#C87A74',
          dark: '#B2625C',
          light: '#E5A5A0',
        },
        panna: {
          DEFAULT: '#115E59', // strictly for trust & verification
          emerald: '#0D4F4B',
          light: '#14B8A6',
          pale: '#CCFBF1',
        },
        chalk: {
          DEFAULT: '#EDE5D8',
          subtle: '#F4EEE5',
          border: '#DED3C3',
          dark: '#261C2C',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'atelier': '0 2px 8px -2px rgba(35, 22, 40, 0.08), 0 1px 3px -1px rgba(35, 22, 40, 0.04)',
        'atelier-lift': '0 8px 24px -6px rgba(35, 22, 40, 0.12), 0 2px 6px -2px rgba(35, 22, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
