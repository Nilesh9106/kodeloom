import { nextui } from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      light: {
        colors: {
          primary: "#7c3aed",
        }
      },
      dark: {
        colors: {
          primary: "#7c3aed",
        }
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

