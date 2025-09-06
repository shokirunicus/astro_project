/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",   // AIHALO Primary (Navy)
        cyan: "#06B6D4",   // Accent
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

