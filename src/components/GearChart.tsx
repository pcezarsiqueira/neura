import type { DimensionScore } from "@/state/diagnosticContext";

function colorFor(percent: number) {
  if (percent >= 70) return "#00C9C8";       // cyan
  if (percent >= 40) return "#D4A843";       // gold
  return "#C084FC";                          // purple (low)
}

/**
 * Result gear: SVG vector. Outer 8 dimensions are trapezoidal teeth whose
 * length encodes the score. The hub shows the central "transformação"
 * dimension. Stylistic alignment with the tecno-modern brand gear.
 */
export function GearChart({ scores, size = 420 }: { scores: DimensionScore[]; size?: number }) {
  const vb = 240;
  const cx = 0;
  const cy = 0;

  const outer = scores.filter((s) => s.key !== "transformacao");
  const hub = scores.find((s) => s.key === "transformacao");
  const teeth = outer.length;
  const step = (Math.PI * 2) / teeth;
  const baseR = vb * 0.22;
  const maxLen = vb * 0.18;
  const baseHalf = step * 0.32;
  const tipHalf = step * 0.20;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`-${vb / 2} -${vb / 2} ${vb} ${vb}`}
        width={size}
        height={size}
        style={{ filter: "drop-shadow(0 0 30px rgba(0,201,200,0.28))" }}
      >
        <defs>
          <radialGradient id="hubR" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1f3a66" />
            <stop offset="100%" stopColor="#0B1629" />
          </radialGradient>
          <linearGradient id="ringL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00C9C8" />
            <stop offset="100%" stopColor="#D4A843" />
          </linearGradient>
        </defs>

        {/* base ring */}
        <circle cx={cx} cy={cy} r={baseR} fill="none" stroke="rgba(0,201,200,0.18)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={baseR + maxLen + 10} fill="none" stroke="rgba(0,201,200,0.08)" strokeWidth={1} strokeDasharray="2 6" />

        {/* teeth */}
        {outer.map((s, i) => {
          const a = -Math.PI / 2 + i * step;
          const len = Math.max(3, (s.percent / 100) * maxLen);
          const innerR = baseR;
          const outerR = baseR + len;
          const p1 = [Math.cos(a - baseHalf) * innerR, Math.sin(a - baseHalf) * innerR];
          const p2 = [Math.cos(a - tipHalf) * outerR, Math.sin(a - tipHalf) * outerR];
          const p3 = [Math.cos(a + tipHalf) * outerR, Math.sin(a + tipHalf) * outerR];
          const p4 = [Math.cos(a + baseHalf) * innerR, Math.sin(a + baseHalf) * innerR];
          const d = `M${p1[0]},${p1[1]} L${p2[0]},${p2[1]} L${p3[0]},${p3[1]} L${p4[0]},${p4[1]} Z`;
          const c = colorFor(s.percent);
          const lx = Math.cos(a) * (baseR + maxLen + 18);
          const ly = Math.sin(a) * (baseR + maxLen + 18);
          return (
            <g key={s.key}>
              <path d={d} fill={c} fillOpacity={0.85} stroke={c} strokeWidth={0.8} strokeLinejoin="round" />
              {/* gold node at tip */}
              <circle cx={Math.cos(a) * (outerR + 2)} cy={Math.sin(a) * (outerR + 2)} r={1.4} fill="#D4A843" />
              <text
                x={lx}
                y={ly}
                fill="rgba(248,246,242,0.7)"
                fontSize={9}
                fontFamily="Outfit, sans-serif"
                fontWeight={500}
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing={1.2}
              >
                {s.percent}%
              </text>
            </g>
          );
        })}

        {/* hub */}
        <circle cx={cx} cy={cy} r={baseR * 0.66} fill="url(#hubR)" stroke="url(#ringL)" strokeWidth={1.4} />
        <text x={0} y={-4} textAnchor="middle" fill="#f8f6f2" fontFamily="Bebas Neue, sans-serif" fontSize={26}>
          {hub?.percent ?? 0}%
        </text>
        <text x={0} y={12} textAnchor="middle" fill="rgba(248,246,242,0.55)" fontFamily="Outfit, sans-serif" fontSize={7} letterSpacing={2}>
          TRANSFORMAÇÃO
        </text>
      </svg>
    </div>
  );
}
