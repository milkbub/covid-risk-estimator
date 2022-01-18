const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./rendered-views/**/*.{html, js}', './static/js/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {

      transitionProperty: {
        'height':'height'
      },

      fontFamily: {
        'sans' : ['Lato', 'sans-serif']
      },


      colors: {
        'charlotte-green': '337970',
        'charlotte-gold': 'b1a36a',
        'charlotte-blue': '333d51',
        'orange': 'd6974',
        'dirty-white': 'e3e7f0',
        'blue-stained-white': 'd6e4f5',
        'beige': 'd8c8ae',
        'cool-gray': colors.coolGray,
      },

      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '6xl': '2rem',
        '7xl': '2.5rem',
        '8xl': '3rem',
      },

      lineHeight: {
         '0': '0rem',
       },

      letterSpacing : {
        'widest2x': '.25rem',
        'widest3x': '.50rem',
      },

      height : {
        '98': '26rem',
        '100': '28rem',
        '136': '36rem',
        '158': '86rem',
        '1/7': '14.28571%',
        '1/8': '12.5%',
      },

      width : {
        '98': '26rem',
        '100': '28rem',
        '130': '30rem',
        '136': '36rem',
        '158': '86rem',
        '1/7': '14.28571%',
        '1/8': '12.5%',
      },

    },
  },

  variants: {
    height: ['responsive', 'hover', 'focus'],
  },

  daisyui: {
      styled: true,
      themes: false,
      rtl: false,
    },

  plugins: [
    require('daisyui'),
  ],
}

