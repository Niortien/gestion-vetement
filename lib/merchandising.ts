/** Durée pendant laquelle une pièce est « nouvelle » : même règle partout sur la vitrine. */
const NOUVEAU_JOURS = 14;

/** « Nouveau » ne se déclare qu'à partir de la vraie date d'ajout : jamais un libellé décoratif. */
export function isNouveau(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < NOUVEAU_JOURS * 86_400_000;
}
