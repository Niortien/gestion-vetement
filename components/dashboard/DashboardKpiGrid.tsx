"use client";

import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import type { ResumeJour } from "@/types";

interface DashboardKpiGridProps {
  resume: ResumeJour | undefined;
  stockValeur: string;
  alertesCount: number;
  isLoading: boolean;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  tone: "accent" | "in" | "out" | "cash";
  isMontant?: boolean;
}

const TONE_CLASSES: Record<KpiCardProps["tone"], { border: string; bg: string; text: string }> = {
  accent: {
    border: "border-accent/40",
    bg: "bg-[color:rgba(255,212,71,0.08)]",
    text: "text-accent",
  },
  in: {
    border: "border-[var(--color-in)]/40",
    bg: "bg-[color:rgba(57,211,83,0.08)]",
    text: "text-[var(--color-in)]",
  },
  out: {
    border: "border-[var(--color-out)]/40",
    bg: "bg-[color:rgba(255,77,109,0.08)]",
    text: "text-[var(--color-out)]",
  },
  cash: {
    border: "border-[var(--color-cash)]/40",
    bg: "bg-[color:rgba(143,126,245,0.08)]",
    text: "text-[var(--color-cash)]",
  },
};

function KpiCard({ label, value, sub, tone, isMontant = false }: KpiCardProps) {
  const t = TONE_CLASSES[tone];
  return (
    <div className={`rounded-xl border ${t.border} ${t.bg} p-4`}>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      {isMontant ? (
        <CurrencyDisplay montant={String(value)} size="lg" tone={tone} className="mt-2" />
      ) : (
        <p className={`mt-2 font-[var(--font-display)] text-3xl ${t.text}`}>{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

export function DashboardKpiGrid({ resume, stockValeur, alertesCount, isLoading }: DashboardKpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-border/40 bg-[var(--color-surface-high)]" />
        ))}
      </div>
    );
  }

  const totalVentes = resume?.totalVentes ?? "0";
  const totalTransactions = resume?.totalTransactions ?? 0;
  const sessionOpen = resume?.session !== null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard
        label="Ventes du jour"
        value={totalVentes}
        sub={`${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`}
        tone="cash"
        isMontant
      />
      <KpiCard
        label="Valeur stock"
        value={stockValeur}
        sub="au prix d'achat"
        tone="accent"
        isMontant
      />
      <KpiCard
        label="Session caisse"
        value={sessionOpen ? "Ouverte" : "Fermée"}
        sub={sessionOpen ? "Active" : "Ouvre une session"}
        tone={sessionOpen ? "in" : "out"}
      />
      <KpiCard
        label="Alertes stock"
        value={alertesCount}
        sub={alertesCount === 0 ? "Tout est OK" : "à réapprovisionner"}
        tone={alertesCount === 0 ? "in" : "out"}
      />
    </div>
  );
}
