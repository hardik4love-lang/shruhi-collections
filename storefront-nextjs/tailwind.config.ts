import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oxblood: {
          50: '#fbf5f6',
          100: '#f6ebed',
          500: '#6d1b29',
          900: '#3d0f17',
          deep: '#5a131f',
        },
        champagne: {
          400: '#e5c158',
          500: '#d4af37',
          600: '#b89428',
        },
        ivory: '#fcfaf7',
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
