"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RapportTrendChartProps {
  data: Array<{ periode: string; total: number }>;
}

export function RapportTrendChart({ data }: RapportTrendChartProps) {
  return (
    <section className="rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(255,212,71,0.08),rgba(34,54,81,0.72))] p-4">
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis dataKey="periode" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
