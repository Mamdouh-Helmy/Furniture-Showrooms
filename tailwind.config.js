/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F5F0',
        'bg-2': '#EFEBE3',
        ink: '#20221F',
        wood: '#8A6245',
        sage: '#657A63',
        'sage-light': '#DDE4D7',
        gold: '#B79B68',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(32, 34, 31, 0.12)',
        float: '0 18px 48px -16px rgba(32, 34, 31, 0.22)',
        glow: '0 0 0 1px rgba(101, 122, 99, 0.12), 0 8px 32px -12px rgba(101, 122, 99, 0.28)',
      },
      keyframes: {
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
