"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVitrineStore } from "@/stores/vitrineStore";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { IconBag, IconGrid, IconHome, IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux passer une commande");

/**
 * Barre d'actions basse (mobile) : les quatre gestes d'un client qui commande au pouce.
 * Masquée sur la fiche produit, qui a sa propre barre de commande.
 */
export function VitrineDock() {
  const pathname = usePathname();
  const cart = useVitrineStore((s) => s.cart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const count = cart.reduce((sum, i) => sum + i.quantite, 0);

  if (pathname.startsWith("/boutique/")) return null;

  const item = "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold";
  const tone = (active: boolean) => ({ color: active ? "var(--v-gold-text)" : "var(--v-muted)" });

  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{ backgroundColor: "var(--v-nav-bg)", borderColor: "var(--v-nav-border)", backdropFilter: "blur(16px)" }}
    >
      <Link href="/" className={item} style={tone(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
        <span className="flex h-7 items-center"><IconHome size={22} /></span>
        Accueil
      </Link>
      <Link
        href="/catalogue"
        className={item}
        style={tone(pathname.startsWith("/catalogue"))}
        aria-current={pathname.startsWith("/catalogue") ? "page" : undefined}
      >
        <span className="flex h-7 items-center"><IconGrid size={22} /></span>
        Catalogue
      </Link>
      <button type="button" onClick={() => setCartOpen(true)} className={item} style={tone(false)} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <span className="relative flex h-7 items-center">
          <IconBag size={22} />
          {count > 0 && (
            <span
              className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{ backgroundColor: "var(--v-hot)", color: "#fff" }}
            >
              {count}
            </span>
          )}
        </span>
        Panier
      </button>
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className={item} style={{ color: "var(--v-text)" }}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}>
          <IconWhatsapp size={16} />
        </span>
        Commander
      </a>
    </nav>
  );
}
