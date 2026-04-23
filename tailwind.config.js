/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        ink:   '#080808',
        paper: '#f0ede6',
        gold:  '#c9a84c',
        'gold-light': '#e8c96a',
        lead:  '#1a1a1a',
        smoke: '#2e2e2e',
        ash:   '#888888',
        mist:  '#bbbbbb',
        up:    '#4ade80',
        down:  '#f87171',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      fontSize: {
        '10xl': ['10rem',  { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
        '9xl':  ['8rem',   { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
        '8xl':  ['6rem',   { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        '7xl':  ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      animation: {
        marquee:   'marquee 28s linear infinite',
        marqueeFast: 'marquee 18s linear infinite',
        'count-in': 'countIn 0.6s ease-out forwards',
        'reveal':   'reveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-up':  'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'line-grow':'lineGrow 1s ease-out forwards',
        'glow-pulse':'glowPulse 2.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        countIn: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: '0', transform: 'translateY(40px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lineGrow: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
