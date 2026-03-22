import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        '100%': '100%',
      },
      colors: {
        primaryBlue: {
          DEFAULT: '#4D96FF',
          100: '#E6F0FF',
          200: '#B3D1FF',
          300: '#80B3FF',
          600: '#1E7BFF',
          700: '#005BEA',
          900: '#003C99',
        },
        primaryGreen: {
          DEFAULT: '#4CAF50',
          100: '#E7F6E8',
          200: '#BDE5C0',
          300: '#81C784',
          600: '#388E3C',
          700: '#2E7D32',
          900: '#1B5E20',
        },
        primaryTeal: {
          DEFAULT: '#2BB5A3',
          100: '#E5FFFB',
          200: '#B8F2EA',
          300: '#7DDDD0',
          600: '#1F8E80',
          700: '#176A60',
          900: '#0C3C37',
        }
      },
      backgroundImage: {
        'fondo-ensayo': "url('/images/fondo-inicio.jpg')",
        'state-ok': "url('/images/icons8-approved-50.png')",
        'state-warning': "url('/images/icons8-warning-30.png')",
        'state-wrong': "url('/images/icons8-fire-warning-64.png')",
        'logo-date-planner': "url('/images/Logo.png')",
      },
      fontFamily: {
        'sora-bold': ['Sora-Bold', 'sans-serif'],
        'sora-extra-bold': ['Sora-ExtraBold', 'sans-serif'],
        'sora-extra-light': ['Sora-ExtraLight', 'sans-serif'],
        'sora-light': ['Sora-Light', 'sans-serif'],
        'sora-medium': ['Sora-Medium', 'sans-serif'],
        'sora-semi-bold': ['Sora-SemiBold', 'sans-serif'],
        'sora-thin': ['Sora-Thin', 'sans-serif'],
        'sora-regular': ['Sora-Regular', 'sans-serif'],
      },
      fontSize: {
        'tiny': '0.65rem',
        'extra-tiny': '0.5rem',
      },
      maxWidth: {
        'custom': 'calc(40rem + 20px)', // Ajusta este valor según tus necesidades
      },
    },
  },
  plugins: [],
} satisfies Config;
