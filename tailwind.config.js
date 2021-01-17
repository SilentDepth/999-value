const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/index.html',
    './src/**/*.vue',
  ],
  theme: {
    extend: {
      colors,
    },
  },
  variants: {
    extend: {},
  },
}
