"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDateShort } from "@/lib/dateUtils";

interface SparklinePoint {
  periode: string;
  totalVentes: string;
}

interface DashboardSparklineProps {
  data: SparklinePoint[];
  isError?: boolean;
}

export function DashboardSparkline({ data, isError }: DashboardSparklineProps) {
  if (isError) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl border border-out/30 bg-[var(--color-surface-high)]">
        <p className="text-xs font-semibold text-out">Impossible de charger les ventes</p>
        <p className="text-[11px] text-text-muted">Vérifie la connexion au serveur</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: formatDateShort(d.periode),
    value: Number(d.totalVentes),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-4">
        <p className="text-sm font-medium text-text-muted">Aucune vente sur 7 jours</p>
        <div className="rounded-md border border-accent/20 bg-accent/5 px-3 py-1.5 text-center">
          <p className="text-[11px] text-accent">Pour voir la courbe :</p>
          <p className="text-[11px] text-text-muted">Crée une sortie de type <span className="font-semibold text-text">VENTE</span> dans le menu Sorties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Ventes — 7 derniers jours</p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v.toLocaleString("fr-FR")} FCFA`, "Ventes"]}
            labelStyle={{ color: "var(--color-text-muted)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
