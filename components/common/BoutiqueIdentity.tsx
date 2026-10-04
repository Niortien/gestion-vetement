"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";
import { AdminBoutiqueSelect } from "@/components/common/AdminBoutiqueSelect";

/** Sous le logo : sélecteur de boutique pour l'admin, nom de la boutique pour le vendeur. */
export function BoutiqueIdentity() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === "ADMIN") return <AdminBoutiqueSelect />;
  if (!user?.boutiqueId) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-sidebar-hover px-3 py-2 text-sm font-semibold text-sidebar-text">
      <IconBuildingStore size={16} aria-hidden className="shrink-0 text-sidebar-accent" />
      <span className="truncate">{user.boutiqueName ?? "Ma boutique"}</span>
    </div>
  );
}
