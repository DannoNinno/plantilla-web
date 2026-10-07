import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export const coloresMarca = {
  ink: '#04182F',
  sky: '#22C3F5',
  'sky-text': '#0B84B8',
  coral: '#FF6B4A',
  'coral-dark': '#F04E2B',
  light: '#F7FAFC',
};

const alturaCabecera = {base: '4.5rem', amplia: '5.5rem'};

function rgb(hex: string) {
  return [1, 3, 5].map((inicio) => parseInt(hex.slice(inicio, inicio + 2), 16)).join(' ');
}

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ...coloresMarca,
          'sky-profile': `color-mix(in srgb, ${coloresMarca['sky-text']} 85%, ${coloresMarca.ink})`,
          'catalogo-active': `color-mix(in srgb, rgb(${rgb(coloresMarca['sky-text'])} / 0.96) 80%, rgb(${rgb(coloresMarca.ink)} / 0.96))`,
          'perfil-active': `color-mix(in srgb, rgb(${rgb(coloresMarca['coral-dark'])} / 0.96) 80%, rgb(${rgb(coloresMarca.ink)} / 0.96))`,
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        header: alturaCabecera.base,
        'header-lg': alturaCabecera.amplia,
      },
      minHeight: {
        intro: `calc(100svh - ${alturaCabecera.base})`,
        'intro-lg': `calc(100svh - ${alturaCabecera.amplia})`,
        puerta: '65svh',
      },
      backgroundImage: {
        intro: `radial-gradient(ellipse at 85% 20%, rgb(${rgb(coloresMarca.sky)} / 0.1), transparent 60%)`,
        'perfil-hero': `radial-gradient(ellipse at 85% 25%, rgb(${rgb(coloresMarca.sky)} / 0.12), transparent 55%), radial-gradient(ellipse at 5% 100%, rgb(${rgb(coloresMarca.coral)} / 0.06), transparent 45%)`,
        entradas: `radial-gradient(ellipse at 15% 45%, rgb(${rgb(coloresMarca.sky)} / 0.08), transparent 50%), radial-gradient(ellipse at 85% 55%, rgb(${rgb(coloresMarca.coral)} / 0.06), transparent 50%)`,
      },
      transitionDuration: {
        puerta: '280ms',
        'puerta-icono': '220ms, 280ms, 280ms',
      },
      boxShadow: {
        'capacidad-acento': `inset 3px 0 0 ${coloresMarca.sky}`,
        'capacidad-icono': `0 8px 20px rgb(${rgb(coloresMarca['sky-text'])} / 0.2)`,
      },
      keyframes: {
        entrada: {
          from: {opacity: '0', transform: 'translateY(12px)'},
          to: {opacity: '1', transform: 'translateY(0)'},
        },
        'perfil-icono': {
          '0%, 100%': {transform: 'translateY(0) rotate(0) scale(1)'},
          '35%': {transform: 'translateY(-2px) rotate(-7deg) scale(1.08)'},
          '65%': {transform: 'translateY(-1px) rotate(4deg) scale(1.04)'},
        },
        'perfil-titulo': {
          '0%, 100%': {transform: 'translateX(0)'},
          '45%': {transform: 'translateX(4px)'},
        },
        'capacidad-trazo': {
          from: {strokeDashoffset: '80'},
          to: {strokeDashoffset: '0'},
        },
        'capacidad-brillo': {
          '0%': {transform: 'translateX(0) skewX(-12deg)', opacity: '0'},
          '25%': {opacity: '0.7'},
          '100%': {transform: 'translateX(400%) skewX(-12deg)', opacity: '0'},
        },
      },
      animation: {
        intro: 'entrada 650ms ease-out both',
        pagina: 'entrada 300ms ease-out both',
        'perfil-icono': 'perfil-icono 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'perfil-titulo': 'perfil-titulo 650ms ease-out both',
        'capacidad-trazo': 'capacidad-trazo 700ms ease-out both',
        'capacidad-brillo': 'capacidad-brillo 850ms ease-out both',
      },
    },
  },
  plugins: [
    plugin(({addVariant}) => {
      addVariant('fine-pointer', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
} satisfies Config;
