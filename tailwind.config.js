/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: '#39251f',
        coffee2: '#5b3a2e',
        cream: '#f7f1e8',
        paper: '#fffdf9',
        gold: '#c89b5b',
        muted: '#8b8179',
        line: '#e8ded2',
        green: '#247a55',
        red: '#b84343'
      }
    },
  },
  plugins: [],
}
