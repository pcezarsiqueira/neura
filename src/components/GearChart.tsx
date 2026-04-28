import { useEffect, useRef } from "react";
import type { DimensionScore } from "@/state/diagnosticContext";

function colorFor(percent: number) {
  if (percent >= 70) return "#3fcf8e";
  if (percent >= 40) return "#ff6600";
  return "#e05555";
}

export function GearChart({ scores, size = 380 }: { scores: DimensionScore[]; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr;
    c.height = size * dpr;
    c.style.width = `${size}px`;
    c.style.height = `${size}px`;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const baseR = size * 0.28;       // hub outer radius (tooth base)
    const maxToothLen = size * 0.16; // full tooth height at 100%

    // Outer 8 = all dimensions except "transformacao" (which is the hub)
    const outer = scores.filter((s) => s.key !== "transformacao");
    const hub = scores.find((s) => s.key === "transformacao");
    const teethCount = outer.length; // 8
    const angleStep = (Math.PI * 2) / teethCount;
    const toothAngle = angleStep * 0.6;   // 60% tooth, 40% gap
    const tipRatio = 0.6;                  // tip width = 60% of base width

    // base ring (subtle)
    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    ctx.stroke();

    outer.forEach((s, i) => {
      const a = -Math.PI / 2 + i * angleStep;
      const len = Math.max(2, (s.percent / 100) * maxToothLen);
      const baseHalf = toothAngle / 2;
      const tipHalf = baseHalf * tipRatio;

      const innerR = baseR;
      const outerR = baseR + len;

      // Trapezoidal tooth: 4 corners
      const p1x = cx + Math.cos(a - baseHalf) * innerR;
      const p1y = cy + Math.sin(a - baseHalf) * innerR;
      const p2x = cx + Math.cos(a - tipHalf) * outerR;
      const p2y = cy + Math.sin(a - tipHalf) * outerR;
      const p3x = cx + Math.cos(a + tipHalf) * outerR;
      const p3y = cy + Math.sin(a + tipHalf) * outerR;
      const p4x = cx + Math.cos(a + baseHalf) * innerR;
      const p4y = cy + Math.sin(a + baseHalf) * innerR;

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.lineTo(p3x, p3y);
      ctx.lineTo(p4x, p4y);
      ctx.closePath();
      ctx.fillStyle = colorFor(s.percent);
      ctx.fill();

      // label tick
      const lx = cx + Math.cos(a) * (baseR + maxToothLen + 18);
      const ly = cy + Math.sin(a) * (baseR + maxToothLen + 18);
      ctx.fillStyle = "#aaa";
      ctx.font = "10px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${s.percent}%`, lx, ly);
    });

    // Hub
    const hubR = baseR * 0.62;
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.fillStyle = "#0a0a0a";
    ctx.fill();
    ctx.strokeStyle = hub ? colorFor(hub.percent) : "#ff6600";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hub text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px 'Syne', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${hub?.percent ?? 0}%`, cx, cy - 6);
    ctx.fillStyle = "#aaa";
    ctx.font = "9px 'DM Mono', monospace";
    ctx.fillText("TRANSFORMAÇÃO", cx, cy + 16);
  }, [scores, size]);

  return <canvas ref={ref} className="block mx-auto" />;
}
