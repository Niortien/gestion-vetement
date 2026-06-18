"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/activite", label: "Activité" },
  { href: "/stock", label: "Stock" },
  { href: "/caisse", label: "Caisse" },
  { href: "/entrees", label: "Entrées" },
  { href: "/sorties", label: "Sorties" },
  { href: "/produits", label: "Produits" },
  { href: "/rapports", label: "Rapports" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <h2 className="font-[var(--font-display)] text-xl text-text">Riviere</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-[var(--color-surface-high)] hover:text-text"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-[510] flex w-64 flex-col gap-3 overflow-y-auto border-r border-border bg-surface p-4 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-[var(--font-display)] text-xl text-text">Riviere</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      as={Link}
                      href={item.href}
                      variant={active ? "solid" : "light"}
                      className={cn(
                        "justify-start",
                        active ? "bg-accent text-black" : "text-text-muted"
                      )}
                      onPress={() => setOpen(false)}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="flat"
                  className="w-full justify-start border border-accent/30 bg-accent/10 text-accent"
                  onPress={() => setOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Voir le site
                </Button>
                <Button
                  variant="light"
                  className="w-full justify-start text-text-muted hover:text-out"
                  onPress={() => { logout.mutate(); setOpen(false); }}
                  isLoading={logout.isPending}
                >
                  Déconnexion
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
