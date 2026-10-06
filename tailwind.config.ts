import type {Config} from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca Dannotech (ver public/dannotech-kit/LEEME.md)
        brand: {
          ink: 'rgb(var(--dt-tinta-rgb) / <alpha-value>)',
          sky: 'rgb(var(--dt-celeste-rgb) / <alpha-value>)',
          'sky-text': 'rgb(var(--dt-celeste-texto-rgb) / <alpha-value>)',
          coral: 'rgb(var(--dt-coral-rgb) / <alpha-value>)',
          'coral-dark': 'rgb(var(--dt-coral-oscuro-rgb) / <alpha-value>)',
          light: 'rgb(var(--dt-fondo-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
