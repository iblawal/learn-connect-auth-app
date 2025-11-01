import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandEmerald: "#26d96e",
        brandGold: "#b59b2e",
        brandSky: "#269ad9",
      },
    },
  },
  plugins: [],
};

export default config;
