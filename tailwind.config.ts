import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { DEFAULT: "#2563eb", foreground: "#ffffff" } }, boxShadow: { soft: "0 4px 24px rgba(0,0,0,0.08)" }, borderRadius: { "2xl": "1.25rem" } } },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
};
export default config;
