import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/modules/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: {
          300: '#80B3FF',
          700: '#005BEA',
          900: '#003C99',
        },
      },
    },
  },
  plugins: [],
};

export default config;
