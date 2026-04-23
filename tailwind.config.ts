import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        onest: ["Onest", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#EFF6FC",
          100: "#D7E2EA",
          200: "#A8BAC7",
          300: "#7C93A5",
          500: "#284B63",
        },
        grey: {
          50: "#F5F5F6",
          100: "#E6E6E7",
          200: "#C9C9CB",
          300: "#ACADAF",
          500: "#76777A",
          700: "#464749",
          900: "#1B1B1C",
          950: "#111212",
        },
        success: {
          50: "#E4FDE6",
          500: "#17C653",
        },
        info: {
          50: "#E6F7FF",
          100: "#D2EBFF",
          200: "#A8D2FF",
          500: "#1B84FF",
        },
        warning: {
          50: "#FFF3DD",
          100: "#FFECCB",
          200: "#FEDEA8",
          500: "#F6B101",
          1000: "#FEFAF0",
          900: "#FDEFCC",
        },
        danger: {
          50: "#FEF0F4",
          500: "#F8285A",
          900: "#FED4DE",
        },
      },
    },
  },
  plugins: [],
};
export default config;
