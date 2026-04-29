// Driver HTTP — converte chamadas de storage em requisições REST.
// Use este driver quando os diagnósticos forem persistidos no MySQL (ou qualquer
// outro banco) através de uma API HTTP rodando no seu VPS.
//
// Endpoints esperados na API:
//   POST   {baseUrl}/diagnostics          → cria  (body = NewDiagnostic, retorna DiagnosticRecord)
//   GET    {baseUrl}/diagnostics          → lista (retorna DiagnosticRecord[])
//   DELETE {baseUrl}/diagnostics/:id      → remove um
//   DELETE {baseUrl}/diagnostics          → remove todos
//
// Veja `db/schema.mysql.sql` para o schema do banco e
// `server-examples/mysql-api.example.js` para um servidor Express de referência.

import type { DiagnosticRecord, NewDiagnostic, StorageDriver } from "./types";

export function createHttpDriver(opts: { baseUrl: string; apiKey?: string }): StorageDriver {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.apiKey) headers["x-api-key"] = opts.apiKey;
  const url = (p = "") => `${opts.baseUrl.replace(/\/$/, "")}/diagnostics${p}`;

  return {
    name: "http",

    async save(input: NewDiagnostic) {
      const r = await fetch(url(), { method: "POST", headers, body: JSON.stringify(input) });
      if (!r.ok) throw new Error(`save failed: ${r.status}`);
      return (await r.json()) as DiagnosticRecord;
    },

    async list() {
      const r = await fetch(url(), { headers });
      if (!r.ok) throw new Error(`list failed: ${r.status}`);
      return (await r.json()) as DiagnosticRecord[];
    },

    async remove(id: string) {
      const r = await fetch(url(`/${encodeURIComponent(id)}`), { method: "DELETE", headers });
      if (!r.ok) throw new Error(`remove failed: ${r.status}`);
    },

    async clear() {
      const r = await fetch(url(), { method: "DELETE", headers });
      if (!r.ok) throw new Error(`clear failed: ${r.status}`);
    },
  };
}
