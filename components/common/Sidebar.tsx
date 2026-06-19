"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Select, SelectItem } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/activite", label: "Activité" },
  { href: "/stock", label: "Stock" },
  { href: "/caisse", label: "Caisse" },
  { href: "/entrees", label: "Entrées" },
  { href: "/sorties", label: "Sorties" },
  { href: "/produits", label: "Produits" },
  { href: "/promotions", label: "Promotions" },
];

const ADMIN_ITEMS = [
  { href: "/admin/boutiques", label: "Boutiques" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);
  const { currentBoutiqueId, setCurrentBoutique } = useAdminStore();
  const { data: boutiquesRes } = useBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="hidden h-full w-56 flex-col gap-3 overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
      <h2 className="font-[var(--font-display)] text-xl text-text">Riviere</h2>

      {isAdmin && boutiques.length > 0 && (
        <Select
          size="sm"
          label="Boutique"
          selectedKeys={new Set([currentBoutiqueId])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string | undefined;
            setCurrentBoutique(val ?? "all");
          }}
          classNames={{ trigger: "bg-surface/60 border border-border" }}
          aria-label="Sélectionner une boutique"
        >
          {[
            <SelectItem key="all">Toutes les boutiques</SelectItem>,
            ...boutiques.map((b) => (
              <SelectItem key={b.id}>{b.nom}{b.ville ? ` · ${b.ville}` : ""}</SelectItem>
            )),
          ]}
        </Select>
      )}

      {!isAdmin && user?.boutiqueId && boutiques.length > 0 && (
        <div className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent">
          {boutiques.find((b) => b.id === user.boutiqueId)?.nom ?? "Ma boutique"}
        </div>
      )}

      <nav className="flex flex-col gap-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Button
              key={item.href}
              as={Link}
              href={item.href}
              variant={active ? "solid" : "light"}
              className={cn("justify-start", active ? "bg-accent text-black" : "text-text-muted")}
            >
              {item.label}
            </Button>
          );
        })}

        {isAdmin && (
          <>
            <p className="mt-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
              Administration
            </p>
            {ADMIN_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  as={Link}
                  href={item.href}
                  variant={active ? "solid" : "light"}
                  className={cn("justify-start", active ? "bg-accent text-black" : "text-text-muted")}
                >
                  {item.label}
                </Button>
              );
            })}
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          as={Link}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          variant="flat"
          className="w-full justify-start border border-accent/30 bg-accent/10 text-accent"
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
          onPress={() => logout.mutate()}
          isLoading={logout.isPending}
        >
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
