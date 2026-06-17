export interface WhatsappOrderLine {
  produitNom: string;
  couleur: string;
  taille: string;
  quantite: number;
  prix: number;
}

export interface WhatsappOrder {
  lignes: WhatsappOrderLine[];
  clientNom: string;
  clientTel: string;
  livraison: "boutique" | "livraison";
  adresse?: string;
  notes?: string;
}

export function buildWhatsappMessage(order: WhatsappOrder): string {
  const sep = "─".repeat(25);

  const items = order.lignes
    .map(
      (l) =>
        `📦 *${l.produitNom}*\n   Couleur : ${l.couleur} | Taille : ${l.taille} | Qté : ${l.quantite}\n   Prix : ${(l.quantite * l.prix).toLocaleString("fr-FR")} FCFA`
    )
    .join("\n\n");

  const total = order.lignes.reduce((sum, l) => sum + l.quantite * l.prix, 0);

  const livraisonStr =
    order.livraison === "boutique"
      ? "Retrait en boutique"
      : `Livraison à domicile\n   Adresse : ${order.adresse ?? "À préciser"}`;

  const notesStr = order.notes ? `\n💬 *NOTES*\n${order.notes}` : "";

  return [
    `🛒 *COMMANDE RIVIERE*`,
    sep,
    ``,
    items,
    ``,
    sep,
    `💰 *TOTAL : ${total.toLocaleString("fr-FR")} FCFA*`,
    sep,
    ``,
    `👤 *CLIENT*`,
    `Nom : ${order.clientNom}`,
    `Tél : ${order.clientTel}`,
    ``,
    `📍 *LIVRAISON*`,
    `Mode : ${livraisonStr}`,
    notesStr,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function getWhatsappUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "221770000000";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
