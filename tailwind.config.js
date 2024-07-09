/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./entrypoints/**/index.html",
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'selector',
  corePlugins: {
    preflight: true,
  },
  plugins: [],
}

