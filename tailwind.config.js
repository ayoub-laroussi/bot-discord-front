/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      keyframes: {
        expandDown: {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        expandDown: 'expandDown 0.3s ease-in-out',
        fadeInDown: 'fadeInDown 0.2s ease-in-out',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      nunito: ['Nunito Sans', 'sans-serif'],
    },
    colors: {
      'color-red': '#E40046', // Rouge Simplon (mise à jour selon la charte)
      'color-red-light': '#F03366', // Version plus claire du rouge Simplon
      'color-red-super-light': '#FBE8EB',
      'color-orange': '#FF8674', // Orange Simplon (mise à jour selon la charte)
      'color-gray': '#00313C', // Gris Simplon (mise à jour selon la charte)
      'color-red-transparent': '#E4004626', // Rouge Simplon avec 15% d'opacité
      'color-white': '#FFFFFF', // Blanc
      'color-black': '#000000', // Noir
      'color-back': '#f0f0f0', // Background body (Blanc foncé)
      'color-select': '#f8fafc', // Background selects (Gris clair)
      'color-subtitle': '#00313C', // Subtitle color (Gris Simplon)
      'color-success': '#009640', // Success (Vert)
      'color-disabled': '#c4c4c4', // Disabled (Gris)
      ...colors,
    },
  },
  plugins: [],
};
