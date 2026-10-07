import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { ThemeInit } from "@/components/common/ThemeInit";
import "./globals.css";

// Applique le thème persisté avant le premier paint pour éviter un flash
// (le storefront [data-vitrine] a son propre thème indépendant, non concerné).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('backoffice-theme');
    var theme = raw ? JSON.parse(raw).state.theme : 'light';
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

// Dri Valé : Bricolage Grotesque (titres, affiches de la vitrine), DM Sans (corps), JetBrains Mono (données).
// Police variable : les axes `wdth` (affiche condensée de la vitrine) et `opsz` sont exposés.
const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Héros de la vitrine : Anton (affiche) et Instrument Serif italique (mot qui tourne).
const heroPosterFont = Anton({
  variable: "--font-hero-poster",
  subsets: ["latin"],
  weight: "400",
});

const heroAccentFont = Instrument_Serif({
  variable: "--font-hero-accent",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: "Dri Valé — Gestion Boutique",
  description: "Gestion de stock et de caisse pour Dri Valé Boutique, Yopougon Abidjan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${heroPosterFont.variable} ${heroAccentFont.variable} h-full antialiased light`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://dri-vale.org" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-base text-text font-body flex flex-col">
        <ThemeInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
