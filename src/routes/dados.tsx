import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { useDiagnostic } from "@/state/diagnosticContext";

export const Route = createFileRoute("/dados")({
  component: Dados,
});

const COLAB = ["Até 100", "100 a 500", "500 a 2000", "Acima de 2000"];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function Dados() {
  const nav = useNavigate();
  const { org, setOrg, answers, scores, overallPercent } = useDiagnostic();
  const [local, setLocal] = useState(org);

  const valid =
    local.nome && local.cargo && local.empresa && local.setor &&
    local.colaboradores && local.whatsapp.replace(/\D/g, "").length >= 10 &&
    /\S+@\S+\.\S+/.test(local.email) && local.consent;

  function submit() {
    if (!valid) return;
    setOrg(local);
    try {
      localStorage.setItem(
        `neura_corp_${Date.now()}`,
        JSON.stringify({ org: local, answers, scores, overallPercent, ts: Date.now() })
      );
    } catch {}
    nav({ to: "/resultado" });
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-wider text-secondary-fg mb-2">{label}</span>
      {children}
    </label>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-28 pb-20 px-5 sm:px-8">
        <div className="max-w-xl mx-auto fade-in">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl">Quase lá.</h1>
          <p className="text-secondary-fg mt-3">
            Preencha os dados para gerar o relatório da sua organização.
          </p>

          <div className="mt-10 space-y-5">
            <Field label="NOME COMPLETO *">
              <input className="w-full px-4 py-3 text-sm" value={local.nome}
                onChange={(e) => setLocal({ ...local, nome: e.target.value })} />
            </Field>
            <Field label="CARGO *">
              <input className="w-full px-4 py-3 text-sm" placeholder="ex: Diretor de RH, CEO, Gerente de T&D"
                value={local.cargo} onChange={(e) => setLocal({ ...local, cargo: e.target.value })} />
            </Field>
            <Field label="EMPRESA *">
              <input className="w-full px-4 py-3 text-sm" value={local.empresa}
                onChange={(e) => setLocal({ ...local, empresa: e.target.value })} />
            </Field>
            <Field label="SETOR DE ATUAÇÃO *">
              <input className="w-full px-4 py-3 text-sm" placeholder="ex: Indústria, Financeiro, Saúde, Varejo"
                value={local.setor} onChange={(e) => setLocal({ ...local, setor: e.target.value })} />
            </Field>
            <Field label="NÚMERO APROXIMADO DE COLABORADORES *">
              <div className="grid grid-cols-2 gap-2">
                {COLAB.map((c) => {
                  const sel = local.colaboradores === c;
                  return (
                    <button key={c} type="button" onClick={() => setLocal({ ...local, colaboradores: c })}
                      className={`px-3 py-3 text-sm border transition-colors text-left ${
                        sel ? "border-primary bg-orange-medium" : "border-[var(--border-strong)] hover:border-primary"
                      }`}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="WHATSAPP *">
              <input className="w-full px-4 py-3 text-sm" placeholder="(11) 99999-9999"
                value={local.whatsapp}
                onChange={(e) => setLocal({ ...local, whatsapp: maskPhone(e.target.value) })} />
            </Field>
            <Field label="E-MAIL CORPORATIVO *">
              <input type="email" className="w-full px-4 py-3 text-sm" value={local.email}
                onChange={(e) => setLocal({ ...local, email: e.target.value })} />
            </Field>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input type="checkbox" checked={local.consent}
                onChange={(e) => setLocal({ ...local, consent: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[#ff6600]" />
              <span className="text-xs text-secondary-fg leading-snug">
                Autorizo Paulinho Siqueira a me contatar pelo WhatsApp com análise personalizada desta organização.
              </span>
            </label>

            <button
              onClick={submit}
              disabled={!valid}
              className={`w-full font-display font-bold py-4 transition-colors ${
                valid ? "bg-primary text-primary-foreground hover:bg-[oklch(0.74_0.18_45)]"
                      : "bg-[#222] text-secondary-fg cursor-not-allowed"
              }`}
            >
              Gerar diagnóstico →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
