"use client";

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
            backgroundColor: "rgba(4, 8, 15, 0.92)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
          }}
        />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-display)] text-xl font-black tracking-[0.15em] text-[var(--v-text)] hover:text-[var(--v-lime)] transition-colors"
          >
            RIVIERE
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
              <span className="font-[var(--font-display)] text-xl font-black tracking-[0.15em] text-[var(--v-text)]">
                RIVIERE
              </span>
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
              <p className="text-sm text-[var(--v-dim)]">Riviere — Streetwear Dakar</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
