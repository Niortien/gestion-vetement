export type LookbookPhotoStatut = "nouveau" | "vu" | "traite";

export interface LookbookPhoto {
  id: string;
  url: string;
  nom: string | null;
  telephone: string | null;
  message: string | null;
  statut: LookbookPhotoStatut;
  createdAt: string;
  updatedAt: string;
}
