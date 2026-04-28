import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";

export function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo compact />
        {showCta && (
          <Link
            to="/diagnostico"
            className="font-mono text-[11px] uppercase tracking-wider text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Iniciar diagnóstico →
          </Link>
        )}
      </div>
    </header>
  );
}
