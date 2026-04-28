import jsPDF from "jspdf";
import { DIMENSIONS } from "@/data/dimensions";
import type { OrgData, DimensionScore, Answers } from "@/state/diagnosticContext";

const ORANGE: [number, number, number] = [255, 102, 0];
const DARK: [number, number, number] = [10, 10, 10];
const TEXT: [number, number, number] = [51, 51, 51];
const SUB: [number, number, number] = [119, 119, 119];

function statusFor(p: number) {
  if (p >= 75) return "Sistema com boa base — gaps pontuais";
  if (p >= 45) return "Sistema em transição — gaps críticos";
  return "Sistema com gaps estruturais";
}

function interpret(percent: number) {
  if (percent >= 75) return "Dimensão consolidada. Manter calibração e monitoramento.";
  if (percent >= 45) return "Dimensão em transição. Há gaps que comprometem o resultado e exigem intervenção dirigida.";
  return "Dimensão crítica. Falha estrutural que afeta toda a engrenagem organizacional.";
}

export function generatePdf({
  org, scores, overallPercent, answers,
}: { org: OrgData; scores: DimensionScore[]; overallPercent: number; answers: Answers }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;

  function footer() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SUB);
    doc.text("Diagnóstico NEURA Corporativo · Paulinho Siqueira — Engenheiro da Mente", W / 2, H - 24, { align: "center" });
  }

  // PAGE 1 — capa
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(...ORANGE);
  doc.rect(M, M, 30, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.setFontSize(34);
  doc.text("NEURA", M, M + 40);
  doc.setFontSize(10);
  doc.setTextColor(...SUB);
  doc.setFont("helvetica", "normal");
  doc.text("Diagnóstico Corporativo", M, M + 58);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(org.empresa, M, 220);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT);
  doc.text(`${org.nome} · ${org.cargo}`, M, 245);
  doc.text(`Setor: ${org.setor} · Colaboradores: ${org.colaboradores}`, M, 263);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, M, 281);

  // big score
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(M, 340, M + 30, 340);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(64);
  doc.setTextColor(...ORANGE);
  doc.text(`${overallPercent}%`, M, 410);
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "normal");
  doc.text(statusFor(overallPercent), M, 432);

  doc.setFontSize(10);
  doc.setTextColor(...SUB);
  doc.text("Elaborado por Paulinho Siqueira — Engenheiro da Mente", M, H - 70);
  doc.text("wa.me/5511920926873", M, H - 56);
  footer();

  // PAGE 2 — tabela de scores
  doc.addPage();
  doc.setFillColor(...ORANGE);
  doc.rect(M, M, 30, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.text("Scores por dimensão", M, M + 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SUB);
  doc.text("Ordenado dos gaps mais críticos para os mais consolidados.", M, M + 58);

  let y = M + 90;
  const sorted = [...scores].sort((a, b) => a.percent - b.percent);
  sorted.forEach((s) => {
    doc.setDrawColor(230);
    doc.line(M, y + 22, W - M, y + 22);
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text(s.name, M, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT);
    doc.text(`${s.raw}/20`, W - M - 60, y + 8, { align: "left" });
    doc.setTextColor(...ORANGE);
    doc.setFont("helvetica", "bold");
    doc.text(`${s.percent}%`, W - M, y + 8, { align: "right" });
    // bar
    doc.setFillColor(240, 240, 240);
    doc.rect(M, y + 12, W - 2 * M, 4, "F");
    doc.setFillColor(...ORANGE);
    doc.rect(M, y + 12, (W - 2 * M) * (s.percent / 100), 4, "F");
    y += 32;
  });
  footer();

  // PAGES 3+ — análise por dimensão
  DIMENSIONS.forEach((d) => {
    doc.addPage();
    const sc = scores.find((x) => x.key === d.key)!;
    doc.setFillColor(...ORANGE);
    doc.rect(M, M, 30, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text(d.name, M, M + 38);

    doc.setFontSize(11);
    doc.setTextColor(...ORANGE);
    doc.text(`${sc.percent}% — ${sc.raw}/20`, M, M + 56);
    doc.setTextColor(...SUB);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    const interp = doc.splitTextToSize(interpret(sc.percent), W - 2 * M);
    doc.text(interp, M, M + 74);

    let yy = M + 110;
    d.questions.forEach((q, i) => {
      const ans = answers[q.id];
      const opt = q.options.find((o) => o.score === ans);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...ORANGE);
      doc.text(`P${i + 1}`, M, yy);
      doc.setTextColor(...DARK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const qLines = doc.splitTextToSize(q.text, W - 2 * M - 24);
      doc.text(qLines, M + 24, yy);
      yy += qLines.length * 12 + 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT);
      doc.setFontSize(9);
      const aText = opt ? `→ ${opt.text} (${opt.score}/4)` : "→ Sem resposta";
      const aLines = doc.splitTextToSize(aText, W - 2 * M - 24);
      doc.text(aLines, M + 24, yy);
      yy += aLines.length * 11 + 14;
      if (yy > H - 80) { footer(); doc.addPage(); yy = M; }
    });
    footer();
  });

  // PAGE — próximo passo
  doc.addPage();
  doc.setFillColor(...ORANGE);
  doc.rect(M, M, 30, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text(`O próximo passo para ${org.empresa}`, M, M + 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...TEXT);
  const weakest = sorted[0];
  const txt = `Conversa técnica de 20 minutos com Paulinho Siqueira. O foco será o gap prioritário identificado: ${weakest?.name} (${weakest?.percent}%). Você sai com 3 ações concretas — sem custo.`;
  doc.text(doc.splitTextToSize(txt, W - 2 * M), M, M + 70);

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Contato", M, M + 160);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...TEXT);
  doc.text("Paulinho Siqueira — Engenheiro da Mente", M, M + 180);
  doc.text("WhatsApp: wa.me/5511920926873", M, M + 198);
  footer();

  doc.save(`Diagnostico_NEURA_${org.empresa.replace(/\s+/g, "_")}.pdf`);
}
