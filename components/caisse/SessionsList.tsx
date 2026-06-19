"use client";

import { Button, Chip, Spinner } from "@heroui/react";
import { useMemo, useState } from "react";
import { useSessionsList } from "@/features/caisse/query/caisse-queries";
import type { Session } from "@/types";
import { SessionCard } from "./SessionCard";
import { SessionDetailDrawer } from "./SessionDetailDrawer";

type DatePreset = "all" | "today" | "week" | "month";

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "today", label: "Aujourd'hui" },
  { key: "week", label: "Cette semaine" },
  { key: "month", label: "Ce mois" },
];

function getDateRange(preset: DatePreset): { dateDebut?: string; dateFin?: string } {
  if (preset === "all") return {};
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { dateDebut: start.toISOString(), dateFin: end.toISOString() };
  }
  if (preset === "week") {
    const start = new Date(now);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);
    return { dateDebut: start.toISOString(), dateFin: end.toISOString() };
  }
  if (preset === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateDebut: start.toISOString(), dateFin: end.toISOString() };
  }
  return {};
}

export function SessionsList() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [preset, setPreset] = useState<DatePreset>("all");

  const dateRange = useMemo(() => getDateRange(preset), [preset]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useSessionsList({
    limit: 10,
    sortOrder: "desc",
    ...dateRange,
  });

  const sessions = (data?.pages ?? []).flatMap((p) => p.data as Session[]);

  return (
    <>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-text-muted">
            Historique des sessions
          </h2>
          {data && (
            <span className="text-xs text-text-dim">
              {data.pages[0]?.meta?.total ?? 0} session{(data.pages[0]?.meta?.total ?? 0) !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filtre date */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <Chip
              key={p.key}
              variant="flat"
              className={
                preset === p.key
                  ? "cursor-pointer bg-[var(--color-cash)] font-semibold text-black"
                  : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted hover:text-text"
              }
              onClick={() => setPreset(p.key)}
            >
              {p.label}
            </Chip>
          ))}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner color="warning" size="sm" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-surface p-8 text-center">
            <p className="text-sm text-text-dim">
              {preset === "all" ? "Aucune session enregistrée" : "Aucune session sur cette période"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={setSelectedSession}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="bordered"
              size="sm"
              isLoading={isFetchingNextPage}
              onPress={() => fetchNextPage()}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>

      <SessionDetailDrawer
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
