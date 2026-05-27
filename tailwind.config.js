/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-navy, #0F2D52)',
          navy: 'var(--color-brand-navy, #0F2D52)',
          accent: 'var(--color-brand-accent, #2563EB)',
          punch: 'var(--color-brand-punch, #F59E0B)',
          positive: 'var(--color-brand-positive, #10B981)',
          danger: 'var(--color-brand-danger, #EF4444)',
        },
        neutral: {
          0: 'var(--color-neutral-0, #FFFFFF)',
          50: 'var(--color-neutral-50, #F7F6F2)',
          100: 'var(--color-neutral-100, #EDEDEA)',
          200: 'var(--color-neutral-200, #E8E7E2)',
          300: 'var(--color-neutral-300, #D1D5DB)',
          400: 'var(--color-neutral-400, #9CA3AF)',
          600: 'var(--color-neutral-600, #6B7280)',
          800: 'var(--color-neutral-800, #374151)',
          900: 'var(--color-neutral-900, #111111)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderWidth: {
        hairline: '0.5px',
        medium: '0.5px',
        emphasis: '1px',
        accent: '2px',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        card: '10px',
        full: '9999px',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      }
    },
  },
  plugins: [],
}
