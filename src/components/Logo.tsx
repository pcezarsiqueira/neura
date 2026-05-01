import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3 group">
      {/* tiny gear glyph */}
      <svg width="22" height="22" viewBox="-12 -12 24 24" aria-hidden>
        <defs>
          <linearGradient id="lg-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7be9e8" />
            <stop offset="100%" stopColor="#009998" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 10;
          const x1 = Math.cos(a) * 7;
          const y1 = Math.sin(a) * 7;
          const x2 = Math.cos(a) * 10;
          const y2 = Math.sin(a) * 10;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lg-cyan)" strokeWidth={2.2} strokeLinecap="round" />;
        })}
        <circle cx={0} cy={0} r={6} fill="#0B1629" stroke="url(#lg-cyan)" strokeWidth={1.4} />
        <circle cx={0} cy={0} r={2} fill="#D4A843" />
      </svg>
      <div className="leading-none">
        <span className="block font-bebas text-foreground tracking-[0.18em] text-xl">NEURA</span>
        {!compact && (
          <span className="block uppercase-label text-secondary-fg mt-1" style={{ color: "rgba(248,246,242,0.55)" }}>
            Diagnóstico Corporativo
          </span>
        )}
      </div>
    </Link>
  );
}
