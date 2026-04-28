import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { GearChart } from "@/components/GearChart";
import { useDiagnostic } from "@/state/diagnosticContext";
import { DIMENSIONS } from "@/data/dimensions";
import { generatePdf } from "@/lib/pdf";

export const Route = createFileRoute("/resultado")({
  component: Resultado,
});

function statusFor(p: number) {
  if (p >= 75) return { color: "green", title: "Sistema com boa base — gaps pontuais para calibrar" };
  if (p >= 45) return { color: "orange", title: "Sistema em transição — gaps críticos comprometendo resultado" };
  return { color: "red", title: "Sistema com gaps estruturais — intervenção necessária" };
}

function barColor(p: number) {
  if (p >= 70) return "var(--color-success)";
  if (p >= 40) return "var(--color-primary)";
  return "var(--color-destructive)";
}

function Resultado() {
  const nav = useNavigate();
  const { org, scores, overallPercent, answers } = useDiagnostic();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!org.empresa) nav({ to: "/" });
  }, [org.empresa, nav]);

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

  function downloadPdf() {
    generatePdf({ org, scores, overallPercent, answers });
  }

  if (!org.empresa) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div ref={reportRef} className="pt-28 pb-16 px-5 sm:px-8 fade-in">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest text-primary">
            {org.cargo} · {org.empresa}
          </p>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mt-3 leading-tight text-white">
            Diagnóstico Organizacional
          </h1>
          <p className="font-display font-bold text-sm md:text-base mt-3 text-secondary-fg">
            Respondido por {org.nome} em {dataResposta}
          </p>

          {/* status card */}
          <div className={`mt-8 bg-card p-6 ${
            status.color === "green" ? "border-l-green" :
            status.color === "orange" ? "border-l-orange" : "border-l-red"
          }`}>
            <div className="flex items-baseline justify-between flex-wrap gap-3">
              <span className="font-mono text-[10px] tracking-widest text-secondary-fg">SCORE GERAL</span>
              <span className="font-display font-extrabold text-5xl"
                style={{ color: status.color === "green" ? "var(--color-success)" :
                  status.color === "red" ? "var(--color-destructive)" : "var(--color-primary)" }}>
                {overallPercent}%
              </span>
            </div>
            <p className="mt-3 font-display font-bold text-lg md:text-xl">{status.title}</p>
          </div>

          {/* GEAR */}
          <section className="mt-14">
            <p className="font-mono text-[11px] tracking-widest text-primary text-center">SISTEMA ORGANIZACIONAL</p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-center mt-2">
              A engrenagem da sua organização
            </h2>
            <div className="mt-8 flex justify-center">
              <GearChart scores={scores} size={420} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-8 text-xs font-mono">
              {scores.map((s) => (
                <div key={s.key} className="flex justify-between border-b border-[var(--border-strong)] py-1.5">
                  <span className="text-secondary-fg">{s.icon} {s.name}</span>
                  <span style={{ color: barColor(s.percent) }}>{s.percent}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* BARS */}
          <section className="mt-16">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl">Diagnóstico por dimensão</h2>
            <p className="text-secondary-fg text-sm mt-2">Ordenado dos gaps mais críticos para os mais consolidados.</p>
            <div className="mt-6 space-y-3">
              {sortedAsc.map((s) => (
                <div key={s.key} className="bg-card p-4 border-l-orange">
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="text-foreground">{s.icon} {s.name}</span>
                    <span style={{ color: barColor(s.percent) }}>{s.raw}/20 · {s.percent}%</span>
                  </div>
                  <div className="h-2 bg-background overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${s.percent}%`, backgroundColor: barColor(s.percent) }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NR-1 */}
          {nr1Triggers.length > 0 && (
            <section className="mt-12 bg-orange-soft border-l-orange p-6">
              <p className="font-mono text-[11px] tracking-widest text-primary">⚙ ATENÇÃO · NR-1</p>
              <p className="mt-3 text-sm leading-relaxed">
                A NR-1 classifica fatores como comunicação disfuncional, sobrecarga e falta de
                clareza de papel como riscos psicossociais de gestão obrigatória. Os gaps
                identificados nas dimensões{" "}
                <span className="text-primary font-semibold">
                  {nr1Triggers.map((t) => t.name).join(", ")}
                </span>{" "}
                estão diretamente relacionados a esses fatores. O NEURA trabalha exatamente essas dimensões.
              </p>
              <p className="mt-4 font-mono text-[10px] text-secondary-fg">
                Esta informação é de contexto regulatório — não constitui avaliação de conformidade com a NR-1.
              </p>
            </section>
          )}

          {/* MAPA DO CAMINHO */}
          <section className="mt-16">
            <p className="font-mono text-[11px] tracking-widest text-primary">MAPA</p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl mt-2">O caminho de calibração</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
              <Marco border="red" icon="⚙" tag="ESTADO ATUAL" title="Onde você está"
                text={`Gaps prioritários: ${weakest?.name} e ${second?.name}.`} />
              <Marco border="orange" icon="⚡" tag="PONTO DE VIRADA" title="Diagnóstico aprofundado"
                text="20 minutos. Mapeamento técnico dos gargalos. 3 ações concretas." />
              <Marco border="orange" icon="◎" tag="IMERSÃO 1" title="NEUROBASE"
                text="Como o cérebro processa decisões. Base neurológica da comunicação." />
              <Marco border="orange" icon="≋" tag="IMERSÃO 2" title="NEUROLIDERANÇA"
                text="Comunicação que gera ação. Feedback transformador. Reuniões produtivas." />
              <Marco border="green" icon="✦" tag="IMERSÃO 3" title="NEUROMERCADO"
                text="Resultado mensurável. Cultura instalada. KPIs de comportamento."
                badge="⚙ Fatores psicossociais NR-1 naturalmente endereçados" />
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 bg-card border border-primary p-8 md:p-10 text-center">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl">
              O próximo passo para {org.empresa}
            </h2>
            <p className="mt-4 text-secondary-fg max-w-xl mx-auto">
              Uma conversa técnica de 20 minutos com Paulinho Siqueira. Você descreve o
              contexto da organização, recebe o mapeamento dos gargalos prioritários e sai com
              3 ações concretas — sem custo.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <a href={waLink} target="_blank" rel="noreferrer"
                 className="inline-flex bg-primary text-primary-foreground font-display font-bold px-8 py-4 hover:bg-[oklch(0.74_0.18_45)] transition-colors">
                Agendar conversa →
              </a>
              <Link to="/proposta" className="font-mono text-xs text-primary border border-primary px-6 py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors">
                Ver proposta comercial →
              </Link>
              <button onClick={downloadPdf} className="font-mono text-[11px] text-secondary-fg hover:text-primary transition-colors mt-2">
                Baixar relatório em PDF
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-border px-5 py-6 text-center font-mono text-[10px] text-secondary-fg">
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}

function Marco({ border, icon, tag, title, text, badge }: {
  border: "red" | "orange" | "green"; icon: string; tag: string; title: string; text: string; badge?: string;
}) {
  const cls = border === "red" ? "border-l-red" : border === "green" ? "border-l-green" : "border-l-orange";
  return (
    <div className={`bg-card p-4 ${cls} flex flex-col`}>
      <div className="font-mono text-2xl text-primary">{icon}</div>
      <p className="font-mono text-[10px] tracking-widest text-secondary-fg mt-2">{tag}</p>
      <p className="font-display font-bold text-base mt-1">{title}</p>
      <p className="text-xs text-secondary-fg mt-2 leading-snug">{text}</p>
      {badge && <p className="font-mono text-[9px] text-success mt-3 leading-snug">{badge}</p>}
    </div>
  );
}
