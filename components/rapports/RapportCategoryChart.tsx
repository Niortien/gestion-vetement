"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RapportCategoryChartProps {
  data: Array<{ name: string; value: number }>;
}

export function RapportCategoryChart({ data }: RapportCategoryChartProps) {
  return (
    <section className="rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(143,126,245,0.1),rgba(34,54,81,0.72))] p-4">
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip />
            <Bar dataKey="value" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
