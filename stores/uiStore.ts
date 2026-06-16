import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Taille } from "@/types";

type SortiePeriode = "7j" | "30j" | "90j";
type FeedDensity = "compact" | "cozy";

type RapportGroupBy = "jour" | "semaine" | "mois";

interface UiState {
  produitPanelId: string | null;
  stockFiltre: {
    categorieId?: string;
    taille?: Taille;
    alerte?: boolean;
  };
  sortiePeriode: SortiePeriode;
  feedDensity: FeedDensity;
  rapportPeriode: {
    debut: string;
    fin: string;
    groupBy: RapportGroupBy;
  };
  setProduitPanelId: (id: string | null) => void;
  setStockFiltre: (filtre: UiState["stockFiltre"]) => void;
  setSortiePeriode: (periode: SortiePeriode) => void;
  setFeedDensity: (density: FeedDensity) => void;
  setRapportPeriode: (periode: UiState["rapportPeriode"]) => void;
}

const now = new Date();
const start = new Date(now);
start.setDate(now.getDate() - 30);

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
  produitPanelId: null,
  stockFiltre: {},
  sortiePeriode: "30j",
  feedDensity: "cozy",
  rapportPeriode: {
    debut: start.toISOString(),
    fin: now.toISOString(),
    groupBy: "jour",
  },
  setProduitPanelId: (id) => set({ produitPanelId: id }),
    setStockFiltre: (filtre) => set({ stockFiltre: filtre }),
    setSortiePeriode: (periode) => set({ sortiePeriode: periode }),
    setFeedDensity: (feedDensity) => set({ feedDensity }),
    setRapportPeriode: (periode) => set({ rapportPeriode: periode }),
  }),
  {
    name: "ui-store",
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({ feedDensity: state.feedDensity }),
  }
));
