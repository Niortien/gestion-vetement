import { apiGet, apiPost } from "@/lib/api";
import type { ModePaiement, ResumeJour, Session, Transaction } from "@/types";

export interface SessionsListParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  modePaiement?: ModePaiement;
  dateDebut?: string;
  dateFin?: string;
}

export interface SessionTransactionsParams {
  sortOrder?: "asc" | "desc";
  modePaiement?: ModePaiement;
  dateDebut?: string;
  dateFin?: string;
}

export interface OuvrirSessionBody {
  montantOuverture: string;
}

export interface FermerSessionBody {
  montantFermeture: string;
}

export interface CreateTransactionBody {
  montant: string;
  modePaiement: ModePaiement;
  sortieId?: string;
  reference?: string;
  notes?: string;
}

// GET /caisse/sessions — liste toutes les sessions avec filtres
export const listSessions = (params?: SessionsListParams) =>
  apiGet<Session[]>("/caisse/sessions", params as Record<string, unknown> | undefined);

export const getActiveSession = () =>
  apiGet<Session | null>("/caisse/sessions/active");

export const ouvrirSession = (body: OuvrirSessionBody) =>
  apiPost<Session, OuvrirSessionBody>("/caisse/sessions/ouvrir", body);

export const fermerSession = (id: string, body: FermerSessionBody) =>
  apiPost<Session, FermerSessionBody>(`/caisse/sessions/${id}/fermer`, body);

// GET /caisse/sessions/:id/transactions — liste les transactions d'une session
export const listSessionTransactions = (sessionId: string, params?: SessionTransactionsParams) =>
  apiGet<Transaction[]>(`/caisse/sessions/${sessionId}/transactions`, params as Record<string, unknown> | undefined);

export const createTransaction = (body: CreateTransactionBody) =>
  apiPost<Transaction, CreateTransactionBody>("/caisse/transactions", body);

export const getResumeJour = () =>
  apiGet<ResumeJour>("/caisse/resume-jour");
