"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { ModePaiement } from "@/types";

interface ModeCard {
  mode: ModePaiement;
  label: string;
  icon: string;
}

const MODE_CARDS: ModeCard[] = [
  { mode: ModePaiement.CASH, label: "Cash", icon: "💵" },
  { mode: ModePaiement.WAVE, label: "Wave", icon: "🌊" },
  { mode: ModePaiement.ORANGE_MONEY, label: "Orange Money", icon: "🟠" },
  { mode: ModePaiement.CARTE, label: "Carte", icon: "💳" },
  { mode: ModePaiement.MTN_MONEY, label: "MTN Money", icon: "🟡" },
];

interface SortiePaiementStepProps {
  totalMontant: string;
  isPending: boolean;
  onSubmit: (modePaiement: ModePaiement, reference?: string, notes?: string) => void;
  onBack: () => void;
}

export function SortiePaiementStep({ totalMontant, isPending, onSubmit, onBack }: SortiePaiementStepProps) {
  const [selected, setSelected] = useState<ModePaiement | null>(null);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-5">
      {/* Total */}
      <div className="rounded-xl border border-[var(--color-cash)]/40 bg-[color:rgba(143,126,245,0.10)] p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-text-muted">Montant à encaisser</p>
        <p className="mt-1 font-[var(--font-display)] text-3xl text-[var(--color-cash)]">
          {Number(totalMontant).toLocaleString("fr-FR")} FCFA
        </p>
      </div>

      {/* Mode de paiement */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Mode de paiement</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {MODE_CARDS.map((card) => (
            <button
              key={card.mode}
              type="button"
              onClick={() => setSelected(card.mode)}
              className={[
                "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                selected === card.mode
                  ? "border-accent bg-[color:rgba(255,212,71,0.15)] ring-2 ring-accent ring-offset-1 ring-offset-[var(--color-surface)]"
                  : "border-border/60 bg-[var(--color-surface-high)] hover:border-accent/40",
              ].join(" ")}
              aria-pressed={selected === card.mode}
            >
              <span className="text-xl">{card.icon}</span>
              <span className="text-[10px] font-medium text-text">{card.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optionnel */}
      <div className="space-y-3">
        <Input
          variant="bordered"
          placeholder="Référence (optionnel)"
          value={reference}
          onValueChange={setReference}
          size="sm"
        />
        <Input
          variant="bordered"
          placeholder="Notes (optionnel)"
          value={notes}
          onValueChange={setNotes}
          size="sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="flat" className="flex-1 text-text-muted" onPress={onBack} isDisabled={isPending}>
          ← Retour
        </Button>
        <Button
          className="flex-1 bg-accent font-semibold text-black"
          isDisabled={!selected || isPending}
          isLoading={isPending}
          onPress={() => selected && onSubmit(selected, reference || undefined, notes || undefined)}
        >
          Enregistrer la vente
        </Button>
      </div>
    </div>
  );
}
