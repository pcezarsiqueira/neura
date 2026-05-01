import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { GearBackground } from "@/components/GearBackground";
import { useDiagnostic, type OrgData } from "@/state/diagnosticContext";
import { storage } from "@/lib/storage";

const COLAB = ["Até 100", "100 a 500", "500 a 2000", "Acima de 2000"];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block uppercase-label mb-2">{label}</span>
      {children}
    </label>
  );
}

function FormDados({ initial, onSubmit }: { initial: OrgData; onSubmit: (data: OrgData) => void }) {
  const [local, setLocal] = useState<OrgData>(initial);

  const valid =
    local.nome && local.cargo && local.empresa && local.setor &&
    local.colaboradores && local.whatsapp.replace(/\D/g, "").length >= 10 &&
    /\S+@\S+\.\S+/.test(local.email) && local.consent;

  return (
    <div className="mt-10 space-y-5 surface-card p-6 md:p-8">
      <Field label="Nome completo *">
        <input className="w-full px-4 py-3 text-sm" value={local.nome}
          onChange={(e) => setLocal({ ...local, nome: e.target.value })} />
      </Field>
      <Field label="Cargo *">
        <input className="w-full px-4 py-3 text-sm" placeholder="ex: Diretor de RH, CEO, Gerente de T&D"
          value={local.cargo} onChange={(e) => setLocal({ ...local, cargo: e.target.value })} />
      </Field>
      <Field label="Empresa *">
        <input className="w-full px-4 py-3 text-sm" value={local.empresa}
          onChange={(e) => setLocal({ ...local, empresa: e.target.value })} />
      </Field>
      <Field label="Setor de atuação *">
        <input className="w-full px-4 py-3 text-sm" placeholder="ex: Indústria, Financeiro, Saúde, Varejo"
          value={local.setor} onChange={(e) => setLocal({ ...local, setor: e.target.value })} />
      </Field>
      <Field label="Número aproximado de colaboradores *">
        <div className="grid grid-cols-2 gap-2">
          {COLAB.map((c) => {
            const sel = local.colaboradores === c;
            return (
              <button key={c} type="button" onClick={() => setLocal({ ...local, colaboradores: c })}
                className={`px-3 py-3 text-sm border transition-colors text-left font-light ${
                  sel ? "border-primary text-primary" : "hover:border-primary/60"
                }`}
                style={{
                  borderColor: sel ? "var(--color-primary)" : "rgba(0,201,200,0.28)",
                  background: sel ? "rgba(0,201,200,0.10)" : "rgba(13,29,53,0.6)",
                }}>
                {c}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="WhatsApp *">
        <input className="w-full px-4 py-3 text-sm" placeholder="(11) 99999-9999"
          value={local.whatsapp}
          onChange={(e) => setLocal({ ...local, whatsapp: maskPhone(e.target.value) })} />
      </Field>
      <Field label="E-mail corporativo *">
        <input type="email" className="w-full px-4 py-3 text-sm" value={local.email}
          onChange={(e) => setLocal({ ...local, email: e.target.value })} />
      </Field>

      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input type="checkbox" checked={local.consent}
          onChange={(e) => setLocal({ ...local, consent: e.target.checked })}
          className="mt-1 w-4 h-4 accent-[#00C9C8]" />
        <span className="text-xs text-secondary-fg leading-snug font-light">
          Autorizo Paulinho Siqueira a me contatar pelo WhatsApp com análise personalizada desta organização.
        </span>
      </label>

      <button
        onClick={() => valid && onSubmit(local)}
        disabled={!valid}
        className="btn-primary w-full mt-2"
      >
        Gerar diagnóstico →
      </button>
    </div>
  );
}

function Dados() {
  const nav = useNavigate();
  const { org, setOrg, answers, scores, overallPercent } = useDiagnostic();

  async function handleSubmit(data: OrgData) {
    setOrg(data);
    try {
      await storage.save({ org: data, answers, scores, overallPercent, ts: Date.now() });
    } catch (e) { console.error("storage.save failed", e); }
    nav({ to: "/resultado" });
  }

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <GearBackground className="fixed inset-0 -z-10 pointer-events-none" primaryOpacity={0.07} secondaryOpacity={0.05} />
      <Header />
      <div className="pt-28 pb-20 px-5 sm:px-8">
        <div className="max-w-xl mx-auto fade-in">
          <span className="section-label">Etapa final</span>
          <h1 className="font-display text-4xl md:text-5xl mt-4" style={{ fontWeight: 700 }}>
            Quase <span className="italic-display text-cyan-gradient">lá.</span>
          </h1>
          <p className="text-secondary-fg mt-3 font-light">
            Preencha os dados para gerar o relatório da sua organização.
          </p>

          <FormDados initial={org} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
