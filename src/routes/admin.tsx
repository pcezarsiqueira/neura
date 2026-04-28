import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { DIMENSIONS } from "@/data/dimensions";
import type { DimensionScore, OrgData, Answers } from "@/state/diagnosticContext";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

type Record = {
  key: string;
  ts: number;
  org: OrgData;
  scores: DimensionScore[];
  overallPercent: number;
  answers: Answers;
};

function loadAll(): Record[] {
  const list: Record[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("neura_corp_")) {
      try {
        const v = JSON.parse(localStorage.getItem(k)!);
        list.push({ key: k, ...v });
      } catch {}
    }
  }
  return list.sort((a, b) => b.ts - a.ts);
}

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => { if (authed) setRecords(loadAll()); }, [authed]);

  function clearAll() {
    if (!confirm("Tem certeza que deseja apagar TODOS os diagnósticos?")) return;
    if (!confirm("Confirmação final — esta ação é irreversível. Continuar?")) return;
    records.forEach((r) => localStorage.removeItem(r.key));
    setRecords([]);
  }

  function exportCsv() {
    const headers = [
      "data", "nome", "cargo", "empresa", "setor", "colaboradores", "whatsapp", "email",
      ...DIMENSIONS.map((d) => d.key),
      "dimensao_mais_fraca", "score_geral",
    ];
    const rows = records.map((r) => {
      const dimMap = Object.fromEntries(r.scores.map((s) => [s.key, s.percent]));
      const weakest = [...r.scores].sort((a, b) => a.percent - b.percent)[0]?.name ?? "";
      return [
        new Date(r.ts).toLocaleString("pt-BR"),
        r.org.nome, r.org.cargo, r.org.empresa, r.org.setor, r.org.colaboradores,
        r.org.whatsapp, r.org.email,
        ...DIMENSIONS.map((d) => dimMap[d.key] ?? ""),
        weakest, r.overallPercent,
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `neura_corp_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="max-w-sm w-full bg-card p-8 border-l-orange">
          <h1 className="font-display font-extrabold text-2xl">Admin · NEURA Corp</h1>
          <p className="text-secondary-fg text-sm mt-2">Acesso restrito.</p>
          <input type="password" placeholder="Senha"
            value={pwd} onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && pwd === "neura2026") setAuthed(true); }}
            className="w-full mt-6 px-4 py-3 text-sm" />
          <button onClick={() => pwd === "neura2026" && setAuthed(true)}
            className="w-full mt-4 bg-primary text-primary-foreground font-display font-bold py-3 hover:bg-[oklch(0.74_0.18_45)] transition-colors">
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showCta={false} />
      <div className="pt-24 pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl">Diagnósticos</h1>
              <p className="text-secondary-fg text-sm mt-1">{records.length} registros</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportCsv}
                className="font-mono text-xs text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                Exportar CSV
              </button>
              <button onClick={clearAll}
                className="font-mono text-xs text-danger border border-[var(--color-destructive)] px-4 py-2 hover:bg-[var(--color-destructive)] hover:text-white transition-colors">
                Limpar tudo
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-secondary-fg text-left border-b border-[var(--border-strong)]">
                  <th className="py-3 px-2">Data</th>
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Cargo</th>
                  <th className="py-3 px-2">Empresa</th>
                  <th className="py-3 px-2">Setor</th>
                  <th className="py-3 px-2">Colab.</th>
                  {DIMENSIONS.map((d) => (
                    <th key={d.key} className="py-3 px-2 text-right">{d.name.split(" ")[0].slice(0, 6)}</th>
                  ))}
                  <th className="py-3 px-2">Mais fraca</th>
                  <th className="py-3 px-2 text-right text-primary">Geral</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const dimMap = Object.fromEntries(r.scores.map((s) => [s.key, s.percent]));
                  const weakest = [...r.scores].sort((a, b) => a.percent - b.percent)[0]?.name ?? "";
                  return (
                    <tr key={r.key} className="border-b border-[var(--border-strong)]/50 hover:bg-card">
                      <td className="py-3 px-2 text-secondary-fg">{new Date(r.ts).toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-2">{r.org.nome}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.cargo}</td>
                      <td className="py-3 px-2 text-foreground">{r.org.empresa}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.setor}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.colaboradores}</td>
                      {DIMENSIONS.map((d) => {
                        const p = dimMap[d.key] ?? 0;
                        const c = p >= 70 ? "var(--color-success)" : p >= 40 ? "var(--color-primary)" : "var(--color-destructive)";
                        return <td key={d.key} className="py-3 px-2 text-right" style={{ color: c }}>{p}</td>;
                      })}
                      <td className="py-3 px-2 text-danger">{weakest}</td>
                      <td className="py-3 px-2 text-right text-primary font-bold">{r.overallPercent}%</td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr><td colSpan={20} className="py-12 text-center text-secondary-fg">Nenhum diagnóstico ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
