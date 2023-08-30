/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
        


"primary": "#db6b46",
        


"secondary": "#b884f4",
        


"accent": "#d7dd77",
        


"neutral": "#202227",
        


"base-100": "#464b4e",
        


"info": "#9db8e7",
        


"success": "#1cb57a",
        


"warning": "#a56a12",
        


"error": "#dd3731",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
