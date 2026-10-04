import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

/**
 * Couleur sémantique adossée à une variable CSS, compatible avec les modificateurs d'opacité Tailwind
 * (`border-border/60`, `bg-accent/10`…). Une chaîne `var(--x)` simple ne les supporte pas : la classe n'était alors
 * jamais générée. `color-mix` accepte n'importe quel format de variable (hex ou rgba).
 */
const withAlpha = (variable: string): string => {
  const fn = ({ opacityValue }: { opacityValue?: string }) => {
    // Sans modificateur, Tailwind passe `var(--tw-*-opacity)` (non numérique) : on renvoie alors la variable telle quelle.
    const alpha = Number(opacityValue);
    return opacityValue === undefined || Number.isNaN(alpha)
      ? `var(${variable})`
      : `color-mix(in srgb, var(${variable}) ${Math.round(alpha * 1000) / 10}%, transparent)`;
  };
  // Tailwind accepte une fonction ici, mais son typage de `extend.colors` ne l'exprime pas.
  return fn as unknown as string;
};

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
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": "var(--text-2xs)",
        xs:    "var(--text-xs)",
        sm:    "var(--text-sm)",
        base:  "var(--text-base)",
        md:    "var(--text-md)",
        lg:    "var(--text-lg)",
        xl:    "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
      },
      // Bordure par défaut = token du thème (le gris Tailwind par défaut jurait en thème sombre).
      borderColor: { DEFAULT: withAlpha("--color-border") },
      colors: {
        /* ── Tokens sémantiques existants ── */
        base:            withAlpha("--color-base"),
        surface:         withAlpha("--color-surface"),
        "surface-high":  withAlpha("--color-surface-high"),
        border:          withAlpha("--color-border"),
        "border-active": withAlpha("--color-border-active"),
        accent:          withAlpha("--color-accent"),
        "accent-dim":    withAlpha("--color-accent-dim"),
        in:              withAlpha("--color-in"),
        out:             withAlpha("--color-out"),
        return:          withAlpha("--color-return"),
        cash:            withAlpha("--color-cash"),
        "in-dim":        withAlpha("--color-in-dim"),
        "out-dim":       withAlpha("--color-out-dim"),
        "return-dim":    withAlpha("--color-return-dim"),
        "cash-dim":      withAlpha("--color-cash-dim"),
        "in-text":       withAlpha("--color-in-text"),
        "out-text":      withAlpha("--color-out-text"),
        "return-text":   withAlpha("--color-return-text"),
        "cash-text":     withAlpha("--color-cash-text"),
        "accent-text":   withAlpha("--color-accent-text"),
        "on-accent":     withAlpha("--color-on-accent"),
        "out-line":      withAlpha("--color-out-line"),
        "return-line":   withAlpha("--color-return-line"),
        text:            withAlpha("--color-text"),
        "text-muted":    withAlpha("--color-text-muted"),
        "text-dim":      withAlpha("--color-text-dim"),

        sidebar: {
          DEFAULT: withAlpha("--sidebar-bg"),
          border:  withAlpha("--sidebar-border"),
          hover:   withAlpha("--sidebar-hover"),
          active:  withAlpha("--sidebar-active"),
          text:    withAlpha("--sidebar-text"),
          muted:   withAlpha("--sidebar-text-muted"),
          accent:  withAlpha("--sidebar-accent"),
        },

        /* ── Primary scale (Gold) ── */
        primary: {
          50:  "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
          DEFAULT: "var(--primary-400)",
        },

        /* ── Brand scale (Night Blue) ── */
        brand: {
          50:  "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
          950: "var(--brand-950)",
          DEFAULT: "var(--brand-800)",
        },

        /* ── Success scale ── */
        success: {
          50:  "var(--success-50)",
          100: "var(--success-100)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          900: "var(--success-900)",
          950: "var(--success-950)",
          DEFAULT: "var(--success-400)",
        },

        /* ── Error scale ── */
        error: {
          50:  "var(--error-50)",
          100: "var(--error-100)",
          200: "var(--error-200)",
          300: "var(--error-300)",
          400: "var(--error-400)",
          500: "var(--error-500)",
          600: "var(--error-600)",
          700: "var(--error-700)",
          800: "var(--error-800)",
          900: "var(--error-900)",
          950: "var(--error-950)",
          DEFAULT: "var(--error-400)",
        },

        /* ── Warning scale ── */
        warning: {
          50:  "var(--warning-50)",
          100: "var(--warning-100)",
          200: "var(--warning-200)",
          300: "var(--warning-300)",
          400: "var(--warning-400)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
          700: "var(--warning-700)",
          800: "var(--warning-800)",
          900: "var(--warning-900)",
          950: "var(--warning-950)",
          DEFAULT: "var(--warning-400)",
        },

        /* ── Info / Caisse scale ── */
        info: {
          50:  "var(--info-50)",
          100: "var(--info-100)",
          200: "var(--info-200)",
          300: "var(--info-300)",
          400: "var(--info-400)",
          500: "var(--info-500)",
          600: "var(--info-600)",
          700: "var(--info-700)",
          800: "var(--info-800)",
          900: "var(--info-900)",
          950: "var(--info-950)",
          DEFAULT: "var(--info-500)",
        },

        /* ── Neutral scale ── */
        neutral: {
          50:  "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm:           "var(--shadow-sm)",
        md:           "var(--shadow-md)",
        lg:           "var(--shadow-lg)",
        card:         "var(--shadow-card)",
        "glow-yellow":  "var(--shadow-glow-yellow)",
        "glow-green":   "var(--shadow-glow-green)",
        "glow-red":     "var(--shadow-glow-red)",
        "glow-purple":  "var(--shadow-glow-purple)",
        "glow-orange":  "var(--shadow-glow-orange)",
      },
      zIndex: {
        base:     "var(--z-base)",
        raised:   "var(--z-raised)",
        dropdown: "var(--z-dropdown)",
        sticky:   "var(--z-sticky)",
        overlay:  "var(--z-overlay)",
        modal:    "var(--z-modal)",
        panel:    "var(--z-panel)",
        toast:    "var(--z-toast)",
        tooltip:  "var(--z-tooltip)",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { DEFAULT: "#F4F1EA" },
            foreground: { DEFAULT: "#15201A" },
            divider:    { DEFAULT: "rgba(21, 32, 26, 0.10)" },
            focus:      { DEFAULT: "#5B8A0F" },
            overlay:    { DEFAULT: "#15201A" },
            content1:   { DEFAULT: "#FFFFFF", foreground: "#15201A" },
            content2:   { DEFAULT: "#ECE8DE", foreground: "#15201A" },
            content3:   { DEFAULT: "#E1DBCD", foreground: "#15201A" },
            content4:   { DEFAULT: "#CFC8B6", foreground: "#15201A" },
            default: {
              50: "#F4F1EA", 100: "#ECE8DE", 200: "#E1DBCD", 300: "#CFC8B6",
              400: "#9AA89E", 500: "#6C776F", 600: "#566159", 700: "#3F4A43",
              800: "#26332B", 900: "#15201A",
              foreground: "#26332B",
              DEFAULT: "#E1DBCD",
            },
            primary:   { DEFAULT: "#BFE82A", foreground: "#15201A" },
            danger:    { DEFAULT: "#E11D48", foreground: "#FFFFFF" },
            success:   { DEFAULT: "#0D9F6E", foreground: "#FFFFFF" },
            secondary: { DEFAULT: "#7C5CFA", foreground: "#FFFFFF" },
          },
        },
        dark: {
          colors: {
            background: { DEFAULT: "#0E1A14" },
            foreground: { DEFAULT: "#E1DBCD" },
            divider:    { DEFAULT: "rgba(255, 255, 255, 0.08)" },
            focus:      { DEFAULT: "#C6F03A" },
            overlay:    { DEFAULT: "#000000" },
            content1:   { DEFAULT: "#14241C", foreground: "#E1DBCD" },
            content2:   { DEFAULT: "#1B2F25", foreground: "#E1DBCD" },
            content3:   { DEFAULT: "#24392D", foreground: "#E1DBCD" },
            content4:   { DEFAULT: "#2D4636", foreground: "#E1DBCD" },
            default: {
              50: "#15201A", 100: "#1B2F25", 200: "#24392D", 300: "#2D4636",
              400: "#566159", 500: "#6C776F", 600: "#9AA89E", 700: "#CFC8B6",
              800: "#E1DBCD", 900: "#ECE8DE",
              foreground: "#E1DBCD",
              DEFAULT: "#24392D",
            },
            primary:   { DEFAULT: "#C6F03A", foreground: "#0E1A14" },
            danger:    { DEFAULT: "#FB7185", foreground: "#0E1A14" },
            success:   { DEFAULT: "#2DD4A0", foreground: "#0E1A14" },
            secondary: { DEFAULT: "#A78BFA", foreground: "#0E1A14" },
          },
        },
      },
    }),
  ],
};

export default config;
