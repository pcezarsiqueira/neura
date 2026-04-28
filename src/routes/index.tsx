import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { DIMENSIONS } from "@/data/dimensions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diagnóstico NEURA Corporativo · Comunicação que vira comportamento" },
      { name: "description", content: "Diagnóstico corporativo gratuito em 9 dimensões. 45 perguntas. ~12 minutos. Relatório individual." },
    ],
  }),
  component: Landing,
});

function StatCard({ big, text }: { big: string; text: string }) {
  return (
    <div className="bg-card border-l-orange p-5 flex flex-col gap-2">
      <span className="font-display font-extrabold text-primary text-3xl md:text-4xl">{big}</span>
      <span className="text-sm text-secondary-fg leading-snug">{text}</span>
    </div>
  );
}

function Landing() {
  const central = DIMENSIONS.find((d) => d.key === "transformacao")!;
  const others = DIMENSIONS.filter((d) => d.key !== "transformacao");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-5 sm:px-8 pt-24 pb-16">
        <div className="max-w-4xl w-full text-center">
          <span className="inline-block font-mono text-[11px] tracking-[0.2em] text-primary border border-primary/40 px-3 py-1.5">
            DIAGNÓSTICO CORPORATIVO · GRATUITO
          </span>

          <h1 className="font-display font-extrabold mt-8 leading-[0.95]" style={{ fontSize: "clamp(36px,6vw,72px)" }}>
            Seu treinamento informa.<br />
            <span className="text-primary">O NEURA transforma.</span>
          </h1>

          <p className="mt-6 mx-auto text-secondary-fg font-light text-base md:text-lg leading-relaxed" style={{ maxWidth: 560 }}>
            Descubra em quais dimensões sua organização está perdendo performance por gaps
            de comunicação e comportamento — e o que fazer sobre isso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">
            <StatCard big="70%" text="dos treinamentos corporativos não geram mudança real de comportamento" />
            <StatCard big="1 em 4" text="líderes consegue comunicar de forma que sua equipe realmente age" />
            <StatCard big="NR-1" text="classifica comunicação disfuncional como risco psicossocial obrigatório de gestão" />
          </div>

          <div className="mt-12">
            <Link
              to="/diagnostico"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-base md:text-lg px-8 py-4 hover:bg-[oklch(0.74_0.18_45)] transition-colors"
            >
              Iniciar diagnóstico gratuito →
            </Link>
            <p className="mt-4 font-mono text-[10px] text-secondary-fg tracking-wider">
              9 DIMENSÕES · 45 PERGUNTAS · RELATÓRIO INDIVIDUAL · ~12 MINUTOS
            </p>
          </div>
        </div>
      </section>

      {/* DIMENSÕES */}
      <section className="px-5 sm:px-8 py-24 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[11px] tracking-[0.2em] text-primary text-center">O QUE O DIAGNÓSTICO AVALIA</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-center mt-3 leading-tight">
            As 9 dimensões do<br className="hidden md:block" /> sistema organizacional
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {others.slice(0, 4).map((d) => (
              <DimCard key={d.key} d={d} />
            ))}
            <div className="md:col-span-1 bg-card p-6 border-l-orange-thick relative overflow-hidden">
              <div className="font-mono text-2xl text-primary mb-3">{central.icon}</div>
              <h3 className="font-display font-extrabold text-xl text-primary">{central.name}</h3>
              <p className="text-sm text-secondary-fg mt-2 leading-snug">{central.short}</p>
              <p className="absolute right-3 bottom-3 font-mono text-[9px] text-primary/60 tracking-widest">CENTRAL</p>
            </div>
            {others.slice(4).map((d) => (
              <DimCard key={d.key} d={d} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/diagnostico" className="inline-flex bg-primary text-primary-foreground font-display font-bold px-8 py-4 hover:bg-[oklch(0.74_0.18_45)] transition-colors">
              Iniciar diagnóstico →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-6 text-center font-mono text-[10px] text-secondary-fg">
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}

function DimCard({ d }: { d: typeof DIMENSIONS[number] }) {
  return (
    <div className="bg-card p-6 border-l-orange hover:bg-orange-soft transition-colors">
      <div className="font-mono text-xl text-primary mb-3">{d.icon}</div>
      <h3 className="font-display font-bold text-lg">{d.name}</h3>
      <p className="text-sm text-secondary-fg mt-2 leading-snug">{d.short}</p>
    </div>
  );
}
