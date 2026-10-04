"use client";

import Link from "next/link";
import { BrandMark } from "@/components/common/BrandMark";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVitrineStore } from "@/stores/vitrineStore";
import { IconBag, IconStar } from "@/components/vitrine/common/VitrineIcons";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/lookbook",  label: "Le Style" },
  { href: "/marque",    label: "La Marque" },
];

export function VitrineNav() {
  const pathname    = usePathname();
  const [open, setOpen] = useState(false);
  const cart        = useVitrineStore((s) => s.cart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const theme       = useVitrineStore((s) => s.theme);
  const toggleTheme = useVitrineStore((s) => s.toggleTheme);
  const cartCount = cart.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
        <div
          className="pointer-events-auto flex w-full max-w-5xl items-center gap-2 rounded-full border py-1.5 pl-4 pr-2 shadow-lg md:w-auto md:gap-6 md:pr-3"
          style={{ backgroundColor: "#0C0C0E", borderColor: "rgba(255,255,255,0.16)" }}
        >
          <Link href="/" aria-label="Dri Valé, accueil" className="shrink-0">
            <BrandMark onDark className="h-9" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="relative min-h-9 content-center text-[13px] font-semibold uppercase tracking-wide transition-colors"
                  style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.62)" }}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-0 bottom-1 h-px" style={{ backgroundColor: "#F0B429" }} />}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 md:ml-2">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.8)" }}
              aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.8)" }}
              aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
            >
              <IconBag size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden"
              style={{ color: "rgba(255,255,255,0.8)" }}
              aria-label="Ouvrir le menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="9" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ backgroundColor: "var(--v-bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <BrandMark vitrine className="h-11" />
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" style={{ color: "var(--v-muted)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-6">
              {[{ href: "/", label: "Accueil" }, ...NAV_LINKS].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b py-5 font-[var(--font-display)] text-[42px] font-black leading-tight tracking-tight transition-colors hover:text-[var(--v-gold-text)]"
                    style={{
                      borderColor: "var(--v-border)",
                      color: pathname === l.href ? "var(--v-gold)" : "var(--v-text)",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t px-6 py-6" style={{ borderColor: "var(--v-border)" }}>
              <div className="flex items-center gap-2">
                <IconStar size={12} style={{ color: "var(--v-gold-text)" }} />
                <span className="font-[var(--font-display)] text-sm font-black uppercase tracking-wider" style={{ color: "var(--v-gold-text)" }}>
                  Sortez toujours bien habillé
                </span>
                <IconStar size={12} style={{ color: "var(--v-gold-text)" }} />
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--v-dim)" }}>Dri Valé · Yopougon · Abidjan · CI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
