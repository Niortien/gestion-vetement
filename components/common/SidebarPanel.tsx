"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { IconLogout, IconWorld } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/features/auth/mutation/auth-mutations";
import { findActiveHref, type NavSection } from "@/lib/navigation";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface SidebarPanelProps {
  sections: NavSection[];
  /** Ligne d'identité sous le logo (nom de la boutique, ou « Super Admin »). */
  identity?: ReactNode;
  /** Bloc affiché juste au-dessus des actions du bas (ex. carte d'abonnement). */
  footerTop?: ReactNode;
  /** Ferme le tiroir mobile quand on navigue. */
  onNavigate?: () => void;
  /** Bouton de fermeture (tiroir mobile uniquement). */
  closeSlot?: ReactNode;
  /** Destination du logo (accueil de l'espace courant). */
  homeHref?: string;
  className?: string;
}

/** Contenu commun de la navigation latérale : sidebar desktop, tiroir mobile et shell super-admin. */
export function SidebarPanel({
  sections,
  identity,
  footerTop,
  onNavigate,
  closeSlot,
  homeHref = "/dashboard",
  className,
}: SidebarPanelProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const activeHref = findActiveHref(sections, pathname);
  const user = useAuthStore((s) => s.user);
  const initiales = (user?.email ?? "DV").slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex h-full flex-col gap-3 overflow-y-auto bg-sidebar p-4 text-sidebar-text", className)}>
      <div className="flex items-start justify-between gap-2">
        <Link
          href={homeHref}
          onClick={onNavigate}
          aria-label="Dri Valé — accueil"
          className="rounded-md focus-visible:outline-sidebar-accent"
        >
          <BrandMark onDark />
        </Link>
        {closeSlot}
      </div>

      <p className="-mt-1 px-1 text-[12.5px] font-semibold text-sidebar-muted">L&rsquo;atelier</p>

      {identity}

      <nav aria-label="Navigation principale" className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <div key={section.label ?? index} className="flex flex-col gap-0.5">
            {section.label && (
              <p className="mb-1 px-3 text-xs font-bold text-sidebar-muted">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[14.5px] font-semibold lg:min-h-[42px]",
                    "transition-colors duration-150 focus-visible:outline-sidebar-accent",
                    active
                      ? "bg-sidebar-accent text-[#0C0C0E]"
                      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text"
                  )}
                >
                  <Icon
                    size={18}
                    aria-hidden
                    className={cn("shrink-0", active ? "text-[#0C0C0E]" : "text-sidebar-muted group-hover:text-sidebar-text")}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-sidebar-border pt-4">
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-display text-sm font-extrabold text-[#0C0C0E]">
              {initiales}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.email}</p>
              <p className="text-[12.5px] text-sidebar-muted">{user.role === "ADMIN" ? "Administrateur" : "Caissier"}</p>
            </div>
          </div>
        )}
        {footerTop}
        <ThemeToggle onDark />
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-sidebar-accent"
        >
          <IconWorld size={16} className="shrink-0" aria-hidden />
          Voir le site
        </Link>
        <Button
          variant="light"
          className="min-h-10 w-full justify-start gap-2.5 px-3 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-out-text"
          onPress={() => {
            logout.mutate();
            onNavigate?.();
          }}
          isLoading={logout.isPending}
          startContent={!logout.isPending && <IconLogout size={16} aria-hidden />}
        >
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
