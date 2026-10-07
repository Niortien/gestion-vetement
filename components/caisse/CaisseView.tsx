"use client";

import { useEffect } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { IconFlag } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatTile } from "@/components/common/StatTile";
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
  const modes = Object.entries(resume?.parModePaiement ?? {});

  return (
    <PageWrapper>
      <SessionGuard>
        <PageHero
          eyebrow="Session en cours"
          title="Caisse"
          description="Les ventes de l'équipe arrivent ici en direct. Clôturez la journée quand la caisse est comptée."
          actions={
            <Button
              className="min-h-11 border-1.5 border-text bg-transparent font-semibold text-text"
              variant="bordered"
              startContent={!closeSession.isPending && <IconFlag size={18} aria-hidden />}
              isDisabled={!sessionId || closeSession.isPending}
              isLoading={closeSession.isPending}
              onPress={onOpen}
            >
              Terminer la journée
            </Button>
          }
        />

        <div className="flex flex-wrap items-start gap-5">
          <section aria-label="Transactions en direct" className="flex min-w-0 flex-[1.4_1_520px] flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-text">
                <span className="relative flex h-2.5 w-2.5">
                  <span aria-hidden className="live-ping absolute inset-0 rounded-full bg-in" />
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-in" />
                </span>
                En direct
              </h2>
              <FeedDensityToggle />
            </div>
            <CaisseStream transactions={transactionsLive} density={density} />
          </section>

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <StatTile
              ink
              tone="cash"
              label="Recettes du jour"
              value={<CurrencyDisplay montant={resume?.totalVentes ?? "0"} size="xl" className="font-display text-[34px] font-bold" />}
              hint={`${resume?.totalTransactions ?? 0} transaction${(resume?.totalTransactions ?? 0) > 1 ? "s" : ""} aujourd'hui`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <StatTile
                tone="cash"
                label="Montant à déposer"
                value={<CurrencyDisplay montant={resume?.montantADeposer ?? "0"} size="md" className="font-display text-2xl font-bold" />}
                delay={0.05}
              />
              <StatTile
                tone="in"
                label="Bénéfice net"
                value={<CurrencyDisplay montant={resume?.beneficeNet ?? "0"} size="md" className="font-display text-2xl font-bold" />}
                delay={0.1}
              />
            </div>

            {modes.length > 0 && (
              <section aria-label="Recettes par mode de paiement" className="rounded-[22px] bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)]">
                <h2 className="mb-2 font-display text-[17px] font-semibold text-text">Par mode de paiement</h2>
                <ul>
                  {modes.map(([mode, montant]) => {
                    const valeur = Number(montant) || 0;
                    const max = Math.max(...modes.map(([, m]) => Number(m) || 0), 1);
                    return (
                      <li key={mode} className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-3 py-1.5 text-sm">
                        <span>{mode}</span>
                        <span aria-hidden className="h-2.5 overflow-hidden rounded-full bg-surface-high">
                          <i className="block h-full rounded-full bg-text" style={{ width: `${(valeur / max) * 100}%` }} />
                        </span>
                        <CurrencyDisplay montant={String(montant)} size="sm" className="text-right font-bold" />
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </aside>
        </div>

        {resume ? <CaisseSummaryBar resume={resume} /> : null}
      </SessionGuard>

      <SessionsList />

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
