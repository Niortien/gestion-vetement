"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, chartColors, tooltipLabelStyle, tooltipStyle } from "@/lib/chartTheme";
import type { FenetreHoraire, HeureStat } from "@/lib/analyse";

/** Nombre de ventes par heure de la journée ; la fenêtre de pic est en pleine couleur. */
export function AnalyseHeuresChart({ heures, pic }: { heures: HeureStat[]; pic: FenetreHoraire | null }) {
  const data = heures.map((h) => ({ label: `${h.heure}h`, heure: h.heure, ventes: h.ventes }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval={2} />
        <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          cursor={{ fill: "var(--color-surface-high)" }}
          formatter={(value: number) => [`${value} vente${value > 1 ? "s" : ""}`, "Ventes"]}
        />
        <Bar dataKey="ventes" radius={[3, 3, 0, 0]}>
          {data.map((d) => {
            const dansPic = pic !== null && d.heure >= pic.debut && d.heure < pic.fin;
            return <Cell key={d.label} fill={chartColors.accent} fillOpacity={dansPic ? 1 : 0.38} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
