/** Tegron Printables design tokens — sampled from the brand logo & banner. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FFFBF4', 100: '#FBF5EA', 200: '#F4EBDB' },
        ink: { DEFAULT: '#1F2A44', 700: '#39445E', 500: '#5E6781', 300: '#9AA1B4' },
        teal: { 50: '#EDF6F7', 100: '#D6ECEF', 200: '#B2DAE0', 400: '#6FB3BF', 500: '#4E9FAE', 600: '#3C8595', 700: '#2F6A78' },
        coral: { 50: '#FEF1F1', 100: '#FCDDDF', 200: '#F9C0C4', 400: '#F4959B', 500: '#F07F86', 600: '#E0636B', 700: '#BD4A52' },
        sun: { 50: '#FFF8E4', 100: '#FEEFC0', 200: '#FDE196', 400: '#F9CF5E', 500: '#F8C84B', 600: '#E3AA22', 700: '#9C7212' },
        leaf: { 50: '#F0F7ED', 100: '#DDEDD7', 200: '#C2DEB8', 400: '#94C088', 500: '#7DAE6F', 600: '#629257', 700: '#4B7143' },
        lilac: { 50: '#F5F1FA', 100: '#E9E1F3', 200: '#D5C7E8', 400: '#B59FD2', 500: '#A38BC7', 600: '#8A6FB3', 700: '#6B5192' },
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'ui-rounded', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        hand: ['"Gochi Hand"', '"Comic Neue"', 'cursive'],
      },
      borderRadius: { '4xl': '2rem', blob: '42% 58% 55% 45% / 48% 42% 58% 52%' },
      boxShadow: {
        paper: '0 1px 0 rgba(31,42,68,.04), 0 10px 24px -14px rgba(31,42,68,.22)',
        lift: '0 2px 0 rgba(31,42,68,.04), 0 18px 34px -16px rgba(31,42,68,.28)',
        pill: '0 1px 0 rgba(31,42,68,.05), 0 4px 10px -6px rgba(31,42,68,.2)',
      },
      keyframes: {
        'toast-in': { from: { opacity: '0', transform: 'translateY(8px) scale(.98)' }, to: { opacity: '1', transform: 'none' } },
        'pop-in': { from: { opacity: '0', transform: 'scale(.96)' }, to: { opacity: '1', transform: 'none' } },
        'sun-rise': { from: { opacity: '0', transform: 'translateY(18px) rotate(-8deg)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'toast-in': 'toast-in .22s ease-out',
        'pop-in': 'pop-in .18s ease-out',
        'sun-rise': 'sun-rise .9s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
