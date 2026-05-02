import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d4',
          darker: '#ddd5c7',
        },
        ink: {
          black: '#1a0f0a',
          dark: '#3d2b1f',
          medium: '#6b5b4f',
          light: '#9a8b7e',
          lighter: '#c4b8ad',
        },
        cinnabar: '#c9372c',
        gilt: '#d4af37',
        hero: {
          dark: '#0a0a0f',
        },
        dynasty: {
          xia: '#8b7355',
          shang: '#7a8b69',
          zhou: '#8b4513',
          qin: '#c9372c',
          han: '#c9372c',
          sanguo: '#8b0000',
          jin: '#6b8e6b',
          sui: '#4682b4',
          tang: '#d4af37',
          wudai: '#808080',
          song: '#87ceeb',
          yuan: '#228b22',
          ming: '#cd853f',
          qing: '#4169e1',
        },
      },
      fontFamily: {
        serif: ['"Source Han Serif CN"', '"Noto Serif SC"', 'serif'],
        display: ['"Source Han Serif CN"', '"Noto Serif SC"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'ken-burns': 'kenBurns 30s ease-in-out infinite alternate',
        'breathe': 'breathe 2s ease-in-out infinite',
        'ink-drop': 'inkDrop 1.2s ease-in-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.1) translateX(-5%)' },
          '100%': { transform: 'scale(1.1) translateX(5%)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(8px)' },
        },
        inkDrop: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '40%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(50)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
