"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useVitrineStore } from "@/stores/vitrineStore";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/marque", label: "La Marque" },
];

export function VitrineNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useVitrineStore((s) => s.cart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const theme = useVitrineStore((s) => s.theme);
  const toggleTheme = useVitrineStore((s) => s.toggleTheme);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <>
      {/* Nav principale */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="absolute inset-0 border-b"
          style={{
            opacity: bgOpacity,
            backgroundColor: "var(--v-nav-bg)",
            borderColor: "var(--v-nav-border)",
            backdropFilter: "blur(12px)",
          }}
        />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          {/* Logo */}
          <Link href="/" aria-label="Dri Valé — Accueil">
            <Image
              src="/images/logo/logo.jpeg"
              alt="Dri Valé"
              height={44}
              width={140}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Liens desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wider uppercase transition-colors ${
                  pathname === link.href
                    ? "text-[var(--v-lime)]"
                    : "text-[var(--v-muted)] hover:text-[var(--v-text)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-[var(--v-lime)] hover:text-[var(--v-lime)] md:flex"
              style={{ borderColor: "var(--v-border)", color: "var(--v-dim)" }}
              aria-label="Accès dashboard"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Admin
            </Link>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v-border)] text-[var(--v-muted)] transition-colors hover:border-[var(--v-lime)] hover:text-[var(--v-lime)]"
              aria-label={theme === "dark" ? "Passer en thème clair" : "Passer en thème sombre"}
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Panier */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v-border)] text-[var(--v-muted)] transition-colors hover:border-[var(--v-lime)] hover:text-[var(--v-lime)]"
              aria-label="Voir le panier"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--v-lime)] text-[9px] font-black text-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-[var(--v-muted)] hover:text-[var(--v-text)] md:hidden"
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="9" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Menu overlay mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: "var(--v-bg)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Image
                src="/images/logo/logo.jpeg"
                alt="Dri Valé"
                height={40}
                width={130}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[var(--v-muted)]"
                aria-label="Fermer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {[{ href: "/", label: "Accueil" }, ...NAV_LINKS].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block font-[var(--font-display)] text-5xl font-black leading-tight tracking-tight transition-colors hover:text-[var(--v-lime)] ${
                      pathname === link.href ? "text-[var(--v-lime)]" : "text-[var(--v-text)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-[var(--v-border)] px-8 py-6">
              <p className="text-sm text-[var(--v-dim)]">Dri Valé — Boutique Yopougon, Abidjan</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
