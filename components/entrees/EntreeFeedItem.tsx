import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FlowTag } from "@/components/common/FlowTag";
import type { Entree } from "@/types";

interface EntreeFeedItemProps {
  entree: Entree;
  onCancel: (id: string) => void;
}

export function EntreeFeedItem({ entree, onCancel }: EntreeFeedItemProps) {
  return (
    <article className="rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(57,211,83,0.12),rgba(34,54,81,0.7))] p-3 transition hover:border-in/50 hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <FlowTag type="entree" />
        <span className="text-xs text-text-muted">
          {formatDistanceToNow(new Date(entree.createdAt), { addSuffix: true, locale: fr })}
        </span>
      </div>
      <p className="text-sm font-semibold">{entree.fournisseur}</p>
      <p className="text-xs font-[var(--font-mono)] text-text-muted">{entree.reference}</p>
      <div className="mt-2 flex items-center justify-between">
        <CurrencyDisplay montant={entree.totalCout} size="lg" tone="in" />
        <Button size="sm" variant="flat" className="bg-[var(--color-out-dim)] text-out" onPress={() => onCancel(entree.id)}>
          Annuler
        </Button>
      </div>
    </article>
  );
}
