"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVitrineStore } from "@/stores/vitrineStore";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { IconBag, IconGrid, IconHome, IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux passer une commande");

/**
 * Dock mobile : une pilule d'encre flottante avec les quatre gestes d'un client qui commande au pouce.
 * Le seul bouton or est « Commander ». Masqué sur la fiche produit, qui a sa propre barre de commande.
 */
export function VitrineDock() {
  const pathname = usePathname();
  const cart = useVitrineStore((s) => s.cart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const count = cart.reduce((sum, i) => sum + i.quantite, 0);

  if (pathname.startsWith("/boutique/")) return null;

  const item =
    "relative flex h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-[3px] rounded-full text-[11px] font-bold";
  const tone = (active: boolean) => ({ color: active ? "#fff" : "#B9B9BE" });
  const marker = (active: boolean) =>
    active ? <span aria-hidden className="absolute bottom-[3px] h-[5px] w-[5px] rounded-full" style={{ backgroundColor: "#F0B429" }} /> : null;

  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 flex h-[68px] items-center justify-between rounded-full px-2 md:hidden"
      style={{ backgroundColor: "#0C0C0E", boxShadow: "0 22px 44px -16px rgba(12,12,14,0.6)" }}
    >
      <Link href="/" className={item} style={tone(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
        <IconHome size={22} />
        Accueil
        {marker(pathname === "/")}
      </Link>
      <Link
        href="/catalogue"
        className={item}
        style={tone(pathname.startsWith("/catalogue"))}
        aria-current={pathname.startsWith("/catalogue") ? "page" : undefined}
      >
        <IconGrid size={22} />
        Catalogue
        {marker(pathname.startsWith("/catalogue"))}
      </Link>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className={item}
        style={tone(false)}
        aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
      >
        <span className="relative flex">
          <IconBag size={22} />
          {count > 0 && (
            <span
              className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-extrabold"
              style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
            >
              {count}
            </span>
          )}
        </span>
        Panier
      </button>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[52px] flex-[1.4] items-center justify-center gap-2 rounded-full text-sm font-bold"
        style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
      >
        <IconWhatsapp size={18} />
        Commander
      </a>
    </nav>
  );
}
