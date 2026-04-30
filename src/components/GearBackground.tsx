/**
 * Tecno-modern gear background — pure SVG, animated rotation.
 * Two interlocking gears with metallic radial gradient, circuit lines,
 * specular highlights and cyan glow.
 *
 * Usage:
 *   <GearBackground className="absolute inset-0 -z-10 opacity-[0.08]" />
 */
type Props = {
  className?: string;
  primaryOpacity?: number;
  secondaryOpacity?: number;
  showSecondary?: boolean;
  spin?: boolean;
};

function Gear({
  teeth = 18,
  innerR = 60,
  outerR = 92,
  toothH = 14,
  hubR = 26,
  spokes = 6,
  spinClass,
  reverseSpin,
}: {
  teeth?: number;
  innerR?: number;
  outerR?: number;
  toothH?: number;
  hubR?: number;
  spokes?: number;
  spinClass?: string;
  reverseSpin?: boolean;
}) {
  // Build involute-ish trapezoidal teeth as a single path
  const step = (Math.PI * 2) / teeth;
  const baseHalf = step * 0.34;
  const tipHalf = step * 0.20;
  const baseR = innerR;
  const tipR = innerR + toothH;
  const cmds: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2;
    const p1 = [Math.cos(a - baseHalf) * baseR, Math.sin(a - baseHalf) * baseR];
    const p2 = [Math.cos(a - tipHalf) * tipR, Math.sin(a - tipHalf) * tipR];
    const p3 = [Math.cos(a + tipHalf) * tipR, Math.sin(a + tipHalf) * tipR];
    const p4 = [Math.cos(a + baseHalf) * baseR, Math.sin(a + baseHalf) * baseR];
    cmds.push(
      `${i === 0 ? "M" : "L"}${p1[0].toFixed(2)},${p1[1].toFixed(2)}`,
      `L${p2[0].toFixed(2)},${p2[1].toFixed(2)}`,
      `L${p3[0].toFixed(2)},${p3[1].toFixed(2)}`,
      `L${p4[0].toFixed(2)},${p4[1].toFixed(2)}`,
    );
  }
  cmds.push("Z");
  const teethPath = cmds.join(" ");

  // Spokes connecting hub to inner ring
  const spokeRects = Array.from({ length: spokes }).map((_, i) => {
    const a = (i * 360) / spokes;
    return (
      <rect
        key={i}
        x={-4}
        y={-(innerR - 4)}
        width={8}
        height={innerR - hubR - 4}
        rx={2}
        fill="url(#metalGrad)"
        stroke="rgba(0,201,200,0.4)"
        strokeWidth={0.6}
        transform={`rotate(${a})`}
      />
    );
  });

  // Circuit nodes on outer ring
  const nodes = Array.from({ length: teeth }).map((_, i) => {
    const a = i * step - Math.PI / 2;
    const r = tipR + 6;
    return (
      <circle
        key={i}
        cx={Math.cos(a) * r}
        cy={Math.sin(a) * r}
        r={1.2}
        fill="#D4A843"
      />
    );
  });

  return (
    <g
      className={spinClass}
      style={{
        transformOrigin: "center",
        transformBox: "fill-box",
        animationDirection: reverseSpin ? "reverse" : undefined,
      }}
    >
      {/* outer glow ring */}
      <circle cx={0} cy={0} r={tipR + 3} fill="none" stroke="rgba(0,201,200,0.15)" strokeWidth={1} />

      {/* teeth body */}
      <path
        d={teethPath}
        fill="url(#metalGrad)"
        stroke="rgba(0,201,200,0.55)"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {/* inner ring (body of gear) */}
      <circle cx={0} cy={0} r={baseR - 4} fill="url(#metalGradInner)" stroke="rgba(0,201,200,0.35)" strokeWidth={0.6} />

      {/* spokes */}
      <g>{spokeRects}</g>

      {/* hub */}
      <circle cx={0} cy={0} r={hubR} fill="url(#hubGrad)" stroke="rgba(0,201,200,0.7)" strokeWidth={1} />
      {/* hex bore */}
      <polygon
        points={Array.from({ length: 6 })
          .map((_, i) => {
            const a = (i * Math.PI) / 3 - Math.PI / 2;
            return `${(Math.cos(a) * hubR * 0.45).toFixed(2)},${(Math.sin(a) * hubR * 0.45).toFixed(2)}`;
          })
          .join(" ")}
        fill="#0B1629"
        stroke="rgba(0,201,200,0.6)"
        strokeWidth={0.8}
      />

      {/* specular highlight on top teeth */}
      <path
        d={teethPath}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={0.6}
        strokeDasharray="2 6"
      />

      {/* circuit nodes */}
      <g>{nodes}</g>
    </g>
  );
}

export function GearBackground({
  className = "",
  primaryOpacity = 0.09,
  secondaryOpacity = 0.07,
  showSecondary = true,
  spin = true,
}: Props) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="-200 -160 400 320"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 28px rgba(0,201,200,0.35))" }}
      >
        <defs>
          <radialGradient id="metalGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7be9e8" />
            <stop offset="35%" stopColor="#00C9C8" />
            <stop offset="100%" stopColor="#1a2a4a" />
          </radialGradient>
          <radialGradient id="metalGradInner" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#2a4a7a" />
            <stop offset="100%" stopColor="#0f1f38" />
          </radialGradient>
          <radialGradient id="hubGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#D4A843" />
            <stop offset="60%" stopColor="#9a7a2a" />
            <stop offset="100%" stopColor="#1a2a4a" />
          </radialGradient>
        </defs>

        <g style={{ opacity: primaryOpacity }}>
          <g transform="translate(-30 0)">
            <Gear teeth={18} innerR={70} outerR={100} toothH={16} hubR={28} spokes={6} spinClass={spin ? "spin-slow" : undefined} />
          </g>
        </g>

        {showSecondary && (
          <g style={{ opacity: secondaryOpacity }}>
            <g transform="translate(110 -80)">
              <Gear teeth={14} innerR={42} outerR={62} toothH={11} hubR={16} spokes={5} spinClass={spin ? "spin-slow-reverse" : undefined} reverseSpin />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
