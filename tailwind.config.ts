import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./messages/**/*.{json}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "var(--color-base)",
        surface: "var(--color-surface)",
        "surface-high": "var(--color-surface-high)",
        border: "var(--color-border)",
        "border-active": "var(--color-border-active)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        in: "var(--color-in)",
        out: "var(--color-out)",
        return: "var(--color-return)",
        cash: "var(--color-cash)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-dim": "var(--color-text-dim)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        "glow-yellow": "var(--shadow-glow-yellow)",
        "glow-green": "var(--shadow-glow-green)",
        "glow-red": "var(--shadow-glow-red)",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: { DEFAULT: "#F0E040", foreground: "#0A0A0B" },
            danger: { DEFAULT: "#FF4D6D", foreground: "#FFFFFF" },
            success: { DEFAULT: "#39D353", foreground: "#0A0A0B" },
            secondary: { DEFAULT: "#A78BFA", foreground: "#FFFFFF" },
          },
        },
      },
    }),
  ],
};

export default config;
