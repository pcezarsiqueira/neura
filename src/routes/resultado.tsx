import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { GearBackground } from "@/components/GearBackground";
import { GearChart } from "@/components/GearChart";
import { useDiagnostic } from "@/state/diagnosticContext";
import { generatePdf } from "@/lib/pdf";

function statusFor(p: number) {
  if (p >= 75) return { tone: "cyan", title: "Sistema com boa base — gaps pontuais para calibrar" };
  if (p >= 45) return { tone: "gold", title: "Sistema em transição — gaps críticos comprometendo resultado" };
  return { tone: "purple", title: "Sistema com gaps estruturais — intervenção necessária" };
}

function barColor(p: number) {
  if (p >= 70) return "#00C9C8";
  if (p >= 40) return "#D4A843";
  return "#C084FC";
}

function toneColor(t: string) {
  return t === "cyan" ? "#00C9C8" : t === "gold" ? "#D4A843" : "#C084FC";
}

function Resultado() {
  const nav = useNavigate();
  const { org, scores, overallPercent, answers } = useDiagnostic();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!org.empresa) nav("/"); }, [org.empresa, nav]);

  const status = statusFor(overallPercent);
  const sortedAsc = useMemo(() => [...scores].sort((a, b) => a.percent - b.percent), [scores]);
  const weakest = sortedAsc[0];
  const second = sortedAsc[1];

  const nr1Triggers = useMemo(() => {
    const keys = ["comunicacao", "cultura", "transferencia"];
    return scores.filter((s) => keys.includes(s.key) && s.percent < 50);
  }, [scores]);

  const waMsg = encodeURIComponent(
    `Olá Paulinho, fiz o Diagnóstico NEURA Corporativo. Sou ${org.nome}, ${org.cargo} da ${org.empresa}. Nosso maior gap está em ${weakest?.name} (${weakest?.percent}%). Quero agendar a conversa de 20 minutos.`
  );
  const waLink = `https://wa.me/5511920926873?text=${waMsg}`;

  const dataResposta = useMemo(
    () => new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    []
  );

  function downloadPdf() { generatePdf({ org, scores, overallPercent, answers }); }

  if (!org.empresa) return null;

  const statusColor = toneColor(status.tone);

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <GearBackground className="fixed inset-0 -z-10 pointer-events-none" primaryOpacity={0.05} secondaryOpacity={0.04} />
      <Header />

      <div ref={reportRef} className="pt-28 pb-16 px-5 sm:px-8 fade-in">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">{org.cargo} · {org.empresa}</span>
          <h1 className="font-display text-3xl md:text-5xl mt-4 leading-tight" style={{ fontWeight: 700 }}>
            Diagnóstico <span className="italic-display text-cyan-gradient">Organizacional</span>
          </h1>
          <p className="font-light text-sm md:text-base mt-3 text-secondary-fg">
            Respondido por {org.nome} em {dataResposta}
          </p>

          {/* score card */}
          <div className="mt-8 surface-card p-8 relative overflow-hidden" style={{ borderColor: statusColor + "55" }}>
            <div className="absolute top-0 left-0 h-full w-1" style={{ background: statusColor }} />
            <div className="flex items-baseline justify-between flex-wrap gap-3">
              <span className="uppercase-label" style={{ color: "rgba(248,246,242,0.55)" }}>Score Geral</span>
              <span className="font-bebas text-7xl leading-none" style={{ color: statusColor }}>
                {overallPercent}%
              </span>
            </div>
            <p className="mt-4 font-display text-lg md:text-xl italic-display" style={{ fontWeight: 500 }}>{status.title}</p>
          </div>

          {/* GEAR */}
          <section className="mt-16 relative">
            <div className="text-center"><span className="section-label">Sistema Organizacional</span></div>
            <h2 className="font-display text-2xl md:text-3xl text-center mt-3" style={{ fontWeight: 700 }}>
              A <span className="italic-display text-cyan-gradient">engrenagem</span> da sua organização
            </h2>
            <div className="mt-10 flex justify-center">
              <GearChart scores={scores} size={460} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-10 text-xs">
              {scores.map((s) => (
                <div key={s.key} className="flex justify-between border-b py-2" style={{ borderColor: "rgba(0,201,200,0.13)" }}>
                  <span className="text-secondary-fg font-light">{s.icon} {s.name}</span>
                  <span className="font-bebas text-base" style={{ color: barColor(s.percent) }}>{s.percent}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* BARS */}
          <section className="mt-20">
            <span className="section-label">Por Dimensão</span>
            <h2 className="font-display text-2xl md:text-3xl mt-3" style={{ fontWeight: 700 }}>
              Diagnóstico por <span className="italic-display text-cyan-gradient">dimensão</span>
            </h2>
            <p className="text-secondary-fg text-sm mt-2 font-light">Ordenado dos gaps mais críticos para os mais consolidados.</p>
            <div className="mt-8 space-y-3">
              {sortedAsc.map((s) => (
                <div key={s.key} className="surface-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground text-sm font-light">{s.icon} {s.name}</span>
                    <span className="font-bebas text-base" style={{ color: barColor(s.percent) }}>{s.raw}/20 · {s.percent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden" style={{ background: "rgba(0,201,200,0.1)" }}>
                    <div className="h-full transition-all"
                      style={{ width: `${s.percent}%`, background: `linear-gradient(90deg, ${barColor(s.percent)}, #D4A843)` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NR-1 */}
          {nr1Triggers.length > 0 && (
            <section className="mt-12 surface-card p-6" style={{ borderColor: "rgba(212,168,67,0.4)" }}>
              <span className="section-label" style={{ color: "#D4A843" }}>⚙ Atenção · NR-1</span>
              <p className="mt-4 text-sm leading-relaxed font-light">
                A NR-1 classifica fatores como comunicação disfuncional, sobrecarga e falta de clareza de papel como
                riscos psicossociais de gestão obrigatória. Os gaps identificados nas dimensões{" "}
                <span className="text-primary font-medium">{nr1Triggers.map((t) => t.name).join(", ")}</span>{" "}
                estão diretamente relacionados a esses fatores. O NEURA trabalha exatamente essas dimensões.
              </p>
              <p className="mt-4 uppercase-label" style={{ color: "rgba(248,246,242,0.45)" }}>
                Esta informação é de contexto regulatório — não constitui avaliação de conformidade com a NR-1.
              </p>
            </section>
          )}

          {/* MAPA */}
          <section className="mt-20">
            <span className="section-label">Mapa</span>
            <h2 className="font-display text-2xl md:text-3xl mt-3" style={{ fontWeight: 700 }}>
              O caminho de <span className="italic-display text-cyan-gradient">calibração</span>
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
              <Marco tone="purple" icon="⚙" tag="Estado Atual" title="Onde você está"
                text={`Gaps prioritários: ${weakest?.name} e ${second?.name}.`} />
              <Marco tone="gold" icon="⚡" tag="Ponto de Virada" title="Diagnóstico aprofundado"
                text="20 minutos. Mapeamento técnico dos gargalos. 3 ações concretas." />
              <Marco tone="cyan" icon="◎" tag="Imersão 1" title="NEUROBASE"
                text="Como o cérebro processa decisões. Base neurológica da comunicação." />
              <Marco tone="cyan" icon="≋" tag="Imersão 2" title="NEUROLIDERANÇA"
                text="Comunicação que gera ação. Feedback transformador. Reuniões produtivas." />
              <Marco tone="cyan" icon="✦" tag="Imersão 3" title="NEUROMERCADO"
                text="Resultado mensurável. Cultura instalada. KPIs de comportamento."
                badge="⚙ Fatores psicossociais NR-1 endereçados" />
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 surface-card-strong p-8 md:p-10 text-center glow-cyan">
            <h2 className="font-display text-2xl md:text-3xl" style={{ fontWeight: 700 }}>
              O próximo passo para <span className="italic-display text-cyan-gradient">{org.empresa}</span>
            </h2>
            <p className="mt-4 text-secondary-fg max-w-xl mx-auto font-light">
              Uma conversa técnica de 20 minutos com Paulinho Siqueira. Você descreve o
              contexto da organização, recebe o mapeamento dos gargalos prioritários e sai com
              3 ações concretas — sem custo.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
                Agendar conversa →
              </a>
              <Link to="/proposta" className="btn-ghost text-[10px]">Ver proposta comercial →</Link>
              <button onClick={downloadPdf} className="uppercase-label hover:text-primary transition-colors mt-1"
                style={{ color: "rgba(248,246,242,0.55)" }}>
                Baixar relatório em PDF
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t px-5 py-6 text-center uppercase-label" style={{ borderColor: "rgba(0,201,200,0.13)", color: "rgba(248,246,242,0.45)" }}>
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}

function Marco({ tone, icon, tag, title, text, badge }: {
  tone: "purple" | "gold" | "cyan"; icon: string; tag: string; title: string; text: string; badge?: string;
}) {
  const c = toneColor(tone);
  return (
    <div className="surface-card p-4 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-0.5" style={{ background: c }} />
      <div className="font-bebas text-2xl" style={{ color: c }}>{icon}</div>
      <p className="uppercase-label mt-2" style={{ color: "rgba(248,246,242,0.55)" }}>{tag}</p>
      <p className="font-display text-base mt-1" style={{ fontWeight: 700 }}>{title}</p>
      <p className="text-xs text-secondary-fg mt-2 leading-snug font-light">{text}</p>
      {badge && <p className="uppercase-label mt-3 leading-snug" style={{ color: "#00C9C8" }}>{badge}</p>}
    </div>
  );
}

export default Resultado;
