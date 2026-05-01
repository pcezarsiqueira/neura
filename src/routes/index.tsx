import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { GearBackground } from "@/components/GearBackground";
import { DIMENSIONS } from "@/data/dimensions";

function StatCard({ big, text }: { big: string; text: string }) {
  return (
    <div className="surface-card p-6 flex flex-col gap-2">
      <span className="font-bebas text-cyan-gradient text-4xl md:text-5xl leading-none">{big}</span>
      <span className="text-sm text-secondary-fg leading-snug font-light">{text}</span>
    </div>
  );
}

function Landing() {
  const central = DIMENSIONS.find((d) => d.key === "transformacao")!;
  const others = DIMENSIONS.filter((d) => d.key !== "transformacao");

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 pt-24 pb-16">
        <GearBackground className="absolute inset-0 -z-10 pointer-events-none" primaryOpacity={0.10} secondaryOpacity={0.07} />
        <div className="max-w-4xl w-full text-center relative">
          <span className="section-label justify-center">DIAGNÓSTICO CORPORATIVO · GRATUITO</span>

          <h1 className="font-display mt-8 leading-[0.98]" style={{ fontSize: "clamp(40px,6.5vw,82px)", fontWeight: 700 }}>
            Eficácia organizacional<br />
            <span className="italic-display text-cyan-gradient">não se ensina.</span>{" "}
            <span className="text-foreground">Se calibra.</span>
          </h1>

          <p className="mt-6 mx-auto text-secondary-fg font-light text-base md:text-lg leading-relaxed" style={{ maxWidth: 600 }}>
            9 dimensões de eficácia organizacional para equipes e empresas.
            Identifique gaps de comunicação e comportamento que comprometem performance — e o que fazer sobre isso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left">
            <StatCard big="70%" text="dos treinamentos corporativos não geram mudança real de comportamento" />
            <StatCard big="1/4" text="líderes consegue comunicar de forma que sua equipe realmente age" />
            <StatCard big="NR-1" text="classifica comunicação disfuncional como risco psicossocial obrigatório" />
          </div>

          <div className="mt-14">
            <Link to="/diagnostico" className="btn-primary inline-flex items-center gap-2">
              Iniciar diagnóstico →
            </Link>
            <p className="mt-5 uppercase-label text-secondary-fg" style={{ color: "rgba(248,246,242,0.45)" }}>
              9 Dimensões · 45 Perguntas · Relatório Individual · ~12 min
            </p>
          </div>
        </div>
      </section>

      <div className="divider-cyan max-w-6xl mx-auto" />

      {/* DIMENSÕES */}
      <section className="px-5 sm:px-8 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center"><span className="section-label">O QUE O DIAGNÓSTICO AVALIA</span></div>
          <h2 className="font-display text-3xl md:text-5xl text-center mt-4 leading-tight" style={{ fontWeight: 700 }}>
            As <span className="italic-display text-cyan-gradient">9 dimensões</span><br className="hidden md:block" />
            do sistema organizacional
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
            {others.slice(0, 4).map((d) => <DimCard key={d.key} d={d} />)}
            <div className="surface-card-strong p-6 relative overflow-hidden glow-cyan">
              <div className="font-bebas text-3xl text-primary mb-2">{central.icon}</div>
              <h3 className="font-display text-xl text-primary italic-display" style={{ fontWeight: 700 }}>{central.name}</h3>
              <p className="text-sm text-secondary-fg mt-2 leading-snug font-light">{central.short}</p>
              <span className="absolute right-3 bottom-3 uppercase-label" style={{ color: "rgba(212,168,67,0.9)" }}>CENTRAL</span>
            </div>
            {others.slice(4).map((d) => <DimCard key={d.key} d={d} />)}
          </div>

          <div className="text-center mt-16">
            <Link to="/diagnostico" className="btn-primary inline-flex">Iniciar diagnóstico →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t px-5 py-6 text-center uppercase-label text-secondary-fg" style={{ borderColor: "rgba(0,201,200,0.13)", color: "rgba(248,246,242,0.45)" }}>
        NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente · wa.me/5511920926873
      </footer>
    </div>
  );
}

function DimCard({ d }: { d: typeof DIMENSIONS[number] }) {
  return (
    <div className="surface-card p-6 transition-all hover:border-primary/40 hover:-translate-y-0.5">
      <div className="font-bebas text-2xl text-primary mb-2">{d.icon}</div>
      <h3 className="font-display text-lg" style={{ fontWeight: 700 }}>{d.name}</h3>
      <p className="text-sm text-secondary-fg mt-2 leading-snug font-light">{d.short}</p>
    </div>
  );
}

export default Landing;
