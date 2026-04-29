// Tipos compartilhados pela camada de storage.
// Qualquer driver (localStorage, MySQL, Postgres, Supabase…) deve implementar
// a interface `StorageDriver` abaixo.

import type { Answers, DimensionScore, OrgData } from "@/state/diagnosticContext";

export type DiagnosticRecord = {
  /** Identificador único do registro (string para suportar localStorage e SQL). */
  id: string;
  /** Timestamp em ms (Date.now()). */
  ts: number;
  org: OrgData;
  answers: Answers;
  scores: DimensionScore[];
  overallPercent: number;
};

export type NewDiagnostic = Omit<DiagnosticRecord, "id">;

export interface StorageDriver {
  /** Nome do driver, apenas para debug. */
  name: string;
  /** Persiste um novo diagnóstico e retorna o registro com id gerado. */
  save(input: NewDiagnostic): Promise<DiagnosticRecord>;
  /** Lista todos os registros (mais recentes primeiro). */
  list(): Promise<DiagnosticRecord[]>;
  /** Remove um registro específico. */
  remove(id: string): Promise<void>;
  /** Remove todos os registros. */
  clear(): Promise<void>;
}
