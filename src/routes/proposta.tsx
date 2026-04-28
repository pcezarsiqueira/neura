import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/proposta")({
  component: Proposta,
});

const COLAB = ["Até 100", "100 a 500", "500 a 2000", "Acima de 2000"];

function ImersaoCard({ badge, title, dur, items }: { badge: string; title: string; dur: string; items: string[] }) {
  return (
    <div className="bg-card border border-primary p-6 flex flex-col">
      <span className="font-mono text-[10px] tracking-widest text-primary">{badge}</span>
      <h3 className="font-display font-extrabold text-xl mt-3">{title}</h3>
      <p className="font-mono text-[11px] text-secondary-fg mt-2">{dur}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/90 flex gap-2">
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-28 pb-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto fade-in">
          <span className="inline-block font-mono text-[11px] tracking-widest text-primary border border-primary/40 px-3 py-1.5">
            NEURA CORPORATIVO · PROPOSTA
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl mt-6 leading-[0.95]">
            Comunicação que vira <span className="text-primary">comportamento</span>.
          </h1>
          <p className="text-secondary-fg mt-4 max-w-2xl">
            Programa de 3 imersões mensais para organizações que precisam que o aprendizado
            gere resultado mensurável.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <ImersaoCard badge="IMERSÃO 1" title="Como decisões realmente acontecem"
              dur="8 horas · Presencial ou híbrido"
              items={[
                "Como o cérebro processa informação e toma decisões",
                "A diferença entre comunicar e influenciar",
                "Fundamentos neurológicos do comportamento organizacional",
                "Diagnóstico do padrão de comunicação da equipe",
              ]} />
            <ImersaoCard badge="IMERSÃO 2" title="Comunicação que gera ação"
              dur="8 horas · Presencial ou híbrido"
              items={[
                "Como dar instruções que são seguidas",
                "Feedback que muda comportamento de forma duradoura",
                "Reuniões que terminam em ação concreta",
                "Gestão de resistência e engajamento genuíno",
              ]} />
            <ImersaoCard badge="IMERSÃO 3" title="Resultado que se sustenta"
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
              <div key={t} className="bg-card p-5 border-l-orange">
                <p className="font-display font-extrabold text-lg">{t}</p>
                <p className="text-sm text-secondary-fg mt-2">{d}</p>
              </div>
            ))}
          </div>

          {/* NR-1 */}
          <div className="mt-12 bg-orange-soft border-l-orange p-6">
            <p className="font-mono text-[11px] tracking-widest text-primary">⚙ NR-1 · CONTEXTO REGULATÓRIO</p>
            <p className="mt-3 text-sm leading-relaxed">
              O programa NEURA trabalha os fatores psicossociais previstos na NR-1 — comunicação
              disfuncional, sobrecarga, falta de clareza de papel e baixo suporte organizacional.
              Não somos consultores de conformidade regulatória, mas nosso programa endereça
              naturalmente as dimensões comportamentais que a norma coloca como responsabilidade
              do empregador.
            </p>
          </div>

          {/* form */}
          <div className="mt-16 max-w-xl mx-auto bg-card p-8 border border-primary">
            <h2 className="font-display font-extrabold text-2xl">Solicitar proposta personalizada</h2>
            <div className="mt-6 space-y-4">
              {[
                ["Nome", "nome"], ["Empresa", "empresa"], ["Cargo", "cargo"], ["WhatsApp", "whatsapp"],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="block font-mono text-[10px] tracking-wider text-secondary-fg mb-2">{label.toUpperCase()}</span>
                  <input className="w-full px-4 py-3 text-sm" value={(f as any)[key]}
                    onChange={(e) => setF({ ...f, [key]: e.target.value })} />
                </label>
              ))}
              <div>
                <span className="block font-mono text-[10px] tracking-wider text-secondary-fg mb-2">COLABORADORES</span>
                <div className="grid grid-cols-2 gap-2">
                  {COLAB.map((c) => (
                    <button key={c} type="button" onClick={() => setF({ ...f, colaboradores: c })}
                      className={`px-3 py-2.5 text-sm border text-left transition-colors ${
                        f.colaboradores === c ? "border-primary bg-orange-medium" : "border-[var(--border-strong)] hover:border-primary"
                      }`}>{c}</button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="block font-mono text-[10px] tracking-wider text-secondary-fg mb-2">CONTEXTO</span>
                <textarea rows={3} placeholder="Descreva brevemente o desafio que motivou este diagnóstico"
                  className="w-full px-4 py-3 text-sm" value={f.contexto}
                  onChange={(e) => setF({ ...f, contexto: e.target.value })} />
              </label>
              <button onClick={submit} disabled={!valid}
                className={`w-full font-display font-bold py-4 transition-colors ${
                  valid ? "bg-primary text-primary-foreground hover:bg-[oklch(0.74_0.18_45)]" : "bg-[#222] text-secondary-fg cursor-not-allowed"
                }`}>
                Enviar solicitação →
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-5 py-6 text-center font-mono text-[10px] text-secondary-fg mt-12">
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}
