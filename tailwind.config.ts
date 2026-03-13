import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF3FB',
          100: '#D9E5F7',
          200: '#B3C8EF',
          300: '#8DABE6',
          400: '#6690DE',
          500: '#3B6FD8',
          600: '#1E55C5',
          700: '#0B3D91',
          800: '#072A62',
          900: '#041735'
        },
        ink: {
          900: '#0F1115',
          700: '#2B2F38',
          500: '#4E5562'
        },
        paper: {
          50: '#FFFFFF',
          100: '#F5F7FA',
          200: '#E4E8F0'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'IBM Plex Sans', 'Poppins', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(15, 17, 21, 0.25)',
        lift: '0 16px 35px -20px rgba(15, 17, 21, 0.35)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 55%, #F5F7FA 100%)'
      }
    }
  },
  plugins: []
};

export default config;