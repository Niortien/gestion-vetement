"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
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

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="hidden h-full w-56 flex-col gap-3 overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
      <h2 className="font-[var(--font-display)] text-xl text-text">Riviere</h2>
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
      </nav>
      <div className="mt-auto">
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
