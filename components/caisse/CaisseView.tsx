"use client";

import { Button, Chip, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useCaisse } from "@/hooks/useCaisse";
import { useCaisseSocket, useFermerSession } from "@/features/caisse/mutation/caisse-mutations";
import { useUiStore } from "@/stores/uiStore";
import { CaisseCloseModal } from "./CaisseCloseModal";
import { CaisseStream } from "./CaisseStream";
import { CaisseSummaryBar } from "./CaisseSummaryBar";
import { SessionGuard } from "./SessionGuard";

export function CaisseView() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const density = useUiStore((state) => state.feedDensity);
  const { transactionsLive, resumeJour, sessionActive } = useCaisse();
  const { connect, disconnect } = useCaisseSocket();
  const closeSession = useFermerSession();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const resume = resumeJour.data?.data;

  return (
    <SessionGuard>
      <PageWrapper>
        <div className="rounded-xl border border-border/80 bg-[linear-gradient(145deg,rgba(143,126,245,0.18),rgba(255,212,71,0.08))] p-4 md:p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-text-muted">Solde du jour</p>
          <CurrencyDisplay montant={resume?.soldeActuel ?? "0"} size="xl" tone="accent" className="mt-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(resume?.parModePaiement ?? {}).map(([mode, montant]) => (
            <Chip
              key={mode}
              variant="flat"
              className="border border-border/70 bg-[color:rgba(45,69,103,0.55)] text-text"
            >
              {mode}: {montant}
            </Chip>
          ))}
        </div>
        <FeedDensityToggle />
        <CaisseStream transactions={transactionsLive} density={density} />
        {resume ? <CaisseSummaryBar resume={resume} /> : null}
        <Button variant="bordered" color="danger" onPress={onOpen}>
          Cloturer
        </Button>
      </PageWrapper>
      <CaisseCloseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => {
          if (sessionActive) {
            closeSession.mutate({ id: sessionActive.id, montantFermeture: "0" });
          }
          onClose();
        }}
      />
    </SessionGuard>
  );
}
