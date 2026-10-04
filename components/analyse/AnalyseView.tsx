"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, type ReactNode } from "react";
import { Button, Spinner } from "@heroui/react";
import {
  IconAlertCircle,
  IconCalendarStar,
  IconChartDots3,
  IconClockHour4,
  IconCoin,
  IconReceipt2,
  IconShoppingBag,
} from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useStockAlertes } from "@/features/stock/query/stock-queries";
import { useVentesAnalyse, type PeriodeAnalyse } from "@/features/analyse/query/analyse-queries";
import { analyser, heureLabel, type StockAlerteLite } from "@/lib/analyse";
import { AnalyseConseils } from "./AnalyseConseils";
import { AnalyseHeatmap } from "./AnalyseHeatmap";
import { AnalyseProduitsPhares } from "./AnalyseProduitsPhares";

const chargement = (h: string) => (
  <div className={`flex ${h} items-center justify-center`}>
    <Spinner size="sm" />
  </div>
);

const AnalyseJoursChart = dynamic(() => import("./AnalyseJoursChart").then((m) => m.AnalyseJoursChart), {
  loading: () => chargement("h-[220px]"),
  ssr: false,
});
const AnalyseHeuresChart = dynamic(() => import("./AnalyseHeuresChart").then((m) => m.AnalyseHeuresChart), {
  loading: () => chargement("h-[220px]"),
  ssr: false,
});

const PERIODES: { key: string; label: string; jours: PeriodeAnalyse }[] = [
  { key: "7", label: "7 jours", jours: 7 },
  { key: "30", label: "30 jours", jours: 30 },
  { key: "90", label: "90 jours", jours: 90 },
];

function Section({ titre, description, children }: { titre: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-card md:p-5">
      <h2 className="text-sm font-semibold text-text">{titre}</h2>
      {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AnalyseView() {
  const [cle, setCle] = useState("30");
  const jours = PERIODES.find((p) => p.key === cle)?.jours ?? 30;

  const { data, isLoading, isError, refetch, isFetching } = useVentesAnalyse(jours);
  const { data: alertesRes } = useStockAlertes();

  const alertes = useMemo<StockAlerteLite[]>(() => {
    const parProduit = new Map<string, StockAlerteLite>();
    for (const a of alertesRes?.data ?? []) {
      const courant = parProduit.get(a.produitId);
      if (courant) courant.quantite += a.quantiteStock;
      else parProduit.set(a.produitId, { produitId: a.produitId, nom: a.produit?.nom ?? "Produit", quantite: a.quantiteStock });
    }
    return [...parProduit.values()];
  }, [alertesRes]);

  const analyse = useMemo(
    () => (data ? analyser(data.sorties, { debut: data.debut, fin: data.fin, alertes }) : null),
    [data, alertes]
  );

  const meilleurJour = analyse ? [...analyse.jours].sort((a, b) => b.ca - a.ca)[0] : undefined;

  return (
    <PageWrapper>
      <PageHero
        tone="cash"
        icon={IconChartDots3}
        eyebrow="Mini data-analyse"
        title="Analyse"
        description="Quels produits, quels jours et quelles heures font vos ventes, et ce qu'il faut en faire. Calculé sur vos ventes réelles, sans les ventes annulées."
      >
        <SegmentedControl ariaLabel="Période analysée" tone="cash" value={cle} onChange={setCle} options={PERIODES.map(({ key, label }) => ({ key, label }))} />
      </PageHero>

      {isError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-out-line bg-out-dim p-4 text-sm text-out-text">
          <IconAlertCircle size={20} aria-hidden className="shrink-0" />
          <span className="flex-1">Impossible de charger les ventes. Vérifiez la connexion puis réessayez.</span>
          <Button size="sm" variant="flat" onPress={() => void refetch()} isLoading={isFetching}>
            Réessayer
          </Button>
        </div>
      )}

      {isLoading && (
        <div role="status" aria-live="polite" className="space-y-3">
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Spinner size="sm" /> Lecture des ventes des {jours} derniers jours…
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-surface" />
            ))}
          </div>
        </div>
      )}

      {analyse && data && analyse.indicateurs.ventes === 0 && (
        <EmptyRiver message="Aucune vente sur cette période" hint="Choisissez une période plus longue, ou enregistrez des ventes pour lancer l'analyse." />
      )}

      {analyse && data && analyse.indicateurs.ventes > 0 && (
        <>
          {data.tronque && (
            <p role="status" className="rounded-lg border border-return-line bg-return-dim p-3 text-sm text-return-text">
              Beaucoup de ventes sur cette période : l&apos;analyse porte sur les {data.sorties.length.toLocaleString("fr-FR")} plus récentes
              sur {data.total.toLocaleString("fr-FR")}.
            </p>
          )}
          {analyse.sansLignes && (
            <p role="status" className="rounded-lg border border-return-line bg-return-dim p-3 text-sm text-return-text">
              Le détail des articles n&apos;est pas fourni par le serveur : le classement des produits n&apos;est pas disponible.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-5">
            <StatTile tone="cash" icon={IconShoppingBag} label="Ventes" value={<CountUp value={analyse.indicateurs.ventes} />} hint={`${jours} derniers jours`} />
            <StatTile
              tone="in"
              icon={IconCoin}
              label="Chiffre d'affaires"
              value={<CurrencyDisplay montant={String(analyse.indicateurs.ca)} size="md" className="font-display text-lg font-extrabold" />}
              delay={0.04}
            />
            <StatTile
              tone="accent"
              icon={IconReceipt2}
              label="Panier moyen"
              value={<CurrencyDisplay montant={String(analyse.indicateurs.panierMoyen)} size="md" className="font-display text-lg font-extrabold" />}
              hint={`${analyse.indicateurs.articlesParVente.toFixed(1)} article(s) par vente`}
              delay={0.08}
            />
            <StatTile tone="return" icon={IconCalendarStar} label="Meilleur jour" value={meilleurJour?.label ?? "—"} hint={meilleurJour ? `${Math.round(meilleurJour.part * 100)} % du CA` : undefined} delay={0.12} />
            <StatTile
              tone="accent"
              icon={IconClockHour4}
              label="Heure de pointe"
              value={analyse.pic ? `${heureLabel(analyse.pic.debut)} – ${heureLabel(analyse.pic.fin)}` : "—"}
              hint={analyse.pic ? `${Math.round(analyse.pic.part * 100)} % des ventes` : undefined}
              delay={0.16}
            />
          </div>

          <Section titre="Conseils pour optimiser" description="Chaque conseil s'appuie sur un chiffre de la période et propose un geste concret.">
            <AnalyseConseils conseils={analyse.conseils} />
          </Section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section titre="Chiffre d'affaires par jour de la semaine" description="Le jour le plus fort est en pleine couleur.">
              <AnalyseJoursChart jours={analyse.jours} />
            </Section>
            <Section titre="Ventes par heure de la journée" description="La fenêtre de 2 heures la plus dense est en pleine couleur.">
              <AnalyseHeuresChart heures={analyse.heures} pic={analyse.pic} />
            </Section>
          </div>

          <Section titre="Carte de chaleur : quand vend-on le plus ?" description="Nombre de ventes pour chaque jour et chaque heure.">
            <AnalyseHeatmap matrice={analyse.matrice} />
          </Section>

          {!analyse.sansLignes && (
            <Section titre="Produits les plus vendus" description="Classés par chiffre d'affaires. La tendance compare la seconde moitié de la période à la première.">
              <AnalyseProduitsPhares produits={analyse.produits} />
            </Section>
          )}
        </>
      )}
    </PageWrapper>
  );
}
