"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDateShort } from "@/lib/dateUtils";

interface SparklinePoint {
  periode: string;
  totalVentes: string;
}

interface DashboardSparklineProps {
  data: SparklinePoint[];
}

export function DashboardSparkline({ data }: DashboardSparklineProps) {
  const chartData = data.map((d) => ({
    name: formatDateShort(d.periode),
    value: Number(d.totalVentes),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border/60 bg-[var(--color-surface-high)]">
        <p className="text-sm text-text-muted">Aucune donnée de vente sur 7 jours</p>
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
