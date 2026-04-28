import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { DiagnosticProvider } from "@/state/diagnosticContext";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-display text-7xl text-primary">404</h1>
        <p className="font-mono text-sm text-secondary-fg mt-4">Rota não encontrada.</p>
        <a href="/" className="inline-block mt-6 font-mono text-xs text-primary border border-primary px-4 py-2">Voltar ao início</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diagnóstico NEURA Corporativo · Comunicação que vira comportamento" },
      { name: "description", content: "Diagnóstico corporativo gratuito em 9 dimensões. Identifique gaps de comunicação e comportamento que comprometem performance organizacional." },
      { name: "author", content: "NEURA · Paulinho Siqueira" },
      { property: "og:title", content: "Diagnóstico NEURA Corporativo" },
      { property: "og:description", content: "9 dimensões. 45 perguntas. Relatório individual em ~12 minutos." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (
    <DiagnosticProvider>
      <Outlet />
    </DiagnosticProvider>
  ),
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
