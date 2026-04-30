import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";

export function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b"
      style={{
        background: "rgba(11,22,41,0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderColor: "rgba(0,201,200,0.13)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo compact />
        {showCta && (
          <Link to="/diagnostico" className="btn-ghost text-[10px]">
            Iniciar diagnóstico →
          </Link>
        )}
      </div>
    </header>
  );
}
