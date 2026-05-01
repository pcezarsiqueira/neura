import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { DIMENSIONS } from "@/data/dimensions";
import { storage, type DiagnosticRecord } from "@/lib/storage";

type Record = DiagnosticRecord;

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    if (!authed) return;
    storage.list().then(setRecords).catch((e) => console.error("storage.list failed", e));
  }, [authed]);

  async function clearAll() {
    if (!confirm("Tem certeza que deseja apagar TODOS os diagnósticos?")) return;
    if (!confirm("Confirmação final — esta ação é irreversível. Continuar?")) return;
    try { await storage.clear(); } catch (e) { console.error(e); }
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
      <div className="min-h-screen text-foreground flex items-center justify-center px-5">
        <div className="max-w-sm w-full surface-card-strong p-8">
          <h1 className="font-display text-2xl" style={{ fontWeight: 700 }}>
            Admin · <span className="italic-display text-cyan-gradient">NEURA</span>
          </h1>
          <p className="text-secondary-fg text-sm mt-2 font-light">Acesso restrito.</p>
          <input type="password" placeholder="Senha"
            value={pwd} onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && pwd === "neura2026") setAuthed(true); }}
            className="w-full mt-6 px-4 py-3 text-sm" />
          <button onClick={() => pwd === "neura2026" && setAuthed(true)} className="btn-primary w-full mt-4">
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <Header showCta={false} />
      <div className="pt-24 pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="section-label">Painel</span>
              <h1 className="font-display text-3xl mt-3" style={{ fontWeight: 700 }}>
                <span className="italic-display text-cyan-gradient">Diagnósticos</span>
              </h1>
              <p className="text-secondary-fg text-sm mt-1 font-light">{records.length} registros</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportCsv} className="btn-ghost text-[10px]">Exportar CSV</button>
              <button onClick={clearAll}
                className="text-[10px] uppercase tracking-[0.12em] font-medium border px-4 py-2 transition-colors"
                style={{ color: "#C084FC", borderColor: "#C084FC" }}>
                Limpar tudo
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b" style={{ borderColor: "rgba(0,201,200,0.28)", color: "rgba(248,246,242,0.55)" }}>
                  <th className="py-3 px-2 uppercase-label">Data</th>
                  <th className="py-3 px-2 uppercase-label">Nome</th>
                  <th className="py-3 px-2 uppercase-label">Cargo</th>
                  <th className="py-3 px-2 uppercase-label">Empresa</th>
                  <th className="py-3 px-2 uppercase-label">Setor</th>
                  <th className="py-3 px-2 uppercase-label">Colab.</th>
                  {DIMENSIONS.map((d) => (
                    <th key={d.key} className="py-3 px-2 text-right uppercase-label">{d.name.split(" ")[0].slice(0, 6)}</th>
                  ))}
                  <th className="py-3 px-2 uppercase-label">Mais fraca</th>
                  <th className="py-3 px-2 text-right uppercase-label" style={{ color: "#00C9C8" }}>Geral</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const dimMap = Object.fromEntries(r.scores.map((s) => [s.key, s.percent]));
                  const weakest = [...r.scores].sort((a, b) => a.percent - b.percent)[0]?.name ?? "";
                  return (
                    <tr key={r.id} className="border-b font-light" style={{ borderColor: "rgba(0,201,200,0.13)" }}>
                      <td className="py-3 px-2 text-secondary-fg">{new Date(r.ts).toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-2">{r.org.nome}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.cargo}</td>
                      <td className="py-3 px-2">{r.org.empresa}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.setor}</td>
                      <td className="py-3 px-2 text-secondary-fg">{r.org.colaboradores}</td>
                      {DIMENSIONS.map((d) => {
                        const p = dimMap[d.key] ?? 0;
                        const c = p >= 70 ? "#00C9C8" : p >= 40 ? "#D4A843" : "#C084FC";
                        return <td key={d.key} className="py-3 px-2 text-right font-bebas text-sm" style={{ color: c }}>{p}</td>;
                      })}
                      <td className="py-3 px-2" style={{ color: "#C084FC" }}>{weakest}</td>
                      <td className="py-3 px-2 text-right font-bebas text-base" style={{ color: "#00C9C8" }}>{r.overallPercent}%</td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr><td colSpan={20} className="py-12 text-center text-secondary-fg font-light">Nenhum diagnóstico ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
