import type { Config } from 'tailwindcss';

// VISUAL-IDENTITY-V1 color roles. DESIGN-VISUAL owns the values and their contrast record.
const identity = {
  bone: '#F9F6EE',
  azure: '#004589',
  ink: '#09243D',
  muted: '#526473',
  tint: '#E7EEF5'
};

// SKY-CHART-V2 D-04 environmental palette (Home and the App Bar only). DESIGN-VISUAL
// SKY-CHART-V2 owns the values and the contrast record asserted by
// scripts/design-tokens.test.mjs, which imports this object directly rather than
// duplicating its hex/rgba values.
//
// NOTE: `theme.extend.colors` deep-merges with Tailwind's default theme, so declaring
// `colors.sky` here does not replace Tailwind's own numeric `sky-50`..`sky-950` scale --
// both sets of utilities exist side by side (e.g. `bg-sky-abyss` next to the unrelated
// default `bg-sky-500`). Only the named keys below (`sky.abyss`, `sky.deep`, ...) are
// SKY-CHART-V2-approved; numeric `sky-<number>` utilities are unapproved Tailwind defaults
// and scripts/design-tokens.test.mjs bans their use under app/, components/ and lib/.
export const sky = {
  abyss: '#06121F',
  deep: '#0A1E33',
  field: '#0F2A45',
  haze: '#17385A',
  lit: '#6FA8E0',
  glow: '#9CC4EC',
  'text-2': '#B9C3CC',
  mist: '#8FA3B6',
  plate: 'rgba(10,30,51,.74)',
  'plate-line': 'rgba(249,246,238,.13)',
  sheet: 'rgba(249,246,238,.9)',
  'sheet-line': 'rgba(9,36,61,.12)',
  'sheet-grid': 'rgba(0,69,137,.07)'
};

export const chart = {
  'context-dark': '#5E7185',
  'signal-dark': '#9CC4EC',
  'context-light': '#8FA3B6',
  'signal-light': '#004589'
};

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        identity,
        sky,
        chart,
        foundation: {
          canvas: identity.bone,
          surface: '#FFFFFF',
          ink: identity.ink,
          muted: identity.muted,
          action: identity.azure,
          'action-strong': identity.ink,
          tint: identity.tint,
          border: '#D3D4D2'
        },
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
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      // SKY-CHART-V2 D-09 type tokens (Home only). Families and the mono character
      // limit are unchanged; `uppercase`/`text-wrap: balance` are applied by consumers.
      fontSize: {
        'display-1': ['clamp(44px, 7.2vw, 96px)', { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-2': ['clamp(32px, 4.2vw, 56px)', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-3': ['clamp(28px, 3vw, 40px)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        lead: ['clamp(18px, 1.6vw, 21px)', { lineHeight: '1.55' }],
        'body-lg': ['19px', { lineHeight: '1.6' }],
        // D-09 specifies "12px mono, 0.08em tracking, uppercase" only; no line-height.
        label: ['12px', { letterSpacing: '0.08em' }]
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