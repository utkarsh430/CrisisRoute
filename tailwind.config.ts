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
        brand: {
          50: '#eefbf4',
          100: '#d7f4e2',
          200: '#b3e8ca',
          300: '#80d6ac',
          400: '#47bd84',
          500: '#249f67',
          600: '#178452',
          700: '#136944',
          800: '#125338',
          900: '#0f452f'
        },
        ink: '#0f172a',
        crisis: '#f97316',
        danger: '#ef4444'
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        'grid-radial': 'radial-gradient(circle at top, rgba(36, 159, 103, 0.14), transparent 35%), linear-gradient(to bottom, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 1))'
      }
    },
  },
  plugins: [],
};

export default config;
