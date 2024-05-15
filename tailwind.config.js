const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dnr: {
          orange: '#FBEEE3',
          beige: '#FFF1E5',
          'soft-blue': '#94B2E1',
          'light-blue': '#F3FAFC',
          blue: '#1D4A8F',
          'blue-light': '#E2F8FF',
          gray: '#F5F5F5',
          'dark-orange': '#F88115',
          shopee: '#FD5F32',
          pastel: '#FBEEE3',
          green: '#A4D601',
          'dark-green': '#A7BD06',
          yellow: '#EBFF03',
          'dark-blue': '#1B4380',
          turqoise: '#2394BA',
          'light-turqoise': '#219BA5',
          'dark-turqoise': '#2386A7',
          bicart: '#F09538',
          'light-bicart': '#F9AC5D',
          'dark-bicart': '#F88A1B',
        },
        wi: {
          blue: '#47BFE6 ',
          'blue-light': '#E2F8FF',
          bicart: '#F09538',
          'light-wi': '#F9AC5D',
          'dark-wi': '#1dabd9',
        },
      },
      fontFamily: {
        sans: ['Kumbh Sans', ...defaultTheme.fontFamily.sans],
        dayOne: ['Days One', ...defaultTheme.fontFamily.sans],
      },
      width: {
        120: '32rem',
        130: '40rem',
      },
      fill(theme) {
        return {
          'dnr-orange': theme('colors.dnr.orange'),
          'wi-blue': theme('colors.wi.blue'),
          'dnr-green': theme('colors.dnr.green'),
        }
      },
      spacing: {
        200: '200%',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      borderRadius: ['hover'],
      boxShadow: ['hover'],
      fill: ['hover'],
      backgroundColor: ['odd', 'even'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
