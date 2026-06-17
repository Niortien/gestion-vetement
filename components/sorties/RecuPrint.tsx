"use client";

import { useEffect } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ModePaiement } from "@/types";
import { formatDateFr } from "@/lib/dateUtils";

export interface RecuLigne {
  produitNom: string;
  taille: string;
  couleur: string;
  quantite: number;
  prixUnitaire: string;
  sousTotal: string;
}

const MODE_LABELS: Record<ModePaiement, string> = {
  CASH: "Espèces",
  WAVE: "Wave",
  ORANGE_MONEY: "Orange Money",
  CARTE: "Carte bancaire",
  MTN_MONEY: "MTN Money",
};

interface RecuPrintProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  date: string;
  lignes: RecuLigne[];
  totalMontant: string;
  modePaiement: ModePaiement;
  transactionReference?: string;
}

export function RecuPrint({
  isOpen,
  onClose,
  reference,
  date,
  lignes,
  totalMontant,
  modePaiement,
  transactionReference,
}: RecuPrintProps) {
  // Sync reçu DOM hors modal pour @media print
  useEffect(() => {
    const el = document.getElementById("recu-print-root");
    if (!el) return;
    el.style.display = isOpen ? "block" : "none";
  }, [isOpen]);

  return (
    <>
      {/* Zone d'impression — hors modal, visible uniquement @media print */}
      <div
        id="recu-print-root"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 4 }}>RIVIERE</div>
          <div style={{ fontSize: 10 }}>Streetwear · Stock & Caisse</div>
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        <div style={{ fontSize: 10 }}>
          <div>Date : {formatDateFr(date)}</div>
          <div>Réf  : {reference}</div>
          {transactionReference && <div>Pmt  : {transactionReference}</div>}
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        {lignes.map((l, i) => (
          <div key={i} style={{ fontSize: 10, marginBottom: 3 }}>
            <div>{l.produitNom}</div>
            <div style={{ paddingLeft: 8 }}>
              {l.taille} · {l.couleur}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 8 }}>
              <span>{l.quantite} × {Number(l.prixUnitaire).toLocaleString("fr-FR")} FCFA</span>
              <span>{Number(l.sousTotal).toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 13 }}>
          <span>TOTAL</span>
          <span>{Number(totalMontant).toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div style={{ fontSize: 10, marginTop: 4 }}>Mode : {MODE_LABELS[modePaiement]}</div>
        <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }} />
        <div style={{ textAlign: "center", fontSize: 10 }}>
          Merci pour votre achat !
        </div>
      </div>

      {/* Modal visuelle */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        classNames={{
          wrapper: "z-[1000]",
          backdrop: "z-[950]",
          base: "bg-[var(--color-surface)] border border-border",
          header: "border-b border-border/60",
          footer: "border-t border-border/60",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-base font-semibold">Reçu client</ModalHeader>
          <ModalBody>
            {/* Aperçu reçu */}
            <div className="rounded-lg border border-border/60 bg-white p-4 text-black">
              <div className="mb-2 text-center">
                <p className="text-base font-bold tracking-[0.25em]">RIVIERE</p>
                <p className="text-[10px] text-gray-500">Streetwear · Stock & Caisse</p>
              </div>
              <div className="my-2 border-t border-dashed border-gray-300" />
              <div className="space-y-0.5 text-[10px] text-gray-700">
                <p>Date : {formatDateFr(date)}</p>
                <p>Réf : {reference}</p>
                {transactionReference && <p>Pmt : {transactionReference}</p>}
              </div>
              <div className="my-2 border-t border-dashed border-gray-300" />
              {lignes.map((l, i) => (
                <div key={i} className="mb-2 text-[10px]">
                  <p className="font-medium text-black">{l.produitNom}</p>
                  <p className="pl-2 text-gray-500">{l.taille} · {l.couleur}</p>
                  <div className="flex justify-between pl-2">
                    <span>{l.quantite} × {Number(l.prixUnitaire).toLocaleString("fr-FR")} FCFA</span>
                    <span className="font-medium">{Number(l.sousTotal).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              ))}
              <div className="my-2 border-t border-dashed border-gray-300" />
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{Number(totalMontant).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <p className="mt-1 text-[10px] text-gray-500">Mode : {MODE_LABELS[modePaiement]}</p>
              <div className="my-2 border-t border-dashed border-gray-300" />
              <p className="text-center text-[10px] text-gray-500">Merci pour votre achat !</p>
            </div>
          </ModalBody>
          <ModalFooter className="gap-3">
            <Button variant="flat" className="flex-1 text-text-muted" onPress={onClose}>
              Fermer
            </Button>
            <Button
              className="flex-1 bg-accent font-semibold text-black"
              onPress={() => window.print()}
            >
              🖨 Imprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
