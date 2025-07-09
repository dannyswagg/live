/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "#1F1D1B",
        pink: "#ff1361",
        white: "#ffffff",
      },
    },
  },
  plugins: [require("daisyui")],
};

