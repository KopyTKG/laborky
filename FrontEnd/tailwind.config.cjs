import { nextui } from '@nextui-org/react'
/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  // Or if using `src` directory:
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
 ],
 theme: {
  extend: {
   borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
   },
   colors: {},
  },
 },

 darkMode: 'class',
 plugins: [nextui(), require('tailwindcss-animate')],
}
