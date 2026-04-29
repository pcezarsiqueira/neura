// Driver padrão — armazena os diagnósticos no localStorage do navegador.
// Não requer backend. Usado por padrão.

import type { DiagnosticRecord, NewDiagnostic, StorageDriver } from "./types";

const PREFIX = "neura_corp_";

export const localStorageDriver: StorageDriver = {
  name: "localStorage",

  async save(input: NewDiagnostic) {
    const id = `${PREFIX}${Date.now()}`;
    const record: DiagnosticRecord = { id, ...input };
    try {
      localStorage.setItem(id, JSON.stringify(record));
    } catch {}
    return record;
  },

  async list() {
    const list: DiagnosticRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        try {
          const v = JSON.parse(localStorage.getItem(k)!);
          // Compatibilidade com registros antigos que não tinham `id`
          list.push({ id: k, ...v });
        } catch {}
      }
    }
    return list.sort((a, b) => b.ts - a.ts);
  },

  async remove(id: string) {
    localStorage.removeItem(id);
  },

  async clear() {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  },
};
