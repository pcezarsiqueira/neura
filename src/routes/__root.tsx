import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diagnóstico NEURA Corporativo · Comunicação que vira comportamento" },
      { name: "description", content: "Diagnóstico corporativo gratuito em 9 dimensões. Identifique gaps de comunicação e comportamento que comprometem performance organizacional." },
      { name: "author", content: "NEURA · Paulinho Siqueira" },
      { property: "og:title", content: "Diagnóstico NEURA Corporativo · Comunicação que vira comportamento" },
      { property: "og:description", content: "Diagnóstico corporativo gratuito em 9 dimensões. Identifique gaps de comunicação e comportamento que comprometem performance organizacional." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Diagnóstico NEURA Corporativo · Comunicação que vira comportamento" },
      { name: "twitter:description", content: "Diagnóstico corporativo gratuito em 9 dimensões. Identifique gaps de comunicação e comportamento que comprometem performance organizacional." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ec452b2f-c76a-4ac9-8b89-b07c75fa0565/id-preview-3e6580a5--55ac49dd-e279-4292-a67c-6b17f5e126df.lovable.app-1777397673367.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ec452b2f-c76a-4ac9-8b89-b07c75fa0565/id-preview-3e6580a5--55ac49dd-e279-4292-a67c-6b17f5e126df.lovable.app-1777397673367.png" },
      { name: "twitter:card", content: "summary_large_image" },
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
