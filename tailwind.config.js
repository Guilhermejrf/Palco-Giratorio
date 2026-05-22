/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
      colors: {
        cream: 'var(--color-cream)',
        charcoal: 'var(--color-charcoal)',
        terracotta: 'var(--color-secondary-300)',
        teal: 'var(--color-primary-300)',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(44, 38, 32, 0.08)',
      },
    },
  },
  plugins: [],
}
