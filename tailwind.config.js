/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './app/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          blue: '#39A7FF',
          paleBlue: '#7195A9',
        },
      },
    },
  },
  plugins: [],
};
