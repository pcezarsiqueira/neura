import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { DIMENSIONS } from "@/data/dimensions";

export type Answers = Record<string, number>; // questionId -> score (0..4)
export type OrgData = {
  nome: string;
  cargo: string;
  empresa: string;
  setor: string;
  colaboradores: string;
  whatsapp: string;
  email: string;
  consent: boolean;
};

export type DimensionScore = {
  key: string;
  name: string;
  icon: string;
  raw: number;       // 0..20
  percent: number;   // 0..100
};

type Ctx = {
  answers: Answers;
  setAnswer: (qid: string, score: number) => void;
  org: OrgData;
  setOrg: (o: OrgData) => void;
  reset: () => void;
  scores: DimensionScore[];
  overallPercent: number;
};

const DiagnosticContext = createContext<Ctx | null>(null);

const emptyOrg: OrgData = {
  nome: "", cargo: "", empresa: "", setor: "",
  colaboradores: "", whatsapp: "", email: "", consent: false,
};

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [org, setOrg] = useState<OrgData>(emptyOrg);

  const setAnswer = (qid: string, score: number) =>
    setAnswers((p) => ({ ...p, [qid]: score }));

  const reset = () => { setAnswers({}); setOrg(emptyOrg); };

  const { scores, overallPercent } = useMemo(() => {
    const scores: DimensionScore[] = DIMENSIONS.map((d) => {
      const raw = d.questions.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
      const max = d.questions.length * 4;
      return {
        key: d.key, name: d.name, icon: d.icon,
        raw, percent: Math.round((raw / max) * 100),
      };
    });
    const overallPercent = Math.round(
      scores.reduce((s, x) => s + x.percent, 0) / scores.length
    );
    return { scores, overallPercent };
  }, [answers]);

  return (
    <DiagnosticContext.Provider value={{ answers, setAnswer, org, setOrg, reset, scores, overallPercent }}>
      {children}
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const c = useContext(DiagnosticContext);
  if (!c) throw new Error("useDiagnostic outside provider");
  return c;
}
