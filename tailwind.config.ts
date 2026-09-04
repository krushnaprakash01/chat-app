import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0a0a0a',
        surfaceDark: '#121212',
        surfaceHover: '#1c1c1c',
        surfaceCard: '#181818',
        borderDark: '#262626',
        borderLight: '#383838',
        accentGreen: '#4ade80',
        accentGreenHover: '#22c55e',
        accentGreenDim: 'rgba(74, 222, 128, 0.12)',
        textMain: '#f2f2f2',
        textMuted: '#8c8c8c',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
