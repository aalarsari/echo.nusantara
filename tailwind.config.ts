/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "layer-10": "url(/images/login-image120.webp)",
        "background-benefit": "url(/images/background-benefit.svg)",
      },
      boxShadow: {
        product:
          "2px 0px 8px 0px rgba(0, 0, 0, 0.4), 0px 4px 8px 0px rgba(0, 0, 0, 0.4)",
      },
    },
    fontFamily: {
      josefins: ["Josefins", "sans-serif"],
      domaine: ["Domaine", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

module.exports = config;
