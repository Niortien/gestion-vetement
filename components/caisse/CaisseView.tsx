"use client";

import { Chip, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useCaisse } from "@/hooks/useCaisse";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useCaisseSocket, useFermerSession } from "@/features/caisse/mutation/caisse-mutations";
import { useUiStore } from "@/stores/uiStore";
import { CaisseCloseModal } from "./CaisseCloseModal";
import { CaisseStream } from "./CaisseStream";
import { CaisseSummaryBar } from "./CaisseSummaryBar";
import { SessionGuard } from "./SessionGuard";
import { SessionsList } from "./SessionsList";

export function CaisseView() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [showMenu, setShowMenu] = useState(false);
  const density = useUiStore((state) => state.feedDensity);
  const { transactionsLive, resumeJour } = useCaisse();
  const { data: activeSessionData } = useActiveSession();
  const sessionId = activeSessionData?.data?.id ?? null;
  const { connect, disconnect } = useCaisseSocket();
  const closeSession = useFermerSession();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const resume = resumeJour.data?.data;

  return (
    <PageWrapper>
      {/* Caisse active */}
      <SessionGuard>
        <div className="rounded-xl border border-border/80 bg-[linear-gradient(145deg,rgba(143,126,245,0.18),rgba(255,212,71,0.08))] p-4 md:p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-text-muted">Recettes du jour</p>
          <CurrencyDisplay montant={resume?.totalVentes ?? "0"} size="xl" tone="accent" className="mt-2" />
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
      </SessionGuard>

      {/* Séparateur */}
      <div className="border-t border-border/50" />

      {/* Historique */}
      <SessionsList />

      {/* Menu discret fin de journée */}
      <div className="relative flex justify-end">
        <button
          onClick={() => setShowMenu((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-dim transition-colors hover:text-text-muted"
          aria-label="Options avancées"
        >
          ⋯ Options
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute bottom-8 right-0 z-20 min-w-[180px] rounded-xl border border-border bg-surface p-1 shadow-xl">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpen();
                }}
                disabled={!sessionId}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-out transition-colors hover:bg-out/8 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>🔒</span> Fin de journée
              </button>
            </div>
          </>
        )}
      </div>

      <CaisseCloseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => {
          if (sessionId) {
            closeSession.mutate({ id: sessionId, montantFermeture: "0" });
          }
          onClose();
        }}
      />
    </PageWrapper>
  );
}
