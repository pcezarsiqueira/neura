import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex flex-col leading-none group">
      <span className="font-display font-extrabold text-primary tracking-tight text-2xl">
        NEURA
      </span>
      <span className="block h-px w-10 bg-primary mt-1 mb-1" />
      {!compact && (
        <span className="font-mono text-[10px] text-secondary-fg tracking-tight">
          Comunicação que vira comportamento
        </span>
      )}
    </Link>
  );
}
