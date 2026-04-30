import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { GearBackground } from "@/components/GearBackground";

export const Route = createFileRoute("/proposta")({
  component: Proposta,
});

const COLAB = ["Até 100", "100 a 500", "500 a 2000", "Acima de 2000"];

function ImersaoCard({ badge, title, dur, items }: { badge: string; title: string; dur: string; items: string[] }) {
  return (
    <div className="surface-card-strong p-6 flex flex-col">
      <span className="badge-cyan">{badge}</span>
      <h3 className="font-display text-xl mt-4 italic-display text-cyan-gradient" style={{ fontWeight: 700 }}>{title}</h3>
      <p className="uppercase-label mt-2" style={{ color: "rgba(248,246,242,0.55)" }}>{dur}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm font-light flex gap-2">
            <span className="text-primary mt-1">›</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Proposta() {
  const [f, setF] = useState({ nome: "", empresa: "", cargo: "", whatsapp: "", colaboradores: "", contexto: "" });
  const valid = f.nome && f.empresa && f.cargo && f.whatsapp && f.colaboradores;

  function submit() {
    if (!valid) return;
    const msg = encodeURIComponent(
      `Olá Paulinho, gostaria de solicitar proposta para o NEURA Corporativo. Empresa: ${f.empresa} · Cargo: ${f.cargo} · Colaboradores: ${f.colaboradores} · Contexto: ${f.contexto}`
    );
    window.open(`https://wa.me/5511920926873?text=${msg}`, "_blank");
  }

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <GearBackground className="fixed inset-0 -z-10 pointer-events-none" primaryOpacity={0.06} secondaryOpacity={0.04} />
      <Header />
      <div className="pt-28 pb-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto fade-in">
          <span className="section-label">NEURA Corporativo · Proposta</span>
          <h1 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]" style={{ fontWeight: 700 }}>
            Comunicação que vira <span className="italic-display text-cyan-gradient">comportamento</span>.
          </h1>
          <p className="text-secondary-fg mt-4 max-w-2xl font-light">
            Programa de 3 imersões mensais para organizações que precisam que o aprendizado
            gere resultado mensurável.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <ImersaoCard badge="Imersão 1" title="Como decisões realmente acontecem"
              dur="8 horas · Presencial ou híbrido"
              items={[
                "Como o cérebro processa informação e toma decisões",
                "A diferença entre comunicar e influenciar",
                "Fundamentos neurológicos do comportamento organizacional",
                "Diagnóstico do padrão de comunicação da equipe",
              ]} />
            <ImersaoCard badge="Imersão 2" title="Comunicação que gera ação"
              dur="8 horas · Presencial ou híbrido"
              items={[
                "Como dar instruções que são seguidas",
                "Feedback que muda comportamento de forma duradoura",
                "Reuniões que terminam em ação concreta",
                "Gestão de resistência e engajamento genuíno",
              ]} />
            <ImersaoCard badge="Imersão 3" title="Resultado que se sustenta"
              dur="8 horas · Presencial ou híbrido"
              items={[
                "KPIs de comportamento — como definir e medir",
                "Cultura de comunicação instalada",
                "Multiplicadores internos — liderança como facilitadora",
                "Plano de sustentação pós-programa",
              ]} />
          </div>

          {/* diferenciais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              ["Não é motivacional", "Foco em comportamento mensurável, não em inspiração temporária"],
              ["Não é genérico", "Calibrado para os gaps identificados no seu diagnóstico"],
              ["Não é certificado vazio", "É mudança comportamental com KPI definido"],
            ].map(([t, d]) => (
              <div key={t} className="surface-card p-5">
                <p className="font-display text-lg" style={{ fontWeight: 700 }}>{t}</p>
                <p className="text-sm text-secondary-fg mt-2 font-light">{d}</p>
              </div>
            ))}
          </div>

          {/* NR-1 */}
          <div className="mt-12 surface-card p-6" style={{ borderColor: "rgba(212,168,67,0.4)" }}>
            <span className="section-label" style={{ color: "#D4A843" }}>⚙ NR-1 · Contexto Regulatório</span>
            <p className="mt-4 text-sm leading-relaxed font-light">
              O programa NEURA trabalha os fatores psicossociais previstos na NR-1 — comunicação
              disfuncional, sobrecarga, falta de clareza de papel e baixo suporte organizacional.
              Não somos consultores de conformidade regulatória, mas nosso programa endereça
              naturalmente as dimensões comportamentais que a norma coloca como responsabilidade
              do empregador.
            </p>
          </div>

          {/* form */}
          <div className="mt-16 max-w-xl mx-auto surface-card-strong p-8">
            <h2 className="font-display text-2xl" style={{ fontWeight: 700 }}>
              Solicitar <span className="italic-display text-cyan-gradient">proposta personalizada</span>
            </h2>
            <div className="mt-6 space-y-4">
              {[
                ["Nome", "nome"], ["Empresa", "empresa"], ["Cargo", "cargo"], ["WhatsApp", "whatsapp"],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="block uppercase-label mb-2">{label}</span>
                  <input className="w-full px-4 py-3 text-sm" value={(f as any)[key]}
                    onChange={(e) => setF({ ...f, [key]: e.target.value })} />
                </label>
              ))}
              <div>
                <span className="block uppercase-label mb-2">Colaboradores</span>
                <div className="grid grid-cols-2 gap-2">
                  {COLAB.map((c) => (
                    <button key={c} type="button" onClick={() => setF({ ...f, colaboradores: c })}
                      className="px-3 py-2.5 text-sm border text-left transition-colors font-light"
                      style={{
                        borderColor: f.colaboradores === c ? "var(--color-primary)" : "rgba(0,201,200,0.28)",
                        background: f.colaboradores === c ? "rgba(0,201,200,0.10)" : "rgba(13,29,53,0.6)",
                        color: f.colaboradores === c ? "var(--color-primary)" : undefined,
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="block uppercase-label mb-2">Contexto</span>
                <textarea rows={3} placeholder="Descreva brevemente o desafio que motivou este diagnóstico"
                  className="w-full px-4 py-3 text-sm" value={f.contexto}
                  onChange={(e) => setF({ ...f, contexto: e.target.value })} />
              </label>
              <button onClick={submit} disabled={!valid} className="btn-primary w-full">
                Enviar solicitação →
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t px-5 py-6 text-center uppercase-label mt-12" style={{ borderColor: "rgba(0,201,200,0.13)", color: "rgba(248,246,242,0.45)" }}>
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}
