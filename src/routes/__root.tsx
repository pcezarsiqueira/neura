import { Outlet, createRootRoute } from "@tanstack/react-router";
import { DiagnosticProvider } from "@/state/diagnosticContext";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-foreground">
      <div className="text-center">
        <h1 className="font-bebas text-8xl text-cyan-gradient">404</h1>
        <p className="uppercase-label mt-4" style={{ color: "rgba(248,246,242,0.55)" }}>Rota não encontrada</p>
        <a href="/" className="btn-ghost inline-block mt-8 text-[10px]">Voltar ao início</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <DiagnosticProvider>
      <Outlet />
    </DiagnosticProvider>
  ),
  notFoundComponent: NotFound,
});
