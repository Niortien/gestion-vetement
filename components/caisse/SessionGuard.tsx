"use client";

import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useOuvrirSession } from "@/features/caisse/mutation/caisse-mutations";

interface SessionGuardProps {
  children: React.ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
  const [montantOuverture, setMontantOuverture] = useState("");
  const { data, isLoading, isError } = useActiveSession();
  const openMutation = useOuvrirSession();
  const activeSession = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 flex max-w-md items-center justify-center rounded-lg border border-border bg-surface p-6">
        <Spinner color="warning" />
      </div>
    );
  }

  if (activeSession) return <>{children}</>;

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg border border-border bg-surface p-6">
      <h2 className="mb-3 text-xl font-semibold">Ouvrir une session</h2>
      {isError ? <p className="mb-3 text-sm text-out">Impossible de charger la session active.</p> : null}
      <Input
        value={montantOuverture}
        onValueChange={setMontantOuverture}
        variant="bordered"
        labelPlacement="outside"
        placeholder="Montant d'ouverture"
      />
      {openMutation.error ? (
        <p className="mt-2 text-sm text-[var(--color-out)]">
          {(openMutation.error as { message?: string })?.message ?? "Erreur lors de l'ouverture"}
        </p>
      ) : null}
      <Button
        className="mt-4 w-full bg-accent text-black"
        isLoading={openMutation.isPending}
        onPress={() => openMutation.mutate({ montantOuverture: montantOuverture || "0" })}
      >
        Ouvrir
      </Button>
    </div>
  );
}
