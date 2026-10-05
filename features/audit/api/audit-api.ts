import { apiGet } from "@/lib/api";

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  description: string | null;
  createdAt: string;
  user?: { id: string; email: string; role: string; boutiqueId: string | null } | null;
}

export interface AuditLogsParams {
  page?: number;
  limit?: number;
  /** Un ou plusieurs codes d'action séparés par des virgules. */
  action?: string;
  entityType?: string;
  userId?: string;
  search?: string;
  dateDebut?: string;
  dateFin?: string;
}

// GET /audit-logs (ADMIN) : journal des actions, du plus récent au plus ancien.
export const getAuditLogs = (params?: AuditLogsParams) =>
  apiGet<AuditLog[]>("/audit-logs", params as Record<string, unknown> | undefined);
