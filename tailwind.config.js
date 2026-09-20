/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ri: {
          noir: {
            950: '#0b0b0a',
            900: '#11110f',
            800: '#1b1a18',
            700: '#2b2925',
          },
          ivory: {
            50: '#f8f6f1',
            100: '#eeeae2',
            200: '#ded9cf',
          },
          greige: {
            300: '#b8b1a5',
            500: '#756f66',
            700: '#4b4741',
          },
          champagne: {
            300: '#c5b79e',
            500: '#9a896f',
            700: '#76654d',
          },
          status: {
            sage: '#9fa994',
            amber: '#c99c4d',
            red: '#cc675b',
          },
          signal: {
            blue: '#2f6fce',
          },
        },
        brand: {
          DEFAULT: '#292724',
          accent: '#F8F4EC',
          surface: '#0B0B0A',
          paper: '#F8F6F1',
          elevated: '#1B1A18',
          text: '#F3EFE7',
          secondary: '#756F66',
          muted: '#504A43',
          border: 'rgba(255, 255, 255, 0.13)',
          borderLight: '#D4CFC5',
        },
        status: {
          success: '#9fa994',
          danger: '#cc675b',
          warning: '#c99c4d',
          info: '#2f6fce',
          bold: '#c5b79e',
        }
      },
      borderRadius: {
        'control': '8px',
        'card': '14px',
        'window': '20px',
        'pill': '999px',
        'chip': '50px',
        'block': '10px',
      },
      fontFamily: {
        serif: ['Newsreader', 'Amiri', 'Georgia', 'serif'],
        sans: ['Inter', '"Expo Arabic"', 'Readex Pro', 'sans-serif'],
        arabic: ['"Expo Arabic"', 'Readex Pro', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '11': '44px',
      },
      boxShadow: {
        'ri-sm': '0 .5rem 1.5rem rgba(11, 11, 10, .1)',
        'ri-md': '0 1.5rem 4rem rgba(11, 11, 10, .18)',
        'ri-lg': '0 3rem 8rem rgba(11, 11, 10, .34)',
        'window': '0 48px 128px 0 rgba(11, 11, 10, 0.5)',
        'subtle': '0px 1px 12px 0px rgba(0, 0, 0, 0.16)',
        'medium': '0px 20px 55px 0px rgba(0, 0, 0, 0.34)',
        'strong': '0px 36px 100px 0px rgba(10, 9, 8, 0.38)',
      },
    },
  },
  plugins: [],
}
