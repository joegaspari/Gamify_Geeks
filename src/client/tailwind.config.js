/** @type {import('tailwindcss').Config} */

// const sm = '20px'
// const base = '30px'
// const lg = '40px'
// const xl = '50px'

const sm = '16px'
const base = '24px'
const lg = '32px'
const xl = '40px'

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }

        'widescreen': '2000px',
        // => @media (min-width: 2000px) { ... }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        black1: '#141414',
        black2: '#787878',
        white1: '#FFFFFF',
        white3: '#C8C8C8',
        offWhite1: '#F6F6F6',
        offWhite2: '#FAFAFA',
        blue1: '#002145',
        blue2: '#0D4F7A',
        blue3: '#0094FF',
        blue4: '#E1FBFB',
        green1: '#06C47F',
        green2: '#0D706A',
        red1: '#DE1E1E',
        bgBlue1: '#1A8CE0',
        bgBlue2: '#CDE7FE',
        bgBlue3: '#E9F5FE',
        bgRed1: '#DE1D1D',
        bgRed2: '#FECDCD',
        bgRed3: '#FEE9E9',
        bgGreen1: '#04BD00',
        bgGreen2: '#D1FECD',
        bgGreen3: '#EBFEE9',
        beige1: '#FDF7F3',
      },
      boxShadow: {
        standard: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
      },
      padding: {
        sm: sm,
        base: base,
        lg: lg,
        xl: xl,
      },
      margin: {
        sm: sm,
        base: base,
        lg: lg,
        xl: xl,
      },
      gap: {
        sm: sm,
        base: base,
        lg: lg,
        xl: xl,
      },
    },
  },
  plugins: [],
};
