"use client";

import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { useSessionsList } from "@/features/caisse/query/caisse-queries";
import type { Session } from "@/types";
import { SessionCard } from "./SessionCard";
import { SessionDetailDrawer } from "./SessionDetailDrawer";

export function SessionsList() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useSessionsList({
    limit: 10,
    sortOrder: "desc",
  });

  const sessions = (data?.pages ?? []).flatMap((p) => p.data as Session[]);

  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-text-muted">
            Historique des sessions
          </h2>
          {data && (
            <span className="text-xs text-text-dim">
              {data.pages[0]?.meta?.total ?? 0} session{(data.pages[0]?.meta?.total ?? 0) !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner color="warning" size="sm" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-surface p-8 text-center">
            <p className="text-sm text-text-dim">Aucune session enregistrée</p>
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
