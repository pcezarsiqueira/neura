import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { GearBackground } from "@/components/GearBackground";
import { DIMENSIONS, TOTAL_QUESTIONS } from "@/data/dimensions";
import { useDiagnostic } from "@/state/diagnosticContext";

export const Route = createFileRoute("/diagnostico")({
  component: Diagnostico,
});

type Step = { dim: number; q: number; transition?: boolean };

function Diagnostico() {
  const nav = useNavigate();
  const { setAnswer, answers } = useDiagnostic();
  const [step, setStep] = useState<Step>({ dim: 0, q: 0 });
  const [animKey, setAnimKey] = useState(0);

  const dim = DIMENSIONS[step.dim];
  const question = dim.questions[step.q];

  const overallIndex = useMemo(() => {
    let n = 0;
    for (let i = 0; i < step.dim; i++) n += DIMENSIONS[i].questions.length;
    return n + step.q;
  }, [step]);

  const progress = (overallIndex / TOTAL_QUESTIONS) * 100;

  function advance() {
    const isLastQ = step.q === dim.questions.length - 1;
    const isLastDim = step.dim === DIMENSIONS.length - 1;
    if (isLastQ && isLastDim) { nav({ to: "/dados" }); return; }
    if (isLastQ) { setStep({ dim: step.dim, q: step.q, transition: true }); return; }
    setStep({ dim: step.dim, q: step.q + 1 });
    setAnimKey((k) => k + 1);
  }

  function goNextDim() { setStep({ dim: step.dim + 1, q: 0 }); setAnimKey((k) => k + 1); }

  function goBack() {
    if (step.transition) { setStep({ dim: step.dim, q: step.q }); return; }
    if (step.q === 0 && step.dim === 0) return;
    if (step.q === 0) {
      const prev = DIMENSIONS[step.dim - 1];
      setStep({ dim: step.dim - 1, q: prev.questions.length - 1 });
    } else { setStep({ dim: step.dim, q: step.q - 1 }); }
    setAnimKey((k) => k + 1);
  }

  function pick(score: number) { setAnswer(question.id, score); setTimeout(advance, 380); }

  const selected = answers[question.id];

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      <GearBackground className="fixed inset-0 -z-10 pointer-events-none" primaryOpacity={0.06} secondaryOpacity={0.04} />
      <Header />

      {/* progress */}
      <div className="fixed top-16 inset-x-0 z-40 border-b" style={{ background: "rgba(11,22,41,0.85)", backdropFilter: "blur(10px)", borderColor: "rgba(0,201,200,0.13)" }}>
        <div className="max-w-4xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between uppercase-label mb-2" style={{ color: "rgba(248,246,242,0.55)" }}>
            <span>Dimensão {step.dim + 1} de 9 · {dim.name}</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 overflow-hidden" style={{ background: "rgba(0,201,200,0.1)" }}>
            <div className="h-full bg-cyan-gold-gradient transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="pt-40 pb-20 px-5 sm:px-8 flex-1 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <button
            onClick={goBack}
            className="uppercase-label hover:text-primary mb-8 transition-colors"
            style={{ color: "rgba(248,246,242,0.55)" }}
            disabled={step.dim === 0 && step.q === 0 && !step.transition}
          >
            ← Voltar
          </button>

          {step.transition ? (
            <TransitionScreen key={`t-${step.dim}`} nextDim={DIMENSIONS[step.dim + 1]} onNext={goNextDim} />
          ) : (
            <div key={animKey} className="slide-in-right">
              <span className="section-label">{dim.name} · P{step.q + 1} de {dim.questions.length}</span>
              <h2
                className="font-display text-center leading-tight mt-6 mb-10"
                style={{ fontSize: "clamp(20px,3.2vw,30px)", fontWeight: 700 }}
              >
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isSel = selected === opt.score;
                  return (
                    <button
                      key={idx}
                      onClick={() => pick(opt.score)}
                      className={`w-full text-left px-5 py-4 transition-all flex items-center justify-between gap-4 surface-card ${
                        isSel ? "border-primary glow-cyan" : "hover:border-primary/50"
                      }`}
                      style={isSel ? { background: "rgba(0,201,200,0.10)" } : undefined}
                    >
                      <span className="text-sm font-light">{opt.text}</span>
                      {isSel && <span className="text-primary font-bebas text-lg">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransitionScreen({ nextDim, onNext }: { nextDim: typeof DIMENSIONS[number]; onNext: () => void }) {
  return (
    <div className="text-center fade-in py-12">
      <span className="section-label justify-center">Próxima Dimensão</span>
      <div className="font-bebas text-6xl text-primary mt-8">{nextDim.icon}</div>
      <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ fontWeight: 700 }}>
        <span className="italic-display text-cyan-gradient">{nextDim.name}</span>
      </h2>
      <p className="text-secondary-fg mt-3 max-w-md mx-auto font-light">{nextDim.short}</p>
      <button onClick={onNext} className="btn-primary mt-10 inline-flex">Próxima dimensão →</button>
    </div>
  );
}
