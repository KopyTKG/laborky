module.exports = {
 content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
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
 plugins: [require('tailwindcss-animate')],
}
