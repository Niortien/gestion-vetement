"use client";

import { Spinner } from "@heroui/react";
import { useEffect } from "react";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useOuvrirSession } from "@/features/caisse/mutation/caisse-mutations";

interface SessionGuardProps {
  children: React.ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
  const { data, isLoading } = useActiveSession();
  const openMutation = useOuvrirSession();
  const activeSession = data?.data ?? null;

  // Auto-ouvre une session dès que la page est chargée et qu'aucune n'est active
  useEffect(() => {
    if (!isLoading && !activeSession && !openMutation.isPending && !openMutation.isSuccess) {
      openMutation.mutate({ montantOuverture: "0" });
    }
  }, [isLoading, activeSession, openMutation]);

  if (isLoading || openMutation.isPending) {
    return (
      <div className="flex h-32 items-center justify-center gap-3">
        <Spinner color="warning" size="sm" />
        <p className="text-sm text-text-muted">Chargement de la caisse…</p>
      </div>
    );
  }

  if (openMutation.isError) {
    return (
      <div className="rounded-xl border border-out/30 bg-out/8 p-4 text-center">
        <p className="text-sm text-out">Impossible d&apos;ouvrir la caisse. Vérifie ta connexion.</p>
        <button
          onClick={() => openMutation.mutate({ montantOuverture: "0" })}
          className="mt-3 text-xs font-semibold text-text-muted underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
