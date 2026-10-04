"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, chartColors, formatAxisAmount, tooltipStyle } from "@/lib/chartTheme";
import type { JourStat } from "@/lib/analyse";

interface Point {
  label: string;
  complet: string;
  ca: number;
  ventes: number;
}

/** Infobulle : jour complet, chiffre d'affaires et nombre de ventes. */
function InfoJour({ active, payload }: { active?: boolean; payload?: Array<{ payload: Point }> }) {
  const p = payload?.[0]?.payload;
  if (!active || !p) return null;
  return (
    <div style={{ ...tooltipStyle, padding: "8px 12px" }}>
      <p className="font-semibold">{p.complet}</p>
      <p>{p.ca.toLocaleString("fr-FR")} FCFA</p>
      <p style={{ color: "var(--color-text-muted)" }}>
        {p.ventes} vente{p.ventes > 1 ? "s" : ""}
      </p>
    </div>
  );
}

/** Chiffre d'affaires par jour de la semaine ; le meilleur jour est en pleine couleur, les autres atténués. */
export function AnalyseJoursChart({ jours }: { jours: JourStat[] }) {
  const data: Point[] = jours.map((j) => ({ label: j.label.slice(0, 3), complet: j.label, ca: Math.round(j.ca), ventes: j.ventes }));
  const max = Math.max(...data.map((d) => d.ca), 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatAxisAmount} tick={axisTick} axisLine={false} tickLine={false} width={44} />
        <Tooltip content={<InfoJour />} cursor={{ fill: "var(--color-surface-high)" }} />
        <Bar dataKey="ca" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.label} fill={chartColors.cash} fillOpacity={d.ca === max ? 1 : 0.4 + (d.ca / max) * 0.3} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
