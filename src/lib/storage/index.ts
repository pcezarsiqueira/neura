// =====================================================================
// CONFIGURAÇÃO DO STORAGE — TROQUE O BANCO DE DADOS AQUI
// =====================================================================
//
// Para alternar entre localStorage (padrão) e um backend MySQL/Postgres/etc,
// basta mudar a constante STORAGE_DRIVER abaixo (ou definir as variáveis de
// ambiente VITE_STORAGE_DRIVER e VITE_API_BASE_URL no arquivo .env).
//
// Exemplos:
//   .env:
//     VITE_STORAGE_DRIVER=http
//     VITE_API_BASE_URL=https://api.seuvps.com
//     VITE_API_KEY=segredo-opcional
//
// Para usar OUTRO banco (Postgres, SQLite, MongoDB, Supabase…) basta criar
// um novo driver implementando a interface `StorageDriver` (ver ./types.ts)
// e registrá-lo no switch abaixo. Nenhuma outra parte do app precisa mudar.
// =====================================================================

import { localStorageDriver } from "./localStorageDriver";
import { createHttpDriver } from "./httpDriver";
import type { StorageDriver } from "./types";

type DriverName = "local" | "http";

const env = (import.meta as any).env ?? {};

const DRIVER: DriverName = (env.VITE_STORAGE_DRIVER as DriverName) || "local";
const API_BASE_URL: string = env.VITE_API_BASE_URL || "/api";
const API_KEY: string | undefined = env.VITE_API_KEY;

function build(): StorageDriver {
  switch (DRIVER) {
    case "http":
      return createHttpDriver({ baseUrl: API_BASE_URL, apiKey: API_KEY });
    case "local":
    default:
      return localStorageDriver;
  }
}

export const storage: StorageDriver = build();
export type { DiagnosticRecord, NewDiagnostic, StorageDriver } from "./types";
