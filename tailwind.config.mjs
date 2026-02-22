/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E3A8A',    // Your Dark Blue
          light: '#0EA5E9',   // Your Sky Blue
          DEFAULT: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
};