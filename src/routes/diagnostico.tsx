import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
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

  const progress = ((overallIndex) / TOTAL_QUESTIONS) * 100;

  function advance() {
    const isLastQ = step.q === dim.questions.length - 1;
    const isLastDim = step.dim === DIMENSIONS.length - 1;
    if (isLastQ && isLastDim) {
      nav({ to: "/dados" });
      return;
    }
    if (isLastQ) {
      setStep({ dim: step.dim, q: step.q, transition: true });
      return;
    }
    setStep({ dim: step.dim, q: step.q + 1 });
    setAnimKey((k) => k + 1);
  }

  function goNextDim() {
    setStep({ dim: step.dim + 1, q: 0 });
    setAnimKey((k) => k + 1);
  }

  function goBack() {
    if (step.transition) { setStep({ dim: step.dim, q: step.q }); return; }
    if (step.q === 0 && step.dim === 0) return;
    if (step.q === 0) {
      const prev = DIMENSIONS[step.dim - 1];
      setStep({ dim: step.dim - 1, q: prev.questions.length - 1 });
    } else {
      setStep({ dim: step.dim, q: step.q - 1 });
    }
    setAnimKey((k) => k + 1);
  }

  function pick(score: number) {
    setAnswer(question.id, score);
    setTimeout(advance, 400);
  }

  const selected = answers[question.id];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* progress */}
      <div className="fixed top-16 inset-x-0 z-40 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-secondary-fg tracking-wider mb-2">
            <span>DIMENSÃO {step.dim + 1} DE 9 · {dim.name.toUpperCase()}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-card overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="pt-40 pb-20 px-5 sm:px-8 flex-1 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <button
            onClick={goBack}
            className="font-mono text-[11px] text-secondary-fg hover:text-primary mb-8 transition-colors"
            disabled={step.dim === 0 && step.q === 0 && !step.transition}
          >
            ← Voltar
          </button>

          {step.transition ? (
            <TransitionScreen
              key={`t-${step.dim}`}
              nextDim={DIMENSIONS[step.dim + 1]}
              onNext={goNextDim}
            />
          ) : (
            <div key={animKey} className="slide-in-right">
              <p className="font-mono text-[11px] text-primary tracking-widest mb-4">
                {dim.name.toUpperCase()} · P{step.q + 1} DE {dim.questions.length}
              </p>
              <h2
                className="font-display font-bold text-center leading-tight mb-10"
                style={{ fontSize: "clamp(18px,3vw,26px)" }}
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
                      className={`w-full text-left px-5 py-4 border transition-all flex items-center justify-between gap-4 ${
                        isSel
                          ? "border-primary bg-orange-medium"
                          : "border-[var(--border-strong)] hover:border-primary hover:bg-orange-soft"
                      }`}
                    >
                      <span className="text-sm">{opt.text}</span>
                      {isSel && <span className="text-primary font-mono">✓</span>}
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

function TransitionScreen({
  nextDim, onNext,
}: { nextDim: typeof DIMENSIONS[number]; onNext: () => void }) {
  return (
    <div className="text-center fade-in py-12">
      <p className="font-mono text-[11px] text-secondary-fg tracking-widest">PRÓXIMA DIMENSÃO</p>
      <div className="font-mono text-5xl text-primary mt-6">{nextDim.icon}</div>
      <h2 className="font-display font-extrabold text-3xl md:text-4xl mt-6">{nextDim.name}</h2>
      <p className="text-secondary-fg mt-3 max-w-md mx-auto">{nextDim.short}</p>
      <button
        onClick={onNext}
        className="mt-10 inline-flex bg-primary text-primary-foreground font-display font-bold px-8 py-3.5 hover:bg-[oklch(0.74_0.18_45)] transition-colors"
      >
        Próxima dimensão →
      </button>
    </div>
  );
}
