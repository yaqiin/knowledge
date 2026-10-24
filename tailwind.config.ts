import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Thmanyah Sans", "sans-serif"],
        display: ["Thmanyah Serif Display", "Thmanyah Sans", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
